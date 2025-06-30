import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import VoiceNavigator from '@/components/accessibility/VoiceNavigator';
import VoiceInstructions from '@/components/accessibility/VoiceInstructions';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StatsSection from '@/components/home/StatsSection';
import QuickStartSection from '@/components/home/QuickStartSection';

const SCREEN_INSTRUCTIONS = [
  'Welcome to SeeWithMe, your AI visual companion',
  'This is the home screen with app overview and features',
  'Swipe up to explore features, or tap the Scanner tab to start using AI vision',
  'Double tap any feature to hear more details',
  'Use the bottom navigation to access Scanner, History, Guide, and Settings',
];

export default function HomeScreen() {
  return (
    <VoiceNavigator 
      screenName="SeeWithMe Home" 
      instructions="Welcome to your AI visual companion. Explore features and start your journey to visual independence."
    >
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Home screen content"
      >
        <VoiceInstructions 
          instructions={SCREEN_INSTRUCTIONS}
          title="Home Screen Guide"
        />
        
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <QuickStartSection />
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </VoiceNavigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  bottomSpacing: {
    height: 120,
  },
});