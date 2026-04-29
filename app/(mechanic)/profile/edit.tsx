import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const Edit = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const colors = theme.colors;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [avatar, setAvatar] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setForm({
          full_name: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
        });

        setAvatar(data.avatar_url || null);
      }

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  // =========================
  // PICK IMAGE
  // =========================
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required to access gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // =========================
  // UPLOAD IMAGE TO SUPABASE
  // =========================
  const uploadAvatar = async () => {
    if (!avatar || !user) return null;

    if (!avatar.startsWith("file://")) {
      return avatar; // already uploaded
    }

    const fileName = `${user.id}-${Date.now()}.jpg`;

    const res = await fetch(avatar);
    const blob = await res.blob();

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
      });

    if (error) {
      console.log(error.message);
      return null;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

    return data.publicUrl;
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    const uploadedAvatar = await uploadAvatar();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        avatar_url: uploadedAvatar,
        updated_at: new Date(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      console.log(error.message);
      return;
    }

    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>

          <Text style={[styles.title, { color: colors.text }]}>
            Edit Profile
          </Text>

          <View style={{ width: 24 }} />
        </View>

        {/* AVATAR */}
        <View style={styles.avatarSection}>
          <Pressable onPress={pickImage}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={28} color="#fff" />
              </View>
            )}
          </Pressable>

          <Text style={{ color: colors.subtitle, marginTop: 8 }}>
            Tap to change profile picture
          </Text>
        </View>

        {/* FORM */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.subtitle }]}>
            Full Name
          </Text>
          <TextInput
            value={form.full_name}
            onChangeText={(t) => setForm({ ...form, full_name: t })}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />

          <Text style={[styles.label, { color: colors.subtitle }]}>
            Email
          </Text>
          <TextInput
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />

          <Text style={[styles.label, { color: colors.subtitle }]}>
            Phone
          </Text>
          <TextInput
            value={form.phone}
            onChangeText={(t) => setForm({ ...form, phone: t })}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
        </View>

        {/* SAVE */}
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Edit;

/* STYLES */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    marginTop: 12,
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },

  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});