import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import type { Language } from '../../../types/onboarding';

interface SetOperationsLessonProps {
  language: Language;
  onComplete: () => void;
  onBack: () => void;
}

interface QuizQuestion {
  id: string;
  question: {
    en: string;
    hi: string;
    or: string;
  };
  options: {
    id: string;
    label: {
      en: string;
      hi: string;
      or: string;
    };
    elements: number[];
  }[];
  correctOption: string;
  explanation: {
    en: string;
    hi: string;
    or: string;
  };
}

const translations = {
  en: {
    title: "Set Operations",
    union: "Union (A ∪ B)",
    intersection: "Intersection (A ∩ B)",
    difference: "Difference (A - B)",
    complement: "Complement (A')",
    unionDescription: "The union contains all elements from both sets",
    intersectionDescription: "The intersection contains only common elements",
    differenceDescription: "The difference contains elements in A but not in B",
    complementDescription: "The complement contains all elements in U that are NOT in A",
    formula: "Formula:",
    example: "Example:",
    showSolution: "Show Solution",
    replay: "Replay Animation",
    next: "Next",
    previous: "Previous",
    complete: "Complete Lesson",
    playNarration: "Play Narration",
    pauseNarration: "Pause Narration",
    resetLesson: "Reset Lesson",
    toggleAudio: "Toggle Audio",
    correct: "Correct!",
    incorrect: "Incorrect",
    explanation: "Explanation:",
    stepByStep: "Step by Step:",
    universalSet: "Universal Set U",
    setA: "Set A",
    setB: "Set B",
    elements: "Elements",
    included: "Included",
    excluded: "Excluded",
    animationComplete: "Animation Complete"
  },
  hi: {
    title: "समुच्चय संक्रियाएं",
    union: "संघ (A ∪ B)",
    intersection: "प्रतिच्छेदन (A ∩ B)",
    difference: "अंतर (A - B)",
    complement: "पूरक (A')",
    unionDescription: "संघ में दोनों समुच्चयों के सभी तत्व होते हैं",
    intersectionDescription: "प्रतिच्छेदन में केवल साझा तत्व होते हैं",
    differenceDescription: "अंतर में A के तत्व होते हैं लेकिन B के नहीं",
    complementDescription: "पूरक में U के सभी तत्व होते हैं जो A में नहीं हैं",
    formula: "सूत्र:",
    example: "उदाहरण:",
    showSolution: "समाधान दिखाएं",
    replay: "एनीमेशन दोहराएं",
    next: "अगला",
    previous: "पिछला",
    complete: "पाठ पूरा करें",
    playNarration: "कथन चलाएं",
    pauseNarration: "कथन रोकें",
    resetLesson: "पाठ रीसेट करें",
    toggleAudio: "ऑडियो टॉगल करें",
    correct: "सही!",
    incorrect: "गलत",
    explanation: "व्याख्या:",
    stepByStep: "चरणबद्ध:",
    universalSet: "सार्वत्रिक समुच्चय U",
    setA: "समुच्चय A",
    setB: "समुच्चय B",
    elements: "तत्व",
    included: "शामिल",
    excluded: "बाहर",
    animationComplete: "एनीमेशन पूरा"
  },
  or: {
    title: "ସେଟ୍ ଅପରେସନ୍",
    union: "ମିଳନ (A ∪ B)",
    intersection: "ପ୍ରତିଛେଦ (A ∩ B)",
    difference: "ପାର୍ଥକ୍ୟ (A - B)",
    complement: "ପୂରକ (A')",
    unionDescription: "ମିଳନରେ ଉଭୟ ସେଟର ସମସ୍ତ ଉପାଦାନ ଥାଏ",
    intersectionDescription: "ପ୍ରତିଛେଦରେ କେବଳ ସାଧାରଣ ଉପାଦାନ ଥାଏ",
    differenceDescription: "ପାର୍ଥକ୍ୟରେ A ର ଉପାଦାନ ଥାଏ କିନ୍ତୁ B ର ନାହିଁ",
    complementDescription: "ପୂରକରେ U ର ସମସ୍ତ ଉପାଦାନ ଥାଏ ଯାହା A ରେ ନାହିଁ",
    formula: "ସୂତ୍ର:",
    example: "ଉଦାହରଣ:",
    showSolution: "ସମାଧାନ ଦେଖାନ୍ତୁ",
    replay: "ଆନିମେସନ ପୁନରାବୃତ୍ତି",
    next: "ପରବର୍ତ୍ତୀ",
    previous: "ପୂର୍ବବର୍ତ୍ତୀ",
    complete: "ପାଠ ସମାପ୍ତ କରନ୍ତୁ",
    playNarration: "ବର୍ଣ୍ଣନା ଚଲାନ୍ତୁ",
    pauseNarration: "ବର୍ଣ୍ଣନା ବିରତ କରନ୍ତୁ",
    resetLesson: "ପାଠ ରିସେଟ୍ କରନ୍ତୁ",
    toggleAudio: "ଅଡିଓ ଟୋଗଲ୍ କରନ୍ତୁ",
    correct: "ସଠିକ୍!",
    incorrect: "ଭୁଲ",
    explanation: "ବ୍ୟାଖ୍ୟା:",
    stepByStep: "ଧାପରେ ଧାପରେ:",
    universalSet: "ସର୍ବଜନୀନ ସେଟ୍ U",
    setA: "ସେଟ୍ A",
    setB: "ସେଟ୍ B",
    elements: "ଉପାଦାନ",
    included: "ଅନ୍ତର୍ଭୁକ୍ତ",
    excluded: "ବାଦ",
    animationComplete: "ଆନିମେସନ ସମାପ୍ତ"
  }
};

