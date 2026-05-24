import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    const runFlow = async () => {
      if (loading) return;

      // 1. ONBOARDING (ONLY FIRST TIME EVER)
      const onboarding = await AsyncStorage.getItem("has_seen_onboarding");

      if (!onboarding) {
        router.replace("/(onboarding)/onboarding");
        return;
      }

      // 2. WELCOME (ONLY FIRST TIME EVER)
      const welcome = await AsyncStorage.getItem("has_seen_welcome");

      if (!welcome) {
        router.replace("/(onboarding)/welcome");
        return;
      }

      // 3. AUTH CHECK
      if (!user) {
        router.replace("/(auth)/login");
        return;
      }

      // 4. DIRECT USER HOME
      router.replace("/(user)/home");
    };

    runFlow();
  }, [user, loading]);

  return null;
}