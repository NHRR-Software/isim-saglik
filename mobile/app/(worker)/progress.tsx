// app/(worker)/progress.tsx

import React, { useMemo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;
const CHART_WIDTH = CARD_WIDTH - 30;

// API URL
const API_BASE_URL =
  "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";

export default function ProgressScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);
  const router = useRouter();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Renk Güvenliği
  const greenColor = colors.status.success;

  // --- API'DEN VERİ ÇEKME ---
  const fetchDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);

      const token = await SecureStore.getItemAsync("accessToken");

      const response = await fetch(
        `${API_BASE_URL}/api/sensor-logs/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.isSuccess && result.data) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- CHART DATA HAZIRLAMA (historyData'dan) ---
  const getChartData = (key: string, color: string) => {
    if (!dashboardData?.historyData || dashboardData.historyData.length === 0) {
      return [{ value: 0, frontColor: color }];
    }
    return dashboardData.historyData.map((item: any) => ({
      value: item[key] || 0,
      frontColor: color,
    }));
  };

  const getLineChartData = (key: string) => {
    if (!dashboardData?.historyData || dashboardData.historyData.length === 0) {
      return [{ value: 0 }];
    }
    return dashboardData.historyData.map((item: any) => ({
      value: item[key] || 0,
    }));
  };

  // --- CURRENT DATA (Anlık Değerler) ---
  const current = dashboardData?.currentData || {};

  // --- ORTAK GRAFİK AYARLARI ---
  const commonProps = {
    hideYAxisText: true,
    hideRules: true,
    hideAxesAndRules: true,
    xAxisThickness: 0,
    yAxisThickness: 0,
    initialSpacing: 5,
    spacing: 8,
    barWidth: 8,
    height: 80,
  };

  // Yükleniyor Durumu
  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Sağlık Bilgilerim" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchDashboardData(true)}
            colors={[colors.primary.main]}
            tintColor={colors.primary.main}
          />
        }
      >
        <View style={styles.gridContainer}>
          {/* --- KART 1: STRES --- */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/common/stress-detail",
                params: {
                  history: JSON.stringify(
                    getChartData("stressLevel", colors.secondary.main)
                  ),
                  currentValue: (current.stressLevel || 0).toString(),
                },
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Stres</Text>
              <Text style={styles.cardSubtitle}>
                Stres{" "}
                <Text
                  style={{ color: colors.secondary.main, fontWeight: "bold" }}
                >
                  {current.stressLevel || 0}
                </Text>{" "}
                seviye
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <BarChart
                data={getChartData("stressLevel", colors.secondary.main)}
                roundedTop
                roundedBottom
                {...commonProps}
              />
            </View>
          </TouchableOpacity>

          {/* --- KART 2: KALP ATIŞI --- */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/common/heart-detail",
                params: {
                  history: JSON.stringify(getLineChartData("heartRate")),
                  currentValue: (current.heartRate || 0).toString(),
                },
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Kalp</Text>
              <Text style={styles.cardSubtitle}>
                Hız{" "}
                <Text
                  style={{ color: colors.dashboard.red, fontWeight: "bold" }}
                >
                  {current.heartRate || 0}
                </Text>{" "}
                nbz/dk
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <LineChart
                data={getLineChartData("heartRate")}
                color={colors.dashboard.red}
                thickness={3}
                curved
                curvature={0.3}
                hideDataPoints
                {...commonProps}
              />
            </View>
          </TouchableOpacity>

          {/* --- KART 3: SpO2 --- */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/common/spo2-detail",
                params: {
                  history: JSON.stringify(getChartData("spO2", greenColor)),
                  currentValue: (current.spO2 || 0).toString(),
                },
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>SpO₂</Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  {
                    color: greenColor,
                    fontWeight: "bold",
                    fontSize: 24,
                    marginTop: 8,
                  },
                ]}
              >
                %{current.spO2 || 0}
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <BarChart
                data={getChartData("spO2", greenColor)}
                frontColor={greenColor}
                roundedTop
                {...commonProps}
              />
            </View>
          </TouchableOpacity>

          {/* --- KART 4: SICAKLIK --- */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/common/temp-detail" as any,
                params: {
                  history: JSON.stringify(getLineChartData("temperature")),
                  currentValue: (current.temperature || 0).toString(),
                },
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Sıcaklık</Text>
              <Text style={styles.cardSubtitle}>
                Ortam{" "}
                <Text style={{ color: "#FF9800", fontWeight: "bold" }}>
                  {current.temperature || 0}°C
                </Text>
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <LineChart
                data={getLineChartData("temperature")}
                color={"#FF9800"}
                thickness={3}
                curved
                curvature={0.3}
                hideDataPoints
                {...commonProps}
              />
            </View>
          </TouchableOpacity>

          {/* --- KART 5: NEM --- */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/common/humidity-detail" as any,
                params: {
                  history: JSON.stringify(getChartData("humidity", "#29B6F6")),
                  currentValue: (current.humidity || 0).toString(),
                },
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Nem</Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  {
                    color: "#29B6F6",
                    fontWeight: "bold",
                    fontSize: 24,
                    marginTop: 8,
                  },
                ]}
              >
                %{current.humidity || 0}
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <BarChart
                data={getChartData("humidity", "#29B6F6")}
                frontColor={"#29B6F6"}
                roundedTop
                {...commonProps}
              />
            </View>
          </TouchableOpacity>

          {/* --- KART 6: GÜRÜLTÜ --- */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() =>
              router.push({
                pathname: "/common/noise-detail" as any,
                params: {
                  history: JSON.stringify(
                    getChartData("noiseLevel", "#9C27B0")
                  ),
                  currentValue: (current.noiseLevel || 0).toString(),
                },
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Gürültü</Text>
              <Text style={styles.cardSubtitle}>
                Seviye{" "}
                <Text style={{ color: "#9C27B0", fontWeight: "bold" }}>
                  {current.noiseLevel || 0}
                </Text>{" "}
                dB
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <BarChart
                data={getChartData("noiseLevel", "#9C27B0")}
                frontColor={"#9C27B0"}
                roundedTop
                {...commonProps}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Bar Boşluğu */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
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

    // KART STİLLERİ
    card: {
      width: CARD_WIDTH,
      height: 195, // Kart yüksekliği biraz daha arttırıldı
      backgroundColor: colors.background.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "light" ? 0.05 : 0,
      shadowRadius: 8,
      elevation: theme === "light" ? 3 : 0,
      overflow: "hidden",
    },
    cardHeader: {
      marginBottom: 15, // Başlık bloğu ile grafik arasına boşluk arttı
    },
    cardTitle: {
      fontSize: 22, // Büyütüldü
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 6, // Başlık ile alt yazı arası boşluk
    },
    cardSubtitle: {
      fontSize: 17, // Büyütüldü
      color: colors.text.secondary,
    },
    chartContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      marginLeft: -10, // Kütüphane offset düzeltmesi
      marginBottom: -20, // Grafiğin altındaki fazla boşluğu almak için
      paddingRight: 5, // Sağdan hafif boşluk
    },
  });
