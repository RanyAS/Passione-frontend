import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { MeshitimeColors } from '@/theme/meshitime-theme';
import type { ToastMessage } from '../types/meshitime';

interface ToastContextValue {
  showToast: (text: string, type?: ToastMessage['type']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(18));

  const showToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToast({ id, text, type });
    opacity.setValue(0);
    translateY.setValue(18);

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 18, duration: 200, useNativeDriver: true }),
        ]).start(() => setToast((current) => (current?.id === id ? null : current)));
      }, 1800);
    });
  }, [opacity, translateY]);

  const value = useMemo(() => ({ showToast }), [showToast]);
  const toastBackground =
    toast?.type === 'success'
      ? MeshitimeColors.success
      : toast?.type === 'error'
        ? MeshitimeColors.primary
        : MeshitimeColors.secondary;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toastWrapper,
            { opacity, transform: [{ translateY }] },
          ]}>
          <View style={[styles.toast, { backgroundColor: toastBackground }]}>
            <Text style={styles.toastText}>{toast.text}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 36,
    alignItems: 'center',
  },
  toast: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
