import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, ArrowLeft, Eye, Timer, CheckCircle, Trophy, Target, Smartphone, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

// SA PREVIEW MOBILE FLOW - Step-through storyboards
// Start → Module → Microtask → Quiz Start → Quiz Q1 → Result

interface PreviewMobileFlowProps {
  className?: string;
}

interface FlowStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  annotations: string[];
  userAction: string;
  nextStep: string;
}

// Mock Mobile Frame Component
const MobileFrame: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
  <div className="relative">
    {/* Frame */}
    <div className="w-[360px] h-[800px] bg-slate-900 rounded-[2.5rem] border-4 border-slate-600 overflow-hidden relative">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-black flex items-center justify-between px-6 text-white text-xs">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <div className="w-1 h-3 bg-white rounded-sm"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="pt-6 h-full">
        {children}
      </div>
      
      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
    </div>
    
    {/* Title */}
    <div className="text-center mt-4">
      <h3 className="text-white font-semibold">{title}</h3>
    </div>
  </div>
);

// Step Components
const Step1_Start: React.FC = () => (
  <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex flex-col items-center justify-center p-6 text-white">
    {/* App Icon */}
    <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
      <Target className="w-12 h-12 text-white" />
    </div>
    
    {/* Welcome Text */}
    <div className="text-center space-y-4 mb-8">
      <h1 className="text-2xl font-bold">Welcome to Learnio</h1>
      <p className="text-slate-300 text-sm leading-relaxed">
        Master STEM concepts through gamified learning experiences designed for rural Indian students
      </p>
    </div>
    
    {/* Quick Stats */}
    <div className="grid grid-cols-3 gap-4 w-full mb-8">
      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
        <div className="text-lg font-bold text-cyan-400">100+</div>
        <div className="text-xs text-slate-400">Lessons</div>
      </div>
      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
        <div className="text-lg font-bold text-green-400">3</div>
        <div className="text-xs text-slate-400">Languages</div>
      </div>
      <div className="text-center p-3 bg-slate-800/50 rounded-lg">
        <div className="text-lg font-bold text-purple-400">Grade 11</div>
        <div className="text-xs text-slate-400">Level</div>
      </div>
    </div>
    
    {/* CTA Button */}
    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-lg min-h-[48px] shadow-lg">
      <Play className="w-5 h-5 mr-2" />
      Continue to Dashboard
    </Button>
    
    {/* Language Indicator */}
    <div className="mt-4 text-center">
      <Badge variant="outline" className="text-slate-400 border-slate-600">
        🇺🇸 English • Switch to हिंदी or ଓଡ଼ିଆ
      </Badge>
    </div>
  </div>
);

