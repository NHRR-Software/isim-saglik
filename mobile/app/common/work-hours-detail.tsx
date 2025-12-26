// app/common/work-hours-detail.tsx

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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";

const { width } = Dimensions.get("window");

export default function WorkHoursDetailScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  const [periodTab, setPeriodTab] = useState("Hafta");

  // DUMMY DATA (Çalışma Saatleri)
  // 8 saatin üzeri Turuncu (Overtime), altı Mavi (Normal)
  const workData = [
    { value: 8, label: "Pzt", frontColor: colors.primary.main },
    {
      value: 9.5,
      label: "Sal",
      frontColor: colors.secondary.main,
      topLabelComponent: () => (
        <Text
          style={{
            color: colors.secondary.main,
            fontSize: 10,
            marginBottom: 4,
          }}
        >
          +1.5
        </Text>
      ),
    },
    { value: 8, label: "Çar", frontColor: colors.primary.main },
    {
      value: 10,
      label: "Per",
      frontColor: colors.secondary.main,
      topLabelComponent: () => (
        <Text
          style={{
            color: colors.secondary.main,
            fontSize: 10,
            marginBottom: 4,
          }}
        >
          +2
        </Text>
      ),
    },
    { value: 8, label: "Cum", frontColor: colors.primary.main },
    { value: 4, label: "Cts", frontColor: colors.neutral.gray[300] }, // Yarım gün
    { value: 0, label: "Paz" },
  ];

  // Tab Seçici
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
      <CustomHeader title="Çalışma Saati" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Tab Seçici */}
        <PeriodSelector />

        {/* 2. Özet Bilgi (Büyük Header) */}
        <View style={styles.summaryContainer}>
          <View>
            <Text style={styles.summaryLabel}>Haftalık Toplam</Text>
            <Text style={styles.summaryValue}>
              47.5 <Text style={styles.unit}>saat</Text>
            </Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.avgLabel}>Günlük Ort.</Text>
            <Text style={styles.avgValue}>9.5s</Text>
          </View>
        </View>

        {/* 3. GRAFİK (Bar Chart) */}
        <View style={styles.chartContainer}>
          {/* Referans Çizgisi Açıklaması */}
          <View style={styles.chartHeader}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={[styles.dot, { backgroundColor: colors.primary.main }]}
              />
              <Text style={styles.legendText}>Normal</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 15,
              }}
            >
              <View
                style={[styles.dot, { backgroundColor: colors.secondary.main }]}
              />
              <Text style={styles.legendText}>Fazla Mesai</Text>
            </View>
          </View>

          <BarChart
            data={workData}
            barWidth={22}
            spacing={20}
            roundedTop
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: colors.text.secondary }}
            xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 11 }}
            noOfSections={4}
            maxValue={12}
            height={220}
            width={width - 40}
            initialSpacing={10}
            // 8. Saatte Referans Çizgisi
            showReferenceLine1
            referenceLine1Position={8 * (220 / 12)} // Oran orantı ile 8. saatin konumu
            referenceLine1Config={{
              color: colors.neutral.gray[300],
              dashWidth: 4,
              dashGap: 5,
            }}
          />
        </View>

        {/* 4. İSTATİSTİK GRID (Breakdown) */}
        <Text style={styles.sectionTitle}>Haftalık Özet</Text>

        <View style={styles.statsGrid}>
          {/* Normal Mesai */}
          <View style={styles.statCard}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.primary.light },
              ]}
            >
              <Ionicons
                name="briefcase"
                size={24}
                color={colors.primary.main}
              />
            </View>
            <Text style={styles.statCardValue}>40s</Text>
            <Text style={styles.statCardLabel}>Normal Mesai</Text>
          </View>

          {/* Fazla Mesai */}
          <View style={styles.statCard}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.secondary.light },
              ]}
            >
              <Ionicons name="time" size={24} color={colors.secondary.main} />
            </View>
            <Text
              style={[styles.statCardValue, { color: colors.secondary.main }]}
            >
              +7.5s
            </Text>
            <Text style={styles.statCardLabel}>Fazla Mesai</Text>
          </View>

          {/* Verimlilik */}
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: "#E8F5E9" }]}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="#4CAF50"
              />
            </View>
            <Text style={[styles.statCardValue, { color: "#4CAF50" }]}>
              %110
            </Text>
            <Text style={styles.statCardLabel}>Verimlilik</Text>
          </View>
        </View>

        {/* 5. Alt Bilgi Notu */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.text.secondary}
          />
          <Text style={styles.infoText}>
            Bu hafta yasal çalışma sınırının{" "}
            <Text style={{ fontWeight: "bold" }}>2.5 saat</Text> altındasınız.
            Dinlenmeye zaman ayırın.
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
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },

    // Tab Seçici
    periodSelectorContainer: {
      flexDirection: "row",
      backgroundColor: colors.background.card,
      borderRadius: 12,
      padding: 4,
      marginBottom: 25,
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.text.secondary,
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 34,
      fontWeight: "bold",
      color: colors.text.main,
    },
    unit: {
      fontSize: 16,
      fontWeight: "normal",
      color: colors.text.secondary,
    },
    summaryRight: {
      alignItems: "flex-end",
      marginBottom: 6,
    },
    avgLabel: {
      fontSize: 12,
      color: colors.text.secondary,
    },
    avgValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary.main,
    },

    // Grafik
    chartContainer: {
      backgroundColor: colors.background.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 25,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      alignItems: "center",
    },
    chartHeader: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "flex-start",
      marginBottom: 15,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },
    legendText: {
      fontSize: 12,
      color: colors.text.secondary,
      fontWeight: "600",
    },

    // İstatistik Grid
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 15,
      marginLeft: 5,
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 25,
    },
    statCard: {
      width: (width - 40 - 20) / 3, // 3 Sütunlu
      backgroundColor: colors.background.card,
      borderRadius: 16,
      padding: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.neutral.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "light" ? 0.03 : 0,
      shadowRadius: 4,
      elevation: theme === "light" ? 2 : 0,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    statCardValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 4,
    },
    statCardLabel: {
      fontSize: 11,
      color: colors.text.secondary,
      textAlign: "center",
    },

    // Alt Bilgi
    infoBox: {
      flexDirection: "row",
      backgroundColor: colors.background.card,
      padding: 15,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    infoText: {
      flex: 1,
      marginLeft: 10,
      fontSize: 13,
      color: colors.text.secondary,
      lineHeight: 18,
    },
  });
