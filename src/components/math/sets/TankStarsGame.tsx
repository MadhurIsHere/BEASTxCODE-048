import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ArrowLeft, Zap, Pause, RotateCcw, Target, Clock, Star, CheckCircle2, X, Globe, Heart, Shield, Sword, Flame } from 'lucide-react';
import { getQuestionsForLevel, type QuestionData } from './SetsQuestionBank';
import type { Language } from '../../../types/onboarding';

interface TankStarsGameProps {
  language: Language;
  level: number;
  onComplete: (score: number, accuracy: number, level: number) => void;
  onBack: () => void;
}

interface Tank {
  hp: number;
  maxHp: number;
  damage: number;
  name: string;
  color: string;
}

interface GameState {
  currentQuestion: number;
  score: number;
  streak: number;
  timeRemaining: number;
  isPlaying: boolean;
  isPaused: boolean;
  showResult: boolean;
  answers: boolean[];
  selectedOption: number | null;
  playerTank: Tank;
  opponentTank: Tank;
  showFeedback: boolean;
  feedbackMessage: string;
  feedbackType: 'correct' | 'incorrect' | 'timeout';
  battleLog: string[];
  showBattleAnimation: boolean;
  lastDamage: number;
  showScreenShake: boolean;
  showHpFlash: boolean;
  tankRecoil: 'player' | 'enemy' | null;
}

