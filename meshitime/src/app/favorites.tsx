import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMeshitime } from "../../provider/meshitime-provider";
import FavoriteCard from "../components/ui/favorite-card";
import { favoriteStyles as styles } from "../styles/favorites.styles";

const BG_COLORS = ["#FFDDB0", "#CFE5FF", "#FFD1D8", "#FFF0A8", "#F8CFE4"];

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, toggleFavorite } = useMeshitime();

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/HomeMapScreen")}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>お気に入り</Text>
            <Text style={styles.subtitle}>
              {favorites.length}件のレストラン
            </Text>
          </View>
        </View>

        {favorites.length === 0 ? (
          <View style={{ padding: 24, alignItems: "center" }}>
            <Text style={{ color: "#8E8E93" }}>
              お気に入りはまだありません
            </Text>
          </View>
        ) : (
          <View style={styles.cardGrid}>
            {favorites.map((restaurant, index) => (
              <FavoriteCard
                key={restaurant.id}
                name={restaurant.name}
                image={restaurant.emoji}
                rating={restaurant.rating}
                discount={restaurant.deal.discountLabel}
                price={restaurant.deal.dealPrice || restaurant.deal.availableSeats}
                isHotDeal={restaurant.pinPosition.active}
                bgColor={BG_COLORS[index % BG_COLORS.length]}
                onPress={() =>
                  router.push({
                    pathname: "/restaurant-detail",
                    params: { id: restaurant.id, source: "favorites" },
                  })
                }
                onPressHeart={() => toggleFavorite(restaurant.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
