import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../../components/common/Logo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Post } from '../../constants/types';

// Mock user data
const user = {
  name: 'Jane Doe',
  username: '@jane.doe',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  bio: 'Digital artist and storyteller. Creating worlds one comic at a time. Founder of #ArtWarriors. 🎨✨',
  stats: {
    creations: 23,
    followers: '15.7k',
    following: '1.2k',
  },
};

// Mock posts data for the grid
const userPosts: Post[] = Array.from({ length: 23 }, (_, i) => {
  const commentCount = Math.floor(Math.random() * 5);
  return {
    id: `post-${i + 1}`,
    username: user.username,
    avatar: user.avatar,
    caption: `This is a beautiful shot! #${i % 2 === 0 ? 'Nature' : 'Art'} #${i % 3 === 0 ? 'Photography' : 'Creative'} `,
    tags: i % 2 === 0 ? ['Nature', 'Photography'] : ['Art', 'Creative'],
    comments: commentCount,
    commentData: Array.from({ length: commentCount }, (__, j) => ({
      id: `p${i}-c${j}`,
      user: `Commenter${j}`,
      avatar: `https://randomuser.me/api/portraits/men/${j}.jpg`,
      note: `This is a great comment, number ${j}`,
      time: `${j * 2}m ago`,
      likes: Math.floor(Math.random() * 100),
      replies: [],
    })),
    likes: Math.floor(Math.random() * 5000),
    timestamp: `${i + 1}h ago`,
    isLiked: i % 3 === 0,
    isBookmarked: i % 4 === 0,
    imageUrl: `https://picsum.photos/seed/${i + 10}/500/500`,
  };
});

const ProfileScreen = () => {
  const navigation = useNavigation<any>();

  const TABS = {
    COMICS: 'Comics',
    VIDEOS: 'Videos',
    IDEAS: 'Ideas',
  };
  const [activeTab, setActiveTab] = useState(TABS.COMICS);

  // Mock data for other tabs - replace with real data later
  const videoPosts: Post[] = [];
  const ideaPosts: Post[] = [];

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={openDrawer} style={styles.headerLogo}>
        <Logo size={36} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{user.username}</Text>
      <TouchableOpacity onPress={navigateToSettings}>
        <Ionicons name="menu-outline" size={30} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderProfileInfo = () => (
    <View style={styles.profileInfoContainer}>
      <View style={styles.profileDetails}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.creations}</Text>
            <Text style={styles.statLabel}>Creations</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>
      <View style={styles.bioContainer}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
      </View>
    </View>
  );

  const renderCreatorTools = () => (
    <View style={styles.creatorToolsContainer}>
      <TouchableOpacity
        style={styles.creatorToolsButton}
        onPress={() => navigation.navigate('CreatorDashboard')}
      >
        <Text style={styles.creatorToolsButtonText}>Creator Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Share Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === TABS.COMICS && styles.activeTab]}
        onPress={() => setActiveTab(TABS.COMICS)}>
        <Ionicons name="book-outline" size={24} color={activeTab === TABS.COMICS ? COLORS.primary : COLORS.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === TABS.VIDEOS && styles.activeTab]}
        onPress={() => setActiveTab(TABS.VIDEOS)}>
        <Ionicons name="videocam-outline" size={24} color={activeTab === TABS.VIDEOS ? COLORS.primary : COLORS.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === TABS.IDEAS && styles.activeTab]}
        onPress={() => setActiveTab(TABS.IDEAS)}>
        <Ionicons name="bulb-outline" size={24} color={activeTab === TABS.IDEAS ? COLORS.primary : COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const ListHeader = () => (
    <>
      {renderProfileInfo()}
      {renderCreatorTools()}
      {renderTabs()}
    </>
  );

  const getActiveTabData = () => {
    switch (activeTab) {
      case TABS.COMICS:
        return userPosts;
      case TABS.VIDEOS:
        return videoPosts;
      case TABS.IDEAS:
        return ideaPosts;
      default:
        return [];
    }
  };

  const renderEmptyList = () => (
    <View style={styles.emptyTabContainer}>
      <Text style={styles.emptyTabText}>No {activeTab.toLowerCase()} yet. This is a great place to add some!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {renderHeader()}
      <FlatList
        key={activeTab} // Ensures re-render on tab change
        data={getActiveTabData()}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.postItem}
            onPress={() => {
              // This navigates to a new screen that should display a scrollable feed.
              // This 'PostFeed' screen needs to be created in your navigation.
              // It should accept 'posts' and 'startIndex' as params.
              navigation.navigate('PostFeed', {
                posts: userPosts,
                startIndex: index,
              });
            }}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const postSize = width / 3;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.medium, paddingVertical: SIZES.small },
  headerLogo: { padding: SIZES.small },
  headerTitle: { ...FONTS.h3, color: COLORS.textPrimary },
  profileInfoContainer: { paddingHorizontal: SIZES.medium, marginTop: SIZES.small },
  profileDetails: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: COLORS.surface },
  statsContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { ...FONTS.h3, color: COLORS.textPrimary },
  statLabel: { ...FONTS.body3, color: COLORS.textSecondary },
  bioContainer: { marginTop: SIZES.small },
  name: { ...FONTS.h4, color: COLORS.textPrimary },
  bio: { ...FONTS.body3, color: COLORS.textSecondary, marginTop: 4 },
  creatorToolsContainer: { flexDirection: 'row', paddingHorizontal: SIZES.medium, marginTop: SIZES.medium },
  creatorToolsButton: { flex: 1, backgroundColor: COLORS.primary, paddingVertical: SIZES.small, borderRadius: SIZES.radiusMedium, alignItems: 'center', marginRight: SIZES.small },
  creatorToolsButtonText: { ...FONTS.button, color: COLORS.textPrimary },
  secondaryButton: { flex: 1, backgroundColor: COLORS.surface, paddingVertical: SIZES.small, borderRadius: SIZES.radiusMedium, alignItems: 'center', marginLeft: SIZES.small },
  secondaryButtonText: { ...FONTS.button, color: COLORS.textPrimary },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.surface, marginTop: SIZES.large },
  tab: { flex: 1, alignItems: 'center', paddingVertical: SIZES.small },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  postItem: { width: postSize, height: postSize },
  postImage: { width: '100%', height: '100%' },
  emptyTabContainer: { height: 200, alignItems: 'center', justifyContent: 'center' },
  emptyTabText: { ...FONTS.body3, color: COLORS.textSecondary },
});

export default ProfileScreen;
