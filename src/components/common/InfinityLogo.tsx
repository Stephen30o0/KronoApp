import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';

interface InfinityLogoProps {
  isAnimating?: boolean;
  size?: number;
  color?: string;
  onHover?: boolean;
  scrollEffect?: boolean;
  scrollPosition?: number;
}

const InfinityLogo: React.FC<InfinityLogoProps> = ({
  isAnimating = false,
  size = 60,
  color = '#A259FF',
  onHover = false,
  scrollEffect = false,
  scrollPosition = 0,
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const leftCircleAnim = useRef(new Animated.Value(0)).current;
  const rightCircleAnim = useRef(new Animated.Value(0)).current;
  
  // Calculate dimensions based on size
  const width = size;
  const height = size / 2;

  // SVG viewBox dimensions
  const viewBoxWidth = 100;
  const viewBoxHeight = 50;

  // Make the stroke thick for visibility
  const strokeWidth = 10;

  // Calculate the radius of each circle
  const ringRadius = viewBoxHeight / 2 - strokeWidth / 2;

  // Center points for both circles - positioned exactly so they touch at one point
  const cx1 = viewBoxWidth / 2 - ringRadius;
  const cx2 = viewBoxWidth / 2 + ringRadius;
  const cy = viewBoxHeight / 2;

  useEffect(() => {
    if (isAnimating) {
      // Fade in animation
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Left circle animation
      Animated.timing(leftCircleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Using bezier instead of out(cubic)
        useNativeDriver: true,
      }).start();
      
      // Right circle animation with delay
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(rightCircleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Using bezier instead of out(cubic)
          useNativeDriver: true,
        })
      ]).start();
      
      // Subtle rotation animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotationAnim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.ease, // Using simple ease instead of inOut(sine)
            useNativeDriver: true,
          }),
          Animated.timing(rotationAnim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.ease, // Using simple ease instead of inOut(sine)
            useNativeDriver: true,
          })
        ])
      ).start();
    }
    
    if (onHover) {
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [isAnimating, onHover, scrollEffect, scrollPosition]);

  const rotation = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg']
  });

  const scrollRotation = scrollEffect 
    ? `${Math.sin(scrollPosition / 500) * 10}deg` 
    : '0deg';

  return (
    <Animated.View 
      style={{ 
        width, 
        height,
        opacity: isAnimating ? opacityAnim : 1,
        transform: [
          { scale: scaleAnim },
          { rotate: scrollEffect ? scrollRotation : rotation }
        ]
      }}
    >
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      >
        <Defs>
          <RadialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </RadialGradient>
        </Defs>
        <AnimatedCircle 
          cx={cx1} 
          cy={cy} 
          r={ringRadius + strokeWidth/2} 
          stroke="url(#glowGradient)" 
          strokeWidth={strokeWidth * 1.5} 
          fill="none"
          strokeOpacity={0.5}
          strokeDasharray={2 * Math.PI * ringRadius}
          strokeDashoffset={leftCircleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [2 * Math.PI * ringRadius, 0]
          })}
        />
        <AnimatedCircle 
          cx={cx1} 
          cy={cy} 
          r={ringRadius} 
          stroke={color} 
          strokeWidth={strokeWidth} 
          fill="none"
          strokeDasharray={2 * Math.PI * ringRadius}
          strokeDashoffset={leftCircleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [2 * Math.PI * ringRadius, 0]
          })}
        />
        <AnimatedCircle 
          cx={cx2} 
          cy={cy} 
          r={ringRadius + strokeWidth/2} 
          stroke="url(#glowGradient)" 
          strokeWidth={strokeWidth * 1.5} 
          fill="none"
          strokeOpacity={0.5}
          strokeDasharray={2 * Math.PI * ringRadius}
          strokeDashoffset={rightCircleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [2 * Math.PI * ringRadius, 0]
          })}
        />
        <AnimatedCircle 
          cx={cx2} 
          cy={cy} 
          r={ringRadius} 
          stroke={color} 
          strokeWidth={strokeWidth} 
          fill="none"
          strokeDasharray={2 * Math.PI * ringRadius}
          strokeDashoffset={rightCircleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [2 * Math.PI * ringRadius, 0]
          })}
        />
      </Svg>
    </Animated.View>
  );
};

// Create animated versions of SVG components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default InfinityLogo;
