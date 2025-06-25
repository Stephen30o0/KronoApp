import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import CommentsPopup, { Comment } from '../../components/common/CommentsPopup';
import Logo from '../../components/common/Logo';
import NotificationIcon from '../../components/common/NotificationIcon';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants/theme';

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

// Helper to convert token values to selected currency
function getCurrencyValue(tokens: number, currency: string = 'KRN'): string {
  switch (currency) {
    case 'USD':
      return `$${(tokens * 0.05).toFixed(2)}`;
    case 'EUR':
      return `€${(tokens * 0.045).toFixed(2)}`;
    case 'GBP':
      return `£${(tokens * 0.04).toFixed(2)}`;
    default:
      return `${tokens} KRN`;
  }
}

interface ComicIdea {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  description: string;
  coverImage: string;
  genres: string[];
  fundingGoal: number;
  currentFunding: number;
  votesCount: number;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  datePosted: string;
  commentData?: Comment[];
}

// Mock data for comic ideas
const COMIC_IDEAS: ComicIdea[] = [
  {
    id: '1',
    title: 'Quantum Detectives: A Mystery in Multiple Dimensions',
    creator: 'quantum_ink',
    creatorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    description: 'A noir detective story where the culprit exists in multiple quantum realities...',
    coverImage: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    genres: ['Sci-Fi', 'Mystery', 'Multiverse'],
    fundingGoal: 5000,
    currentFunding: 3750,
    votesCount: 245,
    likesCount: 189,
    commentsCount: 42,
    isLiked: false,
    datePosted: '2d ago',
    commentData: [
        {
            id: 'ts1-c1',
            user: 'ComicFan1',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
            note: 'This is a brilliant idea! I would totally read this.',
            time: '1d ago',
            likes: 15,
            replies: [],
        },
    ],
  },
  {
    id: '2',
    title: 'Neon Dreams: Cyberpunk Chronicles',
    creator: 'neon_artist',
    creatorAvatar: 'https://randomuser.me/api/portraits/women/46.jpg',
    description: 'Follow the story of a hacker in a dystopian future...',
    coverImage: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
    genres: ['Cyberpunk', 'Dystopia', 'Thriller'],
    fundingGoal: 7500,
    currentFunding: 6200,
    votesCount: 312,
    likesCount: 276,
    commentsCount: 58,
    isLiked: true,
    datePosted: '1w ago',
    commentData: [],
  },
  // more comic ideas...
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
  const [tokenAmount, setTokenAmount] = useState('');
  const [voteStep, setVoteStep] = useState<'options' | 'tokenInput'>('options');
  const [isShowingAd, setIsShowingAd] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [activeComments, setActiveComments] = useState<Comment[]>([]);
  const [activeIdeaId, setActiveIdeaId] = useState<string | null>(null);

  const modalAnimation = useRef(new Animated.Value(0)).current;
  const currencyAnimation = useRef(new Animated.Value(0)).current;
  const confirmationAnim = useRef(new Animated.Value(0)).current;

  const modalScale = modalAnimation.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  const modalOpacity = modalAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const currencyOptionsTranslateY = currencyAnimation.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
  const confirmationTranslateY = confirmationAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] });

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
    const idea = comicIdeas.find(i => i.id === ideaId);
    if (idea && idea.commentData) {
      setActiveComments(idea.commentData);
      setActiveIdeaId(ideaId);
      setIsCommentsVisible(true);
    }
  };

  const handleCloseComments = () => {
    setIsCommentsVisible(false);
    setActiveComments([]);
    setActiveIdeaId(null);
  };

  const handleSendComment = (text: string, parentId?: string) => {
    if (!activeIdeaId) return;

    const newComment: Comment = {
      id: `ts-c${Date.now()}`,
      user: 'CurrentUser',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      note: text,
      time: 'Just now',
      likes: 0,
      replies: [],
    };

    const updatedIdeas = comicIdeas.map(idea => {
      if (idea.id === activeIdeaId) {
        const newCommentData = [...(idea.commentData || []), newComment];
        // Simplified logic, does not handle replies for now
        return { ...idea, commentData: newCommentData, commentsCount: idea.commentsCount + 1 };
      }
      return idea;
    });

    setComicIdeas(updatedIdeas);
    const updatedIdea = updatedIdeas.find(i => i.id === activeIdeaId);
    if (updatedIdea) {
      setActiveComments(updatedIdea.commentData || []);
    }
  };

  const handleShare = (ideaId: string) => {
    console.log('Share idea', ideaId);
  };

  const handleVotePress = (idea: typeof COMIC_IDEAS[0]) => {
    setSelectedIdea(idea);
    setShowVoteModal(true);
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const closeVoteModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowVoteModal(false);
      setSelectedIdea(null);
      setVoteStep('options');
    });
  };

  const toggleCurrencyOptions = () => {
    if (showCurrencyOptions) {
      Animated.timing(currencyAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowCurrencyOptions(false);
      });
    } else {
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
    const amount = parseInt(tokenAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    console.log('Vote with tokens for idea', selectedIdea?.id, 'amount:', amount);
    const updatedIdeas = comicIdeas.map(idea => {
      if (idea.id === selectedIdea?.id) {
        return { ...idea, votesCount: idea.votesCount + amount };
      }
      return idea;
    });
    setComicIdeas(updatedIdeas);
    setVotedIdeaTitle(selectedIdea?.title || '');
    closeVoteModal();
    setTokenAmount('');
    setShowVoteConfirmation(true);
    Animated.sequence([ 
      Animated.timing(confirmationAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(confirmationAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => {
      setShowVoteConfirmation(false);
    });
  };

      const handleVoteWithAds = () => {
    console.log('Vote with ads for idea', selectedIdea?.id);
    const updatedIdeas = comicIdeas.map(idea => {
      if (idea.id === selectedIdea?.id) {
        return { ...idea, votesCount: idea.votesCount + 1 };
      }
      return idea;
    });
    setComicIdeas(updatedIdeas);
    setVotedIdeaTitle(selectedIdea?.title || '');
    setShowVoteConfirmation(true);
    Animated.sequence([
      Animated.timing(confirmationAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(confirmationAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start(() => {
      setShowVoteConfirmation(false);
    });
  };

  const handleVoteWithAdsFlow = () => {
    closeVoteModal();
    setIsShowingAd(true);
    setTimeout(() => {
      setIsShowingAd(false);
      handleVoteWithAds();
    }, 5000); // 5-second ad simulation
  };

  

  const handleCreatorPress = (creatorName: string) => {
    console.log('View profile of', creatorName);
  };

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
            {item.genres.map((genre: string, index: number) => (
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
          <View style={styles.fundingVoteBarRow}>
            <View style={styles.fundingInfoLeft}>
              <Text style={styles.fundingText}>
                <Text style={styles.fundingCurrent}>{item.currentFunding.toLocaleString()}</Text>
                <Text style={styles.fundingTotal}> / {item.fundingGoal.toLocaleString()} KRN</Text>
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${fundingPercentage}%` }]}
              />
            </View>
            <TouchableOpacity style={styles.voteButton} onPress={() => handleVotePress(item)}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.voteOptionGradient}
              >
                <Text style={styles.voteButtonText}>Vote</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
              <Ionicons name={item.isLiked ? 'heart' : 'heart-outline'} size={20} color={item.isLiked ? COLORS.primary : COLORS.textSecondary} />
              <Text style={styles.actionText}>{item.likesCount.toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item.id)}>
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
              <Text style={styles.actionText}>{item.commentsCount.toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item.id)}>
              <Ionicons name="paper-plane-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    );
  };

  const renderGenreItem = ({ item }: { item: typeof GENRES[0] }) => (
    <TouchableOpacity 
      style={[styles.genreButton, activeGenre === item.id && styles.activeGenreButton]}
      onPress={() => handleGenrePress(item.id)}
      activeOpacity={0.8}
    >
      <Text style={[styles.genreText, activeGenre === item.id && styles.activeGenreText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSortItem = ({ item }: { item: typeof SORT_OPTIONS[0] }) => (
    <TouchableOpacity 
      style={[styles.sortButton, activeSort === item.id && styles.activeSortButton]}
      onPress={() => handleSortPress(item.id)}
      activeOpacity={0.8}
    >
      <Text style={[styles.sortText, activeSort === item.id && styles.activeSortText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={openDrawer} style={styles.headerLogo}>
            <Logo size={36} />
            <Text style={styles.logoText}>KronoLabs</Text>
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
            <TextInput
              placeholder="Search ideas..."
              placeholderTextColor={COLORS.textSecondary}
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <NotificationIcon size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

      {/* Genre and Sort selectors */}
      <View style={styles.genreSortRow}>
        <FlatList
          data={GENRES}
          renderItem={renderGenreItem}
          keyExtractor={(item: typeof GENRES[0]) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genreList}
        />
        <FlatList
          data={SORT_OPTIONS}
          renderItem={renderSortItem}
          keyExtractor={(item: typeof SORT_OPTIONS[0]) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortList}
        />
      </View>

      {/* Idea cards */}
      <FlatList
        data={comicIdeas}
        renderItem={renderIdeaItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ideaList}
        showsVerticalScrollIndicator={false}
      />

      {/* Vote Modal */}
      {showVoteModal && (
        <Modal visible={showVoteModal} transparent animationType="none" onRequestClose={closeVoteModal}>
          <View style={[styles.modalOverlay, { justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={closeVoteModal} />
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ scale: modalScale }],
                  opacity: modalOpacity,
                  alignSelf: 'center',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  borderRadius: 24,
                  maxWidth: 400,
                  width: '90%',
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Vote on this idea</Text>
                <TouchableOpacity onPress={closeVoteModal}>
                  <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                {selectedIdea && (
                  <>
                    <View style={styles.ideaPreview}>
                      <Image source={{ uri: selectedIdea.coverImage }} style={styles.previewImage} />
                      <View style={styles.previewInfo}>
                        <Text style={styles.previewTitle} numberOfLines={2}>
                          {selectedIdea.title}
                        </Text>
                        <TouchableOpacity style={styles.previewCreator} onPress={() => handleCreatorPress(selectedIdea.creator)}>
                          <Image source={{ uri: selectedIdea.creatorAvatar }} style={styles.previewAvatar} />
                          <Text style={styles.previewCreatorName}>{selectedIdea.creator}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.fundingPreview}>
                      <View style={styles.fundingRow}>
                        <Text style={styles.fundingLabel}>Current funding:</Text>
                        <TouchableOpacity style={styles.currencySelector} onPress={toggleCurrencyOptions}>
                          <Text style={styles.currencyText}>
                            {getCurrencyValue(selectedIdea.currentFunding, selectedCurrency)}
                          </Text>
                          <Ionicons name={showCurrencyOptions ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                      </View>

                      {showCurrencyOptions && (
                        <Animated.View
                          style={[
                            styles.currencyOptions,
                            {
                              opacity: currencyAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                              transform: [{ translateY: currencyOptionsTranslateY }],
                            },
                          ]}
                        >
                          {['KRN', 'USD', 'EUR', 'GBP'].map((currency) => (
                            <TouchableOpacity
                              key={currency}
                              style={[styles.currencyOption, selectedCurrency === currency && styles.selectedCurrencyOption]}
                              onPress={() => handleCurrencySelect(currency)}
                            >
                              <Text
                                style={[styles.currencyOptionText, selectedCurrency === currency && styles.selectedCurrencyText]}
                              >
                                {currency}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </Animated.View>
                      )}

                      <View style={styles.fundingRow}>
                        <Text style={styles.fundingLabel}>Goal:</Text>
                        <Text style={styles.fundingValue}>{getCurrencyValue(selectedIdea.fundingGoal, selectedCurrency)}</Text>
                      </View>

                      <View style={styles.progressBarContainer}>
                        <View
                          style={[
                            styles.progressBar,
                            { width: `${(selectedIdea.currentFunding / selectedIdea.fundingGoal) * 100}%` },
                          ]}
                        />
                      </View>
                    </View>

                    {voteStep === 'options' && (
                      <Animatable.View animation="fadeInUp" duration={400}>
                        <TouchableOpacity
                          style={styles.voteButton}
                          onPress={() => setVoteStep('tokenInput')}
                        >
                          <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.voteOptionGradient}
                          >
                            <Text style={styles.voteOptionText}>Vote with Tokens</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.voteButton, { marginTop: 16 }]}
                          onPress={handleVoteWithAdsFlow}
                        >
                          <LinearGradient
                            colors={[COLORS.surfaceLight, COLORS.divider]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.voteOptionGradient}
                          >
                            <Text style={styles.voteOptionText}>Vote with Ads</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </Animatable.View>
                    )}

                    {voteStep === 'tokenInput' && (
                      <Animatable.View animation="fadeInUp" duration={400} style={styles.tokenVoteContainer}>
                        <TouchableOpacity onPress={() => setVoteStep('options')} style={styles.backButton}>
                          <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
                          <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                        <View style={styles.tokenInputRow}>
                          <TextInput
                            style={styles.tokenInput}
                            placeholder="0"
                            placeholderTextColor={COLORS.textSecondary}
                            keyboardType="numeric"
                            value={tokenAmount}
                            onChangeText={setTokenAmount}
                            maxLength={6}
                            autoFocus
                          ></TextInput>
                          <Text style={styles.tokenInputLabel}>KRN</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.voteButton}
                          onPress={handleVoteWithTokens}
                        >
                          <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.voteOptionGradient}
                          >
                            <Text style={styles.voteOptionText}>Confirm Vote</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </Animatable.View>
                    )}
                  </>
                )}
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* Ad Modal */}
      {isShowingAd && (
        <Modal visible={isShowingAd} transparent animationType="fade">
          <View style={styles.adOverlay}>
            <View style={styles.adContainer}>
              <Text style={styles.adText}>Showing an ad...</Text>
              <Text style={styles.adText}>(This is a 5-second simulation)</Text>
            </View>
          </View>
        </Modal>        )}
      </SafeAreaView>
      
      <CommentsPopup
        visible={isCommentsVisible}
        onClose={handleCloseComments}
        comments={activeComments}
        onSend={handleSendComment}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
    paddingTop: 44, // Increased top padding to avoid status bar
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.base,
    marginHorizontal: SIZES.base,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.textPrimary,
    height: 40,
  },

  notificationButton: {
    padding: 8,
  },
  genreSortRow: {
    paddingVertical: 12,
  },
  genreList: {
    paddingHorizontal: SIZES.base,
    paddingBottom: 12,
  },
  sortList: {
    paddingHorizontal: SIZES.base,
  },
  genreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.surface,
    marginRight: 12,
  },
  activeGenreButton: {
    backgroundColor: COLORS.primary,
  },
  genreText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  activeGenreText: {
    color: '#FFFFFF',
    ...FONTS.semiBold,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.surface,
    marginRight: 12,
  },
  activeSortButton: {
    backgroundColor: COLORS.primary,
  },
  sortText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  activeSortText: {
    color: '#FFFFFF',
    ...FONTS.semiBold,
  },
  ideaList: {
    paddingHorizontal: SIZES.base,
    paddingBottom: 100,
  },
  ideaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    marginBottom: 24,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  ideaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base,
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  creatorName: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
  },
  datePosted: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  ideaCover: {
    width: '100%',
    height: 220,
    backgroundColor: COLORS.background,
  },
  ideaTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    paddingHorizontal: SIZES.base,
    paddingTop: SIZES.base,
  },
  ideaDescription: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    paddingHorizontal: SIZES.base,
    paddingTop: 8,
  },
  genreTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.base,
    paddingTop: 12,
  },
  genreTag: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  genreTagText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  ideaFooter: {
    padding: SIZES.base,
  },
  fundingVoteBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fundingInfoLeft: {
    flex: 1,
    marginRight: 16,
  },
  fundingText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  fundingCurrent: {
    ...FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  fundingTotal: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
  },
  fundingPercentage: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  voteButton: {
    borderRadius: SIZES.radiusMedium,
    overflow: 'hidden',
  },
  voteButtonText: {
    ...FONTS.h4,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  voteOptionGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  votesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  votesText: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    margin: SIZES.base,
    padding: SIZES.base,
    borderRadius: SIZES.radiusMedium,
    ...SHADOWS.large,
  },
  adOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContainer: {
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.surface,
  },
  adText: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  modalContent: {
    paddingTop: SIZES.base,
  },
  ideaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radiusMedium,
    marginRight: SIZES.base,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
  },
  previewCreator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  previewAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  previewCreatorName: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  fundingPreview: {
    paddingVertical: SIZES.base,
  },
  fundingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  fundingLabel: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  fundingValue: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    ...FONTS.h4,
    color: COLORS.primary,
    marginRight: 4,
  },
  currencyOptions: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    ...SHADOWS.medium,
    zIndex: 1,
  },
  currencyOption: {
    padding: SIZES.base,
  },
  selectedCurrencyOption: {
    backgroundColor: COLORS.background,
  },
  currencyOptionText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  selectedCurrencyText: {
    ...FONTS.h4,
    color: COLORS.primary,
  },
  tokenVoteContainer: {
    paddingTop: SIZES.base,
  },
  tokenInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
    padding: 12,
    marginBottom: SIZES.base,
  },
  tokenInput: {
    flex: 1,
    ...FONTS.h1,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  tokenInputLabel: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
  },

  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  ideaContent: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  backButton: {
    position: 'absolute',
    top: SIZES.base * 2,
    left: SIZES.base,
    zIndex: 10,
  },
  backButtonText: {
    ...FONTS.h5,
    color: '#FFFFFF',
  },
  voteOptionText: {
    ...FONTS.h3,
    color: '#FFFFFF',
  }
});

export default TownSquareScreen;
