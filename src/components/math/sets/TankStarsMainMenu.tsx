import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Settings, Play, ArrowLeft, Volume2, VolumeX, Globe, Shield, Sword, Star, Trophy } from 'lucide-react';
import type { Language } from '../../../types/onboarding';

interface TankStarsMainMenuProps {
  language: Language;
  onStartGame: () => void;
  onBack: () => void;
}

interface GameSettings {
  soundEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function TankStarsMainMenu({ language, onStartGame, onBack }: TankStarsMainMenuProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    difficulty: 'medium'
  });
  const [animationPhase, setAnimationPhase] = useState(0);

  const texts = {
    en: {
      title: 'Tank Quiz',
      subtitle: 'Master Set Theory Through Strategic Tank Combat',
      startGame: 'Start Battle',
      settings: 'Settings',
      back: 'Back',
      soundOn: 'Sound On',
      soundOff: 'Sound Off',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      closeSettings: 'Close',
      playerTank: 'Your Champion',
      enemyTank: 'The Challenger',
      gameFeatures: {
        combat: 'Strategic Combat',
        questions: '30 Unique Questions',
        levels: '5 Difficulty Levels',
        multiplayer: 'Solo Campaign Mode'
      }
    },
    hi: {
      title: 'टैंक क्विज',
      subtitle: 'रणनीतिक टैंक युद्ध के माध्यम से सेट सिद्धांत में महारत हासिल करें',
      startGame: 'युद्ध शुरू करें',
      settings: 'सेटिंग्स',
      back: 'वापस',
      soundOn: 'आवाज़ चालू',
      soundOff: 'आवाज़ बंद',
      difficulty: 'कठिनाई',
      easy: 'आसान',
      medium: 'मध्यम',
      hard: 'कठिन',
      closeSettings: 'बंद करें',
      playerTank: 'आपका चैंपियन',
      enemyTank: 'चुनौती देने वाला',
      gameFeatures: {
        combat: 'रणनीतिक युद्ध',
        questions: '30 अनोखे प्रश्न',
        levels: '5 कठिनाई स्तर',
        multiplayer: 'सोलो अभियान मोड'
      }
    },
    or: {
      title: 'ଟ୍ୟାଙ୍କ କୁଇଜ୍',
      subtitle: 'ରଣନୀତିକ ଟ୍ୟାଙ୍କ ଯୁଦ୍ଧ ମାଧ୍ୟମରେ ସେଟ୍ ସିଦ୍ଧାନ୍ତରେ ପାରଦର୍ଶୀତା ହାସଲ କରନ୍ତୁ',
      startGame: 'ଯୁଦ୍ଧ ଆରମ୍ଭ କରନ୍ତୁ',
      settings: 'ସେଟିଂସ୍',
      back: 'ଫେରନ୍ତୁ',
      soundOn: 'ଧ୍ୱନି ଚାଲୁ',
      soundOff: 'ଧ୍ୱନି ବନ୍ଦ',
      difficulty: 'କଠିନତା',
      easy: 'ସହଜ',
      medium: 'ମଧ୍ୟମ',
      hard: 'କଠିନ',
      closeSettings: 'ବନ୍ଦ କରନ୍ତୁ',
      playerTank: 'ଆପଣଙ୍କ ଚାମ୍ପିଅନ୍',
      enemyTank: 'ଚ୍ୟାଲେଞ୍ଜର୍',
      gameFeatures: {
        combat: 'ରଣନୀତିକ ଯୁଦ୍ଧ',
        questions: '30 ଅନନ୍ୟ ପ୍ରଶ୍ନ',
        levels: '5 କଠିନତା ସ୍ତର',
        multiplayer: 'ସୋଲୋ ଅଭିଯାନ ମୋଡ୍'
      }
    }
  };

  const currentText = texts[language];

  // Animation cycle for tank idle animations
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const handleSoundToggle = () => {
    setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSettings(prev => ({ ...prev, difficulty }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-orange-500/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(79, 70, 229, 0.15) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 md:p-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-cyan-500/30 bg-slate-800/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentText.back}
          </Button>
          
          <div className="flex items-center space-x-3">
            {/* Language Indicator */}
            <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-600/50">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-300">
                {language === 'en' ? 'EN' : language === 'hi' ? 'हि' : 'ଓଡ଼'}
              </span>
            </div>
            
            {/* Settings Button */}
            <Button
              onClick={handleSettingsToggle}
              variant="outline"
              size="sm"
              className="border-slate-600/50 bg-slate-800/50 text-slate-300 hover:bg-slate-700/60 backdrop-blur-sm"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4 animate-pulse-glow">
              {currentText.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              {currentText.subtitle}
            </p>
            
            {/* Game Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                <Shield className="h-3 w-3 mr-1" />
                {currentText.gameFeatures.combat}
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Star className="h-3 w-3 mr-1" />
                {currentText.gameFeatures.questions}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Trophy className="h-3 w-3 mr-1" />
                {currentText.gameFeatures.levels}
              </Badge>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                <Sword className="h-3 w-3 mr-1" />
                {currentText.gameFeatures.multiplayer}
              </Badge>
            </div>
          </div>

          {/* Battle Preview Section */}
          <div className="mb-12">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-cyan-500/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-8 items-center">
                  {/* Player Tank */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-cyan-300 mb-4">{currentText.playerTank}</h3>
                    <div className={`relative mx-auto animate-hero-idle ${animationPhase === 0 ? 'animate-hero-attack' : ''}`}>
                      {/* Player Tank SVG */}
                      <svg width="120" height="90" viewBox="0 0 120 90" className="filter drop-shadow-lg">
                        {/* Tank Body */}
                        <rect x="15" y="45" width="75" height="30" rx="8" fill="url(#playerGradient)" stroke="#3b82f6" strokeWidth="3"/>
                        {/* Tank Turret */}
                        <circle cx="52" cy="55" r="18" fill="url(#playerTurretGradient)" stroke="#1e40af" strokeWidth="3"/>
                        {/* Tank Cannon */}
                        <rect x="70" y="52" width="40" height="6" rx="3" fill="#1e40af"/>
                        {/* Tank Tracks */}
                        <rect x="12" y="72" width="81" height="9" rx="4" fill="#374151"/>
                        <circle cx="27" cy="76" r="4" fill="#6b7280"/>
                        <circle cx="45" cy="76" r="4" fill="#6b7280"/>
                        <circle cx="63" cy="76" r="4" fill="#6b7280"/>
                        <circle cx="81" cy="76" r="4" fill="#6b7280"/>
                        
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
                      
                      {/* Glowing Aura */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                  </div>

                  {/* VS Section */}
                  <div className="text-center">
                    <div className="text-6xl font-bold text-slate-300 mb-4 animate-pulse">VS</div>
                    <div className="text-amber-400 font-medium">Battle Arena</div>
                  </div>

                  {/* Enemy Tank */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-red-300 mb-4">{currentText.enemyTank}</h3>
                    <div className={`relative mx-auto animate-villain-idle ${animationPhase === 2 ? 'animate-villain-attack' : ''}`}>
                      {/* Enemy Tank SVG (Mirrored) */}
                      <svg width="120" height="90" viewBox="0 0 120 90" className="filter drop-shadow-lg transform scale-x-[-1]">
                        {/* Tank Body */}
                        <rect x="15" y="45" width="75" height="30" rx="8" fill="url(#enemyGradient)" stroke="#ef4444" strokeWidth="3"/>
                        {/* Tank Turret */}
                        <circle cx="52" cy="55" r="18" fill="url(#enemyTurretGradient)" stroke="#dc2626" strokeWidth="3"/>
                        {/* Tank Cannon */}
                        <rect x="70" y="52" width="40" height="6" rx="3" fill="#dc2626"/>
                        {/* Tank Tracks */}
                        <rect x="12" y="72" width="81" height="9" rx="4" fill="#374151"/>
                        <circle cx="27" cy="76" r="4" fill="#6b7280"/>
                        <circle cx="45" cy="76" r="4" fill="#6b7280"/>
                        <circle cx="63" cy="76" r="4" fill="#6b7280"/>
                        <circle cx="81" cy="76" r="4" fill="#6b7280"/>
                        
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
                      
                      {/* Glowing Aura */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <Button
              onClick={onStartGame}
              size="lg"
              className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white px-12 py-4 text-xl font-bold hover:shadow-lg hover:shadow-orange-500/30 animate-pulse-glow relative overflow-hidden"
            >
              <div className="flex items-center justify-center relative z-10">
                <Play className="h-6 w-6 mr-3" />
                {currentText.startGame}
              </div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-brass-shimmer"></div>
            </Button>
            
            <p className="text-slate-400 text-sm">
              Ready your strategy and prepare for battle!
            </p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-slate-800/95 border border-slate-600/50 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-slate-200 flex items-center justify-between">
                {currentText.settings}
                <Button
                  onClick={handleSettingsToggle}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-200"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{settings.soundEnabled ? currentText.soundOn : currentText.soundOff}</span>
                <Button
                  onClick={handleSoundToggle}
                  variant="outline"
                  size="sm"
                  className={`${
                    settings.soundEnabled 
                      ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                      : 'bg-red-500/20 border-red-500/30 text-red-300'
                  }`}
                >
                  {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>

              {/* Difficulty Selection */}
              <div>
                <h4 className="text-slate-300 mb-3">{currentText.difficulty}</h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <Button
                      key={diff}
                      onClick={() => handleDifficultyChange(diff)}
                      variant={settings.difficulty === diff ? "default" : "outline"}
                      size="sm"
                      className={`${
                        settings.difficulty === diff
                          ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300'
                          : 'border-slate-600/50 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {currentText[diff]}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSettingsToggle}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200"
              >
                {currentText.closeSettings}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}