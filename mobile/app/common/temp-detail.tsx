// app/common/temp-detail.tsx

import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function TempDetailScreen() {
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
          label: "",
        }));
        setChartData(formattedData);
        // currentValue yoksa son veriyi kullan
        if (!currentValue && formattedData.length > 0) {
          setLastValue(formattedData[formattedData.length - 1].value);
        }
      } catch (e) {
        console.error("Temp data parse error:", e);
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
      <CustomHeader title="Sıcaklık" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PeriodSelector />

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Ortalama Sıcaklık</Text>
          <Text style={styles.summaryValue}>
            {lastValue > 0 ? lastValue : 24}°C
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartData.length > 0 ? chartData : [{ value: 24 }]}
            color={"#FF9800"} // Turuncu
            thickness={3}
            curved
            startFillColor={"#FF9800"}
            endFillColor={"#FF9800"}
            startOpacity={0.2}
            endOpacity={0.0}
            areaChart
            hideDataPoints
            height={200}
            width={width - 60}
            initialSpacing={10}
            rulesColor={colors.neutral.border}
            yAxisTextStyle={{ color: colors.text.secondary }}
            xAxisThickness={0}
            yAxisThickness={0}
          />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statCardTitle}>Son Ölçüm</Text>
            <Text style={styles.statCardValue}>{lastValue}°C</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statCardTitle}>Konfor</Text>
            <Text
              style={[
                styles.statCardValue,
                {
                  color:
                    lastValue > 18 && lastValue < 28 ? "#4CAF50" : "#FF5252",
                },
              ]}
            >
              {lastValue > 18 && lastValue < 28 ? "İdeal" : "Riskli"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Stiller SpO2 ile aynı, sadece renkler farklı olabilir ama genel yapı aynı.
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
