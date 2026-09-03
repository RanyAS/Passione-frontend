import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DealPreviewCard, MenuHeroPreview } from "../../components/menu/DealPreviewCard";
import {
  getMenuRegistrationForm,
  resetMenuRegistrationForm,
  setMenuRegistrationForm,
} from "../../context/menu-registration-store";
import { styles } from "../../styles/MenuRegisterStyle";
import {
  ALLERGY_OPTIONS,
  calculateDiscountPercent,
  type AllergyKey,
  type MenuRegistrationForm,
} from "../../../types/menu-registration";

export default function MenuRegister() {
  const [form, setForm] = useState<MenuRegistrationForm>(getMenuRegistrationForm());

  const updateForm = <K extends keyof MenuRegistrationForm>(
    key: K,
    value: MenuRegistrationForm[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleAllergy = (allergy: AllergyKey) => {
    setForm((current) => ({
      ...current,
      allergies: current.allergies.includes(allergy)
        ? current.allergies.filter((item) => item !== allergy)
        : [...current.allergies, allergy],
    }));
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("画像の選択には、写真ライブラリへのアクセス許可が必要です。");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled) {
      updateForm("imageUri", result.assets[0].uri);
    }
  };

  const handleReset = () => {
    resetMenuRegistrationForm();
    setForm(getMenuRegistrationForm());
  };

  const handleRegister = () => {
    if (!form.menuName.trim() || !form.availableSeats.trim()) {
      Alert.alert("入力エラー", "商品名と空席数は必須です。");
      return;
    }
    setMenuRegistrationForm(form);
    router.push("/shop/MenuConfirmation");
  };

  const discountPercent = calculateDiscountPercent(
    form.originalPrice,
    form.discountPrice
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>商品登録</Text>
          <Text style={styles.pageSubtitle}>
            新しいメニューの情報を入力してください（空席数必須）
          </Text>
        </View>

        <MenuHeroPreview imageUri={form.imageUri} />
        <DealPreviewCard form={form} />

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>基本情報</Text>

          <Text style={styles.fieldLabel}>
            商品名 <Text style={styles.requiredMark}>*必須</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="例：牛丼セット"
            value={form.menuName}
            onChangeText={(value) => updateForm("menuName", value)}
          />

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>お得情報の価格</Text>

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.fieldLabel}>通常価格</Text>
              <View style={styles.priceInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="890"
                  value={form.originalPrice}
                  onChangeText={(value) => updateForm("originalPrice", value)}
                  keyboardType="numeric"
                />
                <Text style={styles.priceSuffix}>円</Text>
              </View>
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.fieldLabel}>割引価格</Text>
              <View style={styles.priceInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="620"
                  value={form.discountPrice}
                  onChangeText={(value) => updateForm("discountPrice", value)}
                  keyboardType="numeric"
                />
                <Text style={styles.priceSuffix}>円</Text>
              </View>
            </View>
          </View>

          {discountPercent > 0 ? (
            <Text style={styles.discountPreview}>割引率：-{discountPercent}%</Text>
          ) : null}

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>空席数</Text>
          <View style={styles.priceInputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="4"
              value={form.availableSeats}
              onChangeText={(value) => updateForm("availableSeats", value)}
              keyboardType="numeric"
            />
            <Text style={styles.priceSuffix}>席</Text>
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>締切日時</Text>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <TextInput
                style={styles.input}
                placeholder="2026-07-10"
                value={form.deadlineDate}
                onChangeText={(value) => updateForm("deadlineDate", value)}
              />
            </View>
            <View style={styles.rowItem}>
              <TextInput
                style={styles.input}
                placeholder="14:30"
                value={form.deadlineTime}
                onChangeText={(value) => updateForm("deadlineTime", value)}
              />
            </View>
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>バナー文言</Text>
          <TextInput
            style={styles.input}
            placeholder="例：ランチタイム限定オファー"
            value={form.bannerText}
            onChangeText={(value) => updateForm("bannerText", value)}
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>素材・説明</Text>

          <Text style={styles.fieldLabel}>
            使用素材 <Text style={styles.requiredMark}>*必須</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="例：トマトソース、モッツァレラチーズ、バジル"
            value={form.materials}
            onChangeText={(value) => updateForm("materials", value)}
            multiline
          />
          <Text style={styles.helperText}>
            素材をカンマ区切りで入力してください。アレルギー原材料も含めて記載してください。
          </Text>

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
            アレルギー情報 <Text style={styles.requiredMark}>（任意）</Text>
          </Text>
          <View style={styles.chipWrap}>
            {ALLERGY_OPTIONS.map((allergy) => {
              const selected = form.allergies.includes(allergy.key);

              return (
                <TouchableOpacity
                  key={allergy.key}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleAllergy(allergy.key)}
                >
                  <Text
                    style={[styles.chipText, selected && styles.chipTextSelected]}
                  >
                    {allergy.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
            説明 <Text style={styles.requiredMark}>*必須</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="商品の説明を入力してください"
            value={form.description}
            onChangeText={(value) => updateForm("description", value)}
            multiline
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>商品画像</Text>

          <Text style={styles.fieldLabel}>
            メイン画像 <Text style={styles.requiredMark}>*必須</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.imagePicker,
              form.imageUri ? styles.imagePickerFilled : null,
            ]}
            onPress={pickImage}
            activeOpacity={0.85}
          >
            {form.imageUri ? (
              <Image
                source={{ uri: form.imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <>
                <Text style={styles.imagePickerIcon}>📷</Text>
                <Text style={styles.imagePickerText}>
                  クリックしてファイルを選択
                </Text>
                <Text style={styles.imagePickerHint}>
                  PNG・JPG・WEBP（最大5MB）
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>販売設定</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelWrap}>
              <Text style={styles.toggleLabel}>販売ステータス</Text>
              <Text style={styles.toggleHint}>オフにすると非公開</Text>
            </View>
            <Switch
              value={form.isOnSale}
              onValueChange={(value) => updateForm("isOnSale", value)}
              trackColor={{ false: "#E5E7EB", true: "#FFB4AE" }}
              thumbColor={form.isOnSale ? "#FF3B30" : "#FFFFFF"}
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelWrap}>
              <Text style={styles.toggleLabel}>おすすめ表示</Text>
              <Text style={styles.toggleHint}>トップページのおすすめに表示する</Text>
            </View>
            <Switch
              value={form.isFeatured}
              onValueChange={(value) => updateForm("isFeatured", value)}
              trackColor={{ false: "#E5E7EB", true: "#FFB4AE" }}
              thumbColor={form.isFeatured ? "#FF3B30" : "#FFFFFF"}
            />
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleReset}>
            <Text style={styles.secondaryButtonText}>リセット</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>登録する</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
