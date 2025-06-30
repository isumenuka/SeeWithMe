import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import * as Speech from 'expo-speech';

interface VoiceInstructionsProps {
  instructions: string[];
  title?: string;
}

export default function VoiceInstructions({ instructions, title = "Instructions" }: VoiceInstructionsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakInstructions = () => {
    setIsSpeaking(true);
    const fullText = `${title}. ${instructions.join('. ')}`;
    Speech.speak(fullText, {
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
      rate: 0.6,
      pitch: 1.0,
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  return (
    <TouchableOpacity
      style={[styles.instructionButton, isSpeaking && styles.instructionButtonActive]}
      onPress={isSpeaking ? stopSpeaking : speakInstructions}
      accessibilityLabel={isSpeaking ? 'Stop instructions' : 'Hear instructions'}
      accessibilityRole="button"
      accessibilityHint="Double tap to hear detailed instructions for this screen"
    >
      {isSpeaking ? (
        <VolumeX size={20} color="white" strokeWidth={2.5} />
      ) : (
        <Volume2 size={20} color="#00D4FF" strokeWidth={2.5} />
      )}
      <Text style={[styles.instructionText, isSpeaking && styles.instructionTextActive]}>
        {isSpeaking ? 'Stop' : 'Help'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  instructionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00D4FF',
    minHeight: 48,
    minWidth: 80,
  },
  instructionButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#00D4FF',
    marginLeft: 8,
  },
  instructionTextActive: {
    color: 'white',
  },
});