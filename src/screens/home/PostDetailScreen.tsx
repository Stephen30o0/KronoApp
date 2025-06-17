import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

// Adjust this import if your Post type is defined elsewhere and should be imported
// import { Post } from '../../types';
type Post = {
  id: string;
  username: string;
  avatar: string;
  caption: string;
  tags?: string[];
  comments: number;
  likes: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
  imageUrl?: string;
};

type PostDetailScreenRouteProp = RouteProp<{ PostDetailScreen: { post: Post } }, 'PostDetailScreen'>;

const PostDetailScreen: React.FC = () => {
  const route = useRoute<PostDetailScreenRouteProp>();
  const { post } = route.params;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
      </View>
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.image} />
      )}
      <Text style={styles.caption}>{post.caption}</Text>
      {post.tags && (
        <View style={styles.tagRow}>
          {post.tags.map((tag, idx) => (
            <Text key={idx} style={styles.tag}>#{tag}</Text>
          ))}
        </View>
      )}
      {/* Add like/comment/share/save or any other details as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  username: { fontWeight: 'bold', fontSize: 18 },
  timestamp: { color: '#888', fontSize: 12 },
  image: { width: '100%', height: 300, resizeMode: 'cover', marginVertical: 12 },
  caption: { fontSize: 16, margin: 16 },
  tagRow: { flexDirection: 'row', marginLeft: 16, marginBottom: 12 },
  tag: { color: '#007bff', marginRight: 8 },
});

export default PostDetailScreen;
