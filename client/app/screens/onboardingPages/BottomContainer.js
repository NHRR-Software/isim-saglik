// app/screens/onboardingPages/BottomContainer.js

import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Paginator from './Paginator';
import styles from './styles';
import slides from './slides';

export default function BottomContainer({ scrollX, currentIndex, scrollTo, finishOnboarding }) {
  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.bottomContainer}>
      {/* Paginator'ı Butonların üzerine koydum, resimdeki düzene uygun */}
      <Paginator data={slides} scrollX={scrollX} />
      
      <View style={styles.buttonWrapper}>
        {/* Sol Buton: Sadece son slayt değilse ATLA göster */}
        {!isLastSlide ? (
             <TouchableOpacity
             style={[styles.button, styles.secondaryButton]}
             onPress={finishOnboarding}
           >
             <Text style={[styles.buttonText, styles.secondaryButtonText]}>Atla</Text>
           </TouchableOpacity>
        ) : (
             // Son slaytta sol taraf boş kalsın veya geri butonu olabilir, 
             // Tasarımda genelde boş bırakılır veya Atla kalkar.
             <View style={{ minWidth: 100 }} /> 
        )}
       
        {/* Sağ Buton: İleri veya Başla */}
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