import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStoreById } from "@/api/storeApi";
import { supabase } from "@/lib/supabase";
import type { Store } from "@/types/Store";
import { MeshitimeColors } from "@/theme/meshitime-theme";
import { shopStyles as styles } from "../../styles/shop.styles";

function InfoRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string | number | null;
  onPress?: () => void;
}) {
  const display =
    value === null || value === undefined || value === ""
      ? "未設定"
      : String(value);

  return (
    <Pressable
      style={[styles.card, { marginBottom: 10 }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={icon} size={18} color={MeshitimeColors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.cardTitle, { fontSize: 15, marginTop: -2 }]}>
            {display}
          </Text>
        </View>
        {onPress ? (
          <Ionicons name="open-outline" size={18} color="#9CA3AF" />
        ) : null}
      </View>
    </Pressable>
  );
}

export default function ShopProfileScreen() {
  const insets = useSafeAreaInsets();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStore = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const storeId = session?.user.id;

      if (!storeId) throw new Error("店舗情報の取得失敗！");

      const data = await getStoreById(storeId);
      setStore(data);
    } catch {
      setStore(null);
      setError("店舗情報の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStore();
  }, [loadStore]);

  const openSite = () => {
    if (!store?.site) return;
    const url = store.site.startsWith("http")
      ? store.site
      : `https://${store.site}`;
    void Linking.openURL(url);
  };

  const callStore = () => {
    if (!store?.tel) return;
    void Linking.openURL(`tel:${store.tel}`);
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>店舗ダッシュボード</Text>
          <Text style={styles.subtitle}>登録済みの店舗情報を確認</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : error || !store ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {error ?? "店舗情報が見つかりません"}
            </Text>
            <Pressable
              style={[styles.primaryButton, { marginTop: 16, flex: 0 }]}
              onPress={() => void loadStore()}
            >
              <Text style={styles.primaryButtonText}>再試行</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={[styles.card, { padding: 0, overflow: "hidden" }]}>
              {store.image_path ? (
                <Image
                  source={{ uri: store.image_path }}
                  style={{ width: "100%", height: 160 }}
                  contentFit="cover"
                />
              ) : (
                <View
                  style={{
                    height: 120,
                    backgroundColor: "#FEE2E2",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={40}
                    color={MeshitimeColors.primary}
                  />
                </View>
              )}

              <View style={{ padding: 16 }}>
                <Text style={[styles.title, { fontSize: 22 }]}>
                  {store.sname || "店舗名未設定"}
                </Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, styles.badgeActive]}>
                    <Text style={[styles.badgeText, styles.badgeActiveText]}>
                      ★ {store.star ?? "-"}
                    </Text>
                  </View>
                  <View style={[styles.badge, styles.badgeSuccess]}>
                    <Text style={[styles.badgeText, styles.badgeSuccessText]}>
                      公開中
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>基本情報</Text>
            <InfoRow icon="mail-outline" label="メール" value={store.email} />
            <InfoRow
              icon="location-outline"
              label="住所"
              value={store.address}
            />
            <InfoRow
              icon="call-outline"
              label="電話番号"
              value={store.tel}
              onPress={store.tel ? callStore : undefined}
            />
            <InfoRow
              icon="time-outline"
              label="営業時間"
              value={store.open_time}
            />
            <InfoRow
              icon="globe-outline"
              label="サイト"
              value={store.site}
              onPress={store.site ? openSite : undefined}
            />

            <Text style={styles.sectionTitle}>地図座標</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>緯度</Text>
                <Text style={[styles.statValue, { fontSize: 16 }]}>
                  {store.latitude ?? "-"}
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>経度</Text>
                <Text style={[styles.statValue, { fontSize: 16 }]}>
                  {store.longitude ?? "-"}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>クイックアクション</Text>
            <View style={styles.actionsRow}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => router.push("/shop/pins")}
              >
                <Ionicons name="pricetag-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>オファー</Text>
              </Pressable>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => router.push("/shop/reservations")}
              >
                <Ionicons name="calendar-outline" size={18} color="#111827" />
                <Text style={styles.secondaryButtonText}>予約</Text>
              </Pressable>
            </View>

            <View style={[styles.actionsRow, { marginTop: 10 }]}>
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

            <Pressable
              style={[styles.secondaryButton, { marginTop: 10, flex: 0 }]}
              onPress={() => void loadStore()}
            >
              <Ionicons name="refresh-outline" size={18} color="#111827" />
              <Text style={styles.secondaryButtonText}>最新情報に更新</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}
