import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, CheckCircle, X, Infinity, Calculator } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import type { Language } from '../../../types/onboarding';

// Animation Configuration & Tokens (Export for Dev)
export const TYPES_LESSON_CONFIG = {
  stages: [
    {
      id: 'finite-infinite',
      duration: 5000, // 5 seconds
      title: 'Finite vs Infinite Sets',
      description: 'Compare finite and infinite collections'
    },
    {
      id: 'equal-sets',
      duration: 4000, // 4 seconds
      title: 'Equal Sets',
      description: 'Sets with identical elements'
    },
    {
      id: 'singleton-sets',
      duration: 3000, // 3 seconds
      title: 'Singleton Sets',
      description: 'Sets with exactly one element'
    },
    {
      id: 'power-sets',
      duration: 6000, // 6 seconds
      title: 'Power Sets',
      description: 'All possible subsets visualization'
    }
  ],
  totalDuration: 18000 // 18 seconds total
};

// Textual Tokens for Development
export const TYPES_TEXT_TOKENS = {
  title: {
    en: 'Types of Sets',
    hi: 'समुच्चयों के प्रकार',
    or: 'ସେଟ୍ର ପ୍ରକାର'
  },
  narrations: {
    finite: {
      en: 'Finite sets have a countable number of elements, like marbles in a jar.',
      hi: 'परिमित समुच्चयों में गिनती योग्य संख्या में तत्व होते हैं, जैसे जार में कंचे।',
      or: 'ସୀମିତ ସେଟରେ ଗଣନାଯୋଗ୍ୟ ସଂଖ୍ୟକ ଉପାଦାନ ଅଛି, ଯେପରି ପାତ୍ରରେ କାଚ ବଲ।'
    },
    infinite: {
      en: 'Infinite sets continue forever, like the set of natural numbers.',
      hi: 'अनंत समुच्चय हमेशा के लिए जारी रहते हैं, जैसे प्राकृतिक संख्याओं का समुच्चय।',
      or: 'ଅସୀମ ସେଟ୍ ସବୁଦିନ ପାଇଁ ଚାଲିଥାଏ, ଯେପରି ପ୍ରାକୃତିକ ସଂଖ୍ୟାର ସେଟ୍।'
    },
    equal: {
      en: 'Equal sets contain exactly the same elements.',
      hi: 'समान समुच्चयों में बिल्कुल समान तत्व होते हैं।',
      or: 'ସମାନ ସେଟରେ ସମାନ ଉପାଦାନ ଥାଏ।'
    },
    singleton: {
      en: 'A singleton set contains exactly one element.',
      hi: 'एकल समुच्चय में बिल्कुल एक तत्व होता है।',
      or: 'ଏକକ ସେଟରେ କେବଳ ଗୋଟିଏ ଉପାଦାନ ଥାଏ।'
    },
    powerset: {
      en: 'The power set contains all possible subsets of a set.',
      hi: 'घात समुच्चय में किसी समुच्चय के सभी संभावित उपसमुच्चय होते हैं।',
      or: 'ଶକ୍ତି ସେଟରେ ଗୋଟିଏ ସେଟର ସମସ୍ତ ସମ୍ଭାବ୍ୟ ସବସେଟ୍ ଥାଏ।'
    }
  },
  quizTitle: {
    en: 'Pick All Valid Subsets of {a, b, c}',
    hi: '{a, b, c} के सभी वैध उपसमुच्चय चुनें',
    or: '{a, b, c} ର ସମସ୍ତ ବୈଧ ସବସେଟ୍ ବାଛନ୍ତୁ'
  },
  subsetOptions: [
    {
      id: 'empty',
      text: '∅',
      isCorrect: true,
      explanation: {
        en: 'Empty set is a subset of every set',
        hi: 'रिक्त समुच्चय हर समुच्चय का उपसमुच्चय है',
        or: 'ଖାଲି ସେଟ୍ ପ୍ରତ୍ୟେକ ସେଟର ସବସେଟ୍'
      }
    },
    {
      id: 'single-a',
      text: '{a}',
      isCorrect: true,
      explanation: {
        en: 'Single elements form valid subsets',
        hi: 'एकल तत्व वैध उपसमुच्चय बनाते हैं',
        or: 'ଏକକ ଉପାଦାନ ବୈଧ ସବସେଟ୍ ଗଠନ କରେ'
      }
    },
    {
      id: 'pair-ab',
      text: '{a, b}',
      isCorrect: true,
      explanation: {
        en: 'Any combination of original elements is valid',
        hi: 'मूल तत्वों का कोई भी संयोजन वैध है',
        or: 'ମୂଳ ଉପାଦାନର କୌଣସି ସଂଯୋଗ ବୈଧ'
      }
    },
    {
      id: 'original',
      text: '{a, b, c}',
      isCorrect: true,
      explanation: {
        en: 'Every set is a subset of itself',
        hi: 'हर समुच्चय अपना उपसमुच्चय है',
        or: 'ପ୍ରତ୍ୟେକ ସେଟ୍ ନିଜର ସବସେଟ୍'
      }
    },
    {
      id: 'invalid-d',
      text: '{d}',
      isCorrect: false,
      explanation: {
        en: 'Element d is not in the original set',
        hi: 'तत्व d मूल समुच्चय में नहीं है',
        or: 'ଉପାଦାନ d ମୂଳ ସେଟରେ ନାହିଁ'
      }
    },
    {
      id: 'invalid-extra',
      text: '{a, b, c, d}',
      isCorrect: false,
      explanation: {
        en: 'Cannot add elements not in original set',
        hi: 'मूल समुच्चय में नहीं होने वाले तत्व नहीं जोड़ सकते',
        or: 'ମୂଳ ସେଟରେ ନଥିବା ଉପାଦାନ ଯୋଗ କରି ପାରିବେ ନାହିଁ'
      }
    },
    {
      id: 'single-b',
      text: '{b}',
      isCorrect: true,
      explanation: {
        en: 'Another valid single element subset',
        hi: 'एक और वैध एकल तत्व उपसमुच्चय',
        or: 'ଆଉ ଏକ ବୈଧ ଏକକ ଉପାଦାନ ସବସେଟ୍'
      }
    },
    {
      id: 'pair-bc',
      text: '{b, c}',
      isCorrect: true,
      explanation: {
        en: 'Valid pair combination',
        hi: 'वैध जोड़ी संयोजन',
        or: 'ବୈଧ ଯୋଡ଼ି ସଂଯୋଗ'
      }
    }
  ]
};

