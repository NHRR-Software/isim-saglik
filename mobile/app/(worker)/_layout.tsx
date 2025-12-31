// app/(worker)/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";
import CustomTabBar from "../../components/navigation/CustomTabBar";
// DÜZELTME 1: Kendi yazdığımız Context'ten import ediyoruz
import { useTheme } from "../context/ThemeContext";

const alertIcon = require("../../assets/images/navigation/alert_icon.png");

export default function WorkerLayout() {
  // colors objesi, o anki tema (Dark veya Light) renklerini barındırır
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          config={{
            centerButtonRouteName: "alert",
            centerButtonColor: colors.dashboard.red,
            centerButtonIcon: alertIcon,
          }}
        />
      )}
    >
      <Tabs.Screen name="index" options={{ title: "Ana Sayfa" }} />
      <Tabs.Screen name="tips" options={{ title: "İpuçları" }} />

      <Tabs.Screen name="alert" options={{ title: "" }} />

      <Tabs.Screen name="progress" options={{ title: "İstatistikler" }} />
      <Tabs.Screen name="profile" options={{ title: "Hesabım" }} />
    </Tabs>
  );
}
