import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Animated
} from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

interface ProfileTabsProps {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
  scrollY: Animated.Value;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  tabs,
  activeTab,
  onTabPress,
  scrollY
}) => {
  // Animated values for tabs container
  const tabsElevation = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 5],
    extrapolate: 'clamp'
  });

  const tabsBackgroundColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['transparent', COLORS.background],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          elevation: tabsElevation,
          backgroundColor: tabsBackgroundColor,
          shadowOpacity: scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 0.2],
            extrapolate: 'clamp'
          })
        }
      ]}
    >
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => onTabPress(tab)}
            activeOpacity={0.7}
          >
            <Text 
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    zIndex: 1,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
    position: 'relative',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    ...FONTS.body2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default ProfileTabs;
