// app/styles/theme/colors.js

// Ortak Renkler (Her iki modda da değişmeyenler)
const common = {
    primary: {
        main: '#4870FF',
        contrast: '#FFFFFF',
    },
    secondary: {
        main: '#FF9F47',
        contrast: '#FFFFFF',
    },
    status: {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
    }
};

export const lightColors = {
    ...common,
    mode: 'light',
    primary: { ...common.primary, light: '#E7EFFF' },
    secondary: { ...common.secondary, light: '#FFF4E6' },
    
    background: {
        default: '#ffffffff', // Açık Gri/Beyaz
        card: '#FFFFFF',
        modal: '#FFFFFF',
    },
    text: {
        main: '#1F2937',     // Koyu Gri
        secondary: '#6B7280', // Orta Gri
        inverse: '#FFFFFF',   // Ters renk (Beyaz)
    },
    neutral: {
        input: '#F5F7FA',
        border: '#E5E7EB',
        white: '#FFFFFF',
        gray: { 100: '#F3F4F6', 200: '#E5E7EB', 300: '#D1D5DB' }
    },
    // Dashboard'a özel (Light Mod: Pastel Arka Planlar)
    dashboard: {
        red: '#FF4D4D',
        cardTemp: '#FF8A8A', // Kartın arka planı
        cardHum: '#A0D8EF',
        cardNoise: '#8FE7A3',
        cardLight: '#FFE57F',
        textValue: '#333333', // Kart içindeki yazı rengi
        green: '#4CD964'
    },
      profile: {
        card1: '#FFD1D1', // Kırmızımsı (Sağlık)
        card2: '#FFF5E1', // Turuncu (Düzenle)
        card3: '#D1D1FF', // Mor (Geri Bildirim)
        card4: '#D1F5FF', // Mavi (SSS)
        card5: '#D1FFD1', // Yeşil (Hakkımızda)
        card6: '#FFD1F5', // Pembe (Davet)
        card7: '#fff3bbff', // Pembe (Davet)
        text1: '#FF4D4D',
        text2: '#FF9F47',
        text3: '#8E44AD',
        text4: '#4870FF',
        text5: '#27AE60',
        text6: '#E91E63',
        text7: '#d9af06ff',
    }
};

export const darkColors = {
    ...common,
    mode: 'dark',
    primary: { ...common.primary, light: 'rgba(72, 112, 255, 0.2)' }, // Saydam Mavi
    secondary: { ...common.secondary, light: 'rgba(255, 159, 71, 0.2)' }, // Saydam Turuncu

    background: {
        default: '#121212', // Simsiyah
        card: '#1E1E1E',    // Koyu Gri Kart
        modal: '#1E1E1E',
    },
    text: {
        main: '#FFFFFF',      // Beyaz
        secondary: '#AAAAAA', // Açık Gri
        inverse: '#121212',   // Ters renk (Siyah)
    },
    neutral: {
        input: '#2C2C2C',
        border: '#333333',
        white: '#1E1E1E', // Dark modda "beyaz" alanlar koyu olur
        gray: { 100: '#333333', 200: '#444444', 300: '#555555' }
    },
    // Dashboard'a özel (Dark Mod: Koyu Kart + Neon Yazı)
    dashboard: {
        red: '#FF5252',
        cardTemp: '#1E1E1E', // Kart arka planı koyu
        cardHum: '#1E1E1E',
        cardNoise: '#1E1E1E',
        cardLight: '#1E1E1E',
         green: '#69F0AE',
        textValue: '#FFFFFF', // Neon renkler kod içinde verilecek, burası base yazı
    },
       profile: {
        // Dark modda kartlar koyu gri, yazılar ve ikonlar neon olur
        card1: '#1E1E1E',
        card2: '#1E1E1E',
        card3: '#1E1E1E',
        card4: '#1E1E1E',
        card5: '#1E1E1E',
        card6: '#1E1E1E',
        text1: '#FF5252', // Neon Kırmızı
        text2: '#FFAB40', // Neon Turuncu
        text3: '#B388FF', // Neon Mor
        text4: '#40C4FF', // Neon Mavi
        text5: '#69F0AE', // Neon Yeşil
        text6: '#FF4081', // Neon Pembe
    }
};