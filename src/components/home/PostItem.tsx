import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants
import { FONTS, SIZES, SHADOWS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import { BlurView } from 'expo-blur';
import haptics from '../../utils/haptics';

const { width, height } = Dimensions.get('window');

interface Post {
  id: string;
  username: string;
  avatar: string;
  caption: string;
  tags?: string[];
  comments: number;
  likes: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  imageUrl?: string;
}

interface PostItemProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
  onBookmark: () => void;
  onShare: () => void;
  colors?: any; // Theme colors
  onProfilePress?: (username: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({
  post,
  onLike,
  onComment,
  onBookmark,
  onShare,
  colors: propColors,
  onProfilePress,
}) => {
  // Use provided colors or get from theme context
  const themeContext = useTheme();
  const colors = propColors || themeContext.colors;
  const themeColors = colors; // Alias to fix references

  const { id, username, avatar, caption, tags, comments, likes, timestamp, isLiked, isBookmarked, imageUrl } = post;

  const [actionsVisible, setActionsVisible] = useState(false);
  const [commentDrawerVisible, setCommentDrawerVisible] = useState(false);
  const [expandedPost, setExpandedPost] = useState(false);
  const [voteConfirmation, setVoteConfirmation] = useState<string | null>(null);

  const actionButtonScale = useRef(new Animated.Value(1)).current;
  const actionButtonsPosition = useRef(new Animated.Value(0)).current;

  const toggleActionButtons = () => {
    if (actionsVisible) {
      Animated.parallel([
        Animated.timing(actionButtonsPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(actionButtonScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setActionsVisible(false));
    } else {
      setActionsVisible(true);
      Animated.parallel([
        Animated.timing(actionButtonsPosition, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(actionButtonScale, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const hideActionButtons = () => {
    if (actionsVisible) {
      Animated.parallel([
        Animated.timing(actionButtonsPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(actionButtonScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setActionsVisible(false));
    }
  };

  const handleLike = () => {
    onLike();
    setVoteConfirmation(isLiked ? 'Unlike' : 'Like');
    setTimeout(() => setVoteConfirmation(null), 1500);
  };

  const handleBookmark = () => {
    onBookmark();
    setVoteConfirmation(isBookmarked ? 'Removed from saved' : 'Saved');
    setTimeout(() => setVoteConfirmation(null), 1500);
  };

  const handleCommentPress = () => {
    setCommentDrawerVisible(true);
    onComment();
  };
  
  const handleSharePress = () => {
    // Call the onShare prop which should navigate to ShareModal
    // This will trigger the handleShare function in HomeScreen which should navigate to ShareModal
    onShare();
    
    // Add haptic feedback for better user experience
    if (haptics) {
      haptics.light();
    }
  };

  const handlePostPress = () => {
    if (imageUrl) {
      setExpandedPost(true);
      setActionsVisible(true);
      Animated.parallel([
        Animated.timing(actionButtonsPosition, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(actionButtonScale, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const renderActionButtons = () => {
    const actionButtons = [
      {
        icon: isLiked ? 'heart' : 'heart-outline',
        color: isLiked ? colors.error : COLORS.textPrimary,
        action: handleLike,
        label: 'Like',
      },
      {
        icon: 'chatbubble-outline',
        color: COLORS.textPrimary,
        action: handleCommentPress,
        label: 'Comment',
      },
      {
        icon: 'share-social-outline',
        color: COLORS.textPrimary,
        action: handleSharePress,
        label: 'Share',
      },
      {
        icon: isBookmarked ? 'bookmark' : 'bookmark-outline',
        color: isBookmarked ? COLORS.primary : COLORS.textPrimary,
        action: handleBookmark,
        label: 'Save',
      },
    ];

    return (
      <Animated.View
        style={[
          styles.actionButtonsVertical,
          {
            opacity: actionButtonsPosition,
            transform: [
              {
                translateY: actionButtonsPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        {actionButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButtonVertical}
            onPress={button.action}
          >
            <Ionicons name={button.icon as any} size={24} color={button.color} />
            <Text style={styles.actionButtonLabel}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };

  const renderCommentDrawer = () => {
    return (
      <Modal
        visible={commentDrawerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommentDrawerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={10} style={styles.blurBackground} tint="dark" />
          <View style={styles.commentDrawer}>
            <View style={styles.commentDrawerHeader}>
              <Text style={styles.commentDrawerTitle}>Comments</Text>
              <TouchableOpacity
                onPress={() => setCommentDrawerVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentsList}>
              {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} style={styles.commentItem}>
                  <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                    style={styles.commentAvatar}
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUsername}>user_{item}</Text>
                    <Text style={styles.commentText}>
                      This is a sample comment. Comments would be loaded from the backend.
                    </Text>
                    <View style={styles.commentMeta}>
                      <Text style={styles.commentTime}>2h ago</Text>
                      <TouchableOpacity>
                        <Text style={styles.commentReply}>Reply</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.actions}>
              <Image
                source={{ uri: avatar }}
                style={styles.commentInputAvatar}
              />
              <View style={styles.commentInput}>
                <Text style={styles.commentInputPlaceholder}>Add a comment...</Text>
              </View>
              <TouchableOpacity style={styles.commentSubmitButton}>
                <Ionicons name="send" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderExpandedPost = () => {
    return (
      <Modal
        visible={expandedPost}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setExpandedPost(false)}
      >
        <Pressable
          style={styles.expandedPostContainer}
          onPress={() => {
            hideActionButtons();
            setExpandedPost(false);
          }}
        >
          <BlurView intensity={90} style={styles.blurBackground} tint="dark" />

          <Pressable style={styles.expandedPostContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.expandedPostHeader}>
              <View style={styles.expandedPostUser}>
                <Image source={{ uri: avatar }} style={styles.expandedPostAvatar} />
                <Text style={styles.expandedPostUsername}>{username}</Text>
              </View>
              <TouchableOpacity onPress={() => setExpandedPost(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {imageUrl && (
              <Image source={{ uri: imageUrl }} style={styles.expandedPostImage} resizeMode="contain" />
            )}

            <View style={styles.expandedPostFooter}>
              <Text style={styles.expandedPostCaption}>{caption}</Text>
              <View style={styles.expandedPostTags}>
                {post.tags?.map((tag, index) => (
                  <Text key={index} style={styles.expandedPostTag}>{tag}</Text>
                ))}
              </View>

              <Animated.View style={styles.expandedPostActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { transform: [{ scale: actionButtonScale }] }]}
                  onPress={toggleActionButtons}
                >
                  <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>

                {actionsVisible && renderActionButtons()}
              </Animated.View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  const renderVoteConfirmation = () => {
    if (!voteConfirmation) return null;

    return (
      <Animated.View style={styles.voteConfirmation}>
        <Text style={styles.voteConfirmationText}>{voteConfirmation}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.divider }]}>
      {renderCommentDrawer()}
      {renderExpandedPost()}
      {/* Post header with user info */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => onProfilePress && onProfilePress(username)}
        >
          <View style={styles.avatar}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: COLORS.surface }]}>
                <Text style={[styles.avatarText, { color: COLORS.primary }]}>
                  {username.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View>
            <Text style={[styles.username, { color: COLORS.textPrimary }]}>{username}</Text>
            <Text style={[styles.timestamp, { color: COLORS.textTertiary }]}>{timestamp}</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Caption - Moved to top */}
      {caption && (
        <Text style={[styles.caption, { color: COLORS.textPrimary }]}>{caption}</Text>
      )}
      
      {imageUrl && (
        <TouchableOpacity 
          style={styles.imageContainer}
          onPress={handlePostPress}
          activeOpacity={0.9}
        >
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </TouchableOpacity>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags?.map((tag, index) => (
            <Text key={index} style={[styles.tag, { color: COLORS.primary }]}>{tag}</Text>
          ))}
        </View>
      )}

      {/* Post Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onLike}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? COLORS.error : COLORS.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCommentPress}
          >
            <Ionicons
              name="chatbubble-outline" as any
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSharePress}
          >
            <Ionicons
              name="share-social-outline" as any
              size={24}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onBookmark}
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline" as any}
            size={24}
            color={isBookmarked ? COLORS.primary : COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={styles.content}>
        <Text style={[styles.likes, { color: COLORS.textPrimary }]}>{likes} likes</Text>

        <TouchableOpacity onPress={handleCommentPress}>
          <Text style={[styles.viewComments, { color: COLORS.textSecondary }]}>View all {comments} comments</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radiusMedium,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...FONTS.body2,
    fontWeight: '600',
  },
  username: {
    ...FONTS.body2,
    fontWeight: '600',
  },
  timestamp: {
    ...FONTS.caption,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 280,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionButtonsVertical: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  actionButtonVertical: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionButtonLabel: {
    ...FONTS.body2,
    marginLeft: 12,
    color: COLORS.textPrimary,
  },
  content: {
    padding: 12,
  },
  likes: {
    ...FONTS.body2,
    fontWeight: '600',
    marginBottom: 6,
  },
  caption: {
    ...FONTS.body2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    lineHeight: 18,
    fontWeight: 'normal',
  },
  viewComments: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 6,
    marginBottom: 8,
  },
  tag: {
    ...FONTS.body2,
    color: COLORS.primary,
    marginRight: 8,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  commentDrawer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
    ...SHADOWS.large,
  },
  commentDrawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  commentDrawerTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsList: {
    flex: 1,
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  commentText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  commentMeta: {
    flexDirection: 'row',
    marginTop: 4,
  },
  commentTime: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
    marginRight: 16,
  },
  commentReply: {
    ...FONTS.caption,
    color: COLORS.primary,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  commentInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentInput: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  commentInputPlaceholder: {
    ...FONTS.body2,
    color: COLORS.textTertiary,
  },
  commentSubmitButton: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedPostContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedPostContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  expandedPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  expandedPostUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedPostAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  expandedPostUsername: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  expandedPostImage: {
    width: '100%',
    height: height * 0.5,
    backgroundColor: COLORS.surface,
  },
  expandedPostFooter: {
    padding: 16,
  },
  expandedPostCaption: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  expandedPostTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  expandedPostTag: {
    ...FONTS.caption,
    color: COLORS.primary,
    marginRight: 8,
    marginBottom: 4,
  },
  expandedPostActions: {
    position: 'relative',
    alignItems: 'flex-end',
  },
  voteConfirmation: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  voteConfirmationText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
});

export default PostItem;
