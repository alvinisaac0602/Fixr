import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Edit = () => {
  // 🔥 replace with your real theme context later
  const isDark = false;

  const colors = {
    bg: isDark ? "#0f172a" : "#f6f7fb",
    card: isDark ? "#1e293b" : "#fff",
    text: isDark ? "#fff" : "#111",
    sub: isDark ? "#94a3b8" : "#666",
    border: isDark ? "#334155" : "#e5e7eb",
    primary: "#2563eb",
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
  <Pressable onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} color={colors.text} />
  </Pressable>

  <Text style={[styles.title, { color: colors.text }]}>
    Edit Profile
  </Text>

  <View style={{ width: 24 }} />
</View>

        {/* FORM CARD */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          
          <Text style={[styles.label, { color: colors.sub }]}>Full Name</Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor={colors.sub}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
          />

          <Text style={[styles.label, { color: colors.sub }]}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor={colors.sub}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
          />

          <Text style={[styles.label, { color: colors.sub }]}>Phone</Text>
          <TextInput
            placeholder="Enter your phone"
            placeholderTextColor={colors.sub}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
          />

          <Text style={[styles.label, { color: colors.sub }]}>
            Location
          </Text>
          <TextInput
            placeholder="Enter your location"
            placeholderTextColor={colors.sub}
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
          />
        </View>

        {/* SAVE BUTTON */}
        <Pressable style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Edit;

/* STYLES */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  card: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    marginTop: 12,
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },

  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});