// app/common/_layout.tsx

import { Stack } from "expo-router";

export default function CommonLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tasks" />
      <Stack.Screen name="heart-detail" />
      <Stack.Screen name="spo2-detail" />
      <Stack.Screen name="stress-detail" />
      <Stack.Screen name="work-hours-detail" />
      <Stack.Screen name="taskScreen/index" />
      <Stack.Screen name="health-profile" />
      <Stack.Screen name="aboutScreen/index" />
    </Stack>
  );
}
