import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

interface ProfileStatsProps {
  comics: number;
  followers: number;
  following: number;
  onComicsPress: () => void;
  onFollowersPress: () => void;
  onFollowingPress: () => void;
  scrollY: Animated.Value;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  comics,
  followers,
  following,
  onComicsPress,
  onFollowersPress,
  onFollowingPress,
  scrollY
}) => {
  // Animated values for stats container
  const statsOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const statsTranslateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 20],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: statsOpacity,
          transform: [{ translateY: statsTranslateY }]
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.statItem}
        onPress={onComicsPress}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>{comics}</Text>
        <Text style={styles.statLabel}>Comics</Text>
      </TouchableOpacity>
      
      <View style={styles.statDivider} />
      
      <TouchableOpacity 
        style={styles.statItem}
        onPress={onFollowersPress}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>{followers}</Text>
        <Text style={styles.statLabel}>Followers</Text>
      </TouchableOpacity>
      
      <View style={styles.statDivider} />
      
      <TouchableOpacity 
        style={styles.statItem}
        onPress={onFollowingPress}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>{following}</Text>
        <Text style={styles.statLabel}>Following</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default ProfileStats;
