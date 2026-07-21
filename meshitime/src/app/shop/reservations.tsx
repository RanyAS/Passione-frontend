import React, { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { notifyReservationDecision } from "@/services/notifications.service";
import { shopStyles as styles } from "../../styles/shop.styles";

type ReservationStatus = "pending" | "confirmed" | "failed" | "cancelled";

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

function statusBadge(status: ReservationStatus) {
  switch (status) {
    case "pending":
      return {
        box: styles.badgePending,
        text: styles.badgePendingText,
        label: "確認待ち",
      };
    case "confirmed":
      return {
        box: styles.badgeSuccess,
        text: styles.badgeSuccessText,
        label: "確定",
      };
    case "failed":
      return {
        box: styles.badgeError,
        text: styles.badgeErrorText,
        label: "失敗",
      };
    case "cancelled":
      return {
        box: styles.badge,
        text: styles.badgeText,
        label: "キャンセル",
      };
  }
}

export default function ShopReservationsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<ReservationStatus | "all">(
    "all"
  );
  const [reservations, setReservations] = useState(initialReservations);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return reservations;
    return reservations.filter((item) => item.status === activeFilter);
  }, [activeFilter, reservations]);

  const updateStatus = (id: string, status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const decideReservation = async (
    item: ShopReservation,
    status: "confirmed" | "failed"
  ) => {
    updateStatus(item.id, status);

    const notified = await notifyReservationDecision({
      status,
      offerTitle: item.offerTitle,
    });

    if (status === "confirmed") {
      Alert.alert(
        "予約確定",
        notified
          ? "顧客にプッシュ通知を送信しました。"
          : "ステータスを更新しました（通知は送信できませんでした）。"
      );
      return;
    }

    Alert.alert(
      "予約拒否",
      notified
        ? "顧客にプッシュ通知を送信しました。"
        : "ステータスを更新しました（通知は送信できませんでした）。"
    );
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
            const badge = statusBadge(item.status);
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

                {item.status === "pending" ? (
                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.dangerButton}
                      onPress={() => {
                        void decideReservation(item, "failed");
                      }}
                    >
                      <Text style={styles.dangerButtonText}>拒否</Text>
                    </Pressable>
                    <Pressable
                      style={styles.primaryButton}
                      onPress={() => {
                        void decideReservation(item, "confirmed");
                      }}
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
