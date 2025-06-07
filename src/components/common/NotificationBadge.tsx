import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import FONTS from theme.ts
import { FONTS } from '../../constants/theme';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationBadgeProps {
  size?: 'small' | 'medium' | 'large';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  containerStyle?: object;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  size = 'medium',
  position = 'top-right',
  containerStyle = {},
}) => {
  const { unreadCount } = useNotifications();

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
    <View
      style={[
        styles.badge,
        {
          width: badgeSize.width,
          height: badgeSize.height,
          ...badgePosition,
        },
        containerStyle,
      ]}
    >
      <Text style={[styles.badgeText, { fontSize: badgeSize.fontSize }]}>
        {unreadCount > 99 ? '99+' : unreadCount}
      </Text>
    </View>
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

export default NotificationBadge;
