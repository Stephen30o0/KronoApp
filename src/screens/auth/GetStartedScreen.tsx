import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants
import { FONTS, SIZES } from '../../constants/theme';
import InfinityLogo from '../../components/common/InfinityLogo';

type GetStartedScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'GetStarted'>;

const GetStartedScreen = () => {
  const navigation = useNavigation<GetStartedScreenNavigationProp>();

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  const handleCreateAccount = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(13, 13, 17, 0.3)', 'rgba(13, 13, 17, 0.8)', COLORS.background]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Animatable.View 
              animation="fadeIn" 
              duration={1000} 
              style={styles.logoContainer}
            >
              <InfinityLogo 
                size={80} 
                color={COLORS.primary} 
                onHover={false}
              />
            </Animatable.View>
            
            <Animatable.Text 
              animation="fadeIn" 
              delay={300} 
              duration={1000} 
              style={styles.title}
            >
              KronoLabs
            </Animatable.Text>
            
            <Animatable.Text 
              animation="fadeIn" 
              delay={600} 
              duration={1000} 
              style={styles.description}
            >
              Discover, create, and collect digital comics and art on the blockchain
            </Animatable.Text>
            
            <Animatable.View 
              animation="fadeInUp" 
              delay={900} 
              duration={1000} 
              style={styles.buttonContainer}
            >
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleGetStarted}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <View style={styles.buttonContent}>
                    <View style={styles.buttonTextContainer}>
                      <View style={styles.buttonIcon}>
                        <InfinityLogo size={24} color={COLORS.textPrimary} />
                      </View>
                      <View>
                        <View style={styles.buttonTextWrapper}>
                          <View style={styles.buttonTextContent}>
                            <View style={styles.buttonTextInner}>
                              <Animatable.Text 
                                animation="pulse" 
                                iterationCount="infinite" 
                                duration={2000}
                                style={styles.buttonText}
                              >
                                Get Started
                              </Animatable.Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]} 
                onPress={handleCreateAccount}
                activeOpacity={0.8}
              >
                <View style={styles.secondaryButtonContent}>
                  <View style={styles.buttonTextContainer}>
                    <View style={styles.buttonTextWrapper}>
                      <View style={styles.buttonTextContent}>
                        <View style={styles.buttonTextInner}>
                          <Animatable.Text 
                            style={styles.secondaryButtonText}
                          >
                            Create Account
                          </Animatable.Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    maxWidth: '80%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginBottom: 16,
    borderRadius: SIZES.buttonRadius,
    overflow: 'hidden',
  },
  buttonGradient: {
    borderRadius: SIZES.buttonRadius,
  },
  buttonContent: {
    height: SIZES.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buttonTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonTextWrapper: {
    overflow: 'hidden',
  },
  buttonTextContent: {
    overflow: 'hidden',
  },
  buttonTextInner: {
    overflow: 'hidden',
  },
  buttonText: {
    ...FONTS.button,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonContent: {
    height: SIZES.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    ...FONTS.button,
    color: COLORS.primary,
    textAlign: 'center',
  },
});

export default GetStartedScreen;