const Step2_Module: React.FC = () => (
  <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
    {/* Header */}
    <div className="p-4 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-semibold">Advanced Mathematics</h2>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-4 space-y-6">
      {/* Breadcrumb */}
      <div className="text-center">
        <p className="text-slate-400 text-xs mb-2">Unit: Set & Relations</p>
        <h1 className="text-xl font-bold mb-2">Sets Adventure</h1>
        <p className="text-slate-300 text-sm">Interactive Set Theory Learning</p>
      </div>
      
      {/* Module Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          {/* Icon */}
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="text-center">
              <p className="text-slate-400">Lessons</p>
              <p className="text-white font-semibold">7</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Duration</p>
              <p className="text-white font-semibold">60 min</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Progress</span>
              <span className="text-white">23%</span>
            </div>
            <Progress value={23} className="h-2" />
          </div>
          
          {/* Buttons */}
          <div className="space-y-2">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 text-sm">
              <Play className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
            <Button variant="outline" className="w-full border-slate-600 text-slate-200 py-2 text-sm">
              Start from Beginning
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Progress */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-sm">Recent Progress</h3>
        {[
          { name: 'What is a Set?', status: 'completed', score: 85 },
          { name: 'Types of Sets', status: 'in-progress', score: 67 },
          { name: 'Set Operations', status: 'locked', score: null }
        ].map((lesson, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                lesson.status === 'completed' ? 'bg-green-500' :
                lesson.status === 'in-progress' ? 'bg-yellow-500' :
                'bg-slate-600'
              }`}>
                {lesson.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : lesson.status === 'in-progress' ? (
                  <Timer className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-white text-xs">🔒</span>
                )}
              </div>
              <span className="text-white text-sm">{lesson.name}</span>
            </div>
            {lesson.score && (
              <Badge variant="outline" className="text-xs">
                {lesson.score}%
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Step3_Microtask: React.FC = () => (
  <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
    {/* Header */}
    <div className="p-3 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-semibold">Types of Sets</h2>
          <p className="text-xs text-slate-400">Stage 2 of 4</p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    {/* Progress Indicators */}
    <div className="px-4 py-2 bg-slate-800/50">
      <div className="flex justify-center space-x-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${
            i <= 1 ? 'bg-green-500' : i === 2 ? 'bg-cyan-500' : 'bg-slate-600'
          }`} />
        ))}
      </div>
    </div>
    
    {/* Main Content */}
    <div className="p-4 space-y-6">
      {/* Question */}
      <div className="text-center space-y-3">
        <Badge variant="outline" className="text-green-400 border-green-400">Microtask • Easy</Badge>
        <h3 className="text-lg font-semibold">Quick Check!</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          Which of these represents a <strong>finite set</strong>?
        </p>
      </div>
      
      {/* Interactive Elements */}
      <div className="space-y-4">
        {/* Visual Helper */}
        <div className="bg-slate-800/50 rounded-lg p-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse">
            <span className="text-white font-bold">?</span>
          </div>
          <p className="text-slate-400 text-xs">Tap the correct option below</p>
        </div>
        
        {/* Options */}
        <div className="space-y-3">
          {[
            '{1, 2, 3, 4, 5}',
            '{Natural numbers}',
            '{All positive integers}',
            '{Real numbers}'
          ].map((option, idx) => (
            <button key={idx} className="w-full p-3 text-left border rounded-lg bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 min-h-[44px] transition-all duration-300">
              <span className="font-semibold mr-3">{String.fromCharCode(65 + idx)})</span>
              <span className="font-mono">{option}</span>
            </button>
          ))}
        </div>
        
        {/* Hint Button */}
        <Button variant="outline" className="w-full border-amber-600 text-amber-400 hover:bg-amber-900/20">
          <Eye className="w-4 h-4 mr-2" />
          Need a Hint?
        </Button>
      </div>
    </div>
    
    {/* Bottom Actions */}
    <div className="absolute bottom-16 left-0 right-0 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">2 of 4 completed</span>
        <Button size="sm" className="bg-cyan-600 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Submit
        </Button>
      </div>
    </div>
  </div>
);

