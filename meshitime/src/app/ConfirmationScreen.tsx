import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles as externalStyles } from "../styles/ConfirmationScreenStyle";
import { MeshitimeColors } from "@/theme/meshitime-theme";
import { createReservation } from "@/api/ReservationApi";
import { getStorePin } from "@/api/StorePinApi";
import { resolveSessionUserId } from "@/lib/sessionUser";
import type { StorePin } from "@/types/StorePin";

type ConfirmationStatus = "pending" | "success" | "error";

interface ConfirmationScreenProps {
  onGoHome: () => void;
  onRetry?: () => void;
}

function PendingAnimation() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.45);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.12, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    rotation.value = withRepeat(
      withTiming(360, { duration: 1600, easing: Easing.linear }),
      -1,
      false
    );
  }, [opacity, rotation, scale]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={externalStyles.statusIconWrap}>
      <Animated.View style={[externalStyles.pendingPulseRing, pulseStyle]} />
      <View style={externalStyles.pendingBubble}>
        <Animated.View style={spinnerStyle}>
          <Ionicons name="sync" size={42} color="#FFFFFF" />
        </Animated.View>
      </View>
    </View>
  );
}

function StatusHeader({ status }: { status: ConfirmationStatus }) {
  if (status === "pending") {
    return (
      <Animated.View entering={FadeIn.duration(300)} style={externalStyles.statusHeader}>
        <PendingAnimation />
        <Text style={externalStyles.title}>確認中</Text>
        <Text style={externalStyles.message}>予約を確認しています。少々お待ちください…</Text>
      </Animated.View>
    );
  }

  if (status === "error") {
    return (
      <Animated.View entering={FadeInDown.duration(400)} style={externalStyles.statusHeader}>
        <View style={externalStyles.errorBubble}>
          <Ionicons name="close" size={52} color="#FFFFFF" />
        </View>
        <Text style={externalStyles.title}>予約失敗</Text>
        <Text style={externalStyles.errorMessage}>
          予約の確認に失敗しました。もう一度お試しください。
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={externalStyles.statusHeader}>
      <View style={externalStyles.successBubble}>
        <Ionicons name="checkmark" size={52} color="#FFFFFF" />
      </View>
      <Text style={externalStyles.title}>予約完了</Text>
      <Text style={externalStyles.message}>予約が確認されました。</Text>
    </Animated.View>
  );
}

export default function Page() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    result?: string;
    pinId?: string;
    partySize?: string;
  }>();

  return (
    <ConfirmationScreen
      onGoHome={() => router.push("/HomeMapScreen")}
      onRetry={() =>
        router.replace({
          pathname: "/ConfirmationScreen",
          params: {
            result: "pending",
            pinId: params.pinId,
            partySize: params.partySize,
          },
        })
      }
      forcedResult={params.result as ConfirmationStatus | undefined}
      pinId={params.pinId}
      partySize={params.partySize ? Number(params.partySize) : 1}
    />
  );
}

