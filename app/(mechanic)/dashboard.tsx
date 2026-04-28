import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const Dashboard = () => {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);

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

  const toggleOnline = () => {
    setOnline((prev) => !prev);
    console.log(online ? "Going offline" : "Going online");
  };

  if (loading) {
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
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You (Mechanic)"
        />
      </MapView>

      {/* TOP STATUS */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Status: {online ? "🟢 Online" : "🔴 Offline"}
        </Text>
      </View>

      {/* BOTTOM PANEL */}
      <View style={styles.bottomCard}>
        <Text style={styles.title}>Mechanic Dashboard</Text>
        <Text style={styles.subtitle}>
          {online
            ? "You are available for jobs"
            : "Go online to start receiving requests"}
        </Text>

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
      </View>

    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

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
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  subtitle: {
    color: "gray",
    marginBottom: 15,
  },

  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});