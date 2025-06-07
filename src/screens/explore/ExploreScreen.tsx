import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

// Sample data for explore screen
const TRENDING_TOPICS = [
  'Cyberpunk', 'Fantasy', 'Sci-Fi', 'Horror', 'Romance', 'Action', 'Mystery', 'Comedy'
];

const FEATURED_CREATORS = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    followers: '12.5K',
    banner: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhY2UlMjBhcnR8ZW58MHx8MHx8&w=400&q=80',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    followers: '8.3K',
    banner: 'https://images.unsplash.com/photo-1623018035782-b269248df916?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZHJhd2luZ3xlbnwwfHwwfHw%3D&w=400&q=80',
  },
  {
    id: '3',
    name: 'Michael Wong',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    followers: '6.7K',
    banner: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
];

const TRENDING_COMICS = [
  {
    id: '1',
    title: 'Quantum Detectives',
    creator: 'Alex Johnson',
    creatorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    cover: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    rating: 4.8,
    views: '125K',
    tags: ['Sci-Fi', 'Mystery', 'Cyberpunk'],
  },
  {
    id: '2',
    title: 'Neon Dreams',
    creator: 'Sarah Chen',
    creatorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    cover: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    rating: 4.5,
    views: '98K',
    tags: ['Cyberpunk', 'Dystopian', 'Action'],
  },
  {
    id: '3',
    title: 'Space Explorers',
    creator: 'Michael Wong',
    creatorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    cover: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    rating: 4.2,
    views: '76K',
    tags: ['Sci-Fi', 'Adventure', 'Space'],
  },
  {
    id: '4',
    title: 'Cyber Chronicles',
    creator: 'Emma Davis',
    creatorAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    cover: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    rating: 4.0,
    views: '54K',
    tags: ['Cyberpunk', 'Action', 'Thriller'],
  },
];

const POPULAR_POSTS = [
  {
    id: '1',
    content: 'Just finished the latest chapter of my cyberpunk series! Check it out and let me know what you think.',
    author: 'Alex Johnson',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhY2UlMjBhcnR8ZW58MHx8MHx8&w=400&q=80',
    likes: 1245,
    comments: 87,
    timeAgo: '3h ago',
  },
  {
    id: '2',
    content: 'Working on a new fantasy world concept. Here\'s a sneak peek at some character designs!',
    author: 'Sarah Chen',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    image: 'https://images.unsplash.com/photo-1623018035782-b269248df916?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZHJhd2luZ3xlbnwwfHwwfHw%3D&w=400&q=80',
    likes: 876,
    comments: 42,
    timeAgo: '5h ago',
  },
];

const ExploreScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderTrendingTopic = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity style={styles.topicButton}>
        <Text style={styles.topicText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderFeaturedCreator = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.creatorCard}>
        <Image source={{ uri: item.banner }} style={styles.creatorBanner} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.creatorGradient}
        />
        <View style={styles.creatorInfo}>
          <Image source={{ uri: item.avatar }} style={styles.creatorAvatar} />
          <View style={styles.creatorDetails}>
            <Text style={styles.creatorName}>{item.name}</Text>
            <Text style={styles.creatorFollowers}>{item.followers} followers</Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTrendingComic = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.comicCard}>
        <Image source={{ uri: item.cover }} style={styles.comicCover} />
        <View style={styles.comicDetails}>
          <Text style={styles.comicTitle} numberOfLines={1}>{item.title}</Text>
          
          <View style={styles.creatorContainer}>
            <Image source={{ uri: item.creatorAvatar }} style={styles.smallAvatar} />
            <Text style={styles.comicCreator}>{item.creator}</Text>
          </View>
          
          <View style={styles.comicStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.statText}>{item.rating}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{item.views}</Text>
            </View>
          </View>
          
          <View style={styles.tagsContainer}>
            {item.tags.map((tag: string, index: number) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPopularPost = ({ item }: { item: any }) => {
    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
          <View style={styles.postHeaderInfo}>
            <Text style={styles.authorName}>{item.author}</Text>
            <Text style={styles.postTime}>{item.timeAgo}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.postContent}>{item.content}</Text>
        
        <Image source={{ uri: item.image }} style={styles.postImage} />
        
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="heart-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.actionCount}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.actionCount}>{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="share-social-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.postAction}>
            <Ionicons name="bookmark-outline" size={20} color={COLORS.textSecondary} />
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
        
        <Text style={styles.headerTitle}>Explore</Text>
        
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search comics, creators, or topics..."
            placeholderTextColor={COLORS.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trending Topics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Topics</Text>
          <FlatList
            data={TRENDING_TOPICS}
            renderItem={renderTrendingTopic}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topicsContainer}
          />
        </View>
        
        {/* Featured Creators */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Creators</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={FEATURED_CREATORS}
            renderItem={renderFeaturedCreator}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.creatorsContainer}
          />
        </View>
        
        {/* Trending Comics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Comics</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={TRENDING_COMICS}
            renderItem={renderTrendingComic}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.comicsContainer}
          />
        </View>
        
        {/* Popular Posts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Posts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {POPULAR_POSTS.map((post) => renderPopularPost({ item: post }))}
        </View>
      </ScrollView>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    ...FONTS.body2,
    marginLeft: 8,
    paddingVertical: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  seeAllText: {
    ...FONTS.body2,
    color: COLORS.primary,
  },
  topicsContainer: {
    paddingHorizontal: 16,
  },
  topicButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  topicText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
  creatorsContainer: {
    paddingHorizontal: 16,
  },
  creatorCard: {
    width: 240,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    ...SHADOWS.medium,
  },
  creatorBanner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  creatorGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  creatorInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  creatorDetails: {
    flex: 1,
    marginLeft: 8,
  },
  creatorName: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  creatorFollowers: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  followButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followButtonText: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  comicsContainer: {
    paddingHorizontal: 16,
  },
  comicCard: {
    width: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginRight: 16,
    ...SHADOWS.medium,
  },
  comicCover: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  comicDetails: {
    padding: 12,
  },
  comicTitle: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  smallAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  comicCreator: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  comicStats: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  postCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
    ...FONTS.body1,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  postTime: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
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
    paddingHorizontal: 12,
    paddingBottom: 12,
    lineHeight: 22,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCount: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
});

export default ExploreScreen;
