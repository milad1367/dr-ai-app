// Animation utility functions
import { Animated, Easing } from 'react-native';
import { ANIMATION } from '../constants';

/**
 * Creates a pulsating animation for a button or element
 * @param value - The Animated.Value to animate
 * @param duration - Duration of the pulse animation
 * @returns The animation to be started
 */
export const createPulseAnimation = (
  value: Animated.Value, 
  duration: number = 1500
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1.05,
        duration: duration / 2,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Creates a floating animation for UI elements
 * @param value - The Animated.Value to animate
 * @param duration - Duration of the floating animation
 * @param translation - Amount of vertical translation
 * @returns The animation to be started
 */
export const createFloatingAnimation = (
  value: Animated.Value, 
  duration: number = 2000, 
  translation: number = 10
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: translation,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

interface ButtonAnimationFunctions {
  pressIn: () => void;
  pressOut: () => void;
}

/**
 * Creates a button press animation
 * @param value - The Animated.Value to animate
 * @returns Object containing pressIn and pressOut functions
 */
export const createButtonPressAnimation = (
  value: Animated.Value
): ButtonAnimationFunctions => {
  return {
    pressIn: (): void => {
      Animated.timing(value, {
        toValue: ANIMATION.buttonScale,
        duration: ANIMATION.buttonPressInDelay,
        useNativeDriver: true,
      }).start();
    },
    pressOut: (): void => {
      Animated.timing(value, {
        toValue: 1,
        duration: ANIMATION.buttonPressOutDelay,
        useNativeDriver: true,
      }).start();
    },
  };
}; 