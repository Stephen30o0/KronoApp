import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollowPress: () => void;
  onMessagePress: () => void;
  onSharePress: () => void;
  onEditProfilePress: () => void;
  scrollY: Animated.Value;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  isOwnProfile,
  isFollowing,
  onFollowPress,
  onMessagePress,
  onSharePress,
  onEditProfilePress,
  scrollY
}) => {
  // Animated values for actions container
  const actionsOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.3],
    extrapolate: 'clamp'
  });

  const actionsScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: actionsOpacity,
          transform: [{ scale: actionsScale }]
        }
      ]}
    >
      {isOwnProfile ? (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={onEditProfilePress}
          >
            <Text style={styles.primaryButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={onSharePress}
          >
            <Ionicons name="share-social-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={[
              styles.primaryButton,
              isFollowing && styles.followingButton
            ]}
            onPress={onFollowPress}
          >
            <Text 
              style={[
                styles.primaryButtonText,
                isFollowing && styles.followingButtonText
              ]}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={onMessagePress}
          >
            <Ionicons name="mail-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={onSharePress}
          >
            <Ionicons name="share-social-outline" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  primaryButtonText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followingButtonText: {
    color: COLORS.primary,
  },
  secondaryButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default ProfileActions;
