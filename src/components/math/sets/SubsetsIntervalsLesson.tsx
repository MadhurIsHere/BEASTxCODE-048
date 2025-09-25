import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import type { Language } from '../../../types/onboarding';

interface SubsetsIntervalsLessonProps {
  language: Language;
  onComplete: () => void;
  onBack: () => void;
}

interface SubsetQuestion {
  setA: number[];
  setB: number[];
  isSubset: boolean;
  explanation: {
    en: string;
    hi: string;
    or: string;
  };
}

interface IntervalQuestion {
  interval: string;
  leftBracket: '[' | '(';
  rightBracket: ']' | ')';
  start: number;
  end: number;
  testValue: number;
  isIncluded: boolean;
  explanation: {
    en: string;
    hi: string;
    or: string;
  };
}

const subsetQuestions: SubsetQuestion[] = [
  {
    setA: [1, 2, 3, 4, 5],
    setB: [2, 4],
    isSubset: true,
    explanation: {
      en: "Every element of B (2, 4) is also in A, so B ⊆ A",
      hi: "B के सभी तत्व (2, 4) A में भी हैं, इसलिए B ⊆ A",
      or: "B ର ସମସ୍ତ ଉପାଦାନ (2, 4) A ରେ ମଧ୍ୟ ଅଛି, ତେଣୁ B ⊆ A"
    }
  },
  {
    setA: [1, 3, 5],
    setB: [2, 4, 6],
    isSubset: false,
    explanation: {
      en: "Elements 2, 4, 6 from B are not in A, so B ⊈ A",
      hi: "B के तत्व 2, 4, 6 A में नहीं हैं, इसलिए B ⊈ A",
      or: "B ର ଉପାଦାନ 2, 4, 6 A ରେ ନାହିଁ, ତେଣୁ B ⊈ A"
    }
  },
  {
    setA: [1, 2, 3],
    setB: [1, 2, 3],
    isSubset: true,
    explanation: {
      en: "A = B, so every set is a subset of itself (improper subset)",
      hi: "A = B, इसलिए हर समुच्चय अपना उपसमुच्चय है (अनुचित उपसमुच्चय)",
      or: "A = B, ତେଣୁ ପ୍ରତ୍ୟେକ ସେଟ୍ ନିଜର ଉପସେଟ୍ (ଅନୁପଯୁକ୍ତ ଉପସେଟ୍)"
    }
  }
];

const intervalQuestions: IntervalQuestion[] = [
  {
    interval: "[2, 5)",
    leftBracket: '[',
    rightBracket: ')',
    start: 2,
    end: 5,
    testValue: 2,
    isIncluded: true,
    explanation: {
      en: "2 is included because we use [2 (closed bracket)",
      hi: "2 शामिल है क्योंकि हम [2 (बंद कोष्ठक) का उपयोग करते हैं",
      or: "2 ଅନ୍ତର୍ଭୁକ୍ତ କାରଣ ଆମେ [2 (ବନ୍ଦ ବ୍ରାକେଟ୍) ବ୍ୟବହାର କରୁଛି"
    }
  },
  {
    interval: "(1, 4]",
    leftBracket: '(',
    rightBracket: ']',
    start: 1,
    end: 4,
    testValue: 1,
    isIncluded: false,
    explanation: {
      en: "1 is not included because we use (1 (open bracket)",
      hi: "1 शामिल नहीं है क्योंकि हम (1 (खुला कोष्ठक) का उपयोग करते हैं",
      or: "1 ଅନ୍ତର୍ଭୁକ୍ତ ନୁହେଁ କାରଣ ଆମେ (1 (ଖୋଲା ବ୍ରାକେଟ୍) ବ୍ୟବହାର କରୁଛି"
    }
  },
  {
    interval: "[0, 3]",
    leftBracket: '[',
    rightBracket: ']',
    start: 0,
    end: 3,
    testValue: 3,
    isIncluded: true,
    explanation: {
      en: "3 is included because we use 3] (closed bracket)",
      hi: "3 शामिल है क्योंकि हम 3] (बंद कोष्ठक) का उपयोग करते हैं",
      or: "3 ଅନ୍ତର୍ଭୁକ୍ତ କାରଣ ଆମେ 3] (ବନ୍ଦ ବ୍ରାକେଟ୍) ବ୍ୟବହାର କରୁଛି"
    }
  }
];

