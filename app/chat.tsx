import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants';
import { CHAT_TEXT } from '../constants/chatConstants';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import ChatHeader from '../components/chat/ChatHeader';
import {
  createUserMessage,
  createAIMessage,
  createTypingIndicatorMessage,
} from '../utils/messageUtils';
import {
  getAIResponse,
  convertSpeechToText,
} from '../services/chatService';
import * as Haptics from 'expo-haptics';
import { Message, UserMessage, AIMessage, TypingIndicatorMessage } from '../types/chat';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_STYLES, getShadow, getGlassEffect } from '../components/chat/ChatStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Get screen dimensions for responsive styling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Animation for background elements
  const backgroundPatternOpacity = useRef(new Animated.Value(0)).current;
  
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  
  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: AIMessage = createAIMessage(CHAT_TEXT.WELCOME_MESSAGE);
    setMessages([welcomeMessage]);
    
    // Animate in UI elements
    Animated.timing(backgroundPatternOpacity, {
      toValue: 1,
      duration: CHAT_STYLES.ANIMATION_DURATION_NORMAL,
      useNativeDriver: true,
    }).start();
    
    // Set up keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        scrollToBottom(true);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );
    
    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  // Scroll to bottom when messages change or keyboard appears
  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => {
      if (listRef.current && messages.length > 0) {
        listRef.current.scrollToEnd({ animated });
      }
    }, 100);
  }, [messages.length]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  // Handle sending a user message
  const handleSendMessage = async (text: string) => {
    // Create and add user message
    const userMessage: UserMessage = createUserMessage(text);
    setMessages((prev: Message[]) => [...prev, userMessage]);
    
    // Provide haptic feedback when sending
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Scroll to bottom to show the new message
    scrollToBottom();
    
    // Show typing indicator
    setIsTyping(true);
    setInputDisabled(true);
    
    try {
      // Get AI response with artificial delay
      const response = await getAIResponse(text);
      
      // Add the AI response to messages
      const aiMessage: AIMessage = createAIMessage(response);
      
      // Remove typing indicator and add the real response
      setIsTyping(false);
      setMessages((prev: Message[]) => [...prev, aiMessage]);
      
      // Scroll to show the new message
      scrollToBottom();
      
      // Provide haptic feedback when response arrives
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setIsTyping(false);
      console.error('Error getting AI response:', error);
    } finally {
      setInputDisabled(false);
    }
  };
  
  // Handle voice input
  const handleVoiceInput = async () => {
    // Toggle recording state
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Provide haptic feedback when starting recording
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      try {
        // Mock speech-to-text conversion
        const spokenText = await convertSpeechToText();
        
        // Send the transcribed message
        handleSendMessage(spokenText);
      } catch (error) {
        console.error('Error in voice input:', error);
      } finally {
        setIsRecording(false);
      }
    } else {
      // Stop recording
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  
  // Handle back button press
  const handleBackPress = () => {
    router.back();
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3C78F0" />
      
      {/* Chat header */}
      <ChatHeader onBackPress={handleBackPress} />
      
      {/* Main content area with gradient background */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <LinearGradient
          colors={['#3C78F0', '#2450B2', '#1A3A80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        >
          {/* Background pattern for visual interest */}
          <Animated.View 
            style={[
              styles.backgroundPattern,
              { opacity: backgroundPatternOpacity }
            ]}
          >
            {[...Array(6)].map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.patternCircle,
                  {
                    top: 50 + (index % 3) * (SCREEN_HEIGHT / 4),
                    right: index % 2 === 0 ? -30 : undefined,
                    left: index % 2 === 1 ? -30 : undefined,
                    width: 120 + (index % 3) * 40,
                    height: 120 + (index % 3) * 40,
                    opacity: 0.07 - (index * 0.005),
                  }
                ]}
              />
            ))}
          </Animated.View>

          {/* Chat messages */}
          <FlatList
            ref={listRef}
            style={styles.messagesList}
            contentContainerStyle={[
              styles.messagesContent,
              { paddingBottom: keyboardVisible ? 20 : 90 }
            ]}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <MessageBubble
                message={item}
                isLastMessage={index === messages.length - 1}
              />
            )}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            onContentSizeChange={() => scrollToBottom()}
            onLayout={() => scrollToBottom(false)}
          />
          
          {/* Typing indicator */}
          {isTyping && (
            <View style={styles.typingContainer}>
              <MessageBubble message={createTypingIndicatorMessage() as TypingIndicatorMessage} />
            </View>
          )}
          
          {/* Float button to scroll to bottom when not at bottom */}
          <TouchableOpacity 
            style={styles.scrollToBottomButton}
            onPress={() => scrollToBottom(true)}
          >
            <LinearGradient
              colors={['#3C78F0', '#1D54C4']}
              style={styles.scrollButtonGradient}
            >
              <View style={styles.scrollButtonIcon} />
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Chat input */}
          <View style={styles.inputContainer}>
            <ChatInput
              onSendMessage={handleSendMessage}
              onStartVoiceInput={handleVoiceInput}
              isRecording={isRecording}
              inputDisabled={inputDisabled}
            />
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C78F0',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: COLORS.white,
  },
  messagesList: {
    flex: 1,
    paddingTop: 16,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    ...getShadow('strong'),
    overflow: 'hidden',
  },
  scrollButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollButtonIcon: {
    width: 12,
    height: 12,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.white,
    transform: [{ rotate: '-45deg' }],
    marginTop: -6,
  },
}); 