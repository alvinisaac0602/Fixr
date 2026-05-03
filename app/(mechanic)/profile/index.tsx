import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Switch,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { StatusBar } from "expo-status-bar";

type MenuItemProps = {
  icon: any;
  label: string;
  onPress: () => void;
  colors: any;
};

export default function Profile() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const colors = theme.colors;
  const [profile, setProfile] = useState<any>(null);

  const getInitials = (email: string) => {
    if (!email) return "M";
    const namePart = email.split("@")[0];
    const parts = namePart.split(/[._-]/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
    };

    fetchProfile();
  }, [user]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
       <StatusBar style={theme.darkMode ? "light" : "dark"} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>

          <Text style={[styles.title, { color: colors.text }]}>
            Mechanic Profile
          </Text>

          <View style={{ width: 24 }} />
        </View>

        {/* PROFILE CARD */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>

          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: "#555",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={{ color: "#fff", fontSize: 24, fontWeight: "700" }}>
                {getInitials(user?.email || "")}
              </Text>
            </View>
          )}

          <Text style={[styles.name, { color: colors.text }]}>
            {profile?.full_name || user?.email || "Mechanic"}
          </Text>

          <Text style={{ color: colors.subtitle }}>
            Mobile Auto Technician
          </Text>
        </View>

        {/* MENU */}
        <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <MenuItem
            icon="person-outline"
            label="Edit Profile"
            colors={colors}
            onPress={() => router.push("/(mechanic)/profile/edit")}
          />

          <MenuItem
            icon="shield-checkmark-outline"
            label="Security"
            colors={colors}
            onPress={() => router.push("/(mechanic)/profile/security")}
          />

          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            colors={colors}
            onPress={() => router.push("/(mechanic)/profile/notifications")}
          />

          {/* DARK MODE */}
          <View style={styles.item}>
            <View style={styles.leftRow}>
              <Ionicons name="moon-outline" size={20} color={colors.text} />
              <Text style={[styles.text, { color: colors.text }]}>
                Dark Mode
              </Text>
            </View>

            <Switch
              value={theme.darkMode}
              onValueChange={toggleTheme}
            />
          </View>

          <MenuItem
            icon="construct-outline"
            label="Support & Tools"
            colors={colors}
            onPress={() => router.push("/(mechanic)/profile/support")}
          />
        </View>

        {/* SWITCH TO USER */}
        <Pressable
          style={[
            styles.switchRole,
            {
              backgroundColor: theme.darkMode ? "#222" : "#111",
            },
          ]}
          onPress={() => router.replace("/(user)/home")}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color="#fff" />
          <Text style={styles.switchText}>Switch to User Mode</Text>
        </Pressable>

        {/* LOGOUT */}
        <Pressable
          style={styles.logout}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

/* MENU ITEM */
function MenuItem({ icon, label, onPress, colors }: MenuItemProps) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={styles.leftRow}>
        <Ionicons name={icon} size={20} color={colors.text} />
        <Text style={[styles.text, { color: colors.text }]}>
          {label}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.subtitle} />
    </Pressable>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },

  iconBtn: { padding: 5 },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  profileCard: {
    marginHorizontal: 20,
    padding: 22,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 47,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  menuCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
  },

  item: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 15,
},
  
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  text: {
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 10,
  },

  logout: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#ff3b30",
    gap: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },

  switchRole: {
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },

  switchText: {
    color: "#fff",
    fontWeight: "700",
  },
});