const translations = {
  en: {
    title: "Subsets & Intervals",
    universalSet: "Universal Set",
    universalSetDescription: "The universal set U contains all elements we're considering in our context",
    properSubset: "Proper Subset",
    improperSubset: "Improper Subset",
    subsetSymbol: "⊆",
    properSubsetSymbol: "⊂",
    intervals: "Intervals",
    intervalsDescription: "Intervals represent continuous ranges of numbers",
    closedInterval: "Closed Interval",
    openInterval: "Open Interval",
    halfOpenInterval: "Half-Open Interval",
    cardinality: "Cardinality",
    cardinalityDescription: "The number of elements in a finite set",
    cardinalityNotation: "|A| represents the cardinality of set A",
    quizSubset: "Is B a subset of A?",
    quizInterval: "Is the value included in the interval?",
    yes: "Yes",
    no: "No",
    correct: "Correct!",
    incorrect: "Incorrect",
    explanation: "Explanation:",
    next: "Next",
    previous: "Previous",
    complete: "Complete Lesson",
    playNarration: "Play Narration",
    pauseNarration: "Pause Narration",
    resetLesson: "Reset Lesson",
    toggleAudio: "Toggle Audio",
    universalSetExample: "U = {all natural numbers}",
    exampleA: "A = {1, 2, 3, 4}",
    exampleB: "B = {2, 4}",
    properExample: "B ⊂ A (B is properly contained in A)",
    improperExample: "A ⊆ A (every set is a subset of itself)",
    intervalTypes: {
      closed: "[a, b] includes both endpoints",
      open: "(a, b) excludes both endpoints", 
      halfOpen: "[a, b) or (a, b] includes one endpoint"
    },
    clickToToggle: "Click brackets to toggle open/closed",
    included: "Included",
    excluded: "Excluded"
  },
  hi: {
    title: "उपसमुच्चय और अंतराल",
    universalSet: "सार्वत्रिक समुच्चय",
    universalSetDescription: "सार्वत्रिक समुच्चय U में हमारे संदर्भ के सभी तत्व होते हैं",
    properSubset: "उचित उपसमुच्चय",
    improperSubset: "अनुचित उपसमुच्चय",
    subsetSymbol: "⊆",
    properSubsetSymbol: "⊂",
    intervals: "अंतराल",
    intervalsDescription: "अंतराल संख्याओं की निरंतर श्रेणी को दर्शाते हैं",
    closedInterval: "बंद अंतराल",
    openInterval: "खुला अंतराल",
    halfOpenInterval: "अर्ध-खुला अंतराल",
    cardinality: "गणनीयता",
    cardinalityDescription: "परिमित समुच्चय में तत्वों की संख्या",
    cardinalityNotation: "|A| समुच्चय A की गणनीयता दर्शाता है",
    quizSubset: "क्या B, A का उपसमुच्चय है?",
    quizInterval: "क्या यह मान अंतराल में शामिल है?",
    yes: "हाँ",
    no: "नहीं",
    correct: "सही!",
    incorrect: "गलत",
    explanation: "व्याख्या:",
    next: "अगला",
    previous: "पिछला",
    complete: "पाठ पूरा करें",
    playNarration: "कथन चलाएं",
    pauseNarration: "कथन रोकें",
    resetLesson: "पाठ रीसेट करें",
    toggleAudio: "ऑडियो टॉगल करें",
    universalSetExample: "U = {सभी प्राकृतिक संख्याएं}",
    exampleA: "A = {1, 2, 3, 4}",
    exampleB: "B = {2, 4}",
    properExample: "B ⊂ A (B, A में उचित रूप से निहित है)",
    improperExample: "A ⊆ A (हर समुच्चय अपना उपसमुच्चय है)",
    intervalTypes: {
      closed: "[a, b] दोनों सिरों को शामिल करता है",
      open: "(a, b) दोनों सिरों को बाहर करता है",
      halfOpen: "[a, b) या (a, b] एक सिरे को शामिल करता है"
    },
    clickToToggle: "खुले/बंद टॉगल करने के लिए कोष्ठक पर क्लिक करें",
    included: "शामिल",
    excluded: "बाहर"
  },
  or: {
    title: "ଉପସେଟ୍ ଏବଂ ବ୍ୟବଧାନ",
    universalSet: "ସର୍ବଜନୀନ ସେଟ୍",
    universalSetDescription: "ସର୍ବଜନୀନ ସେଟ୍ U ରେ ଆମର ପ୍ରସଙ୍ଗରେ ବିଚାର କରୁଥିବା ସମସ୍ତ ଉପାଦାନ ଅଛି",
    properSubset: "ଉପଯୁକ୍ତ ଉପସେଟ୍",
    improperSubset: "ଅନୁପଯୁକ୍ତ ଉପସେଟ୍",
    subsetSymbol: "⊆",
    properSubsetSymbol: "⊂",
    intervals: "ବ୍ୟବଧାନ",
    intervalsDescription: "ବ୍ୟବଧାନ ସଂଖ୍ୟାର ନିରନ୍ତର ପରିସର ଦର୍ଶାଏ",
    closedInterval: "ବନ୍ଦ ବ୍ୟବଧାନ",
    openInterval: "ଖୋଲା ବ୍ୟବଧାନ",
    halfOpenInterval: "ଅର୍ଦ୍ଧ-ଖୋଲା ବ୍ୟବଧାନ",
    cardinality: "ଗଣନୀୟତା",
    cardinalityDescription: "ସୀମିତ ସେଟରେ ଉପାଦାନ ସଂଖ୍ୟା",
    cardinalityNotation: "|A| ସେଟ୍ A ର ଗଣନୀୟତା ଦର୍ଶାଏ",
    quizSubset: "B କ'ଣ A ର ଉପସେଟ୍?",
    quizInterval: "ଏହି ମୂଲ୍�� ବ୍ୟବଧାନରେ ଅନ୍ତର୍ଭୁକ୍ତ କି?",
    yes: "ହଁ",
    no: "ନା",
    correct: "ସଠିକ୍!",
    incorrect: "ଭୁଲ",
    explanation: "ବ୍ୟାଖ୍ୟା:",
    next: "ପରବର୍ତ୍ତୀ",
    previous: "ପୂର୍ବବର୍ତ୍ତୀ",
    complete: "ପାଠ ସମାପ୍ତ କରନ୍ତୁ",
    playNarration: "ବର୍ଣ୍ଣନା ଚଲାନ୍ତୁ",
    pauseNarration: "ବର୍ଣ୍ଣନା ବିରତ କରନ୍ତୁ",
    resetLesson: "ପାଠ ରିସେଟ୍ କରନ୍ତୁ",
    toggleAudio: "ଅଡିଓ ଟୋଗଲ୍ କରନ୍ତୁ",
    universalSetExample: "U = {ସମସ୍ତ ପ୍ରାକୃତିକ ସଂଖ୍ୟା}",
    exampleA: "A = {1, 2, 3, 4}",
    exampleB: "B = {2, 4}",
    properExample: "B ⊂ A (B, A ରେ ଉପଯୁକ୍ତ ଭାବରେ ଅନ୍ତର୍ଭୁକ୍ତ)",
    improperExample: "A ⊆ A (ପ୍ରତ୍ୟେକ ସେଟ୍ ନିଜର ଉପସେଟ୍)",
    intervalTypes: {
      closed: "[a, b] ଉଭୟ ଶେଷ ବିନ୍ଦୁ ଅନ୍ତର୍ଭୁକ୍ତ କରେ",
      open: "(a, b) ଉଭୟ ଶେଷ ବିନ୍ଦୁ ବାଦ ଦିଏ",
      halfOpen: "[a, b) କିମ୍ବା (a, b] ଗୋଟିଏ ଶେଷ ବିନ୍ଦୁ ଅନ୍ତର୍ଭୁକ୍ତ କରେ"
    },
    clickToToggle: "ଖୋଲା/ବନ୍ଦ ଟୋଗଲ୍ କରିବାକୁ ବ୍ରାକେଟ୍ କ୍ଲିକ୍ କରନ୍ତୁ",
    included: "ଅନ୍ତର୍ଭୁକ୍ତ",
    excluded: "ବାଦ"
  }
};

