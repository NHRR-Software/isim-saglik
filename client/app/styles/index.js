/**
 * Styles Index
 * Tüm stil dosyalarını tek bir yerden export eder
 */

// Renk paletlerini export ediyoruz
export { lightColors, darkColors } from './theme/colors';

// Sabit değerler
export { spacing } from './spacing';
export { typography } from './typography';

// Stil oluşturucu fonksiyon
export { createResetStyles } from './reset';

// Toplu kullanım için varsayılan export (Opsiyonel)
export default {
  spacing: require('./spacing').spacing,
  typography: require('./typography').typography,
  // Not: colors ve reset artık fonksiyon/dinamik olduğu için 
  // burada static olarak export edilmesi önerilmez.
  // Bileşen içinde useTheme() ile kullanılmalıdır.
};