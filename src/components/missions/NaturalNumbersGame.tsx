import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Gem, 
  Star, 
  Trophy, 
  Zap,
  Target,
  CheckCircle,
  RotateCcw,
  Volume2,
  HelpCircle,
  Play
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import type { Language } from '../../types/onboarding';

interface NaturalNumbersGameProps {
  language: Language;
  onBack: () => void;
  onComplete?: (score: number, xpEarned: number) => void;
}

// Game data
interface Crystal {
  id: number;
  value: number;
  collected: boolean;
  position: { x: number; y: number };
  color: string;
  size: 'small' | 'medium' | 'large';
}

const CAVE_SECTIONS = [
  {
    id: 1,
    title: { en: 'Crystal Cave Entrance', hi: 'क्रिस्टल गुफा प्रवेश', or: 'କ୍ରିଷ୍ଟାଲ ଗୁମ୍ଫା ପ୍ରବେଶ' },
    description: { en: 'Collect numbers 1-5', hi: 'संख्या 1-5 एकत्र करें', or: '1-5 ସଂଖ୍ୟା ସଂଗ୍ରହ କରନ୍ତୁ' },
    range: [1, 5],
    crystalCount: 5
  },
  {
    id: 2,
    title: { en: 'Deeper Chambers', hi: 'गहरे कक्ष', or: 'ଗଭୀର କକ୍ଷ' },
    description: { en: 'Find numbers 6-15', hi: 'संख्या 6-15 खोजें', or: '6-15 ସଂଖ୍ୟା ଖୋଜନ୍ତୁ' },
    range: [6, 15],
    crystalCount: 10
  },
  {
    id: 3,
    title: { en: 'Ancient Treasury', hi: 'प्राचीन खजाना', or: 'ପ୍ରାଚୀନ ଖଜାନା' },
    description: { en: 'Master numbers 16-50', hi: 'संख्या 16-50 में महारत', or: '16-50 ସଂଖ୍ୟାରେ ପାରଦର୍ଶୀତା' },
    range: [16, 50],
    crystalCount: 15
  }
];

