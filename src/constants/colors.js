// Direct definition of colors with no dependencies
// This file is deliberately .js (not .ts) to ensure maximum compatibility

// Define COLORS object with all required properties
const COLORS = {
  // Primary colors
  primary: '#A259FF', // Main purple color
  primaryDark: '#7B3FE4',
  primaryLight: '#C89BFF',
  
  // Secondary colors
  secondary: '#FF6250', // Coral accent
  secondaryDark: '#E54B3C',
  secondaryLight: '#FF8A7E',
  
  // Accent colors
  accent1: '#14F195', // Mint green
  accent2: '#00D1FF', // Cyan
  accent3: '#FFD166', // Yellow
  
  // Neutral colors
  background: '#0D0D11', // Dark background
  backgroundLight: '#1A1A23',
  surface: '#1E1E2A',
  surfaceLight: '#2A2A38',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B8B8C7',
  textTertiary: '#8E8E9A',
  textDisabled: '#5C5C6E',
  
  // Status colors
  success: '#14F195',
  warning: '#FFD166',
  error: '#FF6250',
  info: '#00D1FF',
  
  // Other UI colors
  divider: '#2A2A38',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: '#000000',
  transparent: 'transparent',
  
  // Social colors
  like: '#FF6250',
  comment: '#00D1FF',
  share: '#14F195',
  save: '#FFD166',
  follow: '#A259FF',
  mention: '#00D1FF',
  system: '#FFD166',
  vote: '#14F195',
  ripple: 'rgba(255, 255, 255, 0.1)',
  
  // Gradient colors
  gradientStart: '#A259FF',
  gradientMiddle: '#7B3FE4',
  gradientEnd: '#5E27C9',
};

// Dark theme colors - same as default COLORS
const DARK_COLORS = { ...COLORS };

// Light theme colors
const LIGHT_COLORS = {
  ...COLORS,
  
  // Override with light-specific colors
  primaryLight: '#E5D4FF',
  secondaryLight: '#FFDED9',
  
  // Neutral colors
  background: '#F5F5FA', // Light background
  backgroundLight: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceLight: '#F0F0F5',
  
  // Text colors
  textPrimary: '#1A1A23',
  textSecondary: '#4E4E5A',
  textTertiary: '#6E6E7A',
  textDisabled: '#AEAEB8',
  
  // Other UI colors
  divider: '#E0E0E5',
  overlay: 'rgba(0, 0, 0, 0.2)',
  ripple: 'rgba(0, 0, 0, 0.05)',
};

// Export all color constants using ES modules syntax
export { COLORS, DARK_COLORS, LIGHT_COLORS };
