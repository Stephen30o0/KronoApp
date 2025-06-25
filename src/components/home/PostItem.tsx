import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';
import type { RootStackParamList } from '../../navigation/types';
import haptics from '../../utils/haptics';

interface Post {
  id: string;
  username: string;
  avatar?: string;
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
  const { username, avatar, caption, comments, likes, timestamp, isLiked, isBookmarked, imageUrl } = post;

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePostPress = () => {
    navigation.navigate('PostDetailScreen', { post });
  };

  const handleLike = () => {
    onLike();
  };

  const handleBookmark = () => {
    onBookmark();
  };

  const handleCommentPress = () => {
    // The onComment prop can be used for analytics or other parent-level actions
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

  return (
    <View style={[styles.postContainer, { backgroundColor: colors.background }]}>
      {/* Post header with user info */}
      <View style={styles.postHeader}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => onProfilePress && onProfilePress(username)}
        >
          <View style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.surface }]}>
                <Text style={[styles.avatarText, { color: colors.primary }]}>
                  {username.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: colors.textPrimary }]}>{username}</Text>
            <Text style={[styles.timestamp, { color: colors.textTertiary }]}>{timestamp}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Post image */}
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.postImage} />
        </View>
      )} 

      {/* Post Actions row with counts */}
      <View style={styles.actionsRow}> 
        {/* Like button and count */}
        <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={22} 
            color={isLiked ? COLORS.error : colors.textPrimary} 
          />
          <Text style={[styles.actionText, { color: colors.textPrimary }]}>{likes}</Text>
        </TouchableOpacity>

        {/* Comment button and count */}
        <TouchableOpacity onPress={handleCommentPress} style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color={colors.textPrimary} />
          <Text style={[styles.actionText, { color: colors.textPrimary }]}>{comments}</Text>
        </TouchableOpacity>

        {/* Share button */}
        <TouchableOpacity onPress={handleSharePress} style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Spacer to push bookmark to the right */}
        <View style={{ flex: 1 }} />

        {/* Bookmark button */}
        <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
          <Ionicons 
            name={isBookmarked ? "bookmark" : "bookmark-outline"} 
            size={22} 
            color={isBookmarked ? colors.primary : colors.textPrimary} 
          />
        </TouchableOpacity>
      </View>

      {/* Post caption - moved below actions */}
      {caption && (
        <Text style={[styles.caption, { color: colors.textPrimary }]}>{caption}</Text>
      )}

      {/* Post tags - moved below caption */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <Text key={index} style={[styles.tag, { color: colors.primary }]}>
              #{tag.replace('#', '')}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: COLORS.background,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
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
    fontSize: 16,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },  caption: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 8,
  },
  tag: {
    fontSize: 14,
    marginRight: 8,
    marginBottom: 4,
  },  imageContainer: {
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default PostItem;
