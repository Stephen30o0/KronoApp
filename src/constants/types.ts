export interface Post {
  id: string;
  username: string;
  avatar: string;
  caption: string;
  tags: string[];
  comments: number;
  likes: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  imageUrl: string;
}
