// app/(worker)/progress.tsx

import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { useRouter } from "expo-router";
const { width } = Dimensions.get("window");
const CARD_GAP = 16;
// Kart genişliği hesaplama (Paddingler düşüldükten sonra 2'ye böl)
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;
// Grafiğin kart içine sığması için genişlik (Karttan biraz daha dar)
// CHART_WIDTH'i CARD_WIDTH'ten daha da küçük yapıp yanlara boşluk vererek daha iyi durmasını sağlayabiliriz.
const CHART_WIDTH = CARD_WIDTH - 30; // Yanlardan daha fazla boşluk

export default function ProgressScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);
  const router = useRouter();
  // --- MOCK DATA ---

  // Renk Güvenliği: Eğer dashboard.green yoksa status.success kullan (önceki düzeltmeden)
  const greenColor = colors.dashboard.green || colors.status.success;

  // 1. Stres Verisi (Bar Chart) - Karışık renkli çubuklar
  const stressData = [
    { value: 40, frontColor: colors.primary.main },
    { value: 60, frontColor: colors.secondary.main },
    { value: 30, frontColor: colors.primary.main },
    { value: 80, frontColor: greenColor },
    { value: 50, frontColor: colors.secondary.main },
    { value: 70, frontColor: colors.primary.main },
    { value: 90, frontColor: greenColor },
  ];

  // 2. Kalp Atışı (Line Chart) - Dalgalı Çizgi
  const heartData = [
    { value: 60 },
    { value: 65 },
    { value: 62 },
    { value: 78 },
    { value: 70 },
    { value: 85 },
    { value: 75 },
    { value: 68 },
    { value: 72 },
    { value: 69 },
  ];

  // 3. SpO2 (Bar Chart) - Tek renk yeşil tonları
  const spo2Data = [
    { value: 98 },
    { value: 97 },
    { value: 99 },
    { value: 96 },
    { value: 98 },
    { value: 99 },
    { value: 97 },
  ];

  // 4. Çalışma Saati (Bar Chart) - Mavi ve Gri
  const workData = [
    { value: 8, frontColor: colors.primary.main },
    { value: 8, frontColor: colors.primary.main },
    { value: 9, frontColor: colors.secondary.main },
    { value: 8, frontColor: colors.primary.main },
    { value: 4, frontColor: colors.neutral.gray[300] },
    { value: 0, frontColor: colors.neutral.gray[300] },
  ];

  // --- ORTAK GRAFİK AYARLARI ---
  const commonProps = {
    hideYAxisText: true,
    hideRules: true,
    hideAxesAndRules: true,
    xAxisThickness: 0,
    yAxisThickness: 0,
    initialSpacing: 5, // Çubukların ilk boşluğu
    spacing: 8, // Çubuklar arası boşluk
    barWidth: 8, // Çubuk genişliği
    height: 80,
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Sağlık Bilgilerim" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {/* --- KART 1: STRES --- */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push("/common/stress-detail")} // <--- YÖNLENDİRME
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Stres</Text>
              <Text style={styles.cardSubtitle}>
                Stres{" "}
                <Text
                  style={{ color: greenColor, fontWeight: "bold" }} // Stres için yeşil vurgu
                >
                  62
                </Text>{" "}
                orta
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <BarChart
                data={stressData}
                roundedTop
                roundedBottom
                {...commonProps}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push("/common/heart-detail")} // <--- YÖNLENDİRME
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Kalp</Text>
              <Text style={styles.cardSubtitle}>
                Hız{" "}
                <Text
                  style={{ color: colors.dashboard.red, fontWeight: "bold" }}
                >
                  69
                </Text>{" "}
                nbz/dk
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <LineChart
                data={heartData}
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
            onPress={() => router.push("/common/spo2-detail")} // <--- YÖNLENDİRME
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>SpO₂</Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  {
                    color: greenColor, // SpO2 için yeşil vurgu
                    fontWeight: "bold",
                    fontSize: 24, // Büyütüldü
                    marginTop: 8, // Boşluk arttı
                  },
                ]}
              >
                %99
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <BarChart
                data={spo2Data}
                frontColor={greenColor} // SpO2 için yeşil vurgu
                roundedTop
                {...commonProps}
              />
            </View>
          </TouchableOpacity>

          {/* --- KART 4: ÇALIŞMA SAATİ --- */}
         <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push('/common/work-hours-detail')} // <--- YÖNLENDİRME
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Çalışma Saati</Text>
              <Text style={styles.cardSubtitle}>
                Ortalama{" "}
                <Text
                  style={{ color: colors.primary.main, fontWeight: "bold" }}
                >
                  50
                </Text>{" "}
                saat
              </Text>
            </View>
            <View style={styles.chartContainer}>
              <BarChart data={workData} roundedTop {...commonProps} />
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
