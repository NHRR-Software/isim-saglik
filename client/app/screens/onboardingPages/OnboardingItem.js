// app/screens/onboardingPages/OnboardingItem.js

import React, { useEffect, useRef } from 'react';
import { View, Text, useWindowDimensions, Animated } from 'react-native';

// styles prop olarak geliyor
const OnboardingItem = ({ item, index, currentIndex, styles }) => {
  const { width } = useWindowDimensions();
  const animValue = useRef(new Animated.Value(0)).current;

  const isActive = index === currentIndex;

  useEffect(() => {
    if (isActive) {
      animValue.setValue(0);
      Animated.spring(animValue, {
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
    outputRange: [50, 0],
  });

  const animatedStyle = {
    opacity,
    transform: [{ translateY }],
  };

  return (
    <View style={[styles.itemContainer, { width }]}>
      <Animated.Image
        source={item.image}
        style={[styles.image]}
      />

      <Animated.View style={[styles.textContainer, animatedStyle]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

export default OnboardingItem;