import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// Import colors from dedicated colors.js file
import { COLORS } from '../../constants/colors';
import NotificationBadge from './NotificationBadge';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationIconProps {
  size?: number;
  color?: string;
  style?: object;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  size = 24,
  color = COLORS.textPrimary,
  style = {},
}) => {
  const navigation = useNavigation();
  const { unreadCount } = useNotifications();

  const handlePress = () => {
    // @ts-ignore - We know this screen exists in our navigation
    navigation.navigate('Notifications');
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons name="notifications-outline" size={size} color={color} />
      {unreadCount > 0 && (
        <NotificationBadge size="small" position="top-right" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
  },
});

export default NotificationIcon;
