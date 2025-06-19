import { Dimensions } from 'react-native';

// Import all color definitions from the dedicated colors.js file
// This avoids duplicating color definitions and potential inconsistencies
import { COLORS, DARK_COLORS, LIGHT_COLORS } from './colors';

const { width, height } = Dimensions.get('window');

// Theme types
export type ThemeMode = 'dark' | 'light';

// Re-export the color constants to maintain backward compatibility
export { COLORS, DARK_COLORS, LIGHT_COLORS };

// Size constants
export const SIZES = {
  // Global sizes
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,
  
  // Screen dimensions
  width,
  height,
  
  // Radius
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 16,
  radiusXLarge: 24,
  radiusCircular: 999,
  
  // Spacing
  spacingTiny: 4,
  spacingSmall: 8,
  spacingMedium: 16,
  spacingLarge: 24,
  spacingXLarge: 32,
  spacingXXLarge: 48,
  
  // Icon sizes
  iconSmall: 16,
  iconMedium: 24,
  iconLarge: 32,
  
  // Button sizes
  buttonHeight: 48,
  buttonRadius: 8,
  
  // Input sizes
  inputHeight: 48,
  inputRadius: 8,
  
  // Card sizes
  cardRadius: 16,
  cardPadding: 16,
  
  // Avatar sizes
  avatarSmall: 32,
  avatarMedium: 48,
  avatarLarge: 64,
  
  // Bottom tab height
  bottomTabHeight: 64, // Slightly increased to avoid interference with phone gestures
};

// Font styles
// Define shadow styles for different elevations
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const FONTS = {
  // Font weights
  light: {
    fontFamily: 'System',
    fontWeight: '300' as const,
  },
  regular: {
    fontFamily: 'System',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as const,
  },
  semiBold: {
    fontFamily: 'System',
    fontWeight: '600' as const,
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700' as const,
  },
  
  // Font sizes
  caption: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 12,
    lineHeight: 16,
  },
  body3: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 14,
    lineHeight: 20,
  },
  body2: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 16,
    lineHeight: 24,
  },
  body1: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 18,
    lineHeight: 26,
  },
  h6: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 14,
    lineHeight: 20,
  },
  h5: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 16,
    lineHeight: 24,
  },
  h4: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 18,
    lineHeight: 26,
  },
  h3: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 22,
    lineHeight: 30,
  },
  h2: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 26,
    lineHeight: 32,
  },
  h1: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 32,
    lineHeight: 38,
  },
  button: {
    fontFamily: 'System',
    fontWeight: '900' as const,
    fontSize: 16,
  }
};
