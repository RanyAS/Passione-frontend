import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * MESHITIME（めしタイム）— 検索結果画面 (RESULTS LIST)
 * カードをタップすると restaurant-detail へ id を渡して遷移する。
 */

type Category = "すべて" | "近く" | "和食" | "洋食" | "人気";

interface Restaurant {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  distanceText: string;
  dealTitle: string;
  priceBefore: number;
  priceAfter: number;
  discountPercent: number;
  seatsLeft: number;
  minutesLeft: number;
}

const FILTERS: { label: Category; icon: string }[] = [
  { label: "すべて", icon: "🍜" },
  { label: "近く", icon: "📍" },
  { label: "和食", icon: "🍣" },
  { label: "洋食", icon: "🍕" },
  { label: "人気", icon: "⭐" },
];

export const RESULTS: Restaurant[] = [
  {
    id: "1",
    name: "吉野家 渋谷店",
    nameEn: "Yoshinoya Shibuya",
    category: "和食",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    rating: 4.2,
    reviewCount: 156,
    distanceText: "徒歩 4分",
    dealTitle: "牛丼セット",
    priceBefore: 890,
    priceAfter: 620,
    discountPercent: 30,
    seatsLeft: 4,
    minutesLeft: 23,
  },
  {
    id: "2",
    name: "らーめん 一蘭",
    nameEn: "Ichiran Ramen",
    category: "和食",
    image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400",
    rating: 4.6,
    reviewCount: 482,
    distanceText: "徒歩 7分",
    dealTitle: "替玉無料キャンペーン",
    priceBefore: 1180,
    priceAfter: 980,
    discountPercent: 17,
    seatsLeft: 2,
    minutesLeft: 45,
  },
  {
    id: "3",
    name: "トラットリア ソーレ",
    nameEn: "Trattoria Sole",
    category: "洋食",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
    rating: 4.4,
    reviewCount: 98,
    distanceText: "徒歩 9分",
    dealTitle: "ランチパスタセット",
    priceBefore: 1500,
    priceAfter: 1050,
    discountPercent: 30,
    seatsLeft: 6,
    minutesLeft: 12,
  },
  {
    id: "4",
    name: "寿司処 海",
    nameEn: "Sushi Kai",
    category: "和食",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    rating: 4.8,
    reviewCount: 210,
    distanceText: "徒歩 11分",
    dealTitle: "握り10貫 おまかせ",
    priceBefore: 2400,
    priceAfter: 1680,
    discountPercent: 30,
    seatsLeft: 1,
    minutesLeft: 58,
  },
];

const CountdownChip: React.FC<{ minutes: number }> = ({ minutes }) => {
  const urgent = minutes <= 15;
  return (
    <View style={[styles.countdownChip, urgent && styles.countdownChipUrgent]}>
      <Text style={styles.countdownIcon}>⏰</Text>
      <Text
        style={[styles.countdownText, urgent && styles.countdownTextUrgent]}
      >
        あと {minutes}分
      </Text>
    </View>
  );
};

const DiscountBadge: React.FC<{ percent: number }> = ({ percent }) => (
  <View style={styles.discountBadge}>
    <Text style={styles.discountBadgeText}>-{percent}%</Text>
  </View>
);

