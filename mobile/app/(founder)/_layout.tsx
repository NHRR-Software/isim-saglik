// app/(founder)/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";
import CustomTabBar from "../../components/navigation/CustomTabBar";
import { useTheme } from "../context/ThemeContext";

export default function FounderLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          config={{
            centerButtonRouteName: "add-personnel", // Orta buton rotası
            centerButtonColor: colors.dashboard.red, // Kırmızı
            centerButtonIconName: "person-add", // Ionicons ikonu (Resim yerine ikon kullanıyoruz)
          }}
        />
      )}
    >
      <Tabs.Screen name="index" options={{ title: "Ana Sayfa" }} />
      <Tabs.Screen name="reports" options={{ title: "Raporlar" }} />

      <Tabs.Screen name="add-personnel" options={{ title: "" }} />

      <Tabs.Screen name="personnel" options={{ title: "Personeller" }} />
      <Tabs.Screen name="company" options={{ title: "Firma" }} />
    </Tabs>
  );
}
