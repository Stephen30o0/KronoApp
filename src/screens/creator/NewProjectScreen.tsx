import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const NewProjectScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Project</Text>
        <View style={{ width: 50 }} />
      </View>
      <View style={styles.container}>
        <Ionicons name="construct-outline" size={80} color={COLORS.primary} />
        <Text style={styles.placeholderText}>New Project Screen</Text>
        <Text style={styles.placeholderSubtitle}>This section is under construction.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacingMedium,
    paddingTop: SIZES.spacingSmall,
  },
  headerButton: { padding: SIZES.base },
  headerTitle: { ...FONTS.h2, color: COLORS.textPrimary },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.spacingLarge,
  },
  placeholderText: { ...FONTS.h1, color: COLORS.textPrimary, marginTop: SIZES.spacingMedium },
  placeholderSubtitle: { ...FONTS.body2, color: COLORS.textSecondary, marginTop: SIZES.spacingSmall, textAlign: 'center' },
});

export default NewProjectScreen;
