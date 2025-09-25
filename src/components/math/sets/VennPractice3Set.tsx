import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Eye, Lightbulb, RotateCcw, Volume2, VolumeX, Trophy, Calculator } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface VennPractice3SetProps {
  language: Language;
  onComplete: () => void;
  onBack: () => void;
}

interface Problem {
  id: string;
  title: {
    en: string;
    hi: string;
    or: string;
  };
  story: {
    en: string;
    hi: string;
    or: string;
  };
  setA: {
    en: string;
    hi: string;
    or: string;
  };
  setB: {
    en: string;
    hi: string;
    or: string;
  };
  setC: {
    en: string;
    hi: string;
    or: string;
  };
  universe: number;
  onlyA: number;
  onlyB: number;
  onlyC: number;
  AandB: number; // A ∩ B only (not C)
  AandC: number; // A ∩ C only (not B)  
  BandC: number; // B ∩ C only (not A)
  AandBandC: number; // A ∩ B ∩ C
  none: number; // None of A, B, or C
  question: {
    en: string;
    hi: string;
    or: string;
  };
  answer: number;
  region: string; // Which region the answer represents
}

const translations = {
  title: {
    en: 'Venn Diagram Practice - 3-Set Problems',
    hi: 'वेन आरेख अभ्यास - 3-सेट समस्याएं',
    or: 'ଭେନ୍ ଚିତ୍ର ଅଭ୍ୟାସ - 3-ସେଟ୍ ସମସ୍ୟା'
  },
  instructions: {
    en: 'Solve the problem step by step using the numeric keypad',
    hi: 'संख्यात्मक कीपैड का उपयोग करके समस्या को चरणबद्ध रूप से हल करें',
    or: 'ସାଂଖ୍ୟିକ କି-ପ୍ୟାଡ୍ ବ୍ୟବହାର କରି ସମସ୍ୟାକୁ ପର୍ଯ୍ୟାୟକ୍ରମେ ସମାଧାନ କରନ୍ତୁ'
  },
  givens: {
    en: 'Given Information:',
    hi: 'दी गई जानकारी:',
    or: 'ଦିଆଯାଇଥିବା ସୂଚନା:'
  },
  universe: {
    en: 'Total students',
    hi: 'कुल छात्र',
    or: 'ମୋଟ ଛାତ୍ର'
  },
  onlySet: {
    en: 'Only {set}',
    hi: 'केवल {set}',
    or: 'କେବଳ {set}'
  },
  bothSets: {
    en: 'Both {setA} and {setB}',
    hi: '{setA} और {setB} दोनों',
    or: '{setA} ଏବଂ {setB} ଦୁଇଟି'
  },
  allThreeSets: {
    en: 'All three sets',
    hi: 'तीनों सेट',
    or: 'ସମସ୍ତ ତିନୋଟି ସେଟ୍'
  },
  none: {
    en: 'None of the sets',
    hi: 'कोई भी सेट नहीं',
    or: 'କୌଣସି ସେଟ୍ ନୁହେଁ'
  },
  question: {
    en: 'Question:',
    hi: 'प्रश्न:',
    or: 'ପ୍ରଶ୍ନ:'
  },
  enterAnswer: {
    en: 'Enter your answer:',
    hi: 'अपना उत्तर दर्ज करें:',
    or: 'ଆପଣଙ୍କ ଉତ୍ତର ପ୍ରବେଶ କରନ୍ତୁ:'
  },
  showHint: {
    en: 'Show 1 Hint',
    hi: '1 संकेत दिखाएं',
    or: '1 ଟି ସୂଚନା ଦେଖାନ୍ତୁ'
  },
  showSolution: {
    en: 'Show Solution',
    hi: 'समाधान दिखाएं',
    or: 'ସମାଧାନ ଦେଖାନ୍ତୁ'
  },
  checkAnswer: {
    en: 'Check Answer',
    hi: 'उत्तर जांचें',
    or: 'ଉତ୍ତର ଯାଞ୍ଚ କରନ୍ତୁ'
  },
  nextProblem: {
    en: 'Next Problem',
    hi: 'अगली समस्या',
    or: 'ପରବର୍ତ୍ତୀ ସମସ୍ୟା'
  },
  reset: {
    en: 'Reset',
    hi: 'रीसेट',
    or: 'ରିସେଟ୍'
  },
  correct: {
    en: 'Correct! Well done!',
    hi: 'सही! बहुत बढ़िया!',
    or: 'ସଠିକ୍! ବହୁତ ଭଲ!'
  },
  incorrect: {
    en: 'Not quite right. The correct answer is {answer}.',
    hi: 'बिल्कुल सही नहीं। सही उत्तर {answer} है।',
    or: 'ଠିକ୍ ନୁହେଁ। ସଠିକ୍ ଉତ୍ତର {answer} ଅଟେ।'
  },
  completed: {
    en: 'All problems completed! Excellent work!',
    hi: 'सभी समस्याएं पूरी हुईं! उत्कृष्ट कार्य!',
    or: 'ସମସ୍ତ ସମସ୍ୟା ସମ୍ପୂର୍ଣ୍ଣ! ଉତ୍କୃଷ୍ଟ କାର୍ଯ୍ୟ!'
  },
  hintText: {
    en: 'Look at the {region} region. Use the given data to calculate.',
    hi: '{region} क्षेत्र को देखें। गणना के लिए दिए गए डेटा का उपयोग करें।',
    or: '{region} ଅଞ୍ଚଳକୁ ଦେଖନ୍ତୁ। ଗଣନା ପାଇଁ ଦିଆଯାଇଥିବା ତଥ୍ୟ ବ୍ୟବହାର କରନ୍ତୁ।'
  },
  stepByStep: {
    en: 'Step-by-step solution:',
    hi: 'चरणबद्ध समाधान:',
    or: 'ପର୍ଯ୍ୟାୟକ୍ରମେ ସମାଧାନ:'
  },
  audioToggle: {
    en: 'Toggle Audio',
    hi: 'ऑडियो टॉगल करें',
    or: 'ଅଡିଓ ଟୋଗଲ୍ କରନ୍ତୁ'
  },
  clear: {
    en: 'Clear',
    hi: 'साफ़ करें',
    or: 'ସଫା କରନ୍ତୁ'
  }
};

