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
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";

// API URL
const API_BASE_URL = "http://10.0.2.2:5187";

// Backend Enum Karşılıkları (Tahmini)
const SEVERITY_LEVELS = [
  { id: 0, label: "Düşük", color: "#4CAF50" },
  { id: 1, label: "Orta", color: "#FF9800" },
  { id: 2, label: "Yüksek", color: "#F44336" },
  { id: 3, label: "Kritik", color: "#B71C1C" },
];

const FINDING_TYPES = [
  { id: 0, label: "Güvensiz Davranış", icon: "person-alert" },
  { id: 1, label: "Güvensiz Durum", icon: "alert-box" },
  { id: 2, label: "Ramak Kala", icon: "lightning-bolt" },
  { id: 3, label: "Çevresel", icon: "leaf" },
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
  const [imageUri, setImageUri] = useState<string | null>(null);

  // User Search State'leri
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [reportedUser, setReportedUser] = useState<any>(null); // Bulunan kullanıcı

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. FOTOĞRAF İŞLEMLERİ ---
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
            quality: 0.7,
          });
          if (!result.canceled) setImageUri(result.assets[0].uri);
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
            quality: 0.7,
          });
          if (!result.canceled) setImageUri(result.assets[0].uri);
        },
      },
      { text: "İptal", style: "cancel" },
    ]);
  };

  // --- 2. KULLANICI ARAMA (SİMÜLASYON) ---
  const handleUserSearch = async () => {
    if (!searchEmail) return;
    setIsSearching(true);

    try {
      // --- GERÇEK ENDPOINT GELDİĞİNDE AÇILACAK KISIM ---
      /*
        const token = await SecureStore.getItemAsync("accessToken");
        const response = await fetch(`${API_BASE_URL}/api/users/search?email=${searchEmail}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = await response.json();
        if(result.isSuccess) setReportedUser(result.data);
        */

      // --- MOCK DATA (SİMÜLASYON) ---
      // Backend hazır olana kadar bunu kullanıyoruz
      setTimeout(() => {
        if (searchEmail.toLowerCase().includes("ali")) {
          setReportedUser({
            id: "mock-user-id-123",
            fullName: "Ali Veli",
            email: searchEmail,
            jobTitle: "CNC Operatörü",
            photoUrl: null, // Varsa URL
          });
        } else {
          Alert.alert(
            "Bulunamadı",
            "Bu e-posta ile kayıtlı çalışan bulunamadı."
          );
          setReportedUser(null);
        }
        setIsSearching(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsSearching(false);
    }
  };

  // --- 3. RAPOR GÖNDERME (POST) ---
  const handleSubmit = async () => {
    if (!title || !description || !imageUri) {
      Alert.alert(
        "Eksik Bilgi",
        "Lütfen başlık, açıklama ve fotoğraf alanlarını doldurunuz."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await SecureStore.getItemAsync("accessToken");

      // Fotoğraf olduğu için FormData kullanıyoruz
      const formData = new FormData();

      // React Native'de FormData'ya dosya ekleme yöntemi:
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("Photo", { uri: imageUri, name: filename, type } as any);
      formData.append("Title", title);
      formData.append("Description", description);
      formData.append("Severity", severity.toString());
      formData.append("Type", findingType.toString());
      formData.append("Status", "0"); // 0: Open / New

      // Eğer kullanıcı seçildiyse ID'sini ekle
      if (reportedUser) {
        formData.append("ReportedId", reportedUser.id);
      }

      // --- GERÇEK İSTEK (Simüle Ediliyor) ---
      console.log("SENDING REPORT:", formData);

      // const response = await fetch(`${API_BASE_URL}/api/safety-findings`, {
      //     method: "POST",
      //     headers: {
      //         "Content-Type": "multipart/form-data",
      //         "Authorization": `Bearer ${token}`
      //     },
      //     body: formData
      // });

      // Simülasyon Başarılı
      setTimeout(() => {
        Alert.alert("Başarılı", "İSG bulgusu başarıyla raporlandı.", [
          { text: "Tamam", onPress: () => router.back() },
        ]);
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Rapor gönderilemedi.");
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
                      {reportedUser.fullName.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{reportedUser.fullName}</Text>
                    <Text style={styles.userEmail}>
                      {reportedUser.jobTitle}
                    </Text>
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
