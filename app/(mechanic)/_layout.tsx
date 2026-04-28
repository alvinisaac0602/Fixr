import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MechanicLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* ✅ DASHBOARD FIRST */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="build-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ✅ PROFILE SECOND */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}