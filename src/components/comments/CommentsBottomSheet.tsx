import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
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

const EMOJIS = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];

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

  const renderComment = ({ item }: { item: Comment }) => <CommentItem comment={item} onLike={onLikeComment} onReply={handleSetReplyingTo} />;

  const handleSend = () => {
    if (newComment.trim()) {
      onSendComment(newComment.trim(), replyingTo?.id);
      setNewComment('');
      setReplyingTo(null);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 8,
      paddingBottom: 0,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 24,
    },
    handleBar: {
      width: 40,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: colors.surface,
      alignSelf: 'center',
      marginBottom: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.surface,
      position: 'relative',
      paddingHorizontal: 16,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    closeButton: {
      position: 'absolute',
      right: 16,
    },
    list: {
      flex: 1,
      paddingHorizontal: 16,
    },
    inputSection: {
      borderTopWidth: 1,
      borderTopColor: colors.surface,
      padding: 16,
    },
    emojiContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    emojiText: {
      fontSize: 24,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
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
      color: colors.textPrimary,
      fontSize: 16,
    },
    sendButton: {
      marginLeft: 8,
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 8,
    },
    replyingToContainer: {
      backgroundColor: colors.surface,
      padding: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      borderRadius: 8,
    },
    replyingToText: {
      color: colors.textSecondary,
    },
  });

  return (
    <BottomSheetView style={styles.container}>
      <View style={styles.handleBar} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comments</Text>
      </View>

      <BottomSheetFlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: 90 }]}
        showsVerticalScrollIndicator={false}
      />

      {/* Input is now absolutely positioned at the bottom */}
      <View style={[styles.inputSection, { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.surface }]}>
        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <Text style={styles.replyingToText}>Replying to {replyingTo.username}</Text>
            <TouchableOpacity onPress={cancelReply}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiContainer}>
          {EMOJIS.map((emoji, index) => (
            <TouchableOpacity key={index} onPress={() => setNewComment(prev => prev + emoji)}>
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <Image source={{ uri: currentUserAvatar }} style={styles.avatar} />
          <TextInput
            style={styles.input}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={18} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetView>
  );
};

export default CommentsBottomSheet;
