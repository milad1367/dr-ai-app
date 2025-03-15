// Utility functions for handling chat messages

/**
 * Generate a unique ID for messages
 * @returns {string} A unique message ID
 */
export const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Format a timestamp for display in chat
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string (e.g., "14:30")
 */
export const formatMessageTime = (date = new Date()) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Create a new user message object
 * @param {string} text - The message text
 * @returns {Object} Formatted message object
 */
export const createUserMessage = (text) => {
  const timestamp = new Date();
  return {
    id: generateMessageId(),
    text,
    sender: 'user',
    timestamp,
    formattedTime: formatMessageTime(timestamp),
  };
};

/**
 * Create a new AI message object
 * @param {string} text - The message text
 * @returns {Object} Formatted message object
 */
export const createAIMessage = (text) => {
  const timestamp = new Date();
  return {
    id: generateMessageId(),
    text,
    sender: 'ai',
    timestamp,
    formattedTime: formatMessageTime(timestamp),
  };
};

/**
 * Create a typing indicator message
 * @returns {Object} Typing indicator message object
 */
export const createTypingIndicatorMessage = () => {
  return {
    id: 'typing-indicator',
    sender: 'ai',
    isTyping: true,
  };
};

/**
 * Group messages by date
 * @param {Array} messages - Array of message objects
 * @returns {Array} Array of message groups with date headers
 */
export const groupMessagesByDate = (messages) => {
  if (!messages || messages.length === 0) return [];
  
  const groups = [];
  let currentDate = null;
  let currentGroup = null;
  
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
    
    currentGroup.messages.push(message);
  });
  
  return groups;
}; 