import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

// Sample data for support chat
const SAMPLE_MESSAGES = [
  {
    id: '1',
    text: 'Hello! How can I help you today?',
    sender: 'support',
    timestamp: '10:30 AM',
    isRead: true,
  },
  {
    id: '2',
    text: 'I\'m having trouble uploading my comic. It keeps failing at 80%.',
    sender: 'user',
    timestamp: '10:31 AM',
    isRead: true,
  },
  {
    id: '3',
    text: 'I\'m sorry to hear that. Could you tell me what file format you\'re trying to upload and the approximate file size?',
    sender: 'support',
    timestamp: '10:32 AM',
    isRead: true,
  },
  {
    id: '4',
    text: 'It\'s a PDF file, about 25MB in size.',
    sender: 'user',
    timestamp: '10:33 AM',
    isRead: true,
  },
  {
    id: '5',
    text: 'Thank you for that information. Our system currently has a limit of 20MB per file. I recommend compressing your PDF or splitting it into smaller parts for upload.',
    sender: 'support',
    timestamp: '10:34 AM',
    isRead: true,
  },
  {
    id: '6',
    text: 'Would you like me to send you a guide on how to compress PDF files without losing quality?',
    sender: 'support',
    timestamp: '10:34 AM',
    isRead: true,
  },
  {
    id: '7',
    text: 'Yes, that would be helpful. Thank you!',
    sender: 'user',
    timestamp: '10:35 AM',
    isRead: true,
  },
  {
    id: '8',
    text: 'Great! I\'ve sent a guide to your email. You should receive it shortly. Is there anything else I can help you with today?',
    sender: 'support',
    timestamp: '10:36 AM',
    isRead: true,
  },
];

// Sample support agent data
const SUPPORT_AGENT = {
  name: 'Sarah',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  role: 'Customer Support',
  isOnline: true,
};

const SupportScreen = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const sendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: (messages.length + 1).toString(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate support response after a short delay
    setTimeout(() => {
      const supportResponse = {
        id: (messages.length + 2).toString(),
        text: 'Thank you for your message. Our support team will get back to you shortly.',
        sender: 'support',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
      };
      
      setMessages(prevMessages => [...prevMessages, supportResponse]);
      
      // Scroll to the bottom
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 1000);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.supportMessageContainer
      ]}>
        {!isUser && (
          <Image source={{ uri: SUPPORT_AGENT.avatar }} style={styles.messageAvatar} />
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.supportMessageBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Support Chat</Text>
          <View style={styles.agentInfo}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.agentName}>{SUPPORT_AGENT.name} • {SUPPORT_AGENT.role}</Text>
          </View>
        </View>
        
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="attach" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.textTertiary}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, message.trim() === '' && styles.disabledSendButton]}
          onPress={sendMessage}
          disabled={message.trim() === ''}
        >
          <Ionicons name="send" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.supportOptions}>
        <TouchableOpacity style={styles.supportOptionButton}>
          <Ionicons name="document-text-outline" size={20} color={COLORS.textPrimary} />
          <Text style={styles.supportOptionText}>FAQs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportOptionButton}>
          <Ionicons name="mail-outline" size={20} color={COLORS.textPrimary} />
          <Text style={styles.supportOptionText}>Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportOptionButton}>
          <Ionicons name="call-outline" size={20} color={COLORS.textPrimary} />
          <Text style={styles.supportOptionText}>Call</Text>
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
    backgroundColor: COLORS.background,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  agentName: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  supportMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    ...SHADOWS.small,
  },
  userMessageBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  supportMessageBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  messageTimestamp: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    color: COLORS.textPrimary,
    ...FONTS.body2,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: COLORS.surfaceLight,
  },
  supportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.surface,
  },
  supportOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  supportOptionText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
});

export default SupportScreen;
