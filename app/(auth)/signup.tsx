import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#4C1D95";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !username) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      if (user) {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          username,
          role: "user",
        });
      }

      router.replace("/(auth)/role");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY} />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.logo}>Fixr</Text>
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>
                Join and get roadside help or earn as a mechanic
              </Text>
            </View>

            {/* FORM */}
            <View style={styles.center}>
              <TextInput
                placeholder="Username"
                placeholderTextColor="#A5B4FC"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />

              <TextInput
                placeholder="Email"
                placeholderTextColor="#A5B4FC"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* PASSWORD FIELD WITH EYE */}
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#A5B4FC"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.passwordInput}
                />

                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eye}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#A5B4FC"
                  />
                </Pressable>
              </View>

              <Pressable style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>
                  {loading ? "Creating..." : "Sign Up"}
                </Text>
              </Pressable>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.link}>
                  Already have an account?{" "}
                  <Text style={styles.linkUnderline}>Login</Text>
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY,
  },

  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },

  header: {
    marginTop: 10,
  },

  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },

  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
  },

  center: {
    flex: 1,
    justifyContent: "center",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  button: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: PRIMARY,
    fontWeight: "900",
    fontSize: 16,
  },

  footer: {
    paddingBottom: 20,
    alignItems: "center",
  },

  link: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
  },

  linkUnderline: {
    textDecorationLine: "underline",
    fontWeight: "700",
    color: "#fff",
  },
  scroll: {
  flexGrow: 1,
},

passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255,255,255,0.12)",
  borderRadius: 12,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.15)",
},

passwordInput: {
  flex: 1,
  padding: 14,
  color: "#fff",
},

eye: {
  paddingHorizontal: 12,
},
});