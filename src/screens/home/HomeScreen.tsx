import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  Platform,
  RefreshControl,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import CommentsBottomSheet from '../../components/comments/CommentsBottomSheet';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/theme';
import Logo from '../../components/common/Logo';
import NotificationIcon from '../../components/common/NotificationIcon';

import Stories from '../../components/home/Stories';
import PostItem from '../../components/home/PostItem';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import haptics from '../../utils/haptics';
import { useTheme } from '../../context/ThemeContext';

// Define drawer navigation types
type DrawerParamList = {
  ShareModal: { title: string; message: string; url: string; image: string | undefined };
  Home: undefined;
  Library: undefined;
  TownSquare: undefined;
  Stream: undefined;
  Wallet: undefined;
  Profile: undefined;
  Messages: undefined;
  Notifications: undefined;
};

// Define types for social feed
interface Comment {
  id: string;
  user: { username: string; profilePicture: string; };
  text: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface Post {
  id: string;
  username: string;
  avatar?: string;
  caption: string;
  tags: string[];
  comments: number;
  likes: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  imageUrl?: string;
  commentData: Comment[];
}

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasUnviewedStory: boolean;
  previewImage?: string; // Preview image for the story
}

// Mock data for posts
const POSTS: Post[] = [
  {
    id: '1',
    username: 'KronoLabs',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    caption: 'First look at our new UI! What do you think? #KronoApp #UI #Design',
    tags: ['#KronoApp', '#UI', '#Design'],
    comments: 12,
    likes: 256,
    timestamp: '2h ago',
    isLiked: false,
    isBookmarked: false,
    imageUrl: 'https://images.unsplash.com/photo-1576495199011-2de57923133c?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    commentData: [
      {
        id: 'c1',
        user: { username: 'campusgiant', profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg' },
        text: 'What about Sir Jim Ratcliff',
        timestamp: '37m',
        likes: 13,
        replies: [
          {
            id: 'c1-r1',
            user: { username: 'alistair_xav', profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg' },
            text: 'GGMU ❤️',
            timestamp: '25m',
            likes: 2,
            isLiked: false,
          },
        ],
        isLiked: false,
      },
      {
        id: 'c2',
        user: { username: 'jishnuu_devv', profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg' },
        text: 'Sir Goat Antony',
        timestamp: '23m',
        likes: 11,
        isLiked: true,
        replies: [],
      },
    ],
  },
  {
    id: '2',
    username: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    caption: 'Exploring the mountains. Nature is the best artist.',
    tags: ['#nature', '#mountains', '#adventure'],
    comments: 8,
    likes: 189,
    timestamp: '5h ago',
    isLiked: true,
    isBookmarked: false,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    commentData: [],
  },
  {
    id: '3',
    username: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    caption: 'City lights and late night vibes.',
    tags: ['#citylife', '#night', '#urban'],
    comments: 23,
    likes: 432,
    timestamp: '1d ago',
    isLiked: false,
    isBookmarked: true,
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    commentData: [],
  },
];

// Mock data for stories
const STORIES: Story[] = [
  { id: '1', username: 'You', avatar: '', hasUnviewedStory: false },
  { 
    id: '2', 
    username: 'quantum_ink', 
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg', 
    hasUnviewedStory: true,
    previewImage: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  { 
    id: '3', 
    username: 'cosmic_tales', 
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', 
    hasUnviewedStory: true,
    previewImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2006&q=80'
  },
  { 
    id: '4', 
    username: 'neon_creator', 
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg', 
    hasUnviewedStory: false,
    previewImage: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
  },
  { 
    id: '5', 
    username: 'pixel_master', 
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg', 
    hasUnviewedStory: true,
    previewImage: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  { 
    id: '6', 
    username: 'ink_whisperer', 
    avatar: 'https://randomuser.me/api/portraits/women/89.jpg', 
    hasUnviewedStory: false,
    previewImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2006&q=80'
  }
];

const HomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeComments, setActiveComments] = useState<Comment[]>([]);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleLike = (id: string) => {
    haptics.light();
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  // ref

  const handleLikeComment = (commentId: string) => {
    const newPosts = posts.map(post => {
      if (post.id !== activePostId) return post;

      const findAndLike = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            };
          }
          if (comment.replies) {
            return { ...comment, replies: findAndLike(comment.replies) };
          }
          return comment;
        });
      };

      const updatedCommentData = findAndLike(post.commentData);
      setActiveComments(updatedCommentData);
      return { ...post, commentData: updatedCommentData };
    });

    setPosts(newPosts);
  };

  const handleSendComment = (text: string, parentId?: string) => {
    if (!activePostId) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: { username: 'CurrentUser', profilePicture: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
      text: text,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      replies: [],
    };

    const insertReply = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          // Insert reply at the end of replies array
          return {
            ...comment,
            replies: comment.replies ? [...comment.replies, newComment] : [newComment],
          };
        } else if (comment.replies && comment.replies.length > 0) {
          // Recursively search for the parent in replies
          return {
            ...comment,
            replies: insertReply(comment.replies),
          };
        }
        return comment;
      });
    };

    const updatedPosts = posts.map(p => {
      if (p.id === activePostId) {
        let newCommentData;
        if (parentId) {
          newCommentData = insertReply(p.commentData);
        } else {
          newCommentData = [...p.commentData, newComment];
        }
        return { ...p, commentData: newCommentData, comments: p.comments + 1 };
      }
      return p;
    });

    setPosts(updatedPosts);
    const updatedPost = updatedPosts.find(p => p.id === activePostId);
    if (updatedPost) {
      setActiveComments(updatedPost.commentData);
    }
  };
  
  const handleComment = (id: string) => {
    haptics.light();
    const post = posts.find(p => p.id === id);
    if (post) {
      setActiveComments(post.commentData);
      setActivePostId(id);
      bottomSheetModalRef.current?.present();
    }
  };






  
  const handleBookmark = (id: string) => {
    haptics.light();
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === id) {
          return {
            ...post,
            isBookmarked: !post.isBookmarked
          };
        }
        return post;
      })
    );
  };
  
  const handleShare = (id: string) => {
    haptics.light();
    const post = posts.find(p => p.id === id);
    if (post) {
      // Navigate to ShareModal with post details
      navigation.navigate('ShareModal', {
        postId: post.id,
        postContent: post.caption || '',
        postImage: post.imageUrl,
        userName: post.username
      });
    }
  };
  
  const handleStoryPress = (storyId: string) => {
    haptics.light();
    console.log('Story pressed:', storyId);
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };
  
  const handleLoadMore = () => {
    if (isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    // Simulate loading more posts
    setTimeout(() => {
      // Add more posts (in this case, just duplicate the existing ones)
      setPosts(prevPosts => [
        ...prevPosts,
        ...POSTS.map(post => ({
          ...post,
          id: `${post.id}_more_${Date.now()}` // Ensure unique IDs
        }))
      ]);
      
      setIsLoadingMore(false);
    }, 1500);
  };
  
  const renderPostItem = ({ item }: { item: Post }) => (
    <PostItem
      post={item}
      onLike={() => handleLike(item.id)}
      onComment={() => handleComment(item.id)}
      onBookmark={() => handleBookmark(item.id)}
      onShare={() => handleShare(item.id)}
      colors={colors}
    />
  );
  
  const renderLoadingSkeleton = () => {
    return (
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <SkeletonLoader style={{ width: 40, height: 40, borderRadius: 20 }} />
          <View style={{ marginLeft: 12 }}>
            <SkeletonLoader style={{ width: 120, height: 18, marginBottom: 4 }} />
            <SkeletonLoader style={{ width: 80, height: 14 }} />
          </View>
        </View>
        <SkeletonLoader style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 12 }} />
        <SkeletonLoader style={{ width: '80%', height: 16, marginBottom: 8 }} />
        <SkeletonLoader style={{ width: '60%', height: 16 }} />
      </View>
    );
  };
  
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const navigateToMessages = () => {
    navigation.navigate('MainApp', { screen: 'Messages' });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerLogo} onPress={openDrawer} activeOpacity={0.7}>
        <Logo style={styles.logo} size={36} />
        <Text style={[styles.logoText, { color: colors.textPrimary }]}>KronoLabs</Text>
      </TouchableOpacity>
      
      <View style={styles.headerRight}>
        <NotificationIcon style={styles.headerIconButton} />

        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={navigateToMessages}
        >
          <Ionicons name="paper-plane-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderStoryItem = ({ item }: { item: Story }) => (
    <TouchableOpacity 
      style={styles.storyItem}
      onPress={() => handleStoryPress(item.id)}
    >
      <View style={[styles.storyRing, item.hasUnviewedStory && styles.activeStoryRing]}>
        <View style={styles.storyAvatar}>
          {item.avatar ? (
            <Image 
              source={{ uri: item.avatar }} 
              style={styles.storyAvatarImage} 
            />
          ) : (
            <View style={styles.storyAvatarPlaceholder}>
              <Text style={styles.storyAvatarText}>{item.username.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          
          {item.id === '1' && (
            <View style={styles.addStoryButton}>
              <Ionicons name="add" size={14} color={colors.textPrimary} />
            </View>
          )}
        </View>
      </View>
      
      <Text style={styles.storyUsername} numberOfLines={1}>
        {item.username}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          
          {renderHeader()}
          
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            renderItem={renderPostItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoadingMore ? renderLoadingSkeleton : null}
            ListHeaderComponent={<View style={styles.storiesContainer}>
              <Stories 
                stories={STORIES} 
                onStoryPress={handleStoryPress} 
              />
            </View>}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                progressBackgroundColor={colors.surface}
                progressViewOffset={80}
              />
            }
          />
        </View>

        <BottomSheetModalProvider>
          <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            {renderHeader()}
            <FlatList
              data={posts}
              keyExtractor={item => item.id}
              renderItem={renderPostItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isLoadingMore ? renderLoadingSkeleton : null}
              ListHeaderComponent={<View style={styles.storiesContainer}>
                <Stories 
                  stories={STORIES} 
                  onStoryPress={handleStoryPress} 
                />
              </View>}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={[colors.primary]}
                  progressBackgroundColor={colors.surface}
                  progressViewOffset={80}
                />
              }
            />
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={useMemo(() => ['90%'], [])}
              backgroundStyle={{ backgroundColor: colors.background }}
              handleIndicatorStyle={{ backgroundColor: colors.surface }}
              enablePanDownToClose={true}
            >
              <CommentsBottomSheet
                comments={activeComments}
                onSendComment={handleSendComment}
                onLikeComment={handleLikeComment}
                currentUserAvatar={'https://i.pravatar.cc/150?u=a042581f4e29026704d'}
              />
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight! + 8,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
    borderBottomWidth: 0,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginRight: 6,
  },
  logoText: {
    ...FONTS.h3,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    marginLeft: 16,
  },
  
  // Stories styles
  storiesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0,
  },
  storiesList: {
    paddingHorizontal: 12,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 70,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    borderWidth: 2,
    borderColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStoryRing: {
    borderColor: COLORS.primary,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.backgroundLight,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  storyAvatarImage: {
    width: '100%',
    height: '100%',
  },
  storyAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  storyAvatarText: {
    ...FONTS.h3,
    color: COLORS.primary,
  },
  storyUsername: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  
  // Post styles
  postContainer: {
    padding: 12,
    marginBottom: 4,
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  postImageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 12,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postAvatarText: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  postUsername: {
    ...FONTS.h3, // Using h3 instead of h4 which doesn't exist
    color: COLORS.textPrimary,
  },
  postCaption: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    marginBottom: 8,
    lineHeight: 20,
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  postTag: {
    ...FONTS.caption,
    color: COLORS.primary,
    marginRight: 8,
    marginBottom: 4,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  postStatsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  postStatText: {
    ...FONTS.caption,
    marginLeft: 4,
    color: COLORS.textSecondary,
  },
  postTimestamp: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
    marginTop: 8,
    fontSize: 12,
  },
  emptyText: {
    ...FONTS.body1,
    textAlign: 'center',
    marginTop: 40,
    marginHorizontal: 20,
  },
});

export default HomeScreen;
