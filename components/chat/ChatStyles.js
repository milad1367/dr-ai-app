// Enhanced chat styles for dr-ai-app
import { Platform } from 'react-native';
import { COLORS } from '../../constants';

// Advanced shadow styles for different platforms
export const getShadow = (level = 'medium') => {
  const shadowMap = {
    light: {
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    },
    medium: {
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    },
    strong: {
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    },
  };

  return Platform.select(shadowMap[level]);
};

// Glass effect styling
export const getGlassEffect = (opacity = 0.8) => {
  return Platform.select({
    ios: {
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      // Note: backdropFilter only works on iOS
      backdropFilter: 'blur(10px)',
    },
    android: {
      backgroundColor: `rgba(255, 255, 255, ${opacity + 0.1})`, // Slightly more opaque on Android
    },
  });
};

// Chat UI specific constants
export const CHAT_STYLES = {
  // Header
  HEADER_HEIGHT: 70,
  HEADER_PADDING_VERTICAL: 12,
  HEADER_ICON_SIZE: 22,
  
  // Message bubbles
  USER_BUBBLE_RADIUS: 20,
  AI_BUBBLE_RADIUS: 20,
  BUBBLE_PADDING_HORIZONTAL: 16,
  BUBBLE_PADDING_VERTICAL: 12,
  MESSAGE_SPACING: 10,
  MESSAGE_FONT_SIZE: 16,
  MESSAGE_LINE_HEIGHT: 22,
  
  // Input
  INPUT_HEIGHT: 58,
  INPUT_BORDER_RADIUS: 30,
  INPUT_FONT_SIZE: 16,
  INPUT_PADDING_HORIZONTAL: 18,
  INPUT_MAX_HEIGHT: 100,
  
  // Action buttons
  ACTION_BUTTON_SIZE: 48,
  ACTION_BUTTON_ICON_SIZE: 20,
  ACTION_BUTTON_BORDER_RADIUS: 24,
  QUICK_ACTION_HEIGHT: 44,
  QUICK_ACTION_RADIUS: 22,
  
  // Animations
  ANIMATION_DURATION_FAST: 200,
  ANIMATION_DURATION_NORMAL: 300,
  ANIMATION_DURATION_SLOW: 500,
  SPRING_CONFIG: {
    DAMPING: 18,
    STIFFNESS: 250,
    MASS: 1,
  },
  
  // Bottom nav
  BOTTOM_TAB_HEIGHT: 60,
  
  // Gradients
  GRADIENTS: {
    PRIMARY: ['#2C6BED', '#1A54D9'],
    SECONDARY: ['#00C6BA', '#00A89E'],
    USER_MESSAGE: ['#2C6BED', '#1953D8'],
    QUICK_ACTION: ['rgba(44, 107, 237, 0.12)', 'rgba(44, 107, 237, 0.22)'],
    SEND_BUTTON: ['#2C6BED', '#1E56CC'],
    VOICE_BUTTON: ['rgba(44, 107, 237, 0.08)', 'rgba(44, 107, 237, 0.16)'],
    HEADER: ['#2C6BED', '#1850C4'],
  },
};

// RTL text styling helper
export const getRTLTextStyle = (fontSize = 16, color = COLORS.text, fontWeight = 'normal') => {
  return {
    fontSize,
    color,
    fontWeight,
    textAlign: 'right',
    writingDirection: 'rtl',
  };
};

// Enhanced glass card style
export const glassCard = {
  ...getGlassEffect(0.7),
  borderRadius: 20,
  borderWidth: Platform.OS === 'ios' ? 0 : 0.5,
  borderColor: 'rgba(200, 220, 240, 0.5)',
  ...getShadow('medium'),
};

// Button animation config
export const BUTTON_ANIMATION = {
  SCALE_DOWN: 0.96,
  DURATION_PRESS: 100,
  DURATION_RELEASE: 200,
}; 