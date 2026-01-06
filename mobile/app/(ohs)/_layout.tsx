// app/(ohs)/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTabBar from "../../components/navigation/CustomTabBar";
import { useTheme } from "../context/ThemeContext";

const TAB_BAR_HEIGHT = 80;

export default function OHSLayout() {
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
            centerButtonRouteName: "camera",
            centerButtonColor: colors.dashboard.red,
            centerButtonIconName: "camera",
          }}
        />
      )}
    >
      <Tabs.Screen name="index" options={{ title: "Ana Sayfa" }} />
      <Tabs.Screen name="personnel" options={{ title: "Personeller" }} />
      <Tabs.Screen name="camera" options={{ title: "" }} />
      <Tabs.Screen name="reports" options={{ title: "Raporlar" }} />
      <Tabs.Screen name="profile" options={{ title: "Hesabım" }} />
    </Tabs>
  );
}
