import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../components/common/Logo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

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
const userPosts = Array.from({ length: 23 }, (_, i) => ({
  id: `post-${i + 1}`,
  username: user.username,
  avatar: user.avatar,
  caption: `This is a beautiful shot! #${i % 2 === 0 ? 'Nature' : 'Art'} #${i % 3 === 0 ? 'Photography' : 'Creative'} `,
  tags: i % 2 === 0 ? ['Nature', 'Photography'] : ['Art', 'Creative'],
  comments: Math.floor(Math.random() * 200),
  likes: Math.floor(Math.random() * 5000),
  timestamp: `${i + 1}h ago`,
  isLiked: i % 3 === 0,
  isBookmarked: i % 4 === 0,
  imageUrl: `https://picsum.photos/seed/${i + 10}/500/500`,
}));

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('Creations');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={openDrawer} style={styles.headerLogo}>
        <Logo size={32} />
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
        style={[styles.tab, activeTab === 'Creations' && styles.activeTab]}
        onPress={() => setActiveTab('Creations')}>
        <Ionicons name="grid" size={24} color={activeTab === 'Creations' ? COLORS.primary : COLORS.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Collected' && styles.activeTab]}
        onPress={() => setActiveTab('Collected')}>
        <Ionicons name="bookmark" size={24} color={activeTab === 'Collected' ? COLORS.primary : COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderCreationsGrid = () => (
    <FlatList
      data={userPosts}
      keyExtractor={(item) => item.id}
      numColumns={3}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.postItem}
          onPress={() => navigation.navigate('PostDetailScreen', { post: item })}
        >
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        </TouchableOpacity>
      )}
      scrollEnabled={false} // The parent ScrollView will handle scrolling
    />
  );
  
  const renderCollected = () => (
    <View style={styles.emptyTabContainer}>
        <Text style={styles.emptyTabText}>Your collected items will appear here.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {renderHeader()}
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProfileInfo()}
        {renderCreatorTools()}
        {renderTabs()}
        {activeTab === 'Creations' ? renderCreationsGrid() : renderCollected()}
      </ScrollView>
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
