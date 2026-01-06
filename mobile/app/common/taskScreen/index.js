// app/common/taskScreen/index.js

import React, { useMemo, useState, useCallback } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import AddTaskModal from './AddTaskModal';
import { createTaskStyles } from './styles';
import TaskItem from './TaskItem';
import CustomHeader from "../../../components/ui/CustomHeader";
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from 'expo-router';

// API URL (Login sayfasında kullandığınla aynı olmalı)
const API_BASE_URL = "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";

export default function TaskScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createTaskStyles(colors, theme), [colors, theme]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. LİSTELEME (GET) ---
  const fetchTasks = async () => {
    try {
      if (tasks.length === 0) setIsLoading(true);
      
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/assignments`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const result = await response.json();
      if (result.isSuccess) {
        const formattedTasks = result.data.map(item => ({
          id: item.id,
          title: item.description,
          priority: mapSeverityToString(item.severity), 
          isCompleted: item.status === 1, // 3: Completed
          statusValue: item.status, // Orijinal status değerini sakla (0,1,2,3)
          ...getColorBySeverity(item.severity, colors)
        }));
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error("Fetch Tasks Error:", error);
      Alert.alert("Hata", "Görevler yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  // --- 2. GÖREV EKLE / GÜNCELLE (POST / PUT) ---
  const handleSaveTask = async (description, priorityString) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const severity = mapStringToSeverity(priorityString);

      if (editingTask) {
        // GÜNCELLEME (PUT) - ARTIK STATUS DE GİDİYOR
        const payload = {
            description: description,
            severity: severity,
            // Mevcut status değerini koruyarak gönderiyoruz.
            // Eğer tamamlanmışsa 3, değilse 0 (veya eski status neyse o)
            status: editingTask.statusValue !== undefined ? editingTask.statusValue : (editingTask.isCompleted ? 3 : 0)
        };

        const response = await fetch(`${API_BASE_URL}/api/assignments/${editingTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.isSuccess) {
          fetchTasks(); // Listeyi yenile
          setModalVisible(false);
          setEditingTask(null);
        } else {
          Alert.alert("Hata", result.message || "Güncelleme başarısız.");
        }

      } else {
        // EKLEME (POST) - ARTIK STATUS DE GİDİYOR
        const payload = {
            description: description,
            severity: severity,
            status: 0 // Yeni eklenen görev varsayılan olarak "Pending (0)" olur
        };

        const response = await fetch(`${API_BASE_URL}/api/assignments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.isSuccess) {
          fetchTasks(); // Listeyi yenile
          setModalVisible(false);
        } else {
          Alert.alert("Hata", result.message || "Ekleme başarısız.");
        }
      }
    } catch (error) {
      console.error("Save Task Error:", error);
      Alert.alert("Hata", "İşlem gerçekleştirilemedi.");
    }
  };

  // --- 3. GÖREV SİLME (DELETE) ---
  const handleDelete = (id) => {
    Alert.alert("Sil", "Bu görevi silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { 
        text: "Sil", 
        style: "destructive",
        onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync("accessToken");
            const response = await fetch(`${API_BASE_URL}/api/assignments/${id}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${token}` }
            });
            
            const result = await response.json();
            if (result.isSuccess) {
              setTasks(prev => prev.filter(t => t.id !== id));
            } else {
              Alert.alert("Hata", "Silme işlemi başarısız.");
            }
          } catch (error) {
            console.error("Delete Error:", error);
          }
        } 
      }
    ]);
  };

 const handleToggle = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newIsCompleted = !task.isCompleted;
    
    // DÜZELTME: Completed artık 1, Pending 0
    const newStatus = newIsCompleted ? 1 : 0; 
    
    // Optimistic Update
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: newIsCompleted } : t));

    try {
        const token = await SecureStore.getItemAsync("accessToken");
        const severity = mapStringToSeverity(task.priority);

        const response = await fetch(`${API_BASE_URL}/api/assignments/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                description: task.title,
                severity: severity,
                status: newStatus // 0 veya 1 gidiyor
            })
        });

        if (!response.ok) {
            throw new Error("API Error");
        }
    } catch (error) {
        console.error("Toggle Error:", error);
        Alert.alert("Hata", "Durum güncellenemedi.");
        setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !newIsCompleted } : t));
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  // --- YARDIMCI FONKSİYONLAR ---
  
  const mapSeverityToString = (severity) => {
    if (severity === 2) return 'high';
    if (severity === 1) return 'medium';
    return 'low';
  };

  const mapStringToSeverity = (str) => {
    if (str === 'high') return 2;
    if (str === 'medium') return 1;
    return 0;
  };

  const getColorBySeverity = (severity, colors) => {
    if (severity === 2) return { bg: colors.profile.card1, textColor: colors.profile.text1 }; // High
    if (severity === 1) return { bg: colors.profile.card2, textColor: colors.profile.text2 }; // Medium
    return { bg: colors.profile.card4, textColor: colors.profile.text4 }; // Low
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Görevler" />
      
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Aktif Görevler</Text>
          
          {tasks.filter(t => !t.isCompleted).length === 0 && (
             <Text style={{color: colors.text.secondary, marginLeft: 5, marginBottom: 10, fontStyle: 'italic'}}>
               Aktif görev bulunmuyor.
             </Text>
          )}

          {tasks.filter(t => !t.isCompleted).map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={handleToggle} 
              onEdit={openEditModal} 
              onDelete={handleDelete} 
              styles={styles}
              colors={colors}
            />
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Tamamlanan Görevler</Text>
          {tasks.filter(t => t.isCompleted).map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={handleToggle} 
              styles={styles}
              colors={colors}
            />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => { setEditingTask(null); setModalVisible(true); }}>
        <Ionicons name="add" size={35} color="#FFF" />
      </TouchableOpacity>

      <AddTaskModal 
        visible={modalVisible} 
        onClose={() => { setModalVisible(false); setEditingTask(null); }} 
        onSave={handleSaveTask}
        initialData={editingTask}
        styles={styles}
        colors={colors}
      />
    </View>
  );
};