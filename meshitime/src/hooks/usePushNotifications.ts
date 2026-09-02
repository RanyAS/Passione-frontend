import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "../services/notificationsService";

type NotificationData = {
  screen?: string;
  result?: string;
  type?: string;
};

function handleNotificationNavigation(data: NotificationData | undefined) {
  if (!data?.screen) return;

  if (data.screen === "ConfirmationScreen") {
    router.push({
      pathname: "/ConfirmationScreen",
      params: data.result ? { result: data.result } : undefined,
    });
    return;
  }

  if (data.screen === "shop/reservations") {
    router.push("/shop/reservations");
  }
}

export function usePushNotifications() {
  const registered = useRef(false);

  useEffect(() => {
    if (Platform.OS === "web") return;
    if (registered.current) return;
    registered.current = true;

    if (!requireOptionalNativeModule("ExpoPushTokenManager")) {
      return;
    }

    let responseSub: { remove: () => void } | undefined;

    try {
      const Notifications = require("expo-notifications") as typeof import("expo-notifications");

      void registerForPushNotificationsAsync();

      responseSub = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data = response.notification.request.content
            .data as NotificationData;
          handleNotificationNavigation(data);
        }
      );

      void Notifications.getLastNotificationResponseAsync().then((response) => {
        if (!response) return;
        const data = response.notification.request.content
          .data as NotificationData;
        handleNotificationNavigation(data);
      });
    } catch {
    }

    return () => {
      responseSub?.remove();
    };
  }, []);
}
