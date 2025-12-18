// app/auth/login.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions, // Ekran boyutunu almak için ekledik
} from "react-native";
import { useRouter } from "expo-router";
import AuthInput from "../../components/ui/AuthInput";
import { colors } from "../../app/styles/theme/colors";

const { height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    // Giriş başarılı, profil oluşturma sayfasına git
    router.replace("/setup/user-info");
  };

  const handleRegisterRoute = () => {
    router.push("/auth/register");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Üst Kısım: Resim - BÜYÜTÜLDÜ */}
        <Image
          source={require("../../assets/images/onboarding/slide1.png")}
          style={styles.image}
        />

        {/* Başlık */}
        <Text style={styles.title}>Giriş Yap</Text>

        {/* Form Alanları */}
        <View style={styles.form}>
          <AuthInput
            iconName="mail-outline"
            placeholder="Email veya telefon numarası"
            keyboardType="email-address"
          />

          <AuthInput
            iconName="lock-closed-outline"
            placeholder="Şifre"
            secureTextEntry
          />

          {/* Giriş Butonu */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>

        {/* Alt Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Bir firmanız mı var? </Text>
          <TouchableOpacity onPress={handleRegisterRoute}>
            <Text style={styles.linkText}>Firma Hesabı Oluşturun</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background.default,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    // YENİ: Ekran yüksekliğinin %40'ı kadar yer kaplasın (Baya büyük)
    height: height * 0.4,
    resizeMode: "contain",
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary.main,
    marginBottom: 30,
  },
  form: {
    width: "100%",
  },
  button: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
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
    color: colors.text.secondary,
    fontSize: 16,
  },
  linkText: {
    color: colors.primary.main,
    fontWeight: "bold",
    fontSize: 16,
  },
});
