import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define notification types
export type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'system' | 'vote';

// Define notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  contentId?: string;
  contentType?: 'comic' | 'post' | 'idea';
  groupId?: string; // Used for grouping similar notifications
}

// Sample notifications data
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New Like',
    message: 'Sarah Parker liked your comic "Cyber Knights"',
    timestamp: '2m ago',
    read: false,
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    contentId: 'comic-123',
    contentType: 'comic'
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    message: 'Mike Johnson commented on your post: "This art style is amazing! How long did it take you to develop it?"',
    timestamp: '1h ago',
    read: false,
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    contentId: 'post-456',
    contentType: 'post'
  },
  {
    id: '3',
    type: 'follow',
    title: 'New Follower',
    message: 'Comic Artist started following you',
    timestamp: '3h ago',
    read: true,
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
  },
  {
    id: '4',
    type: 'vote',
    title: 'Votes Update',
    message: 'Your comic idea "Enchanted Forest" received 5 new votes',
    timestamp: '1d ago',
    read: true,
    contentId: 'idea-789',
    contentType: 'idea'
  },
  {
    id: '5',
    type: 'system',
    title: 'KronoLabs Update',
    message: 'New features available: Comic creation tools and improved voting system',
    timestamp: '2d ago',
    read: true
  },
  {
    id: '6',
    type: 'mention',
    title: 'New Mention',
    message: 'David Wilson mentioned you in a comment: "@alexcreator what tools do you use for your line work?"',
    timestamp: '3d ago',
    read: true,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    contentId: 'post-567',
    contentType: 'post'
  }
];

// Define context type
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  markMultipleAsRead: (ids: string[]) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getGroupedNotifications: () => { [key: string]: Notification[] };
}

// Create context
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: getTimestampString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Mark multiple notifications as read
  const markMultipleAsRead = (ids: string[]) => {
    setNotifications(prev => 
      prev.map(notification => 
        ids.includes(notification.id) ? { ...notification, read: true } : notification
      )
    );
  };

  // Clear a specific notification
  const clearNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Helper function to generate human-readable timestamp
  const getTimestampString = (): string => {
    return 'just now';
  };

  // Group notifications by type and contentId
  const getGroupedNotifications = () => {
    const grouped: { [key: string]: Notification[] } = {};
    
    notifications.forEach(notification => {
      // Create group key based on type and contentId if available
      let groupKey = notification.groupId || '';
      
      if (!groupKey) {
        if (notification.contentId && notification.contentType) {
          // Group by content if available
          groupKey = `${notification.type}_${notification.contentType}_${notification.contentId}`;
        } else {
          // Otherwise group just by type
          groupKey = notification.type;
        }
      }
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      
      grouped[groupKey].push(notification);
    });
    
    // Sort each group by timestamp (newest first)
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        // Simple string comparison for demo purposes
        // In a real app, you'd parse these into actual dates
        return a.timestamp > b.timestamp ? -1 : 1;
      });
    });
    
    return grouped;
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount,
        addNotification, 
        markAsRead, 
        markAllAsRead,
        markMultipleAsRead,
        clearNotification,
        clearAllNotifications,
        getGroupedNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
