// app/(worker)/index.tsx

import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;

// API URL
const API_BASE_URL = "http://10.0.2.2:5187";

export default function WorkerHomeScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  const [userInfo, setUserInfo] = useState({
    fullName: "Yükleniyor...",
    jobTitle: "...",
    photoUrl: null, // Varsa URL gelecek
  });
  const [loading, setLoading] = useState(true);

  // Kullanıcı Bilgilerini Çekme
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.isSuccess && result.data) {
          setUserInfo({
            fullName: result.data.fullName || "İsimsiz Kullanıcı",
            jobTitle: result.data.jobTitle || "Çalışan", // Eğer jobTitle yoksa varsayılan
            photoUrl: result.data.photoUrl,
          });
        }
      } catch (error) {
        console.error("User Data Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {userInfo.photoUrl ? (
            <Image source={{ uri: userInfo.photoUrl }} style={styles.avatar} />
          ) : null}

          <View>
            {loading ? (
              <ActivityIndicator size="small" color={colors.text.secondary} />
            ) : (
              <>
                <Text style={styles.userName}>{userInfo.fullName}</Text>
                <Text style={styles.userRole}>{userInfo.jobTitle}</Text>
              </>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons
            name="notifications"
            size={28}
            color={theme === "dark" ? "#FFF" : colors.text.secondary}
          />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* QUICK STATS (BÜYÜTÜLDÜ) */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={42} color={colors.dashboard.red} />
            <Text style={[styles.statValue, { color: colors.dashboard.red }]}>
              90
            </Text>
            <Text style={styles.statLabel}>Kalp Atışı</Text>
          </View>
          <View style={styles.statLine} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="water-percent"
              size={44}
              color={colors.primary.main}
            />
            <Text style={[styles.statValue, { color: colors.primary.main }]}>
              %98
            </Text>
            <Text style={styles.statLabel}>SpO₂</Text>
          </View>
          <View style={styles.statLine} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={42}
              color={colors.secondary.main}
            />
            <Text style={[styles.statValue, { color: colors.secondary.main }]}>
              25
            </Text>
            <Text style={styles.statLabel}>Stres</Text>
          </View>
        </View>

        {/* DASHBOARD GRID */}
        <View style={styles.gridContainer}>
          {/* Nem Kartı */}
          <View
            style={[styles.card, { backgroundColor: colors.dashboard.cardHum }]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>NEM</Text>
              <Text
                style={[
                  styles.cardValue,
                  {
                    color:
                      theme === "dark" ? "#69F0AE" : colors.dashboard.textValue,
                  },
                ]}
              >
                94
              </Text>
            </View>
            <Ionicons
              name="water"
              size={70}
              color={
                theme === "dark"
                  ? "rgba(105, 240, 174, 0.1)"
                  : "rgba(255,255,255,0.4)"
              }
              style={styles.bgIcon}
            />
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(105, 240, 174, 0.2)"
                      : "rgba(255,255,255,0.6)",
                },
              ]}
            >
              <Ionicons
                name="water"
                size={20}
                color={theme === "dark" ? "#69F0AE" : colors.primary.main}
              />
            </View>
          </View>

          {/* Sıcaklık Kartı */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.dashboard.cardTemp },
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Ortam{"\n"}Sıcaklığı</Text>
              <Text
                style={[
                  styles.cardValue,
                  {
                    color:
                      theme === "dark" ? "#FF5252" : colors.dashboard.textValue,
                  },
                ]}
              >
                24°
              </Text>
            </View>
            <FontAwesome5
              name="thermometer-half"
              size={60}
              color={
                theme === "dark"
                  ? "rgba(255, 82, 82, 0.1)"
                  : "rgba(255,255,255,0.4)"
              }
              style={styles.bgIcon}
            />
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(255, 82, 82, 0.2)"
                      : "rgba(255,255,255,0.6)",
                },
              ]}
            >
              <FontAwesome5
                name="temperature-high"
                size={18}
                color={theme === "dark" ? "#FF5252" : colors.dashboard.red}
              />
            </View>
          </View>

          {/* Gürültü Kartı */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.dashboard.cardNoise },
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Gürültü{"\n"}Seviyesi</Text>
              <Text
                style={[
                  styles.cardValue,
                  {
                    color:
                      theme === "dark" ? "#E040FB" : colors.dashboard.textValue,
                  },
                ]}
              >
                70 dB
              </Text>
            </View>
            <FontAwesome5
              name="headphones-alt"
              size={60}
              color={
                theme === "dark" ? "rgba(224, 64, 251, 0.1)" : "rgba(0,0,0,0.1)"
              }
              style={styles.bgIcon}
            />
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(224, 64, 251, 0.2)"
                      : "rgba(255,255,255,0.6)",
                },
              ]}
            >
              <FontAwesome5
                name="volume-up"
                size={18}
                color={theme === "dark" ? "#E040FB" : "#333"}
              />
            </View>
          </View>

          {/* Işık Kartı */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.dashboard.cardLight },
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Işık{"\n"}Seviyesi</Text>
              <Text
                style={[
                  styles.cardValue,
                  {
                    color:
                      theme === "dark" ? "#FFD740" : colors.dashboard.textValue,
                  },
                ]}
              >
                700 lx
              </Text>
            </View>
            <MaterialCommunityIcons
              name="ceiling-light"
              size={70}
              color={
                theme === "dark" ? "rgba(255, 215, 64, 0.1)" : "rgba(0,0,0,0.1)"
              }
              style={styles.bgIcon}
            />
            <View
              style={[
                styles.iconBadge,
                {
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(255, 215, 64, 0.2)"
                      : "rgba(255,255,255,0.6)",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="white-balance-sunny"
                size={20}
                color={theme === "dark" ? "#FFD740" : "#333"}
              />
            </View>
          </View>
        </View>

        {/* GÖREVLER KARTI */}
        <TouchableOpacity
          style={styles.taskCard}
          onPress={() => router.push("/common/taskScreen")}
          activeOpacity={0.9}
        >
          <View style={styles.taskIconContainer}>
            <Image
              source={require("../../assets/images/taskIcon.png")}
              style={styles.taskIconImage}
            />
          </View>
          <View style={styles.taskTextContainer}>
            <Text style={styles.taskTitle}>Görevler</Text>
            <Text style={styles.taskDesc}>
              Aktif ve tamamlanan görevlerinizi buradan takip edebilirsiniz.
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={28}
            color={colors.text.secondary}
          />
        </TouchableOpacity>

        {/* Bottom Bar Boşluğu */}
        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

// Stil Oluşturucu Fonksiyon
const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
      paddingTop: 50,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 20,
    },

    // Header
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      marginBottom: 35, // Boşluk arttı
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 54, // Hafif büyüdü
      height: 54,
      borderRadius: 27,
      marginRight: 14,
      borderWidth: 2,
      borderColor: colors.neutral.border,
    },
    userName: {
      fontSize: 17,
      fontWeight: "bold",
      color: colors.text.main,
    },
    userRole: {
      fontSize: 13,
      color: colors.text.secondary,
    },
    notificationBtn: {
      width: 44, // Hafif büyüdü
      height: 44,
      backgroundColor: colors.background.card, // Dinamik
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    badge: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.dashboard.red,
      position: "absolute",
      top: 8,
      right: 10,
    },

    // Stats Row (BÜYÜTÜLDÜ)
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.background.card,
      borderRadius: 24, // Radius arttı
      paddingVertical: 18, // Dikey boşluk ciddi oranda arttı
      paddingHorizontal: 20,
      marginBottom: 30, // Alt boşluk arttı
      borderWidth: 1,
      borderColor: colors.neutral.border,

      elevation: theme === "light" ? 4 : 0,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statLine: {
      width: 1,
      height: "70%",
      backgroundColor: colors.neutral.border,
      alignSelf: "center",
    },
    statValue: {
      fontSize: 28, // Font Büyüdü
      fontWeight: "800",
      marginTop: 10,
    },
    statLabel: {
      fontSize: 14, // Font Büyüdü
      color: colors.text.secondary,
      fontWeight: "600",
      marginTop: 6,
    },

    // Grid Cards
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: CARD_GAP,
      marginBottom: 30, // Alt boşluk arttı
    },
    card: {
      width: CARD_WIDTH,
      height: 135, // Hafif büyüdü
      borderRadius: 24,
      padding: 18,
      position: "relative",
      borderWidth: 1,
      borderColor: theme === "dark" ? colors.neutral.border : "transparent",
    },
    cardContent: {
      zIndex: 2,
      marginTop: 8,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme === "dark" ? "#AAAAAA" : "#333333",
      marginBottom: 6,
    },
    cardValue: {
      fontSize: 28,
      fontWeight: "bold",
    },
    bgIcon: {
      position: "absolute",
      right: 2,
      bottom: 2,
      zIndex: 1,
    },
    iconBadge: {
      position: "absolute",
      top: 14,
      right: 14,
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },

    // Task Card (BÜYÜTÜLDÜ)
    taskCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderRadius: 28, // Radius arttı
      paddingVertical: 25, // Dikey padding arttı
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    taskIconContainer: {
      width: 85, // Büyüdü
      height: 85, // Büyüdü
      backgroundColor: theme === "dark" ? "#2C2C2C" : colors.primary.light,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    taskIconImage: {
      width: 60, // Büyüdü
      height: 60,
      resizeMode: "contain",
    },
    taskTextContainer: {
      flex: 1,
    },
    taskTitle: {
      fontSize: 20, // Font Büyüdü
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 6,
    },
    taskDesc: {
      fontSize: 14, // Font Büyüdü
      color: colors.text.secondary,
      lineHeight: 20,
      paddingRight: 10,
    },
  });
