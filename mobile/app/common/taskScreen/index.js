import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import AddTaskModal from './AddTaskModal';
import { createTaskStyles } from './styles';
import TaskItem from './TaskItem';
import CustomHeader from "../../../components/ui/CustomHeader" 

const TaskScreen = () => {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createTaskStyles(colors, theme), [colors, theme]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([
    { id: '1', title: "Bileklik Sensör Verisi Düşen Personeli İncele...", bg: colors.profile.card1, textColor: colors.profile.text1, priority: 'high', isCompleted: false },
    { id: '2', title: "Gaz Sensörü Uyarısı İçin Alanı Kontrol Et", bg: colors.profile.card2, textColor: colors.profile.text2, priority: 'medium', isCompleted: false },
    { id: '3', title: "Kaygan Zemin Uyarısını Kontrol Et", bg: colors.profile.card4, textColor: colors.profile.text4, priority: 'low', isCompleted: false },
  ]);

  const handleAddTask = (title, priority) => {
    const colorMap = {
      high: { bg: colors.profile.card1, txt: colors.profile.text1 },
      medium: { bg: colors.profile.card2, txt: colors.profile.text2 },
      low: { bg: colors.profile.card4, txt: colors.profile.text4 }
    };

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { 
        ...t, title, priority, 
        bg: colorMap[priority].bg, 
        textColor: colorMap[priority].txt 
      } : t));
      setEditingTask(null);
    } else {
      const newTask = {
        id: Date.now().toString(),
        title,
        priority,
        bg: colorMap[priority].bg,
        textColor: colorMap[priority].txt,
        isCompleted: false
      };
      setTasks([newTask, ...tasks]);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Sil", "Bu görevi silmek istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Sil", onPress: () => setTasks(tasks.filter(t => t.id !== id)), style: "destructive" }
    ]);
  };

  const handleToggle = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
   <CustomHeader title="Görevler" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Aktif Görevler</Text>
        {tasks.filter(t => !t.isCompleted).map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggle={handleToggle} 
            onEdit={openEditModal} 
            onDelete={handleDelete} 
            styles={styles}
            colors={colors} // EKLENDİ: Renkleri prop olarak geçtik
          />
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Tamamlanan Görevler</Text>
        {tasks.filter(t => t.isCompleted).map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggle={handleToggle} 
            styles={styles}
            colors={colors} // EKLENDİ
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => { setEditingTask(null); setModalVisible(true); }}>
        <Ionicons name="add" size={35} color="#FFF" />
      </TouchableOpacity>

      <AddTaskModal 
        visible={modalVisible} 
        onClose={() => { setModalVisible(false); setEditingTask(null); }} 
        onSave={handleAddTask}
        initialData={editingTask}
        styles={styles}
        colors={colors} // EKLENDİ
      />
    </View>
  );
};

export default TaskScreen;