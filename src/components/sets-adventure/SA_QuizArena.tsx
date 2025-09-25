import React, { useState, useEffect, useCallback } from 'react';
import { Timer, ArrowLeft, ArrowRight, Flag, Eye, RotateCcw, CheckCircle, AlertCircle, Star, Target, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

// SA QUIZ ARENA - 15 Multilingual Questions with Timer & Explanations
// Full implementation matching the exact questions from the brief

interface QuizArenaProps {
  language?: 'en' | 'hi' | 'or';
  className?: string;
}

interface QuizQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'yes-no' | 'numeric' | 'text-input';
  question: {
    en: string;
    hi: string;
    or: string;
  };
  options?: {
    en: string[];
    hi: string[];
    or: string[];
  };
  correctAnswer: string | number;
  explanation: {
    en: string;
    hi: string;
    or: string;
  };
  points: number;
}

const quizQuestions: QuizQuestion[] = [
  // EASY (5 questions)
  {
    id: 'q1',
    difficulty: 'easy',
    type: 'multiple-choice',
    question: {
      en: 'Which symbol denotes the empty set?',
      hi: 'कौन सा चिह्न रिक्त समुच्चय को दर्शाता है?',
      or: 'କେଉଁ ପ୍ରତୀକ ଖାଲି ସେଟ୍ କୁ ସୂଚିତ କରେ?'
    },
    options: {
      en: ['{}', '∅', 'Ø', 'None'],
      hi: ['{}', '∅', 'Ø', 'कोई नहीं'],
      or: ['{}',' ∅', 'Ø', 'କିଛି ନୁହେଁ']
    },
    correctAnswer: '∅',
    explanation: {
      en: 'The empty set is denoted by ∅ (phi symbol), representing a set with no elements.',
      hi: 'रिक्त समुच्चय को ∅ (फाई चिह्न) से दर्शाया जाता है, जो बिना किसी तत्व वाले समुच्चय को दर्शाता है।',
      or: 'ଖାଲି ସେଟ୍ କୁ ∅ (ଫାଇ ପ୍ରତୀକ) ଦ୍ୱାରା ସୂଚିତ କରାଯାଏ, ଯାହା କୌଣସି ଉପାଦାନ ନଥିବା ସେଟ୍ କୁ ପ୍ରତିନିଧିତ୍ୱ କରେ।'
    },
    points: 10
  },
  {
    id: 'q2',
    difficulty: 'easy',
    type: 'multiple-choice',
    question: {
      en: 'Is {1,2,3} finite or infinite?',
      hi: 'क्या {1,2,3} परिमित है या अपरिमित?',
      or: '{1,2,3} ସୀମିତ ନା ଅସୀମିତ?'
    },
    options: {
      en: ['Finite', 'Infinite'],
      hi: ['परिमित', 'अपरिमित'],
      or: ['ସୀମିତ', 'ଅସୀମିତ']
    },
    correctAnswer: 'Finite',
    explanation: {
      en: 'The set {1,2,3} has exactly 3 elements, making it a finite set.',
      hi: 'समुच्चय {1,2,3} में ठीक 3 तत्व हैं, इसलिए यह एक परिमित समुच्चय है।',
      or: 'ସେଟ୍ {1,2,3} ରେ ଠିକ୍ 3 ଟି ଉପାଦାନ ଅଛି, ଏହାକୁ ଏକ ସୀମିତ ସେଟ୍ କରେ।'
    },
    points: 10
  },
  {
    id: 'q3',
    difficulty: 'easy',
    type: 'yes-no',
    question: {
      en: 'If A={1,2} B={2,3} is 2 in A ∪ B?',
      hi: 'यदि A={1,2} B={2,3} तो क्या 2, A ∪ B में है?',
      or: 'ଯଦି A={1,2} B={2,3} ତେବେ 2 କି A ∪ B ରେ ଅଛି?'
    },
    correctAnswer: 'Yes',
    explanation: {
      en: 'Yes, since A ∪ B = {1,2,3} and 2 is present in this union.',
      hi: 'हाँ, क्योंकि A ∪ B = {1,2,3} और 2 इस संघ में मौजूद है।',
      or: 'ହଁ, କାରଣ A ∪ B = {1,2,3} ଏବଂ 2 ଏହି ମିଳନରେ ଉପସ୍ଥିତ ଅଛି।'
    },
    points: 10
  },
  {
    id: 'q4',
    difficulty: 'easy',
    type: 'multiple-choice',
    question: {
      en: 'Which symbol denotes intersection?',
      hi: 'कौन सा चिह्न प्रतिच्छेदन को दर्शाता है?',
      or: 'କେଉଁ ପ୍ରତୀକ ଛେଦ କୁ ସୂଚିତ କରେ?'
    },
    options: {
      en: ['∪', '∩', '\\', '^'],
      hi: ['∪', '∩', '\\', '^'],
      or: ['∪', '∩', '\\', '^']
    },
    correctAnswer: '∩',
    explanation: {
      en: 'The intersection symbol ∩ represents the common elements between sets.',
      hi: 'प्रतिच्छेदन चिह्न ∩ समुच्चयों के बीच सामान्य तत्वों को दर्शाता है।',
      or: 'ଛେଦ ପ୍ରତୀକ ∩ ସେଟ୍ ଗୁଡ଼ିକ ମଧ୍ୟରେ ସାଧାରଣ ଉପାଦାନଗୁଡ଼ିକୁ ପ୍ରତିନିଧିତ୍ୱ କରେ।'
    },
    points: 10
  },
  {
    id: 'q5',
    difficulty: 'easy',
    type: 'yes-no',
    question: {
      en: 'Is ∅ a subset of every set?',
      hi: 'क्या ∅ हर समुच्चय का उपसमुच्चय है?',
      or: '∅ କ'ଣ ପ୍ରତ୍ୟେକ ସେଟ୍ ର ଉପସେଟ୍?'
    },
    correctAnswer: 'Yes',
    explanation: {
      en: 'Yes, the empty set ∅ is a subset of every set by definition.',
      hi: 'हाँ, रिक्त समुच्चय ∅ परिभाषा के अनुसार हर समुच्चय का उपसमुच्चय है।',
      or: 'ହଁ, ଖାଲି ସେଟ୍ ∅ ସଂଜ୍ଞା ଅନୁସାରେ ପ୍ରତ୍ୟେକ ସେଟ୍ ର ଉପସେଟ୍ ଅଟେ।'
    },
    points: 10
  },

  // MEDIUM (5 questions)
  {
    id: 'q6',
    difficulty: 'medium',
    type: 'multiple-choice',
    question: {
      en: 'If A={1,2,3}, what is |P(A)|?',
      hi: 'यदि A={1,2,3}, तो |P(A)| क्या है?',
      or: 'ଯଦି A={1,2,3}, ତେବେ |P(A)| କ'ଣ?'
    },
    options: {
      en: ['3', '6', '8', '9'],
      hi: ['3', '6', '8', '9'],
      or: ['3', '6', '8', '9']
    },
    correctAnswer: '8',
    explanation: {
      en: 'The power set P(A) has 2^n elements where n=3, so |P(A)| = 2³ = 8.',
      hi: 'घात समुच्चय P(A) में 2^n तत्व होते हैं जहाँ n=3, इसलिए |P(A)| = 2³ = 8।',
      or: 'ଶକ୍ତି ସେଟ୍ P(A) ରେ 2^n ଉପାଦାନ ଅଛି ଯେଉଁଠାରେ n=3, ତେଣୁ |P(A)| = 2³ = 8।'
    },
    points: 15
  },
  {
    id: 'q7',
    difficulty: 'medium',
    type: 'yes-no',
    question: {
      en: 'Is 0 included in the interval (-1,0]?',
      hi: 'क्या 0 अंतराल (-1,0] में शामिल है?',
      or: '0 କ'ଣ ବ୍ୟବଧାନ (-1,0] ରେ ଅନ୍ତର୍ଭୁକ୍ତ?'
    },
    correctAnswer: 'Yes',
    explanation: {
      en: 'Yes, the bracket ] means 0 is included in the interval (-1,0].',
      hi: 'हाँ, ब्रैकेट ] का मतलब है कि 0 अंतराल (-1,0] में शामिल है।',
      or: 'ହଁ, ବ୍ରାକେଟ୍ ] ର ଅର୍ଥ ହେଉଛି 0 ବ୍ୟବଧାନ (-1,0] ରେ ଅନ୍ତର୍ଭୁକ୍ତ।'
    },
    points: 15
  },
  {
    id: 'q8',
    difficulty: 'medium',
    type: 'text-input',
    question: {
      en: 'A={a,b,c}, B={b,c,d}. What is A ∩ B?',
      hi: 'A={a,b,c}, B={b,c,d}। A ∩ B क्या है?',
      or: 'A={a,b,c}, B={b,c,d}। A ∩ B କ'ଣ?'
    },
    correctAnswer: '{b,c}',
    explanation: {
      en: 'A ∩ B contains elements common to both sets: {b,c}.',
      hi: 'A ∩ B में दोनों समुच्चयों के सामान्य तत्व होते हैं: {b,c}।',
      or: 'A ∩ B ରେ ଦୁଇଟି ସେଟ୍ ର ସାଧାରଣ ଉପାଦାନ ଅଛି: {b,c}।'
    },
    points: 15
  },
  {
    id: 'q9',
    difficulty: 'medium',
    type: 'text-input',
    question: {
      en: 'If U={1..10} and A={2,4,6}, what is A^c?',
      hi: 'यदि U={1..10} और A={2,4,6}, तो A^c क्या है?',
      or: 'ଯଦି U={1..10} ଏବଂ A={2,4,6}, ତେବେ A^c କ'ଣ?'
    },
    correctAnswer: '{1,3,5,7,8,9,10}',
    explanation: {
      en: 'The complement A^c contains all elements in U that are not in A.',
      hi: 'पूरक A^c में U के वे सभी तत्व होते हैं जो A में नहीं हैं।',
      or: 'ପୂରକ A^c ରେ U ର ସେହି ସମସ୍ତ ଉପାଦାନ ଅଛି ଯାହା A ରେ ନାହିଁ।'
    },
    points: 15
  },
  {
    id: 'q10',
    difficulty: 'medium',
    type: 'yes-no',
    question: {
      en: 'True/False: A⊆B and B⊆A implies A=B',
      hi: 'सत्य/असत्य: A⊆B और B⊆A का मतलब A=B है',
      or: 'ସତ୍ୟ/ମିଥ୍ୟା: A⊆B ଏବଂ B⊆A ର ଅର୍ଥ A=B'
    },
    correctAnswer: 'True',
    explanation: {
      en: 'True. If A⊆B and B⊆A, then both sets contain exactly the same elements, so A=B.',
      hi: 'सत्य। यदि A⊆B और B⊆A, तो दोनों समुच्चयों में बिल्कुल समान तत्व होते हैं, इसलिए A=B।',
      or: 'ସତ୍ୟ। ଯଦି A⊆B ଏବଂ B⊆A, ତେବେ ଦୁଇଟି ସେଟ୍ ରେ ସମାନ ଉପାଦାନ ଅଛି, ତେଣୁ A=B।'
    },
    points: 15
  },

  // HARD (5 questions)
  {
    id: 'q11',
    difficulty: 'hard',
    type: 'numeric',
    question: {
      en: '|A|=4, |B|=5, |A∩B|=2. Find |A∪B|.',
      hi: '|A|=4, |B|=5, |A∩B|=2। |A∪B| ज्ञात करें।',
      or: '|A|=4, |B|=5, |A∩B|=2। |A∪B| ଖୋଜ।'
    },
    correctAnswer: 7,
    explanation: {
      en: 'Using the formula: |A∪B| = |A| + |B| - |A∩B| = 4 + 5 - 2 = 7.',
      hi: 'सूत्र का उपयोग: |A∪B| = |A| + |B| - |A∩B| = 4 + 5 - 2 = 7।',
      or: 'ସୂତ୍ର ବ୍ୟବହାର କରି: |A∪B| = |A| + |B| - |A∩B| = 4 + 5 - 2 = 7।'
    },
    points: 20
  },
  {
    id: 'q12',
    difficulty: 'hard',
    type: 'numeric',
    question: {
      en: '3-set Venn: M=40,P=35,C=30, M∩P=10,P∩C=5,M∩C=8, all three=3. Find students with at least one subject.',
      hi: '3-सेट वेन: M=40,P=35,C=30, M∩P=10,P∩C=5,M∩C=8, तीनों=3। कम से कम एक विषय वाले छात्र ज्ञात करें।',
      or: '3-ସେଟ୍ ଭେନ୍: M=40,P=35,C=30, M∩P=10,P∩C=5,M∩C=8, ତିନୋଟି=3। ଅତି କମରେ ଗୋଟିଏ ବିଷୟ ଥିବା ଛାତ୍ରମାନଙ୍କୁ ଖୋଜ।'
    },
    correctAnswer: 85,
    explanation: {
      en: 'Using inclusion-exclusion: |M∪P∪C| = 40+35+30-10-5-8+3 = 85.',
      hi: 'सम्मिलन-बहिष्करण का उपयोग: |M∪P∪C| = 40+35+30-10-5-8+3 = 85।',
      or: 'ଅନ୍ତର୍ଭୁକ୍ତି-ବର୍ଜନ ବ୍ୟବହାର କରି: |M∪P∪C| = 40+35+30-10-5-8+3 = 85।'
    },
    points: 20
  },
  {
    id: 'q13',
    difficulty: 'hard',
    type: 'multiple-choice',
    question: {
      en: 'Which numbers are in {x | x² < 9}?',
      hi: 'कौन सी संख्याएँ {x | x² < 9} में हैं?',
      or: 'କେଉଁ ସଂଖ୍ୟାଗୁଡ଼ିକ {x | x² < 9} ରେ ଅଛି?'
    },
    options: {
      en: ['{-2,-1,0,1,2}', '{-3,-2,-1,0,1,2,3}', '{1,2}', 'All real numbers'],
      hi: ['{-2,-1,0,1,2}', '{-3,-2,-1,0,1,2,3}', '{1,2}', 'सभी वास्तविक संख्याएँ'],
      or: ['{-2,-1,0,1,2}', '{-3,-2,-1,0,1,2,3}', '{1,2}', 'ସମସ୍ତ ବାସ୍ତବ ସଂଖ୍ୟା']
    },
    correctAnswer: '{-2,-1,0,1,2}',
    explanation: {
      en: 'For x² < 9, we need |x| < 3, so integers are: -2,-1,0,1,2.',
      hi: 'x² < 9 के लिए, हमें |x| < 3 चाहिए, इसलिए पूर्णांक हैं: -2,-1,0,1,2।',
      or: 'x² < 9 ପାଇଁ, ଆମକୁ |x| < 3 ଦରକାର, ତେଣୁ ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା: -2,-1,0,1,2।'
    },
    points: 20
  },
  {
    id: 'q14',
    difficulty: 'hard',
    type: 'numeric',
    question: {
      en: 'If |P(X)|=16 find |X|.',
      hi: 'यदि |P(X)|=16 तो |X| ज्ञात करें।',
      or: 'ଯଦି |P(X)|=16 ତେବେ |X| ଖୋଜ।'
    },
    correctAnswer: 4,
    explanation: {
      en: 'Since |P(X)| = 2^|X|, we have 2^|X| = 16 = 2⁴, so |X| = 4.',
      hi: 'चूंकि |P(X)| = 2^|X|, हमारे पास 2^|X| = 16 = 2⁴ है, इसलिए |X| = 4।',
      or: 'ଯେହେତୁ |P(X)| = 2^|X|, ଆମର 2^|X| = 16 = 2⁴ ଅଛି, ତେଣୁ |X| = 4।'
    },
    points: 20
  },
  {
    id: 'q15',
    difficulty: 'hard',
    type: 'numeric',
    question: {
      en: 'From 100 students, 60 like A, 50 like B, 30 like both. How many like A or B?',
      hi: '100 छात्रों में से, 60 को A पसंद है, 50 को B पसंद है, 30 को दोनों पसंद हैं। कितने को A या B पसंद है?',
      or: '100 ଛାତ୍ରଙ୍କ ମଧ୍ୟରୁ, 60 ଜଣ A ପସନ୍ଦ କରନ୍ତି, 50 ଜଣ B ପସନ୍ଦ କରନ୍ତି, 30 ଜଣ ଦୁଇଟିକୁ ପସନ୍ଦ କରନ୍ତି। କେତେ ଜଣ A କିମ୍ବା B ପସନ୍ଦ କରନ୍ତି?'
    },
    correctAnswer: 80,
    explanation: {
      en: 'Using |A∪B| = |A| + |B| - |A∩B| = 60 + 50 - 30 = 80.',
      hi: '|A∪B| = |A| + |B| - |A∩B| = 60 + 50 - 30 = 80 का उपयोग।',
      or: '|A∪B| = |A| + |B| - |A∩B| = 60 + 50 - 30 = 80 ବ୍ୟବହାର କରି।'
    },
    points: 20
  }
];