export function ConfirmationScreen({
  onGoHome,
  onRetry,
  forcedResult,
  pinId,
  partySize = 1,
}: ConfirmationScreenProps & {
  forcedResult?: ConfirmationStatus;
  pinId?: string;
  partySize?: number;
}) {
  const [status, setStatus] = useState<ConfirmationStatus>(
    forcedResult === "success" || forcedResult === "error" || forcedResult === "pending"
      ? forcedResult
      : "pending"
  );
  const [pin, setPin] = useState<StorePin | null>(null);

  useEffect(() => {
    if (!pinId) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getStorePin(pinId);
        if (!cancelled) setPin(data);
      } catch {
        if (!cancelled) setPin(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pinId]);

  useEffect(() => {
    if (forcedResult === "success" || forcedResult === "error") {
      setStatus(forcedResult);
      return;
    }

    let cancelled = false;
    setStatus("pending");

    const run = async () => {
      if (!pinId) {
        if (!cancelled) setStatus("error");
        return;
      }

      try {
        const userId = await resolveSessionUserId();
        await createReservation({
          userId,
          pinId,
          partySize,
        });
        if (!cancelled) setStatus("success");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [forcedResult, pinId, partySize]);

  const handleAddDiscount = () => {
    // toast / feedback later
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }
    setStatus("pending");
  };

  return (
    <SafeAreaView style={externalStyles.safeArea}>
      <ScrollView
        contentContainerStyle={externalStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={externalStyles.container}>
          <View style={externalStyles.content}>
            <StatusHeader status={status} />

            {status === "pending" ? (
              <Animated.View
                entering={FadeIn.delay(150).duration(300)}
                style={externalStyles.pendingCard}
              >
                <Text style={externalStyles.pendingCardTitle}>予約処理中</Text>
                <Text style={externalStyles.pendingCardText}>
                  レストランからの確認を待っています。この画面を閉じないでください。
                </Text>
                <View style={externalStyles.pendingDotsRow}>
                  <PendingDot delay={0} />
                  <PendingDot delay={180} />
                  <PendingDot delay={360} />
                </View>
              </Animated.View>
            ) : null}

            {status === "error" ? (
              <Animated.View
                entering={FadeInDown.delay(80).duration(350)}
                style={externalStyles.errorCard}
              >
                <Text style={externalStyles.errorCardTitle}>エラー詳細</Text>
                <Text style={externalStyles.errorCardText}>
                  通信エラーまたは満席のため、予約を完了できませんでした。
                </Text>
                <Pressable style={externalStyles.mainButton} onPress={handleRetry}>
                  <Ionicons
                    name="refresh-outline"
                    size={18}
                    color="#FFFFFF"
                    style={externalStyles.mainButtonIcon}
                  />
                  <Text style={externalStyles.mainButtonText}>もう一度試す</Text>
                </Pressable>
                <Pressable style={externalStyles.linkButton} onPress={onGoHome}>
                  <Ionicons
                    name="home-outline"
                    size={16}
                    color={MeshitimeColors.textMuted}
                    style={externalStyles.linkIcon}
                  />
                  <Text style={externalStyles.linkButtonText}>ホームへ戻る</Text>
                </Pressable>
              </Animated.View>
            ) : null}

            {status === "success" ? (
              <Animated.View entering={FadeInDown.delay(80).duration(350)} style={{ width: "100%" }}>
                <View style={externalStyles.card}>
                  <Text style={externalStyles.restaurant}>
                    {pin?.store?.name ?? "店舗"}
                  </Text>
                  <Text style={externalStyles.restaurantSub}>
                    {pin?.description ?? pin?.rule ?? "予約完了"}
                  </Text>

                  <View style={externalStyles.row}>
                    <View style={externalStyles.rowIconBubble}>
                      <Ionicons name="calendar-outline" size={22} color="#4B5563" />
                    </View>
                    <View style={externalStyles.rowText}>
                      <Text style={externalStyles.rowLabel}>日時</Text>
                      <Text style={externalStyles.rowValue}>
                        {new Date().toLocaleDateString("ja-JP")}
                      </Text>
                    </View>
                  </View>

                  <View style={externalStyles.row}>
                    <View style={externalStyles.rowIconBubble}>
                      <Ionicons name="time-outline" size={22} color="#4B5563" />
                    </View>
                    <View style={externalStyles.rowText}>
                      <Text style={externalStyles.rowLabel}>時間</Text>
                      <Text style={externalStyles.rowValue}>
                        {pin?.time ?? "時間未設定"}
                      </Text>
                    </View>
                  </View>

                  <View style={externalStyles.row}>
                    <View style={externalStyles.rowIconBubble}>
                      <Ionicons name="people-outline" size={22} color="#4B5563" />
                    </View>
                    <View style={externalStyles.rowText}>
                      <Text style={externalStyles.rowLabel}>人数</Text>
                      <Text style={externalStyles.rowValue}>{partySize}名</Text>
                    </View>
                  </View>

                  <View style={[externalStyles.row, externalStyles.lastRow]}>
                    <View style={externalStyles.rowIconBubble}>
                      <Ionicons name="location-outline" size={22} color="#4B5563" />
                    </View>
                    <View style={externalStyles.rowText}>
                      <Text style={externalStyles.rowLabel}>場所</Text>
                      <Text style={externalStyles.rowValue}>
                        {pin?.store?.address ?? "住所未設定"}
                      </Text>
                    </View>
                  </View>

                  <View style={externalStyles.discountWrap}>
                    <View>
                      <Text style={externalStyles.discountTitle}>オファー</Text>
                      <Text style={externalStyles.discountSubtitle}>
                        {pin?.rule ?? pin?.description ?? "—"}
                      </Text>
                    </View>
                    <View style={externalStyles.discountPriceWrap}>
                      <Text style={externalStyles.discountFinal}>
                        空席 {pin?.emptySeat ?? 0}
                      </Text>
                    </View>
                  </View>

                  <View style={externalStyles.qrBox}>
                    <Text style={externalStyles.qrLabel}>予約確認</Text>
                  </View>
                  <Text style={externalStyles.qrId}>
                    PIN: {pinId ?? "—"}
                  </Text>
                </View>

                <Pressable style={externalStyles.mainButton} onPress={handleAddDiscount}>
                  <Ionicons
                    name="add-circle-outline"
                    size={18}
                    color="#FFFFFF"
                    style={externalStyles.mainButtonIcon}
                  />
                  <Text style={externalStyles.mainButtonText}>クーポンを使用する</Text>
                </Pressable>
                <Pressable style={externalStyles.linkButton} onPress={onGoHome}>
                  <Ionicons
                    name="home-outline"
                    size={16}
                    color={MeshitimeColors.textMuted}
                    style={externalStyles.linkIcon}
                  />
                  <Text style={externalStyles.linkButtonText}>ホームへ戻る</Text>
                </Pressable>
              </Animated.View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PendingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withRepeat(
        withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[externalStyles.pendingDot, style]} />;
}
