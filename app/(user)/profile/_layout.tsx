import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="security" />
      <Stack.Screen name="requests" />  
      <Stack.Screen name="notifications" />
      <Stack.Screen name="support" />
      <Stack.Screen name="edit" />
    </Stack>
  );
}