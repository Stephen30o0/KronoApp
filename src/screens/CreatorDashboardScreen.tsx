import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS, SHADOWS, SIZES } from '../constants/theme';

// Type definitions for mock data
type Project = {
  id: string;
  title: string;
  coverImage: string;
  status: string;
  funding: number;
  engagement: string;
};

type Activity = {
  id: string;
  type: 'comment' | 'funding' | 'subscriber';
  text: string;
  time: string;
};

// Mock Data
const creatorData = {
  name: 'DigitalDaVinci',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  stats: {
    totalEarnings: 12500,
    subscribers: 1200,
    projectViews: 89000,
  },
  projects: [
    {
      id: '1',
      title: 'Chrono-Guardians of Andromeda',
      coverImage: 'https://images.unsplash.com/photo-1581094794329-c853146245ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      status: 'In Development',
      funding: 80,
      engagement: 'High',
    },
    {
      id: '2',
      title: 'The Last Ether-Knight',
      coverImage: 'https://images.unsplash.com/photo-1612042404321-3c1d5a8a6b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      status: 'Fully Funded',
      funding: 100,
      engagement: 'Very High',
    },
    {
      id: '3',
      title: 'Cyber-Samurai: Blade of the Future',
      coverImage: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
      status: 'Pitch',
      funding: 25,
      engagement: 'Medium',
    },
  ],
  activity: [
    { id: '1', type: 'comment' as const, text: 'User "ComicFan82" commented on Chrono-Guardians.', time: '2h ago' },
    { id: '2', type: 'funding' as const, text: 'Received 500 KRN for The Last Ether-Knight.', time: '5h ago' },
    { id: '3', type: 'subscriber' as const, text: 'You have a new subscriber!', time: '1d ago' },
  ],
};

const { width } = Dimensions.get('window');

const CreatorDashboardScreen = () => {
  const navigation = useNavigation<any>();

  const StatCard = ({ icon, value, label, color }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string; color: string }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const QuickActionButton = ({ icon, label, onPress, color }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; color: string }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionButton}>
      <View style={[styles.quickActionIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={26} color={COLORS.textPrimary} />
      </View>
      <Text style={styles.quickActionText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderProjectItem = ({ item }: { item: Project }) => (
    <Animatable.View animation="fadeInUp" duration={800} delay={parseInt(item.id) * 150} style={styles.projectCard}>
      <Image source={{ uri: item.coverImage }} style={styles.projectImage} />
      <View style={styles.projectOverlay} />
      <View style={styles.projectInfo}>
        <Text style={styles.projectTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.projectStatusContainer}>
          <Text style={styles.projectStatus}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.projectFundingContainer}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${item.funding}%` }]} />
        </View>
        <Text style={styles.projectFunding}>{item.funding}% Funded</Text>
      </View>
    </Animatable.View>
  );

  const renderActivityItem = ({ item }: { item: Activity }) => {
    let iconName: keyof typeof Ionicons.glyphMap;
    switch (item.type) {
      case 'comment': iconName = 'chatbubble-ellipses-outline'; break;
      case 'funding': iconName = 'cash-outline'; break;
      case 'subscriber': iconName = 'person-add-outline'; break;
      default: iconName = 'notifications-outline';
    }
    return (
      <View style={styles.activityItem}>
        <Ionicons name={iconName} size={22} color={COLORS.primary} style={styles.activityIcon} />
        <View style={styles.activityTextContainer}>
          <Text style={styles.activityText}>{item.text}</Text>
          <Text style={styles.activityTime}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <Animatable.View animation="fadeInDown" duration={600} style={styles.statsContainer}>
          <StatCard icon="cash-outline" value={`KRN ${creatorData.stats.totalEarnings.toLocaleString()}`} label="Total Earnings" color={COLORS.success} />
          <StatCard icon="people-outline" value={creatorData.stats.subscribers.toLocaleString()} label="Subscribers" color={COLORS.primary} />
          <StatCard icon="eye-outline" value={creatorData.stats.projectViews.toLocaleString()} label="Project Views" color={COLORS.info} />
        </Animatable.View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <QuickActionButton icon="add" label="New Project" onPress={() => navigation.navigate('NewProject')} color={COLORS.primary} />
          <QuickActionButton icon="analytics" label="Analytics" onPress={() => navigation.navigate('Analytics')} color={COLORS.info} />
          <QuickActionButton icon="wallet" label="Payouts" onPress={() => navigation.navigate('Payouts')} color={COLORS.success} />
        </View>

        {/* My Projects */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Projects</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={creatorData.projects}
            renderItem={renderProjectItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: SIZES.spacingMedium }}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <FlatList
            data={creatorData.activity}
            renderItem={renderActivityItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { paddingBottom: 30 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacingMedium,
    paddingTop: SIZES.spacingSmall,
    paddingBottom: SIZES.base,
  },
  headerButton: { padding: SIZES.base },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.spacingMedium,
    marginTop: SIZES.spacingMedium,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.spacingMedium,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: SIZES.base,
    ...SHADOWS.small,
  },
  statValue: { ...FONTS.h3, color: COLORS.textPrimary, marginTop: SIZES.base },
  statLabel: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.spacingMedium,
    marginTop: SIZES.spacingLarge,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
    marginBottom: SIZES.spacingSmall,
  },
  quickActionText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  sectionContainer: {
    marginTop: SIZES.spacingLarge,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacingMedium,
    marginBottom: SIZES.spacingMedium,
  },
  sectionTitle: { ...FONTS.h2, color: COLORS.textPrimary },
  seeAllText: { ...FONTS.button, color: COLORS.primary },
  projectCard: {
    width: width * 0.65,
    height: width * 0.8,
    borderRadius: SIZES.radiusLarge,
    marginRight: SIZES.spacingMedium,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  projectImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  projectOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  projectInfo: {
    position: 'absolute',
    top: SIZES.spacingMedium,
    left: SIZES.spacingMedium,
    right: SIZES.spacingMedium,
  },
  projectTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  projectStatusContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SIZES.spacingSmall,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
    alignSelf: 'flex-start',
    marginTop: SIZES.spacingSmall,
  },
  projectStatus: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  projectFundingContainer: {
    position: 'absolute',
    bottom: SIZES.spacingMedium,
    left: SIZES.spacingMedium,
    right: SIZES.spacingMedium,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  projectFunding: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    marginTop: SIZES.spacingSmall,
    textAlign: 'right',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.spacingMedium,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.base,
    marginHorizontal: SIZES.spacingMedium,
  },
  activityIcon: { marginRight: SIZES.spacingMedium },
  activityTextContainer: { flex: 1 },
  activityText: { ...FONTS.body3, color: COLORS.textPrimary },
  activityTime: { ...FONTS.caption, color: COLORS.textSecondary, marginTop: 2 },
});

export default CreatorDashboardScreen;
