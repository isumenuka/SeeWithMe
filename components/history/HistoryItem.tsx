import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { 
  Volume2, 
  Trash2, 
  Camera, 
  ScanText, 
  Users, 
  Navigation,
  Star,
} from 'lucide-react-native';

type HistoryItemType = {
  id: string;
  timestamp: Date;
  type: 'objects' | 'text' | 'faces' | 'navigation';
  description: string;
  confidence: number;
  isFavorite: boolean;
  location?: string;
};

const TYPE_CONFIG = {
  objects: { icon: Camera, color: '#00D4FF', label: 'Objects' },
  text: { icon: ScanText, color: '#FF6B6B', label: 'Text' },
  faces: { icon: Users, color: '#4ECDC4', label: 'Faces' },
  navigation: { icon: Navigation, color: '#FFE66D', label: 'Navigation' },
};

interface HistoryItemProps {
  item: HistoryItemType;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function HistoryItem({ item, onToggleFavorite, onDelete }: HistoryItemProps) {
  const config = TYPE_CONFIG[item.type];
  const IconComponent = config.icon;

  const speak = (text: string) => {
    Speech.speak(text, {
      rate: 0.8,
      pitch: 1.0,
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return '#4ECDC4';
    if (confidence >= 85) return '#FFE66D';
    return '#FF6B6B';
  };

  return (
    <TouchableOpacity
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
              onPress={() => onToggleFavorite(item.id)}
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
              onPress={() => onDelete(item.id)}
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
            <Text style={[styles.confidenceValue, { color: getConfidenceColor(item.confidence) }]}>
              {item.confidence}%
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});