import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./context/ThemeContext";
import { BLEProvider } from "@/hooks/BLEContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <BLEProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </BLEProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
