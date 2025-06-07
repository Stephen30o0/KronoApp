import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  NativeSyntheticEvent,
  TextLayoutEventData
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

interface ProfileBioProps {
  bio: string;
  location?: string;
  website?: string;
  joinDate?: string;
  scrollY: Animated.Value;
}

const ProfileBio: React.FC<ProfileBioProps> = ({
  bio,
  location,
  website,
  joinDate,
  scrollY
}) => {
  const [expanded, setExpanded] = useState(false);
  const [bioTextHeight, setBioTextHeight] = useState(0);
  const [needsExpand, setNeedsExpand] = useState(false);
  
  // Animated values
  const bioOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const bioTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 10],
    extrapolate: 'clamp'
  });

  // Handle text layout to check if we need "See more" button
  const onTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    const { height } = e.nativeEvent.lines ? { height: e.nativeEvent.lines.length * 20 } : { height: 0 };
    setBioTextHeight(height);
    
    // If text is more than 3 lines, show "See more" button
    if ((e.nativeEvent.lines && e.nativeEvent.lines.length > 3) || (height > 60 && !needsExpand)) {
      setNeedsExpand(true);
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: bioOpacity,
          transform: [{ translateY: bioTranslateY }]
        }
      ]}
    >
      {bio ? (
        <View>
          <Text 
            style={styles.bioText} 
            numberOfLines={expanded ? undefined : 3}
            onTextLayout={expanded ? undefined : onTextLayout}
          >
            {bio}
          </Text>
          
          {needsExpand && (
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => setExpanded(!expanded)}
            >
              <Text style={styles.expandButtonText}>
                {expanded ? 'See less' : 'See more'}
              </Text>
              <Ionicons 
                name={expanded ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={COLORS.primary} 
                style={styles.expandIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      ) : null}
      
      {(location || website || joinDate) && (
        <View style={styles.infoContainer}>
          {location && (
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>{location}</Text>
            </View>
          )}
          
          {website && (
            <View style={styles.infoItem}>
              <Ionicons name="link-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>{website}</Text>
            </View>
          )}
          
          {joinDate && (
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>Joined {joinDate}</Text>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  bioText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  expandButtonText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  expandIcon: {
    marginLeft: 4,
  },
  infoContainer: {
    marginTop: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
});

export default ProfileBio;
