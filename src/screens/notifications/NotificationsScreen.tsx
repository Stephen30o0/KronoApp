import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants
import { FONTS, SIZES } from '../../constants/theme';
import { useNotifications, NotificationType, Notification } from '../../context/NotificationContext';
import AddNotificationScreen from './AddNotificationScreen';
import NotificationItem from '../../components/notifications/NotificationItem';
import GroupedNotificationItem from '../../components/notifications/GroupedNotificationItem';

// Using types from NotificationContext

// Define drawer param list type
type DrawerParamList = {
  Home: undefined;
  Library: undefined;
  TownSquare: undefined;
  Stream: undefined;
  Wallet: undefined;
  Profile: undefined;
  Notifications: undefined;
  Messages: undefined;
  AddNotification: undefined;
};

const NotificationsScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const { notifications, markAsRead, markAllAsRead, markMultipleAsRead, unreadCount, addNotification, getGroupedNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [viewMode, setViewMode] = useState<'individual' | 'grouped'>('individual');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  
  // Pull to refresh functionality
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Simulate fetching new notifications
    setTimeout(() => {
      // Add a new random notification for demo purposes
      const types: NotificationType[] = ['like', 'comment', 'follow', 'mention', 'system', 'vote'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      addNotification({
        title: `New ${randomType}`,
        message: `This is a new ${randomType} notification added via pull-to-refresh`,
        type: randomType,
      });
      
      setRefreshing(false);
    }, 1500);
  }, [addNotification]);
  
  // Load more functionality
  const loadMore = () => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate loading more notifications
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getFilteredNotifications = () => {
    if (activeTab === 'unread') {
      return notifications.filter(notification => !notification.read);
    }
    return notifications;
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    return (
      <NotificationItem
        notification={item}
        onPress={() => markAsRead(item.id)}
        onMarkAsRead={() => markAsRead(item.id)}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="notifications-off-outline" size={80} color={COLORS.textSecondary} />
      <Text style={styles.emptyStateTitle}>No notifications</Text>
      <Text style={styles.emptyStateText}>
        {activeTab === 'unread' 
          ? 'You have no unread notifications at the moment.' 
          : 'You have no notifications at the moment.'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddNotification')}
          >
            <Ionicons name="add" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabGroup}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
            onPress={() => setActiveTab('unread')}
          >
            <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>Unread</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.viewModeContainer}>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'individual' && styles.activeViewMode]}
            onPress={() => setViewMode('individual')}
          >
            <Ionicons 
              name="list" 
              size={18} 
              color={viewMode === 'individual' ? COLORS.primary : COLORS.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'grouped' && styles.activeViewMode]}
            onPress={() => setViewMode('grouped')}
          >
            <Ionicons 
              name="albums" 
              size={18} 
              color={viewMode === 'grouped' ? COLORS.primary : COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      {viewMode === 'individual' ? (
        <FlatList
          data={getFilteredNotifications()}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <View style={styles.loadingFooter}>
                <ActivityIndicator color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading more...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyStateText}>No notifications yet</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={Object.entries(getGroupedNotifications()).filter(([_, notifications]) => {
            if (activeTab === 'unread') {
              return notifications.some(n => !n.read);
            }
            return true;
          })}
          keyExtractor={([key]) => key}
          renderItem={({ item: [key, groupNotifications] }) => {
            // Get group title and icon based on the first notification in group
            const firstNotification = groupNotifications[0];
            let groupTitle = '';
            let groupIcon;
            
            switch (firstNotification.type) {
              case 'like':
                groupTitle = 'Likes';
                groupIcon = <Ionicons name="heart" size={20} color={COLORS.like} />;
                break;
              case 'comment':
                groupTitle = 'Comments';
                groupIcon = <Ionicons name="chatbubble" size={20} color={COLORS.comment} />;
                break;
              case 'follow':
                groupTitle = 'New Followers';
                groupIcon = <Ionicons name="person-add" size={20} color={COLORS.follow} />;
                break;
              case 'mention':
                groupTitle = 'Mentions';
                groupIcon = <Ionicons name="at" size={20} color={COLORS.mention} />;
                break;
              case 'system':
                groupTitle = 'System Updates';
                groupIcon = <Ionicons name="information-circle" size={20} color={COLORS.system} />;
                break;
              case 'vote':
                groupTitle = 'Votes';
                groupIcon = <Ionicons name="arrow-up-circle" size={20} color={COLORS.vote} />;
                break;
              default:
                groupTitle = 'Notifications';
                groupIcon = <Ionicons name="notifications" size={20} color={COLORS.primary} />;
            }
            
            // If we have content type, add it to the title
            if (firstNotification.contentType) {
              groupTitle += ` on your ${firstNotification.contentType}`;
            }
            
            return (
              <GroupedNotificationItem
                notifications={groupNotifications}
                groupTitle={groupTitle}
                groupIcon={groupIcon}
                onMarkAllAsRead={(ids) => markMultipleAsRead(ids)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyStateText}>No notifications yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllText: {
    ...FONTS.body2,
    color: COLORS.primary,
    marginRight: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabGroup: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginLeft: 8,
  },
  unreadCount: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  listContent: {
    flexGrow: 1,
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 4,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeViewMode: {
    backgroundColor: `${COLORS.primary}20`,
  },
  loadingFooter: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  notificationMessage: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  notificationTime: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  emptyStateTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationsScreen;