const problems: Problem[] = [
  {
    id: 'school-activities',
    title: {
      en: 'School Activity Participation',
      hi: 'स्कूल गतिविधि भागीदारी',
      or: 'ବିଦ୍ୟାଳୟ କାର୍ଯ୍ୟକଳାପ ଅଂଶଗ୍ରହଣ'
    },
    story: {
      en: 'In a survey of 100 students about their participation in school activities:',
      hi: 'स्कूल गतिविधियों में भागीदारी के बारे में 100 छात्रों के सर्वेक्षण में:',
      or: 'ବିଦ୍ୟାଳୟ କାର୍ଯ୍ୟକଳାପରେ ଅଂଶଗ୍ରହଣ ବିଷୟରେ 100 ଛାତ୍ରଙ୍କ ସର୍ଭେରେ:'
    },
    setA: {
      en: 'Sports',
      hi: 'खेल',
      or: 'ଖେଳ'
    },
    setB: {
      en: 'Music',
      hi: 'संगीत',
      or: 'ସଙ୍ଗୀତ'
    },
    setC: {
      en: 'Drama',
      hi: 'नाटक',
      or: 'ନାଟକ'
    },
    universe: 100,
    onlyA: 25,
    onlyB: 15,
    onlyC: 10,
    AandB: 8,
    AandC: 6,
    BandC: 4,
    AandBandC: 12,
    none: 20,
    question: {
      en: 'How many students participate in Sports only?',
      hi: 'कितने छात्र केवल खेल में भाग लेते हैं?',
      or: 'କେତେ ଛାତ୍ର କେବଳ ଖେଳରେ ଅଂଶଗ୍ରହଣ କରନ୍ତି?'
    },
    answer: 25,
    region: 'onlyA'
  },
  {
    id: 'book-preferences',
    title: {
      en: 'Reading Preferences',
      hi: 'पढ़ने की प्राथमिकताएं',
      or: 'ପଢ଼ିବା ପସନ୍ଦ'
    },
    story: {
      en: 'Among 80 students surveyed about their reading preferences:',
      hi: 'अपनी पढ़ने की प्राथमिकताओं के बारे में सर्वेक्षण किए गए 80 छात्रों में से:',
      or: 'ସେମାନଙ୍କ ପଢ଼ିବା ପସନ୍ଦ ବିଷୟରେ ସର୍ଭେ ହୋଇଥିବା 80 ଛାତ୍ରଙ୍କ ମଧ୍ୟରେ:'
    },
    setA: {
      en: 'Fiction',
      hi: 'कल्पना',
      or: 'କାଳ୍ପନିକ'
    },
    setB: {
      en: 'Science',
      hi: 'विज्ञान',
      or: 'ବିଜ୍ଞାନ'
    },
    setC: {
      en: 'History',
      hi: 'इतिहास',
      or: 'ଇତିହାସ'
    },
    universe: 80,
    onlyA: 18,
    onlyB: 12,
    onlyC: 8,
    AandB: 6,
    AandC: 4,
    BandC: 3,
    AandBandC: 5,
    none: 24,
    question: {
      en: 'How many students read all three types of books?',
      hi: 'कितने छात्र तीनों प्रकार की किताबें पढ़ते हैं?',
      or: 'କେତେ ଛାତ୍ର ସମସ୍ତ ତିନି ପ୍ରକାରର ପୁସ୍ତକ ପଢ଼ନ୍ତି?'
    },
    answer: 5,
    region: 'AandBandC'
  },
  {
    id: 'food-preferences',
    title: {
      en: 'Food Preferences',
      hi: 'भोजन प्राथमिकताएं',
      or: 'ଖାଦ୍ୟ ପସନ୍ଦ'
    },
    story: {
      en: 'In a cafeteria survey of 120 students about their meal preferences:',
      hi: 'भोजन की प्राथमिकताओं के बारे में 120 छात्रों के कैफेटेरिया सर्वेक्षण में:',
      or: 'ସେମାନଙ୍କ ଖାଦ୍ୟ ପସନ୍ଦ ବିଷୟରେ 120 ଛାତ୍ରଙ୍କ କ୍ୟାଫେଟେରିଆ ସର୍ଭେରେ:'
    },
    setA: {
      en: 'Pizza',
      hi: 'पिज़्ज़ा',
      or: 'ପିଜା'
    },
    setB: {
      en: 'Burgers',
      hi: 'बर्गर',
      or: 'ବର୍ଗର'
    },
    setC: {
      en: 'Tacos',
      hi: 'टैकोस',
      or: 'ଟାକୋସ୍'
    },
    universe: 120,
    onlyA: 30,
    onlyB: 20,
    onlyC: 15,
    AandB: 12,
    AandC: 8,
    BandC: 6,
    AandBandC: 9,
    none: 20,
    question: {
      en: 'How many students like both Pizza and Burgers, but not Tacos?',
      hi: 'कितने छात्र पिज़्ज़ा और बर्गर दोनों पसंद करते हैं, लेकिन टैकोस नहीं?',
      or: 'କେତେ ଛାତ୍ର ପିଜା ଏବଂ ବର୍ଗର ଦୁଇଟି ପସନ୍ଦ କରନ୍ତି, କିନ୍ତୁ ଟାକୋସ୍ ନୁହେଁ?'
    },
    answer: 12,
    region: 'AandB'
  }
];

