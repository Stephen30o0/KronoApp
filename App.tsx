import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation';
// Import COLORS from dedicated colors.js file (not theme.ts) to avoid circular references
import { COLORS } from './src/constants/colors';

const App = () => {
  // Basic error handling
  const [hasError, setHasError] = React.useState(false);

  // Error boundary for theme-related issues
  React.useEffect(() => {
    try {
      // Verify COLORS is available
      if (!COLORS) {
        throw new Error('COLORS not available');
      }
    } catch (error) {
      console.error('Theme error:', error);
      setHasError(true);
    }
  }, []);

  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>There was an error loading the app</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      {({ colors, isDarkMode }) => (
        <NavigationContainer
          theme={{
            ...(isDarkMode ? DarkTheme : DefaultTheme),
            colors: {
              ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
              primary: colors.primary,
              background: colors.background,
              card: colors.surface,
              text: colors.textPrimary,
              border: colors.divider,
              notification: colors.secondary,
            }
          }}
        >
          <AuthProvider>
            <NotificationProvider>
              <StatusBar 
                barStyle={isDarkMode ? "light-content" : "dark-content"} 
                backgroundColor={colors.background} 
                translucent={false}
              />
              <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
                <RootNavigator />
              </SafeAreaView>
            </NotificationProvider>
          </AuthProvider>
        </NavigationContainer>
      )}
    </ThemeProvider>
  );
};

export default App;
