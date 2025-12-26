// components/navigation/CustomTabBar.tsx

import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "../../app/context/ThemeContext";

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

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  config,
}) => {
  const { colors, theme } = useTheme(); // Temayı çekiyoruz
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]); // Stilleri oluşturuyoruz

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

        // --- ORTA BUTON (Center) ---
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
                    { backgroundColor: config.centerButtonColor }, // Config'den gelen renk
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

        // --- NORMAL TABLAR ---
        let iconName: keyof typeof Ionicons.glyphMap = "square";

        // 1. Ana Sayfa (Ortak)
        if (route.name === "index")
          iconName = isFocused ? "home" : "home-outline";
        // 2. OHS Rotaları (YENİ EKLENDİ)
        else if (route.name === "personnel")
          iconName = isFocused ? "people" : "people-outline";
        else if (route.name === "reports")
          iconName = isFocused ? "document-text" : "document-text-outline";
        // 3. Worker Rotaları
        else if (route.name.includes("tips"))
          iconName = isFocused ? "bulb" : "bulb-outline";
        else if (
          route.name.includes("progress") ||
          route.name.includes("stats")
        )
          iconName = isFocused ? "stats-chart" : "stats-chart-outline";
        // 4. Profil (Ortak)
        else if (route.name.includes("profile"))
          iconName = isFocused ? "person" : "person-outline";
        // 5. Diğer (Founder vs.)
        else if (route.name.includes("employees"))
          iconName = isFocused ? "people" : "people-outline";

        // Dinamik İkon Renkleri
        const iconColor = isFocused
          ? colors.primary.main
          : colors.text.secondary;

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabButton}
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
                { color: iconColor, fontWeight: isFocused ? "600" : "400" },
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

// --- STİLLERİ DİNAMİK HALE GETİRİYORUZ ---
const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      height: 80,
      backgroundColor: colors.background.card, // Light: Beyaz, Dark: Koyu Gri
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      // Gölge ayarları
      elevation: theme === "light" ? 10 : 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: theme === "light" ? 0.1 : 0,
      shadowRadius: 10,

      borderTopWidth: 1,
      borderTopColor: colors.neutral.border, // Dinamik border
      paddingBottom: 15,
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

    // ORTA BUTON
    centerButtonWrapper: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    centerButtonPositioner: {
      position: "absolute",
      bottom: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    centerButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: "center",
      alignItems: "center",

      // Border rengi: Arka plan (Screen Background) ile aynı olmalı ki "Kesik" gibi dursun
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
      tintColor: "#fff", // İkon hep beyaz kalsın
    },
  });

export default CustomTabBar;
