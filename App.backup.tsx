import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { RootNavigator } from './src/navigation';
import { NotificationProvider } from './src/context/NotificationContext';
import { AuthProvider } from './src/context/AuthContext';

// Create a modified version of the default dark theme
const KronoTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#A259FF',
    background: '#0D0D11',
    card: '#1E1E2A',
    text: '#FFFFFF',
    border: '#2A2A38',
    notification: '#FF6250',
  }
};

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D11" />
      <AuthProvider>
        <NotificationProvider>
          <NavigationContainer theme={KronoTheme}>
            <RootNavigator />
          </NavigationContainer>
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaView>
  );
};

export default App;

// Define styles using StyleSheet for better performance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D11'
  },
});
