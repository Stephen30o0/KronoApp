import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface Comic {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  cover: string;
  rating: number;
  likes: number;
  datePosted: string;
  isLiked: boolean;
}

interface ComicDetailModalProps {
  visible: boolean;
  comic: Comic | null;
  onClose: () => void;
  onLike: (id: string) => void;
  onShare: (id: string) => void;
  onRead: (id: string) => void;
  onCreatorPress: (creator: string) => void;
}

const ComicDetailModal: React.FC<ComicDetailModalProps> = ({
  visible,
  comic,
  onClose,
  onLike,
  onShare,
  onRead,
  onCreatorPress,
}) => {
  const [actionsVisible, setActionsVisible] = useState(false);
  const [voteConfirmation, setVoteConfirmation] = useState<string | null>(null);
  
  // Animation values
  const actionButtonScale = useRef(new Animated.Value(1)).current;
  const actionButtonsPosition = useRef(new Animated.Value(0)).current;
  
  // Show action buttons with animation when modal opens
  React.useEffect(() => {
    if (visible) {
      // Show action buttons with a slight delay
      setTimeout(() => {
        setActionsVisible(true);
        Animated.parallel([
          Animated.timing(actionButtonsPosition, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(actionButtonScale, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);
    } else {
      // Hide action buttons immediately
      hideActionButtons();
      actionButtonsPosition.setValue(0);
      actionButtonScale.setValue(1);
    }
  }, [visible]);
  
  // Hide action buttons when tapping outside
  const hideActionButtons = () => {
    if (actionsVisible) {
      Animated.parallel([
        Animated.timing(actionButtonsPosition, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(actionButtonScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setActionsVisible(false));
    }
  };
  
  // Handle like with confirmation
  const handleLike = () => {
    if (!comic) return;
    
    onLike(comic.id);
    setVoteConfirmation(comic.isLiked ? 'Unlike' : 'Like');
    setTimeout(() => setVoteConfirmation(null), 1500);
  };
  
  // Render action buttons
  const renderActionButtons = () => {
    if (!comic) return null;
    
    const actionButtons = [
      {
        icon: comic.isLiked ? 'heart' as const : 'heart-outline' as const,
        color: comic.isLiked ? COLORS.like : COLORS.textPrimary,
        action: handleLike,
        label: 'Like',
      },
      {
        icon: 'book-outline' as const,
        color: COLORS.textPrimary,
        action: () => onRead(comic.id),
        label: 'Read',
      },
      {
        icon: 'share-social-outline' as const,
        color: COLORS.textPrimary,
        action: () => onShare(comic.id),
        label: 'Share',
      },
      {
        icon: 'bookmark-outline' as const,
        color: COLORS.textPrimary,
        action: () => console.log('Save comic'),
        label: 'Save',
      },
    ];
    
    return (
      <Animated.View 
        style={[
          styles.actionButtonsContainer,
          {
            opacity: actionButtonsPosition,
            transform: [
              {
                translateY: actionButtonsPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents="box-none"
      >
        {actionButtons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={button.action}
          >
            <Ionicons name={button.icon} size={24} color={button.color} />
            <Text style={styles.actionButtonLabel}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    );
  };
  
  // Render vote confirmation
  const renderVoteConfirmation = () => {
    if (!voteConfirmation) return null;
    
    return (
      <Animated.View style={styles.voteConfirmation}>
        <Text style={styles.voteConfirmationText}>{voteConfirmation}</Text>
      </Animated.View>
    );
  };
  
  if (!comic) return null;
  
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        hideActionButtons();
        onClose();
      }}
    >
      <Pressable 
        style={styles.modalContainer} 
        onPress={() => {
          hideActionButtons();
          setTimeout(() => onClose(), 300); // Delay closing to allow animation to complete
        }}
      >
        <BlurView intensity={90} style={styles.blurBackground} tint="dark" />
        
        <Pressable 
          style={styles.modalContent} 
          onPress={(e) => {
            // Stop propagation to prevent modal from closing when clicking on content
            e.stopPropagation();
          }}
        >
          {/* Comic Cover */}
          <View style={styles.coverContainer}>
            <Image source={{ uri: comic.cover }} style={styles.coverImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.coverGradient}
            />
          </View>
          
          {/* Comic Details */}
          <ScrollView style={styles.detailsContainer}>
            <Text style={styles.comicTitle}>{comic.title}</Text>
            
            <TouchableOpacity 
              style={styles.creatorContainer}
              onPress={() => onCreatorPress(comic.creator)}
            >
              <Image source={{ uri: comic.creatorAvatar }} style={styles.creatorAvatar} />
              <Text style={styles.creatorName}>{comic.creator}</Text>
            </TouchableOpacity>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="star" size={16} color="#FFD700" /> {/* Using gold color for star rating */}
                <Text style={styles.statText}>{comic.rating.toFixed(1)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="heart" size={16} color={COLORS.like} />
                <Text style={styles.statText}>{comic.likes}</Text>
              </View>
              
              <Text style={styles.datePosted}>{comic.datePosted}</Text>
            </View>
            
            <Text style={styles.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, 
              nunc sit amet ultricies lacinia, nisl nisl aliquam nisl, eget aliquam
              nisl nisl sit amet nisl. Sed euismod, nunc sit amet ultricies lacinia,
              nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
            </Text>
            
            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Sci-Fi</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Adventure</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Mystery</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.readButton}
              onPress={() => onRead(comic.id)}
            >
              <Text style={styles.readButtonText}>Read Now</Text>
            </TouchableOpacity>
          </ScrollView>
          
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => {
              hideActionButtons();
              onClose();
            }}
          >
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          {/* Action Button */}
          <TouchableOpacity 
            style={[styles.actionButtonMain, { transform: [{ scale: actionButtonScale }] }]}
            onPress={(e) => {
              // Prevent event from bubbling up to parent
              e.stopPropagation();
              // Toggle action buttons
              if (actionsVisible) {
                hideActionButtons();
              } else {
                setActionsVisible(true);
                Animated.parallel([
                  Animated.timing(actionButtonsPosition, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                  Animated.timing(actionButtonScale, {
                    toValue: 1.1,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                ]).start();
              }
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          
          {/* Action Buttons (animated) */}
          {actionsVisible && renderActionButtons()}
          
          {/* Vote Confirmation */}
          {renderVoteConfirmation()}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  coverContainer: {
    width: '100%',
    height: height * 0.4,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  comicTitle: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  creatorName: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  datePosted: {
    ...FONTS.body2,
    color: COLORS.textTertiary,
  },
  description: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  readButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  readButtonText: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  actionButtonMain: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
    zIndex: 10,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 8,
    ...SHADOWS.medium,
    zIndex: 100, // Increased z-index to ensure visibility
    elevation: 10, // Added elevation for Android
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  actionButtonLabel: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginLeft: 12,
  },
  voteConfirmation: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 20,
  },
  voteConfirmationText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
});

export default ComicDetailModal;
