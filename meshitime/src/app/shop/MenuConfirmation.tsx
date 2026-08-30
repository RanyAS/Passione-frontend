import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DealPreviewCard, MenuHeroPreview } from "../../components/menu/DealPreviewCard";
import { getMenuRegistrationForm } from "../../context/menu-registration-store";
import { saveMenu } from "../../services/menuService";
import { styles } from "../../styles/MenuRegisterStyle";
import {
  ALLERGY_OPTIONS,
  calculateDiscountPercent,
  type MenuRegistrationForm,
} from "../../../types/menu-registration";

function getAllergyLabels(form: MenuRegistrationForm): string {
  if (form.allergies.length === 0) {
    return "なし";
  }

  return ALLERGY_OPTIONS.filter((item) => form.allergies.includes(item.key))
    .map((item) => item.label)
    .join("、");
}

export default function MenuConfirmation() {
  const [form] = useState<MenuRegistrationForm>(getMenuRegistrationForm());
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const discountPercent = calculateDiscountPercent(
    form.originalPrice,
    form.discountPrice
  );

  const handleOpenDialog = () => {
    setDialogVisible(true);
  };

  const handleModify = () => {
    setDialogVisible(false);
    router.back();
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      await saveMenu(form);
      setDialogVisible(false);
      Alert.alert("完了", "オファー（ピン）を作成しました。", [
        { text: "OK", onPress: () => router.replace("/shop/pins") },
      ]);
    } catch (error) {
      setDialogVisible(false);
      Alert.alert(
        "送信エラー",
        "入力内容に問題がある可能性があります。内容を確認して再度お試しください。",
        [{ text: "OK", onPress: () => router.replace("/shop/MenuRegister") }]
      );
      console.error("Failed to save menu:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>登録内容の確認</Text>
          <Text style={styles.pageSubtitle}>
            入力内容を確認して、問題なければ送信してください
          </Text>
        </View>

        <MenuHeroPreview imageUri={form.imageUri} />
        <DealPreviewCard form={form} />

        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>入力内容</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>商品名</Text>
            <Text style={styles.summaryValue}>{form.menuName || "未入力"}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>価格</Text>
            <Text style={styles.summaryValue}>
              ¥{Number(form.originalPrice || 0).toLocaleString()} → ¥
              {Number(form.discountPrice || 0).toLocaleString()}
              {discountPercent > 0 ? `（-${discountPercent}%）` : ""}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>空席数</Text>
            <Text style={styles.summaryValue}>
              {form.availableSeats ? `${form.availableSeats}席` : "未入力"}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>締切日時</Text>
            <Text style={styles.summaryValue}>
              {form.deadlineDate || "未入力"} {form.deadlineTime || ""}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>バナー文言</Text>
            <Text style={styles.summaryValue}>{form.bannerText || "未入力"}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>使用素材</Text>
            <Text style={styles.summaryValue}>{form.materials || "未入力"}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>アレルギー情報</Text>
            <Text style={styles.summaryValue}>{getAllergyLabels(form)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>説明</Text>
            <Text style={styles.summaryValue}>{form.description || "未入力"}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>販売ステータス</Text>
            <Text style={styles.summaryValue}>
              {form.isOnSale ? "販売中" : "非公開"}
            </Text>
          </View>

          <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.summaryLabel}>おすすめ表示</Text>
            <Text style={styles.summaryValue}>
              {form.isFeatured ? "表示する" : "表示しない"}
            </Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleModify}>
            <Text style={styles.secondaryButtonText}>修正</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleOpenDialog}>
            <Text style={styles.primaryButtonText}>送信</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isDialogVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDialogVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => !isSaving && setDialogVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.modalTitle}>登録内容の確認</Text>
            <Text style={styles.modalMessage}>
              この内容で送信しますか？
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.modalSecondaryButton}
                onPress={handleModify}
                disabled={isSaving}
              >
                <Text style={styles.modalSecondaryButtonText}>修正</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalPrimaryButton}
                onPress={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalPrimaryButtonText}>送信</Text>
                )}
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
