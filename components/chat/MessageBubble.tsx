import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated,
  Platform,
  I18nManager,
} from 'react-native';
import { COLORS } from '../../constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { Message } from '../../types/chat';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_STYLES, getShadow, getRTLTextStyle } from './ChatStyles';

// Updated medical teal/blue colors
const MEDICAL_COLORS = {
  primary: '#00A8B5', // Teal primary color
  secondary: '#0078A8', // Deeper blue secondary color
  light: '#E5F8FA', // Very light teal for backgrounds
  highlight: '#00C6D4', // Bright teal for highlights
  text: '#2A4054', // Dark blue-gray for text
  background: '#FFFFFF', // Clean white background
};

interface MessageBubbleProps {
  message: Message;
  isLastMessage?: boolean;
  isRTL?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isLastMessage = false,
  isRTL = true
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Animate in when the message appears
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: CHAT_STYLES.ANIMATION_DURATION_NORMAL,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: CHAT_STYLES.ANIMATION_DURATION_NORMAL,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  const isUserMessage = message.sender === 'user';
  
  // Determine if this is a typing indicator message
  const isTypingIndicator = message.isTyping;

  return (
    <Animated.View 
      style={[
        styles.container,
        // In RTL mode, we need to ensure proper alignment
        isRTL 
          ? (isUserMessage ? styles.rtlUserContainer : styles.rtlAiContainer)
          : (isUserMessage ? styles.userContainer : styles.aiContainer),
        { 
          opacity: fadeAnim, 
          transform: [
            { translateY }, 
            { scale: scaleAnim }
          ] 
        }
      ]}
    >
      {/* Regular message bubble */}
      {!isTypingIndicator && (
        <View style={[
          styles.bubble, 
          isUserMessage ? styles.userBubble : styles.aiBubble
        ]}>
          {/* User message with gradient background */}
          {isUserMessage ? (
            <LinearGradient
              colors={[MEDICAL_COLORS.primary, MEDICAL_COLORS.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.userBubbleGradient}
            >
              <Text style={[
                styles.messageText,
                styles.userMessageText,
                isRTL && styles.rtlText
              ]}>
                {message.text}
              </Text>
              
              {message.formattedTime && (
                <Text style={[
                  styles.timeTextUser,
                  isRTL && styles.rtlTimeText
                ]}>
                  {message.formattedTime}
                </Text>
              )}
            </LinearGradient>
          ) : (
            /* AI message with glass effect */
            <View style={styles.aiMessageContent}>
              <Text style={[
                styles.messageText,
                styles.aiMessageText,
                isRTL && styles.rtlText
              ]}>
                {message.text}
              </Text>
              
              {message.formattedTime && (
                <Text style={[
                  styles.timeText,
                  isRTL && styles.rtlTimeText
                ]}>
                  {message.formattedTime}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
      
      {/* Typing indicator */}
      {isTypingIndicator && (
        <View style={[
          styles.bubble, 
          styles.aiBubble, 
          styles.typingBubble,
          isRTL && styles.rtlTypingBubble
        ]}>
          <View style={styles.typingContainer}>
            <TypingIndicator />
          </View>
        </View>
      )}
    </Animated.View>
  );
};

// Animated typing indicator component
const TypingIndicator = () => {
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;
  
  const dot1Scale = useRef(new Animated.Value(1)).current;
  const dot2Scale = useRef(new Animated.Value(1)).current;
  const dot3Scale = useRef(new Animated.Value(1)).current;
  
  // Create an animated sequence for the dots
  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        // Dot 1 animation
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Scale, {
            toValue: 1.2,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        // Dot 2 animation
        Animated.parallel([
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Scale, {
            toValue: 1.2,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        // Dot 3 animation
        Animated.parallel([
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Scale, {
            toValue: 1.2,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        // Reset all dots
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dot1Scale, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Scale, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Scale, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      ]).start(() => {
        // Loop the animation
        animateDots();
      });
    };
    
    animateDots();
    
    return () => {
      // Clean up animations
      dot1Opacity.stopAnimation();
      dot2Opacity.stopAnimation();
      dot3Opacity.stopAnimation();
      dot1Scale.stopAnimation();
      dot2Scale.stopAnimation();
      dot3Scale.stopAnimation();
    };
  }, []);
  
  return (
    <View style={styles.typingIndicator}>
      <Animated.View 
        style={[
          styles.typingDot, 
          { 
            opacity: dot1Opacity,
            transform: [{ scale: dot1Scale }] 
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.typingDot, 
          { 
            opacity: dot2Opacity,
            transform: [{ scale: dot2Scale }],
            marginHorizontal: 4
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.typingDot, 
          { 
            opacity: dot3Opacity,
            transform: [{ scale: dot3Scale }]
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    marginLeft: 20,
  },
  aiContainer: {
    alignSelf: 'flex-start',
    marginRight: 20,
  },
  // RTL-specific container styles
  rtlUserContainer: {
    alignSelf: 'flex-end',
    marginLeft: 20,
  },
  rtlAiContainer: {
    alignSelf: 'flex-start',
    marginRight: 20,
  },
  bubble: {
    borderRadius: CHAT_STYLES.USER_BUBBLE_RADIUS,
    overflow: 'hidden',
  },
  userBubble: {
    ...getShadow('medium'),
  },
  aiBubble: {
    backgroundColor: 'rgba(240, 248, 255, 0.95)',
    borderWidth: Platform.OS === 'ios' ? 0.5 : 1,
    borderColor: 'rgba(210, 230, 250, 0.6)',
    ...getShadow('light'),
  },
  userBubbleGradient: {
    padding: CHAT_STYLES.BUBBLE_PADDING_VERTICAL,
    paddingHorizontal: CHAT_STYLES.BUBBLE_PADDING_HORIZONTAL,
  },
  aiMessageContent: {
    padding: CHAT_STYLES.BUBBLE_PADDING_VERTICAL,
    paddingHorizontal: CHAT_STYLES.BUBBLE_PADDING_HORIZONTAL,
  },
  messageText: {
    fontSize: CHAT_STYLES.MESSAGE_FONT_SIZE,
    lineHeight: CHAT_STYLES.MESSAGE_LINE_HEIGHT,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: MEDICAL_COLORS.text,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  timeText: {
    fontSize: 11,
    color: 'rgba(106, 133, 161, 0.8)',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  timeTextUser: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  rtlTimeText: {
    alignSelf: 'flex-start',
  },
  typingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: 70,
    minHeight: 42,
  },
  rtlTypingBubble: {
    // For RTL layouts
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MEDICAL_COLORS.secondary,
  },
});

export default MessageBubble; 