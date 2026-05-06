import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import React, { useRef } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";

export default function Role() {
  const scaleUser = useRef(new Animated.Value(1)).current;
  const scaleMech = useRef(new Animated.Value(1)).current;

  const animatePress = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const selectRole = async (role: "user" | "mechanic") => {
    console.log("Selected role:", role);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // ✅ PERSIST ROLE TO DATABASE
        await supabase
          .from("profiles")
          .update({ role: role })
          .eq("id", user.id);
      }

      // OPTIONAL: store last selected role (for smoother UX)
      await AsyncStorage.setItem("last_role", role);

      // ROUTE BASED ON ROLE
      if (role === "user") {
        router.replace("/(user)/home");
      } else {
        router.replace("/(mechanic)/dashboard");
      }
    } catch (err) {
      console.error("Error setting role:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>
        Select how you want to use Fixr
      </Text>

      {/* USER CARD */}
      <Animated.View style={{ transform: [{ scale: scaleUser }] }}>
        <Pressable
          onPress={() => {
            animatePress(scaleUser);
            selectRole("user");
          }}
          style={styles.card}
        >
          <Text style={styles.emoji}>🚗</Text>
          <Text style={styles.cardTitle}>I need a Mechanic</Text>
          <Text style={styles.cardDesc}>
            Request help instantly when your vehicle breaks down anywhere
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>FAST HELP</Text>
          </View>
        </Pressable>
      </Animated.View>

      {/* MECHANIC CARD */}
      <Animated.View style={{ transform: [{ scale: scaleMech }] }}>
        <Pressable
          onPress={() => {
            animatePress(scaleMech);
            selectRole("mechanic");
          }}
          style={[styles.card, styles.cardAlt]}
        >
          <Text style={styles.emoji}>🔧</Text>
          <Text style={styles.cardTitle}>I am a Mechanic</Text>
          <Text style={styles.cardDesc}>
            Receive jobs nearby and earn money fixing vehicles
          </Text>

          <View style={[styles.badge, { backgroundColor: "#2563eb" }]}>
            <Text style={styles.badgeText}>EARN MONEY</Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    color: "#0f172a",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 8,
    marginBottom: 40,
    fontSize: 15,
  },

  card: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 18,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 4,
    borderWidth: 1,
    borderColor: "#eef2f7",
  },

  cardAlt: {
    borderColor: "#dbeafe",
  },

  emoji: {
    fontSize: 34,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },

  badge: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#10b981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});