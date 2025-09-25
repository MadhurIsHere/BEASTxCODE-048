import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ArrowLeft, Star, Lock, Play, Target, Zap, Clock } from 'lucide-react';
import type { Language } from '../../../types/onboarding';

interface SetsLevelSelectProps {
  language: Language;
  gameMode: 'tile-master' | 'tank-stars';
  playerProgress: {
    levelsCompleted: boolean[];
    scores: number[];
    badges: ('gold' | 'silver' | 'bronze' | null)[];
    totalScore: number;
  };
  onLevelSelect: (level: number) => void;
  onBack: () => void;
}

interface LevelConfig {
  level: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
  timePerQuestion: number;
  easyPercent: number;
  mediumPercent: number;
  hardPercent: number;
  description: string;
  unlockRequirement?: number; // Previous level completion
}

export function SetsLevelSelect({ 
  language, 
  gameMode, 
  playerProgress, 
  onLevelSelect, 
  onBack 
}: SetsLevelSelectProps) {
  
  const levels: LevelConfig[] = [
    {
      level: 1,
      difficulty: 'Easy',
      questionCount: 6,
      timePerQuestion: 30,
      easyPercent: 100,
      mediumPercent: 0,
      hardPercent: 0,
      description: 'Basic set notation and element membership'
    },
    {
      level: 2,
      difficulty: 'Easy',
      questionCount: 6,
      timePerQuestion: 30,
      easyPercent: 60,
      mediumPercent: 40,
      hardPercent: 0,
      description: 'Union, intersection, and basic operations',
      unlockRequirement: 1
    },
    {
      level: 3,
      difficulty: 'Medium',
      questionCount: 6,
      timePerQuestion: 45,
      easyPercent: 40,
      mediumPercent: 40,
      hardPercent: 20,
      description: 'Set differences and complements',
      unlockRequirement: 2
    },
    {
      level: 4,
      difficulty: 'Medium',
      questionCount: 6,
      timePerQuestion: 45,
      easyPercent: 40,
      mediumPercent: 30,
      hardPercent: 30,
      description: 'Complex operations and functions',
      unlockRequirement: 3
    },
    {
      level: 5,
      difficulty: 'Hard',
      questionCount: 6,
      timePerQuestion: 60,
      easyPercent: 10,
      mediumPercent: 50,
      hardPercent: 40,
      description: 'Advanced set theory and proofs',
      unlockRequirement: 4
    }
  ];

  const texts = {
    en: {
      title: gameMode === 'tile-master' ? 'Tile Master - Level Select' : 'Tank Stars - Level Select',
      subtitle: gameMode === 'tile-master' 
        ? 'Choose your tile-matching challenge level'
        : 'Select your battle difficulty',
      backToGames: 'Back to Games',
      level: 'Level',
      questions: 'questions',
      seconds: 'seconds per question',
      unlocked: 'Unlocked',
      locked: 'Locked',
      completed: 'Completed',
      playLevel: 'Play Level',
      score: 'Score',
      badge: 'Badge',
      difficulty: 'Difficulty',
      timeLimit: 'Time Limit',
      composition: 'Question Mix',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      unlockHint: 'Complete previous level to unlock'
    },
    hi: {
      title: gameMode === 'tile-master' ? 'टाइल मास्टर - स्तर चयन' : 'टैंक स्टार्स - स्तर चयन',
      subtitle: gameMode === 'tile-master' 
        ? 'अपना टाइल-मैचिंग चुनौती स्तर चुनें'
        : 'अपनी लड़ाई की कठिनाई चुनें',
      backToGames: 'गेम्स में वापस',
      level: 'स्तर',
      questions: 'प्रश्न',
      seconds: 'सेकंड प्रति प्रश्न',
      unlocked: 'अनलॉक',
      locked: 'लॉक',
      completed: 'पूर्ण',
      playLevel: 'स्तर खेलें',
      score: 'स्कोर',
      badge: 'बैज',
      difficulty: 'कठिनाई',
      timeLimit: 'समय सीमा',
      composition: 'प्रश्न मिश्रण',
      easy: 'आसान',
      medium: 'मध्यम',
      hard: 'कठिन',
      unlockHint: 'अनलॉक करने के लिए पिछला स्तर पूरा करें'
    },
    or: {
      title: gameMode === 'tile-master' ? 'ଟାଇଲ୍ ମାଷ୍ଟର - ସ୍ତର ଚୟନ' : 'ଟ୍ୟାଙ୍କ ଷ୍ଟାର୍ସ - ସ୍ତର ଚୟନ',
      subtitle: gameMode === 'tile-master' 
        ? 'ଆପଣଙ୍କ ଟାଇଲ୍-ମେଚିଂ ଚ୍ୟାଲେଞ୍ଜ ସ୍ତର ବାଛନ୍ତୁ'
        : 'ଆପଣଙ୍କ ଯୁଦ୍ଧର କଠିନତା ବାଛନ୍ତୁ',
      backToGames: 'ଗେମ୍ସକୁ ଫେରନ୍ତୁ',
      level: 'ସ୍ତର',
      questions: 'ପ୍ରଶ୍ନ',
      seconds: 'ପ୍ରତି ପ୍ରଶ୍ନରେ ସେକେଣ୍ଡ',
      unlocked: 'ଅନଲକ୍',
      locked: 'ଲକ୍',
      completed: 'ସମ୍ପୂର୍ଣ୍ଣ',
      playLevel: 'ସ୍ତର ଖେଳନ୍ତୁ',
      score: 'ସ୍କୋର',
      badge: 'ବ୍ୟାଜ୍',
      difficulty: 'କଠିନତା',
      timeLimit: 'ସମୟ ସୀମା',
      composition: 'ପ୍ରଶ୍ନ ମିଶ୍ରଣ',
      easy: 'ସହଜ',
      medium: 'ମଧ୍ୟମ',
      hard: 'କଠିନ',
      unlockHint: 'ଅନଲକ୍ କରିବା ପାଇଁ ପୂର୍ବ ସ୍ତର ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ'
    }
  };

  const currentText = texts[language];

  const isLevelUnlocked = (levelIndex: number): boolean => {
    if (levelIndex === 0) return true; // Level 1 is always unlocked
    return playerProgress.levelsCompleted[levelIndex - 1]; // Previous level must be completed
  };

  const getBadgeIcon = (badge: 'gold' | 'silver' | 'bronze' | null) => {
    if (badge === 'gold') return <Star className="w-5 h-5 text-yellow-500 fill-current" />;
    if (badge === 'silver') return <Star className="w-5 h-5 text-gray-400 fill-current" />;
    if (badge === 'bronze') return <Star className="w-5 h-5 text-amber-600 fill-current" />;
    return null;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getGameThemeColor = () => {
    return gameMode === 'tile-master' 
      ? 'from-blue-500 to-cyan-500' 
      : 'from-purple-500 to-pink-500';
  };

  const getGameThemeColorLight = () => {
    return gameMode === 'tile-master' 
      ? 'from-blue-50 to-cyan-50' 
      : 'from-purple-50 to-pink-50';
  };

  const getGameIcon = () => {
    return gameMode === 'tile-master' ? Target : Zap;
  };

  const GameIcon = getGameIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className={`bg-gradient-to-r ${getGameThemeColor()} text-white`}>
        <div className="px-3 py-4 md:px-6 md:py-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-white/20 text-[rgba(17,181,241,1)] hover:bg-white/10 bg-[rgba(113,87,234,1)] px-2 py-1 md:px-3 md:py-2"
              >
                <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{currentText.backToGames}</span>
              </Button>
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
                  <GameIcon className="h-4 w-4 md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg md:text-2xl font-bold truncate">
                    {currentText.title}
                  </h1>
                  <p className="text-white/80 text-xs md:text-base truncate">
                    {currentText.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="text-center md:text-right flex items-center justify-center md:justify-end space-x-4 md:space-x-0 md:block">
              <div className="text-xl md:text-3xl font-bold">
                {playerProgress.levelsCompleted.filter(Boolean).length}/5
              </div>
              <p className="text-white/80 text-xs md:text-sm">Levels Completed</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {levels.map((level, index) => {
            const isUnlocked = isLevelUnlocked(index);
            const isCompleted = playerProgress.levelsCompleted[index];
            const score = playerProgress.scores[index];
            const badge = playerProgress.badges[index];

            return (
              <Card 
                key={level.level}
                className={`
                  transition-all duration-300 hover:shadow-lg
                  ${isUnlocked ? 'hover:-translate-y-1' : 'opacity-75'}
                  ${isCompleted ? 'ring-2 ring-green-400 ring-opacity-50' : ''}
                  bg-gradient-to-br ${getGameThemeColorLight()} border-2
                  ${isUnlocked ? 'border-opacity-30' : 'border-gray-300'}
                `}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center
                        ${isUnlocked 
                          ? `bg-gradient-to-br ${getGameThemeColor()}` 
                          : 'bg-gray-400'
                        }
                      `}>
                        {isUnlocked ? (
                          <span className="text-white font-bold text-lg">
                            {level.level}
                          </span>
                        ) : (
                          <Lock className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {currentText.level} {level.level}
                        </CardTitle>
                        <Badge className={getDifficultyColor(level.difficulty)}>
                          {level.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Status Icons */}
                    <div className="flex items-center space-x-2">
                      {isCompleted && (
                        <div className="text-green-600">
                          <Play className="h-5 w-5 fill-current" />
                        </div>
                      )}
                      {badge && getBadgeIcon(badge)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {level.description}
                  </p>

                  {/* Level Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span>{level.questionCount} {currentText.questions}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{level.timePerQuestion}{currentText.seconds}</span>
                    </div>
                  </div>

                  {/* Question Composition */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 text-sm">
                      {currentText.composition}:
                    </h4>
                    <div className="flex space-x-1 h-2 rounded-full overflow-hidden bg-gray-200">
                      <div 
                        className="bg-green-400"
                        style={{ width: `${level.easyPercent}%` }}
                      />
                      <div 
                        className="bg-yellow-400"
                        style={{ width: `${level.mediumPercent}%` }}
                      />
                      <div 
                        className="bg-red-400"
                        style={{ width: `${level.hardPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{level.easyPercent}% {currentText.easy}</span>
                      <span>{level.mediumPercent}% {currentText.medium}</span>
                      <span>{level.hardPercent}% {currentText.hard}</span>
                    </div>
                  </div>

                  {/* Score Display (if completed) */}
                  {isCompleted && (
                    <div className="bg-white/60 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">
                          {currentText.score}:
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                          {score}
                        </span>
                      </div>
                      {badge && (
                        <div className="flex items-center justify-center mt-2">
                          {getBadgeIcon(badge)}
                          <span className="ml-2 text-sm text-gray-700 capitalize">
                            {badge} {currentText.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => isUnlocked && onLevelSelect(level.level)}
                    disabled={!isUnlocked}
                    className={`
                      w-full py-3 font-medium transition-all duration-200
                      ${isUnlocked 
                        ? `bg-gradient-to-r ${getGameThemeColor()} hover:shadow-lg text-white` 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {isUnlocked ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {currentText.playLevel} {level.level}
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        {currentText.locked}
                      </>
                    )}
                  </Button>

                  {/* Unlock Hint */}
                  {!isUnlocked && level.unlockRequirement && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {currentText.unlockHint}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tips Card */}
        <Card className="mt-8 max-w-4xl mx-auto bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
          <CardHeader>
            <CardTitle className="text-center text-teal-900">
              Level Selection Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-teal-800">Progression System:</h4>
                <ul className="text-teal-700 space-y-1 text-sm">
                  <li>• Complete levels in order to unlock new challenges</li>
                  <li>• Earn badges based on accuracy: Gold (≥90%), Silver (≥75%), Bronze (≥60%)</li>
                  <li>• Replay levels to improve your score and badge</li>
                  <li>• Question difficulty increases with each level</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-teal-800">Strategy Tips:</h4>
                <ul className="text-teal-700 space-y-1 text-sm">
                  <li>• Build consecutive correct streaks for bonus points</li>
                  <li>• Manage your time - harder questions get more time</li>
                  <li>• Review set theory concepts before attempting higher levels</li>
                  <li>• Practice makes perfect - don't be afraid to retry!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}