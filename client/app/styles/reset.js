/**
 * Reset Styles
 * Temel stil sıfırlama ve varsayılan değerler
 * SCSS'deki reset.scss benzeri
 */

import { StyleSheet } from 'react-native';
import colors from './theme/colors';
import typography from './typography';

export const reset = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },

  text: {
    color: colors.textBlack,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
  },

  heading1: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textBlack,
    lineHeight: typography.fontSize.xxxl * typography.lineHeight.tight,
  },

  heading2: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textBlack,
    lineHeight: typography.fontSize.xxl * typography.lineHeight.tight,
  },

  heading3: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textBlack,
    lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
  },

  paragraph: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.regular,
    color: colors.textBlack,
    lineHeight: typography.fontSize.md * typography.lineHeight.normal,
  },

  small: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    color: colors.lightGray,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
});

export default reset;
