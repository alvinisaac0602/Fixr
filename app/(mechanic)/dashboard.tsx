import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);

  // 👤 customer profile
  const [customerProfile, setCustomerProfile] = useState<any>(null);

  // 🔐 Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, authLoading]);

  // 📍 Get mechanic location
// 📍 Get mechanic location
useEffect(() => {
  (async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (loc?.coords) {
        setLocation(loc.coords);
      }

      setLoading(false);
    } catch (error) {
      console.log("Location error:", error);
      setLoading(false);
    }
  })();
}, []);

  // 📡 Fetch requests
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

  // 🔥 Realtime
  useEffect(() => {
    const channel = supabase
      .channel("new-requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "requests" },
        (payload) => {
          setRequests((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 👤 FETCH CUSTOMER (FIXED)
  const fetchCustomer = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone") // ✅ FIXED
      .eq("id", userId)
      .single();

    setCustomerProfile(data);
  };

  // ✅ ACCEPT REQUEST
  const acceptRequest = async (request: any) => {
    if (!user) return;

    const { error } = await supabase
      .from("requests")
      .update({
        status: "accepted",
        mechanic_id: user.id,
      })
      .eq("id", request.id);

    if (!error) {
      setSelectedRequest(request);

      // 🔥 GET CUSTOMER DETAILS
      fetchCustomer(request.user_id);

      setRequests((prev) =>
        prev.filter((item) => item.id !== request.id)
      );
    }
  };

  // ❌ CANCEL JOB
  const cancelAcceptedRequest = async () => {
    if (!selectedRequest) return;

    const { error } = await supabase
      .from("requests")
      .update({
        status: "cancelled",
        mechanic_id: null,
      })
      .eq("id", selectedRequest.id);

    if (!error) {
      setSelectedRequest(null);
      setCustomerProfile(null);
      setRouteInfo(null);
    }
  };

  // 🔴 Toggle online
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
      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {/* MECHANIC */}
        <Marker coordinate={location} title="You (Mechanic)" />

        {/* CUSTOMER */}
        {selectedRequest && (
          <Marker
            coordinate={{
              latitude: selectedRequest.latitude,
              longitude: selectedRequest.longitude,
            }}
            title="Customer"
            pinColor="blue"
          />
        )}

        {/* ROUTE */}
        {selectedRequest && (
          <MapViewDirections
            origin={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            destination={{
              latitude: selectedRequest.latitude,
              longitude: selectedRequest.longitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
            strokeWidth={4}
            strokeColor="green"
            onReady={(result) => {
              setRouteInfo(result);

              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  top: 100,
                  right: 50,
                  bottom: 250,
                  left: 50,
                },
                animated: true,
              });
            }}
          />
        )}
      </MapView>

      {/* STATUS */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Status: {online ? "🟢 Online" : "🔴 Offline"}
        </Text>
      </View>

      {/* BOTTOM */}
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

        {/* ROUTE INFO */}
        {selectedRequest && routeInfo && (
          <View style={styles.routeCard}>
            <Text>
              📏 Distance: {routeInfo.distance.toFixed(2)} km
            </Text>
            <Text>
              ⏱️ ETA: {Math.ceil(routeInfo.duration)} mins
            </Text>
          </View>
        )}

        {/* 👤 CUSTOMER DETAILS (FIXED DISPLAY) */}
        {selectedRequest && customerProfile && (
          <View style={styles.routeCard}>
            <Text style={{ fontWeight: "bold" }}>
              👤 Customer Details
            </Text>
            <Text>
              Name: {customerProfile?.username || "No name"}
            </Text>
            <Text>
              Phone: {customerProfile?.phone || "No phone"}
            </Text>

            <Pressable
              onPress={cancelAcceptedRequest}
              style={{
                backgroundColor: "red",
                padding: 10,
                marginTop: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Cancel Job
              </Text>
            </Pressable>
          </View>
        )}

        {/* REQUESTS */}
        {online && !selectedRequest && (
          <>
            <Text style={styles.requestsTitle}>
              Incoming Requests
            </Text>

            {requests.length === 0 ? (
              <Text style={styles.noRequests}>
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
                      onPress={() => acceptRequest(item)}
                    >
                      <Text style={{ color: "#fff" }}>
                        Accept
                      </Text>
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
  },

  statusText: { fontWeight: "bold" },

  bottomCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "55%",
  },

  title: { fontSize: 20, fontWeight: "bold" },

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

  requestsTitle: {
    marginTop: 15,
    fontWeight: "bold",
  },

  noRequests: {
    color: "gray",
    marginTop: 10,
  },

  requestCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  acceptBtn: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
  },

  routeCard: {
    marginTop: 15,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 10,
  },
});