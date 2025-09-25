import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, Target, Eye, Users, Zap, Trophy, BookOpen, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

// SA FLOW & PACING - 60-minute lesson timeline with interactive timer
// Complete learning path with stage durations and adaptive pacing

interface FlowPacingProps {
  className?: string;
}

interface LearningStage {
  id: string;
  title: string;
  duration: number; // in minutes
  description: string;
  objectives: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'lesson' | 'practice' | 'assessment';
  icon: React.ReactNode;
  color: string;
  estimatedScore?: number;
}

const learningStages: LearningStage[] = [
  {
    id: 'intro',
    title: 'Introduction & Overview',
    duration: 5,
    description: 'Welcome to Sets Adventure and learning objectives',
    objectives: [
      'Understand what Set Theory is',
      'Preview the learning journey',
      'Set expectations and goals'
    ],
    difficulty: 'easy',
    type: 'lesson',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'blue',
    estimatedScore: 100
  },
  {
    id: 'what-is-set',
    title: 'What is a Set?',
    duration: 8,
    description: 'Interactive definition and notation learning',
    objectives: [
      'Learn set definition and well-defined criteria',
      'Master roster and set-builder notation',
      'Understand empty set concept',
      'Practice set identification'
    ],
    difficulty: 'easy',
    type: 'lesson',
    icon: <Eye className="w-5 h-5" />,
    color: 'green',
    estimatedScore: 85
  },
  {
    id: 'types-of-sets',
    title: 'Types of Sets',
    duration: 12,
    description: 'Classification of finite, infinite, singleton, and equal sets',
    objectives: [
      'Distinguish finite vs infinite sets',
      'Identify singleton sets',
      'Compare equal and equivalent sets',
      'Calculate cardinality'
    ],
    difficulty: 'medium',
    type: 'lesson',
    icon: <Users className="w-5 h-5" />,
    color: 'yellow',
    estimatedScore: 78
  },
  {
    id: 'subsets-intervals',
    title: 'Subsets & Intervals',
    duration: 10,
    description: 'Subset relationships and interval notation',
    objectives: [
      'Master subset notation (⊂, ⊆)',
      'Distinguish proper vs improper subsets',
      'Work with interval notation',
      'Practice subset validation'
    ],
    difficulty: 'medium',
    type: 'lesson',
    icon: <Target className="w-5 h-5" />,
    color: 'purple',
    estimatedScore: 72
  },
  {
    id: 'set-operations',
    title: 'Set Operations',
    duration: 15,
    description: 'Union, intersection, difference, and complement operations',
    objectives: [
      'Perform union operations (∪)',
      'Calculate intersections (∩)',
      'Compute set differences (\\)',
      'Find complements with universal sets'
    ],
    difficulty: 'hard',
    type: 'lesson',
    icon: <Zap className="w-5 h-5" />,
    color: 'red',
    estimatedScore: 68
  },
  {
    id: 'venn-practice',
    title: 'Venn Diagram Practice',
    duration: 10,
    description: 'Interactive 2-set and 3-set Venn diagram problems',
    objectives: [
      'Solve 2-set Venn problems',
      'Master 3-set Venn calculations',
      'Apply inclusion-exclusion principle',
      'Interpret real-world scenarios'
    ],
    difficulty: 'hard',
    type: 'practice',
    icon: <Target className="w-5 h-5" />,
    color: 'indigo',
    estimatedScore: 65
  },
  {
    id: 'final-quiz',
    title: 'Final Quiz Arena',
    duration: 12,
    description: '15-question comprehensive assessment',
    objectives: [
      'Demonstrate comprehensive understanding',
      'Apply concepts to varied problems',
      'Achieve 60%+ for certification',
      'Earn Sets Adventure completion badge'
    ],
    difficulty: 'hard',
    type: 'assessment',
    icon: <Trophy className="w-5 h-5" />,
    color: 'cyan',
    estimatedScore: 75
  }
];

