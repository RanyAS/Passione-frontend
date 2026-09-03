import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "@/lib/supabase";

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setAccountType(
        session?.user.user_metadata?.account_type ?? null
      );

      setLoading(false);
    };

    void checkSession();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (accountType === "store") {
    return <Redirect href="/shop" />;
  }

  if (accountType === "individual") {
    return <Redirect href="/HomeMapScreen" />;
  }

  return <Redirect href="/login" />;
}