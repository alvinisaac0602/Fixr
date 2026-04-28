import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("../../assets/images/onboarding1.png"),
    title: "Car breaks down?",
    subtitle: "You're stuck on the road with no help.",
  },
  {
    id: "2",
    image: require("../../assets/images/onboarding2.png"),
    title: "Request a mechanic",
    subtitle: "Get help instantly from nearby experts.",
  },
  {
    id: "3",
    image: require("../../assets/images/onboarding3.png"),
    title: "Back on the road",
    subtitle: "Your car fixed quickly and safely.",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<any>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const nextSlide = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/(onboarding)/welcome");
    }
  };

  return (
    <View style={styles.container}>
      {/* Status bar styling */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        renderItem={({ item }) => (
          <ImageBackground source={item.image} style={styles.image}>
            {/* Overlay */}
            <View style={styles.overlay} />

            {/* SAFE AREA CONTENT */}
            <SafeAreaView style={styles.safeContent}>
              
              {/* TEXT */}
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

            </SafeAreaView>
          </ImageBackground>
        )}
      />

      {/* FOOTER (Safe Area Protected) */}
      <SafeAreaView style={styles.footer}>
        <Text style={styles.skip} onPress={() => router.replace("/(onboarding)/welcome")}>
          Skip
        </Text>

        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentIndex === i && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Text style={styles.next} onPress={nextSlide}>
          {currentIndex === slides.length - 1 ? "Start" : "Next"}
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  image: {
    width,
    height,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  safeContent: {
    flex: 1,
    justifyContent: "flex-end",
  },

  textContainer: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginTop: 10,
    lineHeight: 22,
  },

  footer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  skip: {
    color: "#fff",
    fontSize: 16,
  },

  next: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  dots: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#aaa",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#fff",
    width: 16,
  },
});