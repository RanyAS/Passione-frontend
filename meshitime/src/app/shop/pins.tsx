import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStorePins, updateStorePin } from "@/api/StorePinApi";
import { DEMO_STORE_ID } from "@/constants/session";
import type { StorePin } from "@/types/StorePin";
import { shopStyles as styles } from "../../styles/shop.styles";

export default function ShopPinsScreen() {
  const insets = useSafeAreaInsets();
  const [pins, setPins] = useState<StorePin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStorePins(DEMO_STORE_ID);
      setPins(data);
    } catch {
      setPins([]);
      setError("オファーの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPins();
  }, [loadPins]);

  const activeCount = useMemo(
    () => pins.filter((pin) => pin.isActive).length,
    [pins]
  );

  const toggleActive = async (pin: StorePin) => {
    try {
      const updated = await updateStorePin(pin.id, { isActive: !pin.isActive });
      setPins((prev) => prev.map((row) => (row.id === pin.id ? updated : row)));
    } catch {
      Alert.alert("エラー", "ステータスの更新に失敗しました");
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>オファー管理</Text>
          <Text style={styles.subtitle}>
            有効なオファー {activeCount} 件 / 合計 {pins.length} 件
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("./shop")}
          >
            <Text style={styles.secondaryButtonText}>ホームへ</Text>
          </Pressable>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/shop/MenuRegister")}
          >
            <Text style={styles.primaryButtonText}>新規作成</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{error}</Text>
            <Pressable
              style={[styles.primaryButton, { marginTop: 16, flex: 0 }]}
              onPress={() => void loadPins()}
            >
              <Text style={styles.primaryButtonText}>再試行</Text>
            </Pressable>
          </View>
        ) : pins.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="pricetag-outline" size={28} color="#9CA3AF" />
            <Text style={styles.emptyText}>まだオファーがありません</Text>
            <Pressable
              style={[styles.primaryButton, { marginTop: 16, flex: 0 }]}
              onPress={() => router.push("/shop/MenuRegister")}
            >
              <Text style={styles.primaryButtonText}>オファーを作成</Text>
            </Pressable>
          </View>
        ) : (
          pins.map((pin) => (
            <View key={pin.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {pin.description ?? pin.rule ?? "オファー"}
              </Text>
              <Text style={styles.cardMeta}>
                {pin.rule ? `${pin.rule} · ` : ""}
                残り{pin.emptySeat}席 · {pin.time ?? "時間未設定"}
              </Text>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badge,
                    pin.isActive ? styles.badgeSuccess : styles.badgeError,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      pin.isActive
                        ? styles.badgeSuccessText
                        : styles.badgeErrorText,
                    ]}
                  >
                    {pin.isActive ? "公開中" : "停止中"}
                  </Text>
                </View>
              </View>
              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => void toggleActive(pin)}
                >
                  <Text style={styles.secondaryButtonText}>
                    {pin.isActive ? "停止する" : "公開する"}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.primaryButton}
                  onPress={() => router.push("/shop/reservations")}
                >
                  <Text style={styles.primaryButtonText}>予約を見る</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => router.push("/shop/MenuRegister")}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
