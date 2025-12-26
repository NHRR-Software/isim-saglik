import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from "expo-router";

// Personel Verisi (Dummy Data)
// type: 'blue' | 'orange' | 'green' | 'purple' gibi renk kodları verebiliriz
const personnelData = [
  {
    id: "1",
    name: "Hamza Ali Doğan",
    role: "Mühendis – Üretim Geliştirme",
    type: "blue",
  },
  {
    id: "2",
    name: "Ayşe Çetinkaya",
    role: "Üretim Operatörü – Press Hattı",
    type: "orange",
  },
  {
    id: "3",
    name: "Ramazan Yiğit",
    role: "İSG Uzmanı – İş Güvenliği Ofisi",
    type: "blue",
  },
  {
    id: "4",
    name: "Bahar Çetinkaya",
    role: "İSG Uzmanı – İş Güvenliği Ofisi",
    type: "green",
  },
  {
    id: "5",
    name: "Zeynep Güler",
    role: "İnsan Kaynakları Uzmanı – İK Ofisi",
    type: "blue",
  },
  {
    id: "6",
    name: "Okan Erdem",
    role: "CNC Operatörü – CNC Atölyesi",
    type: "orange",
  },
  {
    id: "7",
    name: "Elif Arslan",
    role: "Kalite Kontrol Uzmanı – Labaratuvar",
    type: "blue",
  },
  {
    id: "8",
    name: "Cem Canpolat",
    role: "Mekanik Teknisyen – Bakım / Mekanik",
    type: "orange",
  },
  {
    id: "9",
    name: "Deniz Kaplan",
    role: "IT Destek – Bilgi Teknolojileri",
    type: "green",
  },
  {
    id: "10",
    name: "Burcu Kurt",
    role: "Üretim Destek – Montaj Hattı",
    type: "orange",
  },
  {
    id: "11",
    name: "Mehmet Karabıyık",
    role: "Elektrik Teknisyeni – Bakım ve Elektrik",
    type: "blue",
  },
];

export default function PersonnelListScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);
  const router = useRouter();

  // Renk belirleme fonksiyonu
  const getColorsByType = (type: string) => {
    switch (type) {
      case "blue":
        return {
          bg: theme === "dark" ? "#1A233A" : "#E7EFFF", // Dark: Koyu Mavi, Light: Açık Mavi
          icon: colors.primary.main, // Mavi
        };
      case "orange":
        return {
          bg: theme === "dark" ? "#33261A" : "#FFF4E6", // Dark: Koyu Turuncu, Light: Açık Turuncu
          icon: colors.secondary.main, // Turuncu
        };
      case "green":
        return {
          bg: theme === "dark" ? "#1A3320" : "#E8F5E9", // Dark: Koyu Yeşil, Light: Açık Yeşil
          icon: "#4CAF50", // Yeşil
        };
      default:
        return {
          bg: colors.background.card,
          icon: colors.text.main,
        };
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const itemColors = getColorsByType(item.type);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: itemColors.bg }]}
      >
        <View style={styles.cardLeft}>
          <View
            style={[styles.iconContainer, { backgroundColor: itemColors.icon }]}
          >
            <Ionicons name="person-outline" size={24} color="#FFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        </View>
        <Ionicons name="arrow-forward" size={20} color={itemColors.icon} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.main} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personel Listesi</Text>
        <View style={{ width: 24 }} /> {/* Başlığı ortalamak için boşluk */}
      </View>

      <FlatList
        data={personnelData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    backButton: {
      padding: 5,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text.main,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 100, // Bottom Bar için boşluk
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      // Hafif gölge (Light mode)
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme === "light" ? 0.05 : 0,
      shadowRadius: 2,
      elevation: theme === "light" ? 1 : 0,
    },
    cardLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    textContainer: {
      flex: 1,
      paddingRight: 10,
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 2,
    },
    role: {
      fontSize: 12,
      color: colors.text.secondary,
      fontWeight: "500",
    },
  });
