import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface LogoProps {
  size?: number;
  color?: string;
  style?: any;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 60, color = '#A259FF', style }) => {
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

  return (
    <View style={[styles.container, style]}>
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      >
        <Circle
          cx={cx1}
          cy={cy}
          r={ringRadius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={cx2}
          cy={cy}
          r={ringRadius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Logo;
