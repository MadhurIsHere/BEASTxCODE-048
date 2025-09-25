import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, Settings, Volume2, VolumeX, RotateCcw, Target, Shield, Clock, Zap } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import type { Language } from '../../../types/onboarding';

// Types
interface Question {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  type: 'multiple-choice' | 'numeric';
  options?: string[];
  correctIndex?: number;
  correctValue?: number;
  explanation: string;
  timeLimit: number;
}

interface Character {
  name: string;
  hp: number;
  maxHp: number;
  powerMeter: number;
  portrait: string;
  position: { x: number; y: number };
  attacking: boolean;
  hitReaction: boolean;
}

interface GameState {
  currentQuestionIndex: number;
  hero: Character;
  villain: Character;
  consecutiveCorrect: number;
  score: number;
  timeLeft: number;
  isPaused: boolean;
  isGameOver: boolean;
  winner: 'hero' | 'villain' | null;
  usedSpecials: string[];
  lastAttack: { attacker: 'hero' | 'villain'; damage: number; timestamp: number } | null;
  answers: Array<{
    questionId: string;
    answer: number | string;
    correct: boolean;
    timeTaken: number;
    damage: number;
  }>;
}

interface SetsBattleGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

// Game Configuration
const GAME_CONFIG = {
  INITIAL_HP: 100,
  DAMAGE: {
    easy: { correct: 6, wrong: 5 },
    medium: { correct: 10, wrong: 8 },
    hard: { correct: 15, wrong: 12 }
  },
  TIME_LIMITS: {
    easy: 20,
    medium: 35,
    hard: 50
  },
  SPECIAL_MOVES: {
    repulsor: { damage: 30, cost: 100 },
    shield: { heal: 20, cost: 100 },
    timeDilation: { timeBonus: 0.3, cost: 100 }
  },
  POWER_GAIN: {
    base: 10,
    fastBonus: 5
  },
  ARENA: {
    hero: { x: 15, y: 60 },
    villain: { x: 85, y: 60 }
  }
};

// Questions Database (First 10 for demo)
const QUESTIONS: Question[] = [
  {
    id: 'q1',
    difficulty: 'easy',
    text: 'Which symbol denotes the empty set?',
    type: 'multiple-choice',
    options: ['{}', '∅', 'Ø', 'None'],
    correctIndex: 1,
    explanation: '∅ is the standard notation for the empty set.',
    timeLimit: 20
  },
  {
    id: 'q2',
    difficulty: 'easy',
    text: 'Is {1,2,3} finite or infinite?',
    type: 'multiple-choice',
    options: ['Finite', 'Infinite'],
    correctIndex: 0,
    explanation: 'It has a limited number (3) of elements.',
    timeLimit: 20
  },
  {
    id: 'q3',
    difficulty: 'easy',
    text: 'If A={1,2} and B={2,3}, is 2 in A ∪ B?',
    type: 'multiple-choice',
    options: ['Yes', 'No'],
    correctIndex: 0,
    explanation: 'Union contains elements from either set; 2 is in both.',
    timeLimit: 20
  },
  {
    id: 'q4',
    difficulty: 'medium',
    text: 'If A={1,2,3}, what is |P(A)|?',
    type: 'multiple-choice',
    options: ['3', '6', '8', '9'],
    correctIndex: 2,
    explanation: 'Power set has 2^n subsets: 2^3 = 8.',
    timeLimit: 35
  },
  {
    id: 'q5',
    difficulty: 'medium',
    text: 'What is A \\ B if A={1,2,3} and B={2,4}?',
    type: 'multiple-choice',
    options: ['{1,3}', '{2}', '{4}', '∅'],
    correctIndex: 0,
    explanation: 'Difference contains elements in A not in B.',
    timeLimit: 35
  },
  {
    id: 'q6',
    difficulty: 'hard',
    text: '|A|=4, |B|=5, |A ∩ B|=2. Find |A ∪ B|.',
    type: 'numeric',
    correctValue: 7,
    explanation: '|A ∪ B| = |A| + |B| - |A ∩ B| = 4+5-2 = 7',
    timeLimit: 50
  },
  {
    id: 'q7',
    difficulty: 'hard',
    text: 'If |P(X)| = 16, find |X|.',
    type: 'numeric',
    correctValue: 4,
    explanation: 'Solve 2^n = 16 ⇒ n=4.',
    timeLimit: 50
  },
  {
    id: 'q8',
    difficulty: 'hard',
    text: 'From 100 students, 60 like A, 50 like B, and 30 like both. How many like A or B?',
    type: 'numeric',
    correctValue: 80,
    explanation: '|A ∪ B| = 60 + 50 - 30 = 80.',
    timeLimit: 50
  },
  {
    id: 'q9',
    difficulty: 'medium',
    text: 'Which of these is a proper subset of {1,2,3}?',
    type: 'multiple-choice',
    options: ['{1,2,3}', '{2}', '{1,2,3,4}', '{}'],
    correctIndex: 1,
    explanation: 'Proper subset must have fewer elements and be contained.',
    timeLimit: 35
  },
  {
    id: 'q10',
    difficulty: 'easy',
    text: 'Does {1,2} = {2,1}?',
    type: 'multiple-choice',
    options: ['Yes', 'No'],
    correctIndex: 0,
    explanation: 'Order does not matter in sets; sets equal if same elements.',
    timeLimit: 20
  }
];

