import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Crown,
  Star,
  Trophy,
  Zap,
  CheckCircle,
  RotateCcw,
  Volume2,
  Lightbulb,
  Target,
  Timer,
  Heart,
  Award
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import type { Language } from '../../../types/onboarding';

interface NumberComparisonGameProps {
  language: Language;
  onBack: () => void;
  onComplete?: (score: number, xpEarned: number) => void;
}

interface NumberCard {
  id: number;
  value: number;
  position: { x: number; y: number };
  isSelected: boolean;
  isCorrect?: boolean;
  romanNumeral?: string;
}

interface Challenge {
  id: number;
  type: 'comparison' | 'roman' | 'estimation' | 'ordering';
  question: { en: string; hi: string; or: string };
  numbers: number[];
  correctAnswer: number | string;
  explanation: { en: string; hi: string; or: string };
  difficulty: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    type: 'comparison',
    question: { 
      en: 'Which number is GREATER?', 
      hi: 'कौन सी संख्या बड़ी है?', 
      or: 'କେଉଁ ସଂଖ୍ୟା ବଡ଼?' 
    },
    numbers: [234, 243],
    correctAnswer: 243,
    explanation: { 
      en: '243 is greater than 234. Compare digits from left to right!', 
      hi: '243, 234 से बड़ा है। बाएं से दाएं अंकों की तुलना करें!', 
      or: '243, 234 ଠାରୁ ବଡ଼। ବାମରୁ ଡାହାଣକୁ ଅଙ୍କଗୁଡ଼ିକର ତୁଳନା କରନ୍ତୁ!' 
    },
    difficulty: 1
  },
  {
    id: 2,
    type: 'roman',
    question: { 
      en: 'What is XIV in numbers?', 
      hi: 'XIV संख्याओं में क्या है?', 
      or: 'XIV ସଂଖ୍ୟାରେ କଣ?' 
    },
    numbers: [12, 14, 16, 18],
    correctAnswer: 14,
    explanation: { 
      en: 'XIV = X (10) + IV (4) = 14', 
      hi: 'XIV = X (10) + IV (4) = 14', 
      or: 'XIV = X (10) + IV (4) = 14' 
    },
    difficulty: 2
  },
  {
    id: 3,
    type: 'estimation',
    question: { 
      en: 'Round 847 to the nearest hundred', 
      hi: '847 को निकटतम सैकड़े तक पूर्णांकित करें', 
      or: '847 କୁ ନିକଟତମ ଶହ ପର୍ଯ୍ୟନ୍ତ ଗୋଲାକାର କରନ୍ତୁ' 
    },
    numbers: [800, 850, 900, 840],
    correctAnswer: 800,
    explanation: { 
      en: '847 rounds down to 800 (4 < 5)', 
      hi: '847 को 800 तक पूर्णांकित किया जाता है (4 < 5)', 
      or: '847 କୁ 800 ପର୍ଯ୍ୟନ୍ତ ଗୋଲାକାର କରାଯାଏ (4 < 5)' 
    },
    difficulty: 2
  },
  {
    id: 4,
    type: 'ordering',
    question: { 
      en: 'Arrange in ASCENDING order: Which comes FIRST?', 
      hi: 'आरोही क्रम में व्यवस्थित करें: कौन सा पहले आता है?', 
      or: 'ଆରୋହୀ କ୍ରମରେ ସଜାନ୍ତୁ: କେଉଁଟି ପ୍ରଥମେ ଆସେ?' 
    },
    numbers: [1205, 1025, 1520, 1052],
    correctAnswer: 1025,
    explanation: { 
      en: 'In ascending order: 1025 < 1052 < 1205 < 1520', 
      hi: 'आरोही क्रम में: 1025 < 1052 < 1205 < 1520', 
      or: 'ଆରୋହୀ କ୍ରମରେ: 1025 < 1052 < 1205 < 1520' 
    },
    difficulty: 3
  },
  {
    id: 5,
    type: 'comparison',
    question: { 
      en: 'Which number is SMALLER?', 
      hi: 'कौन सी संख्या छोटी है?', 
      or: 'କେଉଁ ସଂଖ୍ୟା ଛୋଟ?' 
    },
    numbers: [9876, 9867],
    correctAnswer: 9867,
    explanation: { 
      en: '9867 is smaller than 9876. Check the tens place: 6 < 7', 
      hi: '9867, 9876 से छोटा है। दहाई का स्थान देखें: 6 < 7', 
      or: '9867, 9876 ଠାରୁ ଛୋଟ। ଦଶକ ସ୍ଥାନ ଦେଖନ୍ତୁ: 6 < 7' 
    },
    difficulty: 2
  }
];

const ROMAN_NUMERALS = [
  { roman: 'I', value: 1 }, { roman: 'V', value: 5 }, { roman: 'X', value: 10 },
  { roman: 'L', value: 50 }, { roman: 'C', value: 100 }, { roman: 'D', value: 500 }
];

