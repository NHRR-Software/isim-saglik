import React from "react";
import { View, Text, StyleSheet } from "react-native";
export default function TipsScreen() {
  return (
    <View style={styles.container}>
      <Text>İpuçları Sayfası</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "F0F8FF",
  },
});