export function NaturalNumbersGame({ language, onBack, onComplete }: NaturalNumbersGameProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [crystals, setCrystals] = useState<Crystal[]>([]);
  const [collectedNumbers, setCollectedNumbers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [selectedCrystal, setSelectedCrystal] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  // Initialize crystals for current section
  useEffect(() => {
    const section = CAVE_SECTIONS[currentSection];
    const newCrystals: Crystal[] = [];
    
    // Generate random crystals
    for (let i = 0; i < section.crystalCount; i++) {
      const value = section.range[0] + Math.floor(Math.random() * (section.range[1] - section.range[0] + 1));
      newCrystals.push({
        id: i,
        value,
        collected: false,
        position: {
          x: 10 + Math.random() * 80,
          y: 20 + Math.random() * 60
        },
        color: getCrystalColor(value),
        size: getCrystalSize(value)
      });
    }
    
    setCrystals(newCrystals);
  }, [currentSection]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gamePhase === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gamePhase]);

  function getCrystalColor(value: number): string {
    if (value <= 10) return 'from-blue-400 to-blue-600';
    if (value <= 25) return 'from-purple-400 to-purple-600';
    if (value <= 40) return 'from-pink-400 to-pink-600';
    return 'from-yellow-400 to-yellow-600';
  }

  function getCrystalSize(value: number): 'small' | 'medium' | 'large' {
    if (value <= 15) return 'small';
    if (value <= 35) return 'medium';
    return 'large';
  }

  const handleCrystalClick = (crystal: Crystal) => {
    if (crystal.collected) return;

    const nextExpected = Math.min(...crystals.filter(c => !c.collected).map(c => c.value));
    
    if (crystal.value === nextExpected) {
      // Correct crystal selected
      setCrystals(prev => prev.map(c => 
        c.id === crystal.id ? { ...c, collected: true } : c
      ));
      setCollectedNumbers(prev => [...prev, crystal.value].sort((a, b) => a - b));
      setScore(prev => prev + crystal.value * (streakCount + 1));
      setStreakCount(prev => prev + 1);
      setSelectedCrystal(crystal.id);

      // Check if section completed
      const remainingCrystals = crystals.filter(c => !c.collected && c.id !== crystal.id);
      if (remainingCrystals.length === 0) {
        setTimeout(() => {
          if (currentSection < CAVE_SECTIONS.length - 1) {
            setCurrentSection(prev => prev + 1);
            setStreakCount(0);
          } else {
            setGamePhase('completed');
            onComplete?.(score, 200);
          }
        }, 1000);
      }
    } else {
      // Wrong crystal - show feedback
      setStreakCount(0);
      setSelectedCrystal(crystal.id);
      setTimeout(() => setSelectedCrystal(null), 500);
    }
  };

  const startGame = () => {
    setGamePhase('playing');
    setTimeElapsed(0);
    setScore(0);
    setCollectedNumbers([]);
    setStreakCount(0);
  };

  const resetSection = () => {
    setCrystals(prev => prev.map(c => ({ ...c, collected: false })));
    setCollectedNumbers([]);
    setStreakCount(0);
  };

  const nextExpected = crystals.length > 0 ? Math.min(...crystals.filter(c => !c.collected).map(c => c.value)) : null;
  const progress = crystals.length > 0 ? (crystals.filter(c => c.collected).length / crystals.length) * 100 : 0;

  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Cave Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="cave-gradient w-full h-full" />
        </div>

        <Card className="bg-black/60 border-yellow-400/30 backdrop-blur-md max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <Gem className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-yellow-400 mb-4">
              {language === 'en' ? 'Natural Numbers Discovery' :
               language === 'hi' ? 'प्राकृतिक संख्या खोज' :
               'ପ୍ରାକୃତିକ ସଂଖ୍ୟା ଆବିଷ୍କାର'}
            </h1>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {language === 'en' ? 'Welcome to the Crystal Mines! Help Leo the Fox collect number crystals in the correct order. Start with the smallest number and work your way up!' :
               language === 'hi' ? 'क्रिस्टल खानों में आपका स्वागत है! लियो फॉक्स को सही क्रम में संख्या क्रिस्टल एकत्र करने में मदद करें। सबसे छोटी संख्या से शुरू करके ऊपर जाएं!' :
               'କ୍ରିଷ୍ଟାଲ ଖଣିରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ! ଲିଓ ଫକ୍ସକୁ ସଠିକ କ୍ରମରେ ସଂଖ୍ୟା କ୍ରିଷ୍ଟାଲ ସଂଗ୍ରହ କରିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ!'}
            </p>

            <div className="space-y-4">
              {CAVE_SECTIONS.map((section, index) => (
                <div key={section.id} className="bg-white/10 rounded-lg p-3 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-yellow-300 font-medium">{section.title[language]}</h3>
                      <p className="text-gray-400 text-sm">{section.description[language]}</p>
                    </div>
                    <Badge className="bg-purple-600/20 text-purple-300">
                      {section.crystalCount} crystals
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <motion.div className="mt-8 space-y-3">
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold adventure-button"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Begin Adventure' :
                 language === 'hi' ? 'साहसिक कार्य शुरू करें' :
                 'ଦୁଃସାହସିକ କାର୍ଯ୍ୟ ଆରମ୍ଭ କରନ୍ତୁ'}
              </Button>
              
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full bg-gray-800/80 border-gray-600 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Back to Map' :
                 language === 'hi' ? 'मानचित्र पर वापस' :
                 'ମାନଚିତ୍ରକୁ ଫେରନ୍ତୁ'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gamePhase === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Celebration Background */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-500, window.innerHeight],
                rotate: [0, 360],
                opacity: [1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>

        <Card className="bg-black/80 border-yellow-400/50 backdrop-blur-md max-w-lg mx-4">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-treasure-shine"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-yellow-400 mb-4">
              {language === 'en' ? 'Mission Complete!' :
               language === 'hi' ? 'मिशन पूरा!' :
               'ମିଶନ ସମ୍ପୂର୍ଣ୍ଣ!'}
            </h1>

            <p className="text-gray-300 mb-6">
              {language === 'en' ? 'Congratulations! You\'ve mastered natural numbers and helped Leo collect all the crystals!' :
               language === 'hi' ? 'बधाई हो! आपने प्राकृतिक संख्याओं में महारत हासिल की और लियो को सभी क्रिस्टल एकत्र करने में मदद की!' :
               'ଅଭିନନ୍ଦନ! ଆପଣ ପ୍ରାକୃତିକ ସଂଖ୍ୟାରେ ପାରଦର୍ଶୀ ହୋଇଛନ୍ତି!'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-600/20 rounded-lg p-4">
                <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-blue-300 font-bold text-lg">{score}</div>
                <div className="text-gray-400 text-sm">
                  {language === 'en' ? 'Score' : language === 'hi' ? 'अंक' : 'ସ୍କୋର'}
                </div>
              </div>
              
              <div className="bg-purple-600/20 rounded-lg p-4">
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-purple-300 font-bold text-lg">200</div>
                <div className="text-gray-400 text-sm">XP Earned</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setCurrentSection(0);
                  setGamePhase('intro');
                }}
                className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black font-bold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Play Again' :
                 language === 'hi' ? 'फिर से खेलें' :
                 'ପୁନଃ ଖେଳନ୍ତୁ'}
              </Button>
              
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full bg-gray-800/80 border-gray-600 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Back to Map' :
                 language === 'hi' ? 'मानचित्र पर वापस' :
                 'ମାନଚିତ୍ରକୁ ଫେରନ୍ତୁ'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Cave Environment */}
      <div className="absolute inset-0 cave-gradient opacity-60" />
      
      {/* Floating Cave Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Game Header */}
      <div className="relative z-20 bg-black/50 backdrop-blur-md border-b border-yellow-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="bg-gray-800/80 border-gray-600 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Exit' : language === 'hi' ? 'बाहर निकलें' : 'ବାହାରିବା'}
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-yellow-400">
                  {CAVE_SECTIONS[currentSection].title[language]}
                </h1>
                <p className="text-gray-300 text-sm">
                  {CAVE_SECTIONS[currentSection].description[language]}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-yellow-400 font-bold">{score}</div>
                <div className="text-gray-400 text-xs">Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-blue-400 font-bold">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-xs">Time</div>
              </div>
              
              <div className="text-center">
                <div className="text-purple-400 font-bold">{streakCount}</div>
                <div className="text-gray-400 text-xs">Streak</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">
                {language === 'en' ? 'Progress' : language === 'hi' ? 'प्रगति' : 'ପ୍ରଗତି'}: {crystals.filter(c => c.collected).length}/{crystals.length}
              </span>
              {nextExpected && (
                <span className="text-yellow-400 text-sm font-medium">
                  {language === 'en' ? 'Find' : language === 'hi' ? 'खोजें' : 'ଖୋଜନ୍ତୁ'}: {nextExpected}
                </span>
              )}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative z-10 h-screen pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6 h-full">
          {/* Leo Fox */}
          <motion.div
            className="absolute left-8 bottom-20 z-30"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, 0, -2, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🦊</span>
            </div>
            <div className="text-center mt-2">
              <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">LEO</div>
            </div>
          </motion.div>

          {/* Crystal Field */}
          <div className="relative w-full h-full bg-black/20 rounded-lg border border-yellow-400/30 overflow-hidden">
            <AnimatePresence>
              {crystals.map((crystal) => (
                <motion.div
                  key={crystal.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                    crystal.collected ? 'pointer-events-none' : ''
                  }`}
                  style={{
                    left: `${crystal.position.x}%`,
                    top: `${crystal.position.y}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: crystal.collected ? 0 : 1,
                    opacity: crystal.collected ? 0 : 1
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: crystal.collected ? 0 : 1.1 }}
                  onClick={() => handleCrystalClick(crystal)}
                >
                  <motion.div
                    className={`relative rounded-lg bg-gradient-to-br ${crystal.color} shadow-lg border-2 border-white/30 ${
                      selectedCrystal === crystal.id ? 'animate-pulse-glow' : ''
                    } ${
                      crystal.value === nextExpected ? 'animate-glow' : ''
                    }`}
                    style={{
                      width: crystal.size === 'small' ? '48px' : crystal.size === 'medium' ? '56px' : '64px',
                      height: crystal.size === 'small' ? '48px' : crystal.size === 'medium' ? '56px' : '64px'
                    }}
                    animate={{
                      y: [-2, 2, -2],
                      rotate: [0, 1, 0, -1, 0]
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: Math.random()
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{crystal.value}</span>
                    </div>
                    
                    {/* Crystal shine effect */}
                    <div className="absolute inset-1 rounded-lg bg-gradient-to-tr from-white/40 to-transparent" />
                    
                    {/* Next target indicator */}
                    {crystal.value === nextExpected && (
                      <motion.div
                        className="absolute -inset-2 border-2 border-yellow-400 rounded-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Help Panel */}
          <div className="absolute right-8 top-8 z-30">
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="outline"
              size="sm"
              className="bg-black/60 border-yellow-400/50 text-yellow-400"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
            
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-12 bg-black/80 border border-yellow-400/30 rounded-lg p-4 w-64"
                >
                  <h4 className="text-yellow-400 font-bold mb-2">
                    {language === 'en' ? 'How to Play' : language === 'hi' ? 'कैसे खेलें' : 'କିପରି ଖେଳିବେ'}
                  </h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• {language === 'en' ? 'Click crystals in order from smallest to largest' : 
                             language === 'hi' ? 'छोटे से बड़े क्रम में क्रिस्टल पर क्लिक करें' :
                             'ଛୋଟରୁ ବଡ଼ କ୍ରମରେ କ୍ରିଷ୍ଟାଲ କ୍ଲିକ କରନ୍ତୁ'}</li>
                    <li>• {language === 'en' ? 'Glowing crystals show the next target' :
                             language === 'hi' ? 'चमकते क्रिस्टल अगला लक्ष्य दिखाते हैं' :
                             'ଚମକୁଥିବା କ୍ରିଷ୍ଟାଲ ପରବର୍ତ୍ତୀ ଲକ୍ଷ୍ୟ ଦେଖାଏ'}</li>
                    <li>• {language === 'en' ? 'Build streaks for bonus points' :
                             language === 'hi' ? 'बोनस अंकों के लिए स्ट्रीक बनाएं' :
                             'ବୋନସ ପଏଣ୍ଟ ପାଇଁ ଧାରା ନିର୍ମାଣ କରନ୍ତୁ'}</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}