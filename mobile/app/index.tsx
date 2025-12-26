// app/index.tsx

import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";
import OnboardingScreen from "./screens/onboardingPages";
import { useRouter } from "expo-router";
import { useTheme } from "./context/ThemeContext";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    router.replace("/auth/login");
  };

  if (showSplash) {
    return (
      <Animated.View
        style={[
          styles.splashContainer,
          { opacity: fadeAnim, backgroundColor: colors.background.default },
        ]}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </Animated.View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.default }]}
    >
      <OnboardingScreen onFinish={handleFinish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});
