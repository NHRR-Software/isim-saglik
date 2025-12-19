// app/setup/user-info.tsx

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../app/context/ThemeContext"; // YENİ: Theme Hook

// Kan Grubu Seçenekleri
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

export default function UserInfoScreen() {
  const router = useRouter();
  const { colors } = useTheme(); // Renkleri çekiyoruz
  const styles = useMemo(() => createStyles(colors), [colors]); // Stilleri oluşturuyoruz

  // State'ler
  const [bloodType, setBloodType] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [hasDisease, setHasDisease] = useState<boolean | null>(null);
  const [diseaseDescription, setDiseaseDescription] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleContinue = () => {
    // İşçi Ana Sayfasına Yönlendir
    router.replace("/(worker)");
  };

  // --- BİLEŞENLER ---

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
        placeholderTextColor={colors.text.secondary} // Dinamik placeholder rengi
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

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Başlık */}
        <Text style={styles.pageTitle}>Profilinizi Tamamlayın</Text>

        {/* --- KAN GRUBU (DROPDOWN) --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Kan Grubu</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setIsDropdownOpen(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                !bloodType && { color: colors.text.secondary },
              ]}
            >
              {bloodType || "Seçiniz"}
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

        {/* --- HASTALIK SORUSU (RADIO BUTTON) --- */}
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
              onSelect={() => setHasDisease(false)}
            />
          </View>
        </View>

        {/* --- CONDITIONAL RENDERING --- */}
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

        {/* --- DEVAM ET BUTONU --- */}
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Devam Et</Text>
        </TouchableOpacity>
      </ScrollView>

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
                    setBloodType(item);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      bloodType === item && {
                        color: colors.primary.main,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {bloodType === item && (
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

// Stilleri fonksiyon haline getirdik
const createStyles = (colors: any) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.background.default, // Dinamik
    },
    scrollContainer: {
      padding: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.primary.main, // Dinamik
      marginBottom: 30,
    },

    // Input Grupları
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: colors.text.secondary, // Dinamik
      fontWeight: "600",
      marginBottom: 12,
      marginLeft: 4,
    },
    input: {
      backgroundColor: colors.neutral.input, // Dinamik (Dark modda koyu gri)
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text.main, // Dinamik yazı rengi
      borderWidth: 1,
      borderColor:
        colors.mode === "dark" ? colors.neutral.border : "transparent",
    },
    textArea: {
      height: 120, // Biraz kısalttım, 200 çok uzun olabilir
      textAlignVertical: "top",
      paddingTop: 14,
    },

    // Dropdown Stilleri
    dropdownButton: {
      backgroundColor: colors.neutral.input, // Dinamik
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor:
        colors.mode === "dark" ? colors.neutral.border : "transparent",
    },
    dropdownText: {
      fontSize: 16,
      color: colors.text.main, // Dinamik
    },

    // Radio Button Stilleri
    radioGroup: {
      flexDirection: "row",
      gap: 20,
    },
    radioContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    radioCircle: {
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.text.secondary, // Dinamik
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
    },
    radioCircleSelected: {
      borderColor: colors.primary.main,
    },
    radioInnerCircle: {
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: colors.primary.main,
    },
    radioText: {
      fontSize: 16,
      color: colors.text.main, // Dinamik
    },

    // Ekstra
    fadeContainer: {
      marginTop: 10,
    },

    // Buton
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

    // Modal Stilleri
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)", // Dark modda daha iyi görünür
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "80%",
      maxHeight: "50%",
      backgroundColor: colors.background.card, // Dinamik Kart Rengi
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
      borderBottomColor: colors.neutral.border, // Dinamik border
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalItemText: {
      fontSize: 16,
      color: colors.text.main, // Dinamik
    },
  });
