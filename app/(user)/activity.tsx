import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const Activity = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  // 🔥 FETCH DATA FROM SUPABASE
  useEffect(() => {
    const fetchActivity = async () => {
      if (!user) return;

      setLoading(true);

      // ACTIVE JOB
      const { data: active } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "accepted")
        .maybeSingle();

      // HISTORY
      const { data: past } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["completed", "cancelled"])
        .order("created_at", { ascending: false });

      // 🔥 ENRICH DATA WITH PROFILES
      if (active?.mechanic_id) {
        const { data: mech } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", active.mechanic_id)
          .single();

        active.mechanic_name = mech?.full_name;
      }

      const enrichedHistory = await Promise.all(
        (past || []).map(async (item) => {
          if (item.mechanic_id) {
            const { data: mech } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", item.mechanic_id)
              .single();

            return {
              ...item,
              mechanic_name: mech?.full_name,
            };
          }
          return item;
        })
      );

      setActiveJob(active);
      setHistory(enrichedHistory);

      setLoading(false);
    };

    fetchActivity();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading activity...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <StatusBar style={theme.darkMode ? "light" : "dark"} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* TITLE */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Activity
        </Text>

        {/* ACTIVE JOB */}
        {activeJob ? (
          <View
            style={[
              styles.activeCard,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Text style={[styles.activeTitle, { color: theme.colors.text }]}>
              Ongoing Service
            </Text>

            <Text style={[styles.bold, { color: theme.colors.text }]}>
              {activeJob.mechanic_name || "Mechanic"}
            </Text>

            <Text style={{ color: theme.colors.text }}>
              Request in progress
            </Text>

            <Text style={[styles.gray, { color: theme.colors.subtitle }]}>
              {activeJob.latitude}, {activeJob.longitude}
            </Text>

            <View style={styles.statusRow}>
              <Ionicons name="time-outline" size={16} color="#ff9500" />
              <Text style={styles.activeStatus}>
                {activeJob.status}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={{ color: theme.colors.subtitle }}>
            No active job
          </Text>
        )}

        {/* HISTORY */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          History
        </Text>

        {history.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={50} color={theme.colors.subtitle} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No activity yet
            </Text>
          </View>
        ) : (
          history.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.card,
                { backgroundColor: theme.colors.card },
              ]}
            >
              <View>
                <Text style={[styles.bold, { color: theme.colors.text }]}>
                  {item.mechanic_name || "Mechanic"}
                </Text>

                <Text style={{ color: theme.colors.text }}>
                  Service request
                </Text>

                <Text style={[styles.gray, { color: theme.colors.subtitle }]}>
                  {new Date(item.created_at).toDateString()}
                </Text>
              </View>

              <View style={styles.right}>
                <Text
                  style={[
                    styles.status,
                    item.status === "completed"
                      ? styles.completed
                      : styles.cancelled,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Activity;

/* NO COLORS HERE */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    padding: 20,
    flexGrow: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  activeCard: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },

  activeTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  activeStatus: {
    color: "#ff9500",
    marginLeft: 5,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  loader: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},

  bold: {
    fontWeight: "bold",
  },

  gray: {
    fontSize: 12,
  },

  right: {
    alignItems: "flex-end",
  },

  price: {
    fontWeight: "bold",
  },

  status: {
    fontSize: 12,
    marginTop: 5,
  },

  completed: {
    color: "green",
  },

  cancelled: {
    color: "red",
  },

  empty: {
    alignItems: "center",
    marginTop: 50,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  emptySub: {
    marginBottom: 20,
  },

  cta: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
  },

  ctaText: {
    color: "#fff",
    fontWeight: "bold",
  },
});