const quizQuestions: Record<string, QuizQuestion[]> = {
  union: [
    {
      id: 'union-1',
      question: {
        en: "Which elements are in A ∪ B?",
        hi: "A ∪ B में कौन से तत्व हैं?",
        or: "A ∪ B ରେ କେଉଁ ଉପାଦାନ ଅଛି?"
      },
      options: [
        {
          id: 'a',
          label: { en: "{1, 2, 3}", hi: "{1, 2, 3}", or: "{1, 2, 3}" },
          elements: [1, 2, 3]
        },
        {
          id: 'b',
          label: { en: "{1, 2, 3, 4, 5}", hi: "{1, 2, 3, 4, 5}", or: "{1, 2, 3, 4, 5}" },
          elements: [1, 2, 3, 4, 5]
        },
        {
          id: 'c',
          label: { en: "{3}", hi: "{3}", or: "{3}" },
          elements: [3]
        },
        {
          id: 'd',
          label: { en: "{4, 5}", hi: "{4, 5}", or: "{4, 5}" },
          elements: [4, 5]
        }
      ],
      correctOption: 'b',
      explanation: {
        en: "Union contains ALL elements from both sets: A = {1, 2, 3} and B = {3, 4, 5}, so A ∪ B = {1, 2, 3, 4, 5}",
        hi: "संघ में दोनों समुच्चयों के सभी तत्व होते हैं: A = {1, 2, 3} और B = {3, 4, 5}, इसलिए A ∪ B = {1, 2, 3, 4, 5}",
        or: "ମିଳନରେ ଉଭୟ ସେଟର ସମସ୍ତ ଉପାଦାନ ଥାଏ: A = {1, 2, 3} ଏବଂ B = {3, 4, 5}, ତେଣୁ A ∪ B = {1, 2, 3, 4, 5}"
      }
    }
  ],
  intersection: [
    {
      id: 'intersection-1',
      question: {
        en: "Which elements are in A ∩ B?",
        hi: "A ∩ B में कौन से तत्व हैं?",
        or: "A ∩ B ରେ କେଉଁ ଉପାଦାନ ଅଛି?"
      },
      options: [
        {
          id: 'a',
          label: { en: "{1, 2}", hi: "{1, 2}", or: "{1, 2}" },
          elements: [1, 2]
        },
        {
          id: 'b',
          label: { en: "{3}", hi: "{3}", or: "{3}" },
          elements: [3]
        },
        {
          id: 'c',
          label: { en: "{4, 5}", hi: "{4, 5}", or: "{4, 5}" },
          elements: [4, 5]
        },
        {
          id: 'd',
          label: { en: "∅ (empty)", hi: "∅ (खाली)", or: "∅ (ଖାଲି)" },
          elements: []
        }
      ],
      correctOption: 'b',
      explanation: {
        en: "Intersection contains only COMMON elements: A = {1, 2, 3} and B = {3, 4, 5}, so A ∩ B = {3}",
        hi: "प्रतिच्छेदन में केवल साझा तत्व होते हैं: A = {1, 2, 3} और B = {3, 4, 5}, इसलिए A ∩ B = {3}",
        or: "ପ୍ରତିଛେଦରେ କେବଳ ସାଧାରଣ ଉପାଦାନ ଥାଏ: A = {1, 2, 3} ଏବଂ B = {3, 4, 5}, ତେଣୁ A ∩ B = {3}"
      }
    }
  ],
  difference: [
    {
      id: 'difference-1',
      question: {
        en: "Which elements are in A - B?",
        hi: "A - B में कौन से तत्व हैं?",
        or: "A - B ରେ କେଉଁ ଉପାଦାନ ଅଛି?"
      },
      options: [
        {
          id: 'a',
          label: { en: "{1, 2}", hi: "{1, 2}", or: "{1, 2}" },
          elements: [1, 2]
        },
        {
          id: 'b',
          label: { en: "{3}", hi: "{3}", or: "{3}" },
          elements: [3]
        },
        {
          id: 'c',
          label: { en: "{4, 5}", hi: "{4, 5}", or: "{4, 5}" },
          elements: [4, 5]
        },
        {
          id: 'd',
          label: { en: "{1, 2, 4, 5}", hi: "{1, 2, 4, 5}", or: "{1, 2, 4, 5}" },
          elements: [1, 2, 4, 5]
        }
      ],
      correctOption: 'a',
      explanation: {
        en: "Difference A - B contains elements in A but NOT in B: A = {1, 2, 3}, B = {3, 4, 5}, so A - B = {1, 2}",
        hi: "अंतर A - B में A के तत्व होते हैं लेकिन B के नहीं: A = {1, 2, 3}, B = {3, 4, 5}, इसलिए A - B = {1, 2}",
        or: "ପାର୍ଥକ୍ୟ A - B ରେ A ର ଉପାଦାନ ଥାଏ କିନ୍ତୁ B ର ନାହିଁ: A = {1, 2, 3}, B = {3, 4, 5}, ତେଣୁ A - B = {1, 2}"
      }
    }
  ],
  complement: [
    {
      id: 'complement-1',
      question: {
        en: "Which elements are in A'?",
        hi: "A' में कौन से तत्व हैं?",
        or: "A' ରେ କେଉଁ ଉପାଦାନ ଅଛି?"
      },
      options: [
        {
          id: 'a',
          label: { en: "{4, 5, 6}", hi: "{4, 5, 6}", or: "{4, 5, 6}" },
          elements: [4, 5, 6]
        },
        {
          id: 'b',
          label: { en: "{1, 2, 3}", hi: "{1, 2, 3}", or: "{1, 2, 3}" },
          elements: [1, 2, 3]
        },
        {
          id: 'c',
          label: { en: "{7, 8, 9}", hi: "{7, 8, 9}", or: "{7, 8, 9}" },
          elements: [7, 8, 9]
        },
        {
          id: 'd',
          label: { en: "U", hi: "U", or: "U" },
          elements: [1, 2, 3, 4, 5, 6]
        }
      ],
      correctOption: 'a',
      explanation: {
        en: "Complement A' contains elements in U but NOT in A: U = {1, 2, 3, 4, 5, 6}, A = {1, 2, 3}, so A' = {4, 5, 6}",
        hi: "पूरक A' में U के तत्व होते हैं लेकिन A के नहीं: U = {1, 2, 3, 4, 5, 6}, A = {1, 2, 3}, इसलिए A' = {4, 5, 6}",
        or: "ପୂରକ A' ରେ U ର ଉପାଦାନ ଥାଏ କିନ୍ତୁ A ର ନାହିଁ: U = {1, 2, 3, 4, 5, 6}, A = {1, 2, 3}, ତେଣୁ A' = {4, 5, 6}"
      }
    }
  ]
};

