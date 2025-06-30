import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';

interface VoiceNavigatorProps {
  children: React.ReactNode;
  screenName: string;
  instructions: string;
}

export default function VoiceNavigator({ children, screenName, instructions }: VoiceNavigatorProps) {
  const [hasSpokenInstructions, setHasSpokenInstructions] = useState(false);

  useEffect(() => {
    // Announce screen name and instructions when component mounts
    const timer = setTimeout(() => {
      if (!hasSpokenInstructions) {
        Speech.speak(`${screenName}. ${instructions}`, {
          rate: 0.6,
          pitch: 1.0,
        });
        setHasSpokenInstructions(true);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [screenName, instructions, hasSpokenInstructions]);

  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});