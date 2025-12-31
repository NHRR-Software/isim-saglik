import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { createAboutStyles } from './styles';
import TeamCard from './TeamCard';
import CustomHeader from '../../../components/ui/CustomHeader';

const AboutScreen = () => {
    const { colors, theme } = useTheme();
    const router = useRouter();
    const styles = useMemo(() => createAboutStyles(colors, theme), [colors, theme]);

    const teamData = [
        {
            id: '1',
            name: 'Hamza Ali DOĞAN',
            role: 'Proje Ekibi',
            image: require('../../../assets/images/aboutus/hamza.jpg'), 
            github: 'https://github.com/HamzaDogann',
            linkedin: 'https://www.linkedin.com/in/hamzadogann/'
        },
        {
            id: '2',
            name: 'Ramazan YİĞİT',
            role: 'Proje Ekibi',
            image: require('../../../assets/images/aboutus/ramazan.png'),
            github: 'https://github.com/ramazanyigit18',
            linkedin: 'https://www.linkedin.com/in/ramazanyiğit/'
        },
        {
            id: '3',
            name: 'Rabia YAZLI',
            role: 'Proje Ekibi',
            image: require('../../../assets/images/aboutus/rabia.jpg'),
            github: 'https://github.com/rabiay34',
            linkedin: 'https://www.linkedin.com/in/rabiayazlı34/'
        },
        {
            id: '4',
            name: 'Nazmi KOÇAK',
            role: 'Proje Ekibi',
            image: require('../../../assets/images/aboutus/nazmi.jpg'), 
            github: 'https://github.com/nazmikocak',
            linkedin: 'https://www.linkedin.com/in/nazmikocak/'
        }
    ];

    return (
        <View style={styles.container}>
       <CustomHeader title="Hakkımızda" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.aboutBox}>
                    <Text style={styles.aboutText}>
                        Bu uygulama, çalışanların sağlık verilerini ve iş ortamındaki riskleri 
                        gerçek zamanlı izleyerek güvenli çalışma koşullarını desteklemek amacıyla 
                        geliştirilmiştir. Bileklik sensörlerinden alınan nabız, sıcaklık ve çevresel 
                        ölçümler anında değerlendirilir; olası tehlikelerde çalışan ve İSG uzmanı 
                        hızlıca bilgilendirilir. Proje, iş kazalarını azaltmak ve risk yönetimini 
                        dijitalleştirmek için hazırlanmıştır.
                    </Text>
                </View>

                {/* Proje Ekibi Başlığı */}
                <Text style={styles.sectionTitle}>Proje Ekibi</Text>

                <View style={styles.teamGrid}>
                    {teamData.map((member) => (
                        <TeamCard 
                            key={member.id} 
                            item={member} 
                            styles={styles} 
                            colors={colors} 
                        />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default AboutScreen;