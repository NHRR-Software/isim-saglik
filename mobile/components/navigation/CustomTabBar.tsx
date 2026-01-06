// components/navigation/CustomTabBar.tsx

import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "../../app/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// --- CONFIG VE PROPS ---
interface TabBarConfig {
  centerButtonRouteName: string;
  centerButtonColor: string;
  centerButtonIcon?: any;
  centerButtonIconName?: keyof typeof Ionicons.glyphMap;
}

interface CustomTabBarProps extends BottomTabBarProps {
  config: TabBarConfig;
}

const TAB_BAR_BASE_HEIGHT = 80;
const CENTER_BUTTON_OFFSET = 50; // 🔽 AŞAĞI ALINDI (ÖNEMLİ)

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  config,
}) => {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => createStyles(colors, theme, insets.bottom),
    [colors, theme, insets.bottom]
  );

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // --- ORTA BUTON ---
        if (route.name === config.centerButtonRouteName) {
          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={styles.centerButtonWrapper}
              activeOpacity={0.9}
            >
              <View style={styles.centerButtonPositioner}>
                <View
                  style={[
                    styles.centerButton,
                    { backgroundColor: config.centerButtonColor },
                  ]}
                >
                  {config.centerButtonIcon ? (
                    <Image
                      source={config.centerButtonIcon}
                      style={styles.centerIcon}
                    />
                  ) : (
                    <Ionicons
                      name={config.centerButtonIconName || "add"}
                      size={32}
                      color="#fff"
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }

        // --- ICON MAPPING ---
        let iconName: keyof typeof Ionicons.glyphMap = "square";

        if (route.name === "index")
          iconName = isFocused ? "home" : "home-outline";
        else if (route.name === "personnel")
          iconName = isFocused ? "people" : "people-outline";
        else if (route.name === "reports")
          iconName = isFocused ? "document-text" : "document-text-outline";
        else if (route.name.includes("tips"))
          iconName = isFocused ? "bulb" : "bulb-outline";
        else if (
          route.name.includes("progress") ||
          route.name.includes("stats")
        )
          iconName = isFocused ? "stats-chart" : "stats-chart-outline";
        else if (route.name.includes("profile"))
          iconName = isFocused ? "person" : "person-outline";
        else if (route.name.includes("employees"))
          iconName = isFocused ? "people" : "people-outline";
        else if (route.name === "company")
          iconName = isFocused ? "business" : "business-outline";

        const iconColor = isFocused
          ? colors.primary.main
          : colors.text.secondary;

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabButton}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={iconColor}
              style={{ marginBottom: 4 }}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: iconColor,
                  fontWeight: isFocused ? "600" : "400",
                },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// --- STYLES ---
const createStyles = (colors: any, theme: string, bottomInset: number) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,

      height: TAB_BAR_BASE_HEIGHT + bottomInset,
      paddingBottom: bottomInset,

      backgroundColor: colors.background.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,

      elevation: theme === "light" ? 10 : 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: theme === "light" ? 0.1 : 0,
      shadowRadius: 10,

      borderTopWidth: 1,
      borderTopColor: colors.neutral.border,
    },

    tabButton: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 10,
    },

    tabLabel: {
      fontSize: 12,
    },

    // CENTER BUTTON
    centerButtonWrapper: {
      flex: 1,
      alignItems: "center",
    },

    centerButtonPositioner: {
      position: "absolute",
      bottom: TAB_BAR_BASE_HEIGHT / 2 + bottomInset - CENTER_BUTTON_OFFSET,
    },

    centerButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: "center",
      alignItems: "center",

      borderWidth: 5,
      borderColor: colors.background.default,

      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },

    centerIcon: {
      width: 36,
      height: 36,
      resizeMode: "contain",
      tintColor: "#fff",
    },
  });

export default CustomTabBar;
