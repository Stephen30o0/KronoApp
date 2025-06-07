import { AccessibilityInfo, Platform } from 'react-native';

// Accessibility utility functions
const accessibility = {
  /**
   * Check if screen reader is enabled
   * @returns Promise resolving to boolean
   */
  isScreenReaderEnabled: async (): Promise<boolean> => {
    return await AccessibilityInfo.isScreenReaderEnabled();
  },

  /**
   * Check if reduce motion is enabled
   * @returns Promise resolving to boolean
   */
  isReduceMotionEnabled: async (): Promise<boolean> => {
    return await AccessibilityInfo.isReduceMotionEnabled();
  },

  /**
   * Announce a message to screen readers
   * @param message The message to announce
   */
  announce: (message: string): void => {
    AccessibilityInfo.announceForAccessibility(message);
  },

  /**
   * Get accessibility props for a button
   * @param label Accessibility label
   * @param hint Accessibility hint
   * @returns Accessibility props
   */
  getButtonProps: (label: string, hint?: string) => ({
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'button' as const,
    accessibilityState: { disabled: false },
  }),

  /**
   * Get proper accessibility props for images
   * @param description The image description
   * @returns Object with accessibility props
   */
  getImageProps: (description: string) => {
    return {
      accessible: true,
      accessibilityLabel: description,
      accessibilityRole: 'image',
    };
  },

  /**
   * Get proper accessibility props for text inputs
   * @param label The input label
   * @param error Error message if any
   * @returns Object with accessibility props
   */
  getTextInputProps: (label: string, error?: string) => {
    return {
      accessible: true,
      accessibilityLabel: label,
      accessibilityHint: error ? `Error: ${error}` : undefined,
      accessibilityRole: 'text',
      accessibilityState: { 
        disabled: false,
        invalid: !!error,
      },
    };
  },

  /**
   * Get proper accessibility props for headers
   * @param text The header text
   * @param level The header level (1-6)
   * @returns Object with accessibility props
   */
  getHeaderProps: (text: string, level: 1 | 2 | 3 | 4 | 5 | 6) => {
    return {
      accessible: true,
      accessibilityLabel: text,
      accessibilityRole: 'header',
      accessibilityTraits: 'header',
      accessibilityLevel: level,
    };
  },

  /**
   * Get proper accessibility props for toggles
   * @param label The toggle label
   * @param isOn Whether the toggle is on
   * @returns Object with accessibility props
   */
  getToggleProps: (label: string, isOn: boolean) => {
    return {
      accessible: true,
      accessibilityLabel: label,
      accessibilityRole: 'switch',
      accessibilityState: { checked: isOn },
      accessibilityHint: isOn ? 'Double tap to turn off' : 'Double tap to turn on',
    };
  },

  /**
   * Get proper accessibility props for tabs
   * @param label The tab label
   * @param isSelected Whether the tab is selected
   * @returns Object with accessibility props
   */
  getTabProps: (label: string, isSelected: boolean) => {
    return {
      accessible: true,
      accessibilityLabel: label,
      accessibilityRole: 'tab',
      accessibilityState: { selected: isSelected },
      accessibilityHint: isSelected ? 'Current tab' : 'Double tap to switch to this tab',
    };
  },
};

export default accessibility;
