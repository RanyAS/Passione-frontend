import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getStorePin } from "@/api/StorePinApi";
import { getReview } from "@/api/reviewApi";
import type { StorePin } from "@/types/StorePin";
import type { Review as ApiReview } from "@/types/Review";
import { supabase } from "@/lib/supabase";
import { getAllMenu } from "@/api/menuApi";
import { Menu } from "@/types/Menu";

interface Review {
  id: string;
  userName: string;
  avatarInitial: string;
  rating: number;
  date: string;
  comment: string;
}

function parseDiscountPercent(rule: string | null): number {
  if (!rule) return 0;
  const match = rule.match(/(\d+)\s*%/);
  return match ? Number(match[1]) : 0;
}

function minutesUntil(endsAt: string | null): number {
  if (!endsAt) return 0;
  const diff = new Date(endsAt).getTime() - Date.now();
  return Math.max(0, Math.round(diff / 60000));
}

function getStoreImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const { data } = supabase.storage
    .from("stores-images")
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

function getMenuImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  const { data } = supabase.storage
    .from("store-menu")
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

function mapReviews(rows: ApiReview[]): Review[] {
  return rows.map((row) => ({
    id: row.id,
    userName: row.user_id.slice(0, 8),
    avatarInitial: "U",
    rating: row.star,
    date: new Date(row.created_at).toLocaleDateString("ja-JP"),
    comment: row.comment,
  }));
}

const Stars: React.FC<{ rating: number; size?: number }> = ({
  rating,
  size = 14,
}) => {
  const filled = Math.round(rating);
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Text
          key={n}
          style={[
            { fontSize: size, marginRight: 1 },
            n <= filled ? styles.starFilled : styles.starEmpty,
          ]}
        >
          ★
        </Text>
      ))}
    </View>
  );
};

const ContactRow: React.FC<{ icon: string; text: string }> = ({
  icon,
  text,
}) => (
  <View style={styles.contactRow}>
    <Text style={styles.contactIcon}>{icon}</Text>
    <Text style={styles.contactText}>{text}</Text>
  </View>
);

const MenuCard: React.FC<{ item: Menu }> = ({ item }) => (
  <TouchableOpacity activeOpacity={0.85} style={styles.menuCard}>
    {item.image_path ? (
      <Image
        source={{ uri: getMenuImageUrl(item.image_path) ?? undefined }}
        style={styles.menuImage}
        resizeMode="cover"
      />
    ) : (
      <View style={styles.menuImagePlaceholder}>
        <Text style={{ fontSize: 32 }}>🍽️</Text>
      </View>
    )}

    <Text style={styles.menuName} numberOfLines={1}>
      {item.mname}
    </Text>

    <Text style={styles.menuPrice}>
      ¥{item.price.toLocaleString()}
    </Text>

    {item.description ? (
      <Text style={styles.menuDescription} numberOfLines={2}>
        {item.description}
      </Text>
    ) : null}
  </TouchableOpacity>
);

const ReviewCard: React.FC<{ item: Review }> = ({ item }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.avatarInitial}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.reviewName}>{item.userName}</Text>
        <View style={styles.reviewMeta}>
          <Stars rating={item.rating} size={11} />
          <Text style={styles.reviewDate}>· {item.date}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.reviewComment}>{item.comment}</Text>
  </View>
);

const RestaurantDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; source?: string }>();
  const id = params.id ?? "";
  const [pin, setPin] = useState<StorePin | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) {
        setError("店舗が見つかりません");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const pinData = await getStorePin(id);
        if (cancelled) return;
        setPin(pinData);
        try {
          const menuRows = await getAllMenu(pinData.storeId);
          if (!cancelled) {
            setMenus(menuRows);
          }
        } catch (error) {
          console.error("❌ Failed to load menus:", error);
          if (!cancelled) {
            setMenus([]);
          }
        }
        try {
          const reviewRows = await getReview(pinData.storeId);
          if (!cancelled) setReviews(mapReviews(reviewRows));
        } catch {
          if (!cancelled) setReviews([]);
        }
      } catch {
        if (!cancelled) {
          setPin(null);
          setError("店舗情報の取得に失敗しました");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const view = useMemo(() => {
    if (!pin) return null;
    const discountPercent = parseDiscountPercent(pin.rule);
    return {
      name: pin.store?.name ?? "店舗",
      nameEn: pin.store?.name ?? "",
      emoji: "🍜",
      heroColors: ["#FFE3B3", "#FFB877"] as [string, string],
      rating: pin.store?.star ?? 0,
      reviewCount: reviews.length,
      address: pin.store?.address ?? "未設定",
      hours: pin.store?.openTime ?? "未設定",
      phone: pin.store?.tel ?? "未設定",
      dealTitle: pin.description ?? "オファー",
      discountPercent,
      seatsLeft: pin.emptySeat,
      minutesLeft: minutesUntil(pin.endsAt),
      deadline:
        pin.time ??
        (pin.endsAt
          ? new Date(pin.endsAt).toLocaleString("ja-JP")
          : "時間未設定"),
      campaign: pin.rule ?? pin.description ?? "",
      menu: menus,
      imagePath: getStoreImageUrl(pin.store?.imagePath ?? null),
    };
  }, [pin, reviews.length, menus]);

  const handleBackPress = () => {
    if (params.source === "favorites") {
      router.push("/favorites");
      return;
    }
    router.back();
  };

  if (loading) {
    return (
      <View
        style={[
          styles.root,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !view || !pin) {
    return (
      <View
        style={[
          styles.root,
          {
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          },
        ]}
      >
        <Text style={{ marginBottom: 16 }}>
          {error ?? "店舗が見つかりません"}
        </Text>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={{ color: RED, fontWeight: "700" }}>戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: view.heroColors[1] }]}>
          <View
            style={[styles.heroTop, { backgroundColor: view.heroColors[0] }]}
          />
          {view.imagePath ? (
            <Image
              source={{ uri: view.imagePath }}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.heroEmoji}>{view.emoji}</Text>
          )}

          <TouchableOpacity
            style={[styles.fab, styles.fabLeft]}
            activeOpacity={0.85}
            onPress={handleBackPress}
          >
            <Text style={styles.fabIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.fabRightGroup}>
            <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
              <Text style={[styles.fabIcon, { color: RED }]}>♡</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.nameCard}>
            <Text style={styles.title}>{view.name}</Text>
            <Text style={styles.subtitle}>{view.nameEn}</Text>

            <View style={styles.ratingRow}>
              <Stars rating={view.rating} size={15} />
              <Text style={styles.ratingValue}>
                {view.rating ? view.rating.toFixed(1) : "-"}
              </Text>
              <Text style={styles.ratingCount}>
                ({view.reviewCount}件のレビュー)
              </Text>
            </View>

            <View style={styles.divider} />

            <ContactRow icon="📍" text={view.address} />
            <ContactRow icon="🕐" text={view.hours} />
            <ContactRow icon="📞" text={view.phone} />
          </View>

          <View style={styles.dealCard}>
            <View style={styles.dealHeader}>
              <Text style={styles.dealHeaderText}>🔥 本日のお得情報</Text>
              {view.minutesLeft > 0 ? (
                <View style={styles.countdownChip}>
                  <Text style={styles.countdownText}>
                    ⏰ あと {view.minutesLeft}分
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.dealTitle}>{view.dealTitle}</Text>
            {view.discountPercent > 0 ? (
              <View style={styles.priceRow}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>
                    -{view.discountPercent}%
                  </Text>
                </View>
              </View>
            ) : null}

            <View style={styles.dealMetaRow}>
              <Text style={styles.dealMeta}>🪑 空席 {view.seatsLeft}席</Text>
              <Text style={styles.dealMeta}>⏰ {view.deadline}</Text>
            </View>
            {view.campaign ? (
              <Text style={styles.dealCampaign}>🎯 {view.campaign}</Text>
            ) : null}
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>メニュー</Text>
          </View>
          {view.menu.length === 0 ? (
            <Text style={{ color: "#8E8E93", marginBottom: 20 }}>
              メニュー情報はありません
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.menuScroll}
            >
              {view.menu.map((m) => (
                <MenuCard key={m.id} item={m} />
              ))}
            </ScrollView>
          )}

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>レビュー</Text>
          </View>
          {reviews.length === 0 ? (
            <Text style={{ color: "#8E8E93", marginBottom: 20 }}>
              まだレビューがありません
            </Text>
          ) : (
            reviews.map((rev) => <ReviewCard key={rev.id} item={rev} />)
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.ctaSecondary} activeOpacity={0.85}>
          <Text style={styles.ctaSecondaryText}>🗺 ルート案内</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/ConfirmationScreen",
              params: { storeId: pin.storeId, pinId: pin.id, partySize: "1" },
            })
          }
          style={styles.ctaPrimary}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaPrimaryText}>今すぐ予約 </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RestaurantDetailScreen;

