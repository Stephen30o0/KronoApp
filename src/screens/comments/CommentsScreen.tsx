import React, { useState, useRef } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import CommentItem from '../../components/comments/CommentItem';

interface Comment {
  id: string;
  user: { username: string; profilePicture: string };
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentsScreenProps {
  comments: Comment[];
  onSendComment: (text: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  currentUserAvatar: string;
  onClose: () => void;
}

const CommentsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const { comments, onSendComment, onLikeComment, currentUserAvatar, onClose } = route.params;

  const { colors } = useTheme();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);
  const inputRef = useRef<TextInput>(null);

  const handleSetReplyingTo = (id: string, username: string) => {
    setReplyingTo({ id, username });
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleSend = () => {
    if (newComment.trim()) {
      onSendComment(newComment.trim(), replyingTo?.id);
      setNewComment('');
      setReplyingTo(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Comments</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        {/* Comments List */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommentItem comment={item} onLike={onLikeComment} onReply={handleSetReplyingTo} />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
        {/* Input Box */}
        <View style={[styles.inputSection, { backgroundColor: colors.background, borderTopColor: colors.surface }]}>
          {replyingTo && (
            <View style={styles.replyingToContainer}>
              <Text style={[styles.replyingToText, { color: colors.textSecondary }]}>Replying to {replyingTo.username}</Text>
              <TouchableOpacity onPress={cancelReply}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputContainer}>
            <Image source={{ uri: currentUserAvatar }} style={styles.avatar} />
            <TextInput
              ref={inputRef}
              style={[styles.input, { color: colors.textPrimary }]}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor={colors.textSecondary}
              multiline
            />
            <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="send" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  inputSection: {
    borderTopWidth: 1,
    padding: 12,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  replyingToContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
  },
  replyingToText: {
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 36,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    borderRadius: 20,
    padding: 8,
  },
});

export default CommentsScreen;
