import React from "react";
import { Stack, router } from "expo-router";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import OnboardingScreen from "@/app/onboarding";

export default function RootLayout() {
  const [showOnboarding, setShowOnboarding] = React.useState(true);

  //一旦コメントアウトします。
  // if (showOnboarding) {
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
