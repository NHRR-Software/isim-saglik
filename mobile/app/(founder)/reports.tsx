// app/(founder)/reports.tsx

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";

const { width, height } = Dimensions.get("window");

// API URL
const API_BASE_URL = "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";

// HELPER FONKSİYONLAR
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSeverityInfo = (severity: number) => {
  switch (severity) {
    case 0:
      return { label: "Düşük", color: "#4CAF50", bg: "#E8F5E9" };
    case 1:
      return { label: "Orta", color: "#FF9800", bg: "#FFF3E0" };
    case 2:
      return { label: "Yüksek", color: "#F44336", bg: "#FFEBEE" };
    case 3:
      return { label: "Kritik", color: "#B71C1C", bg: "#FFEBEE" };
    default:
      return { label: "Bilinmiyor", color: "#9E9E9E", bg: "#F5F5F5" };
  }
};

const getTypeLabel = (type: number) => {
  const types = [
    "Davranışsal",
    "Teknik",
    "Acil Durum",
    "Hijyen/Sağlık",
    "Çevresel",
    "Dökümantasyon",
  ];
  return types[type] || "Diğer";
};

export default function FounderReportsScreen() {
  const { colors, theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  type Report = {
    id: number;
    title: string;
    description: string;
    createdDate: string;
    closedDate?: string;
    status: number;
    severity: number;
    type: number;
    photoUrl?: string;
    // Add other fields as needed
  };

  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Silme/Tamamlama loading

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // --- 1. VERİLERİ ÇEK (GET) ---
  const fetchReports = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      // Company rolü tüm bulguları görebilir
      const response = await fetch(`${API_BASE_URL}/api/safety-findings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (result.isSuccess && Array.isArray(result.data)) {
        const sortedData = result.data.reverse();
        setReports(sortedData);
      }
    } catch (error) {
      console.error("Fetch Reports Error:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // --- 2. RAPORU TAMAMLA (PATCH) ---
  const handleComplete = async () => {
    if (!selectedReport) return;

    Alert.alert(
      "Raporu Tamamla",
      "Bu raporu tamamlandı olarak işaretlemek istiyor musunuz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Tamamla",
          onPress: async () => {
            setIsProcessing(true);
            try {
              const token = await SecureStore.getItemAsync("accessToken");
              const response = await fetch(
                `${API_BASE_URL}/api/safety-findings/${selectedReport.id}/complete`,
                {
                  method: "PATCH",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const result = await response.json();

              if (result.isSuccess) {
                // UI Güncelleme (Lokalde status'u değiştir)
                setReports((prev) =>
                  prev.map((item: any) =>
                    item.id === selectedReport.id
                      ? {
                          ...item,
                          status: 0,
                          closedDate: new Date().toISOString(),
                        }
                      : item
                  )
                );
                setSelectedReport((prev: Report) => ({
                  ...prev,
                  status: 0,
                  closedDate: new Date().toISOString(),
                })); // Modalı da güncelle
                Alert.alert("Başarılı", "Rapor tamamlandı.");
              } else {
                Alert.alert("Hata", result.message || "İşlem başarısız.");
              }
            } catch (error) {
              console.error("Complete Error:", error);
              Alert.alert("Hata", "Bir sorun oluştu.");
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  // --- 3. RAPORU SİL (DELETE) ---
  const handleDelete = async () => {
    if (!selectedReport) return;

    Alert.alert(
      "Raporu Sil",
      "Bu raporu kalıcı olarak silmek istediğinize emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            setIsProcessing(true);
            try {
              const token = await SecureStore.getItemAsync("accessToken");
              const response = await fetch(
                `${API_BASE_URL}/api/safety-findings/${selectedReport.id}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const result = await response.json();

              if (result.isSuccess) {
                // UI'dan kaldır
                setReports((prev) =>
                  prev.filter((item: any) => item.id !== selectedReport.id)
                );
                setModalVisible(false);
                Alert.alert("Başarılı", "Rapor silindi.");
              } else {
                Alert.alert(
                  "Hata",
                  result.message || "Silme işlemi başarısız."
                );
              }
            } catch (error) {
              console.error("Delete Error:", error);
              Alert.alert("Hata", "Bir sorun oluştu.");
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const openDetail = (item: any) => {
    setSelectedReport(item);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => {
    const severityInfo = getSeverityInfo(item.severity);
    const isOpen = item.status === 1;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => openDetail(item)}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.chip,
              { backgroundColor: isOpen ? "#E3F2FD" : "#EEEEEE" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOpen ? "#2196F3" : "#757575" },
              ]}
            />
            <Text
              style={[
                styles.chipText,
                { color: isOpen ? "#2196F3" : "#757575" },
              ]}
            >
              {isOpen ? "Açık Kayıt" : "Kapalı"}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {formatDate(item.createdDate).split(" ")[0]}
          </Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.tagsRow}>
            <View
              style={[
                styles.chip,
                { backgroundColor: severityInfo.bg, marginRight: 8 },
              ]}
            >
              <Text style={[styles.chipText, { color: severityInfo.color }]}>
                {severityInfo.label}
              </Text>
            </View>
            <View
              style={[
                styles.chip,
                { backgroundColor: colors.background.default },
              ]}
            >
              <Text style={[styles.chipText, { color: colors.text.secondary }]}>
                {getTypeLabel(item.type)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerLeft}>
            {item.photoUrl && (
              <Ionicons
                name="image-outline"
                size={16}
                color={colors.text.secondary}
                style={{ marginRight: 4 }}
              />
            )}
            <Text style={styles.footerText}>
              {item.photoUrl ? "Fotoğraf Eki Var" : "Fotoğraf Yok"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.secondary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <CustomHeader title="Raporlar (Firma)" />

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary.main}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={require("../../assets/images/taskIcon.png")}
                style={{ width: 80, height: 80, opacity: 0.5 }}
                resizeMode="contain"
              />
              <Text style={styles.emptyText}>Henüz rapor bulunmuyor.</Text>
            </View>
          }
        />
      )}

      {/* --- DETAY MODALI (BOTTOM SHEET) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />

                {selectedReport && (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {selectedReport.photoUrl ? (
                      <Image
                        source={{ uri: selectedReport.photoUrl }}
                        style={styles.detailImage}
                      />
                    ) : (
                      <View style={styles.detailImagePlaceholder}>
                        <Ionicons
                          name="image-outline"
                          size={60}
                          color={colors.neutral.border}
                        />
                        <Text
                          style={{
                            color: colors.text.secondary,
                            marginTop: 10,
                          }}
                        >
                          Fotoğraf Yok
                        </Text>
                      </View>
                    )}

                    <View style={styles.detailHeader}>
                      <Text style={styles.detailDate}>
                        {formatDate(selectedReport.createdDate)}
                      </Text>
                      <Text style={styles.detailTitle}>
                        {selectedReport.title}
                      </Text>
                    </View>

                    <View style={styles.detailTags}>
                      <View
                        style={[
                          styles.bigChip,
                          {
                            backgroundColor:
                              selectedReport.status === 1
                                ? "#E3F2FD"
                                : "#EEEEEE",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.bigChipText,
                            {
                              color:
                                selectedReport.status === 1
                                  ? "#2196F3"
                                  : "#757575",
                            },
                          ]}
                        >
                          {selectedReport.status === 1 ? "AÇIK" : "KAPALI"}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.bigChip,
                          {
                            backgroundColor: getSeverityInfo(
                              selectedReport.severity
                            ).bg,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.bigChipText,
                            {
                              color: getSeverityInfo(selectedReport.severity)
                                .color,
                            },
                          ]}
                        >
                          {getSeverityInfo(
                            selectedReport.severity
                          ).label.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Açıklama</Text>
                      <Text style={styles.detailDesc}>
                        {selectedReport.description}
                      </Text>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={styles.sectionTitle}>Bulgu Türü</Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <MaterialIcons
                          name="category"
                          size={20}
                          color={colors.text.secondary}
                          style={{ marginRight: 8 }}
                        />
                        <Text style={styles.detailText}>
                          {getTypeLabel(selectedReport.type)}
                        </Text>
                      </View>
                    </View>

                    {/* BUTONLAR (COMPANY ROLÜ İÇİN ÖZEL) */}
                    <View style={styles.actionButtonsContainer}>
                      {/* TAMAMLA BUTONU (Sadece Açık ise göster) */}
                      {selectedReport.status === 1 && (
                        <TouchableOpacity
                          style={styles.completeButton}
                          onPress={handleComplete}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <ActivityIndicator color="#FFF" />
                          ) : (
                            <>
                              <Ionicons
                                name="checkmark-done-circle"
                                size={20}
                                color="#FFF"
                                style={{ marginRight: 8 }}
                              />
                              <Text style={styles.buttonText}>
                                Raporu Tamamla
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      )}

                      {/* SİLME BUTONU */}
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        disabled={isProcessing}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color={colors.dashboard.red}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={[
                            styles.buttonText,
                            { color: colors.dashboard.red },
                          ]}
                        >
                          Raporu Sil
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Kapat</Text>
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                  </ScrollView>
                )}
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
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContent: {
      padding: 20,
      paddingBottom: 100,
    },
    card: {
      backgroundColor: colors.background.card,
      borderRadius: 20,
      padding: 18,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme === "light" ? 0.05 : 0,
      shadowRadius: 8,
      elevation: theme === "light" ? 3 : 0,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 6,
    },
    chipText: {
      fontSize: 12,
      fontWeight: "700",
    },
    dateText: {
      fontSize: 12,
      color: colors.text.secondary,
    },
    cardBody: {
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 8,
      lineHeight: 24,
    },
    tagsRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    description: {
      fontSize: 14,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: colors.neutral.border,
      paddingTop: 12,
    },
    footerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    footerText: {
      fontSize: 12,
      color: colors.text.secondary,
      fontWeight: "500",
    },
    emptyContainer: {
      alignItems: "center",
      marginTop: 80,
    },
    emptyText: {
      marginTop: 15,
      color: colors.text.secondary,
      fontSize: 16,
      fontWeight: "500",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.background.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      maxHeight: height * 0.9,
      minHeight: height * 0.6,
    },
    modalHandle: {
      width: 40,
      height: 5,
      backgroundColor: colors.neutral.border,
      borderRadius: 3,
      alignSelf: "center",
      marginBottom: 20,
    },
    detailImage: {
      width: "100%",
      height: 200,
      borderRadius: 16,
      marginBottom: 20,
      backgroundColor: colors.neutral.input,
    },
    detailImagePlaceholder: {
      width: "100%",
      height: 150,
      borderRadius: 16,
      marginBottom: 20,
      backgroundColor: colors.neutral.input,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.neutral.border,
      borderStyle: "dashed",
    },
    detailHeader: {
      marginBottom: 15,
    },
    detailDate: {
      fontSize: 13,
      color: colors.text.secondary,
      marginBottom: 5,
    },
    detailTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.text.main,
      lineHeight: 30,
    },
    detailTags: {
      flexDirection: "row",
      marginBottom: 25,
      gap: 10,
    },
    bigChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
    },
    bigChipText: {
      fontSize: 13,
      fontWeight: "800",
    },
    detailSection: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text.main,
      marginBottom: 8,
    },
    detailDesc: {
      fontSize: 15,
      color: colors.text.secondary,
      lineHeight: 24,
    },
    detailText: {
      fontSize: 15,
      color: colors.text.main,
      fontWeight: "500",
    },
    actionButtonsContainer: {
      marginTop: 20,
      marginBottom: 10,
    },
    completeButton: {
      backgroundColor: colors.status.success, // Yeşil
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "center",
    },
    deleteButton: {
      backgroundColor: "transparent",
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.dashboard.red,
      flexDirection: "row",
      justifyContent: "center",
    },
    buttonText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    closeButton: {
      backgroundColor: colors.neutral.input,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
    },
    closeButtonText: {
      color: colors.text.main,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
