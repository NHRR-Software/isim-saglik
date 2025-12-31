// app/(founder)/company.tsx

import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 
import { useRouter } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '../../context/ThemeContext';
import createCompanyStyles from './styles';

// API URL (Login sayfasında kullandığınla aynı olmalı)
const API_BASE_URL = "http://10.0.2.2:5187"; 

const CompanyScreen = () => {
    const { colors, theme, toggleTheme } = useTheme();
    const router = useRouter();
    const styles = useMemo(() => createCompanyStyles(colors, theme), [colors, theme]);

    const [expandedId, setExpandedId] = useState(null);
    const [logoUri, setLogoUri] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    // Şirket Bilgileri State'i
    const [companyInfo, setCompanyInfo] = useState({
        name: "Yükleniyor...",
        photoUrl: null,
    });
    const [loading, setLoading] = useState(true);

    // --- 1. ŞİRKET BİLGİLERİNİ ÇEK ---
    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const token = await SecureStore.getItemAsync("accessToken");
                if (!token) return;

                const response = await fetch(`${API_BASE_URL}/api/users`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const result = await response.json();
                if (result.isSuccess && result.data) {
                    setCompanyInfo({
                        // Founder için FullName şirket adı olarak kullanılıyor
                        name: result.data.fullName || "Şirket Adı Yok",
                        photoUrl: result.data.photoUrl,
                    });
                    
                    // Eğer API'den gelen foto varsa onu set et (kullanıcı henüz yerel seçim yapmadıysa)
                    if (result.data.photoUrl && !logoUri) {
                        setLogoUri(result.data.photoUrl);
                    }
                }
            } catch (error) {
                console.error("Company Info Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, []);

    // --- LOGO DEĞİŞTİRME ---
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("İzin Gerekli", "Logoyu değiştirmek için galeri izni vermeniz gerekiyor.");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, 
            aspect: [1, 1],      
            quality: 1,
        });
        if (!result.canceled) {
            setLogoUri(result.assets[0].uri); 
            // Burada normalde yeni logoyu API'ye upload etmeniz gerekir.
        }
    };

    // --- GÜVENLİ ÇIKIŞ YAP ---
    const handleLogout = async () => {
        Alert.alert(
            "Güvenli Çıkış", 
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
                            const refreshToken = await SecureStore.getItemAsync("refreshToken");

                            if (accessToken && refreshToken) {
                                await fetch(`${API_BASE_URL}/api/auth/logout`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${accessToken}`
                                    },
                                    body: JSON.stringify({ token: refreshToken })
                                });
                            }
                        } catch (error) {
                            console.error("Çıkış hatası:", error);
                        } finally {
                            await SecureStore.deleteItemAsync("accessToken");
                            await SecureStore.deleteItemAsync("refreshToken");
                            setIsLoggingOut(false);
                            router.replace('/auth/login');
                        }
                    } 
                }
            ]
        );
    };

    const AccordionCard = ({ id, title, icon, color, content }) => {
        const isOpen = expandedId === id;
        const iconColor = colors.profile['text' + color.slice(-1)];
        
        return (
            <View>
                <TouchableOpacity 
                    style={[
                        styles.actionCard, 
                        { backgroundColor: colors.profile[color] },
                        isOpen && styles.actionCardOpen
                    ]}
                    onPress={() => setExpandedId(isOpen ? null : id)}
                    activeOpacity={0.8}
                >
                    <View style={styles.actionIconContainer}>
                        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
                    </View>
                    <Text style={styles.actionTitle}>{title}</Text>
                    <Ionicons name={isOpen ? "chevron-up" : "chevron-forward"} size={20} color={colors.text.secondary} />
                </TouchableOpacity>
                {isOpen && (
                    <View style={styles.dropdownBody}>
                        <Text style={styles.dropdownText}>{content}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header Alanı */}
            <View style={styles.headerBg}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={colors.text.main} />
                </TouchableOpacity>

                <View style={styles.profileContainer}>
                    {/* Logo Gösterimi */}
                    <Image 
                        source={logoUri ? { uri: logoUri } : require('../../../assets/images/company/companylogo.png')} 
                        style={styles.logoImage} 
                    />
                    <TouchableOpacity style={styles.editIconBadge} onPress={pickImage}>
                        <Feather name="edit-3" size={15} color={colors.primary.main} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.companyBadge}>
                {loading ? (
                    <ActivityIndicator size="small" color={colors.primary.main} />
                ) : (
                    <Text style={styles.companyName}>{companyInfo.name}</Text>
                )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* İletişim Kartları */}
                <View style={styles.gridContainer}>
                    <View style={[styles.infoCard, { backgroundColor: colors.companyInfo.telephone }]}>
                        <Ionicons name="call-outline" size={28} color="#4870FF" />
                        <Text style={[styles.infoText, { color: '#4870FF' }]}>+90 212 123 45 67</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.companyInfo.location }]}>
                        <Ionicons name="location-outline" size={28} color="#FF9F47" />
                        <Text style={[styles.infoText, { color: '#FF9F47' }]}>Atatürk Cad. No:45{"\n"}İstanbul / Türkiye</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.companyInfo.mail }]}>
                        <Ionicons name="mail-outline" size={28} color="#8E44AD" />
                        <Text style={[styles.infoText, { color: '#8E44AD' }]}>nhrr@gmail.com</Text>
                    </View>
                    <View style={[styles.infoCard, { backgroundColor: colors.companyInfo.internet }]}>
                        <Ionicons name="globe-outline" size={28} color="#00ACC1" />
                        <Text style={[styles.infoText, { color: '#00ACC1' }]}>www.nhrr.com</Text>
                    </View>
                </View>

                {/* Dropdown Kartlar */}
                <AccordionCard 
                    id="faaliyet" 
                    title="Faaliyet Alanlarımız" 
                    icon="briefcase-outline" 
                    color="card2"
                    content="Endüstriyel tesisler için akıllı İSG izleme sistemleri geliştiriyoruz. Gerçek zamanlı veri analitiği, giyilebilir teknoloji çözümleri ve yapay zeka destekli risk analizi ile iş güvenliğini bir üst seviyeye taşıyoruz."
                />
                <AccordionCard 
                    id="vizyon" 
                    title="Vizyon ve Misyonumuz" 
                    icon="bullseye-arrow" 
                    color="card4"
                    content="Dünya çapında teknolojik iş güvenliği denince akla gelen ilk marka olmayı hedefliyoruz. Misyonumuz; teknolojiyi insan hayatını korumak için en verimli şekilde kullanmak ve iş kazalarını dijital dönüşümle sıfırlamaktır."
                />

                <TouchableOpacity 
                    style={[styles.actionCard, { backgroundColor: theme === 'dark' ? colors.neutral.input : '#F5F7FA', marginTop: 25 }]}
                    onPress={toggleTheme}
                >
                    <View style={[styles.actionIconContainer, { backgroundColor: colors.primary.main }]}>
                        <Ionicons name={theme === 'dark' ? "sunny" : "moon"} size={22} color="#FFF" />
                    </View>
                    <Text style={styles.actionTitle}>Görünüm: {theme === 'light' ? 'Gündüz Modu' : 'Gece Modu'}</Text>
                    <Ionicons name="sync" size={20} color={colors.text.secondary} />
                </TouchableOpacity>

                {/* Çıkış Yap Butonu */}
                <TouchableOpacity 
                    style={[styles.actionCard, { backgroundColor: theme === 'dark' ? colors.neutral.input : '#FFF5F5' }]}
                    onPress={handleLogout}
                    disabled={isLoggingOut} 
                >
                    <View style={[styles.actionIconContainer, { backgroundColor: colors.dashboard.red }]}>
                        {isLoggingOut ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Ionicons name="log-out-outline" size={22} color="#FFF" />
                        )}
                    </View>
                    <Text style={[styles.actionTitle, { color: colors.dashboard.red }]}>
                        {isLoggingOut ? "Çıkış Yapılıyor..." : "Güvenli Çıkış Yap"}
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

export default CompanyScreen;