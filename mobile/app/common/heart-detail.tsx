// app/common/heart-detail.tsx

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";

const { width } = Dimensions.get("window");

// DUMMY DATA
const heartRateData = [
  { value: 55, label: "00:00" },
  { value: 58 },
  { value: 54 },
  { value: 60, label: "06:00" },
  { value: 95 },
  { value: 110 },
  { value: 85 },
  { value: 70, label: "12:00" },
  { value: 75 },
  { value: 80 },
  { value: 95 },
  { value: 88, label: "18:00" },
  { value: 105 },
  { value: 122 },
  { value: 90 },
  { value: 65, label: "24:00" },
];

const restingHeartRateData = [
  { value: 52, label: "Pzt" },
  { value: 50, label: "Sal" },
  { value: 53, label: "Çar" },
  { value: 51, label: "Per" },
  { value: 49, label: "Cum" },
  { value: 55, label: "Cts" },
  { value: 51, label: "Paz" },
];

export default function HeartDetailScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  // Tab State'leri
  const [periodTab, setPeriodTab] = useState("Gün");
  const [metricTab, setMetricTab] = useState("Kalp Atış Hızı");

  // --- ÜST TAB SELECTOR (Gün/Hafta/Ay/Yıl) ---
  const PeriodSelector = () => (
    <View style={styles.periodSelectorContainer}>
      {["Gün", "Hafta", "Ay", "Yıl"].map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.periodButton,
            periodTab === item && styles.periodButtonActive,
          ]}
          onPress={() => setPeriodTab(item)}
        >
          <Text
            style={[
              styles.periodText,
              periodTab === item && styles.periodTextActive,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // --- ORTA TAB SELECTOR (Kalp Atış Hızı / KAHD) ---
  const MetricSelector = () => (
    <View style={styles.metricSelectorContainer}>
      {["Kalp Atış Hızı", "KAHD"].map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.metricButton,
            metricTab === item && styles.metricButtonActive,
          ]}
          onPress={() => setMetricTab(item)}
        >
          <Text
            style={[
              styles.metricText,
              metricTab === item && styles.metricTextActive,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader title="Kalp Atış Hızı" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Dönem Seçici */}
        <PeriodSelector />

        {/* 2. Özet Bilgi Alanı */}
        <View style={styles.summaryContainer}>
          <View>
            <Text style={styles.bigValue}>
              52-122 <Text style={styles.unit}>nbz/dk</Text>
            </Text>
            <Text style={styles.label}>Kalp atış hızı</Text>
          </View>
          <View>
            <Text style={styles.currentValue}>
              97 <Text style={styles.unitSmall}>nbz/dk</Text>
            </Text>
            <Text style={styles.lastUpdate}>Son güncelleme: 22:10</Text>
          </View>
        </View>

        {/* Ekstra Bilgi */}
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>
            Dinlenme kalp atış hızı 52 nbz/dk
          </Text>
        </View>

        {/* 3. BÜYÜK GRAFİK (Günlük Kalp) */}
        <View style={styles.mainChartContainer}>
          <LineChart
            data={heartRateData}
            height={200}
            width={width - 60}
            initialSpacing={10}
            color={colors.dashboard.red}
            thickness={2}
            curved
            startFillColor={colors.dashboard.red}
            endFillColor={colors.dashboard.red}
            startOpacity={0.2}
            endOpacity={0.0}
            areaChart
            hideDataPoints
            xAxisColor={colors.neutral.border}
            yAxisColor={colors.neutral.border}
            yAxisTextStyle={{ color: colors.text.secondary, fontSize: 10 }}
            xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 10 }}
            rulesColor={colors.neutral.border}
            rulesType="solid"
            yAxisThickness={0}
            xAxisThickness={0}
          />
        </View>

        {/* 4. Metrik Seçici (Kalp Hızı / KAHD) */}
        <MetricSelector />

        {/* 5. ANALİZLER KARTI */}
        <Text style={styles.sectionTitle}>Analizler</Text>

        <View style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Ionicons
              name="heart-circle"
              size={24}
              color={colors.dashboard.red}
            />
            <Text style={styles.analysisTitle}>Dinlenme kalp atış hızı</Text>
          </View>

          <Text style={styles.analysisDesc}>
            Son zamanlarda, ortalama dinlenme kalp atış hızınız 51 nbz/dk idi.
          </Text>

          {/* Küçük Grafik ve Değer */}
          <View style={styles.analysisChartRow}>
            <View>
              <Text style={styles.analysisValue}>
                51{" "}
                <Text style={{ fontSize: 12, fontWeight: "normal" }}>
                  nbz/dk
                </Text>
              </Text>
              <Text style={styles.analysisLabel}>Günlük ortalama</Text>
            </View>

            {/* Küçük Grafik */}
            <View style={{ height: 60, width: 120 }}>
              <LineChart
                data={restingHeartRateData}
                height={50}
                width={120}
                color={colors.text.secondary}
                thickness={1.5}
                hideDataPoints={false}
                dataPointsColor={colors.neutral.gray[300]}
                dataPointsRadius={3}
                hideRules
                hideAxesAndRules
                curved
              />
              {/* Kırmızı Referans Çizgisi */}
              <View
                style={{
                  position: "absolute",
                  top: 35,
                  left: 0,
                  right: 0,
                  height: 1,
                  backgroundColor: colors.dashboard.red,
                }}
              />
            </View>
          </View>

          {/* Dipnot */}
          <Text style={styles.footnote}>
            Referans değer: 60 – 100 nbz/dk (Sporcular gibi sık egzersiz yapan
            kişilerin dinlenme kalp atış hızı 60 nbz/dk değerinin altında
            olabilir.)
          </Text>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
      // paddingTop: 50, // KALDIRILDI: CustomHeader hallediyor
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },

    // Tab Seçici (GÜNCELLENDİ)
    periodSelectorContainer: {
      flexDirection: "row",
      backgroundColor: colors.background.card,
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: 8,
    },
    periodButtonActive: {
      backgroundColor: colors.primary.main, // ARTIK MAVİ
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
    },
    periodText: {
      fontSize: 14,
      color: colors.text.secondary,
      fontWeight: "500",
    },
    periodTextActive: {
      color: "#FFFFFF", // ARTIK BEYAZ
      fontWeight: "bold",
    },

    // Özet Bilgi
    summaryContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 5,
    },
    bigValue: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text.main,
    },
    unit: {
      fontSize: 14,
      fontWeight: "normal",
      color: colors.text.secondary,
    },
    label: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    currentValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text.main,
      textAlign: "right",
    },
    unitSmall: {
      fontSize: 12,
      fontWeight: "normal",
      color: colors.text.secondary,
    },
    lastUpdate: {
      fontSize: 12,
      color: colors.text.secondary,
      textAlign: "right",
    },
    infoBadge: {
      backgroundColor: colors.neutral.input,
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginTop: 8,
      marginBottom: 20,
    },
    infoBadgeText: {
      fontSize: 12,
      color: colors.text.secondary,
    },

    // Ana Grafik
    mainChartContainer: {
      marginBottom: 25,
      paddingRight: 10,
    },

    // Metrik Seçici (Kalp / KAHD)
    metricSelectorContainer: {
      flexDirection: "row",
      backgroundColor: colors.background.card,
      borderRadius: 16,
      padding: 4,
      marginBottom: 25,
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    metricButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 12,
    },
    metricButtonActive: {
      backgroundColor: colors.secondary.main, // Turuncu (Burası farklı kalsın istersen mavi de yapabiliriz)
    },
    metricText: {
      fontSize: 14,
      color: colors.text.main,
      fontWeight: "600",
    },
    metricTextActive: {
      color: "#FFF",
    },

    // Analizler Bölümü
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 15,
    },
    analysisCard: {
      backgroundColor: colors.background.card,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "light" ? 0.05 : 0,
      shadowRadius: 5,
      elevation: theme === "light" ? 2 : 0,
    },
    analysisHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    analysisTitle: {
      fontSize: 16,
      color: colors.text.secondary,
      marginLeft: 8,
      fontWeight: "500",
    },
    analysisDesc: {
      fontSize: 16,
      color: colors.text.main,
      lineHeight: 24,
      marginBottom: 20,
    },
    analysisChartRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral.border,
    },
    analysisValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text.main,
    },
    analysisLabel: {
      fontSize: 12,
      color: colors.text.secondary,
    },
    footnote: {
      fontSize: 12,
      color: colors.text.secondary,
      lineHeight: 18,
    },
  });
