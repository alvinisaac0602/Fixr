import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "react-native";

export default function EditProfile() {
  const { theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <StatusBar style={theme.darkMode ? "light" : "dark"} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: theme.colors.text }]}>
            Isaac Kiiza
          </Text>
          <Text style={[styles.email, { color: theme.colors.subtitle }]}>
            isaac@email.com
          </Text>
        </View>

        {/* Account Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.card }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Account
          </Text>

          <ProfileItem
            icon="person-outline"
            label="Edit Profile"
            theme={theme}
            onPress={() => router.push("/(user)/profile/edit")}
          />

          <ProfileItem
            icon="shield-checkmark-outline"
            label="Security"
            theme={theme}
            onPress={() => router.push("/(user)/profile/security")}
          />

          <ProfileItem
            icon="car-outline"
            label="My Requests"
            theme={theme}
            onPress={() => router.push("/(user)/profile/requests")}
          />
        </View>

        {/* Settings Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.card }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Settings
          </Text>

          <ProfileItem
            icon="notifications-outline"
            label="Notifications"
            theme={theme}
            onPress={() => router.push("/(user)/profile/notifications")}
          />

          {/* DARK MODE */}
          <View style={styles.switchItem}>
            <View style={styles.itemLeft}>
              <Ionicons
                name="moon-outline"
                size={20}
                color={theme.colors.text}
              />
              <Text style={[styles.itemText, { color: theme.colors.text }]}>
                Dark Mode
              </Text>
            </View>

            <Switch
              value={theme.darkMode}
              onValueChange={toggleTheme}
            />
          </View>

          <ProfileItem
            icon="help-circle-outline"
            label="Help & Support"
            theme={theme}
            onPress={() => router.push("/(user)/profile/support")}
          />
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* SWITCH TO MECHANIC */}
<Pressable
  style={[styles.switchRole, { backgroundColor: theme.colors.primary }]}
  onPress={() => router.replace("/(mechanic)/dashboard")}
>
  <Ionicons name="construct-outline" size={20} color="#fff" />
  <Text style={styles.switchText}>Switch to Mechanic Mode</Text>
</Pressable>

        {/* Logout */}
        <Pressable style={styles.logout}onPress={() => router.replace("/(auth)/login")}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

/* Reusable Item */
function ProfileItem({ icon, label, onPress, theme }: any) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={20} color={theme.colors.text} />
        <Text style={[styles.itemText, { color: theme.colors.text }]}>
          {label}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={theme.colors.subtitle}
      />
    </Pressable>
  );
}

/* Styles (only layout, no colors) */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  header: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  email: {
    fontSize: 14,
  },

  card: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  itemText: {
    fontSize: 15,
  },

  switchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  logout: {
    flexDirection: "row",
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  switchRole: {
  flexDirection: "row",
  padding: 15,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  gap: 10,
  marginTop: 10,
},

switchText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},
});