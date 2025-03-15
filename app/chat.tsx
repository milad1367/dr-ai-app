import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants';
import { CHAT_TEXT, QUICK_QUESTIONS } from '../constants/chatConstants';
import BottomTabBar from '../components/ui/BottomTabBar';
import MessageBubble from '../components/chat/MessageBubble';
import QuickQuestion from '../components/chat/QuickQuestion';
import ChatInput from '../components/chat/ChatInput';
import ChatHeader from '../components/chat/ChatHeader';
import {
  createUserMessage,
  createAIMessage,
  createTypingIndicatorMessage,
} from '../utils/messageUtils';
import {
  getAIResponse,
  getQuickQuestionResponse,
  convertSpeechToText,
} from '../services/chatService';
import * as Haptics from 'expo-haptics';
import { Message, UserMessage, AIMessage, TypingIndicatorMessage } from '../types/chat';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_STYLES, getShadow, getGlassEffect } from '../components/chat/ChatStyles';

// Get screen dimensions for responsive styling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  
  // Animation for quick questions and background elements
  const quickQuestionsOpacity = useRef(new Animated.Value(0)).current;
  const backgroundPatternOpacity = useRef(new Animated.Value(0)).current;
  
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  
  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: AIMessage = createAIMessage(CHAT_TEXT.WELCOME_MESSAGE);
    setMessages([welcomeMessage]);
    
    // Animate in UI elements with staggered timing
    Animated.stagger(300, [
      Animated.timing(backgroundPatternOpacity, {
        toValue: 1,
        duration: CHAT_STYLES.ANIMATION_DURATION_NORMAL,
        useNativeDriver: true,
      }),
      Animated.timing(quickQuestionsOpacity, {
        toValue: 1,
        duration: CHAT_STYLES.ANIMATION_DURATION_NORMAL,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Always scroll to the bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);
  
  // Handle sending a user message
  const handleSendMessage = async (text: string) => {
    // Create and add user message
    const userMessage: UserMessage = createUserMessage(text);
    setMessages((prev: Message[]) => [...prev, userMessage]);
    
    // Provide haptic feedback when sending
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
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
      
      // Provide haptic feedback when response arrives
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setIsTyping(false);
      console.error('Error getting AI response:', error);
    } finally {
      setInputDisabled(false);
    }
  };
  
  // Handle quick questions
  const handleQuickQuestion = async (questionId: string, questionText: string) => {
    // Create and add user message
    const userMessage: UserMessage = createUserMessage(questionText);
    setMessages((prev: Message[]) => [...prev, userMessage]);
    
    // Provide haptic feedback when sending
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Show typing indicator
    setIsTyping(true);
    setInputDisabled(true);
    
    try {
      // Get AI response for the quick question
      const response = await getQuickQuestionResponse(questionId);
      
      // Add the AI response to messages
      const aiMessage: AIMessage = createAIMessage(response);
      
      // Remove typing indicator and add the real response
      setIsTyping(false);
      setMessages((prev: Message[]) => [...prev, aiMessage]);
      
      // Provide haptic feedback when response arrives
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setIsTyping(false);
      console.error('Error getting quick question response:', error);
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
      <View style={styles.contentContainer}>
        <LinearGradient
          colors={['rgba(250, 252, 255, 0.95)', 'rgba(238, 244, 255, 0.9)']}
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
                    opacity: 0.05 - (index * 0.005),
                  }
                ]}
              />
            ))}
          </Animated.View>
          
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            {/* Chat messages */}
            <FlatList
              ref={listRef}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContent}
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
            />
            
            {/* Typing indicator */}
            {isTyping && (
              <View style={styles.typingContainer}>
                <MessageBubble message={createTypingIndicatorMessage() as TypingIndicatorMessage} />
              </View>
            )}
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
      
      {/* Bottom glass effect container for controls */}
      <View style={styles.bottomControlsContainer}>
        <View style={styles.bottomGlassEffect}>
          {/* Quick questions */}
          <Animated.View 
            style={[
              styles.quickQuestionsContainer,
              { opacity: quickQuestionsOpacity }
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickQuestionsScroll}
            >
              {QUICK_QUESTIONS.map((question) => (
                <QuickQuestion
                  key={question.id}
                  text={question.text}
                  icon={question.icon}
                  onPress={() => handleQuickQuestion(question.id, question.text)}
                />
              ))}
            </ScrollView>
          </Animated.View>
          
          {/* Chat input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            onStartVoiceInput={handleVoiceInput}
            isRecording={isRecording}
            inputDisabled={inputDisabled}
          />
        </View>
        
        {/* Shadow overlay to enhance depth */}
        <View style={styles.bottomShadowOverlay} />
      </View>
      
      {/* Bottom tab bar - rendered after controls so it appears below */}
      <View style={styles.tabBarContainer}>
        <BottomTabBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF', // Slightly lighter background
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    marginBottom: CHAT_STYLES.BOTTOM_TAB_HEIGHT, // Space for the bottom tab
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
    backgroundColor: COLORS.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingTop: 16, // More spacing at top
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingBottom: 20, // More space at bottom
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  bottomControlsContainer: {
    position: 'absolute',
    bottom: CHAT_STYLES.BOTTOM_TAB_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  bottomGlassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)', // More opaque for better contrast
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(15px)', // Stronger blur effect
      },
    }),
    borderTopLeftRadius: 24, // More pronounced rounded corners
    borderTopRightRadius: 24,
    paddingBottom: 10, // More padding
    shadowColor: '#1A3A80',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderTopWidth: Platform.OS === 'ios' ? 0.5 : 1,
    borderColor: 'rgba(210, 230, 250, 0.6)', // More visible border
  },
  bottomShadowOverlay: {
    position: 'absolute',
    top: -20, // Extend above the glass effect
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 0, // No elevation on Android
    zIndex: -1,
  },
  quickQuestionsContainer: {
    paddingVertical: 14, // More vertical padding
    paddingHorizontal: 10,
  },
  quickQuestionsScroll: {
    paddingHorizontal: 8,
    paddingBottom: 2, // Small space at bottom
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: CHAT_STYLES.BOTTOM_TAB_HEIGHT,
    zIndex: 1,
  },
}); 