import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Sparkles, Volume2 } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export default function HeroSection() {
  const pulseAnimation = useSharedValue(1);

  const speak = (text: string) => {
    Speech.speak(text, {
      rate: 0.6,
      pitch: 1.0,
    });
  };

  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnimation.value }],
  }));

  return (
    <LinearGradient
      colors={['#0F0F23', '#1A1A3A', '#2D2D5F']}
      style={styles.heroSection}
    >
      <View style={styles.heroContent}>
        <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
          <LinearGradient
            colors={['#00D4FF', '#0099CC']}
            style={styles.logoGradient}
          >
            <Sparkles size={48} color="white" strokeWidth={2} />
          </LinearGradient>
        </Animated.View>
        
        <Text style={styles.heroTitle}>SeeWithMe</Text>
        <Text style={styles.heroSubtitle}>
          Your AI-powered visual companion for independence and confidence
        </Text>
        
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => speak('Welcome to SeeWithMe. Your AI visual companion is ready to help you see the world with confidence and independence.')}
          accessibilityLabel="Welcome message"
          accessibilityHint="Double tap to hear the welcome message"
        >
          <LinearGradient
            colors={['#00D4FF', '#0099CC']}
            style={styles.ctaGradient}
          >
            <Volume2 size={20} color="white" strokeWidth={2.5} />
            <Text style={styles.ctaText}>Hear Welcome</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.heroImageContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.heroImage}
          accessibilityLabel="Person using assistive technology"
        />
        <LinearGradient
          colors={['transparent', 'rgba(15, 15, 35, 0.8)']}
          style={styles.heroImageOverlay}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: height * 0.6,
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 42,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#8B9DC3',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  ctaButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
  heroImageContainer: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
  },
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  heroImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
});