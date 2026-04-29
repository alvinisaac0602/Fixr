import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";

const Edit = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(
    "https://i.pravatar.cc/150?img=12"
  );
  const [loading, setLoading] = useState(true);

  // ========================
  // LOAD PROFILE
  // ========================
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setName(data.full_name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAvatar(data.avatar_url || "https://i.pravatar.cc/150?img=12");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  // ========================
  // PICK IMAGE
  // ========================
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // ========================
  // SAVE TO SUPABASE
  // ========================
  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name,
        email,
        phone,
        avatar_url: avatar,
        updated_at: new Date(),
      })
      .eq("id", user.id);

    if (!error) {
      router.back();
    } else {
      console.log("Update error:", error.message);
    }
  };

  // ========================
  // LOADING STATE
  // ========================
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </Pressable>

            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Edit Profile
            </Text>

            <View style={{ width: 24 }} />
          </View>

          {/* AVATAR */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />

            <Pressable style={styles.changePhotoBtn} onPress={pickImage}>
              <Ionicons name="camera-outline" size={16} color="#2563EB" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </Pressable>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.colors.subtitle }]}>
              Full Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={theme.colors.subtitle}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
            />

            <Text style={[styles.label, { color: theme.colors.subtitle }]}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.colors.subtitle}
              keyboardType="email-address"
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
            />

            <Text style={[styles.label, { color: theme.colors.subtitle }]}>
              Phone
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone"
              placeholderTextColor={theme.colors.subtitle}
              keyboardType="phone-pad"
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
            />
          </View>

          {/* SAVE BUTTON */}
          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Edit;

/* Styles (layout only, no colors) */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
  },

  changePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  changePhotoText: {
    color: "#2563EB",
    fontWeight: "500",
  },

  form: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 15,
  },

  saveBtn: {
    backgroundColor: "#111",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
