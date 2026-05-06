import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

type Request = {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  status: string;
  mechanic_id?: string | null;
};

const Home = () => {
  const { user } = useAuth();
  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const [request, setRequest] = useState<Request | null>(null);
  const [mechanicLocation, setMechanicLocation] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [mechanicProfile, setMechanicProfile] = useState<any>(null);

  // 📍 LOCATION (OPTIMIZED: instant load)
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
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
          setLoading(false); // Map can show now
        }

        // 2. Get precise location in background
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isMounted && loc?.coords) {
          setLocation(loc.coords);
        }

        setLoading(false);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 20,
          },
          (locUpdate) => {
            if (isMounted && locUpdate?.coords) {
              setLocation(locUpdate.coords);
            }
          }
        );
      } catch (error) {
        console.log("Location error:", error);
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  // 🔧 REQUEST MECHANIC
  const requestMechanic = async () => {
    if (!user || !location) return;

    try {
      setSearching(true);

      const { data, error } = await supabase
        .from("requests")
        .insert({
          user_id: user.id,
          latitude: location.latitude,
          longitude: location.longitude,
          status: "pending",
        })
        .select()
        .single();

      if (error || !data) {
        setSearching(false);
        return;
      }

      setRequest(data);

      const channel = supabase
        .channel("request-" + data.id)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "requests",
            filter: `id=eq.${data.id}`,
          },
          async (payload) => {
            const updated = payload.new as Request;

            setRequest(updated);

            if (updated?.status === "accepted") {
              setSearching(false);

              const { data: freshRequest } = await supabase
                .from("requests")
                .select("*")
                .eq("id", updated.id)
                .single();

              if (freshRequest?.mechanic_id) {
                fetchMechanic(freshRequest.mechanic_id);
              }
            }

            if (updated?.status === "cancelled") {
              setSearching(false);
              resetState();
            }
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    } catch (e) {
      setSearching(false);
    }
  };

  // 👤 FETCH MECHANIC
  const fetchMechanic = async (mechanicId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", mechanicId)
      .single();

    setMechanicProfile(data);

    const { data: loc } = await supabase
      .from("mechanics_live")
      .select("*")
      .eq("mechanic_id", mechanicId)
      .single();

    setMechanicLocation(loc);
  };

  // ❌ CANCEL
  const cancelRequest = async () => {
    if (!request) return;

    await supabase
      .from("requests")
      .update({ status: "cancelled" })
      .eq("id", request.id);

    resetState();
  };

  const resetState = () => {
    setSearching(false);
    setRequest(null);
    setMechanicLocation(null);
    setMechanicProfile(null);
    setRouteInfo(null);
  };

  // 🔒 SAFE LOADING (FIXED: prevents crash loop)
  if (loading || !location?.latitude || !location?.longitude) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
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
        mapPadding={{ top: 50, right: 10, bottom: 200, left: 10 }}
      >
        {/* USER */}
        <Marker coordinate={location} title="You">
           <View style={styles.markerContainer}>
              <View style={styles.markerDot} />
           </View>
        </Marker>

        {/* MECHANIC */}
        {mechanicLocation?.latitude && mechanicLocation?.longitude && (
          <Marker
            coordinate={{
              latitude: mechanicLocation.latitude,
              longitude: mechanicLocation.longitude,
            }}
            title="Mechanic"
          >
             <View style={[styles.markerContainer, { backgroundColor: "#2563eb" }]}>
                <Text style={{ fontSize: 18 }}>🔧</Text>
             </View>
          </Marker>
        )}

        {/* ROUTE (FIXED: prevents invalid render crash) */}
        {mechanicLocation?.latitude &&
          mechanicLocation?.longitude &&
          location?.latitude &&
          location?.longitude && (
            <MapViewDirections
              origin={location}
              destination={{
                latitude: mechanicLocation.latitude,
                longitude: mechanicLocation.longitude,
              }}
              apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""}
              strokeWidth={5}
              strokeColor="#4C1D95"
              lineDashPattern={[0]}
              onReady={(result) => {
                if (!routeInfo) {
                  setRouteInfo(result);

                  mapRef.current?.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      top: 100,
                      right: 60,
                      bottom: 300,
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
          <Ionicons name="locate" size={24} color="#4C1D95" />
        </Pressable>
      </View>

      {/* SEARCHING */}
      {searching && (
        <View style={styles.searchOverlay}>
          <ActivityIndicator size="large" />
          <Text>Searching for mechanic...</Text>

          <Pressable style={styles.cancelBtn} onPress={cancelRequest}>
            <Text style={{ color: "#fff" }}>Cancel Request</Text>
          </Pressable>
        </View>
      )}

      {/* ACCEPTED */}
      {request?.status === "accepted" && mechanicProfile && (
        <View style={styles.bottomCard}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            🚗 Mechanic Assigned
          </Text>

          <Text>Name: {mechanicProfile.full_name}</Text>
          <Text>Phone: {mechanicProfile.phone}</Text>

          {routeInfo && (
            <View style={styles.routeCard}>
              <Text>📏 {routeInfo.distance.toFixed(2)} km away</Text>
              <Text>⏱️ {Math.ceil(routeInfo.duration)} mins</Text>
            </View>
          )}

          <Pressable style={styles.cancelBtn} onPress={cancelRequest}>
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Cancel Request
            </Text>
          </Pressable>
        </View>
      )}

      {/* DEFAULT */}
      {!searching && !request && (
        <View style={styles.bottomCard}>
          <Text>Need a Mechanic?</Text>

          <Pressable onPress={requestMechanic} style={styles.button}>
            <Text style={styles.buttonText}>Request Mechanic</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1 },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomCard: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
  },

  button: {
    backgroundColor: "#000",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
  },

  searchOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },

  cancelBtn: {
    marginTop: 15,
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
  },

  routeCard: {
    marginTop: 10,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 140, // Above the bottom card
    gap: 12,
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
    backgroundColor: "#4C1D95",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  markerDot: {
    width: 10,
    height: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});