const RestaurantCard: React.FC<{ item: Restaurant; onPress: () => void }> = ({
  item,
  onPress,
}) => (
  <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
    <View style={styles.cardImageWrap}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <DiscountBadge percent={item.discountPercent} />
    </View>

    <View style={styles.cardBody}>
      <View style={styles.cardTopRow}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <CountdownChip minutes={item.minutesLeft} />
      </View>

      <Text style={styles.cardNameEn} numberOfLines={1}>
        {item.nameEn}
      </Text>

      <View style={styles.dealRow}>
        <Text style={styles.dealTitle} numberOfLines={1}>
          🍱 {item.dealTitle}
        </Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceBefore}>
          ¥{item.priceBefore.toLocaleString()}
        </Text>
        <Text style={styles.priceArrow}>→</Text>
        <Text style={styles.priceAfter}>
          ¥{item.priceAfter.toLocaleString()}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaStar}>★</Text>
          <Text style={styles.metaText}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.metaSub}>({item.reviewCount})</Text>
        </View>
        <View style={styles.metaDot} />
        <Text style={styles.metaText}>🪑 空席 {item.seatsLeft}席</Text>
        <View style={styles.metaDot} />
        <Text style={styles.metaText}>{item.distanceText}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const SearchResultsScreen: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Category>("すべて");

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.headerTitle}>検索結果</Text>
            <Text style={styles.headerSubtitle}>
              {RESULTS.length}件のお得情報が見つかりました
            </Text>
          </View>

          <View style={styles.viewToggle}>
            <View style={[styles.viewToggleBtn, styles.viewToggleBtnInactive]}>
              <Text style={styles.viewToggleIconInactive}>🗺</Text>
            </View>
            <View style={[styles.viewToggleBtn, styles.viewToggleBtnActive]}>
              <Text style={styles.viewToggleIconActive}>☰</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="レストランを探す..."
            placeholderTextColor="#8E8E93"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Text style={styles.searchClear}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f.label;
            return (
              <TouchableOpacity
                key={f.label}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(f.label)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={styles.chipIcon}>{f.icon}</Text>
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>締切が近い順</Text>
          <TouchableOpacity>
            <Text style={styles.sortAction}>並び替え ⌄</Text>
          </TouchableOpacity>
        </View>

        {RESULTS.map((item) => (
          <RestaurantCard
            key={item.id}
            item={item}
            onPress={() =>
              router.push({
                pathname: "/restaurant-detail",
                params: { id: item.id },
              })
            }
          />
        ))}

        <Text style={styles.listFooter}>すべての結果を表示しました</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchResultsScreen;

const RED = "#FF3B30";
const BLACK = "#1C1C1E";
const YELLOW = "#FFD60A";
const BG = "#F2F2F7";
const ORANGE = "#FF9500";

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
  safeArea: { flex: 1, backgroundColor: BG },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...cardShadow,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: BLACK },
  headerSubtitle: { fontSize: 13, color: "#8E8E93", marginTop: 2 },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: BG,
    borderRadius: 999,
    padding: 3,
  },
  viewToggleBtn: {
    width: 38,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  viewToggleBtnActive: { backgroundColor: RED },
  viewToggleBtnInactive: { backgroundColor: "transparent" },
  viewToggleIconActive: { fontSize: 16, color: "#FFFFFF" },
  viewToggleIconInactive: { fontSize: 16, color: "#8E8E93" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: BLACK, padding: 0 },
  searchClear: { fontSize: 13, color: "#8E8E93", paddingHorizontal: 4 },
  chipRow: { paddingTop: 12, paddingRight: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: { backgroundColor: RED },
  chipIcon: { fontSize: 14, marginRight: 5 },
  chipText: { fontSize: 13, fontWeight: "600", color: "#3A3A3C" },
  chipTextActive: { color: "#FFFFFF" },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sortLabel: { fontSize: 13, fontWeight: "600", color: BLACK },
  sortAction: { fontSize: 13, fontWeight: "600", color: RED },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    ...cardShadow,
  },
  cardImageWrap: { position: "relative", marginRight: 12 },
  cardImage: { width: 96, height: 96, borderRadius: 12, backgroundColor: BG },
  cardBody: { flex: 1, justifyContent: "space-between" },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: BLACK,
    marginRight: 8,
  },
  cardNameEn: { fontSize: 11, color: "#8E8E93", marginTop: 1, marginBottom: 6 },
  discountBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: RED,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountBadgeText: { fontSize: 11, fontWeight: "800", color: "#FFFFFF" },
  countdownChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4E5",
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  countdownChipUrgent: { backgroundColor: "#FFE5E3" },
  countdownIcon: { fontSize: 10, marginRight: 3 },
  countdownText: { fontSize: 11, fontWeight: "700", color: ORANGE },
  countdownTextUrgent: { color: RED },
  dealRow: { marginBottom: 2 },
  dealTitle: { fontSize: 12, color: "#3A3A3C", fontWeight: "500" },
  priceRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  priceBefore: {
    fontSize: 12,
    color: "#8E8E93",
    textDecorationLine: "line-through",
  },
  priceArrow: { fontSize: 12, color: "#8E8E93", marginHorizontal: 4 },
  priceAfter: { fontSize: 16, fontWeight: "800", color: RED },
  metaRow: { flexDirection: "row", alignItems: "center" },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaStar: { fontSize: 11, color: YELLOW, marginRight: 2 },
  metaText: { fontSize: 11, color: "#3A3A3C", fontWeight: "500" },
  metaSub: { fontSize: 11, color: "#8E8E93", marginLeft: 1 },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#C7C7CC",
    marginHorizontal: 6,
  },
  listFooter: {
    textAlign: "center",
    fontSize: 12,
    color: "#C7C7CC",
    marginTop: 8,
  },
});