export function TankStarsGame({ language, level, onComplete, onBack }: TankStarsGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    streak: 0,
    timeRemaining: 0,
    isPlaying: false,
    isPaused: false,
    showResult: false,
    answers: [],
    selectedOption: null,
    playerTank: {
      hp: 100,
      maxHp: 100,
      damage: 15,
      name: 'Hero Tank',
      color: '#3b82f6'
    },
    opponentTank: {
      hp: 100,
      maxHp: 100,
      damage: getOpponentDamage(level),
      name: 'Villain Tank',
      color: '#ef4444'
    },
    showFeedback: false,
    feedbackMessage: '',
    feedbackType: 'correct',
    battleLog: [],
    showBattleAnimation: false,
    lastDamage: 0,
    showScreenShake: false,
    showHpFlash: false,
    tankRecoil: null
  });

  const questions = getQuestionsForLevel(level);
  const currentQuestion = questions[gameState.currentQuestion];
  const timerRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Performance monitoring to prevent hangs
  useEffect(() => {
    const startTime = performance.now();
    const checkPerformance = () => {
      const currentTime = performance.now();
      if (currentTime - startTime > 5000) { // If component takes longer than 5s to render
        console.warn('TankStarsGame: Performance issue detected, reducing animations');
        // Force disable complex animations on performance issues
        document.documentElement.style.setProperty('--animation-speed', '0.1s');
      }
    };
    
    const timeoutId = setTimeout(checkPerformance, 100);
    return () => clearTimeout(timeoutId);
  }, [gameState.showBattleAnimation]);

  const texts = {
    en: {
      title: `Tank Stars - Level ${level}`,
      subtitle: 'Battle using set theory knowledge in strategic tank combat',
      question: 'Question',
      of: 'of',
      score: 'Score',
      streak: 'Streak',
      health: 'Health',
      timeLeft: 'Time Left',
      submit: 'Fire!',
      pause: 'Pause',
      resume: 'Resume',
      reset: 'Reset Battle',
      backToLevels: 'Back to Levels',
      correct: 'Direct Hit!',
      incorrect: 'Missed!',
      timeUp: 'Time\'s up!',
      victory: 'Victory!',
      defeat: 'Defeat!',
      finalScore: 'Final Score',
      accuracy: 'Accuracy',
      damageDealt: 'Damage Dealt',
      streakBonus: 'Max Streak',
      playAgain: 'Battle Again',
      nextLevel: 'Next Battle',
      explanation: 'Explanation',
      playerTank: 'Your Tank',
      enemyTank: 'Enemy Tank'
    },
    hi: {
      title: `टैंक स्टार्स - स्तर ${level}`,
      subtitle: 'रणनीतिक टैंक युद्ध में सेट सिद्धांत ज्ञान का उपयोग करके लड़ाई',
      question: 'प्रश्न',
      of: 'का',
      score: 'स्कोर',
      streak: 'श्रृंखला',
      health: 'स्वास्थ्य',
      timeLeft: 'शेष समय',
      submit: 'आग!',
      pause: 'रोकें',
      resume: 'जारी रखें',
      reset: 'युद्ध रीसेट करें',
      backToLevels: 'स्तरों में वापस',
      correct: 'सीधा हिट!',
      incorrect: 'चूक गए!',
      timeUp: 'समय समाप्त!',
      victory: 'विजय!',
      defeat: 'हार!',
      finalScore: 'अंतिम स्कोर',
      accuracy: 'सटीकता',
      damageDealt: 'नुकसान पहुंचाया',
      streakBonus: 'अधिकतम श्रृंखला',
      playAgain: 'फिर से लड़ाई',
      nextLevel: 'अगली लड़ाई',
      explanation: 'व्याख्या',
      playerTank: 'आपका टैंक',
      enemyTank: 'दुश्मन टैंक'
    },
    or: {
      title: `ଟ୍ୟାଙ୍କ ଷ୍ଟାର୍ସ - ସ୍ତର ${level}`,
      subtitle: 'ରଣନୀତିକ ଟ୍ୟାଙ୍କ ଯୁଦ୍ଧରେ ସେଟ୍ ସିଦ୍ଧାନ୍ତ ଜ୍ଞାନ ବ୍ୟବହାର କରି ଯୁଦ୍ଧ',
      question: 'ପ୍ରଶ୍ନ',
      of: 'ର',
      score: 'ସ୍କୋର',
      streak: 'ଶୃଙ୍ଖଳା',
      health: 'ସ୍ୱାସ୍ଥ୍ୟ',
      timeLeft: 'ଅବଶିଷ୍ଟ ସମୟ',
      submit: 'ଆଗୁଣ!',
      pause: 'ବିରାମ',
      resume: 'ଆରମ୍ଭ',
      reset: 'ଯୁଦ୍ଧ ରିସେଟ୍ କରନ୍ତୁ',
      backToLevels: 'ସ୍ତରକୁ ଫେରନ୍ତୁ',
      correct: 'ସିଧା ହିଟ୍!',
      incorrect: 'ମିସ୍!',
      timeUp: 'ସମୟ ସମାପ୍ତ!',
      victory: 'ବିଜୟ!',
      defeat: 'ପରାଜୟ!',
      finalScore: 'ଅନ୍ତିମ ସ୍କୋର',
      accuracy: 'ସଠିକତା',
      damageDealt: 'କ୍ଷତି ପହଞ୍ଚାଇଛି',
      streakBonus: 'ସର୍ବୋଚ୍ଚ ଶୃଙ୍ଖଳା',
      playAgain: 'ପୁନର୍ବାର ଯୁଦ୍ଧ',
      nextLevel: 'ପରବର୍ତ୍ତୀ ଯୁଦ୍ଧ',
      explanation: 'ବ୍ୟାଖ୍ୟା',
      playerTank: 'ଆପଣଙ୍କ ଟ୍ୟାଙ୍କ',
      enemyTank: 'ଶତ୍ରୁ ଟ୍ୟାଙ୍କ'
    }
  };

  const currentText = texts[language];

  // Initialize game
  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  function getOpponentDamage(level: number): number {
    const damages = [6, 14, 22, 34, 50];
    return damages[level - 1] || 20;
  }

  const initializeGame = () => {
    setGameState(prev => ({
      ...prev,
      timeRemaining: currentQuestion?.timeLimit || 30,
      isPlaying: true,
      opponentTank: {
        ...prev.opponentTank,
        damage: getOpponentDamage(level)
      }
    }));
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          handleTimeUp();
          return prev;
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);
  };

  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Opponent attacks when time runs out
    const opponentDamage = gameState.opponentTank.damage;
    const newPlayerHp = Math.max(0, gameState.playerTank.hp - opponentDamage);
    
    setGameState(prev => ({
      ...prev,
      showFeedback: true,
      feedbackMessage: currentText.timeUp,
      feedbackType: 'timeout',
      streak: 0,
      playerTank: { ...prev.playerTank, hp: newPlayerHp },
      battleLog: [...prev.battleLog, `Enemy deals ${opponentDamage} damage!`],
      showBattleAnimation: true,
      lastDamage: opponentDamage,
      showScreenShake: true,
      showHpFlash: true,
      tankRecoil: 'enemy'
    }));

    // Clear animation effects after short delays
    // Clear animation effects quickly
    setTimeout(() => {
      setGameState(prev => ({ 
        ...prev, 
        tankRecoil: null,
        showBattleAnimation: false,
        showScreenShake: false,
        showHpFlash: false
      }));
    }, 400);

    if (newPlayerHp <= 0) {
      endGame();
      return;
    }

    setTimeout(() => {
      nextQuestion();
    }, 1500); // Reduced from 2000ms
  };

  const handleAnswerSubmit = () => {
    if (gameState.selectedOption === null) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    const isCorrect = gameState.selectedOption === currentQuestion.lang[language].answerIndex;
    const newStreak = isCorrect ? gameState.streak + 1 : 0;
    const basePoints = isCorrect ? 10 : 0;
    const streakBonus = newStreak * 5;
    const points = basePoints + streakBonus;
    
    let newPlayerHp = gameState.playerTank.hp;
    let newOpponentHp = gameState.opponentTank.hp;
    let battleMessage = '';
    let damage = 0;

    if (isCorrect) {
      // Player attacks
      const playerDamage = gameState.playerTank.damage + (newStreak * 3);
      newOpponentHp = Math.max(0, gameState.opponentTank.hp - playerDamage);
      battleMessage = `You deal ${playerDamage} damage!`;
      damage = playerDamage;
    } else {
      // Opponent attacks
      const opponentDamage = gameState.opponentTank.damage;
      newPlayerHp = Math.max(0, gameState.playerTank.hp - opponentDamage);
      battleMessage = `Enemy deals ${opponentDamage} damage!`;
      damage = opponentDamage;
    }
    
    setGameState(prev => ({
      ...prev,
      showFeedback: true,
      feedbackMessage: isCorrect ? currentText.correct : currentText.incorrect,
      feedbackType: isCorrect ? 'correct' : 'incorrect',
      score: prev.score + points,
      streak: newStreak,
      answers: [...prev.answers, isCorrect],
      playerTank: { ...prev.playerTank, hp: newPlayerHp },
      opponentTank: { ...prev.opponentTank, hp: newOpponentHp },
      battleLog: [...prev.battleLog, battleMessage],
      showBattleAnimation: true,
      lastDamage: damage,
      showScreenShake: true,
      showHpFlash: true,
      tankRecoil: isCorrect ? 'player' : 'enemy'
    }));

    // Clear animation effects quickly
    setTimeout(() => {
      setGameState(prev => ({ 
        ...prev, 
        tankRecoil: null,
        showBattleAnimation: false,
        showScreenShake: false,
        showHpFlash: false
      }));
    }, 400);

    // Check for game end conditions
    if (newPlayerHp <= 0 || newOpponentHp <= 0) {
      setTimeout(() => {
        endGame();
      }, 1500); // Reduced from 2000ms
      return;
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 2000); // Reduced from 2500ms
  };

  const nextQuestion = () => {
    setGameState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      selectedOption: null,
      showFeedback: false,
      showBattleAnimation: false,
      showScreenShake: false,
      showHpFlash: false,
      tankRecoil: null,
      timeRemaining: questions[prev.currentQuestion + 1]?.timeLimit || 30
    }));

    if (gameState.currentQuestion + 1 >= questions.length) {
      endGame();
      return;
    }

    startTimer();
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const correctAnswers = gameState.answers.filter(Boolean).length;
    const accuracy = gameState.answers.length > 0 ? (correctAnswers / gameState.answers.length) * 100 : 0;
    
    setGameState(prev => ({
      ...prev,
      showResult: true,
      isPlaying: false
    }));
    
    setTimeout(() => {
      onComplete(gameState.score, accuracy, level);
    }, 3000);
  };

  const pauseGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState(prev => ({ ...prev, isPaused: true }));
  };

  const resumeGame = () => {
    setGameState(prev => ({ ...prev, isPaused: false }));
    startTimer();
  };

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState({
      currentQuestion: 0,
      score: 0,
      streak: 0,
      timeRemaining: questions[0]?.timeLimit || 30,
      isPlaying: true,
      isPaused: false,
      showResult: false,
      answers: [],
      selectedOption: null,
      playerTank: {
        hp: 100,
        maxHp: 100,
        damage: 15,
        name: 'Hero Tank',
        color: '#3b82f6'
      },
      opponentTank: {
        hp: 100,
        maxHp: 100,
        damage: getOpponentDamage(level),
        name: 'Villain Tank',
        color: '#ef4444'
      },
      showFeedback: false,
      feedbackMessage: '',
      feedbackType: 'correct',
      battleLog: [],
      showBattleAnimation: false,
      lastDamage: 0,
      showScreenShake: false,
      showHpFlash: false,
      tankRecoil: null
    });
    startTimer();
  };

  if (gameState.showResult) {
    const correctAnswers = gameState.answers.filter(Boolean).length;
    const accuracy = Math.round((correctAnswers / gameState.answers.length) * 100);
    const isVictory = gameState.opponentTank.hp <= 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <Card className="max-w-lg w-full bg-gradient-to-br from-purple-100/95 to-pink-100/95 border-4 border-purple-300 animate-bounce-in">
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${
              isVictory ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'
            } rounded-full flex items-center justify-center mb-4`}>
              {isVictory ? <CheckCircle2 className="h-8 w-8 text-white" /> : <X className="h-8 w-8 text-white" />}
            </div>
            <CardTitle className="text-2xl text-purple-900">
              {isVictory ? currentText.victory : currentText.defeat}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600">{gameState.score}</div>
                <p className="text-purple-700 text-sm">{currentText.finalScore}</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">{accuracy}%</div>
                <p className="text-pink-700 text-sm">{currentText.accuracy}</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{100 - gameState.opponentTank.hp}</div>
                <p className="text-red-700 text-sm">{currentText.damageDealt}</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{Math.max(...gameState.answers.map((_, i) => gameState.answers.slice(0, i + 1).reverse().findIndex(a => !a) === -1 ? i + 1 : 0))}</div>
                <p className="text-orange-700 text-sm">{currentText.streakBonus}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                {currentText.playAgain}
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1"
              >
                {currentText.backToLevels}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <p className="text-gray-600">Loading battle...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questionData = currentQuestion.lang[language];
  const progressPercent = ((gameState.currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden ${
      gameState.showScreenShake ? 'animate-screen-shake' : ''
    }`}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-orange-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(79, 70, 229, 0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Compact Header */}
      <header className="bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-indigo-900/95 text-white border-b border-cyan-500/30 backdrop-blur-sm relative z-10">
        <div className="px-3 md:px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-cyan-500/30 bg-slate-800/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 backdrop-blur-sm px-2 py-1"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{currentText.backToLevels}</span>
              </Button>
              <div>
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  {currentText.title}
                </h1>
                <p className="text-slate-300 text-xs leading-tight">{currentText.subtitle}</p>
              </div>
            </div>
            
            {/* Compact Status Panel */}
            <div className="flex items-center space-x-2">
              {/* Score & Timer Inline */}
              <div className="bg-slate-800/50 px-2 py-1 rounded border border-slate-600/50">
                <div className="text-xs text-cyan-400 font-medium">{gameState.score}pt</div>
              </div>
              <div className={`px-2 py-1 rounded border ${
                gameState.timeRemaining <= 10 
                  ? 'bg-red-800/50 border-red-500/30 text-red-400' 
                  : 'bg-slate-800/50 border-orange-500/30 text-orange-400'
              }`}>
                <div className="text-xs font-medium">{gameState.timeRemaining}s</div>
              </div>
              
              {/* Language Indicator */}
              <div className="bg-slate-800/50 px-2 py-1 rounded border border-slate-600/50">
                <span className="text-xs text-cyan-300">
                  {language === 'en' ? 'EN' : language === 'hi' ? 'हि' : 'ଓଡ଼'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-2 md:p-3">
        {/* Enhanced Battle Arena */}
        <div className="mb-3">
          <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white border-0 shadow-2xl overflow-hidden relative">
            {/* Futuristic Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-orange-500/20"></div>
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>
              <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-400/30 to-transparent"></div>
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent"></div>
            </div>
            
            <CardContent className="p-0">
              {/* Compact Score/Level Header */}
              <div className="px-4 py-2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-b border-slate-600/50">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-cyan-300 font-medium">Level {level}</div>
                  <div className="text-xs text-purple-300 font-medium">
                    Q{gameState.currentQuestion + 1}/{questions.length}
                  </div>
                  <div className="text-xs text-amber-300 font-medium">Streak: {gameState.streak}</div>
                </div>
              </div>

              <div className="relative p-4 min-h-[220px]">
                {/* Battlefield Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-800 via-slate-700/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600"></div>
                
                {/* Battle Scene Layout */}
                <div className="grid grid-cols-3 gap-4 items-end relative z-10">
                  {/* Player Tank (Left) */}
                  <div className="text-center">
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-cyan-200 mb-1">
                        <span>Player HP</span>
                        <span className="font-bold">{gameState.playerTank.hp}/{gameState.playerTank.maxHp}</span>
                      </div>
                      <Progress 
                        value={(gameState.playerTank.hp / gameState.playerTank.maxHp) * 100} 
                        className={`h-3 bg-slate-700 border border-cyan-500/30 ${
                          gameState.showHpFlash && gameState.feedbackType !== 'correct' ? 'animate-hp-damage-flash' : ''
                        }`}
                      />
                    </div>
                    
                    <div className="relative group">
                      {/* Tank SVG - Player */}
                      <div className={`relative inline-block ${
                        gameState.tankRecoil === 'player' ? 'animate-tank-recoil-right' : 
                        gameState.showBattleAnimation && gameState.feedbackType === 'correct' ? 'animate-hero-attack' : 'animate-hero-idle'
                      }`}>
                        <svg width="80" height="60" viewBox="0 0 80 60" className="filter drop-shadow-lg">
                          {/* Tank Body */}
                          <rect x="10" y="30" width="50" height="20" rx="5" fill="url(#playerGradient)" stroke="#3b82f6" strokeWidth="2"/>
                          {/* Tank Turret */}
                          <circle cx="35" cy="35" r="12" fill="url(#playerTurretGradient)" stroke="#1e40af" strokeWidth="2"/>
                          {/* Tank Cannon */}
                          <rect x="45" y="33" width="25" height="4" rx="2" fill="#1e40af"/>
                          {/* Tank Tracks */}
                          <rect x="8" y="48" width="54" height="6" rx="3" fill="#374151"/>
                          <circle cx="18" cy="51" r="3" fill="#6b7280"/>
                          <circle cx="30" cy="51" r="3" fill="#6b7280"/>
                          <circle cx="42" cy="51" r="3" fill="#6b7280"/>
                          <circle cx="54" cy="51" r="3" fill="#6b7280"/>
                          
                          <defs>
                            <linearGradient id="playerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#3b82f6"/>
                              <stop offset="100%" stopColor="#1e40af"/>
                            </linearGradient>
                            <linearGradient id="playerTurretGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#60a5fa"/>
                              <stop offset="100%" stopColor="#3b82f6"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Damage Number Animation */}
                        {gameState.showBattleAnimation && gameState.feedbackType !== 'correct' && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-red-400 font-bold text-lg animate-damage-pop pointer-events-none">
                            -{gameState.lastDamage}
                          </div>
                        )}
                        
                        {/* Simplified Muzzle Flash */}
                        {gameState.showBattleAnimation && gameState.feedbackType === 'correct' && (
                          <div className="absolute top-6 right-0 w-8 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-r-full animate-muzzle-flash"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <h3 className="text-sm font-bold text-cyan-300">{currentText.playerTank}</h3>
                    </div>
                  </div>

                  {/* Battle Center Area */}
                  <div className="text-center relative">
                    {/* Simplified Projectile */}
                    {gameState.showBattleAnimation && (
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                        <div className={`w-4 h-2 rounded-full animate-projectile-travel ${
                          gameState.feedbackType === 'correct' 
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-500' 
                            : 'bg-gradient-to-r from-red-400 to-orange-500'
                        }`}></div>
                      </div>
                    )}
                    
                    {/* VS Indicator */}
                    <div className="text-3xl font-bold text-slate-300 mb-2">VS</div>
                    
                    {/* Streak Counter */}
                    <div className="bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-600/50">
                      <div className="text-xs text-amber-300 font-medium">Streak</div>
                      <div className="text-lg font-bold text-amber-400">{gameState.streak}</div>
                    </div>
                    
                    {/* Simplified Impact */}
                    {gameState.showBattleAnimation && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-70 animate-impact-burst"></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enemy Tank (Right) */}
                  <div className="text-center">
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-red-200 mb-1">
                        <span>Enemy HP</span>
                        <span className="font-bold">{gameState.opponentTank.hp}/{gameState.opponentTank.maxHp}</span>
                      </div>
                      <Progress 
                        value={(gameState.opponentTank.hp / gameState.opponentTank.maxHp) * 100} 
                        className={`h-3 bg-slate-700 border border-red-500/30 ${
                          gameState.showHpFlash && gameState.feedbackType === 'correct' ? 'animate-hp-damage-flash' : ''
                        }`}
                      />
                    </div>
                    
                    <div className="relative group">
                      {/* Tank SVG - Enemy (Mirrored) */}
                      <div className={`relative inline-block ${
                        gameState.tankRecoil === 'enemy' ? 'animate-tank-recoil-left' : 
                        gameState.showBattleAnimation && gameState.feedbackType !== 'correct' ? 'animate-villain-attack' : 'animate-villain-idle'
                      }`}>
                        <svg width="80" height="60" viewBox="0 0 80 60" className="filter drop-shadow-lg transform scale-x-[-1]">
                          {/* Tank Body */}
                          <rect x="10" y="30" width="50" height="20" rx="5" fill="url(#enemyGradient)" stroke="#ef4444" strokeWidth="2"/>
                          {/* Tank Turret */}
                          <circle cx="35" cy="35" r="12" fill="url(#enemyTurretGradient)" stroke="#dc2626" strokeWidth="2"/>
                          {/* Tank Cannon */}
                          <rect x="45" y="33" width="25" height="4" rx="2" fill="#dc2626"/>
                          {/* Tank Tracks */}
                          <rect x="8" y="48" width="54" height="6" rx="3" fill="#374151"/>
                          <circle cx="18" cy="51" r="3" fill="#6b7280"/>
                          <circle cx="30" cy="51" r="3" fill="#6b7280"/>
                          <circle cx="42" cy="51" r="3" fill="#6b7280"/>
                          <circle cx="54" cy="51" r="3" fill="#6b7280"/>
                          
                          <defs>
                            <linearGradient id="enemyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ef4444"/>
                              <stop offset="100%" stopColor="#dc2626"/>
                            </linearGradient>
                            <linearGradient id="enemyTurretGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f87171"/>
                              <stop offset="100%" stopColor="#ef4444"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Damage Number Animation */}
                        {gameState.showBattleAnimation && gameState.feedbackType === 'correct' && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-cyan-400 font-bold text-lg animate-damage-pop pointer-events-none">
                            -{gameState.lastDamage}
                          </div>
                        )}
                        
                        {/* Simplified Enemy Muzzle Flash */}
                        {gameState.showBattleAnimation && gameState.feedbackType !== 'correct' && (
                          <div className="absolute top-6 left-0 w-8 h-4 bg-gradient-to-l from-red-400 to-orange-500 rounded-l-full animate-muzzle-flash"></div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <h3 className="text-sm font-bold text-red-300">{currentText.enemyTank}</h3>
                    </div>
                  </div>
                </div>
                
                {/* Screen Shake Effect */}
                {gameState.showBattleAnimation && (
                  <div className="absolute inset-0 animate-screen-shake pointer-events-none"></div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compact Progress Bar */}
        <div className="mb-3">
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-purple-500/30 text-white backdrop-blur-sm">
            <CardContent className="p-2">
              <Progress 
                value={progressPercent} 
                className="h-2 bg-slate-700 border border-purple-500/30"
              />
            </CardContent>
          </Card>
        </div>

        {/* Compact Question Panel */}
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white border border-cyan-500/30 shadow-xl relative overflow-hidden">
          {/* Command Center Background Effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-orange-500/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>
          </div>
          
          <CardHeader className="relative z-10 pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-300 font-medium text-sm">
                  Q{gameState.currentQuestion + 1}
                </span>
              </div>
              <Badge className={`px-2 py-0.5 text-xs ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-300 border-green-500/50' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' :
                'bg-red-500/20 text-red-300 border-red-500/50'
              } border`}>
                {currentQuestion.difficulty.toUpperCase()}
              </Badge>
            </CardTitle>
            
            {/* Compact Question Display */}
            <div className="bg-slate-800/60 border border-slate-600/50 rounded-lg p-3 mt-2">
              <div className="text-white text-base leading-snug font-medium">
                {questionData.question}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10 pt-0">
            {/* Compact Battle Options Grid */}
            <div className="mb-4">
              <div className="text-slate-400 text-xs uppercase tracking-wide mb-2 flex items-center">
                <Target className="h-3 w-3 mr-1" />
                Select Answer
              </div>
              <div className="grid grid-cols-1 gap-2">
                {questionData.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => setGameState(prev => ({ ...prev, selectedOption: index }))}
                    variant="outline"
                    className={`
                      h-auto p-3 text-left justify-start whitespace-normal transition-all duration-300 relative group text-sm
                      ${gameState.selectedOption === index 
                        ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' 
                        : 'bg-slate-800/40 border-slate-600/50 text-slate-200 hover:bg-slate-700/60 hover:border-slate-500 hover:text-white'
                      }
                    `}
                    disabled={gameState.showFeedback || gameState.isPaused}
                  >
                    {/* Option Letter Badge */}
                    <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 flex-shrink-0 font-bold text-xs ${
                      gameState.selectedOption === index
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    
                    {/* Option Text */}
                    <span className="flex-1">{option}</span>
                    
                    {/* Selection Indicator */}
                    {gameState.selectedOption === index && (
                      <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/50 to-blue-500/50 rounded-lg -z-10 animate-pulse"></div>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Compact Feedback */}
            {gameState.showFeedback && (
              <div className={`mb-2 p-2 rounded border-l-4 ${
                gameState.feedbackType === 'correct' ? 'bg-green-500/20 border-green-400 text-green-300' :
                gameState.feedbackType === 'incorrect' ? 'bg-red-500/20 border-red-400 text-red-300' :
                'bg-yellow-500/20 border-yellow-400 text-yellow-300'
              }`}>
                <div className="flex items-center space-x-2">
                  {gameState.feedbackType === 'correct' ? (
                    <Target className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span className="font-bold text-sm">
                    {gameState.feedbackMessage}
                  </span>
                </div>
                {questionData.explanation && (
                  <p className="text-xs mt-1 opacity-90">
                    <strong>{currentText.explanation}:</strong> {questionData.explanation}
                  </p>
                )}
              </div>
            )}

            {/* Compact Control Panel */}
            <div className="bg-slate-800/40 border border-slate-600/50 rounded-lg p-2">
              <div className="flex space-x-2">
                {/* Primary Fire Button */}
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={gameState.selectedOption === null || gameState.showFeedback || gameState.isPaused}
                  className={`flex-1 relative overflow-hidden transition-all duration-300 py-2 ${
                    gameState.selectedOption !== null && !gameState.showFeedback && !gameState.isPaused
                      ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white border-0 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50'
                      : 'bg-slate-700 text-slate-400 border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-center relative z-10">
                    <Flame className="h-4 w-4 mr-1" />
                    <span className="font-bold text-sm">{currentText.submit}</span>
                  </div>
                  
                  {/* Fire Button Effect */}
                  {gameState.selectedOption !== null && !gameState.showFeedback && !gameState.isPaused && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-brass-shimmer"></div>
                  )}
                </Button>
                
                {/* Secondary Controls */}
                <Button
                  onClick={gameState.isPaused ? resumeGame : pauseGame}
                  variant="outline"
                  size="sm"
                  className="bg-slate-800/60 border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white px-2"
                  disabled={gameState.showFeedback}
                >
                  {gameState.isPaused ? (
                    <Zap className="h-3 w-3" />
                  ) : (
                    <Pause className="h-3 w-3" />
                  )}
                </Button>
                
                <Button
                  onClick={resetGame}
                  variant="outline"
                  size="sm"
                  className="bg-slate-800/60 border-slate-500 text-slate-300 hover:bg-slate-700 hover:text-white px-2"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}