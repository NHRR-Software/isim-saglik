import React from "react";
import { Tabs } from "expo-router";
import CustomTabBar from "../../components/navigation/CustomTabBar";
import { colors } from "../styles/theme/colors";

export default function FounderLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      // BURADA PATRONA ÖZEL AYARLAR
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          config={{
            centerButtonRouteName: "scan", // Patron QR okutur
            centerButtonColor: colors.primary.main, // Mavi buton
            centerButtonIconName: "qr-code-outline", // İkon kullansın
          }}
        />
      )}
    >
      <Tabs.Screen name="index" options={{ title: "Genel Bakış" }} />
      <Tabs.Screen name="employees" options={{ title: "Çalışanlar" }} />
      <Tabs.Screen name="scan" options={{ title: "" }} />
      <Tabs.Screen name="stats" options={{ title: "Raporlar" }} />
      <Tabs.Screen name="profile" options={{ title: "Hesabım" }} />
    </Tabs>
  );
}
