// TypeScript interfaces for chat components

export interface Message {
  id: string;
  text?: string;
  sender: 'user' | 'ai';
  timestamp?: Date;
  formattedTime?: string;
  isTyping?: boolean;
}

export interface UserMessage extends Message {
  sender: 'user';
  text: string;
  timestamp: Date;
  formattedTime: string;
}

export interface AIMessage extends Message {
  sender: 'ai';
  text: string;
  timestamp: Date;
  formattedTime: string;
}

export interface TypingIndicatorMessage extends Message {
  sender: 'ai';
  isTyping: true;
  id: string;
}

export interface QuickQuestion {
  id: string;
  text: string;
  icon: string;
}

export interface MessageGroup {
  date: string;
  messages: Message[];
} 