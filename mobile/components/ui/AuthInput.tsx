// components/ui/AuthInput.tsx

import React, { useState } from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../app/context/ThemeContext"; // YENİ

interface AuthInputProps extends TextInputProps {
  iconName: keyof typeof Ionicons.glyphMap;
}

const AuthInput: React.FC<AuthInputProps> = ({ iconName, ...props }) => {
  const { colors } = useTheme(); // Renkleri buradan alıyoruz
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.neutral.input, // Dinamik arka plan
          borderColor: isFocused ? colors.primary.main : "transparent",
        },
      ]}
    >
      <Ionicons
        name={iconName}
        size={22}
        color={isFocused ? colors.primary.main : colors.text.secondary}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: colors.text.main }]} // Dinamik yazı rengi
        placeholderTextColor={colors.text.secondary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

export default AuthInput;