export function SetsBattleGame({ language, onBack, onComplete }: SetsBattleGameProps) {
  const [gameState, setGameState] = useState<'menu' | 'settings' | 'battle' | 'paused' | 'result'>('menu');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [heroName, setHeroName] = useState('Armored Hero');
  const [villainName, setVillainName] = useState('Titan Overlord');
  const [gameData, setGameData] = useState<GameState>({
    currentQuestionIndex: 0,
    hero: {
      name: 'Armored Hero',
      hp: GAME_CONFIG.INITIAL_HP,
      maxHp: GAME_CONFIG.INITIAL_HP,
      powerMeter: 0,
      portrait: '🦾',
      position: GAME_CONFIG.ARENA.hero,
      attacking: false,
      hitReaction: false
    },
    villain: {
      name: 'Titan Overlord',
      hp: GAME_CONFIG.INITIAL_HP,
      maxHp: GAME_CONFIG.INITIAL_HP,
      powerMeter: 0,
      portrait: '👹',
      position: GAME_CONFIG.ARENA.villain,
      attacking: false,
      hitReaction: false
    },
    consecutiveCorrect: 0,
    score: 0,
    timeLeft: 0,
    isPaused: false,
    isGameOver: false,
    winner: null,
    usedSpecials: [],
    lastAttack: null,
    answers: []
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSpecialMoves, setShowSpecialMoves] = useState(false);
  const [attackEffects, setAttackEffects] = useState<{ type: string; timestamp: number }[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  const getT = (key: string) => {
    const translations: Record<string, Record<Language, string>> = {
      title: { en: 'Sets Battle Arena', hi: 'सेट्स बैटल एरीना', or: 'ସେଟ୍ସ ବ୍ୟାଟଲ ଏରୀନା' },
      subtitle: { en: 'Hero vs Titan Quiz Battle', hi: 'हीरो बनाम टाइटन क्विज़ बैटल', or: 'ହିରୋ ବନାମ ଟାଇଟାନ କ୍ୱିଜ ବ୍ୟାଟଲ' },
      startBattle: { en: 'Start Battle', hi: 'युद्ध शुरू करें', or: 'ଯୁଦ୍ଧ ଆରମ୍ଭ କରନ୍ତୁ' },
      settings: { en: 'Settings', hi: 'सेटिंग्स', or: 'ସେଟିଂସ' },
      heroWins: { en: 'Victory!', hi: 'विजय!', or: 'ବିଜୟ!' },
      villainWins: { en: 'Defeat!', hi: 'हार!', or: 'ହାର!' },
      question: { en: 'Question', hi: 'प्रश्न', or: 'ପ୍ରଶ୍ନ' },
      submit: { en: 'Submit', hi: 'जमा करें', or: 'ଦାଖଲ କରନ୍ତୁ' },
      correct: { en: 'Correct!', hi: 'सही!', or: 'ସଠିକ!' },
      incorrect: { en: 'Incorrect!', hi: 'गलत!', or: 'ଭୁଲ!' },
      nextQuestion: { en: 'Next Question', hi: 'अगला प्रश्न', or: 'ପରବର୍ତ୍ତୀ ପ୍ରଶ୍ନ' },
      finalScore: { en: 'Final Score', hi: 'अंतिम स्कोर', or: 'ଅନ୍ତିମ ସ୍କୋର' },
      playAgain: { en: 'Play Again', hi: 'फिर से खेलें', or: 'ପୁଣି ଖେଳନ୍ତୁ' },
      back: { en: 'Back', hi: 'वापस', or: 'ପଛକୁ' }
    };
    return translations[key]?.[language] || key;
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    setGameData({
      currentQuestionIndex: 0,
      hero: {
        name: heroName,
        hp: GAME_CONFIG.INITIAL_HP,
        maxHp: GAME_CONFIG.INITIAL_HP,
        powerMeter: 0,
        portrait: '🦾',
        position: GAME_CONFIG.ARENA.hero,
        attacking: false,
        hitReaction: false
      },
      villain: {
        name: villainName,
        hp: GAME_CONFIG.INITIAL_HP,
        maxHp: GAME_CONFIG.INITIAL_HP,
        powerMeter: 0,
        portrait: '👹',
        position: GAME_CONFIG.ARENA.villain,
        attacking: false,
        hitReaction: false
      },
      consecutiveCorrect: 0,
      score: 0,
      timeLeft: QUESTIONS[0].timeLimit,
      isPaused: false,
      isGameOver: false,
      winner: null,
      usedSpecials: [],
      lastAttack: null,
      answers: []
    });
    setSelectedAnswer(null);
    setShowAnswer(false);
    setAttackEffects([]);
  }, [heroName, villainName]);

  // Timer logic
  useEffect(() => {
    if (gameState === 'battle' && gameData.timeLeft > 0 && !gameData.isPaused && !gameData.isGameOver) {
      timerRef.current = setTimeout(() => {
        setGameData(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameData.timeLeft === 0 && !showAnswer) {
      handleSubmitAnswer();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, gameData.timeLeft, gameData.isPaused, gameData.isGameOver, showAnswer]);

  // Calculate damage
  const calculateDamage = (correct: boolean, timeTaken: number, difficulty: 'easy' | 'medium' | 'hard') => {
    const question = QUESTIONS[gameData.currentQuestionIndex];
    const timeLimit = question.timeLimit;
    
    if (correct) {
      const baseCorrect = GAME_CONFIG.DAMAGE[difficulty].correct;
      const timeFactor = (timeLimit - timeTaken) / timeLimit;
      const timeBonus = Math.round(baseCorrect * timeFactor);
      const streakBonus = Math.floor(Math.max(0, gameData.consecutiveCorrect - 1) * (baseCorrect * 0.15));
      return baseCorrect + timeBonus + streakBonus;
    } else {
      const baseWrong = GAME_CONFIG.DAMAGE[difficulty].wrong;
      const timeFactorWrong = timeTaken / timeLimit;
      const timeBonusWrong = Math.round(baseWrong * timeFactorWrong);
      return baseWrong + timeBonusWrong;
    }
  };

  // Trigger attack animation
  const triggerAttack = (attacker: 'hero' | 'villain', damage: number) => {
    setGameData(prev => ({
      ...prev,
      [attacker]: { ...prev[attacker], attacking: true },
      [attacker === 'hero' ? 'villain' : 'hero']: { 
        ...prev[attacker === 'hero' ? 'villain' : 'hero'], 
        hitReaction: true 
      },
      lastAttack: { attacker, damage, timestamp: Date.now() }
    }));

    // Add attack effect
    setAttackEffects(prev => [...prev, { type: attacker, timestamp: Date.now() }]);

    // Reset animations after delay
    setTimeout(() => {
      setGameData(prev => ({
        ...prev,
        hero: { ...prev.hero, attacking: false, hitReaction: false },
        villain: { ...prev.villain, attacking: false, hitReaction: false }
      }));
    }, 600);

    // Clean up attack effects
    setTimeout(() => {
      setAttackEffects(prev => prev.filter(effect => Date.now() - effect.timestamp < 800));
    }, 800);
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    const currentQuestion = QUESTIONS[gameData.currentQuestionIndex];
    const timeTaken = currentQuestion.timeLimit - gameData.timeLeft;
    
    let isCorrect = false;
    if (currentQuestion.type === 'multiple-choice') {
      isCorrect = selectedAnswer === currentQuestion.correctIndex;
    } else {
      isCorrect = selectedAnswer === currentQuestion.correctValue;
    }

    if (selectedAnswer === null && gameData.timeLeft > 0) return;
    
    const damage = calculateDamage(isCorrect, timeTaken, currentQuestion.difficulty);
    
    setGameData(prev => {
      const newState = { ...prev };
      
      newState.answers.push({
        questionId: currentQuestion.id,
        answer: selectedAnswer || '',
        correct: isCorrect,
        timeTaken,
        damage
      });

      if (isCorrect) {
        newState.villain.hp = Math.max(0, newState.villain.hp - damage);
        newState.consecutiveCorrect += 1;
        newState.score += damage * 10;
        
        let powerGain = GAME_CONFIG.POWER_GAIN.base;
        const timeFactor = (currentQuestion.timeLimit - timeTaken) / currentQuestion.timeLimit;
        if (timeFactor >= 0.6) {
          powerGain += GAME_CONFIG.POWER_GAIN.fastBonus;
        }
        newState.hero.powerMeter = Math.min(100, newState.hero.powerMeter + powerGain);
        
        triggerAttack('hero', damage);
      } else {
        newState.hero.hp = Math.max(0, newState.hero.hp - damage);
        newState.consecutiveCorrect = 0;
        
        triggerAttack('villain', damage);
      }

      if (newState.hero.hp <= 0) {
        newState.isGameOver = true;
        newState.winner = 'villain';
      } else if (newState.villain.hp <= 0) {
        newState.isGameOver = true;
        newState.winner = 'hero';
      }

      return newState;
    });

    setShowAnswer(true);
  };

  // Move to next question
  const nextQuestion = () => {
    if (gameData.currentQuestionIndex < QUESTIONS.length - 1) {
      setGameData(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeLeft: QUESTIONS[prev.currentQuestionIndex + 1].timeLimit
      }));
    } else {
      setGameData(prev => ({
        ...prev,
        isGameOver: true,
        winner: prev.hero.hp > prev.villain.hp ? 'hero' : prev.villain.hp > prev.hero.hp ? 'villain' : null
      }));
    }
    
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  // Use special move
  const useSpecialMove = (special: string) => {
    if (gameData.hero.powerMeter < 100 || gameData.usedSpecials.includes(special)) return;

    setGameData(prev => {
      const newState = { ...prev };
      newState.hero.powerMeter = 0;
      newState.usedSpecials.push(special);

      switch (special) {
        case 'repulsor':
          newState.villain.hp = Math.max(0, newState.villain.hp - GAME_CONFIG.SPECIAL_MOVES.repulsor.damage);
          triggerAttack('hero', GAME_CONFIG.SPECIAL_MOVES.repulsor.damage);
          break;
        case 'shield':
          newState.hero.hp = Math.min(newState.hero.maxHp, newState.hero.hp + GAME_CONFIG.SPECIAL_MOVES.shield.heal);
          break;
        case 'timeDilation':
          newState.timeLeft = Math.ceil(newState.timeLeft * (1 + GAME_CONFIG.SPECIAL_MOVES.timeDilation.timeBonus));
          break;
      }

      if (newState.villain.hp <= 0) {
        newState.isGameOver = true;
        newState.winner = 'hero';
      }

      return newState;
    });

    setShowSpecialMoves(false);
  };

  // Render animated arena
  const renderArena = () => (
    <div className="relative h-80 mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900">
      {/* Parallax Background Layers */}
      <div className="absolute inset-0">
        {/* Far background - stars */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Middle background - nebula clouds */}
        <div className="absolute inset-0 opacity-20">
          <motion.div 
            className="absolute top-4 left-12 w-24 h-16 bg-blue-500/30 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-8 right-16 w-32 h-20 bg-purple-500/30 rounded-full blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
        </div>
        
        {/* Arena floor */}
        <div className="absolute bottom-0 left-0 right-0 h-12">
          <svg width="100%" height="100%" viewBox="0 0 800 48" className="w-full h-full">
            <defs>
              <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(71, 85, 105, 0.5)" />
                <stop offset="100%" stopColor="rgba(51, 65, 85, 0.8)" />
              </linearGradient>
            </defs>
            <path d="M0,24 Q400,12 800,24 L800,48 L0,48 Z" fill="url(#floorGradient)" />
            <path d="M0,24 Q400,12 800,24" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" fill="none" />
          </svg>
        </div>
      </div>

      {/* Character Stage Areas */}
      <div className="relative z-10 h-full flex items-end justify-between px-8 pb-16">
        {/* Hero Character */}
        <div className="relative" style={{ left: `${gameData.hero.position.x - 15}%` }}>
          {/* HP Bar above character */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 bg-black/50 rounded-lg p-2">
            <div className="flex justify-between text-xs text-white mb-1">
              <span>{gameData.hero.name}</span>
              <span>{gameData.hero.hp}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
              <motion.div 
                className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                animate={{ width: `${(gameData.hero.hp / gameData.hero.maxHp) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1">
              <motion.div 
                className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                animate={{ width: `${gameData.hero.powerMeter}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          {/* Hero SVG Character */}
          <motion.div 
            className="w-20 h-24 relative"
            animate={{ 
              y: gameData.hero.attacking ? [-4, 0, -4] : [0, -6, 0],
              scaleY: gameData.hero.attacking ? [1, 0.95, 1] : [1, 0.98, 1],
              scaleX: gameData.hero.hitReaction ? [1, 0.9, 1] : 1,
              x: gameData.hero.attacking ? [0, 30, 0] : 0
            }}
            transition={{ 
              duration: gameData.hero.attacking ? 0.6 : 1.8, 
              repeat: gameData.hero.attacking ? 0 : Infinity, 
              ease: "easeInOut" 
            }}
          >
            <svg width="80" height="96" viewBox="0 0 80 96" className="w-full h-full">
              <defs>
                <linearGradient id="heroBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="heroArmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <radialGradient id="heroGlow" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="rgba(96, 165, 250, 0.4)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              
              {/* Glow aura */}
              <circle cx="40" cy="48" r="35" fill="url(#heroGlow)" />
              
              {/* Body */}
              <ellipse cx="40" cy="60" rx="15" ry="24" fill="url(#heroBodyGradient)" />
              
              {/* Head */}
              <circle cx="40" cy="30" r="12" fill="#fbbf24" />
              
              {/* Eyes */}
              <motion.g
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 0.15, repeat: Infinity, repeatDelay: Math.random() * 5 + 3 }}
              >
                <circle cx="35" cy="27" r="2.5" fill="#1f2937" />
                <circle cx="45" cy="27" r="2.5" fill="#1f2937" />
                <circle cx="35" cy="26" r="1" fill="#60a5fa" />
                <circle cx="45" cy="26" r="1" fill="#60a5fa" />
              </motion.g>
              
              {/* Repulsor Arc (right arm) */}
              <ellipse cx="58" cy="54" rx="5" ry="10" fill="url(#heroArmGradient)" />
              <motion.circle 
                cx="60" cy="54" r="4" fill="#60a5fa" 
                animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              
              {/* Left arm */}
              <ellipse cx="22" cy="54" rx="5" ry="10" fill="url(#heroArmGradient)" />
              
              {/* Legs */}
              <ellipse cx="32" cy="84" rx="4" ry="10" fill="#dc2626" />
              <ellipse cx="48" cy="84" rx="4" ry="10" fill="#dc2626" />
              
              {/* Chest arc reactor */}
              <motion.circle 
                cx="40" cy="50" r="3" fill="#60a5fa"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </svg>
          </motion.div>

          {/* Special Move Button */}
          {gameData.hero.powerMeter >= 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <Button
                onClick={() => setShowSpecialMoves(true)}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white animate-pulse"
              >
                <Zap className="w-3 h-3 mr-1" />
                Special
              </Button>
            </motion.div>
          )}
        </div>

        {/* Villain Character */}
        <div className="relative" style={{ right: `${100 - gameData.villain.position.x - 15}%` }}>
          {/* HP Bar above character */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 bg-black/50 rounded-lg p-2">
            <div className="flex justify-between text-xs text-white mb-1">
              <span>{gameData.villain.name}</span>
              <span>{gameData.villain.hp}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div 
                className="h-2 bg-gradient-to-r from-red-500 to-purple-600 rounded-full"
                animate={{ width: `${(gameData.villain.hp / gameData.villain.maxHp) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Villain SVG Character */}
          <motion.div 
            className="w-20 h-24 relative"
            animate={{ 
              y: gameData.villain.attacking ? [-3, 0, -3] : [0, -4, 0],
              scaleY: gameData.villain.attacking ? [1, 0.96, 1] : [1, 0.99, 1],
              scaleX: gameData.villain.hitReaction ? [1, 0.9, 1] : 1,
              x: gameData.villain.attacking ? [0, -30, 0] : 0
            }}
            transition={{ 
              duration: gameData.villain.attacking ? 0.6 : 2.2, 
              repeat: gameData.villain.attacking ? 0 : Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <svg width="80" height="96" viewBox="0 0 80 96" className="w-full h-full">
              <defs>
                <linearGradient id="villainBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7c2d12" />
                  <stop offset="100%" stopColor="#581c87" />
                </linearGradient>
                <radialGradient id="villainGlow" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="rgba(147, 51, 234, 0.4)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              
              {/* Dark aura */}
              <circle cx="40" cy="48" r="38" fill="url(#villainGlow)" />
              
              {/* Body */}
              <ellipse cx="40" cy="60" rx="17" ry="26" fill="url(#villainBodyGradient)" />
              
              {/* Head */}
              <ellipse cx="40" cy="26" rx="14" ry="18" fill="#581c87" />
              
              {/* Eyes (glowing) */}
              <motion.g
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <circle cx="33" cy="24" r="4" fill="#ef4444" />
                <circle cx="47" cy="24" r="4" fill="#ef4444" />
                <circle cx="33" cy="24" r="2" fill="#fbbf24" />
                <circle cx="47" cy="24" r="2" fill="#fbbf24" />
              </motion.g>
              
              {/* Arms */}
              <ellipse cx="20" cy="48" rx="6" ry="14" fill="#7c2d12" />
              <ellipse cx="60" cy="48" rx="6" ry="14" fill="#7c2d12" />
              
              {/* Gauntlet (Infinity Gauntlet style) */}
              <ellipse cx="60" cy="58" rx="7" ry="10" fill="#fbbf24" />
              <motion.circle 
                cx="60" cy="58" r="5" fill="#dc2626" 
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* Legs */}
              <ellipse cx="30" cy="86" rx="5" ry="12" fill="#581c87" />
              <ellipse cx="50" cy="86" rx="5" ry="12" fill="#581c87" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Attack Effects Layer */}
      <AnimatePresence>
        {attackEffects.map((effect, index) => (
          <motion.div
            key={`${effect.type}-${effect.timestamp}-${index}`}
            className="absolute inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {effect.type === 'hero' ? (
              // Hero repulsor beam
              <motion.div
                className="absolute top-1/2 left-1/4 w-1/2 h-1"
                style={{ transformOrigin: 'left center' }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-full h-full bg-gradient-to-r from-blue-400 to-transparent rounded-full shadow-lg shadow-blue-400/50" />
              </motion.div>
            ) : (
              // Villain energy blast
              <motion.div
                className="absolute top-1/2 right-1/4 w-1/2 h-2"
                style={{ transformOrigin: 'right center' }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full h-full bg-gradient-to-l from-purple-600 to-transparent rounded-full shadow-lg shadow-purple-600/50" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Damage Pop Numbers */}
      <AnimatePresence>
        {gameData.lastAttack && showAnswer && (
          <motion.div
            key={gameData.lastAttack.timestamp}
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
            initial={{ 
              opacity: 0, 
              scale: 2, 
              y: 0 
            }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [2, 1.2, 1, 0.8], 
              y: [0, -30, -60, -90] 
            }}
            transition={{ duration: 1.2 }}
          >
            <div className={`text-3xl font-bold ${
              gameData.lastAttack.attacker === 'hero' 
                ? 'text-blue-400' 
                : 'text-red-400'
            }`}>
              -{gameData.lastAttack.damage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen shake effect */}
      {(gameData.hero.hitReaction || gameData.villain.hitReaction) && (
        <motion.div
          className="absolute inset-0 bg-red-500/10"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );

  // Render current question
  const renderQuestion = () => {
    const question = QUESTIONS[gameData.currentQuestionIndex];
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Badge variant="outline" className="mb-2 text-white border-white/30">
            {getT('question')} {gameData.currentQuestionIndex + 1}/{QUESTIONS.length}
          </Badge>
          <h3 className="text-lg font-semibold mb-4 text-white">{question.text}</h3>
        </div>

        {question.type === 'multiple-choice' ? (
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? 'default' : 'outline'}
                className={`p-4 text-left justify-start transition-all duration-200 ${
                  showAnswer
                    ? index === question.correctIndex
                      ? 'bg-green-600 border-green-500 text-white'
                      : selectedAnswer === index && index !== question.correctIndex
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-white/10 border-white/30 text-white/70'
                    : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                }`}
                onClick={() => !showAnswer && setSelectedAnswer(index)}
                disabled={showAnswer}
              >
                <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <input
              type="number"
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(Number(e.target.value))}
              className="w-32 p-3 text-center text-xl border-2 rounded-lg bg-white/10 border-white/30 text-white placeholder-white/50"
              placeholder="?"
              disabled={showAnswer}
            />
          </div>
        )}

        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              (question.type === 'multiple-choice' ? selectedAnswer === question.correctIndex : selectedAnswer === question.correctValue)
                ? 'bg-green-900/50 border-green-500 text-green-100'
                : 'bg-red-900/50 border-red-500 text-red-100'
            }`}
          >
            <p className="font-semibold mb-2">
              {(question.type === 'multiple-choice' ? selectedAnswer === question.correctIndex : selectedAnswer === question.correctValue)
                ? getT('correct')
                : getT('incorrect')
              }
            </p>
            <p className="text-sm opacity-90">{question.explanation}</p>
          </motion.div>
        )}
      </div>
    );
  };

  // Main render logic based on state
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <Card className="w-full max-w-md bg-black/20 backdrop-blur-md border-white/20">
          <CardContent className="p-8 text-center">
            <motion.div 
              className="flex justify-center items-center gap-4 mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="text-6xl"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🦾
              </motion.div>
              <motion.div 
                className="text-4xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ⚔️
              </motion.div>
              <motion.div 
                className="text-6xl"
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                👹
              </motion.div>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-2">{getT('title')}</h1>
            <p className="text-white/70 mb-8">{getT('subtitle')}</p>
            
            <div className="space-y-4">
              <Button
                onClick={() => {
                  initializeGame();
                  setGameState('battle');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200"
              >
                <Play className="w-5 h-5 mr-2" />
                {getT('startBattle')}
              </Button>
              
              <Button
                onClick={() => setGameState('settings')}
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10"
              >
                <Settings className="w-5 h-5 mr-2" />
                {getT('settings')}
              </Button>
              
              <Button
                onClick={onBack}
                variant="ghost"
                className="w-full text-white/70 hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                {getT('back')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/20 backdrop-blur-md border-white/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">{getT('settings')}</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white mb-2">Hero Name</label>
                <select
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="Armored Hero" className="text-black">Armored Hero</option>
                  <option value="Iron Man" className="text-black">Iron Man</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white mb-2">Villain Name</label>
                <select
                  value={villainName}
                  onChange={(e) => setVillainName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="Titan Overlord" className="text-black">Titan Overlord</option>
                  <option value="Thanos" className="text-black">Thanos</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white">Sound Effects</span>
                <Button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setGameState('menu')}
                  variant="outline"
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                >
                  {getT('back')}
                </Button>
                
                <Button
                  onClick={() => {
                    initializeGame();
                    setGameState('battle');
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {getT('startBattle')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'battle') {
    if (gameData.isGameOver) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-black/20 backdrop-blur-md border-white/20">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-8xl mb-4"
              >
                {gameData.winner === 'hero' ? '🏆' : '💀'}
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                {gameData.winner === 'hero' ? getT('heroWins') : getT('villainWins')}
              </h2>
              
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-2">{getT('finalScore')}</h3>
                <p className="text-2xl font-bold text-yellow-400">{gameData.score.toLocaleString()}</p>
                <p className="text-white/70 text-sm mt-2">
                  Correct Answers: {gameData.answers.filter(a => a.correct).length}/{QUESTIONS.length}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    initializeGame();
                    setGameState('battle');
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {getT('playAgain')}
                </Button>
                
                <Button
                  onClick={() => {
                    const finalScore = Math.min(gameData.score, 10000);
                    const xp = Math.floor(finalScore / 100);
                    onComplete(finalScore, xp);
                  }}
                  variant="outline"
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                >
                  {getT('back')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* HUD */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => setGameState('paused')}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/30 text-white"
            >
              <Pause className="w-4 h-4" />
            </Button>
            
            <Badge variant="outline" className="text-white border-white/30">
              Q {gameData.currentQuestionIndex + 1}/{QUESTIONS.length}
            </Badge>
            
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4" />
              <span className={`font-bold ${gameData.timeLeft <= 5 ? 'text-red-400 animate-pulse' : ''}`}>
                {gameData.timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Animated Battle Arena */}
        <div className="px-4">
          {renderArena()}
        </div>

        {/* Question Area */}
        <div className="px-4 pb-4">
          <Card className="bg-black/20 backdrop-blur-md border-white/20 mb-6">
            <CardContent className="p-6">
              {renderQuestion()}
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex justify-center">
            {!showAnswer ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 transform hover:scale-105 transition-all duration-200"
              >
                <Target className="w-4 h-4 mr-2" />
                {getT('submit')}
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 transform hover:scale-105 transition-all duration-200"
              >
                {gameData.currentQuestionIndex < QUESTIONS.length - 1 ? getT('nextQuestion') : 'Finish Battle'}
              </Button>
            )}
          </div>
        </div>

        {/* Special Moves Modal */}
        <AnimatePresence>
          {showSpecialMoves && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowSpecialMoves(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-lg p-6 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-white font-bold mb-4 text-center">Special Moves</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => useSpecialMove('repulsor')}
                    disabled={gameData.usedSpecials.includes('repulsor')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Repulsor Blast (+30 DMG)
                  </Button>
                  <Button
                    onClick={() => useSpecialMove('shield')}
                    disabled={gameData.usedSpecials.includes('shield')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Nano Shield (+20 HP)
                  </Button>
                  <Button
                    onClick={() => useSpecialMove('timeDilation')}
                    disabled={gameData.usedSpecials.includes('timeDilation')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Time Dilation (+30% Time)
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paused Modal */}
        <AnimatePresence>
          {gameState === 'paused' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800 rounded-lg p-6 max-w-sm w-full text-center"
              >
                <h3 className="text-white font-bold mb-4">Game Paused</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => setGameState('battle')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                  <Button
                    onClick={() => {
                      initializeGame();
                      setGameState('battle');
                    }}
                    variant="outline"
                    className="w-full border-white/30 text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart
                  </Button>
                  <Button
                    onClick={() => setGameState('menu')}
                    variant="ghost"
                    className="w-full text-white/70"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Exit to Menu
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return null;
}