import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap } from 'lucide-react-native';
import Animated from 'react-native-reanimated';

interface ScanningOverlayProps {
  isScanning: boolean;
  animatedRingStyle: any;
  animatedScanStyle: any;
}

export default function ScanningOverlay({ isScanning, animatedRingStyle, animatedScanStyle }: ScanningOverlayProps) {
  if (!isScanning) return null;

  return (
    <View style={styles.scanningOverlay}>
      <Animated.View style={[styles.scanningRing, animatedRingStyle]} />
      <Animated.View style={[styles.scanningCenter, animatedScanStyle]}>
        <Zap size={32} color="white" strokeWidth={2.5} />
      </Animated.View>
      <Text style={styles.scanningText}>AI Processing...</Text>
      <Text style={styles.scanningSubtext}>Analyzing visual data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  scanningRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#00D4FF',
  },
  scanningCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00D4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scanningText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 8,
  },
  scanningSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B9DC3',
  },
});