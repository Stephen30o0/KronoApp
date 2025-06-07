import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Haptic feedback utility functions
const haptics = {
  /**
   * Light impact feedback for subtle interactions
   * Use for: Button presses, selection changes, toggling UI elements
   */
  light: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  },

  /**
   * Medium impact feedback for standard interactions
   * Use for: Completing actions, confirming selections, submitting forms
   */
  medium: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  },

  /**
   * Heavy impact feedback for significant interactions
   * Use for: Important actions, major state changes, completing transactions
   */
  heavy: () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  },

  /**
   * Success feedback
   * Use for: Successful operations, confirmations, positive outcomes
   */
  success: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  },

  /**
   * Warning feedback
   * Use for: Warnings, alerts, attention-requiring situations
   */
  warning: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  },

  /**
   * Error feedback
   * Use for: Errors, failures, invalid inputs
   */
  error: () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  },

  /**
   * Selection feedback
   * Use for: Selection changes in pickers, sliders, etc.
   */
  selection: () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  }
};

export default haptics;
