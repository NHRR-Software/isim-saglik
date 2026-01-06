// app/common/health-profile.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../../app/context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";

// API URL
const API_BASE_URL = "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";


const BLOOD_TYPES = [
  "A Rh+",
  "A Rh-",
  "B Rh+",
  "B Rh-",
  "AB Rh+",
  "AB Rh-",
  "0 Rh+",
  "0 Rh-",
];

export default function HealthProfileScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  // State'ler
  const [bloodGroup, setBloodGroup] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [hasDisease, setHasDisease] = useState<boolean | null>(null);
  const [diseaseDescription, setDiseaseDescription] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Sayfa açılışında loading
  const [isSaving, setIsSaving] = useState(false); // Kayıt sırasında loading

  // 1. Verileri Çek (GET) - Sayfa yüklendiğinde çalışır
  useEffect(() => {
    const fetchHealthProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (!token) {
          Alert.alert("Oturum Hatası", "Lütfen tekrar giriş yapınız.");
          // router.replace("/auth/login"); // Login'e yönlendirebilirsin
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/health-profiles`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (result.isSuccess && result.data) {
          const data = result.data;
          // Gelen verileri state'lere doldur
          setBloodGroup(data.bloodGroup || "");
          setHeight(data.height?.toString() || ""); // float'tan string'e
          setWeight(data.weight?.toString() || ""); // float'tan string'e

          // Kronik hastalık durumu
          if (
            data.chronicDisease &&
            data.chronicDisease !== "Yok" &&
            data.chronicDisease !== ""
          ) {
            setHasDisease(true);
            setDiseaseDescription(data.chronicDisease);
          } else {
            setHasDisease(false);
            setDiseaseDescription("");
          }
        } else {
          // Eğer profil yoksa (yani GET isteği başarısız olursa)
          // Kullanıcıya bilgi verip form boş kalsın ya da varsayılan değerler girilebilir.
          console.warn(
            "Sağlık profili bulunamadı veya boş döndü. Yeni oluşturulacak."
          );
          // Alert.alert("Bilgi", "Mevcut sağlık profili bulunamadı, lütfen bilgilerinizi giriniz.");
          setHasDisease(false); // Varsayılan olarak hastalık yok
        }
      } catch (error) {
        console.error("Health Profile Fetch Error:", error);
        Alert.alert(
          "Hata",
          "Sağlık bilgileriniz yüklenirken bir sorun oluştu."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthProfile();
  }, []);

  // 2. Verileri Güncelle (PUT)
  const handleUpdate = async () => {
    // Validasyonlar
    if (!bloodGroup || !height || !weight) {
      Alert.alert(
        "Eksik Bilgi",
        "Lütfen kan grubu, boy ve kilo bilgilerini giriniz."
      );
      return;
    }
    if (hasDisease && !diseaseDescription) {
      Alert.alert("Eksik Bilgi", "Lütfen hastalığınızı açıklayınız.");
      return;
    }

    setIsSaving(true);

    try {
      const token = await SecureStore.getItemAsync("accessToken");

      const payload = {
        bloodGroup: bloodGroup,
        weight: parseFloat(weight),
        height: parseFloat(height),
        chronicDisease: hasDisease ? diseaseDescription : "Yok", // 'Yok' stringi gönderiyoruz
      };

      const response = await fetch(`${API_BASE_URL}/api/health-profiles`, {
        method: "PUT", // UPDATE için PUT
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.isSuccess) {
        Alert.alert("Başarılı", "Sağlık bilgileriniz güncellendi.");
      } else {
        Alert.alert("Hata", result.message || "Güncelleme başarısız.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Yardımcı Bileşenler ---
  const LabelInput = ({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    multiline = false,
  }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );

  const RadioOption = ({ label, selected, onSelect }: any) => (
    <TouchableOpacity
      style={styles.radioContainer}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      <View
        style={[styles.radioCircle, selected && styles.radioCircleSelected]}
      >
        {selected && <View style={styles.radioInnerCircle} />}
      </View>
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.mainContainer,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* CustomHeader artık safe area'yı kendisi ayarlıyor */}
      <CustomHeader title="Sağlık Bilgilerim" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- KAN GRUBU --- */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kan Grubu</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setIsDropdownOpen(true)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !bloodGroup && { color: colors.text.secondary },
                ]}
              >
                {bloodGroup || "Seçiniz"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          {/* --- BOY & KİLO --- */}
          <LabelInput
            label="Boy (cm)"
            placeholder="Örn: 175"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />

          <LabelInput
            label="Kilo (kg)"
            placeholder="Örn: 70"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          {/* --- HASTALIK SORUSU --- */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bir Hastalığınız Var mı?</Text>
            <View style={styles.radioGroup}>
              <RadioOption
                label="Evet"
                selected={hasDisease === true}
                onSelect={() => setHasDisease(true)}
              />
              <RadioOption
                label="Hayır"
                selected={hasDisease === false}
                onSelect={() => {
                  setHasDisease(false);
                  setDiseaseDescription("");
                }}
              />
            </View>
          </View>

          {/* --- AÇIKLAMA ALANI --- */}
          {hasDisease === true && (
            <View style={styles.fadeContainer}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Hastalık detaylarını buraya giriniz..."
                placeholderTextColor={colors.text.secondary}
                value={diseaseDescription}
                onChangeText={setDiseaseDescription}
                multiline
              />
            </View>
          )}

          {/* --- GÜNCELLE BUTONU --- */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdate}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.primary.contrast} />
            ) : (
              <Text style={styles.buttonText}>Bilgileri Güncelle</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- DROPDOWN MODAL --- */}
      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kan Grubu Seç</Text>
            <FlatList
              data={BLOOD_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setBloodGroup(item);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      bloodGroup === item && {
                        color: colors.primary.main,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {bloodGroup === item && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary.main}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: colors.background.default },
    scrollContent: { padding: 24, paddingBottom: 40 },

    inputGroup: { marginBottom: 20 },
    label: {
      fontSize: 16,
      color: colors.text.secondary,
      fontWeight: "600",
      marginBottom: 12,
      marginLeft: 4,
    },
    input: {
      backgroundColor: colors.neutral.input,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text.main,
      borderWidth: 1,
      borderColor: theme === "dark" ? colors.neutral.border : "transparent",
    },
    textArea: { height: 120, textAlignVertical: "top", paddingTop: 14 },
    dropdownButton: {
      backgroundColor: colors.neutral.input,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme === "dark" ? colors.neutral.border : "transparent",
    },
    dropdownText: { fontSize: 16, color: colors.text.main },
    radioGroup: { flexDirection: "row", gap: 20 },
    radioContainer: { flexDirection: "row", alignItems: "center" },
    radioCircle: {
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.text.secondary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    radioCircleSelected: { borderColor: colors.primary.main },
    radioInnerCircle: {
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: colors.primary.main,
    },
    radioText: { fontSize: 16, color: colors.text.main },
    fadeContainer: { marginTop: 10 },
    button: {
      backgroundColor: colors.primary.main,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 30,
      shadowColor: colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    buttonText: {
      color: colors.primary.contrast,
      fontSize: 18,
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "80%",
      maxHeight: "50%",
      backgroundColor: colors.background.card,
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderWidth: 1,
      borderColor: colors.neutral.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
      color: colors.primary.main,
      textAlign: "center",
    },
    modalItem: {
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral.border,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalItemText: { fontSize: 16, color: colors.text.main },
  });
