// components/ui/AuthInput.tsx

import React, { useState } from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // İkon kütüphanesi
import { colors } from "../../app/styles/theme/colors";

// Bu bileşenin alacağı özellikler (Props)
interface AuthInputProps extends TextInputProps {
  iconName: keyof typeof Ionicons.glyphMap; // İkon adı
}

const AuthInput: React.FC<AuthInputProps> = ({ iconName, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.focusedContainer, // Odaklanınca stil değişir
      ]}
    >
      <Ionicons
        name={iconName}
        size={22}
        color={isFocused ? colors.primary.main : colors.text.secondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.text.secondary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props} // Geri kalan tüm özellikleri (placeholder, secureTextEntry vb.) aktar
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral.input, // Tanımladığımız açık gri
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14, // Yüksekliği buradan ayarlıyoruz
    marginBottom: 16, // Altındaki elemanla boşluk
    borderWidth: 1,
    borderColor: "transparent", // Normalde kenarlık yok (veya şeffaf)
  },
  focusedContainer: {
    borderColor: colors.primary.main, // Tıklanınca Mavi oluyor
    backgroundColor: colors.neutral.white, // Tıklanınca içi beyazlaşsın (Resimdeki gibi)
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.main,
  },
});

export default AuthInput;
