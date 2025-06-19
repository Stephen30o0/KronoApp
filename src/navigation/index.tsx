import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../constants/colors';
// Import other theme constants
import CustomDrawerContent from '../components/navigation/CustomDrawerContent';
import { FONTS, SIZES } from '../constants/theme';

// Import navigation types
import {
  AuthStackParamList,
  DrawerParamList,
  MainTabParamList,
  MessagesStackParamList,
  RootStackParamList
} from './types';

// Auth Screens
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import GetStartedScreen from '../screens/auth/GetStartedScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import BookmarksScreen from '../screens/bookmarks/BookmarksScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ComicDetailScreen from '../screens/comics/ComicDetailScreen';
import ComicReaderScreen from '../screens/comics/ComicReaderScreen';
import CommentsScreen from '../screens/comments/CommentsScreen';
import CreatorDashboardScreen from '../screens/CreatorDashboardScreen';
import DetailsScreen from '../screens/details/DetailsScreen';
import ExploreScreen from '../screens/explore/ExploreScreen';
import GoLiveScreen from '../screens/golive/GoLiveScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import { HomeScreen } from '../screens/home';
import PostDetailScreen from '../screens/home/PostDetailScreen';
import IdeasScreen from '../screens/ideas/IdeasScreen';
import LeaderboardScreen from '../screens/leaderboard/LeaderboardScreen';
import { LibraryScreen } from '../screens/library';
import { MessagesScreen } from '../screens/messages';
import ShareModal from '../screens/modals/ShareModal';
import AddNotificationScreen from '../screens/notifications/AddNotificationScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import PostFeedScreen from '../screens/post/PostFeedScreen';
import { ProfileScreen } from '../screens/profile';
import SettingsScreen from '../screens/settings/SettingsScreen';
import MainSplashScreen from '../screens/splash/SplashScreen';
import { StreamScreen } from '../screens/stream';
import SupportScreen from '../screens/support/SupportScreen';
import { TownSquareScreen } from '../screens/townsquare';
import UploadScreen from '../screens/upload/UploadScreen';
import { WalletScreen } from '../screens/wallet';
import WatchPartyScreen from '../screens/watchparty/WatchPartyScreen';

// Components
import { useAuth } from '../context/AuthContext';
import AnalyticsScreen from '../screens/creator/AnalyticsScreen';
import NewProjectScreen from '../screens/creator/NewProjectScreen';
import PayoutsScreen from '../screens/creator/PayoutsScreen';
import NewChatScreen from '../screens/messages/NewChatScreen';

// Create navigators
const RootStack = createStackNavigator<RootStackParamList>();


const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();
const MessagesStack = createStackNavigator<MessagesStackParamList>();

