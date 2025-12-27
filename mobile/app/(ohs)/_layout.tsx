// app/(ohs)/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";
import CustomTabBar from "../../components/navigation/CustomTabBar";
import { useTheme } from "../context/ThemeContext";

export default function OHSLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          config={{
            centerButtonRouteName: "camera", // Orta buton rotası
            centerButtonColor: colors.dashboard.red, // Kırmızı
            centerButtonIconName: "camera", // Ionicons kamera ikonu
          }}
        />
      )}
    >
      <Tabs.Screen name="index" options={{ title: "Ana Sayfa" }} />
      <Tabs.Screen name="personnel" options={{ title: "Personeller" }} />

      {/* ORTA BUTON */}
      <Tabs.Screen name="camera" options={{ title: "" }} />

      <Tabs.Screen name="reports" options={{ title: "Raporlar" }} />
      <Tabs.Screen name="profile" options={{ title: "Hesabım" }} />
    </Tabs>
  );
}
