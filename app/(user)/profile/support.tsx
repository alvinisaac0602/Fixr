import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Linking,
  ScrollView,
  StatusBar,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";

const Support = () => {
  const { theme } = useTheme();

  const handleCall = () => {
    Linking.openURL("tel:+256789186476");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:kiizaisaacalvin256@gmail.com");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </Pressable>

          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Help & Support
            </Text>

            <Text style={[styles.subtitle, { color: theme.colors.subtitle }]}>
              Learn how to use the app or get help anytime
            </Text>
          </View>
        </View>

        {/* HOW TO USE */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            How to Use the App
          </Text>

          <Step number="1" text="Open the app and sign in or create an account." theme={theme} />
          <Step number="2" text="Go to 'Request Mechanic' on the home screen." theme={theme} />
          <Step number="3" text="Describe your car problem clearly." theme={theme} />
          <Step number="4" text="A nearby mechanic will be assigned to you." theme={theme} />
          <Step number="5" text="Track arrival and pay after service." theme={theme} />
        </View>

        {/* FEATURES */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Key Features
          </Text>

          <Feature text="🚗 Request a mechanic anytime, anywhere" theme={theme} />
          <Feature text="📍 Track mechanic location in real time" theme={theme} />
          <Feature text="💬 Chat with mechanics before arrival" theme={theme} />
          <Feature text="⭐ Rate and review service" theme={theme} />
        </View>

        {/* QUICK HELP */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Need More Help?
          </Text>

          <SupportItem
            icon="call-outline"
            label="Call Support"
            onPress={handleCall}
            theme={theme}
          />

          <SupportItem
            icon="mail-outline"
            label="Email Support"
            onPress={handleEmail}
            theme={theme}
          />
        </View>

        {/* FAQ */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            FAQs
          </Text>

          <Text style={[styles.faqQ, { color: theme.colors.text }]}>
            How do I request a mechanic?
          </Text>
          <Text style={[styles.faqA, { color: theme.colors.subtitle }]}>
            Tap "Request Mechanic" and fill in your car issue.
          </Text>

          <Text style={[styles.faqQ, { color: theme.colors.text }]}>
            How fast will help arrive?
          </Text>
          <Text style={[styles.faqA, { color: theme.colors.subtitle }]}>
            Usually within 15–30 minutes depending on location.
          </Text>

          <Text style={[styles.faqQ, { color: theme.colors.text }]}>
            Can I cancel a request?
          </Text>
          <Text style={[styles.faqA, { color: theme.colors.subtitle }]}>
            Yes, you can cancel before the mechanic arrives.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

/* Components */
function SupportItem({ icon, label, onPress, theme }: any) {
  return (
    <Pressable
      style={[
        styles.item,
        { borderTopColor: theme.colors.border },
      ]}
      onPress={onPress}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={20} color={theme.colors.text} />
        <Text style={[styles.itemText, { color: theme.colors.text }]}>
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.subtitle} />
    </Pressable>
  );
}

function Step({ number, text, theme }: any) {
  return (
    <View style={styles.step}>
      <Text style={styles.stepNumber}>{number}</Text>
      <Text style={[styles.stepText, { color: theme.colors.text }]}>
        {text}
      </Text>
    </View>
  );
}

function Feature({ text, theme }: any) {
  return (
    <Text style={[styles.feature, { color: theme.colors.text }]}>
      {text}
    </Text>
  );
}

export default Support;

/* Styles (NO COLORS HERE) */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  backBtn: {
    marginRight: 10,
    padding: 5,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
  },

  card: {
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  itemText: {
    fontSize: 15,
  },

  step: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },

  stepNumber: {
    fontWeight: "700",
    marginRight: 10,
    color: "#2563EB",
  },

  stepText: {
    flex: 1,
  },

  feature: {
    fontSize: 14,
    marginBottom: 8,
  },

  faqQ: {
    fontWeight: "600",
    marginTop: 10,
    fontSize: 14,
  },

  faqA: {
    fontSize: 13,
    marginTop: 4,
  },
});