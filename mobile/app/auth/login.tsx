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

// API URL (Lokal veya Canlı)
const API_BASE_URL = "http://10.0.2.2:5187";
// const API_BASE_URL = "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";

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
      console.log(
        "1. Login İsteği Atılıyor:",
        `${API_BASE_URL}/api/auth/login`
      );

      // 1. LOGIN İSTEĞİ
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Cevabı önce text olarak alalım hata ayıklamak için
      const loginText = await loginResponse.text();
      console.log("Login Response Status:", loginResponse.status);
      console.log("Login Response Body:", loginText);

      if (!loginResponse.ok) {
        throw new Error(`Login Hatası: ${loginResponse.status} - ${loginText}`);
      }

      // Text'i JSON'a çeviriyoruz (Eğer boşsa burada patlamaz, kontrol etmiş oluruz)
      const loginResult = loginText ? JSON.parse(loginText) : {};

      if (loginResult.isSuccess && loginResult.data) {
        const { accessToken, refreshToken } = loginResult.data;

        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);

        console.log(
          "2. User Info İsteği Atılıyor:",
          `${API_BASE_URL}/api/users`
        );

        // 2. KULLANICI BİLGİLERİNİ ÇEKME
        const userResponse = await fetch(`${API_BASE_URL}/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userText = await userResponse.text();
        console.log("User Response Status:", userResponse.status);
        console.log("User Response Body:", userText);

        if (!userResponse.ok) {
          // Eğer 401 ise token geçersizdir, 404 ise endpoint yanlıştır.
          throw new Error(
            `User Info Hatası: ${userResponse.status} - ${userText}`
          );
        }

        const userResult = userText ? JSON.parse(userText) : {};

        if (userResult.isSuccess && userResult.data) {
          const userData = userResult.data;
          console.log("Yönlendirme Yapılıyor, Rol:", userData.role);

          if (!userData.isSetupCompleted) {
            router.replace("/setup/user-info");
            return;
          }

          switch (userData.role) {
            case 1:
              router.replace("/(founder)");
              break;
            case 2:
              router.replace("/(ohs)");
              break;
            case 3:
              router.replace("/(worker)");
              break;
            default:
              // Admin (0) veya diğerleri için varsayılan
              router.replace("/(worker)"); //şimdişil
              break;
          }
        } else {
          Alert.alert("Hata", "Kullanıcı bilgileri alınamadı.");
        }
      } else {
        const errorMessage =
          loginResult.error?.message ||
          loginResult.message ||
          "Giriş başarısız.";
        Alert.alert("Hata", errorMessage);
      }
    } catch (error: any) {
      console.error("Login Try-Catch Error:", error);
      Alert.alert("Bağlantı Hatası", error.message || "Bir hata oluştu.");
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
