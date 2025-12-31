import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ReportItem from './ReportItem';
import { createReportStyles } from './styles';

const ReportsScreen = () => {
    const { colors, theme } = useTheme();
    const router = useRouter();
    const styles = useMemo(() => createReportStyles(colors, theme), [colors, theme]);

    const [expandedId, setExpandedId] = useState(null);

    const reportData = [
        {
            id: '1',
            title: 'Risk ve Olay Raporu',
            subtitle: 'Kritik riskler ve olaylar özeti',
            icon: require('../../../assets/images/reports/alerticon.png'),
            details: [
                'Yüksek riskli bölgelerde haftalık denetim tamamlandı.',
                '3 adet ramak kala olay raporu dijital ortama aktarıldı.',
                'Acil durum eylem planı güncellendi.'
            ]
        },
        {
            id: '2',
            title: 'Çalışan Sağlığı Raporu',
            subtitle: 'Çalışanların sağlık durumu',
            icon: require('../../../assets/images/reports/stethoscopeicon.png'),
            details: [
                'Sağlık riskleri ve alınması gereken önlemler alındı.',
                'Son sağlık raporları sonuçlandı ve İSG uzmanına iletildi.',
                'Kronik rahatsızlığı olan personel takibi başlatıldı.'
            ]
        },
        {
            id: '3',
            title: 'Performans ve Çalışan Raporu',
            subtitle: 'Çalışan ve departman performansları',
            icon: require('../../../assets/images/reports/performanceicon.png'),
            details: [
                'Aylık üretim verimliliği %12 artış gösterdi.',
                'Personel İSG eğitimlerine katılım %100 sağlandı.',
                'Departman bazlı risk puanlaması yapıldı.'
            ]
        },
        {
            id: '4',
            title: 'Finansal ve Maliyet Raporu',
            subtitle: 'İSG maliyetleri ve harcamalar',
            icon: require('../../../assets/images/reports/dollaricon.png'),
            details: [
                'Yeni koruyucu donanım bütçesi onaylandı.',
                'Aylık İSG giderleri geçen aya göre %5 optimize edildi.',
                'Yıllık bakım bütçesi revize edildi.'
            ]
        },
        {
            id: '5',
            title: 'İş Sağlığı ve Güvenliği Raporu',
            subtitle: 'İSG ihlalleri ve analizi',
            icon: require('../../../assets/images/reports/secureicon.png'),
            details: [
                'Tesis içi kişisel koruyucu donanım kullanımı %98 oranında.',
                'Hatalı ekipman kullanımı nedeniyle 2 uyarı verildi.',
                'Yılın ilk yarısı güvenlik puanı: 9.2/10'
            ]
        },
        {
            id: '6',
            title: 'Arşivlenmiş Raporlar',
            subtitle: 'Eski rapor kayıtları',
            icon: require('../../../assets/images/reports/documenticon.png'),
            details: [
                '2024 yılına ait tüm sağlık verileri arşivlendi.',
                'Eski denetim raporları PDF formatında hazırlandı.'
            ]
        }
    ];

    const toggleItem = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={colors.text.main} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Raporlar</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
            >
                {reportData.map((item) => (
                    <ReportItem 
                        key={item.id}
                        item={item}
                        isExpanded={expandedId === item.id}
                        onToggle={() => toggleItem(item.id)}
                        styles={styles}
                        colors={colors}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default ReportsScreen;