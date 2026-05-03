import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

const Security = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme.darkMode;

  const colors = {
    bg: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    sub: theme.colors.subtitle,
    border: theme.colors.border || (isDark ? "#334155" : "#e5e7eb"),
    primary: theme.colors.primary,
    danger: "#ff3b30",
  };

  // =========================
  // STATE
  // =========================
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // UPDATE PASSWORD
  // =========================
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      alert("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar style={theme.darkMode ? "light" : "dark"} />

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>

          <Text style={[styles.title, { color: colors.text }]}>
            Security
          </Text>

          <View style={{ width: 24 }} />
        </View>

        {/* PASSWORD CARD */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Change Password
          </Text>

          <TextInput
            placeholder="Current password"
            placeholderTextColor={colors.sub}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text },
            ]}
          />

          <TextInput
            placeholder="New password"
            placeholderTextColor={colors.sub}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text },
            ]}
          />

          <TextInput
            placeholder="Confirm password"
            placeholderTextColor={colors.sub}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text },
            ]}
          />

          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleChangePassword}
          >
            <Text style={styles.buttonText}>
              {loading ? "Updating..." : "Update Password"}
            </Text>
          </Pressable>
        </View>

        {/* SETTINGS */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Preferences
          </Text>

          {/* DARK MODE */}
          <View
            style={[
              styles.row,
              { borderColor: colors.border },
            ]}
          >
            <View style={styles.left}>
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
        </View>

        {/* DANGER ZONE */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.danger }]}>
            Danger Zone
          </Text>

          <Pressable style={styles.dangerBtn}>
            <Text style={styles.dangerText}>Delete Account</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Security;

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  text: {
    fontSize: 15,
    fontWeight: "500",
  },

  dangerBtn: {
    backgroundColor: "#ff3b30",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  dangerText: {
    color: "#fff",
    fontWeight: "700",
  },
});