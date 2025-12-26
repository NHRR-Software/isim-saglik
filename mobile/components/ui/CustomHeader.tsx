// components/ui/CustomHeader.tsx

import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../app/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // YENİ

interface CustomHeaderProps {
  title: string;
  onBackPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, onBackPress }) => {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets(); // Cihazın güvenli alanlarını alıyoruz

  const styles = useMemo(
    () => createStyles(colors, theme, insets),
    [colors, theme, insets]
  );

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Sol: Geri Butonu */}
      <TouchableOpacity onPress={handleBack} style={styles.buttonContainer}>
        <Ionicons name="arrow-back" size={24} color={colors.text.main} />
      </TouchableOpacity>

      {/* Orta: Başlık */}
      <Text style={styles.title}>{title}</Text>

      {/* Sağ: Boşluk */}
      <View style={styles.buttonContainer} />
    </View>
  );
};

const createStyles = (colors: any, theme: string, insets: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 20,
      // YENİ: Üstten cihazın çentiği kadar + 10px boşluk bırak
      paddingTop: insets.top + 10,
      backgroundColor: colors.background.default,
      // Header'ın sayfadan ayrılması için hafif border veya shadow eklenebilir (isteğe bağlı)
      // borderBottomWidth: 1,
      // borderBottomColor: colors.neutral.border,
    },
    buttonContainer: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "flex-start",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text.main,
      textAlign: "center",
      flex: 1,
    },
  });

export default CustomHeader;
