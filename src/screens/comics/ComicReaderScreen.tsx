import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

// Sample comic pages data - in a real app, this would come from an API
const SAMPLE_COMIC_PAGES = [
  {
    id: '1',
    pageNumber: 1,
    image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29taWN8ZW58MHx8MHx8&w=400&q=80',
  },
  {
    id: '2',
    pageNumber: 2,
    image: 'https://images.unsplash.com/photo-1623018035782-b269248df916?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZHJhd2luZ3xlbnwwfHwwfHw%3D&w=400&q=80',
  },
  {
    id: '3',
    pageNumber: 3,
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhY2UlMjBhcnR8ZW58MHx8MHx8&w=400&q=80',
  },
  {
    id: '4',
    pageNumber: 4,
    image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmVvbiUyMGNpdHl8ZW58MHx8MHx8&w=400&q=80',
  },
  {
    id: '5',
    pageNumber: 5,
    image: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29taWN8ZW58MHx8MHx8&w=400&q=80',
  },
];

// Sample comic data
const SAMPLE_COMICS: Record<string, { id: string; title: string; author: string; totalPages: number }> = {
  '1': {
    id: '1',
    title: 'Cyber Knights',
    author: 'Alex Johnson',
    totalPages: 5,
  },
  '2': {
    id: '2',
    title: 'Enchanted Forest',
    author: 'Alex Johnson',
    totalPages: 5,
  },
  '3': {
    id: '3',
    title: 'Space Odyssey',
    author: 'Alex Johnson',
    totalPages: 5,
  },
  '4': {
    id: '4',
    title: 'Neon City',
    author: 'Alex Johnson',
    totalPages: 5,
  },
};

const ComicReaderScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ComicReader'>>();
  const { comicId } = route.params as { comicId: string };
  
  // Find the comic with the matching id
  const comic = SAMPLE_COMICS[comicId] || SAMPLE_COMICS['1'];
  
  const [currentPage, setCurrentPage] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Toggle controls visibility
  const toggleControls = () => {
    if (controlsVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    
    setControlsVisible(!controlsVisible);
  };
  
  // Handle page change
  const handlePageChange = (index: number) => {
    setCurrentPage(index + 1);
  };
  
  // Navigate to next page
  const goToNextPage = () => {
    if (currentPage < comic.totalPages) {
      flatListRef.current?.scrollToIndex({
        index: currentPage,
        animated: true,
      });
    }
  };
  
  // Navigate to previous page
  const goToPrevPage = () => {
    if (currentPage > 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPage - 2,
        animated: true,
      });
    }
  };
  
  // Render comic page
  const renderPage = ({ item }: { item: typeof SAMPLE_COMIC_PAGES[0] }) => {
    return (
      <TouchableOpacity
        style={styles.pageContainer}
        activeOpacity={1}
        onPress={toggleControls}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.pageImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Comic Pages */}
      <FlatList
        ref={flatListRef}
        data={SAMPLE_COMIC_PAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.floor(e.nativeEvent.contentOffset.x / width);
          handlePageChange(index);
        }}
      />
      
      {/* Header Controls */}
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim },
          { transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 0]
          }) }] }
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{comic.title}</Text>
          <Text style={styles.author}>by {comic.author}</Text>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Footer Controls */}
      <Animated.View
        style={[
          styles.footer,
          { opacity: fadeAnim },
          { transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0]
          }) }] }
        ]}
      >
        <TouchableOpacity
          style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
          onPress={goToPrevPage}
          disabled={currentPage === 1}
        >
          <Ionicons name="chevron-back" size={24} color={currentPage === 1 ? COLORS.textDisabled : COLORS.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.pageInfo}>
          <Text style={styles.pageText}>
            Page {currentPage} of {comic.totalPages}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.navButton, currentPage === comic.totalPages && styles.disabledButton]}
          onPress={goToNextPage}
          disabled={currentPage === comic.totalPages}
        >
          <Ionicons name="chevron-forward" size={24} color={currentPage === comic.totalPages ? COLORS.textDisabled : COLORS.textPrimary} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pageContainer: {
    width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageImage: {
    width: '100%',
    height: '100%',
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
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  author: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageInfo: {
    flex: 1,
    alignItems: 'center',
  },
  pageText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
});

export default ComicReaderScreen;
