import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, Animated } from "react-native";
import OnboardingScreen from "./screens/onboardingPages";
import { useRouter } from "expo-router";
import { colors } from "./styles/theme/colors";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useState(new Animated.Value(1))[0]; // Opaklık animasyonu için
  const router = useRouter();

  useEffect(() => {
    // 2 saniye bekle, sonra splash'i kapat
    const timer = setTimeout(() => {
      // Yavaşça kaybolma efekti (Opsiyonel, şık durur)
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
    // Onboarding bitince Login sayfasına git
    router.replace('/auth/login'); 
  }

  // --- CUSTOM SPLASH SCREEN TASARIMI ---
  if (showSplash) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <Image
          source={require("../assets/images/logo.png")} // Logo yolun
          style={styles.logo}
        />
      </Animated.View>
    );
  }

  // --- ONBOARDING EKRANI ---
  return (
    <View style={styles.container}>
      <OnboardingScreen onFinish={handleFinish} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Splash Screen Stilleri
  splashContainer: {
    flex: 1,
    backgroundColor: "#ffffff", // Arka plan bembeyaz
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150, // Logonun boyutu
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  brandName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary.main, // Senin Mavi rengin
    letterSpacing: 1,
  },
});
