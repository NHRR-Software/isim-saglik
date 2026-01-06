// app/common/stress-detail.tsx

import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";
import { useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

// FALLBACK DUMMY DATA (Stres Çubukları)
const defaultStressData = [
  { value: 0, label: "00:00" },
  { value: 55, frontColor: "#00BFA5", label: "06:00" },
  { value: 0, label: "12:00" },
  { value: 50, frontColor: "#00BFA5", label: "18:00" },
  { value: 52, frontColor: "#00BFA5" },
  { value: 56, frontColor: "#00BFA5" },
  { value: 0, label: "00:00" },
];

// DUMMY DATA (Pie Chart)
const pieData = [
  { value: 5, color: "#FDD835", text: "%5" }, // Orta (Sarı)
  { value: 85, color: "#00BFA5", text: "%85" }, // Normal (Teal)
  { value: 10, color: "#448AFF", text: "%10" }, // Düşük (Mavi)
];

export default function StressDetailScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);
  const { history, currentValue } = useLocalSearchParams();

  const [periodTab, setPeriodTab] = useState("Gün");
  const [metricTab, setMetricTab] = useState("KAHD");

  // Chart Data State
  const [stressData, setStressData] = useState<any[]>(defaultStressData);
  const [lastValue, setLastValue] = useState(0);

  // Parse history data from params
  useEffect(() => {
    if (currentValue) {
      setLastValue(Number(currentValue));
    }

    if (history) {
      try {
        const parsedData = JSON.parse(history as string);
        if (parsedData && parsedData.length > 0) {
          const formattedData = parsedData.map((item: any, index: number) => ({
            value: item.value || 0,
            frontColor: item.frontColor || colors.secondary.main,
            label:
              index === 0
                ? "Eski"
                : index === parsedData.length - 1
                ? "Yeni"
                : "",
          }));
          setStressData(formattedData);
          if (!currentValue && formattedData.length > 0) {
            setLastValue(formattedData[formattedData.length - 1].value);
          }
        }
      } catch (e) {
        console.error("Stress data parse error:", e);
      }
    }
  }, [history, currentValue, colors]);

  // --- ÜST TAB ---
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

  // --- ORTA TAB (Kalp / KAHD) ---
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
      <CustomHeader title="Stres" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Tab Seçici */}
        <PeriodSelector />

        {/* 2. Özet Bilgi */}
        <View style={styles.summaryContainer}>
          <View>
            <Text style={styles.bigValue}>0-100</Text>
            <Text style={styles.label}>Aralık</Text>
          </View>
          <View>
            <Text style={styles.currentValue}>
              {lastValue || 0}{" "}
              <Text style={styles.unitSmall}>
                {lastValue > 70
                  ? "Yüksek"
                  : lastValue > 40
                  ? "Normal"
                  : "Düşük"}
              </Text>
            </Text>
            <Text style={styles.lastUpdate}>Son ölçüm</Text>
          </View>
        </View>

        {/* 3. GRAFİK (Bar Chart) */}
        <View style={styles.chartContainer}>
          <BarChart
            data={stressData}
            barWidth={6}
            spacing={40}
            roundedTop
            hideRules={false} // Izgara çizgileri olsun
            rulesColor={colors.neutral.border}
            yAxisTextStyle={{ color: colors.text.secondary }}
            xAxisLabelTextStyle={{ color: colors.text.secondary, fontSize: 10 }}
            noOfSections={4}
            maxValue={100}
            height={200}
            width={width - 60}
            initialSpacing={20}
            xAxisThickness={0}
            yAxisThickness={0}
          />
        </View>

        {/* 4. LEGEND */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FF5252" }]} />
            <Text style={styles.legendText}>Düşük</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#FFAB40" }]} />
            <Text style={styles.legendText}>Normal</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#00BFA5" }]} />
            <Text style={styles.legendText}>Orta</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
            <Text style={styles.legendText}>Yüksek</Text>
          </View>
        </View>

        {/* 5. METRİK SEÇİCİ */}
        <MetricSelector />

        {/* 6. ANALİZLER */}
        <Text style={styles.sectionTitle}>Analizler</Text>
        <View style={styles.analysisContainer}>
          {/* Sol Taraf: Metin */}
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.analysisBigValue}>
              42 <Text style={styles.analysisSmall}>Normal (Ort)</Text>
            </Text>
            <Text style={styles.analysisDesc}>
              <Text style={{ fontWeight: "bold" }}>07:30–08:00</Text> arasında
              daha fazla stres yaşadınız. Kısa süreli yoğun stres yaşamak
              normaldir. Ancak bu ...
            </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Ayrıntılı bilgi</Text>
            </TouchableOpacity>

            {/* Mini Legend */}
            <View style={{ marginTop: 15 }}>
              <View style={styles.miniLegendItem}>
                <View
                  style={[styles.miniDot, { backgroundColor: "#FDD835" }]}
                />
                <Text style={styles.miniText}>Orta (60–79)</Text>
                <Text style={styles.miniPercent}>%5</Text>
              </View>
              <View style={styles.miniLegendItem}>
                <View
                  style={[styles.miniDot, { backgroundColor: "#00BFA5" }]}
                />
                <Text style={styles.miniText}>Normal (30–59)</Text>
                <Text style={styles.miniPercent}>%85</Text>
              </View>
              <View style={styles.miniLegendItem}>
                <View
                  style={[styles.miniDot, { backgroundColor: "#448AFF" }]}
                />
                <Text style={styles.miniText}>Düşük (1–29)</Text>
                <Text style={styles.miniPercent}>%10</Text>
              </View>
            </View>
          </View>

          {/* Sağ Taraf: Pie Chart */}
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <PieChart
              data={pieData}
              donut
              radius={45}
              innerRadius={30}
              centerLabelComponent={() => (
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    color: colors.text.secondary,
                  }}
                >
                  seviyesi
                </Text>
              )}
            />
          </View>
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
      backgroundColor: colors.primary.main, // MAVİ
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
      marginBottom: 20,
    },
    bigValue: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text.main,
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
      fontSize: 14,
      fontWeight: "normal",
      color: colors.text.secondary,
    },
    lastUpdate: {
      fontSize: 12,
      color: colors.text.secondary,
      textAlign: "right",
    },

    // Grafik
    chartContainer: {
      marginBottom: 20,
      alignItems: "center",
    },

    // Legend
    legendContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 30,
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
      fontSize: 12,
      fontWeight: "600",
      color: colors.text.main,
    },

    // Metrik Seçici (Kalp / KAHD)
    metricSelectorContainer: {
      flexDirection: "row",
      backgroundColor: colors.background.card, // Arka plan
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
      backgroundColor: colors.secondary.main, // Turuncu
    },
    metricText: {
      fontSize: 14,
      color: colors.text.main,
      fontWeight: "600",
    },
    metricTextActive: {
      color: "#FFF",
    },

    // Analizler
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 15,
    },
    analysisContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    analysisBigValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 10,
    },
    analysisSmall: {
      fontSize: 14,
      fontWeight: "normal",
      color: colors.text.secondary,
    },
    analysisDesc: {
      fontSize: 13,
      color: colors.text.secondary,
      lineHeight: 20,
      marginBottom: 5,
    },
    linkText: {
      color: "#00BFA5", // Teal rengi
      fontWeight: "bold",
      fontSize: 13,
      textAlign: "right",
    },
    miniLegendItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
    },
    miniDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 8,
    },
    miniText: {
      fontSize: 11,
      color: colors.text.secondary,
      flex: 1,
    },
    miniPercent: {
      fontSize: 11,
      fontWeight: "bold",
      color: colors.text.main,
    },
  });
