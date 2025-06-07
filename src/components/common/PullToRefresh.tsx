import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, ActivityIndicator, FlatList, FlatListProps } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import haptics from '../../utils/haptics';

type FlatListPullToRefreshProps<T> = {
  onRefresh: () => Promise<void>;
  isFlatList: true;
  data: Array<T>;
  renderItem: ({ item }: { item: T }) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
  isLoadingMore?: boolean;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  showsVerticalScrollIndicator?: boolean;
};

type ScrollViewPullToRefreshProps = {
  onRefresh: () => Promise<void>;
  isFlatList?: false;
  children: React.ReactNode;
  isLoadingMore?: boolean;
};

type PullToRefreshProps = FlatListPullToRefreshProps<any> | ScrollViewPullToRefreshProps;

const PullToRefresh = (props: PullToRefreshProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  const handleRefresh = async () => {
    haptics.light();
    setRefreshing(true);
    await props.onRefresh();
    setRefreshing(false);
  };

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
      progressBackgroundColor={colors.surface}
      progressViewOffset={80} // Add offset to only trigger at the top
      enabled={true}
    />
  );

  // Loading indicator for infinite scrolling
  const loadingIndicator = (
    <View style={styles.loadingFooter}>
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );

  // If using as a FlatList wrapper
  if ('isFlatList' in props && props.isFlatList) {
    return (
      <FlatList
        data={props.data}
        renderItem={props.renderItem}
        keyExtractor={props.keyExtractor}
        ListHeaderComponent={props.ListHeaderComponent}
        ListEmptyComponent={props.ListEmptyComponent}
        ListFooterComponent={
          props.isLoadingMore ? loadingIndicator : props.ListFooterComponent
        }
        onEndReached={props.onEndReached}
        onEndReachedThreshold={props.onEndReachedThreshold || 0.5}
        showsVerticalScrollIndicator={props.showsVerticalScrollIndicator}
        refreshControl={refreshControl}
      />
    );
  }
  
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={refreshControl}
    >
      {props.children}
      
      {props.isLoadingMore && loadingIndicator}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PullToRefresh;
