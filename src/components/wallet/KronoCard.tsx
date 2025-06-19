import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../common/Logo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

const KronoCard = () => {
  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.accent1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Logo size={30} />
        <Text style={styles.cardTitle}>KronoLabs</Text>
      </View>
      <View style={styles.cardBody}>
        <Ionicons name="hardware-chip-outline" size={40} color={COLORS.textPrimary} style={styles.chipIcon} />
        <Text style={styles.cardNumber}>**** **** **** 1234</Text>
      </View>
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.footerLabel}>Card Holder</Text>
          <Text style={styles.footerValue}>Jane Doe</Text>
        </View>
        <View>
          <Text style={styles.footerLabel}>Expires</Text>
          <Text style={styles.footerValue}>12/28</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  cardTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginLeft: SIZES.small,
  },
  cardBody: {
    alignItems: 'flex-start',
    marginBottom: SIZES.large,
  },
  chipIcon: {
    marginBottom: SIZES.small,
    transform: [{ rotate: '90deg' }],
  },
  cardNumber: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLabel: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  footerValue: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
});

export default KronoCard;
