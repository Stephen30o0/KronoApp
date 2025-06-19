import React, { useState, useRef, useEffect } from 'react';
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
import LockedNotification from '../../components/common/LockedNotification';
import CommentsPopup, { Comment } from '../../components/common/CommentsPopup';

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

const AUTO_HIDE_DELAY = 2000; // ms

const ComicReaderScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ComicReader'>>();
  const { comicId } = route.params as { comicId: string };

  // Find the comic with the matching id
  const comic = SAMPLE_COMICS[comicId] || SAMPLE_COMICS['1'];

  const [currentPage, setCurrentPage] = useState(1);
  // --- FAB and overlay state (NEW logic only) ---
  const [fabRingVisible, setFabRingVisible] = useState(true); // controls donut ring
  const [fabActionBarVisible, setFabActionBarVisible] = useState(false); // controls horizontal action bar
  const [chapterModalVisible, setChapterModalVisible] = useState(false); // controls chapter modal
  const chapterModalAnim = useRef(new Animated.Value(0)).current;
  const fabChapterTimeout = useRef<number | null>(null);
  // Fix: Declare fabActionBarTimeout
  const fabActionBarTimeout = useRef<number | null>(null);

  // Example counts for demo
  const [likeCount, setLikeCount] = useState(12);
  const [commentCount, setCommentCount] = useState(4);
  const [shareCount, setShareCount] = useState(2);
  const [saveCount, setSaveCount] = useState(7);
  const [following, setFollowing] = useState(false);
  // Comments chatbox state
  const [commentsPopupVisible, setCommentsPopupVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
        id: 'c1',
        user: 'Jane',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        note: 'Amazing art! 😍',
        time: '2m',
        likes: 12,
        replies: [
            {
                id: 'c1-1',
                user: 'Alex',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                note: 'Agreed!',
                time: '1m',
                likes: 2,
                replies: [],
            },
        ],
    },
    {
        id: 'c2',
        user: 'Ali',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        note: 'Love this page!',
        time: '5m',
        likes: 5,
        replies: [],
    },
    {
        id: 'c3',
        user: 'Sam',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        note: 'Can’t wait for the next chapter!',
        time: '12m',
        likes: 8,
        replies: [],
    },
]);
  // Padlock notification state
  const [notifVisible, setNotifVisible] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');

  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Show overlay (page number + ring) on tap-out
  // Overlay visibility state: true = show FABs+counter, false = only show counter, null = show nothing
  const [overlaysVisible, setOverlaysVisible] = useState(true);

  const handleReaderTap = () => {
    if (overlaysVisible === false) {
      // Bring back FABs and counter
      setOverlaysVisible(true);
      setFabRingVisible(true);
      setFabActionBarVisible(false);
      setChapterModalVisible(false);
    } else {
      // Hide all overlays
      setOverlaysVisible(false);
      setFabRingVisible(false);
      setFabActionBarVisible(false);
      setChapterModalVisible(false);
    }
    if (fabActionBarTimeout.current) clearTimeout(fabActionBarTimeout.current);
    if (fabChapterTimeout.current) clearTimeout(fabChapterTimeout.current);
  };

  // On page swipe, only show page counter
  const handlePageSwipe = (pageIdx: number) => {
    setCurrentPage(pageIdx + 1);
    setOverlaysVisible(false); // Hide FABs, show only counter
    setFabRingVisible(false);
    setFabActionBarVisible(false);
    setChapterModalVisible(false);
    if (fabActionBarTimeout.current) clearTimeout(fabActionBarTimeout.current);
    if (fabChapterTimeout.current) clearTimeout(fabChapterTimeout.current);
  };

  // When donut ring is tapped, show action bar and hide overlay/page number
  const handleFABOpen = () => {
    console.log('FAB ring tapped: opening action bar');
    setFabActionBarVisible(true);
    setFabRingVisible(false);
    // Auto-hide after 20 seconds
    if (fabActionBarTimeout.current) clearTimeout(fabActionBarTimeout.current);
    fabActionBarTimeout.current = setTimeout(() => {
      setFabActionBarVisible(false);
      setFabRingVisible(true);
    }, 20000);
  };

  // Close action bar (by tap out or after timeout)
  const handleFABClose = () => {
    setFabActionBarVisible(false);
    setFabRingVisible(true);
    if (fabActionBarTimeout.current) clearTimeout(fabActionBarTimeout.current);
  };

  // Handle page change
  const handlePageChange = (index: number): void => {
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
        onPress={handleReaderTap}
      >
        <Animated.Image
          source={{ uri: item.image }}
          style={[styles.pageImage, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  // Animate page transition
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.7, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [currentPage]);

  // FABMenu component
  const FABMenu = ({
    visible,
    actionBarVisible,
    onOpen,
    onClose,
    onLike,
    onComment,
    onShare,
    onSave,
    onCreator,
    onLock,
    following,
    likeCount,
    commentCount,
    shareCount,
    saveCount,
  }: {
    visible: boolean;
    actionBarVisible: boolean;
    onOpen: () => void;
    onClose: () => void;
    onLike: () => void;
    onComment: () => void;
    onShare: () => void;
    onSave: () => void;
    onCreator: () => void;
    onLock: () => void;
    following: boolean;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    saveCount: number;
  }) => {
    // Use actionBarVisible from parent scope
    const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: actionBarVisible ? 1 : 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }, [actionBarVisible]);

    const buttons = [
      {
        icon: <Ionicons name="heart-outline" size={22} color="#fff" />, label: likeCount, onPress: onLike, bg: '#A259FF',
      },
      {
        icon: <Ionicons name="chatbubble-ellipses-outline" size={22} color="#fff" />, label: commentCount, onPress: onComment, bg: '#5B8DEF',
      },
      {
        icon: <Ionicons name="share-social-outline" size={22} color="#fff" />, label: shareCount, onPress: onShare, bg: '#43C6AC',
      },
      {
        icon: <Ionicons name="bookmark-outline" size={22} color="#fff" />, label: saveCount, onPress: onSave, bg: '#F7971E',
      },
      {
        icon: <Ionicons name="person-circle-outline" size={28} color="#fff" />, label: '', onPress: onCreator, bg: '#7F53AC',
      },
      {
        icon: <Ionicons name={following ? 'lock-closed' : 'lock-open'} size={22} color="#fff" />, label: '', onPress: onLock, bg: following ? '#A259FF' : '#555',
      },
    ];

    return (
      <>
        {/* FAB Ring (Donut) - only visible when overlays are visible and action bar is hidden */}
        {/* FAB Ring (Donut) - only visible when overlays are visible and action bar is hidden */}
        {visible && !actionBarVisible && (
          <View
            style={[styles.fabRingContainer, { opacity: 1, zIndex: 51 }]}
            pointerEvents={visible ? 'auto' : 'none'}
          >
            <TouchableOpacity style={[styles.fabRingTouchable, { width: 56, height: 56 }]} onPress={onOpen} activeOpacity={0.92}>
              <View style={[styles.fabRingOuter, { width: 48, height: 48, borderRadius: 24, borderWidth: 6, borderColor: '#A259FF', backgroundColor: 'rgba(162,89,255,0.20)' }]}>
                <View style={[styles.fabRingInner, { width: 22, height: 22, borderRadius: 11 }]} />
              </View>
            </TouchableOpacity>
          </View>
        )}
        {/* Horizontal Action Bar - only visible when actionBarVisible is true */}
        {actionBarVisible && (
          (() => { console.log('FABMenu: rendering action bar'); return null; })() ||
          <Animated.View
            style={[styles.fabActionBar, { opacity: fadeAnim, backgroundColor: 'rgba(80,40,130,0.97)', zIndex: 99, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [80, 0] }) }] }]}
            pointerEvents={actionBarVisible ? 'auto' : 'none'}
          >
            {buttons.map((btn, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.fabActionButton, { backgroundColor: btn.bg }]}
                onPress={() => { btn.onPress(); onClose(); }}
                activeOpacity={0.9}
              >
                {btn.icon}
                {btn.label !== '' && (
                  <Text style={styles.fabMenuCount}>{btn.label}</Text>
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </>
    );
  };

  // Add new comment or reply
  const handleSendComment = (text: string, parentId?: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: 'CurrentUser',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      note: text,
      time: 'Just now',
      likes: 0,
      replies: [],
    };

    if (parentId) {
      const findAndAddReply = (items: Comment[]): boolean => {
        for (const item of items) {
          if (item.id === parentId) {
            item.replies = [...(item.replies || []), newComment];
            return true;
          }
          if (item.replies && findAndAddReply(item.replies)) {
            return true;
          }
        }
        return false;
      };

      const updatedComments = [...comments];
      findAndAddReply(updatedComments);
      setComments(updatedComments);
    } else {
      setComments([newComment, ...comments]);
    }
    setCommentCount(prev => prev + 1);
  };

  const handleCloseComments = (): void => {
    setCommentsPopupVisible(false);
  };

  // Padlock/follow mechanics
  const handleFollow = (): void => {
    setFollowing((f: boolean) => !f);
    setNotifMsg(following ? 'Unfollowed the creator.' : 'Followed the creator!');
    setNotifVisible(true);
    setTimeout(() => setNotifVisible(false), 1200);
  };

  const handleNotifFade = (): void => setNotifVisible(false);
  const handleShare = (): void => {
    setShareCount((c: number) => c + 1);
    
  };
  const handleSave = (): void => {
    setSaveCount((c: number) => c + 1);
    
  };
  const handleCreator = (): void => {
    setNotifMsg('Creator profile coming soon!');
    setNotifVisible(true);
    setTimeout(() => setNotifVisible(false), 1200);
  };

  const handleLike = (): void => {
    setLikeCount((c: number) => c + 1);
    
  };
  const handleComment = (): void => {
    setCommentsPopupVisible(true);
    
  };

  // --- Render ---
  // Sample chapter data
  const CHAPTERS = [
    { id: 'c1', title: 'Chapter 1: Arrival', completed: true },
    { id: 'c2', title: 'Chapter 2: The Encounter', completed: true },
    { id: 'c3', title: 'Chapter 3: The Secret', completed: false },
    { id: 'c4', title: 'Chapter 4: Showdown', completed: false },
    { id: 'c5', title: 'Chapter 5: New Dawn', completed: false },
  ];

  // Open/close handlers for chapter modal
  const openChapterModal = () => {
    setChapterModalVisible(true);
    Animated.timing(chapterModalAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
    if (fabChapterTimeout.current) clearTimeout(fabChapterTimeout.current);
    fabChapterTimeout.current = setTimeout(() => {
      closeChapterModal();
    }, 30000);
  };
  const closeChapterModal = () => {
    Animated.timing(chapterModalAnim, {
      toValue: 0,
      duration: 320,
      useNativeDriver: true,
    }).start(() => setChapterModalVisible(false));
    if (fabChapterTimeout.current) clearTimeout(fabChapterTimeout.current);
  };
  // Chapter navigation handler
  const handleChapterSelect = (idx: number) => {
    closeChapterModal();
    setCurrentPage(idx + 1); // Go to first page of chapter (demo)
    flatListRef.current?.scrollToIndex({ index: idx, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* Chapter Modal Overlay */}
      {chapterModalVisible && (
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: 120 }}
          activeOpacity={1}
          onPress={closeChapterModal}
        />
      )}
      {/* Animated Modal */}
      <Animated.View
        pointerEvents={chapterModalVisible ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: width * 0.65,
          backgroundColor: '#fff',
          zIndex: 130,
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 16,
          shadowOffset: { width: 2, height: 0 },
          elevation: 15,
          borderTopRightRadius: 32,
          borderBottomRightRadius: 32,
          transform: [{ translateX: chapterModalAnim.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.65, 0] }) }],
        }}
      >
        <View style={{ flex: 1, paddingTop: 54, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#A259FF', marginBottom: 18 }}>Chapters</Text>
          <FlatList
            data={CHAPTERS}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleChapterSelect(index)}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 22 }}
                activeOpacity={0.85}
              >
                {/* Tree line */}
                <View style={{ width: 18, alignItems: 'center', marginRight: 10 }}>
                  {index !== 0 && (
                    <View style={{ width: 2, height: 18, backgroundColor: '#A259FF', opacity: 0.18, position: 'absolute', top: -18, left: 8 }} />
                  )}
                  <View style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: item.completed ? '#A259FF' : '#fff',
                    borderWidth: 2,
                    borderColor: '#A259FF',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {item.completed && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  {index !== CHAPTERS.length - 1 && (
                    <View style={{ width: 2, height: 22, backgroundColor: '#A259FF', opacity: 0.18, position: 'absolute', top: 16, left: 8 }} />
                  )}
                </View>
                <Text style={{ fontSize: 16, fontWeight: item.completed ? 'bold' : '600', color: item.completed ? '#A259FF' : '#444' }}>{item.title}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        </View>
      </Animated.View>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {/* Comic pages FlatList */}
      <FlatList
        ref={flatListRef}
        data={SAMPLE_COMIC_PAGES}
        keyExtractor={(item) => item.id}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={currentPage - 1}
        onMomentumScrollEnd={(e) => {
          const pageIdx = Math.round(e.nativeEvent.contentOffset.x / width);
          handlePageSwipe(pageIdx);
        }}
        style={{ flex: 1, zIndex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      {/* Tap-out overlay for dismissing action bar */}
      {fabActionBarVisible && (
        <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }} onPress={handleFABClose} activeOpacity={1} />
      )}
      {/* Overlay: Page number (only if ring is visible and action bar is not) */}
      {/* Page number overlay: show if overlaysVisible or overlaysVisible===false (always on swipe/tap) */}
      {(overlaysVisible || overlaysVisible === false) && !fabActionBarVisible && (
        <Animated.View style={[styles.pageNotifier, { opacity: fadeAnim, zIndex: 60 }]} pointerEvents={overlaysVisible ? 'auto' : 'none'}>
          <TouchableOpacity style={styles.pageNotifierTouchable} onPress={() => setOverlaysVisible(false)} activeOpacity={0.85}>
            <Text style={styles.pageNotifierText}>{currentPage} / {comic.totalPages}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* FAB ring and action bar (FABMenu) - always rendered, visibility controlled by props */}
      {/* FAB ring and action bar (FABMenu) - only show if overlaysVisible is true */}
      <FABMenu
        visible={overlaysVisible && fabRingVisible}
        actionBarVisible={fabActionBarVisible}
        onOpen={handleFABOpen}
        onClose={handleFABClose}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onSave={handleSave}
        onCreator={handleCreator}
        onLock={handleFollow}
        following={following}
        likeCount={likeCount}
        commentCount={commentCount}
        shareCount={shareCount}
        saveCount={saveCount}
      />
      {/* White Chapter FAB on left */}
      {/* White Chapter FAB on left - only show if overlaysVisible is true */}
      {!chapterModalVisible && !fabActionBarVisible && overlaysVisible && fabRingVisible && (
        <View style={[styles.fabRingContainer, { left: 24, right: undefined, zIndex: 51 }]}> 
          <TouchableOpacity style={[styles.fabRingTouchable, { width: 56, height: 56 }]} onPress={openChapterModal} activeOpacity={0.92}>
            <View style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 5, borderColor: '#fff', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' }} />
              <Ionicons name="list" size={24} color="#A259FF" style={{ position: 'absolute' }} />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Locked Notification */}
      <LockedNotification visible={notifVisible} message={notifMsg} onFadeOut={handleNotifFade} />
      {/* Chatbox Popup */}
      <CommentsPopup
        visible={commentsPopupVisible}
        onClose={handleCloseComments}
        comments={comments}
        onSend={handleSendComment}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Fading page notifier
  pageNotifierFading: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: 'rgba(30,30,40,0.85)',
    borderRadius: 20,
    paddingHorizontal: 26,
    paddingVertical: 10,
    zIndex: 30,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 7,
  },
  // Overlay page notifier (for FAB ring and page number)
  pageNotifier: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: 'rgba(30,30,40,0.85)',
    borderRadius: 20,
    paddingHorizontal: 26,
    paddingVertical: 10,
    zIndex: 30,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 7,
  },
  pageNotifierTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNotifierText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  // FAB styles
  // FAB Ring styles
  fabRingContainer: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabRingTouchable: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabRingOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 4,
    borderColor: '#A259FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(162,89,255,0.10)',
  },
  fabRingInner: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: COLORS.background,
  },
  fabActionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 51,
  },
  fabActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    width: 44,
    height: 44,
    marginHorizontal: 7,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  fabMenuCount: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 13,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26,26,32,0.98)',
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    zIndex: 50,
    elevation: 11,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  actionCount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  creatorBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 18,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.13)',
  },
  creatorAvatarButton: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
  },
  followingButton: {
    backgroundColor: COLORS.textSecondary,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  followingButtonText: {
    color: COLORS.primary,
  },
  pageContainer: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pageImage: {
    width: width,
    height: height,
    maxWidth: '100%',
    maxHeight: '100%',
    resizeMode: 'contain',
  },
  pageInfoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default ComicReaderScreen;

