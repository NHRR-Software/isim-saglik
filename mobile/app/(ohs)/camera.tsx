// app/(ohs)/camera.tsx

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";

// API URL (Login'dekiyle aynı)
const API_BASE_URL = "http://10.0.2.2:5187";

// Backend Enum Karşılıkları
const SEVERITY_LEVELS = [
  { id: 0, label: "Düşük", color: "#4CAF50" },
  { id: 1, label: "Orta", color: "#FF9800" },
  { id: 2, label: "Yüksek", color: "#F44336" },
  { id: 3, label: "Kritik", color: "#B71C1C" },
];

// Backend FindingType Enum (0-5)
const FINDING_TYPES = [
  { id: 0, label: "Davranışsal", icon: "person-alert" },
  { id: 1, label: "Teknik", icon: "settings" },
  { id: 2, label: "Acil Durum", icon: "medical-bag" },
  { id: 3, label: "Hijyen/Sağlık", icon: "water" },
  { id: 4, label: "Çevresel", icon: "leaf" },
  { id: 5, label: "Dökümantasyon", icon: "file-document" },
];

export default function CameraScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);
  const router = useRouter();

  // Form State'leri
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState(0);
  const [findingType, setFindingType] = useState(0);

  // Resim State'leri
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  // User Search State'leri
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [reportedUser, setReportedUser] = useState<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. FOTOĞRAF İŞLEMLERİ (Optimize Edildi) ---
  const handlePickImage = async () => {
    Alert.alert("Fotoğraf Ekle", "Lütfen bir kaynak seçin", [
      {
        text: "Kamera",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted")
            return Alert.alert("İzin Gerekli", "Kamera izni verilmedi.");

          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.3, // Kaliteyi düşürdük (Backend limiti için)
            base64: true, // Backend base64 string istiyor
          });
          if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setBase64Image(result.assets[0].base64 || null);
          }
        },
      },
      {
        text: "Galeri",
        onPress: async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted")
            return Alert.alert("İzin Gerekli", "Galeri izni verilmedi.");

          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.3,
            base64: true,
          });
          if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setBase64Image(result.assets[0].base64 || null);
          }
        },
      },
      { text: "İptal", style: "cancel" },
    ]);
  };

  // --- 2. KULLANICI ARAMA ---
  const handleUserSearch = async () => {
    if (!searchEmail) return;
    setIsSearching(true);

    try {
      const token = await SecureStore.getItemAsync("accessToken");
      // GET /api/users/search?email=...
      const response = await fetch(
        `${API_BASE_URL}/api/users/search?email=${searchEmail}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (result.isSuccess && result.data) {
        setReportedUser(result.data);
      } else {
        Alert.alert("Bulunamadı", "Bu e-posta ile kayıtlı çalışan bulunamadı.");
        setReportedUser(null);
      }
    } catch (error) {
      console.error("Search Error:", error);
      Alert.alert("Hata", "Arama yapılamadı.");
    } finally {
      setIsSearching(false);
    }
  };

  // --- 3. RAPOR GÖNDERME (POST) ---
  const handleSubmit = async () => {
    // Validasyonlar
    if (!title || !description) {
      Alert.alert(
        "Eksik Bilgi",
        "Lütfen başlık ve açıklama alanlarını doldurunuz."
      );
      return;
    }

    if (!base64Image) {
      Alert.alert("Eksik Bilgi", "Lütfen bir fotoğraf ekleyiniz.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await SecureStore.getItemAsync("accessToken");

      // Payload Hazırlığı
      const payload: any = {
        title: title,
        description: description,
        severity: severity, // 0, 1, 2, 3
        type: findingType, // 0, 1, 2, 3, 4, 5
        status: 1, // 1: Open (Backend enum'ına göre)
        base64Image: base64Image, // ImagePicker'dan gelen string
        reportedId: reportedUser ? reportedUser.id : null, // Eğer seçili user varsa ID, yoksa null
      };

      // Debug Log (Resim hariç)
      const logPayload = { ...payload, base64Image: "HIDDEN_BASE64_STRING" };
      console.log("Sending Report Payload:", logPayload);

      // API İsteği
      // URL: /api/safety-findings (Çoğul - Dokümana göre)
      const response = await fetch(`${API_BASE_URL}/api/safety-findings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Yanıt İşleme
      const responseText = await response.text();
      console.log("Server Status:", response.status);

      if (!response.ok) {
        console.log("Server Error Body:", responseText);
        // Hata mesajını ayrıştır
        let errorMessage = `Sunucu Hatası: ${response.status}`;
        try {
          const errJson = JSON.parse(responseText);
          if (errJson.message) errorMessage = errJson.message;
          if (errJson.error?.message) errorMessage = errJson.error.message;
        } catch (e) {}

        throw new Error(errorMessage);
      }

      const result = JSON.parse(responseText);

      if (result.isSuccess) {
        Alert.alert("Başarılı", "İSG bulgusu başarıyla raporlandı.", [
          { text: "Tamam", onPress: () => router.back() },
        ]);
      } else {
        const errorMsg =
          result.error?.message || result.message || "Rapor gönderilemedi.";
        Alert.alert("Hata", errorMsg);
      }
    } catch (error: any) {
      console.error("Safety Finding Submit Error:", error);
      Alert.alert("Hata", error.message || "Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Bulgu Raporla" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- FOTOĞRAF ALANI --- */}
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handlePickImage}
          >
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
                <View style={styles.editImageBadge}>
                  <Ionicons name="camera-reverse" size={20} color="#FFF" />
                </View>
              </>
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons
                  name="camera"
                  size={40}
                  color={colors.text.secondary}
                />
                <Text style={styles.placeholderText}>Fotoğraf Çek / Yükle</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* --- BAŞLIK & AÇIKLAMA --- */}
          <View style={styles.formSection}>
            <Text style={styles.label}>Bulgu Başlığı</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Kablo Açıkta"
              placeholderTextColor={colors.text.secondary}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detaylı açıklama giriniz..."
              placeholderTextColor={colors.text.secondary}
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* --- RAPORLANAN KİŞİ (SEARCH) --- */}
          <View style={styles.formSection}>
            <Text style={styles.label}>
              İlgili Kişi / Raporlanan (Opsiyonel)
            </Text>

            {!reportedUser ? (
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="E-posta ile ara..."
                  placeholderTextColor={colors.text.secondary}
                  value={searchEmail}
                  onChangeText={setSearchEmail}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={handleUserSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Ionicons name="search" size={20} color="#FFF" />
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              // Seçilen Kullanıcı Kartı
              <View style={styles.userCard}>
                <View style={styles.userInfo}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                      {reportedUser.fullName
                        ? reportedUser.fullName.charAt(0)
                        : "?"}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{reportedUser.fullName}</Text>
                    <Text style={styles.userEmail}>{reportedUser.email}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setReportedUser(null);
                    setSearchEmail("");
                  }}
                >
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={colors.dashboard.red}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* --- TÜR (TYPE) SEÇİMİ --- */}
          <View style={styles.formSection}>
            <Text style={styles.label}>Bulgu Türü</Text>
            <View style={styles.gridSelector}>
              {FINDING_TYPES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.typeCard,
                    findingType === item.id && {
                      backgroundColor: colors.primary.light,
                      borderColor: colors.primary.main,
                    },
                  ]}
                  onPress={() => setFindingType(item.id)}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color={
                      findingType === item.id
                        ? colors.primary.main
                        : colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.typeText,
                      findingType === item.id && {
                        color: colors.primary.main,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* --- CİDDİYET (SEVERITY) SEÇİMİ --- */}
          <View style={styles.formSection}>
            <Text style={styles.label}>Risk Seviyesi</Text>
            <View style={styles.severityContainer}>
              {SEVERITY_LEVELS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.severityButton,
                    { borderColor: item.color },
                    severity === item.id && { backgroundColor: item.color },
                  ]}
                  onPress={() => setSeverity(item.id)}
                >
                  <Text
                    style={[
                      styles.severityText,
                      { color: severity === item.id ? "#FFF" : item.color },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* --- GÖNDER BUTONU --- */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons
                  name="send"
                  size={20}
                  color="#FFF"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.submitButtonText}>Raporu Oluştur</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    scrollContent: {
      padding: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 8,
      marginTop: 10,
    },
    formSection: {
      marginBottom: 15,
    },

    // FOTOĞRAF
    imageContainer: {
      width: "100%",
      height: 200,
      backgroundColor: colors.neutral.input,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.neutral.border,
      borderStyle: "dashed",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      overflow: "hidden",
    },
    placeholderContainer: {
      alignItems: "center",
    },
    placeholderText: {
      marginTop: 10,
      color: colors.text.secondary,
      fontWeight: "500",
    },
    previewImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    editImageBadge: {
      position: "absolute",
      bottom: 10,
      right: 10,
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: 8,
      borderRadius: 20,
    },

    // INPUT
    input: {
      backgroundColor: colors.background.card,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      color: colors.text.main,
      fontSize: 15,
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
    },

    // USER SEARCH
    searchContainer: {
      flexDirection: "row",
      gap: 10,
    },
    searchInput: {
      flex: 1,
      backgroundColor: colors.background.card,
      borderRadius: 12,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      color: colors.text.main,
      height: 50,
    },
    searchButton: {
      width: 50,
      height: 50,
      backgroundColor: colors.primary.main,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    userCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.primary.light,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary.main,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatarPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary.main,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    avatarText: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 18,
    },
    userName: {
      fontWeight: "bold",
      color: colors.text.main,
    },
    userEmail: {
      fontSize: 12,
      color: colors.text.secondary,
    },

    // GRID SELECTOR (Type)
    gridSelector: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    typeCard: {
      width: "48%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background.card,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      gap: 8,
    },
    typeText: {
      fontSize: 13,
      color: colors.text.secondary,
      flex: 1,
    },

    // SEVERITY SELECTOR
    severityContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
    },
    severityButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    severityText: {
      fontSize: 12,
      fontWeight: "bold",
    },

    // SUBMIT BUTTON
    submitButton: {
      backgroundColor: colors.dashboard.red,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 16,
      borderRadius: 16,
      marginTop: 20,
      shadowColor: colors.dashboard.red,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    submitButtonText: {
      color: "#FFF",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