interface TypesOfSetsLessonProps {
  language: Language;
  onComplete?: () => void;
  onNext?: () => void;
  className?: string;
}

// SVG Components for Marbles and Containers
const SVGMarble: React.FC<{
  cx: number;
  cy: number;
  color: string;
  isAnimating?: boolean;
  delay?: number;
}> = ({ cx, cy, color, isAnimating = false, delay = 0 }) => (
  <g
    className={`transition-all duration-800 ${isAnimating ? 'animate-marble-drop' : ''}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <circle
      cx={cx}
      cy={cy}
      r="12"
      fill={color}
      stroke="#fff"
      strokeWidth="2"
      className="drop-shadow-md"
    />
    <circle
      cx={cx - 3}
      cy={cy - 3}
      r="3"
      fill="#ffffff"
      opacity="0.7"
    />
  </g>
);

const SVGJar: React.FC<{
  isVisible?: boolean;
  children?: React.ReactNode;
}> = ({ isVisible = false, children }) => (
  <g className={`transition-all duration-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
    {/* Jar body */}
    <path
      d="M 80 160 Q 80 180 100 180 L 200 180 Q 220 180 220 160 L 220 120 Q 220 100 200 100 L 100 100 Q 80 100 80 120 Z"
      fill="rgba(59, 130, 246, 0.1)"
      stroke="#3b82f6"
      strokeWidth="3"
    />
    {/* Jar lid */}
    <rect
      x="70"
      y="90"
      width="160"
      height="20"
      rx="10"
      fill="#6b7280"
      stroke="#4b5563"
      strokeWidth="2"
    />
    {/* Label */}
    <text
      x="150"
      y="200"
      textAnchor="middle"
      fontSize="14"
      fill="#1e40af"
      fontWeight="bold"
    >
      Finite Set
    </text>
    {children}
  </g>
);

const SVGInfiniteStream: React.FC<{
  isAnimating?: boolean;
}> = ({ isAnimating = false }) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7'];
  
  return (
    <g className={`${isAnimating ? 'animate-stream-flow' : ''}`}>
      {numbers.map((num, index) => (
        <g key={num}>
          <circle
            cx={50 + index * 40}
            cy={120}
            r="15"
            fill="#10b981"
            opacity={1 - (index * 0.12)}
            className={`transition-all duration-300 ${isAnimating ? 'animate-number-float' : ''}`}
            style={{ animationDelay: `${index * 200}ms` }}
          />
          <text
            x={50 + index * 40}
            y={127}
            textAnchor="middle"
            fontSize="12"
            fill="white"
            fontWeight="bold"
            opacity={1 - (index * 0.12)}
          >
            {num}
          </text>
        </g>
      ))}
      {/* Loop indicator */}
      <text
        x={350}
        y={127}
        textAnchor="middle"
        fontSize="18"
        fill="#10b981"
        fontWeight="bold"
        className={`${isAnimating ? 'animate-pulse' : ''}`}
      >
        ...∞
      </text>
      <text
        x={200}
        y={200}
        textAnchor="middle"
        fontSize="14"
        fill="#059669"
        fontWeight="bold"
      >
        Infinite Set (3s loop)
      </text>
    </g>
  );
};

