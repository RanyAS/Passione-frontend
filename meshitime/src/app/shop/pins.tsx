import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shopStyles as styles } from "../../styles/shop.styles";

type PinOffer = {
  id: string;
  title: string;
  discount: string;
  emptySeat: number;
  time: string;
  isActive: boolean;
};

const initialPins: PinOffer[] = [
  {
    id: "1",
    title: "ランチ30%OFF",
    discount: "30%",
    emptySeat: 6,
    time: "11:30-14:00",
    isActive: true,
  },
  {
    id: "2",
    title: "ディナー20%OFF",
    discount: "20%",
    emptySeat: 4,
    time: "17:00-20:00",
    isActive: true,
  },
  {
    id: "3",
    title: "モーニング15%OFF",
    discount: "15%",
    emptySeat: 0,
    time: "08:00-10:30",
    isActive: false,
  },
];

export default function ShopPinsScreen() {
  const insets = useSafeAreaInsets();
  const [pins, setPins] = useState(initialPins);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState("");
  const [emptySeat, setEmptySeat] = useState("");
  const [time, setTime] = useState("");

  const activeCount = useMemo(
    () => pins.filter((pin) => pin.isActive).length,
    [pins]
  );

  const handleCreate = () => {
    if (!title.trim() || !discount.trim() || !emptySeat.trim()) {
      Alert.alert("入力エラー", "タイトル・割引・席数は必須です。");
      return;
    }

    const next: PinOffer = {
      id: String(Date.now()),
      title: title.trim(),
      discount: discount.trim(),
      emptySeat: Number(emptySeat) || 0,
      time: time.trim() || "未設定",
      isActive: true,
    };

    setPins((prev) => [next, ...prev]);
    setTitle("");
    setDiscount("");
    setEmptySeat("");
    setTime("");
    setModalVisible(false);
  };

  const toggleActive = (id: string) => {
    setPins((prev) =>
      prev.map((pin) =>
        pin.id === id ? { ...pin, isActive: !pin.isActive } : pin
      )
    );
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>オファー管理</Text>
          <Text style={styles.subtitle}>
            有効なオファー {activeCount} 件 / 合計 {pins.length} 件
          </Text>
        </View>

        {pins.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="pricetag-outline" size={28} color="#9CA3AF" />
            <Text style={styles.emptyText}>まだオファーがありません</Text>
          </View>
        ) : (
          pins.map((pin) => (
            <View key={pin.id} style={styles.card}>
              <Text style={styles.cardTitle}>{pin.title}</Text>
              <Text style={styles.cardMeta}>
                {pin.discount} OFF · 残り{pin.emptySeat}席 · {pin.time}
              </Text>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badge,
                    pin.isActive ? styles.badgeSuccess : styles.badgeError,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      pin.isActive
                        ? styles.badgeSuccessText
                        : styles.badgeErrorText,
                    ]}
                  >
                    {pin.isActive ? "公開中" : "停止中"}
                  </Text>
                </View>
              </View>
              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => toggleActive(pin.id)}
                >
                  <Text style={styles.secondaryButtonText}>
                    {pin.isActive ? "停止する" : "公開する"}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              paddingBottom: insets.bottom + 20,
            }}
          >
            <Text style={styles.title}>新規オファー</Text>
            <Text style={[styles.subtitle, { marginBottom: 16 }]}>
              地図に表示される割引ピンを作成
            </Text>

            <Text style={styles.label}>タイトル</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="例: ランチ30%OFF"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>割引</Text>
            <TextInput
              style={styles.input}
              value={discount}
              onChangeText={setDiscount}
              placeholder="例: 30%"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>空席数</Text>
            <TextInput
              style={styles.input}
              value={emptySeat}
              onChangeText={setEmptySeat}
              keyboardType="number-pad"
              placeholder="例: 6"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>時間帯</Text>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="例: 11:30-14:00"
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.actionsRow}>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>キャンセル</Text>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={handleCreate}>
                <Text style={styles.primaryButtonText}>作成する</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
