import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

const UploadScreen = () => {
  const navigation = useNavigation();
  const [uploadType, setUploadType] = useState<'comic' | 'post' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderUploadTypeSelection = () => {
    return (
      <View style={styles.uploadTypeContainer}>
        <Text style={styles.sectionTitle}>What would you like to upload?</Text>
        <View style={styles.uploadTypeOptions}>
          <TouchableOpacity 
            style={[styles.uploadTypeCard, uploadType === 'comic' && styles.selectedCard]} 
            onPress={() => setUploadType('comic')}
          >
            <View style={styles.uploadTypeIconContainer}>
              <Ionicons name="book" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.uploadTypeTitle}>Comic</Text>
            <Text style={styles.uploadTypeDescription}>Upload a new comic series or episode</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.uploadTypeCard, uploadType === 'post' && styles.selectedCard]} 
            onPress={() => setUploadType('post')}
          >
            <View style={styles.uploadTypeIconContainer}>
              <Ionicons name="newspaper" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.uploadTypeTitle}>Post</Text>
            <Text style={styles.uploadTypeDescription}>Share an update, artwork, or announcement</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderUploadForm = () => {
    if (!uploadType) return null;

    return (
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>
          {uploadType === 'comic' ? 'Upload New Comic' : 'Create New Post'}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter a title"
            placeholderTextColor={COLORS.textTertiary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textAreaInput]}
            placeholder="Enter a description"
            placeholderTextColor={COLORS.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tags</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Add tags separated by commas"
            placeholderTextColor={COLORS.textTertiary}
            value={tags}
            onChangeText={setTags}
          />
        </View>

        <View style={styles.uploadSection}>
          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="cloud-upload-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.uploadButtonText}>
              {uploadType === 'comic' ? 'Upload Comic Files' : 'Upload Images'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.uploadHint}>
            {uploadType === 'comic' 
              ? 'Supported formats: PDF, CBZ, JPG, PNG (max 50MB)' 
              : 'Supported formats: JPG, PNG, GIF (max 10MB)'}
          </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setUploadType(null)}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              {uploadType === 'comic' ? 'Publish Comic' : 'Publish Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Upload</Text>
        
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {!uploadType ? renderUploadTypeSelection() : renderUploadForm()}
      </ScrollView>
    </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  uploadTypeContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  uploadTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadTypeCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    ...SHADOWS.medium,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: COLORS.primary,
  },
  uploadTypeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTypeTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  uploadTypeDescription: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    ...FONTS.body2,
  },
  textAreaInput: {
    minHeight: 120,
    paddingTop: 12,
  },
  uploadSection: {
    marginVertical: 24,
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    paddingVertical: 20,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 8,
  },
  uploadButtonText: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  uploadHint: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  primaryButtonText: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  secondaryButtonText: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
  },
});

export default UploadScreen;
