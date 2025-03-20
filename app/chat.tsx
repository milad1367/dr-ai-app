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
  I18nManager,
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

// Enable RTL for the entire application
I18nManager.forceRTL(true);

// Get screen dimensions for responsive styling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Updated medical teal/blue colors
const MEDICAL_COLORS = {
  primary: '#00A8B5', // Teal primary color
  secondary: '#0078A8', // Deeper blue secondary color
  light: '#E5F8FA', // Very light teal for backgrounds
  highlight: '#00C6D4', // Bright teal for highlights
  text: '#2A4054', // Dark blue-gray for text
  background: '#FFFFFF', // Clean white background
};

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
  
  // Initialize with welcome message in Persian
  useEffect(() => {
    const welcomeMessage: AIMessage = createAIMessage("سلام! من دستیار هوش مصنوعی پزشکی شما هستم. چگونه می‌توانم کمکتان کنم؟");
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
      // For demo purposes, we'll use placeholder responses in Persian
      setTimeout(() => {
        const responseOptions = [
          "بله، من می‌توانم در این مورد کمک کنم. لطفاً جزئیات بیشتری بدهید.",
          "براساس اطلاعاتی که دادید، پیشنهاد می‌کنم...",
          "این علائم می‌تواند نشان‌دهنده چندین مورد باشد. برای تشخیص دقیق‌تر به اطلاعات بیشتری نیاز دارم.",
          "لطفاً توجه داشته باشید که من فقط اطلاعات عمومی ارائه می‌دهم و جایگزین مشاوره پزشکی نیستم.",
        ];
        
        const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
        const aiMessage: AIMessage = createAIMessage(randomResponse);
        
        // Remove typing indicator and add the real response
        setIsTyping(false);
        setMessages((prev: Message[]) => [...prev, aiMessage]);
        
        // Scroll to show the new message
        scrollToBottom();
        
        // Provide haptic feedback when response arrives
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setInputDisabled(false);
      }, 1500);
    } catch (error) {
      setIsTyping(false);
      console.error('Error getting AI response:', error);
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
        // For demo purposes, we'll use a placeholder voice input text in Persian
        setTimeout(() => {
          const transcribedText = "سردرد شدید دارم و چشمانم درد می‌کند";
          handleSendMessage(transcribedText);
          setIsRecording(false);
        }, 2000);
      } catch (error) {
        console.error('Error in voice input:', error);
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
      <StatusBar barStyle="light-content" backgroundColor={MEDICAL_COLORS.primary} />
      
      {/* Chat header with Persian title */}
      <ChatHeader 
        onBackPress={handleBackPress}
        title="🩺 چت با دکتر هوش مصنوعی"
        isRTL={true}
      />
      
      {/* Main content area with gradient background */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.chatBackground}>
          {/* Background pattern for subtle visual interest */}
          <Animated.View 
            style={[
              styles.backgroundPattern,
              { opacity: backgroundPatternOpacity }
            ]}
          >
            {[...Array(4)].map((_, index) => (
              <View 
                key={index}
                style={[
                  styles.patternCircle,
                  {
                    top: 50 + (index % 2) * (SCREEN_HEIGHT / 3),
                    right: index % 2 === 0 ? -30 : undefined,
                    left: index % 2 === 1 ? -30 : undefined,
                    width: 120 + (index % 2) * 40,
                    height: 120 + (index % 2) * 40,
                    opacity: 0.05 - (index * 0.005),
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
                isRTL={true}
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
              <MessageBubble 
                message={createTypingIndicatorMessage() as TypingIndicatorMessage}
                isRTL={true}
              />
            </View>
          )}
        </View>
        
        {/* Input area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onStartVoiceInput={handleVoiceInput}
          isRecording={isRecording}
          inputDisabled={inputDisabled}
          isRTL={true}
          placeholder="پیام خود را اینجا بنویسید..."
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MEDICAL_COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatBackground: {
    flex: 1,
    backgroundColor: MEDICAL_COLORS.background,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: MEDICAL_COLORS.primary,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
}); 