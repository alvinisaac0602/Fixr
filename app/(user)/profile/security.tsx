import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  StatusBar,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const Security = () => {
  const [biometric, setBiometric] = useState(false);
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
          Security
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View style={styles.container}>
        
        {/* Password Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Change Password
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.subtitle }]}>
            Current Password
          </Text>
          <TextInput
            placeholder="Enter current password"
            placeholderTextColor={theme.colors.subtitle}
            secureTextEntry
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

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.subtitle }]}>
            New Password
          </Text>
          <TextInput
            placeholder="Enter new password"
            placeholderTextColor={theme.colors.subtitle}
            secureTextEntry
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

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.subtitle }]}>
            Confirm Password
          </Text>
          <TextInput
            placeholder="Confirm new password"
            placeholderTextColor={theme.colors.subtitle}
            secureTextEntry
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

        {/* Divider */}
        <View
          style={[
            styles.divider,
            { backgroundColor: theme.colors.border },
          ]}
        />

        {/* Security Options */}
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
            <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
              Biometric Login
            </Text>
            <Text style={[styles.optionSub, { color: theme.colors.subtitle }]}>
              Use fingerprint or Face ID
            </Text>
          </View>

          <Switch value={biometric} onValueChange={setBiometric} />
        </View>
      </View>

      {/* Save Button */}
      <Pressable style={styles.saveBtn}>
        <Text style={styles.saveText}>Update Security</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Security;

/* Styles (layout only) */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 5,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  container: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  inputGroup: {
    marginBottom: 15,
  },

  label: {
    fontSize: 13,
    marginBottom: 5,
  },

  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 15,
  },

  divider: {
    height: 1,
    marginVertical: 20,
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
  },

  saveBtn: {
    backgroundColor: "#111",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});