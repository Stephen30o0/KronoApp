import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

// Mock data for dashboard
const ANALYTICS_DATA = {
  views: {
    total: 12547,
    change: 8.3,
    positive: true,
  },
  followers: {
    total: 245,
    change: 12.5,
    positive: true,
  },
  likes: {
    total: 876,
    change: 5.2,
    positive: true,
  },
  revenue: {
    total: 325.50,
    change: -2.1,
    positive: false,
  },
};

const RECENT_COMICS = [
  {
    id: '1',
    title: 'Quantum Detectives',
    views: 1245,
    likes: 87,
    comments: 23,
    publishedDate: '2 days ago',
  },
  {
    id: '2',
    title: 'Neon Dreams',
    views: 876,
    likes: 45,
    comments: 12,
    publishedDate: '1 week ago',
  },
  {
    id: '3',
    title: 'Space Explorers',
    views: 542,
    likes: 32,
    comments: 8,
    publishedDate: '2 weeks ago',
  },
];

const TOP_FANS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    contributions: 120,
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    contributions: 95,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    contributions: 87,
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    contributions: 76,
  },
];

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [timeRange, setTimeRange] = useState('week');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderAnalyticsCard = (title, data) => {
    return (
      <View style={styles.analyticsCard}>
        <Text style={styles.analyticsTitle}>{title}</Text>
        <Text style={styles.analyticsValue}>
          {title === 'Revenue' ? '$' : ''}{data.total.toLocaleString()}
        </Text>
        <View style={styles.changeContainer}>
          <Ionicons 
            name={data.positive ? 'arrow-up' : 'arrow-down'} 
            size={16} 
            color={data.positive ? '#4CAF50' : '#F44336'} 
          />
          <Text style={[
            styles.changeText, 
            { color: data.positive ? '#4CAF50' : '#F44336' }
          ]}>
            {Math.abs(data.change)}%
          </Text>
        </View>
      </View>
    );
  };

  const renderRecentComicsItem = (comic, index) => {
    return (
      <View key={comic.id} style={[styles.comicItem, index === 0 && { borderTopWidth: 0 }]}>
        <View style={styles.comicInfo}>
          <Text style={styles.comicTitle}>{comic.title}</Text>
          <Text style={styles.comicDate}>{comic.publishedDate}</Text>
        </View>
        <View style={styles.comicStats}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.statValue}>{comic.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.statValue}>{comic.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.statValue}>{comic.comments}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTopFanItem = (fan, index) => {
    return (
      <View key={fan.id} style={styles.fanItem}>
        <Text style={styles.fanRank}>{index + 1}</Text>
        <View style={styles.fanAvatarContainer}>
          <Image source={{ uri: fan.avatar }} style={styles.fanAvatar} />
        </View>
        <View style={styles.fanInfo}>
          <Text style={styles.fanName}>{fan.name}</Text>
          <Text style={styles.fanContributions}>{fan.contributions} KLT</Text>
        </View>
        <TouchableOpacity style={styles.fanActionButton}>
          <Text style={styles.fanActionText}>Thank</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Creator Dashboard</Text>
        
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <TouchableOpacity 
            style={[styles.timeRangeButton, timeRange === 'day' && styles.activeTimeRange]}
            onPress={() => setTimeRange('day')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'day' && styles.activeTimeRangeText]}>Day</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.timeRangeButton, timeRange === 'week' && styles.activeTimeRange]}
            onPress={() => setTimeRange('week')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'week' && styles.activeTimeRangeText]}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.timeRangeButton, timeRange === 'month' && styles.activeTimeRange]}
            onPress={() => setTimeRange('month')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'month' && styles.activeTimeRangeText]}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.timeRangeButton, timeRange === 'year' && styles.activeTimeRange]}
            onPress={() => setTimeRange('year')}
          >
            <Text style={[styles.timeRangeText, timeRange === 'year' && styles.activeTimeRangeText]}>Year</Text>
          </TouchableOpacity>
        </View>
        
        {/* Analytics Cards */}
        <View style={styles.analyticsContainer}>
          {renderAnalyticsCard('Views', ANALYTICS_DATA.views)}
          {renderAnalyticsCard('Followers', ANALYTICS_DATA.followers)}
          {renderAnalyticsCard('Likes', ANALYTICS_DATA.likes)}
          {renderAnalyticsCard('Revenue', ANALYTICS_DATA.revenue)}
        </View>
        
        {/* Recent Comics */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Comics</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.comicsContainer}>
            {RECENT_COMICS.map((comic, index) => renderRecentComicsItem(comic, index))}
          </View>
        </View>
        
        {/* Top Fans */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Supporters</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.fansContainer}>
            {TOP_FANS.map((fan, index) => renderTopFanItem(fan, index))}
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="add-circle-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.quickActionText}>New Comic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="stats-chart-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.quickActionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="people-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.quickActionText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="cash-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.quickActionText}>Earnings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeTimeRange: {
    backgroundColor: COLORS.primary,
  },
  timeRangeText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  activeTimeRangeText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  analyticsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  analyticsCard: {
    width: (width - 40) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...SHADOWS.medium,
  },
  analyticsTitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  analyticsValue: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    ...FONTS.caption,
    marginLeft: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  seeAllText: {
    ...FONTS.body2,
    color: COLORS.primary,
  },
  comicsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    ...SHADOWS.medium,
  },
  comicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  comicInfo: {
    flex: 1,
  },
  comicTitle: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  comicDate: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
  },
  comicStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statValue: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  fansContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    ...SHADOWS.medium,
  },
  fanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  fanRank: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
    width: 24,
    textAlign: 'center',
  },
  fanAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  fanAvatar: {
    width: '100%',
    height: '100%',
  },
  fanInfo: {
    flex: 1,
  },
  fanName: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
  fanContributions: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  fanActionButton: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  fanActionText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  quickActionButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: (width - 64) / 4,
    ...SHADOWS.medium,
  },
  quickActionText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DashboardScreen;
