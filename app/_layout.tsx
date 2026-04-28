import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";


export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#ffffff" />

      {/* 🚀 Let Expo auto-detect all routes */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </SafeAreaProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}