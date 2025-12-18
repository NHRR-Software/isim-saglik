import React from 'react';
import { View, useWindowDimensions, Animated } from 'react-native';
import styles from './styles';
import { colors } from '../../styles/theme/colors';

export default function Paginator({ data, scrollX }) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.paginatorContainer}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        // YENİ AYAR:
        // Pasifken 16 (tam yuvarlak), Aktifken 50 (geniş hap)
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [16, 50, 16], 
          extrapolate: 'clamp',
        });

        const dotColor = scrollX.interpolate({
            inputRange,
            // Pasif: Gri, Aktif: Turuncu
            outputRange: [styles.dot.backgroundColor, colors.secondary.main, styles.dot.backgroundColor], 
            extrapolate: 'clamp',
        });

        return (
          <Animated.View 
            style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]} 
            key={i.toString()} 
          />
        );
      })}
    </View>
  );
}