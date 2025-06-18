import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';
import haptics from '../../utils/haptics';
import ChatboxPopup, { ChatComment } from '../common/ChatboxPopup';

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
  const { username, avatar, caption, comments, likes, timestamp, isLiked, isBookmarked, imageUrl } = post;

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [commentDrawerVisible, setCommentDrawerVisible] = React.useState(false);

  // Mock comments data
  const [commentsData, setCommentsData] = React.useState<ChatComment[]>([
    {
      id: '1',
      user: 'karennne',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      text: 'This is an amazing shot! Where was this taken?',
      time: '2h',
      replies: [
        {
          id: '1-1',
          user: post.username,
          avatar: post.avatar,
          text: 'Thank you! This was in the Swiss Alps.',
          time: '1h',
        },
      ],
    },
    {
      id: '2',
      user: 'john.doe',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      text: 'Love the colors!',
      time: '1h',
    },
  ]);

  const handleSendComment = (text: string, replyToId?: string) => {
    const newComment: ChatComment = {
      id: Math.random().toString(),
      user: 'current_user', // Replace with actual user data
      avatar: 'https://randomuser.me/api/portraits/men/0.jpg',
      text,
      time: 'Just now',
    };

    if (replyToId) {
      // Add as a reply
      const updatedComments = commentsData.map(comment => {
        if (comment.id === replyToId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newComment],
          };
        }
        return comment;
      });
      setCommentsData(updatedComments);
    } else {
      // Add as a new comment
      setCommentsData([...commentsData, newComment]);
    }
  };

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
    setCommentDrawerVisible(true);
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
    <View style={{ backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.divider, marginVertical: 12 }}>
      <ChatboxPopup 
        visible={commentDrawerVisible} 
        onClose={() => setCommentDrawerVisible(false)} 
        comments={commentsData} 
        onSend={handleSendComment} 
      />
      {/* Post header with user info */}
      <View>
        <TouchableOpacity 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => onProfilePress && onProfilePress(username)}
        >
          <View>
            {avatar ? (
              <Image source={{ uri: avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
            ) : (
              <View style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface }}>
                <Text style={{ color: COLORS.primary }}>
                  {username.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ color: COLORS.textPrimary }}>{username}</Text>
            <Text style={{ color: COLORS.textTertiary }}>{timestamp}</Text>
          </View>
        </TouchableOpacity>

        {/* Post image */}
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.postImage} />
        )} 

        {/* Post caption */}
        {caption && (
          <Text style={{ color: COLORS.textPrimary, marginTop: 8, marginLeft: 12 }}>{caption}</Text>
        )}

        {/* Post tags */}
        {post.tags && post.tags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, marginLeft: 12 }}>
            {post.tags.map((tag, index) => (
              <Text key={index} style={{ color: COLORS.primary, marginRight: 8 }}>#{tag}</Text>
            ))}
          </View>
        )}

        {/* Post Actions row with counts */}
        <View style={[styles.actionsRow, { flexDirection: 'row', alignItems: 'center', marginTop: 6 }]}> 
          {/* Like button and count */}
          <TouchableOpacity onPress={handleLike} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={22} color={isLiked ? COLORS.error : COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={{ color: COLORS.textPrimary, marginRight: 12 }}>{likes}</Text>

          {/* Comment button and count */}
          <TouchableOpacity onPress={handleCommentPress} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 6 }}>
            <Ionicons name="chatbubble" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={{ color: COLORS.textPrimary, marginRight: 12 }}>{comments}</Text>

          {/* Share button */}
          <TouchableOpacity onPress={handleSharePress} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
            <Ionicons name="share-social" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Bookmark button */}
          <TouchableOpacity onPress={handleBookmark} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={isBookmarked ? "bookmark" : "bookmark-outline"} size={22} color={isBookmarked ? COLORS.primary : COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Left align
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 6, // Reduced spacing above action buttons
  },
});

export default PostItem;
