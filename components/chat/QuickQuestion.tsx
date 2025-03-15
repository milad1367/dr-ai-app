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
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // Add subtle pulsing glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
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
  
  // Handle press animation
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress();
    });
  };
  
  // Interpolate shadow and border colors for animation
  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CHAT_UI.QUICK_QUESTION_BORDER, COLORS.primary]
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
        activeOpacity={0.7}
      >
        <Animated.View style={[
          styles.buttonInner,
          {
            borderColor: borderColor,
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.25]
            }),
          }
        ]}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['rgba(44, 107, 237, 0.15)', 'rgba(44, 107, 237, 0.25)']}
              style={styles.iconGradient}
            >
              <FontAwesome5 name={icon} size={16} color={COLORS.primary} style={styles.icon} />
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
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CHAT_UI.QUICK_QUESTION_BACKGROUND,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CHAT_UI.QUICK_QUESTION_BORDER,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      },
      android: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
      }
    }),
  },
  iconContainer: {
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  text: {
    color: COLORS.darkBlue,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
});

export default QuickQuestion; 