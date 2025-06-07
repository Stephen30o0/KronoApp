import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants
import { FONTS, SIZES } from '../../constants/theme';
import { Notification } from '../../context/NotificationContext';

// Sample content thumbnails for different content types
const CONTENT_THUMBNAILS = {
  comic: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29taWN8ZW58MHx8MHx8&w=200&q=80',
  post: 'https://images.unsplash.com/photo-1623018035782-b269248df916?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZHJhd2luZ3xlbnwwfHwwfHw%3D&w=200&q=80',
  idea: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aWRlYXxlbnwwfHwwfHw%3D&w=200&q=80',
};

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
  onMarkAsRead: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onPress,
  onMarkAsRead
}) => {
  const navigation = useNavigation();
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Ionicons name="heart" size={18} color={COLORS.like} />;
      case 'comment':
        return <Ionicons name="chatbubble" size={18} color={COLORS.comment} />;
      case 'follow':
        return <Ionicons name="person-add" size={18} color={COLORS.follow} />;
      case 'mention':
        return <Ionicons name="at" size={18} color={COLORS.mention} />;
      case 'system':
        return <Ionicons name="information-circle" size={18} color={COLORS.system} />;
      case 'vote':
        return <Ionicons name="arrow-up-circle" size={18} color={COLORS.vote} />;
      default:
        return <Ionicons name="notifications" size={18} color={COLORS.primary} />;
    }
  };

  // Handle navigation to content
  const handleContentPress = () => {
    if (notification.contentId && notification.contentType) {
      // Mark as read
      onMarkAsRead();
      
      // Navigate to content based on type
      switch (notification.contentType) {
        case 'comic':
          // @ts-ignore - We know this screen exists
          navigation.navigate('ComicDetail', { id: notification.contentId });
          break;
        case 'post':
          // @ts-ignore - We know this screen exists
          navigation.navigate('PostDetail', { id: notification.contentId });
          break;
        case 'idea':
          // @ts-ignore - We know this screen exists
          navigation.navigate('IdeaDetail', { id: notification.contentId });
          break;
      }
    }
  };

  // Get content thumbnail if available
  const getContentThumbnail = () => {
    if (notification.contentType) {
      return CONTENT_THUMBNAILS[notification.contentType];
    }
    return undefined;
  };

  return (
    <Pressable 
      style={[
        styles.container,
        !notification.read && styles.unreadContainer
      ]}
      onPress={onPress}
      android_ripple={{ color: COLORS.ripple }}
    >
      <View style={styles.content}>
        {/* Left side - Avatar or Icon */}
        <View style={styles.leftSection}>
          {notification.avatar ? (
            <Image source={{ uri: notification.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.iconContainer}>
              {getIcon()}
            </View>
          )}
        </View>
        
        {/* Middle - Notification content */}
        <View style={styles.middleSection}>
          <Text style={styles.title} numberOfLines={1}>{notification.title}</Text>
          <Text style={styles.message} numberOfLines={2}>{notification.message}</Text>
          <Text style={styles.timestamp}>{notification.timestamp}</Text>
        </View>
        
        {/* Right - Content thumbnail if available */}
        {notification.contentType && (
          <TouchableOpacity 
            style={styles.rightSection}
            onPress={handleContentPress}
          >
            <Image 
              source={{ uri: getContentThumbnail() }} 
              style={styles.contentThumbnail} 
            />
            <View style={styles.contentTypeTag}>
              <Text style={styles.contentTypeText}>{notification.contentType}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Unread indicator */}
      {!notification.read && <View style={styles.unreadIndicator} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.background,
  },
  unreadContainer: {
    backgroundColor: `${COLORS.primary}08`, // 8% opacity
  },
  content: {
    flexDirection: 'row',
  },
  leftSection: {
    marginRight: 12,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSection: {
    marginLeft: 12,
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...FONTS.body2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  message: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  timestamp: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
  },
  contentThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  contentTypeTag: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  contentTypeText: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontSize: 8,
    textTransform: 'uppercase',
  },
  unreadIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: COLORS.primary,
  },
});

export default NotificationItem;
