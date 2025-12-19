// app/(worker)/index.tsx

import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;

export default function WorkerHomeScreen() {
  const { colors, theme } = useTheme(); // Tema verilerini çek
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]); // Stilleri oluştur

  return (
    <View style={styles.container}>
      {/* Status Bar Dinamik */}
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={require("../../assets/images/avatar.png")}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>Hamza Ali Doğan</Text>
            <Text style={styles.userRole}>Mühendis – Üretim Geliştirme</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons
            name="notifications"
            size={24}
            color={theme === "dark" ? "#FFF" : colors.text.secondary}
          />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* QUICK STATS (Nabız, SpO2, Stres) */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={30} color={colors.dashboard.red} />
            <Text style={[styles.statValue, { color: colors.dashboard.red }]}>
              90
            </Text>
            <Text style={styles.statLabel}>Kalp Atışı</Text>
          </View>
          <View style={styles.statLine} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="water-percent"
              size={32}
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
              size={30}
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
              {/* Dark modda neon, light modda koyu yazı */}
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
        <View style={styles.taskCard}>
          <View style={styles.taskIconContainer}>
            <Image
              source={require("../../assets/images/taskIcon.png")}
              style={styles.taskIconImage}
            />
          </View>
          <View style={styles.taskTextContainer}>
            <Text style={styles.taskTitle}>Görevler</Text>
            <Text style={styles.taskDesc}>Aktif ve tamamlanan görevler</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={colors.text.secondary}
          />
        </View>

        {/* Bottom Bar Boşluğu */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Stil Oluşturucu Fonksiyon
const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default, // Dinamik
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
      marginBottom: 30,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
      borderWidth: 2,
      borderColor: colors.neutral.border, // Dinamik
    },
    userName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text.main, // Dinamik
    },
    userRole: {
      fontSize: 12,
      color: colors.text.secondary, // Dinamik
    },
    notificationBtn: {
      width: 40,
      height: 40,
      backgroundColor: colors.background.card, // Dinamik (Light'ta beyaz, Dark'ta gri)
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.neutral.border, // Dinamik
    },
    badge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.dashboard.red,
      position: "absolute",
      top: 8,
      right: 10,
    },

    // Stats Row
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.background.card, // Dinamik
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.neutral.border, // Dinamik
      // Light mode için gölge
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: theme === "light" ? 2 : 0,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statLine: {
      width: 1,
      height: "80%",
      backgroundColor: colors.neutral.border, // Dinamik
      alignSelf: "center",
    },
    statValue: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      color: colors.text.secondary, // Dinamik
      fontWeight: "500",
      marginTop: 4,
    },

    // Grid Cards
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: CARD_GAP,
      marginBottom: 24,
    },
    card: {
      width: CARD_WIDTH,
      height: 130,
      // Background Color inline style olarak veriliyor
      borderRadius: 24,
      padding: 16,
      position: "relative",
      borderWidth: 1,
      borderColor: theme === "dark" ? colors.neutral.border : "transparent", // Dark modda border olsun
    },
    cardContent: {
      zIndex: 2,
      marginTop: 10,
    },
    cardTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: theme === "dark" ? "#AAAAAA" : "#333333", // Başlık Rengi
      marginBottom: 4,
    },
    cardValue: {
      fontSize: 26,
      fontWeight: "bold",
      // Renk inline style olarak veriliyor
    },
    bgIcon: {
      position: "absolute",
      right: -10,
      bottom: -10,
      zIndex: 1,
    },
    iconBadge: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },

    // Task Card
    taskCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background.card, // Dinamik
      borderRadius: 24,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.neutral.border, // Dinamik
    },
    taskIconContainer: {
      width: 70,
      height: 70,
      backgroundColor: theme === "dark" ? "#2C2C2C" : colors.primary.light, // Dinamik
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    taskIconImage: {
      width: 55,
      height: 55,
      resizeMode: "contain",
    },
    taskTextContainer: {
      flex: 1,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text.main, // Dinamik
      marginBottom: 4,
    },
    taskDesc: {
      fontSize: 12,
      color: colors.text.secondary, // Dinamik
    },
  });
