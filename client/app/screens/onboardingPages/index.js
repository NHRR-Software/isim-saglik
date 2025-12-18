// app/screens/onboardingPages/index.js

import React, { useState, useRef } from 'react';
import { View, FlatList, Animated } from 'react-native';
import slides from './slides';
import styles from './styles';
import OnboardingItem from './OnboardingItem';
import BottomContainer from './BottomContainer';

const OnboardingScreen = ({ onFinish }) => { // onFinish prop'u navigation için önemli
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1 && slidesRef.current) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const finishOnboarding = () => {
    console.log("Onboarding Bitti");
    if (onFinish) {
      onFinish();
    }
    // Burada router.replace('/home') gibi bir işlem de yapılabilir.
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item, index }) => (
            <OnboardingItem 
              item={item} 
              index={index} 
              currentIndex={currentIndex} 
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      
      <BottomContainer
        scrollX={scrollX}
        currentIndex={currentIndex}
        scrollTo={scrollTo}
        finishOnboarding={finishOnboarding}
      />
    </View>
  );
};

export default OnboardingScreen;