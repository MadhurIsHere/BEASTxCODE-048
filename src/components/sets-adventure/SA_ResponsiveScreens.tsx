import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, HelpCircle, Settings, Save, Timer, Target, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

// SA RESPONSIVE SCREENS - Mobile, Tablet, Desktop variants
// Following 8px spacing system and accessibility guidelines

interface ResponsiveScreensProps {
  className?: string;
}

// Responsive breakpoint utilities
const breakpoints = {
  mobile: 'max-w-[360px]',
  tablet: 'max-w-[768px]',
  desktop: 'max-w-[1280px]'
};

// SA Landing Screen - Responsive Variants
const SALandingMobile: React.FC = () => (
  <div className="min-h-[800px] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden">
    {/* Mobile HUD */}
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50 px-3 py-2">
      <div className="flex items-center justify-between">
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-semibold text-white max-w-[120px] truncate">Sets Adventure</h2>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="pt-16 pb-20 px-4 flex flex-col items-center justify-center min-h-[800px]">
      {/* Breadcrumb */}
      <div className="text-center mb-6">
        <p className="text-slate-400 text-xs mb-2">Advanced Math › Set Theory</p>
        <h1 className="text-2xl font-bold text-white mb-3">Sets Adventure</h1>
        <p className="text-slate-300 text-sm leading-relaxed px-2">
          Master fundamental Set Theory concepts through interactive learning
        </p>
      </div>

      {/* Module Card */}
      <Card className="w-full max-w-sm bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-3 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-white text-lg">Set Theory Fundamentals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <p className="text-slate-400">Lessons</p>
              <p className="text-white font-semibold">7</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Duration</p>
              <p className="text-white font-semibold">60 min</p>
            </div>
          </div>
          
          {/* Progress Shards */}
          <div className="flex justify-center space-x-2 py-2">
            {[85, 92, 67, 23, 0].map((progress, idx) => (
              <div key={idx} className="relative w-6 h-6">
                <svg className="w-full h-full text-cyan-400" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M17.5 3.5L22 7.5V16.5L17.5 20.5H6.5L2 16.5V7.5L6.5 3.5H17.5Z" 
                    fill={`rgba(6, 182, 212, ${progress / 100})`}
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  />
                </svg>
                {progress > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">{progress}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-lg min-h-[44px]">
              <Play className="w-4 h-4 mr-2" />
              Start Lesson
            </Button>
            <Button variant="outline" className="w-full border-slate-600 bg-slate-700/50 text-slate-200 py-3 rounded-lg min-h-[44px]">
              Resume Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Mobile Bottom Nav */}
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-t border-slate-700/50 px-3 py-2">
      <div className="flex items-center justify-center space-x-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300">
          <HelpCircle className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </div>
  </div>
);

const SALandingTablet: React.FC = () => (
  <div className="min-h-[1024px] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden">
    {/* Tablet HUD */}
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-600/50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-white max-w-[300px] truncate">Sets Adventure</h2>
        <div className="flex items-center space-x-3">
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-600/50">
            <Save className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-600/50">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="pt-24 pb-24 px-8 flex flex-col items-center justify-center min-h-[1024px]">
      {/* Breadcrumb */}
      <div className="text-center mb-8">
        <p className="text-slate-400 text-sm mb-3">Advanced Mathematics › Unit: Set & Relations › Set</p>
        <h1 className="text-4xl font-bold text-white mb-4">Sets Adventure</h1>
        <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
          Master the fundamental concepts of Set Theory through interactive learning and engaging visualizations
        </p>
      </div>

      {/* Module Card */}
      <Card className="w-full max-w-lg bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-xl">Set Theory Fundamentals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-base">
            <div className="text-center">
              <p className="text-slate-400">Lessons</p>
              <p className="text-white font-semibold">7</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Duration</p>
              <p className="text-white font-semibold">60 min</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400">Difficulty</p>
              <p className="text-white font-semibold">Grade 11</p>
            </div>
          </div>
          
          {/* Progress Shards */}
          <div className="flex justify-center space-x-3 py-3">
            {[85, 92, 67, 23, 0, 0, 0].map((progress, idx) => (
              <div key={idx} className="relative w-8 h-8">
                <svg className="w-full h-full text-cyan-400" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M17.5 3.5L22 7.5V16.5L17.5 20.5H6.5L2 16.5V7.5L6.5 3.5H17.5Z" 
                    fill={`rgba(6, 182, 212, ${progress / 100})`}
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  />
                </svg>
                {progress > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">{progress}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 pt-4">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-4 rounded-lg min-h-[48px] text-lg">
              <Play className="w-5 h-5 mr-3" />
              Start Lesson
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-slate-600 bg-slate-700/50 text-slate-200 py-3 rounded-lg min-h-[44px]">
                Resume Progress
              </Button>
              <Button variant="outline" className="border-slate-600 bg-slate-700/50 text-slate-200 py-3 rounded-lg min-h-[44px]">
                Preview Content
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const SALandingDesktop: React.FC = () => (
  <div className="min-h-[800px] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white relative overflow-hidden">
    {/* Desktop HUD */}
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50 px-8 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 transition-all duration-300">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-white">Sets Adventure - Interactive Learning Module</h2>
        <div className="flex items-center space-x-4">
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 transition-all duration-300">
            <Save className="w-6 h-6" />
          </button>
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 transition-all duration-300">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="pt-32 pb-32 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="space-y-8">
          {/* Breadcrumb */}
          <div>
            <p className="text-slate-400 text-base mb-3">Advanced Mathematics › Unit: Set & Relations › Set</p>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">Sets Adventure</h1>
            <p className="text-slate-300 text-xl max-w-2xl leading-relaxed">
              Master the fundamental concepts of Set Theory through interactive learning, 
              engaging visualizations, and hands-on practice problems designed for Grade 11 students.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="text-3xl font-bold text-cyan-400 mb-2">7</div>
              <div className="text-slate-300">Interactive Lessons</div>
            </div>
            <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="text-3xl font-bold text-blue-400 mb-2">60</div>
              <div className="text-slate-300">Minutes</div>
            </div>
            <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="text-3xl font-bold text-purple-400 mb-2">15</div>
              <div className="text-slate-300">Quiz Questions</div>
            </div>
          </div>

          {/* Progress Shards */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Learning Progress</h3>
            <div className="flex space-x-4">
              {[
                { progress: 85, label: 'What is a Set?' },
                { progress: 92, label: 'Types of Sets' },
                { progress: 67, label: 'Set Operations' },
                { progress: 23, label: 'Venn Diagrams' },
                { progress: 0, label: 'Final Quiz' }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="relative w-12 h-12 mb-2">
                    <svg className="w-full h-full text-cyan-400" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M17.5 3.5L22 7.5V16.5L17.5 20.5H6.5L2 16.5V7.5L6.5 3.5H17.5Z" 
                        fill={`rgba(6, 182, 212, ${item.progress / 100})`}
                        stroke="currentColor" 
                        strokeWidth="1.5"
                      />
                    </svg>
                    {item.progress > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">{item.progress}%</span>
                      </div>
                    )}
                    {item.progress === 100 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 max-w-[80px]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex space-x-4">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-4 px-8 rounded-xl min-h-[56px] text-lg transition-all duration-300 hover:scale-105">
              <Play className="w-6 h-6 mr-3" />
              Start Learning Journey
            </Button>
            <Button variant="outline" className="border-slate-600 bg-slate-700/50 text-slate-200 py-4 px-6 rounded-xl min-h-[56px] text-lg">
              Resume Progress
            </Button>
          </div>
        </div>

        {/* Right Column - Visual */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Target className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-white text-2xl">Set Theory Fundamentals</CardTitle>
              <p className="text-slate-400">Grade 11 Advanced Mathematics</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Learning Path Preview */}
              <div className="space-y-3">
                <h4 className="text-white font-semibold">Learning Path</h4>
                {[
                  'Introduction to Sets',
                  'Types of Sets',
                  'Set Operations',
                  'Venn Diagrams',
                  'Practice & Quiz'
                ].map((lesson, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-2 rounded-lg bg-slate-700/30">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      idx < 2 ? 'bg-green-500' : idx === 2 ? 'bg-yellow-500' : 'bg-slate-600'
                    }`}>
                      {idx < 2 ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <span className="text-slate-200 text-sm">{lesson}</span>
                  </div>
                ))}
              </div>

              {/* Preview Button */}
              <Button variant="outline" className="w-full border-slate-600 bg-slate-700/50 text-slate-200 py-3 rounded-lg">
                Preview Content
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

// Quiz Screen Responsive Variants
const SAQuizMobile: React.FC = () => (
  <div className="min-h-[800px] bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
    {/* Mobile Quiz HUD */}
    <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 px-3 py-2">
      <div className="flex items-center justify-between">
        <button className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 mx-3">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-red-400" />
            <span className="text-sm font-mono text-red-400">08:45</span>
          </div>
        </div>
        <div className="text-xs text-slate-400">Q 3/15</div>
      </div>
    </div>

    {/* Progress Dots */}
    <div className="fixed top-12 left-0 right-0 z-30 px-3 py-2 bg-slate-800/80">
      <div className="flex justify-center space-x-1">
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${
            i < 2 ? 'bg-green-500' : i === 2 ? 'bg-cyan-500' : 'bg-slate-600'
          }`} />
        ))}
      </div>
    </div>

    {/* Content */}
    <div className="pt-20 pb-20 px-4 space-y-6">
      {/* Question */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="mb-4">
            <Badge variant="outline" className="mb-2 text-xs">Medium</Badge>
            <h3 className="text-lg font-semibold text-white mb-3">
              If A = {1, 2, 3} and B = {2, 3, 4}, what is A ∪ B?
            </h3>
          </div>
          
          {/* Options */}
          <div className="space-y-3">
            {[
              '{1, 2, 3, 4}',
              '{2, 3}', 
              '{1, 4}',
              '{1, 2, 3, 2, 3, 4}'
            ].map((option, idx) => (
              <button key={idx} className="w-full p-3 text-left border rounded-lg bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 min-h-[44px]">
                <span className="font-mono">{String.fromCharCode(65 + idx)})</span> {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Numeric Input */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <input 
              type="text" 
              placeholder="Enter your answer"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white text-center text-xl font-mono min-h-[44px]"
            />
          </div>
          
          {/* Mini Keypad */}
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
              <button key={num} className="h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold">
                {num}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Mobile Quiz Nav */}
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 px-3 py-3">
      <div className="grid grid-cols-4 gap-2">
        <Button variant="outline" size="sm" className="text-xs">Previous</Button>
        <Button variant="outline" size="sm" className="text-xs">Mark</Button>
        <Button variant="outline" size="sm" className="text-xs">Skip</Button>
        <Button size="sm" className="bg-cyan-600 text-xs">Submit</Button>
      </div>
    </div>
  </div>
);

// Component Showcase
export const SA_ResponsiveScreens: React.FC<ResponsiveScreensProps> = ({ className = "" }) => {
  const [activeScreen, setActiveScreen] = useState<'landing' | 'quiz' | 'lesson'>('landing');
  const [activeVariant, setActiveVariant] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white p-6 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            SA Responsive Screens
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Mobile-first responsive design with variants for 360px mobile, 768px tablet, and 1280px desktop breakpoints.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex space-x-2">
            {['landing', 'quiz', 'lesson'].map((screen) => (
              <Button
                key={screen}
                variant={activeScreen === screen ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveScreen(screen as any)}
                className="capitalize"
              >
                {screen} Screen
              </Button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            {['mobile', 'tablet', 'desktop'].map((variant) => (
              <Button
                key={variant}
                variant={activeVariant === variant ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveVariant(variant as any)}
                className="capitalize"
              >
                {variant} ({variant === 'mobile' ? '360px' : variant === 'tablet' ? '768px' : '1280px'})
              </Button>
            ))}
          </div>
        </div>

        {/* Screen Showcase */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <div className="flex justify-center">
            <div className={`${breakpoints[activeVariant]} border border-slate-600 rounded-xl overflow-hidden bg-slate-900`}>
              {activeScreen === 'landing' && activeVariant === 'mobile' && <SALandingMobile />}
              {activeScreen === 'landing' && activeVariant === 'tablet' && <SALandingTablet />}
              {activeScreen === 'landing' && activeVariant === 'desktop' && <SALandingDesktop />}
              {activeScreen === 'quiz' && <SAQuizMobile />}
              {activeScreen === 'lesson' && (
                <div className="p-8 text-center">
                  <h3 className="text-xl text-white mb-4">Lesson Screen Variant</h3>
                  <p className="text-slate-400">Interactive lesson content will be displayed here with responsive layout adjustments for {activeVariant} devices.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400">Mobile (360x800)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <p>• Compact HUD with essential controls</p>
              <p>• Single column layout</p>
              <p>• Touch-optimized 44px+ targets</p>
              <p>• Simplified navigation</p>
              <p>• Stacked content cards</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-blue-400">Tablet (768x1024)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <p>• Extended HUD with more actions</p>
              <p>• Grid layouts where appropriate</p>
              <p>• Larger touch targets</p>
              <p>• Enhanced visual hierarchy</p>
              <p>• Side-by-side content</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-purple-400">Desktop (1280x800)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-300">
              <p>• Full-featured HUD with all controls</p>
              <p>• Multi-column responsive layouts</p>
              <p>• Hover states and interactions</p>
              <p>• Rich visual presentations</p>
              <p>• Advanced content organization</p>
            </CardContent>
          </Card>
        </div>

        {/* Design System Notes */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Responsive Design System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">Typography Scale</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Mobile: 14-24px range</li>
                  <li>• Tablet: 16-32px range</li>
                  <li>• Desktop: 16-48px range</li>
                  <li>• Poppins Semi-Bold (headings)</li>
                  <li>• Rajdhani (counters/numbers)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Spacing System</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Base unit: 8px scale</li>
                  <li>• Tokens: 4, 8, 16, 24, 32, 48px</li>
                  <li>• Touch targets: ≥44px mobile</li>
                  <li>• Content padding adapts to screen</li>
                  <li>• Consistent margin ratios</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="text-purple-400 font-semibold mb-2">Accessibility Features</h4>
              <ul className="space-y-1 text-sm">
                <li>• Color contrast ≥4.5:1 for all text</li>
                <li>• Focus indicators on all interactive elements</li>
                <li>• Semantic HTML structure maintained across variants</li>
                <li>• Screen reader friendly navigation</li>
                <li>• Keyboard navigation support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SA_ResponsiveScreens;