import React, { useState } from 'react';
import { WelcomeScreen } from './onboarding/WelcomeScreen';
import { LanguageSelector } from './onboarding/LanguageSelector';
import { UserTypeSelector } from './onboarding/UserTypeSelector';
import { SignUpForm } from './onboarding/SignUpForm';
import { LoginForm } from './onboarding/LoginForm';
import { WelcomeBonusScreen } from './onboarding/WelcomeBonusScreen';
import type { Language, UserType, SignUpData, UserProfile, OnboardingProps } from '../types/onboarding';

type OnboardingStep = 
  | 'welcome'
  | 'language'
  | 'userType'
  | 'signUp'
  | 'login'
  | 'teacherSignUp'
  | 'welcomeBonus';

export const OnboardingFlow: React.FC<OnboardingProps> = ({
  onComplete,
  language,
  onLanguageChange,
  demoAccountData
}) => {
  // Always start with welcome screen for better user experience
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedUserType, setSelectedUserType] = useState<UserType>('student');
  const [completedUser, setCompletedUser] = useState<UserProfile | null>(null);

  const handleSignUpComplete = (data: SignUpData) => {
    const user: UserProfile = {
      id: `user_${Date.now()}`,
      name: data.name,
      username: data.username || data.name.toLowerCase().replace(/\s+/g, ''),
      email: data.email,
      type: data.type,
      grade: data.grade,
      school: data.school,
      profilePicture: data.profilePicture,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      xp: 100, // Welcome bonus
      level: 1,
      badges: ['new_learner'],
      streak: 1
    };

    // Store user locally for offline capability
    localStorage.setItem('learnio_user', JSON.stringify(user));
    
    setCompletedUser(user);
    setCurrentStep('welcomeBonus');
  };

  const handleLoginComplete = (user: UserProfile) => {
    // The LoginForm component now handles all authentication logic
    // and passes the validated user profile directly
    if (user && user.id && user.name && user.type) {
      localStorage.setItem('learnio_user', JSON.stringify(user));
      onComplete(user);
    } else {
      console.error('Invalid user profile received from login');
    }
  };

  const handleWelcomeBonusComplete = () => {
    if (completedUser) {
      onComplete(completedUser);
    }
  };

  const handleForgotPassword = () => {
    // In a real app, this would trigger password reset flow
    alert('Password reset functionality would be implemented here.');
  };

  const navigateToLogin = () => {
    setCurrentStep('login');
  };

  const navigateToSignUp = (userType: UserType) => {
    setSelectedUserType(userType);
    setCurrentStep(userType === 'teacher' ? 'teacherSignUp' : 'signUp');
  };

  switch (currentStep) {
    case 'welcome':
      return (
        <WelcomeScreen
          language={language}
          onNext={() => setCurrentStep('userType')}
          onLanguageSelect={() => setCurrentStep('language')}
        />
      );

    case 'language':
      return (
        <LanguageSelector
          selectedLanguage={language}
          onLanguageSelect={onLanguageChange}
          onBack={() => setCurrentStep('welcome')}
          onNext={() => setCurrentStep('userType')}
        />
      );

    case 'userType':
      return (
        <UserTypeSelector
          language={language}
          onUserTypeSelect={navigateToSignUp}
          onLogin={navigateToLogin}
          onBack={() => setCurrentStep('welcome')}
        />
      );

    case 'signUp':
    case 'teacherSignUp':
      return (
        <SignUpForm
          language={language}
          userType={selectedUserType}
          onSubmit={handleSignUpComplete}
          onBack={() => setCurrentStep('userType')}
        />
      );

    case 'login':
      return (
        <LoginForm
          language={language}
          onSubmit={handleLoginComplete}
          onBack={() => setCurrentStep('userType')}
          onForgotPassword={handleForgotPassword}
          demoAccountData={demoAccountData}
        />
      );

    case 'welcomeBonus':
      return completedUser ? (
        <WelcomeBonusScreen
          language={language}
          user={completedUser}
          onComplete={handleWelcomeBonusComplete}
        />
      ) : null;

    default:
      return null;
  }
};