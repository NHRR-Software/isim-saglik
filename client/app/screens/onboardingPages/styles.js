import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../styles/theme/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // --- OnboardingItem Stilleri ---
  itemContainer: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0, 
  },
  image: {
    width: "100%", 
    height: width * 0.9, // Resmi büyük ve ferah tutuyoruz
    resizeMode: 'contain', 
    marginBottom: spacing.xl,
    borderRadius: 15,
    overflow: 'hidden', 
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg, 
  },
  title: {
    fontSize: 28, // Başlık BÜYÜDÜ
    fontWeight: '800',
    color: colors.primary.main,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 18, // Açıklama BÜYÜDÜ
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
    paddingHorizontal: spacing.sm,
  },

  // --- Paginator (Noktalar) ---
  paginatorContainer: {
    flexDirection: 'row',
    height: 70, // Paginator alanı genişledi
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dot: {
    height: 16, // Nokta yüksekliği ARTTI (Kalınlaştı)
    borderRadius: 8, // Tam yuvarlak olması için height/2
    marginHorizontal: 8, 
    backgroundColor: colors.neutral.gray[300],
  },

  // --- BottomContainer (Butonlar) ---
  bottomContainer: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingBottom: 50, // Alt boşluk arttı
    paddingTop: spacing.sm,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15, // Butonlar arası boşluk (opsiyonel destek için)
  },
  button: {
    paddingVertical: 18, // Buton yüksekliği ARTTI
    paddingHorizontal: 28, // Genişliği ARTTI
    borderRadius: 24, // Daha yumuşak köşeler
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 130, // Minimum genişlik arttı
  },
  
  // Mavi Buton (İleri / Başla)
  primaryButton: {
    backgroundColor: colors.primary.main,
    elevation: 5,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  // Atla Butonu (Açık Mavi Arka Plan)
  secondaryButton: {
    backgroundColor: colors.primary.light, // #E7EFFF rengini buradan alıyor
  },
  
  buttonText: {
    fontSize: 20, // Yazı boyutu BÜYÜDÜ
    fontWeight: '700',
  },
  primaryButtonText: {
    color: colors.primary.contrast,
  },
  secondaryButtonText: {
    color: colors.primary.main, // Yazı rengi Mavi olsun ki açık zemin üstünde okunsun
  },
});