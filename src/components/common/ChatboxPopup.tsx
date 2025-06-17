import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Dimensions, KeyboardAvoidingView, Platform, PanResponder, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');

export interface ChatComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  replies?: ChatComment[];
}

interface ChatboxPopupProps {
  visible: boolean;
  onClose: () => void;
  comments: ChatComment[];
  onSend: (text: string, replyToId?: string) => void;
}

const ChatboxPopup: React.FC<ChatboxPopupProps> = ({ visible, onClose, comments, onSend }) => {
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80) {
          Animated.timing(translateY, {
            toValue: 700,
            duration: 220,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  const renderReplies = (replies: ChatComment[] = [], level = 1) => (
    <View style={{ marginLeft: level * 22 }}>
      {replies.map(reply => (
        <View key={reply.id} style={styles.commentRow}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-circle" size={32} color={COLORS.primary} />
          </View>
          <View style={styles.bubble}>
            <Text style={styles.userName}>{reply.user}</Text>
            <Text style={styles.text}>{reply.text}</Text>
            <View style={styles.rowActions}>
              <Text style={styles.timeText}>{reply.time}</Text>
              <TouchableOpacity onPress={() => setReplyTo(reply.id)}>
                <Text style={styles.replyBtn}>Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[styles.popupContainer, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.swipeBar} />
          <Text style={styles.title}>Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 12 }}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="person-circle" size={38} color={COLORS.primary} />
                </View>
                <View style={styles.bubble}>
                  <Text style={styles.userName}>{item.user}</Text>
                  <Text style={styles.text}>{item.text}</Text>
                  <View style={styles.rowActions}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    <TouchableOpacity onPress={() => setReplyTo(item.id)}>
                      <Text style={styles.replyBtn}>Reply</Text>
                    </TouchableOpacity>
                  </View>
                  {item.replies && renderReplies(item.replies)}
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No comments yet. Be the first!</Text>}
            style={{ flexGrow: 0, maxHeight: 320 }}
          />
          <View style={styles.inputRow}>
            {replyTo && (
              <TouchableOpacity onPress={() => setReplyTo(null)}>
                <Text style={styles.replyingTo}>Replying...</Text>
              </TouchableOpacity>
            )}
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={replyTo ? 'Reply...' : 'Add a comment...'}
              placeholderTextColor={COLORS.textSecondary}
              maxLength={120}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => {
                if (input.trim()) {
                  onSend(input, replyTo || undefined);
                  setInput('');
                  setReplyTo(null);
                }
              }}
            >
              <Ionicons name="send" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.38)',
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  popupContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    paddingHorizontal: 14,
    minHeight: 180,
    maxHeight: 420,
    width: width,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  swipeBar: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#bbb',
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bubble: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  userName: {
    ...FONTS.body3,
    color: COLORS.primary,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  text: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  timeText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  replyBtn: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  replyingTo: {
    ...FONTS.caption,
    color: COLORS.primary,
    marginRight: 8,
  },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    paddingTop: 8,
    paddingBottom: 2,
    marginTop: 2,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  sendButton: {
    padding: 6,
    borderRadius: 14,
    backgroundColor: 'transparent',
  },
});

export default ChatboxPopup;
