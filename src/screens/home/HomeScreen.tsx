import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
  Dimensions,
  Platform,
  Animated,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { COLORS } from '../../constants/colors';
import { FONTS, SIZES, SHADOWS } from '../../constants/theme';
import Logo from '../../components/common/Logo';
import NotificationIcon from '../../components/common/NotificationIcon';
import Stories from '../../components/home/Stories';
import PostItem from '../../components/home/PostItem';
import PullToRefresh from '../../components/common/PullToRefresh';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import haptics from '../../utils/haptics';
import accessibility from '../../utils/accessibility';
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
  imageUrl?: string; // Optional image URL for the post
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
    username: 'komix_adventures',
    caption: 'Just finished the latest issue! What do you think?',
    tags: ['#comics', '#artwork', '#newrelease'],
    comments: 42,
    likes: 187,
    timestamp: '2 hours ago',
    isLiked: false,
    isBookmarked: false,
    imageUrl: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: '2',
    username: 'inkmaster',
    caption: 'Working on some character concepts for my new series.',
    tags: ['#characterdesign', '#workinprogress', '#comicart'],
    comments: 23,
    likes: 156,
    timestamp: '4 hours ago',
    isLiked: true,
    isBookmarked: true,
    imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2006&q=80'
  },
  {
    id: '3',
    username: 'colorpalette',
    caption: 'Color palette exploration for the dystopian cityscape.',
    tags: ['#colors', '#digitalart', '#conceptart'],
    comments: 18,
    likes: 104,
    timestamp: '1 day ago',
    isLiked: false,
    isBookmarked: false,
    imageUrl: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
  }
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
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const { colors } = useTheme();
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Navigation functions
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
    haptics.selection();
  };
  
  const navigateToNotifications = () => {
    navigation.navigate('Notifications');
    haptics.selection();
  };
  
  const navigateToMessages = () => {
    navigation.navigate('Messages');
    haptics.selection();
  };
  
  // Post interaction functions
  const handleLike = (id: string) => {
    haptics.light();
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === id) {
          const isLiked = !post.isLiked;
          const likeDelta = isLiked ? 1 : -1;
          return {
            ...post,
            isLiked,
            likes: post.likes + likeDelta
          };
        }
        return post;
      })
    );
  };
  
  const handleComment = (id: string) => {
    haptics.light();
    console.log('Comment pressed for post:', id);
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
        title: `Post by ${post.username}`,
        message: post.caption || 'Check out this post!',
        url: `https://kronolabs.app/posts/${post.id}`,
        image: post.imageUrl
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
  
  const renderPostItem = ({ item }: { item: any }) => (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
