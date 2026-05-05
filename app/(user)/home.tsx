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

  // 📍 LOCATION
 useEffect(() => {
  let subscription: any;

  (async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoading(false);

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (locUpdate) => {
          setLocation(locUpdate.coords);
        }
      );
    } catch (error) {
      console.log("Location error:", error);
      setLoading(false);
    }
  })();

  return () => subscription?.remove();
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

  if (loading || !location) {
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
      >
        {/* USER */}
        <Marker coordinate={location} title="You" />

        {/* MECHANIC */}
        {mechanicLocation && (
          <Marker
            coordinate={{
              latitude: mechanicLocation.latitude,
              longitude: mechanicLocation.longitude,
            }}
            title="Mechanic"
            pinColor="blue"
          />
        )}

        {/* ROUTE */}
        {mechanicLocation && (
          <MapViewDirections
            origin={location}
            destination={mechanicLocation}
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

      {/* ACCEPTED UI */}
      {request?.status === "accepted" && mechanicProfile && (
        <View style={styles.bottomCard}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            🚗 Mechanic Assigned
          </Text>

          <Text>Name: {mechanicProfile.username}</Text>
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
});