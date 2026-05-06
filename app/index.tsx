import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user, profile, loading } = useAuth();

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

      // 4. 🚀 ROLE REDIRECTION (AUTO-PERSISTENCE)
      if (profile?.role === "user") {
        router.replace("/(user)/home");
      } else if (profile?.role === "mechanic") {
        router.replace("/(mechanic)/dashboard");
      } else {
        // Fallback to role selection if no role is set yet
        router.replace("/(auth)/role");
      }
    };

    runFlow();
  }, [user, profile, loading]);

  return null;
}