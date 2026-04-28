import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const Requests = () => {
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

        <Text style={[styles.title, { color: theme.colors.text }]}>
          My Requests
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        {/* EMPTY STATE */}
        <View style={styles.emptyBox}>
          <Ionicons
            name="car-outline"
            size={60}
            color={theme.colors.subtitle}
          />

          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No Requests Yet
          </Text>

          <Text style={[styles.emptyText, { color: theme.colors.subtitle }]}>
            When you request a mechanic, your jobs will appear here.
          </Text>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Request Mechanic</Text>
          </Pressable>
        </View>

        {/* SAMPLE REQUEST CARD */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Car Breakdown
            </Text>

            <Text style={styles.status}>Active</Text>
          </View>

          <Text style={[styles.desc, { color: theme.colors.subtitle }]}>
            Engine issue near Ntinda
          </Text>

          <View style={styles.row}>
            <Text style={[styles.meta, { color: theme.colors.subtitle }]}>
              15 mins ago
            </Text>

            <Text style={[styles.meta, { color: theme.colors.subtitle }]}>
              ETA: 12 min
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Requests;

/* Styles (layout only) */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 60,
    padding: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },

  emptyText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  status: {
    color: "#22c55e",
    fontWeight: "600",
  },

  desc: {
    marginTop: 5,
  },

  meta: {
    fontSize: 12,
    marginTop: 10,
  },
});