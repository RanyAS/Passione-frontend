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
import { getReservationsByStore } from "@/api/ReservationApi";
import { getStorePins } from "@/api/StorePinApi";
import { DEMO_STORE_ID } from "@/constants/session";
import type { Reservation } from "@/types/Reservation";
import type { StorePin } from "@/types/StorePin";
import { shopStyles as styles } from "../../styles/shop.styles";

export default function ShopStatsScreen() {
  const insets = useSafeAreaInsets();
  const [pins, setPins] = useState<StorePin[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pinsData, reservationsData] = await Promise.all([
        getStorePins(DEMO_STORE_ID),
        getReservationsByStore(DEMO_STORE_ID),
      ]);
      setPins(pinsData);
      setReservations(reservationsData);
    } catch {
      setPins([]);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmed = useMemo(
    () => reservations.filter((r) => r.status === "confirmed").length,
    [reservations]
  );
  const pending = useMemo(
    () => reservations.filter((r) => r.status === "pending").length,
    [reservations]
  );
  const failed = useMemo(
    () =>
      reservations.filter(
        (r) => r.status === "failed" || r.status === "cancelled"
      ).length,
    [reservations]
  );
  const decided = confirmed + failed;
  const acceptanceRate =
    decided === 0 ? "—" : `${Math.round((confirmed / decided) * 100)}%`;

  const topOffers = useMemo(() => {
    const counts = new Map<string, { title: string; uses: number }>();
    for (const reservation of reservations) {
      const key = reservation.pinId;
      const title =
        reservation.pin?.description ?? reservation.pin?.time ?? "オファー";
      const prev = counts.get(key) ?? { title, uses: 0 };
      counts.set(key, { title, uses: prev.uses + 1 });
    }
    return Array.from(counts.entries())
      .map(([id, value]) => ({ id, ...value }))
      .sort((a, b) => b.uses - a.uses)
      .slice(0, 5);
  }, [reservations]);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>統計</Text>
          <Text style={styles.subtitle}>
            オファー {pins.length} 件 · 予約 {reservations.length} 件
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/shop")}
          >
            <Text style={styles.secondaryButtonText}>ホームへ</Text>
          </Pressable>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/shop/reservations")}
          >
            <Text style={styles.primaryButtonText}>予約へ</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.statsRow}>
              <Pressable
                style={styles.statCard}
                onPress={() => router.push("/shop/reservations")}
              >
                <Text style={styles.statValue}>{confirmed}</Text>
                <Text style={styles.statLabel}>確定予約</Text>
              </Pressable>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{acceptanceRate}</Text>
                <Text style={styles.statLabel}>承認率</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <Pressable
                style={styles.statCard}
                onPress={() => router.push("/shop/reservations")}
              >
                <Text style={styles.statValue}>{pending}</Text>
                <Text style={styles.statLabel}>確認待ち</Text>
              </Pressable>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{failed}</Text>
                <Text style={styles.statLabel}>拒否/失敗</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>人気オファー</Text>
            {topOffers.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>まだ予約データがありません</Text>
              </View>
            ) : (
              topOffers.map((offer) => (
                <Pressable
                  key={offer.id}
                  style={styles.card}
                  onPress={() => router.push("/shop/pins")}
                >
                  <Text style={styles.cardTitle}>{offer.title}</Text>
                  <Text style={styles.cardMeta}>利用 {offer.uses} 回</Text>
                </Pressable>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
