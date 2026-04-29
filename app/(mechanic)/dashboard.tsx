import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  // 🔒 Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, authLoading]);

  // 📍 Get location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Permission denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoading(false);
    })();
  }, []);

  // 📡 Fetch pending requests
  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("status", "pending");

      if (!error) setRequests(data || []);
    };

    fetchRequests();
  }, []);

  // ⚡ Realtime new requests
  useEffect(() => {
    const channel = supabase
      .channel("new-requests")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "requests",
        },
        (payload) => {
          setRequests((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ Accept request
  const acceptRequest = async (requestId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("requests")
      .update({
        status: "accepted",
        mechanic_id: user.id,
      })
      .eq("id", requestId);

    if (error) {
      alert("Failed to accept request");
    } else {
      // remove from UI
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    }
  };

  const toggleOnline = () => {
    setOnline((prev) => !prev);
  };

  if (loading || authLoading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You (Mechanic)"
        />
      </MapView>

      {/* STATUS */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Status: {online ? "🟢 Online" : "🔴 Offline"}
        </Text>
      </View>

      {/* BOTTOM PANEL */}
      <View style={styles.bottomCard}>
        <Text style={styles.title}>Mechanic Dashboard</Text>

        <Pressable
          style={[
            styles.button,
            { backgroundColor: online ? "red" : "green" },
          ]}
          onPress={toggleOnline}
        >
          <Text style={styles.buttonText}>
            {online ? "Go Offline" : "Go Online"}
          </Text>
        </Pressable>

        {/* 🔥 REQUESTS LIST */}
        {online && (
          <>
            <Text style={{ marginTop: 15, fontWeight: "bold" }}>
              Incoming Requests
            </Text>

            {requests.length === 0 ? (
              <Text style={{ color: "gray", marginTop: 10 }}>
                No requests yet...
              </Text>
            ) : (
              <FlatList
                data={requests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.requestCard}>
                    <Text>User needs help 📍</Text>

                    <Pressable
                      style={styles.acceptBtn}
                      onPress={() => acceptRequest(item.id)}
                    >
                      <Text style={{ color: "#fff" }}>Accept</Text>
                    </Pressable>
                  </View>
                )}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: { flex: 1 },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  statusBar: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 5,
  },

  statusText: {
    fontWeight: "bold",
  },

  bottomCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  requestCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  acceptBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
  },
});