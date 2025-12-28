import { Dimensions, StyleSheet } from 'react-native';
const { height } = Dimensions.get('window');

export const createTaskStyles = (colors, theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text.main },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text.main, marginBottom: 16 },
  
  taskCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, backgroundColor: colors.background.card, borderWidth: theme === 'dark' ? 1 : 0, borderColor: colors.neutral.border },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', backgroundColor: '#FFF', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: colors.status.success, borderColor: colors.status.success },
  taskText: { fontSize: 14, fontWeight: '600', flex: 1 },
  completedText: { textDecorationLine: 'line-through', opacity: 0.6 },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: colors.background.card, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: height * 0.45 },
  handle: { width: 50, height: 5, backgroundColor: colors.neutral.border, borderRadius: 3, alignSelf: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: colors.text.main, textAlign: 'center', marginBottom: 20 },
  input: { backgroundColor: colors.neutral.input, borderRadius: 15, padding: 18, height: 80, color: colors.text.main, fontSize: 16, textAlignVertical: 'top', marginBottom: 20 },
  priorityLabel: { fontSize: 16, fontWeight: '600', color: colors.text.secondary, marginBottom: 15 },
  
  priorityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }, // YAN YANA HİZALAMA
  priorityItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  radio: { width: 22, height: 22, borderRadius: 5, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 2 },
  priorityText: { fontSize: 14, fontWeight: '700' },
  
  addButton: { backgroundColor: colors.primary.main, borderRadius: 15, padding: 18, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 65, height: 65, borderRadius: 33, backgroundColor: colors.secondary.main, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});