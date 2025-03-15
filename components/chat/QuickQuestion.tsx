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
          duration: 2000, // Slightly faster pulse
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);
  
  // Handle press animation with haptic feedback
  const handlePress = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Increased feedback intensity
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: BUTTON_ANIMATION.SCALE_DOWN * 0.95, // More pronounced press effect
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
    outputRange: ['rgba(44, 107, 237, 0.3)', 'rgba(44, 107, 237, 0.7)'] // Increased contrast
  });
  
  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.35] // Increased shadow contrast
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
        activeOpacity={0.7} // Slightly more responsive feel
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
              colors={['rgba(44, 107, 237, 0.15)', 'rgba(44, 107, 237, 0.28)']} // Slightly more contrast
              style={styles.iconGradient}
            >
              <FontAwesome5 
                name={icon} 
                size={CHAT_STYLES.ACTION_BUTTON_ICON_SIZE - 2} 
                color={COLORS.primary} 
                style={styles.icon}
                solid // Use solid icons for better visibility
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
    // Add subtle elevation to the entire container for more depth
    ...Platform.select({
      android: {
        elevation: 3,
      },
    }),
  },
  button: {
    borderRadius: CHAT_STYLES.QUICK_ACTION_RADIUS,
    overflow: 'hidden',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12, // Slightly more vertical padding for better touch area
    borderRadius: CHAT_STYLES.QUICK_ACTION_RADIUS,
    borderWidth: 1.2, // Slightly thicker border
    borderColor: 'rgba(44, 107, 237, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly more opaque for better contrast
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 }, // Increased shadow offset
    shadowOpacity: 0.18, // Increased base shadow opacity
    shadowRadius: 8, // Increased shadow blur
    elevation: 5, // Increased elevation for Android
    height: CHAT_STYLES.QUICK_ACTION_HEIGHT + 2, // Slightly taller
  },
  iconContainer: {
    marginRight: 12, // More space between icon and text
    borderRadius: CHAT_STYLES.QUICK_ACTION_RADIUS / 2,
    overflow: 'hidden',
    ...getShadow('light'), // Add shadow to icon container
  },
  iconGradient: {
    width: 34, // Slightly larger icon area
    height: 34,
    borderRadius: CHAT_STYLES.QUICK_ACTION_RADIUS / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Platform.OS === 'ios' ? 0.5 : 0, 
    borderColor: 'rgba(44, 107, 237, 0.2)',
  },
  icon: {
    textAlign: 'center',
    shadowColor: COLORS.primary, // Add subtle text shadow to icon
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  text: {
    color: COLORS.darkBlue,
    fontSize: 15,
    fontWeight: '700', // Bolder text for better readability
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
    letterSpacing: -0.3, // Tighter text for premium feel
  },
});

export default QuickQuestion; 