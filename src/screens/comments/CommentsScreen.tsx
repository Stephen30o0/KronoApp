import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import CommentItem from '../../components/comments/CommentItem';
import { useTheme } from '../../context/ThemeContext';

interface Comment {
  id: string;
  user: { username: string; profilePicture: string };
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

const QUICK_REACTIONS = ['❤️', '🙌', '🔥', '👏', '😂', '😍', '💯', '🎉'];

const CommentsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const { comments, onSendComment, onLikeComment, currentUserAvatar } = route.params;

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

  const addReaction = (emoji: string) => {
    onSendComment(emoji, replyingTo?.id);
    setReplyingTo(null);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.surface,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    commentsCount: {
      fontSize: 14,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    closeButton: {
      padding: 4,
    },
    commentsList: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    inputSection: {
      backgroundColor: colors.background,
      borderTopWidth: 0.5,
      borderTopColor: colors.surface,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    reactionContainer: {
      flexDirection: 'row',
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    reactionButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.surface,
      borderRadius: 20,
      marginRight: 8,
    },
    reactionText: {
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 28,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginTop: 8,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
    },
    input: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: 16,
      paddingVertical: 8,
      maxHeight: 100,
    },
    sendButton: {
      marginLeft: 12,
      backgroundColor: colors.primary,
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: colors.surface,
    },
    replyingToContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      borderRadius: 12,
    },
    replyingToText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    replyingToUsername: {
      color: colors.primary,
      fontWeight: '600',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyStateText: {
      color: colors.textSecondary,
      fontSize: 16,
      marginTop: 8,
    },
    emptyStateIcon: {
      opacity: 0.3,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Comments</Text>
            <Text style={styles.commentsCount}>({comments.length})</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        {comments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="chatbubble-outline" 
              size={48} 
              color={colors.textSecondary} 
              style={styles.emptyStateIcon} 
            />
            <Text style={styles.emptyStateText}>No comments yet</Text>
            <Text style={styles.emptyStateText}>Be the first to comment!</Text>
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CommentItem comment={item} onLike={onLikeComment} onReply={handleSetReplyingTo} />
            )}
            contentContainerStyle={[styles.commentsList, { paddingBottom: 120 }]}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}

        {/* Input Section */}
        <View style={styles.inputSection}>
          {replyingTo && (
            <View style={styles.replyingToContainer}>
              <Text style={styles.replyingToText}>
                Replying to <Text style={styles.replyingToUsername}>@{replyingTo.username}</Text>
              </Text>
              <TouchableOpacity onPress={cancelReply}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.reactionContainer}
          >
            {QUICK_REACTIONS.map((emoji, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.reactionButton}
                onPress={() => addReaction(emoji)}
              >
                <Text style={styles.reactionText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.inputContainer}>
            <Image source={{ uri: currentUserAvatar }} style={styles.avatar} />
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder={replyingTo ? `Reply to ${replyingTo.username}...` : "Add a comment..."}
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="center"
            />
            <TouchableOpacity 
              onPress={handleSend} 
              style={[
                styles.sendButton, 
                !newComment.trim() && styles.sendButtonDisabled
              ]}
              disabled={!newComment.trim()}
            >
              <Ionicons 
                name="send" 
                size={16} 
                color={newComment.trim() ? colors.background : colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommentsScreen;
