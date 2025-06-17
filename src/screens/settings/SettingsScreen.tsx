import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline', label: 'Edit Profile', screen: 'EditProfile' },
      { icon: 'notifications-outline', label: 'Notifications', screen: 'Notifications' },
      { icon: 'lock-closed-outline', label: 'Security', screen: 'Security' },
    ],
  },
  {
    title: 'Support & About',
    items: [
      { icon: 'help-circle-outline', label: 'Help & Support', screen: 'Help' },
      { icon: 'information-circle-outline', label: 'About KronoLabs', screen: 'About' },
    ],
  },
];

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => console.log('User logged out') },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Settings</Text>
      <View style={styles.headerButton} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {menuSections.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <TouchableOpacity key={item.label} style={styles.menuItem}>
                <View style={styles.menuItemContent}>
                  <Ionicons name={item.icon} size={24} color={COLORS.textSecondary} style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  headerButton: {
    width: 40,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  scrollViewContent: {
    paddingBottom: SIZES.large,
  },
  menuSection: {
    marginTop: SIZES.medium,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    marginHorizontal: SIZES.large,
    marginBottom: SIZES.small,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.large,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: SIZES.medium,
  },
  menuItemText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.medium,
    margin: SIZES.medium,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
  },
  logoutButtonText: {
    ...FONTS.h4,
    color: COLORS.error,
    marginLeft: SIZES.small,
  },
});

export default SettingsScreen;
