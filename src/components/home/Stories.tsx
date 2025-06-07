import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants
import { FONTS, SIZES } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasUnviewedStory: boolean;
  previewImage?: string; // Optional preview image for the story
}

interface StoriesProps {
  stories: Story[];
  onStoryPress: (storyId: string) => void;
  colors?: any; // Theme colors
}

const Stories: React.FC<StoriesProps> = ({ stories, onStoryPress, colors: propColors }) => {
  // Use provided colors or get from theme context
  const themeContext = useTheme();
  const colors = propColors || themeContext.colors;

  const renderStoryItem = ({ item }: { item: Story }) => {
    if (item.id === '1') {
      // Your story (Add story)
      return (
        <TouchableOpacity 
          style={styles.yourStoryContainer}
          onPress={() => onStoryPress && onStoryPress(item.id)}
        >
          <View style={styles.yourStoryContent}>
            <View style={styles.yourStoryAvatar}>
              {item.avatar ? (
                <Image 
                  source={{ uri: item.avatar }} 
                  style={styles.storyAvatarImage}
                />
              ) : (
                <View style={styles.storyAvatarPlaceholder}>
                  <Text style={styles.storyAvatarText}>Y</Text>
                </View>
              )}
              <View style={styles.addStoryButton}>
                <Ionicons name="add" size={10} color={colors.textPrimary} />
              </View>
            </View>
            <Text style={styles.addText}>Add status</Text>
          </View>
        </TouchableOpacity>
      );
    }
    
    // Other stories
    return (
      <TouchableOpacity 
        style={styles.storyItem}
        onPress={() => onStoryPress && onStoryPress(item.id)}
      >
        <View 
          style={[
            styles.storyContainer, 
            item.hasUnviewedStory 
              ? [styles.activeStoryContainer, { borderColor: colors.primary }] 
              : { borderColor: colors.divider }
          ]}
        >
          <View style={styles.storyPreview}>
            {item.previewImage ? (
              <Image 
                source={{ uri: item.previewImage }} 
                style={styles.storyPreviewImage}
              />
            ) : (
              <View style={styles.storyPreviewPlaceholder}>
                <Text style={styles.storyAvatarText}>{item.username.substring(0, 2).toUpperCase()}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.storyAvatarContainer}>
            <View style={styles.storyAvatar}>
              {item.avatar ? (
                <Image 
                  source={{ uri: item.avatar }} 
                  style={styles.storyAvatarImage}
                />
              ) : (
                <View style={styles.storyAvatarPlaceholder}>
                  <Text style={styles.storyAvatarText}>{item.username.charAt(0).toUpperCase()}</Text>
                </View>
              )}
            </View>
          </View>
          
          <Text style={[styles.storyUsername, { color: colors.textPrimary }]} numberOfLines={1}>
            {item.username}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.storiesContainer}>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesList}
        renderItem={renderStoryItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  storiesContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  storiesList: {
    paddingHorizontal: 12,
  },
  storyItem: {
    marginHorizontal: 6,
    width: 100,
  },
  storyContainer: {
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    height: 160,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  activeStoryContainer: {
    borderColor: COLORS.primary,
  },
  storyPreview: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.backgroundLight,
  },
  storyPreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  storyPreviewPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  storyAvatarContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 20,
    padding: 2,
  },
  storyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundLight,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyAvatarImage: {
    width: '100%',
    height: '100%',
  },
  storyAvatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  storyAvatarText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  storyUsername: {
    ...FONTS.caption,
    marginTop: 4,
    fontSize: 11,
    textAlign: 'center',
    width: 80, // Fixed width instead of using SIZES.storySize
  },
  addStoryButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  yourStoryContainer: {
    width: 100,
    marginHorizontal: 6,
  },
  yourStoryContent: {
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    height: 160,
    borderWidth: 2,
    borderColor: COLORS.divider,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yourStoryAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.backgroundLight,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  addText: {
    ...FONTS.caption,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default Stories;
