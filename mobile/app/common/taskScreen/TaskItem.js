// app/common/taskScreen/TaskItem.js

import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

const TaskItem = ({ task, onToggle, onEdit, onDelete, styles, colors }) => {
  const [showActions, setShowActions] = useState(false);

  if (!colors || !colors.text) return null;

  const handleLongPress = () => {
    // Sadece tamamlanmamış görevlerde düzenleme menüsü açılır
    if (!task.isCompleted) {
        setShowActions(!showActions);
    }
  };

  return (
    <Pressable 
      onLongPress={handleLongPress} 
      delayLongPress={500} 
      style={({ pressed }) => [
        styles.taskCard, 
        !task.isCompleted && { backgroundColor: task.bg },
        pressed && { opacity: 0.9 },
        showActions && { paddingRight: 8 } 
      ]}
    >
      <View style={[styles.cardLeft, { flex: 1, marginRight: showActions ? 5 : 0 }]}>
        <TouchableOpacity 
          onPress={() => onToggle(task.id)}
          style={[styles.checkbox, task.isCompleted && styles.checkboxChecked]}
        >
          {task.isCompleted && <Ionicons name="checkmark" size={16} color="#FFF" />}
        </TouchableOpacity>
        
        <Text 
          style={[
            styles.taskText, 
            { 
              color: task.isCompleted ? colors.text.secondary : (task.textColor || colors.text.main),
              fontSize: showActions ? 13 : 14 
            },
            task.isCompleted && styles.completedText
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
      </View>
      
      {/* Aksiyon Butonları (Düzenle / Sil) */}
      {!task.isCompleted && showActions && (
        <View style={[styles.actionButtons, { gap: 6, marginLeft: 'auto' }]}>
          <TouchableOpacity 
            onPress={() => {
              onEdit(task);
              setShowActions(false);
            }} 
            style={[styles.actionBtn, { width: 38, height: 38 }]}
          >
            <Feather name="edit-2" size={18} color={colors.text.main} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => {
              onDelete(task.id);
              setShowActions(false);
            }} 
            style={[styles.actionBtn, { width: 38, height: 38 }]}
          >
            <Ionicons name="trash-outline" size={18} color={colors.dashboard.red} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setShowActions(false)} 
            style={{ paddingHorizontal: 4 }}
          >
             <Ionicons name="close-circle" size={24} color={colors.text.secondary} style={{ opacity: 0.8 }} />
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};

export default TaskItem;