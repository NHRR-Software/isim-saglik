// app/auth/register.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AuthInput from "../../components/ui/AuthInput";
import { useTheme } from "../context/ThemeContext";

const { height } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = () => {
    if (!isChecked) {
      alert(
        "Devam etmek için üyelik sözleşmesini kabul etmeniz gerekmektedir."
      );
      return;
    }
  };

  const handleLoginRoute = () => {
    router.back();
  };

  const handleConfirmContract = () => {
    setIsChecked(true);
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: colors.background.default },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={[styles.title, { color: colors.primary.main }]}>
            Firma Oluştur
          </Text>

          <View style={styles.form}>
            <AuthInput iconName="business-outline" placeholder="Firma Adı" />
            <AuthInput
              iconName="mail-outline"
              placeholder="Email"
              keyboardType="email-address"
            />
            <AuthInput
              iconName="call-outline"
              placeholder="Telefon Numarası"
              keyboardType="phone-pad"
            />
            <AuthInput
              iconName="calendar-outline"
              placeholder="Kuruluş Tarihi (GG/AA/YYYY)"
            />
            <AuthInput
              iconName="lock-closed-outline"
              placeholder="Şifre"
              secureTextEntry
            />
            <AuthInput
              iconName="lock-closed-outline"
              placeholder="Şifre Tekrar"
              secureTextEntry
            />

            {/* Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  { borderColor: colors.secondary.main },
                  isChecked && { backgroundColor: colors.secondary.main },
                ]}
                onPress={() => setIsChecked(!isChecked)}
              >
                {isChecked && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>

              <View style={styles.checkboxLabelContainer}>
                <Text
                  style={[
                    styles.checkboxLabel,
                    { color: colors.text.secondary },
                  ]}
                >
                  <Text
                    style={{ fontWeight: "bold", color: colors.primary.main }}
                    onPress={() => setModalVisible(true)}
                  >
                    Üyelik Sözleşmesi
                  </Text>{" "}
                  şartlarını okudum ve kabul ediyorum.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary.main }]}
              onPress={handleRegister}
            >
              <Text
                style={[styles.buttonText, { color: colors.primary.contrast }]}
              >
                Oluştur
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text.secondary }]}>
              Zaten bir hesabın var mı?{" "}
            </Text>
            <TouchableOpacity onPress={handleLoginRoute}>
              <Text style={[styles.linkText, { color: colors.primary.main }]}>
                Giriş Yap
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* --- SÖZLEŞME MODALI --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background.card },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.primary.main }]}>
              Üyelik Sözleşmesi
            </Text>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={true}
            >
              <Text style={[styles.modalText, { color: colors.text.main }]}>
                Lorem ipsum dolor sit amet...
                {/* Uzun metin... */}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: colors.primary.main },
              ]}
              onPress={handleConfirmContract}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { color: colors.primary.contrast },
                ]}
              >
                Okudum, Onaylıyorum
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={[
                  styles.closeButtonText,
                  { color: colors.text.secondary },
                ]}
              >
                Vazgeç
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: 20,
  },
  form: {
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    marginTop: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  checkboxLabelContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    lineHeight: 20,
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
    marginBottom: 40,
  },
  footerText: {
    fontSize: 16,
  },
  linkText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    height: "70%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalScroll: {
    width: "100%",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "justify",
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    paddingVertical: 10,
  },
  closeButtonText: {
    fontSize: 14,
  },
});
