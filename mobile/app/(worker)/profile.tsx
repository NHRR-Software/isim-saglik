// app/(worker)/profile.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  StatusBar,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext"; 
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");
const CARD_GAP = 16;
const CARD_WIDTH = (width - 48 - CARD_GAP) / 2;

// API URL
const API_BASE_URL = "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, theme, setTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  // Modallar
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);

  // Loading Durumları
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  // Kullanıcı Bilgileri
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    jobTitle: "",
    photoUrl: null,
    role: 3, // Worker
    gender: 0,
    birthDate: "",
  });

  // Form State'i (Düzenleme için)
  const [editForm, setEditForm] = useState({
    fullName: "",
    phoneNumber: "",
    jobTitle: "",
    gender: 0,
  });

  // --- KULLANICI BİLGİLERİNİ ÇEK ---
  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (result.isSuccess && result.data) {
        setUserInfo(result.data);
        // Edit formunu da doldur
        setEditForm({
          fullName: result.data.fullName || "",
          phoneNumber: result.data.phoneNumber || "",
          jobTitle: result.data.jobTitle || "",
          gender: result.data.gender || 0,
        });
      }
    } catch (error) {
      console.error("Fetch User Error:", error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // --- PROFİL GÜNCELLEME (DÜZELTİLDİ) ---
  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const payload = {
        name: editForm.fullName,
        phoneNumber: editForm.phoneNumber,
        jobTitle: editForm.jobTitle,
        gender: editForm.gender,
        role: userInfo.role,
        birthDate: userInfo.birthDate || new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.isSuccess) {
        // 1. EKRANI GÜNCELLE (Anlık)
        setUserInfo(result.data);

        // 2. SECURE STORE GÜNCELLE (Kalıcılık)
        // İsim gibi kritik verileri localde de güncelleyelim ki diğer sayfalar (yenilenince) hızlı erişsin
        if (result.data.fullName) {
          await SecureStore.setItemAsync("userFullName", result.data.fullName);
        }

        setEditProfileVisible(false);
        Alert.alert("Başarılı", "Profiliniz başarıyla güncellendi.");
      } else {
        Alert.alert("Hata", result.message || "Güncelleme başarısız.");
      }
    } catch (error) {
      Alert.alert("Hata", "Bir sorun oluştu.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- ÇIKIŞ YAP ---
  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              const accessToken = await SecureStore.getItemAsync("accessToken");
              const refreshToken = await SecureStore.getItemAsync(
                "refreshToken"
              );
              if (accessToken && refreshToken) {
                await fetch(`${API_BASE_URL}/api/auth/logout`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ token: refreshToken }),
                });
              }
            } catch (error) {
            } finally {
              await SecureStore.deleteItemAsync("accessToken");
              await SecureStore.deleteItemAsync("refreshToken");
              await SecureStore.deleteItemAsync("userFullName"); // Temizlik
              setIsLoggingOut(false);
              router.replace("/auth/login");
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      title: "Sağlık Bilgilerim",
      icon: <Ionicons name="heart" size={32} color={colors.profile.text1} />,
      bgColor: colors.profile.card1,
      textColor: colors.profile.text1,
      onPress: () => router.push("/(worker)/progress"),
    },
    {
      title: "Profili Düzenle",
      icon: <Ionicons name="person" size={32} color={colors.profile.text2} />,
      bgColor: colors.profile.card2,
      textColor: colors.profile.text2,
      onPress: () => setEditProfileVisible(true),
    },
    {
      title: "Geri Bildirim",
      icon: (
        <MaterialCommunityIcons
          name="message-processing"
          size={32}
          color={colors.profile.text3}
        />
      ),
      bgColor: colors.profile.card3,
      textColor: colors.profile.text3,
      onPress: () => console.log("Geri Bildirim"),
    },
    {
      title: "Sıkça Sorulan Sorular",
      icon: (
        <FontAwesome5 name="question" size={28} color={colors.profile.text4} />
      ),
      bgColor: colors.profile.card4,
      textColor: colors.profile.text4,
      onPress: () => console.log("SSS"),
    },
    {
      title: "Tema & Ayarlar",
      icon: <Ionicons name="settings" size={32} color={colors.profile.text5} />,
      bgColor: colors.profile.card5,
      textColor: colors.profile.text5,
      onPress: () => setThemeModalVisible(true),
    },
    {
      title: "Hakkımızda",
      icon: (
        <Ionicons
          name="people"
          size={32}
          color={colors.profile.text7 || colors.text.main}
        />
      ),
      bgColor: colors.profile.card7 || colors.neutral.gray[100],
      textColor: colors.profile.text7 || colors.text.main,
      onPress: () => router.push("/common/aboutScreen"),
    },
    {
      title: "Davet Et",
      icon: (
        <Ionicons name="share-social" size={32} color={colors.profile.text6} />
      ),
      bgColor: colors.profile.card6,
      textColor: colors.profile.text6,
      onPress: () => console.log("Davet Et"),
    },
    {
      title: "Çıkış Yap",
      icon: isLoggingOut ? (
        <ActivityIndicator color={colors.text.secondary} />
      ) : (
        <Ionicons name="log-out" size={32} color={colors.text.secondary} />
      ),
      bgColor: colors.neutral.gray[100],
      textColor: colors.text.secondary,
      onPress: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      {/* HEADER */}
      <View style={styles.headerBackground}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.main} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeaderContainer}>
        <View style={styles.avatarContainer}>
         {userInfo.photoUrl ? (
            <Image source={{ uri: userInfo.photoUrl }} style={styles.avatar} />
          ) : null}

          <TouchableOpacity
            style={styles.editIconBtn}
            onPress={() => setEditProfileVisible(true)}
          >
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.nameBadge}>
          {loadingUser ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.userName}>{userInfo.fullName}</Text>
          )}
        </View>
        <Text style={styles.userRole}>{userInfo.jobTitle || "Çalışan"}</Text>
      </View>

      {/* MENU */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                {
                  backgroundColor: item.bgColor,
                  borderColor:
                    theme === "dark" ? item.textColor : "transparent",
                },
              ]}
              onPress={item.onPress}
              activeOpacity={0.8}
              disabled={isLoggingOut && item.title === "Çıkış Yap"}
            >
              <View style={styles.cardIcon}>{item.icon}</View>
              <Text style={[styles.cardTitle, { color: item.textColor }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- PROFİL DÜZENLEME MODALI --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editProfileVisible}
        onRequestClose={() => setEditProfileVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setEditProfileVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalIndicator} />
                <Text style={styles.modalTitle}>Profili Düzenle</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Ad Soyad</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.fullName}
                    onChangeText={(t) =>
                      setEditForm({ ...editForm, fullName: t })
                    }
                    placeholder="Ad Soyad"
                    placeholderTextColor={colors.text.secondary}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Telefon</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.phoneNumber}
                    onChangeText={(t) =>
                      setEditForm({ ...editForm, phoneNumber: t })
                    }
                    placeholder="Telefon"
                    keyboardType="phone-pad"
                    placeholderTextColor={colors.text.secondary}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Ünvan</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.jobTitle}
                    onChangeText={(t) =>
                      setEditForm({ ...editForm, jobTitle: t })
                    }
                    placeholder="Ünvan"
                    placeholderTextColor={colors.text.secondary}
                  />
                </View>

                {/* CİNSİYET SEÇİMİ */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Cinsiyet</Text>
                  <View style={styles.genderContainer}>
                    {[
                      { id: 1, label: "Erkek", icon: "male" },
                      { id: 2, label: "Kadın", icon: "female" },
                    ].map((g) => (
                      <TouchableOpacity
                        key={g.id}
                        style={[
                          styles.genderButton,
                          editForm.gender === g.id && styles.genderButtonActive,
                        ]}
                        onPress={() =>
                          setEditForm({ ...editForm, gender: g.id })
                        }
                      >
                        <Ionicons
                          name={g.icon as any}
                          size={18}
                          color={
                            editForm.gender === g.id
                              ? "#FFF"
                              : colors.text.secondary
                          }
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.genderText,
                            editForm.gender === g.id && styles.genderTextActive,
                          ]}
                        >
                          {g.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleUpdateProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Güncelle</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>

      {/* --- TEMA MODALI --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setThemeModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalIndicator} />
                <Text style={styles.modalTitle}>Görünüm Ayarları</Text>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === "light" && styles.themeOptionActive,
                  ]}
                  onPress={() => setTheme("light")}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="sunny"
                      size={24}
                      color={colors.primary.main}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.themeText}>Açık Mod</Text>
                  </View>
                  {theme === "light" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary.main}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === "dark" && styles.themeOptionActive,
                  ]}
                  onPress={() => setTheme("dark")}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="moon"
                      size={24}
                      color={colors.primary.main}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.themeText}>Koyu Mod</Text>
                  </View>
                  {theme === "dark" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary.main}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background.default },
    headerBackground: {
      height: 140,
      backgroundColor: theme === "light" ? "#E7EFFF" : "#1E1E1E",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    profileHeaderContainer: {
      alignItems: "center",
      marginTop: -50,
      marginBottom: 20,
    },
    avatarContainer: { position: "relative", marginBottom: 10 },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 4,
      borderColor: colors.background.default,
    },
    editIconBtn: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: colors.secondary.main,
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.background.default,
    },
    nameBadge: {
      backgroundColor: colors.primary.main,
      paddingVertical: 6,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginBottom: 6,
    },
    userName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    userRole: { color: colors.text.secondary, fontSize: 14 },
    scrollContent: { paddingHorizontal: 24, paddingTop: 10 },
    gridContainer: { flexDirection: "row", flexWrap: "wrap", gap: CARD_GAP },
    card: {
      width: CARD_WIDTH,
      height: 110,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderWidth: theme === "dark" ? 1 : 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "light" ? 0.05 : 0,
      shadowRadius: 5,
      elevation: theme === "light" ? 2 : 0,
    },
    cardIcon: { marginBottom: 10 },
    cardTitle: { fontSize: 14, fontWeight: "600", textAlign: "center" },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.background.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    modalIndicator: {
      width: 40,
      height: 5,
      backgroundColor: colors.neutral.border,
      borderRadius: 3,
      alignSelf: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 20,
      textAlign: "center",
    },
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      marginBottom: 12,
    },
    themeOptionActive: {
      borderColor: colors.primary.main,
      backgroundColor:
        theme === "light" ? colors.primary.light : "rgba(72, 112, 255, 0.1)",
    },
    themeText: { fontSize: 16, fontWeight: "600", color: colors.text.main },
    inputContainer: { marginBottom: 15 },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text.secondary,
      marginBottom: 6,
      marginLeft: 4,
    },
    input: {
      backgroundColor: colors.neutral.input,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      color: colors.text.main,
      fontSize: 15,
    },
    genderContainer: { flexDirection: "row", gap: 10 },
    genderButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      backgroundColor: colors.neutral.input,
    },
    genderButtonActive: {
      backgroundColor: colors.primary.main,
      borderColor: colors.primary.main,
    },
    genderText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text.secondary,
    },
    genderTextActive: { color: "#FFF" },
    saveButton: {
      backgroundColor: colors.primary.main,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 10,
    },
    saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  });
