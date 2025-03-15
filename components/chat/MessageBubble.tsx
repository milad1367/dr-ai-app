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
  const scaleAnim = useRef(new Animated.Value(0.95)).current; // Start smaller for better pop
  
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
        friction: 5, // Lower friction for more bounce
        tension: 50, // Higher tension for snappier animation
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
              colors={['#3C78F0', '#1D54C4']} // More vibrant gradient
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
              
              {/* Add subtle decorative element */}
              <View style={styles.userDecoration}>
                <View style={styles.userDecorationDot} />
              </View>
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
              
              {/* Enhanced decorative AI elements */}
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
            duration: 250, // Faster animation
            useNativeDriver: true,
          }),
          Animated.timing(dot1Scale, {
            toValue: 1.2, // Add scale animation
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
            transform: [{ scale: dot2Scale }] 
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
    marginVertical: CHAT_STYLES.MESSAGE_SPACING / 2,
    maxWidth: '80%', // Slightly wider for better content display
    alignSelf: 'flex-start',
    paddingHorizontal: 3, // Add a bit of space for shadow
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: CHAT_STYLES.USER_BUBBLE_RADIUS + 2, // Slightly more rounded
    minHeight: 42, // Slightly taller
    overflow: 'hidden',
  },
  userBubbleGradient: {
    borderRadius: CHAT_STYLES.USER_BUBBLE_RADIUS + 2,
    borderBottomRightRadius: 4,
    paddingHorizontal: CHAT_STYLES.BUBBLE_PADDING_HORIZONTAL + 2, // More horizontal padding
    paddingVertical: CHAT_STYLES.BUBBLE_PADDING_VERTICAL + 2, // More vertical padding
    ...getShadow('strong'), // Stronger shadow for more depth
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // More opaque for better contrast
    borderBottomLeftRadius: 4,
    ...getShadow('medium'), // Medium shadow for better depth
    borderWidth: Platform.OS === 'ios' ? 0 : 0.8, // Thicker border on Android
    borderColor: 'rgba(200, 220, 240, 0.6)', // More visible border
    ...Platform.select({
      ios: {
        ...getGlassEffect(0.9), // More pronounced glass effect
      },
      android: {
        backgroundColor: 'rgba(248, 250, 255, 0.98)', // More opaque on Android
      },
    }),
  },
  aiMessageContent: {
    paddingHorizontal: CHAT_STYLES.BUBBLE_PADDING_HORIZONTAL + 2,
    paddingVertical: CHAT_STYLES.BUBBLE_PADDING_VERTICAL + 2,
    position: 'relative',
  },
  typingBubble: {
    minWidth: 84, // Slightly wider
    minHeight: 42, // Slightly taller
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageText: {
    fontSize: CHAT_STYLES.MESSAGE_FONT_SIZE,
    lineHeight: CHAT_STYLES.MESSAGE_LINE_HEIGHT + 2, // Slightly taller line height
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  userMessageText: {
    color: COLORS.white,
    fontWeight: '600', // Bolder text
    textShadowColor: 'rgba(0, 0, 0, 0.15)', // More visible text shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    letterSpacing: -0.2, // Tighter text for premium feel
  },
  aiMessageText: {
    color: '#1A2138', // Darker text for better readability
    fontWeight: '500', // Slightly bolder text
    letterSpacing: -0.2, // Tighter text for premium feel
  },
  timeText: {
    fontSize: 10,
    color: COLORS.lightText,
    marginTop: 7, // More space above time text
    textAlign: 'right',
    opacity: 0.8, // Slightly more visible
  },
  timeTextUser: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)', // More visible time text
    marginTop: 7,
    textAlign: 'right',
  },
  typingContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 9, // Larger dots
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4, // More space between dots
    shadowColor: COLORS.primary, // Add subtle glow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  aiDecoration: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.7, // More visible decoration
  },
  aiDecorationDot: {
    width: 7, // Larger dot
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.secondary,
    position: 'absolute',
    left: 4,
    top: 4,
  },
  aiDecorationLine: {
    width: 18, // Longer line
    height: 2.5, // Thicker line
    backgroundColor: COLORS.secondary,
    position: 'absolute',
    left: 8,
    top: 5,
    opacity: 0.5, // More visible line
  },
  // Add user message decoration
  userDecoration: {
    position: 'absolute',
    right: 4,
    top: 4,
    opacity: 0.3,
  },
  userDecorationDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'white',
  },
});

export default MessageBubble; 