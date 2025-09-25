export type Language = 'en' | 'hi' | 'or';

export type UserType = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  type: UserType;
  name: string;
  username: string;
  email: string;
  grade?: number;
  school?: string;
  profilePicture: string;
  teacherCode?: string;
  createdAt: string;
  lastLogin: string;
  xp: number;
  level: number;
  badges: string[];
  streak: number;
}

export interface SignUpData extends UserProfile {
  // Additional signup-specific fields if needed
}

export interface LoginData {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

export interface OnboardingProps {
  onComplete: (user: UserProfile) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  demoAccountData?: {username: string; password: string} | null;
}