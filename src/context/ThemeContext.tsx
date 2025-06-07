import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import from dedicated colors.js file to avoid circular references
import { COLORS, DARK_COLORS, LIGHT_COLORS } from '../constants/colors';
// Only import ThemeMode type from theme.ts
import { ThemeMode } from '../constants/theme';

// Theme context type
type ThemeContextType = {
  theme: ThemeMode;
  isDarkMode: boolean;
  colors: typeof DARK_COLORS;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
};

// Theme provider props
type ThemeProviderProps = {
  children: ReactNode | ((props: ThemeContextType) => ReactNode);
};

// Create context with default values - use COLORS directly to ensure it's available
const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDarkMode: true,
  colors: COLORS, // Use COLORS here instead of DARK_COLORS for better reliability
  toggleTheme: () => {},
  setTheme: () => {},
});

// Storage key for theme preference
const THEME_STORAGE_KEY = '@kronolabs_theme_preference';

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme();
  
  // State for current theme
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  
  // Determine if dark mode is active
  const isDarkMode = theme === 'dark';
  
  // Get current theme colors
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  
  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeState(savedTheme as ThemeMode);
        } else if (deviceColorScheme) {
          // If no saved preference, use device preference
          setThemeState(deviceColorScheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, [deviceColorScheme]);
  
  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [theme]);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeState(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
  // Set a specific theme
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };
  
  // Context value
  const contextValue: ThemeContextType = {
    theme,
    isDarkMode,
    colors,
    toggleTheme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {typeof children === 'function' ? children(contextValue) : children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
