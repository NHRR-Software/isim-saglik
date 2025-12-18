// app/screens/onboardingPages/OnboardingItem.js

import React, { useEffect, useRef } from 'react';
import { View, Text, useWindowDimensions, Animated } from 'react-native';
import styles from './styles';
import { colors } from '../../styles/theme/colors';

const OnboardingItem = ({ item, index, currentIndex }) => {
  const { width } = useWindowDimensions();
  const animValue = useRef(new Animated.Value(0)).current;

  const isActive = index === currentIndex;

  useEffect(() => {
    if (isActive) {
      animValue.setValue(0);
      Animated.spring(animValue, { // Spring daha doğal durur
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      animValue.setValue(0);
    }
  }, [isActive, animValue]);

  const opacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0], // Aşağıdan yukarı gelir
  });

  const animatedStyle = {
    opacity,
    transform: [{ translateY }],
  };

  return (
    <View style={[styles.itemContainer, { width }]}>
      {/* Resim Sabit Kalabilir veya hafif scale olabilir */}
      <Animated.Image
        source={item.image}
        style={[styles.image]}
      />

      {/* Metinler animasyonla gelir */}
      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

export default OnboardingItem;