const Step4_QuizStart: React.FC = () => (
  <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
    {/* Header */}
    <div className="p-4 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-semibold">Final Quiz Arena</h2>
        <div className="w-8 h-8" />
      </div>
    </div>
    
    {/* Quiz Intro */}
    <div className="p-6 text-center space-y-6">
      {/* Icon */}
      <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl">
        <Trophy className="w-10 h-10 text-white" />
      </div>
      
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Ready for the Challenge?</h1>
        <p className="text-slate-300 text-sm">
          Test your Set Theory knowledge with 15 carefully crafted questions
        </p>
      </div>
      
      {/* Quiz Details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
          <div className="text-lg font-bold text-red-400">15</div>
          <div className="text-xs text-slate-400">Questions</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
          <div className="text-lg font-bold text-yellow-400">12:00</div>
          <div className="text-xs text-slate-400">Time Limit</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
          <div className="text-lg font-bold text-green-400">60%</div>
          <div className="text-xs text-slate-400">Pass Score</div>
        </div>
      </div>
      
      {/* Difficulty Breakdown */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-sm">Question Breakdown</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-green-900/20 rounded-lg">
            <span className="text-green-400 text-sm">Easy (5 questions)</span>
            <span className="text-green-400 text-sm">10 pts each</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-yellow-900/20 rounded-lg">
            <span className="text-yellow-400 text-sm">Medium (5 questions)</span>
            <span className="text-yellow-400 text-sm">15 pts each</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-red-900/20 rounded-lg">
            <span className="text-red-400 text-sm">Hard (5 questions)</span>
            <span className="text-red-400 text-sm">20 pts each</span>
          </div>
        </div>
      </div>
      
      {/* Start Button */}
      <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-semibold py-3 text-lg min-h-[48px] shadow-lg">
        <Play className="w-5 h-5 mr-2" />
        Start Quiz Challenge
      </Button>
      
      <p className="text-xs text-slate-400">
        You can pause and resume anytime during the quiz
      </p>
    </div>
  </div>
);

const Step5_QuizQ1: React.FC = () => (
  <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
    {/* Quiz Header */}
    <div className="p-3 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center space-x-2">
          <Timer className="w-4 h-4 text-red-400" />
          <span className="text-sm font-mono text-red-400">11:45</span>
        </div>
        <div className="text-xs text-slate-400">Q 1/15</div>
      </div>
    </div>
    
    {/* Progress Dots */}
    <div className="px-4 py-2 bg-slate-800/50">
      <div className="flex justify-center space-x-1">
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${
            i === 0 ? 'bg-cyan-500' : 'bg-slate-600'
          }`} />
        ))}
      </div>
    </div>
    
    {/* Question Content */}
    <div className="p-4 space-y-6">
      {/* Question Header */}
      <div className="space-y-2">
        <Badge variant="outline" className="text-green-400 border-green-400">Easy • 10 pts</Badge>
        <h3 className="text-lg font-semibold leading-relaxed">
          Which symbol denotes the empty set?
        </h3>
      </div>
      
      {/* Options */}
      <div className="space-y-3">
        {[
          '{ }',
          '∅',
          'Ø',
          'None'
        ].map((option, idx) => (
          <button key={idx} className="w-full p-3 text-left border rounded-lg bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 min-h-[48px] transition-all duration-300">
            <span className="font-semibold mr-3">{String.fromCharCode(65 + idx)})</span>
            <span className="font-mono text-lg">{option}</span>
          </button>
        ))}
      </div>
      
      {/* Help Section */}
      <div className="bg-slate-800/50 rounded-lg p-4">
        <h4 className="text-cyan-400 font-semibold mb-2 text-sm">Quick Reminder</h4>
        <p className="text-slate-300 text-sm">
          The empty set contains no elements. It's one of the fundamental concepts in Set Theory.
        </p>
      </div>
    </div>
    
    {/* Bottom Actions */}
    <div className="absolute bottom-16 left-0 right-0 p-4">
      <div className="grid grid-cols-4 gap-2">
        <Button variant="outline" size="sm" className="text-xs" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" className="text-xs border-yellow-600 text-yellow-400">
          Mark
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Skip
        </Button>
        <Button size="sm" className="bg-cyan-600 text-xs">
          Submit
        </Button>
      </div>
    </div>
  </div>
);

const Step6_Result: React.FC = () => (
  <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white flex flex-col items-center justify-center p-6">
    {/* Success Icon */}
    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl animate-bounce">
      <Trophy className="w-10 h-10 text-white" />
    </div>
    
    {/* Results */}
    <div className="text-center space-y-6 w-full">
      {/* Score */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Quiz Complete!</h1>
        <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          85%
        </div>
        <p className="text-slate-300">191 out of 225 points</p>
      </div>
      
      {/* Performance Badge */}
      <Badge variant="outline" className="text-green-400 border-green-400 px-4 py-2 text-base">
        🎉 Excellent Performance!
      </Badge>
      
      {/* Statistics */}
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
          <div className="text-lg font-bold text-cyan-400">15</div>
          <div className="text-xs text-slate-400">Answered</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
          <div className="text-lg font-bold text-green-400">12</div>
          <div className="text-xs text-slate-400">Correct</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
          <div className="text-lg font-bold text-red-400">3</div>
          <div className="text-xs text-slate-400">Incorrect</div>
        </div>
        <div className="text-center p-3 bg-slate-800/50 rounded-lg">
          <div className="text-lg font-bold text-purple-400">9:34</div>
          <div className="text-xs text-slate-400">Time Used</div>
        </div>
      </div>
      
      {/* Achievements */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-sm">Achievements Unlocked</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-2 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <span className="text-xl">🏆</span>
            <span className="text-yellow-400 text-sm">Sets Master</span>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <span className="text-xl">⚡</span>
            <span className="text-blue-400 text-sm">Speed Learner</span>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="space-y-3 w-full">
        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold py-3">
          <CheckCircle className="w-5 h-5 mr-2" />
          Continue to Next Module
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="border-slate-600 text-slate-200 py-2">
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-200 py-2">
            <Eye className="w-4 h-4 mr-2" />
            Review
          </Button>
        </div>
      </div>
    </div>
    
    {/* Confetti Effect */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 10 }, (_, i) => (
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
  </div>
);

const flowSteps: FlowStep[] = [
  {
    id: 'start',
    title: 'App Launch',
    description: 'User opens Learnio app and sees welcome screen',
    component: <Step1_Start />,
    annotations: [
      'Clean, welcoming interface with app branding',
      'Quick stats showing available content',
      'Language selection indicator',
      'Prominent CTA button with clear next action'
    ],
    userAction: 'Tap "Continue to Dashboard"',
    nextStep: 'module'
  },
  {
    id: 'module',
    title: 'Module Selection',
    description: 'User navigates to Sets Adventure module from Advanced Mathematics',
    component: <Step2_Module />,
    annotations: [
      'Clear module hierarchy and breadcrumb navigation',
      'Progress indicators showing current completion',
      'Multiple entry points (continue vs restart)',
      'Recent activity section for quick access'
    ],
    userAction: 'Tap "Continue Learning"',
    nextStep: 'microtask'
  },
  {
    id: 'microtask',
    title: 'Interactive Microtask',
    description: 'User encounters a quick knowledge check during the lesson',
    component: <Step3_Microtask />,
    annotations: [
      'Bite-sized content with clear progress indicators',
      'Visual helper elements to aid understanding',
      'Touch-optimized answer options (44px+)',
      'Hint system available for struggling learners'
    ],
    userAction: 'Select correct answer and tap "Submit"',
    nextStep: 'quiz-start'
  },
  {
    id: 'quiz-start',
    title: 'Quiz Arena Entry',
    description: 'User begins the final comprehensive assessment',
    component: <Step4_QuizStart />,
    annotations: [
      'Clear expectations set with time, questions, scoring',
      'Difficulty breakdown helps students prepare',
      'Motivational design with trophy iconography',
      'Emphasis on achievement and challenge'
    ],
    userAction: 'Tap "Start Quiz Challenge"',
    nextStep: 'quiz-q1'
  },
  {
    id: 'quiz-q1',
    title: 'Quiz Question Interface',
    description: 'User answers the first quiz question with timer running',
    component: <Step5_QuizQ1 />,
    annotations: [
      'Timer prominent but not overwhelming',
      'Progress dots show position in quiz',
      'Question clearly formatted with difficulty indicator',
      'Multiple action buttons for navigation control'
    ],
    userAction: 'Select answer B (∅) and tap "Submit"',
    nextStep: 'result'
  },
  {
    id: 'result',
    title: 'Achievement & Results',
    description: 'User sees comprehensive results with achievements and next steps',
    component: <Step6_Result />,
    annotations: [
      'Celebration of achievement with visual rewards',
      'Detailed statistics for performance analysis',
      'Achievement system motivates continued learning',
      'Clear next steps maintain learning momentum'
    ],
    userAction: 'Tap "Continue to Next Module"',
    nextStep: ''
  }
];

export const SA_PreviewMobileFlow: React.FC<PreviewMobileFlowProps> = ({ className = "" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(3000);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % flowSteps.length);
      }, autoPlaySpeed);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlaySpeed]);

  const currentStepData = flowSteps[currentStep];

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(flowSteps.length - 1, prev + 1));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white p-6 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            SA Mobile Flow Preview
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Step-through storyboards showing the complete user journey from app launch to quiz completion. 
            Optimized for 360px mobile screens with 44px+ touch targets.
          </p>
        </div>

        {/* Flow Navigation */}
        <div className="flex justify-center">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              {/* Auto-play Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={isAutoPlaying ? "default" : "outline"}
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="min-h-[36px]"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isAutoPlaying ? 'Playing' : 'Auto-play'}
                </Button>
                
                {isAutoPlaying && (
                  <select 
                    value={autoPlaySpeed}
                    onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                    className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                  >
                    <option value={2000}>Fast (2s)</option>
                    <option value={3000}>Normal (3s)</option>
                    <option value={5000}>Slow (5s)</option>
                  </select>
                )}
              </div>

              {/* Step Navigation */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="min-h-[36px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <span className="text-sm font-medium px-3">
                  {currentStep + 1} / {flowSteps.length}
                </span>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNext}
                  disabled={currentStep === flowSteps.length - 1}
                  className="min-h-[36px]"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-3 bg-slate-800/30 rounded-lg p-3">
            {flowSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(idx)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  idx === currentStep
                    ? 'bg-cyan-500 text-white scale-110'
                    : idx < currentStep
                    ? 'bg-green-500/50 text-green-200'
                    : 'bg-slate-600/50 text-slate-400 hover:bg-slate-500/50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Mobile Preview */}
          <div className="flex justify-center">
            <MobileFrame title={currentStepData.title}>
              {currentStepData.component}
            </MobileFrame>
          </div>

          {/* Step Information */}
          <div className="space-y-6">
            {/* Step Details */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-cyan-400" />
                  Step {currentStep + 1}: {currentStepData.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">{currentStepData.description}</p>
                
                <div className="space-y-3">
                  <h4 className="text-cyan-400 font-semibold">User Action Required:</h4>
                  <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                    <p className="text-cyan-200 font-medium">{currentStepData.userAction}</p>
                  </div>
                </div>

                {currentStepData.nextStep && (
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <ArrowRight className="w-4 h-4" />
                    <span>Next: {flowSteps.find(s => s.id === currentStepData.nextStep)?.title}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Design Annotations */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-400" />
                  Design Annotations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentStepData.annotations.map((annotation, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm">
                      <span className="text-purple-400 mt-1">•</span>
                      <span className="text-slate-300">{annotation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Technical Specs */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Screen Size:</span>
                    <div className="text-green-400 font-mono">360x800px</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Touch Targets:</span>
                    <div className="text-green-400 font-mono">≥44px</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Text Size:</span>
                    <div className="text-green-400 font-mono">≥16px</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Contrast:</span>
                    <div className="text-green-400 font-mono">≥4.5:1</div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <h5 className="text-green-400 font-semibold mb-2">Mobile Optimizations</h5>
                  <ul className="space-y-1 text-xs text-green-200">
                    <li>• Thumb-friendly navigation patterns</li>
                    <li>• Single-column layouts for easy scrolling</li>
                    <li>• Large, clearly labeled action buttons</li>
                    <li>• Minimal cognitive load per screen</li>
                    <li>• Fast loading with progressive enhancement</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Flow Summary */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Complete User Journey Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flowSteps.map((step, idx) => (
                <div 
                  key={step.id} 
                  className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                    idx === currentStep
                      ? 'bg-cyan-900/30 border-cyan-500/50'
                      : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-600/30'
                  }`}
                  onClick={() => setCurrentStep(idx)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      idx === currentStep ? 'bg-cyan-500 text-white' : 'bg-slate-600 text-slate-300'
                    }`}>
                      {idx + 1}
                    </div>
                    <h4 className="text-white font-semibold">{step.title}</h4>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{step.description}</p>
                  <div className="text-xs text-slate-500">
                    Action: {step.userAction}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">Journey Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Total Steps:</span>
                  <div className="text-blue-400 font-bold">{flowSteps.length}</div>
                </div>
                <div>
                  <span className="text-slate-400">Est. Time:</span>
                  <div className="text-blue-400 font-bold">3-5 minutes</div>
                </div>
                <div>
                  <span className="text-slate-400">Touch Points:</span>
                  <div className="text-blue-400 font-bold">12+ interactions</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SA_PreviewMobileFlow;