const SAFlowTimer: React.FC<{
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  timeElapsed: number;
  currentStage: number;
  onStageComplete: () => void;
}> = ({ isRunning, onToggle, onReset, timeElapsed, currentStage, onStageComplete }) => {
  const totalDuration = learningStages.reduce((sum, stage) => sum + stage.duration, 0);
  const currentStageData = learningStages[currentStage];
  const stageStartTime = learningStages.slice(0, currentStage).reduce((sum, stage) => sum + stage.duration, 0);
  const stageProgress = Math.min(100, Math.max(0, ((timeElapsed - stageStartTime) / currentStageData.duration) * 100));
  const overallProgress = (timeElapsed / totalDuration) * 100;
  
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    return hrs > 0 ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` 
                   : `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isPaceWarning = timeElapsed > stageStartTime + currentStageData.duration + 2; // 2 min buffer
  const isFastPace = timeElapsed < stageStartTime + currentStageData.duration - 2;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center">
            <Timer className="w-5 h-5 mr-2 text-cyan-400" />
            Learning Flow Timer
          </span>
          <div className="flex items-center space-x-2">
            <Button
              onClick={onToggle}
              size="sm"
              variant={isRunning ? "outline" : "default"}
              className="min-h-[32px]"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              onClick={onReset}
              size="sm"
              variant="ghost"
              className="min-h-[32px]"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Stage Info */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-${currentStageData.color}-500/20 border-2 border-${currentStageData.color}-500 flex items-center justify-center`}>
              {currentStageData.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{currentStageData.title}</h3>
              <p className="text-sm text-slate-400">Stage {currentStage + 1} of {learningStages.length}</p>
            </div>
          </div>
          
          {/* Time Display */}
          <div className="space-y-2">
            <div className="text-3xl font-mono font-bold text-cyan-400">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-sm text-slate-400">
              Target: {formatTime(stageStartTime + currentStageData.duration)} • 
              Total: {formatTime(totalDuration)}
            </div>
          </div>

          {/* Pace Indicator */}
          {isPaceWarning && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-400 animate-warning-pulse">
              Running Behind • Consider Speeding Up
            </Badge>
          )}
          {isFastPace && (
            <Badge variant="outline" className="text-green-400 border-green-400 animate-fast-mode-glow">
              Great Pace • Ahead of Schedule
            </Badge>
          )}
        </div>

        {/* Stage Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Stage Progress</span>
            <span className="text-white font-medium">{Math.round(stageProgress)}%</span>
          </div>
          <div className="relative">
            <Progress value={stageProgress} className="h-3" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-full" />
          </div>
        </div>

        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Overall Progress</span>
            <span className="text-white font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <div className="relative">
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>

        {/* Stage Objectives */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white">Current Objectives:</h4>
          <ul className="space-y-1">
            {currentStageData.objectives.map((objective, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300">{objective}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onStageComplete}
            variant="outline"
            size="sm"
            className="border-green-600 text-green-400 hover:bg-green-900/20"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Stage
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300"
          >
            <Clock className="w-4 h-4 mr-2" />
            Add 5 Min
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SALearningPath: React.FC<{
  currentStage: number;
  timeElapsed: number;
  onStageSelect: (stage: number) => void;
}> = ({ currentStage, timeElapsed, onStageSelect }) => {
  const getStageStatus = (stageIndex: number) => {
    const stage = learningStages[stageIndex];
    const stageStartTime = learningStages.slice(0, stageIndex).reduce((sum, s) => sum + s.duration, 0);
    const stageEndTime = stageStartTime + stage.duration;
    
    if (stageIndex < currentStage) return 'completed';
    if (stageIndex === currentStage) return 'active';
    if (timeElapsed >= stageStartTime) return 'available';
    return 'locked';
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Learning Path Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {learningStages.map((stage, idx) => {
            const status = getStageStatus(idx);
            const stageStartTime = learningStages.slice(0, idx).reduce((sum, s) => sum + s.duration, 0);
            const isOnTime = timeElapsed <= stageStartTime + stage.duration + 2;
            
            return (
              <div key={stage.id} className="relative">
                {/* Connection Line */}
                {idx < learningStages.length - 1 && (
                  <div className={`absolute left-6 top-12 w-0.5 h-8 ${
                    status === 'completed' ? 'bg-green-500' : 'bg-slate-600'
                  }`} />
                )}
                
                {/* Stage Node */}
                <div
                  className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                    status === 'active' ? 'bg-slate-700/50 border border-cyan-500/30' :
                    status === 'completed' ? 'bg-green-900/20 border border-green-500/30' :
                    status === 'available' ? 'hover:bg-slate-700/30' :
                    'opacity-50'
                  }`}
                  onClick={() => status !== 'locked' && onStageSelect(idx)}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                    status === 'completed' ? 'bg-green-500/20 border-green-500 text-green-400' :
                    status === 'active' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' :
                    status === 'available' ? `bg-${stage.color}-500/20 border-${stage.color}-500 text-${stage.color}-400` :
                    'bg-slate-600/20 border-slate-600 text-slate-500'
                  }`}>
                    {status === 'completed' ? <CheckCircle className="w-6 h-6" /> : stage.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${
                        status === 'active' ? 'text-cyan-400' :
                        status === 'completed' ? 'text-green-400' :
                        'text-white'
                      }`}>
                        {stage.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            stage.difficulty === 'easy' ? 'text-green-400 border-green-400' :
                            stage.difficulty === 'medium' ? 'text-yellow-400 border-yellow-400' :
                            'text-red-400 border-red-400'
                          }`}
                        >
                          {stage.difficulty}
                        </Badge>
                        <span className="text-xs text-slate-400">{stage.duration}m</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-400 mb-2">{stage.description}</p>
                    
                    {/* Progress Bar for Current Stage */}
                    {status === 'active' && (
                      <div className="mt-3">
                        <Progress 
                          value={Math.min(100, Math.max(0, ((timeElapsed - stageStartTime) / stage.duration) * 100))} 
                          className="h-2" 
                        />
                      </div>
                    )}
                    
                    {/* Pace Indicator */}
                    {status === 'active' && !isOnTime && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">
                          Behind Schedule
                        </Badge>
                      </div>
                    )}
                    
                    {/* Score Estimate */}
                    {stage.estimatedScore && (
                      <div className="mt-2">
                        <span className="text-xs text-slate-500">
                          Est. Score: {stage.estimatedScore}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-cyan-400">
                {learningStages.reduce((sum, stage) => sum + stage.duration, 0)}m
              </div>
              <div className="text-xs text-slate-400">Total Duration</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">
                {learningStages.filter((_, idx) => getStageStatus(idx) === 'completed').length}
              </div>
              <div className="text-xs text-slate-400">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">
                {learningStages.filter(stage => stage.type === 'lesson').length}
              </div>
              <div className="text-xs text-slate-400">Lessons</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">
                {learningStages.filter(stage => stage.difficulty === 'hard').length}
              </div>
              <div className="text-xs text-slate-400">Advanced</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
export const SA_FlowPacing: React.FC<FlowPacingProps> = ({ className = "" }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // in minutes
  const [currentStage, setCurrentStage] = useState(0);
  const [showPaceAnalysis, setShowPaceAnalysis] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 0.1); // Update every 6 seconds (0.1 minute)
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Auto-advance stage based on time
  useEffect(() => {
    const currentStageData = learningStages[currentStage];
    const stageStartTime = learningStages.slice(0, currentStage).reduce((sum, stage) => sum + stage.duration, 0);
    
    if (timeElapsed >= stageStartTime + currentStageData.duration && currentStage < learningStages.length - 1) {
      // Auto-advance to next stage if time exceeded
      setCurrentStage(prev => prev + 1);
    }
  }, [timeElapsed, currentStage]);

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setTimeElapsed(0);
    setCurrentStage(0);
    setIsRunning(false);
  };

  const handleStageComplete = () => {
    if (currentStage < learningStages.length - 1) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handleStageSelect = (stageIndex: number) => {
    setCurrentStage(stageIndex);
    const stageStartTime = learningStages.slice(0, stageIndex).reduce((sum, stage) => sum + stage.duration, 0);
    setTimeElapsed(stageStartTime);
  };

  const totalDuration = learningStages.reduce((sum, stage) => sum + stage.duration, 0);
  const overallProgress = (timeElapsed / totalDuration) * 100;
  const completedStages = learningStages.filter((_, idx) => {
    const stageStartTime = learningStages.slice(0, idx).reduce((sum, stage) => sum + stage.duration, 0);
    return timeElapsed >= stageStartTime + learningStages[idx].duration;
  }).length;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white p-6 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            SA Flow & Pacing System
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Interactive 60-minute learning timeline with adaptive pacing, stage tracking, and performance optimization for the complete Sets Adventure experience.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-cyan-400 mb-1">{Math.round(overallProgress)}%</div>
              <div className="text-sm text-slate-400">Overall Progress</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-400 mb-1">{completedStages}</div>
              <div className="text-sm text-slate-400">Stages Complete</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{Math.round(timeElapsed)}</div>
              <div className="text-sm text-slate-400">Minutes Elapsed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-400 mb-1">{totalDuration - Math.round(timeElapsed)}</div>
              <div className="text-sm text-slate-400">Minutes Remaining</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer Widget */}
          <div className="lg:col-span-1">
            <SAFlowTimer
              isRunning={isRunning}
              onToggle={handleToggleTimer}
              onReset={handleResetTimer}
              timeElapsed={timeElapsed}
              currentStage={currentStage}
              onStageComplete={handleStageComplete}
            />
          </div>

          {/* Learning Path */}
          <div className="lg:col-span-2">
            <SALearningPath
              currentStage={currentStage}
              timeElapsed={timeElapsed}
              onStageSelect={handleStageSelect}
            />
          </div>
        </div>

        {/* Pace Analysis */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Adaptive Pacing Analysis</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPaceAnalysis(!showPaceAnalysis)}
              >
                {showPaceAnalysis ? 'Hide' : 'Show'} Analysis
              </Button>
            </CardTitle>
          </CardHeader>
          
          {showPaceAnalysis && (
            <CardContent className="space-y-6">
              {/* Pacing Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-cyan-400 font-semibold">Performance Insights</h4>
                  <div className="space-y-3">
                    {timeElapsed > 0 && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Learning Velocity</span>
                          <span className={`font-medium ${
                            overallProgress / (timeElapsed / totalDuration * 100) > 1.1 ? 'text-green-400' :
                            overallProgress / (timeElapsed / totalDuration * 100) < 0.9 ? 'text-red-400' :
                            'text-yellow-400'
                          }`}>
                            {overallProgress > 0 ? 
                              `${Math.round((overallProgress / (timeElapsed / totalDuration * 100)) * 100)}%` : 
                              'N/A'
                            }
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Estimated Completion</span>
                          <span className="text-white font-medium">
                            {overallProgress > 0 ? 
                              `${Math.round((100 - overallProgress) / (overallProgress / timeElapsed))} min remaining` :
                              `${totalDuration} min estimated`
                            }
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">Difficulty Adaptation</span>
                          <span className="text-purple-400 font-medium">
                            {timeElapsed > 15 ? 'Standard' : 'Accelerated'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-green-400 font-semibold">Optimization Tips</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    {timeElapsed > totalDuration * 0.7 ? (
                      <>
                        <p>• Focus on core concepts in remaining time</p>
                        <p>• Consider extending session for complete coverage</p>
                        <p>• Review difficult topics after completion</p>
                      </>
                    ) : timeElapsed < totalDuration * 0.3 && overallProgress > 30 ? (
                      <>
                        <p>• Excellent pace! Consider deeper exploration</p>
                        <p>• Add extra practice problems if time permits</p>
                        <p>• Take breaks to maintain focus</p>
                      </>
                    ) : (
                      <>
                        <p>• Maintain current learning velocity</p>
                        <p>• Allocate extra time for complex operations</p>
                        <p>• Use practice time effectively</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Visual Timeline */}
              <div className="space-y-3">
                <h4 className="text-white font-semibold">Visual Timeline</h4>
                <div className="relative bg-slate-700/30 rounded-lg p-4 overflow-x-auto">
                  <div className="flex items-center space-x-2 min-w-max">
                    {learningStages.map((stage, idx) => {
                      const stageStartTime = learningStages.slice(0, idx).reduce((sum, s) => sum + s.duration, 0);
                      const width = (stage.duration / totalDuration) * 100;
                      const isActive = idx === currentStage;
                      const isCompleted = timeElapsed >= stageStartTime + stage.duration;
                      
                      return (
                        <div
                          key={stage.id}
                          className={`relative rounded transition-all duration-300 ${
                            isActive ? `bg-${stage.color}-500/40 border border-${stage.color}-500` :
                            isCompleted ? 'bg-green-500/40 border border-green-500' :
                            'bg-slate-600/40 border border-slate-600'
                          }`}
                          style={{ width: `${width}%`, minWidth: '60px', height: '40px' }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-white truncate px-1">
                              {stage.title}
                            </span>
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-400">
                            {stage.duration}m
                          </div>
                          
                          {/* Progress indicator */}
                          {isActive && (
                            <div 
                              className="absolute bottom-0 left-0 h-1 bg-cyan-400 rounded-b transition-all duration-500"
                              style={{ 
                                width: `${Math.min(100, Math.max(0, ((timeElapsed - stageStartTime) / stage.duration) * 100))}%` 
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Current time indicator */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 transition-all duration-500"
                    style={{ left: `${(timeElapsed / totalDuration) * 100}%` }}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => setTimeElapsed(15)}
            variant="outline"
            className="border-blue-600 text-blue-400"
          >
            Jump to Stage 3
          </Button>
          
          <Button
            onClick={() => setTimeElapsed(35)}
            variant="outline"
            className="border-purple-600 text-purple-400"
          >
            Jump to Stage 5
          </Button>
          
          <Button
            onClick={() => setTimeElapsed(50)}
            variant="outline"
            className="border-red-600 text-red-400"
          >
            Jump to Final Quiz
          </Button>
          
          <Button
            onClick={() => {
              setTimeElapsed(totalDuration);
              setCurrentStage(learningStages.length - 1);
            }}
            variant="outline"
            className="border-green-600 text-green-400"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Complete Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SA_FlowPacing;