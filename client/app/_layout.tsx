import { Stack } from "expo-router";
import React from "react";
import { ThemeProvider } from "./context/ThemeContext"; // YENİ EKLENDİ

export default function RootLayout() {
  return (
    // Uygulamayı Provider ile sarıyoruz
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        {/* Diğer ekran tanımları... */}
      </Stack>
    </ThemeProvider>
  );
}
