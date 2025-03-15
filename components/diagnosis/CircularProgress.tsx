import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS } from '../../constants';
import { toPersianNumber } from '../../utils/diagnosisUtils';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  duration?: number;
  color?: string;
  textColor?: string;
  backgroundColor?: string;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  showPercentage?: boolean;
  label?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 120,
  strokeWidth = 10,
  duration = 1500,
  color = COLORS.primary,
  textColor = COLORS.text,
  backgroundColor = COLORS.mediumGray,
  containerStyle,
  textStyle,
  showPercentage = true,
  label,
}) => {
  // Animation value for the progress
  const progress = useSharedValue(0);

  // Radius calculation
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate the center of the circle
  const center = size / 2;
  
  // Start the animation when the component mounts
  useEffect(() => {
    progress.value = withTiming(
      percentage / 100,
      {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }
    );
  }, [percentage, duration, progress]);
  
  // Animated props for the circle stroke
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });
  
  // Format the percentage for display
  const formattedPercentage = toPersianNumber(Math.round(percentage));

  return (
    <View style={[styles.container, containerStyle]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Background Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Animated Progress Circle */}
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            // @ts-ignore - Type definitions mismatch between reanimated and svg
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
      
      {/* Percentage Text */}
      <View style={styles.textContainer}>
        {showPercentage && (
          <Text style={[styles.percentageText, textStyle, { color: textColor }]}>
            {formattedPercentage}٪
          </Text>
        )}
        {label && (
          <Text style={[styles.labelText, { color: textColor }]}>
            {label}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  labelText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
});

export default CircularProgress; 