import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

export default function Support() {
  const { theme } = useTheme();

  const colors = {
    bg: theme.colors.background,
    card: theme.colors.card,
    text: theme.colors.text,
    sub: theme.colors.subtitle,
    primary: "#111",
  };

  const callSupport = () => {
    Linking.openURL("tel:+256700000000");
  };

  const emailSupport = () => {
    Linking.openURL("mailto:support@mechanicapp.com");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <Text style={[styles.title, { color: colors.text }]}>
          Support
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* INFO CARD */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Need Help?
          </Text>

          <Text style={[styles.desc, { color: colors.sub }]}>
            Our support team is available 24/7 to help mechanics resolve issues quickly.
          </Text>

          <Pressable style={styles.button} onPress={callSupport}>
            <Ionicons name="call-outline" size={20} color="#fff" />
            <Text style={styles.btnText}>Call Support</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: "#444" }]}
            onPress={emailSupport}
          >
            <Ionicons name="mail-outline" size={20} color="#fff" />
            <Text style={styles.btnText}>Email Support</Text>
          </Pressable>
        </View>

        {/* FAQ CARD */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            FAQs
          </Text>

          <Text style={[styles.q, { color: colors.text }]}>
            How do I receive jobs?
          </Text>
          <Text style={[styles.a, { color: colors.sub }]}>
            Jobs are automatically assigned based on your location.
          </Text>

          <Text style={[styles.q, { color: colors.text }]}>
            How do I get paid?
          </Text>
          <Text style={[styles.a, { color: colors.sub }]}>
            Payments are processed after job completion.
          </Text>

          <Text style={[styles.q, { color: colors.text }]}>
            Can I cancel a job?
          </Text>
          <Text style={[styles.a, { color: colors.sub }]}>
            Yes, but repeated cancellations may affect your rating.
          </Text>

        </View>

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
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  desc: {
    fontSize: 13,
    marginBottom: 15,
    lineHeight: 18,
  },

  button: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  q: {
    fontWeight: "600",
    marginTop: 10,
  },

  a: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});