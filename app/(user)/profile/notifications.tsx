import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  StatusBar,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const Notifications = () => {
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
          Notifications
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        {/* EMPTY STATE */}
        <View style={styles.emptyBox}>
          <Ionicons
            name="notifications-off-outline"
            size={60}
            color={theme.colors.subtitle}
          />

          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No Notifications
          </Text>

          <Text style={[styles.emptyText, { color: theme.colors.subtitle }]}>
            Updates about your mechanic requests will appear here.
          </Text>
        </View>

        {/* SAMPLE NOTIFICATION 1 */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <View style={styles.row}>
            <Ionicons name="car-outline" size={20} color="#2563EB" />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Mechanic Accepted
            </Text>
          </View>

          <Text style={[styles.desc, { color: theme.colors.subtitle }]}>
            John the mechanic is on the way to your location.
          </Text>

          <Text style={[styles.time, { color: theme.colors.subtitle }]}>
            2 mins ago
          </Text>
        </View>

        {/* SAMPLE NOTIFICATION 2 */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <View style={styles.row}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#22c55e"
            />
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Request Completed
            </Text>
          </View>

          <Text style={[styles.desc, { color: theme.colors.subtitle }]}>
            Your car repair has been completed successfully.
          </Text>

          <Text style={[styles.time, { color: theme.colors.subtitle }]}>
            Yesterday
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;

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

  card: {
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  desc: {
    marginTop: 6,
  },

  time: {
    marginTop: 10, 
    fontSize: 12,
  },
});