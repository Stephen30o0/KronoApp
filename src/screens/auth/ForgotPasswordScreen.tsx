import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
// Import COLORS from dedicated colors.js file
import { COLORS } from '../../constants/colors';
// Import other theme constants
import { FONTS, SIZES, SHADOWS } from '../../constants/theme';
import InfinityLogo from '../../components/common/InfinityLogo';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const handleResetPassword = async () => {
    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.backgroundLight, COLORS.background]}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToLogin}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <Animatable.View 
            animation="fadeIn" 
            duration={1000} 
            style={styles.headerContainer}
          >
            <InfinityLogo 
              size={60} 
              color={COLORS.primary} 
            />
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              {resetSent 
                ? "Check your email for reset instructions" 
                : "Enter your email to receive a password reset link"}
            </Text>
          </Animatable.View>

          {!resetSent ? (
            <Animatable.View 
              animation="fadeInUp" 
              duration={1000} 
              delay={300}
              style={styles.formContainer}
            >
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.textTertiary}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) validateEmail(text);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onBlur={() => validateEmail(email)}
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleResetPassword}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <Animatable.View 
                      animation="pulse" 
                      iterationCount="infinite" 
                      duration={1000}
                    >
                      <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.textPrimary} />
                    </Animatable.View>
                  ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          ) : (
            <Animatable.View 
              animation="fadeIn" 
              duration={1000} 
              style={styles.successContainer}
            >
              <View style={styles.successIconContainer}>
                <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
              </View>
              
              <Text style={styles.successText}>
                We've sent password reset instructions to your email. Please check your inbox.
              </Text>
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleBackToLogin}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Back to Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          )}

          <Animatable.View 
            animation="fadeIn" 
            duration={1000} 
            delay={600}
            style={styles.footerContainer}
          >
            <Text style={styles.footerText}>Remember your password?</Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.inputRadius,
    paddingHorizontal: 16,
    height: SIZES.inputHeight,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.textPrimary,
    marginLeft: 8,
    ...FONTS.body1,
  },
  errorText: {
    ...FONTS.caption,
    color: COLORS.error,
    marginTop: 4,
  },
  button: {
    width: '100%',
    marginTop: 8,
    marginBottom: 24,
    borderRadius: SIZES.buttonRadius,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  buttonGradient: {
    height: SIZES.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.buttonRadius,
  },
  buttonText: {
    ...FONTS.button,
    color: COLORS.textPrimary,
  },
  successContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successText: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  loginText: {
    ...FONTS.semiBold,
    color: COLORS.primary,
    marginLeft: 4,
  },
});

export default ForgotPasswordScreen;
