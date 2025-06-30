import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';

interface ResultsDisplayProps {
  lastDescription: string;
  isScanning: boolean;
}

export default function ResultsDisplay({ lastDescription, isScanning }: ResultsDisplayProps) {
  const speak = (text: string) => {
    Speech.speak(text, {
      rate: 0.8,
      pitch: 1.0,
    });
  };

  if (!lastDescription || isScanning) return null;

  return (
    <View style={styles.resultsContainer}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.7)']}
        style={styles.resultsGradient}
      >
        <Text style={styles.resultsTitle}>AI Analysis Result</Text>
        <Text style={styles.resultsText}>{lastDescription}</Text>
        <TouchableOpacity
          style={styles.repeatButton}
          onPress={() => speak(lastDescription)}
          accessibilityLabel="Repeat last description"
        >
          <Volume2 size={18} color="white" strokeWidth={2.5} />
          <Text style={styles.repeatButtonText}>Repeat</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  resultsContainer: {
    position: 'absolute',
    top: 160,
    left: 16,
    right: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  resultsGradient: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#00D4FF',
    marginBottom: 12,
  },
  resultsText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: 'white',
    lineHeight: 22,
    marginBottom: 16,
  },
  repeatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D4FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  repeatButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
});