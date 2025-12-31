// app/(founder)/index.tsx

import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 50) / 2;

// API URL
const API_BASE_URL = "http://10.0.2.2:5187";

export default function FounderDashboard() {
  const { colors, theme } = useTheme();

  // Stilleri burada useMemo ile oluşturuyoruz
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  const deptScrollRef = useRef<ScrollView>(null);
  const alertScrollRef = useRef<ScrollView>(null);
  const [deptX, setDeptX] = useState(0);
  const [alertX, setAlertX] = useState(0);

  // KULLANICI BİLGİLERİ STATE'İ
  const [userInfo, setUserInfo] = useState({
    fullName: "Yükleniyor...",
    jobTitle: "...",
    companyName: "Şirketim",
    photoUrl: null,
  });
  const [loading, setLoading] = useState(true);

  // API'den Kullanıcı Bilgilerini Çek
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
          const data = result.data;
          setUserInfo({
            fullName: data.fullName || "İsimsiz Yönetici",
            // Eğer API'den jobTitle gelmezse varsayılan olarak Firma Sahibi yaz
            jobTitle: data.jobTitle || "Firma Sahibi",
            // API'den şirket adı gelmiyorsa (User objesinde yoksa) sabit veya varsayılan
            companyName: data.fullName || "NHRR Tech",
            photoUrl: data.photoUrl,
          });
        }
      } catch (error) {
        console.error("Founder User Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // DUMMY DATA - UYARILAR
  const alerts = [
    {
      id: 1,
      text: "1 ramak kala olay",
      icon: "alert-circle-outline" as const,
      color: colors.dashboard.red,
    },
    {
      id: 2,
      text: "Yüksek gürültü",
      icon: "volume-high" as const,
      color: colors.secondary.main,
    },
    {
      id: 3,
      text: "1 çalışan düşme riski",
      icon: "run" as const,
      color: colors.dashboard.red,
    },
    {
      id: 4,
      text: "Yüksek Isı Maruziyeti ",
      icon: "thermometer" as const,
      color: colors.secondary.main,
    },
    {
      id: 5,
      text: "Kimyasal Sızıntı Uyarısı ",
      icon: "flask-outline" as const,
      color: colors.dashboard.red,
    },
    {
      id: 6,
      text: "Maske Kullanımı İhlali",
      icon: "face-mask-outline" as const,
      color: colors.secondary.main,
    },
  ];

  // DUMMY DATA - DEPARTMANLAR
  const departments = [
    {
      id: 1,
      name: "Üretim",
      status: "Güvenli",
      icon: "factory" as const,
      color: colors.status.success,
    },
    {
      id: 2,
      name: "Atölye",
      status: "Orta Risk",
      icon: "hammer" as const,
      color: colors.secondary.main,
    },
    {
      id: 3,
      name: "Depo",
      status: "Güvenli",
      icon: "archive" as const,
      color: colors.status.success,
    },
    {
      id: 4,
      name: "Sevkiyat",
      status: "Orta Risk",
      icon: "truck-delivery" as const,
      color: colors.secondary.main,
    },
    {
      id: 5,
      name: "Lab",
      status: "Güvenli",
      icon: "flask" as const,
      color: colors.status.success,
    },
    {
      id: 6,
      name: "Montaj",
      status: "Kritik",
      icon: "cog" as const,
      color: colors.dashboard.red,
    },
  ];

  // Scroll Handler
  const handleScroll = (
    ref: React.RefObject<ScrollView>,
    currentX: number,
    setX: (x: number) => void,
    data: any[]
  ) => {
    const cardWidthWithMargin = (width - 50) / 2 + 10;
    const step = cardWidthWithMargin * 2; // 2 kart atla
    const max = cardWidthWithMargin * (data.length - 2);
    let nextX = currentX + step;
    if (nextX > max) nextX = 0;
    ref.current?.scrollTo({ x: nextX, animated: true });
    setX(nextX);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Logo Kısmı (API'den gelen photoUrl varsa onu kullan) */}
          <Image
            source={
              userInfo.photoUrl
                ? { uri: userInfo.photoUrl }
                : require("../../assets/images/company/companylogo.png")
            }
            style={styles.logo}
          />
          <View style={styles.headerTextContainer}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.text.secondary} />
            ) : (
              <>
                <Text style={styles.companyName}>{userInfo.companyName}</Text>
                <Text style={styles.subTitle}>
                  {userInfo.fullName} - {userInfo.jobTitle}
                </Text>
              </>
            )}
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            size={26}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- GENEL STATS KARTI --- */}
        <View style={[styles.topStatsRow, styles.cardBg]}>
          <View style={styles.topStatItem}>
            <FontAwesome5 name="hard-hat" size={26} color="#4870FF" />
            <Text style={[styles.statValue, { color: "#4870FF" }]}>100</Text>
            <Text style={styles.statLabel}>Aktif Çalışan</Text>
          </View>
          <View style={styles.topStatItem}>
            <MaterialCommunityIcons
              name="alert"
              size={32}
              color={colors.dashboard.red}
            />
            <Text style={[styles.statValue, { color: colors.dashboard.red }]}>
              5
            </Text>
            <Text style={styles.statLabel}>Riskli Durum</Text>
          </View>
          <View style={styles.topStatItem}>
            <MaterialCommunityIcons
              name="alarm-light"
              size={32}
              color={colors.secondary.main}
            />
            <Text style={[styles.statValue, { color: colors.secondary.main }]}>
              3
            </Text>
            <Text style={styles.statLabel}>Acil Durum</Text>
          </View>
        </View>

        {/* --- YATAY ALERT SLIDER --- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Dikkat Edilmesi Gerekenler</Text>
          <TouchableOpacity
            onPress={() =>
              handleScroll(
                alertScrollRef,
                alertX,
                (setX) => setAlertX(setX),
                alerts
              )
            }
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={alertScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={(width - 50) / 2 + 10}
          decelerationRate="fast"
          style={styles.alertSlider}
          onScroll={(e) => setAlertX(e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}
        >
          {alerts.map((item) => (
            <View
              key={item.id}
              style={[styles.alertCard, { backgroundColor: item.color }]}
            >
              <MaterialCommunityIcons name={item.icon} size={22} color="#fff" />
              <Text style={styles.alertText} numberOfLines={2}>
                {item.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* --- DEPARTMAN SLIDER --- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            Departman Durumu
          </Text>
          <TouchableOpacity
            onPress={() =>
              handleScroll(
                deptScrollRef,
                deptX,
                (setX) => setDeptX(setX),
                departments
              )
            }
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          ref={deptScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={(width - 50) / 2 + 10}
          decelerationRate="fast"
          style={styles.deptSlider}
          onScroll={(e) => setDeptX(e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}
        >
          {departments.map((item) => (
            <View key={item.id} style={[styles.deptCard, styles.cardBg]}>
              <View style={styles.deptContentRow}>
                <View style={styles.iconColumn}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={item.color}
                  />
                </View>
                <Text style={styles.deptName}>{item.name}</Text>
              </View>
              <View style={styles.statusRow}>
                <View style={styles.iconColumn}>
                  <Ionicons
                    name={
                      item.status === "Güvenli"
                        ? "checkmark-circle"
                        : "alert-circle"
                    }
                    size={22}
                    color={item.color}
                  />
                </View>
                <Text style={[styles.statusText, { color: item.color }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* --- ALT ÖZET KARTLAR --- */}
        <View style={styles.gridRow}>
          <View style={[styles.bottomCard, styles.cardBg]}>
            <View style={styles.taskItem}>
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={colors.status.success}
              />
              <Text style={styles.taskText}>12 Görev Bitti</Text>
            </View>
            <View style={styles.taskItem}>
              <MaterialCommunityIcons
                name="timer-sand"
                size={22}
                color="#4870FF"
              />
              <Text style={styles.taskText}>4 Görev Aktif</Text>
            </View>
            <View style={styles.taskItem}>
              <Ionicons
                name="close-circle"
                size={22}
                color={colors.dashboard.red}
              />
              <Text style={styles.taskText}>1 Geciken Görev</Text>
            </View>
          </View>

          <View style={[styles.bottomCard, styles.cardBg]}>
            <Text style={styles.distTitle}>Personel Dağılımı</Text>
            <View style={styles.distContent}>
              <View style={{ alignItems: "center" }}>
                <Ionicons name="person" size={32} color="#4870FF" />
                <Text style={[styles.distValue, { color: "#4870FF" }]}>
                  100
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Ionicons
                  name="person-add"
                  size={32}
                  color={colors.secondary.main}
                />
                <Text
                  style={[styles.distValue, { color: colors.secondary.main }]}
                >
                  10
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Bar Boşluğu */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// --- STYLES ---
const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.default },

    // Header
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 50,
      marginBottom: 15,
    },
    headerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    headerTextContainer: { marginLeft: 12, flex: 1 },
    logo: { width: 50, height: 50, borderRadius: 15 },
    companyName: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text.main,
      lineHeight: 24,
    },
    subTitle: { fontSize: 13, color: colors.text.secondary, marginTop: -2 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },

    // Ortak Kart Arka Planı
    cardBg: {
      backgroundColor: theme === "light" ? "#F8F9FB" : colors.background.card,
      borderRadius: 24,
      padding: 18,
      borderWidth: 1,
      borderColor: theme === "light" ? "#F0F2F5" : colors.neutral.border,
      // Light modda gölge yok, flat tasarım
      elevation: 0,
      shadowOpacity: 0,
    },

    // Üst İstatistikler
    topStatsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 25,
    },
    topStatItem: { alignItems: "center", flex: 1 },
    statValue: { fontSize: 24, fontWeight: "bold", marginVertical: 5 },
    statLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: theme === "dark" ? "#AAA" : "#333",
    },

    // Başlık Satırları
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: "bold",
      color: colors.dashboard.red,
    },

    // Alert Kartları
    alertSlider: { marginBottom: 25 },
    alertCard: {
      width: CARD_WIDTH,
      height: 85,
      marginRight: 10,
      borderRadius: 22,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      gap: 8,
    },
    alertText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "bold",
      flex: 1,
      lineHeight: 16,
    },

    // Departman Kartları
    deptSlider: { marginBottom: 25 },
    deptCard: {
      width: CARD_WIDTH,
      marginRight: 10,
      paddingVertical: 20,
      paddingHorizontal: 15,
    },
    iconColumn: { width: 35, alignItems: "center", justifyContent: "center" },
    deptContentRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      gap: 10,
    },
    deptName: { fontSize: 15, fontWeight: "bold", color: colors.text.main },
    statusRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    statusText: { fontSize: 13, fontWeight: "700" },

    // Alt Kartlar
    gridRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      gap: 15,
    },
    bottomCard: { flex: 1, padding: 20 },
    taskItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    taskText: { fontSize: 14, fontWeight: "700", color: colors.text.main },
    distTitle: {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 18,
      color: colors.text.main,
    },
    distContent: { flexDirection: "row", justifyContent: "center", gap: 30 },
    distValue: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 5,
    },
  });
