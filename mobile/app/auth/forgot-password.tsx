// app/auth/forgot-password.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AuthInput from "../../components/ui/AuthInput";
import CustomHeader from "../../components/ui/CustomHeader"; // Custom Header'ı kullanıyoruz
import { useTheme } from "../context/ThemeContext";

// const API_BASE_URL =
//   "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";

const API_BASE_URL = "http://10.0.2.2:5187";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResetLink = async () => {
    if (!email) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi giriniz.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.isSuccess) {
        Alert.alert(
          "Başarılı",
          "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
          [{ text: "Tamam", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("Hata", result.message || "Bir hata oluştu.");
      }
    } catch (error) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.default }]}
    >
      <CustomHeader title="Şifremi Unuttum" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.description, { color: colors.text.secondary }]}>
          Lütfen hesabınıza kayıtlı e-posta adresinizi girin. Size şifre
          sıfırlama talimatlarını içeren bir e-posta göndereceğiz.
        </Text>

        <View style={styles.form}>
          <AuthInput
            iconName="mail-outline"
            placeholder="E-posta Adresi"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary.main }]}
            onPress={handleSendResetLink}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.primary.contrast} />
            ) : (
              <Text
                style={[styles.buttonText, { color: colors.primary.contrast }]}
              >
                Gönder
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
