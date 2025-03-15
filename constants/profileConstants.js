// Profile Constants for dr-ai app
// Contains constants for profile-related features

// Text constants for profile section
export const PROFILE_TEXT = {
  EDIT_PROFILE: 'ویرایش پروفایل',
  VIEW_MEDICAL_HISTORY: 'مشاهده سوابق پزشکی',
  DATE_OF_BIRTH: 'تاریخ تولد',
  LAST_CHECKUP: 'آخرین معاینه',
  HEALTH_STATUS: 'وضعیت سلامتی',
  AGE: 'سن',
  YEARS_OLD: 'ساله',
  PROFILE_INFO: 'اطلاعات پروفایل',
  MEDICAL_HISTORY: 'سوابق پزشکی',
  BACK: 'بازگشت',
  SAVE: 'ذخیره',
  CANCEL: 'انصراف',
  NO_MEDICAL_HISTORY: 'سابقه پزشکی ثبت نشده است',
  LOADING: 'در حال بارگذاری...',
};

// Default profile values
export const DEFAULT_PROFILE = {
  name: 'کاربر',
  age: null,
  dateOfBirth: null,
  lastCheckupDate: null,
  healthStatus: 'Normal',
  avatarUrl: null,
};

// Avatar constants
export const AVATAR = {
  SIZE: 100,          // Size for profile page
  SIZE_SMALL: 40,     // Size for small avatar displays
  BORDER_WIDTH: 3,    // Border width
  BACKGROUND_COLORS: [ // Background colors when no avatar image is available
    '#2C6BED',
    '#00C6BA',
    '#6C63FF',
    '#FFA94D',
    '#4CAF50'
  ],
  // Default avatar background color
  DEFAULT_BG_COLOR: '#2C6BED',
};

// Animation timing
export const PROFILE_ANIMATION = {
  FADE_IN_DURATION: 500,
  STAGGER_DELAY: 100,
  SCALE_DURATION: 200,
};

// Layout constants
export const PROFILE_LAYOUT = {
  SECTION_MARGIN: 20,
  ITEM_PADDING: 16,
  AVATAR_TOP_MARGIN: 30,
  CARD_BORDER_RADIUS: 16,
  BUTTON_BORDER_RADIUS: 12,
}; 