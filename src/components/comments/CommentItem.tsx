import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

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


  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingRight: 10,
      paddingLeft: isReply ? 30 : 10, // Indent replies
      marginLeft: isReply ? 20 : 0,
      borderLeftWidth: isReply ? 2 : 0,
      borderLeftColor: colors.surface,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    commentContainer: {
      flex: 1,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 3,
    },
    username: {
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginRight: 8,
    },
    timestamp: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    commentText: {
      color: colors.textPrimary,
    },
    commentActions: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    replyButton: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    likesContainer: {
      alignItems: 'center',
      marginLeft: 16,
      paddingTop: 5,
    },
    likeCount: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 2,
      marginLeft: 4,
    },
    viewRepliesButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    line: {
      width: 24,
      height: 1,
      backgroundColor: colors.textSecondary,
      marginRight: 8,
    },
    viewRepliesText: {
      color: colors.textSecondary,
      fontWeight: 'bold',
    },
    repliesContainer: {
      marginTop: 10,
    },
  });

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <View>
      <View style={styles.container}>
        <Image source={{ uri: comment.user.profilePicture }} style={styles.avatar} />
        <View style={styles.commentContainer}>
          <View style={styles.commentHeader}>
            <Text style={styles.username}>{comment.user.username}</Text>
            <Text style={styles.timestamp}>{comment.timestamp}</Text>

          </View>
          <Text style={styles.commentText}>{comment.text}</Text>
          <View style={styles.commentActions}>
            <TouchableOpacity onPress={() => onReply(comment.id, comment.user.username)}>
              <Text style={styles.replyButton}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.likesContainer}>
          <TouchableOpacity onPress={() => onLike(comment.id)}>
            <Ionicons 
              name={comment.isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={comment.isLiked ? 'red' : colors.textSecondary} 
            />
          </TouchableOpacity>
          {comment.likes > 0 && <Text style={styles.likeCount}>{comment.likes}</Text>}
        </View>
      </View>

      {hasReplies && comment.replies && (
        <View style={styles.repliesContainer}>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              isReply={true} // Always indent only one level for all replies
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CommentItem;
