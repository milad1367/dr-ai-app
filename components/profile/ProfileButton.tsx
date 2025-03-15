import React, { useRef } from 'react';
import { 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, LAYOUT, ANIMATION } from '../../constants';
import { PROFILE_LAYOUT } from '../../constants/profileConstants';
import * as Haptics from 'expo-haptics';

interface ProfileButtonProps {
  text: string;
  icon: string;
  onPress: () => void;
  isPrimary?: boolean;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({
  text,
  icon,
  onPress,
  isPrimary = false,
}) => {
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.timing(buttonScale, {
      toValue: ANIMATION.buttonScale,
      duration: ANIMATION.buttonPressInDelay,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(buttonScale, {
      toValue: 1,
      duration: ANIMATION.buttonPressOutDelay,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePress = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  
  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ scale: buttonScale }] }
    ]}>
      <TouchableOpacity
        style={[
          styles.button,
          isPrimary ? styles.primaryButton : styles.secondaryButton
        ]}
        activeOpacity={0.8}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <FontAwesome5
          name={icon}
          size={18}
          color={isPrimary ? COLORS.white : COLORS.primary}
          style={styles.icon}
          solid
        />
        <Text style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText
        ]}>
          {text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: PROFILE_LAYOUT.BUTTON_BORDER_RADIUS,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.primary,
  },
});

export default ProfileButton; 