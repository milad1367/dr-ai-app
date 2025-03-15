import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  Platform,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { CHAT_UI } from '../../constants/chatConstants';
import { QuickQuestion as QuickQuestionType } from '../../types/chat';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { CHAT_STYLES, getShadow, BUTTON_ANIMATION } from './ChatStyles';

interface QuickQuestionProps extends Omit<QuickQuestionType, 'id'> {
  onPress: () => void;
}

const QuickQuestion: React.FC<QuickQuestionProps> = ({ 
  text, 
  icon, 
  onPress 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animate in with a bounce effect
    Animated.sequence([
      Animated.delay(Math.random() * 300), // Stagger effect
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: CHAT_STYLES.SPRING_CONFIG.DAMPING,
          tension: CHAT_STYLES.SPRING_CONFIG.STIFFNESS,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: CHAT_STYLES.SPRING_CONFIG.DAMPING,
          tension: CHAT_STYLES.SPRING_CONFIG.STIFFNESS,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Add subtle pulsing glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);
  
  // Handle press animation with haptic feedback
  const handlePress = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: BUTTON_ANIMATION.SCALE_DOWN,
        duration: BUTTON_ANIMATION.DURATION_PRESS,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: BUTTON_ANIMATION.DURATION_RELEASE,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress();
    });
  };
  
  // Interpolate shadow and border colors for animation
  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(44, 107, 237, 0.2)', 'rgba(44, 107, 237, 0.5)']
  });
  
  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.25]
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        { 
          transform: [
            { scale: scaleAnim },
            { translateY }
          ],
          opacity: scaleAnim,
        }
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View style={[
          styles.buttonInner,
          {
            borderColor: borderColor,
            shadowOpacity: shadowOpacity,
          }
        ]}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['rgba(44, 107, 237, 0.12)', 'rgba(44, 107, 237, 0.22)']}
              style={styles.iconGradient}
            >
              <FontAwesome5 
                name={icon} 
                size={CHAT_STYLES.ACTION_BUTTON_ICON_SIZE - 4} 
                color={COLORS.primary} 
                style={styles.icon} 
              />
            </LinearGradient>
          </View>
          <Text style={styles.text}>{text}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    maxWidth: 200,
  },
  button: {
    borderRadius: CHAT_STYLES.QUICK_ACTION_RADIUS,
    overflow: 'hidden',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: CHAT_STYLES.QUICK_ACTION_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(44, 107, 237, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    height: CHAT_STYLES.QUICK_ACTION_HEIGHT,
  },
  iconContainer: {
    marginRight: 10,
    borderRadius: CHAT_STYLES.QUICK_ACTION_RADIUS / 2,
    overflow: 'hidden',
  },
  iconGradient: {
    width: 32,
    height: 32,
    borderRadius: CHAT_STYLES.QUICK_ACTION_RADIUS / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  text: {
    color: COLORS.darkBlue,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
});

export default QuickQuestion; 