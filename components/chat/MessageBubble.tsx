import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated,
  I18nManager,
  Platform,
} from 'react-native';
import { COLORS } from '../../constants';
import { CHAT_UI } from '../../constants/chatConstants';
import { FontAwesome5 } from '@expo/vector-icons';
import { Message } from '../../types/chat';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_STYLES, getShadow, getGlassEffect } from './ChatStyles';

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
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  
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
        friction: 6,
        tension: 40,
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
          isUserMessage ? null : styles.aiBubble
        ]}>
          {/* User message with gradient background */}
          {isUserMessage ? (
            <LinearGradient
              colors={['#2C6BED', '#1953D8']}
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
              
              {/* Decorative AI elements */}
              <View style={styles.aiDecoration}>
                <View style={styles.aiDecorationDot} />
                <View style={styles.aiDecorationLine} />
              </View>
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
  
  // Create an animated sequence for the dots
  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        // Dot 1 animation
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Dot 2 animation
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Dot 3 animation
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Reset all dots
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 300,
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
    };
  }, []);
  
  return (
    <View style={styles.typingIndicator}>
      <Animated.View style={[styles.typingDot, { opacity: dot1Opacity }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot2Opacity }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot3Opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: CHAT_STYLES.MESSAGE_SPACING / 2,
    maxWidth: '78%',
    alignSelf: 'flex-start',
    paddingHorizontal: 2, // Add a bit of space for shadow
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: CHAT_STYLES.USER_BUBBLE_RADIUS,
    minHeight: 40,
    overflow: 'hidden',
  },
  userBubbleGradient: {
    borderRadius: CHAT_STYLES.USER_BUBBLE_RADIUS,
    borderBottomRightRadius: 4,
    paddingHorizontal: CHAT_STYLES.BUBBLE_PADDING_HORIZONTAL,
    paddingVertical: CHAT_STYLES.BUBBLE_PADDING_VERTICAL,
    ...getShadow('medium'),
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomLeftRadius: 4,
    ...getShadow('light'),
    borderWidth: Platform.OS === 'ios' ? 0 : 0.5,
    borderColor: 'rgba(200, 220, 240, 0.5)',
    ...Platform.select({
      ios: {
        ...getGlassEffect(0.8),
      },
      android: {
        backgroundColor: 'rgba(248, 250, 255, 0.95)',
      },
    }),
  },
  aiMessageContent: {
    paddingHorizontal: CHAT_STYLES.BUBBLE_PADDING_HORIZONTAL,
    paddingVertical: CHAT_STYLES.BUBBLE_PADDING_VERTICAL,
    position: 'relative',
  },
  typingBubble: {
    minWidth: 80,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  aiMessageText: {
    color: COLORS.text,
    fontWeight: '400',
  },
  timeText: {
    fontSize: 10,
    color: COLORS.lightText,
    marginTop: 6,
    textAlign: 'right',
  },
  timeTextUser: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 6,
    textAlign: 'right',
  },
  typingContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 3,
  },
  aiDecoration: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.6,
  },
  aiDecorationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    position: 'absolute',
    left: 3,
    top: 3,
  },
  aiDecorationLine: {
    width: 15,
    height: 2,
    backgroundColor: COLORS.secondary,
    position: 'absolute',
    left: 7,
    top: 5,
    opacity: 0.4,
  },
});

export default MessageBubble; 