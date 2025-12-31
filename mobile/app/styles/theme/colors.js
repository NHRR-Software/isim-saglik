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
        cardTemp: '#FF8A8A',
        cardHum: '#A0D8EF',
        cardNoise: '#8FE7A3',
        cardLight: '#FFE57F',
        textValue: '#333333',
    },
    profile: {
        card1: '#FFD1D1',
        card2: '#FFF5E1',
        card3: '#D1D1FF',
        card4: '#D1F5FF',
        card5: '#D1FFD1',
        card6: '#FFD1F5',
        card7: '#ffeac1ff',
        text1: '#FF4D4D',
        text2: '#FF9F47',
        text3: '#8E44AD',
        text4: '#4870FF',
        text5: '#27AE60',
        text6: '#E91E63',
        text7: '#ffb432ff',
    },
    // YENİ: Firma Sayfası İletişim Kartları (Light Mod)
    companyInfo: {
        telephone: '#EAF0FF',
        location: '#FFF2E5',
        mail: '#CAC0FF',
        internet: '#CEF1F9',
    }
};

export const darkColors = {
    ...common,
    mode: 'dark',
    primary: { ...common.primary, light: 'rgba(72, 112, 255, 0.2)' },
    secondary: { ...common.secondary, light: 'rgba(255, 159, 71, 0.2)' },

    background: {
        default: '#121212',
        card: '#1E1E1E',
        modal: '#1E1E1E',
    },
    text: {
        main: '#FFFFFF',
        secondary: '#AAAAAA',
        inverse: '#121212',
    },
    neutral: {
        input: '#2C2C2C',
        border: '#333333',
        white: '#1E1E1E',
        gray: { 100: '#333333', 200: '#444444', 300: '#555555' }
    },
    dashboard: {
        red: '#FF5252',
        cardTemp: '#1E1E1E',
        cardHum: '#1E1E1E',
        cardNoise: '#1E1E1E',
        cardLight: '#1E1E1E',
        textValue: '#FFFFFF',
    },
    profile: {
        card1: '#1E1E1E',
        card2: '#1E1E1E',
        card3: '#1E1E1E',
        card4: '#1E1E1E',
        card5: '#1E1E1E',
        card6: '#1E1E1E',
        text1: '#FF5252',
        text2: '#FFAB40',
        text3: '#B388FF',
        text4: '#40C4FF',
        text5: '#69F0AE',
        text6: '#FF4081',
    },
    // YENİ: Firma Sayfası İletişim Kartları (Dark Mod - Saydam Tasarım)
    companyInfo: {
        telephone: 'rgba(234, 240, 255, 0.15)',
        location: 'rgba(255, 242, 229, 0.15)',
        mail: 'rgba(202, 192, 255, 0.15)',
        internet: 'rgba(206, 241, 249, 0.15)',
    }
};