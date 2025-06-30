import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, BookOpen } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';

export default function QuickStartSection() {
  const navigateToScanner = () => {
    Speech.speak('Opening AI Scanner', { rate: 0.8 });
    router.push('/(tabs)/scanner');
  };

  const navigateToGuide = () => {
    Speech.speak('Opening User Guide', { rate: 0.8 });
    router.push('/(tabs)/guide');
  };

  return (
    <View style={styles.quickStartSection}>
      <Text style={styles.sectionTitle}>Get Started</Text>
      <Text style={styles.sectionSubtitle}>
        Begin your journey to visual independence
      </Text>

      <View style={styles.quickStartCards}>
        <TouchableOpacity 
          style={styles.quickStartCard}
          onPress={navigateToScanner}
          accessibilityLabel="Start scanning with AI vision"
          accessibilityHint="Double tap to open the camera scanner"
        >
          <LinearGradient
            colors={['#00D4FF', '#0099CC']}
            style={styles.quickStartGradient}
          >
            <Camera size={32} color="white" strokeWidth={2.5} />
            <Text style={styles.quickStartTitle}>Start Scanning</Text>
            <Text style={styles.quickStartDescription}>
              Point your camera and let AI describe your world
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickStartCard}
          onPress={navigateToGuide}
          accessibilityLabel="Learn about app features"
          accessibilityHint="Double tap to open the user guide"
        >
          <LinearGradient
            colors={['#4ECDC4', '#3EA39A']}
            style={styles.quickStartGradient}
          >
            <BookOpen size={32} color="white" strokeWidth={2.5} />
            <Text style={styles.quickStartTitle}>Learn Features</Text>
            <Text style={styles.quickStartDescription}>
              Explore our comprehensive user guide
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quickStartSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8B9DC3',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  quickStartCards: {
    gap: 16,
  },
  quickStartCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickStartGradient: {
    padding: 24,
    alignItems: 'center',
  },
  quickStartTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  quickStartDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
});