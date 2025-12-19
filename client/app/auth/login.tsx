// app/auth/login.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import AuthInput from "../../components/ui/AuthInput";
import { useTheme } from "../../app/context/ThemeContext"; // Hook

const { height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme(); // Renkler

  const handleLogin = () => {
    router.replace("/setup/user-info");
  };

  const handleRegisterRoute = () => {
    router.push("/auth/register");
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
          />

          <AuthInput
            iconName="lock-closed-outline"
            placeholder="Şifre"
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary.main }]}
            onPress={handleLogin}
          >
            <Text
              style={[styles.buttonText, { color: colors.primary.contrast }]}
            >
              Giriş Yap
            </Text>
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
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
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
