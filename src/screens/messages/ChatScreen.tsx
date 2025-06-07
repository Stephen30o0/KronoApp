import React, { useState, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MessagesStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

// Define message type
type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
};

// Define route params type
type ChatScreenRouteParams = {
  chatId: string;
  userName: string;
  userAvatar: string;
};

// Sample messages data
const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hey there! I saw your comic idea in TownSquare. It looks amazing!',
    sender: 'other',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    text: 'Thanks! I\'ve been working on that concept for a while.',
    sender: 'me',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    text: 'The character designs are really unique. How did you come up with the main protagonist?',
    sender: 'other',
    timestamp: '10:35 AM',
  },
  {
    id: '4',
    text: 'I was inspired by classic heroes but wanted to add some modern elements to make them more relatable.',
    sender: 'me',
    timestamp: '10:38 AM',
  },
  {
    id: '5',
    text: 'It definitely shows! Are you planning to release it soon?',
    sender: 'other',
    timestamp: '10:40 AM',
  },
  {
    id: '6',
    text: 'If it gets enough votes in TownSquare, I hope to start production next month!',
    sender: 'me',
    timestamp: '10:42 AM',
  },
  {
    id: '7',
    text: 'I\'ll definitely vote for it. Can\'t wait to see the final product!',
    sender: 'other',
    timestamp: '10:45 AM',
  },
];

const ChatScreen = () => {
  const navigation = useNavigation<StackNavigationProp<MessagesStackParamList>>();
  const route = useRoute();
  const { chatId, userName, userAvatar } = (route.params as ChatScreenRouteParams) || { chatId: '', userName: '', userAvatar: '' };
  
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const goBack = () => {
    navigation.goBack();
  };

  const sendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'me' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    // Scroll to bottom after sending message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer, 
      item.sender === 'me' ? styles.myMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
          <Text style={styles.userName}>{userName}</Text>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.textSecondary}
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
        />
        
        <TouchableOpacity 
          style={[
            styles.sendButton,
            inputMessage.trim() === '' ? styles.sendButtonDisabled : {}
          ]}
          onPress={sendMessage}
          disabled={inputMessage.trim() === ''}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={inputMessage.trim() === '' ? COLORS.textSecondary : COLORS.textPrimary} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backButton: {
    padding: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  moreButton: {
    padding: 5,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  myMessageBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...FONTS.body2,
  },
  myMessageText: {
    color: COLORS.textPrimary,
  },
  otherMessageText: {
    color: COLORS.textPrimary,
  },
  messageTime: {
    ...FONTS.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: COLORS.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.divider,
  },
});

export default ChatScreen;
