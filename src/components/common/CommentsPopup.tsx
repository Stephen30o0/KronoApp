import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    Keyboard,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

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

const QUICK_REACTIONS = ['❤️', '🙌', '🔥', '👏', '😂', '😍', '💯', '🎉'];

const CommentItem: React.FC<{ 
  comment: Comment; 
  onReply: (user: string, id: string) => void; 
  level?: number;
  colors: any;
}> = ({ comment, onReply, level = 0, colors }) => {
  const [isExpanded, setIsExpanded] = useState(level < 1);
  const [isLiked, setIsLiked] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  const toggleReplies = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const isEmojiOnly = /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u.test(comment.note.trim());
  const isReply = level > 0;

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={[styles.commentContainer, { marginLeft: isReply ? 44 : 0 }]}>
        {isReply && <View style={[styles.replyIndicator, { backgroundColor: colors.surface }]} />}
        
        <Image source={{ uri: comment.avatar }} style={[styles.avatar, { 
          width: isReply ? 32 : 36, 
          height: isReply ? 32 : 36, 
          borderRadius: isReply ? 16 : 18 
        }]} />
        
        <View style={styles.contentContainer}>
          {isEmojiOnly ? (
            <View style={{ paddingVertical: 4 }}>
              <Text style={[styles.usernameText, { color: colors.textPrimary }]}>{comment.user}</Text>
              <Text style={{ fontSize: 24, lineHeight: 28 }}>{comment.note}</Text>
            </View>
          ) : (
            <View style={[styles.commentBubble, { 
              backgroundColor: colors.surface,
              borderTopLeftRadius: isReply ? 20 : 4 
            }]}>
              <Text style={[styles.usernameText, { color: colors.textPrimary }]}>{comment.user}</Text>
              <Text style={[styles.commentText, { color: colors.textPrimary }]}>{comment.note}</Text>
            </View>          )}
          <View style={styles.actionsContainer}>
            <View style={styles.actionsLeft}>
              <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{comment.time}</Text>
            </View>
            
            <View style={styles.actionsRight}>
              <TouchableOpacity style={[styles.likeButton, { backgroundColor: colors.surface }]} onPress={handleLike}>
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={16} 
                  color={isLiked ? '#FF3040' : colors.textSecondary} 
                />
                {comment.likes > 0 && (
                  <Text style={[styles.likeCount, { 
                    color: isLiked ? '#FF3040' : colors.textSecondary 
                  }]}>
                    {comment.likes}
                  </Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]} onPress={() => onReply(comment.user, comment.id)}>
                <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.actionText, { color: colors.textSecondary }]}>Reply</Text>
              </TouchableOpacity>
            </View>
          </View>

          {hasReplies && (
            <TouchableOpacity style={styles.viewRepliesButton} onPress={toggleReplies}>
              <View style={[styles.repliesLine, { backgroundColor: colors.textSecondary }]} />
              <Text style={[styles.viewRepliesText, { color: colors.textSecondary }]}>
                {isExpanded ? 'Hide' : 'View'} {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
              </Text>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={14} 
                color={colors.textSecondary} 
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {hasReplies && isExpanded && comment.replies && (
        <View style={{ marginTop: 8 }}>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              level={level + 1}
              colors={colors}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const CommentsPopup: React.FC<CommentsPopupProps> = ({ visible, onClose, comments, onSend }) => {
  const { colors } = useTheme();
  const [input, setInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ user: string; id: string } | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // Add a small delay before scrolling to ensure layout has updated
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
      // Pre-adjust for keyboard
      if (Platform.OS === 'ios') {
        setKeyboardHeight(e.endCoordinates.height);
      }
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      if (Platform.OS === 'ios') {
        keyboardWillShowListener.remove();
      }
    };
  }, []);

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

  const addReaction = (emoji: string) => {
    onSend(emoji, replyingTo?.id);
    setReplyingTo(null);
  };  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.background} activeOpacity={1} onPress={onClose} />      <View style={[
        styles.container, 
        { 
          marginBottom: keyboardHeight > 0 ? 
            (Platform.OS === 'ios' ? keyboardHeight - 10 : keyboardHeight - 5) : 
            0
        }
      ]}>
        <View style={[styles.popupContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.handleBar, { backgroundColor: colors.surface }]} />
          
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Comments</Text>
              <Text style={[styles.commentsCount, { color: colors.textSecondary }]}>({comments.length})</Text>
            </View>
          </View>

          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollContent}
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingBottom: keyboardHeight > 0 ? 20 : 120 }
            ]} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {comments.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons 
                  name="chatbubble-outline" 
                  size={48} 
                  color={colors.textSecondary} 
                  style={styles.emptyStateIcon} 
                />
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No comments yet</Text>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>Be the first to comment!</Text>
              </View>
            ) : (
              comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} onReply={handleReply} colors={colors} />
              ))
            )}
          </ScrollView>

          <View style={[
            styles.inputContainer, 
            { 
              backgroundColor: colors.background, 
              borderTopColor: colors.surface,
              paddingBottom: keyboardHeight > 0 ? 
                (Platform.OS === 'ios' ? 20 : 16) : 
                (Platform.OS === 'ios' ? 40 : 20)
            }
          ]}>
            {replyingTo && (
              <View style={[styles.replyingToBanner, { backgroundColor: colors.surface }]}>
                <Text style={[styles.replyingToText, { color: colors.textSecondary }]}>
                  Replying to <Text style={[styles.replyingToUsername, { color: colors.primary }]}>@{replyingTo.user}</Text>
                </Text>
                <TouchableOpacity onPress={() => setReplyingTo(null)}>
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
                  style={[styles.reactionButton, { backgroundColor: colors.surface }]}
                  onPress={() => addReaction(emoji)}
                >
                  <Text style={styles.reactionText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={[styles.inputRow, { backgroundColor: colors.surface }]}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }} style={styles.inputAvatar} />
              <TextInput
                ref={inputRef}
                style={[styles.input, { color: colors.textPrimary }]}
                value={input}
                onChangeText={setInput}
                placeholder={replyingTo ? `Reply to ${replyingTo.user}...` : 'Add a comment...'}
                placeholderTextColor={colors.textSecondary}
                multiline
                textAlignVertical="center"
                onFocus={() => {
                  // Scroll to bottom when input is focused
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 400);
                }}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton, 
                  { backgroundColor: input.trim() ? colors.primary : colors.surface }
                ]}
                onPress={handleSend}
                disabled={!input.trim()}
              >
                <Ionicons 
                  name="send" 
                  size={16} 
                  color={input.trim() ? colors.background : colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 9999,
    justifyContent: 'flex-end',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },  popupContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    maxHeight: Dimensions.get('window').height * 0.92,
    marginTop: Platform.OS === 'ios' ? 60 : 50, // Maintain spacing from top
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 25,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },  commentsCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  scrollContent: {
    flex: 1,
  },  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    flexGrow: 1,
  },
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  replyIndicator: {
    position: 'absolute',
    left: -12,
    top: 0,
    bottom: 0,
    width: 2,
    borderRadius: 1,
  },
  avatar: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  commentBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  usernameText: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 15,
    lineHeight: 20,
  },  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    justifyContent: 'space-between',
    marginTop: 4,
  },  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    marginRight: 20,
  },actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 70,
    justifyContent: 'center',
    marginLeft: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
    justifyContent: 'center',
  },
  likeCount: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
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
    opacity: 0.3,
    marginRight: 8,
  },
  viewRepliesText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 8,
  },
  emptyStateIcon: {
    opacity: 0.3,
  },  inputContainer: {
    borderTopWidth: 0.5,
    paddingHorizontal: 20,
    paddingTop: 16,
    minHeight: Platform.OS === 'ios' ? 120 : 100,
  },
  reactionContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  reactionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  reactionText: {
    fontSize: 16,
  },
  replyingToBanner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 12,
  },
  replyingToText: {
    fontSize: 14,
    fontWeight: '500',
  },
  replyingToUsername: {
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CommentsPopup;
