import type { Language } from '../types/onboarding';

// Grade validation utilities
export const VALID_GRADES = [6, 7, 8, 9, 10, 11, 12] as const;
export type ValidGrade = typeof VALID_GRADES[number];

export const isValidGrade = (grade: any): grade is ValidGrade => {
  return typeof grade === 'number' && VALID_GRADES.includes(grade as ValidGrade);
};

// Dashboard content helpers
export const getDashboardTitle = (grade: number, language: Language): string => {
  const titles = {
    en: `Grade ${grade} Dashboard`,
    hi: `कक्षा ${grade} डैशबोर्ड`, 
    or: `ଶ୍ରେଣୀ ${grade} ଡ୍ୟାସବୋର୍ଡ`
  };
  return titles[language] || titles.en;
};

export const getGradeWithLevel = (grade: number, level: number, language: Language): string => {
  const formats = {
    en: `Grade ${grade} • Level ${level}`,
    hi: `कक्षा ${grade} • स्तर ${level}`,
    or: `ଶ୍ରେଣୀ ${grade} • ସ୍ତର ${level}`
  };
  return formats[language] || formats.en;
};

// Common button labels
export const getButtonLabels = (language: Language) => ({
  continue: {
    en: 'Continue',
    hi: 'जारी रखें',
    or: 'ଜାରି ରଖ'
  }[language],
  logout: {
    en: 'Logout',
    hi: 'लॉग आउट',
    or: 'ଲଗ୍ ଆଉଟ୍'
  }[language],
  prepare: {
    en: 'Prepare',
    hi: 'तैयारी करें',
    or: 'ପ୍ରସ୍ତୁତ କର'
  }[language],
  filter: {
    en: 'Filter',
    hi: 'फ़िल्टर',
    or: 'ଫିଲ୍ଟର'
  }[language]
});

// Tab labels for dashboards
export const getTabLabels = (language: Language) => ({
  subjects: {
    en: 'Subjects',
    hi: 'विषय',
    or: 'ବିଷୟ'
  }[language],
  progress: {
    en: 'Progress',
    hi: 'प्रगति',
    or: 'ପ୍ରଗତି'
  }[language],
  tests: {
    en: 'Tests',
    hi: 'परीक्षा',
    or: 'ପରୀକ୍ଷା'
  }[language],
  achievements: {
    en: 'Achievements',
    hi: 'उपलब्धियां',
    or: 'ସଫଳତା'
  }[language]
});

// Subject titles by language
export const getSubjectTitles = (language: Language) => ({
  math: {
    en: 'Advanced Mathematics',
    hi: 'उन्नत गणित',
    or: 'ଉନ୍ନତ ଗଣିତ'
  }[language],
  physics: {
    en: 'Physics',
    hi: 'भौतिकी',
    or: 'ପଦାର୍ଥ ବିଜ୍ଞାନ'
  }[language],
  chemistry: {
    en: 'Chemistry',
    hi: 'रसायन विज्ञान',
    or: 'ରସାୟନ ବିଜ୍ଞାନ'
  }[language],
  biology: {
    en: 'Biology',
    hi: 'जीव विज्ञान',
    or: 'ଜୀବ ବିଜ୍ଞାନ'
  }[language],
  computer: {
    en: 'Computer Science',
    hi: 'कंप्यूटर विज्ञान',
    or: 'କମ୍ପ୍ୟୁଟର ବିଜ୍ଞାନ'
  }[language],
  engineering: {
    en: 'Engineering Basics',
    hi: 'इंजीनियरिंग मूल बातें',
    or: 'ଇଞ୍ଜିନିୟରିଂ ମୂଳତତୱ'
  }[language]
});

// Performance analytics labels
export const getAnalyticsLabels = (language: Language) => ({
  weeklyXP: {
    en: 'Weekly XP Progress',
    hi: 'साप्ताहिक XP प्रगति',
    or: 'ସାପ୍ତାହିକ XP ପ୍ରଗତି'
  }[language],
  performanceAnalytics: {
    en: 'Performance Analytics',
    hi: 'प्रदर्शन विश्लेषण',
    or: 'କାର୍ଯ୍ୟଦକ୍ଷତା ବିଶ୍ଳେଷଣ'
  }[language],
  upcomingTests: {
    en: 'Upcoming Tests',
    hi: 'आगामी परीक्षाएं',
    or: 'ଆଗାମୀ ପରୀକ୍ଷା'
  }[language]
});

// Difficulty color mapping
export const getDifficultyColor = (difficulty: string): string => {
  const colorMap: Record<string, string> = {
    'Beginner': 'text-green-600 bg-green-100',
    'Intermediate': 'text-yellow-600 bg-yellow-100', 
    'Advanced': 'text-orange-600 bg-orange-100',
    'Expert': 'text-red-600 bg-red-100',
    'Medium': 'text-yellow-600 bg-yellow-100',
    'Hard': 'text-red-600 bg-red-100'
  };
  return colorMap[difficulty] || 'text-gray-600 bg-gray-100';
};

// Achievement tier colors
export const getAchievementTierStyle = (tier: string) => {
  const styles = {
    border: '',
    background: '',
    badge: ''
  };

  switch (tier) {
    case 'Platinum':
      styles.border = 'border-purple-300 bg-purple-50';
      styles.background = 'bg-purple-100';
      styles.badge = 'bg-purple-100 text-purple-700';
      break;
    case 'Gold':
      styles.border = 'border-yellow-300 bg-yellow-50';
      styles.background = 'bg-yellow-100';
      styles.badge = 'bg-yellow-100 text-yellow-700';
      break;
    case 'Silver':
      styles.border = 'border-gray-300 bg-gray-50';
      styles.background = 'bg-gray-100';
      styles.badge = 'bg-gray-100 text-gray-700';
      break;
    default:
      styles.border = 'border-gray-300 bg-gray-50';
      styles.background = 'bg-gray-100';
      styles.badge = 'bg-gray-100 text-gray-700';
  }

  return styles;
};

// Generate welcome message
export const getWelcomeMessage = (grade: number, userName: string, language: Language): string => {
  const messages = {
    en: `Grade ${grade} Dashboard - Welcome ${userName}`,
    hi: `कक्षा ${grade} डैशबोर्ड - स्वागत ${userName}`,
    or: `ଶ୍ରେଣୀ ${grade} ଡ୍ୟାସବୋର୍ଡ - ସ୍ୱାଗତ ${userName}`
  };
  return messages[language] || messages.en;
};