import { StyleSheet } from 'react-native';

const ACCENT = '#F03E2F'; // red used for active dot + CTA

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Skip ──
  skipButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  skipText: {
    fontSize: 14,
    color: '#888888',
  },

  // ── FlatList ──
  flatList: {
    flexGrow: 1,
    alignSelf: 'stretch',
  },

  // ── Slide ──
  slide: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 16,
  },

  illustrationCircle: {
   width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  // TODO: set appropriate dimensions for your actual image assets
  // image: { width: 120, height: 120, resizeMode: 'contain' },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Dots ──
  dotsRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: ACCENT,
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#DDDDDD',
  },

  // ── Buttons ──
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
    width: '100%',
  },
  backButton: {
    flex: 1,
    height: 52,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: 28,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonFull: {
    flex: 1,
    width: '100%',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});

