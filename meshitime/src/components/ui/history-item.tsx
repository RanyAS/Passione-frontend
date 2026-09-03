import { Pressable, Text, View, Image } from "react-native";
import { profileStyles as styles } from "../../styles/profile.styles";

type HistoryItemProps = {
  name: string;
  date: string;
  image: string;
  bgColor: string;
  reviewed: boolean;
  onPress: () => void;
  onReviewPress: () => void;
};

export default function HistoryItem({
  name,
  date,
  image,
  bgColor,
  reviewed,
  onPress,
  onReviewPress,
}: HistoryItemProps) {
  return (
    <Pressable style={styles.historyCard} onPress={onPress}>
    <View style={[styles.historyImage, { backgroundColor: bgColor }]}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.historyImagePhoto}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.historyIcon}>🍜</Text>
      )}
    </View>

      <View style={styles.historyInfo}>
        <Text style={styles.historyName}>{name}</Text>
        <Text style={styles.historyDate}>{date}</Text>
        <Pressable
            onPress={onReviewPress}
            disabled={reviewed}
            style={{
              marginTop: 6,
            }}
          >
            <Text
              style={{
                color: reviewed ? "#8E8E93" : "#2563EB",
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              {reviewed ? "✓ レビュー済み" : "レビューを書く"}
            </Text>
          </Pressable>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}