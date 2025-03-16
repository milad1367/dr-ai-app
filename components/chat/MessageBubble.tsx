import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated,
  Platform,
} from 'react-native';
import { COLORS } from '../../constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { Message } from '../../types/chat';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_STYLES, getShadow } from './ChatStyles';

interface MessageBubbleProps {
  message: Message;
  isLastMessage?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isLastMessage = false
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
        isUserMessage ? styles.userContainer : styles.aiContainer,
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
              colors={['#3C78F0', '#1D54C4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.userBubbleGradient}
            >
              <Text style={[
                styles.messageText,
                styles.userMessageText
              ]}>
                {message.text}
              </Text>
              
              {message.formattedTime && (
                <Text style={styles.timeTextUser}>
                  {message.formattedTime}
                </Text>
              )}
            </LinearGradient>
          ) : (
            /* AI message with glass effect */
            <View style={styles.aiMessageContent}>
              <Text style={[
                styles.messageText,
                styles.aiMessageText
              ]}>
                {message.text}
              </Text>
              
              {message.formattedTime && (
                <Text style={styles.timeText}>
                  {message.formattedTime}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
      
      {/* Typing indicator */}
      {isTypingIndicator && (
        <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
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
    marginBottom: CHAT_STYLES.MESSAGE_SPACING,
    flexDirection: 'row',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    minWidth: 60,
    borderRadius: CHAT_STYLES.USER_BUBBLE_RADIUS,
    ...getShadow('medium'),
  },
  userBubble: {
    borderRadius: CHAT_STYLES.USER_BUBBLE_RADIUS,
    overflow: 'hidden',
  },
  aiBubble: {
    borderRadius: CHAT_STYLES.AI_BUBBLE_RADIUS,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  userBubbleGradient: {
    padding: CHAT_STYLES.BUBBLE_PADDING_VERTICAL,
    paddingHorizontal: CHAT_STYLES.BUBBLE_PADDING_HORIZONTAL,
    paddingBottom: CHAT_STYLES.BUBBLE_PADDING_VERTICAL + 10,
    borderRadius: CHAT_STYLES.USER_BUBBLE_RADIUS,
  },
  aiMessageContent: {
    padding: CHAT_STYLES.BUBBLE_PADDING_VERTICAL,
    paddingHorizontal: CHAT_STYLES.BUBBLE_PADDING_HORIZONTAL,
    paddingBottom: CHAT_STYLES.BUBBLE_PADDING_VERTICAL + 10,
  },
  messageText: {
    fontSize: CHAT_STYLES.MESSAGE_FONT_SIZE,
    lineHeight: CHAT_STYLES.MESSAGE_LINE_HEIGHT,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  userMessageText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  aiMessageText: {
    color: '#1A2138',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    opacity: 0.7,
    position: 'absolute',
    bottom: 6,
    left: 12,
  },
  timeTextUser: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    opacity: 0.9,
    position: 'absolute',
    bottom: 6,
    left: 12,
  },
  typingBubble: {
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: CHAT_STYLES.AI_BUBBLE_RADIUS,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  typingContainer: {
    padding: 4,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    height: 24,
    width: 50,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});

export default MessageBubble; 