export function SubsetsIntervalsLesson({ language, onComplete, onBack }: SubsetsIntervalsLessonProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Quiz states
  const [currentSubsetQuestion, setCurrentSubsetQuestion] = useState(0);
  const [currentIntervalQuestion, setCurrentIntervalQuestion] = useState(0);
  const [subsetAnswer, setSubsetAnswer] = useState<boolean | null>(null);
  const [intervalAnswer, setIntervalAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Interval interactive states
  const [leftBracket, setLeftBracket] = useState<'[' | '('>('[');
  const [rightBracket, setRightBracket] = useState<']' | ')'>(')')
  const [intervalStart] = useState(2);
  const [intervalEnd] = useState(5);
  const [testValue] = useState(3);

  const t = translations[language];

  const stages = [
    { id: 'universal-set', title: t.universalSet },
    { id: 'subsets', title: t.properSubset },
    { id: 'intervals', title: t.intervals },
    { id: 'cardinality', title: t.cardinality },
    { id: 'quiz', title: 'Quiz' }
  ];

  const resetAnimation = useCallback(() => {
    setAnimationKey(prev => prev + 1);
  }, []);

  const nextStage = useCallback(() => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
      resetAnimation();
    }
  }, [currentStage, stages.length, resetAnimation]);

  const prevStage = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
      resetAnimation();
    }
  }, [currentStage, resetAnimation]);

  const handleSubsetAnswer = useCallback((answer: boolean) => {
    setSubsetAnswer(answer);
    setShowFeedback(true);
    setTimeout(() => {
      if (currentSubsetQuestion < subsetQuestions.length - 1) {
        setCurrentSubsetQuestion(prev => prev + 1);
        setSubsetAnswer(null);
        setShowFeedback(false);
      }
    }, 3000);
  }, [currentSubsetQuestion]);

  const handleIntervalAnswer = useCallback((answer: boolean) => {
    setIntervalAnswer(answer);
    setShowFeedback(true);
    setTimeout(() => {
      if (currentIntervalQuestion < intervalQuestions.length - 1) {
        setCurrentIntervalQuestion(prev => prev + 1);
        setIntervalAnswer(null);
        setShowFeedback(false);
      }
    }, 3000);
  }, [currentIntervalQuestion]);

  // Universal Set SVG Component
  const UniversalSetDiagram = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto">
      {/* Universal Set U */}
      <rect
        x="20"
        y="20"
        width="360"
        height="260"
        rx="20"
        fill="rgba(99, 102, 241, 0.1)"
        stroke="#6366f1"
        strokeWidth="3"
        strokeDasharray="10, 5"
        className="animate-set-container-expand"
        style={{ animationDelay: '0.2s' }}
      />
      <text x="40" y="45" className="text-lg font-semibold fill-indigo-700">U</text>
      <text x="40" y="270" className="text-sm fill-indigo-600">{t.universalSetExample}</text>

      {/* Set A */}
      <ellipse
        cx="150"
        cy="120"
        rx="80"
        ry="60"
        fill="rgba(34, 197, 94, 0.2)"
        stroke="#22c55e"
        strokeWidth="2"
        className="animate-bounce-in"
        style={{ animationDelay: '0.6s' }}
      />
      <text x="135" y="95" className="text-base font-semibold fill-green-700">A</text>
      <text x="120" y="115" className="text-sm fill-green-600">1</text>
      <text x="140" y="135" className="text-sm fill-green-600">2</text>
      <text x="160" y="115" className="text-sm fill-green-600">3</text>
      <text x="140" y="155" className="text-sm fill-green-600">4</text>

      {/* Set B (subset of A) */}
      <ellipse
        cx="170"
        cy="130"
        rx="35"
        ry="25"
        fill="rgba(245, 158, 11, 0.3)"
        stroke="#f59e0b"
        strokeWidth="2"
        className="animate-bounce-in"
        style={{ animationDelay: '1s' }}
      />
      <text x="175" y="120" className="text-base font-semibold fill-amber-700">B</text>
      <text x="160" y="135" className="text-sm fill-amber-600">2</text>
      <text x="175" y="145" className="text-sm fill-amber-600">4</text>

      {/* Elements outside A but in U */}
      <circle cx="300" cy="80" r="8" fill="#6366f1" className="animate-number-slide" style={{ animationDelay: '1.4s' }} />
      <text x="295" y="85" className="text-sm fill-white font-semibold">6</text>
      <circle cx="320" cy="200" r="8" fill="#6366f1" className="animate-number-slide" style={{ animationDelay: '1.6s' }} />
      <text x="315" y="205" className="text-sm fill-white font-semibold">7</text>
      <circle cx="280" cy="150" r="8" fill="#6366f1" className="animate-number-slide" style={{ animationDelay: '1.8s' }} />
      <text x="275" y="155" className="text-sm fill-white font-semibold">8</text>
    </svg>
  );

  // Subset Relationship SVG Component
  const SubsetDiagram = () => (
    <svg width="400" height="350" viewBox="0 0 400 350" className="mx-auto">
      {/* Proper Subset Example */}
      <g transform="translate(0, 20)">
        <text x="200" y="20" className="text-lg font-semibold fill-gray-800 text-anchor-middle">
          {t.properSubset}
        </text>
        
        <ellipse
          cx="120"
          cy="80"
          rx="60"
          ry="45"
          fill="rgba(34, 197, 94, 0.15)"
          stroke="#22c55e"
          strokeWidth="2"
          className="animate-set-container-expand"
        />
        <text x="105" y="60" className="text-base font-semibold fill-green-700">A</text>
        
        <ellipse
          cx="135"
          cy="85"
          rx="25"
          ry="20"
          fill="rgba(245, 158, 11, 0.3)"
          stroke="#f59e0b"
          strokeWidth="2"
          className="animate-bounce-in"
          style={{ animationDelay: '0.5s' }}
        />
        <text x="140" y="70" className="text-sm font-semibold fill-amber-700">B</text>
        
        {/* Proper subset symbol */}
        <text x="200" y="90" className="text-2xl font-bold fill-purple-600 animate-symbol-appear" style={{ animationDelay: '1s' }}>
          B ⊂ A
        </text>
        <text x="170" y="110" className="text-sm fill-gray-600">
          {t.properExample}
        </text>
      </g>

      {/* Improper Subset Example */}
      <g transform="translate(0, 180)">
        <text x="200" y="20" className="text-lg font-semibold fill-gray-800 text-anchor-middle">
          {t.improperSubset}
        </text>
        
        <ellipse
          cx="120"
          cy="80"
          rx="60"
          ry="45"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="#a855f7"
          strokeWidth="2"
          className="animate-set-container-expand"
          style={{ animationDelay: '0.3s' }}
        />
        <text x="105" y="60" className="text-base font-semibold fill-purple-700">C</text>
        
        <ellipse
          cx="120"
          cy="80"
          rx="60"
          ry="45"
          fill="rgba(168, 85, 247, 0.1)"
          stroke="#a855f7"
          strokeWidth="2"
          strokeDasharray="5, 3"
          className="animate-bounce-in"
          style={{ animationDelay: '0.8s' }}
        />
        <text x="135" y="65" className="text-base font-semibold fill-purple-700">D</text>
        
        {/* Improper subset symbol */}
        <text x="200" y="90" className="text-2xl font-bold fill-purple-600 animate-symbol-appear" style={{ animationDelay: '1.3s' }}>
          C ⊆ C
        </text>
        <text x="170" y="110" className="text-sm fill-gray-600">
          {t.improperExample}
        </text>
      </g>
    </svg>
  );

  // Interactive Number Line Component
  const InteractiveNumberLine = () => {
    const isIncluded = (value: number) => {
      if (value < intervalStart || value > intervalEnd) return false;
      if (value === intervalStart && leftBracket === '(') return false;
      if (value === intervalEnd && rightBracket === ')') return false;
      return true;
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{t.clickToToggle}</h3>
          <div className="inline-flex items-center space-x-2 text-2xl font-mono">
            <button
              onClick={() => setLeftBracket(leftBracket === '[' ? '(' : '[')}
              className="px-2 py-1 rounded hover:bg-blue-100 transition-colors"
            >
              {leftBracket}
            </button>
            <span>{intervalStart}, {intervalEnd}</span>
            <button
              onClick={() => setRightBracket(rightBracket === ']' ? ')' : ']')}
              className="px-2 py-1 rounded hover:bg-blue-100 transition-colors"
            >
              {rightBracket}
            </button>
          </div>
        </div>

        <svg width="400" height="120" viewBox="0 0 400 120" className="mx-auto">
          {/* Number line */}
          <line x1="50" y1="60" x2="350" y2="60" stroke="#374151" strokeWidth="2" />
          
          {/* Tick marks and numbers */}
          {[0, 1, 2, 3, 4, 5, 6].map(num => (
            <g key={num}>
              <line x1={50 + num * 50} y1="55" x2={50 + num * 50} y2="65" stroke="#374151" strokeWidth="2" />
              <text x={50 + num * 50} y="80" className="text-sm fill-gray-700 text-anchor-middle">{num}</text>
            </g>
          ))}
          
          {/* Interval highlighting */}
          <line
            x1={50 + intervalStart * 50}
            y1={60}
            x2={50 + intervalEnd * 50}
            y2={60}
            stroke="#3b82f6"
            strokeWidth="6"
            className="animate-fade-in"
          />
          
          {/* Start point */}
          <circle
            cx={50 + intervalStart * 50}
            cy={60}
            r="6"
            fill={leftBracket === '[' ? '#3b82f6' : 'white'}
            stroke="#3b82f6"
            strokeWidth="3"
            className="animate-bounce-in"
          />
          
          {/* End point */}
          <circle
            cx={50 + intervalEnd * 50}
            cy={60}
            r="6"
            fill={rightBracket === ']' ? '#3b82f6' : 'white'}
            stroke="#3b82f6"
            strokeWidth="3"
            className="animate-bounce-in"
            style={{ animationDelay: '0.2s' }}
          />
          
          {/* Test value */}
          <circle
            cx={50 + testValue * 50}
            cy={40}
            r="8"
            fill={isIncluded(testValue) ? '#22c55e' : '#ef4444'}
            className="animate-pulse-glow"
          />
          <text x={50 + testValue * 50} y={45} className="text-sm fill-white font-semibold text-anchor-middle">{testValue}</text>
          <text x={50 + testValue * 50} y={30} className={`text-xs font-semibold text-anchor-middle ${
            isIncluded(testValue) ? 'fill-green-600' : 'fill-red-600'
          }`}>
            {isIncluded(testValue) ? t.included : t.excluded}
          </text>
        </svg>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">{t.intervalTypes.closed}</p>
          <p className="text-sm text-gray-600">{t.intervalTypes.open}</p>
          <p className="text-sm text-gray-600">{t.intervalTypes.halfOpen}</p>
        </div>
      </div>
    );
  };

  // Cardinality Diagram
  const CardinalityDiagram = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">{t.cardinality}</h3>
        <p className="text-gray-600 mb-6">{t.cardinalityDescription}</p>
        <div className="inline-block p-4 bg-purple-50 rounded-lg border-2 border-purple-300">
          <p className="text-lg font-mono">{t.cardinalityNotation}</p>
        </div>
      </div>

      <svg width="400" height="250" viewBox="0 0 400 250" className="mx-auto">
        {/* Set A with cardinality */}
        <ellipse
          cx="120"
          cy="120"
          rx="80"
          ry="60"
          fill="rgba(34, 197, 94, 0.15)"
          stroke="#22c55e"
          strokeWidth="2"
          className="animate-set-container-expand"
        />
        <text x="60" y="80" className="text-lg font-semibold fill-green-700">A = {1, 2, 3, 4}</text>
        
        {/* Elements with counting animation */}
        {[1, 2, 3, 4].map((num, index) => (
          <g key={num}>
            <circle
              cx={90 + (index % 2) * 60}
              cy={110 + Math.floor(index / 2) * 30}
              r="12"
              fill="#22c55e"
              className="animate-marble-drop"
              style={{ animationDelay: `${index * 0.3}s` }}
            />
            <text
              x={90 + (index % 2) * 60}
              y={115 + Math.floor(index / 2) * 30}
              className="text-sm fill-white font-semibold text-anchor-middle"
            >
              {num}
            </text>
          </g>
        ))}
        
        {/* Cardinality notation */}
        <text x="120" y="200" className="text-xl font-bold fill-purple-600 text-anchor-middle animate-cardinality-count" style={{ animationDelay: '1.5s' }}>
          |A| = 4
        </text>

        {/* Set B with cardinality */}
        <ellipse
          cx="280"
          cy="120"
          rx="60"
          ry="50"
          fill="rgba(245, 158, 11, 0.15)"
          stroke="#f59e0b"
          strokeWidth="2"
          className="animate-set-container-expand"
          style={{ animationDelay: '0.5s' }}
        />
        <text x="240" y="80" className="text-lg font-semibold fill-amber-700">B = {2, 4}</text>
        
        {/* Elements */}
        {[2, 4].map((num, index) => (
          <g key={num}>
            <circle
              cx={260 + index * 40}
              cy={120}
              r="12"
              fill="#f59e0b"
              className="animate-marble-drop"
              style={{ animationDelay: `${(index + 4) * 0.3}s` }}
            />
            <text
              x={260 + index * 40}
              y={125}
              className="text-sm fill-white font-semibold text-anchor-middle"
            >
              {num}
            </text>
          </g>
        ))}
        
        {/* Cardinality notation */}
        <text x="280" y="200" className="text-xl font-bold fill-purple-600 text-anchor-middle animate-cardinality-count" style={{ animationDelay: '2.5s' }}>
          |B| = 2
        </text>
      </svg>
    </div>
  );

  // Quiz Component
  const QuizSection = () => {
    const currentSubset = subsetQuestions[currentSubsetQuestion];
    const currentInterval = intervalQuestions[currentIntervalQuestion];
    
    return (
      <div className="space-y-8">
        {/* Subset Quiz */}
        <Card className="p-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">{t.quizSubset}</h3>
            <div className="space-y-4">
              <div className="flex justify-around">
                <div className="text-center">
                  <p className="font-semibold">A = {`{${currentSubset.setA.join(', ')}}`}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">B = {`{${currentSubset.setB.join(', ')}}`}</p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => handleSubsetAnswer(true)}
                  disabled={subsetAnswer !== null}
                  className={`px-8 py-2 ${subsetAnswer === true ? 
                    (currentSubset.isSubset ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600') : 
                    'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {t.yes}
                </Button>
                <Button
                  onClick={() => handleSubsetAnswer(false)}
                  disabled={subsetAnswer !== null}
                  className={`px-8 py-2 ${subsetAnswer === false ? 
                    (!currentSubset.isSubset ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600') : 
                    'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {t.no}
                </Button>
              </div>
              
              {showFeedback && subsetAnswer !== null && (
                <div className={`p-4 rounded-lg ${
                  subsetAnswer === currentSubset.isSubset ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                } border-2 animate-quiz-feedback-slide`}>
                  <p className="font-semibold">
                    {subsetAnswer === currentSubset.isSubset ? t.correct : t.incorrect}
                  </p>
                  <p className="text-sm mt-2">
                    <strong>{t.explanation}</strong> {currentSubset.explanation[language]}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interval Quiz */}
        <Card className="p-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">{t.quizInterval}</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xl font-mono font-semibold">
                  {currentInterval.interval} and value = {currentInterval.testValue}
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => handleIntervalAnswer(true)}
                  disabled={intervalAnswer !== null}
                  className={`px-8 py-2 ${intervalAnswer === true ? 
                    (currentInterval.isIncluded ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600') : 
                    'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {t.yes}
                </Button>
                <Button
                  onClick={() => handleIntervalAnswer(false)}
                  disabled={intervalAnswer !== null}
                  className={`px-8 py-2 ${intervalAnswer === false ? 
                    (!currentInterval.isIncluded ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600') : 
                    'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {t.no}
                </Button>
              </div>
              
              {showFeedback && intervalAnswer !== null && (
                <div className={`p-4 rounded-lg ${
                  intervalAnswer === currentInterval.isIncluded ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
                } border-2 animate-quiz-feedback-slide`}>
                  <p className="font-semibold">
                    {intervalAnswer === currentInterval.isIncluded ? t.correct : t.incorrect}
                  </p>
                  <p className="text-sm mt-2">
                    <strong>{t.explanation}</strong> {currentInterval.explanation[language]}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStageContent = () => {
    switch (stages[currentStage].id) {
      case 'universal-set':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">{t.universalSet}</h2>
              <p className="text-gray-600 mb-6">{t.universalSetDescription}</p>
            </div>
            <UniversalSetDiagram />
          </div>
        );
      
      case 'subsets':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-6">Subset Relationships</h2>
            </div>
            <SubsetDiagram />
          </div>
        );
      
      case 'intervals':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">{t.intervals}</h2>
              <p className="text-gray-600 mb-6">{t.intervalsDescription}</p>
            </div>
            <InteractiveNumberLine />
          </div>
        );
      
      case 'cardinality':
        return (
          <div className="space-y-6">
            <CardinalityDiagram />
          </div>
        );
      
      case 'quiz':
        return <QuizSection />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <h1 className="text-xl font-semibold text-center">{t.title}</h1>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setAudioEnabled(!audioEnabled)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => {
                setCurrentStage(0);
                resetAnimation();
              }}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="flex justify-center py-4 space-x-2">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className={`stage-checkpoint px-3 py-1 rounded-full text-sm font-medium transition-all ${
              index === currentStage
                ? 'bg-blue-500 text-white animate-stage-indicator-pulse'
                : index < currentStage
                ? 'bg-green-500 text-white completed'
                : 'bg-slate-600 text-slate-300'
            }`}
          >
            {stage.title}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div key={animationKey} className="animate-lesson-fade-in">
            {renderStageContent()}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-t border-slate-700/50 p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Button
            onClick={prevStage}
            disabled={currentStage === 0}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t.previous}
          </Button>

          {currentStage === stages.length - 1 ? (
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
            >
              {t.complete}
            </Button>
          ) : (
            <Button
              onClick={nextStage}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8"
            >
              {t.next}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}