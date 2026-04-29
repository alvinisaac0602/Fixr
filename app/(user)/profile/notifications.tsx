import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const Notifications = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH NOTIFICATIONS (FIXED)
  // =========================
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
    } else {
      setNotifications(data || []);
    }

    setLoading(false);
  }, [user]);

  // =========================
  // REALTIME + INITIAL LOAD
  // =========================
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} />

      {/* HEADER */}
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
        {notifications.length === 0 && (
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
        )}

        {notifications.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.row}>
              <Ionicons
                name={
                  item.type === "success"
                    ? "checkmark-circle-outline"
                    : item.type === "warning"
                    ? "warning-outline"
                    : "notifications-outline"
                }
                size={20}
                color={
                  item.type === "success"
                    ? "#22c55e"
                    : item.type === "warning"
                    ? "#f59e0b"
                    : "#2563EB"
                }
              />

              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                {item.title}
              </Text>
            </View>

            <Text style={[styles.desc, { color: theme.colors.subtitle }]}>
              {item.message}
            </Text>

            <Text style={[styles.time, { color: theme.colors.subtitle }]}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;

/* STYLES */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },

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

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});