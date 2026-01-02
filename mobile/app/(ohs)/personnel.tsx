// app/(ohs)/personnel.tsx

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  Linking,
} from "react-native";
import { useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import CustomHeader from "../../components/ui/CustomHeader";

// API URL
const API_BASE_URL = "http://10.0.2.2:5187";

const getRoleInfo = (role: number) => {
  switch (role) {
    case 0:
      return {
        label: "Yönetici",
        color: "#B71C1C",
        bg: "#FFEBEE",
        icon: "shield-account",
      };
    case 1:
      return {
        label: "Firma Sahibi",
        color: "#B71C1C",
        bg: "#FFEBEE",
        icon: "domain",
      };
    case 2:
      return {
        label: "İSG Uzmanı",
        color: "#FF9800",
        bg: "#FFF3E0",
        icon: "briefcase-eye",
      };
    case 3:
      return {
        label: "Çalışan",
        color: "#2196F3",
        bg: "#E3F2FD",
        icon: "account-hard-hat",
      };
    default:
      return {
        label: "Bilinmiyor",
        color: "#9E9E9E",
        bg: "#F5F5F5",
        icon: "account-question",
      };
  }
};

export default function PersonnelListScreen() {
  const { colors, theme } = useTheme();
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  const [personnelList, setPersonnelList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPersonnel = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) return;

      // 1. İSG Uzmanının kendi bilgilerini al
      const userRes = await fetch(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();

      // Eğer CompanyID yoksa
      if (!userData.isSuccess || !userData.data?.companyId) {
        console.error("Kullanıcıya ait Company ID bulunamadı.");
        // İsteğe bağlı: setIsLoading(false) deyip boş liste gösterebiliriz.
        return;
      }
      const companyId = userData.data.companyId;

      // 2. O şirkete ait personelleri çek
      const response = await fetch(
        `${API_BASE_URL}/api/users/company/${companyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();

      if (result.isSuccess && Array.isArray(result.data)) {
        setPersonnelList(result.data);
      }
    } catch (error) {
      console.error("Fetch Personnel Error:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPersonnel();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPersonnel();
  };

  const handleCall = (phone: string) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const renderItem = ({ item }: { item: any }) => {
    const roleInfo = getRoleInfo(item.role);

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <View style={styles.cardLeft}>
          {/* Avatar / Profil Resmi */}
          {item.photoUrl ? (
            <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: roleInfo.bg },
              ]}
            >
              <Text style={[styles.avatarText, { color: roleInfo.color }]}>
                {item.fullName ? item.fullName.charAt(0).toUpperCase() : "?"}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{item.fullName}</Text>

            {/* Rol Badge'i */}
            <View style={[styles.roleBadge, { backgroundColor: roleInfo.bg }]}>
              <MaterialCommunityIcons
                name={roleInfo.icon as any}
                size={12}
                color={roleInfo.color}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.roleText, { color: roleInfo.color }]}>
                {roleInfo.label}
              </Text>
            </View>
          </View>

          {/* Email ve Telefon */}
          <Text style={styles.email}>{item.email}</Text>
          {item.phoneNumber && (
            <Text style={styles.phone}>{item.phoneNumber}</Text>
          )}
        </View>

        {/* Ara Butonu (Telefon varsa) */}
        {item.phoneNumber && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleCall(item.phoneNumber)}
          >
            <Ionicons
              name="call-outline"
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader title="Personel Listesi" />

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      ) : (
        <FlatList
          data={personnelList}
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
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Ionicons
                name="people-outline"
                size={60}
                color={colors.neutral.border}
              />
              <Text style={{ color: colors.text.secondary, marginTop: 10 }}>
                Listelenecek personel bulunamadı.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const createStyles = (colors: any, theme: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.default,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 100,
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.neutral.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "light" ? 0.05 : 0,
      shadowRadius: 4,
      elevation: theme === "light" ? 2 : 0,
    },
    cardLeft: {
      marginRight: 15,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.neutral.input,
    },
    avatarPlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    textContainer: {
      flex: 1,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
      flexWrap: "wrap",
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text.main,
      marginRight: 5,
      flex: 1,
    },
    roleBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    roleText: {
      fontSize: 11,
      fontWeight: "700",
    },
    email: {
      fontSize: 13,
      color: colors.text.secondary,
    },
    phone: {
      fontSize: 12,
      color: colors.text.secondary,
      marginTop: 2,
    },
    actionBtn: {
      padding: 8,
      justifyContent: "center",
      alignItems: "center",
    },
  });
