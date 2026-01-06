// app/(founder)/_layout.tsx

import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTabBar from "../../components/navigation/CustomTabBar";
import { useTheme } from "../context/ThemeContext";

const TAB_BAR_HEIGHT = 80;

export default function FounderLayout() {
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
            centerButtonRouteName: "add-personnel",
            centerButtonColor: colors.dashboard.red,
            centerButtonIconName: "person-add",
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
