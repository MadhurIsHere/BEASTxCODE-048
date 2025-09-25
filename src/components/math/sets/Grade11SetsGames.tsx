import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ArrowLeft, Play, Star, Trophy, Target, Zap, Timer, Globe } from 'lucide-react';
import { TileMasterGame } from './TileMasterGame';
import { TankStarsGame } from './TankStarsGame';
import { TankStarsMainMenu } from './TankStarsMainMenu';
import { SetsLevelSelect } from './SetsLevelSelect';
import type { Language } from '../../../types/onboarding';

interface Grade11SetsGamesProps {
  language: Language;
  onBack: () => void;
}

type GameMode = 'tile-master' | 'tank-stars' | null;
type CurrentScreen = 'landing' | 'tank-menu' | 'level-select' | 'game-play';

interface PlayerProgress {
  tileMaster: {
    levelsCompleted: boolean[];
    scores: number[];
    badges: ('gold' | 'silver' | 'bronze' | null)[];
    totalScore: number;
  };
  tankStars: {
    levelsCompleted: boolean[];
    scores: number[];
    badges: ('gold' | 'silver' | 'bronze' | null)[];
    totalScore: number;
  };
}

// Initialize default progress state
const getInitialProgress = (): PlayerProgress => ({
  tileMaster: {
    levelsCompleted: [false, false, false, false, false],
    scores: [0, 0, 0, 0, 0],
    badges: [null, null, null, null, null],
    totalScore: 0
  },
  tankStars: {
    levelsCompleted: [false, false, false, false, false],
    scores: [0, 0, 0, 0, 0],
    badges: [null, null, null, null, null],
    totalScore: 0
  }
});

