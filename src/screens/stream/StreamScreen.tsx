import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  Platform,
  Image,
  FlatList,
  Animated,
  Dimensions,
  ImageBackground,
  Modal
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

// Extend COLORS to include missing properties used in this component
const ExtendedCOLORS = {
  ...COLORS,
  white: '#FFFFFF',
  cardBackground: '#1E1E1E',
};

// Extend FONTS to include missing properties
const ExtendedFONTS = {
  ...FONTS,
  body3: FONTS.body1,
};

// Define types for streams and creators
interface Creator {
  name: string;
  handle: string;
  avatar: string;
}

interface LiveStream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  creator: Creator;
  tags: string[];
  viewers: number;
  duration: string;
  reminded?: boolean;
  isLive: boolean;
}

interface UpcomingStream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  creator: Creator;
  tags: string[];
  scheduledFor: string;
  reminded: boolean;
  viewers?: number;
  isLive: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface RecommendedCreator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  description: string;
  isLive: boolean;
  followers: number;
  handle: string;
};

// Mock data for livestreams
const LIVE_STREAMS: LiveStream[] = [
  {
    id: '1',
    title: 'Drawing a New Comic Series - Episode 1',
    description: 'Join me as I start a new comic series! We will go through the initial concept, character designs, and start penciling the first few pages.',
    creator: {
      name: 'Sarah Parker',
      handle: '@sarahdraws',
      avatar: 'https://randomuser.me/api/portraits/women/21.jpg'
    },
    thumbnail: 'https://images.unsplash.com/photo-1580328893451-0b5297a773c3',
    viewers: 1200,
    tags: ['Drawing', 'Comic'],
    isLive: true,
    duration: '1:30:00'
  },
  {
    id: '2',
    title: 'Character Design Workshop',
    description: 'Learn how to design memorable characters for your comics with professional tips and techniques.',
    creator: {
      name: 'Mike Ross',
      handle: '@mikeross',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    thumbnail: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0',
    viewers: 845,
    tags: ['Design', 'Tutorial'],
    isLive: true,
    duration: '2:15:00'
  },
  {
    id: '3',
    title: 'Coloring Techniques for Manga',
    description: 'Discover advanced coloring techniques specifically designed for manga-style illustrations.',
    creator: {
      name: 'Emma Wilson',
      handle: '@emmawilson',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    thumbnail: 'https://images.unsplash.com/photo-1602721224311-41edd50ae91c',
    viewers: 623,
    tags: ['Coloring', 'Manga'],
    isLive: true,
    duration: '1:45:00'
  }
];

// Mock data for upcoming streams
const UPCOMING_STREAMS: UpcomingStream[] = [
  {
    id: '4',
    title: 'Launch of Our New Comic: Dead Pixels',
    description: 'Join us for the launch of our exciting new sci-fi comic series "Dead Pixels". Meet the creators and get exclusive first looks!',
    creator: {
      name: 'Comic Central',
      handle: '@comiccentral',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    thumbnail: 'https://images.unsplash.com/photo-1605106702734-205df224ecce',
    scheduledFor: 'Tomorrow, 7PM',
    tags: ['Launch', 'New Comic'],
    reminded: false,
    isLive: false,
    viewers: 0
  },
  {
    id: '5',
    title: 'Art Jam with Top Comic Artists',
    description: 'A collaborative event with five top comic artists creating artwork together in real-time. Vote for themes and see amazing pieces come to life!',
    creator: {
      name: 'Art Community',
      handle: '@artcommunity',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    thumbnail: 'https://images.unsplash.com/photo-1547333590-47fae5f58d21',
    scheduledFor: 'This weekend',
    tags: ['Art Jam', 'Collaboration'],
    reminded: true,
    isLive: false,
    viewers: 0
  },
  {
    id: '6',
    title: 'Digital Coloring Workshop',
    description: 'Learn advanced digital coloring techniques to make your comic art pop with professional artist Sarah Parker.',
    creator: {
      name: 'Sarah Parker',
      handle: '@sarahdraws',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e',
    scheduledFor: 'Next Monday, 8PM',
    tags: ['Workshop', 'Coloring'],
    reminded: false,
    isLive: false,
    viewers: 0
  },
];

// Stream categories
const STREAM_CATEGORIES: Category[] = [
  { id: '1', name: 'Live Readings', icon: 'book-outline' },
  { id: '2', name: 'Art Workshops', icon: 'color-palette-outline' },
  { id: '3', name: 'Creator Q&A', icon: 'chatbubbles-outline' },
  { id: '4', name: 'Behind the Scenes', icon: 'film-outline' },
  { id: '5', name: 'Comic Reviews', icon: 'star-outline' },
  { id: '6', name: 'Character Creation', icon: 'people-outline' }
];

// Recommended creators
const RECOMMENDED_CREATORS: RecommendedCreator[] = [
  {
    id: '1',
    name: 'Comic Central',
    handle: '@comiccentral',
    username: 'comiccentral',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    description: 'Official account for Comic Central publishing',
    isLive: false,
    followers: 25600
  },
  {
    id: '2',
    name: 'Sarah Parker',
    handle: '@sarahdraws',
    username: 'sarahdraws',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    description: 'Comic artist and illustrator',
    isLive: false,
    followers: 12800
  },
  {
    id: '3',
    name: 'Mike Ross',
    handle: '@mikeross',
    username: 'mikeross',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    description: 'Manga artist and storyteller',
    isLive: true,
    followers: 9400
  },
  {
    id: '4',
    name: 'David Cooper',
    handle: '@davidinks',
    username: 'davidinks',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    description: 'Inking specialist & teacher',
    isLive: true,
    followers: 9400
  }
];

const StreamScreen = () => {
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState('1');
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState<LiveStream | UpcomingStream | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  // Header animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [Platform.OS === 'ios' ? 60 : 40, 20],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const openStreamDetails = (stream: LiveStream | UpcomingStream): void => {
    setSelectedStream(stream);
    setShowStreamModal(true);
  };

  const toggleReminder = (id: string): void => {
    // Toggle reminder logic will be implemented with backend integration
    console.log(`Toggled reminder for stream ${id}`);
  };

  const renderLiveStreamItem = ({ item }: { item: LiveStream }): React.ReactElement => (
    <TouchableOpacity 
      style={styles.liveStreamCard}
      onPress={() => openStreamDetails(item)}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: item.thumbnail }}
        style={styles.streamThumbnail}
        imageStyle={{ borderRadius: 12 }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.thumbnailOverlay}
        >
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          
          <View style={styles.streamInfo}>
            <Text style={styles.streamTitle} numberOfLines={2}>{item.title}</Text>
            
            <View style={styles.creatorRow}>
              <Image source={{ uri: item.creator.avatar }} style={styles.creatorAvatar} />
              <Text style={styles.creatorName}>{item.creator.name}</Text>
            </View>
            
            <View style={styles.streamMetaRow}>
              <View style={styles.viewerCount}>
                <Ionicons name="eye-outline" size={14} color={ExtendedCOLORS.white} />
                <Text style={styles.viewerCountText}>{item.viewers.toLocaleString()}</Text>
              </View>
              
              <View style={styles.streamTags}>
                {item.tags.map((tag, index) => (
                  <View key={index} style={styles.tagPill}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderUpcomingStreamItem = ({ item }: { item: UpcomingStream }): React.ReactElement => (
    <TouchableOpacity 
      style={styles.upcomingStreamCard}
      onPress={() => openStreamDetails(item)}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: item.thumbnail }}
        style={styles.upcomingThumbnail}
        imageStyle={{ borderRadius: 10 }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.thumbnailOverlay}
        >
          <View style={styles.upcomingInfo}>
            <Text style={styles.upcomingTitle} numberOfLines={2}>{item.title}</Text>
            
            <View style={styles.creatorRow}>
              <Image source={{ uri: item.creator.avatar }} style={styles.creatorAvatar} />
              <Text style={styles.creatorName}>{item.creator.name}</Text>
            </View>
            
            <View style={styles.streamMetaRow}>
              <View style={styles.scheduleRow}>
                <Ionicons name="time-outline" size={14} color={ExtendedCOLORS.white} />
                <Text style={styles.scheduleText}>{item.scheduledFor}</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.reminderButton, item.reminded && styles.reminderActive]}
                onPress={() => toggleReminder(item.id)}
              >
                <Ionicons 
                  name={item.reminded ? "notifications" : "notifications-outline"} 
                  size={16} 
                  color={item.reminded ? ExtendedCOLORS.white : COLORS.primary} 
                />
                <Text style={[styles.reminderText, item.reminded && styles.reminderActiveText]}>
                  {item.reminded ? 'Reminded' : 'Remind me'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: { item: Category }): React.ReactElement => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.activeCategoryItem
      ]}
      onPress={() => setActiveCategory(item.id)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={20} 
        color={activeCategory === item.id ? ExtendedCOLORS.white : COLORS.primary} 
      />
      <Text 
        style={[
          styles.categoryText,
          activeCategory === item.id && styles.activeCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderRecommendedCreator = ({ item }: { item: RecommendedCreator }): React.ReactElement => (
    <TouchableOpacity style={styles.creatorCard}>
      <View style={styles.creatorCardTop}>
        <Image source={{ uri: item.avatar }} style={styles.creatorCardAvatar} />
        {item.isLive && <View style={styles.creatorLiveIndicator} />}
      </View>
      <Text style={styles.creatorCardName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.creatorCardHandle} numberOfLines={1}>{item.handle}</Text>
      <Text style={styles.creatorCardDesc} numberOfLines={2}>{item.description}</Text>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          { 
            height: headerHeight, 
            opacity: headerOpacity 
          }
        ]}
      >
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stream</Text>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="search-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Featured Live Stream */}
        <View style={styles.featuredSection}>
          <TouchableOpacity 
            style={styles.featuredStream}
            onPress={() => openStreamDetails(LIVE_STREAMS[0])}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={{ uri: LIVE_STREAMS[0].thumbnail }}
              style={styles.featuredThumbnail}
              imageStyle={{ borderRadius: 16 }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                style={styles.featuredOverlay}
              >
                <View style={styles.featuredLiveIndicator}>
                  <View style={styles.featuredLiveDot} />
                  <Text style={styles.featuredLiveText}>LIVE NOW</Text>
                </View>
                
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredTitle}>{LIVE_STREAMS[0].title}</Text>
                  
                  <View style={styles.featuredCreatorRow}>
                    <Image 
                      source={{ uri: LIVE_STREAMS[0].creator.avatar }} 
                      style={styles.featuredAvatar} 
                    />
                    <View>
                      <Text style={styles.featuredCreatorName}>{LIVE_STREAMS[0].creator.name}</Text>
                      <Text style={styles.featuredCreatorHandle}>{LIVE_STREAMS[0].creator.handle}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.featuredMetaRow}>
                    <View style={styles.featuredViewers}>
                      <Ionicons name="people-outline" size={16} color={ExtendedCOLORS.white} />
                      <Text style={styles.featuredViewersText}>
                        {LIVE_STREAMS[0].viewers.toLocaleString()} watching
                      </Text>
                    </View>
                    
                    <TouchableOpacity style={styles.watchButton}>
                      <Text style={styles.watchButtonText}>Watch Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* Stream Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <FlatList
            data={STREAM_CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>
        
        {/* Live Streams */}
        <View style={styles.liveSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Now</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={LIVE_STREAMS}
            renderItem={renderLiveStreamItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.liveStreamsContainer}
          />
        </View>
        
        {/* Upcoming Streams */}
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Streams</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={UPCOMING_STREAMS}
            renderItem={renderUpcomingStreamItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.upcomingStreamsContainer}
          />
        </View>
        
        {/* Recommended Creators */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Creators to Follow</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={RECOMMENDED_CREATORS}
            renderItem={renderRecommendedCreator}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedCreatorsContainer}
          />
        </View>
        
        {/* Start Streaming Button */}
        <View style={styles.startStreamingSection}>
          <TouchableOpacity style={styles.startStreamingButton}>
            <Ionicons name="videocam-outline" size={24} color={ExtendedCOLORS.white} />
            <Text style={styles.startStreamingText}>Start Streaming</Text>
          </TouchableOpacity>
          <Text style={styles.startStreamingDesc}>
            Share your comic creations live with your followers!
          </Text>
        </View>
        
        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
      
      {/* Stream Details Modal */}
      <Modal
        visible={showStreamModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowStreamModal(false)}
      >
        {selectedStream && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowStreamModal(false)}
                >
                  <Ionicons name="close-outline" size={28} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Stream Details</Text>
                <View style={{ width: 28 }} />
              </View>
              
              <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground
                  source={{ uri: selectedStream.thumbnail }}
                  style={styles.modalThumbnail}
                  imageStyle={{ borderRadius: 12 }}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.modalOverlay}
                  >
                    {('isLive' in selectedStream && selectedStream.isLive) ? (
                      <View style={styles.modalLiveIndicator}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>LIVE</Text>
                      </View>
                    ) : (
                      <View style={styles.modalScheduledIndicator}>
                        <Ionicons name="time-outline" size={16} color={ExtendedCOLORS.white} />
                        <Text style={styles.scheduledText}>
                          {('scheduledFor' in selectedStream) ? selectedStream.scheduledFor : 'Coming Soon'}
                        </Text>
                      </View>
                    )}
                  </LinearGradient>
                </ImageBackground>
                
                <View style={styles.modalStreamInfo}>
                  <Text style={styles.modalStreamTitle}>{selectedStream.title}</Text>
                  
                  <View style={styles.modalCreatorInfo}>
                    <Image 
                      source={{ uri: selectedStream.creator.avatar }} 
                      style={styles.modalCreatorAvatar} 
                    />
                    <View style={styles.modalCreatorDetails}>
                      <Text style={styles.modalCreatorName}>{selectedStream.creator.name}</Text>
                      <Text style={styles.modalCreatorHandle}>{selectedStream.creator.handle}</Text>
                    </View>
                    <TouchableOpacity style={styles.followCreatorButton}>
                      <Text style={styles.followCreatorText}>Follow</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.modalStats}>
                    {('viewers' in selectedStream) ? (
                      <>
                        <View style={styles.modalStatItem}>
                          <Ionicons name="eye-outline" size={18} color={COLORS.textSecondary} />
                          <Text style={styles.modalStatText}>{(selectedStream.viewers !== undefined ? selectedStream.viewers : 0).toLocaleString()} viewers</Text>
                        </View>
                        <View style={styles.modalStatDivider} />
                        <View style={styles.modalStatItem}>
                          <Ionicons name="chatbubble-outline" size={18} color={COLORS.textSecondary} />
                          <Text style={styles.modalStatText}>Live Chat</Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={styles.modalStatItem}>
                          <Ionicons name="time-outline" size={18} color={COLORS.textSecondary} />
                          <Text style={styles.modalStatText}>
                            {('scheduledFor' in selectedStream) ? selectedStream.scheduledFor : 'Coming Soon'}
                          </Text>
                        </View>
                        <View style={styles.modalStatDivider} />
                        <TouchableOpacity 
                          style={styles.modalReminder}
                          onPress={() => toggleReminder(selectedStream.id)}
                        >
                          <Ionicons 
                            name={selectedStream.reminded ? "notifications" : "notifications-outline"} 
                            size={18} 
                            color={selectedStream.reminded ? COLORS.primary : COLORS.textSecondary} 
                          />
                          <Text 
                            style={[
                              styles.modalReminderText,
                              selectedStream.reminded && { color: COLORS.primary }
                            ]}
                          >
                            {selectedStream.reminded ? 'Reminded' : 'Set Reminder'}
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                  
                  <View style={styles.modalTags}>
                    {selectedStream.tags.map((tag, index) => (
                      <View key={index} style={styles.modalTagPill}>
                        <Text style={styles.modalTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.modalDescription}>
                    <Text style={styles.modalDescTitle}>About this stream</Text>
                    <Text style={styles.modalDescText}>
                      Join {selectedStream.creator.name} for an exciting {selectedStream.isLive ? 'live stream' : 'upcoming stream'} 
                      where they'll be {selectedStream.title.toLowerCase()}. Don't miss this opportunity to interact with 
                      one of the community's favorite creators!
                    </Text>
                  </View>
                  
                  {('isLive' in selectedStream && selectedStream.isLive) ? (
                    <TouchableOpacity style={styles.modalWatchButton}>
                      <Ionicons name="play" size={20} color={ExtendedCOLORS.white} />
                      <Text style={styles.modalWatchText}>Watch Now</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={[
                        styles.modalReminderButton,
                        selectedStream.reminded && styles.modalReminderActive
                      ]}
                      onPress={() => toggleReminder(selectedStream.id)}
                    >
                      <Ionicons 
                        name={selectedStream.reminded ? "notifications" : "notifications-outline"} 
                        size={20} 
                        color={selectedStream.reminded ? ExtendedCOLORS.white : COLORS.primary} 
                      />
                      <Text 
                        style={[
                          styles.modalReminderButtonText,
                          selectedStream.reminded && { color: ExtendedCOLORS.white }
                        ]}
                      >
                        {selectedStream.reminded ? 'Reminder Set' : 'Set Reminder'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
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
    zIndex: 10,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
  },
  
  // Featured Stream Section
  featuredSection: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  featuredStream: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  featuredThumbnail: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  featuredLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  featuredLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ExtendedCOLORS.white || '#FFFFFF',
    marginRight: 5,
  },
  featuredLiveText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.caption,
    fontWeight: 'bold',
  },
  featuredInfo: {
    width: '100%',
  },
  featuredTitle: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.h3,
    marginBottom: 8,
  },
  featuredCreatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featuredAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: ExtendedCOLORS.white || '#FFFFFF',
  },
  featuredCreatorName: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...ExtendedFONTS.body3,
    fontWeight: 'bold',
  },
  featuredCreatorHandle: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.caption,
    opacity: 0.8,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  featuredViewers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredViewersText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.caption,
    marginLeft: 5,
  },
  watchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchButtonText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.button,
    marginLeft: 4,
  },
  
  // Categories Section
  categoriesSection: {
    marginTop: 25,
    paddingLeft: 16,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ExtendedCOLORS.cardBackground || '#1E1E1E',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeCategoryItem: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    ...ExtendedFONTS.body3,
    color: COLORS.primary,
    marginLeft: 6,
  },
  activeCategoryText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
  },
  
  // Live Streams Section
  liveSection: {
    marginTop: 25,
    paddingLeft: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 12,
  },
  seeAllText: {
    ...ExtendedFONTS.body3,
    color: COLORS.primary,
  },
  liveStreamsContainer: {
    paddingBottom: 8,
  },
  liveStreamCard: {
    width: 250,
    height: 180,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  streamThumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ExtendedCOLORS.white || '#FFFFFF',
    marginRight: 4,
  },
  liveText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.caption,
    fontWeight: 'bold',
    fontSize: 10,
  },
  streamInfo: {
    width: '100%',
  },
  streamTitle: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...ExtendedFONTS.body3,
    marginBottom: 6,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  creatorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  creatorName: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.caption,
  },
  streamMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewerCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerCountText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.caption,
    marginLeft: 4,
    fontSize: 10,
  },
  streamTags: {
    flexDirection: 'row',
  },
  tagPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginLeft: 4,
  },
  tagText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.caption,
    fontSize: 8,
  },
  
  // Upcoming Streams Section
  upcomingSection: {
    marginTop: 25,
    paddingLeft: 16,
  },
  upcomingStreamsContainer: {
    paddingBottom: 8,
  },
  upcomingStreamCard: {
    width: 250,
    height: 180,
    marginRight: 12,
    borderRadius: 10,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  upcomingThumbnail: {
    width: '100%',
    height: '100%',
  },
  upcomingInfo: {
    width: '100%',
  },
  upcomingTitle: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...ExtendedFONTS.body3,
    marginBottom: 6,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.caption,
    marginLeft: 4,
    fontSize: 10,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  reminderActive: {
    backgroundColor: COLORS.primary,
  },
  reminderText: {
    color: COLORS.primary,
    ...FONTS.caption,
    marginLeft: 3,
    fontSize: 9,
  },
  reminderActiveText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
  },
  
  // Recommended Creators Section
  recommendedSection: {
    marginTop: 25,
    paddingLeft: 16,
  },
  recommendedCreatorsContainer: {
    paddingBottom: 8,
  },
  creatorCard: {
    width: 120,
    backgroundColor: ExtendedCOLORS.cardBackground || '#1E1E1E',
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    ...SHADOWS.small,
  },
  creatorCardTop: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  creatorCardAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  creatorLiveIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: ExtendedCOLORS.cardBackground || '#1E1E1E',
    top: 0,
    right: 22,
  },
  creatorCardName: {
    color: COLORS.textPrimary,
    ...ExtendedFONTS.body3,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  creatorCardHandle: {
    color: COLORS.textSecondary,
    ...FONTS.caption,
    textAlign: 'center',
    marginBottom: 4,
  },
  creatorCardDesc: {
    color: COLORS.textSecondary,
    ...FONTS.caption,
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 10,
    lineHeight: 14,
  },
  followButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  followButtonText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.button,
    fontSize: 12,
  },
  
  // Start Streaming Section
  startStreamingSection: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  startStreamingButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    width: '80%',
    ...SHADOWS.medium,
    marginBottom: 8,
  },
  startStreamingText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.button,
    marginLeft: 8,
  },
  startStreamingDesc: {
    color: COLORS.textSecondary,
    ...FONTS.caption,
    textAlign: 'center',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '80%',
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  modalThumbnail: {
    width: '100%',
    height: 200,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  modalLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  modalScheduledIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  scheduledText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.caption,
    marginLeft: 5,
  },
  modalStreamInfo: {
    padding: 16,
  },
  modalStreamTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  modalCreatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalCreatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalCreatorDetails: {
    flex: 1,
  },
  modalCreatorName: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  modalCreatorHandle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  followCreatorButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  followCreatorText: {
    color: ExtendedCOLORS.white || '#FFFFFF',
    ...FONTS.button,
    fontSize: 12,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: ExtendedCOLORS.cardBackground || '#1E1E1E',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  modalStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalStatText: {
    ...ExtendedFONTS.body3,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  modalStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  modalReminder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalReminderText: {
    ...ExtendedFONTS.body3,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  modalTagPill: {
    backgroundColor: ExtendedCOLORS.cardBackground || '#1E1E1E',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  modalTagText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  modalDescription: {
    marginBottom: 20,
  },
  modalDescTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  modalDescText: {
    ...ExtendedFONTS.body3,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  modalWatchButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  modalWatchText: {
    ...FONTS.button,
    color: ExtendedCOLORS.white || '#FFFFFF',
    marginLeft: 8,
  },
  modalReminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  modalReminderActive: {
    backgroundColor: COLORS.primary,
  },
  modalReminderButtonText: {
    ...FONTS.button,
    color: COLORS.primary,
    marginLeft: 8,
  },
});

export default StreamScreen;
