// app/screens/onboardingPages/Paginator.js

import React from 'react';
import { View, useWindowDimensions, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; // Hook
import { createOnboardingStyles } from './styles'; // Stil fonksiyonu

export default function Paginator({ data, scrollX }) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const styles = createOnboardingStyles(colors); // Burada stilleri oluşturuyoruz

  return (
    <View style={styles.paginatorContainer}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [16, 50, 16], 
          extrapolate: 'clamp',
        });

        const dotColor = scrollX.interpolate({
            inputRange,
            // Renkleri ThemeContext'ten alıyoruz
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