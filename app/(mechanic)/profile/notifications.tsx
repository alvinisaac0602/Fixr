import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function Notifications() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const notifications = [
    {
      id: 1,
      title: "Mechanic Accepted Request",
      desc: "John is on the way to your location.",
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Service Completed",
      desc: "Your car repair is complete.",
      time: "Yesterday",
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <Text style={[styles.title, { color: colors.text }]}>
          Notifications
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        
        {notifications.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.title}
            </Text>

            <Text style={[styles.desc, { color: colors.subtitle }]}>
              {item.desc}
            </Text>

            <Text style={[styles.time, { color: colors.subtitle }]}>
              {item.time}
            </Text>
          </View>
        ))}

        {notifications.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={50} color={colors.subtitle} />
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No notifications
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
  },

  cardTitle: {
    fontWeight: "600",
    fontSize: 15,
  },

  desc: {
    marginTop: 5,
    fontSize: 13,
  },

  time: {
    marginTop: 10,
    fontSize: 11,
  },

  empty: {
    alignItems: "center",
    marginTop: 50,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});