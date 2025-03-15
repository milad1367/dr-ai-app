import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { createFloatingAnimation } from '../../utils/animation';

interface FloatingSymbol {
  position: { x: number; y: number };
  size: number;
  translationY: Animated.Value;
  rotation: Animated.Value;
  opacity: number;
  symbol: string;
}

const { width, height } = Dimensions.get('window');

const BackgroundAnimation: React.FC = () => {
  const symbols = useRef<FloatingSymbol[]>([
    {
      position: { x: width * 0.15, y: height * 0.25 },
      size: 26,
      translationY: new Animated.Value(0),
      rotation: new Animated.Value(0),
      opacity: 0.08,
      symbol: 'pills',
    },
    {
      position: { x: width * 0.8, y: height * 0.3 },
      size: 32,
      translationY: new Animated.Value(0),
      rotation: new Animated.Value(0),
      opacity: 0.06,
      symbol: 'heart',
    },
    {
      position: { x: width * 0.6, y: height * 0.15 },
      size: 38,
      translationY: new Animated.Value(0),
      rotation: new Animated.Value(0),
      opacity: 0.05,
      symbol: 'heartbeat',
    },
    {
      position: { x: width * 0.25, y: height * 0.7 },
      size: 30,
      translationY: new Animated.Value(0),
      rotation: new Animated.Value(0),
      opacity: 0.07,
      symbol: 'stethoscope',
    },
    {
      position: { x: width * 0.85, y: height * 0.7 },
      size: 26,
      translationY: new Animated.Value(0),
      rotation: new Animated.Value(0),
      opacity: 0.08,
      symbol: 'hospital',
    },
  ]).current;

  // Start animations
  useEffect(() => {
    symbols.forEach((item, index) => {
      const floatingAnimation = createFloatingAnimation(
        item.translationY,
        1500 + index * 300,  // Stagger animation timing
        8 + Math.random() * 5  // Random translation amount
      );
      
      // Rotation animation
      const rotationAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(item.rotation, {
            toValue: 0.05,
            duration: 2000 + index * 400,
            useNativeDriver: true,
          }),
          Animated.timing(item.rotation, {
            toValue: -0.05,
            duration: 2000 + index * 400,
            useNativeDriver: true,
          }),
        ])
      );
      
      floatingAnimation.start();
      rotationAnimation.start();
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {symbols.map((item, index) => (
        <Animated.View
          key={index}
          style={[
            styles.symbolContainer,
            {
              left: item.position.x,
              top: item.position.y,
              opacity: item.opacity,
              transform: [
                { translateY: item.translationY },
                { rotate: item.rotation.interpolate({
                  inputRange: [-0.1, 0.1],
                  outputRange: ['-10deg', '10deg'],
                })},
              ],
            },
          ]}
        >
          <FontAwesome5 name={item.symbol} size={item.size} color={COLORS.primary} />
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  symbolContainer: {
    position: 'absolute',
  },
});

export default BackgroundAnimation; 