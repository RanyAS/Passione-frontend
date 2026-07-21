import React from "react";
import { Stack, router } from "expo-router";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import OnboardingScreen from "@/app/onboarding";
import HomeMapScreen from "./HomeMapScreen";

export default function RootLayout() {
  const [showHomeMapScreen, setShowHomeMapScreen] = React.useState(true);

  //一旦コメントアウトします。
  // if (showHomeMapScreen) {
  //   return (
  //     <OnboardingScreen
  //       onFinish={() => {
  //         setShowOnboarding(false);
  //         router.replace("/login");
  //       }}
  //     />
  //   );
  // }

  return (
    <>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
