import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  FlatList,
  Image,
  Platform
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';
import { MessagesStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const CHATS = [
  {
    id: '1',
    userName: 'Sarah Parker',
    userAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    lastMessage: 'I loved your latest comic! The art style is amazing.',
    time: '2m ago',
    unread: 2,
  },
  {
    id: '2',
    userName: 'Mike Johnson',
    userAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    lastMessage: 'When is the next chapter coming out?',
    time: '1h ago',
    unread: 0,
  },
  {
    id: '3',
    userName: 'Comic Creators Guild',
    userAvatar: 'https://images.unsplash.com/photo-1560800452-f2d475982b96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    lastMessage: 'Alex: Hey everyone, check out my new project!',
    time: '3h ago',
    unread: 5,
    isGroup: true,
  },
  {
    id: '4',
    userName: 'Lisa Thompson',
    userAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    lastMessage: 'Thanks for the feedback on my storyboard.',
    time: '1d ago',
    unread: 0,
  },
  {
    id: '5',
    userName: 'David Wilson',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Let me know when you want to collaborate.',
    time: '2d ago',
    unread: 0,
  },
];

// Define chat item type
type ChatItem = {
  id: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isGroup?: boolean;
};

const MessagesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MessagesStackParamList>>();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const navigateToChat = (chatId: string, userName: string, userAvatar: string) => {
    navigation.navigate('Chat', {
      chatId,
      userName,
      userAvatar
    });
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => navigateToChat(item.id, item.userName, item.userAvatar)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
        {item.isGroup && (
          <View style={styles.groupIndicator}>
            <Ionicons name="people" size={12} color={COLORS.textPrimary} />
          </View>
        )}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text 
            style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]} 
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Chats List */}
      <FlatList
        data={CHATS}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatsList}
      />
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
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  chatsList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  groupIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  timeText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadCount: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
});

export default MessagesScreen;
