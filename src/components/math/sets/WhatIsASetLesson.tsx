import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, CheckCircle, X, Volume2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import type { Language } from '../../../types/onboarding';

// Animation Configuration & Tokens (Export for Dev)
export const LESSON_ANIMATION_CONFIG = {
  stages: [
    {
      id: 'title-intro',
      duration: 3000, // 3 seconds
      title: 'Title Introduction',
      description: 'Title fade-in with narration'
    },
    {
      id: 'roster-representation',
      duration: 4000, // 4 seconds
      title: 'Roster Method',
      description: 'SVG tiles animate into container'
    },
    {
      id: 'set-builder',
      duration: 3500, // 3.5 seconds
      title: 'Set-Builder Notation',
      description: 'Mathematical notation animation'
    },
    {
      id: 'empty-set',
      duration: 2500, // 2.5 seconds
      title: 'Empty Set',
      description: 'Empty set demonstration'
    }
  ],
  totalDuration: 13000 // 13 seconds total
};

// Textual Tokens for Development
export const LESSON_TEXT_TOKENS = {
  title: {
    en: 'What is a Set?',
    hi: 'सेट क्या है?',
    or: 'ସେଟ୍ କଣ?'
  },
  narration: {
    en: 'A set is a well-defined collection of distinct objects.',
    hi: 'सेट स्पष्ट रूप से परिभाषित वस्तुओं का समूह है।',
    or: 'ସେଟ୍ ବ୍ୟକ୍ତିଗତ ଭାବରେ ସଂଗଠିତ ଜିନିଷର ସଂଗ୍ରହ।'
  },
  rosterMethod: {
    en: 'Roster Method: List elements in braces',
    hi: 'रोस्टर विधि: तत्वों को ब्रेसेस में सूचीबद्ध करें',
    or: 'ରୋଷ୍ଟର ପଦ୍ଧତି: ବ୍ରେସରେ ଉପାଦାନଗୁଡ଼ିକୁ ତାଲିକାଭୁକ୍ତ କରନ୍ତୁ'
  },
  setBuilder: {
    en: 'Set-Builder: Use conditions to define',
    hi: 'सेट-बिल्डर: परिभाषित करने के लिए शर्तों का उपयोग करें',
    or: 'ସେଟ୍-ବିଲଡର: ପରିଭାଷିତ କରିବା ପାଇଁ ସର୍ତ୍ତ ବ୍ୟବହାର କରନ୍ତୁ'
  },
  emptySet: {
    en: 'Empty Set: A set with no elements',
    hi: 'रिक्त सेट: कोई तत्व नहीं वाला सेट',
    or: 'ଖାଲି ସେଟ୍: କୌଣସି ଉପାଦାନ ନଥିବା ସେଟ୍'
  },
  quizTitle: {
    en: 'Quick Check: Which is a valid set representation?',
    hi: 'त्वरित जांच: कौन सा एक वैध सेट प्रतिनिधित्व है?',
    or: 'ଶୀଘ୍ର ଯାଞ୍ଚ: କେଉଁଟି ଏକ ବୈଧ ସେଟ୍ ପ୍ରତିନିଧିତ୍ୱ?'
  },
  quizOptions: [
    {
      id: 'a',
      text: { en: '{1, 2, 3, 2}', hi: '{1, 2, 3, 2}', or: '{1, 2, 3, 2}' },
      isCorrect: false,
      explanation: {
        en: 'Sets cannot have duplicate elements',
        hi: 'सेट में डुप्लिकेट तत्व नहीं हो सकते',
        or: 'ସେଟରେ ଡୁପ୍ଲିକେଟ୍ ଉପାଦାନ ରହିପାରିବ ନାହିଁ'
      }
    },
    {
      id: 'b',
      text: { en: '{a, b, c}', hi: '{a, b, c}', or: '{a, b, c}' },
      isCorrect: true,
      explanation: {
        en: 'Perfect! Distinct elements in braces.',
        hi: 'बिल्कुल सही! ब्रेसेस में अलग तत्व।',
        or: 'ସିଦ୍ଧ! ବ୍ରେସରେ ଭିନ୍ନ ଉପାଦାନ।'
      }
    },
    {
      id: 'c',
      text: { en: '[1, 2, 3]', hi: '[1, 2, 3]', or: '[1, 2, 3]' },
      isCorrect: false,
      explanation: {
        en: 'Sets use braces { }, not brackets [ ]',
        hi: 'सेट ब्रेसेस { } का उपयोग करते हैं, ब्रैकेट [ ] का नहीं',
        or: 'ସେଟ୍ ବ୍ରେସ { } ବ୍ୟବହାର କରେ, ବ୍ରାକେଟ୍ [ ] ନୁହେଁ'
      }
    }
  ]
};

