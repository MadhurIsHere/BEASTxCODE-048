import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Sprout, 
  Calculator, 
  Target, 
  Timer, 
  Trophy, 
  RotateCcw,
  ArrowRight,
  CheckCircle,
  XCircle,
  Sparkles,
  Zap,
  BookOpen,
  Brain,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipForward,
  Award,
  Star,
  Eye,
  Hand,
  Volume2
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import type { Language } from '../../../types/onboarding';

interface SeedSorterGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

interface ConceptStage {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'practice' | 'quiz';
  completed: boolean;
  unlocked: boolean;
}

interface LessonContent {
  id: string;
  title: string;
  concept: string;
  explanation: string;
  visualDemo: React.ReactNode;
  examples: Array<{
    problem: string;
    solution: string;
    steps: string[];
  }>;
  practiceProblems: Array<{
    question: string;
    answer: string | number;
    options: (string | number)[];
    explanation: string;
  }>;
}

export function SeedSorterGame({ language, onBack, onComplete }: SeedSorterGameProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [gameMode, setGameMode] = useState<'learning' | 'gaming'>('learning');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [studentProgress, setStudentProgress] = useState({
    lessonsCompleted: 0,
    conceptsUnderstood: 0,
    practiceScore: 0,
    totalXP: 0
  });
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const animationInterval = useRef<NodeJS.Timeout | null>(null);

  // Comprehensive translations
  const t = {
    title: language === 'en' ? 'Smart Seed Sorter & Rational Numbers Academy' : 
           language === 'hi' ? 'स्मार्ट बीज छंटाई और परिमेय संख्या अकादमी' : 
           'ସ୍ମାର୍ଟ ବିହନ ଛଟାଇ ଏବଂ ପରିମେୟ ସଂଖ୍ୟା ଏକାଡେମୀ',
    subtitle: language === 'en' ? 'Master Rational Numbers, Powers & Roots through Agricultural Science' :
              language === 'hi' ? 'कृषि विज्ञान के माध्यम से परिमेय संख्या, घात और मूल में महारत हासिल करें' :
              'କୃଷି ବିଜ୍ଞାନ ମାଧ୍ୟମରେ ପରିମେୟ ସଂଖ୍ୟା, ଶକ୍ତି ଏବଂ ମୂଳରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ',
    learnMode: language === 'en' ? 'Learning Mode' : language === 'hi' ? 'सीखने का तरीका' : 'ଶିକ୍ଷାର ମୋଡ୍',
    practiceMode: language === 'en' ? 'Practice Mode' : language === 'hi' ? 'अभ्यास मोड' : 'ଅଭ୍ୟାସ ମୋଡ୍',
    conceptExplorer: language === 'en' ? 'Concept Explorer' : language === 'hi' ? 'अवधारणा खोजकर्ता' : 'ସଂକଳ୍ପ ଅନୁସନ୍ଧାନକାରୀ',
    startLearning: language === 'en' ? 'Start Learning Journey' : language === 'hi' ? 'सीखने की यात्रा शुरू करें' : 'ଶିକ୍ଷାର ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ',
    whatAreRationalNumbers: language === 'en' ? 'What are Rational Numbers?' : language === 'hi' ? 'परिमेय संख्याएँ क्या हैं?' : 'ପରିମେୟ ସଂଖ୍ୟା କ\'ଣ?',
    operations: language === 'en' ? 'Operations with Rational Numbers' : language === 'hi' ? 'परिमेय संख्याओं के साथ संक्रियाएं' : 'ପରିମେୟ ସଂଖ୍ୟା ସହିତ କାର୍ଯ୍ୟ',
    powersAndRoots: language === 'en' ? 'Powers and Roots' : language === 'hi' ? 'घात और मूल' : 'ଶକ୍ତି ଏବଂ ମୂଳ',
    realWorldApplications: language === 'en' ? 'Real-World Applications' : language === 'hi' ? 'वास्तविक दुनिया के अनुप्रयोग' : 'ବାସ୍ତବ ଦୁନିଆର ପ୍ରୟୋଗ',
    watchAnimation: language === 'en' ? 'Watch Animation' : language === 'hi' ? 'एनीमेशन देखें' : 'ଆନିମେସନ୍ ଦେଖନ୍ତୁ',
    tryInteractive: language === 'en' ? 'Try Interactive Demo' : language === 'hi' ? 'इंटरैक्टिव डेमो आज़माएं' : 'ଇଣ୍ଟରାକ୍ଟିଭ ଡେମୋ ଚେଷ୍ଟା କରନ୍ତୁ',
    practiceNow: language === 'en' ? 'Practice Now' : language === 'hi' ? 'अभी अभ्यास करें' : 'ବର୍ତ୍ତମାନ ଅଭ୍ୟାସ କରନ୍ତୁ',
    showSteps: language === 'en' ? 'Show Solution Steps' : language === 'hi' ? 'समाधान के चरण दिखाएं' : 'ସମାଧାନ ସୋପାନ ଦେଖାନ୍ତୁ',
    hideSteps: language === 'en' ? 'Hide Steps' : language === 'hi' ? 'चरण छुपाएं' : 'ସୋପାନ ଲୁଚାନ୍ତୁ',
    nextConcept: language === 'en' ? 'Next Concept' : language === 'hi' ? 'अगली अवधारणा' : 'ପରବର୍ତ୍ତୀ ସଂକଳ୍ପ',
    excellent: language === 'en' ? 'Excellent! You understand this concept!' : language === 'hi' ? 'उत्कृष्ट! आप इस अवधारणा को समझते हैं!' : 'ଉତ୍କୃଷ୍ଟ! ଆପଣ ଏହି ସଂକଳ୍ପ ବୁଝିଛନ୍ତି!',
    tryAgain: language === 'en' ? 'Not quite right. Let\'s review the concept!' : language === 'hi' ? 'बिल्कुल सही नहीं। आइए अवधारणा की समीक्षा करते हैं!' : 'ସମ୍ପୂର୍ଣ୍ଣ ଠିକ୍ ନୁହେଁ। ଆସନ୍ତୁ ସଂକଳ୍ପ ସମୀକ୍ଷା କରିବା!'
  };

  // Comprehensive lesson content with agricultural context
  const lessonContent: LessonContent[] = [
    {
      id: 'rational-intro',
      title: t.whatAreRationalNumbers,
      concept: language === 'en' ? 'Rational Numbers' : language === 'hi' ? 'परिमेय संख्याएँ' : 'ପରିମେୟ ସଂଖ୍ୟା',
      explanation: language === 'en' ? 
        'A rational number is any number that can be expressed as a fraction p/q where p and q are integers and q ≠ 0. In farming, we use rational numbers for measuring fertilizer ratios, seed distributions, and land divisions.' :
        language === 'hi' ? 
        'परिमेय संख्या कोई भी संख्या है जिसे p/q के रूप में व्यक्त किया जा सकता है जहाँ p और q पूर्णांक हैं और q ≠ 0। खेती में, हम उर्वरक अनुपात, बीज वितरण और भूमि विभाजन को मापने के लिए परिमेय संख्याओं का उपयोग करते हैं।' :
        'ପରିମେୟ ସଂଖ୍ୟା ଯେକୌଣସି ସଂଖ୍ୟା ଯାହା p/q ରୂପରେ ପ୍ରକାଶ କରାଯାଇପାରିବ ଯେଉଁଠାରେ p ଏବଂ q ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା ଏବଂ q ≠ 0। କୃଷିରେ, ଆମେ ସାର ଅନୁପାତ, ବିହନ ବଣ୍ଟନ ଏବଂ ଜମି ବିଭାଜନ ମାପିବା ପାଇଁ ପରିମେୟ ସଂଖ୍ୟା ବ୍ୟବହାର କରୁ।',
      visualDemo: <RationalNumbersAnimation />,
      examples: [
        {
          problem: language === 'en' ? 'Express 0.75 as a fraction' : language === 'hi' ? '0.75 को भिन्न के रूप में व्यक्त करें' : '0.75 କୁ ଭଗ୍ନାଂଶ ରୂପରେ ପ୍ରକାଶ କରନ୍ତୁ',
          solution: '3/4',
          steps: [
            language === 'en' ? '0.75 = 75/100' : language === 'hi' ? '0.75 = 75/100' : '0.75 = 75/100',
            language === 'en' ? 'Find GCD of 75 and 100 = 25' : language === 'hi' ? '75 और 100 का GCD = 25' : '75 ଏବଂ 100 ର GCD = 25',
            language === 'en' ? '75 ÷ 25 = 3, 100 ÷ 25 = 4' : language === 'hi' ? '75 ÷ 25 = 3, 100 ÷ 25 = 4' : '75 ÷ 25 = 3, 100 ÷ 25 = 4',
            language === 'en' ? 'Therefore, 0.75 = 3/4' : language === 'hi' ? 'इसलिए, 0.75 = 3/4' : 'ତେଣୁ, 0.75 = 3/4'
          ]
        }
      ],
      practiceProblems: [
        {
          question: language === 'en' ? 'A farmer divides his field into 8 equal parts and plants crops in 5 parts. What fraction of the field has crops?' : 
                   language === 'hi' ? 'एक किसान अपने खेत को 8 बराबर भागों में बांटता है और 5 भागों में फसल लगाता है। खेत का कितना हिस्सा फसल वाला है?' :
                   'ଜଣେ କୃଷକ ତାଙ୍କ କ୍ଷେତକୁ 8 ସମାନ ଭାଗରେ ବାଣ୍ଟନ୍ତି ଏବଂ 5 ଭାଗରେ ଫସଲ ଲଗାନ୍ତି। କ୍ଷେତର କେତେ ଭାଗରେ ଫସଲ ଅଛି?',
          answer: '5/8',
          options: ['5/8', '3/8', '8/5', '5/3'],
          explanation: language === 'en' ? 'Out of 8 parts, crops are in 5 parts, so the fraction is 5/8' :
                      language === 'hi' ? '8 भागों में से 5 भागों में फसल है, इसलिए भिन्न 5/8 है' :
                      '8 ଭାଗ ମଧ୍ୟରୁ 5 ଭାଗରେ ଫସଲ ଅଛି, ତେଣୁ ଭଗ୍ନାଂଶ 5/8'
        }
      ]
    },
    {
      id: 'operations',
      title: t.operations,
      concept: language === 'en' ? 'Adding and Subtracting Rational Numbers' : language === 'hi' ? 'परिमेय संख्याओं का जोड़ना और घटाना' : 'ପରିମେୟ ସଂଖ୍ୟା ଯୋଗ ଏବଂ ବିୟୋଗ',
      explanation: language === 'en' ? 
        'To add or subtract fractions, we need a common denominator. In agriculture, this helps calculate total fertilizer amounts, seed mixtures, and land allocations.' :
        language === 'hi' ? 
        'भिन्नों को जोड़ने या घटाने के लिए, हमें एक सामान्य हर की आवश्यकता होती है। कृषि में, यह कुल उर्वरक मात्रा, बीज मिश्रण और भूमि आवंटन की गणना करने में मदद करता है।' :
        'ଭଗ୍ନାଂଶ ଯୋଗ କିମ୍ବା ବିୟୋଗ କରିବା ପାଇଁ, ଆମକୁ ସାଧାରଣ ହର ଦରକାର। କୃଷିରେ, ଏହା ମୋଟ ସାର ପରିମାଣ, ବିହନ ମିଶ୍ରଣ ଏବଂ ଜମି ବଣ୍ଟନ ଗଣନା କରିବାରେ ସାହାଯ୍ୟ କରେ।',
      visualDemo: <FractionOperationsAnimation />,
      examples: [
        {
          problem: language === 'en' ? 'Calculate: 2/3 + 1/4' : language === 'hi' ? 'गणना करें: 2/3 + 1/4' : 'ଗଣନା କରନ୍ତୁ: 2/3 + 1/4',
          solution: '11/12',
          steps: [
            language === 'en' ? 'Find LCM of 3 and 4 = 12' : language === 'hi' ? '3 और 4 का LCM = 12' : '3 ଏବଂ 4 ର LCM = 12',
            language === 'en' ? '2/3 = (2×4)/(3×4) = 8/12' : language === 'hi' ? '2/3 = (2×4)/(3×4) = 8/12' : '2/3 = (2×4)/(3×4) = 8/12',
            language === 'en' ? '1/4 = (1×3)/(4×3) = 3/12' : language === 'hi' ? '1/4 = (1×3)/(4×3) = 3/12' : '1/4 = (1×3)/(4×3) = 3/12',
            language === 'en' ? '8/12 + 3/12 = 11/12' : language === 'hi' ? '8/12 + 3/12 = 11/12' : '8/12 + 3/12 = 11/12'
          ]
        }
      ],
      practiceProblems: [
        {
          question: language === 'en' ? 'A farmer uses 3/4 kg of wheat seeds and 1/2 kg of barley seeds. What is the total weight of seeds?' :
                   language === 'hi' ? 'एक किसान 3/4 किग्रा गेहूं के बीज और 1/2 किग्रा जौ के बीज का उपयोग करता है। बीजों का कुल वजन क्या है?' :
                   'ଜଣେ କୃଷକ 3/4 କିଗ୍ରା ଗହମ ବିହନ ଏବଂ 1/2 କିଗ୍ରା ଯବ ବିହନ ବ୍ୟବହାର କରନ୍ତି। ବିହନର ମୋଟ ଓଜନ କେତେ?',
          answer: '5/4',
          options: ['5/4', '4/6', '2/6', '1/4'],
          explanation: language === 'en' ? '3/4 + 1/2 = 3/4 + 2/4 = 5/4 kg' :
                      language === 'hi' ? '3/4 + 1/2 = 3/4 + 2/4 = 5/4 किग्रा' :
                      '3/4 + 1/2 = 3/4 + 2/4 = 5/4 କିଗ୍ରା'
        }
      ]
    },
    {
      id: 'powers-roots',
      title: t.powersAndRoots,
      concept: language === 'en' ? 'Powers and Roots of Rational Numbers' : language === 'hi' ? 'परिमेय संख्याओं के घात और मूल' : 'ପରିମେୟ ସଂଖ୍ୟାର ଶକ୍ତି ଏବଂ ମୂଳ',
      explanation: language === 'en' ? 
        'Powers help calculate exponential growth in crops, while roots help find optimal dimensions for farm plots and storage areas.' :
        language === 'hi' ? 
        'घात फसलों में घातांकीय वृद्धि की गणना करने में मदद करते हैं, जबकि मूल खेत की भूखंडों और भंडारण क्षेत्रों के लिए इष्टतम आयाम खोजने में मदद करते हैं।' :
        'ଶକ୍ତି ଫସଲରେ ଘାତାଙ୍କ ବୃଦ୍ଧି ଗଣନା କରିବାରେ ସାହାଯ୍ୟ କରେ, ଯେତେବେଳେ ମୂଳ ଫାର୍ମ ପ୍ଲଟ ଏବଂ ଭଣ୍ଡାର କ୍ଷେତ୍ର ପାଇଁ ଉତ୍କୃଷ୍ଟ ଆକାର ଖୋଜିବାରେ ସାହାଯ୍ୟ କରେ।',
      visualDemo: <PowersRootsAnimation />,
      examples: [
        {
          problem: language === 'en' ? 'Calculate: (2/3)²' : language === 'hi' ? 'गणना करें: (2/3)²' : 'ଗଣନା କରନ୍ତୁ: (2/3)²',
          solution: '4/9',
          steps: [
            language === 'en' ? '(2/3)² = (2/3) × (2/3)' : language === 'hi' ? '(2/3)² = (2/3) × (2/3)' : '(2/3)² = (2/3) × (2/3)',
            language === 'en' ? '= (2×2)/(3×3)' : language === 'hi' ? '= (2×2)/(3×3)' : '= (2×2)/(3×3)',
            language === 'en' ? '= 4/9' : language === 'hi' ? '= 4/9' : '= 4/9'
          ]
        }
      ],
      practiceProblems: [
        {
          question: language === 'en' ? 'A square field has an area of 16/25 hectares. What is the length of each side?' :
                   language === 'hi' ? 'एक वर्गाकार खेत का क्षेत्रफल 16/25 हेक्टेयर है। प्रत्येक भुजा की लंबाई क्या है?' :
                   'ଏକ ବର୍ଗାକାର କ୍ଷେତର କ୍ଷେତ୍ରଫଳ 16/25 ହେକ୍ଟର। ପ୍ରତ୍ୟେକ ପାର୍ଶ୍ୱର ଦୈର୍ଘ୍ୟ କେତେ?',
          answer: '4/5',
          options: ['4/5', '8/25', '16/5', '2/5'],
          explanation: language === 'en' ? 'Side = √(16/25) = √16/√25 = 4/5 hectares' :
                      language === 'hi' ? 'भुजा = √(16/25) = √16/√25 = 4/5 हेक्टेयर' :
                      'ପାର୍ଶ୍ୱ = √(16/25) = √16/√25 = 4/5 ହେକ୍ଟର'
        }
      ]
    }
  ];

  // Learning stages configuration
  const learningStages: ConceptStage[] = [
    {
      id: 'intro',
      title: t.whatAreRationalNumbers,
      description: language === 'en' ? 'Learn what rational numbers are and how they\'re used in farming' : 
                  language === 'hi' ? 'सीखें कि परिमेय संख्याएं क्या हैं और खेती में कैसे उपयोग की जाती हैं' :
                  'ପରିମେୟ ସଂଖ୍ୟା କ\'ଣ ଏବଂ କୃଷିରେ କିପରି ବ୍ୟବହାର ହୁଏ ଶିଖନ୍ତୁ',
      type: 'lesson',
      completed: false,
      unlocked: true
    },
    {
      id: 'operations',
      title: t.operations,
      description: language === 'en' ? 'Master addition, subtraction, multiplication and division of rational numbers' :
                  language === 'hi' ? 'परिमेय संख्याओं के जोड़, घटाव, गुणा और भाग में महारत हासिल करें' :
                  'ପରିମେୟ ସଂଖ୍ୟାର ଯୋଗ, ବିୟୋଗ, ଗୁଣନ ଏବଂ ଭାଗରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ',
      type: 'lesson',
      completed: false,
      unlocked: false
    },
    {
      id: 'powers',
      title: t.powersAndRoots,
      description: language === 'en' ? 'Explore powers and roots in agricultural contexts' :
                  language === 'hi' ? 'कृषि संदर्भों में घात और मूल का अन्वेषण करें' :
                  'କୃଷି ପ୍ରସଙ୍ଗରେ ଶକ୍ତି ଏବଂ ମୂଳର ଅନୁସନ୍ଧାନ କରନ୍ତୁ',
      type: 'lesson',
      completed: false,
      unlocked: false
    }
  ];

  // Animation Components
  function RationalNumbersAnimation() {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startAnimation = () => {
      setIsPlaying(true);
      setStep(0);
      const interval = setInterval(() => {
        setStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1500);
    };

    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-green-800 mb-2">
            {language === 'en' ? 'Visualizing Rational Numbers in Farming' : 
             language === 'hi' ? 'खेती में परिमेय संख्याओं का दृश्यीकरण' :
             'କୃଷିରେ ପରିମେୟ ସଂଖ୍ୟାର ଦୃଶ୍ୟକରଣ'}
          </h4>
          <Button onClick={startAnimation} disabled={isPlaying} className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            {t.watchAnimation}
          </Button>
        </div>

        <div className="relative h-64 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          {/* Farm Field Visualization */}
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Field Background */}
            <rect x="20" y="20" width="360" height="160" fill="#90EE90" stroke="#228B22" strokeWidth="2" rx="8" />
            
            {/* Field Division Lines */}
            {[1, 2, 3].map(i => (
              <line 
                key={i} 
                x1={20 + (i * 90)} 
                y1="20" 
                x2={20 + (i * 90)} 
                y2="180" 
                stroke="#228B22" 
                strokeWidth="1" 
                strokeDasharray="5,5"
                className={step >= 1 ? 'animate-lesson-fade-in' : 'opacity-0'}
              />
            ))}

            {/* Seeds Animation */}
            {Array.from({length: 8}).map((_, i) => (
              <circle
                key={i}
                cx={50 + (i % 4) * 80}
                cy={60 + Math.floor(i / 4) * 60}
                r="8"
                fill="#8B4513"
                className={`transition-all duration-1000 ${
                  step >= 2 && i < 5 ? 'animate-seed-bounce' : 
                  step >= 2 ? 'opacity-30' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}

            {/* Fraction Display */}
            {step >= 3 && (
              <g className="animate-lesson-fade-in">
                <rect x="150" y="90" width="100" height="40" fill="white" stroke="#333" strokeWidth="2" rx="5" />
                <text x="200" y="105" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#333">5</text>
                <line x1="160" y1="110" x2="240" y2="110" stroke="#333" strokeWidth="2" />
                <text x="200" y="125" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#333">8</text>
              </g>
            )}

            {/* Decimal Equivalent */}
            {step >= 4 && (
              <g className="animate-lesson-fade-in">
                <rect x="270" y="90" width="80" height="30" fill="#FFE4B5" stroke="#FF8C00" strokeWidth="2" rx="5" />
                <text x="310" y="110" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF8C00">= 0.625</text>
              </g>
            )}
          </svg>

          {/* Step Explanations */}
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 rounded-lg p-2 text-sm">
            {step === 0 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'A farmer has a field divided into 8 equal sections' :
                 language === 'hi' ? 'एक किसान के पास 8 बराबर भागों में बंटा खेत है' :
                 'ଜଣେ କୃଷକଙ୍କ ପାଖରେ 8 ସମାନ ଭାଗରେ ବିଭକ୍ତ ଏକ କ୍ଷେତ ଅଛି'}
              </p>
            )}
            {step === 1 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'The field is divided into 8 equal parts' :
                 language === 'hi' ? 'खेत 8 बराबर भागों में बांटा गया है' :
                 'କ୍ଷେତ 8 ସମାନ ଭାଗରେ ବିଭକ୍ତ'}
              </p>
            )}
            {step === 2 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'Seeds are planted in 5 out of 8 sections' :
                 language === 'hi' ? '8 में से 5 भागों में बीज लगाए गए हैं' :
                 '8 ଭାଗ ମଧ୍ୟରୁ 5 ଭାଗରେ ବିହନ ଲଗାଯାଇଛି'}
              </p>
            )}
            {step === 3 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'This represents the rational number 5/8' :
                 language === 'hi' ? 'यह परिमेय संख्या 5/8 को दर्शाता है' :
                 'ଏହା ପରିମେୟ ସଂଖ୍ୟା 5/8 କୁ ଦର୍ଶାଏ'}
              </p>
            )}
            {step === 4 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'Which equals 0.625 in decimal form' :
                 language === 'hi' ? 'जो दशमलव रूप में 0.625 के बराबर है' :
                 'ଯାହା ଦଶମିକ ରୂପରେ 0.625 ସହିତ ସମାନ'}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  function FractionOperationsAnimation() {
    const [operationStep, setOperationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startAnimation = () => {
      setIsPlaying(true);
      setOperationStep(0);
      const interval = setInterval(() => {
        setOperationStep(prev => {
          if (prev >= 5) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
    };

    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-blue-800 mb-2">
            {language === 'en' ? 'Adding Fertilizer Fractions' : 
             language === 'hi' ? 'उर्वरक भिन्नों को जोड़ना' :
             'ସାର ଭଗ୍ନାଂଶ ଯୋଗ କରିବା'}
          </h4>
          <Button onClick={startAnimation} disabled={isPlaying} className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            {t.watchAnimation}
          </Button>
        </div>

        <div className="relative h-64 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <svg viewBox="0 0 500 200" className="w-full h-full">
            {/* Problem Statement */}
            {operationStep >= 0 && (
              <g className="animate-lesson-fade-in">
                <text x="250" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#333">
                  2/3 + 1/4 = ?
                </text>
              </g>
            )}

            {/* First Fraction - 2/3 */}
            {operationStep >= 1 && (
              <g className="animate-lesson-fade-in">
                <rect x="50" y="60" width="120" height="60" fill="#FFE4E1" stroke="#CD5C5C" strokeWidth="2" rx="5" />
                <line x1="90" y1="60" x2="90" y2="120" stroke="#CD5C5C" strokeWidth="2" />
                <line x1="130" y1="60" x2="130" y2="120" stroke="#CD5C5C" strokeWidth="2" />
                
                {/* Filled parts */}
                <rect x="52" y="62" width="36" height="56" fill="#CD5C5C" opacity="0.7" />
                <rect x="92" y="62" width="36" height="56" fill="#CD5C5C" opacity="0.7" />
                
                <text x="110" y="145" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#CD5C5C">2/3</text>
              </g>
            )}

            {/* Second Fraction - 1/4 */}
            {operationStep >= 1 && (
              <g className="animate-lesson-fade-in">
                <rect x="200" y="60" width="120" height="60" fill="#E0E6FF" stroke="#4169E1" strokeWidth="2" rx="5" />
                <line x1="230" y1="60" x2="230" y2="120" stroke="#4169E1" strokeWidth="2" />
                <line x1="260" y1="60" x2="260" y2="120" stroke="#4169E1" strokeWidth="2" />
                <line x1="290" y1="60" x2="290" y2="120" stroke="#4169E1" strokeWidth="2" />
                
                {/* Filled part */}
                <rect x="202" y="62" width="26" height="56" fill="#4169E1" opacity="0.7" />
                
                <text x="260" y="145" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#4169E1">1/4</text>
              </g>
            )}

            {/* Common Denominator - 12 */}
            {operationStep >= 2 && (
              <g className="animate-lesson-fade-in">
                <text x="250" y="170" textAnchor="middle" fontSize="14" fill="#333">
                  {language === 'en' ? 'Find common denominator: LCM(3,4) = 12' :
                   language === 'hi' ? 'सामान्य हर खोजें: LCM(3,4) = 12' :
                   'ସାଧାରଣ ହର ଖୋଜନ୍ତୁ: LCM(3,4) = 12'}
                </text>
              </g>
            )}

            {/* Convert fractions */}
            {operationStep >= 3 && (
              <g className="animate-lesson-fade-in">
                <text x="110" y="185" textAnchor="middle" fontSize="12" fill="#CD5C5C">2/3 = 8/12</text>
                <text x="260" y="185" textAnchor="middle" fontSize="12" fill="#4169E1">1/4 = 3/12</text>
              </g>
            )}

            {/* Final Result */}
            {operationStep >= 4 && (
              <g className="animate-lesson-fade-in">
                <rect x="350" y="60" width="120" height="60" fill="#F0FFF0" stroke="#228B22" strokeWidth="2" rx="5" />
                {/* 12 divisions */}
                {Array.from({length: 11}).map((_, i) => (
                  <line 
                    key={i}
                    x1={360 + i * 10} 
                    y1="60" 
                    x2={360 + i * 10} 
                    y2="120" 
                    stroke="#228B22" 
                    strokeWidth="1" 
                  />
                ))}
                
                {/* Fill 11 parts */}
                {Array.from({length: 11}).map((_, i) => (
                  <rect 
                    key={i}
                    x={352 + i * 10} 
                    y="62" 
                    width="8" 
                    height="56" 
                    fill="#228B22" 
                    opacity="0.7"
                    className="animate-lesson-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
                
                <text x="410" y="145" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#228B22">11/12</text>
              </g>
            )}

            {/* Final equation */}
            {operationStep >= 5 && (
              <g className="animate-lesson-fade-in">
                <text x="250" y="50" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#228B22">
                  8/12 + 3/12 = 11/12
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  function PowersRootsAnimation() {
    const [powerStep, setPowerStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startAnimation = () => {
      setIsPlaying(true);
      setPowerStep(0);
      const interval = setInterval(() => {
        setPowerStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1800);
    };

    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-purple-800 mb-2">
            {language === 'en' ? 'Square Field Area Calculation' : 
             language === 'hi' ? 'वर्गाकार खेत का क्षेत्रफल गणना' :
             'ବର୍ଗାକାର କ୍ଷେତ କ୍ଷେତ୍ରଫଳ ଗଣନା'}
          </h4>
          <Button onClick={startAnimation} disabled={isPlaying} className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            {t.watchAnimation}
          </Button>
        </div>

        <div className="relative h-64 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Square field */}
            {powerStep >= 0 && (
              <g className="animate-lesson-fade-in">
                <rect x="50" y="50" width="100" height="100" fill="#90EE90" stroke="#228B22" strokeWidth="3" rx="5" />
                <text x="100" y="40" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#228B22">
                  {language === 'en' ? 'Square Field' : language === 'hi' ? 'वर्गाकार खेत' : 'ବର୍ଗାକାର କ୍ଷେତ'}
                </text>
              </g>
            )}

            {/* Side length annotation */}
            {powerStep >= 1 && (
              <g className="animate-lesson-fade-in">
                <line x1="45" y1="50" x2="45" y2="150" stroke="#FF4500" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <text x="30" y="100" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FF4500" transform="rotate(-90, 30, 100)">
                  2/3 m
                </text>
                
                <line x1="50" y1="155" x2="150" y2="155" stroke="#FF4500" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <text x="100" y="170" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#FF4500">
                  2/3 m
                </text>
              </g>
            )}

            {/* Power calculation */}
            {powerStep >= 2 && (
              <g className="animate-lesson-fade-in">
                <rect x="200" y="70" width="150" height="80" fill="#FFF8DC" stroke="#DAA520" strokeWidth="2" rx="5" />
                <text x="275" y="90" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
                  {language === 'en' ? 'Area = side²' : language === 'hi' ? 'क्षेत्रफल = भुजा²' : 'କ୍ଷେତ୍ରଫଳ = ପାର୍ଶ୍ୱ²'}
                </text>
                <text x="275" y="110" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#DAA520">
                  = (2/3)²
                </text>
              </g>
            )}

            {/* Step-by-step solution */}
            {powerStep >= 3 && (
              <g className="animate-lesson-fade-in">
                <text x="275" y="130" textAnchor="middle" fontSize="14" fill="#333">
                  = (2×2)/(3×3)
                </text>
              </g>
            )}

            {powerStep >= 4 && (
              <g className="animate-lesson-fade-in">
                <text x="275" y="145" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#228B22">
                  = 4/9 m²
                </text>
              </g>
            )}

            {/* Arrow definitions */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#FF4500" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    );
  }

  const handleLessonComplete = (lessonIndex: number) => {
    setStudentProgress(prev => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
      conceptsUnderstood: prev.conceptsUnderstood + 1,
      totalXP: prev.totalXP + 100
    }));

    // Unlock next lesson
    if (lessonIndex < lessonContent.length - 1) {
      // Unlock next lesson logic here
    }
  };

  const handlePracticeAnswer = (answer: string | number) => {
    setSelectedAnswer(answer);
    const currentLessonData = lessonContent[currentLesson];
    const currentProblemData = currentLessonData.practiceProblems[currentProblem];
    const correct = answer === currentProblemData.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setStudentProgress(prev => ({
        ...prev,
        practiceScore: prev.practiceScore + 10,
        totalXP: prev.totalXP + 20
      }));
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      if (currentProblem < currentLessonData.practiceProblems.length - 1) {
        setCurrentProblem(currentProblem + 1);
      } else {
        handleLessonComplete(currentLesson);
        if (currentLesson < lessonContent.length - 1) {
          setCurrentLesson(currentLesson + 1);
          setCurrentProblem(0);
        } else {
          // All lessons completed
          onComplete(studentProgress.totalXP, studentProgress.totalXP);
        }
      }
    }, 3000);
  };

  if (gameMode === 'learning') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={onBack} className="bg-white/80">
              ← Back to Farm
            </Button>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                <Brain className="h-4 w-4 mr-2" />
                XP: {studentProgress.totalXP}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                <Trophy className="h-4 w-4 mr-2" />
                Concepts: {studentProgress.conceptsUnderstood}
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Calculator className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-800 mb-2">{t.title}</CardTitle>
              <p className="text-lg text-green-700">{t.subtitle}</p>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="concept" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="concept" className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>{t.conceptExplorer}</span>
                  </TabsTrigger>
                  <TabsTrigger value="interactive" className="flex items-center space-x-2">
                    <Hand className="h-4 w-4" />
                    <span>{t.tryInteractive}</span>
                  </TabsTrigger>
                  <TabsTrigger value="practice" className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>{t.practiceNow}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="concept" className="space-y-6">
                  {/* Concept Learning Section */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                      <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-3">
                        <BookOpen className="h-6 w-6" />
                        {lessonContent[currentLesson].title}
                      </h3>
                      <p className="text-blue-700 text-lg leading-relaxed mb-6">
                        {lessonContent[currentLesson].explanation}
                      </p>
                    </div>

                    {/* Visual Demo */}
                    {lessonContent[currentLesson].visualDemo}

                    {/* Examples Section */}
                    <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                      <h4 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        {language === 'en' ? 'Worked Example' : language === 'hi' ? 'हल किया गया उदाहरण' : 'ସମାଧାନ ହୋଇଥିବା ଉଦାହରଣ'}
                      </h4>
                      
                      {lessonContent[currentLesson].examples.map((example, index) => (
                        <div key={index} className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border-2 border-amber-300">
                            <h5 className="font-bold text-gray-800 mb-2">
                              {language === 'en' ? 'Problem:' : language === 'hi' ? 'समस्या:' : 'ସମସ୍ୟା:'} {example.problem}
                            </h5>
                            <p className="text-green-700 font-bold text-lg">
                              {language === 'en' ? 'Answer:' : language === 'hi' ? 'उत्तर:' : 'ଉତ୍ତର:'} {example.solution}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Button
                              onClick={() => setShowSteps(!showSteps)}
                              variant="outline"
                              className="mb-4"
                            >
                              {showSteps ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-2" />
                                  {t.hideSteps}
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                  {t.showSteps}
                                </>
                              )}
                            </Button>
                            
                            {showSteps && (
                              <div className="bg-white rounded-lg p-4 border-2 border-blue-300 space-y-2">
                                {example.steps.map((step, stepIndex) => (
                                  <div 
                                    key={stepIndex} 
                                    className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 animate-lesson-fade-in"
                                    style={{ animationDelay: `${stepIndex * 200}ms` }}
                                  >
                                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                      {stepIndex + 1}
                                    </div>
                                    <p className="text-blue-800">{step}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-6">
                      <Button
                        onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                        disabled={currentLesson === 0}
                        variant="outline"
                      >
                        ← Previous
                      </Button>
                      
                      <div className="flex space-x-2">
                        {lessonContent.map((_, index) => (
                          <div
                            key={index}
                            className={`w-3 h-3 rounded-full ${
                              index === currentLesson 
                                ? 'bg-blue-500' 
                                : index < currentLesson 
                                ? 'bg-green-500' 
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <Button
                        onClick={() => setCurrentLesson(Math.min(lessonContent.length - 1, currentLesson + 1))}
                        disabled={currentLesson === lessonContent.length - 1}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        {t.nextConcept} →
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="interactive" className="space-y-6">
                  {/* Interactive Demo Section */}
                  <div className="text-center space-y-6">
                    <h3 className="text-2xl font-bold text-purple-800">
                      {language === 'en' ? 'Interactive Learning Experience' : 
                       language === 'hi' ? 'इंटरैक्टिव सीखने का अनुभव' :
                       'ଇଣ୍ଟରାକ୍ଟିଭ ଶିଖନ ଅଭିଜ୍ଞତା'}
                    </h3>
                    
                    {/* Current lesson's visual demo with enhanced interactivity */}
                    {lessonContent[currentLesson].visualDemo}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
                        <CardContent className="p-6 text-center">
                          <Sprout className="h-12 w-12 text-green-600 mx-auto mb-4" />
                          <h4 className="text-lg font-bold text-green-800 mb-2">
                            {language === 'en' ? 'Seed Calculator' : language === 'hi' ? 'बीज कैलकुलेटर' : 'ବିହନ କ୍ୟାଲକୁଲେଟର'}
                          </h4>
                          <p className="text-green-700 text-sm">
                            {language === 'en' ? 'Calculate rational numbers for seed distributions' :
                             language === 'hi' ? 'बीज वितरण के लिए परिमेय संख्याओं की गणना करें' :
                             'ବିହନ ବଣ୍ଟନ ପାଇଁ ପରିମେୟ ସଂଖ୍ୟା ଗଣନା କରନ୍ତୁ'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                        <CardContent className="p-6 text-center">
                          <Calculator className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                          <h4 className="text-lg font-bold text-purple-800 mb-2">
                            {language === 'en' ? 'Field Area Calculator' : language === 'hi' ? 'खेत क्षेत्रफल कैलकुलेटर' : 'କ୍ଷେତ କ୍ଷେତ୍ରଫଳ କ୍ୟାଲକୁଲେଟର'}
                          </h4>
                          <p className="text-purple-700 text-sm">
                            {language === 'en' ? 'Practice powers and roots with field measurements' :
                             language === 'hi' ? 'खेत की माप के साथ घात और मूल का अभ्यास करें' :
                             'କ୍ଷେତ ମାପ ସହିତ ଶକ୍ତି ଏବଂ ମୂଳ ଅଭ୍ୟାସ କରନ୍ତୁ'}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="practice" className="space-y-6">
                  {/* Practice Problems Section */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Practice Problems' : language === 'hi' ? 'अभ्यास की समस्याएं' : 'ଅଭ୍ୟାସ ସମସ୍ୟା'}
                      </h3>
                      <p className="text-green-700">
                        {language === 'en' ? 'Apply your knowledge with agricultural scenarios' :
                         language === 'hi' ? 'कृषि परिदृश्यों के साथ अपने ज्ञान को लागू करें' :
                         'କୃଷି ପରିସ୍ଥିତି ସହିତ ଆପଣଙ୍କ ଜ୍ଞାନ ପ୍ରୟୋଗ କରନ୍ତୁ'}
                      </p>
                    </div>

                    {currentProblem < lessonContent[currentLesson].practiceProblems.length && (
                      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl text-green-800">
                              {language === 'en' ? `Problem ${currentProblem + 1}` : 
                               language === 'hi' ? `समस्या ${currentProblem + 1}` :
                               `ସମସ୍ୟା ${currentProblem + 1}`}
                            </CardTitle>
                            <Badge className="bg-blue-100 text-blue-800">
                              {currentProblem + 1} / {lessonContent[currentLesson].practiceProblems.length}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                          <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                            <p className="text-lg text-gray-800 leading-relaxed">
                              {lessonContent[currentLesson].practiceProblems[currentProblem].question}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {lessonContent[currentLesson].practiceProblems[currentProblem].options.map((option, index) => (
                              <Button
                                key={index}
                                onClick={() => !showFeedback && handlePracticeAnswer(option)}
                                disabled={showFeedback}
                                className={`p-6 text-lg font-medium rounded-xl border-2 transition-all duration-300 ${
                                  selectedAnswer === option
                                    ? isCorrect
                                      ? 'bg-green-100 border-green-400 text-green-800'
                                      : 'bg-red-100 border-red-400 text-red-800'
                                    : 'bg-white border-gray-200 hover:border-green-400 hover:bg-green-50 text-gray-800'
                                } ${showFeedback && option === lessonContent[currentLesson].practiceProblems[currentProblem].answer ? 'bg-green-100 border-green-400 text-green-800' : ''}`}
                              >
                                <div className="flex items-center justify-center space-x-3">
                                  <span>{option}</span>
                                  {showFeedback && selectedAnswer === option && (
                                    isCorrect ? <CheckCircle className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-red-600" />
                                  )}
                                  {showFeedback && option === lessonContent[currentLesson].practiceProblems[currentProblem].answer && selectedAnswer !== option && (
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                  )}
                                </div>
                              </Button>
                            ))}
                          </div>

                          {showFeedback && (
                            <div className={`p-6 rounded-xl border-2 ${
                              isCorrect 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-orange-50 border-orange-200'
                            }`}>
                              <div className="flex items-center space-x-3 mb-4">
                                {isCorrect ? (
                                  <CheckCircle className="h-8 w-8 text-green-600" />
                                ) : (
                                  <Lightbulb className="h-8 w-8 text-orange-600" />
                                )}
                                <span className={`text-lg font-medium ${
                                  isCorrect ? 'text-green-800' : 'text-orange-800'
                                }`}>
                                  {isCorrect ? t.excellent : t.tryAgain}
                                </span>
                              </div>
                              <p className={`${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                                {lessonContent[currentLesson].practiceProblems[currentProblem].explanation}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Game completion screen or return to default state
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
      <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 shadow-2xl max-w-2xl w-full">
        <CardHeader className="text-center pb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-3xl text-gray-800 mb-2">
            {language === 'en' ? 'Congratulations!' : language === 'hi' ? 'बधाई हो!' : 'ଅଭିନନ୍ଦନ!'}
          </CardTitle>
          <p className="text-lg text-green-700">
            {language === 'en' ? 'You have mastered Rational Numbers!' : 
             language === 'hi' ? 'आपने परिमेय संख्याओं में महारत हासिल कर ली है!' :
             'ଆପଣ ପରିମେୟ ସଂଖ୍ୟାରେ ଦକ୍ଷତା ହାସଲ କରିଛନ୍ତି!'}
          </p>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800 font-medium">Total XP</p>
              <p className="text-2xl font-bold text-blue-600">{studentProgress.totalXP}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">Concepts Mastered</p>
              <p className="text-2xl font-bold text-green-600">{studentProgress.conceptsUnderstood}</p>
            </div>
          </div>

          <Button 
            onClick={() => onComplete(studentProgress.totalXP, studentProgress.totalXP)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg"
          >
            Return to Agricultural Hub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}