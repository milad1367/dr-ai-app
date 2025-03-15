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

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  
  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: AIMessage = createAIMessage(CHAT_TEXT.WELCOME_MESSAGE);
    setMessages([welcomeMessage]);
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Chat header */}
      <ChatHeader onBackPress={handleBackPress} />
      
      {/* Main content area with gradient background */}
      <View style={styles.contentContainer}>
        <LinearGradient
          colors={['rgba(240, 245, 255, 0.8)', 'rgba(230, 240, 250, 0.6)']}
          style={styles.backgroundGradient}
        >
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
      
      {/* Bottom tab bar - rendered first to be behind other elements */}
      <View style={styles.tabBarContainer}>
        <BottomTabBar />
      </View>
      
      {/* Fixed bottom section with quick questions and input - positioned above tab bar */}
      <View style={styles.bottomContainer}>
        {/* Quick questions */}
        <View style={styles.quickQuestionsContainer}>
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
        </View>
        
        {/* Chat input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          onStartVoiceInput={handleVoiceInput}
          isRecording={isRecording}
          inputDisabled={inputDisabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    marginBottom: 60, // Add margin for the tabBar height
  },
  backgroundGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 16,
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60, // Increased distance above the tab bar
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    paddingTop: 8,
    paddingBottom: 10,
    zIndex: 2, // Higher than the tab bar
  },
  quickQuestionsContainer: {
    marginBottom: 8,
  },
  quickQuestionsScroll: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quickQuestionsTitle: {
    fontSize: 14,
    color: COLORS.lightText,
    marginLeft: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
}); 