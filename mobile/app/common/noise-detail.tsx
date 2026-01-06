// app/common/noise-detail.tsx

import React, { useMemo, useState, useEffect } from "react";
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
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function NoiseDetailScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);
  const { history, currentValue } = useLocalSearchParams();

  const [periodTab, setPeriodTab] = useState("Gün");
  const [chartData, setChartData] = useState<any[]>([]);
  const [lastValue, setLastValue] = useState(0);

  useEffect(() => {
    // currentValue parametresinden son değeri al
    if (currentValue) {
      setLastValue(Number(currentValue));
    }

    // history parametresinden grafik verisini al
    if (history) {
      try {
        const parsedData = JSON.parse(history as string);
        const formattedData = parsedData.map((item: any) => ({
          value: item.value,
          frontColor: "#9C27B0",
        }));
        setChartData(formattedData);
        // currentValue yoksa son veriyi kullan
        if (!currentValue && formattedData.length > 0) {
          setLastValue(formattedData[formattedData.length - 1].value);
        }
      } catch (e) {
        console.error("Noise data parse error:", e);
      }
    }
  }, [history, currentValue]);

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
      <CustomHeader title="Gürültü" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PeriodSelector />

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Ortalama Ses</Text>
          <Text style={styles.summaryValue}>
            {lastValue > 0 ? lastValue : 0} dB
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <BarChart
            data={
              chartData.length > 0
                ? chartData
                : [{ value: 0, frontColor: "#9C27B0" }]
            }
            barWidth={12}
            spacing={25}
            roundedTop
            hideRules={false}
            rulesColor={colors.neutral.border}
            xAxisThickness={0}
            yAxisThickness={0}
            yAxisTextStyle={{ color: colors.text.secondary }}
            noOfSections={4}
            maxValue={120} // dB genellikle 120 max olur
            height={200}
            width={width - 60}
            initialSpacing={20}
          />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statCardTitle}>Son Ölçüm</Text>
            <Text style={styles.statCardValue}>{lastValue} dB</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardTitle}>Risk</Text>
            <Text
              style={[
                styles.statCardValue,
                { color: lastValue > 85 ? "#FF5252" : "#4CAF50" },
              ]}
            >
              {lastValue > 85 ? "Yüksek" : "Düşük"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Stiller aynı, sadece kopyala yapıştır yapabilirsin
const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.default },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
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
    periodTextActive: { color: "#FFFFFF", fontWeight: "bold" },
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
    summaryValue: { fontSize: 32, fontWeight: "bold", color: colors.text.main },
    chartContainer: { marginBottom: 20, alignItems: "center" },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 15,
      marginTop: 20,
    },
    statCard: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 15,
      backgroundColor: colors.background.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.neutral.border,
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
