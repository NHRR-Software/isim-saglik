// app/(ohs)/index.tsx

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
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

// API URL (Login'dekiyle aynı olmalı)
const API_BASE_URL = "http://10.0.2.2:5187";

export default function OHSHomeScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  const [userInfo, setUserInfo] = useState({
    fullName: "Yükleniyor...",
    jobTitle: "...",
    photoUrl: null,
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
            jobTitle: result.data.jobTitle || "İSG Uzmanı", // Varsayılan ünvan
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
        {/* --- İSTATİSTİK KARTLARI (3'lü Sıra) --- */}
        <View style={styles.statsContainer}>
          {/* Aktif Çalışan */}
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="account-hard-hat"
              size={40}
              color={colors.primary.main}
            />
            <Text style={[styles.statNumber, { color: colors.primary.main }]}>
              100
            </Text>
            <Text style={styles.statLabel}>Aktif Çalışan</Text>
          </View>

          <View style={styles.divider} />

          {/* Riskli Durum */}
          <View style={styles.statItem}>
            <Ionicons
              name="warning-outline"
              size={40}
              color={colors.dashboard.red}
            />
            <Text style={[styles.statNumber, { color: colors.dashboard.red }]}>
              5
            </Text>
            <Text style={styles.statLabel}>Riskli Durum</Text>
          </View>

          <View style={styles.divider} />

          {/* Acil Durum */}
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="alarm-light-outline"
              size={40}
              color={colors.status.warning}
            />
            <Text style={[styles.statNumber, { color: colors.status.warning }]}>
              3
            </Text>
            <Text style={styles.statLabel}>Acil Durum</Text>
          </View>
        </View>

        {/* --- DUYURU VE UYARI LİSTESİ (Timeline) --- */}
        <View style={styles.timelineCard}>
          {/* Bölüm 1: Sağlık Tabanlı Uyarılar */}
          <Text style={[styles.sectionTitle, { color: colors.primary.main }]}>
            Sağlık Tabanlı Uyarılar
          </Text>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View
                style={[styles.dot, { backgroundColor: colors.dashboard.red }]}
              />
              <View style={styles.line} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineText}>
                <Text style={{ fontWeight: "bold" }}>1. </Text>
                Düşme Algılandı – 1 çalışan için acil kontrol öneriliyor.
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View
                style={[styles.dot, { backgroundColor: colors.status.warning }]}
              />
              <View style={styles.line} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineText}>
                <Text style={{ fontWeight: "bold" }}>2. </Text>
                Yüksek Sıcaklık Uyarısı – Atölye 2 bölgesinde +38°C ölçüldü.
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View
                style={[styles.dot, { backgroundColor: colors.status.warning }]}
              />
              <View style={[styles.line, { backgroundColor: "transparent" }]} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineText}>
                <Text style={{ fontWeight: "bold" }}>3. </Text>
                Gürültü Seviyesi Aşıldı – Pres hattında 89 dB ölçüldü.
              </Text>
            </View>
          </View>

          {/* Bölüm 2: İdari Duyurular */}
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.secondary.main, marginTop: 15 },
            ]}
          >
            İdari Duyurular
          </Text>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View
                style={[styles.dot, { backgroundColor: colors.status.success }]}
              />
              <View style={styles.line} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineText}>
                <Text style={{ fontWeight: "bold" }}>1. </Text>
                Aylık İSG Değerlendirme Toplantısı – 10:45’te
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View
                style={[styles.dot, { backgroundColor: colors.status.success }]}
              />
              <View style={styles.line} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineText}>
                <Text style={{ fontWeight: "bold" }}>2. </Text>
                KKD Dağıtımı – Yeni eldiven ve kulaklıklar hazır
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View
                style={[styles.dot, { backgroundColor: colors.status.success }]}
              />
              {/* Son eleman, çizgi yok */}
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineText}>
                <Text style={{ fontWeight: "bold" }}>3. </Text>
                Yarı Tatil Duyurusu – Bugün 12:30’a kadar çalışma
              </Text>
            </View>
          </View>

          {/* Legend (Alt Bilgi) */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors.dashboard.red },
                ]}
              />
              <Text style={styles.legendText}>Acil Uyarılar</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors.status.warning },
                ]}
              />
              <Text style={styles.legendText}>Önleyici Uyarılar</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: colors.status.success },
                ]}
              />
              <Text style={styles.legendText}>Genel Duyurular</Text>
            </View>
          </View>
        </View>

        {/* --- GÖREVLER KARTI --- */}
        <TouchableOpacity
          style={styles.taskCard}
          activeOpacity={0.9}
          onPress={() => router.push("/common/taskScreen")} // Ortak görev ekranına yönlendirme
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
              Aktif ve tamamlanan görevleri görüntüleyin
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

// STİLLER
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
      marginBottom: 30,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 54,
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
      textTransform: "uppercase",
    },
    notificationBtn: {
      width: 44,
      height: 44,
      backgroundColor: colors.background.card,
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

    // İstatistik Kartları (3'lü)
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderRadius: 24,
      paddingVertical: 25,
      marginBottom: 25,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      // Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: theme === "light" ? 3 : 0,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    divider: {
      width: 1,
      height: 50,
      backgroundColor: colors.neutral.border,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.text.main,
      marginTop: 4,
    },

    // Timeline / Duyuru Kartı
    timelineCard: {
      backgroundColor: colors.background.card,
      borderRadius: 24,
      padding: 24,
      marginBottom: 25,
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text.main, // Dinamik Renk
      marginBottom: 15,
    },
    timelineItem: {
      flexDirection: "row",
      marginBottom: 0,
    },
    timelineLeft: {
      alignItems: "center",
      width: 20,
      marginRight: 10,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      zIndex: 2,
    },
    line: {
      width: 2,
      flex: 1, // Kalan boşluğu doldur
      backgroundColor: colors.neutral.border, // Çizgi rengi
      marginTop: -2, // Dot'un arkasından başlasın
      marginBottom: -2,
      minHeight: 30, // En az bu kadar uzunlukta olsun
    },
    timelineContent: {
      flex: 1,
      paddingBottom: 15,
    },
    timelineText: {
      fontSize: 13,
      color: colors.text.secondary,
      lineHeight: 20,
    },

    // Legend (Alt Bilgi)
    legendContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 15,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: colors.neutral.border,
      flexWrap: "wrap",
      gap: 15,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    legendText: {
      fontSize: 11,
      color: colors.text.secondary,
      fontWeight: "600",
    },

    // Task Card
    taskCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderRadius: 28,
      paddingVertical: 25,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    taskIconContainer: {
      width: 85,
      height: 85,
      backgroundColor: theme === "dark" ? "#2C2C2C" : colors.primary.light,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    taskIconImage: {
      width: 60,
      height: 60,
      resizeMode: "contain",
    },
    taskTextContainer: {
      flex: 1,
    },
    taskTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 6,
    },
    taskDesc: {
      fontSize: 14,
      color: colors.text.secondary,
      lineHeight: 20,
      paddingRight: 10,
    },
  });
