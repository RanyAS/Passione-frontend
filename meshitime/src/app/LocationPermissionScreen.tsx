import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMeshitime } from '../../provider/meshitime-provider';
import { useToast } from '../../provider/toast-provider';
import { MeshitimeColors } from '@/theme/meshitime-theme';
import { styles } from '../styles/LocationPermissionScreen';

type PermissionChoice = 'allowed' | 'manual' | 'denied';

export function LocationPermissionScreen() {
  const router = useRouter();
  const { appSettings, updateAppSettings } = useMeshitime();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<PermissionChoice>(appSettings.locationPermission);

  const helperText = useMemo(() => {
    if (selected === 'allowed') {
      return '近くのおすすめを自動で表示します。';
    }
    if (selected === 'manual') {
      return '市区町村を手動で設定できます。';
    }
    return '位置情報の利用をオフにできます。';
  }, [selected]);

  const handleContinue = () => {
    updateAppSettings({ locationPermission: selected });
    showToast('位置情報設定を更新しました', 'success');
    //router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>位置情報の利用</Text>
          <Text style={styles.heroSubtitle}>近くのお得情報を見つけるために、位置情報の設定を選んでください。</Text>
        </View>

        <View style={styles.card}>
          <OptionButton
            label="許可する"
            detail="近くのおすすめを自動で表示"
            active={selected === 'allowed'}
            onPress={() => setSelected('allowed')}
          />
          <OptionButton
            label="手動で設定"
            detail="都市名を使って検索"
            active={selected === 'manual'}
            onPress={() => setSelected('manual')}
          />
          <OptionButton
            label="今はしない"
            detail="プライバシー優先"
            active={selected === 'denied'}
            onPress={() => setSelected('denied')}
          />
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{helperText}</Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>設定を保存</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function OptionButton({
  label,
  detail,
  active,
  onPress,
}: {
  label: string;
  detail: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.optionButton, active && styles.optionButtonActive]}
      onPress={onPress}>
      <View>
        <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{label}</Text>
        <Text style={styles.optionDetail}>{detail}</Text>
      </View>
      <Text style={[styles.optionBadge, active && styles.optionBadgeActive]}>{active ? '選択中' : '選ぶ'}</Text>
    </Pressable>
  );
}

export default LocationPermissionScreen;
