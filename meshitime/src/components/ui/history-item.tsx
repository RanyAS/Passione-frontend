import { Pressable, Text, View } from "react-native";
import { profileStyles as styles } from "../../styles/profile.styles";

type HistoryItemProps = {
  name: string;
  date: string;
  discount: string;
  price: number;
  image: string;
  bgColor: string;
  onPress: () => void;
};

export default function HistoryItem({
  name,
  date,
  discount,
  price,
  image,
  bgColor,
  onPress,
}: HistoryItemProps) {
  return (
    <Pressable style={styles.historyCard} onPress={onPress}>
      <View style={[styles.historyImage, { backgroundColor: bgColor }]}>
        <Text style={styles.historyIcon}>{image}</Text>
      </View>

      <View style={styles.historyInfo}>
        <Text style={styles.historyName}>{name}</Text>
        <Text style={styles.historyDate}>{date}</Text>

        <View style={styles.historyDealRow}>
          <Text style={styles.historyDiscount}>{discount}</Text>
          <Text style={styles.historyPrice}>¥{price.toLocaleString()}</Text>
        </View>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}