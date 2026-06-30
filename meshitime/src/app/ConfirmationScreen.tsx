//import React from 'react';
import { useRouter } from 'expo-router';

//import { ConfirmationScreen } from '@/components/screens/ConfirmationScreen';


import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles as externalStyles } from "../styles/ConfirmationScreenStyle";

//import { usetoast } from '@/providers/toast-provider';
import { MeshitimeColors } from '@/theme/meshitime-theme';
//import { triggerFeedback } from '@/utils/feedback';

interface confirmationScreenProps {
  onGoHome: () => void;
}


export default function Page() {
  const router = useRouter();

  return <ConfirmationScreen onGoHome={() => router.push('/HomeMapScreen')} />;
}
export function ConfirmationScreen({ onGoHome }: confirmationScreenProps) {
  //const toast = usetoast();

  const handleAddDiscount = () => {
    //triggerFeedback('success');
    //toast.show('割引を追加しました', { type: 'success' });
  };  
  
  
  return (
    <SafeAreaView style={externalStyles.safeArea}>
      <ScrollView contentContainerStyle={externalStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={externalStyles.container}>
          <View style={externalStyles.content}>
            <View style={externalStyles.successBubble}>
              <Ionicons name="checkmark" size={52} color="#FFFFFFFF" />
            </View>
            <Text style={externalStyles.title}>予約完了</Text>
            <Text style={externalStyles.message}>予約が確認しました。</Text>
            <Text style={externalStyles.errormessage}>予約が失敗しました。</Text>

            <View style={externalStyles.card}>
            <Text style={externalStyles.restaurant}>らーめん横丁</Text>
            <Text style={externalStyles.restaurantSub}>Ramen Yokocho</Text>

            <View style={externalStyles.row}>
              <View style={externalStyles.rowIconBubble}>
                <Ionicons name="calendar-outline" size={22} color="#4B5563" />
              </View>
              <View style={externalStyles.rowText}>
                <Text style={externalStyles.rowLabel}>日時</Text>
                <Text style={externalStyles.rowValue}>2026年3月15日</Text>
              </View>
            </View>

            <View style={externalStyles.row}>
              <View style={externalStyles.rowIconBubble}>
                <Ionicons name="time-outline" size={22} color="#4B5563" />
              </View>
              <View style={externalStyles.rowText}>
                <Text style={externalStyles.rowLabel}>時間</Text>
                <Text style={externalStyles.rowValue}>19:00</Text>
              </View>
            </View>

            <View style={externalStyles.row}>
              <View style={externalStyles.rowIconBubble}>
                <Ionicons name="people-outline" size={22} color="#4B5563" />
              </View>
              <View style={externalStyles.rowText}>
                <Text style={externalStyles.rowLabel}>人数</Text>
                <Text style={externalStyles.rowValue}>2名</Text>
              </View>
            </View>

            <View style={[externalStyles.row, externalStyles.lastRow]}>
              <View style={externalStyles.rowIconBubble}>
                <Ionicons name="location-outline" size={22} color="#4B5563" />
              </View>
              <View style={externalStyles.rowText}>
                <Text style={externalStyles.rowLabel}>場所</Text>
                <Text style={externalStyles.rowValue}>東京都新宿区歌舞伎町1-1</Text>
              </View>
            </View>

            <View style={externalStyles.discountWrap}>
              <View>
                <Text style={externalStyles.discountTitle}>割引</Text>
                <Text style={externalStyles.discountSubtitle}>30% OFF</Text>
              </View>
              <View style={externalStyles.discountPriceWrap}>
                <Text style={externalStyles.discountOriginal}>¥890</Text>
                <Text style={externalStyles.discountFinal}>¥620</Text>
              </View>
            </View>

            <View style={externalStyles.qrBox}>
              <Text style={externalStyles.qrLabel}>割引QRコード</Text>
            </View>
            <View style={externalStyles.discountNum}>
              <Text style={externalStyles.discountCodeLabel}>割引コード</Text>
            </View>
            <Text style={externalStyles.qrId}>ID: MESH-2024-A7B3</Text>
          </View>
          <Pressable style={externalStyles.mainButton} onPress={handleAddDiscount}>
            <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" style={externalStyles.mainButtonIcon} />
            <Text style={externalStyles.mainButtonText}>クーポンを使用する</Text>
          </Pressable>
          <Pressable style={externalStyles.linkButton} onPress={onGoHome}>
            <Ionicons name="home-outline" size={16} color={MeshitimeColors.textMuted} style={externalStyles.linkIcon} />
            <Text style={externalStyles.linkButtonText}>ホームへ戻る</Text>
          </Pressable>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
