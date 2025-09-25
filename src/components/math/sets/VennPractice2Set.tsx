import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Eye, Lightbulb, RotateCcw, Volume2, VolumeX, Trophy } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface VennPractice2SetProps {
  language: Language;
  onComplete: () => void;
  onBack: () => void;
}

interface Student {
  id: string;
  name: string;
  emoji: string;
  likesSubjectA: boolean;
  likesSubjectB: boolean;
}

interface Scenario {
  id: string;
  title: {
    en: string;
    hi: string;
    or: string;
  };
  description: {
    en: string;
    hi: string;
    or: string;
  };
  subjectA: {
    en: string;
    hi: string;
    or: string;
  };
  subjectB: {
    en: string;
    hi: string;
    or: string;
  };
  students: Student[];
}

const translations = {
  title: {
    en: 'Venn Diagram Practice - Real Life Scenarios',
    hi: 'वेन आरेख अभ्यास - वास्तविक जीवन परिस्थितियां',
    or: 'ଭେନ୍ ଚିତ୍ର ଅଭ୍ୟାସ - ବାସ୍ତବ ଜୀବନ ପରିସ୍ଥିତି'
  },
  instructions: {
    en: 'Drag each student to the correct region based on their preferences!',
    hi: 'प्रत्येक छात्र को उनकी प्राथमिकताओं के आधार पर सही क्षेत्र में खींचें!',
    or: 'ପ୍ରତ୍ୟେକ ଛାତ୍ରଙ୍କୁ ସେମାନଙ୍କ ପସନ୍ଦ ଅନୁଯାୟୀ ସଠିକ୍ ଅଞ୍ଚଳରେ ଟାଣନ୍ତୁ!'
  },
  onlyA: {
    en: 'Only {subjectA}',
    hi: 'केवल {subjectA}',
    or: 'କେବଳ {subjectA}'
  },
  onlyB: {
    en: 'Only {subjectB}',
    hi: 'केवल {subjectB}',
    or: 'କେବଳ {subjectB}'
  },
  both: {
    en: 'Both {subjectA} & {subjectB}',
    hi: '{subjectA} और {subjectB} दोनों',
    or: '{subjectA} ଏବଂ {subjectB} ଦୁଇଟି'
  },
  neither: {
    en: 'Neither',
    hi: 'दोनों नहीं',
    or: 'କିଛି ନୁହେଁ'
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
  nextScenario: {
    en: 'Next Scenario',
    hi: 'अगला परिदृश्य',
    or: 'ପରବର୍ତ୍ତୀ ପରିସ୍ଥିତି'
  },
  reset: {
    en: 'Reset',
    hi: 'रीसेट',
    or: 'ରିସେଟ୍'
  },
  correct: {
    en: 'Correct!',
    hi: 'सही!',
    or: 'ସଠିକ୍!'
  },
  incorrect: {
    en: 'Not quite right. Try again!',
    hi: 'बिल्कुल सही नहीं। पुनः प्रयास करें!',
    or: 'ଠିକ୍ ନୁହେଁ। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ!'
  },
  completed: {
    en: 'All scenarios completed! Great job!',
    hi: 'सभी परिदृश्य पूरे हुए! बहुत बढ़िया!',
    or: 'ସମସ୍ତ ପରିସ୍ଥିତି ସମ୍ପୂର୍ଣ୍ଣ! ବହୁତ ଭଲ!'
  },
  hintText: {
    en: 'Look at {name}! They like {preferences}.',
    hi: '{name} को देखें! वे {preferences} पसंद करते हैं।',
    or: '{name}କୁ ଦେଖନ୍ତୁ! ସେମାନେ {preferences} ପସନ୍ଦ କରନ୍ତି।'
  },
  audioToggle: {
    en: 'Toggle Audio',
    hi: 'ऑडियो टॉगल करें',
    or: 'ଅଡିଓ ଟୋଗଲ୍ କରନ୍ତୁ'
  }
};

const scenarios: Scenario[] = [
  {
    id: 'school-subjects',
    title: {
      en: 'School Subject Preferences',
      hi: 'स्कूल विषय प्राथमिकताएं',
      or: 'ବିଦ୍ୟାଳୟ ବିଷୟ ପସନ୍ଦ'
    },
    description: {
      en: 'Students were surveyed about their favorite subjects',
      hi: 'छात्रों से उनके पसंदीदा विषयों के बारे में पूछा गया',
      or: 'ଛାତ୍ରମାନଙ୍କୁ ସେମାନଙ୍କ ପ୍ରିୟ ବିଷୟ ବିଷୟରେ ପଚରାଯାଇଥିଲା'
    },
    subjectA: {
      en: 'Math',
      hi: 'गणित',
      or: 'ଗଣିତ'
    },
    subjectB: {
      en: 'Science',
      hi: 'विज्ञान',
      or: 'ବିଜ୍ଞାନ'
    },
    students: [
      { id: '1', name: 'Alex', emoji: '👦', likesSubjectA: true, likesSubjectB: false },
      { id: '2', name: 'Maya', emoji: '👧', likesSubjectA: false, likesSubjectB: true },
      { id: '3', name: 'Sam', emoji: '👦', likesSubjectA: true, likesSubjectB: true },
      { id: '4', name: 'Priya', emoji: '👧', likesSubjectA: true, likesSubjectB: false },
      { id: '5', name: 'John', emoji: '👦', likesSubjectA: false, likesSubjectB: false },
      { id: '6', name: 'Lisa', emoji: '👧', likesSubjectA: true, likesSubjectB: true }
    ]
  },
  {
    id: 'sports-preferences',
    title: {
      en: 'Sports Preferences',
      hi: 'खेल प्राथमिकताएं',
      or: 'ଖେଳ ପସନ୍ଦ'
    },
    description: {
      en: 'Students shared which sports they enjoy playing',
      hi: 'छात्रों ने बताया कि वे कौन से खेल खेलना पसंद करते हैं',
      or: 'ଛାତ୍ରମାନେ କେଉଁ ଖେଳ ଖେଳିବାକୁ ପସନ୍ଦ କରନ୍ତି ତାହା ବାଣ୍ଟିଥିଲେ'
    },
    subjectA: {
      en: 'Cricket',
      hi: 'क्रिकेट',
      or: 'କ୍ରିକେଟ୍'
    },
    subjectB: {
      en: 'Football',
      hi: 'फुटबॉल',
      or: 'ଫୁଟବଲ୍'
    },
    students: [
      { id: '1', name: 'Ravi', emoji: '👦', likesSubjectA: true, likesSubjectB: true },
      { id: '2', name: 'Anita', emoji: '👧', likesSubjectA: false, likesSubjectB: true },
      { id: '3', name: 'Dev', emoji: '👦', likesSubjectA: true, likesSubjectB: false },
      { id: '4', name: 'Sita', emoji: '👧', likesSubjectA: false, likesSubjectB: false },
      { id: '5', name: 'Arjun', emoji: '👦', likesSubjectA: true, likesSubjectB: true }
    ]
  }
];

export function VennPractice2Set({ language, onComplete, onBack }: VennPractice2SetProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [draggedStudent, setDraggedStudent] = useState<Student | null>(null);
  const [placedStudents, setPlacedStudents] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [completedScenarios, setCompletedScenarios] = useState<boolean[]>(new Array(scenarios.length).fill(false));

  const t = translations;
  const scenario = scenarios[currentScenario];

  // Reset state when scenario changes
  useEffect(() => {
    setPlacedStudents({});
    setShowHint(false);
    setShowSolution(false);
    setFeedback(null);
    setDraggedStudent(null);
  }, [currentScenario]);

  const getCorrectRegion = (student: Student): string => {
    if (student.likesSubjectA && student.likesSubjectB) return 'both';
    if (student.likesSubjectA && !student.likesSubjectB) return 'onlyA';
    if (!student.likesSubjectA && student.likesSubjectB) return 'onlyB';
    return 'neither';
  };

  const getStudentPreferences = (student: Student): string => {
    if (student.likesSubjectA && student.likesSubjectB) {
      return `${scenario.subjectA[language]} and ${scenario.subjectB[language]}`;
    }
    if (student.likesSubjectA) return scenario.subjectA[language];
    if (student.likesSubjectB) return scenario.subjectB[language];
    return t.neither[language];
  };

  const handleDragStart = (student: Student) => {
    setDraggedStudent(student);
  };

  const handleDrop = (region: string) => {
    if (draggedStudent) {
      setPlacedStudents(prev => ({
        ...prev,
        [draggedStudent.id]: region
      }));
      setDraggedStudent(null);
    }
  };

  const checkAnswer = () => {
    const isCorrect = scenario.students.every(student => 
      placedStudents[student.id] === getCorrectRegion(student)
    );
    
    if (isCorrect) {
      setFeedback('correct');
      const newCompleted = [...completedScenarios];
      newCompleted[currentScenario] = true;
      setCompletedScenarios(newCompleted);
    } else {
      setFeedback('incorrect');
    }
  };

  const showHintHandler = () => {
    setShowHint(true);
    // Find first incorrectly placed or unplaced student
    const studentToHint = scenario.students.find(student => 
      !placedStudents[student.id] || placedStudents[student.id] !== getCorrectRegion(student)
    );
    
    if (studentToHint) {
      // Highlight the student for a moment
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  const showSolutionHandler = () => {
    setShowSolution(true);
    // Animate students to correct positions
    const correctPlacements: Record<string, string> = {};
    scenario.students.forEach(student => {
      correctPlacements[student.id] = getCorrectRegion(student);
    });
    setPlacedStudents(correctPlacements);
  };

  const resetScenario = () => {
    setPlacedStudents({});
    setShowHint(false);
    setShowSolution(false);
    setFeedback(null);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      onComplete();
    }
  };

  const getRegionLabel = (region: string) => {
    switch (region) {
      case 'onlyA':
        return t.onlyA[language].replace('{subjectA}', scenario.subjectA[language]);
      case 'onlyB':
        return t.onlyB[language].replace('{subjectB}', scenario.subjectB[language]);
      case 'both':
        return t.both[language]
          .replace('{subjectA}', scenario.subjectA[language])
          .replace('{subjectB}', scenario.subjectB[language]);
      case 'neither':
        return t.neither[language];
      default:
        return '';
    }
  };

  const allStudentsPlaced = scenario.students.every(student => placedStudents[student.id]);
  const allScenariosCompleted = completedScenarios.every(completed => completed);

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
            <span className="text-sm text-slate-300">Scenario {currentScenario + 1} of {scenarios.length}</span>
            <span className="text-sm text-slate-300">
              Completed: {completedScenarios.filter(c => c).length}/{scenarios.length}
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {allScenariosCompleted && currentScenario === scenarios.length - 1 && feedback === 'correct' ? (
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
              {/* Scenario Header */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyan-300">{scenario.title[language]}</CardTitle>
                  <p className="text-slate-300">{scenario.description[language]}</p>
                  <p className="text-lg text-yellow-300">{t.instructions[language]}</p>
                </CardHeader>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Venn Diagram */}
                <Card className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-xl text-center">
                      {scenario.subjectA[language]} & {scenario.subjectB[language]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-96 bg-slate-900/50 rounded-lg p-4">
                      {/* Venn Diagram SVG */}
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
                          className="drop-zone" 
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDrop('neither');
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        />

                        {/* Circle A */}
                        <circle 
                          cx="150" cy="150" r="80" 
                          fill="rgba(59, 130, 246, 0.3)" 
                          stroke="#3b82f6" 
                          strokeWidth="3"
                          className="drop-zone venn-region" 
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDrop('onlyA');
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        />

                        {/* Circle B */}
                        <circle 
                          cx="250" cy="150" r="80" 
                          fill="rgba(16, 185, 129, 0.3)" 
                          stroke="#10b981" 
                          strokeWidth="3"
                          className="drop-zone venn-region" 
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDrop('onlyB');
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        />

                        {/* Intersection */}
                        <ellipse 
                          cx="200" cy="150" rx="30" ry="80" 
                          fill="rgba(168, 85, 247, 0.4)" 
                          className="drop-zone venn-region" 
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDrop('both');
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        />

                        {/* Labels */}
                        <text x="120" y="100" className="text-sm fill-blue-300 font-semibold">
                          {scenario.subjectA[language]}
                        </text>
                        <text x="280" y="100" className="text-sm fill-green-300 font-semibold">
                          {scenario.subjectB[language]}
                        </text>
                        <text x="35" y="40" className="text-xs fill-slate-400">Universe (All Students)</text>

                        {/* Region Labels */}
                        <text x="100" y="200" className="text-xs fill-slate-300 text-center">
                          {getRegionLabel('onlyA')}
                        </text>
                        <text x="300" y="200" className="text-xs fill-slate-300 text-center">
                          {getRegionLabel('onlyB')}
                        </text>
                        <text x="200" y="190" className="text-xs fill-slate-300 text-center">
                          {getRegionLabel('both')}
                        </text>
                        <text x="50" y="270" className="text-xs fill-slate-300">
                          {getRegionLabel('neither')}
                        </text>
                      </svg>

                      {/* Placed Students */}
                      {Object.entries(placedStudents).map(([studentId, region]) => {
                        const student = scenario.students.find(s => s.id === studentId);
                        if (!student) return null;

                        let position = { x: 50, y: 250 }; // Default "neither" position
                        switch (region) {
                          case 'onlyA':
                            position = { x: 100 + (parseInt(studentId) % 3) * 20, y: 130 + (parseInt(studentId) % 2) * 20 };
                            break;
                          case 'onlyB':
                            position = { x: 270 + (parseInt(studentId) % 3) * 20, y: 130 + (parseInt(studentId) % 2) * 20 };
                            break;
                          case 'both':
                            position = { x: 180 + (parseInt(studentId) % 3) * 15, y: 130 + (parseInt(studentId) % 2) * 20 };
                            break;
                        }

                        return (
                          <div
                            key={studentId}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                              showSolution ? 'animate-bounce-in' : ''
                            }`}
                            style={{ left: position.x, top: position.y }}
                          >
                            <div className="text-2xl bg-white/20 rounded-full p-2 backdrop-blur-sm border border-white/30">
                              {student.emoji}
                            </div>
                            <div className="text-xs text-center mt-1 text-white font-semibold">
                              {student.name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Students Panel */}
                <Card className="bg-slate-800/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-xl">Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scenario.students.map(student => {
                        const isPlaced = placedStudents[student.id];
                        const isCorrect = isPlaced && placedStudents[student.id] === getCorrectRegion(student);
                        
                        return (
                          <div
                            key={student.id}
                            draggable={!isPlaced || showSolution}
                            onDragStart={() => handleDragStart(student)}
                            className={`p-3 rounded-lg border-2 cursor-move transition-all duration-300 ${
                              isPlaced 
                                ? isCorrect && feedback === 'correct'
                                  ? 'bg-green-500/20 border-green-400 opacity-50' 
                                  : 'bg-slate-700/50 border-slate-500 opacity-50'
                                : 'bg-slate-700 border-slate-600 hover:border-cyan-400 hover:bg-slate-600'
                            } ${
                              showHint && !isPlaced ? 'animate-pulse-glow' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{student.emoji}</div>
                              <div className="flex-1">
                                <div className="font-semibold text-white">{student.name}</div>
                                {showHint && !isPlaced && (
                                  <div className="text-sm text-cyan-300 animate-bounce-in">
                                    {t.hintText[language]
                                      .replace('{name}', student.name)
                                      .replace('{preferences}', getStudentPreferences(student))}
                                  </div>
                                )}
                                {showSolution && (
                                  <div className="text-sm text-yellow-300">
                                    Likes: {getStudentPreferences(student)}
                                  </div>
                                )}
                              </div>
                              {isPlaced && feedback === 'correct' && (
                                <Badge className="bg-green-500/20 text-green-300">✓</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Controls */}
                    <div className="mt-6 space-y-3">
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
                          disabled={!allStudentsPlaced || showSolution}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          {t.checkAnswer[language]}
                        </Button>
                        <Button
                          onClick={resetScenario}
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
                          {feedback === 'correct' ? t.correct[language] : t.incorrect[language]}
                        </div>
                      )}

                      {feedback === 'correct' && (
                        <Button
                          onClick={nextScenario}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        >
                          {currentScenario < scenarios.length - 1 ? t.nextScenario[language] : 'Complete Practice'}
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