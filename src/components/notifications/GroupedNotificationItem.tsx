import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Pressable,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants
import { FONTS, SIZES } from '../../constants/theme';
import { Notification } from '../../context/NotificationContext';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface GroupedNotificationItemProps {
  notifications: Notification[];
  groupTitle: string;
  groupIcon: React.ReactNode;
  onMarkAllAsRead: (ids: string[]) => void;
}

const GroupedNotificationItem: React.FC<GroupedNotificationItemProps> = ({ 
  notifications, 
  groupTitle,
  groupIcon,
  onMarkAllAsRead
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Get latest notification timestamp
  const latestTimestamp = notifications[0]?.timestamp || '';
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    onMarkAllAsRead(notifications.map(n => n.id));
  };

  return (
    <View style={styles.container}>
      {/* Group Header */}
      <Pressable 
        style={[
          styles.header,
          unreadCount > 0 && styles.unreadHeader
        ]}
        onPress={toggleExpanded}
        android_ripple={{ color: COLORS.ripple }}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            {groupIcon}
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.groupTitle}>{groupTitle}</Text>
            <Text style={styles.groupInfo}>
              {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'} • {latestTimestamp}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.readButton}
              onPress={handleMarkAllAsRead}
            >
              <Text style={styles.readButtonText}>Mark read</Text>
            </TouchableOpacity>
          )}
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={COLORS.textSecondary}
            style={styles.expandIcon}
          />
        </View>
      </Pressable>
      
      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedContent}>
          {notifications.map((notification) => (
            <View 
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.unreadItem
              ]}
            >
              {notification.avatar ? (
                <Image source={{ uri: notification.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.placeholderAvatar} />
              )}
              <View style={styles.notificationContent}>
                <Text style={styles.message}>{notification.message}</Text>
                <Text style={styles.timestamp}>{notification.timestamp}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
      
      {/* Bottom Border */}
      <View style={styles.bottomBorder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  unreadHeader: {
    backgroundColor: `${COLORS.primary}08`, // 8% opacity
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.like,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  unreadBadgeText: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  groupTitle: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  groupInfo: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  readButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    marginRight: 8,
  },
  readButtonText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  expandIcon: {
    padding: 4,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingLeft: 40, // Align with the header content
    borderLeftWidth: 0,
  },
  unreadItem: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    paddingLeft: 37, // Adjust for the border
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  placeholderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  message: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  timestamp: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  bottomBorder: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
});

export default GroupedNotificationItem;
