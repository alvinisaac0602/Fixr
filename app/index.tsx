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
      const onboarding = await AsyncStorage.getItem("onboarding_seen");
      if (!onboarding) {
        router.replace("/(onboarding)/onboarding");
        return;
      }

      // 2. WELCOME (ONLY FIRST TIME EVER)
      const welcome = await AsyncStorage.getItem("welcome_seen");
      if (!welcome) {
        router.replace("/welcome");
        return;
      }

      // 3. AUTH CHECK
      if (!user) {
        router.replace("/(auth)/login");
        return;
      }

      // 4. 🚨 ROLE SCREEN (ALWAYS SHOW EVERY LOGIN)
      router.replace("/(auth)/role");
    };

    runFlow();
  }, [user, loading]);

  return null;
}