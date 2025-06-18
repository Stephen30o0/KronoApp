import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { Post } from '../../constants/types';

const { height } = Dimensions.get('window');

const PostFeedScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { posts, startIndex } = route.params;

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{item.username}</Text>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name={item.isLiked ? 'heart' : 'heart-outline'} size={28} color={item.isLiked ? COLORS.error : COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="send-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name={item.isBookmarked ? 'bookmark' : 'bookmark-outline'} size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      <View style={styles.captionContainer}>
        <Text style={styles.likes}>{`${item.likes.toLocaleString()} likes`}</Text>
        <Text style={styles.caption}>{item.caption}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Posts</Text>
        <View style={{ width: 28 }} />
      </View>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        initialScrollIndex={startIndex}
        getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  headerTitle: { ...FONTS.h3, color: COLORS.textPrimary },
  postContainer: {
    height: height - 150, // Adjust as needed based on header/footer height
    backgroundColor: COLORS.background,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.medium,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.small,
  },
  username: { ...FONTS.h4, color: COLORS.textPrimary },
  postImage: {
    width: '100%',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
  },
  actionButton: {
    marginRight: SIZES.medium,
  },
  captionContainer: {
    paddingHorizontal: SIZES.medium,
  },
  likes: { ...FONTS.body3, fontWeight: 'bold', color: COLORS.textPrimary },
  caption: { ...FONTS.body3, color: COLORS.textSecondary, marginTop: 4 },
});

export default PostFeedScreen;
