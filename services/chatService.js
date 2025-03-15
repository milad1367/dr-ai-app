// Mock chat service for AI-powered medical consultations
import { AI_RESPONSES } from '../constants/chatConstants';

// Mock delay for simulating network request
const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get a response from the AI doctor based on the user's message
 * In a real app, this would make an API call to a backend service
 */
export const getAIResponse = async (message) => {
  // Simulate network delay (1-2 seconds)
  await simulateDelay(1000 + Math.random() * 1000);
  
  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase();
  
  // Simple keyword matching for demo purposes
  if (lowerMessage.includes('سردرد') || lowerMessage.includes('headache')) {
    return AI_RESPONSES.HEADACHE;
  } else if (lowerMessage.includes('سرماخوردگی') || lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
    return AI_RESPONSES.COLD_SYMPTOMS;
  } else if (lowerMessage.includes('دارو') || lowerMessage.includes('medicine')) {
    return AI_RESPONSES.MEDICINE;
  } else if (lowerMessage.includes('پزشک') || lowerMessage.includes('doctor') || lowerMessage.includes('visit')) {
    return AI_RESPONSES.DOCTOR_VISIT;
  } else {
    return AI_RESPONSES.UNKNOWN;
  }
};

/**
 * Get a response for a quick question
 */
export const getQuickQuestionResponse = async (questionId) => {
  // Simulate network delay (0.5-1.5 seconds)
  await simulateDelay(500 + Math.random() * 1000);
  
  switch (questionId) {
    case 'q1':
      return AI_RESPONSES.HEADACHE;
    case 'q2':
      return AI_RESPONSES.COLD_SYMPTOMS;
    case 'q3':
      return AI_RESPONSES.MEDICINE;
    case 'q4':
      return AI_RESPONSES.DOCTOR_VISIT;
    default:
      return AI_RESPONSES.UNKNOWN;
  }
};

/**
 * Convert speech to text (mock implementation)
 * In a real app, this would use the device's speech recognition API
 */
export const convertSpeechToText = async () => {
  // Simulate processing delay
  await simulateDelay(2000);
  
  // Return a random predefined phrase for demo purposes
  const demoQuestions = [
    'من سردرد شدید دارم',
    'علائم سرماخوردگی چیست؟',
    'چه داروهایی برای گلودرد مناسب است؟',
    'آیا باید به پزشک مراجعه کنم؟'
  ];
  
  return demoQuestions[Math.floor(Math.random() * demoQuestions.length)];
}; 