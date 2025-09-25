import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, Target, Clock, Zap, Star, CheckCircle2, X, Globe, Trophy, Flame, Heart } from 'lucide-react';
import { getQuestionsForLevel, type QuestionData } from './SetsQuestionBank';
import type { Language } from '../../../types/onboarding';

interface TileMasterGameProps {
  language: Language;
  level: number;
  onComplete: (score: number, accuracy: number, level: number) => void;
  onBack: () => void;
}

interface TileData {
  id: string;
  value: string;
  color: string;
  matched: boolean;
  isNew: boolean;
}

interface GameState {
  currentQuestion: number;
  score: number;
  streak: number;
  lives: number;
  timeRemaining: number;
  isPlaying: boolean;
  isPaused: boolean;
  showResult: boolean;
  answers: boolean[];
  selectedOption: number | null;
  tiles: TileData[];
  showFeedback: boolean;
  feedbackMessage: string;
  feedbackType: 'correct' | 'incorrect' | 'timeout';
}

const TILE_COLORS = [
  'from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-yellow-500 to-yellow-600', 'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600', 'from-indigo-500 to-indigo-600', 'from-red-500 to-red-600', 'from-teal-500 to-teal-600',
  'from-orange-500 to-orange-600', 'from-cyan-500 to-cyan-600', 'from-lime-500 to-lime-600', 'from-violet-500 to-violet-600'
];

