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
import { Ionicons } from "@expo/vector-icons";

const Dashboard = () => { // ✅ FIX: Capitalized component
  if (__DEV__) console.log("🚀 DASHBOARD LOADED");

  const { user, loading: authLoading } = useAuth();
  if (__DEV__) console.log("👤 USER:", user);

  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [customerProfile, setCustomerProfile] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, authLoading]);

  // 📍 LOCATION (OPTIMIZED: instant load)
  useEffect(() => {
    let subscription: any;
    let isMounted = true;

    (async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLoading(false);
          return;
        }

        // 1. Get last known location for instant map load
        const lastLoc = await Location.getLastKnownPositionAsync({});
        if (isMounted && lastLoc?.coords) {
          setLocation(lastLoc.coords);
          setLoading(false);
        }

        // 2. Get precise location
        let loc;
        try {
          loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        } catch (error) {
          setLoading(false);
          return;
        }

        if (isMounted && loc?.coords) {
          setLocation(loc.coords);
          setLoading(false);
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 8000,
            distanceInterval: 20,
          },
          (locUpdate) => {
            if (isMounted && locUpdate?.coords) {
              setLocation(locUpdate.coords);
            }
          }
        );
      } catch (error) {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      subscription?.remove?.();
    };
  }, []);

  // 📡 FETCH REQUESTS
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

  // 🔥 REALTIME
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

  const fetchCustomer = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", userId)
      .single();

    setCustomerProfile(data);
  };

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
      fetchCustomer(request.user_id);

      setRequests((prev) =>
        prev.filter((item) => item.id !== request.id)
      );
    }
  };

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

  const toggleOnline = () => setOnline((prev) => !prev);

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
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        loadingEnabled={true}
        mapPadding={{ top: 100, right: 10, bottom: 300, left: 10 }}
      >
        <Marker coordinate={location} title="You (Mechanic)">
           <View style={[styles.markerContainer, { backgroundColor: "#10b981" }]}>
              <Text style={{ fontSize: 18 }}>🔧</Text>
           </View>
        </Marker>

        {selectedRequest?.latitude && selectedRequest?.longitude && (
          <Marker
            coordinate={{
              latitude: selectedRequest.latitude,
              longitude: selectedRequest.longitude,
            }}
            title="Customer"
          >
             <View style={[styles.markerContainer, { backgroundColor: "#2563eb" }]}>
                <View style={styles.markerDot} />
             </View>
          </Marker>
        )}

        {selectedRequest?.latitude &&
          selectedRequest?.longitude &&
          routeInfo === null && (
            <MapViewDirections
              origin={location}
              destination={{
                latitude: selectedRequest.latitude,
                longitude: selectedRequest.longitude,
              }}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string}
              strokeWidth={5}
              strokeColor="#10b981"
              lineDashPattern={[0]}
              onReady={(result) => {
                if (!routeInfo) {
                  setRouteInfo(result);

                  mapRef.current?.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      top: 150,
                      right: 60,
                      bottom: 350,
                      left: 60,
                    },
                    animated: true,
                  });
                }
              }}
            />
          )}
      </MapView>

      {/* FLOATING ACTION BUTTONS */}
      <View style={styles.fabContainer}>
        <Pressable
          style={styles.fab}
          onPress={() => {
            mapRef.current?.animateToRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }}
        >
          <Ionicons name="locate" size={24} color="#10b981" />
        </Pressable>
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Status: {online ? "🟢 Online" : "🔴 Offline"}
        </Text>
      </View>

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

        {selectedRequest && routeInfo && (
          <View style={styles.routeCard}>
            <Text>📏 {routeInfo.distance.toFixed(2)} km</Text>
            <Text>⏱️ {Math.ceil(routeInfo.duration)} mins</Text>
          </View>
        )}

        {selectedRequest && customerProfile && (
          <View style={styles.routeCard}>
            <Text style={{ fontWeight: "bold" }}>
              👤 Customer Details
            </Text>
            <Text>
              Name: {customerProfile?.full_name || "No name"}
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

        {online && !selectedRequest && (
          <>
            <Text style={styles.requestsTitle}>
              Incoming Requests
            </Text>

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
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: "40%", // Dynamic position above the bottom card
  },
  fab: {
    backgroundColor: "#fff",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  markerDot: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});