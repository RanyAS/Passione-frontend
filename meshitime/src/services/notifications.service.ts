import Constants from "expo-constants";
import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo-modules-core";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const RESERVATION_CHANNEL_ID = "reservations";

export type ReservationDecisionStatus = "confirmed" | "failed" | "cancelled";

export type PushPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
};

type NotificationsModule = typeof import("expo-notifications");
type DeviceModule = typeof import("expo-device");

let cachedPushToken: string | null = null;
let notificationsModule: NotificationsModule | null | undefined;
let deviceModule: DeviceModule | null | undefined;

function getNotifications(): NotificationsModule | null {
  if (notificationsModule !== undefined) return notificationsModule;

  if (!requireOptionalNativeModule("ExpoPushTokenManager")) {
    console.warn(
      "[notifications] Native module missing — push disabled until EAS rebuild"
    );
    notificationsModule = null;
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    notificationsModule = require("expo-notifications") as NotificationsModule;
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    return notificationsModule;
  } catch {
    notificationsModule = null;
    return null;
  }
}

function getDevice(): DeviceModule | null {
  if (deviceModule !== undefined) return deviceModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    deviceModule = require("expo-device") as DeviceModule;
    return deviceModule;
  } catch {
    deviceModule = null;
    return null;
  }
}

function getEasProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId
  );
}

async function ensureAndroidChannel(Notifications: NotificationsModule) {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(RESERVATION_CHANNEL_ID, {
    name: "予約通知",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#208AEF",
  });
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === "web") return null;

  const Notifications = getNotifications();
  const Device = getDevice();
  if (!Notifications || !Device) return null;

  if (!Device.isDevice) {
    console.warn("[notifications] Push requires a physical device");
    return null;
  }

  await ensureAndroidChannel(Notifications);

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("[notifications] Permission not granted");
    return null;
  }

  const projectId = getEasProjectId();
  if (!projectId) {
    console.warn("[notifications] Missing EAS projectId in app.json");
    return null;
  }

  const tokenResult = await Notifications.getExpoPushTokenAsync({ projectId });
  cachedPushToken = tokenResult.data;
  return cachedPushToken;
}

export function getCachedPushToken(): string | null {
  return cachedPushToken;
}

export async function sendPushToTokens(
  tokens: string[],
  payload: PushPayload
): Promise<boolean> {
  const uniqueTokens = [...new Set(tokens.filter(Boolean))];
  if (uniqueTokens.length === 0) return false;

  const messages = uniqueTokens.map((to) => ({
    to,
    sound: "default" as const,
    title: payload.title,
    body: payload.body,
    data: payload.data ?? {},
    channelId: RESERVATION_CHANNEL_ID,
  }));

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });
    return response.ok;
  } catch (error) {
    console.warn("[notifications] Expo push failed", error);
    return false;
  }
}

function decisionCopy(
  status: ReservationDecisionStatus,
  offerTitle?: string
): PushPayload {
  const offer = offerTitle ? `（${offerTitle}）` : "";

  if (status === "confirmed") {
    return {
      title: "予約が確定しました",
      body: `店舗が予約を承認しました${offer}`,
      data: {
        screen: "ConfirmationScreen",
        result: "success",
        type: "reservation_decision",
      },
    };
  }

  if (status === "cancelled") {
    return {
      title: "予約がキャンセルされました",
      body: `店舗が予約をキャンセルしました${offer}`,
      data: {
        screen: "ConfirmationScreen",
        result: "error",
        type: "reservation_decision",
      },
    };
  }

  return {
    title: "予約できませんでした",
    body: `店舗が予約を拒否しました${offer}`,
    data: {
      screen: "ConfirmationScreen",
      result: "error",
      type: "reservation_decision",
    },
  };
}

export async function notifyReservationDecision(options: {
  status: ReservationDecisionStatus;
  offerTitle?: string;
  customerPushTokens?: string[];
}): Promise<boolean> {
  // Pas de module natif → pas de crash, juste skip
  if (!getNotifications()) return false;

  const tokens: string[] = [
    ...(options.customerPushTokens?.filter(Boolean) ?? []),
  ];

  if (tokens.length === 0 && cachedPushToken) {
    tokens.push(cachedPushToken);
  }

  if (tokens.length === 0) {
    const fresh = await registerForPushNotificationsAsync();
    if (fresh) tokens.push(fresh);
  }

  if (tokens.length === 0) return false;

  return sendPushToTokens(
    tokens,
    decisionCopy(options.status, options.offerTitle)
  );
}
