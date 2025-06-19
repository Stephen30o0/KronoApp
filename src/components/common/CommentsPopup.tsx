import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

const CommentItem: React.FC<{ comment: Comment; onReply: (user: string, id: string) => void; level?: number }> = ({ comment, onReply, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level < 1); // Auto-expand first level of replies
  const hasReplies = comment.replies && comment.replies.length > 0;

  const toggleReplies = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.commentWrapper}>
      <View style={styles.commentContainer}>
        <Image source={{ uri: comment.avatar }} style={styles.avatar} />
        {hasReplies && <View style={[styles.threadLine, { left: SIZES.avatarSmall / 2 }]} />} 
        <View style={styles.commentContent}>
          <Text>
            <Text style={styles.userName}>{comment.user}</Text>{' '}
            <Text style={styles.commentText}>{comment.note}</Text>
          </Text>
          <View style={styles.commentActions}>
            <Text style={styles.timeText}>{comment.time}</Text>
            <TouchableOpacity onPress={() => onReply(comment.user, comment.id)}>
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart-outline" size={18} color={COLORS.textSecondary} />
          <Text style={styles.likeCount}>{comment.likes}</Text>
        </TouchableOpacity>
      </View>

      {hasReplies && (
        <View style={[styles.repliesContainer, { marginLeft: SIZES.avatarSmall + SIZES.spacingSmall }]}>
          {isExpanded ? (
            comment.replies?.map(reply => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} level={level + 1} />
            ))
          ) : (
            <TouchableOpacity style={styles.viewRepliesButton} onPress={toggleReplies}>
              <View style={styles.viewRepliesLine} />
              <Text style={styles.viewRepliesText}>
                View {comment.replies?.length || 0} {(comment.replies?.length || 0) > 1 ? 'replies' : 'reply'}
              </Text>
            </TouchableOpacity>
          )}
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.popupContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -SIZES.spacingSmall : 0}
      >
        <View style={styles.header}>
          <View style={styles.handlebar} />
          <Text style={styles.headerTitle}>Comments</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} onReply={handleReply} />
          ))}
          {comments.length === 0 && (
            <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          {replyingTo && (
            <View style={styles.replyingToBanner}>
              <Text style={styles.replyingToText}>Replying to {replyingTo.user}</Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputRow}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} style={styles.inputAvatar} />
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder={replyingTo ? `Add a reply...` : 'Add a comment...'}
              placeholderTextColor={COLORS.textTertiary}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="arrow-up" size={22} color={COLORS.background} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, justifyContent: 'flex-end' },
  background: { ...StyleSheet.absoluteFillObject },
  popupContainer: { 
    backgroundColor: COLORS.surface, 
    borderTopLeftRadius: SIZES.radiusXLarge,
    borderTopRightRadius: SIZES.radiusXLarge,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: { alignItems: 'center', paddingVertical: SIZES.spacingSmall, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  handlebar: { width: 40, height: 5, backgroundColor: COLORS.divider, borderRadius: 2.5, marginBottom: SIZES.spacingSmall },
  headerTitle: { ...FONTS.h5, color: COLORS.textPrimary },
  scrollContainer: { paddingHorizontal: SIZES.spacingMedium, paddingBottom: SIZES.spacingLarge },
  commentWrapper: { paddingTop: SIZES.spacingMedium },
  commentContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  avatar: { width: SIZES.avatarSmall, height: SIZES.avatarSmall, borderRadius: SIZES.avatarSmall / 2, marginRight: SIZES.spacingSmall },
  threadLine: { position: 'absolute', top: SIZES.avatarSmall, width: 1, backgroundColor: COLORS.divider, bottom: -SIZES.spacingSmall },
  commentContent: { flex: 1 },
  userName: { ...FONTS.semiBold, color: COLORS.textPrimary, fontSize: 14 },
  commentText: { ...FONTS.body3, color: COLORS.textSecondary, lineHeight: 21 },
  commentActions: { flexDirection: 'row', alignItems: 'center', marginTop: SIZES.spacingTiny, gap: SIZES.spacingMedium },
  timeText: { ...FONTS.caption, color: COLORS.textTertiary },
  actionText: { ...FONTS.caption, color: COLORS.primary, fontWeight: '600' },
  likeButton: { flexDirection: 'row', alignItems: 'center', paddingLeft: SIZES.spacingSmall },
  likeCount: { ...FONTS.caption, color: COLORS.textSecondary, marginLeft: SIZES.spacingTiny },
  repliesContainer: {},
  viewRepliesButton: { flexDirection: 'row', alignItems: 'center', marginTop: SIZES.spacingSmall },
  viewRepliesLine: { width: 30, height: 1, backgroundColor: COLORS.divider, marginRight: SIZES.spacingSmall },
  viewRepliesText: { ...FONTS.caption, color: COLORS.textSecondary, fontWeight: '600' },
  emptyText: { ...FONTS.body3, color: COLORS.textSecondary, textAlign: 'center', paddingVertical: SIZES.spacingXLarge },
  inputContainer: { borderTopWidth: 1, borderTopColor: COLORS.divider, padding: SIZES.spacingMedium, backgroundColor: COLORS.surface },
  replyingToBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: SIZES.spacingSmall },
  replyingToText: { ...FONTS.caption, color: COLORS.textSecondary },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: SIZES.radiusCircular, paddingHorizontal: SIZES.spacingSmall },
  inputAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: SIZES.spacingSmall },
  input: { flex: 1, ...FONTS.body3, color: COLORS.textPrimary, paddingVertical: SIZES.spacingSmall },
  sendButton: { backgroundColor: COLORS.primary, borderRadius: SIZES.radiusCircular, padding: SIZES.spacingSmall },
});

export default CommentsPopup;