const SVGEqualContainer: React.FC<{
  position: 'left' | 'right';
  symbols: string[];
  isAnimating?: boolean;
  showRibbon?: boolean;
}> = ({ position, symbols, isAnimating = false, showRibbon = false }) => {
  const x = position === 'left' ? 80 : 280;
  
  return (
    <g>
      {/* Container */}
      <rect
        x={x}
        y={100}
        width="120"
        height="80"
        rx="10"
        fill="rgba(139, 69, 19, 0.1)"
        stroke="#8b4513"
        strokeWidth="2"
        strokeDasharray="5,3"
        className={`${isAnimating ? 'animate-container-fill' : ''}`}
      />
      
      {/* Symbols */}
      {symbols.map((symbol, index) => (
        <text
          key={`${symbol}-${index}`}
          x={x + 30 + (index * 30)}
          y={145}
          textAnchor="middle"
          fontSize="20"
          fill="#8b4513"
          fontWeight="bold"
          className={`transition-all duration-500 ${isAnimating ? 'animate-symbol-appear' : ''}`}
          style={{ animationDelay: `${index * 300}ms` }}
        >
          {symbol}
        </text>
      ))}
      
      {/* Equal ribbon */}
      {showRibbon && (
        <g className="animate-ribbon-appear">
          <path
            d="M 150 50 L 250 50 L 270 70 L 250 90 L 150 90 L 130 70 Z"
            fill="#22c55e"
            stroke="#16a34a"
            strokeWidth="2"
          />
          <text
            x="200"
            y="75"
            textAnchor="middle"
            fontSize="14"
            fill="white"
            fontWeight="bold"
          >
            EQUAL
          </text>
        </g>
      )}
    </g>
  );
};

