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
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import useBLE from "../../hooks/useBLE";
import { useBLEContext } from "@/hooks/BLEContext";

const { width, height } = Dimensions.get("window");
const CARD_GAP = 16;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;

// API URL
const API_BASE_URL =
  "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";

export default function WorkerHomeScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  // --- BLE BAĞLANTISI ---
  const { scanAndConnect, connectionStatus, sensorData } = useBLEContext();
    const [bleModalVisible, setBleModalVisible] = useState(false);

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
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.isSuccess && result.data) {
          setUserInfo({
            fullName: result.data.fullName || "İsimsiz Kullanıcı",
            jobTitle: result.data.jobTitle || "Çalışan",
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

  // Bağlantı durumuna göre renk ve metin
  const getStatusColor = () => {
    switch (connectionStatus) {
      case "Connected":
        return "#4CAF50";
      case "Scanning...":
        return "#FF9800";
      case "Connecting...":
        return "#2196F3";
      case "Error":
      case "Failed":
      case "Disconnected":
        return "#FF5252";
      default:
        return colors.text.secondary;
    }
  };

  const getStatusText = () => {
    if (connectionStatus === "Connected") return "● Cihaz Bağlı";
    if (connectionStatus === "Scanning...") return "○ Cihaz Aranıyor...";
    if (connectionStatus === "Connecting...") return "○ Bağlanılıyor...";
    return "○ Bağlantı Yok";
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={
              userInfo.photoUrl
                ? { uri: userInfo.photoUrl }
                : require("../../assets/images/avatar.png")
            }
            style={styles.avatar}
          />

          <View>
            {loading ? (
              <ActivityIndicator size="small" color={colors.text.secondary} />
            ) : (
              <>
                <Text style={styles.userName}>{userInfo.fullName}</Text>
                <Text style={styles.userRole}>{userInfo.jobTitle}</Text>

                {/* Bağlantı Durumu (Tıklanabilir) */}
                <TouchableOpacity onPress={() => setBleModalVisible(true)}>
                  <Text
                    style={{
                      color: getStatusColor(),
                      fontSize: 12,
                      marginTop: 4,
                      fontWeight: "bold",
                    }}
                  >
                    {getStatusText()}
                  </Text>
                </TouchableOpacity>
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
        {/* QUICK STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={42} color={colors.dashboard.red} />
            <Text style={[styles.statValue, { color: colors.dashboard.red }]}>
              {sensorData.heartRate > 0 ? sensorData.heartRate : "--"}
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
              {sensorData.spo2 > 0 ? `%${sensorData.spo2}` : "--"}
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
              {sensorData.stress !== undefined ? sensorData.stress : "--"}
            </Text>
            <Text style={styles.statLabel}>Stres</Text>
          </View>
        </View>

        {/* DASHBOARD GRID */}
        <View style={styles.gridContainer}>
          {/* NEM */}
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
                {sensorData.humidity > 0
                  ? `%${sensorData.humidity.toFixed(0)}`
                  : "--"}
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

          {/* SICAKLIK */}
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
                {sensorData.temp > 0 ? `${sensorData.temp.toFixed(1)}°` : "--"}
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

          {/* GÜRÜLTÜ */}
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
                {sensorData.noise > 0 ? `${sensorData.noise} dB` : "--"}
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

          {/* IŞIK */}
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
                {sensorData.light > 0 ? `${sensorData.light}%` : "--"}
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

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* --- BLE YÖNETİM MODALI --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bleModalVisible}
        onRequestClose={() => setBleModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setBleModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalIndicator} />
                <Text style={styles.modalTitle}>Cihaz Bağlantısı</Text>

                {/* Durum Göstergesi */}
                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor() },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusTextLarge,
                      { color: getStatusColor() },
                    ]}
                  >
                    {connectionStatus}
                  </Text>
                </View>

                {/* Bilgi Kartı */}
                <View style={styles.infoBox}>
                  <Text style={styles.infoTextTitle}>Bağlantı İpuçları:</Text>
                  <Text style={styles.infoText}>
                    • Telefonunuzun Bluetooth'u açık mı?
                  </Text>
                  <Text style={styles.infoText}>
                    • Konum servisleriniz açık mı?
                  </Text>
                  <Text style={styles.infoText}>
                    • Bileklik açık ve yakında mı?
                  </Text>
                </View>

                {/* Yeniden Bağlan Butonu */}
                <TouchableOpacity
                  style={styles.reconnectButton}
                  onPress={() => {
                    setBleModalVisible(false);
                    scanAndConnect();
                  }}
                >
                  <Ionicons
                    name="refresh"
                    size={20}
                    color="#FFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.reconnectButtonText}>
                    Yeniden Bağlan / Tara
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
      paddingTop: 50,
    },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 20 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      marginBottom: 35,
    },
    userInfo: { flexDirection: "row", alignItems: "center" },
    avatar: {
      width: 54,
      height: 54,
      borderRadius: 27,
      marginRight: 14,
      borderWidth: 2,
      borderColor: colors.neutral.border,
    },
    userName: { fontSize: 17, fontWeight: "bold", color: colors.text.main },
    userRole: { fontSize: 13, color: colors.text.secondary },
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
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.background.card,
      borderRadius: 24,
      paddingVertical: 18,
      paddingHorizontal: 20,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      elevation: theme === "light" ? 4 : 0,
    },
    statItem: { alignItems: "center", flex: 1 },
    statLine: {
      width: 1,
      height: "70%",
      backgroundColor: colors.neutral.border,
      alignSelf: "center",
    },
    statValue: { fontSize: 28, fontWeight: "800", marginTop: 10 },
    statLabel: {
      fontSize: 14,
      color: colors.text.secondary,
      fontWeight: "600",
      marginTop: 6,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: CARD_GAP,
      marginBottom: 30,
    },
    card: {
      width: CARD_WIDTH,
      height: 135,
      borderRadius: 24,
      padding: 18,
      position: "relative",
      borderWidth: 1,
      borderColor: theme === "dark" ? colors.neutral.border : "transparent",
    },
    cardContent: { zIndex: 2, marginTop: 8 },
    cardTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme === "dark" ? "#AAAAAA" : "#333333",
      marginBottom: 6,
    },
    cardValue: { fontSize: 28, fontWeight: "bold" },
    bgIcon: { position: "absolute", right: 2, bottom: 2, zIndex: 1 },
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
    taskIconImage: { width: 60, height: 60, resizeMode: "contain" },
    taskTextContainer: { flex: 1 },
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

    // MODAL STİLLERİ
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
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
    statusTextLarge: { fontSize: 18, fontWeight: "bold" },
    infoBox: {
      backgroundColor: colors.neutral.input,
      padding: 15,
      borderRadius: 12,
      marginBottom: 20,
    },
    infoTextTitle: {
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 5,
    },
    infoText: { color: colors.text.secondary, fontSize: 14, marginBottom: 3 },
    reconnectButton: {
      backgroundColor: colors.primary.main,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    reconnectButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  });
