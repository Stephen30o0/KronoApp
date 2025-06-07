import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

// Sample data for leaderboard
const LEADERBOARD_DATA = {
  creators: [
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      points: 12547,
      rank: 1,
      change: 0,
    },
    {
      id: '2',
      name: 'Sarah Chen',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      points: 10982,
      rank: 2,
      change: 1,
    },
    {
      id: '3',
      name: 'Michael Wong',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      points: 9876,
      rank: 3,
      change: -1,
    },
    {
      id: '4',
      name: 'Emma Davis',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      points: 8765,
      rank: 4,
      change: 2,
    },
    {
      id: '5',
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
      points: 7654,
      rank: 5,
      change: 0,
    },
    {
      id: '6',
      name: 'Lisa Park',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      points: 6543,
      rank: 6,
      change: 3,
    },
    {
      id: '7',
      name: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      points: 5432,
      rank: 7,
      change: -2,
    },
    {
      id: '8',
      name: 'Olivia Martinez',
      avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
      points: 4321,
      rank: 8,
      change: 1,
    },
    {
      id: '9',
      name: 'Robert Taylor',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
      points: 3210,
      rank: 9,
      change: -1,
    },
    {
      id: '10',
      name: 'Sophia Anderson',
      avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
      points: 2109,
      rank: 10,
      change: 4,
    },
  ],
  comics: [
    {
      id: '1',
      title: 'Quantum Detectives',
      creator: 'Alex Johnson',
      cover: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      points: 8765,
      rank: 1,
      change: 0,
    },
    {
      id: '2',
      title: 'Neon Dreams',
      creator: 'Sarah Chen',
      cover: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      points: 7654,
      rank: 2,
      change: 1,
    },
    {
      id: '3',
      title: 'Space Explorers',
      creator: 'Michael Wong',
      cover: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      points: 6543,
      rank: 3,
      change: -1,
    },
    {
      id: '4',
      title: 'Cyber Chronicles',
      creator: 'Emma Davis',
      cover: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      points: 5432,
      rank: 4,
      change: 2,
    },
    {
      id: '5',
      title: 'Dragon Realms',
      creator: 'David Kim',
      cover: 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      points: 4321,
      rank: 5,
      change: 0,
    },
  ],
};

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('creators');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderCreatorItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.leaderboardItem}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{item.rank}</Text>
          {item.change !== 0 && (
            <View style={styles.changeContainer}>
              <Ionicons 
                name={item.change > 0 ? 'arrow-up' : 'arrow-down'} 
                size={12} 
                color={item.change > 0 ? '#4CAF50' : '#F44336'} 
              />
              <Text style={[
                styles.changeText, 
                { color: item.change > 0 ? '#4CAF50' : '#F44336' }
              ]}>
                {Math.abs(item.change)}
              </Text>
            </View>
          )}
        </View>
        
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <View style={styles.pointsContainer}>
            <Ionicons name="trophy" size={14} color={COLORS.primary} />
            <Text style={styles.pointsText}>{item.points.toLocaleString()} pts</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderComicItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.leaderboardItem}>
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{item.rank}</Text>
          {item.change !== 0 && (
            <View style={styles.changeContainer}>
              <Ionicons 
                name={item.change > 0 ? 'arrow-up' : 'arrow-down'} 
                size={12} 
                color={item.change > 0 ? '#4CAF50' : '#F44336'} 
              />
              <Text style={[
                styles.changeText, 
                { color: item.change > 0 ? '#4CAF50' : '#F44336' }
              ]}>
                {Math.abs(item.change)}
              </Text>
            </View>
          )}
        </View>
        
        <Image source={{ uri: item.cover }} style={styles.comicCover} />
        
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{item.title}</Text>
          <Text style={styles.creatorText}>by {item.creator}</Text>
          <View style={styles.pointsContainer}>
            <Ionicons name="trophy" size={14} color={COLORS.primary} />
            <Text style={styles.pointsText}>{item.points.toLocaleString()} pts</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.readButton}>
          <Text style={styles.readButtonText}>Read</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Leaderboard</Text>
        
        <TouchableOpacity>
          <Ionicons name="information-circle-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'creators' && styles.activeTabButton]}
          onPress={() => setActiveTab('creators')}
        >
          <Text style={[styles.tabText, activeTab === 'creators' && styles.activeTabText]}>
            Top Creators
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'comics' && styles.activeTabButton]}
          onPress={() => setActiveTab('comics')}
        >
          <Text style={[styles.tabText, activeTab === 'comics' && styles.activeTabText]}>
            Top Comics
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.timeframeContainer}>
        <Text style={styles.timeframeLabel}>Timeframe:</Text>
        <TouchableOpacity style={styles.timeframeButton}>
          <Text style={styles.timeframeButtonText}>This Week</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={activeTab === 'creators' ? LEADERBOARD_DATA.creators : LEADERBOARD_DATA.comics}
        renderItem={activeTab === 'creators' ? renderCreatorItem : renderComicItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.userRankContainer}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.userRankGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.userRankContent}>
            <Text style={styles.yourRankLabel}>Your Rank:</Text>
            <View style={styles.yourRankInfo}>
              <Text style={styles.yourRankText}>#42</Text>
              <View style={styles.yourRankChange}>
                <Ionicons name="arrow-up" size={14} color="#4CAF50" />
                <Text style={[styles.changeText, { color: '#4CAF50' }]}>3</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.yourPointsContainer}>
              <Ionicons name="trophy" size={18} color={COLORS.textPrimary} />
              <Text style={styles.yourPointsText}>1,245 pts</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
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
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.textPrimary,
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  timeframeLabel: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  timeframeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeframeButtonText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginRight: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    ...FONTS.caption,
    marginLeft: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 12,
  },
  comicCover: {
    width: 48,
    height: 60,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  creatorText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  followButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followButtonText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  readButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  readButtonText: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  userRankContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  userRankGradient: {
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  userRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  yourRankLabel: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  yourRankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yourRankText: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginRight: 4,
  },
  yourRankChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  yourPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yourPointsText: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
});

export default LeaderboardScreen;
