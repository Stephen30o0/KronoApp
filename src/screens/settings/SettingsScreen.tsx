import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    darkMode: true,
    notifications: true,
    emailNotifications: false,
    autoPlay: true,
    dataUsage: 'standard',
    language: 'English',
  });

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const toggleSetting = (setting: string) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: !prevSettings[setting as keyof typeof prevSettings],
    }));
  };

  const setDataUsage = (value: string) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      dataUsage: value,
    }));
  };

  const renderSettingSwitch = (title: string, description: string, setting: string) => {
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        <Switch
          value={settings[setting as keyof typeof settings] as boolean}
          onValueChange={() => toggleSetting(setting)}
          trackColor={{ false: COLORS.surface, true: COLORS.primary }}
          thumbColor={COLORS.textPrimary}
        />
      </View>
    );
  };

  const renderRadioSetting = (title: string, options: string[], currentValue: string, onSelect: (value: string) => void) => {
    return (
      <View style={styles.radioSettingContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <View style={styles.radioOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.radioOption}
              onPress={() => onSelect(option)}
            >
              <View style={styles.radioButton}>
                {currentValue === option && <View style={styles.radioButtonSelected} />}
              </View>
              <Text style={styles.radioOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
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
        
        <Text style={styles.headerTitle}>Settings</Text>
        
        <View style={{ width: 28 }} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          {renderSettingSwitch(
            'Dark Mode',
            'Use dark theme throughout the app',
            'darkMode'
          )}
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Theme</Text>
              <Text style={styles.settingDescription}>Choose app color theme</Text>
            </View>
            <View style={styles.settingValue}>
              <View style={styles.themeIndicator} />
              <Text style={styles.settingValueText}>Purple</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Text Size</Text>
              <Text style={styles.settingDescription}>Adjust text size throughout the app</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>Medium</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          {renderSettingSwitch(
            'Push Notifications',
            'Receive notifications on your device',
            'notifications'
          )}
          
          {renderSettingSwitch(
            'Email Notifications',
            'Receive notifications via email',
            'emailNotifications'
          )}
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notification Preferences</Text>
              <Text style={styles.settingDescription}>Choose which notifications to receive</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        
        {/* Content & Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content & Media</Text>
          
          {renderSettingSwitch(
            'Auto-Play Videos',
            'Automatically play videos while scrolling',
            'autoPlay'
          )}
          
          {renderRadioSetting(
            'Data Usage',
            ['Low', 'Standard', 'High'],
            settings.dataUsage,
            setDataUsage
          )}
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Download Quality</Text>
              <Text style={styles.settingDescription}>Set quality for downloaded content</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>High</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Personal Information</Text>
              <Text style={styles.settingDescription}>Manage your personal details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Password & Security</Text>
              <Text style={styles.settingDescription}>Update password and security settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Payment Methods</Text>
              <Text style={styles.settingDescription}>Manage your payment options</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Subscription</Text>
              <Text style={styles.settingDescription}>Manage your subscription plan</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={[styles.settingValueText, { color: COLORS.primary }]}>Premium</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Language & Region */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language & Region</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={styles.settingDescription}>Set your preferred language</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>English</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Region</Text>
              <Text style={styles.settingDescription}>Set your region for content</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={styles.settingValueText}>United States</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Help Center</Text>
              <Text style={styles.settingDescription}>Get help with using the app</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Contact Support</Text>
              <Text style={styles.settingDescription}>Get in touch with our support team</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>Read our privacy policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
              <Text style={styles.settingDescription}>Read our terms of service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        
        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>App Version</Text>
              <Text style={styles.settingDescription}>Current version information</Text>
            </View>
            <Text style={styles.settingValueText}>1.0.0</Text>
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#F44336" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 KronoLabs</Text>
        </View>
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
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    ...FONTS.body1,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  themeIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  radioSettingContainer: {
    marginBottom: 16,
  },
  radioOptions: {
    marginTop: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioOptionText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  logoutText: {
    ...FONTS.body1,
    color: '#F44336',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
  },
});

export default SettingsScreen;
