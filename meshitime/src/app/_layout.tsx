import React from "react";
import { Stack, router } from "expo-router";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import OnboardingScreen from "@/app/onboarding";
import { MeshitimeProvider } from "../../provider/meshitime-provider";

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
    <MeshitimeProvider>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }} />
    </MeshitimeProvider>
  );
}
