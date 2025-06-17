import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { COLORS, FONTS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

interface ComicItemProps {
  id: string;
  title: string;
  coverImage: string;
  author: string;
  likes: number;
  views: number;
  onPress: (id: string) => void;
}

const ComicItem: React.FC<ComicItemProps> = ({
  id,
  title,
  coverImage,
  author,
  likes,
  views,
  onPress
}) => {
  // 3D tilt and scale values
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const scale = useSharedValue(1.1); // Slightly popped by default

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
      { scale: scale.value },
    ],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.38,
    shadowRadius: 40,
    elevation: 36,
  }));

  // Use useAnimatedGestureHandler for 3D tilt
  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      rotateY.value = withSpring(event.translationX / 8, { damping: 8 });
      rotateX.value = withSpring(-event.translationY / 8, { damping: 8 });
      scale.value = withSpring(1.18, { damping: 8 });
    },
    onEnd: () => {
      rotateX.value = withSpring(0, { damping: 8 });
      rotateY.value = withSpring(0, { damping: 8 });
      scale.value = withSpring(1.1, { damping: 8 });
    },
  });

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={0.85}
    >
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          {/* Glassy BlurView background */}
          <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
          {/* Glass border */}
          <View style={styles.glassBorder} pointerEvents="none" />
          {/* Glass highlight overlay */}
          <View style={styles.glassHighlight} pointerEvents="none" />
          {/* Comic cover image */}
          <Image 
            source={{ uri: coverImage }} 
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.statsOverlay}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={14} color={COLORS.like} />
              <Text style={styles.statText}>{likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={14} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{views}</Text>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.author} numberOfLines={1}>by {author}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5, // Aspect ratio for comic covers
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.38,
    shadowRadius: 40,
    elevation: 36,
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.75)',
    zIndex: 2,
  },
  glassHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '65%',
    height: '36%',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.38)',
    opacity: 0.78,
    zIndex: 3,
    transform: [{ rotate: '-14deg'}],
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    zIndex: 4,
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  title: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  author: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
});

export default ComicItem;
