import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import haptics from '../../utils/haptics';

interface ThemeToggleProps {
  size?: number;
  style?: any;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 28, style }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Animation values
  const rotateAnim = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Update animation when theme changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: isDarkMode ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [isDarkMode, rotateAnim, scaleAnim]);
  
  // Interpolate rotation
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  // Handle toggle press
  const handleToggle = () => {
    haptics.medium(); // Add haptic feedback
    toggleTheme();
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ rotate: rotation }, { scale: scaleAnim }] }}>
        {isDarkMode ? (
          <Ionicons name="moon" size={size} color="#FFD166" />
        ) : (
          <Ionicons name="sunny" size={size} color="#FFD166" />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
});

export default ThemeToggle;
