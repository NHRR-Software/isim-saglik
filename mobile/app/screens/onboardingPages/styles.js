// app/screens/onboardingPages/styles.js

import { StyleSheet, Dimensions } from 'react-native';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';

const { width } = Dimensions.get('window');

// Artık renkleri dışarıdan alıyoruz
export const createOnboardingStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default, // Dinamik
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
    height: width * 0.9,
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
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary.main, // Dinamik
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: colors.text.secondary, // Dinamik
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
    paddingHorizontal: spacing.sm,
  },

  // --- Paginator (Noktalar) ---
  paginatorContainer: {
    flexDirection: 'row',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dot: {
    height: 16,
    borderRadius: 8,
    marginHorizontal: 8, 
    backgroundColor: colors.neutral.gray[300], // Dinamik
  },

  // --- BottomContainer (Butonlar) ---
  bottomContainer: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingBottom: 50,
    paddingTop: spacing.sm,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 130,
  },
  
  primaryButton: {
    backgroundColor: colors.primary.main, // Dinamik
    elevation: 5,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  secondaryButton: {
    backgroundColor: colors.primary.light, // Dinamik
  },
  
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  primaryButtonText: {
    color: colors.primary.contrast, // Dinamik
  },
  secondaryButtonText: {
    color: colors.primary.main, // Dinamik
  },
});