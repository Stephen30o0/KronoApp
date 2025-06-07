import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
// Import colors from dedicated colors.js file
import { COLORS } from '../../constants/colors';
import * as Animatable from 'react-native-animatable';
import AnimatedLogo from '../../components/common/AnimatedLogo';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const [showAppName, setShowAppName] = useState(false);

  // Handle logo animation completion
  const handleAnimationComplete = () => {
    setShowAppName(true);
  };

  useEffect(() => {
    // Let the parent navigator handle the transition
    // No need to do anything here as App.tsx handles the transition
    return () => {};
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <View style={styles.logoContainer}>
        <AnimatedLogo 
          size={120} 
          isAnimating={true} 
          color="#A259FF" 
          onAnimationComplete={handleAnimationComplete}
        />
        
        {showAppName && (
          <Animatable.Text 
            style={styles.appName}
            animation="fadeIn"
            duration={1000}
          >
            KronoLabs
          </Animatable.Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
  },
});

export default SplashScreen;
