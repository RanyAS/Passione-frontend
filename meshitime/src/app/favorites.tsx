import { ScrollView, Text, View } from "react-native";
import FavoriteCard from "../components/ui/favorite-card";
import { favoriteStyles as styles } from "../styles/favorites.styles";


const favoriteRestaurants = [
  {
    id: 1,
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
  const handlePressRestaurant = (restaurantName: string) => {
    console.log(`${restaurantName} が押されました`);
  };

  const handlePressHeart = (restaurantName: string) => {
    console.log(`${restaurantName} のお気に入りを解除`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.backIcon}>←</Text>
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
            onPress={() => handlePressRestaurant(restaurant.name)}
            onPressHeart={() => handlePressHeart(restaurant.name)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