export function NumberComparisonGame({ language, onBack, onComplete }: NumberComparisonGameProps) {
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [combo, setCombo] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [gameStats, setGameStats] = useState({ correct: 0, wrong: 0 });
  
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gamePhase === 'playing' && !showExplanation) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gamePhase, showExplanation]);

  const startGame = () => {
    setGamePhase('playing');
    setCurrentChallenge(0);
    setScore(0);
    setLives(3);
    setTimeElapsed(0);
    setCombo(0);
    setTotalXP(0);
    setGameStats({ correct: 0, wrong: 0 });
  };

  const handleAnswerSelect = (answer: number) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(answer);
    const challenge = CHALLENGES[currentChallenge];
    const correct = answer === challenge.correctAnswer;
    setIsAnswerCorrect(correct);
    
    if (correct) {
      const basePoints = challenge.difficulty * 50;
      const comboBonus = combo * 10;
      const timeBonus = Math.max(0, 30 - timeElapsed) * 2;
      const totalPoints = basePoints + comboBonus + timeBonus;
      
      setScore(prev => prev + totalPoints);
      setCombo(prev => prev + 1);
      setTotalXP(prev => prev + 25);
      setGameStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setLives(prev => prev - 1);
      setCombo(0);
      setGameStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }
    
    setShowExplanation(true);
    
    setTimeout(() => {
      if (currentChallenge + 1 >= CHALLENGES.length) {
        setGamePhase('completed');
        onComplete?.(score, totalXP);
      } else if (lives > 0 || correct) {
        nextChallenge();
      } else {
        setGamePhase('completed');
        onComplete?.(score, totalXP);
      }
    }, 3000);
  };

  const nextChallenge = () => {
    setCurrentChallenge(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsAnswerCorrect(null);
    setTimeElapsed(0);
  };

  const getCurrentChallenge = () => CHALLENGES[currentChallenge];

  const getProgressPercentage = () => {
    return ((currentChallenge + 1) / CHALLENGES.length) * 100;
  };

  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-6xl font-bold"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 10 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            >
              {Math.floor(Math.random() * 9) + 1}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <Card className="bg-purple-900/80 border-purple-400/30 backdrop-blur-md max-w-2xl w-full">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse"
              >
                <Crown className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {language === 'en' ? 'Number Warrior Arena' :
                 language === 'hi' ? 'संख्या योद्धा क्षेत्र' :
                 'ସଂଖ୍ୟା ଯୋଦ୍ଧା କ୍ଷେତ୍ର'}
              </h1>

              <p className="text-purple-200 mb-6 leading-relaxed">
                {language === 'en' ? 'Battle through number comparisons, Roman numerals, and estimation challenges! Use your mathematical powers to become the ultimate Number Warrior!' :
                 language === 'hi' ? 'संख्या तुलना, रोमन अंक और अनुमान चुनौतियों के माध्यम से लड़ाई करें! अंतिम संख्या योद्धा बनने के लिए अपनी गणितीय शक्तियों का उपयोग करें!' :
                 'ସଂଖ୍ୟା ତୁଳନା, ରୋମାନ ସଂଖ୍ୟା ଏବଂ ଅନୁମାନ ଚୁନୌତି ମାଧ୍ୟମରେ ଯୁଦ୍ଧ କରନ୍ତୁ! ଚୂଡ଼ାନ୍ତ ସଂଖ୍ୟା ଯୋଦ୍ଧା ହେବା ପାଇଁ ନିଜର ଗାଣିତିକ ଶକ୍ତି ବ୍ୟବହାର କରନ୍ତୁ!'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-700/30 rounded-lg p-4">
                  <Target className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                  <h3 className="text-purple-200 font-bold mb-1">
                    {language === 'en' ? 'Challenges' : language === 'hi' ? 'चुनौतियां' : 'ଚୁନୌତି'}
                  </h3>
                  <p className="text-purple-300 text-sm">
                    {CHALLENGES.length} {language === 'en' ? 'Epic Battles' : language === 'hi' ? 'महाकाव्य लड़ाई' : 'ମହାକାବ୍ୟ ଯୁଦ୍ଧ'}
                  </p>
                </div>
                
                <div className="bg-purple-700/30 rounded-lg p-4">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <h3 className="text-purple-200 font-bold mb-1">
                    {language === 'en' ? 'Lives' : language === 'hi' ? 'जीवन' : 'ଜୀବନ'}
                  </h3>
                  <p className="text-purple-300 text-sm">
                    3 {language === 'en' ? 'Warrior Hearts' : language === 'hi' ? 'योद्धा दिल' : 'ଯୋଦ୍ଧା ହୃଦୟ'}
                  </p>
                </div>
              </div>

              <motion.div className="space-y-4">
                <Button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg py-3 adventure-button"
                  size="lg"
                >
                  <Star className="w-6 h-6 mr-2" />
                  {language === 'en' ? 'Begin Battle!' :
                   language === 'hi' ? 'लड़ाई शुरू करें!' :
                   'ଯୁଦ୍ଧ ଆରମ୍ଭ କରନ୍ତୁ!'}
                </Button>
                
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full bg-purple-800/50 border-purple-400 text-purple-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Return to Kingdom' :
                   language === 'hi' ? 'राज्य में वापसी' :
                   'ରାଜ୍ୟକୁ ଫେରନ୍ତୁ'}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gamePhase === 'completed') {
    const accuracy = gameStats.correct + gameStats.wrong > 0 
      ? Math.round((gameStats.correct / (gameStats.correct + gameStats.wrong)) * 100) 
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Victory Effects */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-100, window.innerHeight + 100],
                rotate: [0, 360],
                opacity: [1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            >
              {['👑', '⭐', '🏆', '💎', '🎉'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <Card className="bg-purple-900/90 border-purple-400/50 backdrop-blur-md max-w-lg w-full">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-treasure-shine"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold text-white mb-4">
                {accuracy >= 80 
                  ? (language === 'en' ? 'Master Number Warrior!' :
                     language === 'hi' ? 'मास्टर संख्या योद्धा!' :
                     'ମାଷ୍ଟର ସଂଖ୍ୟା ଯୋଦ୍ଧା!')
                  : accuracy >= 60
                  ? (language === 'en' ? 'Brave Warrior!' :
                     language === 'hi' ? 'बहादुर योद्धा!' :
                     'ସାହସୀ ଯୋଦ୍ଧା!')
                  : (language === 'en' ? 'Training Complete!' :
                     language === 'hi' ? 'प्रशिक्षण पूरा!' :
                     'ପ୍ରଶିକ୍ଷଣ ସମ୍ପୂର୍ଣ୍ଣ!')}
              </h1>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-purple-700/30 rounded-lg p-4">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-yellow-300 font-bold text-xl">{score}</div>
                  <div className="text-purple-300 text-sm">
                    {language === 'en' ? 'Battle Points' : language === 'hi' ? 'युद्ध अंक' : 'ଯୁଦ୍ଧ ପଏଣ୍ଟ'}
                  </div>
                </div>
                
                <div className="bg-purple-700/30 rounded-lg p-4">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-green-300 font-bold text-xl">{accuracy}%</div>
                  <div className="text-purple-300 text-sm">
                    {language === 'en' ? 'Accuracy' : language === 'hi' ? 'सटीकता' : 'ସଠିକତା'}
                  </div>
                </div>

                <div className="bg-purple-700/30 rounded-lg p-4">
                  <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-blue-300 font-bold text-xl">{totalXP}</div>
                  <div className="text-purple-300 text-sm">XP</div>
                </div>
                
                <div className="bg-purple-700/30 rounded-lg p-4">
                  <Timer className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-purple-300 font-bold text-xl">
                    {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-purple-300 text-sm">
                    {language === 'en' ? 'Battle Time' : language === 'hi' ? 'युद्ध समय' : 'ଯୁଦ୍ଧ ସମୟ'}
                  </div>
                </div>
              </div>

              <motion.div className="space-y-4">
                <Button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Fight Again' :
                   language === 'hi' ? 'फिर से लड़ें' :
                   'ପୁଣି ଯୁଦ୍ଧ କରନ୍ତୁ'}
                </Button>
                
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full bg-purple-800/50 border-purple-400 text-purple-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Return to Kingdom' :
                   language === 'hi' ? 'राज्य में वापसी' :
                   'ରାଜ୍ୟକୁ ଫେରନ୍ତୁ'}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const challenge = getCurrentChallenge();

  return (
    <div ref={gameAreaRef} className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/5 text-8xl font-bold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            {['>', '<', '=', '±', '∞'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      {/* Game Header */}
      <div className="relative z-20 bg-black/30 backdrop-blur-md border-b border-purple-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="bg-purple-800/80 border-purple-400 text-purple-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Retreat' : language === 'hi' ? 'पीछे हटना' : 'ପଛକୁ ଯିବା'}
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-white flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-purple-400" />
                  {language === 'en' ? 'Number Warrior Battle' :
                   language === 'hi' ? 'संख्या योद्धा युद्ध' :
                   'ସଂଖ୍ୟା ଯୋଦ୍ଧା ଯୁଦ୍ଧ'}
                </h1>
                <p className="text-purple-200 text-sm">
                  {language === 'en' ? `Challenge ${currentChallenge + 1} of ${CHALLENGES.length}` :
                   language === 'hi' ? `चुनौती ${currentChallenge + 1} का ${CHALLENGES.length}` :
                   `ଚୁନୌତି ${currentChallenge + 1} ର ${CHALLENGES.length}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-lg">{score}</div>
                <div className="text-purple-200 text-xs">
                  {language === 'en' ? 'Score' : language === 'hi' ? 'अंक' : 'ସ୍କୋର'}
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {[...Array(3)].map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg">{combo}</div>
                <div className="text-purple-200 text-xs">
                  {language === 'en' ? 'Combo' : language === 'hi' ? 'कॉम्बो' : 'କମ୍ବୋ'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-20 bg-black/20 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <Progress value={getProgressPercentage()} className="h-3 bg-purple-800/50" />
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Challenge Question */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Card className="bg-purple-800/50 border-purple-400/30 backdrop-blur-md">
              <CardContent className="p-6">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {challenge.question[language]}
                </h2>
                
                <Badge className="bg-purple-600/50 text-purple-200 border-purple-400/50">
                  {challenge.type === 'comparison' 
                    ? (language === 'en' ? 'Comparison Battle' : language === 'hi' ? 'तुलना युद्ध' : 'ତୁଳନା ଯୁଦ୍ଧ')
                    : challenge.type === 'roman'
                    ? (language === 'en' ? 'Roman Quest' : language === 'hi' ? 'रोमन खोज' : 'ରୋମାନ ଅନ୍ୱେଷଣ')
                    : challenge.type === 'estimation'
                    ? (language === 'en' ? 'Estimation Challenge' : language === 'hi' ? 'अनुमान चुनौती' : 'ଅନୁମାନ ଚୁନୌତି')
                    : (language === 'en' ? 'Ordering Quest' : language === 'hi' ? 'क्रम खोज' : 'କ୍ରମ ଅନ୍ୱେଷଣ')}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {challenge.numbers.map((number, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswerSelect(number)}
              >
                <Card className={`relative overflow-hidden transition-all duration-300 ${
                  selectedAnswer === number
                    ? isAnswerCorrect
                      ? 'bg-gradient-to-br from-green-600 to-emerald-600 border-green-400 shadow-green-400/50'
                      : 'bg-gradient-to-br from-red-600 to-pink-600 border-red-400 shadow-red-400/50'
                    : selectedAnswer === challenge.correctAnswer && number === challenge.correctAnswer
                    ? 'bg-gradient-to-br from-green-600 to-emerald-600 border-green-400 shadow-green-400/50'
                    : 'bg-gradient-to-br from-purple-700 to-blue-700 border-purple-400/30 hover:border-purple-300 hover:shadow-purple-400/30'
                } shadow-xl`}>
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className="text-6xl font-bold text-white mb-4"
                      animate={selectedAnswer === number ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {number.toLocaleString()}
                    </motion.div>
                    
                    {/* Roman numeral display for roman challenges */}
                    {challenge.type === 'roman' && challenge.id === 2 && (
                      <div className="text-2xl text-purple-200 font-bold">
                        {number === 12 ? 'XII' : number === 14 ? 'XIV' : number === 16 ? 'XVI' : 'XVIII'}
                      </div>
                    )}

                    {/* Answer feedback */}
                    {selectedAnswer === number && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                      >
                        {isAnswerCorrect ? (
                          <CheckCircle className="w-12 h-12 text-white mx-auto" />
                        ) : (
                          <div className="w-12 h-12 border-4 border-white rounded-full flex items-center justify-center mx-auto">
                            <span className="text-white text-2xl font-bold">✗</span>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Correct answer highlight */}
                    {showExplanation && number === challenge.correctAnswer && selectedAnswer !== number && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-2 right-2"
                      >
                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    )}

                    {/* Floating numbers effect */}
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute text-white/20 text-2xl font-bold"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                          }}
                          animate={{
                            y: [-10, 10, -10],
                            opacity: [0.2, 0.5, 0.2]
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                        >
                          {Math.floor(Math.random() * 9) + 1}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <Card className={`${isAnswerCorrect 
                  ? 'bg-green-800/50 border-green-400/30' 
                  : 'bg-red-800/50 border-red-400/30'
                } backdrop-blur-md`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      {isAnswerCorrect ? (
                        <CheckCircle className="w-8 h-8 text-green-400 mr-2" />
                      ) : (
                        <div className="w-8 h-8 border-2 border-red-400 rounded-full flex items-center justify-center mr-2">
                          <span className="text-red-400 font-bold">✗</span>
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-white">
                        {isAnswerCorrect 
                          ? (language === 'en' ? 'Victory!' : language === 'hi' ? 'विजय!' : 'ବିଜୟ!')
                          : (language === 'en' ? 'Try Again!' : language === 'hi' ? 'फिर कोशिश करें!' : 'ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ!')
                        }
                      </h3>
                    </div>
                    
                    <p className="text-lg text-white/90">
                      {challenge.explanation[language]}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}