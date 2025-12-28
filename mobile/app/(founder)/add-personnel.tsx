// app/(founder)/add-personnel.tsx

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store"; // Token için
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../app/context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";
import AuthInput from "../../components/ui/AuthInput";

// API URL (Login sayfasında kullandığınla aynı olmalı)
// const API_BASE_URL = "http://192.168.1.35:5187";
// const API_BASE_URL = "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";
const API_BASE_URL = "http://10.0.2.2:5187";

// Roller (API Dokümantasyonuna göre)
// 0: Admin, 1: Company (Kendisi), 2: Expert (İSG Uzmanı), 3: Worker (İşçi)
const ROLES = [
  { id: 3, label: "Çalışan (Worker)", icon: "person" },
  { id: 2, label: "İSG Uzmanı (Expert)", icon: "medkit" },
  { id: 0, label: "Yönetici (Admin)", icon: "shield-checkmark" },
];

export default function AddPersonnelScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState(3); // Varsayılan: Çalışan
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    // 1. Validasyon
    if (!email) {
      Alert.alert(
        "Eksik Bilgi",
        "Lütfen davet edilecek kişinin e-posta adresini giriniz."
      );
      return;
    }

    setIsLoading(true);

    try {
      // 2. Token'ı Al
      const token = await SecureStore.getItemAsync("accessToken");

      if (!token) {
        Alert.alert(
          "Oturum Hatası",
          "Oturum süreniz dolmuş, lütfen tekrar giriş yapın."
        );
        router.replace("/auth/login");
        return;
      }

      // 3. API İsteği
      const response = await fetch(`${API_BASE_URL}/api/company/invite-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Bearer Token Eklendi
        },
        body: JSON.stringify({
          email: email,
          role: selectedRole,
        }),
      });

      const result = await response.json();

      // 4. Sonuç Yönetimi
      if (result.isSuccess) {
        Alert.alert("Başarılı", `${email} adresine davet gönderildi.`, [
          {
            text: "Tamam",
            onPress: () => {
              setEmail(""); // Formu temizle
              setSelectedRole(3); // Rolü sıfırla
              router.back(); // Geri dön (veya kalabilirsin)
            },
          },
        ]);
      } else {
        const errorMsg =
          result.error?.message || result.message || "Davet gönderilemedi.";
        Alert.alert("Hata", errorMsg);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Bağlantı Hatası", "Sunucuya erişilemiyor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Personel Davet Et" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Bilgilendirme Kartı */}
          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle"
              size={24}
              color={colors.primary.main}
            />
            <Text style={styles.infoText}>
              Davet ettiğiniz kullanıcıya bir e-posta gönderilecektir.
              Kullanıcı, e-postadaki linke tıklayarak şifresini belirleyip
              sisteme kayıt olabilir.
            </Text>
          </View>

          {/* Form Alanı */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>E-Posta Adresi</Text>
            <AuthInput
              iconName="mail-outline"
              placeholder="ornek@sirket.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.sectionTitle}>Rol Seçimi</Text>
            <View style={styles.rolesContainer}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleCard,
                    selectedRole === role.id && styles.roleCardActive,
                  ]}
                  onPress={() => setSelectedRole(role.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      selectedRole === role.id && {
                        backgroundColor: colors.primary.main,
                      },
                    ]}
                  >
                    <Ionicons
                      name={role.icon as any}
                      size={24}
                      color={
                        selectedRole === role.id
                          ? "#FFF"
                          : colors.text.secondary
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.roleText,
                      selectedRole === role.id && {
                        color: colors.primary.main,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {role.label}
                  </Text>

                  {/* Seçili İkonu */}
                  <View style={styles.radioOuter}>
                    {selectedRole === role.id && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Gönder Butonu */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleInvite}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons
                    name="paper-plane-outline"
                    size={20}
                    color="#FFF"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.submitButtonText}>Davet Gönder</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// STİLLER
const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 100, // Bottom Tab Bar payı
    },

    // Bilgi Kartı
    infoCard: {
      flexDirection: "row",
      backgroundColor:
        theme === "light" ? colors.primary.light : "rgba(72, 112, 255, 0.1)",
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.primary.main + "40", // %25 opacity
    },
    infoText: {
      flex: 1,
      marginLeft: 12,
      fontSize: 13,
      color: colors.text.main,
      lineHeight: 18,
    },

    formContainer: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 12,
      marginTop: 8,
    },

    // Rol Kartları
    rolesContainer: {
      marginBottom: 30,
      gap: 12,
    },
    roleCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background.card,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "light" ? 0.03 : 0,
      shadowRadius: 4,
      elevation: theme === "light" ? 2 : 0,
    },
    roleCardActive: {
      borderColor: colors.primary.main,
      backgroundColor: theme === "light" ? "#FBFDFF" : colors.background.card,
    },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.neutral.input,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    roleText: {
      fontSize: 15,
      color: colors.text.main,
      flex: 1,
    },

    // Radio Button Görünümü
    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.text.secondary,
      justifyContent: "center",
      alignItems: "center",
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary.main,
    },

    // Buton
    submitButton: {
      flexDirection: "row",
      backgroundColor: colors.dashboard.red, // Dikkat çeksin diye kırmızı yaptım (Founder rengi)
      paddingVertical: 16,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.dashboard.red,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    submitButtonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
