import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { SplashScreen } from "./SplashScreen";
import { log } from "../lib/log";

export function AuthCallbackScreen() {
  const route = useRoute<any>();
  const { token_hash, type } = route.params ?? {};
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function confirm() {
      if (!token_hash || !type) {
        setError("Invalid link.");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({ token_hash, type });

      if (error) {
        log.error("Error verifying signup link:", error);
        setError("This link has expired or is no longer valid.");
        return;
      }
    }

    void confirm();
  }, [token_hash, type]);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text>{error}</Text>
      </View>
    );
  }

  return <SplashScreen />;
}
