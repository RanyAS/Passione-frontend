import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getReservationsByUser } from "@/api/ReservationApi";
import { getStorePins } from "@/api/StorePinApi";
import { supabase } from "@/lib/supabase";
import type { Reservation } from "@/types/Reservation";
import type { StorePin } from "@/types/StorePin";
import { shopStyles as styles } from "../../styles/shop.styles";

const actions = [
  {
    key: "create-pin",
    title: "オファーを作成",
    meta: "空席数付きのピンを登録",
    icon: "add-circle-outline" as const,
    route: "/shop/pins",
    primary: true,
  },
  {
    key: "pins",
    title: "オファー一覧",
    meta: "公開・停止を管理",
    icon: "pricetag-outline" as const,
    route: "/shop/pins",
  },
  {
    key: "reservations",
    title: "予約を確認",
    meta: "承認・拒否・キャンセル",
    icon: "calendar-outline" as const,
    route: "/shop/reservations",
  },
  {
    key: "profile",
    title: "店舗情報",
    meta: "ダッシュボードを見る",
    icon: "storefront-outline" as const,
    route: "/shop/profile",
  },
  {
    key: "stats",
    title: "統計",
    meta: "簡易レポート",
    icon: "bar-chart-outline" as const,
    route: "/shop/stats",
  },
];

export default function ShopDashboardScreen() {
  const insets = useSafeAreaInsets();
  const [pins, setPins] = useState<StorePin[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: {session} } = await supabase.auth.getSession();
    const storeId = session?.user.id;

    if (!storeId) throw new Error("店舗の取得失敗！");
    try {
      const [pinsData, reservationsData] = await Promise.all([
        getStorePins(storeId),
        getReservationsByUser(storeId),
      ]);
      setPins(pinsData);
      setReservations(reservationsData);
    } catch {
      setPins([]);
      setReservations([]);
      setError("データの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const pendingCount = useMemo(
    () => reservations.filter((item) => item.status === "pending").length,
    [reservations]
  );
  const confirmedCount = useMemo(
    () => reservations.filter((item) => item.status === "confirmed").length,
    [reservations]
  );
  const activePins = useMemo(
    () => pins.filter((pin) => pin.isActive).length,
    [pins]
  );
  const emptySeats = useMemo(
    () =>
      pins
        .filter((pin) => pin.isActive)
        .reduce((sum, pin) => sum + (pin.emptySeat || 0), 0),
    [pins]
  );

  const alerts = useMemo(() => {
    const list: {
      id: string;
      title: string;
      meta: string;
      type: "pending" | "active";
      route: string;
    }[] = [];

    if (pendingCount > 0) {
      list.push({
        id: "pending",
        title: `確認待ちの予約が ${pendingCount} 件`,
        meta: "予約管理で承認または拒否してください",
        type: "pending",
        route: "/shop/reservations",
      });
    }

    const endingSoon = pins.filter((pin) => {
      if (!pin.isActive || !pin.endsAt) return false;
      const ends = new Date(pin.endsAt).getTime();
      return ends - Date.now() < 2 * 60 * 60 * 1000 && ends > Date.now();
    });

    if (endingSoon.length > 0) {
      list.push({
        id: "ending",
        title: `まもなく終了のオファー ${endingSoon.length} 件`,
        meta: endingSoon[0]?.description ?? "オファーを確認",
        type: "active",
        route: "/shop/pins",
      });
    }

    return list;
  }, [pendingCount, pins]);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>店舗ホーム</Text>
          <Text style={styles.subtitle}>オファー作成と予約対応</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{error}</Text>
            <Pressable
              style={[styles.primaryButton, { marginTop: 16, flex: 0 }]}
              onPress={() => void load()}
            >
              <Text style={styles.primaryButtonText}>再試行</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.statsRow}>
              <Pressable
                style={styles.statCard}
                onPress={() => router.push("/shop/reservations")}
              >
                <Text style={styles.statValue}>{pendingCount}</Text>
                <Text style={styles.statLabel}>確認待ち</Text>
              </Pressable>
              <Pressable
                style={styles.statCard}
                onPress={() => router.push("/shop/stats")}
              >
                <Text style={styles.statValue}>{confirmedCount}</Text>
                <Text style={styles.statLabel}>確定済み</Text>
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <Pressable
                style={styles.statCard}
                onPress={() => router.push("/shop/pins")}
              >
                <Text style={styles.statValue}>{activePins}</Text>
                <Text style={styles.statLabel}>有効オファー</Text>
              </Pressable>
              <Pressable
                style={styles.statCard}
                onPress={() => router.push("/shop/pins")}
              >
                <Text style={styles.statValue}>{emptySeats}</Text>
                <Text style={styles.statLabel}>残り席数</Text>
              </Pressable>
            </View>

            {alerts.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>アラート</Text>
                {alerts.map((alert) => (
                  <Pressable
                    key={alert.id}
                    style={styles.card}
                    onPress={() => router.push(alert.route as never)}
                  >
                    <Text style={styles.cardTitle}>{alert.title}</Text>
                    <Text style={styles.cardMeta}>{alert.meta}</Text>
                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.badge,
                          alert.type === "pending"
                            ? styles.badgePending
                            : styles.badgeActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            alert.type === "pending"
                              ? styles.badgePendingText
                              : styles.badgeActiveText,
                          ]}
                        >
                          {alert.type === "pending" ? "要対応" : "まもなく終了"}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </>
            ) : null}

            <Text style={styles.sectionTitle}>クイックアクション</Text>
            {actions.map((action) => (
              <Pressable
                key={action.key}
                style={styles.card}
                onPress={() => router.push(action.route as never)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Ionicons
                    name={action.icon}
                    size={22}
                    color={action.primary ? "#FF3B30" : "#111827"}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{action.title}</Text>
                    <Text style={styles.cardMeta}>{action.meta}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </View>
              </Pressable>
            ))}

            <Pressable
              style={[styles.secondaryButton, { marginTop: 16, flex: 0 }]}
              onPress={() => void load()}
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