interface WhatIsASetLessonProps {
  language: Language;
  onComplete?: () => void;
  onNext?: () => void;
  className?: string;
}

// SVG Components (Reusable Assets)
const SVGNumberTile: React.FC<{
  number: string;
  x: number;
  y: number;
  isAnimating?: boolean;
  delay?: number;
}> = ({ number, x, y, isAnimating = false, delay = 0 }) => (
  <g
    className={`transition-all duration-1000 ease-out ${isAnimating ? 'animate-bounce-in' : ''}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <rect
      x={x}
      y={y}
      width="40"
      height="40"
      rx="8"
      fill="#3b82f6"
      stroke="#1e40af"
      strokeWidth="2"
      className="drop-shadow-sm"
    />
    <text
      x={x + 20}
      y={y + 28}
      textAnchor="middle"
      fill="white"
      fontSize="20"
      fontWeight="bold"
    >
      {number}
    </text>
  </g>
);

const SVGSetContainer: React.FC<{
  isVisible?: boolean;
  children?: React.ReactNode;
}> = ({ isVisible = false, children }) => (
  <g className={`transition-all duration-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
    <rect
      x="50"
      y="80"
      width="200"
      height="80"
      rx="12"
      fill="rgba(59, 130, 246, 0.1)"
      stroke="#3b82f6"
      strokeWidth="3"
      strokeDasharray="8,4"
      className="animate-dash-flow"
    />
    {children}
  </g>
);

const SVGBrackets: React.FC<{
  isAnimating?: boolean;
  scale?: number;
}> = ({ isAnimating = false, scale = 1 }) => (
  <g className={`transition-all duration-600 ${isAnimating ? 'animate-bracket-grow' : ''}`}>
    <text
      x="60"
      y="140"
      fontSize={`${30 * scale}`}
      fill="#1e40af"
      fontWeight="bold"
      className="transition-all duration-600"
    >
      {`{`}
    </text>
    <text
      x="230"
      y="140"
      fontSize={`${30 * scale}`}
      fill="#1e40af"
      fontWeight="bold"
      className="transition-all duration-600"
    >
      {`}`}
    </text>
  </g>
);

const SVGEmptySetSymbol: React.FC<{
  isVisible?: boolean;
  isBouncing?: boolean;
}> = ({ isVisible = false, isBouncing = false }) => (
  <g className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'} ${isBouncing ? 'animate-bounce' : ''}`}>
    <circle
      cx="150"
      cy="120"
      r="30"
      fill="none"
      stroke="#ef4444"
      strokeWidth="4"
    />
    <line
      x1="130"
      y1="100"
      x2="170"
      y2="140"
      stroke="#ef4444"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <text
      x="150"
      y="180"
      textAnchor="middle"
      fontSize="24"
      fill="#ef4444"
      fontWeight="bold"
    >
      ∅
    </text>
  </g>
);

// Animation Stage Component
const AnimationStage: React.FC<{
  stage: string;
  isActive: boolean;
  language: Language;
}> = ({ stage, isActive, language }) => {
  const [tilePositions] = useState([
    { number: '1', startX: 50, startY: 20, endX: 80, endY: 100 },
    { number: '2', startX: 150, startY: 20, endX: 130, endY: 100 },
    { number: '3', startX: 250, startY: 20, endX: 180, endY: 100 }
  ]);

  switch (stage) {
    case 'title-intro':
      return (
        <div className="text-center space-y-4">
          <h1 className={`text-4xl font-bold text-blue-800 transition-all duration-1000 ${
            isActive ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}>
            {LESSON_TEXT_TOKENS.title[language]}
          </h1>
          <p className={`text-lg text-slate-600 transition-all duration-1000 delay-500 ${
            isActive ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}>
            {LESSON_TEXT_TOKENS.narration[language]}
          </p>
        </div>
      );

    case 'roster-representation':
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-700 text-center">
            {LESSON_TEXT_TOKENS.rosterMethod[language]}
          </h3>
          <div className="flex justify-center">
            <svg width="300" height="200" viewBox="0 0 300 200">
              <SVGSetContainer isVisible={isActive}>
                <SVGBrackets isAnimating={isActive} />
                {tilePositions.map((tile, index) => (
                  <SVGNumberTile
                    key={tile.number}
                    number={tile.number}
                    x={isActive ? tile.endX : tile.startX}
                    y={isActive ? tile.endY : tile.startY}
                    isAnimating={isActive}
                    delay={index * 300}
                  />
                ))}
                {isActive && (
                  <>
                    <text x="120" y="115" fontSize="18" fill="#1e40af">,</text>
                    <text x="170" y="115" fontSize="18" fill="#1e40af">,</text>
                  </>
                )}
              </SVGSetContainer>
            </svg>
          </div>
          <p className="text-center text-slate-600 font-mono text-lg">
            {isActive && `{1, 2, 3}`}
          </p>
        </div>
      );

    case 'set-builder':
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-700 text-center">
            {LESSON_TEXT_TOKENS.setBuilder[language]}
          </h3>
          <div className="flex justify-center">
            <div className={`text-2xl font-mono bg-purple-50 p-6 rounded-lg border-2 border-purple-300 transition-all duration-1000 ${
              isActive ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-75'
            }`}>
              <span className="text-purple-800">{`{`}</span>
              <span className={`text-purple-600 transition-all duration-700 ${isActive ? 'animate-type-writer' : ''}`}>
                x | x &lt; 5
              </span>
              <span className="text-purple-800">{`}`}</span>
            </div>
          </div>
          <p className="text-center text-slate-600">
            {language === 'en' && 'All numbers x such that x is less than 5'}
            {language === 'hi' && 'सभी संख्याएं x जैसे कि x 5 से कम है'}
            {language === 'or' && 'ସମସ୍ତ ସଂଖ୍ୟା x ଯେପରି x 5 ରୁ କମ୍'}
          </p>
        </div>
      );

    case 'empty-set':
      return (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-700 text-center">
            {LESSON_TEXT_TOKENS.emptySet[language]}
          </h3>
          <div className="flex justify-center">
            <div className={`transition-all duration-500 ${isActive ? 'animate-shake' : ''}`}>
              <svg width="300" height="200" viewBox="0 0 300 200">
                <rect
                  x="100"
                  y="80"
                  width="100"
                  height="60"
                  rx="8"
                  fill="rgba(239, 68, 68, 0.1)"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="5,3"
                />
                <SVGEmptySetSymbol 
                  isVisible={isActive} 
                  isBouncing={isActive}
                />
              </svg>
            </div>
          </div>
          <p className="text-center text-slate-600 font-mono text-lg">
            {isActive && `∅ or { }`}
          </p>
        </div>
      );

    default:
      return null;
  }
};

