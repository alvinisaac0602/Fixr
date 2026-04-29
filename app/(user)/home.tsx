import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const Home = () => {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let subscription: any;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("Permission to access location denied");
        return;
      }

      // 🔥 initial location
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoading(false);

      // 🔥 LIVE tracking (important upgrade)
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
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

 const requestMechanic = async () => {
  if (!user) {
    alert("User not logged in");
    return;
  }

  if (!location) {
    alert("Location not ready yet");
    return;
  }

  console.log("Sending location:", location); // 🔥 DEBUG

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

  if (error) {
    console.log(error.message);
    alert("Failed to request mechanic");
    setSearching(false);
    return;
  }

  console.log("Request created:", data);

  // 🔥 Listen for mechanic acceptance
  supabase
    .channel("request-updates")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "requests",
        filter: `id=eq.${data.id}`,
      },
      (payload) => {
        const updated = payload.new;

        if (updated.status === "accepted") {
          setSearching(false);
          alert("Mechanic is on the way 🚗");
        }
      }
    )
    .subscribe();
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

      {/* 🗺️ FULL SCREEN MAP */}
      <MapView
  style={StyleSheet.absoluteFillObject}
  initialRegion={{
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
  showsUserLocation={true}
  showsMyLocationButton={true}
  followsUserLocation={true}

  // 🔥 KEY FIX: pushes Google controls upward
  mapPadding={{
    top: 0,
    right: 20,
    bottom: 120, // 👈 pushes "target button" above your bottom card
    left: 0,
  }}
>
  <Marker
    coordinate={{
      latitude: location.latitude,
      longitude: location.longitude,
    }}
    title="You are here"
  />
</MapView>

      {/* 🔍 SEARCH OVERLAY */}
      {searching && (
        <View style={styles.searchOverlay}>
          <ActivityIndicator size="large" color="black" />
          <Text style={styles.searchText}>
            Searching for available mechanics...
          </Text>
        </View>
      )}

      {/* 🔧 BOTTOM CARD */}
      {!searching && (
        <View style={styles.bottomCard}>
          <Text style={styles.title}>Need a Mechanic?</Text>
          <Text style={styles.subtitle}>
            We’ll find one near your location
          </Text>

          <Pressable style={styles.button} onPress={requestMechanic}>
            <Text style={styles.buttonText}>Request Mechanic 🔧</Text>
          </Pressable>
        </View>
      )}

    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

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
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  subtitle: {
    color: "gray",
    marginBottom: 15,
    marginTop: 5,
  },

  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  searchOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },

  searchText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});