/**
 * Reset Styles
 * Temel stil sıfırlama ve varsayılan değerler
 * Dinamik tema için fonksiyona çevrildi.
 */

import { StyleSheet } from 'react-native';
import typography from './typography';

// Renkleri parametre olarak alıyoruz
export const createResetStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },

  text: {
    color: colors.text.main, // textBlack -> text.main
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
  },

  heading1: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.main,
    lineHeight: typography.fontSize.xxxl * typography.lineHeight.tight,
  },

  heading2: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.main,
    lineHeight: typography.fontSize.xxl * typography.lineHeight.tight,
  },

  heading3: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.main,
    lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
  },

  paragraph: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.main,
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
  },

  small: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.text.secondary, // lightGray -> text.secondary
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
});