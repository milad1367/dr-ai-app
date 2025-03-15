// Animation utility functions
import { Animated, Easing } from 'react-native';
import { ANIMATION } from '../constants';

/**
 * Creates a pulsating animation for a button or element
 * @param {Animated.Value} value - The Animated.Value to animate
 * @param {number} duration - Duration of the pulse animation
 * @returns {Animated.CompositeAnimation} The animation to be started
 */
export const createPulseAnimation = (value, duration = 1500) => {
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
 * @param {Animated.Value} value - The Animated.Value to animate
 * @param {number} duration - Duration of the floating animation
 * @param {number} translation - Amount of vertical translation
 * @returns {Animated.CompositeAnimation} The animation to be started
 */
export const createFloatingAnimation = (value, duration = 2000, translation = 10) => {
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

/**
 * Creates a button press animation
 * @param {Animated.Value} value - The Animated.Value to animate
 * @returns {{ pressIn: () => void, pressOut: () => void }} Object containing pressIn and pressOut functions
 */
export const createButtonPressAnimation = (value) => {
  return {
    pressIn: () => {
      Animated.timing(value, {
        toValue: ANIMATION.buttonScale,
        duration: ANIMATION.buttonPressInDelay,
        useNativeDriver: true,
      }).start();
    },
    pressOut: () => {
      Animated.timing(value, {
        toValue: 1,
        duration: ANIMATION.buttonPressOutDelay,
        useNativeDriver: true,
      }).start();
    },
  };
}; 