export function Grade11SetsGames({ language, onBack }: Grade11SetsGamesProps) {
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('landing');
  const [selectedGame, setSelectedGame] = useState<GameMode>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(() => getInitialProgress());

  const texts = {
    en: {
      title: "Sets - Interactive Quiz Games",
      subtitle: "Master Set Theory through engaging game challenges",
      tileMasterTitle: "Tile Master",
      tileMasterDesc: "Match tiles by solving set theory problems",
      tileMasterFeatures: ["6×4 Tile Grid", "Time Bonuses", "Pattern Matching"],
      tankStarsTitle: "Tank Stars",
      tankStarsDesc: "Battle through set theory with tank combat",
      tankStarsFeatures: ["Strategic Combat", "Health System", "Progressive Difficulty"],
      getStarted: "Get Started",
      backToUnit: "Back to Unit",
      level: "Level",
      completed: "Completed",
      score: "Score",
      badge: "Badge",
      totalProgress: "Total Progress"
    },
    hi: {
      title: "सेट - इंटरैक्टिव क्विज गेम्स",
      subtitle: "आकर्षक गेम चुनौतियों के माध्यम से सेट सिद्धांत में महारत हासिल करें",
      tileMasterTitle: "टाइल मास्टर",
      tileMasterDesc: "सेट सिद्धांत की समस्याओं को हल करके टाइलों का मिलान करें",
      tileMasterFeatures: ["6×4 टाइल ग्रिड", "समय बोनस", "पैटर्न मैचिंग"],
      tankStarsTitle: "टैंक स्टार्स",
      tankStarsDesc: "टैंक युद्ध के साथ सेट सिद्धांत के माध्यम से लड़ाई",
      tankStarsFeatures: ["रणनीतिक युद्ध", "स्वास्थ्य प्रणाली", "प्रगतिशील कठिनाई"],
      getStarted: "शुरू करें",
      backToUnit: "यूनिट में वापस",
      level: "स्तर",
      completed: "पूर्ण",
      score: "स्कोर",
      badge: "बैज",
      totalProgress: "कुल प्रगति"
    },
    or: {
      title: "ସେଟ୍ - ଇଣ୍ଟରାକ୍ଟିଭ କୁଇଜ୍ ଗେମ୍ସ",
      subtitle: "ଆକର୍ଷକ ଖେଳ ଚ୍ୟାଲେଞ୍ଜ ମାଧ୍ୟମରେ ସେଟ୍ ସିଦ୍ଧାନ୍ତରେ ପାରଦର୍ଶୀତା ହାସଲ କରନ୍ତୁ",
      tileMasterTitle: "ଟାଇଲ୍ ମାଷ୍ଟର",
      tileMasterDesc: "ସେଟ୍ ସିଦ୍ଧାନ୍ତ ସମସ୍ୟାର ସମାଧାନ କରି ଟାଇଲଗୁଡ଼ିକ ମେଳାନ୍ତୁ",
      tileMasterFeatures: ["6×4 ଟାଇଲ୍ ଗ୍ରିଡ୍", "ସମୟ ବୋନସ୍", "ପ୍ୟାଟର୍ନ ମେଚିଂ"],
      tankStarsTitle: "ଟ୍ୟାଙ୍କ ଷ୍ଟାର୍ସ",
      tankStarsDesc: "ଟ୍ୟାଙ୍କ ଯୁଦ୍ଧ ସହିତ ସେଟ୍ ସିଦ୍ଧାନ୍ତ ମାଧ୍ୟମରେ ଯୁଦ୍ଧ",
      tankStarsFeatures: ["ରଣନୀତିକ ଯୁଦ୍ଧ", "ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଣାଳୀ", "ପ୍ରଗତିଶୀଳ କଠିନତା"],
      getStarted: "ଆରମ୍ଭ କରନ୍ତୁ",
      backToUnit: "ୟୁନିଟ୍‌କୁ ଫେରନ୍ତୁ",
      level: "ସ୍ତର",
      completed: "ସମ୍ପୂର୍ଣ୍ଣ",
      score: "ସ୍କୋର",
      badge: "ବ୍ୟାଜ୍",
      totalProgress: "ମୋଟ ପ୍ରଗତି"
    }
  };

  const currentText = texts[language];

  const handleGameSelect = (gameMode: GameMode) => {
    setSelectedGame(gameMode);
    if (gameMode === 'tank-stars') {
      setCurrentScreen('tank-menu');
    } else {
      setCurrentScreen('level-select');
    }
  };

  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level);
    setCurrentScreen('game-play');
  };

  const handleGameComplete = (score: number, accuracy: number, level: number) => {
    if (!selectedGame) return;
    
    const gameKey = selectedGame === 'tile-master' ? 'tileMaster' : 'tankStars';
    
    // Determine badge based on accuracy
    let badge: 'gold' | 'silver' | 'bronze' | null = null;
    if (accuracy >= 90) badge = 'gold';
    else if (accuracy >= 75) badge = 'silver';
    else if (accuracy >= 60) badge = 'bronze';

    // Update progress
    setPlayerProgress(prev => {
      if (!prev || !prev[gameKey]) return prev;
      
      const updated = { ...prev };
      const levelIndex = level - 1;
      
      if (levelIndex >= 0 && levelIndex < 5) {
        updated[gameKey].levelsCompleted[levelIndex] = true;
        updated[gameKey].scores[levelIndex] = Math.max(score, updated[gameKey].scores[levelIndex]);
        updated[gameKey].badges[levelIndex] = badge;
        updated[gameKey].totalScore = updated[gameKey].scores.reduce((sum, s) => sum + s, 0);
      }
      
      return updated;
    });

    // Return to level select
    setCurrentScreen('level-select');
  };

  const handleBackToLevelSelect = () => {
    setCurrentScreen('level-select');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
    setSelectedGame(null);
  };

  const handleTankMenuToLevelSelect = () => {
    setCurrentScreen('level-select');
  };

  const handleBackToTankMenu = () => {
    setCurrentScreen('tank-menu');
  };

  const getOverallProgress = () => {
    if (!playerProgress?.tileMaster?.levelsCompleted || !playerProgress?.tankStars?.levelsCompleted) {
      return 0;
    }
    const totalLevels = 10; // 5 levels × 2 games
    const completedLevels = 
      playerProgress.tileMaster.levelsCompleted.filter(Boolean).length +
      playerProgress.tankStars.levelsCompleted.filter(Boolean).length;
    return (completedLevels / totalLevels) * 100;
  };

  const getTotalScore = () => {
    if (!playerProgress?.tileMaster || !playerProgress?.tankStars) {
      return 0;
    }
    return playerProgress.tileMaster.totalScore + playerProgress.tankStars.totalScore;
  };

  const getTotalBadges = () => {
    if (!playerProgress?.tileMaster?.badges || !playerProgress?.tankStars?.badges) {
      return { gold: 0, silver: 0, bronze: 0 };
    }
    const allBadges = [
      ...playerProgress.tileMaster.badges,
      ...playerProgress.tankStars.badges
    ].filter(Boolean);
    return {
      gold: allBadges.filter(b => b === 'gold').length,
      silver: allBadges.filter(b => b === 'silver').length,
      bronze: allBadges.filter(b => b === 'bronze').length
    };
  };

  // Safety check for initialization
  if (!playerProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing games...</p>
        </div>
      </div>
    );
  }

  // Render based on current screen
  if (currentScreen === 'game-play' && selectedGame) {
    if (selectedGame === 'tile-master') {
      return (
        <TileMasterGame
          language={language}
          level={selectedLevel}
          onComplete={handleGameComplete}
          onBack={handleBackToLevelSelect}
        />
      );
    } else if (selectedGame === 'tank-stars') {
      return (
        <TankStarsGame
          language={language}
          level={selectedLevel}
          onComplete={handleGameComplete}
          onBack={handleBackToLevelSelect}
        />
      );
    }
  }

  if (currentScreen === 'tank-menu' && selectedGame === 'tank-stars') {
    return (
      <TankStarsMainMenu
        language={language}
        onStartGame={handleTankMenuToLevelSelect}
        onBack={handleBackToLanding}
      />
    );
  }

  if (currentScreen === 'level-select' && selectedGame) {
    const gameProgress = selectedGame === 'tile-master' ? playerProgress?.tileMaster : playerProgress?.tankStars;
    
    if (!gameProgress) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading game data...</p>
          </div>
        </div>
      );
    }
    
    const backHandler = selectedGame === 'tank-stars' ? handleBackToTankMenu : handleBackToLanding;
    
    return (
      <SetsLevelSelect
        language={language}
        gameMode={selectedGame}
        playerProgress={gameProgress}
        onLevelSelect={handleLevelSelect}
        onBack={backHandler}
      />
    );
  }

  // Landing screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="px-3 md:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-indigo-400/30 bg-indigo-500/20 text-white hover:bg-indigo-400/30 hover:border-indigo-300/50 transition-all duration-300 backdrop-blur-sm shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">{currentText.backToUnit}</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg md:text-2xl font-bold truncate">
                  {currentText.title}
                </h1>
                <p className="text-indigo-200 text-xs md:text-sm truncate">
                  {currentText.subtitle}
                </p>
              </div>
            </div>

            {/* Compact Language Selector */}
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded px-2 py-1 border border-white/20 shrink-0">
              <Globe className="h-3 w-3 text-indigo-200" />
              <span className="text-xs font-medium text-white">
                {language === 'en' ? 'EN' : language === 'hi' ? 'हि' : 'ଓଡ଼'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-3 md:p-4 space-y-4">
        {/* Compact Progress Overview */}
        <Card className="bg-gradient-to-r from-coral-50 to-teal-50 border-coral-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-5 w-5 text-coral-500" />
              <h3 className="font-medium text-indigo-900">{currentText.totalProgress}</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-indigo-600">
                  {Math.round(getOverallProgress())}%
                </div>
                <p className="text-indigo-700 text-xs">Overall</p>
                <Progress value={getOverallProgress()} className="mt-1 h-2" />
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-coral-500">
                  {getTotalScore()}
                </div>
                <p className="text-coral-700 text-xs">{currentText.score}</p>
              </div>
              <div className="flex justify-center gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{getTotalBadges().gold}</div>
                  <div className="text-yellow-700 text-xs">G</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-500">{getTotalBadges().silver}</div>
                  <div className="text-gray-600 text-xs">S</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-600">{getTotalBadges().bronze}</div>
                  <div className="text-amber-700 text-xs">B</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-teal-500">
                  {playerProgress.tileMaster.levelsCompleted.filter(Boolean).length + 
                   playerProgress.tankStars.levelsCompleted.filter(Boolean).length}/10
                </div>
                <p className="text-teal-700 text-xs">Levels</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Game Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tile Master Game */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-lg text-blue-900 truncate">
                    {currentText.tileMasterTitle}
                  </h3>
                  <p className="text-blue-700 text-sm mt-1 line-clamp-2">
                    {currentText.tileMasterDesc}
                  </p>
                </div>
              </div>

              <div className="bg-blue-100/50 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-blue-800 text-sm font-medium">Progress</span>
                  <span className="text-blue-600 text-sm">
                    {playerProgress.tileMaster.levelsCompleted.filter(Boolean).length}/5
                  </span>
                </div>
                <Progress 
                  value={(playerProgress.tileMaster.levelsCompleted.filter(Boolean).length / 5) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between items-center mt-1 text-xs">
                  <span className="text-blue-700">Best: {Math.max(...playerProgress.tileMaster.scores)}</span>
                  <div className="flex gap-1">
                    {playerProgress.tileMaster.badges.map((badge, i) => (
                      <div key={i} className="w-3 h-3">
                        {badge === 'gold' && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                        {badge === 'silver' && <Star className="w-3 h-3 text-gray-400 fill-current" />}
                        {badge === 'bronze' && <Star className="w-3 h-3 text-amber-600 fill-current" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleGameSelect('tile-master')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white h-9"
              >
                <Play className="h-4 w-4 mr-2" />
                {currentText.getStarted}
              </Button>
            </CardContent>
          </Card>

          {/* Tank Stars Game */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-lg text-purple-900 truncate">
                    {currentText.tankStarsTitle}
                  </h3>
                  <p className="text-purple-700 text-sm mt-1 line-clamp-2">
                    {currentText.tankStarsDesc}
                  </p>
                </div>
              </div>

              <div className="bg-purple-100/50 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-purple-800 text-sm font-medium">Progress</span>
                  <span className="text-purple-600 text-sm">
                    {playerProgress.tankStars.levelsCompleted.filter(Boolean).length}/5
                  </span>
                </div>
                <Progress 
                  value={(playerProgress.tankStars.levelsCompleted.filter(Boolean).length / 5) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between items-center mt-1 text-xs">
                  <span className="text-purple-700">Best: {Math.max(...playerProgress.tankStars.scores)}</span>
                  <div className="flex gap-1">
                    {playerProgress.tankStars.badges.map((badge, i) => (
                      <div key={i} className="w-3 h-3">
                        {badge === 'gold' && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                        {badge === 'silver' && <Star className="w-3 h-3 text-gray-400 fill-current" />}
                        {badge === 'bronze' && <Star className="w-3 h-3 text-amber-600 fill-current" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleGameSelect('tank-stars')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-9"
              >
                <Play className="h-4 w-4 mr-2" />
                {currentText.getStarted}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Compact Instructions */}
        <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
          <CardContent className="p-3 md:p-4">
            <h3 className="font-medium text-teal-900 mb-3 text-center">How to Play</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-teal-800 mb-2">Game Mechanics:</h4>
                <ul className="text-teal-700 space-y-1 text-xs">
                  <li>• 5 levels with increasing difficulty</li>
                  <li>• 6 questions per level</li>
                  <li>• Timed: 30s/45s/60s</li>
                  <li>• Streak bonuses</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-teal-800 mb-2">Scoring:</h4>
                <ul className="text-teal-700 space-y-1 text-xs">
                  <li>• Base: 10 points per correct</li>
                  <li>• Streak: +5 points bonus</li>
                  <li>• Gold: ≥90% accuracy</li>
                  <li>• Silver: ≥75% accuracy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}