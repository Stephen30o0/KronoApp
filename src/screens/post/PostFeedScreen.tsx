import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CommentsPopup from '../../components/common/CommentsPopup';
import PostItem from '../../components/home/PostItem';
import { COLORS } from '../../constants/theme';
import { Comment, Post } from '../../constants/types';
import { RootStackParamList } from '../../navigation/types';

const { height } = Dimensions.get('window');

const PostFeedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'PostFeed'>>();
  const { posts: initialPosts, startIndex } = route.params;

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (startIndex > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: startIndex, animated: false });
      }, 100);
    }
  }, [startIndex]);

  const handleCommentPress = (post: Post) => {
    setActivePost(post);
    setIsCommentsVisible(true);
  };

  const handleCloseComments = () => {
    setIsCommentsVisible(false);
    setActivePost(null);
  };

  const handleSendComment = (text: string, parentId?: string) => {
    if (!activePost) return;

    const newComment: Comment = {
      id: `p${activePost.id}-c${Date.now()}`,
      user: 'CurrentUser',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      note: text,
      time: 'Just now',
      likes: 0,
      replies: [],
    };

    const updatedPosts = posts.map(p => {
      if (p.id === activePost.id) {
        const newCommentData = [newComment, ...(p.commentData || [])];
        return { ...p, commentData: newCommentData, comments: p.comments + 1 };
      }
      return p;
    });

    setPosts(updatedPosts);

    const updatedActivePost = updatedPosts.find(p => p.id === activePost.id);
    if (updatedActivePost) {
      setActivePost(updatedActivePost);
    }
  };

  const handleLike = (postId: string) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    });
    setPosts(updatedPosts);
  };

  const handleBookmark = (postId: string) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return { ...p, isBookmarked: !p.isBookmarked };
      }
      return p;
    });
    setPosts(updatedPosts);
  };

  const handleShare = (postId: string) => {
    console.log(`Shared post ${postId}`);
  };
  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={({ item }) => (
          <PostItem
            post={item}
            onComment={() => handleCommentPress(item)}
            onLike={() => handleLike(item.id)}
            onBookmark={() => handleBookmark(item.id)}
            onShare={() => handleShare(item.id)}
          />
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}        getItemLayout={(data, index) => (
          { length: height * 0.8, offset: height * 0.8 * index, index }
        )}
        initialScrollIndex={startIndex}
      />
      </SafeAreaView>
      
      {activePost && (
        <CommentsPopup
          visible={isCommentsVisible}
          onClose={handleCloseComments}
          comments={activePost.commentData || []}
          onSend={handleSendComment}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  backButton: {
    padding: 5,
  },
  listContainer: {
    paddingBottom: 50,
  },
});

export default PostFeedScreen;
