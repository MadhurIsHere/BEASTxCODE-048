import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, Zap, Clock, CheckCircle, AlertCircle, Target } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Progress } from '../../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import type { Language } from '../../../types/onboarding';

// Lesson Flow Configuration (Export Tokens)
export const LESSON_FLOW_CONFIG = {
  stages: [
    {
      id: 'intro',
      title: { en: 'Introduction', hi: 'परिचय', or: 'ପରିଚୟ' },
      duration: 5, // minutes
      animationLength: 30, // seconds
      description: { 
        en: 'Welcome & lesson overview',
        hi: 'स्वागत और पाठ अवलोकन',
        or: 'ସ୍ୱାଗତ ଏବଂ ପାଠ ସମୀକ୍ଷା'
      },
      color: '#06b6d4',
      icon: '🎯'
    },
    {
      id: 'definitions',
      title: { en: 'Definitions & Representation', hi: 'परिभाषा और प्रतिनिधित्व', or: 'ସଂଜ୍ଞା ଏବଂ ପ୍ରତିନିଧିତ୍ୱ' },
      duration: 10,
      animationLength: 60,
      description: { 
        en: 'Basic set concepts & notation',
        hi: 'मूलभूत समुच्चय अवधारणाएं और संकेतन',
        or: 'ମୌଳିକ ସେଟ୍ ଧାରଣା ଏବଂ ସଙ୍କେତ'
      },
      color: '#3b82f6',
      icon: '📚'
    },
    {
      id: 'types',
      title: { en: 'Types & Subsets', hi: 'प्रकार और उपसमुच्चय', or: 'ପ୍ରକାର ଏବଂ ସବସେଟ୍' },
      duration: 10,
      animationLength: 45,
      description: { 
        en: 'Different types of sets',
        hi: 'समुच्चयों के विभिन्न प्रकार',
        or: 'ସେଟର ବିଭିନ୍ନ ପ୍ରକାର'
      },
      color: '#8b5cf6',
      icon: '🏗️'
    },
    {
      id: 'operations',
      title: { en: 'Set Operations', hi: 'समुच्चय संक्रियाएं', or: 'ସେଟ୍ ଅପରେସନ୍' },
      duration: 15,
      animationLength: 90,
      description: { 
        en: 'Union, Intersection, Difference, Complement',
        hi: 'संघ, प्रतिच्छेदन, अंतर, पूरक',
        or: 'ୟୁନିଅନ୍, ଇଣ୍ଟରସେକସନ୍, ଡିଫରେନ୍ସ, କମ୍ପ୍ଲିମେଣ୍ଟ'
      },
      color: '#f59e0b',
      icon: '⚡'
    },
    {
      id: 'venn-practice',
      title: { en: 'Venn Practice', hi: 'वेन अभ्यास', or: 'ଭେନ୍ ଅଭ୍ୟାସ' },
      duration: 10,
      animationLength: 60,
      description: { 
        en: 'Interactive Venn diagrams',
        hi: 'इंटरैक्टिव वेन आरेख',
        or: 'ଇଣ୍ଟରାକ୍ଟିଭ ଭେନ ଡାଇଗ୍ରାମ'
      },
      color: '#10b981',
      icon: '🎨'
    },
    {
      id: 'quiz',
      title: { en: 'Knowledge Quiz', hi: 'ज्ञान प्रश्नोत्तरी', or: 'ଜ୍ଞାନ କୁଇଜ୍' },
      duration: 10,
      animationLength: 30,
      description: { 
        en: 'Test your understanding',
        hi: 'अपनी समझ को परखें',
        or: 'ଆପଣଙ୍କ ବୁଝାମଣାକୁ ପରୀକ୍ଷା କରନ୍ତୁ'
      },
      color: '#ef4444',
      icon: '🏆'
    }
  ],
  totalDuration: 60, // minutes
  fastModeDuration: 45, // minutes
  paceCheckInterval: 2 // minutes
};

interface LessonFlowTimerProps {
  language: Language;
  onStageChange?: (stageId: string) => void;
  onTimerComplete?: () => void;
  className?: string;
}

interface TimerState {
  isRunning: boolean;
  currentTime: number; // seconds
  currentStageIndex: number;
  isFastMode: boolean;
  showPacePopup: boolean;
  lastPaceCheck: number;
}

// Reusable Progress Ring Component
export const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = '#06b6d4', 
  backgroundColor = '#e5e7eb',
  className = '',
  children 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

