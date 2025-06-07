import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

// Sample comic data - in a real app, this would come from an API
const SAMPLE_COMICS = [
  {
    id: '1',
    title: 'Cyber Knights',
    coverImage: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29taWN8ZW58MHx8MHx8&w=400&q=80',
    author: 'Alex Johnson',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: 'In a dystopian future where technology has taken over, a group of rebels fights against the oppressive AI regime. Follow their journey as they discover the truth about their world and themselves.',
    releaseDate: 'June 15, 2023',
    genre: ['Sci-Fi', 'Action', 'Dystopian'],
    rating: 4.8,
    likes: 245,
    views: 1200,
    pages: 32,
    price: 'Free',
    isBookmarked: false,
    isLiked: false,
  },
  {
    id: '2',
    title: 'Enchanted Forest',
    coverImage: 'https://images.unsplash.com/photo-1623018035782-b269248df916?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZHJhd2luZ3xlbnwwfHwwfHw%3D&w=400&q=80',
    author: 'Alex Johnson',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: 'Discover the magical world of the Enchanted Forest, where creatures of myth and legend live in harmony. When a dark force threatens their existence, an unlikely hero must rise to save them all.',
    releaseDate: 'May 3, 2023',
    genre: ['Fantasy', 'Adventure', 'Magic'],
    rating: 4.5,
    likes: 189,
    views: 876,
    pages: 28,
    price: 'Free',
    isBookmarked: true,
    isLiked: true,
  },
  {
    id: '3',
    title: 'Space Odyssey',
    coverImage: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhY2UlMjBhcnR8ZW58MHx8MHx8&w=400&q=80',
    author: 'Alex Johnson',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: 'Join Captain Nova and her crew as they explore the far reaches of the galaxy, encountering alien civilizations and cosmic phenomena beyond human understanding.',
    releaseDate: 'April 22, 2023',
    genre: ['Sci-Fi', 'Space', 'Exploration'],
    rating: 4.9,
    likes: 324,
    views: 1500,
    pages: 40,
    price: 'Free',
    isBookmarked: false,
    isLiked: true,
  },
  {
    id: '4',
    title: 'Neon City',
    coverImage: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmVvbiUyMGNpdHl8ZW58MHx8MHx8&w=400&q=80',
    author: 'Alex Johnson',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: 'In the sprawling metropolis of Neon City, detective Jack Cipher hunts for a mysterious serial killer while uncovering corruption that reaches the highest levels of society.',
    releaseDate: 'March 10, 2023',
    genre: ['Cyberpunk', 'Mystery', 'Noir'],
    rating: 4.7,
    likes: 156,
    views: 723,
    pages: 36,
    price: 'Free',
    isBookmarked: true,
    isLiked: false,
  },
];

const ComicDetailScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ComicDetail'>>();
  const { id } = route.params as { id: string };
  
  // Find the comic with the matching id
  const comic = SAMPLE_COMICS.find(c => c.id === id) || SAMPLE_COMICS[0];
  
  const [isLiked, setIsLiked] = useState(comic.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(comic.isBookmarked);
  const [likesCount, setLikesCount] = useState(comic.likes);
  
  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing comic: ${comic.title} by ${comic.author}!`,
        url: comic.coverImage,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleAuthorPress = () => {
    // Navigate to author profile
    // navigation.navigate('Profile', { userId: 'authorId' });
  };
  
  const handleReadNow = () => {
    // Navigate to comic reader
    navigation.navigate('ComicReader', { comicId: comic.id });
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleBookmark}
          >
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={COLORS.textPrimary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image 
            source={{ uri: comic.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{comic.title}</Text>
            <Text style={styles.author}>by {comic.author}</Text>
          </View>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Ionicons name="eye-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{comic.views}</Text>
            </View>
            
            <View style={styles.stat}>
              <Ionicons name="heart-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{likesCount}</Text>
            </View>
            
            <View style={styles.stat}>
              <Ionicons name="document-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{comic.pages} pages</Text>
            </View>
            
            <View style={styles.stat}>
              <Ionicons name="star-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{comic.rating}</Text>
            </View>
          </View>
          
          {/* Genre Tags */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.genreContainer}
            contentContainerStyle={styles.genreContentContainer}
          >
            {comic.genre.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </ScrollView>
          
          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{comic.description}</Text>
          </View>
          
          {/* Author */}
          <TouchableOpacity 
            style={styles.authorContainer}
            onPress={handleAuthorPress}
          >
            <Image 
              source={{ uri: comic.authorAvatar }}
              style={styles.authorAvatar}
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{comic.author}</Text>
              <Text style={styles.authorTitle}>Creator</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          {/* Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Release Date</Text>
              <Text style={styles.detailValue}>{comic.releaseDate}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pages</Text>
              <Text style={styles.detailValue}>{comic.pages}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>{comic.price}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={handleLike}
        >
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={28} 
            color={isLiked ? COLORS.primary : COLORS.textPrimary} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.readButton}
          onPress={handleReadNow}
        >
          <Text style={styles.readButtonText}>Read Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    width: '100%',
    height: height * 0.6,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  author: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    opacity: 0.8,
  },
  content: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  genreContainer: {
    marginBottom: 24,
  },
  genreContentContainer: {
    paddingRight: 16,
  },
  genreTag: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  genreText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  description: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  authorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  authorName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  authorTitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  detailsContainer: {
    marginBottom: 100, // Extra space for bottom actions
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  detailLabel: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  detailValue: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOWS.medium,
  },
  likeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  readButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readButtonText: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
});

export default ComicDetailScreen;
