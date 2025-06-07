import React from 'react';
import { StyleSheet } from 'react-native';
import ProfileScreen from '../../src/screens/profile/ProfileScreen';
import { COLORS } from '../../src/constants/theme';

export default function ProfileTab() {
  return <ProfileScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
