import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

// Sample data for bookmarks
const SAMPLE_BOOKMARKS = {
  comics: [
    {
      id: '1',
      title: 'Quantum Detectives',
      creator: 'quantum_ink',
      creatorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      cover: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      rating: 4.8,
      likes: 1245,
      dateBookmarked: '2d ago',
      isLiked: false,
    },
    {
      id: '2',
      title: 'Neon Dreams',
      creator: 'neon_artist',
      creatorAvatar: 'https://randomuser.me/api/portraits/women/46.jpg',
      cover: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      rating: 4.5,
      likes: 2103,
      dateBookmarked: '1w ago',
      isLiked: true,
    },
    {
      id: '3',
      title: 'Space Explorers',
      creator: 'cosmic_tales',
      creatorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      cover: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      rating: 4.2,
      likes: 876,
      dateBookmarked: '2w ago',
      isLiked: false,
    },
  ],
  posts: [
    {
      id: '1',
      content: 'Just finished the latest chapter of my cyberpunk series! Check it out and let me know what you think.',
      author: 'Alex Johnson',
      authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhY2UlMjBhcnR8ZW58MHx8MHx8&w=400&q=80',
      likes: 245,
      comments: 37,
      dateBookmarked: '3d ago',
      isLiked: true,
    },
    {
      id: '2',
      content: 'Working on a new fantasy world concept. Here\'s a sneak peek at some character designs!',
      author: 'Sarah Chen',
      authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      image: 'https://images.unsplash.com/photo-1623018035782-b269248df916?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZHJhd2luZ3xlbnwwfHwwfHw%3D&w=400&q=80',
      likes: 189,
      comments: 24,
      dateBookmarked: '1w ago',
      isLiked: false,
    },
  ],
};

const BookmarksScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('comics');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderComicItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.comicCard}>
        <View style={styles.comicCoverContainer}>
          <Image source={{ uri: item.cover }} style={styles.comicCover} />
          <View style={styles.bookmarkBadge}>
            <Ionicons name="bookmark" size={16} color={COLORS.primary} />
            <Text style={styles.bookmarkDate}>{item.dateBookmarked}</Text>
          </View>
        </View>
        
        <View style={styles.comicDetails}>
          <Text style={styles.comicTitle} numberOfLines={1}>{item.title}</Text>
          
          <View style={styles.creatorContainer}>
            <Image source={{ uri: item.creatorAvatar }} style={styles.creatorAvatar} />
            <Text style={styles.creatorName}>{item.creator}</Text>
          </View>
          
          <View style={styles.comicStats}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            
            <TouchableOpacity style={styles.likeButton}>
              <Ionicons 
                name={item.isLiked ? 'heart' : 'heart-outline'} 
                size={16} 
                color={item.isLiked ? COLORS.like : COLORS.textSecondary} 
              />
              <Text style={styles.likeCount}>{item.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="ellipsis-horizontal" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPostItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
          <View style={styles.postHeaderInfo}>
            <Text style={styles.authorName}>{item.author}</Text>
            <View style={styles.bookmarkInfo}>
              <Ionicons name="bookmark" size={14} color={COLORS.primary} />
              <Text style={styles.bookmarkDate}>{item.dateBookmarked}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.postContent}>{item.content}</Text>
        
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
        
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.postAction}>
            <Ionicons 
              name={item.isLiked ? 'heart' : 'heart-outline'} 
              size={20} 
              color={item.isLiked ? COLORS.like : COLORS.textSecondary} 
            />
            <Text style={styles.actionCount}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.actionCount}>{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="share-social-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Bookmarks</Text>
        
        <TouchableOpacity>
          <Ionicons name="search" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'comics' && styles.activeTabButton]}
          onPress={() => setActiveTab('comics')}
        >
          <Text style={[styles.tabText, activeTab === 'comics' && styles.activeTabText]}>
            Comics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'posts' && styles.activeTabButton]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'comics' ? (
        <FlatList
          data={SAMPLE_BOOKMARKS.comics}
          renderItem={renderComicItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.comicsGrid}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={64} color={COLORS.textTertiary} />
              <Text style={styles.emptyText}>No bookmarked comics</Text>
              <Text style={styles.emptySubtext}>Comics you bookmark will appear here</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={SAMPLE_BOOKMARKS.posts}
          renderItem={renderPostItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.postsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={64} color={COLORS.textTertiary} />
              <Text style={styles.emptyText}>No bookmarked posts</Text>
              <Text style={styles.emptySubtext}>Posts you bookmark will appear here</Text>
            </View>
          }
        />
      )}
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.textPrimary,
  },
  comicsGrid: {
    padding: 16,
  },
  comicCard: {
    width: '48%',
    marginBottom: 16,
    marginHorizontal: '1%',
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  comicCoverContainer: {
    width: '100%',
    aspectRatio: 0.75,
    position: 'relative',
  },
  comicCover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bookmarkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookmarkDate: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  comicDetails: {
    padding: 12,
  },
  comicTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creatorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  creatorName: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  comicStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  likeCount: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  actionButton: {
    marginLeft: 'auto',
  },
  postsList: {
    padding: 16,
  },
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderInfo: {
    flex: 1,
  },
  authorName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  bookmarkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContent: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    marginBottom: 12,
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 12,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionCount: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    ...FONTS.body2,
    color: COLORS.textTertiary,
    marginTop: 8,
  },
});

export default BookmarksScreen;
