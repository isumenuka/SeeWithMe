import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { 
  Volume2, 
  Trash2, 
  Clock, 
  Camera, 
  ScanText, 
  Users, 
  Navigation,
  Star,
} from 'lucide-react-native';
import VoiceNavigator from '@/components/accessibility/VoiceNavigator';
import VoiceInstructions from '@/components/accessibility/VoiceInstructions';

type HistoryItemType = {
  id: string;
  timestamp: Date;
  type: 'objects' | 'text' | 'faces' | 'navigation';
  description: string;
  confidence: number;
  isFavorite: boolean;
  location?: string;
};

const HISTORY_INSTRUCTIONS = [
  'This is your scan history where all AI analysis results are saved',
  'Tap any result to hear it spoken aloud',
  'Use filter buttons to organize by scan type or favorites',
  'Tap the star button to add items to favorites',
  'Tap the trash button to delete individual items',
  'Use the clear all button to remove all history',
];

const MOCK_HISTORY: HistoryItemType[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'objects',
    description: 'A modern wooden dining table with a white ceramic coffee cup and a silver laptop computer. Natural lighting from window on left.',
    confidence: 98,
    isFavorite: true,
    location: 'Home Office',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'text',
    description: 'Menu: Espresso Coffee $3.50, Herbal Tea $2.00, Grilled Chicken Sandwich $8.95, Fresh Garden Salad $6.50',
    confidence: 95,
    isFavorite: false,
    location: 'Downtown Café',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'faces',
    description: 'One person in their thirties with a genuine smile and friendly expression, looking in your direction with positive body language.',
    confidence: 92,
    isFavorite: false,
    location: 'Office Building',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    type: 'navigation',
    description: 'Open doorway 3 feet ahead on left, clear path with no obstacles. Well-lit corridor extends forward.',
    confidence: 97,
    isFavorite: true,
    location: 'Shopping Mall',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    type: 'text',
    description: 'Emergency Exit sign with arrow pointing right. Below: In case of emergency, do not use elevators, use stairs only.',
    confidence: 99,
    isFavorite: false,
    location: 'Office Building',
  },
];

