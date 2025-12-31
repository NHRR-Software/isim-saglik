// app/(ohs)/profile.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;

// API URL
const API_BASE_URL = "http://10.0.2.2:5187";

export default function OHSProfileScreen() {
  const router = useRouter();
  const { colors, theme, setTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Kullanıcı Bilgileri State'i
  const [userInfo, setUserInfo] = useState({
    fullName: "Yükleniyor...",
    jobTitle: "...",
    photoUrl: null,
  });
  const [loading, setLoading] = useState(true);

  // --- KULLANICI BİLGİLERİNİ ÇEK ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/users`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.isSuccess && result.data) {
          setUserInfo({
            fullName: result.data.fullName || "İsimsiz Uzman",
            jobTitle: result.data.jobTitle || "İSG Uzmanı",
            photoUrl: result.data.photoUrl,
          });
        }
      } catch (error) {
        console.error("OHS User Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // --- ÇIKIŞ YAP ---
  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              const accessToken = await SecureStore.getItemAsync("accessToken");
              const refreshToken = await SecureStore.getItemAsync(
                "refreshToken"
              );

              if (accessToken && refreshToken) {
                await fetch(`${API_BASE_URL}/api/auth/logout`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ token: refreshToken }),
                });
              }
            } catch (error) {
              console.error("Çıkış hatası:", error);
            } finally {
              await SecureStore.deleteItemAsync("accessToken");
              await SecureStore.deleteItemAsync("refreshToken");
              setIsLoggingOut(false);
              router.replace("/auth/login");
            }
          },
        },
      ]
    );
  };

  // --- OHS MENÜ KARTLARI ---
  const menuItems = [
    {
      title: "Raporlarım",
      icon: (
        <Ionicons name="document-text" size={32} color={colors.primary.main} />
      ),
      bgColor: colors.primary.light,
      textColor: colors.primary.main,
      onPress: () => router.push("/(ohs)/reports"),
    },
    {
      title: "Sağlık Bilgilerim", // YENİ EKLENDİ
      icon: <Ionicons name="heart" size={32} color={colors.profile.text1} />, // Kırmızımsı ikon
      bgColor: colors.profile.card1, // Kırmızımsı kart
      textColor: colors.profile.text1,
      onPress: () => router.push("/common/health-profile"), // Yönlendirme
    },
    {
      title: "Sertifikalarım",
      icon: (
        <MaterialCommunityIcons
          name="certificate"
          size={32}
          color={colors.secondary.main}
        />
      ),
      bgColor: colors.secondary.light,
      textColor: colors.secondary.main,
      onPress: () => console.log("Sertifikalarım"),
    },
    {
      title: "Eğitim Takvimi",
      icon: <Ionicons name="calendar" size={32} color={colors.profile.text4} />,
      bgColor: colors.profile.card4,
      textColor: colors.profile.text4,
      onPress: () => console.log("Eğitim Takvimi"),
    },
    {
      title: "Tema & Ayarlar",
      icon: <Ionicons name="settings" size={32} color={colors.profile.text5} />,
      bgColor: colors.profile.card5,
      textColor: colors.profile.text5,
      onPress: () => setThemeModalVisible(true),
    },
    {
      title: "Hakkımızda",
      icon: (
        <Ionicons
          name="people"
          size={32}
          color={colors.profile.text7 || colors.text.main}
        />
      ),
      bgColor: colors.profile.card7 || colors.neutral.gray[100],
      textColor: colors.profile.text7 || colors.text.main,
      onPress: () => router.push("/common/aboutScreen"),
    },
    {
      title: "Çıkış Yap",
      icon: isLoggingOut ? (
        <ActivityIndicator color={colors.text.secondary} />
      ) : (
        <Ionicons name="log-out" size={32} color={colors.text.secondary} />
      ),
      bgColor: colors.neutral.gray[100],
      textColor: colors.text.secondary,
      onPress: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      {/* --- HEADER --- */}
      <View style={styles.headerBackground}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.main} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeaderContainer}>
        <View style={styles.avatarContainer}>
          {/* Dinamik Avatar */}
          <Image
            source={
              userInfo.photoUrl
                ? { uri: userInfo.photoUrl }
                : require("../../assets/images/avatar.png")
            }
            style={styles.avatar}
          />
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons
              name="shield-check"
              size={16}
              color="#FFF"
            />
          </View>
        </View>

        <View style={styles.nameBadge}>
          {/* Dinamik İsim */}
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.userName}>{userInfo.fullName}</Text>
          )}
        </View>

        {/* Dinamik Ünvan */}
        <Text style={styles.userRole}>
          {loading ? "..." : userInfo.jobTitle} - A Sınıfı
        </Text>
      </View>

      {/* --- GRID MENU --- */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                {
                  backgroundColor: item.bgColor,
                  borderColor:
                    theme === "dark" ? item.textColor : "transparent",
                  width: item.title === "Çıkış Yap" ? "100%" : CARD_WIDTH,
                },
              ]}
              onPress={item.onPress}
              activeOpacity={0.8}
              disabled={isLoggingOut && item.title === "Çıkış Yap"}
            >
              <View style={styles.cardIcon}>{item.icon}</View>
              <Text style={[styles.cardTitle, { color: item.textColor }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Bar Boşluğu */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- TEMA SEÇİM MODALI --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setThemeModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalIndicator} />
                <Text style={styles.modalTitle}>Görünüm Ayarları</Text>

                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === "light" && styles.themeOptionActive,
                  ]}
                  onPress={() => setTheme("light")}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="sunny"
                      size={24}
                      color={colors.primary.main}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.themeText}>Açık Mod</Text>
                  </View>
                  {theme === "light" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary.main}
                    />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === "dark" && styles.themeOptionActive,
                  ]}
                  onPress={() => setTheme("dark")}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="moon"
                      size={24}
                      color={colors.primary.main}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.themeText}>Koyu Mod</Text>
                  </View>
                  {theme === "dark" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary.main}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

// --- STYLES ---
const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    headerBackground: {
      height: 140,
      backgroundColor: theme === "light" ? "#E0F2F1" : "#1E1E1E",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    profileHeaderContainer: {
      alignItems: "center",
      marginTop: -50,
      marginBottom: 20,
    },
    avatarContainer: {
      position: "relative",
      marginBottom: 10,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 4,
      borderColor: colors.background.default,
    },
    verifiedBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#009688", // Teal renk
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.background.default,
    },
    nameBadge: {
      backgroundColor: "#009688",
      paddingVertical: 6,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginBottom: 6,
    },
    userName: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    userRole: {
      color: colors.text.secondary,
      fontSize: 14,
      fontWeight: "600",
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 10,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: CARD_GAP,
    },
    card: {
      // width: CARD_WIDTH, // Inline style'da dinamik veriliyor
      height: 110,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderWidth: theme === "dark" ? 1 : 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "light" ? 0.05 : 0,
      shadowRadius: 5,
      elevation: theme === "light" ? 2 : 0,
    },
    cardIcon: {
      marginBottom: 10,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.background.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    modalIndicator: {
      width: 40,
      height: 5,
      backgroundColor: colors.neutral.border,
      borderRadius: 3,
      alignSelf: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 20,
      textAlign: "center",
    },
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      marginBottom: 12,
    },
    themeOptionActive: {
      borderColor: colors.primary.main,
      backgroundColor:
        theme === "light" ? colors.primary.light : "rgba(72, 112, 255, 0.1)",
    },
    themeText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text.main,
    },
  });