// Stage Checkpoint Component
const StageCheckpoint: React.FC<{
  stage: typeof LESSON_FLOW_CONFIG.stages[0];
  isActive: boolean;
  isCompleted: boolean;
  progress: number;
  language: Language;
  onClick: () => void;
}> = ({ stage, isActive, isCompleted, progress, language, onClick }) => {
  return (
    <div 
      className={`relative cursor-pointer transition-all duration-300 ${
        isActive ? 'scale-110' : 'hover:scale-105'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-2">
        {/* Progress Ring */}
        <ProgressRing
          progress={isCompleted ? 100 : isActive ? progress : 0}
          size={60}
          strokeWidth={4}
          color={stage.color}
          className={`transition-all duration-500 ${
            isActive ? 'animate-pulse' : ''
          }`}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-lg">{stage.icon}</span>
            <span className="text-xs font-bold text-slate-700">{stage.duration}m</span>
          </div>
        </ProgressRing>

        {/* Stage Title */}
        <div className="text-center max-w-20">
          <h4 className="text-xs font-semibold text-slate-800 leading-tight">
            {stage.title[language]}
          </h4>
        </div>

        {/* Status Indicator */}
        <div className="absolute -top-1 -right-1">
          {isCompleted ? (
            <CheckCircle className="w-4 h-4 text-green-500 fill-white" />
          ) : isActive ? (
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          ) : null}
        </div>
      </div>
    </div>
  );
};

// Timer Display Component
const TimerDisplay: React.FC<{
  time: number;
  totalTime: number;
  isRunning: boolean;
  isFastMode: boolean;
}> = ({ time, totalTime, isRunning, isFastMode }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const progress = ((totalTime - time) / totalTime) * 100;

  return (
    <div className="flex flex-col items-center space-y-4">
      <ProgressRing
        progress={progress}
        size={120}
        strokeWidth={6}
        color={isFastMode ? '#f59e0b' : '#06b6d4'}
        className="relative"
      >
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            time < 300 ? 'text-red-500' : 'text-slate-800'
          }`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-xs text-slate-600">
            {isFastMode ? 'Fast Mode' : 'Standard'}
          </div>
        </div>
      </ProgressRing>

      {/* Timer Status */}
      <div className="flex items-center space-x-2">
        {isRunning ? (
          <div className="flex items-center space-x-1 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Running</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-slate-600">
            <div className="w-2 h-2 bg-slate-400 rounded-full" />
            <span className="text-sm font-medium">Paused</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Pace Popup Component
const PacePopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentStage: string;
  isAhead: boolean;
  language: Language;
}> = ({ isOpen, onClose, currentStage, isAhead, language }) => {
  const translations = {
    title: {
      en: isAhead ? 'Great Pace!' : 'Keep Up!',
      hi: isAhead ? 'बेहतरीन गति!' : 'गति बनाए रखें!',
      or: isAhead ? 'ଭଲ ଗତି!' : 'ଗତି ବଜାୟ ରଖନ୍ତୁ!'
    },
    message: {
      en: isAhead 
        ? 'You\'re ahead of schedule. Great work!' 
        : 'Consider picking up the pace to stay on track.',
      hi: isAhead 
        ? 'आप समय से आगे हैं। बहुत बढ़िया काम!' 
        : 'ट्रैक पर बने रहने के लिए गति बढ़ाने पर विचार करें।',
      or: isAhead 
        ? 'ଆପଣ ସମୟଠାରୁ ଆଗରେ ଅଛନ୍ତି। ବହୁତ ଭଲ କାମ!' 
        : 'ଟ୍ରାକରେ ରହିବା ପାଇଁ ଗତି ବଢ଼ାଇବାକୁ ବିଚାର କରନ୍ତୁ।'
    },
    continue: {
      en: 'Continue',
      hi: 'जारी रखें',
      or: 'ଜାରି ରଖନ୍ତୁ'
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-white border-2 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center space-x-2">
            {isAhead ? (
              <Target className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            <span>{translations.title[language]}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center space-y-4">
          <p className="text-slate-600">
            {translations.message[language]}
          </p>
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
          >
            {translations.continue[language]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const LessonFlowTimer: React.FC<LessonFlowTimerProps> = ({
  language,
  onStageChange,
  onTimerComplete,
  className = ''
}) => {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    currentTime: LESSON_FLOW_CONFIG.totalDuration * 60, // 60 minutes in seconds
    currentStageIndex: 0,
    isFastMode: false,
    showPacePopup: false,
    lastPaceCheck: 0
  });

  const stages = LESSON_FLOW_CONFIG.stages;
  const currentStage = stages[timerState.currentStageIndex];

  // Calculate current stage progress and timing
  const { stageProgress, elapsedTime, isAheadOfSchedule } = useMemo(() => {
    const totalDuration = timerState.isFastMode 
      ? LESSON_FLOW_CONFIG.fastModeDuration * 60 
      : LESSON_FLOW_CONFIG.totalDuration * 60;
    
    const elapsed = totalDuration - timerState.currentTime;
    
    // Calculate expected stage based on elapsed time
    let cumulativeTime = 0;
    let expectedStageIndex = 0;
    
    for (let i = 0; i < stages.length; i++) {
      const stageDuration = timerState.isFastMode 
        ? (stages[i].duration * LESSON_FLOW_CONFIG.fastModeDuration / LESSON_FLOW_CONFIG.totalDuration) * 60
        : stages[i].duration * 60;
      
      if (elapsed >= cumulativeTime && elapsed < cumulativeTime + stageDuration) {
        expectedStageIndex = i;
        break;
      }
      cumulativeTime += stageDuration;
      expectedStageIndex = i + 1;
    }

    // Calculate stage progress
    const stageStartTime = stages.slice(0, timerState.currentStageIndex)
      .reduce((acc, stage) => acc + (timerState.isFastMode 
        ? (stage.duration * LESSON_FLOW_CONFIG.fastModeDuration / LESSON_FLOW_CONFIG.totalDuration) * 60
        : stage.duration * 60), 0);
    
    const currentStageDuration = timerState.isFastMode 
      ? (currentStage.duration * LESSON_FLOW_CONFIG.fastModeDuration / LESSON_FLOW_CONFIG.totalDuration) * 60
      : currentStage.duration * 60;
    
    const stageElapsed = Math.max(0, elapsed - stageStartTime);
    const progress = Math.min(100, (stageElapsed / currentStageDuration) * 100);

    return {
      stageProgress: progress,
      elapsedTime: elapsed,
      isAheadOfSchedule: timerState.currentStageIndex > expectedStageIndex
    };
  }, [timerState, stages, currentStage]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.isRunning && timerState.currentTime > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          const newTime = prev.currentTime - 1;
          
          // Check for stage completion
          const totalDuration = prev.isFastMode 
            ? LESSON_FLOW_CONFIG.fastModeDuration * 60 
            : LESSON_FLOW_CONFIG.totalDuration * 60;
          const elapsed = totalDuration - newTime;
          
          // Auto-advance to next stage if current stage time is up
          let newStageIndex = prev.currentStageIndex;
          let cumulativeTime = 0;
          
          for (let i = 0; i < stages.length; i++) {
            const stageDuration = prev.isFastMode 
              ? (stages[i].duration * LESSON_FLOW_CONFIG.fastModeDuration / LESSON_FLOW_CONFIG.totalDuration) * 60
              : stages[i].duration * 60;
            
            if (elapsed >= cumulativeTime + stageDuration && i > prev.currentStageIndex) {
              newStageIndex = Math.min(i, stages.length - 1);
              break;
            }
            cumulativeTime += stageDuration;
          }

          // Check for pace popup (every 2 minutes)
          const shouldShowPacePopup = elapsed > 0 && 
            elapsed % (LESSON_FLOW_CONFIG.paceCheckInterval * 60) === 0 && 
            elapsed !== prev.lastPaceCheck;

          if (newTime === 0) {
            onTimerComplete?.();
          }

          if (newStageIndex !== prev.currentStageIndex) {
            onStageChange?.(stages[newStageIndex].id);
          }

          return {
            ...prev,
            currentTime: newTime,
            currentStageIndex: newStageIndex,
            showPacePopup: shouldShowPacePopup,
            lastPaceCheck: shouldShowPacePopup ? elapsed : prev.lastPaceCheck
          };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.currentTime, stages, onStageChange, onTimerComplete]);

  const handleStart = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const handlePause = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const handleReset = useCallback(() => {
    const totalTime = timerState.isFastMode 
      ? LESSON_FLOW_CONFIG.fastModeDuration * 60 
      : LESSON_FLOW_CONFIG.totalDuration * 60;
    
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      currentTime: totalTime,
      currentStageIndex: 0,
      showPacePopup: false,
      lastPaceCheck: 0
    }));
  }, [timerState.isFastMode]);

  const handleFastModeToggle = useCallback(() => {
    setTimerState(prev => {
      const newFastMode = !prev.isFastMode;
      const newTotalTime = newFastMode 
        ? LESSON_FLOW_CONFIG.fastModeDuration * 60 
        : LESSON_FLOW_CONFIG.totalDuration * 60;
      
      return {
        ...prev,
        isFastMode: newFastMode,
        currentTime: newTotalTime,
        isRunning: false,
        currentStageIndex: 0,
        showPacePopup: false,
        lastPaceCheck: 0
      };
    });
  }, []);

  const handleStageClick = useCallback((stageIndex: number) => {
    setTimerState(prev => ({ ...prev, currentStageIndex: stageIndex }));
    onStageChange?.(stages[stageIndex].id);
  }, [stages, onStageChange]);

  const translations = {
    title: {
      en: 'Lesson Flow Timer',
      hi: 'पाठ प्रवाह टाइमर',
      or: 'ପାଠ ପ୍ରବାହ ଟାଇମର'
    },
    fastMode: {
      en: 'Fast Mode (45 min)',
      hi: 'फास्ट मोड (45 मिनट)',
      or: 'ଫାଷ୍ଟ ମୋଡ୍ (45 ମିନିଟ୍)'
    },
    start: {
      en: 'Start',
      hi: 'शुरू करें',
      or: 'ଆରମ୍ଭ କରନ୍ତୁ'
    },
    pause: {
      en: 'Pause',
      hi: 'रोकें',
      or: 'ବନ୍ଦ କରନ୍ତୁ'
    },
    reset: {
      en: 'Reset',
      hi: 'रीसेट',
      or: 'ରିସେଟ୍'
    }
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 border-slate-200 shadow-lg ${className}`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2 text-slate-800">
          <Clock className="w-6 h-6 text-blue-500" />
          <span>{translations.title[language]}</span>
        </CardTitle>

        {/* Fast Mode Toggle */}
        <div className="flex items-center justify-center space-x-3 mt-4">
          <span className="text-sm text-slate-600">Standard (60 min)</span>
          <Switch
            checked={timerState.isFastMode}
            onCheckedChange={handleFastModeToggle}
            className="data-[state=checked]:bg-amber-500"
          />
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-slate-600">{translations.fastMode[language]}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Timer Display */}
        <div className="flex justify-center">
          <TimerDisplay
            time={timerState.currentTime}
            totalTime={timerState.isFastMode 
              ? LESSON_FLOW_CONFIG.fastModeDuration * 60 
              : LESSON_FLOW_CONFIG.totalDuration * 60}
            isRunning={timerState.isRunning}
            isFastMode={timerState.isFastMode}
          />
        </div>

        {/* Stage Timeline */}
        <div className="space-y-4">
          <h3 className="text-center font-semibold text-slate-700">Lesson Stages</h3>
          <div className="flex justify-between items-center px-4 py-6 bg-slate-50/50 rounded-lg overflow-x-auto">
            {stages.map((stage, index) => (
              <StageCheckpoint
                key={stage.id}
                stage={stage}
                isActive={index === timerState.currentStageIndex}
                isCompleted={index < timerState.currentStageIndex}
                progress={index === timerState.currentStageIndex ? stageProgress : 0}
                language={language}
                onClick={() => handleStageClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Current Stage Info */}
        <div className="text-center space-y-2">
          <Badge 
            variant="secondary" 
            className="text-sm px-4 py-1"
            style={{ backgroundColor: `${currentStage.color}20`, color: currentStage.color }}
          >
            {currentStage.title[language]}
          </Badge>
          <p className="text-slate-600 text-sm">{currentStage.description[language]}</p>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4">
          {!timerState.isRunning ? (
            <Button
              onClick={handleStart}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {translations.start[language]}
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6"
              size="lg"
            >
              <Pause className="w-5 h-5 mr-2" />
              {translations.pause[language]}
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6"
            size="lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {translations.reset[language]}
          </Button>
        </div>
      </CardContent>

      {/* Pace Popup */}
      <PacePopup
        isOpen={timerState.showPacePopup}
        onClose={() => setTimerState(prev => ({ ...prev, showPacePopup: false }))}
        currentStage={currentStage.id}
        isAhead={isAheadOfSchedule}
        language={language}
      />
    </Card>
  );
};

export default LessonFlowTimer;