import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  Image,
  Platform,
  Animated,
  Dimensions,
  RefreshControl,
  FlatList,
  ImageBackground,
  Pressable
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';
import NotificationIcon from '../../components/common/NotificationIcon';
import ComicItem from '../../components/profile/ComicItem';
import AchievementItem from '../../components/profile/AchievementItem';

// Constants
const { width, height } = Dimensions.get('window');
const BLUR_INTENSITY = 85;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 120 : 100;
const TABS = ['Creations', 'Collected', 'Achievements', 'Activity'];

// Sample data
const SAMPLE_COMICS = [
  {
    id: '1',
    title: 'Cyber Knights',
    coverImage: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29taWN8ZW58MHx8MHx8&w=400&q=80',
    author: 'Alex Johnson',
    likes: 245,
    views: 1200
  },
  {
    id: '2',
    title: 'Enchanted Forest',
    coverImage: 'https://images.unsplash.com/photo-1623018035782-b269248df916?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZHJhd2luZ3xlbnwwfHwwfHw%3D&w=400&q=80',
    author: 'Alex Johnson',
    likes: 189,
    views: 876
  },
  {
    id: '3',
    title: 'Space Odyssey',
    coverImage: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhY2UlMjBhcnR8ZW58MHx8MHx8&w=400&q=80',
    author: 'Alex Johnson',
    likes: 324,
    views: 1500
  },
  {
    id: '4',
    title: 'Neon City',
    coverImage: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmVvbiUyMGNpdHl8ZW58MHx8MHx8&w=400&q=80',
    author: 'Alex Johnson',
    likes: 156,
    views: 723
  }
];

