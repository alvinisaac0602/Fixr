import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Welcome() {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const handleContinue = async () => {
    // mark flow as completed
    await AsyncStorage.setItem("hasSeenWelcomeFlow", "true");

    router.replace("/(auth)/login");
  };

  return (
    <LinearGradient
      colors={["#2E1065", "#4C1D95", "#6D28D9"]}
      style={styles.container}
    >
      {/* ✅ FIXED STATUS BAR */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Glow layer */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glowOpacity,
          },
        ]}
      />

      <SafeAreaView style={styles.safe}>
        {/* TOP */}
        <View style={styles.top}>
          <Text style={styles.logo}>Fixr</Text>
        </View>

        {/* CENTER */}
        <View style={styles.center}>
          <View style={styles.iconBubble}>
            <Text style={styles.icon}>🚗🔧</Text>
          </View>

          <Text style={styles.title}>Welcome 👋</Text>

          <Text style={styles.subtitle}>
            Get instant roadside help or earn money as a mechanic anywhere in Uganda.
          </Text>
        </View>

        {/* BOTTOM */}
        <View style={styles.bottom}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>

          <Text style={styles.footer}>
            Fast • Reliable • Nearby mechanics
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#A78BFA",
    top: "30%",
    left: "20%",
    shadowColor: "#A78BFA",
    shadowOpacity: 0.8,
    shadowRadius: 80,
  },

  safe: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },

  top: {
    marginTop: 20,
  },

  logo: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
    textAlign: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  iconBubble: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 18,
    borderRadius: 50,
    marginBottom: 20,
  },

  icon: {
    fontSize: 28,
  },

  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    marginTop: 12,
    lineHeight: 24,
    textAlign: "center",
  },

  bottom: {
    marginBottom: 24,
  },

  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#4C1D95",
    fontSize: 16,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
});