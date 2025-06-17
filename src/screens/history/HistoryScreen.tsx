import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

type HistoryItem = {
  id: string;
  title: string;
  lastWatched: string;
  thumbnail: string;
  streamId: string;
};

const mockHistory: HistoryItem[] = [
  {
    id: 'h1',
    title: 'The Recruit',
    lastWatched: 'Watched yesterday',
    thumbnail: 'https://image.tmdb.org/t/p/w500/rJHCiE1J1mI0N2i22d02xM2cJpG.jpg',
    streamId: 's1-0',
  },
  {
    id: 'h2',
    title: 'Black Mirror',
    lastWatched: 'Watched 2 days ago',
    thumbnail: 'https://image.tmdb.org/t/p/w500/5UaYsGZOFhjh6FSA3g8oQ9p22N3.jpg',
    streamId: 's2-0',
  },
  {
    id: 'h3',
    title: 'Stranger Things',
    lastWatched: 'Watched last week',
    thumbnail: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    streamId: 's3-0',
  },
];

const HistoryScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const renderHeader = () => (
    <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Watch History</Text>
        <View style={{ width: 28 }} />
    </View>
  );

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigation.navigate('Details', { streamId: item.streamId })}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.lastWatched}</Text>
      </View>
      <Ionicons name="play-circle-outline" size={28} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {renderHeader()}
      <FlatList
        data={mockHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  backButton: {
      padding: SIZES.small,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  listContainer: {
    padding: SIZES.medium,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  thumbnail: {
    width: 120,
    height: 70,
    borderRadius: SIZES.radiusSmall,
    marginRight: SIZES.medium,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
  },
  itemSubtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

export default HistoryScreen;
