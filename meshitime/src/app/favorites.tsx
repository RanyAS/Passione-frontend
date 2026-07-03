import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FavoriteCard from "../components/ui/favorite-card";
import { favoriteStyles as styles } from "../styles/favorites.styles";
import { router } from "expo-router";


const favoriteRestaurants = [
  {
    id: 1,
    routeId: "1",
    name: "ラーメン横丁",
    image: "🍜",
    rating: 4.2,
    discount: "-30%",
    price: 620,
    isHotDeal: true,
    bgColor: "#FFDDB0",
  },
   {
    id: 2,
    routeId: "2",
    name: "寿司 銀座",
    image: "🍣",
    rating: 4.5,
    discount: "-25%",
    price: 2100,
    isHotDeal: true,
    bgColor: "#CFE5FF",
  },
  {
    id: 3,
    routeId: "3",
    name: "イタリアン",
    image: "🍕",
    rating: 4.3,
    discount: "-20%",
    price: 1200,
    isHotDeal: false,
    bgColor: "#FFD1D8",
  },
  {
    id: 4,
    routeId: "4",
    name:"カフェモーニング",
    image:"☕",
    rating: 4.1,
    discount: "-15%",
    price: 680,
    isHotDeal: true,
    bgColor: "#FFF0A8",
  },
  {
    id: 5,
    routeId: "1",
    name: "焼肉 炎",
    image: "🥩",
    rating: 4.4,
    discount: "-20%",
    price: 2500,
    isHotDeal: false,
    bgColor: "#F8CFE4",
  },
  {
    id: 6,
    routeId: "2",
    name: "天ぷら さくら",
    image: "🍤",
    rating: 4.6,
    discount: "-10%",
    price: 1800,
    isHotDeal: true,
    bgColor: "#FFF2A6",
  },
]

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();

  const handlePressRestaurant = (routeId: string) => {
    router.push({
      pathname: "/restaurant-detail",
      params: { id: routeId, source: "favorites" },
    });
  };

  const handlePressHeart = (restaurantName: string) => {
    console.log(`${restaurantName} のお気に入りを解除`);
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/HomeMapScreen')}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>お気に入り</Text>
            <Text style={styles.subtitle}>
              {favoriteRestaurants.length}件のレストラン
            </Text>
          </View>
        </View>

        <View style={styles.cardGrid}>
          {favoriteRestaurants.map((restaurant) => (
            <FavoriteCard
              key={restaurant.id}
              name={restaurant.name}
              image={restaurant.image}
              rating={restaurant.rating}
              discount={restaurant.discount}
              price={restaurant.price}
              isHotDeal={restaurant.isHotDeal}
              bgColor={restaurant.bgColor}
              onPress={() => handlePressRestaurant(restaurant.routeId)}
              onPressHeart={() => handlePressHeart(restaurant.name)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