const RED = "#FF3B30";
const BLACK = "#1C1C1E";
const YELLOW = "#FFD60A";
const BG = "#F2F2F7";
const WHITE = "#FFFFFF";

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // ----- Hero -----
  hero: {
    width: "100%",
    height: 320,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  heroEmoji: {
    fontSize: 110,
    marginTop: 10,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
    ...cardShadow,
  },
  fabLeft: {
    position: "absolute",
    top: 50,
    left: 16,
  },
  fabRightGroup: {
    position: "absolute",
    top: 50,
    right: 16,
    flexDirection: "row",
    gap: 10,
  },
  fabIcon: { fontSize: 20, color: BLACK, fontWeight: "600" },

  // ----- Sheet -----
  sheet: {
    backgroundColor: BG,
    marginTop: -28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  nameCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    marginBottom: 16,
    ...cardShadow,
  },
  title: { fontSize: 24, fontWeight: "800", color: BLACK },
  subtitle: { fontSize: 13, color: "#8E8E93", marginTop: 2, marginBottom: 10 },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: BLACK,
    marginLeft: 6,
  },
  ratingCount: { fontSize: 12, color: "#8E8E93", marginLeft: 6 },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F2",
    marginVertical: 14,
  },
  contactRow: { flexDirection: "row", alignItems: "center", paddingVertical: 5 },
  contactIcon: { fontSize: 14, width: 26, color: "#8E8E93" },
  contactText: { fontSize: 14, color: "#3A3A3C", fontWeight: "500" },

  // ----- Deal card -----
  dealCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: RED,
    ...cardShadow,
  },
  dealHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dealHeaderText: { fontSize: 13, fontWeight: "700", color: RED },
  countdownChip: {
    backgroundColor: "#FFE5E3",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  countdownText: { fontSize: 11, fontWeight: "700", color: RED },
  dealTitle: { fontSize: 17, fontWeight: "700", color: BLACK, marginBottom: 8 },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  priceBefore: {
    fontSize: 14,
    color: "#8E8E93",
    textDecorationLine: "line-through",
  },
  priceArrow: { fontSize: 14, color: "#8E8E93", marginHorizontal: 6 },
  priceAfter: { fontSize: 24, fontWeight: "800", color: RED },
  discountBadge: {
    backgroundColor: RED,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
  },
  discountBadgeText: { fontSize: 12, fontWeight: "800", color: WHITE },
  dealMetaRow: { flexDirection: "row", gap: 16, marginBottom: 6 },
  dealMeta: { fontSize: 13, color: "#3A3A3C", fontWeight: "600" },
  dealCampaign: { fontSize: 13, color: "#8E8E93" },

  // ----- Section -----
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: BLACK },
  sectionAction: { fontSize: 13, fontWeight: "600", color: RED },

  // ----- Menu -----
  menuScroll: { paddingRight: 16, marginBottom: 20 },
  menuCard: {
    width: 130,
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    ...cardShadow,
  },
  menuImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    backgroundColor: BG,
    marginBottom: 8,
  },
  menuName: { fontSize: 13, fontWeight: "600", color: BLACK, marginBottom: 2 },
  menuPrice: { fontSize: 13, fontWeight: "700", color: RED },
  menuImagePlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  menuDescription: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 17,
    marginTop: 4,
  },

  // ----- Review -----
  reviewCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    ...cardShadow,
  },
  reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#FFE5E3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: { fontSize: 15, fontWeight: "700", color: RED },
  reviewName: { fontSize: 14, fontWeight: "700", color: BLACK },
  reviewMeta: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  reviewDate: { fontSize: 11, color: "#8E8E93", marginLeft: 6 },
  reviewComment: { fontSize: 13, color: "#3A3A3C", lineHeight: 19 },

  // ----- Stars -----
  starsRow: { flexDirection: "row" },
  starFilled: { color: YELLOW },
  starEmpty: { color: "#E5E5EA" },

  // ----- Bottom CTA -----
  bottomBar: {
    flexDirection: "row",
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    gap: 10,
  },
  ctaSecondary: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
  },
  ctaSecondaryText: { fontSize: 14, fontWeight: "600", color: BLACK },
  ctaPrimary: {
    flex: 1.5,
    height: 50,
    borderRadius: 12,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaPrimaryText: { fontSize: 15, fontWeight: "800", color: WHITE },
});
