import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  StatusBar,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

const Security = () => {
  const [biometric, setBiometric] = useState(false);
  const { theme } = useTheme();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // CHANGE PASSWORD
  // =========================
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      return Alert.alert("Error", "Please fill all fields");
    }

    if (newPassword.length < 6) {
      return Alert.alert("Error", "Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Password updated successfully");

      setNewPassword("");
      setConfirmPassword("");

      router.back();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </Pressable>

            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Security
            </Text>

            <View style={{ width: 24 }} />
          </View>

          {/* CONTENT */}
          <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Change Password
            </Text>

            {/* NEW PASSWORD */}
            <TextInput
              placeholder="New password"
              placeholderTextColor={theme.colors.subtitle}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
            />

            {/* CONFIRM PASSWORD */}
            <TextInput
              placeholder="Confirm password"
              placeholderTextColor={theme.colors.subtitle}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
            />

            {/* DIVIDER */}
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.colors.border },
              ]}
            />

            {/* SECURITY OPTIONS */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Security Options
            </Text>

            <View
              style={[
                styles.optionRow,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <View>
                <Text
                  style={[styles.optionTitle, { color: theme.colors.text }]}
                >
                  Biometric Login
                </Text>
                <Text
                  style={[styles.optionSub, { color: theme.colors.subtitle }]}
                >
                  Use fingerprint or Face ID
                </Text>
              </View>

              <Switch value={biometric} onValueChange={setBiometric} />
            </View>
          </View>

          {/* SAVE BUTTON */}
          <Pressable
            style={[
              styles.saveBtn,
              loading && { opacity: 0.6 },
            ]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.saveText}>
              {loading ? "Updating..." : "Update Password"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Security;

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

  container: {
    flex: 1,
    paddingBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 10,
  },

  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 15,
    marginBottom: 15,
  },

  divider: {
    height: 1,
    marginVertical: 25,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "500",
  },

  optionSub: {
    fontSize: 12,
    marginTop: 2,
  },

  saveBtn: {
    backgroundColor: "#111",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
    marginHorizontal: 20,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});