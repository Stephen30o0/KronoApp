import { Ionicons } from '@expo/vector-icons';
import { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import CommentItem from './CommentItem';

interface Comment {
  id: string;
  user: { username: string; profilePicture: string; };
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentsBottomSheetProps {
  comments: Comment[];
  onSendComment: (text: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  currentUserAvatar: string;
}

const QUICK_REACTIONS = ['❤️', '🙌', '🔥', '👏', '�', '😍', '�', '🎉'];

const CommentsBottomSheet = ({ comments, onSendComment, onLikeComment, currentUserAvatar }: CommentsBottomSheetProps) => {
  const { colors } = useTheme();
  const [newComment, setNewComment] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<{ id: string; username: string } | null>(null);

  const handleSetReplyingTo = (id: string, username: string) => {
    setReplyingTo({ id, username });
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <CommentItem 
      comment={item} 
      onLike={onLikeComment} 
      onReply={handleSetReplyingTo} 
    />
  );

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    handleBar: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.surface,
      alignSelf: 'center',
      marginTop: 8,
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 16,
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
    list: {
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
      paddingVertical: 40,
      alignItems: 'center',
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
    <BottomSheetView style={styles.container}>
      <View style={styles.handleBar} />
      
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Comments</Text>
          <Text style={styles.commentsCount}>({comments.length})</Text>
        </View>
      </View>

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
        <BottomSheetFlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

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
    </BottomSheetView>
  );
};

export default CommentsBottomSheet;
