import { router } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import HistoryItem from "../components/ui/history-item";
import SettingMenuItem from "../components/ui/setting-menu-item";
import { profileStyles as styles } from "../styles/profile.styles";

const histories = [
  {
    id: 1,
    routeId: "1",
    name: "らーめん横丁",
    date: "2026年5月19日",
    discount: "-30%",
    price: 620,
    image: "🍜",
    bgColor: "#FFDDB0",
  },
  {
    id: 2,
    routeId: "2",
    name: "寿司 銀座",
    date: "2026年5月17日",
    discount: "-25%",
    price: 2100,
    image: "🍣",
    bgColor: "#CFE5FF",
  },
  {
    id: 3,
    routeId: "3",
    name: "イタリアン トラットリア",
    date: "2026年5月15日",
    discount: "-20%",
    price: 1200,
    image: "🍕",
    bgColor: "#FFD1D8",
  },
];

export default function ProfileScreen() {
  const [isSettingModalVisible, setSettingModalVisible] = useState(false);

  const handlePressHistory = (routeId: string) => {
    router.push({
      pathname: "/restaurant-detail",
      params: { id: routeId },
    });
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{
              position: "absolute",
              left: 24,
              top: 42,
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "rgba(255,255,255,0.25)",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.push("/HomeMapScreen")}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingButton}
            activeOpacity={0.8}
            onPress={() => setSettingModalVisible(true)}>
            <Text style={styles.settingIcon}>⚙</Text>
          </TouchableOpacity>

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

          {histories.map((history) => (
            <HistoryItem
              key={history.id}
              name={history.name}
              date={history.date}
              discount={history.discount}
              price={history.price}
              image={history.image}
              bgColor={history.bgColor}
              onPress={() => handlePressHistory(history.routeId)}
            />
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={isSettingModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingModalVisible(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSettingModalVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              backgroundColor: "#F3F4F8",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 18,
              maxHeight: "82%",
            }}>
            <Text style={styles.sectionTitle}>設定</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.settingCard}>
                <SettingMenuItem
                  icon="🔔"
                  label="通知設定"
                  iconColor="#2563EB"
                  onPress={() => console.log("通知設定")}
                />
                <SettingMenuItem
                  icon="📄"
                  label="プライバシーポリシー"
                  iconColor="#2563EB"
                  onPress={() => console.log("プライバシーポリシー")}
                />
                <SettingMenuItem
                  icon="👤"
                  label="ユーザー名変更"
                  iconColor="#2563EB"
                  onPress={() => console.log("ユーザー名変更")}
                />
                <SettingMenuItem
                  icon="📧"
                  label="メールアドレス変更"
                  iconColor="#2563EB"
                  onPress={() => console.log("メールアドレス変更")}
                />
                <SettingMenuItem
                  icon="🔒"
                  label="パスワード変更"
                  iconColor="#2563EB"
                  onPress={() => console.log("パスワード変更")}
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
            </ScrollView>

            <Text style={styles.versionText}>MESHITIME v1.0.0</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}