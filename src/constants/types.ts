export interface Comment {
  id: string;
  user: string;
  avatar: string;
  note: string;
  time: string;
  likes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  username: string;
  avatar?: string;
  caption: string;
  tags?: string[];
  comments: number; // Keep this for the count
  commentData?: Comment[]; // Add this for the actual comment objects
  likes: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  imageUrl?: string;
}
