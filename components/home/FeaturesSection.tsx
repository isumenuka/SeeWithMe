import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import {
  Camera,
  ScanText,
  Users,
  Navigation,
  ArrowRight,
  Globe,
  Shield,
  Mic,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FEATURES = [
  {
    id: 'objects',
    title: 'Smart Vision',
    description: 'AI-powered object and scene recognition with detailed descriptions',
    icon: Camera,
    color: '#00D4FF',
    gradient: ['#00D4FF', '#0099CC'],
  },
  {
    id: 'text',
    title: 'Text Reader',
    description: 'Read any text aloud instantly with OCR technology',
    icon: ScanText,
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#CC5555'],
  },
  {
    id: 'faces',
    title: 'Face Recognition',
    description: 'Detect people and emotions for social awareness',
    icon: Users,
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#3EA39A'],
  },
  {
    id: 'navigation',
    title: 'Navigation Aid',
    description: 'Indoor spatial awareness and obstacle detection',
    icon: Navigation,
    color: '#FFE66D',
    gradient: ['#FFE66D', '#CCB857'],
  },
  {
    id: 'multilingual',
    title: 'Multilingual',
    description: 'Supports 50+ languages with offline translation',
    icon: Globe,
    color: '#9B59B6',
    gradient: ['#9B59B6', '#8E44AD'],
  },
  {
    id: 'privacy',
    title: 'Privacy First',
    description: 'All processing happens offline on your device',
    icon: Shield,
    color: '#2ECC71',
    gradient: ['#2ECC71', '#27AE60'],
  },
  {
    id: 'voice',
    title: 'Voice Commands',
    description: 'Hands-free control with natural voice commands',
    icon: Mic,
    color: '#E74C3C',
    gradient: ['#E74C3C', '#C0392B'],
  },
];

export default function FeaturesSection() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const floatAnimation = useSharedValue(0);

  const speak = (text: string) => {
    Speech.speak(text, {
      rate: 0.6,
      pitch: 1.0,
    });
  };

  useEffect(() => {
    floatAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 3000 })
      ),
      -1,
      false
    );

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % FEATURES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const animatedFloatStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(floatAnimation.value, [0, 1], [0, -8]),
      },
    ],
  }));

  return (
    <View style={styles.featuresSection}>
      <Text style={styles.sectionTitle}>Powerful Features</Text>
      <Text style={styles.sectionSubtitle}>
        Advanced AI technology designed specifically for accessibility
      </Text>

      <View style={styles.featuresGrid}>
        {FEATURES.map((feature, index) => {
          const IconComponent = feature.icon;
          const isActive = currentFeature === index;
          
          return (
            <Animated.View
              key={feature.id}
              style={[
                styles.featureCard,
                isActive && styles.featureCardActive,
                animatedFloatStyle,
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setCurrentFeature(index);
                  speak(`${feature.title}. ${feature.description}`);
                }}
                accessibilityLabel={`${feature.title}: ${feature.description}`}
                accessibilityHint="Double tap to hear more about this feature"
              >
                <LinearGradient
                  colors={isActive ? feature.gradient : ['#1A1A3A', '#2D2D5F']}
                  style={styles.featureCardGradient}
                >
                  <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                    <IconComponent size={24} color="white" strokeWidth={2.5} />
                  </View>
                  
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  
                  <View style={styles.featureAction}>
                    <ArrowRight size={16} color={isActive ? 'white' : '#8B9DC3'} strokeWidth={2.5} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
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
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    width: (width - 64) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  featureCardActive: {
    transform: [{ scale: 1.02 }],
  },
  featureCardGradient: {
    padding: 20,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B8C5E8',
    lineHeight: 20,
    marginBottom: 16,
  },
  featureAction: {
    alignSelf: 'flex-end',
  },
});