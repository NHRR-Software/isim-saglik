// app/auth/register.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal, // Modal'ı import ettik
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AuthInput from "../../components/ui/AuthInput";
import { colors } from "../../app/styles/theme/colors";

const { height } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal görünürlük durumu

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

  // Modaldaki onay butonuna basınca çalışır
  const handleConfirmContract = () => {
    setIsChecked(true); // Sözleşmeyi onayla
    setModalVisible(false); // Modalı kapat
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Firma Oluştur</Text>

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

            {/* Checkbox ve Sözleşme Linki */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, isChecked && styles.checkedCheckbox]}
                onPress={() => setIsChecked(!isChecked)}
              >
                {isChecked && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>

              <View style={styles.checkboxLabelContainer}>
                <Text style={styles.checkboxLabel}>
                  {/* Sadece yazıya tıklayınca modal açılsın */}
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

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Oluştur</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten bir hesabın var mı? </Text>
            <TouchableOpacity onPress={handleLoginRoute}>
              <Text style={styles.linkText}>Giriş Yap</Text>
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
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Üyelik Sözleşmesi</Text>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.modalText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                {"\n\n"}
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
                {"\n\n"}
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
                {"\n\n"}
                1. Taraflar: İşbu sözleşme... {"\n"}
                2. Konu: Sağlık ve güvenlik verilerinin takibi... {"\n"}
                3. Gizlilik: Verileriniz şifreli sunucularda saklanır...
                {"\n\n"}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Text>
            </ScrollView>

            {/* Onay Butonu */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleConfirmContract}
            >
              <Text style={styles.modalButtonText}>Okudum, Onaylıyorum</Text>
            </TouchableOpacity>

            {/* Kapat butonu (Opsiyonel, sadece kapatır onaylamaz) */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Vazgeç</Text>
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
    backgroundColor: colors.background.default,
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
    color: colors.primary.main,
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
    borderColor: colors.secondary.main,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  checkedCheckbox: {
    backgroundColor: colors.secondary.main,
  },
  checkboxLabelContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
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
    marginBottom: 40,
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

  // --- MODAL STİLLERİ ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Arkası karartılmış
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    height: "70%",
    backgroundColor: "#fff",
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
    color: colors.primary.main,
  },
  modalScroll: {
    width: "100%",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.main,
    textAlign: "justify",
  },
  modalButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    paddingVertical: 10,
  },
  closeButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
});
