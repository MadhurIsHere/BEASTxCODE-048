import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface VerificationState {
  status: 'loading' | 'success' | 'error' | 'expired';
  message: string;
  user?: any;
}

export const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying your email...'
  });

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get tokens from URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        if (!accessToken || type !== 'signup') {
          setVerificationState({
            status: 'error',
            message: 'Invalid verification link. Please try registering again.'
          });
          return;
        }

        // Call our backend to complete the verification process
        const response = await fetch(`https://dslnuitpvyhkdgamvkuh.supabase.co/functions/v1/make-server-c392be1f/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbG51aXRwdnloa2RnYW12a3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjcwNDksImV4cCI6MjA3MzcwMzA0OX0.AWZsNAUYSomywK8HqXkIm09MjDkA2nH77YkW3F7DNZc`
          },
          body: JSON.stringify({
            access_token: accessToken,
            refresh_token: refreshToken
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.success && result.user) {
            // Create user data object for authentication context
            const userData = {
              id: result.user.id,
              type: result.user.user_type,
              name: result.user.name,
              username: result.user.username,
              email: result.user.email,
              grade: result.user.grade,
              school: result.user.school || '',
              profilePicture: result.user.profile_picture,
              teacherCode: result.user.teacher_code || '',
              createdAt: result.user.created_at,
              lastLogin: new Date().toISOString(),
              xp: result.user.xp || 100,
              level: result.user.level || 1,
              badges: ['new_learner'],
              streak: result.user.streak || 1
            };

            // Log in the user
            await login(userData);

            setVerificationState({
              status: 'success',
              message: 'Email verified successfully! Welcome to Learnio!',
              user: userData
            });

            // Redirect to the main app after a short delay
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 3000);
          } else {
            setVerificationState({
              status: 'error',
              message: result.error || 'Failed to verify email. Please try again.'
            });
          }
        } else {
          const errorData = await response.json();
          setVerificationState({
            status: 'error',
            message: errorData.error || 'Verification failed. Please try again.'
          });
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationState({
          status: 'error',
          message: 'Network error. Please check your connection and try again.'
        });
      }
    };

    verifyEmail();
  }, [searchParams, login, navigate]);

  const renderContent = () => {
    switch (verificationState.status) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Email</h2>
              <p className="text-gray-600">{verificationState.message}</p>
            </div>
          </motion.div>
        );

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-4">{verificationState.message}</p>
              {verificationState.user && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="font-semibold text-gray-800">Welcome, {verificationState.user.name}!</p>
                  <p className="text-sm text-gray-600">Redirecting you to your learning dashboard...</p>
                </div>
              )}
            </div>
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your account has been successfully created and verified. You'll be redirected automatically.
              </AlertDescription>
            </Alert>
          </motion.div>
        );

      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-4">{verificationState.message}</p>
            </div>
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                The verification link may be expired or invalid. Please try registering again.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/onboarding')}
                variant="outline"
                className="flex-1 h-12"
              >
                Back to Registration
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Go to Home
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-6 shadow-xl border-2 border-white/50 backdrop-blur-sm">
          {renderContent()}
        </Card>
      </div>
    </div>
  );
};