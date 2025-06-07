import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

interface AchievementItemProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  onPress: (id: string) => void;
}

const AchievementItem: React.FC<AchievementItemProps> = ({
  id,
  title,
  description,
  icon,
  unlocked,
  progress = 0,
  maxProgress = 1,
  onPress
}) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (progress / maxProgress) * 100);
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !unlocked && styles.lockedContainer
      ]}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {unlocked ? (
          <Image source={{ uri: icon }} style={styles.icon} />
        ) : (
          <View style={styles.lockedIconOverlay}>
            <Image 
              source={{ uri: icon }} 
              style={[styles.icon, styles.lockedIcon]} 
            />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        {maxProgress > 1 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={unlocked ? [COLORS.primary, COLORS.accent1] : [COLORS.textTertiary, COLORS.textTertiary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {progress}/{maxProgress}
            </Text>
          </View>
        )}
      </View>
      
      {unlocked && (
        <View style={styles.unlockedBadge}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent1]}
            style={styles.badgeGradient}
          >
            <Text style={styles.badgeText}>Unlocked</Text>
          </LinearGradient>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  lockedContainer: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
  },
  lockedIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedIcon: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  description: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    width: 40,
    textAlign: 'right',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 24,
    overflow: 'hidden',
  },
  badgeGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }, { translateX: 20 }, { translateY: -10 }],
  },
  badgeText: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: 8,
    transform: [{ rotate: '-45deg' }],
  },
});

export default AchievementItem;
