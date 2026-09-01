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
import {
  cancelReservation,
  confirmReservation,
  failReservation,
  getReservationsByStore,
} from "@/api/ReservationApi";
import { DEMO_STORE_ID } from "@/constants/session";
import type { Reservation, ReservationStatus } from "@/types/Reservation";
import { notifyReservationDecision } from "../../services/notificationsService";
import { shopStyles as styles } from "../../styles/shop.styles";

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

function formatWhen(value: string | null) {
  if (!value) return "日時未設定";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ShopReservationsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<ReservationStatus | "all">(
    "all"
  );
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReservationsByStore(DEMO_STORE_ID);
      setReservations(data);
    } catch {
      setReservations([]);
      setError("予約の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return reservations;
    return reservations.filter((item) => item.status === activeFilter);
  }, [activeFilter, reservations]);

  const decide = async (
    item: Reservation,
    status: "confirmed" | "failed" | "cancelled"
  ) => {
    setLoadingId(item.id);

    try {
      const updated =
        status === "confirmed"
          ? await confirmReservation(item.id)
          : status === "failed"
            ? await failReservation(item.id)
            : await cancelReservation(item.id);

      setReservations((prev) =>
        prev.map((row) => (row.id === item.id ? updated : row))
      );

      await notifyReservationDecision({
        status,
        offerTitle: item.pin?.description ?? undefined,
      });

      const messages = {
        confirmed: "予約を確定しました",
        failed: "予約を拒否しました",
        cancelled: "予約をキャンセルしました",
      } as const;

      Alert.alert("完了", messages[status]);
    } catch {
      Alert.alert("エラー", "ステータスの更新に失敗しました");
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

        <View style={styles.actionsRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/shop")}
          >
            <Text style={styles.secondaryButtonText}>ホームへ</Text>
          </Pressable>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/shop/pins")}
          >
            <Text style={styles.primaryButtonText}>オファーへ</Text>
          </Pressable>
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

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{error}</Text>
            <Pressable
              style={[styles.primaryButton, { marginTop: 16, flex: 0 }]}
              onPress={() => void loadReservations()}
            >
              <Text style={styles.primaryButtonText}>再試行</Text>
            </Pressable>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>該当する予約はありません</Text>
          </View>
        ) : (
          filtered.map((item) => {
            const badge = STATUS_UI[item.status];
            const busy = loadingId === item.id;
            const offer =
              item.pin?.description ?? item.pin?.time ?? "オファー";

            return (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardTitle}>
                  顧客 {item.userId.slice(0, 12)}
                </Text>
                <Text style={styles.cardMeta}>
                  {offer} · {item.partySize}名 ·{" "}
                  {formatWhen(item.reservedAt ?? item.createdAt)}
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
                      disabled={busy}
                      onPress={() => void decide(item, "failed")}
                    >
                      <Text style={styles.dangerButtonText}>拒否</Text>
                    </Pressable>
                    <Pressable
                      style={styles.secondaryButton}
                      disabled={busy}
                      onPress={() => void decide(item, "cancelled")}
                    >
                      <Text style={styles.secondaryButtonText}>取消</Text>
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
