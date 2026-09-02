import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useMeshitime } from "../../provider/meshitime-provider";
import { getAllHistory } from "@/api/historyApi";
import { getReservationsByUser } from "@/api/ReservationApi";
import { resolveSessionUserId } from "@/lib/sessionUser";
import HistoryItem from "../components/ui/history-item";
import SettingMenuItem from "../components/ui/setting-menu-item";
import { profileStyles as styles } from "../styles/profile.styles";
import { supabase } from "@/lib/supabase";

type HistoryRow = {
  id: string;
  routeId: string;
  name: string;
  date: string;
  discount: string;
  price: number;
  image: string;
  bgColor: string;
};

export default function ProfileScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { favorites, userProfile } = useMeshitime();
  const [histories, setHistories] = useState<HistoryRow[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [visitCount, setVisitCount] = useState(0);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const userId = await resolveSessionUserId();
      const [historyRows, reservations] = await Promise.all([
        getAllHistory(userId).catch(() => []),
        getReservationsByUser(userId).catch(() => []),
      ]);

      setVisitCount(reservations.length);

      if (historyRows.length > 0) {
        setHistories(
          historyRows.map((row) => ({
            id: row.id,
            routeId: row.store_id,
            name: row.store?.sname ?? "店舗",
            date: new Date(row.created_at).toLocaleDateString("ja-JP"),
            discount: "",
            price: 0,
            image: "🍜",
            bgColor: "#FFDDB0",
          }))
        );
      } else {
        setHistories(
          reservations.map((row) => ({
            id: row.id,
            routeId: row.pinId,
            name: row.pin?.store?.name ?? row.pin?.description ?? "予約",
            date: new Date(row.createdAt).toLocaleDateString("ja-JP"),
            discount: "",
            price: row.partySize,
            image: "🍽️",
            bgColor: "#CFE5FF",
          }))
        );
      }
    } catch {
      setHistories([]);
      setVisitCount(0);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

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
          <Text style={styles.statNumber}>{userProfile.stats.reviews}</Text>
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

          <SettingMenuItem
            icon="↪"
            label="店舗ダッシュボード"
            iconColor="#EF4444"
            onPress={() => router.push("./shop")}
          />
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
              discount={history.discount}
              price={history.price}
              image={history.image}
              bgColor={history.bgColor}
              onPress={() =>
                router.push({
                  pathname: "/restaurant-detail",
                  params: { id: history.routeId },
                })
              }
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
