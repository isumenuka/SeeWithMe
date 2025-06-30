import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

interface AccessibleButtonProps {
  onPress: () => void;
  title: string;
  description?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  hapticFeedback?: boolean;
  speakOnPress?: boolean;
}

export default function AccessibleButton({
  onPress,
  title,
  description,
  style,
  textStyle,
  children,
  hapticFeedback = true,
  speakOnPress = true,
}: AccessibleButtonProps) {
  const handlePress = () => {
    if (hapticFeedback && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (speakOnPress) {
      Speech.speak(`${title} activated`, { rate: 0.8 });
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
      accessible={true}
    >
      {children || <Text style={[styles.buttonText, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#00D4FF',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    textAlign: 'center',
  },
});