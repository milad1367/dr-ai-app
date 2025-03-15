import React, { useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableWithoutFeedback, 
  View, 
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, LAYOUT } from '../../constants';
import { createButtonPressAnimation } from '../../utils/animation';

interface GradientButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: readonly [string, string];
  isGlowing?: boolean;
  disabled?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  text,
  onPress,
  style,
  textStyle,
  gradientColors = [COLORS.gradientStart, COLORS.gradientEnd] as const,
  isGlowing = false,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const buttonAnimation = createButtonPressAnimation(scaleAnim);

  return (
    <View style={[styles.container, isGlowing && styles.glow, style]}>
      <TouchableWithoutFeedback
        onPress={onPress}
        onPressIn={buttonAnimation.pressIn}
        onPressOut={buttonAnimation.pressOut}
        disabled={disabled}
      >
        <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={[styles.text, textStyle]}>{text}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: LAYOUT.borderRadiusLg,
    overflow: 'visible',
  },
  glow: {
    shadowColor: COLORS.glowColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonWrapper: {
    borderRadius: LAYOUT.borderRadiusLg,
    overflow: 'hidden',
  },
  gradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: LAYOUT.borderRadiusLg,
  },
  text: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default GradientButton; 