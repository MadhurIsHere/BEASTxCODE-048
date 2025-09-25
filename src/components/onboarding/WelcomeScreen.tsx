import image_6cf35f9e5bd9d921146d7df90a527eed1a5fc670 from 'figma:asset/6cf35f9e5bd9d921146d7df90a527eed1a5fc670.png';
import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { getTranslation } from '../../utils/translations';
import type { Language } from '../../types/onboarding';
import { Gamepad2, Star, Trophy, Zap, Wifi, TrendingUp, Users } from 'lucide-react';
import learnioLogo3D from 'figma:asset/62b1b6d9f04d051516a5bdbf85258db2ea427cbc.png';

interface WelcomeScreenProps {
  language: Language;
  onNext: () => void;
  onLanguageSelect: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  language,
  onNext,
  onLanguageSelect
}) => {
  const features = [
    {
      icon: <Gamepad2 className="w-6 h-6 text-white" />,
      title: language === 'en' ? 'Interactive Games' : language === 'hi' ? 'इंटरैक्टिव गेम्स' : 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ଗେମ୍',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-600',
      illustration: '🎮'
    },
    {
      icon: <Wifi className="w-6 h-6 text-white" />,
      title: language === 'en' ? 'Works Offline' : language === 'hi' ? 'ऑफ़लाइन काम करता है' : 'ଅଫଲାଇନରେ କାମ କରେ',
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-600',
      illustration: '📱'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: language === 'en' ? 'Track Progress' : language === 'hi' ? 'प्रगति ट्रैक करें' : 'ପ୍ରଗତି ଟ୍ରାକ୍ କରନ୍ତୁ',
      color: 'from-orange-600 to-orange-700',
      bgColor: 'bg-orange-600',
      illustration: '📊'
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: language === 'en' ? 'Class Challenges' : language === 'hi' ? 'क्लास चैलेंजेस' : 'କ୍ଲାସ୍ ଚ୍ୟାଲେଞ୍ଜ',
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-600',
      illustration: '🏆'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['⭐', '🎮', '🏆', '💫', '🚀', '🎯'].map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + index,
              repeat: Infinity,
              delay: index * 0.5
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.h1 
            className="text-2xl font-bold text-gray-700 mb-2"
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {language === 'en' ? 'Welcome to' : language === 'hi' ? 'आपका स्वागत है' : 'ସ୍ୱାଗତମ'}
          </motion.h1>
        </motion.div>

        {/* Logo and App Name */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.5 }}
          className="text-center mb-6"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-xl">
              <img src={image_6cf35f9e5bd9d921146d7df90a527eed1a5fc670} alt="Learnio Logo" className="w-20 h-20" />
            </div>
            
            {/* Floating achievement badges */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Trophy className="w-4 h-4 text-white" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Star className="w-4 h-4 text-white" />
            </motion.div>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            animate={{ 
              backgroundPosition: ['0%', '100%', '0%']
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              background: 'linear-gradient(90deg, #8B5CF6, #3B82F6, #10B981, #F59E0B, #EF4444, #8B5CF6)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {getTranslation('appName', language)}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-gray-700 font-medium max-w-lg mx-auto"
          >
            {language === 'en' 
              ? 'Learn science, technology, engineering & math through fun games!'
              : language === 'hi' 
              ? 'मजेदार गेम्स के माध्यम से विज्ञान, प्रौद्योगिकी, इंजीनियरिंग और गणित सीखें!'
              : 'ମଜାଦାର ଖେଳ ମାଧ୍ୟମରେ ବିଜ୍ଞାନ, ପ୍ରଯୁକ୍ତିବିଦ୍ୟା, ଇଞ୍ଜିନିୟରିଂ ଏବଂ ଗଣିତ ଶିଖନ୍ତୁ!'
            }
          </motion.p>
        </motion.div>

        {/* Features Grid - FIXED COLORS */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="group"
            >
              <Card className={`p-4 text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${feature.bgColor} text-white relative overflow-hidden`}>
                {/* Background Illustration */}
                <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-30 transition-opacity">
                  {feature.illustration}
                </div>
                
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  {feature.icon}
                </div>
                <p className="text-sm font-bold text-white">{feature.title}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-sm space-y-4"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onLanguageSelect}
              variant="outline"
              className="w-full h-12 text-gray-700 border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
            >
              🌐 {getTranslation('selectLanguage', language)}
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onNext}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg font-bold"
            >
              <Zap className="mr-2 w-5 h-5" />
              {language === 'en' ? '🎯 Start Adventure!' : language === 'hi' ? '🎯 एडवेंचर शुरू करें!' : '🎯 ଆଭେଞ୍ଚର ଆରମ୍ଭ କରନ୍ତୁ!'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Offline indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {getTranslation('workOffline', language)}
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            {language === 'en' ? '✨ 100% Free • Safe for Kids • No Ads' : language === 'hi' ? '✨ 100% मुफ्त • बच्चों के लिए सुरक्षित • कोई विज्ञापन नहीं' : '✨ 100% ମାଗଣା • ପିଲାମାନଙ୍କ ପାଇଁ ସୁରକ୍ଷିତ • କୌଣସି ବିଜ୍ଞାପନ ନାହିଁ'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};