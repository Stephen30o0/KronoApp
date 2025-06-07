import React from 'react';
import { View, Text, StyleSheet, AppRegistry } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/constants/theme';

function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.text}>KronoLabs App</Text>
      <Text style={styles.subtitle}>Welcome to the app!</Text>
    </View>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 10,
  },
});
