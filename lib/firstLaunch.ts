// lib/firstLaunch.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "hasSeenWelcomeFlow";

export const setWelcomeFlowSeen = async () => {
  await AsyncStorage.setItem(KEY, "true");
};

export const getWelcomeFlowSeen = async () => {
  const value = await AsyncStorage.getItem(KEY);
  return value === "true";
};