const SAQuizArena: React.FC<QuizArenaProps> = ({ language = 'en', className = "" }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(720); // 12 minutes in seconds
  const [isRunning, setIsRunning] = useState(true);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeRemaining > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setShowResults(true);
            calculateScore();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const calculateScore = useCallback(() => {
    let totalScore = 0;
    quizQuestions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer) {
        const correct = userAnswer.toLowerCase() === String(question.correctAnswer).toLowerCase();
        if (correct) {
          totalScore += question.points;
        }
      }
    });
    setScore(totalScore);
  }, [answers]);

  const handleAnswerSubmit = () => {
    if (currentAnswer.trim()) {
      setAnswers(prev => ({
        ...prev,
        [quizQuestions[currentQuestion].id]: currentAnswer
      }));
      setSubmitted(true);
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer(answers[quizQuestions[currentQuestion + 1]?.id] || '');
      setSubmitted(false);
      setShowExplanation(false);
    } else {
      setShowResults(true);
      calculateScore();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCurrentAnswer(answers[quizQuestions[currentQuestion - 1]?.id] || '');
      setSubmitted(!!answers[quizQuestions[currentQuestion - 1]?.id]);
      setShowExplanation(false);
    }
  };

  const toggleMarkQuestion = () => {
    setMarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const question = quizQuestions[currentQuestion];
  const isCorrect = currentAnswer.toLowerCase() === String(question?.correctAnswer).toLowerCase();
  const totalQuestions = quizQuestions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  if (showResults) {
    const maxScore = quizQuestions.reduce((sum, q) => sum + q.points, 0);
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              {passed ? <Trophy className="w-10 h-10 text-white" /> : <Target className="w-10 h-10 text-white" />}
            </div>
            <CardTitle className="text-3xl text-white mb-2">Quiz Complete!</CardTitle>
            <p className="text-slate-300">Sets Adventure Final Assessment</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {percentage}%
              </div>
              <div className="text-xl text-slate-300">
                {score} out of {maxScore} points
              </div>
              
              {/* Performance Badge */}
              <Badge 
                variant="outline" 
                className={`text-lg px-4 py-2 ${
                  percentage >= 80 ? 'text-green-400 border-green-400' :
                  percentage >= 60 ? 'text-yellow-400 border-yellow-400' :
                  'text-red-400 border-red-400'
                }`}
              >
                {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good!' : 'Keep Learning!'}
              </Badge>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-cyan-400">{answeredQuestions}</div>
                <div className="text-sm text-slate-400">Answered</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {quizQuestions.filter(q => answers[q.id]?.toLowerCase() === String(q.correctAnswer).toLowerCase()).length}
                </div>
                <div className="text-sm text-slate-400">Correct</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {answeredQuestions - quizQuestions.filter(q => answers[q.id]?.toLowerCase() === String(q.correctAnswer).toLowerCase()).length}
                </div>
                <div className="text-sm text-slate-400">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">{markedQuestions.size}</div>
                <div className="text-sm text-slate-400">Marked</div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Performance by Difficulty</h4>
              {['easy', 'medium', 'hard'].map(difficulty => {
                const difficultyQuestions = quizQuestions.filter(q => q.difficulty === difficulty);
                const correctCount = difficultyQuestions.filter(q => answers[q.id]?.toLowerCase() === String(q.correctAnswer).toLowerCase()).length;
                const total = difficultyQuestions.length;
                const percent = Math.round((correctCount / total) * 100);
                
                return (
                  <div key={difficulty} className="flex items-center space-x-4">
                    <div className={`w-20 text-sm font-medium capitalize ${
                      difficulty === 'easy' ? 'text-green-400' :
                      difficulty === 'medium' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {difficulty}
                    </div>
                    <div className="flex-1">
                      <Progress value={percent} className="h-2" />
                    </div>
                    <div className="text-sm text-slate-400 w-16 text-right">{correctCount}/{total}</div>
                  </div>
                );
              })}
            </div>

            {/* Confetti for high scores */}
            {percentage >= 80 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random()}s`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button 
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-slate-600 text-slate-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lessons
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white ${className}`}>
      {/* Quiz HUD */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Exit Quiz
          </Button>
          
          <div className="flex items-center space-x-6">
            {/* Timer */}
            <div className={`flex items-center space-x-2 ${timeRemaining <= 60 ? 'text-red-400' : 'text-cyan-400'}`}>
              <Timer className="w-5 h-5" />
              <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
            </div>
            
            {/* Progress */}
            <div className="text-slate-300">
              <span className="font-semibold">Q {currentQuestion + 1}</span>
              <span className="text-slate-400">/{totalQuestions}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsRunning(!isRunning)}
              className="text-slate-300"
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="fixed top-16 left-0 right-0 z-30 bg-slate-800/80 backdrop-blur-sm px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center space-x-1 mb-2">
            {quizQuestions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentQuestion(idx);
                  setCurrentAnswer(answers[quizQuestions[idx]?.id] || '');
                  setSubmitted(!!answers[quizQuestions[idx]?.id]);
                  setShowExplanation(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  idx === currentQuestion ? 'bg-cyan-500 scale-125' :
                  answers[quizQuestions[idx]?.id] ? 'bg-green-500' :
                  markedQuestions.has(idx) ? 'bg-yellow-500' :
                  'bg-slate-600'
                }`}
              />
            ))}
          </div>
          <Progress value={progressPercentage} className="h-1" />
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Question Card */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant="outline" 
                  className={`${
                    question?.difficulty === 'easy' ? 'text-green-400 border-green-400' :
                    question?.difficulty === 'medium' ? 'text-yellow-400 border-yellow-400' :
                    'text-red-400 border-red-400'
                  }`}
                >
                  {question?.difficulty === 'easy' ? 'Easy' : question?.difficulty === 'medium' ? 'Medium' : 'Hard'} • {question?.points} pts
                </Badge>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMarkQuestion}
                  className={`${markedQuestions.has(currentQuestion) ? 'text-yellow-400' : 'text-slate-400'}`}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Mark for Review
                </Button>
              </div>
              
              <CardTitle className="text-white text-xl leading-relaxed">
                {question?.question[language]}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Answer Input Section */}
              <div className="space-y-4">
                {question?.type === 'multiple-choice' && question.options && (
                  <div className="space-y-3">
                    {question.options[language].map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentAnswer(option)}
                        disabled={submitted}
                        className={`w-full p-4 text-left border rounded-lg transition-all duration-300 min-h-[56px] ${
                          currentAnswer === option
                            ? submitted
                              ? isCorrect
                                ? 'bg-green-900/30 border-green-500 text-green-100'
                                : 'bg-red-900/30 border-red-500 text-red-100'
                              : 'bg-cyan-900/30 border-cyan-500 text-cyan-100'
                            : 'bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-slate-500'
                        } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className="font-semibold mr-3">{String.fromCharCode(65 + idx)})</span>
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {question?.type === 'yes-no' && (
                  <div className="grid grid-cols-2 gap-4">
                    {['Yes', 'No'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setCurrentAnswer(option)}
                        disabled={submitted}
                        className={`p-4 text-center border rounded-lg transition-all duration-300 min-h-[56px] font-semibold ${
                          currentAnswer === option
                            ? submitted
                              ? isCorrect
                                ? 'bg-green-900/30 border-green-500 text-green-100'
                                : 'bg-red-900/30 border-red-500 text-red-100'
                              : 'bg-cyan-900/30 border-cyan-500 text-cyan-100'
                            : 'bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 hover:border-slate-500'
                        } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {(question?.type === 'text-input' || question?.type === 'numeric') && (
                  <div className="space-y-4">
                    <input
                      type={question.type === 'numeric' ? 'number' : 'text'}
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      disabled={submitted}
                      placeholder="Enter your answer..."
                      className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white text-lg font-mono min-h-[56px] focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                    
                    {/* Numeric Keypad for numeric questions */}
                    {question?.type === 'numeric' && !submitted && (
                      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
                          <button
                            key={num}
                            onClick={() => setCurrentAnswer(prev => prev + num)}
                            className="h-12 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentAnswer('')}
                          className="col-span-3 h-12 bg-red-600 hover:bg-red-500 text-white rounded-lg font-semibold transition-all duration-200"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              {!submitted && currentAnswer && (
                <Button
                  onClick={handleAnswerSubmit}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 min-h-[48px]"
                >
                  Submit Answer
                </Button>
              )}

              {/* Explanation */}
              {showExplanation && (
                <div className={`p-4 rounded-lg border-l-4 animate-quiz-feedback-slide ${
                  isCorrect 
                    ? 'bg-green-900/20 border-l-green-500 border border-green-500/30' 
                    : 'bg-red-900/20 border-l-red-500 border border-red-500/30'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-semibold text-green-400">Correct!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <span className="font-semibold text-red-400">Incorrect</span>
                      </>
                    )}
                    <Badge variant="outline" className="ml-auto">
                      +{isCorrect ? question?.points : 0} pts
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {question?.explanation[language]}
                  </p>
                  {!isCorrect && (
                    <div className="mt-2 text-sm text-yellow-400">
                      Correct answer: <span className="font-mono">{question?.correctAnswer}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="border-slate-600 text-slate-200 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-400">
              {answeredQuestions}/{totalQuestions} answered
            </span>
            <span className="text-sm text-slate-400">•</span>
            <span className="text-sm text-slate-400">
              {markedQuestions.size} marked
            </span>
          </div>

          <Button
            onClick={handleNextQuestion}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 min-h-[44px]"
          >
            {currentQuestion === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Component Showcase
export const SA_QuizArena: React.FC<QuizArenaProps> = ({ language = 'en', className = "" }) => {
  const [demoMode, setDemoMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'or'>(language);

  if (!demoMode) {
    return <SAQuizArena language={selectedLanguage} className={className} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white p-6 ${className}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            SA Quiz Arena
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Complete 15-question quiz with timer, instant feedback, multilingual support, and comprehensive scoring system.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center space-x-4">
          {[
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
            { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' }
          ].map((lang) => (
            <Button
              key={lang.code}
              variant={selectedLanguage === lang.code ? 'default' : 'outline'}
              onClick={() => setSelectedLanguage(lang.code as 'en' | 'hi' | 'or')}
              className="min-h-[44px]"
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </Button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center">
                <Timer className="w-5 h-5 mr-2" />
                Timer System
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300 space-y-2">
              <p>• 12-minute countdown timer</p>
              <p>• Auto-submit on expiry</p>
              <p>• Visual warning at 1 minute</p>
              <p>• Pause/resume functionality</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Question Types
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300 space-y-2">
              <p>• Multiple choice (A, B, C, D)</p>
              <p>• Yes/No questions</p>
              <p>• Numeric input with keypad</p>
              <p>• Text input validation</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center">
                <Flag className="w-5 h-5 mr-2" />
                Review Features
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300 space-y-2">
              <p>• Mark questions for review</p>
              <p>• Progress dot navigation</p>
              <p>• Skip and return later</p>
              <p>• Answer persistence</p>
            </CardContent>
          </Card>
        </div>

        {/* Question Distribution */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Question Distribution & Scoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="text-green-400 font-semibold">Easy (5 questions)</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>• Empty set notation</p>
                  <p>• Finite vs infinite sets</p>
                  <p>• Basic union operations</p>
                  <p>• Set symbols</p>
                  <p>• Subset fundamentals</p>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  10 points each
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="text-yellow-400 font-semibold">Medium (5 questions)</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>• Power set cardinality</p>
                  <p>• Interval notation</p>
                  <p>• Set operations</p>
                  <p>• Complement calculations</p>
                  <p>• Subset relationships</p>
                </div>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  15 points each
                </Badge>
              </div>

              <div className="space-y-3">
                <h4 className="text-red-400 font-semibold">Hard (5 questions)</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>• Complex union formulas</p>
                  <p>• 3-set Venn diagrams</p>
                  <p>• Set-builder notation</p>
                  <p>• Power set relationships</p>
                  <p>• Real-world applications</p>
                </div>
                <Badge variant="outline" className="text-red-400 border-red-400">
                  20 points each
                </Badge>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-cyan-400">225</div>
                  <div className="text-sm text-slate-400">Total Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">80%+</div>
                  <div className="text-sm text-slate-400">Excellent</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">60%+</div>
                  <div className="text-sm text-slate-400">Pass Grade</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">15</div>
                  <div className="text-sm text-slate-400">Questions</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Questions Preview */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sample Questions ({selectedLanguage.toUpperCase()})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[quizQuestions[0], quizQuestions[5], quizQuestions[10]].map((q, idx) => (
              <div key={q.id} className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={`${
                    q.difficulty === 'easy' ? 'text-green-400 border-green-400' :
                    q.difficulty === 'medium' ? 'text-yellow-400 border-yellow-400' :
                    'text-red-400 border-red-400'
                  }`}>
                    {q.difficulty} • {q.points} pts
                  </Badge>
                  <span className="text-sm text-slate-400">{q.type}</span>
                </div>
                <p className="text-white font-medium mb-2">{q.question[selectedLanguage]}</p>
                {q.options && (
                  <div className="text-sm text-slate-400">
                    Options: {q.options[selectedLanguage].join(', ')}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Start Quiz Button */}
        <div className="text-center">
          <Button
            onClick={() => setDemoMode(false)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-8 py-4 text-lg min-h-[56px]"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Quiz Arena ({selectedLanguage.toUpperCase()})
          </Button>
          <p className="text-sm text-slate-400 mt-2">
            Complete all 15 questions within 12 minutes to earn your certification
          </p>
        </div>
      </div>
    </div>
  );
};

export default SA_QuizArena;