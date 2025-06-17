import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

// Mock data for users
const USERS = [
  { id: '1', name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '3', name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: '4', name: 'Emily White', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: '5', name: 'Chris Brown', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
];

const NewChatScreen = () => {
  const navigation = useNavigation();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const renderUserItem = ({ item }: { item: typeof USERS[0] }) => {
    const isSelected = selectedUsers.includes(item.id);
    return (
      <TouchableOpacity style={styles.userItem} onPress={() => toggleUserSelection(item.id)}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{item.name}</Text>
        <View style={styles.checkbox}>
          {isSelected && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={{ width: 28 }} />
      </View>

      <TextInput
        placeholder="Search for people..."
        placeholderTextColor={COLORS.textSecondary}
        style={styles.searchInput}
      />

      <FlatList
        data={USERS}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
      />

      {selectedUsers.length > 0 && (
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>
            {selectedUsers.length > 1 ? `Create Group Chat` : `Start Chat`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SIZES.medium },
  headerTitle: { ...FONTS.h3, color: COLORS.textPrimary },
  searchInput: { backgroundColor: COLORS.surface, borderRadius: SIZES.radiusMedium, padding: SIZES.medium, margin: SIZES.medium, ...FONTS.body3, color: COLORS.textPrimary },
  userItem: { flexDirection: 'row', alignItems: 'center', padding: SIZES.medium },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: SIZES.medium },
  userName: { ...FONTS.body2, color: COLORS.textPrimary, flex: 1 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  createButton: { backgroundColor: COLORS.primary, padding: SIZES.medium, margin: SIZES.medium, borderRadius: SIZES.radiusMedium, alignItems: 'center' },
  createButtonText: { ...FONTS.button, color: COLORS.textPrimary },
});

export default NewChatScreen;
