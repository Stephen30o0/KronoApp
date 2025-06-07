import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants
import { FONTS, SIZES } from '../../constants/theme';
import { useNotifications, NotificationType } from '../../context/NotificationContext';

const AddNotificationScreen = () => {
  const navigation = useNavigation();
  const { addNotification } = useNotifications();
  
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('system');
  const [avatar, setAvatar] = useState('');
  const [contentId, setContentId] = useState('');
  const [contentType, setContentType] = useState<'comic' | 'post' | 'idea' | undefined>('comic');
  
  const notificationTypes: NotificationType[] = ['like', 'comment', 'follow', 'mention', 'system', 'vote'];
  const contentTypes = ['comic', 'post', 'idea'];
  
  const handleSubmit = () => {
    if (!title || !message) {
      alert('Please fill in title and message fields');
      return;
    }
    
    addNotification({
      title,
      message,
      type,
      avatar: avatar || undefined,
      contentId: contentId || undefined,
      contentType: contentType as any || undefined,
    });
    
    navigation.goBack();
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Test Notification</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Notification title"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Notification message"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notification Type</Text>
          <View style={styles.typeContainer}>
            {notificationTypes.map((notificationType) => (
              <TouchableOpacity
                key={notificationType}
                style={[
                  styles.typeButton,
                  type === notificationType && styles.selectedTypeButton
                ]}
                onPress={() => setType(notificationType)}
              >
                <Text 
                  style={[
                    styles.typeButtonText,
                    type === notificationType && styles.selectedTypeButtonText
                  ]}
                >
                  {notificationType}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Avatar URL (optional)</Text>
          <TextInput
            style={styles.input}
            value={avatar}
            onChangeText={setAvatar}
            placeholder="https://example.com/avatar.jpg"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content ID (optional)</Text>
          <TextInput
            style={styles.input}
            value={contentId}
            onChangeText={setContentId}
            placeholder="comic-123"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content Type (optional)</Text>
          <View style={styles.typeContainer}>
            {contentTypes.map((cType) => (
              <TouchableOpacity
                key={cType}
                style={[
                  styles.typeButton,
                  contentType === cType && styles.selectedTypeButton
                ]}
                onPress={() => setContentType(cType as any)}
              >
                <Text 
                  style={[
                    styles.typeButtonText,
                    contentType === cType && styles.selectedTypeButtonText
                  ]}
                >
                  {cType}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  saveButton: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    color: COLORS.textPrimary,
    ...FONTS.body2,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  selectedTypeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  selectedTypeButtonText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
});

export default AddNotificationScreen;
