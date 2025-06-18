import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  FlatList,
  Image,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MessagesStackParamList, ChatItem } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import Logo from '../../components/common/Logo';

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



const MessagesScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MessagesStackParamList>>();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const navigateToChat = (chat: ChatItem) => {
    navigation.navigate('Chat', { 
      chatId: chat.id, 
      userName: chat.userName, 
      userAvatar: chat.userAvatar,
      isGroup: chat.isGroup
    });
  };

  const navigateToNewChat = () => {
    navigation.navigate('NewChat');
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => navigateToChat(item)}
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.logoContainer}>
          <Logo size={32} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={navigateToNewChat}>
            <Ionicons name="create-outline" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          placeholder="Search chats or users..."
          placeholderTextColor={COLORS.textSecondary}
          style={styles.searchInput}
        />
      </View>

      {/* Chats List */}
      <FlatList
        data={CHATS}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatsList}
      />
    </SafeAreaView>
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
    paddingHorizontal: SIZES.medium,
    paddingTop: SIZES.medium,
    paddingBottom: SIZES.small,
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    padding: SIZES.small,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.medium,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    marginHorizontal: SIZES.medium,
    paddingHorizontal: SIZES.medium,
    marginBottom: SIZES.small,
  },
  searchIcon: {
    marginRight: SIZES.small,
  },
  searchInput: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.textPrimary,
    height: 44,
  },
  chatsList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.small,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SIZES.medium,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    ...FONTS.h4,
    color: COLORS.textPrimary,
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
    ...FONTS.body3,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: SIZES.small,
  },
  unreadMessage: {
    color: COLORS.textPrimary,
    ...FONTS.body3,
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
  },
  unreadCount: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
});

export default MessagesScreen;
