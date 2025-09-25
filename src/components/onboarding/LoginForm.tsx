import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { getTranslation } from '../../utils/translations';
import { useAuth } from '../../contexts/AuthContext';
import type { Language, LoginData, UserProfile, UserType } from '../../types/onboarding';
import { LogIn, Eye, EyeOff, AlertCircle, Shield, Zap } from 'lucide-react';
// Import logo
import learnioLogo from '../../assets/logo.jpg';

interface LoginFormProps {
  language: Language;
  onSubmit: (user: UserProfile) => void;
  onBack: () => void;
  onForgotPassword?: () => void;
  demoAccountData?: {username: string; password: string} | null;
}

// Removed hashPassword function as authentication is now handled by Supabase

export const LoginForm: React.FC<LoginFormProps> = ({
  language,
  onSubmit,
  onBack,
  onForgotPassword,
  demoAccountData
}) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    usernameOrEmail: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.usernameOrEmail || !formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = getTranslation('usernameRequired', language);
    }
    
    if (!formData.password) {
      newErrors.password = getTranslation('passwordRequired', language);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Defensive validation
      const cleanUsername = formData.usernameOrEmail?.trim();
      const cleanPassword = formData.password?.trim();
      
      if (!cleanUsername || !cleanPassword) {
        setErrors({ general: language === 'en' ? 'Please enter both username and password.' : language === 'hi' ? 'कृपया उपयोगकर्ता नाम और पासवर्ड दोनों दर्ज करें।' : 'ଦୟାକରି ଉପଯୋଗକାରୀ ନାମ ଏବଂ ପାସୱାର୍ଡ଼ ଦୁଇଟି ପ୍ରବେଶ କରନ୍ତୁ।' });
        return;
      }

      // Try to authenticate with the backend server (including demo accounts)
      const response = await fetch(`https://dslnuitpvyhkdgamvkuh.supabase.co/functions/v1/make-server-c392be1f/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbG51aXRwdnloa2RnYW12a3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjcwNDksImV4cCI6MjA3MzcwMzA0OX0.AWZsNAUYSomywK8HqXkIm09MjDkA2nH77YkW3F7DNZc`
        },
        body: JSON.stringify({
          usernameOrEmail: cleanUsername,
          password: cleanPassword
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          const user: UserProfile = {
            id: result.user.id || `user_${Date.now()}`,
            name: result.user.name || 'Unknown User',
            username: result.user.username || cleanUsername,
            email: result.user.email || '',
            type: result.user.type || 'student',
            grade: result.user.grade,
            school: result.user.school || 'Unknown School',
            profilePicture: result.user.profilePicture || (result.user.type === 'teacher' ? '👩‍🏫' : '👨‍🎓'),
            teacherCode: result.user.teacherCode,
            xp: result.user.xp || 0,
            level: result.user.level || 1,
            badges: result.user.badges || [],
            streak: result.user.streak || 0,
            createdAt: result.user.createdAt || new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          // Use auth context to log in the user
          await login(user);
          
          // Handle remember me
          if (formData.rememberMe) {
            localStorage.setItem('learnio_remember_me', 'true');
          } else {
            localStorage.removeItem('learnio_remember_me');
          }

          onSubmit(user);
          return;
        } else {
          setErrors({ general: result.error || (language === 'en' ? 'Invalid username or password.' : language === 'hi' ? 'गलत उपयोगकर्ता नाम या पासवर्ड।' : 'ଭୁଲ ଉପଯୋଗକାରୀ ନାମ କିମ୍ବା ପାସୱାର୍ଡ଼।') });
          return;
        }
      } else {
        // Try to get error message from response
        try {
          const errorData = await response.json();
          setErrors({ general: errorData.error || (language === 'en' ? 'Authentication failed. Please check your credentials.' : language === 'hi' ? 'प्रमाणीकरण विफल। कृपया अपने क्रेडेंशियल्स जांचें।' : 'ପ୍ରମାଣୀକରଣ ବିଫଳ। ଦୟାକରି ଆପଣଙ୍କ କ୍ରେଡେନସିଆଲ ଯାଞ୍ଚ କରନ୍ତୁ।') });
        } catch {
          setErrors({ general: language === 'en' ? 'Server error. Please try again.' : language === 'hi' ? 'सर्वर त्रुटि। कृपया पुनः प्रयास करें।' : 'ସର୍ଭର ତ୍ରୁଟି। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।' });
        }
        return;
      }

    } catch (error) {
      console.error('Network error during authentication:', error);
      
      // Fallback to demo account check for offline mode
      const demoAccounts = [
        { 
          username: 'grade6', 
          password: 'demo123', 
          userData: { 
            id: 'demo_student_6', 
            name: 'Grade 6 Student', 
            username: 'grade6',
            email: 'grade6@demo.learnio.app',
            type: 'student' as UserType, 
            grade: 6, 
            school: 'Demo School', 
            xp: 100, 
            level: 1,
            badges: ['new_learner'],
            streak: 3,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }
        },
        { 
          username: 'grade11', 
          password: 'demo123', 
          userData: { 
            id: 'demo_student_11', 
            name: 'Grade 11 Student', 
            username: 'grade11',
            email: 'grade11@demo.learnio.app',
            type: 'student' as UserType, 
            grade: 11, 
            school: 'Demo School', 
            xp: 500, 
            level: 5,
            badges: ['student', 'achiever'],
            streak: 7,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }
        },
        { 
          username: 'teacher', 
          password: 'demo123', 
          userData: { 
            id: 'demo_teacher', 
            name: 'Demo Teacher', 
            username: 'teacher',
            email: 'teacher@demo.learnio.app',
            type: 'teacher' as UserType, 
            school: 'Demo School', 
            xp: 1000, 
            level: 10,
            badges: ['educator', 'mentor'],
            streak: 14,
            teacherCode: 'TEACH123',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }
        }
      ];
      
      const demoAccount = demoAccounts.find(acc => acc.username === cleanUsername && acc.password === cleanPassword);
      
      if (demoAccount) {
        const user: UserProfile = {
          ...demoAccount.userData,
          profilePicture: demoAccount.userData.type === 'teacher' ? '👩‍🏫' : '👨‍🎓'
        };
        
        // Use auth context to log in the demo user
        await login(user);
        
        // Handle remember me
        if (formData.rememberMe) {
          localStorage.setItem('learnio_remember_me', 'true');
        } else {
          localStorage.removeItem('learnio_remember_me');
        }

        onSubmit(user);
        return;
      }
      
      // Try stored user authentication for real accounts (offline mode)
      try {
        const storedUser = localStorage.getItem('learnio_user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);

          // For offline mode, we can only verify username/email match
          // Password verification is now handled by Supabase
          const isEmailLogin = cleanUsername.includes('@');
          const isValidUser = isEmailLogin 
            ? userData.email === cleanUsername.toLowerCase()
            : userData.username === cleanUsername.toLowerCase();

          if (isValidUser) {
            // Update last login
            const updatedUser = {
              ...userData,
              lastLogin: new Date().toISOString()
            };

            // Use auth context to log in the offline user
            await login(updatedUser);
            
            // Handle remember me
            if (formData.rememberMe) {
              localStorage.setItem('learnio_remember_me', 'true');
            } else {
              localStorage.removeItem('learnio_remember_me');
            }

            onSubmit(updatedUser);
            return;
          }
        }
        
        setErrors({ general: language === 'en' ? 'Unable to connect to server. Please check your connection or try a demo account.' : language === 'hi' ? 'सर्वर से कनेक्ट नहीं हो सका। कृपया अपना कनेक्शन जांचें या डेमो खाता आज़माएं।' : 'ସର୍ଭର ସହିତ ସଂଯୋଗ ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ଆପଣଙ୍କ ସଂଯୋଗ ଯାଞ୍ଚ କରନ୍ତୁ କିମ୍ବା ଡେମୋ ଖାତା ଚେଷ୍ଟା କରନ୍ତୁ।' });

      } catch (fallbackError) {
        console.error('Fallback authentication also failed:', fallbackError);
        setErrors({ general: language === 'en' ? 'Authentication failed. Please try again or use a demo account.' : language === 'hi' ? 'प्रमाणीकरण विफल। कृपया पुनः प्रयास करें या डेमो खाता उपयोग करें।' : 'ପ୍ରମାଣୀକରଣ ବିଫଳ। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ କିମ୍ବା ଡେମୋ ଖାତା ବ୍ୟବହାର କରନ୍ତୁ।' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, language, onSubmit]);

  // Pre-fill and auto-submit for demo accounts only when explicitly provided
  useEffect(() => {
    if (demoAccountData && demoAccountData.username && demoAccountData.password) {
      // Pre-fill the form with demo account data
      setFormData(prev => ({
        ...prev,
        usernameOrEmail: demoAccountData.username,
        password: demoAccountData.password
      }));
      
      // Auto-submit after a short delay to show the form briefly
      const timer = setTimeout(() => {
        handleSubmit();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [demoAccountData, handleSubmit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-6 shadow-xl border-2 border-white/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <img 
                  src={learnioLogo} 
                  alt="Learnio Logo" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === 'en' ? '🎮 Welcome Back!' : language === 'hi' ? '🎮 वापस स्वागत है!' : '🎮 ସ୍ୱାଗତ ଫେରି!'}
              </h2>
              <p className="text-gray-600">
                {language === 'en' ? 'Ready to continue your adventure?' : language === 'hi' ? 'अपना एडवेंचर जारी रखने के लिए तैयार हैं?' : 'ଆପଣଙ୍କର ଆଭେଞ୍ଚର ଜାରି ରଖିବାକୁ ପ୍ରସ୍ତୁତ?'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="usernameOrEmail">
                  {getTranslation('usernameOrEmail', language)} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="usernameOrEmail"
                  type="text"
                  placeholder={language === 'en' ? 'Your username or email' : language === 'hi' ? 'आपका उपयोगकर्ता नाम या ईमेल' : 'ଆପଣଙ୍କର ଉପଯୋଗକାରୀ ନାମ କିମ୍ବା ଇମେଲ୍'}
                  value={formData.usernameOrEmail}
                  onChange={(e) => handleInputChange('usernameOrEmail', e.target.value)}
                  className="h-12 text-base"
                />
                {errors.usernameOrEmail && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.usernameOrEmail}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">
                  {getTranslation('password', language)} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={language === 'en' ? 'Your password' : language === 'hi' ? 'आपका पासवर्ड' : 'ଆପଣଙ୍କର ପାସୱାର୍ଡ଼'}
                    value={formData.password}
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
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked)}
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    {getTranslation('rememberMe', language)}
                  </Label>
                </div>
                <Button 
                  variant="link" 
                  className="text-sm text-blue-600 h-auto p-0"
                  onClick={onForgotPassword}
                >
                  {getTranslation('forgotPassword', language)}
                </Button>
              </div>

              {errors.general && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              {/* Demo Account Auto-login notice */}
              {demoAccountData?.username && demoAccountData?.password && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-sm">
                      <p className="font-bold text-green-800">
                        {language === 'en' ? '🚀 Demo Account Detected!' : language === 'hi' ? '🚀 डेमो खाता मिला!' : '🚀 ଡେମୋ ଖାତା ମିଳିଲା!'}
                      </p>
                      <p className="text-green-700">
                        {language === 'en' ? 'Automatically logging you in...' : language === 'hi' ? 'स्वचालित रूप से लॉग इन हो रहे हैं...' : 'ସ୍ୱଚାଳିତ ଭାବରେ ଲଗଇନ୍ ହେଉଛି...'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo Account Section - Always show when not auto-logging in */}
              {!demoAccountData && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-center mb-3">
                    <h4 className="font-bold text-blue-800 text-sm mb-1">
                      {language === 'en' ? '🚀 Try Demo Accounts:' : 
                       language === 'hi' ? '🚀 डेमो खाते आज़माएं:' : 
                       '🚀 ଡେମୋ ଖାତା ଚେଷ୍ଟା କରନ୍ତୁ:'}
                    </h4>
                    <p className="text-blue-700 text-xs">
                      {language === 'en' ? 'Click to fill credentials automatically' : 
                       language === 'hi' ? 'क्रेडेंशियल्स को स्वचालित रूप से भरने के लिए क्लिक करें' : 
                       'କ୍ରେଡେନସିଆଲକୁ ସ୍ୱଚାଳିତ ଭାବରେ ଭରିବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, usernameOrEmail: 'grade6', password: 'demo123' }));
                        setErrors({});
                      }}
                      className="w-full bg-white/70 hover:bg-white/90 rounded-lg p-3 border-2 border-green-200 hover:border-green-400 transition-all duration-200 cursor-pointer hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-semibold text-green-700 text-sm">👨‍🎓 Grade 6 Student</div>
                          <div className="text-xs text-gray-600">Basic learning adventure</div>
                        </div>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          grade6 / demo123
                        </div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, usernameOrEmail: 'grade11', password: 'demo123' }));
                        setErrors({});
                      }}
                      className="w-full bg-white/70 hover:bg-white/90 rounded-lg p-3 border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 cursor-pointer hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-semibold text-blue-700 text-sm">👩‍🎓 Grade 11 Student</div>
                          <div className="text-xs text-gray-600">Advanced mathematics & science</div>
                        </div>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          grade11 / demo123
                        </div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, usernameOrEmail: 'teacher', password: 'demo123' }));
                        setErrors({});
                      }}
                      className="w-full bg-white/70 hover:bg-white/90 rounded-lg p-3 border-2 border-orange-200 hover:border-orange-400 transition-all duration-200 cursor-pointer hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-semibold text-orange-700 text-sm">👩‍🏫 Teacher Account</div>
                          <div className="text-xs text-gray-600">Classroom management & analytics</div>
                        </div>
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          teacher / demo123
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 h-12"
                disabled={isLoading}
              >
                ← {getTranslation('back', language)}
              </Button>
              
              <Button
                onClick={handleSubmit}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === 'en' ? 'Logging in...' : language === 'hi' ? 'लॉग इन हो रहा है...' : 'ଲଗଇନ୍ ହେଉଛି...'}
                  </div>
                ) : (
                  <>
                    {language === 'en' ? '🚀 Let\'s Go!' : language === 'hi' ? '🚀 चलिए!' : '🚀 ଚାଲନ୍ତୁ!'} <LogIn className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </Card>
      </div>
    </div>
  );
};