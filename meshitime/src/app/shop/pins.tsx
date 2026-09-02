import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  createStorePin,
  getStorePins,
  updateStorePin,
} from "@/api/StorePinApi";
import { supabase } from "@/lib/supabase";
import type { StorePin } from "@/types/StorePin";
import { shopStyles as styles } from "../../styles/shop.styles";

type PinForm = {
  emptySeat: string;
  description: string;
  rule: string;
  startsAtDate: string;
  startsAtTime: string;
  endsAtDate: string;
  endsAtTime: string;
};

const INITIAL_FORM: PinForm = {
  emptySeat: "",
  description: "",
  rule: "",
  startsAtDate: "",
  startsAtTime: "",
  endsAtDate: "",
  endsAtTime: "",
};

export default function ShopPinsScreen() {
  const insets = useSafeAreaInsets();

  const [pins, setPins] = useState<StorePin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Pin modal
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<PinForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const loadPins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const storeId = session?.user.id;

      if (!storeId) throw new Error("店舗情報の取得失敗！");
      const data = await getStorePins(storeId);
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

  const updateForm = <K extends keyof PinForm>(
    key: K,
    value: PinForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const openCreateModal = () => {
    setForm(INITIAL_FORM);
    setModalVisible(true);
  };

  const closeCreateModal = () => {
    if (submitting) return;

    setModalVisible(false);
    setForm(INITIAL_FORM);
  };

function toJstTimestamp(date: string, time: string) {
  const trimmedDate = date.trim();
  const trimmedTime = time.trim();

  if (!trimmedDate || !trimmedTime) {
    return null;
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const timePattern = /^\d{2}:\d{2}$/;

  if (!datePattern.test(trimmedDate) || !timePattern.test(trimmedTime)) {
    return null;
  }

  const [year, month, day] = trimmedDate.split("-").map(Number);
  const [hour, minute] = trimmedTime.split(":").map(Number);

  const testDate = new Date(
    Date.UTC(year, month - 1, day, hour, minute)
  );

  if (
    testDate.getUTCFullYear() !== year ||
    testDate.getUTCMonth() !== month - 1 ||
    testDate.getUTCDate() !== day ||
    testDate.getUTCHours() !== hour ||
    testDate.getUTCMinutes() !== minute
  ) {
    return null;
  }

  if (hour > 23 || minute > 59) {
    return null;
  }

  return `${trimmedDate}T${trimmedTime}:00+09:00`;
}

  const handleCreatePin = async () => {
    // 空席数チェック
    if (!form.emptySeat.trim()) {
      Alert.alert("入力エラー", "空席数を入力してください。");
      return;
    }

    const emptySeat = Number(form.emptySeat);

    if (!Number.isInteger(emptySeat) || emptySeat < 0) {
      Alert.alert(
        "入力エラー",
        "空席数には0以上の整数を入力してください。"
      );
      return;
    }

const startsAt = toJstTimestamp(
  form.startsAtDate,
  form.startsAtTime
);

const endsAt = toJstTimestamp(
  form.endsAtDate,
  form.endsAtTime
);

if (!startsAt || !endsAt) {
  Alert.alert(
    "入力エラー",
    "開始日時と終了日時を入力してください。"
  );
  return;
}

if (new Date(startsAt) >= new Date(endsAt)) {
  Alert.alert(
    "入力エラー",
    "終了日時は開始日時より後に設定してください。"
  );
  return;
}

try {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const storeId = session?.user.id;

  if (!storeId) {
    throw new Error("店舗情報の取得失敗！");
  }

  setSubmitting(true);

  await createStorePin({
    storeId: storeId,
    emptySeat,
    description: form.description.trim() || null,
    rule: form.rule.trim() || null,
    startsAt,
    endsAt,
    isActive: true,
  });

  setModalVisible(false);
  setForm(INITIAL_FORM);

  Alert.alert(
    "作成完了",
    "オファーを作成しました。"
  );

  await loadPins();
} catch (error) {
  console.error("Failed to create store pin:", error);
  console.log("🔥 Backend response:", error);

  Alert.alert(
    "エラー",
    "オファーの作成に失敗しました。"
  );
} finally {
  setSubmitting(false);
}
  };

  const toggleActive = async (pin: StorePin) => {
    try {
      const updated = await updateStorePin(pin.id, {
        isActive: !pin.isActive,
      });

      setPins((prev) =>
        prev.map((row) => (row.id === pin.id ? updated : row))
      );
    } catch {
      Alert.alert("エラー", "ステータスの更新に失敗しました");
    }
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 90,
        }}
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
            onPress={() => router.push("/shop")}
          >
            <Text style={styles.secondaryButtonText}>
              ホームへ
            </Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={openCreateModal}
          >
            <Text style={styles.primaryButtonText}>
              新規作成
            </Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>{error}</Text>

            <Pressable
              style={[
                styles.primaryButton,
                { marginTop: 16, flex: 0 },
              ]}
              onPress={() => void loadPins()}
            >
              <Text style={styles.primaryButtonText}>
                再試行
              </Text>
            </Pressable>
          </View>
        ) : pins.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons
              name="pricetag-outline"
              size={28}
              color="#9CA3AF"
            />

            <Text style={styles.emptyText}>
              まだオファーがありません
            </Text>

            <Pressable
              style={[
                styles.primaryButton,
                { marginTop: 16, flex: 0 },
              ]}
              onPress={openCreateModal}
            >
              <Text style={styles.primaryButtonText}>
                オファーを作成
              </Text>
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
                残り{pin.emptySeat}席 ·{" "}
                {pin.time != null ? `${pin.time}分` : "時間未設定"}
              </Text>

              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badge,
                    pin.isActive
                      ? styles.badgeSuccess
                      : styles.badgeError,
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
                  onPress={() =>
                    router.push("/shop/reservations")
                  }
                >
                  <Text style={styles.primaryButtonText}>
                    予約を見る
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* =========================
          CREATE PIN MODAL
          ========================= */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeCreateModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: "90%",
              paddingTop: 20,
            }}
          >
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: insets.bottom + 24,
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Text style={styles.title}>
                  オファー作成
                </Text>

                <Pressable
                  onPress={closeCreateModal}
                  disabled={submitting}
                >
                  <Ionicons
                    name="close"
                    size={28}
                    color="#6B7280"
                  />
                </Pressable>
              </View>

              <Text style={styles.subtitle}>
                現在の空席情報をオファーとして公開します
              </Text>

              {/* 基本情報 */}
              <View
                style={[
                  styles.card,
                  { marginTop: 18 },
                ]}
              >
                <Text style={styles.cardTitle}>
                  基本情報
                </Text>

                <Text
                  style={[
                    styles.cardMeta,
                    { marginTop: 14 },
                  ]}
                >
                  空席数 *
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <TextInput
                    style={[
                      styles.input,
                      {
                        flex: 1,
                        marginTop: 0,
                      },
                    ]}
                    placeholder="例：5"
                    value={form.emptySeat}
                    onChangeText={(value) =>
                      updateForm("emptySeat", value)
                    }
                    keyboardType="numeric"
                    editable={!submitting}
                  />

                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 16,
                    }}
                  >
                    席
                  </Text>
                </View>

              </View>

              {/* オファー内容 */}
              <View
                style={[
                  styles.card,
                  { marginTop: 14 },
                ]}
              >
                <Text style={styles.cardTitle}>
                  オファー内容
                </Text>

                <Text
                  style={[
                    styles.cardMeta,
                    { marginTop: 14 },
                  ]}
                >
                  説明
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      marginTop: 8,
                      minHeight: 90,
                      textAlignVertical: "top",
                    },
                  ]}
                  placeholder="例：本日空席あります！"
                  value={form.description}
                  onChangeText={(value) =>
                    updateForm("description", value)
                  }
                  multiline
                  editable={!submitting}
                />

                <Text
                  style={[
                    styles.cardMeta,
                    { marginTop: 14 },
                  ]}
                >
                  ルール
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    { marginTop: 8 },
                  ]}
                  placeholder="例：2名様まで"
                  value={form.rule}
                  onChangeText={(value) =>
                    updateForm("rule", value)
                  }
                  editable={!submitting}
                />
              </View>

              {/* 公開期間 */}
              {/* 公開期間 */}
