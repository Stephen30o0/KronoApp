import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  StatusBar,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NotificationIcon from '../../components/common/NotificationIcon';
import * as Animatable from 'react-native-animatable';
// Import colors from the dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants from theme.ts
import { FONTS, SIZES, SHADOWS } from '../../constants/theme';
import InfinityLogo from '../../components/common/InfinityLogo';

const { width } = Dimensions.get('window');

// Mock data for categories/genres
const GENRES = [
  { id: 'all', name: 'All' },
  { id: 'sci_fi', name: 'Sci-Fi' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'cyberpunk', name: 'Cyberpunk' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'horror', name: 'Horror' },
  { id: 'romance', name: 'Romance' },
  { id: 'action', name: 'Action' },
  { id: 'comedy', name: 'Comedy' },
];

// Mock data for sorting options
const SORT_OPTIONS = [
  { id: 'new', name: 'New Ideas' },
  { id: 'top', name: 'Top This Week' },
  { id: 'funded', name: 'Funded' },
];

// Mock data for comic ideas
const COMIC_IDEAS = [
  {
    id: '1',
    title: 'Quantum Detectives: A Mystery in Multiple Dimensions',
    creator: 'quantum_ink',
    creatorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    description: 'A noir detective story where the culprit exists in multiple quantum realities. Each chapter explores a different dimension where the same crime happened differently.',
    coverImage: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    genres: ['Sci-Fi', 'Mystery', 'Multiverse'],
    fundingGoal: 5000,
    currentFunding: 3750,
    votesCount: 245,
    likesCount: 189,
    commentsCount: 42,
    isLiked: false,
    datePosted: '2d ago',
  },
  {
    id: '2',
    title: 'Neon Dreams: Cyberpunk Chronicles',
    creator: 'neon_artist',
    creatorAvatar: 'https://randomuser.me/api/portraits/women/46.jpg',
    description: 'Follow the story of a hacker in a dystopian future trying to bring down corrupt corporations while dealing with her own augmented reality addiction.',
    coverImage: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    genres: ['Cyberpunk', 'Dystopia', 'Thriller'],
    fundingGoal: 7500,
    currentFunding: 6200,
    votesCount: 312,
    likesCount: 276,
    commentsCount: 58,
    isLiked: true,
    datePosted: '1w ago',
  },
  {
    id: '3',
    title: 'Enchanted Forest: The Last Guardian',
    creator: 'magic_artist',
    creatorAvatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    description: "A young druid discovers she's the last guardian of an ancient forest filled with magical creatures now threatened by modern development and dark magic.",
    coverImage: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    genres: ['Fantasy', 'Magic', 'Adventure'],
    fundingGoal: 4000,
    currentFunding: 2800,
    votesCount: 187,
    likesCount: 156,
    commentsCount: 34,
    isLiked: false,
    datePosted: '3w ago',
  },
  {
    id: '4',
    title: 'Galactic Odyssey: The Lost Fleet',
    creator: 'cosmic_tales',
    creatorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    description: 'After a catastrophic wormhole incident, a fleet of Earth ships finds themselves in an unknown galaxy with dwindling resources and alien threats.',
    coverImage: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    genres: ['Sci-Fi', 'Space Opera', 'Adventure'],
    fundingGoal: 6000,
    currentFunding: 5400,
    votesCount: 276,
    likesCount: 234,
    commentsCount: 47,
    isLiked: true,
    datePosted: '2w ago',
  },
];

