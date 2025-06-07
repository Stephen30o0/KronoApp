import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../constants/theme';

// Sample data for ideas
const SAMPLE_IDEAS = [
  {
    id: '1',
    title: 'Cyberpunk Detective Series',
    description: 'A noir detective story set in a cyberpunk future where memories can be bought and sold.',
    tags: ['cyberpunk', 'noir', 'detective'],
    createdAt: '2 days ago',
    status: 'draft',
  },
  {
    id: '2',
    title: 'Fantasy World Building',
    description: 'A high fantasy setting with unique magic system based on musical notes and vibrations.',
    tags: ['fantasy', 'magic', 'worldbuilding'],
    createdAt: '1 week ago',
    status: 'in-progress',
  },
  {
    id: '3',
    title: 'Space Opera Epic',
    description: 'A multi-generational saga spanning galaxies with themes of family, loyalty, and betrayal.',
    tags: ['sci-fi', 'space', 'epic'],
    createdAt: '2 weeks ago',
    status: 'draft',
  },
  {
    id: '4',
    title: 'Historical Fiction Anthology',
    description: 'Short stories set in pivotal moments of history with slight supernatural elements.',
    tags: ['historical', 'anthology', 'supernatural'],
    createdAt: '1 month ago',
    status: 'completed',
  },
];

const IdeasScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const filteredIdeas = SAMPLE_IDEAS.filter(idea => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply status filter
    const matchesStatus = filter === 'all' || idea.status === filter;
    
    return matchesSearch && matchesStatus;
  });

  const renderIdeaItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.ideaCard}>
        <View style={styles.ideaHeader}>
          <Text style={styles.ideaTitle}>{item.title}</Text>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
          </View>
        </View>
        
        <Text style={styles.ideaDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.ideaFooter}>
          <Text style={styles.timestamp}>{item.createdAt}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="create-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="trash-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'draft':
        return styles.statusDraft;
      case 'in-progress':
        return styles.statusInProgress;
      case 'completed':
        return styles.statusCompleted;
      default:
        return {};
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Ideas</Text>
        
        <TouchableOpacity>
          <Ionicons name="add-circle" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ideas..."
            placeholderTextColor={COLORS.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.activeFilterButton]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'draft' && styles.activeFilterButton]}
          onPress={() => setFilter('draft')}
        >
          <Text style={[styles.filterText, filter === 'draft' && styles.activeFilterText]}>Drafts</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'in-progress' && styles.activeFilterButton]}
          onPress={() => setFilter('in-progress')}
        >
          <Text style={[styles.filterText, filter === 'in-progress' && styles.activeFilterText]}>In Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'completed' && styles.activeFilterButton]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>Completed</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredIdeas}
        renderItem={renderIdeaItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>No ideas found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
      
      <TouchableOpacity style={styles.fabButton}>
        <Ionicons name="add" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    ...FONTS.body2,
    marginLeft: 8,
    paddingVertical: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  activeFilterText: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  ideaCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  ideaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ideaTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDraft: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  statusInProgress: {
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  statusText: {
    ...FONTS.caption,
    fontWeight: 'bold',
  },
  ideaDescription: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  ideaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    ...FONTS.body2,
    color: COLORS.textTertiary,
    marginTop: 8,
  },
});

export default IdeasScreen;