<View
  style={[
    styles.card,
    { marginTop: 14 },
  ]}
>
  <Text style={styles.cardTitle}>
    公開期間
  </Text>

  <Text
    style={[
      styles.cardMeta,
      { marginTop: 14 },
    ]}
  >
    開始日 *
  </Text>

  <TextInput
    style={[
      styles.input,
      { marginTop: 8 },
    ]}
    placeholder="例：2026-09-03"
    value={form.startsAtDate}
    onChangeText={(value) =>
      updateForm("startsAtDate", value)
    }
    placeholderTextColor="#9CA3AF"
    autoCapitalize="none"
    editable={!submitting}
  />

  <Text
    style={[
      styles.cardMeta,
      { marginTop: 14 },
    ]}
  >
    開始時刻 *
  </Text>

  <TextInput
    style={[
      styles.input,
      { marginTop: 8 },
    ]}
    placeholder="例：18:00"
    value={form.startsAtTime}
    onChangeText={(value) =>
      updateForm("startsAtTime", value)
    }
    placeholderTextColor="#9CA3AF"
    autoCapitalize="none"
    editable={!submitting}
  />

  <Text
    style={[
      styles.cardMeta,
      { marginTop: 14 },
    ]}
  >
    終了日 *
  </Text>

  <TextInput
    style={[
      styles.input,
      { marginTop: 8 },
    ]}
    placeholder="例：2026-09-03"
    value={form.endsAtDate}
    onChangeText={(value) =>
      updateForm("endsAtDate", value)
    }
    placeholderTextColor="#9CA3AF"
    autoCapitalize="none"
    editable={!submitting}
  />

  <Text
    style={[
      styles.cardMeta,
      { marginTop: 14 },
    ]}
  >
    終了時刻 *
  </Text>

  <TextInput
    style={[
      styles.input,
      { marginTop: 8 },
    ]}
    placeholder="例：22:00"
    value={form.endsAtTime}
    onChangeText={(value) =>
      updateForm("endsAtTime", value)
    }
    placeholderTextColor="#9CA3AF"
    autoCapitalize="none"
    editable={!submitting}
  />

  <Text
    style={{
      marginTop: 10,
      fontSize: 13,
      color: "#6B7280",
    }}
  >
    日本時間（JST）で入力してください。
  </Text>
</View>

              {/* Buttons */}
              <View
                style={[
                  styles.actionsRow,
                  { marginTop: 18 },
                ]}
              >
                <Pressable
                  style={styles.secondaryButton}
                  onPress={closeCreateModal}
                  disabled={submitting}
                >
                  <Text style={styles.secondaryButtonText}>
                    キャンセル
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.primaryButton,
                    submitting
                      ? { opacity: 0.6 }
                      : null,
                  ]}
                  onPress={() => void handleCreatePin()}
                  disabled={submitting}
                >
                  <Text style={styles.primaryButtonText}>
                    {submitting ? "作成中..." : "作成する"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Pressable
        style={styles.fab}
        onPress={openCreateModal}
      >
        <Ionicons
          name="add"
          size={28}
          color="#FFFFFF"
        />
      </Pressable>
    </View>
  );
}