const SAMPLE_ACHIEVEMENTS = [
  {
    id: '1',
    title: 'First Creation',
    description: 'Published your first comic',
    icon: 'trophy',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
  {
    id: '2',
    title: 'Popular Creator',
    description: 'Reach 100 followers',
    icon: 'star',
    unlocked: false,
    progress: 45,
    maxProgress: 100,
  },
  {
    id: '3',
    title: 'Content Machine',
    description: 'Create 10 comics',
    icon: 'pencil',
    unlocked: false,
    progress: 3,
    maxProgress: 10,
  },
  {
    id: '4',
    title: 'Rising Star',
    description: 'Get featured on the home page',
    icon: 'star-shooting',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
];

// Define styles at the top level, before the component
const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginVertical: 16,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  coverContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingTop: 70, // Increased to make room for the profile picture
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  handle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  verified: {
    marginLeft: 8,
  },
  bio: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginVertical: 8,
    lineHeight: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  profileImageContainer: {
    position: 'absolute',
    top: 150, // Position to overlap with the bottom of the cover image
    left: 16,
    width: 100,
    height: 100,
    borderRadius: 8, // Square with slightly rounded corners
    borderWidth: 3,
    borderColor: COLORS.background,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10, // Ensure the profile image is above other elements
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...FONTS.medium,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginTop: 24,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.body2,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.divider,
  },
  tabsContainer: {
    backgroundColor: COLORS.background,
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
    position: 'relative',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    ...FONTS.body2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  comicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  achievementsContainer: {
    paddingBottom: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.spacingSmall,
    marginBottom: 24,
  },
  createButton: {
    width: '70%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  gridContainer: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 16,
  },
  actionButtonText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  editProfileText: {
    ...FONTS.medium,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  progressContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginTop: 8,
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  comicItem: {
    width: (width - 48) / 2,
    marginBottom: 20,
  },
  comicCover: {
    width: '100%',
    height: (width - 48) / 2 * 1.5,
    borderRadius: 8,
  },
  comicInfo: {
    marginTop: 8,
  },
  comicTitle: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  comicAuthor: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginVertical: 4,
  },
  comicStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comicStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  comicStatText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  achievementItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  achievementBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  achievementDesc: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
});

// Main component
const ProfileScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  const avatarScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.8],
    extrapolate: 'clamp'
  });
  
  // Sample user data
  const userData = {
    username: 'Alex Johnson',
    handle: '@alexcreator',
    bio: 'Digital artist and comic creator. Specializing in sci-fi and fantasy worlds. Join me on my creative journey!',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    coverImage: 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    followers: 245,
    following: 132,
    comics: 4,
    isVerified: true,
    isOwnProfile: true,
    location: 'San Francisco, CA',
    website: 'alexjohnson.design',
    joinDate: 'May 2023'
  };

  // Navigation functions
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const goToSettings = () => {
    // @ts-ignore
    navigation.navigate('Settings');
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Handle interactions
  const handleComicPress = (id: string) => {
    // @ts-ignore
    navigation.navigate('ComicDetail', { id });
  };
  
  const handleAchievementPress = (id: string) => {
    // @ts-ignore
    navigation.navigate('AchievementDetail', { id });
  };
  
  const handleEditProfilePress = () => {
    // @ts-ignore
    navigation.navigate('EditProfile');
  };
  
  const handleSharePress = () => {
    // @ts-ignore
    navigation.navigate('ShareModal', { 
      type: 'profile',
      userId: 'userId',
      username: userData.username
    });
  };
  
  const handleFollowersPress = () => {
    // @ts-ignore
    navigation.navigate('FollowersList', { userId: 'userId' });
  };
  
  const handleFollowingPress = () => {
    // @ts-ignore
    navigation.navigate('FollowingList', { userId: 'userId' });
  };

  // Tab navigation
  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Tab content rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Creations':
        return SAMPLE_COMICS.length > 0 ? (
          <View style={styles.gridContainer}>
            <View style={styles.comicsGrid}>
              {SAMPLE_COMICS.map((item) => (
                <ComicItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  coverImage={item.coverImage}
                  author={item.author}
                  likes={item.likes}
                  views={item.views}
                  onPress={handleComicPress}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="notebook-plus-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>No creations yet</Text>
            <Text style={styles.emptyStateText}>Start creating your first comic</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Create Now</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'Collected':
        return SAMPLE_COMICS.length > 0 ? (
          <View style={styles.gridContainer}>
            <View style={styles.comicsGrid}>
              {SAMPLE_COMICS.map((item) => (
                <ComicItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  coverImage={item.coverImage}
                  author={item.author}
                  likes={item.likes}
                  views={item.views}
                  onPress={handleComicPress}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bookmark-multiple-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>No collected comics</Text>
            <Text style={styles.emptyStateText}>Start collecting your favorite comics</Text>
          </View>
        );
      
      case 'Achievements':
        return (
          <View style={styles.achievementsContainer}>
            {SAMPLE_ACHIEVEMENTS.map((achievement) => (
              <AchievementItem
                key={achievement.id}
                id={achievement.id}
                title={achievement.title}
                description={achievement.description}
                icon={achievement.icon}
                unlocked={achievement.unlocked}
                progress={achievement.progress}
                maxProgress={achievement.maxProgress}
                onPress={handleAchievementPress}
              />
            ))}
          </View>
        );
      
      case 'Activity':
        return (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="pulse-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>No Recent Activity</Text>
            <Text style={styles.emptyStateText}>
              Your interactions with comics, creators, and the community will appear here.
            </Text>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  // Separate tab content components to avoid nesting VirtualizedLists
  const renderCreationsTab = () => {
    if (SAMPLE_COMICS.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="notebook-plus-outline" size={60} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateTitle}>No creations yet</Text>
          <Text style={styles.emptyStateText}>Start creating your first comic</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Create Now</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return null; // We'll use FlatList directly in the main component when needed
  };
  
  const renderCollectedTab = () => {
    if (SAMPLE_COMICS.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="bookmark-multiple-outline" size={60} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateTitle}>No collected comics</Text>
          <Text style={styles.emptyStateText}>Start collecting your favorite comics</Text>
        </View>
      );
    }
    
    return null; // We'll use FlatList directly in the main component when needed
  };

  // Conditional rendering based on active tab
  if (activeTab === 'Creations' && SAMPLE_COMICS.length > 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Animated header */}
        <Animated.View 
          style={[
            styles.headerBar, 
            { 
              backgroundColor: COLORS.background,
              opacity: headerOpacity,
              height: HEADER_HEIGHT,
              paddingTop: Platform.OS === 'ios' ? 50 : 16
            }
          ]}
        >
          <TouchableOpacity style={styles.iconButton} onPress={openDrawer}>
            <Ionicons name="menu-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{userData.username}</Text>
          <TouchableOpacity style={styles.iconButton} onPress={goToSettings}>
            <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Use FlatList as the main scrollable container */}
        <FlatList
          data={SAMPLE_COMICS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContent}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListHeaderComponent={(
            <>
              {/* Cover Image */}
              <View style={styles.coverContainer}>
                <ImageBackground
                  source={{ uri: userData.coverImage }}
                  style={styles.coverImage}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.coverGradient}
                  />
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={{ uri: userData.avatar }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  </View>
                </ImageBackground>
              </View>
              
              {/* Profile Info */}
              <View style={styles.profileSection}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileInfo}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.username}>{userData.username}</Text>
                      {userData.isVerified && (
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} style={styles.verified} />
                      )}
                    </View>
                    <Text style={styles.handle}>{userData.handle}</Text>
                    <Text style={styles.bio}>{userData.bio}</Text>
                    
                    <View style={styles.metaContainer}>
                      <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                        <Text style={styles.metaText}>{userData.location}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="link-outline" size={16} color={COLORS.textSecondary} />
                        <Text style={styles.metaText}>{userData.website}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                      <Text style={styles.metaText}>Joined {userData.joinDate}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionButtonsRow}>
                  {userData.isOwnProfile ? (
                    <TouchableOpacity style={styles.primaryButton} onPress={handleEditProfilePress}>
                      <Text style={styles.primaryButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.actionButtonsContainer}>
                      <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Follow</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.secondaryButton}>
                        <Ionicons name="chatbubble-outline" size={20} color={COLORS.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  <TouchableOpacity style={styles.secondaryButton} onPress={handleSharePress}>
                    <Ionicons name="share-social-outline" size={20} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                </View>
                
                {/* Stats */}
                <View style={styles.statsRow}>
                  <TouchableOpacity style={styles.statItem}>
                    <Text style={styles.statValue}>{userData.comics}</Text>
                    <Text style={styles.statLabel}>Comics</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity style={styles.statItem} onPress={handleFollowersPress}>
                    <Text style={styles.statValue}>{userData.followers}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress}>
                    <Text style={styles.statValue}>{userData.following}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Tabs */}
                <ScrollView 
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.tabsContainer}
                  contentContainerStyle={styles.tabsScrollContent}
                >
                  {TABS.map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.tab, activeTab === tab && styles.activeTab]}
                      onPress={() => handleTabPress(tab)}
                    >
                      <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
                        {tab}
                      </Text>
                      {activeTab === tab && <View style={styles.activeTabIndicator} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <Text style={styles.sectionTitle}>Your Comics</Text>
              </View>
            </>
          )}
          renderItem={({ item }) => (
            <ComicItem
              key={item.id}
              id={item.id}
              title={item.title}
              coverImage={item.coverImage}
              author={item.author}
              likes={item.likes}
              views={item.views}
              onPress={() => handleComicPress(item.id)}
            />
          )}
        />
      </View>
    );
  } else if (activeTab === 'Collected' && SAMPLE_COMICS.length > 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Animated header */}
        <Animated.View 
          style={[
            styles.headerBar, 
            { 
              backgroundColor: COLORS.background,
              opacity: headerOpacity,
              height: HEADER_HEIGHT,
              paddingTop: Platform.OS === 'ios' ? 50 : 16
            }
          ]}
        >
          <TouchableOpacity style={styles.iconButton} onPress={openDrawer}>
            <Ionicons name="menu-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{userData.username}</Text>
          <TouchableOpacity style={styles.iconButton} onPress={goToSettings}>
            <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </Animated.View>
        
        {/* Use FlatList as the main scrollable container */}
        <FlatList
          data={SAMPLE_COMICS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.flatListContent}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListHeaderComponent={(
            <>
              {/* Cover Image */}
              <View style={styles.coverContainer}>
                <ImageBackground
                  source={{ uri: userData.coverImage }}
                  style={styles.coverImage}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.coverGradient}
                  />
                  <View style={styles.profileImageContainer}>
                    <Image
                      source={{ uri: userData.avatar }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  </View>
                </ImageBackground>
              </View>
              
              {/* Profile Info */}
              <View style={styles.profileSection}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileInfo}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.username}>{userData.username}</Text>
                      {userData.isVerified && (
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} style={styles.verified} />
                      )}
                    </View>
                    <Text style={styles.handle}>{userData.handle}</Text>
                    <Text style={styles.bio}>{userData.bio}</Text>
                    
                    <View style={styles.metaContainer}>
                      <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                        <Text style={styles.metaText}>{userData.location}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="link-outline" size={16} color={COLORS.textSecondary} />
                        <Text style={styles.metaText}>{userData.website}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                      <Text style={styles.metaText}>Joined {userData.joinDate}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Action Buttons */}
                <View style={styles.actionButtonsRow}>
                  {userData.isOwnProfile ? (
                    <TouchableOpacity style={styles.primaryButton} onPress={handleEditProfilePress}>
                      <Text style={styles.primaryButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.actionButtonsContainer}>
                      <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Follow</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.secondaryButton}>
                        <Ionicons name="chatbubble-outline" size={20} color={COLORS.textPrimary} />
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  <TouchableOpacity style={styles.secondaryButton} onPress={handleSharePress}>
                    <Ionicons name="share-social-outline" size={20} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                </View>
                
                {/* Stats */}
                <View style={styles.statsRow}>
                  <TouchableOpacity style={styles.statItem}>
                    <Text style={styles.statValue}>{userData.comics}</Text>
                    <Text style={styles.statLabel}>Comics</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity style={styles.statItem} onPress={handleFollowersPress}>
                    <Text style={styles.statValue}>{userData.followers}</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.divider} />
                  
                  <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress}>
                    <Text style={styles.statValue}>{userData.following}</Text>
                    <Text style={styles.statLabel}>Following</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Tabs */}
                <ScrollView 
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.tabsContainer}
                  contentContainerStyle={styles.tabsScrollContent}
                >
                  {TABS.map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.tab, activeTab === tab && styles.activeTab]}
                      onPress={() => handleTabPress(tab)}
                    >
                      <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
                        {tab}
                      </Text>
                      {activeTab === tab && <View style={styles.activeTabIndicator} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <Text style={styles.sectionTitle}>Collected Comics</Text>
              </View>
            </>
          )}
          renderItem={({ item }) => (
            <ComicItem
              key={item.id}
              id={item.id}
              title={item.title}
              coverImage={item.coverImage}
              author={item.author}
              likes={item.likes}
              views={item.views}
              onPress={() => handleComicPress(item.id)}
            />
          )}
        />
      </View>
    );
  }
  
  // Default rendering for other tabs
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated header */}
      <Animated.View 
        style={[
          styles.headerBar, 
          { 
            backgroundColor: COLORS.background,
            opacity: headerOpacity,
            height: HEADER_HEIGHT,
            paddingTop: Platform.OS === 'ios' ? 50 : 16
          }
        ]}
      >
        <TouchableOpacity style={styles.iconButton} onPress={openDrawer}>
          <Ionicons name="menu-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userData.username}</Text>
        <TouchableOpacity style={styles.iconButton} onPress={goToSettings}>
          <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </Animated.View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <ImageBackground
            source={{ uri: userData.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.coverGradient}
            />
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: userData.avatar }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
          </ImageBackground>
        </View>
        
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.username}>{userData.username}</Text>
                {userData.isVerified && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} style={styles.verified} />
                )}
              </View>
              <Text style={styles.handle}>{userData.handle}</Text>
              <Text style={styles.bio}>{userData.bio}</Text>
              
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.metaText}>{userData.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="link-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.metaText}>{userData.website}</Text>
                </View>
              </View>
              
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.metaText}>Joined {userData.joinDate}</Text>
              </View>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            {userData.isOwnProfile ? (
              <TouchableOpacity style={styles.primaryButton} onPress={handleEditProfilePress}>
                <Text style={styles.primaryButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Follow</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Ionicons name="chatbubble-outline" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            )}
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSharePress}>
              <Ionicons name="share-social-outline" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          
          {/* Stats */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statValue}>{userData.comics}</Text>
              <Text style={styles.statLabel}>Comics</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.statItem} onPress={handleFollowersPress}>
              <Text style={styles.statValue}>{userData.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress}>
              <Text style={styles.statValue}>{userData.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>
          
          {/* Tabs */}
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => handleTabPress(tab)}
              >
                <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Tab Content */}
          <View style={styles.tabContent}>
            {renderTabContent()}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
