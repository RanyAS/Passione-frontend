import { StyleSheet } from "react-native"
import { MeshitimeColors } from '../theme/meshitime-theme';

export const styles=StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  emojiBubble: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: MeshitimeColors.border,
  },
  emoji: {
    fontSize: 44,
    opacity: 0.55,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: MeshitimeColors.text,
    marginBottom: 8,
  },
  description: {
    color: MeshitimeColors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: MeshitimeColors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});