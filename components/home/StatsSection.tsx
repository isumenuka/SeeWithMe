import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, Shield, Globe, Heart } from 'lucide-react-native';

const STATS = [
  { label: 'AI Accuracy', value: '99.2%', icon: Zap },
  { label: 'Privacy First', value: '100%', icon: Shield },
  { label: 'Languages', value: '50+', icon: Globe },
  { label: 'Users Helped', value: '10K+', icon: Heart },
];

export default function StatsSection() {
  return (
    <View style={styles.statsSection}>
      <LinearGradient
        colors={['#1A1A3A', '#2D2D5F']}
        style={styles.statsContainer}
      >
        <Text style={styles.statsTitle}>Trusted by Thousands</Text>
        <Text style={styles.statsSubtitle}>
          Empowering visual independence worldwide
        </Text>
        
        <View style={styles.statsGrid}>
          {STATS.map((stat, index) => {
            const IconComponent = stat.icon;
            
            return (
              <View key={index} style={styles.statItem}>
                <View style={styles.statIcon}>
                  <IconComponent size={20} color="#00D4FF" strokeWidth={2.5} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  statsContainer: {
    borderRadius: 20,
    padding: 32,
  },
  statsTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  statsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8B9DC3',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
    marginBottom: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B9DC3',
    textAlign: 'center',
  },
});