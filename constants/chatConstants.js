// Chat-related constants for dr-ai-app

// Common phrases and messages (Persian)
export const CHAT_TEXT = {
  AI_NAME: 'دکتر هوش مصنوعی',
  WELCOME_MESSAGE: 'سلام! من دستیار پزشکی هوش مصنوعی شما هستم. چطور می‌توانم کمک کنم؟',
  TYPING_TEXT: 'در حال تایپ...',
  SEND_BUTTON: 'ارسال',
  VOICE_INPUT_PLACEHOLDER: 'برای شروع صحبت نگه دارید',
  TEXT_INPUT_PLACEHOLDER: 'پیام خود را بنویسید...',
  QUICK_QUESTIONS_TITLE: 'سوالات پرتکرار',
};

// Quick question suggestions (Persian)
export const QUICK_QUESTIONS = [
  {
    id: 'q1',
    text: 'من سردرد دارم',
    icon: 'head-side-virus',
  },
  {
    id: 'q2',
    text: 'علائم سرماخوردگی',
    icon: 'thermometer',
  },
  {
    id: 'q3',
    text: 'چه داروهایی مصرف کنم؟',
    icon: 'pills',
  },
  {
    id: 'q4',
    text: 'آیا باید به پزشک مراجعه کنم؟',
    icon: 'user-md',
  },
];

// AI sample responses (for demo purposes)
export const AI_RESPONSES = {
  HEADACHE: 'سردرد می‌تواند ناشی از دلایل مختلفی باشد، مانند استرس، کم‌آبی بدن، یا خستگی. آیا علائم دیگری هم دارید؟',
  COLD_SYMPTOMS: 'علائم معمول سرماخوردگی شامل آبریزش بینی، گلودرد، سرفه، عطسه و گاهی تب خفیف است. استراحت، نوشیدن مایعات و داروهای بدون نسخه می‌تواند کمک کننده باشد.',
  MEDICINE: 'بدون اطلاعات دقیق در مورد علائم و وضعیت سلامتی شما، نمی‌توانم داروی خاصی را توصیه کنم. لطفاً علائم خود را با جزئیات بیشتری توضیح دهید.',
  DOCTOR_VISIT: 'اگر علائم شدید دارید، بیش از چند روز ادامه داشته، یا نگران کننده هستند، مراجعه به پزشک توصیه می‌شود. آیا می‌توانید علائم خود را توضیح دهید؟',
  UNKNOWN: 'متوجه نشدم. لطفاً سوال خود را به شکل دیگری بپرسید یا جزئیات بیشتری ارائه دهید.',
};

// UI-related constants
export const CHAT_UI = {
  // Spacing
  MESSAGE_GAP: 12,
  BUBBLE_PADDING: 14,
  
  // Styling
  BUBBLE_BORDER_RADIUS: 20,
  USER_BUBBLE_GRADIENT: ['#2C6BED', '#1953D8'],
  AI_BUBBLE_GLASS: 'rgba(240, 250, 255, 0.75)',
  AI_BUBBLE_BORDER: 'rgba(200, 220, 240, 0.5)',
  QUICK_QUESTION_BACKGROUND: 'rgba(44, 107, 237, 0.08)',
  QUICK_QUESTION_BORDER: 'rgba(44, 107, 237, 0.2)',
  
  // Animation
  ANIMATION_DURATION: 300,
  TYPING_ANIMATION_SPEED: 800,
  
  // Dimensions
  INPUT_HEIGHT: 54,
  MAX_BUBBLE_WIDTH_PERCENTAGE: 75,
  BOTTOM_CONTAINER_RADIUS: 20,
  
  // Shadow
  SHADOW_OPACITY_LIGHT: 0.15,
  SHADOW_OPACITY_MEDIUM: 0.25,
  SHADOW_RADIUS_SMALL: 3,
  SHADOW_RADIUS_MEDIUM: 5,
}; 