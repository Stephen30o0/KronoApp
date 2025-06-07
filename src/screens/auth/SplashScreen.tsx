import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import InfinityLogo from '../../components/common/InfinityLogo';
// Import colors from dedicated colors.js file
import { COLORS } from '../../constants/colors';
import { AuthStackParamList } from '../../navigation/types';

const SplashScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  useEffect(() => {
    // Navigate to the GetStarted screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('GetStarted');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <Animatable.View 
        animation="fadeIn" 
        duration={1000} 
        style={styles.logoContainer}
      >
        <InfinityLogo 
          isAnimating={true} 
          size={120} 
          color={COLORS.primary} 
        />
      </Animatable.View>
      
      <Animatable.Text 
        animation="fadeIn" 
        delay={500} 
        duration={1000} 
        style={styles.title}
      >
        KronoLabs
      </Animatable.Text>
      
      <Animatable.Text 
        animation="fadeIn" 
        delay={800} 
        duration={1000} 
        style={styles.subtitle}
      >
        Comics • NFTs • Creator Economy
      </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 20,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
