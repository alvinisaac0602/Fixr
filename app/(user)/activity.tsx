import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

const Activity = () => {
  const { theme } = useTheme();

  const activeJob = {
    mechanic: "John Mechanic",
    issue: "Engine overheating",
    location: "Ntinda, Kampala",
    status: "On the way",
  };

  const history = [
    {
      id: 1,
      mechanic: "Peter Auto",
      issue: "Battery replacement",
      location: "Kololo",
      price: "UGX 80,000",
      status: "Completed",
      date: "Today",
    },
    {
      id: 2,
      mechanic: "David Garage",
      issue: "Brake repair",
      location: "Nakawa",
      price: "UGX 50,000",
      status: "Cancelled",
      date: "Yesterday",
    },
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <StatusBar style={theme.darkMode ? "light" : "dark"} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Activity
        </Text>

        {/* Active Job */}
        {activeJob && (
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
              {activeJob.mechanic}
            </Text>

            <Text style={{ color: theme.colors.text }}>
              {activeJob.issue}
            </Text>

            <Text style={[styles.gray, { color: theme.colors.subtitle }]}>
              {activeJob.location}
            </Text>

            <View style={styles.statusRow}>
              <Ionicons name="time-outline" size={16} color="#ff9500" />
              <Text style={styles.activeStatus}>{activeJob.status}</Text>
            </View>
          </View>
        )}

        {/* History */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          History
        </Text>

        {history.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={50} color={theme.colors.subtitle} />

            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No activity yet
            </Text>

            <Text style={[styles.emptySub, { color: theme.colors.subtitle }]}>
              You haven’t requested a mechanic yet
            </Text>

            <Pressable style={styles.cta}>
              <Text style={styles.ctaText}>Request Mechanic</Text>
            </Pressable>
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
                  {item.mechanic}
                </Text>

                <Text style={{ color: theme.colors.text }}>
                  {item.issue}
                </Text>

                <Text style={[styles.gray, { color: theme.colors.subtitle }]}>
                  {item.location}
                </Text>
              </View>

              <View style={styles.right}>
                <Text style={[styles.price, { color: theme.colors.text }]}>
                  {item.price}
                </Text>

                <Text
                  style={[
                    styles.status,
                    item.status === "Completed"
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