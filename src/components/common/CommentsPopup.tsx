import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

// Enhanced Comment interface to support nested replies
export interface Comment {
  id: string;
  user: string;
  avatar: string;
  note: string;
  time: string;
  likes: number;
  replies?: Comment[];
}

interface CommentsPopupProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onSend: (text: string, parentId?: string) => void;
}

// Recursive component to render each comment and its replies
const CommentItem: React.FC<{ comment: Comment; onReply: (user: string, id: string) => void; isLast: boolean; level?: number }> = ({ comment, onReply, isLast, level = 0 }) => {
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <View style={[styles.commentWrapper, { marginLeft: level * SIZES.large }]}>
      <View style={styles.commentContainer}>
        <Image source={{ uri: comment.avatar }} style={styles.avatar} />
        {/* Vertical line connecting comments in a thread */}
        {hasReplies && <View style={styles.threadLine} />}
        <View style={styles.commentContent}>
          <Text style={styles.commentText}>
            <Text style={styles.userName}>{comment.user}</Text>{' '}
            {comment.note}
          </Text>
          <View style={styles.commentActions}>
            <Text style={styles.timeText}>{comment.time}</Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.actionText}>{comment.likes} likes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onReply(comment.user, comment.id)}>
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart-outline" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      {hasReplies && (
        <View style={styles.repliesContainer}>
          {comment.replies?.map((reply, index) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              isLast={index === (comment.replies?.length ?? 0) - 1}
              level={1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const CommentsPopup: React.FC<CommentsPopupProps> = ({ visible, onClose, comments, onSend }) => {
  const [input, setInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ user: string; id: string } | null>(null);
  const inputRef = useRef<TextInput>(null);

  if (!visible) return null;

  const handleReply = (user: string, id: string) => {
    setReplyingTo({ user, id });
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (input.trim()) {
      onSend(input, replyingTo?.id);
      setInput('');
      setReplyingTo(null);
    }
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.background} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.popupContainer}>
        <View style={styles.header}>
          <View style={styles.handlebar} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {comments.map((comment, index) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              isLast={index === comments.length - 1}
            />
          ))}
          {comments.length === 0 && (
             <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
          )}
        </ScrollView>
        <View style={styles.inputRow}>
          {replyingTo && (
            <View style={styles.replyingToBanner}>
              <Text style={styles.replyingToText}>Replying to {replyingTo.user}</Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={replyingTo ? `Reply to ${replyingTo.user}...` : 'Add a comment...'}
            placeholderTextColor={COLORS.textSecondary}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="arrow-up-circle" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, justifyContent: 'flex-end' },
  background: { ...StyleSheet.absoluteFillObject },
  popupContainer: { backgroundColor: COLORS.backgroundLight, borderTopLeftRadius: SIZES.radiusLarge, borderTopRightRadius: SIZES.radiusLarge, paddingBottom: SIZES.large, maxHeight: '85%' },
  header: { alignItems: 'center', paddingVertical: SIZES.small },
  handlebar: { width: 40, height: 5, backgroundColor: COLORS.surface, borderRadius: 2.5, marginVertical: SIZES.small },
  scrollContainer: { paddingHorizontal: SIZES.medium, paddingBottom: SIZES.large },
  commentWrapper: { position: 'relative' },
  commentContainer: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: SIZES.small, position: 'relative' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: SIZES.small },
  threadLine: { position: 'absolute', top: 48, left: 18, width: 2, backgroundColor: COLORS.surface, bottom: 0 },
  commentContent: { flex: 1 },
  commentText: { ...FONTS.body3, color: COLORS.textSecondary, lineHeight: 20 },
  userName: { fontWeight: 'bold', color: COLORS.textPrimary },
  commentActions: { flexDirection: 'row', alignItems: 'center', marginTop: SIZES.small, gap: SIZES.medium },
  timeText: { ...FONTS.caption, color: COLORS.textTertiary },
  actionText: { ...FONTS.caption, color: COLORS.textSecondary, fontWeight: 'bold' },
  likeButton: { paddingLeft: SIZES.medium },
  repliesContainer: { marginLeft: SIZES.large, borderLeftWidth: 2, borderLeftColor: COLORS.surface, paddingLeft: SIZES.small },
  emptyText: { ...FONTS.body3, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: SIZES.spacingXLarge },
  inputRow: { flexDirection: 'column', borderTopWidth: 1, borderColor: COLORS.surface, paddingTop: SIZES.small, paddingHorizontal: SIZES.medium, paddingBottom: Platform.OS === 'ios' ? SIZES.medium : SIZES.small },
  replyingToBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, paddingVertical: SIZES.small, paddingHorizontal: SIZES.medium, marginBottom: SIZES.small, borderRadius: SIZES.radiusSmall },
  replyingToText: { ...FONTS.caption, color: COLORS.textSecondary },
  input: { flex: 1, backgroundColor: COLORS.surface, borderRadius: SIZES.radiusLarge, paddingHorizontal: SIZES.medium, paddingVertical: SIZES.small, ...FONTS.body3, color: COLORS.textPrimary, marginRight: SIZES.small },
  sendButton: { position: 'absolute', right: SIZES.medium, bottom: Platform.OS === 'ios' ? SIZES.large - 5 : SIZES.medium - 5 },
});

export default CommentsPopup;
