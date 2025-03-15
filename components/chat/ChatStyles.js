// Enhanced chat styles for dr-ai-app
import { Platform } from 'react-native';
import { COLORS } from '../../constants';

// Advanced shadow styles for different platforms
export const getShadow = (level = 'medium') => {
  const shadowMap = {
    light: {
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    },
    medium: {
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    },
    strong: {
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    },
  };

  return Platform.select(shadowMap[level]);
};

// Glass effect styling with improved opacity and blur
export const getGlassEffect = (opacity = 0.9) => {
  return Platform.select({
    ios: {
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      backdropFilter: 'blur(15px)',
    },
    android: {
      backgroundColor: `rgba(255, 255, 255, ${opacity + 0.08})`, // More opaque on Android
    },
  });
};

// Chat UI specific constants
export const CHAT_STYLES = {
  // Header
  HEADER_HEIGHT: 74,
  HEADER_PADDING_VERTICAL: 14,
  HEADER_ICON_SIZE: 24,
  
  // Message bubbles
  USER_BUBBLE_RADIUS: 22,
  AI_BUBBLE_RADIUS: 22,
  BUBBLE_PADDING_HORIZONTAL: 18,
  BUBBLE_PADDING_VERTICAL: 14,
  MESSAGE_SPACING: 12,
  MESSAGE_FONT_SIZE: 16,
  MESSAGE_LINE_HEIGHT: 24,
  
  // Input
  INPUT_HEIGHT: 60,
  INPUT_BORDER_RADIUS: 30,
  INPUT_FONT_SIZE: 16,
  INPUT_PADDING_HORIZONTAL: 20,
  INPUT_MAX_HEIGHT: 120,
  
  // Action buttons
  ACTION_BUTTON_SIZE: 50,
  ACTION_BUTTON_ICON_SIZE: 22,
  ACTION_BUTTON_BORDER_RADIUS: 25,
  QUICK_ACTION_HEIGHT: 46,
  QUICK_ACTION_RADIUS: 23,
  
  // Animations
  ANIMATION_DURATION_FAST: 180,
  ANIMATION_DURATION_NORMAL: 280,
  ANIMATION_DURATION_SLOW: 450,
  SPRING_CONFIG: {
    DAMPING: 15,
    STIFFNESS: 280,
    MASS: 1,
  },
  
  // Bottom nav
  BOTTOM_TAB_HEIGHT: 60,
  
  // Gradients
  GRADIENTS: {
    PRIMARY: ['#3C78F0', '#1A4DBF'],
    SECONDARY: ['#00C6BA', '#00A89E'],
    USER_MESSAGE: ['#3C78F0', '#1D54C4'],
    QUICK_ACTION: ['rgba(44, 107, 237, 0.15)', 'rgba(44, 107, 237, 0.28)'],
    SEND_BUTTON: ['#3C78F0', '#1D54C4'],
    VOICE_BUTTON: ['rgba(44, 107, 237, 0.12)', 'rgba(44, 107, 237, 0.24)'],
    HEADER: ['#3C78F0', '#1A4DBF'],
  },
};

// RTL text styling helper with enhanced contrast
export const getRTLTextStyle = (fontSize = 16, color = '#1A2138', fontWeight = 'normal') => {
  return {
    fontSize,
    color,
    fontWeight,
    textAlign: 'right',
    writingDirection: 'rtl',
    letterSpacing: -0.2, // Tighter text for premium feel
  };
};

// Enhanced glass card style
export const glassCard = {
  ...getGlassEffect(0.85),
  borderRadius: 22,
  borderWidth: Platform.OS === 'ios' ? 0.5 : 1,
  borderColor: 'rgba(210, 230, 250, 0.6)',
  ...getShadow('medium'),
};

// Button animation config with more pronounced effects
export const BUTTON_ANIMATION = {
  SCALE_DOWN: 0.92,
  DURATION_PRESS: 80,
  DURATION_RELEASE: 180,
}; 