const TownSquareScreen = () => {
  const navigation = useNavigation();
  const [activeGenre, setActiveGenre] = useState(GENRES[0].id);
  const [activeSort, setActiveSort] = useState(SORT_OPTIONS[0].id);
  const [comicIdeas, setComicIdeas] = useState(COMIC_IDEAS);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<typeof COMIC_IDEAS[0] | null>(null);
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('KRN');
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const [votedIdeaTitle, setVotedIdeaTitle] = useState('');
  
  // Animation refs
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const currencyAnimation = useRef(new Animated.Value(0)).current;
  const confirmationAnim = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleGenrePress = (genreId: string) => {
    setActiveGenre(genreId);
  };

  const handleSortPress = (sortId: string) => {
    setActiveSort(sortId);
  };

  const handleIdeaPress = (idea: typeof COMIC_IDEAS[0]) => {
    // Navigate to full idea view
    console.log('View full idea', idea.id);
  };

  const handleLike = (ideaId: string) => {
    setComicIdeas(
      comicIdeas.map(idea => 
        idea.id === ideaId 
          ? { 
              ...idea, 
              isLiked: !idea.isLiked,
              likesCount: idea.isLiked ? idea.likesCount - 1 : idea.likesCount + 1 
            } 
          : idea
      )
    );
  };

  const handleComment = (ideaId: string) => {
    // Navigate to comments screen
    console.log('Navigate to comments for idea', ideaId);
  };

  const handleShare = (ideaId: string) => {
    // Open share modal
    console.log('Share idea', ideaId);
  };

  const handleVotePress = (idea: typeof COMIC_IDEAS[0]) => {
    setSelectedIdea(idea);
    setShowVoteModal(true);
    
    // Animate modal in
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const closeVoteModal = () => {
    // Animate modal out
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowVoteModal(false);
      setSelectedIdea(null);
    });
  };

  const toggleCurrencyOptions = () => {
    if (showCurrencyOptions) {
      // Hide currency options
      Animated.timing(currencyAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowCurrencyOptions(false);
      });
    } else {
      // Show currency options
      setShowCurrencyOptions(true);
      Animated.spring(currencyAnimation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start();
    }
  };

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency);
    toggleCurrencyOptions();
  };

  const handleVoteWithTokens = () => {
    // Handle token voting
    console.log('Vote with tokens for idea', selectedIdea?.id);
    
    // Update the idea's vote count in the state
    const updatedIdeas = comicIdeas.map(idea => {
      if (idea.id === selectedIdea?.id) {
        return { ...idea, votesCount: idea.votesCount + 1 };
      }
      return idea;
    });
    
    setComicIdeas(updatedIdeas);
    setVotedIdeaTitle(selectedIdea?.title || '');
    closeVoteModal();
    
    // Show confirmation
    setShowVoteConfirmation(true);
    
    // Animate in
    Animated.sequence([
      Animated.timing(confirmationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(confirmationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowVoteConfirmation(false);
    });
  };

  const handleVoteWithAds = () => {
    // Handle ad voting
    console.log('Vote with ads for idea', selectedIdea?.id);
    
    // Update the idea's vote count in the state
    const updatedIdeas = comicIdeas.map(idea => {
      if (idea.id === selectedIdea?.id) {
        return { ...idea, votesCount: idea.votesCount + 1 };
      }
      return idea;
    });
    
    setComicIdeas(updatedIdeas);
    setVotedIdeaTitle(selectedIdea?.title || '');
    closeVoteModal();
    
    // Show confirmation
    setShowVoteConfirmation(true);
    
    // Animate in
    Animated.sequence([
      Animated.timing(confirmationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(confirmationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowVoteConfirmation(false);
    });
  };

  const handleCreatorPress = (creatorName: string) => {
    // Navigate to creator profile
    console.log('View profile of', creatorName);
  };

  const renderGenreItem = ({ item }: { item: typeof GENRES[0] }) => (
    <TouchableOpacity 
      style={[
        styles.genreButton,
        activeGenre === item.id && styles.activeGenreButton
      ]}
      onPress={() => handleGenrePress(item.id)}
      activeOpacity={0.8}
    >
      <Text 
        style={[
          styles.genreText,
          activeGenre === item.id && styles.activeGenreText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSortItem = ({ item }: { item: typeof SORT_OPTIONS[0] }) => (
    <TouchableOpacity 
      style={[
        styles.sortButton,
        activeSort === item.id && styles.activeSortButton
      ]}
      onPress={() => handleSortPress(item.id)}
      activeOpacity={0.8}
    >
      <Text 
        style={[
          styles.sortText,
          activeSort === item.id && styles.activeSortText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderIdeaItem = ({ item }: { item: typeof COMIC_IDEAS[0] }) => {
    const fundingPercentage = (item.currentFunding / item.fundingGoal) * 100;
    
    return (
      <View style={styles.ideaCard}>
        <View style={styles.ideaHeader}>
          <TouchableOpacity 
            style={styles.creatorContainer}
            onPress={() => handleCreatorPress(item.creator)}
          >
            <Image 
              source={{ uri: item.creatorAvatar }} 
              style={styles.creatorAvatar} 
            />
            <Text style={styles.creatorName}>{item.creator}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.ideaContent}
          onPress={() => handleIdeaPress(item)}
          activeOpacity={0.9}
        >
          <Text style={styles.ideaTitle}>{item.title}</Text>
          
          <Text style={styles.ideaDescription} numberOfLines={3}>
            {item.description}
          </Text>
          
          <View style={styles.genreTags}>
            {item.genres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreTagText}>#{genre}</Text>
              </View>
            ))}
          </View>
          
          <Image 
            source={{ uri: item.coverImage }} 
            style={styles.ideaCover} 
          />
        </TouchableOpacity>
        
        <View style={styles.ideaFooter}>
          <View style={styles.fundingContainer}>
            <View style={styles.fundingInfo}>
              <Text style={styles.fundingText}>
                <Text style={styles.fundingCurrent}>{item.currentFunding}</Text>
                <Text style={styles.fundingTotal}> / {item.fundingGoal} KRN</Text>
              </Text>
              
              <TouchableOpacity 
                style={styles.voteButton}
                onPress={() => handleVotePress(item)}
              >
                <View style={styles.voteButtonInner}>
                  <InfinityLogo size={16} color={COLORS.textPrimary} />
                  <Text style={styles.voteButtonText}>Vote</Text>
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${fundingPercentage}%` }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLike(item.id)}
            >
              <Ionicons 
                name={item.isLiked ? "heart" : "heart-outline"} 
                size={22} 
                color={item.isLiked ? COLORS.like : COLORS.textSecondary} 
              />
              <Text style={styles.actionText}>{item.likesCount}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleComment(item.id)}
            >
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.actionText}>{item.commentsCount}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShare(item.id)}
            >
              <Ionicons name="paper-plane-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.votesContainer}>
              <InfinityLogo size={16} color={COLORS.primary} />
              <Text style={styles.votesText}>{item.votesCount}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderVoteModal = () => {
    if (!selectedIdea) return null;
    
    const modalTranslateY = modalAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });
    
    const currencyOptionsTranslateY = currencyAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });
    
    const currencyOptionsOpacity = currencyAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    // Convert token values to selected currency
    const getCurrencyValue = (tokens: number) => {
      switch (selectedCurrency) {
        case 'USD':
          return `$${(tokens * 0.05).toFixed(2)}`;
        case 'EUR':
          return `€${(tokens * 0.045).toFixed(2)}`;
        case 'GBP':
          return `£${(tokens * 0.04).toFixed(2)}`;
        default:
          return `${tokens} KRN`;
      }
    };
    
    return (
      <Modal
        visible={showVoteModal}
        transparent
        animationType="none"
        onRequestClose={closeVoteModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={closeVoteModal}
          />
          
          <Animated.View 
            style={[
              styles.modalContainer,
              { transform: [{ translateY: modalTranslateY }] }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vote on this idea</Text>
              <TouchableOpacity onPress={closeVoteModal}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.modalDescription}>
                Support "{selectedIdea.title}" by voting with tokens or by watching ads.
              </Text>
              
              <View style={styles.ideaPreview}>
                <Image 
                  source={{ uri: selectedIdea.coverImage }} 
                  style={styles.previewImage} 
                />
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle} numberOfLines={2}>
                    {selectedIdea.title}
                  </Text>
                  <TouchableOpacity 
                    style={styles.previewCreator}
                    onPress={() => handleCreatorPress(selectedIdea.creator)}
                  >
                    <Image 
                      source={{ uri: selectedIdea.creatorAvatar }} 
                      style={styles.previewAvatar} 
                    />
                    <Text style={styles.previewCreatorName}>{selectedIdea.creator}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.fundingPreview}>
                <View style={styles.fundingRow}>
                  <Text style={styles.fundingLabel}>Current funding:</Text>
                  <TouchableOpacity 
                    style={styles.currencySelector}
                    onPress={toggleCurrencyOptions}
                  >
                    <Text style={styles.currencyText}>
                      {getCurrencyValue(selectedIdea.currentFunding)}
                    </Text>
                    <Ionicons 
                      name={showCurrencyOptions ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color={COLORS.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
                
                {showCurrencyOptions && (
                  <Animated.View 
                    style={[
                      styles.currencyOptions,
                      {
                        opacity: currencyOptionsOpacity,
                        transform: [{ translateY: currencyOptionsTranslateY }]
                      }
                    ]}
                  >
                    {['KRN', 'USD', 'EUR', 'GBP'].map((currency) => (
                      <TouchableOpacity 
                        key={currency}
                        style={[
                          styles.currencyOption,
                          selectedCurrency === currency && styles.selectedCurrencyOption
                        ]}
                        onPress={() => handleCurrencySelect(currency)}
                      >
                        <Text 
                          style={[
                            styles.currencyOptionText,
                            selectedCurrency === currency && styles.selectedCurrencyText
                          ]}
                        >
                          {currency}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                )}
                
                <View style={styles.fundingRow}>
                  <Text style={styles.fundingLabel}>Goal:</Text>
                  <Text style={styles.fundingValue}>
                    {getCurrencyValue(selectedIdea.fundingGoal)}
                  </Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar,
                      { width: `${(selectedIdea.currentFunding / selectedIdea.fundingGoal) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.voteOptions}>
                <TouchableOpacity 
                  style={styles.voteOptionButton}
                  onPress={handleVoteWithTokens}
                >
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.voteOptionGradient}
                  >
                    <InfinityLogo size={20} color={COLORS.textPrimary} />
                    <Text style={styles.voteOptionText}>Vote with Tokens</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.voteOptionButton}
                  onPress={handleVoteWithAds}
                >
                  <View style={styles.voteOptionSecondary}>
                    <Ionicons name="play-circle-outline" size={20} color={COLORS.textPrimary} />
                    <Text style={styles.voteOptionText}>Vote with Ads</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.infoButton}>
                  <Ionicons name="information-circle-outline" size={20} color={COLORS.textSecondary} />
                  <Text style={styles.infoText}>Ads don't hold as much value as tokens</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Vote Confirmation Toast */}
      {showVoteConfirmation && (
        <Animated.View 
          style={[
            styles.voteConfirmation,
            {
              opacity: confirmationAnim,
              transform: [{
                translateY: confirmationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0]
                })
              }]
            }
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
          <Text style={styles.voteConfirmationText}>
            Your vote for "{votedIdeaTitle}" has been recorded!
          </Text>
        </Animated.View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TownSquare</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <NotificationIcon style={styles.iconButton} />
        </View>
      </View>
      <View style={styles.subheader}>
        <Text style={styles.subheaderText}>
          Vote on artistic ventures to support creators
        </Text>
      </View>
      
      <View style={styles.sortContainer}>
        <FlatList
          data={SORT_OPTIONS}
          renderItem={renderSortItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortList}
        />
      </View>
      
      <View style={styles.genresContainer}>
        <FlatList
          data={GENRES}
          renderItem={renderGenreItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genresList}
        />
      </View>
      
      <FlatList
        data={comicIdeas}
        renderItem={renderIdeaItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ideasList}
      />
      
      {renderVoteModal()}
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
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 48 : StatusBar.currentHeight! + 12,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  subheader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  subheaderText: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
  },
  sortContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  sortList: {
    paddingHorizontal: 16,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.surface,
  },
  activeSortButton: {
    backgroundColor: COLORS.primary,
  },
  sortText: {
    ...FONTS.medium,
    color: COLORS.textSecondary,
  },
  activeSortText: {
    color: COLORS.textPrimary,
  },
  genresContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  genresList: {
    paddingHorizontal: 16,
  },
  genreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.surface,
  },
  activeGenreButton: {
    backgroundColor: COLORS.primary,
  },
  genreText: {
    ...FONTS.medium,
    color: COLORS.textSecondary,
  },
  activeGenreText: {
    color: COLORS.textPrimary,
  },
  ideasList: {
    padding: 16,
  },
  ideaCard: {
    marginBottom: 24,
    borderRadius: SIZES.radiusLarge,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  ideaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  creatorName: {
    ...FONTS.medium,
    color: COLORS.textPrimary,
  },
  ideaContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  ideaTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  ideaDescription: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  genreTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.backgroundLight,
  },
  genreTagText: {
    ...FONTS.caption,
    color: COLORS.primary,
  },
  ideaCover: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radiusMedium,
  },
  ideaFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  fundingContainer: {
    marginBottom: 12,
  },
  fundingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fundingText: {
    ...FONTS.body2,
  },
  fundingCurrent: {
    ...FONTS.semiBold,
    color: COLORS.primary,
  },
  fundingTotal: {
    color: COLORS.textSecondary,
  },
  voteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.primary,
  },
  voteButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButtonText: {
    ...FONTS.medium,
    color: COLORS.textPrimary,
    marginLeft: 6,
  },
  progressBarContainer: {
    height: 6,
    width: '100%',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  votesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  votesText: {
    ...FONTS.medium,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radiusLarge,
    borderTopRightRadius: SIZES.radiusLarge,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  modalContent: {
    padding: 16,
  },
  modalDescription: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  ideaPreview: {
    flexDirection: 'row',
    marginBottom: 24,
    padding: 12,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.backgroundLight,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radiusSmall,
    marginRight: 12,
  },
  previewInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  previewTitle: {
    ...FONTS.medium,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  previewCreator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  previewCreatorName: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  fundingPreview: {
    marginBottom: 24,
    padding: 16,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.backgroundLight,
  },
  fundingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fundingLabel: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  fundingValue: {
    ...FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
  },
  currencyText: {
    ...FONTS.semiBold,
    color: COLORS.primary,
    marginRight: 4,
  },
  currencyOptions: {
    position: 'absolute',
    top: 36,
    right: 16,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusSmall,
    padding: 4,
    ...SHADOWS.medium,
    zIndex: 10,
  },
  currencyOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radiusSmall,
  },
  selectedCurrencyOption: {
    backgroundColor: COLORS.primary,
  },
  currencyOptionText: {
    ...FONTS.medium,
    color: COLORS.textSecondary,
  },
  selectedCurrencyText: {
    color: COLORS.textPrimary,
  },
  voteOptions: {
    alignItems: 'center',
  },
  voteOptionButton: {
    width: '100%',
    marginBottom: 12,
    borderRadius: SIZES.buttonRadius,
    overflow: 'hidden',
  },
  voteOptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  voteOptionSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: COLORS.backgroundLight,
  },
  voteOptionText: {
    ...FONTS.button,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoText: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
    marginLeft: 4,
  },
  voteConfirmation: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight! + 10,
    left: 20,
    right: 20,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    ...SHADOWS.medium,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  voteConfirmationText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
});

export default TownSquareScreen;
