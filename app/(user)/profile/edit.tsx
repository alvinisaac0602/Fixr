import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  StatusBar,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const Edit = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Edit Profile
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Profile Image */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />

        <Pressable style={styles.changePhotoBtn}>
          <Ionicons name="camera-outline" size={16} color="#2563EB" />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </Pressable>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.colors.subtitle }]}>
          Full Name
        </Text>
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor={theme.colors.subtitle}
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
        />

        <Text style={[styles.label, { color: theme.colors.subtitle }]}>
          Email
        </Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={theme.colors.subtitle}
          keyboardType="email-address"
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
        />

        <Text style={[styles.label, { color: theme.colors.subtitle }]}>
          Phone
        </Text>
        <TextInput
          placeholder="Enter your phone"
          placeholderTextColor={theme.colors.subtitle}
          keyboardType="phone-pad"
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
        />
      </View>

      {/* Save Button */}
      <Pressable style={styles.saveBtn}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Edit;

/* Styles (layout only, no colors) */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },

  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  changePhotoText: {
    color: "#2563EB",
    fontWeight: "500",
  },

  form: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 15,
  },

  saveBtn: {
    backgroundColor: "#111",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});