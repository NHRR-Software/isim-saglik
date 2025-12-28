// app/auth/login.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AuthInput from "../../components/ui/AuthInput";
import { useTheme } from "../context/ThemeContext";

const { height } = Dimensions.get("window");
// const API_BASE_URL =
//   "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";

const API_BASE_URL = "http://10.0.2.2:5187";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurunuz.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. LOGIN İSTEĞİ
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.isSuccess && result.data) {
        const { accessToken, refreshToken } = result.data;

        // Tokenları Güvenli Sakla
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);

        // 2. USER INFO İSTEĞİ (SİMÜLASYON)
        // Gerçekte: fetch(`${API_BASE_URL}/api/user/me`, { headers: { Authorization: `Bearer ${accessToken}` } })

        // Şimdilik Simüle Ediyoruz:
        // SENARYO 1: İlk giriş (lastLoginDate null) -> Setup'a gitmeli
        // SENARYO 2: Normal giriş (lastLoginDate dolu) ve rol Company -> Founder'a gitmeli

        // Test için bu değişkeni değiştir:
        const mockUserData = {
          role: "company", // 'company', 'expert', 'worker'
          lastLoginDate: "2024-01-01T12:00:00Z", // Doluysa ana sayfaya, null ise setup'a
          // lastLoginDate: null,
        };

        console.log("User Info (Mock):", mockUserData);

        // 3. YÖNLENDİRME MANTIĞI
        if (!mockUserData.lastLoginDate) {
          // İlk kez giriş yapıyor, profil bilgilerini tamamlamalı
          router.replace("/setup/user-info");
        } else {
          // Daha önce giriş yapmış, direkt paneline gitsin
          switch (mockUserData.role) {
            case "company": // Founder / Şirket Sahibi
              router.replace("/(founder)");
              break;
            case "expert": // İSG Uzmanı
              router.replace("/(ohs)");
              break;
            case "worker": // İşçi
              router.replace("/(worker)");
              break;
            default:
              // Rol tanımsızsa yine de işçiye veya bir hata sayfasına atabiliriz
              Alert.alert("Hata", "Kullanıcı rolü tanımlanamadı.");
              break;
          }
        }
      } else {
        const errorMessage =
          result.error?.message || result.message || "Giriş başarısız.";
        Alert.alert("Hata", errorMessage);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterRoute = () => {
    router.push("/auth/register");
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: colors.background.default },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/onboarding/slide1.png")}
          style={styles.image}
        />

        <Text style={[styles.title, { color: colors.primary.main }]}>
          Giriş Yap
        </Text>

        <View style={styles.form}>
          <AuthInput
            iconName="mail-outline"
            placeholder="Email veya telefon numarası"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <AuthInput
            iconName="lock-closed-outline"
            placeholder="Şifre"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Şifremi Unuttum Linki */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
          >
            <Text
              style={[
                styles.forgotPasswordText,
                { color: colors.text.secondary },
              ]}
            >
              Şifremi Unuttum
            </Text>
          </TouchableOpacity>

          {/* Giriş Butonu */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary.main }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.primary.contrast} />
            ) : (
              <Text
                style={[styles.buttonText, { color: colors.primary.contrast }]}
              >
                Giriş Yap
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text.secondary }]}>
            Bir firmanız mı var?{" "}
          </Text>
          <TouchableOpacity onPress={handleRegisterRoute}>
            <Text style={[styles.linkText, { color: colors.primary.main }]}>
              Firma Hesabı Oluşturun
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: height * 0.4,
    resizeMode: "contain",
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: -5,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
  },
  linkText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
