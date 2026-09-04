import { router, usePathname } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMeshitime } from "../../provider/meshitime-provider";
import { getAllHistory } from "@/api/historyApi";
import { resolveSessionUserId } from "@/lib/sessionUser";
import HistoryItem from "../components/ui/history-item";
import SettingMenuItem from "../components/ui/setting-menu-item";
import { profileStyles as styles } from "../styles/profile.styles";
import { supabase } from "@/lib/supabase";
import { getReviewsByUser, insertReview } from "@/api/reviewApi";

type HistoryRow = {
  id: string;
  routeId: string;
  reservationId: string;
  name: string;
  date: string;
  image: string;
  bgColor: string;
  reviewed: boolean;
};

function getStoreImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  const { data } = supabase.storage
    .from("stores-images")
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

export default function ProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { favorites, userProfile, loadFavorites } = useMeshitime();
  const [histories, setHistories] = useState<HistoryRow[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [visitCount, setVisitCount] = useState(0);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<HistoryRow | null>(null);
  const [reviewStar, setReviewStar] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const pathname = usePathname();

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const userId = await resolveSessionUserId();
      const [historyRows, reviews] = await Promise.all([
        getAllHistory(userId),
        getReviewsByUser(userId),
      ]);

      setVisitCount(historyRows.length);
      const reviewedReservationIds = new Set(
        reviews.map((review) => review.reservation_id)
      );

      setHistories(
        historyRows.map((row) => ({
          id: row.id,
          routeId: row.store_id,
          reservationId: row.reservation_id,
          name: row.stores?.sname ?? "店舗",
          date: new Date(row.created_at).toLocaleDateString("ja-JP"),
          image: getStoreImageUrl(row.stores?.image_path ?? null) ?? "",
          bgColor: "#FFDDB0",
          reviewed: reviewedReservationIds.has(row.reservation_id),
        }))
      );
    } catch {
      setHistories([]);
      setVisitCount(0);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const handleSubmitReview = async () => {
  if (!selectedHistory) return;

  if (reviewStar === 0) {
    Alert.alert("確認", "星を選択してください。");
    return;
  }

  setSubmittingReview(true);

  try {
    const userId = await resolveSessionUserId();

    await insertReview({
      store_id: selectedHistory.routeId,
      user_id: userId,
      reservation_id: selectedHistory.reservationId,
      star: reviewStar,
      comment: reviewComment.trim(),
    });

    setHistories((prev) =>
      prev.map((item) =>
        item.id === selectedHistory.id
          ? { ...item, reviewed: true }
          : item
      )
    );

    setReviewModalVisible(false);
    setSelectedHistory(null);
    setReviewStar(0);
    setReviewComment("");

    Alert.alert("完了", "レビューを投稿しました。");
  } catch (error: any) {
    console.error("❌ REVIEW ERROR:", error);
    console.error("status:", error.response?.status);
    console.error("data:", error.response?.data);

    Alert.alert(
      "エラー",
      error.response?.data?.message ??
        "レビューの投稿に失敗しました。"
    );
  } finally {
    setSubmittingReview(false);
  }
};

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsLoggedIn(!!session);
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
      if (pathname === "/profile") {
        void loadFavorites();
      }
    }, [pathname, loadFavorites]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const displayName = userProfile.name?.trim() || "ゲスト";
  const displayEmail = userProfile.email?.trim() || "未ログイン";
  const initials =
    userProfile.initials?.trim() ||
    displayName.slice(0, 2).toUpperCase() ||
    "G";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            position: "absolute",
            left: 24,
            top: 42,
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "rgba(255,255,255,0.25)",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => router.push("/HomeMapScreen")}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingButton}
          activeOpacity={0.8}
          onPress={() => undefined}
        >
          <Text style={styles.settingIcon}>⚙</Text>
        </TouchableOpacity>

        <View style={styles.avatar}>
          {userProfile.imagePath ? (
            <Image
              source={{ uri: userProfile.imagePath }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>

        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{displayEmail}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{visitCount}</Text>
          <Text style={styles.statLabel}>訪問数</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{favorites.length}</Text>
          <Text style={styles.statLabel}>お気に入り</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{histories.filter((item) => item.reviewed).length}</Text>
          <Text style={styles.statLabel}>レビュー</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>設定</Text>

        <View style={styles.settingCard}>
          <SettingMenuItem
            icon="🔔"
            label="通知設定"
            iconColor="#2563EB"
            onPress={() => undefined}
          />

          <SettingMenuItem
            icon="💳"
            label="支払い方法"
            iconColor="#22C55E"
            onPress={() => undefined}
          />

          <SettingMenuItem
            icon="?"
            label="ヘルプ・サポート"
            iconColor="#8B5CF6"
            onPress={() => undefined}
          />

          {isLoggedIn ? (
            <SettingMenuItem
              icon="↪"
              label="ログアウト"
              iconColor="#EF4444"
              onPress={async () => {
                try {
                  await supabase.auth.signOut();
                  setIsLoggedIn(false);
                  router.replace("/HomeMapScreen");
                } catch (error) {
                  console.error("Logout error:", error);
                }
              }}
            />
          ) : (
            <>
              <SettingMenuItem
                icon="↪"
                label="ログイン"
                iconColor="#2563EB"
                onPress={() => router.push("/login")}
              />

              <SettingMenuItem
                icon="✎"
                label="新規登録"
                iconColor="#22C55E"
                onPress={() => router.push("/Register/RegisterScreen")}
              />
            </>
          )}
        </View>

        <Text style={styles.versionText}>MESHITIME v1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>利用履歴</Text>

        {loadingHistory ? (
          <ActivityIndicator style={{ marginTop: 16 }} />
        ) : histories.length === 0 ? (
          <Text style={{ color: "#8E8E93", paddingHorizontal: 4 }}>
            利用履歴はまだありません
          </Text>
        ) : (
          histories.map((history) => (
            <HistoryItem
              key={history.id}
              name={history.name}
              date={history.date}
              image={history.image}
              bgColor={history.bgColor}
              reviewed={history.reviewed}
              onPress={() => {
                console.log("🏪 HISTORY STORE ID:", history.routeId);

                router.push({
                  pathname: "/restaurant-detail",
                  params: {
                    id: history.routeId,
                    source: "profile",
                  },
                });
              }}
              onReviewPress={() => {
                setSelectedHistory(history);
                setReviewStar(0);
                setReviewComment("");
                setReviewModalVisible(true);
              }}
/>
          ))
        )}
      </View>
      <Modal
  visible={reviewModalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setReviewModalVisible(false)}
>
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.45)",
      justifyContent: "flex-end",
    }}
  >
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 36,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          marginBottom: 6,
        }}
      >
        レビューを書く
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: "#666",
          marginBottom: 20,
        }}
      >
        {selectedHistory?.name ?? "店舗"}
      </Text>

      {/* Stars */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable
            key={star}
            onPress={() => setReviewStar(star)}
            style={{ paddingHorizontal: 6 }}
          >
            <Text
              style={{
                fontSize: 36,
                color: star <= reviewStar ? "#F5B301" : "#D1D1D6",
              }}
            >
              ★
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        value={reviewComment}
        onChangeText={setReviewComment}
        placeholder="お店の感想を書いてください"
        multiline
        textAlignVertical="top"
        style={{
          borderWidth: 1,
          borderColor: "#D1D1D6",
          borderRadius: 12,
          minHeight: 120,
          padding: 14,
          fontSize: 15,
          marginBottom: 20,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => setReviewModalVisible(false)}
          style={{
            flex: 1,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: "#F2F2F7",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              color: "#555",
            }}
          >
            キャンセル
          </Text>
        </Pressable>

        <Pressable
          disabled={submittingReview || reviewStar === 0}
          style={{
            flex: 1,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor:
              submittingReview || reviewStar === 0
                ? "#C7C7CC"
                : "#2563EB",
            alignItems: "center",
          }}
          onPress={() => void handleSubmitReview()}
        >
          {submittingReview ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={{
                fontWeight: "700",
                color: "#FFFFFF",
              }}
            >
              投稿
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  </View>
</Modal>
    </ScrollView>
  );
}
