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
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
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
      </View>
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
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: 8,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
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
