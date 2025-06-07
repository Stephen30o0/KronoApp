import { Animated, Easing } from 'react-native';
import { ANIMATIONS } from '../constants/theme';

// Screen transition animations
export const screenTransitionConfig = {
  fade: {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: ANIMATIONS.mediumDuration,
          easing: Easing.out(Easing.poly(4)),
          useNativeDriver: true,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: ANIMATIONS.mediumDuration,
          easing: Easing.in(Easing.poly(4)),
          useNativeDriver: true,
        },
      },
    },
    screenInterpolator: ({ position, scene }: any) => {
      const { index } = scene;
      
      const opacity = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [0, 1, 0],
      });
      
      return { opacity };
    },
  },
  
  slideFromRight: {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: ANIMATIONS.mediumDuration,
          easing: Easing.out(Easing.poly(4)),
          useNativeDriver: true,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: ANIMATIONS.mediumDuration,
          easing: Easing.in(Easing.poly(4)),
          useNativeDriver: true,
        },
      },
    },
    screenInterpolator: ({ position, scene, layouts }: any) => {
      const { index } = scene;
      const { width } = layouts.screen;
      
      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [width, 0, -width],
      });
      
      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1],
      });
      
      return { opacity, transform: [{ translateX }] };
    },
  },
  
  slideFromBottom: {
    transitionSpec: {
      open: {
        animation: 'timing',
        config: {
          duration: ANIMATIONS.mediumDuration,
          easing: Easing.out(Easing.poly(4)),
          useNativeDriver: true,
        },
      },
      close: {
        animation: 'timing',
        config: {
          duration: ANIMATIONS.mediumDuration,
          easing: Easing.in(Easing.poly(4)),
          useNativeDriver: true,
        },
      },
    },
    screenInterpolator: ({ position, scene, layouts }: any) => {
      const { index } = scene;
      const { height } = layouts.screen;
      
      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [height, 0, 0],
      });
      
      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1],
      });
      
      return { opacity, transform: [{ translateY }] };
    },
  },
};

// Shared element transition
export const createSharedElementTransition = (
  element: any,
  fromPosition: any,
  toPosition: any,
  duration = ANIMATIONS.mediumDuration
) => {
  return Animated.parallel([
    Animated.timing(element.translateX, {
      toValue: toPosition.x - fromPosition.x,
      duration,
      useNativeDriver: true,
    }),
    Animated.timing(element.translateY, {
      toValue: toPosition.y - fromPosition.y,
      duration,
      useNativeDriver: true,
    }),
    Animated.timing(element.scale, {
      toValue: toPosition.width / fromPosition.width,
      duration,
      useNativeDriver: true,
    }),
  ]);
};

// Loading animations
export const pulseAnimation = (value: Animated.Value, duration = 1500) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0.6,
        duration: duration / 2,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ])
  );
};

// Button press animation
export const buttonPressAnimation = (scale: Animated.Value) => {
  Animated.sequence([
    Animated.timing(scale, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }),
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }),
  ]).start();
};
