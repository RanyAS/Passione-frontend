import { ScrollView, Text, View } from "react-native";
import HistoryItem from "../components/ui/history-item";
import { profileStyles as styles } from "../styles/profile.styles";
import SettingMenuItem from "../components/ui/setting-menu-item";

const histories = [
  {
    id: 1,
    name: "らーめん横丁",
    date: "2026年5月19日",
    discount: "-30%",
    price: 620,
    image: "🍜",
    bgColor: "#FFDDB0",
  },
  {
    id: 2,
    name: "寿司 銀座",
    date: "2026年5月17日",
    discount: "-25%",
    price: 2100,
    image: "🍣",
    bgColor: "#CFE5FF",
  },
  {
    id: 3,
    name: "イタリアン トラットリア",
    date: "2026年5月15日",
    discount: "-20%",
    price: 1200,
    image: "🍕",
    bgColor: "#FFD1D8",
  },
];

export default function ProfileScreen() {
  const handlePressHistory = (name: string) => {
    console.log(`${name} の履歴が押されました`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.settingIcon}>⚙</Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>TY</Text>
        </View>

        <Text style={styles.name}>田中 太郎</Text>
        <Text style={styles.email}>tanaka.taro@example.com</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>訪問数</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>お気に入り</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>レビュー</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>利用履歴</Text>

        <View style={styles.section}>
  <Text style={styles.sectionTitle}>設定</Text>

  <View style={styles.settingCard}>
    <SettingMenuItem
      icon="🔔"
      label="通知設定"
      iconColor="#2563EB"
      onPress={() => console.log("通知設定")}
    />

    <SettingMenuItem
      icon="💳"
      label="支払い方法"
      iconColor="#22C55E"
      onPress={() => console.log("支払い方法")}
    />

    <SettingMenuItem
      icon="?"
      label="ヘルプ・サポート"
      iconColor="#8B5CF6"
      onPress={() => console.log("ヘルプ・サポート")}
    />

    <SettingMenuItem
      icon="↪"
      label="ログアウト"
      iconColor="#EF4444"
      onPress={() => console.log("ログアウト")}
    />
  </View>

  <Text style={styles.versionText}>MESHITIME v1.0.0</Text>
</View>




        {histories.map((history) => (
          <HistoryItem
            key={history.id}
            name={history.name}
            date={history.date}
            discount={history.discount}
            price={history.price}
            image={history.image}
            bgColor={history.bgColor}
            onPress={() => handlePressHistory(history.name)}
          />
        ))}
      </View>
    </ScrollView>
  );
}