const TYPE_CONFIG = {
  objects: { icon: Camera, color: '#00D4FF', label: 'Objects' },
  text: { icon: ScanText, color: '#FF6B6B', label: 'Text' },
  faces: { icon: Users, color: '#4ECDC4', label: 'Faces' },
  navigation: { icon: Navigation, color: '#FFE66D', label: 'Navigation' },
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItemType[]>(MOCK_HISTORY);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const speak = (text: string) => {
    Speech.speak(text, {
      rate: 0.6,
      pitch: 1.0,
    });
  };

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => {
      if (item.id === id) {
        const newItem = { ...item, isFavorite: !item.isFavorite };
        speak(newItem.isFavorite ? 'Added to favorites' : 'Removed from favorites');
        return newItem;
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    Alert.alert(
      'Delete Scan Result',
      'Are you sure you want to delete this scan result?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHistory(prev => prev.filter(item => item.id !== id));
            speak('Scan result deleted');
          },
        },
      ]
    );
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all scan results? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setHistory([]);
            speak('All scan history cleared');
          },
        },
      ]
    );
  };

  const filteredHistory = selectedFilter === 'all' 
    ? history 
    : selectedFilter === 'favorites'
    ? history.filter(item => item.isFavorite)
    : history.filter(item => item.type === selectedFilter);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <VoiceNavigator 
      screenName="Scan History" 
      instructions={`You have ${history.length} scan results saved. Use filters to organize your results or tap any item to hear it again.`}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Scan History</Text>
              <Text style={styles.headerSubtitle}>{history.length} total scans</Text>
            </View>
            
            {history.length > 0 && (
              <View style={styles.headerActions}>
                <VoiceInstructions 
                  instructions={HISTORY_INSTRUCTIONS}
                  title="History Guide"
                />
                
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => speak(`You have ${history.length} scan results in your history. Use the filter buttons to organize your results.`)}
                  accessibilityLabel="Speak history summary"
                  accessibilityRole="button"
                >
                  <Volume2 size={20} color="#00D4FF" strokeWidth={2.5} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={clearHistory}
                  accessibilityLabel="Clear all history"
                  accessibilityRole="button"
                  accessibilityHint="Delete all scan results permanently"
                >
                  <Trash2 size={20} color="#FF6B6B" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {history.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
              accessibilityLabel="Filter options"
            >
              <TouchableOpacity
                style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
                onPress={() => {
                  setSelectedFilter('all');
                  speak(`Showing all ${history.length} results`);
                }}
                accessibilityLabel={`Show all ${history.length} results`}
                accessibilityRole="button"
              >
                <Text style={[styles.filterButtonText, selectedFilter === 'all' && styles.filterButtonTextActive]}>
                  All ({history.length})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterButton, selectedFilter === 'favorites' && styles.filterButtonActive]}
                onPress={() => {
                  const favCount = history.filter(item => item.isFavorite).length;
                  setSelectedFilter('favorites');
                  speak(`Showing ${favCount} favorite results`);
                }}
                accessibilityLabel={`Show ${history.filter(item => item.isFavorite).length} favorite results`}
                accessibilityRole="button"
              >
                <Star size={16} color={selectedFilter === 'favorites' ? '#0F0F23' : '#8B9DC3'} strokeWidth={2.5} />
                <Text style={[styles.filterButtonText, selectedFilter === 'favorites' && styles.filterButtonTextActive]}>
                  Favorites ({history.filter(item => item.isFavorite).length})
                </Text>
              </TouchableOpacity>

              {Object.entries(TYPE_CONFIG).map(([type, config]) => {
                const count = history.filter(item => item.type === type).length;
                if (count === 0) return null;
                
                const IconComponent = config.icon;
                const isActive = selectedFilter === type;
                
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.filterButton, isActive && styles.filterButtonActive]}
                    onPress={() => {
                      setSelectedFilter(type);
                      speak(`Showing ${count} ${config.label} results`);
                    }}
                    accessibilityLabel={`Show ${count} ${config.label} results`}
                    accessibilityRole="button"
                  >
                    <IconComponent 
                      size={16} 
                      color={isActive ? '#0F0F23' : config.color} 
                      strokeWidth={2.5} 
                    />
                    <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
                      {config.label} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </LinearGradient>

        {filteredHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <LinearGradient
              colors={['#1A1A3A', '#2D2D5F']}
              style={styles.emptyCard}
            >
              <Clock size={64} color="#8B9DC3" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>
                {selectedFilter === 'all' ? 'No scan history' : `No ${selectedFilter} results`}
              </Text>
              <Text style={styles.emptyDescription}>
                {selectedFilter === 'all' 
                  ? 'Your AI scan results will appear here for easy access and review'
                  : `No ${selectedFilter} scans found. Try a different filter or start scanning.`
                }
              </Text>
            </LinearGradient>
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            accessibilityLabel={`${filteredHistory.length} scan results`}
          >
            {filteredHistory.map((item) => {
              const config = TYPE_CONFIG[item.type];
              const IconComponent = config.icon;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.historyItem}
                  onPress={() => speak(item.description)}
                  accessibilityLabel={`${config.label} scan result: ${item.description}`}
                >
                  <LinearGradient
                    colors={['#1A1A3A', '#2D2D5F']}
                    style={styles.historyItemGradient}
                  >
                    <View style={styles.itemHeader}>
                      <View style={styles.itemTypeContainer}>
                        <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
                          <IconComponent size={20} color="white" strokeWidth={2.5} />
                        </View>
                        <View style={styles.itemInfo}>
                          <View style={styles.itemTitleRow}>
                            <Text style={styles.itemType}>{config.label}</Text>
                            {item.isFavorite && (
                              <Star size={14} color="#FFE66D" strokeWidth={2.5} fill="#FFE66D" />
                            )}
                          </View>
                          <Text style={styles.itemTime}>{formatTime(item.timestamp)}</Text>
                          {item.location && (
                            <Text style={styles.itemLocation}>{item.location}</Text>
                          )}
                        </View>
                      </View>
                      
                      <View style={styles.itemActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => toggleFavorite(item.id)}
                          accessibilityLabel={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star 
                            size={18} 
                            color={item.isFavorite ? '#FFE66D' : '#8B9DC3'} 
                            strokeWidth={2.5}
                            fill={item.isFavorite ? '#FFE66D' : 'none'}
                          />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => speak(item.description)}
                          accessibilityLabel="Speak description"
                        >
                          <Volume2 size={18} color="#00D4FF" strokeWidth={2.5} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => deleteItem(item.id)}
                          accessibilityLabel="Delete item"
                        >
                          <Trash2 size={18} color="#FF6B6B" strokeWidth={2.5} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    
                    <View style={styles.itemFooter}>
                      <View style={styles.confidenceContainer}>
                        <Text style={styles.confidenceLabel}>Confidence:</Text>
                        <Text style={[styles.confidenceValue, { 
                          color: item.confidence >= 95 ? '#4ECDC4' : item.confidence >= 85 ? '#FFE66D' : '#FF6B6B' 
                        }]}>
                          {item.confidence}%
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
            
            <View style={styles.bottomSpacing} />
          </ScrollView>
        )}
      </View>
    </VoiceNavigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B9DC3',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 48,
  },
  filterButtonActive: {
    backgroundColor: '#00D4FF',
    borderColor: '#00D4FF',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B9DC3',
    marginLeft: 6,
  },
  filterButtonTextActive: {
    color: '#0F0F23',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    width: '100%',
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8B9DC3',
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  historyItem: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  historyItemGradient: {
    padding: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemTypeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemType: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginRight: 8,
  },
  itemTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8B9DC3',
    marginBottom: 2,
  },
  itemLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#00D4FF',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 36,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDescription: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 22,
    marginBottom: 16,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8B9DC3',
    marginRight: 6,
  },
  confidenceValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  bottomSpacing: {
    height: 120,
  },
});