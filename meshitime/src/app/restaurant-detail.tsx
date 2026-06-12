import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * MESHITIME（めしタイム）— レストラン詳細画面 (RESTAURANT PROFILE)
 * Figma デザイン準拠:
 *  - 3D風イラストのヒーロー（パステルグラデ背景）
 *  - 戻る / お気に入り / シェア の3フローティングボタン
 *  - 重なる白カードに店名・英語名・星評価・住所/営業時間/電話
 *  - メニュー横スクロール / お得カード(赤) / レビュー
 *  - 下部固定の赤いCTA
 *
 * 検索結果から渡された id でお店を切り替える。
 */

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Review {
  id: string;
  userName: string;
  avatarInitial: string;
  rating: number;
  date: string;
  comment: string;
}

interface RestaurantDetail {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  heroColors: [string, string];
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  hours: string;
  phone: string;
  dealTitle: string;
  priceBefore: number;
  priceAfter: number;
  discountPercent: number;
  seatsLeft: number;
  minutesLeft: number;
  deadline: string;
  campaign: string;
  menu: MenuItem[];
  reviews: Review[];
}

const RESTAURANTS: Record<string, RestaurantDetail> = {
  "1": {
    id: "1",
    name: "吉野家 渋谷店",
    nameEn: "Yoshinoya Shibuya",
    emoji: "🍚",
    heroColors: ["#FFE3B3", "#FFB877"],
    category: "和食 · 牛丼",
    rating: 4.2,
    reviewCount: 156,
    address: "東京都渋谷区道玄坂 2-1-1",
    hours: "11:00 - 23:00",
    phone: "03-1234-5678",
    dealTitle: "牛丼セット",
    priceBefore: 890,
    priceAfter: 620,
    discountPercent: 30,
    seatsLeft: 4,
    minutesLeft: 23,
    deadline: "14:30まで",
    campaign: "ランチタイム限定オファー",
    menu: [
      { id: "m1", name: "牛丼 並盛", price: 468, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300" },
      { id: "m2", name: "牛丼セット", price: 890, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300" },
      { id: "m3", name: "豚丼", price: 530, image: "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=300" },
      { id: "m4", name: "唐揚げ定食", price: 690, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300" },
    ],
    reviews: [
      { id: "r1", userName: "田中 健太", avatarInitial: "田", rating: 5, date: "2日前", comment: "ランチタイムにお得な価格で食べられて満足です。スタッフの対応も丁寧で、また来ます！" },
      { id: "r2", userName: "山田 美咲", avatarInitial: "山", rating: 4, date: "1週間前", comment: "渋谷駅から近くて便利。お得情報のおかげで30%オフで食べられました。" },
      { id: "r3", userName: "佐藤 大輔", avatarInitial: "佐", rating: 4, date: "2週間前", comment: "味は安定の吉野家。アプリの割引が効くのが嬉しい。" },
    ],
  },
  "2": {
    id: "2",
    name: "らーめん 一蘭",
    nameEn: "Ichiran Ramen",
    emoji: "🍜",
    heroColors: ["#FFE0A8", "#FF9F6B"],
    category: "和食 · ラーメン",
    rating: 4.6,
    reviewCount: 482,
    address: "東京都渋谷区神南 1-22-7",
    hours: "10:00 - 翌5:00",
    phone: "03-2345-6789",
    dealTitle: "替玉無料キャンペーン",
    priceBefore: 1180,
    priceAfter: 980,
    discountPercent: 17,
    seatsLeft: 2,
    minutesLeft: 45,
    deadline: "15:00まで",
    campaign: "ランチタイム限定 替玉1玉サービス",
    menu: [
      { id: "m1", name: "天然とんこつ", price: 980, image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=300" },
      { id: "m2", name: "チャーシュー追加", price: 280, image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=300" },
      { id: "m3", name: "替玉", price: 200, image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=300" },
      { id: "m4", name: "おにぎり", price: 150, image: "https://images.unsplash.com/photo-1607301405390-d831c242f59b?w=300" },
    ],
    reviews: [
      { id: "r1", userName: "鈴木 翔", avatarInitial: "鈴", rating: 5, date: "1日前", comment: "スープが濃厚で美味しい！替玉無料はありがたいです。" },
      { id: "r2", userName: "高橋 由美", avatarInitial: "高", rating: 5, date: "3日前", comment: "個室席で一人でも気軽に入れる。深夜まで営業してるのも便利。" },
      { id: "r3", userName: "中村 健", avatarInitial: "中", rating: 4, date: "1週間前", comment: "味のカスタマイズができるのが嬉しい。" },
    ],
  },
  "3": {
    id: "3",
    name: "トラットリア ソーレ",
    nameEn: "Trattoria Sole",
    emoji: "🍝",
    heroColors: ["#FFE0D0", "#FF8A65"],
    category: "洋食 · イタリアン",
    rating: 4.4,
    reviewCount: 98,
    address: "東京都渋谷区代官山町 5-7",
    hours: "11:30 - 22:00",
    phone: "03-3456-7890",
    dealTitle: "ランチパスタセット",
    priceBefore: 1500,
    priceAfter: 1050,
    discountPercent: 30,
    seatsLeft: 6,
    minutesLeft: 12,
    deadline: "14:00まで",
    campaign: "パスタ + サラダ + ドリンク",
    menu: [
      { id: "m1", name: "カルボナーラ", price: 1300, image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300" },
      { id: "m2", name: "ペペロンチーノ", price: 1100, image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300" },
      { id: "m3", name: "マルゲリータ", price: 1400, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300" },
      { id: "m4", name: "ティラミス", price: 600, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300" },
    ],
    reviews: [
      { id: "r1", userName: "小林 さくら", avatarInitial: "小", rating: 5, date: "4日前", comment: "本格的なイタリアン！パスタのソースが絶品でした。" },
      { id: "r2", userName: "伊藤 隆", avatarInitial: "伊", rating: 4, date: "1週間前", comment: "コスパが良く、雰囲気も素敵です。" },
      { id: "r3", userName: "渡辺 美紀", avatarInitial: "渡", rating: 4, date: "2週間前", comment: "デザートまで美味しい。デートにもおすすめ。" },
    ],
  },
  "4": {
    id: "4",
    name: "寿司処 海",
    nameEn: "Sushi Kai",
    emoji: "🍣",
    heroColors: ["#D6ECFF", "#7FB5E6"],
    category: "和食 · 寿司",
    rating: 4.8,
    reviewCount: 210,
    address: "東京都渋谷区恵比寿 1-8-3",
    hours: "17:00 - 23:30",
    phone: "03-4567-8901",
    dealTitle: "握り10貫 おまかせ",
    priceBefore: 2400,
    priceAfter: 1680,
    discountPercent: 30,
    seatsLeft: 1,
    minutesLeft: 58,
    deadline: "19:00まで",
    campaign: "本日のおすすめネタを使用",
    menu: [
      { id: "m1", name: "握り10貫", price: 2400, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300" },
      { id: "m2", name: "マグロ三昧", price: 1800, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300" },
      { id: "m3", name: "ちらし寿司", price: 1500, image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300" },
      { id: "m4", name: "茶碗蒸し", price: 400, image: "https://images.unsplash.com/photo-1617622141533-ddef9bb0648f?w=300" },
    ],
    reviews: [
      { id: "r1", userName: "加藤 翼", avatarInitial: "加", rating: 5, date: "1日前", comment: "ネタが新鮮で本当に美味しかった。30%オフは衝撃！" },
      { id: "r2", userName: "吉田 真理", avatarInitial: "吉", rating: 5, date: "5日前", comment: "大将の握りが最高です。また来たい。" },
      { id: "r3", userName: "松本 翔太", avatarInitial: "松", rating: 4, date: "1週間前", comment: "カウンター席で握りたてが食べられて満足です。" },
    ],
  },
};

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

const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => (
  <TouchableOpacity activeOpacity={0.85} style={styles.menuCard}>
    <Image source={{ uri: item.image }} style={styles.menuImage} />
    <Text style={styles.menuName} numberOfLines={1}>
      {item.name}
    </Text>
    <Text style={styles.menuPrice}>¥{item.price.toLocaleString()}</Text>
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
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ?? "1";
  const r = RESTAURANTS[id] ?? RESTAURANTS["1"];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Hero（3D風イラスト + パステルグラデ） ===== */}
        <View style={[styles.hero, { backgroundColor: r.heroColors[1] }]}>
          <View style={[styles.heroTop, { backgroundColor: r.heroColors[0] }]} />
          <Text style={styles.heroEmoji}>{r.emoji}</Text>

          {/* フローティングボタン */}
          <TouchableOpacity
            style={[styles.fab, styles.fabLeft]}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Text style={styles.fabIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.fabRightGroup}>
            <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
              <Text style={[styles.fabIcon, { color: RED }]}>♡</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
              <Text style={styles.fabIcon}>↗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== 重なる白カード ===== */}
        <View style={styles.sheet}>
          <View style={styles.nameCard}>
            <Text style={styles.title}>{r.name}</Text>
            <Text style={styles.subtitle}>{r.nameEn}</Text>

            <View style={styles.ratingRow}>
              <Stars rating={r.rating} size={15} />
              <Text style={styles.ratingValue}>{r.rating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>
                ({r.reviewCount}件のレビュー)
              </Text>
            </View>

            <View style={styles.divider} />

            <ContactRow icon="📍" text={r.address} />
            <ContactRow icon="🕐" text={r.hours} />
            <ContactRow icon="📞" text={r.phone} />
          </View>

          {/* ===== お得情報カード（赤強調） ===== */}
          <View style={styles.dealCard}>
            <View style={styles.dealHeader}>
              <Text style={styles.dealHeaderText}>🔥 本日のお得情報</Text>
              <View style={styles.countdownChip}>
                <Text style={styles.countdownText}>⏰ あと {r.minutesLeft}分</Text>
              </View>
            </View>

            <Text style={styles.dealTitle}>{r.dealTitle}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceBefore}>
                ¥{r.priceBefore.toLocaleString()}
              </Text>
              <Text style={styles.priceArrow}>→</Text>
              <Text style={styles.priceAfter}>
                ¥{r.priceAfter.toLocaleString()}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>
                  -{r.discountPercent}%
                </Text>
              </View>
            </View>

            <View style={styles.dealMetaRow}>
              <Text style={styles.dealMeta}>🪑 空席 {r.seatsLeft}席</Text>
              <Text style={styles.dealMeta}>⏰ {r.deadline}</Text>
            </View>
            <Text style={styles.dealCampaign}>🎯 {r.campaign}</Text>
          </View>

          {/* ===== メニュー（横スクロール） ===== */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>メニュー</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>すべて見る ›</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.menuScroll}
          >
            {r.menu.map((m) => (
              <MenuCard key={m.id} item={m} />
            ))}
          </ScrollView>

          {/* ===== レビュー ===== */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>レビュー</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>すべて見る ›</Text>
            </TouchableOpacity>
          </View>
          {r.reviews.map((rev) => (
            <ReviewCard key={rev.id} item={rev} />
          ))}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* ===== 下部固定CTA ===== */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.ctaSecondary} activeOpacity={0.85}>
          <Text style={styles.ctaSecondaryText}>🗺 ルート案内</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaPrimary} activeOpacity={0.85}>
          <Text style={styles.ctaPrimaryText}>今すぐ予約</Text>
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
