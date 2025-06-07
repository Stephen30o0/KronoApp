import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  StatusBar,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import ComicDetailModal from '../../components/library/ComicDetailModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

// Mock data for categories
const CATEGORIES = [
  {
    id: 'recently_added',
    title: 'Recently Added',
    comics: [
      {
        id: '1',
        title: 'Quantum Detectives',
        creator: 'quantum_ink',
        creatorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        cover: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        rating: 4.8,
        likes: 1245,
        datePosted: '2d ago',
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
        datePosted: '1w ago',
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
        datePosted: '2w ago',
        isLiked: false,
      },
      {
        id: '4',
        title: 'Cyber Chronicles',
        creator: 'cyber_comics',
        creatorAvatar: 'https://randomuser.me/api/portraits/men/47.jpg',
        cover: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        rating: 4.0,
        likes: 542,
        datePosted: '3w ago',
        isLiked: false,
      },
    ],
  },
  {
    id: 'sci_fi',
    title: 'Sci-Fi',
    comics: [
      {
        id: '5',
        title: 'Quantum Detectives',
        creator: 'quantum_ink',
        creatorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        cover: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        rating: 4.8,
        likes: 1245,
        datePosted: '2d ago',
        isLiked: false,
      },
      {
        id: '6',
        title: 'Space Explorers',
        creator: 'cosmic_tales',
        creatorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        cover: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        rating: 4.2,
        likes: 876,
        datePosted: '2w ago',
        isLiked: false,
      },
      {
        id: '7',
        title: 'Galactic Odyssey',
        creator: 'star_writer',
        creatorAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
        cover: 'https://images.unsplash.com/photo-1581822261290-991b38693d16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        rating: 4.6,
        likes: 1023,
        datePosted: '1m ago',
        isLiked: true,
      },
      {
        id: '8',
        title: 'Time Paradox',
        creator: 'future_comics',
        creatorAvatar: 'https://randomuser.me/api/portraits/men/43.jpg',
        cover: 'https://images.unsplash.com/photo-1501432377862-3b0432b87a14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        rating: 4.3,
        likes: 789,
        datePosted: '2m ago',
        isLiked: false,
      },
    ],
  },
  {
    id: 'fantasy',
    title: 'Fantasy',
    comics: [
      {
        id: '9',
        title: 'Dragon Realms',
        creator: 'myth_maker',
        creatorAvatar: 'https://randomuser.me/api/portraits/women/41.jpg',
        cover: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        rating: 4.7,
        likes: 1567,
        datePosted: '5d ago',
        isLiked: true,
      },
      {
        id: '10',
        title: 'Enchanted Forest',
        creator: 'magic_artist',
        creatorAvatar: 'https://randomuser.me/api/portraits/men/41.jpg',
        cover: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
        rating: 4.4,
        likes: 987,
        datePosted: '1w ago',
        isLiked: false,
      },
      {
        id: '11',
        title: "Wizard's Journey",
        creator: 'spell_caster',
        creatorAvatar: 'https://randomuser.me/api/portraits/women/40.jpg',
        cover: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        rating: 4.1,
        likes: 654,
        datePosted: '2w ago',
        isLiked: false,
      },
      {
        id: '12',
        title: 'Mythical Creatures',
        creator: 'legend_comics',
        creatorAvatar: 'https://randomuser.me/api/portraits/men/40.jpg',
        cover: 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        rating: 4.5,
        likes: 876,
        datePosted: '3w ago',
        isLiked: true,
      },
    ],
  },
  {
    id: 'cyberpunk',
    title: 'Cyberpunk',
    comics: [
      {
        id: '13',
        title: 'Neon Dreams',
        creator: 'neon_artist',
        creatorAvatar: 'https://randomuser.me/api/portraits/women/46.jpg',
        cover: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        rating: 4.5,
        likes: 2103,
        datePosted: '1w ago',
        isLiked: true,
      },
      {
        id: '14',
        title: 'Cyber Chronicles',
        creator: 'cyber_comics',
        creatorAvatar: 'https://randomuser.me/api/portraits/men/47.jpg',
        cover: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        rating: 4.0,
        likes: 542,
        datePosted: '3w ago',
        isLiked: false,
      },
      {
        id: '15',
        title: 'Digital Dystopia',
        creator: 'future_noir',
        creatorAvatar: 'https://randomuser.me/api/portraits/women/39.jpg',
        cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
        rating: 4.3,
        likes: 876,
        datePosted: '1m ago',
        isLiked: false,
      },
      {
        id: '16',
        title: "Hacker's Code",
        creator: 'digital_artist',
        creatorAvatar: 'https://randomuser.me/api/portraits/men/39.jpg',
        cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        rating: 4.2,
        likes: 765,
        datePosted: '2m ago',
        isLiked: true,
      },
    ],
  },
  {
    id: 'watched',
    title: 'Recently Watched',
    comics: [
      {
        id: '17',
        title: 'Quantum Detectives',
        creator: 'quantum_ink',
        creatorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        cover: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        rating: 4.8,
        likes: 1245,
        datePosted: '2d ago',
        isLiked: false,
      },
      {
        id: '18',
        title: 'Dragon Realms',
        creator: 'myth_maker',
        creatorAvatar: 'https://randomuser.me/api/portraits/women/41.jpg',
        cover: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        rating: 4.7,
        likes: 1567,
        datePosted: '5d ago',
        isLiked: true,
      },
      {
        id: '19',
        title: 'Neon Dreams',
        creator: 'neon_artist',
        creatorAvatar: 'https://randomuser.me/api/portraits/women/46.jpg',
        cover: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        rating: 4.5,
        likes: 2103,
        datePosted: '1w ago',
        isLiked: true,
      },
      {
        id: '20',
        title: 'Space Explorers',
        creator: 'cosmic_tales',
        creatorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        cover: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        rating: 4.2,
        likes: 876,
        datePosted: '2w ago',
        isLiked: false,
      },
    ],
  },
];

