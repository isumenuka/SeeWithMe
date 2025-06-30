import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  RotateCcw,
  Zap,
  Square,
} from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import VoiceNavigator from '@/components/accessibility/VoiceNavigator';
import VoiceInstructions from '@/components/accessibility/VoiceInstructions';
import AccessibleButton from '@/components/accessibility/AccessibleButton';
import { AIVisionService } from '@/components/ai/AIVisionService';
import { VoiceCommandService } from '@/components/scanner/VoiceCommands';
import { useVolumeButtons } from '@/hooks/useVolumeButtons';

type ScanMode = 'objects' | 'text' | 'faces' | 'navigation';

const SCANNER_INSTRUCTIONS = [
  'This is the AI Vision Scanner',
  'Select a scanning mode: Objects, Text, Faces, or Navigation',
  'Point your camera at what you want to analyze',
  'Press the volume up button to start AI analysis',
  'Results will be spoken automatically',
  'Use voice commands by tapping the microphone button or with volume buttons',
  'Say scan to start, stop to end, or repeat to hear results again',
];

const SCAN_MODES = [
  { key: 'objects' as const, label: 'Objects', color: '#00D4FF' },
  { key: 'text' as const, label: 'Text', color: '#FF6B6B' },
  { key: 'faces' as const, label: 'Faces', color: '#4ECDC4' },
  { key: 'navigation' as const, label: 'Navigate', color: '#FFE66D' },
];

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>('objects');
  const [lastDescription, setLastDescription] = useState('');
  const [scanCount, setScanCount] = useState(0);

  const scanPulse = useSharedValue(1);
  const scanRing = useSharedValue(0);
  const modeIndicator = useSharedValue(0);
  const scanRef = useRef<NodeJS.Timeout>();
  const aiService = AIVisionService.getInstance();
  const voiceService = VoiceCommandService.getInstance();

  useVolumeButtons(
    () => {
      if (!isScanning) {
        startScanning();
      }
    },
    () => {
      if (isScanning) {
        stopScanning();
      }
    }
  );

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const speak = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
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

  const startScanning = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setScanCount(prev => prev + 1);
    triggerHaptic();
    
    scanPulse.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      false
    );

    scanRing.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      false
    );

    speak(`Starting ${scanMode} analysis with AI vision. Please hold steady.`);

    try {
      // In production, this would capture the camera image
      const mockImageUri = 'mock://camera-capture';
      const result = await aiService.analyzeImage(mockImageUri, scanMode);
      
      setLastDescription(result.description);
      speak(`Analysis complete. Confidence ${result.confidence} percent. ${result.description}`);
    } catch (error) {
      speak('Analysis failed. Please try again.');
    } finally {
      setIsScanning(false);
      scanPulse.value = withTiming(1);
      scanRing.value = withTiming(0);
    }
  };

  const stopScanning = () => {
    if (scanRef.current) {
      clearTimeout(scanRef.current);
    }
    setIsScanning(false);
    scanPulse.value = withTiming(1);
    scanRing.value = withTiming(0);
    triggerHaptic();
    speak('Scan stopped');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    triggerHaptic();
    
    if (!isListening) {
      voiceService.registerCommands([
        {
          command: 'scan',
          action: startScanning,
          description: 'Start AI scanning',
        },
        {
          command: 'stop',
          action: stopScanning,
          description: 'Stop current scan',
        },
        {
          command: 'repeat',
          action: () => lastDescription && speak(lastDescription),
          description: 'Repeat last result',
        },
      ]);
      voiceService.startListening();
    } else {
      voiceService.stopListening();
    }
  };

  const changeScanMode = (mode: ScanMode) => {
    setScanMode(mode);
    triggerHaptic();
    
    modeIndicator.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );
    
    const modeDescriptions = {
      objects: 'Objects and scenes mode selected. Point camera at objects, furniture, or environments for detailed descriptions.',
      text: 'Text reading mode selected. Point camera at signs, menus, documents, or any text to have it read aloud.',
      faces: 'Face detection mode selected. Point camera toward people to detect faces and emotions.',
      navigation: 'Navigation mode selected. Point camera ahead to get spatial awareness and obstacle information.',
    };
    
    speak(modeDescriptions[mode]);
  };

  const animatedScanStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scanPulse.value }],
  }));

  const animatedRingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scanRing.value, [0, 0.5, 1], [0.3, 0.8, 0.3]),
    transform: [
      { scale: interpolate(scanRing.value, [0, 1], [1, 1.5]) }
    ],
  }));

  const animatedModeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + modeIndicator.value * 0.1 }],
  }));

  useEffect(() => {
    return () => {
      if (scanRef.current) {
        clearTimeout(scanRef.current);
      }
      Speech.stop();
    };
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Initializing camera...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <VoiceNavigator 
        screenName="Camera Permission Required" 
        instructions="SeeWithMe needs camera access to analyze your surroundings and provide visual assistance. Tap Enable Camera to grant permission."
      >
        <View style={styles.container}>
          <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.permissionContainer}>
            <Camera size={64} color="#00D4FF" strokeWidth={1.5} />
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionText}>
              SeeWithMe needs camera access to analyze your surroundings and provide visual assistance
            </Text>
            
            <AccessibleButton
              title="Enable Camera"
              description="Grant camera permission to start using AI vision"
              onPress={requestPermission}
              style={styles.permissionButton}
            />
          </LinearGradient>
        </View>
      </VoiceNavigator>
    );
  }

  return (
    <VoiceNavigator 
      screenName="AI Vision Scanner" 
      instructions="Camera is ready. Select a scanning mode and press the volume up button to analyze your surroundings."
    >
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing}>
          <LinearGradient
            colors={['rgba(15, 15, 35, 0.9)', 'transparent']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>AI Vision Scanner</Text>
              <View style={styles.headerActions}>
                <VoiceInstructions 
                  instructions={SCANNER_INSTRUCTIONS}
                  title="Scanner Instructions"
                />
                
                <TouchableOpacity
                  style={[styles.headerButton, isSpeaking && styles.headerButtonActive]}
                  onPress={isSpeaking ? stopSpeaking : () => speak('AI Vision Scanner ready. Select a scanning mode and press volume up to start scanning.')}
                  accessibilityLabel={isSpeaking ? 'Stop speaking' : 'Speak instructions'}
                  accessibilityRole="button"
                >
                  {isSpeaking ? (
                    <VolumeX size={20} color="white" strokeWidth={2.5} />
                  ) : (
                    <Volume2 size={20} color="white" strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* Scan Mode Selector */}
          <View style={styles.modeSelector}>
            {SCAN_MODES.map((mode) => {
              const isActive = scanMode === mode.key;
              
              return (
                <Animated.View key={mode.key} style={animatedModeStyle}>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      isActive && { backgroundColor: mode.color }
                    ]}
                    onPress={() => changeScanMode(mode.key)}
                    accessibilityLabel={`Switch to ${mode.label} scanning mode`}
                  >
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

          {/* Scanning Overlay */}
          {isScanning && (
            <View style={styles.scanningOverlay}>
              <Animated.View style={[styles.scanningRing, animatedRingStyle]} />
              <Animated.View style={[styles.scanningCenter, animatedScanStyle]}>
                <Zap size={32} color="white" strokeWidth={2.5} />
              </Animated.View>
              <Text style={styles.scanningText}>AI Processing...</Text>
              <Text style={styles.scanningSubtext}>Analyzing visual data</Text>
            </View>
          )}

          {/* Results Display */}
          {lastDescription && !isScanning && (
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
          )}

          <LinearGradient
            colors={['transparent', 'rgba(15, 15, 35, 0.9)']}
            style={styles.bottomControls}
          >
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={[styles.controlButton, isListening && styles.controlButtonActive]}
                onPress={toggleListening}
                accessibilityLabel={isListening ? 'Disable voice commands' : 'Enable voice commands'}
                accessibilityRole="button"
                accessibilityHint="Toggle voice command recognition"
              >
                {isListening ? (
                  <Mic size={24} color="#0F0F23" strokeWidth={2.5} />
                ) : (
                  <MicOff size={24} color="white" strokeWidth={2.5} />
                )}
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => {
                  setFacing(current => (current === 'back' ? 'front' : 'back'));
                  speak(facing === 'back' ? 'Switched to front camera' : 'Switched to back camera');
                }}
                accessibilityLabel="Switch camera"
                accessibilityRole="button"
                accessibilityHint="Toggle between front and back camera"
              >
                <RotateCcw size={24} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <Text style={styles.scanCounter} accessibilityLabel={`${scanCount} scans performed`}>
              Scans performed: {scanCount}
            </Text>
          </LinearGradient>
        </CameraView>
      </View>
    </VoiceNavigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8B9DC3',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
    minWidth: 200,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonActive: {
    backgroundColor: '#FF6B6B',
  },
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
    minHeight: 48,
  },
  modeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
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
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingTop: 20,
    paddingHorizontal: 32,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 50,
    minWidth: 56,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#00D4FF',
  },
  scanButton: {
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonActive: {
    shadowColor: '#FF6B6B',
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    minWidth: 120,
    justifyContent: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
  scanCounter: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8B9DC3',
    textAlign: 'center',
  },
});