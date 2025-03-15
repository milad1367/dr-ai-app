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
  
  // Animate in when the message appears
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: CHAT_UI.ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: CHAT_UI.ANIMATION_DURATION,
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
        styles.container as any,
        isUserMessage ? styles.userContainer as any : styles.aiContainer as any,
        { opacity: fadeAnim, transform: [{ translateY }] }
      ]}
    >
      {/* Regular message bubble */}
      {!isTypingIndicator && (
        <View style={[
          styles.bubble as any, 
          isUserMessage ? null : styles.aiBubble as any
        ]}>
          {/* User message with gradient background */}
          {isUserMessage ? (
            <LinearGradient
              colors={['#2C6BED', '#1E56CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.userBubbleGradient as any]}
            >
              <Text style={[
                styles.messageText as any,
                styles.userMessageText as any
              ]}>
                {message.text}
              </Text>
              
              {message.formattedTime && (
                <Text style={styles.timeTextUser as any}>
                  {message.formattedTime}
                </Text>
              )}
            </LinearGradient>
          ) : (
            /* AI message with glass effect */
            <View style={styles.aiMessageContent as any}>
              <Text style={[
                styles.messageText as any,
                styles.aiMessageText as any
              ]}>
                {message.text}
              </Text>
              
              {message.formattedTime && (
                <Text style={styles.timeText as any}>
                  {message.formattedTime}
                </Text>
              )}
              
              {/* Decorative AI elements */}
              <View style={styles.aiDecoration as any}>
                <View style={styles.aiDecorationDot as any} />
                <View style={styles.aiDecorationLine as any} />
              </View>
            </View>
          )}
        </View>
      )}
      
      {/* Typing indicator */}
      {isTypingIndicator && (
        <View style={[styles.bubble as any, styles.aiBubble as any, styles.typingBubble as any]}>
          <View style={styles.typingContainer as any}>
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
    <View style={styles.typingIndicator as any}>
      <Animated.View style={[styles.typingDot as any, { opacity: dot1Opacity }]} />
      <Animated.View style={[styles.typingDot as any, { opacity: dot2Opacity }]} />
      <Animated.View style={[styles.typingDot as any, { opacity: dot3Opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '75%',
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: CHAT_UI.BUBBLE_BORDER_RADIUS,
    minHeight: 40,
    overflow: 'hidden',
  },
  userBubbleGradient: {
    borderRadius: CHAT_UI.BUBBLE_BORDER_RADIUS,
    borderBottomRightRadius: 4,
    paddingHorizontal: CHAT_UI.BUBBLE_PADDING,
    paddingVertical: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomLeftRadius: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: Platform.OS === 'ios' ? 0 : 0.5,
    borderColor: 'rgba(200, 220, 240, 0.5)',
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(240, 250, 255, 0.7)',
        backdropFilter: 'blur(8px)',
      },
      android: {
        backgroundColor: 'rgba(240, 250, 255, 0.9)',
      },
    }),
  },
  aiMessageContent: {
    paddingHorizontal: CHAT_UI.BUBBLE_PADDING,
    paddingVertical: 8,
    position: 'relative',
  },
  typingBubble: {
    minWidth: 60,
    minHeight: 36,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    writingDirection: 'rtl', // For RTL languages
  },
  userMessageText: {
    color: COLORS.white,
    textAlign: 'right',
  },
  aiMessageText: {
    color: COLORS.text,
    textAlign: 'left',
  },
  timeText: {
    fontSize: 11,
    color: COLORS.lightText,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  timeTextUser: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
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
    backgroundColor: COLORS.primary,
    marginHorizontal: 2,
  },
  aiDecoration: {
    position: 'absolute',
    top: 8,
    left: 0,
    width: 3,
    height: '70%',
    alignItems: 'center',
  },
  aiDecorationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginBottom: 4,
  },
  aiDecorationLine: {
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(44, 107, 237, 0.2)',
    borderRadius: 1,
  },
});

export default MessageBubble; 