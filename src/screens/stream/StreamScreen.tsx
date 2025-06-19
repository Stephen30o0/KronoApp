import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Logo from '../../components/common/Logo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

const { width, height } = Dimensions.get('window');

// --- Mock Data ---
const featuredStream = {
  id: 'feat1',
  title: 'Krono Original: The Last Stand',
  coverImage: `https://picsum.photos/seed/feature/600/400`,
  trailerUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
  tags: ['Action', 'Sci-Fi', 'Thriller'],
};

const streamCategories = [
  {
    id: 'cat1',
    title: 'Trending Now',
    streams: Array.from({ length: 8 }, (_, i) => ({
      id: `s1-${i}`,
      poster: `https://picsum.photos/seed/trending${i}/200/300`,
    })),
  },
  {
    id: 'cat2',
    title: 'New Releases',
    streams: Array.from({ length: 8 }, (_, i) => ({
      id: `s2-${i}`,
      poster: `https://picsum.photos/seed/new${i}/200/300`,
    })),
  },
  {
    id: 'cat3',
    title: 'Sci-Fi Adventures',
    streams: Array.from({ length: 8 }, (_, i) => ({
      id: `s3-${i}`,
      poster: `https://picsum.photos/seed/scifi${i}/200/300`,
    })),
  },
  {
    id: 'cat4',
    title: 'Critically Acclaimed',
    streams: Array.from({ length: 8 }, (_, i) => ({
      id: `s4-${i}`,
      poster: `https://picsum.photos/seed/acclaimed${i}/200/300`,
    })),
  },
];

const filterTabs = [
  { id: 'all', title: 'All' },
  { id: 'short-films', title: 'Short Films' },
  { id: 'animations', title: 'Animations' },
  { id: 'series', title: 'Series' },
  { id: 'documentaries', title: 'Documentaries' },
];

// --- Type Definitions ---
interface StreamItem {
    id: string;
    poster: string;
}

interface Category {
    id: string;
    title: string;
    streams: StreamItem[];
}

// --- Main Component ---
const StreamScreen = () => {
  const videoRef = useRef<Video>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(filterTabs[0].id);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handlePlay = (title: string) => console.log(`Playing: ${title}`);
  const handleAddToMyList = (title: string) => console.log(`Added to My List: ${title}`);
  const handleSelectStream = (id: string) => {
    navigation.navigate('Details', { streamId: id });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={openDrawer} style={styles.headerButton}>
        <Logo size={36} />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search films, animations..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('GoLive')} style={styles.iconButton}>
          <Ionicons name="videocam-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.iconButton}>
          <Ionicons name="time-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Notifications pressed')} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
    </View>
  );

  const renderFeaturedContent = () => (
    <View style={styles.featuredContainer}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: featuredStream.trailerUrl }}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
        isMuted
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)', COLORS.background]}
        style={styles.featuredOverlay}
      >
        <Text style={styles.featuredTitle}>{featuredStream.title}</Text>
        <Text style={styles.featuredTags}>{featuredStream.tags.join(' • ')}</Text>
        <View style={styles.featuredActions}>
          <TouchableOpacity style={styles.playButton} onPress={() => handlePlay(featuredStream.title)}>
            <Ionicons name="play" size={20} color={COLORS.background} />
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.myListButton} onPress={() => handleAddToMyList(featuredStream.title)}>
            <Ionicons name="add" size={24} color={COLORS.textPrimary} />
            <Text style={styles.myListButtonText}>My List</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderFilterTabs = () => (
    <View style={styles.filterTabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filterTabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.filterTab, activeTab === tab.id && styles.activeFilterTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.filterTabText, activeTab === tab.id && styles.activeFilterTabText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStreamItem = ({ item }: { item: StreamItem }) => (
    <TouchableOpacity style={styles.streamItem} onPress={() => handleSelectStream(item.id)}>
      <Image source={{ uri: item.poster }} style={styles.streamPoster} />
    </TouchableOpacity>
  );

  const renderCategoryRow = ({ item }: { item: Category }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.title}</Text>
      <FlatList
        data={item.streams}
        renderItem={renderStreamItem}
        keyExtractor={(stream) => stream.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {renderHeader()}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderFeaturedContent()}
          {renderFilterTabs()}
          {
            streamCategories.map(category => (
                <View key={category.id}>
                    {renderCategoryRow({item: category as Category})}
                </View>
            ))
          }
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    padding: 12,
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
    marginRight: SIZES.base,
  },
  searchInput: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.textPrimary,
    height: 40,
  },
  iconButton: {
    padding: 8,
  },
  filterTabsContainer: {
    marginTop: SIZES.base,
    paddingHorizontal: SIZES.base,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 10,
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  activeFilterTabText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  featuredContainer: {
    width: width,
    height: height * 0.6,
    justifyContent: 'flex-end',
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  featuredOverlay: {
    padding: SIZES.large,
  },
  featuredTitle: {
    ...FONTS.h1, // Using h1 as largeTitle is not available
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  featuredTags: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  featuredActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.textPrimary, // White
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: SIZES.radiusSmall,
    alignItems: 'center',
    marginRight: 16,
  },
  playButtonText: {
    ...FONTS.h4,
    color: COLORS.background, // Black
    marginLeft: 8,
  },
  myListButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(70, 70, 70, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: SIZES.radiusSmall,
    alignItems: 'center',
  },
  myListButtonText: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  categoryContainer: {
    marginTop: SIZES.large,
  },
  categoryTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginLeft: SIZES.base,
    marginBottom: SIZES.base,
  },
  categoryList: {
    paddingLeft: SIZES.base,
  },
  streamItem: {
    marginRight: SIZES.base,
  },
  streamPoster: {
    width: 140,
    height: 210,
    borderRadius: SIZES.radiusMedium,
    backgroundColor: COLORS.surface,
  },
});

export default StreamScreen;
