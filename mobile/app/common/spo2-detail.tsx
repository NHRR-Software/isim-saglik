// app/common/spo2-detail.tsx

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";

const { width } = Dimensions.get("window");

// DUMMY DATA (SpO2 Verileri)
const spo2Data = [
  { value: 98, frontColor: "#4CD964" },
  { value: 97, frontColor: "#4CD964" },
  { value: 99, frontColor: "#4CD964" },
  { value: 96, frontColor: "#4CD964" },
  { value: 98, frontColor: "#4CD964" },
  { value: 95, frontColor: "#4CD964" },
  { value: 99, frontColor: "#4CD964" },
];

export default function Spo2DetailScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  const [periodTab, setPeriodTab] = useState("Gün");

  // Tab Selector
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

  return (
    <View style={styles.container}>
      <CustomHeader title="SpO₂" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Tab Seçici */}
        <PeriodSelector />

        {/* 2. Ortalama Değer */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Ortalama SpO₂</Text>
          <Text style={styles.summaryValue}>%97</Text>
        </View>

        {/* 3. GRAFİK (Bar Chart) */}
        <View style={styles.chartContainer}>
          <BarChart
            data={spo2Data}
            barWidth={8}
            spacing={35} // Çubuklar arası boşluk
            roundedTop
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: colors.text.secondary }}
            noOfSections={3}
            maxValue={100}
            height={200}
            width={width - 60}
            initialSpacing={20} // Soldan boşluk
          />

          {/* X Ekseni Etiketleri (Manuel ekleme daha esnek) */}
          <View style={styles.xAxisLabels}>
            <Text style={styles.axisText}>00:00</Text>
            <Text style={styles.axisText}>06:00</Text>
            <Text style={styles.axisText}>12:00</Text>
            <Text style={styles.axisText}>18:00</Text>
            <Text style={styles.axisText}>00:00</Text>
          </View>
        </View>

        {/* 4. LEGEND (Renk Açıklamaları) */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: colors.dashboard.red },
              ]}
            />
            <Text style={styles.legendText}>{"<%70"}</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: colors.status.warning },
              ]}
            />
            <Text style={styles.legendText}>%70 - %89</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#4CD964" }]} />
            <Text style={styles.legendText}>%90 - %100</Text>
          </View>
        </View>

        {/* 5. ALT KARTLAR (Grid) */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statCardTitle}>Son kayıt</Text>
            <Text style={styles.statCardValue}>%97</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardTitle}>En düşük-En yüksek</Text>
            <Text style={styles.statCardValue}>%97 - %99</Text>
          </View>
        </View>
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
      paddingHorizontal: 20,
      paddingBottom: 40,
    },

    // Tab Seçici
    periodSelectorContainer: {
      flexDirection: "row",
      backgroundColor: colors.background.card,
      borderRadius: 12,
      padding: 4,
      marginBottom: 30,
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
      backgroundColor: colors.primary.main,
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
      color: "#FFFFFF",
      fontWeight: "bold",
    },

    // Özet
    summaryContainer: {
      alignItems: "center",
      marginBottom: 20,
      flexDirection: "row",
      justifyContent: "center",
    },
    summaryLabel: {
      fontSize: 16,
      color: colors.text.secondary,
      marginRight: 8,
      fontWeight: "600",
    },
    summaryValue: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text.main,
    },

    // Grafik
    chartContainer: {
      marginBottom: 20,
      alignItems: "center",
    },
    xAxisLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 10,
      marginTop: 10,
    },
    axisText: {
      fontSize: 10,
      color: colors.text.secondary,
    },

    // Legend
    legendContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 40,
      paddingHorizontal: 10,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 6,
    },
    legendText: {
      fontSize: 12,
      color: colors.text.secondary,
      fontWeight: "600",
    },

    // Alt Kartlar
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 15,
    },
    statCard: {
      flex: 1, // Yan yana eşit dağılması için
      alignItems: "center", // İçeriği ortala
      paddingVertical: 10, // Dikey boşluk
    },
    statCardTitle: {
      fontSize: 14,
      color: colors.text.secondary,
      marginBottom: 8,
    },
    statCardValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text.main,
    },
  });
