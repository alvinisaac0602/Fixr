import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useCallback } from "react";

export default function EditProfile() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();

  const [profile, setProfile] = useState<any>({});

  // =========================
  // INITIALS
  // =========================
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // =========================
  // REFRESH PROFILE ON FOCUS
  // =========================
  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      const getProfile = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      };

      getProfile();
    }, [user])
  );

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <StatusBar style={theme.darkMode ? "light" : "dark"} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* HEADER */}
        <View style={styles.header}>

          {/* AVATAR */}
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.avatarFallback,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text style={styles.initials}>
                {getInitials(profile?.full_name || profile?.username || "")}
              </Text>
            </View>
          )}

          {/* NAME */}
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {profile.full_name || profile.username || "No Name"}
          </Text>

          {/* EMAIL */}
          <Text style={[styles.email, { color: theme.colors.subtitle }]}>
            {profile.email || user?.email}
          </Text>
        </View>

        {/* ACCOUNT */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
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

        {/* SETTINGS */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
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
              <Ionicons name="moon-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.itemText, { color: theme.colors.text }]}>
                Dark Mode
              </Text>
            </View>

            <Switch value={theme.darkMode} onValueChange={toggleTheme} />
          </View>

          <ProfileItem
            icon="help-circle-outline"
            label="Help & Support"
            theme={theme}
            onPress={() => router.push("/(user)/profile/support")}
          />
        </View>

        {/* SWITCH ROLE */}
        <Pressable
          style={[styles.switchRole, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.replace("/(mechanic)/dashboard")}
        >
          <Ionicons name="construct-outline" size={20} color="#fff" />
          <Text style={styles.switchText}>Switch to Mechanic Mode</Text>
        </Pressable>

        {/* LOGOUT */}
        <Pressable style={styles.logout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ITEM */
function ProfileItem({ icon, label, onPress, theme }: any) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={20} color={theme.colors.text} />
        <Text style={[styles.itemText, { color: theme.colors.text }]}>
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.subtitle} />
    </Pressable>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

  avatarFallback: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  initials: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
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