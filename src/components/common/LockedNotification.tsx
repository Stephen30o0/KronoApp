import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../constants/theme';

interface LockedNotificationProps {
  visible: boolean;
  message: string;
  onFadeOut: () => void;
}

const LockedNotification: React.FC<LockedNotificationProps> = ({ visible, message, onFadeOut }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(fadeAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]).start(onFadeOut);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }] }>
      <View style={styles.inner}>
        <Ionicons name="lock-closed" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  inner: {
    backgroundColor: 'rgba(30,30,30,0.97)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default LockedNotification;
