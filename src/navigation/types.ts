// Navigation types for the app
import { NavigatorScreenParams } from '@react-navigation/native';
import { Post } from '../constants/types';

import { Comment } from '../components/comments/CommentItem';

export type RootStackParamList = {
  PostFeed: { posts: Post[]; startIndex: number };
  Splash: undefined;
  Auth: undefined;
  MainApp: NavigatorScreenParams<DrawerParamList>;
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
  PostDetailScreen: { post: Post };
  Details: { streamId: string };
  History: undefined;
  GoLive: undefined;
  WatchParty: { streamTitle: string };
  Settings: undefined;
  NewProject: undefined;
  Analytics: undefined;
  Payouts: undefined;
  Comments: {
    comments: Comment[];
    onSendComment: (text: string, parentId?: string) => void;
    onLikeComment: (commentId: string) => void;
    currentUserAvatar: string;
    onClose: () => void;
  };
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
};

export type ChatItem = {
  id: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isGroup?: boolean;
};

export type MessagesStackParamList = {
  MessagesList: undefined;
  Chat: { chatId: string; userName: string; userAvatar: string; isGroup?: boolean };
  NewChat: undefined;
};
