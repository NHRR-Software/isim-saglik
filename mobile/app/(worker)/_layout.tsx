// app/(worker)/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTabBar from "../../components/navigation/CustomTabBar";
import { useTheme } from "../context/ThemeContext";

const TAB_BAR_HEIGHT = 80;
const alertIcon = require("../../assets/images/navigation/alert_icon.png");

export default function WorkerLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
        },
      }}
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
