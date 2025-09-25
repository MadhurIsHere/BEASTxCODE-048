import type { ValidationErrors, SignUpData, LoginData, Language } from '../types/onboarding';
import { getTranslation } from './translations';

export const validateSignUpData = (data: Partial<SignUpData>, language: Language): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!data.name?.trim()) {
    errors.name = getTranslation('nameRequired', language);
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (data.type === 'student' && (!data.grade || data.grade < 6 || data.grade > 12)) {
    errors.grade = getTranslation('gradeRequired', language);
  }
  
  if (data.type === 'teacher' && !data.teacherCode?.trim()) {
    errors.teacherCode = getTranslation('teacherCodeRequired', language);
  }
  
  return errors;
};

export const validateLoginData = (data: Partial<LoginData>, language: Language): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!data.usernameOrEmail?.trim()) {
    errors.usernameOrEmail = getTranslation('usernameRequired', language);
  }
  
  if (!data.password?.trim()) {
    errors.password = getTranslation('passwordRequired', language);
  }
  
  return errors;
};

export const validateTermsAcceptance = (accepted: boolean, language: Language): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!accepted) {
    errors.terms = getTranslation('termsRequired', language);
  }
  
  return errors;
};