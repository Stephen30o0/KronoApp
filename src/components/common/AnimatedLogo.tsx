import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedLogoProps {
  color?: string;
  size?: number;
  isAnimating?: boolean;
  onAnimationComplete?: () => void;
  style?: any;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  color = '#A259FF',
  size = 60,
  isAnimating = true,
  onAnimationComplete,
  style,
}) => {
  const animation = useSharedValue(0);
  const [isComplete, setIsComplete] = useState(false);

  // SVG dimensions
  const width = size;
  const height = size / 2;
  const viewBoxWidth = 100;
  const viewBoxHeight = 50;
  const strokeWidth = 10;
  const ringRadius = viewBoxHeight / 2 - strokeWidth / 2;
  const cx1 = viewBoxWidth / 2 - ringRadius;
  const cx2 = viewBoxWidth / 2 + ringRadius;
  const cy = viewBoxHeight / 2;

  // Define a custom easing function as a worklet
  const customEaseInOut = (t: number) => {
    'worklet';
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Use this safer method to handle animation completion
  useEffect(() => {
    if (isComplete && typeof onAnimationComplete === 'function') {
      try {
        onAnimationComplete();
      } catch (error) {
        console.error('Error in animation completion callback:', error);
      }
      setIsComplete(false);
    }
  }, [isComplete, onAnimationComplete]);

  // Handle animation safely
  const handleAnimationComplete = () => {
    setIsComplete(true);
  };

  useEffect(() => {
    if (isAnimating) {
      animation.value = 0;
      
      // Simple timing animation without callback
      animation.value = withTiming(1, {
        duration: 2000,
        easing: customEaseInOut,
      });
      
      // Use a timer as fallback for completion
      const timer = setTimeout(() => {
        handleAnimationComplete();
      }, 2100);
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const leftCircleProps = useAnimatedProps(() => {
    'worklet';
    const progress = animation.value <= 0.5
      ? animation.value / 0.5
      : 1;
    return {
      strokeDasharray: [2 * Math.PI * ringRadius, 2 * Math.PI * ringRadius],
      strokeDashoffset: 2 * Math.PI * ringRadius * (1 - progress),
    };
  });

  const rightCircleProps = useAnimatedProps(() => {
    'worklet';
    const progress =
      animation.value <= 0.25
        ? 0
        : animation.value >= 0.75
        ? 1
        : (animation.value - 0.25) / 0.5;
    return {
      strokeDasharray: [2 * Math.PI * ringRadius, 2 * Math.PI * ringRadius],
      strokeDashoffset: 2 * Math.PI * ringRadius * (1 - progress),
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      >
        <AnimatedCircle
          cx={cx1}
          cy={cy}
          r={ringRadius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          animatedProps={leftCircleProps}
        />
        <AnimatedCircle
          cx={cx2}
          cy={cy}
          r={ringRadius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          animatedProps={rightCircleProps}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimatedLogo;
