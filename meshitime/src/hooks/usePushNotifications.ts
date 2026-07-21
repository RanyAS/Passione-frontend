import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Platform } from "react-native";
import { registerForPushNotificationsAsync } from "@/services/notifications.service";

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

/**
 * Enregistre le token push au démarrage et gère le tap sur une notification.
 */
export function usePushNotifications() {
  const registered = useRef(false);

  useEffect(() => {
    if (Platform.OS === "web") return;
    if (registered.current) return;
    registered.current = true;

    void registerForPushNotificationsAsync();

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content
          .data as NotificationData;
        handleNotificationNavigation(data);
      }
    );

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = response.notification.request.content.data as NotificationData;
      handleNotificationNavigation(data);
    });

    return () => {
      responseSub.remove();
    };
  }, []);
}
