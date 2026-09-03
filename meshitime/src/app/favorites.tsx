import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAllFavStore } from "@/api/favoriteApi";
import type { FavWithStore } from "@/types/Favorite";
import FavoriteCard from "../components/ui/favorite-card";
import { favoriteStyles as styles } from "../styles/favorites.styles";

const BG_COLORS = ["#FFDDB0", "#CFE5FF", "#FFD1D8", "#FFF0A8", "#F8CFE4"];

function getStoreImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  const { data } = supabase.storage
    .from("stores-images")
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState<FavWithStore[]>([]);

  useEffect(() => {
  const loadFavorites = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userId = session?.user.id;

      if (!userId) {
        setFavorites([]);
        return;
      }

      const data = await getAllFavStore(userId);

      setFavorites(data);
    } catch (error) {
      console.error("❌ Failed to load favorites:", error);
      setFavorites([]);
    }
  };

  void loadFavorites();
}, []);
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
            {favorites.map((favorite, index) => {
            return (
              <FavoriteCard
                key={favorite.id}
                name={favorite.stores.sname}
                image={getStoreImageUrl(favorite.stores.image_path)}
                rating={favorite.stores.star}
                genre={favorite.stores.genre?.gname ?? "その他"}
                bgColor={BG_COLORS[index % BG_COLORS.length]}
                onPress={() =>
                  router.push({
                    pathname: "/restaurant-detail",
                    params: {
                      id: favorite.store_id,
                      source: "favorites",
                    },
                  })
                }
                onPressHeart={() => {
                  // sementara kosong
                }}
              />
            );
          })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
