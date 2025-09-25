import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight, HelpCircle, CheckCircle, Target, Eye, Users, Infinity, Equal, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

// SA LESSON MODULES - Complete Interactive Learning Experiences
// Covering all 7 stages of the Sets Adventure curriculum

interface LessonModulesProps {
  className?: string;
}

// Stage 1: What is a Set? - Interactive Definition with SVG Animations
const SALesson_WhatIsASet: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const stages = [
    { id: 'intro', title: 'Introduction', duration: '1m' },
    { id: 'definition', title: 'Definition', duration: '2m' },
    { id: 'notation', title: 'Set Notation', duration: '2m' },
    { id: 'microtask', title: 'Practice', duration: '1m' }
  ];

  const handleNextStage = () => {
    if (currentStage < stages.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStage(currentStage + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      {/* Lesson HUD */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Menu
          </Button>
          <h2 className="text-lg font-semibold text-white">Lesson 1: What is a Set?</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-400">Stage {currentStage + 1}/4</span>
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stage Progress */}
      <div className="fixed top-16 left-0 right-0 z-30 bg-slate-800/80 backdrop-blur-sm px-6 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {stages.map((stage, idx) => (
              <div key={stage.id} className={`flex items-center space-x-2 ${
                idx === currentStage ? 'text-cyan-400' : idx < currentStage ? 'text-green-400' : 'text-slate-500'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  idx === currentStage ? 'border-cyan-400 bg-cyan-400/20' : 
                  idx < currentStage ? 'border-green-400 bg-green-400/20' : 'border-slate-500'
                }`}>
                  {idx < currentStage ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">{stage.title}</div>
                  <div className="text-xs opacity-70">{stage.duration}</div>
                </div>
                {idx < stages.length - 1 && (
                  <div className={`hidden md:block w-16 h-1 mx-4 rounded ${
                    idx < currentStage ? 'bg-green-400' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {currentStage === 0 && (
            <div className={`space-y-8 ${isAnimating ? 'animate-fade-out' : 'animate-fade-in'}`}>
              <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold text-white mb-4">What is a Set?</h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Welcome to your journey into Set Theory! Let's discover the fundamental building blocks of mathematics.
                </p>
              </div>

              {/* Animated Introduction SVG */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <svg width="400" height="200" viewBox="0 0 400 200" className="animate-fade-in">
                      {/* Collection of Objects Animation */}
                      <g id="collection-intro">
                        {/* Container */}
                        <rect x="50" y="50" width="300" height="100" rx="20" 
                              fill="rgba(6, 182, 212, 0.1)" 
                              stroke="rgb(6, 182, 212)" 
                              strokeWidth="2"
                              className="animate-set-container-expand" />
                        
                        {/* Objects appearing one by one */}
                        <circle cx="100" cy="100" r="15" fill="rgb(239, 68, 68)" className="animate-bounce-in" style={{animationDelay: '0.5s'}} />
                        <rect x="140" y="85" width="30" height="30" fill="rgb(34, 197, 94)" className="animate-bounce-in" style={{animationDelay: '0.8s'}} />
                        <polygon points="220,85 235,115 205,115" fill="rgb(59, 130, 246)" className="animate-bounce-in" style={{animationDelay: '1.1s'}} />
                        <circle cx="280" cy="100" r="15" fill="rgb(168, 85, 247)" className="animate-bounce-in" style={{animationDelay: '1.4s'}} />
                        
                        {/* Label */}
                        <text x="200" y="180" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">
                          A collection of distinct objects
                        </text>
                      </g>
                    </svg>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      onClick={handleNextStage}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-8 py-3"
                    >
                      Let's Explore Sets!
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStage === 1 && (
            <div className={`space-y-8 ${isAnimating ? 'animate-fade-out' : 'animate-fade-in'}`}>
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white">Formal Definition</h2>
                <p className="text-lg text-slate-300">
                  A set is a well-defined collection of distinct objects called elements or members.
                </p>
              </div>

              {/* Interactive Definition with Examples */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Well-Defined ✓</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <h4 className="text-green-400 font-semibold mb-2">Set A = {1, 2, 3, 4, 5}</h4>
                      <p className="text-sm text-slate-300">Clear criteria: natural numbers from 1 to 5</p>
                    </div>
                    <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <h4 className="text-green-400 font-semibold mb-2">Set B = {red, blue, green}</h4>
                      <p className="text-sm text-slate-300">Clear criteria: primary and secondary colors</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-red-400">Not Well-Defined ✗</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <h4 className="text-red-400 font-semibold mb-2">Collection of "tall people"</h4>
                      <p className="text-sm text-slate-300">Unclear: What defines "tall"?</p>
                    </div>
                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <h4 className="text-red-400 font-semibold mb-2">Collection of "good books"</h4>
                      <p className="text-sm text-slate-300">Subjective: "Good" varies by person</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button 
                  onClick={handleNextStage}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-8 py-3"
                >
                  Learn Set Notation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStage === 2 && (
            <div className={`space-y-8 ${isAnimating ? 'animate-fade-out' : 'animate-fade-in'}`}>
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white">Set Notation</h2>
                <p className="text-lg text-slate-300">
                  Sets are typically denoted using curly braces { } with elements separated by commas.
                </p>
              </div>

              {/* Interactive Notation Demo */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-8">
                    <svg width="500" height="150" viewBox="0 0 500 150">
                      {/* Roster Method */}
                      <g id="roster-notation">
                        {/* Opening brace */}
                        <text x="50" y="80" fontSize="48" fill="rgb(6, 182, 212)" fontWeight="bold" className="animate-bracket-grow">
                          {"{"}
                        </text>
                        
                        {/* Elements */}
                        <text x="100" y="80" fontSize="24" fill="white" className="animate-number-slide" style={{animationDelay: '0.5s'}}>
                          1
                        </text>
                        <text x="125" y="80" fontSize="24" fill="rgb(156, 163, 175)" className="animate-type-writer" style={{animationDelay: '0.8s'}}>
                          ,
                        </text>
                        <text x="150" y="80" fontSize="24" fill="white" className="animate-number-slide" style={{animationDelay: '1.0s'}}>
                          2
                        </text>
                        <text x="175" y="80" fontSize="24" fill="rgb(156, 163, 175)" className="animate-type-writer" style={{animationDelay: '1.3s'}}>
                          ,
                        </text>
                        <text x="200" y="80" fontSize="24" fill="white" className="animate-number-slide" style={{animationDelay: '1.5s'}}>
                          3
                        </text>
                        <text x="225" y="80" fontSize="24" fill="rgb(156, 163, 175)" className="animate-type-writer" style={{animationDelay: '1.8s'}}>
                          ,
                        </text>
                        <text x="250" y="80" fontSize="24" fill="white" className="animate-number-slide" style={{animationDelay: '2.0s'}}>
                          4
                        </text>
                        <text x="275" y="80" fontSize="24" fill="rgb(156, 163, 175)" className="animate-type-writer" style={{animationDelay: '2.3s'}}>
                          ,
                        </text>
                        <text x="300" y="80" fontSize="24" fill="white" className="animate-number-slide" style={{animationDelay: '2.5s'}}>
                          5
                        </text>
                        
                        {/* Closing brace */}
                        <text x="350" y="80" fontSize="48" fill="rgb(6, 182, 212)" fontWeight="bold" className="animate-bracket-grow" style={{animationDelay: '2.8s'}}>
                          {"}"}
                        </text>
                        
                        {/* Label */}
                        <text x="200" y="120" textAnchor="middle" fill="rgb(156, 163, 175)" fontSize="14">
                          Roster Method: List all elements
                        </text>
                      </g>
                    </svg>
                  </div>

                  {/* Set-Builder Notation */}
                  <div className="bg-slate-700/30 rounded-lg p-6 mb-6">
                    <h4 className="text-cyan-400 font-semibold mb-3">Set-Builder Notation</h4>
                    <div className="text-center">
                      <span className="text-2xl font-mono text-white">
                        {"{"} x | x ∈ ℕ, 1 ≤ x ≤ 5 {"}"}
                      </span>
                      <p className="text-sm text-slate-400 mt-2">
                        "The set of all x such that x is a natural number between 1 and 5"
                      </p>
                    </div>
                  </div>

                  {/* Empty Set */}
                  <div className="bg-slate-700/30 rounded-lg p-6">
                    <h4 className="text-purple-400 font-semibold mb-3">Empty Set</h4>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-mono text-white">
                        <span className="animate-empty-set-shake">∅</span>
                        <span className="mx-4 text-slate-500">or</span>
                        <span>{"{ }"}</span>
                      </div>
                      <p className="text-sm text-slate-400">
                        A set containing no elements
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button 
                  onClick={handleNextStage}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-8 py-3"
                >
                  Practice Time!
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStage === 3 && (
            <div className={`space-y-8 ${isAnimating ? 'animate-fade-out' : 'animate-fade-in'}`}>
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white">Quick Practice</h2>
                <p className="text-lg text-slate-300">
                  Which of these represents a valid set?
                </p>
              </div>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {[
                      { id: 'a', text: '{1, 2, 3, 4, 5}', correct: true },
                      { id: 'b', text: 'Collection of beautiful flowers', correct: false },
                      { id: 'c', text: '{red, blue, green}', correct: true },
                      { id: 'd', text: 'Set of tall students', correct: false }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(option.id)}
                        className={`w-full p-4 text-left border rounded-lg transition-all duration-300 min-h-[60px] ${
                          selectedAnswer === option.id
                            ? option.correct
                              ? 'bg-green-900/30 border-green-500 text-green-100 animate-pulse-success'
                              : 'bg-red-900/30 border-red-500 text-red-100 animate-shake-error'
                            : 'bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50'
                        }`}
                      >
                        <span className="font-semibold">{option.id.toUpperCase()})</span> {option.text}
                      </button>
                    ))}
                  </div>

                  {showFeedback && (
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg animate-quiz-feedback-slide">
                      <h4 className="text-blue-400 font-semibold mb-2">Explanation</h4>
                      <p className="text-slate-300 text-sm">
                        Options A and C are valid sets because they have clear, well-defined criteria. 
                        Options B and D are not well-defined as "beautiful" and "tall" are subjective terms.
                      </p>
                    </div>
                  )}

                  {selectedAnswer && (
                    <div className="mt-6 text-center">
                      <Button 
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold px-8 py-3"
                      >
                        Continue to Next Lesson
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stage 2: Types of Sets - Interactive Classification
const SALesson_TypesOfSets: React.FC = () => {
  const [currentType, setCurrentType] = useState(0);
  const [selectedElements, setSelectedElements] = useState<number[]>([]);
  const [jarElements, setJarElements] = useState<number[]>([]);

  const setTypes = [
    { 
      id: 'finite', 
      title: 'Finite Sets', 
      description: 'Sets with a specific number of elements',
      icon: <Target className="w-6 h-6" />,
      color: 'cyan'
    },
    { 
      id: 'infinite', 
      title: 'Infinite Sets', 
      description: 'Sets with unlimited elements',
      icon: <Infinity className="w-6 h-6" />,
      color: 'purple'
    },
    { 
      id: 'singleton', 
      title: 'Singleton Sets', 
      description: 'Sets with exactly one element',
      icon: <Eye className="w-6 h-6" />,
      color: 'green'
    },
    { 
      id: 'equal', 
      title: 'Equal Sets', 
      description: 'Sets with identical elements',
      icon: <Equal className="w-6 h-6" />,
      color: 'blue'
    }
  ];

  const handleElementSelect = (element: number) => {
    if (!selectedElements.includes(element)) {
      setSelectedElements([...selectedElements, element]);
      setJarElements([...jarElements, element]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      {/* Lesson HUD */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-slate-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Menu
          </Button>
          <h2 className="text-lg font-semibold text-white">Lesson 2: Types of Sets</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-400">{currentType + 1}/{setTypes.length}</span>
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Type Navigation */}
      <div className="fixed top-16 left-0 right-0 z-30 bg-slate-800/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {setTypes.map((type, idx) => (
              <button
                key={type.id}
                onClick={() => setCurrentType(idx)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  idx === currentType 
                    ? `bg-${type.color}-500/20 border border-${type.color}-500/50 text-${type.color}-400` 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type.icon}
                <span className="hidden md:block font-medium">{type.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Finite Sets */}
          {currentType === 0 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-cyan-400">Finite Sets</h2>
                <p className="text-lg text-slate-300">
                  Sets that contain a specific, countable number of elements
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Interactive Demo */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Interactive Demo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Element Pool */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Available Numbers:</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <button
                            key={num}
                            onClick={() => handleElementSelect(num)}
                            disabled={selectedElements.includes(num)}
                            className={`w-12 h-12 rounded-lg font-semibold transition-all duration-300 ${
                              selectedElements.includes(num)
                                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:scale-110 animate-marble-drop'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Collection Jar */}
                    <div>
                      <h4 className="text-white font-semibold mb-3">Your Set:</h4>
                      <div className="relative">
                        <svg width="300" height="150" viewBox="0 0 300 150" className="mx-auto">
                          {/* Jar */}
                          <path d="M50 50 L250 50 Q250 50 250 70 L250 130 Q250 150 230 150 L70 150 Q50 150 50 130 L50 70 Q50 50 50 50" 
                                fill="rgba(139, 69, 19, 0.2)" 
                                stroke="rgb(139, 69, 19)" 
                                strokeWidth="3" 
                                className="animate-jar-shimmer" />
                          
                          {/* Elements in jar */}
                          {jarElements.map((num, idx) => (
                            <g key={`jar-${num}`} className="animate-marble-drop" style={{animationDelay: `${idx * 0.2}s`}}>
                              <circle cx={80 + (idx % 4) * 35} cy={80 + Math.floor(idx / 4) * 30} r="12" fill="rgb(6, 182, 212)" />
                              <text x={80 + (idx % 4) * 35} y={85 + Math.floor(idx / 4) * 30} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                                {num}
                              </text>
                            </g>
                          ))}
                          
                          {/* Set notation */}
                          <text x="150" y="180" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">
                            {"{"}{jarElements.join(', ')}{"}"}
                          </text>
                        </svg>
                      </div>
                      
                      <div className="text-center mt-4">
                        <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                          Cardinality: |A| = {jarElements.length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Examples */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Examples</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { set: '{1, 2, 3, 4, 5}', description: 'Natural numbers 1 to 5', cardinality: 5 },
                      { set: '{a, e, i, o, u}', description: 'English vowels', cardinality: 5 },
                      { set: '{Mon, Tue, Wed, Thu, Fri, Sat, Sun}', description: 'Days of the week', cardinality: 7 },
                      { set: '∅', description: 'Empty set', cardinality: 0 }
                    ].map((example, idx) => (
                      <div key={idx} className="p-4 bg-slate-700/30 rounded-lg animate-ribbon-appear" style={{animationDelay: `${idx * 0.2}s`}}>
                        <div className="font-mono text-cyan-300 mb-1">{example.set}</div>
                        <div className="text-slate-400 text-sm mb-2">{example.description}</div>
                        <Badge variant="outline" className="text-xs">|Set| = {example.cardinality}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Infinite Sets */}
          {currentType === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-purple-400">Infinite Sets</h2>
                <p className="text-lg text-slate-300">
                  Sets that contain unlimited or uncountably many elements
                </p>
              </div>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8">
                  {/* Infinite Stream Visualization */}
                  <div className="flex justify-center mb-8">
                    <svg width="600" height="200" viewBox="0 0 600 200">
                      {/* Number Stream */}
                      <g id="infinite-stream">
                        {/* Stream line */}
                        <line x1="50" y1="100" x2="550" y2="100" 
                              stroke="rgb(168, 85, 247)" 
                              strokeWidth="3" 
                              strokeDasharray="5,3" 
                              className="animate-dash-flow infinite-stream-glow" />
                        
                        {/* Numbers flowing */}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, idx) => (
                          <g key={`stream-${num}`} className="animate-stream-flow" style={{animationDelay: `${idx * 0.3}s`}}>
                            <circle cx={70 + idx * 50} cy="100" r="18" fill="rgb(168, 85, 247)" className="animate-number-float" />
                            <text x={70 + idx * 50} y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                              {num}
                            </text>
                          </g>
                        ))}
                        
                        {/* Infinity symbol */}
                        <text x="520" y="110" fontSize="24" fill="rgb(168, 85, 247)" className="animate-infinite-loop-hint">
                          ∞
                        </text>
                        
                        {/* Labels */}
                        <text x="300" y="140" textAnchor="middle" fill="white" fontSize="16" fontWeight="600">
                          Natural Numbers: ℕ = {"{"} 1, 2, 3, 4, ... {"}"}
                        </text>
                        <text x="300" y="170" textAnchor="middle" fill="rgb(168, 85, 247)" fontSize="14" className="animate-formula-highlight">
                          Cardinality: |ℕ| = ∞
                        </text>
                      </g>
                    </svg>
                  </div>

                  {/* Examples Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { 
                        title: 'Natural Numbers', 
                        notation: 'ℕ = {1, 2, 3, 4, ...}', 
                        description: 'Counting numbers extending infinitely',
                        icon: '1️⃣'
                      },
                      { 
                        title: 'Integers', 
                        notation: 'ℤ = {..., -2, -1, 0, 1, 2, ...}', 
                        description: 'All positive and negative whole numbers',
                        icon: '🔢'
                      },
                      { 
                        title: 'Real Numbers', 
                        notation: 'ℝ = {all decimal numbers}', 
                        description: 'Includes rational and irrational numbers',
                        icon: '📐'
                      },
                      { 
                        title: 'Even Numbers', 
                        notation: '{2, 4, 6, 8, ...}', 
                        description: 'Numbers divisible by 2',
                        icon: '➗'
                      }
                    ].map((example, idx) => (
                      <div key={idx} className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg animate-powerset-cascade" style={{animationDelay: `${idx * 0.2}s`}}>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{example.icon}</span>
                          <h4 className="text-purple-400 font-semibold">{example.title}</h4>
                        </div>
                        <div className="font-mono text-purple-300 mb-2 text-sm">{example.notation}</div>
                        <div className="text-slate-400 text-sm">{example.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentType(Math.max(0, currentType - 1))}
              disabled={currentType === 0}
              className="border-slate-600 text-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Type
            </Button>
            
            <Button 
              onClick={() => setCurrentType(Math.min(setTypes.length - 1, currentType + 1))}
              disabled={currentType === setTypes.length - 1}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
            >
              Next Type
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component Showcase
export const SA_LessonModules: React.FC<LessonModulesProps> = ({ className = "" }) => {
  const [activeLesson, setActiveLesson] = useState<'what-is-set' | 'types-of-sets' | 'overview'>('overview');

  const lessons = [
    { id: 'what-is-set', title: 'What is a Set?', duration: '5 min', difficulty: 'Easy', status: 'available' },
    { id: 'types-of-sets', title: 'Types of Sets', duration: '10 min', difficulty: 'Medium', status: 'available' },
    { id: 'subsets', title: 'Subsets & Intervals', duration: '10 min', difficulty: 'Medium', status: 'locked' },
    { id: 'operations', title: 'Set Operations', duration: '15 min', difficulty: 'Hard', status: 'locked' },
    { id: 'venn-2', title: 'Venn Practice (2-Set)', duration: '8 min', difficulty: 'Medium', status: 'locked' },
    { id: 'venn-3', title: 'Venn Practice (3-Set)', duration: '12 min', difficulty: 'Hard', status: 'locked' },
    { id: 'final-quiz', title: 'Final Quiz Arena', duration: '12 min', difficulty: 'Mixed', status: 'locked' }
  ];

  if (activeLesson === 'what-is-set') {
    return <SALesson_WhatIsASet />;
  }

  if (activeLesson === 'types-of-sets') {
    return <SALesson_TypesOfSets />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white p-6 ${className}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            SA Lesson Modules
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Interactive learning experiences with SVG animations, progressive difficulty, and instant feedback systems.
          </p>
        </div>

        {/* Lesson Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, idx) => (
            <Card 
              key={lesson.id} 
              className={`bg-slate-800/50 border-slate-700 transition-all duration-300 ${
                lesson.status === 'available' 
                  ? 'hover:bg-slate-700/50 hover:border-slate-600 hover:scale-105 cursor-pointer' 
                  : 'opacity-50'
              }`}
              onClick={() => lesson.status === 'available' && lesson.id === 'what-is-set' && setActiveLesson('what-is-set')}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      lesson.difficulty === 'Easy' ? 'text-green-400 border-green-400' :
                      lesson.difficulty === 'Medium' ? 'text-yellow-400 border-yellow-400' :
                      lesson.difficulty === 'Hard' ? 'text-red-400 border-red-400' :
                      'text-purple-400 border-purple-400'
                    }`}
                  >
                    {lesson.difficulty}
                  </Badge>
                  <span className="text-xs text-slate-400">{lesson.duration}</span>
                </div>
                <CardTitle className="text-white text-lg">{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Preview */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          lesson.status === 'available' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-slate-600'
                        }`}
                        style={{ width: lesson.status === 'available' ? '0%' : '0%' }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">0%</span>
                  </div>

                  {/* Learning Objectives */}
                  <div className="text-sm text-slate-400 space-y-1">
                    {lesson.id === 'what-is-set' && (
                      <ul className="space-y-1">
                        <li>• Understand set definition</li>
                        <li>• Learn set notation</li>
                        <li>• Practice identification</li>
                      </ul>
                    )}
                    {lesson.id === 'types-of-sets' && (
                      <ul className="space-y-1">
                        <li>• Classify finite/infinite sets</li>
                        <li>• Identify singleton sets</li>
                        <li>• Compare equal sets</li>
                      </ul>
                    )}
                    {lesson.id === 'subsets' && (
                      <ul className="space-y-1">
                        <li>• Master subset notation</li>
                        <li>• Work with intervals</li>
                        <li>• Practice validation</li>
                      </ul>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button 
                    className={`w-full ${
                      lesson.status === 'available'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
                        : 'bg-slate-600 cursor-not-allowed'
                    }`}
                    disabled={lesson.status !== 'available'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (lesson.id === 'what-is-set') setActiveLesson('what-is-set');
                      if (lesson.id === 'types-of-sets') setActiveLesson('types-of-sets');
                    }}
                  >
                    {lesson.status === 'available' ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Lesson
                      </>
                    ) : (
                      <>
                        🔒 Locked
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Learning Path */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Complete Learning Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4 overflow-x-auto">
              {lessons.map((lesson, idx) => (
                <div key={lesson.id} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    lesson.status === 'available' 
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' 
                      : 'border-slate-500 bg-slate-500/20 text-slate-500'
                  }`}>
                    {lesson.status === 'available' ? (
                      <span className="font-bold">{idx + 1}</span>
                    ) : (
                      '🔒'
                    )}
                  </div>
                  {idx < lessons.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      lesson.status === 'available' ? 'bg-cyan-400' : 'bg-slate-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <p className="text-slate-400 mb-4">
                Complete lessons in sequence to unlock advanced topics and the final quiz arena.
              </p>
              <div className="flex justify-center space-x-4">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  ✓ 2 lessons available
                </Badge>
                <Badge variant="outline" className="text-slate-400 border-slate-400">
                  🔒 5 lessons locked
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SA_LessonModules;