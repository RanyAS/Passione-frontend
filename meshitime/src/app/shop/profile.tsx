import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shopStyles as styles } from "../../styles/shop.styles";

export default function ShopProfileScreen() {
  const insets = useSafeAreaInsets();
  const [shopName, setShopName] = useState("らーめん横丁");
  const [address, setAddress] = useState("東京都新宿区歌舞伎町1-1");
  const [tel, setTel] = useState("03-1234-5678");
  const [openTime, setOpenTime] = useState("11:00-22:00");
  const [site, setSite] = useState("https://example.com");

  const handleSave = () => {
    Alert.alert("保存完了", "店舗情報を更新しました（デモ）。");
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>店舗プロフィール</Text>
          <Text style={styles.subtitle}>顧客アプリに表示される情報</Text>
        </View>

        <Text style={styles.label}>店舗名</Text>
        <TextInput
          style={styles.input}
          value={shopName}
          onChangeText={setShopName}
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>住所</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>電話番号</Text>
        <TextInput
          style={styles.input}
          value={tel}
          onChangeText={setTel}
          keyboardType="phone-pad"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>営業時間</Text>
        <TextInput
          style={styles.input}
          value={openTime}
          onChangeText={setOpenTime}
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>サイトURL</Text>
        <TextInput
          style={styles.input}
          value={site}
          onChangeText={setSite}
          autoCapitalize="none"
          placeholderTextColor="#9CA3AF"
        />

        <Pressable style={styles.primaryButton} onPress={handleSave}>
          <Ionicons name="save-outline" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>保存する</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
