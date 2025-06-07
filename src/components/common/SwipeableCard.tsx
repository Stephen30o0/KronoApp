import React, { useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  PanResponder,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';
import haptics from '../../utils/haptics';
import accessibility from '../../utils/accessibility';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftActionLabel?: string;
  rightActionLabel?: string;
  leftActionIcon?: string;
  rightActionIcon?: string;
  leftActionColor?: string;
  rightActionColor?: string;
  style?: any;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftActionLabel = 'Like',
  rightActionLabel = 'Delete',
  leftActionIcon = 'heart',
  rightActionIcon = 'trash',
  leftActionColor = COLORS.like,
  rightActionColor = COLORS.error,
  style,
  disabled = false,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();
  const [swiping, setSwiping] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  
  // Create pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return !disabled && Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10;
      },
      onPanResponderGrant: () => {
        setSwiping(true);
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        setSwiping(false);
        
        if (gestureState.dx < -SWIPE_THRESHOLD && onSwipeLeft) {
          // Swipe left action
          Animated.timing(translateX, {
            toValue: -width,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            haptics.medium();
            onSwipeLeft();
            translateX.setValue(0);
          });
        } else if (gestureState.dx > SWIPE_THRESHOLD && onSwipeRight) {
          // Swipe right action
          Animated.timing(translateX, {
            toValue: width,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            haptics.medium();
            onSwipeRight();
            translateX.setValue(0);
          });
        } else {
          // Reset position
          Animated.spring(translateX, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  
  // Calculate background opacity based on swipe distance
  const leftActionOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const rightActionOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  // Create custom accessibility props
  const cardAccessibilityProps = {
    accessible: true,
    accessibilityLabel: accessibilityLabel || 'Swipeable card',
    accessibilityHint: `Swipe left to ${leftActionLabel}, swipe right to ${rightActionLabel}`,
    accessibilityRole: 'button' as const, // Type assertion to fix TypeScript error
    accessibilityState: { disabled: false },
  };
  
  return (
    <View style={[styles.container, style]}>
      {/* Left action background */}
      <Animated.View 
        style={[
          styles.actionContainer, 
          styles.leftAction,
          { backgroundColor: leftActionColor, opacity: leftActionOpacity }
        ]}
      >
        <Ionicons name={leftActionIcon as any} size={24} color="white" />
        <Text style={styles.actionText}>{leftActionLabel}</Text>
      </Animated.View>
      
      {/* Right action background */}
      <Animated.View 
        style={[
          styles.actionContainer, 
          styles.rightAction,
          { backgroundColor: rightActionColor, opacity: rightActionOpacity }
        ]}
      >
        <Text style={styles.actionText}>{rightActionLabel}</Text>
        <Ionicons name={rightActionIcon as any} size={24} color="white" />
      </Animated.View>
      
      {/* Card content */}
      <Animated.View 
        style={[
          styles.card,
          { 
            transform: [{ translateX }],
            backgroundColor: colors.surface,
          }
        ]}
        {...panResponder.panHandlers}
        {...cardAccessibilityProps}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    ...SHADOWS.medium,
    zIndex: 1,
  },
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  leftAction: {
    justifyContent: 'flex-start',
    left: 0,
  },
  rightAction: {
    justifyContent: 'flex-end',
    right: 0,
  },
  actionText: {
    ...FONTS.medium,
    color: 'white',
    marginHorizontal: 8,
  },
});

export default SwipeableCard;