// Custom TabBar component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = isFocused ? 'home' : 'home-outline';
            break;
          case 'Library':
            iconName = isFocused ? 'library' : 'library-outline';
            break;
          case 'TownSquare':
            iconName = isFocused ? 'people' : 'people-outline';
            break;
          case 'Stream':
            iconName = isFocused ? 'play-circle' : 'play-circle-outline';
            break;
          case 'Wallet':
            iconName = isFocused ? 'wallet' : 'wallet-outline';
            break;
          case 'Profile':
            iconName = isFocused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'ellipsis-horizontal';
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconName as any}
              size={24}
              color={isFocused ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <AuthStack.Screen name="GetStarted" component={GetStartedScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// Messages Navigator
const MessagesNavigator = () => {
  return (
    <MessagesStack.Navigator
      initialRouteName="MessagesList"
      screenOptions={{ headerShown: false }}
    >
      <MessagesStack.Screen name="MessagesList" component={MessagesScreen} />
      <MessagesStack.Screen name="Chat" component={ChatScreen} />
      <MessagesStack.Screen name="NewChat" component={NewChatScreen} />
    </MessagesStack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <MainTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Library" component={LibraryScreen} />
      <MainTab.Screen name="TownSquare" component={TownSquareScreen} />
      <MainTab.Screen name="Stream" component={StreamScreen} />
      <MainTab.Screen name="Wallet" component={WalletScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
};

// Drawer Navigator
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: `${COLORS.primary}15`,
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.textSecondary,
        drawerLabelStyle: FONTS.body2,
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{
          title: 'Home',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={MessagesNavigator}
        options={{
          title: 'Messages',
          drawerIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          drawerIcon: ({ color }) => (
            <Ionicons name="search-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          title: 'Upload',
          drawerIcon: ({ color }) => (
            <Ionicons name="cloud-upload-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="MyIdeas"
        component={IdeasScreen}
        options={{
          title: 'My Ideas',
          drawerIcon: ({ color }) => (
            <Ionicons name="bulb-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CreatorDashboard"
        component={CreatorDashboardScreen}
        options={{
          title: 'Creator Dashboard',
          drawerIcon: ({ color }) => (
            <Ionicons name="stats-chart-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          title: 'Leaderboard',
          drawerIcon: ({ color }) => (
            <Ionicons name="trophy-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          drawerIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          title: 'My Bookmarks',
          drawerIcon: ({ color }) => (
            <Ionicons name="bookmark-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          title: 'Wallet',
          drawerIcon: ({ color }) => (
            <Ionicons name="wallet-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Support"
        component={SupportScreen}
        options={{
          title: 'Support Chat',
          drawerIcon: ({ color }) => (
            <Ionicons name="help-circle-outline" size={22} color={color} />
          ),
        }}
      />

    </Drawer.Navigator>
  );
};

// Root Navigator
export const RootNavigator = () => {
  const { userToken, isLoading } = useAuth();
  const [isSplashVisible, setIsSplashVisible] = React.useState(true);

  React.useEffect(() => {
    // Hide splash screen after a delay
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 3500); // Match this with the timing in the SplashScreen component
    
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return (
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={MainSplashScreen} />
      </RootStack.Navigator>
    );
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      {userToken == null ? (
        // No token found, user isn't signed in
        <>
          <RootStack.Screen name="Auth" component={AuthNavigator} options={{ animationTypeForReplace: userToken ? 'push' : 'pop' }} />
        </>
      ) : (
        // User is signed in
        <>
          <RootStack.Screen name="MainApp" component={DrawerNavigator} />
          <RootStack.Screen name="Comments" component={CommentsScreen} />
          <RootStack.Screen name="AddNotification" component={AddNotificationScreen} />
          <RootStack.Screen name="ComicDetail" component={ComicDetailScreen} options={{ presentation: 'modal', headerShown: false }} />
          <RootStack.Screen name="ComicReader" component={ComicReaderScreen} options={{ headerShown: false }} />
          <RootStack.Screen name="ShareModal" component={ShareModal} options={{ presentation: 'modal', headerShown: false }} />
          <RootStack.Screen name="AchievementDetail" component={MainTabNavigator} options={{ presentation: 'modal' }} />
          <RootStack.Screen name="EditProfile" component={MainTabNavigator} />
          <RootStack.Screen name="FollowersList" component={MainTabNavigator} />
          <RootStack.Screen name="FollowingList" component={MainTabNavigator} />
          <RootStack.Screen name="PostDetailScreen" component={PostDetailScreen} />
          <RootStack.Screen name="Settings" component={SettingsScreen} />
          <RootStack.Screen name="NewProject" component={NewProjectScreen} />
          <RootStack.Screen name="Analytics" component={AnalyticsScreen} />
          <RootStack.Screen name="Payouts" component={PayoutsScreen} />
          <RootStack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
          <RootStack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
          <RootStack.Screen name="GoLive" component={GoLiveScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <RootStack.Screen name="WatchParty" component={WatchPartyScreen} options={{ headerShown: false, presentation: 'modal' }} />
          <RootStack.Screen name="PostFeed" component={PostFeedScreen} options={{ presentation: 'modal', headerShown: false }} />
        </>
      )}
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: SIZES.bottomTabHeight,
    backgroundColor: COLORS.surface,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: 40,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

// Export the navigators
export { AuthNavigator, DrawerNavigator, MainTabNavigator, MessagesNavigator };

