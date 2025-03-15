import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, LAYOUT } from '../../constants';

interface FloatingActionButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
  position?: 'bottom-right' | 'bottom-center';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  color?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  label,
  icon = 'user-md',
  onPress,
  position = 'bottom-right',
  style,
  labelStyle,
  color = COLORS.primary,
}) => {
  // Animation values
  const scaleAnimation = new Animated.Value(0);
  const pulseAnimation = new Animated.Value(1);
  
  // Start animations when component mounts
  useEffect(() => {
    // Entry animation
    Animated.spring(scaleAnimation, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    
    // Setup pulse animation loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.07,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    
    // Start pulse animation after entry animation
    setTimeout(() => {
      pulseLoop.start();
    }, 1000);
    
    // Clean up animations
    return () => {
      pulseLoop.stop();
    };
  }, []);
  
  // Position styles based on the position prop
  const positionStyle = position === 'bottom-center'
    ? styles.bottomCenter
    : styles.bottomRight;
  
  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        {
          transform: [
            { scale: scaleAnimation },
            { scale: pulseAnimation },
          ],
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, { backgroundColor: color }]}
        activeOpacity={0.85}
      >
        <View style={styles.contentContainer}>
          <FontAwesome5 name={icon} size={18} color={COLORS.white} solid style={styles.icon} />
          <Text style={[styles.label, labelStyle]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1000,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
  },
  bottomCenter: {
    bottom: 20,
    alignSelf: 'center',
  },
  button: {
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 8,
  },
  label: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FloatingActionButton; 