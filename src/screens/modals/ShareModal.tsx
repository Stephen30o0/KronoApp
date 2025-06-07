import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Share,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

// Social platforms
const SOCIAL_PLATFORMS = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'logo-twitter',
    color: '#1DA1F2',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'logo-facebook',
    color: '#4267B2',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'logo-instagram',
    color: '#C13584',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'logo-whatsapp',
    color: '#25D366',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: 'paper-plane-outline',
    color: '#0088cc',
  },
  {
    id: 'copy',
    name: 'Copy Link',
    icon: 'copy-outline',
    color: COLORS.textSecondary,
  },
  {
    id: 'more',
    name: 'More',
    icon: 'ellipsis-horizontal',
    color: COLORS.textSecondary,
  },
];

interface ShareModalParams {
  type?: string;
  userId?: string;
  username?: string;
  postId?: string;
  postContent?: string;
  postImage?: string;
  userName?: string;
}

const ShareModal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as ShareModalParams || {};
  const {
    type = 'comic',
    userId = '',
    username = '',
    postId = '',
    postContent = '',
    postImage = 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y29taWN8ZW58MHx8MHx8&w=400&q=80',
    userName = 'Alex Johnson',
  } = params;

  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async (platform: string) => {
    setIsLoading(true);
    
    try {
      let message = '';
      
      if (type === 'comic') {
        message = `Check out this amazing comic on KronoLabs! ${postContent || 'Cyber Knights by Alex Johnson'}`;
      } else if (type === 'profile') {
        message = `Check out ${username || userName}'s profile on KronoLabs!`;
      } else {
        message = `${postContent || 'Check out this post on KronoLabs!'}`;
      }
      
      if (comment) {
        message = `${comment}\n\n${message}`;
      }
      
      // In a real app, you would use platform-specific sharing APIs
      // For now, we'll use the generic Share API
      await Share.share({
        message,
        url: postImage, // This would be a deep link in a real app
      });
      
      // Navigate back after sharing
      navigation.goBack();
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => {
    navigation.goBack();
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Preview */}
        <View style={styles.previewContainer}>
          {type === 'comic' || postImage ? (
            <Image
              source={{ uri: postImage }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : null}
          
          <View style={styles.previewInfo}>
            <Text style={styles.previewTitle}>
              {type === 'comic'
                ? 'Cyber Knights'
                : type === 'profile'
                ? `${username || userName}'s profile`
                : 'Post'}
            </Text>
            
            {type !== 'profile' && (
              <Text style={styles.previewAuthor}>
                by {userName}
              </Text>
            )}
          </View>
        </View>
        
        {/* Comment Input */}
        <View style={styles.commentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
            value={comment}
            onChangeText={setComment}
          />
        </View>
        
        {/* Share Options */}
        <Text style={styles.sectionTitle}>Share to</Text>
        
        <View style={styles.socialGrid}>
          {SOCIAL_PLATFORMS.map((platform) => (
            <TouchableOpacity
              key={platform.id}
              style={styles.socialItem}
              onPress={() => handleShare(platform.id)}
              disabled={isLoading}
            >
              <View
                style={[
                  styles.socialIcon,
                  { backgroundColor: platform.color },
                ]}
              >
                <Ionicons name={platform.icon as any} size={24} color={COLORS.textPrimary} />
              </View>
              <Text style={styles.socialName}>{platform.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Friends */}
        <Text style={styles.sectionTitle}>Share with friends</Text>
        
        <View style={styles.friendsList}>
          {/* Sample friends - in a real app, this would come from an API */}
          {[1, 2, 3, 4, 5].map((id) => (
            <TouchableOpacity key={id} style={styles.friendItem}>
              <Image
                source={{ uri: `https://randomuser.me/api/portraits/${id % 2 === 0 ? 'women' : 'men'}/${id + 20}.jpg` }}
                style={styles.friendAvatar}
              />
              <Text style={styles.friendName}>
                {['Emma', 'James', 'Olivia', 'Noah', 'Sophia'][id - 1]} {['S.', 'T.', 'W.', 'B.', 'R.'][id - 1]}
              </Text>
              <View style={styles.friendAction}>
                <Text style={styles.friendActionText}>Send</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  previewInfo: {
    flex: 1,
    marginLeft: 12,
  },
  previewTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  previewAuthor: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  commentContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  commentInput: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  socialItem: {
    width: width / 4 - 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialName: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  friendsList: {
    marginBottom: 24,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  friendName: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    flex: 1,
    marginLeft: 12,
  },
  friendAction: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  friendActionText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
});

export default ShareModal;
