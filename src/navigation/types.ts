// Navigation types for the app
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainApp: undefined;
  AddNotification: undefined;
  ComicDetail: { id: string };
  ComicReader: { comicId: string };
  ShareModal: { 
    type?: string;
    userId?: string;
    username?: string;
    postId?: string;
    postContent?: string;
    postImage?: string;
    userName?: string;
  };
  AchievementDetail: { id: string };
  EditProfile: undefined;
  FollowersList: { userId: string };
  FollowingList: { userId: string };
};

export type AuthStackParamList = {
  GetStarted: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  TownSquare: undefined;
  Stream: undefined;
  Wallet: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Messages: undefined;
  Explore: undefined;
  Upload: undefined;
  MyIdeas: undefined;
  CreatorDashboard: undefined;
  Leaderboard: undefined;
  Notifications: undefined;
  AddNotification: undefined;
  Bookmarks: undefined;
  Wallet: undefined;
  Support: undefined;
  Settings: undefined;
};

export type MessagesStackParamList = {
  MessagesList: undefined;
  Chat: { chatId: string; userName: string; userAvatar: string };
};