export function TileMasterGame({ language, level, onComplete, onBack }: TileMasterGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    streak: 0,
    lives: 3,
    timeRemaining: 0,
    isPlaying: false,
    isPaused: false,
    showResult: false,
    answers: [],
    selectedOption: null,
    tiles: [],
    showFeedback: false,
    feedbackMessage: '',
    feedbackType: 'correct'
  });

  const questions = getQuestionsForLevel(level);
  const currentQuestion = questions[gameState.currentQuestion];
  const timerRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();
  const [selectionAnimation, setSelectionAnimation] = useState<{ [key: number]: boolean }>({});

  const texts = {
    en: {
      title: `Tile Master - Level ${level}`,
      subtitle: 'Match tiles by answering set theory questions correctly',
      question: 'Question',
      of: 'of',
      score: 'Score',
      streak: 'Streak',
      lives: 'Lives',
      timeLeft: 'Time Left',
      submit: 'Submit Answer',
      pause: 'Pause',
      resume: 'Resume',
      reset: 'Reset Game',
      backToLevels: 'Back to Levels',
      correct: 'Correct!',
      incorrect: 'Incorrect!',
      timeUp: 'Time\'s up!',
      gameOver: 'Game Over',
      levelComplete: 'Level Complete!',
      finalScore: 'Final Score',
      accuracy: 'Accuracy',
      timeBonus: 'Time Bonus',
      streakBonus: 'Streak Bonus',
      tilesMatched: 'Tiles Matched',
      playAgain: 'Play Again',
      nextLevel: 'Next Level',
      explanation: 'Explanation'
    },
    hi: {
      title: `टाइल मास्टर - स्तर ${level}`,
      subtitle: 'सेट सिद्धांत के प्रश्नों का सही उत्तर देकर टाइलों का मिलान करें',
      question: 'प्रश्न',
      of: 'का',
      score: 'स्कोर',
      streak: 'श्रृंखला',
      lives: 'जीवन',
      timeLeft: 'शेष समय',
      submit: 'उत्तर जमा करें',
      pause: 'रोकें',
      resume: 'जारी रखें',
      reset: 'गेम रीसेट करें',
      backToLevels: 'स्तरों में वापस',
      correct: 'सही!',
      incorrect: 'गलत!',
      timeUp: 'समय समाप्त!',
      gameOver: 'खेल समाप्त',
      levelComplete: 'स्तर पूर्ण!',
      finalScore: 'अंतिम स्कोर',
      accuracy: 'सटीकता',
      timeBonus: 'समय बोनस',
      streakBonus: 'श्रृंखला बोनस',
      tilesMatched: 'टाइल मिलान',
      playAgain: 'फिर खेलें',
      nextLevel: 'अगला स्तर',
      explanation: 'व्याख्या'
    },
    or: {
      title: `ଟାଇଲ୍ ମାଷ୍ଟର - ସ୍ତର ${level}`,
      subtitle: 'ସେଟ୍ ସିଦ୍ଧାନ୍ତ ପ୍ରଶ୍ନର ସଠିକ୍ ଉତ୍ତର ଦେଇ ଟାଇଲଗୁଡ଼ିକ ମେଳାନ୍ତୁ',
      question: 'ପ୍ରଶ୍ନ',
      of: 'ର',
      score: 'ସ୍କୋର',
      streak: 'ଶୃଙ୍ଖଳା',
      lives: 'ଜୀବନ',
      timeLeft: 'ଅବଶିଷ୍ଟ ସମୟ',
      submit: 'ଉତ୍ତର ଦାଖଲ କରନ୍ତୁ',
      pause: 'ବିରାମ',
      resume: 'ଆରମ୍ଭ',
      reset: 'ଖେଳ ରିସେଟ୍ କରନ୍ତୁ',
      backToLevels: 'ସ୍ତରକୁ ଫେରନ୍ତୁ',
      correct: 'ସଠିକ୍!',
      incorrect: 'ଭୁଲ!',
      timeUp: 'ସମୟ ସମାପ୍ତ!',
      gameOver: 'ଖେଳ ସମାପ୍ତ',
      levelComplete: 'ସ୍ତର ସମ୍ପୂର୍ଣ୍ଣ!',
      finalScore: 'ଅନ୍ତିମ ସ୍କୋର',
      accuracy: 'ସଠିକତା',
      timeBonus: 'ସମୟ ବୋନସ୍',
      streakBonus: 'ଶୃଙ୍ଖଳା ବୋନସ୍',
      tilesMatched: 'ଟାଇଲ୍ ମେଳାଣ',
      playAgain: 'ପୁନର୍ବାର ଖେଳନ୍ତୁ',
      nextLevel: 'ପରବର୍ତ୍ତୀ ସ୍ତର',
      explanation: 'ବ୍ୟାଖ୍ୟା'
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

  const initializeGame = () => {
    const initialTiles = generateTiles(24); // 6×4 grid
    setGameState(prev => ({
      ...prev,
      tiles: initialTiles,
      timeRemaining: currentQuestion?.timeLimit || 30,
      isPlaying: true
    }));
    startTimer();
  };

  const generateTiles = (count: number): TileData[] => {
    const tiles: TileData[] = [];
    const pairCount = Math.floor(count / 2);
    
    // Create pairs of tiles
    for (let i = 0; i < pairCount; i++) {
      const color = TILE_COLORS[i % TILE_COLORS.length];
      const value = `T${i + 1}`;
      
      tiles.push(
        { id: `${i}a`, value, color, matched: false, isNew: false },
        { id: `${i}b`, value, color, matched: false, isNew: false }
      );
    }
    
    // Shuffle tiles
    return tiles.sort(() => Math.random() - 0.5);
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
    
    setGameState(prev => ({
      ...prev,
      showFeedback: true,
      feedbackMessage: currentText.timeUp,
      feedbackType: 'timeout',
      lives: prev.lives - 1,
      streak: 0
    }));

    // Add penalty tiles
    addPenaltyTiles();
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const handleOptionSelect = (index: number) => {
    if (gameState.showFeedback || gameState.isPaused) return;
    
    // Trigger selection animation
    setSelectionAnimation(prev => ({ ...prev, [index]: true }));
    
    setTimeout(() => {
      setSelectionAnimation(prev => ({ ...prev, [index]: false }));
    }, 300);
    
    setGameState(prev => ({ ...prev, selectedOption: index }));
  };

  const handleAnswerSubmit = () => {
    if (gameState.selectedOption === null) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    
    const isCorrect = gameState.selectedOption === currentQuestion.lang[language].answerIndex;
    const newStreak = isCorrect ? gameState.streak + 1 : 0;
    const basePoints = isCorrect ? 10 : 0;
    const streakBonus = newStreak * 5;
    const points = basePoints + streakBonus;
    
    setGameState(prev => ({
      ...prev,
      showFeedback: true,
      feedbackMessage: isCorrect ? currentText.correct : currentText.incorrect,
      feedbackType: isCorrect ? 'correct' : 'incorrect',
      score: prev.score + points,
      streak: newStreak,
      lives: isCorrect ? prev.lives : prev.lives - 1,
      answers: [...prev.answers, isCorrect]
    }));

    if (isCorrect) {
      matchTiles();
      // Time bonus for streak
      if (newStreak >= 3) {
        setGameState(prev => ({
          ...prev,
          timeRemaining: Math.min(prev.timeRemaining + 5, currentQuestion.timeLimit)
        }));
      }
    } else {
      addPenaltyTiles();
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const matchTiles = () => {
    setGameState(prev => {
      const unmatchedTiles = prev.tiles.filter(tile => !tile.matched);
      if (unmatchedTiles.length >= 2) {
        // Match one pair
        const tileToMatch = unmatchedTiles[0];
        const matchingTile = unmatchedTiles.find(t => 
          t.value === tileToMatch.value && t.id !== tileToMatch.id
        );
        
        if (matchingTile) {
          const newTiles = prev.tiles.map(tile => {
            if (tile.id === tileToMatch.id || tile.id === matchingTile.id) {
              return { ...tile, matched: true };
            }
            return tile;
          });
          
          return { ...prev, tiles: newTiles };
        }
      }
      return prev;
    });
  };

  const addPenaltyTiles = () => {
    setGameState(prev => {
      const newTiles = [...prev.tiles];
      const unmatchedCount = newTiles.filter(t => !t.matched).length;
      
      if (unmatchedCount < 24) { // Max grid size
        // Add 2 random new tiles
        for (let i = 0; i < 2; i++) {
          const randomIndex = Math.floor(Math.random() * TILE_COLORS.length);
          const color = TILE_COLORS[randomIndex];
          const value = `P${Date.now()}-${i}`;
          
          newTiles.push({
            id: `penalty-${Date.now()}-${i}`,
            value,
            color,
            matched: false,
            isNew: true
          });
        }
      }
      
      // Shuffle unmatched tiles
      const matchedTiles = newTiles.filter(t => t.matched);
      const unmatchedTiles = newTiles.filter(t => !t.matched).sort(() => Math.random() - 0.5);
      
      return { ...prev, tiles: [...matchedTiles, ...unmatchedTiles] };
    });
  };

  const nextQuestion = () => {
    setGameState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      selectedOption: null,
      showFeedback: false,
      timeRemaining: questions[prev.currentQuestion + 1]?.timeLimit || 30
    }));

    if (gameState.currentQuestion + 1 >= questions.length) {
      endGame();
      return;
    }

    if (gameState.lives <= 0) {
      endGame();
      return;
    }

    startTimer();
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const correctAnswers = gameState.answers.filter(Boolean).length;
    const accuracy = (correctAnswers / gameState.answers.length) * 100;
    
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
      lives: 3,
      timeRemaining: questions[0]?.timeLimit || 30,
      isPlaying: true,
      isPaused: false,
      showResult: false,
      answers: [],
      selectedOption: null,
      tiles: generateTiles(24),
      showFeedback: false,
      feedbackMessage: '',
      feedbackType: 'correct'
    });
    startTimer();
  };

  if (gameState.showResult) {
    const correctAnswers = gameState.answers.filter(Boolean).length;
    const accuracy = Math.round((correctAnswers / gameState.answers.length) * 100);
    const tilesMatched = gameState.tiles.filter(t => t.matched).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow delay-1000"></div>
        </div>
        
        <Card className="max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 animate-bounce-in relative z-10">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 animate-treasure-shine">
              {accuracy >= 50 ? <Trophy className="h-10 w-10 text-white" /> : <X className="h-10 w-10 text-white" />}
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              {accuracy >= 50 ? currentText.levelComplete : currentText.gameOver}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-4xl font-bold text-purple-300 mb-1">{gameState.score}</div>
                <p className="text-purple-200 text-sm">{currentText.finalScore}</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-4xl font-bold text-cyan-300 mb-1">{accuracy}%</div>
                <p className="text-cyan-200 text-sm">{currentText.accuracy}</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-yellow-300 mb-1">{gameState.streak}</div>
                <p className="text-yellow-200 text-sm">Max {currentText.streak}</p>
              </div>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-3xl font-bold text-green-300 mb-1">{tilesMatched}</div>
                <p className="text-green-200 text-sm">{currentText.tilesMatched}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button
                onClick={resetGame}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-3 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Play className="h-5 w-5 mr-2" />
                {currentText.playAgain}
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10 font-bold py-3 text-lg transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20">
          <CardContent className="text-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Loading questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questionData = currentQuestion.lang[language];
  const progressPercent = ((gameState.currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
      </div>

      {/* Unified Status Bar */}
      <header className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">{currentText.title}</h1>
                <p className="text-purple-200 text-xs sm:text-sm truncate hidden sm:block">{currentText.subtitle}</p>
              </div>
            </div>
            
            {/* Mobile-Optimized Stats */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
              <div className="flex items-center gap-1 text-white">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                <span className="text-sm sm:text-base font-bold">{gameState.score}</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                <span className="text-sm sm:text-base font-bold">{gameState.streak}</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${gameState.lives <= 1 ? 'text-red-400 animate-pulse' : 'text-red-500'}`} />
                <span className="text-sm sm:text-base font-bold">{gameState.lives}</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <Clock className={`h-4 w-4 sm:h-5 sm:w-5 ${gameState.timeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
                <span className="text-sm sm:text-base font-bold">{gameState.timeRemaining}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-white">
                <Globe className="h-4 w-4 text-purple-300" />
                <span className="text-xs lg:text-sm">
                  {language === 'en' ? 'EN' : language === 'hi' ? 'हि' : 'ଓଡ଼'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Mobile-Optimized Progress Bar */}
          <div className="mt-2 sm:mt-3">
            <div className="flex justify-between items-center mb-1 sm:mb-2">
              <span className="text-purple-200 text-xs sm:text-sm font-medium truncate">
                <span className="hidden sm:inline">{currentText.question} </span>
                <span>{gameState.currentQuestion + 1}</span>
                <span className="hidden sm:inline"> {currentText.of} </span>
                <span className="sm:hidden">/</span>
                <span>{questions.length}</span>
              </span>
              <span className="text-purple-200 text-xs sm:text-sm font-bold ml-2">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 lg:p-6 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Question Panel - Glassmorphism Design */}
          <div className="xl:col-span-2">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-2xl font-bold text-white">
                    {currentText.question} {gameState.currentQuestion + 1}
                  </CardTitle>
                  <Badge className={`px-3 py-1 text-sm font-bold ${
                    currentQuestion.difficulty === 'easy' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {currentQuestion.difficulty.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-white text-xl leading-relaxed font-medium">
                  {questionData.question}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questionData.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      variant="outline"
                      className={`
                        h-auto p-6 text-left justify-start whitespace-normal transition-all duration-300 relative overflow-hidden
                        ${gameState.selectedOption === index 
                          ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-purple-400 shadow-lg shadow-purple-500/25 scale-105' 
                          : 'bg-white/5 hover:bg-white/10 border-white/20 text-white hover:border-white/40 hover:scale-102'
                        }
                        ${selectionAnimation[index] ? 'animate-quiz-option-select' : ''}
                      `}
                      disabled={gameState.showFeedback || gameState.isPaused}
                    >
                      {/* Shimmer Effect */}
                      {gameState.selectedOption === index && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                      )}
                      <span className="font-bold text-lg mr-4 text-purple-300">
                        {String.fromCharCode(65 + index)})
                      </span>
                      <span className="font-medium">{option}</span>
                    </Button>
                  ))}
                </div>

                {/* Enhanced Feedback */}
                {gameState.showFeedback && (
                  <Card className={`transition-all duration-500 ${
                    gameState.feedbackType === 'correct' 
                      ? 'bg-green-500/20 border-green-400/50 animate-pulse-success' 
                      : gameState.feedbackType === 'incorrect' 
                      ? 'bg-red-500/20 border-red-400/50 animate-shake-error' 
                      : 'bg-yellow-500/20 border-yellow-400/50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        {gameState.feedbackType === 'correct' ? (
                          <CheckCircle2 className="h-6 w-6 text-green-400 animate-bounce" />
                        ) : (
                          <X className="h-6 w-6 text-red-400 animate-shake" />
                        )}
                        <span className={`font-bold text-lg ${
                          gameState.feedbackType === 'correct' ? 'text-green-300' : 'text-red-300'
                        }`}>
                          {gameState.feedbackMessage}
                        </span>
                      </div>
                      {questionData.explanation && (
                        <p className="text-white/90 font-medium">
                          <strong className="text-purple-300">{currentText.explanation}:</strong> {questionData.explanation}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Enhanced Controls */}
                <div className="flex space-x-4">
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={gameState.selectedOption === null || gameState.showFeedback || gameState.isPaused}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    {/* Button shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
                    <Target className="h-5 w-5 mr-3" />
                    {currentText.submit}
                  </Button>
                  <Button
                    onClick={gameState.isPaused ? resumeGame : pauseGame}
                    variant="outline"
                    disabled={gameState.showFeedback}
                    className="border-white/30 text-white hover:bg-white/10 px-6 py-4 transition-all duration-300 hover:scale-105"
                  >
                    {gameState.isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  </Button>
                  <Button
                    onClick={resetGame}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-6 py-4 transition-all duration-300 hover:scale-105"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tile Grid */}
          <div>
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-center text-xl font-bold mb-2">
                  Tile Grid (6×4)
                </CardTitle>
                <p className="text-purple-200 text-center font-medium">
                  Match tiles by answering correctly!
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-6 gap-2 p-2">
                  {gameState.tiles.slice(0, 24).map((tile, index) => (
                    <div
                      key={tile.id}
                      className={`
                        aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-bold
                        transition-all duration-500 transform hover:scale-110 cursor-pointer
                        ${tile.matched 
                          ? 'bg-green-400/20 border-green-400/50 text-green-300 opacity-80 animate-glow' 
                          : `bg-gradient-to-br ${tile.color} border-white/30 text-white shadow-lg hover:shadow-xl hover:border-white/50`
                        }
                        ${tile.isNew ? 'animate-bounce-in' : ''}
                      `}
                    >
                      {tile.matched ? (
                        <CheckCircle2 className="h-4 w-4 animate-pulse" />
                      ) : (
                        <span className="font-bold drop-shadow-sm">{tile.value}</span>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-medium">Tiles Matched</span>
                    <span className="text-purple-300 font-bold">
                      {gameState.tiles.filter(t => t.matched).length} / {gameState.tiles.length}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-500 ease-out"
                      style={{ width: `${(gameState.tiles.filter(t => t.matched).length / gameState.tiles.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom keyframes for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}