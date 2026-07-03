import { StyleSheet } from 'react-native';
import { MeshitimeColors } from '@/theme/meshitime-theme';

 export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: MeshitimeColors.background },
  content: { padding: 16, gap: 14, paddingBottom: 36 },
  heroCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 18,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: MeshitimeColors.text },
  heroSubtitle: { marginTop: 6, color: MeshitimeColors.textMuted, fontSize: 13, lineHeight: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  optionButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MeshitimeColors.border,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButtonActive: { borderColor: MeshitimeColors.primary, backgroundColor: '#FFE4E1' },
  optionLabel: { fontWeight: '800', color: MeshitimeColors.text },
  optionLabelActive: { color: MeshitimeColors.primary },
  optionDetail: { color: MeshitimeColors.textMuted, marginTop: 4, fontSize: 12 },
  optionBadge: { color: MeshitimeColors.textMuted, fontWeight: '700' },
  optionBadgeActive: { color: MeshitimeColors.primary },
  noteBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
  },
  noteText: { color: MeshitimeColors.textMuted, lineHeight: 20 },
  primaryButton: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: MeshitimeColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800' },
});