import { Tabs } from 'expo-router';
import { Camera, Settings, BookOpen, Clock, Sparkles } from 'lucide-react-native';
import { StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#00D4FF',
        tabBarInactiveTintColor: '#8B9DC3',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarBackground: () => (
          Platform.OS === 'web' ? null : (
            <BlurView
              intensity={100}
              style={StyleSheet.absoluteFillObject}
              tint="dark"
            />
          )
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Vision',
          tabBarIcon: ({ size, color }) => (
            <Sparkles size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ size, color }) => (
            <Camera size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => (
            <Clock size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Guide',
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.OS === 'web' ? 'rgba(15, 15, 35, 0.95)' : 'transparent',
    borderTopColor: 'rgba(139, 157, 195, 0.2)',
    borderTopWidth: 1,
    height: 90,
    paddingBottom: 20,
    paddingTop: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  tabBarItem: {
    paddingVertical: 8,
  },
});