// Utility functions for handling chat messages
import { Message, UserMessage, AIMessage, TypingIndicatorMessage, MessageGroup } from '../types/chat';

/**
 * Generate a unique ID for messages
 * @returns {string} A unique message ID
 */
export const generateMessageId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Format a timestamp for display in chat
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string (e.g., "14:30")
 */
export const formatMessageTime = (date: Date = new Date()): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Create a new user message object
 * @param {string} text - The message text
 * @returns {UserMessage} Formatted message object
 */
export const createUserMessage = (text: string): UserMessage => {
  const timestamp = new Date();
  return {
    id: generateMessageId(),
    text,
    sender: 'user',
    timestamp,
    formattedTime: formatMessageTime(timestamp),
  } as UserMessage;
};

/**
 * Create a new AI message object
 * @param {string} text - The message text
 * @returns {AIMessage} Formatted message object
 */
export const createAIMessage = (text: string): AIMessage => {
  const timestamp = new Date();
  return {
    id: generateMessageId(),
    text,
    sender: 'ai',
    timestamp,
    formattedTime: formatMessageTime(timestamp),
  } as AIMessage;
};

/**
 * Create a typing indicator message
 * @returns {TypingIndicatorMessage} Typing indicator message object
 */
export const createTypingIndicatorMessage = (): TypingIndicatorMessage => {
  return {
    id: 'typing-indicator',
    sender: 'ai',
    isTyping: true,
  } as TypingIndicatorMessage;
};

/**
 * Group messages by date
 * @param {Array<Message>} messages - Array of message objects
 * @returns {Array<MessageGroup>} Array of message groups with date headers
 */
export const groupMessagesByDate = (messages: Message[]): MessageGroup[] => {
  if (!messages || messages.length === 0) return [];
  
  const groups: MessageGroup[] = [];
  let currentDate: string | null = null;
  let currentGroup: MessageGroup | null = null;
  
  messages.forEach(message => {
    if (!message.timestamp) return;
    
    const messageDate = new Date(message.timestamp);
    const dateString = messageDate.toLocaleDateString();
    
    if (dateString !== currentDate) {
      currentDate = dateString;
      currentGroup = {
        date: dateString,
        messages: []
      };
      groups.push(currentGroup);
    }
    
    currentGroup?.messages.push(message);
  });
  
  return groups;
}; 