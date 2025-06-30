import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import * as Speech from 'expo-speech';
import { Settings as SettingsIcon, Volume2, Mic, Zap, Globe, Shield, CircleHelp as HelpCircle, Info, ChevronRight } from 'lucide-react-native';
import VoiceNavigator from '@/components/accessibility/VoiceNavigator';
import VoiceInstructions from '@/components/accessibility/VoiceInstructions';

type SettingItem = {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'button' | 'info';
  icon: any;
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
};

const SETTINGS_INSTRUCTIONS = [
  'This is the settings screen where you can customize SeeWithMe',
  'Toggle switches to enable or disable features',
  'Tap buttons to access additional options',
  'All settings are designed for accessibility and ease of use',
  'Changes are saved automatically',
];

export default function SettingsScreen() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(true);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.6);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const speak = (text: string) => {
    Speech.speak(text, {
      rate: speechRate,
      pitch: 1.0,
    });
  };

  const showLanguageOptions = () => {
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese'];
    
    Alert.alert(
      'Select Language',
      'Choose your preferred language for voice output',
      languages.map(lang => ({
        text: lang,
        onPress: () => {
          setSelectedLanguage(lang);
          speak(`Language changed to ${lang}`);
        },
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const showSpeechRateOptions = () => {
    const rates = [
      { label: 'Very Slow (0.4x)', value: 0.4 },
      { label: 'Slow (0.6x)', value: 0.6 },
      { label: 'Normal (0.8x)', value: 0.8 },
      { label: 'Fast (1.0x)', value: 1.0 },
    ];
    
    Alert.alert(
      'Speech Rate',
      'Choose how fast the voice should speak',
      rates.map(rate => ({
        text: rate.label,
        onPress: () => {
          setSpeechRate(rate.value);
          Speech.speak('This is how fast I will speak', { rate: rate.value });
        },
      })).concat([{ text: 'Cancel', style: 'cancel' }])
    );
  };

  const showAboutInfo = () => {
    const aboutText = 'SeeWithMe v1.0.0. An AI-powered visual companion designed specifically for visually impaired users. Built with privacy-first offline AI technology for independence and confidence.';
    
    Alert.alert('About SeeWithMe', aboutText);
    speak(aboutText);
  };

  const showPrivacyInfo = () => {
    const privacyText = 'Your privacy is our highest priority. SeeWithMe processes all data locally on your device. No images or personal information are sent to external servers. All AI processing happens offline for complete privacy.';
    
    Alert.alert('Privacy Policy', privacyText);
    speak(privacyText);
  };

  const settings: SettingItem[] = [
    {
      id: 'voice-feedback',
      title: 'Voice Feedback',
      description: 'Enable spoken descriptions and responses',
      type: 'toggle',
      icon: Volume2,
      value: voiceEnabled,
      onToggle: (value) => {
        setVoiceEnabled(value);
        speak(value ? 'Voice feedback enabled' : 'Voice feedback disabled');
      },
    },
    {
      id: 'voice-commands',
      title: 'Voice Commands',
      description: 'Enable hands-free voice control',
      type: 'toggle',
      icon: Mic,
      value: voiceCommandsEnabled,
      onToggle: (value) => {
        setVoiceCommandsEnabled(value);
        speak(value ? 'Voice commands enabled' : 'Voice commands disabled');
      },
    },
    {
      id: 'auto-scan',
      title: 'Auto Scan',
      description: 'Automatically scan when camera is opened',
      type: 'toggle',
      icon: Zap,
      value: autoScanEnabled,
      onToggle: (value) => {
        setAutoScanEnabled(value);
        speak(value ? 'Auto scan enabled' : 'Auto scan disabled');
      },
    },
    {
      id: 'language',
      title: 'Language',
      description: `Current: ${selectedLanguage}`,
      type: 'button',
      icon: Globe,
      onPress: showLanguageOptions,
    },
    {
      id: 'speech-rate',
      title: 'Speech Rate',
      description: `Current: ${speechRate === 0.4 ? 'Very Slow' : speechRate === 0.6 ? 'Slow' : speechRate === 0.8 ? 'Normal' : 'Fast'}`,
      type: 'button',
      icon: Volume2,
      onPress: showSpeechRateOptions,
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'Learn about data privacy and security',
      type: 'button',
      icon: Shield,
      onPress: showPrivacyInfo,
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help using SeeWithMe',
      type: 'button',
      icon: HelpCircle,
      onPress: () => speak('Visit the Guide tab for detailed instructions on using SeeWithMe features.'),
    },
    {
      id: 'about',
      title: 'About SeeWithMe',
      description: 'App version and information',
      type: 'button',
      icon: Info,
      onPress: showAboutInfo,
    },
  ];

  return (
    <VoiceNavigator 
      screenName="Settings" 
      instructions="Configure your SeeWithMe preferences. Toggle switches to enable features or tap buttons for more options."
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerActions}>
            <VoiceInstructions 
              instructions={SETTINGS_INSTRUCTIONS}
              title="Settings Guide"
            />
            
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => speak('Settings screen. Configure your SeeWithMe preferences here.')}
              accessibilityLabel="Test voice output"
              accessibilityRole="button"
            >
              <Volume2 size={20} color="#4ECDC4" strokeWidth={2.5} />
              <Text style={styles.testButtonText}>Test</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Settings options"
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Audio & Voice</Text>
            {settings.slice(0, 5).map((setting) => (
              <SettingRow key={setting.id} setting={setting} />
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy & Support</Text>
            {settings.slice(5).map((setting) => (
              <SettingRow key={setting.id} setting={setting} />
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              SeeWithMe is designed specifically for visually impaired users. All features work offline to protect your privacy and ensure reliable performance.
            </Text>
          </View>
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </VoiceNavigator>
  );
}

function SettingRow({ setting }: { setting: SettingItem }) {
  const IconComponent = setting.icon;
  
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={setting.onPress}
      accessibilityLabel={`${setting.title}. ${setting.description}`}
      accessibilityRole={setting.type === 'toggle' ? 'switch' : 'button'}
      accessibilityHint={setting.type === 'toggle' ? 'Double tap to toggle' : 'Double tap to open'}
      disabled={setting.type === 'toggle'}
    >
      <View style={styles.settingIcon}>
        <IconComponent size={24} color="#4ECDC4" strokeWidth={2.5} />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{setting.title}</Text>
        <Text style={styles.settingDescription}>{setting.description}</Text>
      </View>
      
      <View style={styles.settingAction}>
        {setting.type === 'toggle' && setting.onToggle ? (
          <Switch
            value={setting.value}
            onValueChange={setting.onToggle}
            trackColor={{ false: '#374151', true: '#4ECDC4' }}
            thumbColor={setting.value ? '#1F2937' : '#9CA3AF'}
            accessibilityLabel={`${setting.title} ${setting.value ? 'enabled' : 'disabled'}`}
          />
        ) : setting.type === 'button' ? (
          <ChevronRight size={20} color="#9CA3AF" strokeWidth={2.5} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4ECDC4',
    minHeight: 48,
  },
  testButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4ECDC4',
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#4ECDC4',
    marginBottom: 16,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    minHeight: 80,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 20,
  },
  settingAction: {
    marginLeft: 16,
  },
  footer: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    lineHeight: 22,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 120,
  },
});