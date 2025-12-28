import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

export default function FounderHomeScreen() {
  const { colors } = useTheme();
  return (
    <View>
      <Text>
        Firma Sahibi Paneli
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
