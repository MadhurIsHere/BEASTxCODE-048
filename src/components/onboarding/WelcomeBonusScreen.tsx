import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { getTranslation } from '../../utils/translations';
import type { Language, UserProfile } from '../../types/onboarding';
import { Trophy, Star, Zap, Gift, Sparkles } from 'lucide-react';

interface WelcomeBonusScreenProps {
  language: Language;
  user: UserProfile;
  onComplete: () => void;
}

export const WelcomeBonusScreen: React.FC<WelcomeBonusScreenProps> = ({
  language,
  user,
  onComplete
}) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [xpCount, setXpCount] = useState(0);
  const [screenSize, setScreenSize] = useState({ width: 400, height: 800 });
  const welcomeXP = 100;

  useEffect(() => {
    // Safely get window dimensions
    if (typeof window !== 'undefined') {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    }

    const timer1 = setTimeout(() => setAnimationStep(1), 500);
    const timer2 = setTimeout(() => setAnimationStep(2), 1500);
    const timer3 = setTimeout(() => setAnimationStep(3), 2500);

    // Animate XP counter
    const xpTimer = setTimeout(() => {
      let current = 0;
      const increment = welcomeXP / 50;
      const counter = setInterval(() => {
        current += increment;
        if (current >= welcomeXP) {
          setXpCount(welcomeXP);
          clearInterval(counter);
        } else {
          setXpCount(Math.floor(current));
        }
      }, 20);
      
      // Clean up counter after animation completes
      setTimeout(() => clearInterval(counter), 1000);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(xpTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          initial={{ 
            x: Math.random() * screenSize.width, 
            y: screenSize.height + 10,
            opacity: 0 
          }}
          animate={{ 
            y: -10, 
            opacity: [0, 1, 0],
            rotate: 360 
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            delay: Math.random() * 2,
            repeat: Infinity 
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        className="w-full max-w-sm"
      >
        <Card className="p-8 text-center relative overflow-hidden bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-200">
          {/* Background sparkles */}
          <div className="absolute top-4 left-4">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute top-4 right-4">
            <Sparkles className="w-5 h-5 text-orange-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute bottom-4 left-6">
            <Star className="w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* User Avatar */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring", bounce: 0.6 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto text-3xl">
              {user.profilePicture}
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome, {user.name}! 🎉
            </h2>
            <p className="text-gray-600">
              {getTranslation('welcomeBonus', language)}
            </p>
          </motion.div>

          {/* XP Bonus Animation */}
          {animationStep >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 mb-4">
                <Zap className="w-8 h-8 mx-auto mb-2 animate-bounce" />
                <p className="text-lg font-bold">+{xpCount} XP</p>
                <p className="text-sm opacity-90">Starting bonus</p>
              </div>
            </motion.div>
          )}

          {/* First Badge */}
          {animationStep >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-4">
                <Trophy className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                <p className="font-bold">{getTranslation('firstBadge', language)}</p>
                <p className="text-sm opacity-90">"New Learner"</p>
              </div>
            </motion.div>
          )}

          {/* Learning Path Preview */}
          {animationStep >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🧮</div>
                  <p className="text-xs text-gray-700">Math</p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🔬</div>
                  <p className="text-xs text-gray-700">Science</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-lg">
                  <div className="text-2xl mb-1">🎮</div>
                  <p className="text-xs text-gray-700">Games</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Ready to explore these subjects?
              </p>
            </motion.div>
          )}

          <Button
            onClick={onComplete}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg"
          >
            <Gift className="w-5 h-5 mr-2" />
            Start Learning Journey! 🚀
          </Button>
        </Card>

        {/* Encouraging message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600 text-sm">
            {user.type === 'student' 
              ? `Ready for Grade ${user.grade} challenges?`
              : 'Ready to guide your students?'
            }
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};