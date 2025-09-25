import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Settings, Pause, Play, RotateCcw, HelpCircle, ChevronLeft, ChevronRight, Languages, User, Save } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { LessonFlowTimer } from './LessonFlowTimer';
import { WhatIsASetLesson } from './WhatIsASetLesson';
import { TypesOfSetsLesson } from './TypesOfSetsLesson';
import type { Language } from '../../../types/onboarding';

interface SetsAdventureShellProps {
  language: Language;
  onBack: () => void;
  onLanguageChange?: (lang: Language) => void;
}

// SVG Icon Components (SA/COMP/ prefixed)
const SA_COMP_HexIcon: React.FC<{ className?: string; fill?: string }> = ({ className = "", fill = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 3.5L22 7.5V16.5L17.5 20.5H6.5L2 16.5V7.5L6.5 3.5H17.5Z" 
          fill={fill} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const SA_COMP_BackIcon: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SA_COMP_ProgressShard: React.FC<{ 
  progress: number; 
  isActive: boolean; 
  className?: string;
}> = ({ progress, isActive, className = "" }) => (
  <div className={`relative ${className}`}>
    <SA_COMP_HexIcon 
      className={`w-8 h-8 transition-all duration-300 ${
        isActive ? 'text-cyan-400 scale-110' : 'text-slate-500'
      }`}
      fill={`rgba(6, 182, 212, ${progress / 100})`}
    />
    {progress > 0 && (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-white">{Math.round(progress)}%</span>
      </div>
    )}
  </div>
);

const SA_COMP_EnergyBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = "" }) => (
  <div className={`relative bg-slate-800/50 rounded-full h-3 ${className}`}>
    <div 
      className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
  </div>
);