const SVGPowerSetGrid: React.FC<{
  baseSet: string[];
  isAnimating?: boolean;
  currentStep?: number;
}> = ({ baseSet = ['a', 'b', 'c'], isAnimating = false, currentStep = 0 }) => {
  const subsets = [
    '∅',
    '{a}',
    '{b}',
    '{c}',
    '{a,b}',
    '{a,c}',
    '{b,c}',
    '{a,b,c}'
  ];

  return (
    <g>
      {/* Grid title */}
      <text
        x="200"
        y="40"
        textAnchor="middle"
        fontSize="16"
        fill="#7c3aed"
        fontWeight="bold"
      >
        P({`{${baseSet.join(',')}}`}) = Power Set
      </text>
      
      {/* Formula */}
      <text
        x="200"
        y="60"
        textAnchor="middle"
        fontSize="14"
        fill="#7c3aed"
        className={`${isAnimating && currentStep >= 7 ? 'animate-formula-highlight' : ''}`}
      >
        |P(A)| = 2^n = 2^3 = 8
      </text>

      {/* Grid of subsets */}
      {subsets.map((subset, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const x = 50 + col * 100;
        const y = 90 + row * 60;
        const shouldShow = !isAnimating || index < currentStep;

        return (
          <g
            key={subset}
            className={`transition-all duration-500 ${shouldShow ? 'opacity-100' : 'opacity-0'} ${
              isAnimating ? 'animate-subset-appear' : ''
            }`}
            style={{ animationDelay: `${index * 400}ms` }}
          >
            <rect
              x={x - 25}
              y={y - 15}
              width="50"
              height="30"
              rx="5"
              fill="#f3e8ff"
              stroke="#7c3aed"
              strokeWidth="2"
            />
            <text
              x={x}
              y={y + 5}
              textAnchor="middle"
              fontSize="12"
              fill="#7c3aed"
              fontWeight="bold"
            >
              {subset}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// Animation Stage Component
const AnimationStage: React.FC<{
  stage: string;
  isActive: boolean;
  language: Language;
}> = ({ stage, isActive, language }) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setAnimationStep(prev => prev + 1);
      }, 500);

      return () => clearInterval(interval);
    } else {
      setAnimationStep(0);
    }
  }, [isActive]);

  switch (stage) {
    case 'finite-infinite':
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-blue-700 text-center">
            Finite vs Infinite Sets
          </h3>
          <p className="text-center text-slate-600 mb-6">
            {TYPES_TEXT_TOKENS.narrations.finite[language]}
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            {/* Finite Set */}
            <div className="text-center">
              <svg width="300" height="220" viewBox="0 0 300 220">
                <SVGJar isVisible={isActive}>
                  <SVGMarble cx={120} cy={130} color="#ef4444" isAnimating={isActive} delay={0} />
                  <SVGMarble cx={150} cy={135} color="#3b82f6" isAnimating={isActive} delay={200} />
                  <SVGMarble cx={180} cy={130} color="#10b981" isAnimating={isActive} delay={400} />
                  <SVGMarble cx={135} cy={155} color="#f59e0b" isAnimating={isActive} delay={600} />
                  <SVGMarble cx={165} cy={155} color="#8b5cf6" isAnimating={isActive} delay={800} />
                </SVGJar>
              </svg>
            </div>

            {/* Infinite Set */}
            <div className="text-center">
              <p className="text-slate-600 mb-4">
                {TYPES_TEXT_TOKENS.narrations.infinite[language]}
              </p>
              <svg width="400" height="220" viewBox="0 0 400 220">
                <SVGInfiniteStream isAnimating={isActive} />
              </svg>
            </div>
          </div>
        </div>
      );

    case 'equal-sets':
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-amber-700 text-center">
            Equal Sets
          </h3>
          <p className="text-center text-slate-600">
            {TYPES_TEXT_TOKENS.narrations.equal[language]}
          </p>
          
          <div className="flex justify-center">
            <svg width="500" height="200" viewBox="0 0 500 200">
              <SVGEqualContainer
                position="left"
                symbols={['★', '♦', '●']}
                isAnimating={isActive}
                showRibbon={isActive && animationStep >= 6}
              />
              <SVGEqualContainer
                position="right"
                symbols={['★', '♦', '●']}
                isAnimating={isActive}
                showRibbon={isActive && animationStep >= 6}
              />
              
              {/* Equals sign */}
              <text
                x="250"
                y="145"
                textAnchor="middle"
                fontSize="30"
                fill="#059669"
                fontWeight="bold"
                className={`${isActive && animationStep >= 4 ? 'animate-fade-in' : 'opacity-0'}`}
              >
                =
              </text>
            </svg>
          </div>
        </div>
      );

    case 'singleton-sets':
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-purple-700 text-center">
            Singleton Sets
          </h3>
          <p className="text-center text-slate-600">
            {TYPES_TEXT_TOKENS.narrations.singleton[language]}
          </p>
          
          <div className="flex justify-center space-x-8">
            {['{5}', '{★}', '{α}'].map((singleton, index) => (
              <div
                key={singleton}
                className={`bg-purple-50 border-2 border-purple-300 rounded-lg p-4 transition-all duration-500 ${
                  isActive ? 'animate-singleton-pulse' : ''
                }`}
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="text-2xl font-mono text-purple-800 text-center">
                  {singleton}
                </div>
                <div className="text-sm text-purple-600 text-center mt-2">
                  One element
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'power-sets':
      return (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-violet-700 text-center">
            Power Sets & Cardinality
          </h3>
          <p className="text-center text-slate-600">
            {TYPES_TEXT_TOKENS.narrations.powerset[language]}
          </p>
          
          <div className="flex justify-center">
            <svg width="400" height="200" viewBox="0 0 400 200">
              <SVGPowerSetGrid
                baseSet={['a', 'b', 'c']}
                isAnimating={isActive}
                currentStep={animationStep}
              />
            </svg>
          </div>

          {/* Interactive formula */}
          <div className="text-center">
            <div className={`inline-flex items-center space-x-2 bg-violet-50 border-2 border-violet-300 rounded-lg p-4 ${
              isActive ? 'animate-formula-glow' : ''
            }`}>
              <Calculator className="w-6 h-6 text-violet-600" />
              <span className="text-lg font-mono text-violet-800">
                |P({`{a,b,c}`})| = 2³ = 8 subsets
              </span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

// Interactive Quiz Component
const SubsetQuiz: React.FC<{
  language: Language;
  onComplete: (score: number) => void;
}> = ({ language, onComplete }) => {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionToggle = useCallback((optionId: string) => {
    if (submitted) return;
    
    setSelectedOptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(optionId)) {
        newSet.delete(optionId);
      } else {
        newSet.add(optionId);
      }
      return newSet;
    });
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setShowFeedback(true);

    const correctAnswers = TYPES_TEXT_TOKENS.subsetOptions.filter(opt => opt.isCorrect);
    const correctIds = new Set(correctAnswers.map(opt => opt.id));
    
    const correctSelections = Array.from(selectedOptions).filter(id => correctIds.has(id)).length;
    const incorrectSelections = Array.from(selectedOptions).filter(id => !correctIds.has(id)).length;
    
    const score = Math.max(0, (correctSelections - incorrectSelections) * (100 / correctAnswers.length));

    setTimeout(() => {
      onComplete(score);
    }, 3000);
  }, [selectedOptions, onComplete]);

  const getOptionStatus = useCallback((option: typeof TYPES_TEXT_TOKENS.subsetOptions[0]) => {
    if (!submitted) return 'default';
    
    const isSelected = selectedOptions.has(option.id);
    
    if (option.isCorrect && isSelected) return 'correct';
    if (option.isCorrect && !isSelected) return 'missed';
    if (!option.isCorrect && isSelected) return 'incorrect';
    return 'default';
  }, [selectedOptions, submitted]);

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
      <CardHeader>
        <CardTitle className="text-center text-violet-800 flex items-center justify-center space-x-2">
          <CheckCircle className="w-6 h-6" />
          <span>{TYPES_TEXT_TOKENS.quizTitle[language]}</span>
        </CardTitle>
        <p className="text-center text-slate-600 text-sm">
          Select all valid subsets. A subset can contain any combination of the original elements (or none).
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Options Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TYPES_TEXT_TOKENS.subsetOptions.map((option) => {
            const status = getOptionStatus(option);
            return (
              <Button
                key={option.id}
                onClick={() => handleOptionToggle(option.id)}
                disabled={submitted}
                variant="outline"
                className={`h-16 text-lg font-mono transition-all duration-300 ${
                  selectedOptions.has(option.id)
                    ? 'bg-violet-100 border-violet-400 text-violet-800'
                    : 'hover:bg-violet-50 hover:border-violet-300'
                } ${
                  status === 'correct' 
                    ? 'bg-green-100 border-green-500 text-green-800 animate-pulse-success'
                    : status === 'incorrect'
                    ? 'bg-red-100 border-red-500 text-red-800 animate-shake-error'
                    : status === 'missed'
                    ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
                    : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{option.text}</span>
                  {submitted && (
                    <div className="ml-auto">
                      {status === 'correct' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {status === 'incorrect' && <X className="w-4 h-4 text-red-600" />}
                      {status === 'missed' && <span className="text-yellow-600 text-xs">missed</span>}
                    </div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="space-y-3">
            {TYPES_TEXT_TOKENS.subsetOptions
              .filter(opt => selectedOptions.has(opt.id) || (submitted && opt.isCorrect))
              .map(option => {
                const status = getOptionStatus(option);
                return (
                  <div
                    key={option.id}
                    className={`p-3 rounded-lg border-l-4 animate-fade-in ${
                      status === 'correct'
                        ? 'bg-green-50 border-green-500 text-green-800'
                        : status === 'incorrect'
                        ? 'bg-red-50 border-red-500 text-red-800'
                        : status === 'missed'
                        ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
                        : 'bg-slate-50 border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold">{option.text}:</span>
                      <span>{option.explanation[language]}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Submit Button */}
        {!submitted && (
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white px-8 py-3"
              disabled={selectedOptions.size === 0}
            >
              Submit Answers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Lesson Component
export const TypesOfSetsLesson: React.FC<TypesOfSetsLessonProps> = ({
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

  const stages = TYPES_LESSON_CONFIG.stages;
  const totalDuration = TYPES_LESSON_CONFIG.totalDuration;

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
      <div className={`min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-6 ${className}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="bg-violet-100 text-violet-800 px-4 py-2">
              Lesson Complete • Interactive Assessment
            </Badge>
          </div>
          
          <SubsetQuiz language={language} onComplete={handleQuizComplete} />
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white px-8 py-3"
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
    <div className={`min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-6 ${className}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
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
                  ? 'bg-violet-100 text-violet-800 border-2 border-violet-300'
                  : index < currentStage && hasStarted
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${
                index === currentStage && hasStarted
                  ? 'bg-violet-500 animate-pulse'
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
          <CardContent className="p-8 min-h-[500px] flex items-center justify-center">
            {hasStarted ? (
              <AnimationStage
                stage={stages[currentStage]?.id}
                isActive={isPlaying || (!isPlaying && hasStarted)}
                language={language}
              />
            ) : (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {TYPES_TEXT_TOKENS.title[language]}
                  </h2>
                  <p className="text-slate-600">
                    {language === 'en' && 'Explore different types of sets with interactive animations!'}
                    {language === 'hi' && 'इंटरैक्टिव एनिमेशन के साथ विभिन्न प्रकार के समुच्चयों का अन्वेषण करें!'}
                    {language === 'or' && 'ଇଣ୍ଟରାକ୍ଟିଭ ଆନିମେସନ ସହିତ ବିଭିନ୍ନ ପ୍ରକାରର ସେଟ୍ ଅନ୍ୱେଷଣ କରନ୍ତୁ!'}
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
            className="border-violet-300 text-violet-700 hover:bg-violet-50 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            disabled={!hasStarted}
          >
            Skip to Quiz
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Current Stage Info */}
        {hasStarted && (
          <div className="text-center">
            <Badge variant="secondary" className="bg-violet-100 text-violet-800 px-4 py-2">
              Stage {currentStage + 1} of {stages.length}: {stages[currentStage]?.title}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypesOfSetsLesson;