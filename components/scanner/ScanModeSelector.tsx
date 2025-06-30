import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, ScanText, Users, Navigation } from 'lucide-react-native';
import Animated from 'react-native-reanimated';

type ScanMode = 'objects' | 'text' | 'faces' | 'navigation';

const SCAN_MODES = [
  { key: 'objects' as const, label: 'Objects', icon: Camera, color: '#00D4FF' },
  { key: 'text' as const, label: 'Text', icon: ScanText, color: '#FF6B6B' },
  { key: 'faces' as const, label: 'Faces', icon: Users, color: '#4ECDC4' },
  { key: 'navigation' as const, label: 'Navigate', icon: Navigation, color: '#FFE66D' },
];

interface ScanModeSelectorProps {
  scanMode: ScanMode;
  onModeChange: (mode: ScanMode) => void;
  animatedStyle: any;
}

export default function ScanModeSelector({ scanMode, onModeChange, animatedStyle }: ScanModeSelectorProps) {
  return (
    <View style={styles.modeSelector}>
      {SCAN_MODES.map((mode) => {
        const IconComponent = mode.icon;
        const isActive = scanMode === mode.key;
        
        return (
          <Animated.View key={mode.key} style={animatedStyle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                isActive && { backgroundColor: mode.color }
              ]}
              onPress={() => onModeChange(mode.key)}
              accessibilityLabel={`Switch to ${mode.label} scanning mode`}
            >
              <IconComponent
                size={18}
                color={isActive ? 'white' : mode.color}
                strokeWidth={2.5}
              />
              <Text style={[
                styles.modeButtonText,
                { color: isActive ? 'white' : mode.color }
              ]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  modeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modeButtonText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
    textAlign: 'center',
  },
});