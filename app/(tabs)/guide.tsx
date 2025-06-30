import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Speech from 'expo-speech';
import {
  BookOpen,
  Camera,
  ScanText,
  Users,
  Navigation,
  Mic,
  Volume2,
  ChevronDown,
  ChevronRight,
  Play,
  Globe,
  Shield,
} from 'lucide-react-native';
import VoiceNavigator from '@/components/accessibility/VoiceNavigator';
import VoiceInstructions from '@/components/accessibility/VoiceInstructions';

type GuideSection = {
  id: string;
  title: string;
  icon: any;
  content: string;
  tips: string[];
};

const GUIDE_INSTRUCTIONS = [
  'This is the comprehensive user guide for SeeWithMe',
  'Each section explains different features and how to use them',
  'Tap any section to expand and hear detailed instructions',
  'Use the play button to hear each section spoken aloud',
  'Practice with each feature to become familiar with the app',
];

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    content: 'Welcome to SeeWithMe! This app helps you understand your surroundings using AI-powered vision. Tap the scan button to start analyzing what\'s in front of your camera.',
    tips: [
      'Hold your phone steady when scanning',
      'Ensure good lighting for better results',
      'Keep the camera lens clean',
      'Use headphones or earbuds for better audio',
      'Practice in familiar environments first',
    ],
  },
  {
    id: 'object-detection',
    title: 'Object & Scene Detection',
    icon: Camera,
    content: 'This mode identifies objects, people, and scenes in your environment. Perfect for understanding what\'s around you in any space.',
    tips: [
      'Point camera at the area you want to explore',
      'Works best with well-lit environments',
      'Can identify furniture, food, people, and more',
      'Provides detailed descriptions of scenes',
      'Hold steady for 2-3 seconds for best results',
    ],
  },
  {
    id: 'text-reading',
    title: 'Text Reading (OCR)',
    icon: ScanText,
    content: 'Read text from menus, signs, documents, and labels. The app will speak the text aloud clearly.',
    tips: [
      'Hold phone 6-12 inches from text',
      'Ensure text is well-lit and not blurry',
      'Works with printed and digital text',
      'Can read multiple languages',
      'Try different angles if text is not detected',
    ],
  },
  {
    id: 'face-detection',
    title: 'Face Detection',
    icon: Users,
    content: 'Detect people and their emotions in your surroundings. Helps you understand social situations better.',
    tips: [
      'Point camera towards people',
      'Respects privacy - no personal identification',
      'Describes emotions and expressions',
      'Counts number of people visible',
      'Works best at 3-8 feet distance',
    ],
  },
  {
    id: 'navigation',
    title: 'Indoor Navigation',
    icon: Navigation,
    content: 'Get spatial awareness help for indoor spaces. Identifies doorways, stairs, exits, and obstacles.',
    tips: [
      'Sweep camera slowly left to right',
      'Listen for directional information',
      'Identifies exits and pathways',
      'Helps with spatial orientation',
      'Use in combination with mobility aids',
    ],
  },
  {
    id: 'voice-commands',
    title: 'Voice Commands',
    icon: Mic,
    content: 'Use voice commands for hands-free operation. Enable voice commands and say "scan" to start scanning.',
    tips: [
      'Say "scan" to start scanning',
      'Say "stop" to stop current scan',
      'Say "repeat" to hear last description again',
      'Speak clearly and wait for response',
      'Works best in quiet environments',
    ],
  },
  {
    id: 'multilingual',
    title: 'Multilingual Support',
    icon: Globe,
    content: 'SeeWithMe supports over 50 languages with offline translation capabilities for text and voice output.',
    tips: [
      'Change language in Settings',
      'Text translation works offline',
      'Voice output adapts to selected language',
      'Supports major world languages',
      'No internet required for translation',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Shield,
    content: 'All AI processing happens on your device. No images or personal data are sent to external servers.',
    tips: [
      'Complete offline operation',
      'No data collection or tracking',
      'Images never leave your device',
      'No account registration required',
      'Full privacy protection guaranteed',
    ],
  },
];

