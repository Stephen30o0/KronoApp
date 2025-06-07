import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  ImageBackground,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import ProfileBio from './ProfileBio';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';

const { width } = Dimensions.get('window');

interface ProfileHeaderProps {
  username: string;
  handle: string;
  bio: string;
  avatar: string;
  coverImage: string;
  followers: number;
  following: number;
  comics: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
  onFollowPress: () => void;
  onEditProfilePress: () => void;
  onMessagePress: () => void;
  onSharePress?: () => void;
  onComicsPress?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
  location?: string;
  website?: string;
  joinDate?: string;
  scrollY: Animated.Value;
}

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 90;
const PROFILE_IMAGE_MAX_SIZE = 100;
const PROFILE_IMAGE_MIN_SIZE = 40;

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  handle,
  bio,
  avatar,
  coverImage,
  followers,
  following,
  comics,
  isFollowing,
  isOwnProfile,
  onFollowPress,
  onEditProfilePress,
  onMessagePress,
  onSharePress = () => {},
  onComicsPress = () => {},
  onFollowersPress = () => {},
  onFollowingPress = () => {},
  location,
  website,
  joinDate,
  scrollY
}) => {
  // Animated values for header components
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  const profileImageSize = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [PROFILE_IMAGE_MAX_SIZE, PROFILE_IMAGE_MIN_SIZE],
    extrapolate: 'clamp'
  }).interpolate({ inputRange: [PROFILE_IMAGE_MIN_SIZE, PROFILE_IMAGE_MAX_SIZE], outputRange: [Math.round(PROFILE_IMAGE_MIN_SIZE), Math.round(PROFILE_IMAGE_MAX_SIZE)] });

  const profileImageMarginTop = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT - PROFILE_IMAGE_MAX_SIZE / 2, HEADER_MIN_HEIGHT - PROFILE_IMAGE_MIN_SIZE / 2],
    extrapolate: 'clamp'
  }).interpolate({ inputRange: [HEADER_MIN_HEIGHT - PROFILE_IMAGE_MIN_SIZE / 2, HEADER_MAX_HEIGHT - PROFILE_IMAGE_MAX_SIZE / 2], outputRange: [Math.round(HEADER_MIN_HEIGHT - PROFILE_IMAGE_MIN_SIZE / 2), Math.round(HEADER_MAX_HEIGHT - PROFILE_IMAGE_MAX_SIZE / 2)] });

  const headerZIndex = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 1, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 0, 1], // Snap to 0, then to 1 to ensure integer output
    extrapolate: 'clamp'
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const profileDetailsOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            height: headerHeight,
            zIndex: headerZIndex 
          }
        ]}
      >
        <LinearGradient
          colors={[COLORS.backgroundLight, COLORS.background]}
          style={styles.headerGradient}
        >
          <Image 
            source={{ uri: coverImage }} 
            style={styles.coverImage}
          />
          <View style={styles.coverOverlay} />
        </LinearGradient>
        
        {/* Header Title (visible when scrolled) */}
        <Animated.View 
          style={[
            styles.headerTitle, 
            { opacity: headerTitleOpacity }
          ]}
        >
          <Text style={styles.headerTitleText}>{username}</Text>
        </Animated.View>
      </Animated.View>
      
      {/* Profile Image */}
      <Animated.View
        style={[
          styles.profileImageContainer,
          {
            width: profileImageSize,
            height: profileImageSize,
            borderRadius: Animated.divide(profileImageSize, new Animated.Value(2)),
            marginTop: profileImageMarginTop,
            transform: [
              { translateX: -PROFILE_IMAGE_MAX_SIZE / 2 + 16 }
            ]
          }
        ]}
      >
        <Image 
          source={{ uri: avatar }} 
          style={styles.profileImage}
        />
      </Animated.View>
      
      {/* Profile Details */}
      <Animated.View 
        style={[
          styles.profileDetails,
          { opacity: profileDetailsOpacity }
        ]}
      >
        <View style={styles.nameContainer}>
          <View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.handle}>{handle}</Text>
          </View>
        </View>
        
        {/* Profile Actions */}
        <ProfileActions 
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollowPress={onFollowPress}
          onMessagePress={onMessagePress}
          onSharePress={onSharePress}
          onEditProfilePress={onEditProfilePress}
          scrollY={scrollY}
        />
        
        {/* Profile Bio */}
        <ProfileBio 
          bio={bio}
          location={location}
          website={website}
          joinDate={joinDate}
          scrollY={scrollY}
        />
        
        {/* Profile Stats */}
        <ProfileStats 
          comics={comics}
          followers={followers}
          following={following}
          onComicsPress={onComicsPress}
          onFollowersPress={onFollowersPress}
          onFollowingPress={onFollowingPress}
          scrollY={scrollY}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: null,
    height: null,
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerTitle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: HEADER_MIN_HEIGHT,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginLeft: PROFILE_IMAGE_MIN_SIZE + 16,
  },
  profileImageContainer: {
    position: 'absolute',
    left: '50%',
    backgroundColor: COLORS.background,
    borderWidth: 3,
    borderColor: COLORS.background,
    overflow: 'hidden',
    zIndex: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileDetails: {
    paddingTop: PROFILE_IMAGE_MAX_SIZE / 2 + 20,
    paddingHorizontal: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  username: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  handle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  editButtonText: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followButtonText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: COLORS.primary,
  },
  messageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bio: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.divider,
  },
});

export default ProfileHeader;
