import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Notifications() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const colors = theme.colors;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 📡 FETCH
  const fetchNotifications = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setNotifications(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // 🔴 REALTIME
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-realtime")
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
  }, [user]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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

      {/* LOADING */}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {/* LIST */}
      {!loading && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((item) => (
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {item.title || "Notification"}
              </Text>

              <Text style={[styles.desc, { color: colors.subtitle }]}>
                {item.description || ""}
              </Text>

              <Text style={[styles.time, { color: colors.subtitle }]}>
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : ""}
              </Text>
            </View>
          ))}

          {/* EMPTY */}
          {notifications.length === 0 && (
            <View style={styles.empty}>
              <Ionicons
                name="notifications-off-outline"
                size={50}
                color={colors.subtitle}
              />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No notifications
              </Text>
            </View>
          )}
        </ScrollView>
      )}
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

  loader: {
    marginTop: 50,
    alignItems: "center",
  },
});