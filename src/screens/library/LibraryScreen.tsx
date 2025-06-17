import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Modal,
  Animated as RNAnimated,
  PanResponder,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../components/common/Logo';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Constants
const COLORS = { black: '#000', white: '#fff', text: '#fff', accent: '#ff4081', gray: '#bbb', darkGray: '#222', lightGray: '#333', background: '#121212' };
const SIZES = { padding: 16, borderRadius: 12 };

// Types
interface Comic {
  id: string;
  title: string;
  creator: string;
  cover: { uri: string };
  likes: number;
  stars: number;
  profilePic: string;
  genre: string;
}

// Mock Data
const comicsData: Comic[] = [
  { id: '1', title: 'Quantum Detectives', creator: 'quantum_ink', cover: { uri: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?auto=format&fit=crop&w=800&q=80' }, likes: 1245, stars: 300, profilePic: 'https://randomuser.me/api/portraits/men/11.jpg', genre: 'Mystery' },
  { id: '2', title: 'Neon Dreams', creator: 'neon_artist', cover: { uri: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?auto=format&fit=crop&w=800&q=80' }, likes: 2103, stars: 540, profilePic: 'https://randomuser.me/api/portraits/women/12.jpg', genre: 'Sci-Fi' },
  { id: '3', title: 'Galactic Odyssey', creator: 'star_writer', cover: { uri: 'https://images.unsplash.com/photo-1581822261290-991b38693d16?auto=format&fit=crop&w=800&q=80' }, likes: 1023, stars: 210, profilePic: 'https://randomuser.me/api/portraits/men/13.jpg', genre: 'Adventure' },
  { id: '4', title: 'Cybernetic Souls', creator: 'cyborg_dreams', cover: { uri: 'https://images.unsplash.com/photo-1593349328229-11c8a1435a2a?auto=format&fit=crop&w=800&q=80' }, likes: 5600, stars: 1200, profilePic: 'https://randomuser.me/api/portraits/women/14.jpg', genre: 'Sci-Fi' },
  { id: '5', title: 'Forgotten Realms', creator: 'ancient_scribes', cover: { uri: 'https://images.unsplash.com/photo-1542848329-42523415536d?auto=format&fit=crop&w=800&q=80' }, likes: 3210, stars: 800, profilePic: 'https://randomuser.me/api/portraits/men/15.jpg', genre: 'Fantasy' },
  { id: '6', title: 'Midnight Gospel', creator: 'cosmic_thinker', cover: { uri: 'https://images.unsplash.com/photo-1614728263952-84ea256ec346?auto=format&fit=crop&w=800&q=80' }, likes: 4800, stars: 950, profilePic: 'https://randomuser.me/api/portraits/women/16.jpg', genre: 'Supernatural' },
  { id: '7', title: 'Solar Flare', creator: 'sun_artist', cover: { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }, likes: 1670, stars: 420, profilePic: 'https://randomuser.me/api/portraits/men/17.jpg', genre: 'Action' },
  { id: '8', title: 'Night Watchers', creator: 'owl_writer', cover: { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' }, likes: 1890, stars: 510, profilePic: 'https://randomuser.me/api/portraits/women/18.jpg', genre: 'Crime' },
  { id: '9', title: 'Mystic Forest', creator: 'forest_queen', cover: { uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80' }, likes: 990, stars: 180, profilePic: 'https://randomuser.me/api/portraits/men/19.jpg', genre: 'Fantasy' },
  { id: '10', title: 'Red Horizon', creator: 'horizon_artist', cover: { uri: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80' }, likes: 2201, stars: 600, profilePic: 'https://randomuser.me/api/portraits/women/20.jpg', genre: 'Thriller' },
  { id: '11', title: 'Dragon’s Path', creator: 'dragon_scribe', cover: { uri: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80' }, likes: 1333, stars: 350, profilePic: 'https://randomuser.me/api/portraits/men/21.jpg', genre: 'Adventure' },
  { id: '12', title: 'Blue City', creator: 'urban_artist', cover: { uri: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=800&q=80' }, likes: 1782, stars: 490, profilePic: 'https://randomuser.me/api/portraits/women/22.jpg', genre: 'Crime' },
  { id: '13', title: 'Parallel Lines', creator: 'line_master', cover: { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' }, likes: 1422, stars: 330, profilePic: 'https://randomuser.me/api/portraits/men/23.jpg', genre: 'Drama' },
  { id: '14', title: 'Lost in Neon', creator: 'neon_queen', cover: { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' }, likes: 1999, stars: 590, profilePic: 'https://randomuser.me/api/portraits/women/24.jpg', genre: 'Thriller' },
  { id: '15', title: 'Desert Mirage', creator: 'mirage_artist', cover: { uri: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80' }, likes: 1545, stars: 410, profilePic: 'https://randomuser.me/api/portraits/men/25.jpg', genre: 'Slice of Life' },
  { id: '16', title: 'Skybound', creator: 'sky_writer', cover: { uri: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=800&q=80' }, likes: 2100, stars: 570, profilePic: 'https://randomuser.me/api/portraits/women/26.jpg', genre: 'Drama' },
  { id: '17', title: 'Jungle Beat', creator: 'beat_master', cover: { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }, likes: 1320, stars: 320, profilePic: 'https://randomuser.me/api/portraits/men/27.jpg', genre: 'Comedy' },
  { id: '18', title: 'Frozen Dawn', creator: 'ice_artist', cover: { uri: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80' }, likes: 1888, stars: 490, profilePic: 'https://randomuser.me/api/portraits/women/28.jpg', genre: 'Horror' },
];

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

const LibraryScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [previewComic, setPreviewComic] = useState<Comic | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const genres = [
    'All', 'Mystery', 'Crime', 'Thriller', 'Comedy', 'Fantasy', 'Romance', 'Sci-Fi', 'Drama', 'Action', 'Slice of Life', 'Adventure', 'Horror', 'Supernatural',
  ];

  const filteredComics = useMemo(() => {
    let filtered = comicsData;
    if (selectedGenre) {
      filtered = filtered.filter(comic => (comic.genre || '').toLowerCase() === selectedGenre.toLowerCase());
    }
    if (searchQuery) {
      filtered = filtered.filter(comic => comic.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [searchQuery, selectedGenre]);



    const handlePreviewIn = (comic: Comic) => {
    setPreviewComic(comic);
    setShowPreview(true);
  };
  const handlePreviewOut = () => {
    setShowPreview(false);
    setPreviewComic(null);
  };

  const renderComic = ({ item }: { item: Comic }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => navigation.navigate('ComicReader', { comicId: item.id })}
      onPressIn={() => handlePreviewIn(item)}
      onPressOut={handlePreviewOut}
      activeOpacity={0.85}
    >
      <Image source={item.cover} style={styles.gridImage} />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoButton} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Logo size={32} />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Library..."
              placeholderTextColor={COLORS.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Genre Tags Row */}
        <View style={styles.genreTagsContainer}>
          <FlatList
            data={genres}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.genreTag, selectedGenre === item || (item === 'All' && !selectedGenre) ? styles.genreTagSelected : null]}
                onPress={() => setSelectedGenre(item === 'All' ? null : item)}
              >
                <Text style={[styles.genreTagText, selectedGenre === item || (item === 'All' && !selectedGenre) ? styles.genreTagTextSelected : null]}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genreTagsList}
          />
        </View>

        <FlatList
          data={filteredComics}
          renderItem={renderComic}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
        />
      </View>

      {/* Floating Preview Overlay */}
      {showPreview && previewComic && (
        <View style={styles.previewOverlay} pointerEvents="box-none">
          <View style={styles.previewCenterBox} pointerEvents="none">
            {/* Top: Avatar and Creator */}
            <View style={styles.previewTopRow}>
              <Image source={{ uri: previewComic.profilePic }} style={styles.previewAvatar} />
              <Text style={styles.previewCreatorName}>{previewComic.creator}</Text>
            </View>
            {/* Comic Cover */}
            <Image source={previewComic.cover} style={styles.previewCover} />
            {/* Bottom: Actions */}
            <View style={styles.previewActionsRow}>
              <View style={styles.previewStat}><Ionicons name="heart" size={20} color={COLORS.accent} /><Text style={styles.previewStatText}>{previewComic.likes}</Text></View>
              <TouchableOpacity style={styles.previewActionBtn}><Ionicons name="person" size={20} color={COLORS.white} /><Text style={styles.previewActionText}>View Profile</Text></TouchableOpacity>
              <TouchableOpacity style={styles.previewActionBtn}><Ionicons name="share-social-outline" size={20} color={COLORS.white} /><Text style={styles.previewActionText}>Share</Text></TouchableOpacity>
              <TouchableOpacity style={styles.previewActionBtn}><Ionicons name="bookmark-outline" size={20} color={COLORS.white} /><Text style={styles.previewActionText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 10 : 50,
    paddingBottom: 10,
    backgroundColor: COLORS.darkGray,
  },
  logoButton: {
    padding: 5,
  },
  logoImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
  },
  gridContainer: {
    paddingHorizontal: 0,
    paddingTop: SIZES.padding,
  },
  gridItem: {
    flex: 1,
    margin: 2,
    maxWidth: '50%',
    alignItems: 'stretch',
    aspectRatio: 0.7,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  // Genre tags styles
  genreTagsContainer: {
    marginTop: 10,
    marginBottom: 8,
    paddingLeft: SIZES.padding,
  },
  genreTagsList: {
    paddingRight: SIZES.padding,
  },
  genreTag: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginRight: 10,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genreTagSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  genreTagText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '500',
  },
  genreTagTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  // Floating preview overlay styles
  previewOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  previewCenterBox: {
    backgroundColor: 'rgba(20,20,20,0.93)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 22,
    elevation: 16,
    minWidth: 220,
  },
  previewCover: {
    width: 160,
    height: 230,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: COLORS.gray,
    alignSelf: 'center',
  },
  previewInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginBottom: 8,
  },
  previewStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  previewStatText: {
    color: COLORS.white,
    marginLeft: 4,
    fontSize: 15,
    fontWeight: '600',
  },
  // Overlay Top Row (avatar + name)
  previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  previewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: '#333',
  },
  previewCreatorName: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  // Overlay Bottom Action Row
  previewActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    gap: 4,
  },
  previewActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  previewActionText: {
    color: COLORS.white,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  // Modal styles
  largeCoverImage: {
    width: 180,
    height: 260,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 18,
    marginTop: 16,
    backgroundColor: COLORS.gray,
  },
  creatorPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    gap: 10,
  },
  creatorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 8,
    backgroundColor: COLORS.gray,
  },
  creatorName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  profileButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  profileButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  comicInfoPanel: {
    alignItems: 'center',
    marginBottom: 10,
  },
  comicTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: 'bold',
  },
  chapterText: {
    color: COLORS.gray,
    fontSize: 15,
    marginTop: 2,
  },
  actionPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  actionText: {
    color: COLORS.white,
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '500',
  },
  textContainer: {
    paddingTop: 10,
  },
  // Removed old comicTitle style to resolve duplicate key error.
  comicCreator: {
    color: COLORS.gray,
    fontSize: 12,
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  popupPanel: {
    backgroundColor: COLORS.darkGray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: 300,
  },
  panelContent: {
    alignItems: 'center',
  },
  panelTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  panelCreator: {
    color: COLORS.gray,
    fontSize: 16,
    marginBottom: 15,
  },
  panelStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: COLORS.white,
    marginLeft: 5,
  },
  readButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  readButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LibraryScreen;
