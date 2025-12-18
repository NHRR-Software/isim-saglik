/**
 * Styles Index
 * Tüm stil dosyalarını tek bir yerden export eder
 */

export { colors } from './theme/colors';
export { spacing } from './spacing';
export { typography } from './typography';
export { reset } from './reset';

// Varsayılan export
export default {
  colors: require('./theme/colors').colors,
  spacing: require('./spacing').spacing,
  typography: require('./typography').typography,
  reset: require('./reset').reset,
};
