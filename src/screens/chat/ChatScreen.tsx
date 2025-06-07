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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MessagesStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type ChatScreenRouteProp = RouteProp<MessagesStackParamList, 'Chat'>;
type ChatScreenNavigationProp = StackNavigationProp<MessagesStackParamList, 'Chat'>;

// Sample message data
const SAMPLE_MESSAGES = [
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
  
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
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
    
    const newMessage = {
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

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerUserInfo}>
          <Image source={{ uri: userAvatar }} style={styles.headerAvatar} />
          <Text style={styles.headerUserName}>{userName}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myMessage : styles.theirMessage
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
          </View>
        )}
      />
      
      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
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
        <TouchableOpacity 
          style={[
            styles.sendButton,
            inputText.trim().length === 0 && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={inputText.trim().length === 0}
        >
          <Ionicons name="send" size={24} color={inputText.trim().length === 0 ? COLORS.textTertiary : COLORS.primary} />
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
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  headerUserName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
  messageTime: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  attachButton: {
    padding: 8,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 6,
    marginHorizontal: 8,
  },
  textInput: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    maxHeight: 100,
    padding: 4,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatScreen;
