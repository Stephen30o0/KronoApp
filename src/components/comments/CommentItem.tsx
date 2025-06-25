import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export type Comment = {
  id: string;
  user: {
    username: string;
    profilePicture: string;
  };
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, username: string) => void;
  isReply?: boolean;
}

const CommentItem = ({ comment, onLike, onReply, isReply = false }: CommentItemProps) => {
  const { colors } = useTheme();
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = () => {
    onLike(comment.id);
  };

  const handleReply = () => {
    onReply(comment.id, comment.user.username);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const formatTimestamp = (timestamp: string) => {
    // Simple formatting - you can enhance this based on your needs
    return timestamp;
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: 8,
      marginLeft: isReply ? 44 : 0,
    },
    avatar: {
      width: isReply ? 32 : 36,
      height: isReply ? 32 : 36,
      borderRadius: isReply ? 16 : 18,
      marginRight: 12,
    },
    contentContainer: {
      flex: 1,
    },
    commentBubble: {
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
      borderTopLeftRadius: isReply ? 20 : 4,
      marginBottom: 8,
    },
    usernameText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    commentText: {
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 20,
    },    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 4,
      justifyContent: 'space-between',
      marginTop: 4,
    },
    actionsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timestamp: {
      fontSize: 12,
      color: colors.textSecondary,
      marginRight: 20,
    },    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: colors.surface,
      minWidth: 70,
      justifyContent: 'center',
      marginLeft: 12,
    },
    actionText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
      marginLeft: 6,
    },
    likeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: colors.surface,
      minWidth: 60,
      justifyContent: 'center',
    },
    likeCount: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
      marginLeft: 4,
    },
    likeCountActive: {
      color: '#FF3040',
    },
    viewRepliesButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 4,
      paddingVertical: 8,
      marginTop: 4,
    },
    repliesLine: {
      width: 24,
      height: 1,
      backgroundColor: colors.textSecondary,
      opacity: 0.3,
      marginRight: 8,
    },
    viewRepliesText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    repliesContainer: {
      marginTop: 8,
      paddingLeft: isReply ? 0 : 8,
    },
    replyIndicator: {
      position: 'absolute',
      left: -12,
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: colors.surface,
      borderRadius: 1,
    },
  });

  const hasReplies = comment.replies && comment.replies.length > 0;
  const isEmojiOnly = /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u.test(comment.text.trim());

  return (
    <View>
      <View style={styles.container}>
        {isReply && <View style={styles.replyIndicator} />}
        
        <Image source={{ uri: comment.user.profilePicture }} style={styles.avatar} />
        
        <View style={styles.contentContainer}>
          {isEmojiOnly ? (
            // Render emoji-only comments larger and without bubble
            <View style={{ paddingVertical: 4 }}>
              <Text style={styles.usernameText}>{comment.user.username}</Text>
              <Text style={{ fontSize: 24, lineHeight: 28 }}>{comment.text}</Text>
            </View>
          ) : (
            // Regular comment bubble
            <View style={styles.commentBubble}>
              <Text style={styles.usernameText}>{comment.user.username}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          )}
            <View style={styles.actionsContainer}>
            <View style={styles.actionsLeft}>
              <Text style={styles.timestamp}>{formatTimestamp(comment.timestamp)}</Text>
            </View>
            
            <View style={styles.actionsLeft}>
              <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
                <Ionicons 
                  name={comment.isLiked ? "heart" : "heart-outline"} 
                  size={16} 
                  color={comment.isLiked ? '#FF3040' : colors.textSecondary} 
                />
                {comment.likes > 0 && (
                  <Text style={[styles.likeCount, comment.isLiked && styles.likeCountActive]}>
                    {comment.likes}
                  </Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={handleReply}>
                <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.actionText}>Reply</Text>
              </TouchableOpacity>
            </View>
          </View>

          {hasReplies && (
            <TouchableOpacity style={styles.viewRepliesButton} onPress={toggleReplies}>
              <View style={styles.repliesLine} />
              <Text style={styles.viewRepliesText}>
                {showReplies ? 'Hide' : 'View'} {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
              </Text>
              <Ionicons 
                name={showReplies ? "chevron-up" : "chevron-down"} 
                size={14} 
                color={colors.textSecondary} 
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {hasReplies && showReplies && comment.replies && (
        <View style={styles.repliesContainer}>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              isReply={true}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CommentItem;
