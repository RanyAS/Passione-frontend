import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  confirmReservation,
  failReservation,
} from "@/api/ReservationApi";
import type { ReservationStatus } from "@/types/Reservation";
import { notifyReservationDecision } from "@/services/notifications.service";
import { shopStyles as styles } from "../../styles/shop.styles";

type ShopReservation = {
  id: string;
  customerName: string;
  partySize: number;
  reservedAt: string;
  offerTitle: string;
  status: ReservationStatus;
};

const filters: { key: ReservationStatus | "all"; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "pending", label: "確認待ち" },
  { key: "confirmed", label: "確定" },
  { key: "failed", label: "失敗" },
  { key: "cancelled", label: "キャンセル" },
];

const STATUS_UI: Record<
  ReservationStatus,
  { label: string; box: object; text: object }
> = {
  pending: {
    label: "確認待ち",
    box: styles.badgePending,
    text: styles.badgePendingText,
  },
  confirmed: {
    label: "確定",
    box: styles.badgeSuccess,
    text: styles.badgeSuccessText,
  },
  failed: {
    label: "失敗",
    box: styles.badgeError,
    text: styles.badgeErrorText,
  },
  cancelled: {
    label: "キャンセル",
    box: styles.badge,
    text: styles.badgeText,
  },
};

const initialReservations: ShopReservation[] = [
  {
    id: "r1",
    customerName: "田中 太郎",
    partySize: 2,
    reservedAt: "今日 19:00",
    offerTitle: "ディナー20%OFF",
    status: "pending",
  },
  {
    id: "r2",
    customerName: "佐藤 花子",
    partySize: 3,
    reservedAt: "今日 12:30",
    offerTitle: "ランチ30%OFF",
    status: "confirmed",
  },
  {
    id: "r3",
    customerName: "鈴木 一郎",
    partySize: 1,
    reservedAt: "昨日 18:00",
    offerTitle: "ディナー20%OFF",
    status: "failed",
  },
];

export default function ShopReservationsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<ReservationStatus | "all">(
    "all"
  );
  const [reservations, setReservations] = useState(initialReservations);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return reservations;
    return reservations.filter((item) => item.status === activeFilter);
  }, [activeFilter, reservations]);

  const decide = async (
    item: ShopReservation,
    status: "confirmed" | "failed"
  ) => {
    setLoadingId(item.id);

    try {
      if (status === "confirmed") {
        await confirmReservation(item.id);
      } else {
        await failReservation(item.id);
      }

      setReservations((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, status } : row
        )
      );

      await notifyReservationDecision({
        status,
        offerTitle: item.offerTitle,
      });

      Alert.alert(
        "完了",
        status === "confirmed" ? "予約を確定しました" : "予約を拒否しました"
      );
    } catch {
      // Démo locale (r1/r2…) si l’API n’est pas encore dispo
      if (item.id.startsWith("r")) {
        setReservations((prev) =>
          prev.map((row) =>
            row.id === item.id ? { ...row, status } : row
          )
        );
        Alert.alert(
          "完了",
          status === "confirmed" ? "予約を確定しました" : "予約を拒否しました"
        );
      } else {
        Alert.alert("エラー", "予約の更新に失敗しました");
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>予約管理</Text>
          <Text style={styles.subtitle}>確認・承認・拒否をここで対応</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={{ gap: 8 }}
        >
          {filters.map((filter) => {
            const active = filter.key === activeFilter;
            return (
              <Pressable
                key={filter.key}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>該当する予約はありません</Text>
          </View>
        ) : (
          filtered.map((item) => {
            const badge = STATUS_UI[item.status];
            const busy = loadingId === item.id;

            return (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardTitle}>{item.customerName}</Text>
                <Text style={styles.cardMeta}>
                  {item.offerTitle} · {item.partySize}名 · {item.reservedAt}
                </Text>

                <View style={styles.badgeRow}>
                  <View style={[styles.badge, badge.box]}>
                    <Text style={[styles.badgeText, badge.text]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                {/* pending → boutons ; sinon juste le badge */}
                {item.status === "pending" ? (
                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.dangerButton}
                      disabled={busy}
                      onPress={() => void decide(item, "failed")}
                    >
                      <Text style={styles.dangerButtonText}>拒否</Text>
                    </Pressable>
                    <Pressable
                      style={styles.primaryButton}
                      disabled={busy}
                      onPress={() => void decide(item, "confirmed")}
                    >
                      <Text style={styles.primaryButtonText}>承認</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
