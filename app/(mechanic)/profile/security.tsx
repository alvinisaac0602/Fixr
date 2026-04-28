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

const Security = () => {
  const [isDark, setIsDark] = useState(false);
  const [biometric, setBiometric] = useState(true);

  const colors = {
    bg: isDark ? "#0f172a" : "#f6f7fb",
    card: isDark ? "#1e293b" : "#fff",
    text: isDark ? "#fff" : "#111",
    sub: isDark ? "#94a3b8" : "#666",
    border: isDark ? "#334155" : "#e5e7eb",
    primary: "#2563eb",
    danger: "#ff3b30",
    green: "#22c55e",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
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
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text },
            ]}
          />

          <TextInput
            placeholder="New password"
            placeholderTextColor={colors.sub}
            secureTextEntry
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text },
            ]}
          />

          <TextInput
            placeholder="Confirm password"
            placeholderTextColor={colors.sub}
            secureTextEntry
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text },
            ]}
          />

          <Pressable style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text style={styles.buttonText}>Update Password</Text>
          </Pressable>
        </View>

        {/* SECURITY OPTIONS */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Security Options
          </Text>

          {/* BIOMETRIC */}
          <View style={styles.row}>
            <View style={styles.left}>
              <Ionicons
                name="finger-print-outline"
                size={20}
                color={colors.text}
              />
              <Text style={[styles.text, { color: colors.text }]}>
                Biometric Login
              </Text>
            </View>

            <Switch
              value={biometric}
              onValueChange={() => setBiometric(!biometric)}
            />
          </View>

          {/* DARK MODE */}
          <View style={styles.row}>
            <View style={styles.left}>
              <Ionicons name="moon-outline" size={20} color={colors.text} />
              <Text style={[styles.text, { color: colors.text }]}>
                Dark Mode
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={() => setIsDark(!isDark)}
            />
          </View>
        </View>

        {/* DANGER ZONE */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.danger }]}>
            Danger Zone
          </Text>

          <Pressable style={[styles.dangerBtn]}>
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
    borderColor: "#eee",
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