// Main Module Landing Component
const ModuleLanding: React.FC<{
  language: Language;
  onStartLesson: () => void;
  onResumeLesson: () => void;
  hasProgress: boolean;
}> = ({ language, onStartLesson, onResumeLesson, hasProgress }) => {
  const translations = {
    breadcrumb: {
      en: 'Advanced Mathematics › Unit: Set & Relations › Set',
      hi: 'उन्नत गणित › इकाई: समुच्चय और संबंध › समुच्चय',
      or: 'ଉନ୍ନତ ଗଣିତ › ଏକକ: ସେଟ୍ ଏବଂ ସମ୍ପର୍କ › ସେଟ୍'
    },
    title: {
      en: 'Sets Adventure',
      hi: 'समुच्चय साहसिक',
      or: 'ସେଟ୍ ଦୁର୍ଭିକ୍ଷ'
    },
    subtitle: {
      en: 'Master the fundamental concepts of Set Theory through interactive learning',
      hi: 'इंटरैक्टिव शिक्षण के माध्यम से समुच्चय सिद्धांत की मौलिक अवधारणाओं में महारत हासिल करें',
      or: 'ଇଣ୍ଟରାକ୍ଟିଭ ଶିକ୍ଷଣ ମାଧ୍ୟମରେ ସେଟ୍ ସିଦ୍ଧାନ୍ତର ମୌଳିକ ଧାରଣାଗୁଡ଼ିକରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ'
    },
    startLesson: {
      en: 'Start Lesson',
      hi: 'पाठ शुरू करें',
      or: 'ପାଠ ଆରମ୍ଭ କରନ୍ତୁ'
    },
    resumeLesson: {
      en: 'Resume',
      hi: 'फिर से शुरू करें',
      or: 'ପୁଣି ଆରମ୍ଭ କରନ୍ତୁ'
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
      {/* Breadcrumb */}
      <div className="text-center">
        <p className="text-slate-400 text-sm mb-2">{translations.breadcrumb[language]}</p>
        <h1 className="text-3xl font-bold text-white mb-4">{translations.title[language]}</h1>
        <p className="text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {translations.subtitle[language]}
        </p>
      </div>

      {/* Module Preview Card */}
      <Card className="w-full max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4">
            <SA_COMP_HexIcon className="w-16 h-16 text-cyan-400" fill="rgba(6, 182, 212, 0.2)" />
          </div>
          <CardTitle className="text-white">Set Theory Fundamentals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400">Lessons</p>
              <p className="text-white font-semibold">12</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Duration</p>
              <p className="text-white font-semibold">45 min</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={onStartLesson}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <Play className="w-5 h-5 mr-2" />
              {translations.startLesson[language]}
            </Button>
            
            {hasProgress && (
              <Button
                onClick={onResumeLesson}
                variant="outline"
                className="w-full border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/50 hover:border-slate-500 py-3 rounded-lg transition-all duration-300"
              >
                {translations.resumeLesson[language]}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Top HUD Component
const TopHUD: React.FC<{
  language: Language;
  onBack: () => void;
  onLanguageChange?: (lang: Language) => void;
  moduleTitle: string;
}> = ({ language, onBack, onLanguageChange, moduleTitle }) => (
  <div className="sa-hud fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
    <div className="flex items-center justify-between px-4 py-3">
      {/* Left - Back Button */}
      <Button
        onClick={onBack}
        variant="ghost"
        size="sm"
        className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg min-w-[48px] min-h-[48px]"
      >
        <SA_COMP_BackIcon className="w-5 h-5" />
      </Button>

      {/* Center - Module Title */}
      <div className="flex-1 text-center">
        <h2 className="text-white font-semibold truncate max-w-[200px] mx-auto">{moduleTitle}</h2>
      </div>

      {/* Right - Language Toggle & Profile */}
      <div className="flex items-center space-x-2">
        {onLanguageChange && (
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-16 h-10 bg-slate-800/50 border-slate-600 text-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="hi">HI</SelectItem>
              <SelectItem value="or">OD</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg min-w-[48px] min-h-[48px]"
        >
          <User className="w-5 h-5" />
        </Button>
      </div>
    </div>
  </div>
);

// Persistent HUD Component
const PersistentHUD: React.FC<{
  progressShards: number[];
  overallProgress: number;
  onPause: () => void;
  onSave: () => void;
}> = ({ progressShards, overallProgress, onPause, onSave }) => (
  <div className="sa-hud fixed top-16 left-0 right-0 z-30 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm border-b border-slate-700/30">
    <div className="flex items-center justify-between px-4 py-2">
      {/* Left - Progress Shards */}
      <div className="flex items-center space-x-2">
        {progressShards.map((progress, index) => (
          <SA_COMP_ProgressShard
            key={index}
            progress={progress}
            isActive={progress > 0}
            className="transition-all duration-300"
          />
        ))}
      </div>

      {/* Center - Energy Bar */}
      <div className="flex-1 mx-6">
        <SA_COMP_EnergyBar progress={overallProgress} className="w-full" />
      </div>

      {/* Right - Pause & Save */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={onPause}
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg min-w-[48px] min-h-[48px]"
        >
          <Pause className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={onSave}
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg min-w-[48px] min-h-[48px]"
        >
          <Save className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </div>
);

// Bottom Navigation Component
const BottomNav: React.FC<{
  onPrevious: () => void;
  onReplay: () => void;
  onHint: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}> = ({ onPrevious, onReplay, onHint, onNext, canGoPrevious, canGoNext }) => (
  <div className="sa-bottom-nav fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-t border-slate-700/50">
    <div className="flex items-center justify-center space-x-6 px-4 py-3">
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        variant="ghost"
        size="sm"
        className="text-slate-300 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg min-w-[48px] min-h-[48px]"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        onClick={onReplay}
        variant="ghost"
        size="sm"
        className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg min-w-[48px] min-h-[48px]"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>

      <Button
        onClick={onHint}
        variant="ghost"
        size="sm"
        className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg min-w-[48px] min-h-[48px]"
      >
        <HelpCircle className="w-5 h-5" />
      </Button>

      <Button
        onClick={onNext}
        disabled={!canGoNext}
        variant="ghost"
        size="sm"
        className="text-slate-300 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg min-w-[48px] min-h-[48px]"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  </div>
);

// Pause/Settings Modal Component
const PauseSettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
  language: Language;
}> = ({ isOpen, onClose, onResume, onRestart, onExit, language }) => {
  const translations = {
    title: {
      en: 'Lesson Paused',
      hi: 'पाठ रोका गया',
      or: 'ପାଠ ବନ୍ଦ ହେଲା'
    },
    resume: {
      en: 'Resume',
      hi: 'जारी रखें',
      or: 'ଆଗକୁ ବଢ଼ନ୍ତୁ'
    },
    restart: {
      en: 'Restart Lesson',
      hi: 'पाठ पुनः आरंभ करें',
      or: 'ପାଠ ପୁଣି ଆରମ୍ଭ କରନ୍ତୁ'
    },
    exit: {
      en: 'Exit to Menu',
      hi: 'मेनू पर वापस जाएं',
      or: 'ମେନୁକୁ ଫେରନ୍ତୁ'
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {translations.title[language]}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <Button
            onClick={onResume}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2" />
            {translations.resume[language]}
          </Button>
          
          <Button
            onClick={onRestart}
            variant="outline"
            className="w-full border-slate-600 bg-slate-700/50 text-slate-200 hover:bg-slate-600/50 hover:border-slate-500 py-3 rounded-lg transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {translations.restart[language]}
          </Button>
          
          <Button
            onClick={onExit}
            variant="outline"
            className="w-full border-red-600/50 bg-red-900/20 text-red-200 hover:bg-red-800/30 hover:border-red-500 py-3 rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {translations.exit[language]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Sets Adventure Shell Component
export const SetsAdventureShell: React.FC<SetsAdventureShellProps> = ({
  language,
  onBack,
  onLanguageChange
}) => {
  const [currentView, setCurrentView] = useState<'landing' | 'lesson' | 'what-is-set' | 'types-of-sets'>('landing');
  const [isPaused, setIsPaused] = useState(false);
  const [progressShards] = useState([85, 92, 67, 23, 0]); // Mock progress data
  const [overallProgress] = useState(73);
  const [hasProgress] = useState(true);

  // Route metadata
  const moduleId = 'sets_v1';

  const handleStartLesson = useCallback(() => {
    setCurrentView('what-is-set'); // Start with "What is a Set?" lesson
  }, []);

  const handleResumeLesson = useCallback(() => {
    setCurrentView('lesson'); // Resume to main lesson interface
  }, []);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handleRestart = useCallback(() => {
    setIsPaused(false);
    // Reset lesson progress logic here
  }, []);

  const handleExit = useCallback(() => {
    setIsPaused(false);
    setCurrentView('landing');
  }, []);

  const handleSave = useCallback(() => {
    // Save progress logic here
    console.log('Progress saved');
  }, []);

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    console.log('Previous lesson');
  }, []);

  const handleReplay = useCallback(() => {
    console.log('Replay animation');
  }, []);

  const handleHint = useCallback(() => {
    console.log('Show hint');
  }, []);

  const handleNext = useCallback(() => {
    console.log('Next lesson');
  }, []);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden"
      data-module-id={moduleId}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-sparkle" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-sparkle delay-300" />
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-sparkle delay-500" />
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-sparkle delay-700" />
      </div>

      {currentView === 'landing' ? (
        <ModuleLanding
          language={language}
          onStartLesson={handleStartLesson}
          onResumeLesson={handleResumeLesson}
          hasProgress={hasProgress}
        />
      ) : currentView === 'what-is-set' ? (
        <WhatIsASetLesson
          language={language}
          onComplete={() => setCurrentView('types-of-sets')}
          onNext={() => setCurrentView('types-of-sets')}
          className="absolute inset-0"
        />
      ) : currentView === 'types-of-sets' ? (
        <TypesOfSetsLesson
          language={language}
          onComplete={() => setCurrentView('lesson')}
          onNext={() => setCurrentView('lesson')}
          className="absolute inset-0"
        />
      ) : (
        <>
          {/* Top HUD */}
          <TopHUD
            language={language}
            onBack={onBack}
            onLanguageChange={onLanguageChange}
            moduleTitle="Sets Theory"
          />

          {/* Persistent HUD */}
          <PersistentHUD
            progressShards={progressShards}
            overallProgress={overallProgress}
            onPause={handlePause}
            onSave={handleSave}
          />

          {/* Main Content Area */}
          <div className="pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Lesson Flow Timer Integration */}
              <LessonFlowTimer
                language={language}
                onStageChange={(stageId) => {
                  console.log('Stage changed to:', stageId);
                  // Here you could trigger stage-specific content
                }}
                onTimerComplete={() => {
                  console.log('Lesson timer completed');
                  // Handle lesson completion
                }}
                className="mb-6"
              />

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl font-bold text-white">Interactive Learning Content</h3>
                    <p className="text-slate-300">
                      The lesson flow timer above provides structured pacing for the complete Sets learning experience.
                      Each stage includes targeted content, animations, and assessments.
                    </p>
                    
                    {/* Enhanced Progress Visualization */}
                    <div className="mt-8 space-y-6">
                      <h4 className="text-lg font-semibold text-white">Learning Progress</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {progressShards.map((progress, index) => (
                          <div key={index} className="text-center">
                            <SA_COMP_ProgressShard 
                              progress={progress} 
                              isActive={progress > 0} 
                              className="mx-auto mb-3 transform hover:scale-110 transition-transform duration-300" 
                            />
                            <p className="text-sm font-medium text-slate-300">Stage {index + 1}</p>
                            <p className="text-xs text-slate-400">{progress}% Complete</p>
                          </div>
                        ))}
                      </div>

                      {/* Overall Progress Bar */}
                      <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-sm text-slate-300">
                          <span>Overall Progress</span>
                          <span>{overallProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${overallProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-slate-500 transition-all duration-300 hover:scale-105"
                        onClick={() => setCurrentView('what-is-set')}
                      >
                        📚 What is a Set?
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-slate-500 transition-all duration-300 hover:scale-105"
                        onClick={() => setCurrentView('types-of-sets')}
                      >
                        🔢 Types of Sets
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-slate-500 transition-all duration-300 hover:scale-105"
                      >
                        🏆 Challenge Quiz
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNav
            onPrevious={handlePrevious}
            onReplay={handleReplay}
            onHint={handleHint}
            onNext={handleNext}
            canGoPrevious={true}
            canGoNext={true}
          />

          {/* Pause/Settings Modal */}
          <PauseSettingsModal
            isOpen={isPaused}
            onClose={() => setIsPaused(false)}
            onResume={handleResume}
            onRestart={handleRestart}
            onExit={handleExit}
            language={language}
          />
        </>
      )}
    </div>
  );
};

export default SetsAdventureShell;