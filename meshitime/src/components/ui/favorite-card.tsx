import { Pressable, Text, View } from "react-native";
import { favoriteStyles as styles } from "../../styles/favorites.styles";

type FavoriteCardProps = {
  name: string;
  image: string;
  rating: number;
  discount: string;
  price: number;
  isHotDeal: boolean;
  bgColor: string;
  onPress: () => void;
  onPressHeart: () => void;
};

export default function FavoriteCard({
  name,
  image,
  rating,
  discount,
  price,
  isHotDeal,
  bgColor,
  onPress,
  onPressHeart,
}: FavoriteCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.imageArea, { backgroundColor: bgColor }]}>
        {isHotDeal && (
          <View style={styles.hotBadge}>
            <Text style={styles.hotBadgeText}>● 今すぐお得!</Text>
          </View>
        )}

        <Text style={styles.foodIcon}>{image}</Text>

        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.restaurantName}>{name}</Text>
        <Text style={styles.rating}>★ {rating}</Text>
        <Text style={styles.price}>¥{price.toLocaleString()}</Text>

        <Pressable
          style={styles.heartButton}
          onPress={(event) => {
            event.stopPropagation();
            onPressHeart();
          }}
        >
          <Text style={styles.heartText}>♥</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}