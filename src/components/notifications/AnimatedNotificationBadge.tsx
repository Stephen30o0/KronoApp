import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants
import { FONTS } from '../../constants/theme';
import { useNotifications } from '../../context/NotificationContext';

interface AnimatedNotificationBadgeProps {
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  containerStyle?: object;
}

const AnimatedNotificationBadge: React.FC<AnimatedNotificationBadgeProps> = ({
  size = 'medium',
  position = 'top-right',
  containerStyle = {},
}) => {
  const { unreadCount } = useNotifications();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const prevCountRef = useRef(unreadCount);

  useEffect(() => {
    // Only animate if count increases
    if (unreadCount > prevCountRef.current) {
      // Reset to small
      scaleAnim.setValue(0.5);
      
      // Animate to slightly larger than normal, then back to normal size
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    prevCountRef.current = unreadCount;
  }, [unreadCount, scaleAnim]);

  if (unreadCount === 0) {
    return null;
  }

  // Determine badge size
  const badgeSize = {
    small: { width: 16, height: 16, fontSize: 10 },
    medium: { width: 20, height: 20, fontSize: 12 },
    large: { width: 24, height: 24, fontSize: 14 },
  }[size];

  // Determine badge position
  const badgePosition = {
    'top-right': { top: -8, right: -8 },
    'top-left': { top: -8, left: -8 },
    'bottom-right': { bottom: -8, right: -8 },
    'bottom-left': { bottom: -8, left: -8 },
  }[position];

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          width: badgeSize.width,
          height: badgeSize.height,
          ...badgePosition,
        },
        { transform: [{ scale: scaleAnim }] },
        containerStyle,
      ]}
    >
      <Text style={[styles.badgeText, { fontSize: badgeSize.fontSize }]}>
        {unreadCount > 99 ? '99+' : unreadCount}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    backgroundColor: COLORS.like,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  badgeText: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
});

export default AnimatedNotificationBadge;
