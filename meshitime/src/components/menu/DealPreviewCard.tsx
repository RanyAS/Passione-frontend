import React from "react";
import { Image, Text, View } from "react-native";
import {
  calculateDiscountPercent,
  type MenuRegistrationForm,
} from "../../../types/menu-registration";
import { styles } from "../../styles/MenuRegisterStyle";

export function MenuHeroPreview({ imageUri }: { imageUri: string | null }) {
  return (
    <View style={styles.heroPreview}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.heroImage} />
      ) : (
        <Text style={{ fontSize: 40 }}>🍜</Text>
      )}
    </View>
  );
}

export function DealPreviewCard({ form }: { form: MenuRegistrationForm }) {
  const percent = calculateDiscountPercent(
    form.originalPrice,
    form.discountPrice
  );

  return (
    <View style={styles.dealCard}>
      <Text style={styles.dealTitle}>{form.menuName || "メニュー名"}</Text>
      <Text style={styles.dealMeta}>
        {form.bannerText || "バナー文言未設定"}
        {form.availableSeats ? ` · 空席 ${form.availableSeats}席` : ""}
      </Text>
      <View style={styles.dealPriceRow}>
        {form.originalPrice ? (
          <Text style={styles.dealOriginal}>
            ¥{Number(form.originalPrice).toLocaleString()}
          </Text>
        ) : null}
        <Text style={styles.dealPrice}>
          ¥{Number(form.discountPrice || 0).toLocaleString()}
        </Text>
      </View>
      {percent > 0 ? (
        <View style={styles.dealBadge}>
          <Text style={styles.dealBadgeText}>-{percent}%</Text>
        </View>
      ) : null}
    </View>
  );
}