export function VennPractice3Set({ language, onComplete, onBack }: VennPractice3SetProps) {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [completedProblems, setCompletedProblems] = useState<boolean[]>(new Array(problems.length).fill(false));

  const t = translations;
  const problem = problems[currentProblem];

  // Reset state when problem changes
  useEffect(() => {
    setUserAnswer('');
    setShowHint(false);
    setShowSolution(false);
    setFeedback(null);
  }, [currentProblem]);

  const handleNumberInput = (num: string) => {
    if (userAnswer.length < 3) { // Limit to 3 digits
      setUserAnswer(userAnswer + num);
    }
  };

  const handleClear = () => {
    setUserAnswer('');
  };

  const handleBackspace = () => {
    setUserAnswer(userAnswer.slice(0, -1));
  };

  const checkAnswer = () => {
    const answer = parseInt(userAnswer);
    if (answer === problem.answer) {
      setFeedback('correct');
      const newCompleted = [...completedProblems];
      newCompleted[currentProblem] = true;
      setCompletedProblems(newCompleted);
    } else {
      setFeedback('incorrect');
    }
  };

  const showHintHandler = () => {
    setShowHint(true);
  };

  const showSolutionHandler = () => {
    setShowSolution(true);
    setUserAnswer(problem.answer.toString());
  };

  const resetProblem = () => {
    setUserAnswer('');
    setShowHint(false);
    setShowSolution(false);
    setFeedback(null);
  };

  const nextProblem = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1);
    } else {
      onComplete();
    }
  };

  const allProblemsCompleted = completedProblems.every(completed => completed);

  const getRegionCounts = () => {
    return {
      onlyA: problem.onlyA,
      onlyB: problem.onlyB,
      onlyC: problem.onlyC,
      AandB: problem.AandB,
      AandC: problem.AandC,
      BandC: problem.BandC,
      AandBandC: problem.AandBandC,
      none: problem.none
    };
  };

  const getHintText = () => {
    const regionMap = {
      onlyA: t.onlySet[language].replace('{set}', problem.setA[language]),
      onlyB: t.onlySet[language].replace('{set}', problem.setB[language]),
      onlyC: t.onlySet[language].replace('{set}', problem.setC[language]),
      AandB: t.bothSets[language].replace('{setA}', problem.setA[language]).replace('{setB}', problem.setB[language]),
      AandC: t.bothSets[language].replace('{setA}', problem.setA[language]).replace('{setB}', problem.setC[language]),
      BandC: t.bothSets[language].replace('{setA}', problem.setB[language]).replace('{setB}', problem.setC[language]),
      AandBandC: t.allThreeSets[language],
      none: t.none[language]
    };
    
    return t.hintText[language].replace('{region}', regionMap[problem.region as keyof typeof regionMap]);
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
          
          <h1 className="text-xl font-semibold text-center">{t.title[language]}</h1>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setAudioEnabled(!audioEnabled)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              title={t.audioToggle[language]}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-800/50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Problem {currentProblem + 1} of {problems.length}</span>
            <span className="text-sm text-slate-300">
              Completed: {completedProblems.filter(c => c).length}/{problems.length}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentProblem + 1) / problems.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {allProblemsCompleted && currentProblem === problems.length - 1 && feedback === 'correct' ? (
            // Completion Screen
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50 text-center p-8">
              <CardContent>
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <h2 className="text-3xl font-bold text-green-300 mb-4">{t.completed[language]}</h2>
                <Button
                  onClick={onComplete}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3"
                >
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Problem Header */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyan-300">{problem.title[language]}</CardTitle>
                  <p className="text-slate-300">{problem.story[language]}</p>
                  <p className="text-lg text-yellow-300">{t.instructions[language]}</p>
                </CardHeader>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Venn Diagram */}
                <Card className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">
                      {problem.setA[language]}, {problem.setB[language]} & {problem.setC[language]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-96 bg-slate-900/50 rounded-lg p-4">
                      {/* 3-Set Venn Diagram SVG */}
                      <svg width="100%" height="100%" viewBox="0 0 400 300" className="absolute inset-0">
                        <defs>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge> 
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Universe Rectangle */}
                        <rect 
                          x="20" y="20" width="360" height="260" 
                          fill="transparent" 
                          stroke="#64748b" 
                          strokeWidth="2" 
                          strokeDasharray="8,4"
                        />

                        {/* Circle A (Top) */}
                        <circle 
                          cx="150" cy="120" r="60" 
                          fill="rgba(59, 130, 246, 0.3)" 
                          stroke="#3b82f6" 
                          strokeWidth="3"
                        />

                        {/* Circle B (Bottom Left) */}
                        <circle 
                          cx="120" cy="180" r="60" 
                          fill="rgba(16, 185, 129, 0.3)" 
                          stroke="#10b981" 
                          strokeWidth="3"
                        />

                        {/* Circle C (Bottom Right) */}
                        <circle 
                          cx="180" cy="180" r="60" 
                          fill="rgba(245, 101, 101, 0.3)" 
                          stroke="#f56565" 
                          strokeWidth="3"
                        />

                        {/* Labels */}
                        <text x="130" y="80" className="text-sm fill-blue-300 font-semibold">
                          {problem.setA[language]}
                        </text>
                        <text x="80" y="250" className="text-sm fill-green-300 font-semibold">
                          {problem.setB[language]}
                        </text>
                        <text x="200" y="250" className="text-sm fill-red-300 font-semibold">
                          {problem.setC[language]}
                        </text>
                        <text x="35" y="40" className="text-xs fill-slate-400">Universe: {problem.universe}</text>

                        {/* Region Values (when solution is shown) */}
                        {showSolution && (
                          <>
                            {/* Only A */}
                            <text x="150" y="100" className="text-sm fill-white font-bold text-center">
                              {problem.onlyA}
                            </text>
                            {/* Only B */}
                            <text x="100" y="200" className="text-sm fill-white font-bold text-center">
                              {problem.onlyB}
                            </text>
                            {/* Only C */}
                            <text x="200" y="200" className="text-sm fill-white font-bold text-center">
                              {problem.onlyC}
                            </text>
                            {/* A ∩ B only */}
                            <text x="135" y="160" className="text-sm fill-white font-bold text-center">
                              {problem.AandB}
                            </text>
                            {/* A ∩ C only */}
                            <text x="165" y="160" className="text-sm fill-white font-bold text-center">
                              {problem.AandC}
                            </text>
                            {/* B ∩ C only */}
                            <text x="150" y="190" className="text-sm fill-white font-bold text-center">
                              {problem.BandC}
                            </text>
                            {/* A ∩ B ∩ C */}
                            <text x="150" y="170" className="text-sm fill-yellow-300 font-bold text-center">
                              {problem.AandBandC}
                            </text>
                            {/* None */}
                            <text x="50" y="260" className="text-sm fill-white font-bold">
                              None: {problem.none}
                            </text>
                          </>
                        )}

                        {/* Highlight the target region when hint is shown */}
                        {showHint && (
                          <>
                            {problem.region === 'onlyA' && (
                              <circle cx="150" cy="100" r="15" fill="none" stroke="#fbbf24" strokeWidth="3" className="animate-pulse" />
                            )}
                            {problem.region === 'AandBandC' && (
                              <circle cx="150" cy="150" r="15" fill="none" stroke="#fbbf24" strokeWidth="3" className="animate-pulse" />
                            )}
                            {problem.region === 'AandB' && (
                              <circle cx="135" cy="150" r="15" fill="none" stroke="#fbbf24" strokeWidth="3" className="animate-pulse" />
                            )}
                          </>
                        )}
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                {/* Problem Panel */}
                <Card className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-xl">{t.givens[language]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-slate-700/50 p-2 rounded">
                          <span className="text-slate-300">{t.universe[language]}:</span>
                          <span className="text-white font-semibold ml-2">{problem.universe}</span>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded">
                          <span className="text-slate-300">{t.onlySet[language].replace('{set}', problem.setA[language])}:</span>
                          <span className="text-white font-semibold ml-2">{problem.onlyA}</span>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded">
                          <span className="text-slate-300">{t.onlySet[language].replace('{set}', problem.setB[language])}:</span>
                          <span className="text-white font-semibold ml-2">{problem.onlyB}</span>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded">
                          <span className="text-slate-300">{t.onlySet[language].replace('{set}', problem.setC[language])}:</span>
                          <span className="text-white font-semibold ml-2">{problem.onlyC}</span>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded">
                          <span className="text-slate-300">{problem.setA[language]} ∩ {problem.setB[language]}:</span>
                          <span className="text-white font-semibold ml-2">{problem.AandB}</span>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded">
                          <span className="text-slate-300">{problem.setA[language]} ∩ {problem.setC[language]}:</span>
                          <span className="text-white font-semibold ml-2">{problem.AandC}</span>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded">
                          <span className="text-slate-300">{problem.setB[language]} ∩ {problem.setC[language]}:</span>
                          <span className="text-white font-semibold ml-2">{problem.BandC}</span>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded">
                          <span className="text-slate-300">{t.allThreeSets[language]}:</span>
                          <span className="text-white font-semibold ml-2">{problem.AandBandC}</span>
                        </div>
                        <div className="bg-slate-700/50 p-2 rounded col-span-2">
                          <span className="text-slate-300">{t.none[language]}:</span>
                          <span className="text-white font-semibold ml-2">{problem.none}</span>
                        </div>
                      </div>
                    </div>

                    {/* Question */}
                    <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.question[language]}</h3>
                      <p className="text-white">{problem.question[language]}</p>
                    </div>

                    {/* Answer Input */}
                    <div className="mb-6">
                      <label className="block text-sm text-slate-300 mb-2">{t.enterAnswer[language]}</label>
                      <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-white mb-4 min-h-[3rem] flex items-center justify-center">
                          {userAnswer || '?'}
                        </div>
                        
                        {/* Numeric Keypad */}
                        <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
                          {[1,2,3,4,5,6,7,8,9].map(num => (
                            <Button
                              key={num}
                              onClick={() => handleNumberInput(num.toString())}
                              className="h-12 text-lg bg-slate-700 hover:bg-slate-600"
                              disabled={showSolution}
                            >
                              {num}
                            </Button>
                          ))}
                          <Button
                            onClick={handleClear}
                            className="h-12 text-sm bg-red-600 hover:bg-red-700"
                            disabled={showSolution}
                          >
                            {t.clear[language]}
                          </Button>
                          <Button
                            onClick={() => handleNumberInput('0')}
                            className="h-12 text-lg bg-slate-700 hover:bg-slate-600"
                            disabled={showSolution}
                          >
                            0
                          </Button>
                          <Button
                            onClick={handleBackspace}
                            className="h-12 text-sm bg-orange-600 hover:bg-orange-700"
                            disabled={showSolution}
                          >
                            ⌫
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Hint */}
                    {showHint && (
                      <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-3 mb-4">
                        <div className="text-yellow-300 text-sm">
                          <Lightbulb className="h-4 w-4 inline mr-2" />
                          {getHintText()}
                        </div>
                      </div>
                    )}

                    {/* Controls */}
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Button
                          onClick={showHintHandler}
                          disabled={showHint || showSolution}
                          className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {t.showHint[language]}
                        </Button>
                        <Button
                          onClick={showSolutionHandler}
                          disabled={showSolution}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t.showSolution[language]}
                        </Button>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={checkAnswer}
                          disabled={!userAnswer || showSolution}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          {t.checkAnswer[language]}
                        </Button>
                        <Button
                          onClick={resetProblem}
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>

                      {feedback && (
                        <div className={`p-3 rounded-lg text-center ${
                          feedback === 'correct' 
                            ? 'bg-green-500/20 text-green-300 border border-green-400' 
                            : 'bg-red-500/20 text-red-300 border border-red-400'
                        }`}>
                          {feedback === 'correct' 
                            ? t.correct[language] 
                            : t.incorrect[language].replace('{answer}', problem.answer.toString())
                          }
                        </div>
                      )}

                      {(feedback === 'correct' || showSolution) && (
                        <Button
                          onClick={nextProblem}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        >
                          {currentProblem < problems.length - 1 ? t.nextProblem[language] : 'Complete Practice'}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}