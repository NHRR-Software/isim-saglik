// app/screens/onboardingPages/BottomContainer.js

import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Paginator from './Paginator';
// styles prop olarak geliyor parent'tan

export default function BottomContainer({ scrollX, currentIndex, scrollTo, finishOnboarding, styles }) {
  const data = [1, 2, 3]; // Slide sayısı kadar dummy data veya props'tan slides gelebilir
  const isLastSlide = currentIndex === 2; // Slide sayısı - 1

  return (
    <View style={styles.bottomContainer}>
      {/* Slide verisi burada Paginator için gerekli, yukarıdaki data örnektir. 
          Normalde slides'ı prop olarak geçmelisin. 
          Aşağıdaki data={data} kısmını slides arrayin ile değiştir. */}
      <Paginator data={[1,2,3]} scrollX={scrollX} />
      
      <View style={styles.buttonWrapper}>
        {!isLastSlide ? (
             <TouchableOpacity
             style={[styles.button, styles.secondaryButton]}
             onPress={finishOnboarding}
           >
             <Text style={[styles.buttonText, styles.secondaryButtonText]}>Atla</Text>
           </TouchableOpacity>
        ) : (
             <View style={{ minWidth: 100 }} /> 
        )}
       
        {isLastSlide ? (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={finishOnboarding}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>Başla</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={scrollTo}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>İleri</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}