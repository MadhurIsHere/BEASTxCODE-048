import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { getTranslation } from '../../utils/translations';
import { validateSignUpData, validateTermsAcceptance } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';
import type { Language, UserType, SignUpData, ValidationErrors } from '../../types/onboarding';
import { User, GraduationCap, School, Camera, Eye, EyeOff, AlertCircle, Lock, Shield, Zap, Mail } from 'lucide-react';

interface SignUpFormProps {
  language: Language;
  userType: UserType;
  onSubmit: (data: SignUpData) => void;
  onBack: () => void;
}

const gradeOptions = [6, 7, 8, 9, 10, 11, 12];

const avatarOptions = [
  '🧑‍🎓', '👩‍🎓', '🧒', '👦', '👧', '🧑‍🔬', '👩‍🔬', '🧑‍💻'
];

// Enhanced password requirements
const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false // Keep simple for kids
};

// Enhanced validation functions
const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < passwordRequirements.minLength) {
    errors.push(`At least ${passwordRequirements.minLength} characters`);
  }
  
  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('One uppercase letter');
  }
  
  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('One lowercase letter');
  }
  
  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('One number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Removed generateSecureId function as authentication is now handled by Supabase

export const SignUpForm: React.FC<SignUpFormProps> = ({
  language,
  userType,
  onSubmit,
  onBack
}) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<Partial<SignUpData & { 
    email: string; 
    password: string; 
    confirmPassword: string;
    username: string;
  }>>({
    type: userType,
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: undefined,
    school: '',
    profilePicture: avatarOptions[0],
    teacherCode: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors & { 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
    username?: string;
  }>({});
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time password strength calculation
    if (field === 'password') {
      const validation = validatePassword(value);
      const strength = Math.max(0, Math.min(100, (4 - validation.errors.length) * 25));
      setPasswordStrength(strength);
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: any = {};
    
    if (currentStep === 1) {
      // Basic info validation
      if (!formData.name?.trim()) {
        newErrors.name = getTranslation('nameRequired', language);
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      
      if (!formData.username?.trim()) {
        newErrors.username = 'Username is required';
      } else if (formData.username.trim().length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores';
      }
      
      if (userType === 'student' && !formData.grade) {
        newErrors.grade = getTranslation('gradeRequired', language);
      }
      
      if (userType === 'teacher' && !formData.teacherCode?.trim()) {
        newErrors.teacherCode = getTranslation('teacherCodeRequired', language);
      }
    }
    
    if (currentStep === 2) {
      // Authentication validation
      if (!formData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else {
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
          newErrors.password = `Password must have: ${passwordValidation.errors.join(', ')}`;
        }
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (currentStep === (userType === 'student' ? 4 : 3)) {
      // Final step validation
      if (!termsAccepted) {
        newErrors.terms = getTranslation('termsRequired', language);
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Email verification success component
  const renderEmailVerification = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {language === 'en' ? 'Check Your Email!' : language === 'hi' ? 'अपना ईमेल जांचें!' : 'ଆପଣଙ୍କ ଇମେଲ୍ ଯାଞ୍ଚ କରନ୍ତୁ!'}
        </h2>
        <p className="text-gray-600 mb-4">
          {language === 'en' 
            ? `We've sent a verification link to ${verificationEmail}. Please check your email and click the link to complete your registration.`
            : language === 'hi'
            ? `हमने ${verificationEmail} पर एक सत्यापन लिंक भेजा है। कृपया अपना ईमेल जांचें और अपना पंजीकरण पूरा करने के लिए लिंक पर क्लिक करें।`
            : `ଆମେ ${verificationEmail} କୁ ଏକ ଯାଞ୍ଚ ଲିଙ୍କ ପଠାଇଛୁ। ଦୟାକରି ଆପଣଙ୍କ ଇମେଲ୍ ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ଆପଣଙ୍କ ପଞ୍ଜୀକରଣ ସମ୍ପୂର୍ଣ୍ଣ କରିବାକୁ ଲିଙ୍କରେ କ୍ଲିକ୍ କରନ୍ତୁ।`}
        </p>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          {language === 'en' 
            ? "Didn't receive the email? Check your spam folder or try registering again."
            : language === 'hi'
            ? "ईमेल नहीं मिला? अपना स्पैम फ़ोल्डर जांचें या फिर से पंजीकरण करने का प्रयास करें।"
            : "ଇମେଲ୍ ପାଇଲେ ନାହିଁ? ଆପଣଙ୍କ ସ୍ପାମ୍ ଫୋଲ୍ଡର ଯାଞ୍ଚ କରନ୍ତୁ କିମ୍ବା ପୁନର୍ବାର ପଞ୍ଜୀକରଣ କରିବାକୁ ଚେଷ୍ଟା କରନ୍ତୁ।"}
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12"
        >
          ← {getTranslation('back', language)}
        </Button>
        
        <Button
          onClick={() => {
            setEmailVerificationSent(false);
            setVerificationEmail('');
            setCurrentStep(1);
          }}
          className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          {language === 'en' ? 'Try Again' : language === 'hi' ? 'पुनः प्रयास करें' : 'ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ'}
        </Button>
      </div>
    </motion.div>
  );

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    const totalSteps = userType === 'student' ? 4 : 3;
    
    if (currentStep === totalSteps) {
      setIsLoading(true);
      
      try {
        // Register user with Supabase backend
        const response = await fetch(`https://dslnuitpvyhkdgamvkuh.supabase.co/functions/v1/make-server-c392be1f/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbG51aXRwdnloa2RnYW12a3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjcwNDksImV4cCI6MjA3MzcwMzA0OX0.AWZsNAUYSomywK8HqXkIm09MjDkA2nH77YkW3F7DNZc`
          },
          body: JSON.stringify({
            email: formData.email!.trim(),
            password: formData.password!.trim(),
            name: formData.name!.trim(),
            username: formData.username!.trim(),
            type: userType,
            grade: formData.grade,
            school: formData.school?.trim() || '',
            profilePicture: formData.profilePicture!,
            teacherCode: formData.teacherCode?.trim() || ''
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          // Check if email verification is required
          if (result.success && result.requiresVerification) {
            setEmailVerificationSent(true);
            setVerificationEmail(result.email);
            setErrors({}); // Clear any previous errors
            return;
          }
          
          // Handle immediate success (shouldn't happen with email verification enabled)
          if (result.success && result.user) {
            // Create user data object for local storage and callback
            const userData: SignUpData = {
              id: result.user.id,
              type: userType,
              name: formData.name!.trim(),
              username: formData.username!.trim(),
              email: formData.email!.trim(),
              grade: formData.grade,
              school: formData.school?.trim() || '',
              profilePicture: formData.profilePicture!,
              teacherCode: formData.teacherCode?.trim() || '',
              createdAt: result.user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              xp: result.user.xp || 100,
              level: result.user.level || 1,
              badges: ['new_learner'],
              streak: result.user.streak || 1
            };
            
            // Use auth context to log in the user
            await login(userData);
            
            onSubmit(userData);
          } else {
            setErrors({ general: result.error || (language === 'en' ? 'Registration failed. Please try again.' : language === 'hi' ? 'पंजीकरण विफल। कृपया पुनः प्रयास करें।' : 'ପଞ୍ଜୀକରଣ ବିଫଳ। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।') });
          }
        } else {
          // Try to get error message from response
          try {
            const errorData = await response.json();
            setErrors({ general: errorData.error || (language === 'en' ? 'Registration failed. Please try again.' : language === 'hi' ? 'पंजीकरण विफल। कृपया पुनः प्रयास करें।' : 'ପଞ୍ଜୀକରଣ ବିଫଳ। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।') });
          } catch {
            setErrors({ general: language === 'en' ? 'Server error. Please try again.' : language === 'hi' ? 'सर्वर त्रुटि। कृपया पुनः प्रयास करें।' : 'ସର୍ଭର ତ୍ରୁଟି। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।' });
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        setErrors({ general: language === 'en' ? 'Network error. Please check your connection and try again.' : language === 'hi' ? 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।' : 'ନେଟୱାର୍କ ତ୍ରୁଟି। ଦୟାକରି ଆପଣଙ୍କ ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Removed hashPassword function as authentication is now handled by Supabase

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {language === 'en' ? '👋 Tell us about yourself!' : language === 'hi' ? '👋 अपने बारे में बताएं!' : '👋 ଆପଣଙ୍କ ବିଷୟରେ କୁହନ୍ତୁ!'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' ? 'Let\'s create your awesome profile' : language === 'hi' ? 'आइए आपकी शानदार प्रोफाइल बनाते हैं' : 'ଆସନ��ତୁ ଆପଣଙ୍କର ଚମତ୍କାର ପ୍ରୋଫାଇଲ୍ ତିଆରି କରିବା'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">
            {getTranslation('name', language)} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder={getTranslation('namePlaceholder', language)}
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="h-12 text-base"
            maxLength={50}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="username">
            {language === 'en' ? 'Username' : language === 'hi' ? 'यूजरनेम' : 'ଉପଯୋଗକାରୀ ନାମ'} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="username"
            type="text"
            placeholder={language === 'en' ? 'Choose a unique username' : language === 'hi' ? 'एक अनोखा यूजरनेम चुनें' : 'ଏକ ଅନନ୍ୟ ଉପଯୋଗକାରୀ ନାମ ବାଛନ୍ତୁ'}
            value={formData.username || ''}
            onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
            className="h-12 text-base"
            maxLength={20}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.username}
            </p>
          )}
        </div>

        {userType === 'student' && (
          <div>
            <Label>
              {getTranslation('grade', language)} <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {gradeOptions.map((grade) => {
                const isComingSoon = [7, 10, 12].includes(grade);
                return (
                  <Button
                    key={grade}
                    type="button"
                    variant={formData.grade === grade ? "default" : "outline"}
                    className={`h-14 text-sm relative flex flex-col items-center justify-center p-2 ${
                      isComingSoon
                        ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-600 cursor-not-allowed hover:from-purple-50 hover:to-blue-50' 
                        : 'hover:bg-primary/5'
                    }`}
                    onClick={() => !isComingSoon && handleInputChange('grade', grade)}
                    disabled={isComingSoon}
                  >
                    {isComingSoon ? (
                      <>
                        <span className="font-medium text-sm">Grade {grade}</span>
                        <div className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium mt-1">
                          Coming Soon
                        </div>
                      </>
                    ) : (
                      <span className="font-medium">Grade {grade}</span>
                    )}
                  </Button>
                );
              })}
            </div>
            {errors.grade && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.grade}
              </p>
            )}
          </div>
        )}

        {userType === 'teacher' && (
          <div>
            <Label htmlFor="teacherCode">
              {getTranslation('teacherCode', language)} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="teacherCode"
              type="text"
              placeholder={getTranslation('teacherCodePlaceholder', language)}
              value={formData.teacherCode || ''}
              onChange={(e) => handleInputChange('teacherCode', e.target.value)}
              className="h-12 text-base"
            />
            {errors.teacherCode && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.teacherCode}
              </p>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="school">{getTranslation('schoolName', language)}</Label>
          <Input
            id="school"
            type="text"
            placeholder={getTranslation('schoolPlaceholder', language)}
            value={formData.school || ''}
            onChange={(e) => handleInputChange('school', e.target.value)}
            className="h-12 text-base"
            maxLength={100}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {language === 'en' ? '🔐 Secure Your Account' : language === 'hi' ? '🔐 अपने अकाउंट को सुरक्षित करें' : '🔐 ଆପଣଙ୍କ ଖାତାକୁ ସୁରକ୍ଷିତ କରନ୍ତୁ'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' ? 'Create a secure login for your account' : language === 'hi' ? 'अपने अकाउंट के लिए एक सुरक्षित लॉगिन बनाएं' : 'ଆପଣଙ୍କ ଖାତା ପାଇଁ ଏକ ସୁରକ୍ଷିତ ଲଗଇନ୍ ସୃଷ୍ଟି କରନ୍ତୁ'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">
            {language === 'en' ? 'Email Address' : language === 'hi' ? 'ईमेल पता' : 'ଇମେଲ୍ ଠିକଣା'} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={language === 'en' ? 'your.email@example.com' : language === 'hi' ? 'आपका.ईमेल@example.com' : 'ଆପଣଙ୍କର.ଇମେଲ୍@example.com'}
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value.toLowerCase())}
            className="h-12 text-base"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">
            {language === 'en' ? 'Password' : language === 'hi' ? 'पासवर्ड' : 'ପାସୱାର୍ଡ଼'} <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={language === 'en' ? 'Create a strong password' : language === 'hi' ? 'एक मजबूत पासवर्ड बनाएं' : 'ଏକ ଶକ୍ତିଶାଳୀ ପାସୱାର୍ଡ଼ ସୃଷ୍ଟି କରନ୍ତୁ'}
              value={formData.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="h-12 text-base pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          
          {formData.password && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Password strength:</span>
                <span className={`font-medium ${passwordStrength >= 75 ? 'text-green-600' : passwordStrength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">
            {language === 'en' ? 'Confirm Password' : language === 'hi' ? 'पासवर्ड की पुष्टि करें' : 'ପାସୱାର୍ଡ଼ ନିଶ୍ଚିତ କରନ୍ତୁ'} <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder={language === 'en' ? 'Type your password again' : language === 'hi' ? 'अपना पासवर्ड फिर से टाइप करें' : 'ଆପଣଙ୍କର ପାସୱାର୍ଡ଼ ପୁନର୍ବାର ଟାଇପ୍ କରନ୍ତୁ'}
              value={formData.confirmPassword || ''}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="h-12 text-base pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Password Requirements:</p>
              <ul className="space-y-0.5">
                <li>• At least 8 characters long</li>
                <li>• One uppercase letter (A-Z)</li>
                <li>• One lowercase letter (a-z)</li>
                <li>• One number (0-9)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {language === 'en' ? '🎨 Choose Your Avatar!' : language === 'hi' ? '🎨 अपना अवतार चुनें!' : '🎨 ଆପଣଙ୍କ ଅବତାର ବାଛନ୍ତୁ!'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' ? 'Pick a fun profile picture' : language === 'hi' ? 'एक मजेदार प्रोफाइल तस्वीर चुनें' : 'ଏକ ମଜାଦାର ପ୍ରୋଫାଇଲ୍ ଛବି ବାଛନ୍ତୁ'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {avatarOptions.map((avatar, index) => (
          <Button
            key={index}
            type="button"
            variant={formData.profilePicture === avatar ? "default" : "outline"}
            className="h-16 text-2xl p-0 hover:scale-110 transition-transform"
            onClick={() => handleInputChange('profilePicture', avatar)}
          >
            {avatar}
          </Button>
        ))}
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {language === 'en' ? '🎉 Almost Ready!' : language === 'hi' ? '🎉 लगभग तैयार!' : '🎉 ପ୍ରାୟ ପ୍ରସ୍ତୁତ!'}
        </h2>
        <p className="text-gray-600">
          {language === 'en' ? 'Let\'s review your awesome profile' : language === 'hi' ? 'आइए आपकी शानदार प्रोफाइल की समीक्षा करें' : 'ଆସନ୍ତୁ ଆପଣଙ୍କର ଚମତ୍କାର ପ୍ରୋଫାଇଲ୍ ସମୀକ୍ଷା କରିବା'}
        </p>
      </div>

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{formData.profilePicture}</div>
          <div className="flex-1">
            <p className="font-bold text-gray-800 text-lg">{formData.name}</p>
            <p className="text-sm text-gray-600">@{formData.username}</p>
            <p className="text-sm text-gray-600">
              {userType === 'student' 
                ? `Grade ${formData.grade}` 
                : 'Teacher'
              }
            </p>
            {formData.school && (
              <p className="text-sm text-gray-600">{formData.school}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{formData.email}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={setTermsAccepted}
          />
          <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
            {getTranslation('agreeTerms', language)}
          </Label>
        </div>
        
        {errors.terms && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.terms}</AlertDescription>
          </Alert>
        )}

        {errors.general && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}
      </div>
    </motion.div>
  );

  const totalSteps = userType === 'student' ? 4 : 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Show email verification screen if verification email was sent */}
        {emailVerificationSent ? (
          <Card className="p-6 shadow-xl border-2 border-white/50 backdrop-blur-sm">
            {renderEmailVerification()}
          </Card>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index + 1 <= currentStep ? 'bg-blue-500 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center text-sm text-gray-600">
                Step {currentStep} of {totalSteps}
              </div>
            </div>

            <Card className="p-6 shadow-xl border-2 border-white/50 backdrop-blur-sm">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && userType === 'student' && renderStep3()}
              {currentStep === 3 && userType === 'teacher' && renderStep4()}
              {currentStep === 4 && userType === 'student' && renderStep4()}

              <div className="flex gap-3 mt-8">
                <Button
                  onClick={currentStep === 1 ? onBack : () => setCurrentStep(prev => prev - 1)}
                  variant="outline"
                  className="flex-1 h-12"
                  disabled={isLoading}
                >
                  ← {getTranslation('back', language)}
                </Button>
                
                <Button
                  onClick={handleNext}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {language === 'en' ? 'Creating...' : language === 'hi' ? 'बनाया जा रहा है...' : 'ସୃଷ୍ଟି ହେଉଛି...'}
                    </div>
                  ) : (
                    <>
                      {currentStep === totalSteps 
                        ? (language === 'en' ? '🚀 Start Adventure!' : language === 'hi' ? '🚀 एडवेंचर शुरू करें!' : '🚀 ଆଭେଞ୍ଚର ଆରମ୍ଭ କରନ୍ତୁ!')
                        : getTranslation('next', language)
                      } →
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};