export function SetOperationsLesson({ language, onComplete, onBack }: SetOperationsLessonProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const t = translations[language];

  const stages = [
    { id: 'union', title: t.union, operation: 'union' },
    { id: 'intersection', title: t.intersection, operation: 'intersection' },
    { id: 'difference', title: t.difference, operation: 'difference' },
    { id: 'complement', title: t.complement, operation: 'complement' }
  ];

  const resetAnimation = useCallback(() => {
    setAnimationKey(prev => prev + 1);
    setShowAnimation(false);
    setAnimationComplete(false);
  }, []);

  const playAnimation = useCallback(() => {
    setShowAnimation(true);
    setAnimationComplete(false);
    setTimeout(() => {
      setAnimationComplete(true);
      setShowQuiz(true);
    }, 3000); // Animation duration
  }, []);

  const nextStage = useCallback(() => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
      setShowQuiz(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setCurrentQuestionIndex(0);
      resetAnimation();
    } else {
      onComplete();
    }
  }, [currentStage, stages.length, resetAnimation, onComplete]);

  const prevStage = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
      setShowQuiz(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setCurrentQuestionIndex(0);
      resetAnimation();
    }
  }, [currentStage, resetAnimation]);

  const handleQuizAnswer = useCallback((optionId: string) => {
    setSelectedAnswer(optionId);
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setShowQuiz(false);
    }, 3000);
  }, []);

  // Auto-play animation when stage changes
  useEffect(() => {
    playAnimation();
  }, [currentStage, playAnimation]);

  // Union SVG Animation Component
  const UnionAnimation = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto">
      <defs>
        <clipPath id="unionClip">
          <circle cx="130" cy="150" r="60" />
          <circle cx="270" cy="150" r="60" />
        </clipPath>
        <linearGradient id="unionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#4ecdc4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#45b7d1" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="300" fill="#f8fafc" />

      {/* Set A Circle */}
      <circle
        cx="130"
        cy="150"
        r="60"
        fill="rgba(255, 107, 107, 0.3)"
        stroke="#ff6b6b"
        strokeWidth="3"
        className={showAnimation ? 'animate-set-move-left' : ''}
      />
      
      {/* Set B Circle */}
      <circle
        cx="270"
        cy="150"
        r="60"
        fill="rgba(78, 205, 196, 0.3)"
        stroke="#4ecdc4"
        strokeWidth="3"
        className={showAnimation ? 'animate-set-move-right' : ''}
      />

      {/* Union Fill */}
      {showAnimation && (
        <rect
          x="70"
          y="90"
          width="260"
          height="120"
          fill="url(#unionGradient)"
          clipPath="url(#unionClip)"
          className="animate-union-fill"
        />
      )}

      {/* Labels */}
      <text x="110" y="130" className="text-lg font-bold fill-red-700">A</text>
      <text x="290" y="130" className="text-lg font-bold fill-teal-700">B</text>
      <text x="200" y="190" className="text-base font-semibold fill-blue-700">A ∪ B</text>

      {/* Elements */}
      <text x="100" y="155" className="text-sm fill-gray-700">1</text>
      <text x="120" y="170" className="text-sm fill-gray-700">2</text>
      <text x="200" y="155" className="text-sm fill-gray-700">3</text>
      <text x="280" y="155" className="text-sm fill-gray-700">4</text>
      <text x="300" y="170" className="text-sm fill-gray-700">5</text>
    </svg>
  );

  // Intersection SVG Animation Component
  const IntersectionAnimation = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto">
      <defs>
        <clipPath id="intersectionClip">
          <circle cx="130" cy="150" r="60" />
        </clipPath>
        <radialGradient id="intersectionGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd93d" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="300" fill="#f8fafc" />

      {/* Set A Circle */}
      <circle
        cx="130"
        cy="150"
        r="60"
        fill="rgba(255, 107, 107, 0.2)"
        stroke="#ff6b6b"
        strokeWidth="3"
      />
      
      {/* Set B Circle */}
      <circle
        cx="200"
        cy="150"
        r="60"
        fill="rgba(78, 205, 196, 0.2)"
        stroke="#4ecdc4"
        strokeWidth="3"
      />

      {/* Intersection Fill */}
      {showAnimation && (
        <circle
          cx="200"
          cy="150"
          r="60"
          fill="url(#intersectionGradient)"
          clipPath="url(#intersectionClip)"
          className="animate-intersection-pulse"
        />
      )}

      {/* Labels */}
      <text x="100" y="120" className="text-lg font-bold fill-red-700">A</text>
      <text x="230" y="120" className="text-lg font-bold fill-teal-700">B</text>
      {showAnimation && (
        <text x="160" y="140" className="text-base font-semibold fill-yellow-700 animate-bounce-in">
          A ∩ B
        </text>
      )}

      {/* Elements */}
      <text x="110" y="155" className="text-sm fill-gray-700">1</text>
      <text x="110" y="170" className="text-sm fill-gray-700">2</text>
      <text x="165" y="155" className="text-sm fill-gray-700 font-bold">3</text>
      <text x="220" y="155" className="text-sm fill-gray-700">4</text>
      <text x="220" y="170" className="text-sm fill-gray-700">5</text>
    </svg>
  );

  // Difference SVG Animation Component
  const DifferenceAnimation = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto">
      <defs>
        <clipPath id="differenceClip">
          <circle cx="130" cy="150" r="60" />
          <circle cx="200" cy="150" r="60" fill="black" />
        </clipPath>
        <linearGradient id="differenceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="300" fill="#f8fafc" />

      {/* Set A Circle */}
      <circle
        cx="130"
        cy="150"
        r="60"
        fill="rgba(255, 107, 107, 0.2)"
        stroke="#ff6b6b"
        strokeWidth="3"
      />
      
      {/* Set B Circle */}
      <circle
        cx="200"
        cy="150"
        r="60"
        fill="rgba(78, 205, 196, 0.2)"
        stroke="#4ecdc4"
        strokeWidth="3"
      />

      {/* Difference Fill (A - B) */}
      {showAnimation && (
        <circle
          cx="130"
          cy="150"
          r="60"
          fill="url(#differenceGradient)"
          clipPath="url(#differenceClip)"
          className="animate-difference-fill"
        />
      )}

      {/* Intersection elements fade out */}
      <text 
        x="165" 
        y="155" 
        className={`text-sm fill-gray-700 ${showAnimation ? 'animate-fade-out' : ''}`}
      >
        3
      </text>

      {/* Labels */}
      <text x="100" y="120" className="text-lg font-bold fill-red-700">A</text>
      <text x="230" y="120" className="text-lg font-bold fill-teal-700">B</text>
      {showAnimation && (
        <text x="100" y="190" className="text-base font-semibold fill-purple-700 animate-bounce-in">
          A - B
        </text>
      )}

      {/* Remaining elements in A */}
      <text x="110" y="155" className="text-sm fill-gray-700 font-bold">1</text>
      <text x="110" y="170" className="text-sm fill-gray-700 font-bold">2</text>
      <text x="220" y="155" className="text-sm fill-gray-700">4</text>
      <text x="220" y="170" className="text-sm fill-gray-700">5</text>
    </svg>
  );

  // Complement SVG Animation Component
  const ComplementAnimation = () => (
    <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto">
      <defs>
        <mask id="complementMask">
          <rect width="400" height="300" fill="white" />
          <circle cx="200" cy="150" r="60" fill="black" />
        </mask>
        <linearGradient id="complementGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Universal Set Background */}
      <rect 
        width="380" 
        height="280" 
        x="10" 
        y="10" 
        rx="10" 
        fill="#f1f5f9" 
        stroke="#64748b" 
        strokeWidth="2" 
        strokeDasharray="8,4"
      />

      {/* Complement glow effect */}
      {showAnimation && (
        <rect
          width="380"
          height="280"
          x="10"
          y="10"
          rx="10"
          fill="url(#complementGradient)"
          mask="url(#complementMask)"
          className="animate-complement-glow"
        />
      )}

      {/* Set A Circle */}
      <circle
        cx="200"
        cy="150"
        r="60"
        fill="rgba(239, 68, 68, 0.3)"
        stroke="#ef4444"
        strokeWidth="3"
      />

      {/* Labels */}
      <text x="30" y="35" className="text-lg font-bold fill-slate-700">U</text>
      <text x="180" y="130" className="text-lg font-bold fill-red-700">A</text>
      {showAnimation && (
        <text x="320" y="50" className="text-base font-semibold fill-blue-700 animate-bounce-in">
          A'
        </text>
      )}

      {/* Elements in A */}
      <text x="190" y="145" className="text-sm fill-gray-700">1</text>
      <text x="210" y="145" className="text-sm fill-gray-700">2</text>
      <text x="200" y="165" className="text-sm fill-gray-700">3</text>

      {/* Elements in complement */}
      <text x="50" y="60" className="text-sm fill-gray-700 font-bold">4</text>
      <text x="350" y="60" className="text-sm fill-gray-700 font-bold">5</text>
      <text x="50" y="240" className="text-sm fill-gray-700 font-bold">6</text>
    </svg>
  );

  const getCurrentQuestions = () => {
    const currentOperation = stages[currentStage].operation;
    return quizQuestions[currentOperation] || [];
  };

  const currentQuestions = getCurrentQuestions();
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const renderAnimation = () => {
    const currentOperation = stages[currentStage].operation;
    
    switch (currentOperation) {
      case 'union':
        return <UnionAnimation />;
      case 'intersection':
        return <IntersectionAnimation />;
      case 'difference':
        return <DifferenceAnimation />;
      case 'complement':
        return <ComplementAnimation />;
      default:
        return null;
    }
  };

  const renderQuiz = () => {
    if (!showQuiz || !currentQuestion) return null;

    return (
      <Card className="mt-6 bg-slate-50 border-slate-300">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">
            {currentQuestion.question[language]}
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleQuizAnswer(option.id)}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedAnswer === option.id
                    ? option.id === currentQuestion.correctOption
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : 'bg-red-100 border-red-400 text-red-800'
                    : 'bg-white border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700'
                }`}
              >
                <div className="font-semibold">
                  {option.label[language]}
                </div>
              </button>
            ))}
          </div>

          {showFeedback && selectedAnswer && (
            <div className={`mt-4 p-4 rounded-lg ${
              selectedAnswer === currentQuestion.correctOption
                ? 'bg-green-100 border-green-300 text-green-800'
                : 'bg-red-100 border-red-300 text-red-800'
            } border-2 animate-quiz-feedback-slide`}>
              <p className="font-semibold">
                {selectedAnswer === currentQuestion.correctOption ? t.correct : t.incorrect}
              </p>
              <p className="text-sm mt-2">
                <strong>{t.explanation}</strong> {currentQuestion.explanation[language]}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const getOperationDescription = () => {
    const currentOperation = stages[currentStage].operation;
    switch (currentOperation) {
      case 'union':
        return t.unionDescription;
      case 'intersection':
        return t.intersectionDescription;
      case 'difference':
        return t.differenceDescription;
      case 'complement':
        return t.complementDescription;
      default:
        return '';
    }
  };

  const getFormula = () => {
    const currentOperation = stages[currentStage].operation;
    switch (currentOperation) {
      case 'union':
        return 'A ∪ B = {x | x ∈ A or x ∈ B}';
      case 'intersection':
        return 'A ∩ B = {x | x ∈ A and x ∈ B}';
      case 'difference':
        return 'A - B = {x | x ∈ A and x ∉ B}';
      case 'complement':
        return "A' = {x | x ∈ U and x ∉ A}";
      default:
        return '';
    }
  };

  const getExample = () => {
    const currentOperation = stages[currentStage].operation;
    switch (currentOperation) {
      case 'union':
        return 'A = {1, 2, 3}, B = {3, 4, 5} ⟹ A ∪ B = {1, 2, 3, 4, 5}';
      case 'intersection':
        return 'A = {1, 2, 3}, B = {3, 4, 5} ⟹ A ∩ B = {3}';
      case 'difference':
        return 'A = {1, 2, 3}, B = {3, 4, 5} ⟹ A - B = {1, 2}';
      case 'complement':
        return 'U = {1, 2, 3, 4, 5, 6}, A = {1, 2, 3} ⟹ A\' = {4, 5, 6}';
      default:
        return '';
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
              onClick={resetAnimation}
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
                ? 'bg-indigo-500 text-white animate-stage-indicator-pulse'
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
            {/* Current Stage Title and Description */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4 text-cyan-300">
                {stages[currentStage].title}
              </h2>
              <p className="text-lg text-gray-300 mb-4">
                {getOperationDescription()}
              </p>
            </div>

            {/* Animation Area */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 mb-6">
              <div className="flex justify-center mb-4">
                <Button
                  onClick={playAnimation}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t.replay}
                </Button>
              </div>
              
              {renderAnimation()}
              
              {animationComplete && (
                <div className="text-center mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ {t.animationComplete}
                  </span>
                </div>
              )}
            </div>

            {/* Formula and Example */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-cyan-300">{t.formula}</h3>
                  <p className="font-mono text-white bg-slate-700 p-3 rounded text-center">
                    {getFormula()}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-cyan-300">{t.example}</h3>
                  <p className="font-mono text-white bg-slate-700 p-3 rounded text-center">
                    {getExample()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quiz Section */}
            {renderQuiz()}
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

          <Button
            onClick={nextStage}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8"
          >
            {currentStage === stages.length - 1 ? t.complete : t.next}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}