export default function GuideScreen() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
      rate: 0.6,
      pitch: 1.0,
    });
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
      speak('Section collapsed');
    } else {
      newExpanded.add(sectionId);
      speak('Section expanded');
    }
    setExpandedSections(newExpanded);
  };

  const speakSection = (section: GuideSection) => {
    const fullText = `${section.title}. ${section.content} Tips: ${section.tips.join('. ')}`;
    speak(fullText);
  };

  return (
    <VoiceNavigator 
      screenName="User Guide" 
      instructions="Complete guide for using SeeWithMe features. Tap sections to expand and learn about each feature."
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>User Guide</Text>
          <View style={styles.headerActions}>
            <VoiceInstructions 
              instructions={GUIDE_INSTRUCTIONS}
              title="Guide Instructions"
            />
            
            <TouchableOpacity
              style={styles.speakAllButton}
              onPress={() => speak('Welcome to the SeeWithMe user guide. This guide will help you learn how to use all features of the app effectively.')}
              accessibilityLabel="Speak introduction"
              accessibilityRole="button"
            >
              <Volume2 size={20} color="#4ECDC4" strokeWidth={2.5} />
              <Text style={styles.speakAllButtonText}>Intro</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          accessibilityLabel="Guide sections"
        >
          {GUIDE_SECTIONS.map((section) => {
            const IconComponent = section.icon;
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <View key={section.id} style={styles.sectionContainer}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(section.id)}
                  accessibilityLabel={`${section.title} section`}
                  accessibilityHint={isExpanded ? 'Tap to collapse' : 'Tap to expand'}
                  accessibilityRole="button"
                >
                  <View style={styles.sectionTitleContainer}>
                    <View style={styles.sectionIcon}>
                      <IconComponent size={24} color="#4ECDC4" strokeWidth={2.5} />
                    </View>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                  
                  <View style={styles.sectionActions}>
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={() => speakSection(section)}
                      accessibilityLabel={`Speak ${section.title} section`}
                      accessibilityRole="button"
                    >
                      <Play size={18} color="#4ECDC4" strokeWidth={2.5} />
                    </TouchableOpacity>
                    
                    {isExpanded ? (
                      <ChevronDown size={24} color="#9CA3AF" strokeWidth={2.5} />
                    ) : (
                      <ChevronRight size={24} color="#9CA3AF" strokeWidth={2.5} />
                    )}
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.sectionContent}>
                    <Text style={styles.sectionDescription}>{section.content}</Text>
                    
                    <Text style={styles.tipsTitle}>Tips:</Text>
                    {section.tips.map((tip, index) => (
                      <View key={index} style={styles.tipContainer}>
                        <Text style={styles.tipBullet}>•</Text>
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Need More Help?</Text>
            <Text style={styles.footerText}>
              SeeWithMe works best in well-lit environments. Practice with different objects and scenes to get familiar with the app's capabilities.
            </Text>
            
            <TouchableOpacity
              style={styles.practiceButton}
              onPress={() => speak('Go to the Scanner tab to start practicing with SeeWithMe. Point your camera at different objects and try each scanning mode.')}
              accessibilityLabel="Get practice instructions"
              accessibilityRole="button"
            >
              <Camera size={20} color="white" strokeWidth={2.5} />
              <Text style={styles.practiceButtonText}>Start Practicing</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </VoiceNavigator>
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
  speakAllButton: {
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
  speakAllButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4ECDC4',
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionContainer: {
    backgroundColor: '#374151',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    minHeight: 80,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    flex: 1,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
  },
  sectionDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 24,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#4ECDC4',
    marginBottom: 12,
  },
  tipContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#4ECDC4',
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    lineHeight: 22,
    flex: 1,
  },
  footer: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    marginTop: 8,
  },
  footerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 20,
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    borderRadius: 8,
    minHeight: 56,
  },
  practiceButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 120,
  },
});