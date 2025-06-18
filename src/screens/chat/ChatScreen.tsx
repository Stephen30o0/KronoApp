import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  Image,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MessagesStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type ChatScreenRouteProp = RouteProp<MessagesStackParamList, 'Chat'>;
type ChatScreenNavigationProp = StackNavigationProp<MessagesStackParamList, 'Chat'>;

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: number;
}

// Sample message data
const SAMPLE_MESSAGES: Message[] = [
  {
    id: 'm1',
    text: 'Hey there! I saw your latest comic and it looks amazing.',
    sender: 'other',
    timestamp: new Date(Date.now() - 3600000 * 3).getTime(),
  },
  {
    id: 'm2',
    text: 'Thanks! I put a lot of work into the character designs.',
    sender: 'me',
    timestamp: new Date(Date.now() - 3600000 * 2).getTime(),
  },
  {
    id: 'm3',
    text: 'The storyline is really engaging too. Are you planning a sequel?',
    sender: 'other',
    timestamp: new Date(Date.now() - 3600000).getTime(),
  },
  {
    id: 'm4',
    text: 'Yes! I\'m working on it right now. Should be ready in a few weeks.',
    sender: 'me',
    timestamp: new Date(Date.now() - 1800000).getTime(),
  },
  {
    id: 'm5',
    text: 'That\'s great to hear! Can\'t wait to see it.',
    sender: 'other',
    timestamp: new Date(Date.now() - 900000).getTime(),
  },
];

const ChatScreen = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const route = useRoute<ChatScreenRouteProp>();
  const { chatId, userName, userAvatar } = route.params;
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle send message
  const handleSendMessage = () => {
    if (inputText.trim().length === 0) return;

    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      text: inputText.trim(),
      sender: 'me',
      timestamp: Date.now(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    // Set header title with the chat user's name
    navigation.setOptions({
      title: userName,
    });

    // Scroll to bottom on initial render
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [navigation, userName]);

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMyMessage = item.sender === 'me';
    if (isMyMessage) {
      return (
        <View style={[styles.messageRow, styles.myMessageRow]}>
          <View style={[styles.messageBubble, styles.myMessage]}>
            <Text style={styles.myMessageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.messageRow, styles.theirMessageRow]}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <View style={[styles.messageBubble, styles.theirMessage]}>
            <Text style={styles.theirMessageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerUserInfo}>
              <Image source={{ uri: userAvatar }} style={styles.headerAvatar} />
              <Text style={styles.headerUserName}>{userName}</Text>
            </View>
        </View>
        <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="videocam-outline" size={26} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="call-outline" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={renderMessageItem}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.textTertiary}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>
          {inputText.trim().length > 0 ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Ionicons name="send" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="sparkles-outline" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="film-outline" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="mic-outline" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  backButton: {
      padding: 4,
      marginRight: 12,
  },
  headerButton: {
    padding: 4,
    marginLeft: 16,
  },
  headerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerUserName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessage: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  myMessageText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  theirMessageText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  messageTime: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.surface,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 5,
    minHeight: 44,
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  sendButton: {
    padding: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 10,
  },
});

export default ChatScreen;
