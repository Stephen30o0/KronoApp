import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONTS, SIZES } from '../../constants/theme';

const GoLiveScreen = () => {
  const navigation = useNavigation();
  const [streamTitle, setStreamTitle] = useState('');

  const handleGoLive = () => {
    if (!streamTitle.trim()) {
      Alert.alert('Title Required', 'Please enter a title for your stream.');
      return;
    }
    // In a real app, you would integrate with a streaming service (e.g., Mux, Agora)
    Alert.alert('Going Live!', `Your stream "${streamTitle}" is now live. (This is a simulation)`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Go Live</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Stream Title</Text>
        <TextInput
          style={styles.input}
          placeholder="What are you streaming today?"
          placeholderTextColor={COLORS.textSecondary}
          value={streamTitle}
          onChangeText={setStreamTitle}
        />

        <TouchableOpacity style={styles.goLiveButton} onPress={handleGoLive}>
          <Text style={styles.goLiveButtonText}>Start Live Stream</Text>
        </TouchableOpacity>
      </View>
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
  container: {
    flex: 1,
    padding: SIZES.large,
  },
  label: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SIZES.small,
  },
  input: {
    ...FONTS.body3,
    backgroundColor: COLORS.surface,
    color: COLORS.textPrimary,
    padding: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.large,
  },
  goLiveButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    alignItems: 'center',
  },
  goLiveButtonText: {
    ...FONTS.h3,
    color: COLORS.background,
  },
});

export default GoLiveScreen;
