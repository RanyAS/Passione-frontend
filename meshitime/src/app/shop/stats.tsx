import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shopStyles as styles } from "../../styles/shop.styles";

const weekStats = {
  confirmed: 42,
  pending: 5,
  failed: 7,
  acceptanceRate: "78%",
};

const topOffers = [
  { id: "1", title: "ランチ30%OFF", uses: 18 },
  { id: "2", title: "ディナー20%OFF", uses: 14 },
  { id: "3", title: "モーニング15%OFF", uses: 6 },
];

export default function ShopStatsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>統計</Text>
          <Text style={styles.subtitle}>今週のパフォーマンス</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{weekStats.confirmed}</Text>
            <Text style={styles.statLabel}>確定予約</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{weekStats.acceptanceRate}</Text>
            <Text style={styles.statLabel}>承認率</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{weekStats.pending}</Text>
            <Text style={styles.statLabel}>確認待ち</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{weekStats.failed}</Text>
            <Text style={styles.statLabel}>拒否/失敗</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>人気オファー</Text>
        {topOffers.map((offer) => (
          <View key={offer.id} style={styles.card}>
            <Text style={styles.cardTitle}>{offer.title}</Text>
            <Text style={styles.cardMeta}>利用 {offer.uses} 回</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