type Comic = {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  cover: string;
  rating: number;
  likes: number;
  datePosted: string;
  isLiked: boolean;
};

type Category = {
  id: string;
  title: string;
  comics: Comic[];
};

const LibraryScreen = () => {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [comics, setComics] = useState<Category[]>(CATEGORIES);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleCategoryPress = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleComicPress = (comicId: string) => {
    // Navigate to comic reader
    // @ts-ignore - Comic reader screen exists in the root navigator
    navigation.navigate('ComicReader', { comicId });
  };

  const handleLike = (categoryId: string, comicId: string) => {
    setComics(
      comics.map(category => 
        category.id === categoryId 
          ? {
              ...category,
              comics: category.comics.map(comic => 
                comic.id === comicId 
                  ? { 
                      ...comic, 
                      isLiked: !comic.isLiked,
                      likes: comic.isLiked ? comic.likes - 1 : comic.likes + 1 
                    } 
                  : comic
              )
            } 
          : category
      )
    );
  };

  const handleLikeComic = (id: string) => {
    // Update the comics state to toggle the isLiked property
    const updatedCategories = comics.map(category => ({
      ...category,
      comics: category.comics.map(comic => 
        comic.id === id ? { ...comic, isLiked: !comic.isLiked } : comic
      )
    }));
    setComics(updatedCategories);
  };

  const handleShare = (comicId: string) => {
    // Open share modal
    console.log('Share comic', comicId);
  };

  const handleShareComic = (id: string) => {
    console.log('Share comic:', id);
  };

  const handleReadComic = (id: string) => {
    console.log('Read comic:', id);
    setDetailModalVisible(false);
    // Navigate to comic reader screen
    navigation.navigate('ComicReader', { comicId: id });
  };

  const handleCloseModal = () => {
    setDetailModalVisible(false);
  };

  const handleUserPress = (username: string) => {
    // Navigate to user profile
    console.log('View profile of', username);
  };

  const handleCreatorPress = (creator: string) => {
    console.log('Creator pressed:', creator);
    // Navigate to creator profile
  };

  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity 
      style={[
        styles.categoryButton,
        activeCategory === item.id && styles.activeCategoryButton
      ]}
      onPress={() => handleCategoryPress(item.id)}
      activeOpacity={0.8}
    >
      <Text 
        style={[
          styles.categoryText,
          activeCategory === item.id && styles.activeCategoryText
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderComicItem = ({ item, index }: { item: typeof CATEGORIES[0]['comics'][0], index: number }) => (
    <TouchableOpacity 
      style={[styles.comicCard, index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }]}
      onPress={() => handleComicPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.comicCoverContainer}>
        <Image 
          source={{ uri: item.cover }} 
          style={styles.comicCover} 
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.comicCoverGradient}
        />
      </View>
      
      <View style={styles.comicDetails}>
        <Text style={styles.comicTitle} numberOfLines={1}>
          {item.title}
        </Text>
        
        <TouchableOpacity 
          style={styles.creatorContainer}
          onPress={() => handleUserPress(item.creator)}
        >
          <Image 
            source={{ uri: item.creatorAvatar }} 
            style={styles.creatorAvatar} 
          />
          <Text style={styles.creatorName} numberOfLines={1}>
            {item.creator}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.comicStats}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={COLORS.accent3} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => handleLike(activeCategory, item.id)}
          >
            <Ionicons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={16} 
              color={item.isLiked ? COLORS.like : COLORS.textSecondary} 
            />
            <Text style={styles.likeCount}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => handleShare(item.id)}
          >
            <Ionicons name="paper-plane-outline" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.datePosted}>{item.datePosted}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderComicsGrid = () => {
    const selectedCategory = comics.find(category => category.id === activeCategory);
    
    if (!selectedCategory) return null;
    
    return (
      <FlatList
        data={selectedCategory.comics}
        renderItem={renderComicItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.comicsGrid}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Library</Text>
        
        <TouchableOpacity>
          <Ionicons name="search" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {renderComicsGrid()}
      
      {/* Comic Detail Modal with Action Buttons */}
      <ComicDetailModal
        visible={detailModalVisible}
        comic={selectedComic}
        onClose={handleCloseModal}
        onLike={handleLikeComic}
        onShare={handleShareComic}
        onRead={handleReadComic}
        onCreatorPress={handleCreatorPress}
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
    paddingHorizontal: 18, // Slightly increased horizontal padding
    paddingTop: Platform.OS === 'ios' ? 48 : StatusBar.currentHeight! + 12, // Increased top padding
    paddingBottom: 12, // Increased bottom padding
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  categoriesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.surface,
  },
  activeCategoryButton: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    ...FONTS.medium,
    color: COLORS.textSecondary,
  },
  activeCategoryText: {
    color: COLORS.textPrimary,
  },
  comicsGrid: {
    padding: 16,
  },
  comicCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  comicCoverContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.3,
    position: 'relative',
  },
  comicCover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  comicCoverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
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
    marginBottom: 4,
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
  shareButton: {
    marginLeft: 'auto',
  },
  datePosted: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
  },
  emptyListText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.spacingLarge,
  }
});

export default LibraryScreen;