// Quiz Component
const MicroQuiz: React.FC<{
  language: Language;
  onComplete: (score: number) => void;
}> = ({ language, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionSelect = useCallback((optionId: string) => {
    const option = LESSON_TEXT_TOKENS.quizOptions.find(opt => opt.id === optionId);
    if (!option) return;

    setSelectedOption(optionId);
    setIsCorrect(option.isCorrect);
    setShowFeedback(true);

    setTimeout(() => {
      onComplete(option.isCorrect ? 100 : 0);
    }, 2000);
  }, [onComplete]);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-center text-blue-800 flex items-center justify-center space-x-2">
          <CheckCircle className="w-6 h-6" />
          <span>{LESSON_TEXT_TOKENS.quizTitle[language]}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {LESSON_TEXT_TOKENS.quizOptions.map((option, index) => (
            <Button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={showFeedback}
              variant="outline"
              className={`w-full p-4 text-left h-auto justify-start transition-all duration-300 ${
                selectedOption === option.id
                  ? isCorrect
                    ? 'bg-green-100 border-green-500 text-green-800 animate-pulse-success'
                    : 'bg-red-100 border-red-500 text-red-800 animate-shake-error'
                  : 'hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                  selectedOption === option.id
                    ? isCorrect
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-red-500 border-red-500 text-white'
                    : 'border-slate-300 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-mono text-lg">{option.text[language]}</span>
                {selectedOption === option.id && (
                  <div className="ml-auto">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <X className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        {showFeedback && selectedOption && (
          <div className={`mt-4 p-4 rounded-lg border-l-4 ${
            isCorrect 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
          } animate-fade-in`}>
            <p className="font-medium">
              {LESSON_TEXT_TOKENS.quizOptions
                .find(opt => opt.id === selectedOption)
                ?.explanation[language]}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Lesson Component
export const WhatIsASetLesson: React.FC<WhatIsASetLessonProps> = ({
  language,
  onComplete,
  onNext,
  className = ''
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [progress, setProgress] = useState(0);

  const stages = LESSON_ANIMATION_CONFIG.stages;
  const totalDuration = LESSON_ANIMATION_CONFIG.totalDuration;

  // Animation control
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && currentStage < stages.length) {
      const currentStageDuration = stages[currentStage].duration;
      
      timer = setTimeout(() => {
        if (currentStage < stages.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setIsPlaying(false);
          setShowQuiz(true);
        }
      }, currentStageDuration);

      // Update progress
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          const increment = (100 / totalDuration) * 100; // 100ms intervals
          const newProgress = Math.min(prev + increment, 100);
          return newProgress;
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(progressTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentStage, stages, totalDuration]);

  const handlePlay = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
      setCurrentStage(0);
      setProgress(0);
    }
    setIsPlaying(true);
  }, [hasStarted]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReplay = useCallback(() => {
    setCurrentStage(0);
    setIsPlaying(false);
    setShowQuiz(false);
    setProgress(0);
    setHasStarted(false);
  }, []);

  const handleQuizComplete = useCallback((score: number) => {
    setTimeout(() => {
      onComplete?.();
    }, 1500);
  }, [onComplete]);

  const handleNext = useCallback(() => {
    onNext?.();
  }, [onNext]);

  if (showQuiz) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 ${className}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2">
              Lesson Complete • Quick Assessment
            </Badge>
          </div>
          
          <MicroQuiz language={language} onComplete={handleQuizComplete} />
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white px-8 py-3"
            >
              Continue to Next Lesson
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 ${className}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-center space-x-4 mb-8">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                index === currentStage && hasStarted
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                  : index < currentStage && hasStarted
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${
                index === currentStage && hasStarted
                  ? 'bg-blue-500 animate-pulse'
                  : index < currentStage && hasStarted
                  ? 'bg-green-500'
                  : 'bg-slate-400'
              }`} />
              <span className="text-sm font-medium">{index + 1}</span>
            </div>
          ))}
        </div>

        {/* Main Animation Area */}
        <Card className="w-full bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardContent className="p-8 min-h-[400px] flex items-center justify-center">
            {hasStarted ? (
              <AnimationStage
                stage={stages[currentStage]?.id}
                isActive={isPlaying || (!isPlaying && hasStarted)}
                language={language}
              />
            ) : (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {LESSON_TEXT_TOKENS.title[language]}
                  </h2>
                  <p className="text-slate-600">
                    {language === 'en' && 'Ready to learn about sets? Click play to begin!'}
                    {language === 'hi' && 'सेट के बारे में सीखने के लिए तैयार? शुरू करने के लिए प्ले क्लिक करें!'}
                    {language === 'or' && 'ସେଟ୍ ବିଷୟରେ ଶିଖିବାକୁ ପ୍ରସ୍ତୁତ? ଆରମ୍ଭ କରିବା ପାଇଁ ପ୍ଲେ କ୍ଲିକ୍ କରନ୍ତୁ!'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Control Panel */}
        <div className="flex justify-center space-x-4">
          {!isPlaying ? (
            <Button
              onClick={handlePlay}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              {hasStarted ? 'Resume' : 'Start Lesson'}
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}

          <Button
            onClick={handleReplay}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Replay
          </Button>

          <Button
            onClick={() => setShowQuiz(true)}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            disabled={!hasStarted}
          >
            Skip to Quiz
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Current Stage Info */}
        {hasStarted && (
          <div className="text-center">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2">
              Stage {currentStage + 1} of {stages.length}: {stages[currentStage]?.title}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatIsASetLesson;