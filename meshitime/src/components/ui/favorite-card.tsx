import { Pressable, Text, View, Image } from "react-native";
import { favoriteStyles as styles } from "../../styles/favorites.styles";
import { supabase } from "@/lib/supabase";

type FavoriteCardProps = {
  name: string;
  image: string | null;
  rating: number;
  genre: string;
  bgColor: string;
  onPress: () => void;
  onPressHeart: () => void;
};

export default function FavoriteCard({
  name,
  image,
  rating,
  genre,
  bgColor,
  onPress,
  onPressHeart,
}: FavoriteCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>

      <View style={[styles.imageArea, { backgroundColor: bgColor }]}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.foodIcon}>🍽️</Text>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.restaurantName}>{name}</Text>
        <Text style={styles.rating}>★ {rating}</Text>
        <Text style={styles.price}>{genre}</Text>

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