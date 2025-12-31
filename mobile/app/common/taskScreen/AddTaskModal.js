// app/common/taskScreen/AddTaskModal.js

import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AddTaskModal = ({ visible, onClose, onSave, styles, initialData, colors }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [priority, setPriority] = useState('high');

  // Modal açıldığında veya düzenlenecek veri geldiğinde alanları doldur
  useEffect(() => {
    if (initialData) {
      setTaskTitle(initialData.title);
      setPriority(initialData.priority || 'high');
    } else {
      setTaskTitle('');
      setPriority('high');
    }
  }, [initialData, visible]);

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ width: '100%' }}
        >
          <Pressable style={styles.bottomSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>{initialData ? 'Görevi Düzenle' : 'Yeni görev ekleyin'}</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Görev açıklaması..." 
              placeholderTextColor={colors.text.secondary}
              value={taskTitle}
              onChangeText={setTaskTitle}
              multiline
            />

            <Text style={styles.priorityLabel}>Aciliyet Durumu</Text>
            <View style={styles.priorityRow}>
              {[
                { id: 'high', label: 'Yüksek', color: colors.profile.text1 },
                { id: 'medium', label: 'Orta', color: colors.profile.text2 },
                { id: 'low', label: 'Düşük', color: colors.profile.text4 }
              ].map((p) => (
                <TouchableOpacity key={p.id} onPress={() => setPriority(p.id)} style={styles.priorityItem}>
                  <View style={[styles.radio, { borderColor: p.color }]}>
                    {priority === p.id && <View style={[styles.radioInner, { backgroundColor: p.color }]} />}
                  </View>
                  <Text style={[styles.priorityText, { color: p.color }]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => {
                if(taskTitle.trim()){
                  onSave(taskTitle, priority);
                  // onClose(); // Bunu siliyoruz çünkü onSave içinde işlem bitince kapatıyoruz
                }
              }}
            >
              <Text style={styles.addButtonText}>{initialData ? 'Güncelle' : 'Görevi Ekle'}</Text>
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default AddTaskModal;