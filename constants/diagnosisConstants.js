// Constants for diagnosis results
export const DIAGNOSIS_TEXT = {
  // Headers and labels
  RESULTS_TITLE: 'نتایج تشخیص',
  POSSIBLE_CONDITIONS: 'شرایط احتمالی',
  SYMPTOMS: 'علائم شناسایی شده',
  RECOMMENDED_TREATMENTS: 'درمان‌های پیشنهادی',
  VIEW_DETAILS: 'مشاهده جزئیات',
  HIDE_DETAILS: 'پنهان کردن جزئیات',
  DIAGNOSIS_CONFIDENCE: 'اطمینان تشخیص',
  TALK_TO_DOCTOR: 'صحبت با پزشک',
  
  // Description texts
  CONFIDENCE_EXPLANATION: 'درصد اطمینان بر اساس علائم و اطلاعات ارائه شده به هوش مصنوعی',
  DISCLAIMER: 'این تشخیص صرفاً برای اطلاع‌رسانی است و جایگزین مشاوره پزشکی نیست.',
  
  // Severity levels
  SEVERITY_LOW: 'خفیف',
  SEVERITY_MEDIUM: 'متوسط',
  SEVERITY_HIGH: 'شدید',
};

// Mock medical conditions with probabilities
export const MEDICAL_CONDITIONS = [
  {
    id: 'condition_1',
    name: 'سرماخوردگی',
    probability: 85,
    severity: 'LOW',
    description: 'یک عفونت ویروسی معمول که بر دستگاه تنفسی فوقانی تأثیر می‌گذارد.',
    urgency: 'LOW',
    color: '#4CAF50', // Green for low urgency
  },
  {
    id: 'condition_2',
    name: 'آنفولانزا',
    probability: 45,
    severity: 'MEDIUM',
    description: 'یک بیماری ویروسی که به طور معمول با تب، سرفه و درد بدن همراه است.',
    urgency: 'MEDIUM',
    color: '#FFC107', // Yellow for medium urgency
  },
  {
    id: 'condition_3',
    name: 'آلرژی فصلی',
    probability: 35,
    severity: 'LOW',
    description: 'واکنش سیستم ایمنی بدن به گرده‌ها یا دیگر آلرژن‌های محیطی.',
    urgency: 'LOW',
    color: '#4CAF50', // Green for low urgency
  },
  {
    id: 'condition_4',
    name: 'سینوزیت',
    probability: 20,
    severity: 'MEDIUM',
    description: 'التهاب سینوس‌ها، اغلب ناشی از عفونت باکتریایی یا ویروسی.',
    urgency: 'MEDIUM',
    color: '#FFC107', // Yellow for medium urgency
  },
];

// Mock symptoms identified
export const IDENTIFIED_SYMPTOMS = [
  {
    id: 'symptom_1',
    name: 'سرفه',
    severity: 'MEDIUM',
    duration: '۳ روز',
    relatedConditions: ['condition_1', 'condition_2'],
  },
  {
    id: 'symptom_2',
    name: 'آبریزش بینی',
    severity: 'LOW',
    duration: '۴ روز',
    relatedConditions: ['condition_1', 'condition_3'],
  },
  {
    id: 'symptom_3',
    name: 'گلودرد',
    severity: 'MEDIUM',
    duration: '۲ روز',
    relatedConditions: ['condition_1', 'condition_2'],
  },
  {
    id: 'symptom_4',
    name: 'سردرد',
    severity: 'MEDIUM',
    duration: '۳ روز',
    relatedConditions: ['condition_1', 'condition_2', 'condition_4'],
  },
  {
    id: 'symptom_5',
    name: 'خستگی',
    severity: 'LOW',
    duration: '۴ روز',
    relatedConditions: ['condition_1', 'condition_2'],
  },
];

// Mock recommended treatments
export const RECOMMENDED_TREATMENTS = [
  {
    id: 'treatment_1',
    name: 'استراحت و استراحت کافی',
    description: 'حداقل ۸ ساعت در روز استراحت کنید و خواب کافی داشته باشید.',
    forConditions: ['condition_1', 'condition_2'],
  },
  {
    id: 'treatment_2',
    name: 'نوشیدن مایعات فراوان',
    description: 'روزانه حداقل ۸ لیوان آب یا مایعات گرم مانند چای بنوشید.',
    forConditions: ['condition_1', 'condition_2', 'condition_4'],
  },
  {
    id: 'treatment_3',
    name: 'مصرف داروهای ضد احتقان',
    description: 'داروهای بدون نسخه مانند سودوافدرین برای کاهش احتقان بینی.',
    forConditions: ['condition_1', 'condition_3', 'condition_4'],
  },
  {
    id: 'treatment_4',
    name: 'آنتی هیستامین',
    description: 'داروهای ضد آلرژی مانند لوراتادین یا ستیریزین.',
    forConditions: ['condition_3'],
  },
  {
    id: 'treatment_5',
    name: 'مصرف استامینوفن یا ایبوپروفن',
    description: 'برای کاهش درد و تب، با توجه به دستورالعمل مصرف کنید.',
    forConditions: ['condition_1', 'condition_2', 'condition_4'],
  },
];

// UI Constants
export const DIAGNOSIS_UI = {
  CARD_BORDER_RADIUS: 16,
  PROGRESS_SIZE: 120,
  ANIMATION_DURATION: 1000,
  CARD_TRANSITION: 300,
  MAX_PROBABILITY_BAR_WIDTH: 80,
};

// Color mapping for probability ranges
export const PROBABILITY_COLORS = {
  HIGH: '#F44336', // High probability (red)
  MEDIUM: '#FFC107', // Medium probability (yellow)
  LOW: '#4CAF50', // Low probability (green)
}; 