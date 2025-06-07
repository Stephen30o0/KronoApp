import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants
import { FONTS, SIZES } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import NotificationBadge from '../common/NotificationBadge';
import { useNotifications } from '../../context/NotificationContext';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { unreadCount } = useNotifications();
  
  return (
    <DrawerContentScrollView 
      {...props} 
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      <LinearGradient
        colors={[COLORS.background, COLORS.surface]}
        style={styles.backgroundGradient}
      />
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="infinite" size={32} color={COLORS.primary} />
          <Text style={styles.appName}>KronoLabs</Text>
        </View>
        
        {/* Balance Section */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>KLT Balance</Text>
            <Text style={styles.balanceAmount}>50 KLT</Text>
          </View>
          <TouchableOpacity style={styles.topUpButton}>
            <Ionicons name="add-circle" size={16} color={COLORS.textPrimary} style={{marginRight: 4}} />
            <Text style={styles.topUpText}>Top Up</Text>
          </TouchableOpacity>
        </View>
        
        {/* Drawer Items */}
        <ScrollView style={styles.drawerItems}>
          {/* Custom drawer items with notification badge */}
          {props.state.routes.map((route: any, index: number) => {
            const { options } = props.descriptors[route.key];
            const label = options.title || route.name;
            const isFocused = props.state.index === index;
            
            // Check if this is the notifications route
            const isNotificationsRoute = route.name === 'Notifications';
            
            return (
              <TouchableOpacity
                key={route.key}
                style={[
                  styles.drawerItem,
                  isFocused && styles.activeDrawerItem
                ]}
                onPress={() => props.navigation.navigate(route.name)}
              >
                <View style={styles.drawerItemContent}>
                  {options.drawerIcon && 
                    <View style={styles.iconContainer}>
                      {options.drawerIcon({ 
                        color: isFocused ? COLORS.primary : COLORS.textSecondary, 
                        size: 22,
                        focused: isFocused
                      })}
                      {isNotificationsRoute && unreadCount > 0 && (
                        <NotificationBadge size="small" position="top-right" />
                      )}
                    </View>
                  }
                  <Text 
                    style={[
                      styles.drawerItemLabel,
                      isFocused && styles.activeDrawerItemLabel
                    ]}
                  >
                    {label}
                  </Text>
                </View>
                
                {/* Show notification count for Notifications route */}
                {isNotificationsRoute && unreadCount > 0 && (
                  <View style={styles.notificationCountContainer}>
                    <Text style={styles.notificationCount}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        
        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.footerButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  appName: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
    backgroundColor: COLORS.backgroundLight,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  userHandle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.divider,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 16,
    marginBottom: 8,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  balanceAmount: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  topUpButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  topUpText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  drawerItems: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 32,
    position: 'relative',
  },
  activeDrawerItem: {
    backgroundColor: `${COLORS.primary}15`, // 15% opacity
  },
  drawerItemLabel: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  activeDrawerItemLabel: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  notificationCountContainer: {
    backgroundColor: COLORS.like,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notificationCount: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButtonText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
});

export default CustomDrawerContent;
