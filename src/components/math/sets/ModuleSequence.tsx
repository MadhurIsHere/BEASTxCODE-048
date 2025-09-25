import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Play, RotateCcw, BookOpen, Save, Volume2, VolumeX, Trophy, Lock, Eye, Target } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { toast } from 'sonner@2.0.3';
import type { Language } from '../../../types/onboarding';

interface ModuleSequenceProps {
  language: Language;
  onBack: () => void;
  onSelectModule: (moduleId: string, action?: 'play' | 'replay' | 'practice' | 'summary') => void;
  onLanguageChange: (language: Language) => void;
}

type NodeStatus = 'locked' | 'unlocked' | 'completed';

interface ModuleNode {
  id: string;
  name: {
    en: string;
    hi: string;
    or: string;
  };
  description: {
    en: string;
    hi: string;
    or: string;
  };
  icon: React.ReactNode;
  status: NodeStatus;
  timeSpent: number; // in seconds
  position: { x: number; y: number };
  color: string;
  glowColor: string;
  prerequisite?: string;
}

interface ProgressState {
  moduleId: string;
  nodes: Array<{
    id: string;
    status: NodeStatus;
    timeSpent: number;
  }>;
  lastSaved: string;
  totalProgress: number;
}

const translations = {
  title: {
    en: 'Sets Learning Path',
    hi: 'समुच्चय शिक्षण पथ',
    or: 'ସେଟ୍ ଶିକ୍ଷଣ ପଥ'
  },
  subtitle: {
    en: 'Follow the path to master Sets theory',
    hi: 'समुच्चय सिद्धांत में महारत के लिए पथ का पालन करें',
    or: 'ସେଟ୍ ସିଦ୍ଧାନ୍ତରେ ଦକ୍ଷତା ପାଇଁ ପଥ ଅନୁସରଣ କରନ୍ତୁ'
  },
  play: {
    en: 'Play',
    hi: 'खेलें',
    or: 'ଖେଳନ୍ତୁ'
  },
  replay: {
    en: 'Replay',
    hi: 'पुनः खेलें',
    or: 'ପୁଣି ଖେଳନ୍ତୁ'
  },
  practice: {
    en: 'Practice',
    hi: 'अभ्यास',
    or: 'ଅଭ୍ୟାସ'
  },
  summary: {
    en: 'Summary',
    hi: 'सारांश',
    or: 'ସାରାଂଶ'
  },
  saveProgress: {
    en: 'Save Progress',
    hi: 'प्रगति सहेजें',
    or: 'ପ୍ରଗତି ସେଭ୍ କରନ୍ତୁ'
  },
  saved: {
    en: 'Progress Saved!',
    hi: 'प्रगति सहेजी गई!',
    or: 'ପ୍ରଗତି ସେଭ୍ ହୋଇଛି!'
  },
  locked: {
    en: 'Locked',
    hi: 'बंद',
    or: 'ତାଲାବଦ୍ଧ'
  },
  unlocked: {
    en: 'Unlocked',
    hi: 'खुला',
    or: 'ଖୋଲା'
  },
  completed: {
    en: 'Completed',
    hi: 'पूर्ण',
    or: 'ସମ୍ପୂର୍ଣ୍ଣ'
  },
  completeToUnlock: {
    en: 'Complete previous module to unlock',
    hi: 'अनलॉक करने के लिए पिछला मॉड्यूल पूरा करें',
    or: 'ଅନଲକ୍ କରିବାକୁ ପୂର୍ବ ମଡ୍ୟୁଲ୍ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ'
  },
  timeSpent: {
    en: 'Time spent: {time}',
    hi: 'व्यतीत समय: {time}',
    or: 'ସମୟ ବିତାଇଛନ୍ତି: {time}'
  },
  progress: {
    en: 'Progress: {progress}%',
    hi: 'प्रगति: {progress}%',
    or: 'ପ୍ରଗତି: {progress}%'
  },
  audioToggle: {
    en: 'Toggle Audio',
    hi: 'ऑडियो टॉगल करें',
    or: 'ଅଡିଓ ଟୋଗଲ୍ କରନ୍ତୁ'
  }
};

// Sample progress state
const initialProgressState: ProgressState = {
  moduleId: "sets_v1",
  nodes: [
    { id: "what-is-set", status: "completed", timeSpent: 300 },
    { id: "types-of-sets", status: "completed", timeSpent: 420 },
    { id: "subsets-intervals", status: "unlocked", timeSpent: 150 },
    { id: "set-operations", status: "locked", timeSpent: 0 },
    { id: "venn-diagrams", status: "locked", timeSpent: 0 },
    { id: "real-world-problems", status: "locked", timeSpent: 0 },
    { id: "advanced-concepts", status: "locked", timeSpent: 0 }
  ],
  lastSaved: "2025-01-27T10:30:00Z",
  totalProgress: 28.5
};

export function ModuleSequence({ language, onBack, onSelectModule, onLanguageChange }: ModuleSequenceProps) {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<ProgressState>(initialProgressState);
  const svgRef = useRef<SVGSVGElement>(null);

  const t = translations;

  // Define the 7 learning modules
  const moduleNodes: ModuleNode[] = [
    {
      id: 'what-is-set',
      name: {
        en: 'What is a Set?',
        hi: 'समुच्चय क्या है?',
        or: 'ସେଟ୍ କଣ?'
      },
      description: {
        en: 'Learn the fundamental definition',
        hi: 'मौलिक परिभाषा सीखें',
        or: 'ମୂଳଭୂତ ପରିଭାଷା ଶିଖନ୍ତୁ'
      },
      icon: <BookOpen className="w-6 h-6" />,
      status: progressState.nodes.find(n => n.id === 'what-is-set')?.status || 'unlocked',
      timeSpent: progressState.nodes.find(n => n.id === 'what-is-set')?.timeSpent || 0,
      position: { x: 100, y: 350 },
      color: '#3b82f6',
      glowColor: '#60a5fa'
    },
    {
      id: 'types-of-sets',
      name: {
        en: 'Types of Sets',
        hi: 'समुच्चय के प्रकार',
        or: 'ସେଟ୍ ର ପ୍ରକାର'
      },
      description: {
        en: 'Finite, infinite, and empty sets',
        hi: 'परिमित, अनंत और रिक्त समुच्चय',
        or: 'ସୀମିତ, ଅସୀମ ଏବଂ ଖାଲି ସେଟ୍'
      },
      icon: <Target className="w-6 h-6" />,
      status: progressState.nodes.find(n => n.id === 'types-of-sets')?.status || 'locked',
      timeSpent: progressState.nodes.find(n => n.id === 'types-of-sets')?.timeSpent || 0,
      position: { x: 250, y: 280 },
      color: '#10b981',
      glowColor: '#34d399',
      prerequisite: 'what-is-set'
    },
    {
      id: 'subsets-intervals',
      name: {
        en: 'Subsets & Intervals',
        hi: 'उप-समुच्चय और अंतराल',
        or: 'ସବ୍‌ସେଟ୍ ଏବଂ ଇଣ୍ଟରଭାଲ୍'
      },
      description: {
        en: 'Subset relationships',
        hi: 'उप-समुच्चय संबंध',
        or: 'ସବ୍‌ସେଟ୍ ସମ୍ପର୍କ'
      },
      icon: <div className="w-6 h-6 flex items-center justify-center">⊆</div>,
      status: progressState.nodes.find(n => n.id === 'subsets-intervals')?.status || 'locked',
      timeSpent: progressState.nodes.find(n => n.id === 'subsets-intervals')?.timeSpent || 0,
      position: { x: 420, y: 200 },
      color: '#8b5cf6',
      glowColor: '#a78bfa',
      prerequisite: 'types-of-sets'
    },
    {
      id: 'set-operations',
      name: {
        en: 'Set Operations',
        hi: 'समुच्चय संक्रियाएं',
        or: 'ସେଟ୍ ଅପରେସନ୍'
      },
      description: {
        en: 'Union, intersection, complement',
        hi: 'संघ, प्रतिच्छेदन, पूरक',
        or: 'ୟୁନିଅନ୍, ଇଣ୍ଟରସେକ୍ସନ୍, କମ୍ପ୍ଲିମେଣ୍ଟ'
      },
      icon: <div className="w-6 h-6 flex items-center justify-center">∪</div>,
      status: progressState.nodes.find(n => n.id === 'set-operations')?.status || 'locked',
      timeSpent: progressState.nodes.find(n => n.id === 'set-operations')?.timeSpent || 0,
      position: { x: 580, y: 150 },
      color: '#f59e0b',
      glowColor: '#fbbf24',
      prerequisite: 'subsets-intervals'
    },
    {
      id: 'venn-diagrams',
      name: {
        en: 'Venn Diagrams',
        hi: 'वेन आरेख',
        or: 'ଭେନ୍ ଚିତ୍ର'
      },
      description: {
        en: 'Visual problem solving',
        hi: 'दृश्य समस्या समाधान',
        or: 'ଦୃଶ୍ୟ ସମସ୍ୟା ସମାଧାନ'
      },
      icon: <div className="w-6 h-6 rounded-full border-2 border-current"></div>,
      status: progressState.nodes.find(n => n.id === 'venn-diagrams')?.status || 'locked',
      timeSpent: progressState.nodes.find(n => n.id === 'venn-diagrams')?.timeSpent || 0,
      position: { x: 720, y: 250 },
      color: '#8b5cf6',
      glowColor: '#a78bfa',
      prerequisite: 'set-operations'
    },
    {
      id: 'real-world-problems',
      name: {
        en: 'Real-World Apps',
        hi: 'वास्तविक अनुप्रयोग',
        or: 'ବାସ୍ତବ ପ୍ରୟୋଗ'
      },
      description: {
        en: 'Apply to real problems',
        hi: 'वास्तविक समस्याओं में लागू करें',
        or: 'ବାସ୍ତବ ସମସ୍ୟାରେ ପ୍ରୟୋଗ କରନ୍ତୁ'
      },
      icon: <div className="w-6 h-6 flex items-center justify-center">🌍</div>,
      status: progressState.nodes.find(n => n.id === 'real-world-problems')?.status || 'locked',
      timeSpent: progressState.nodes.find(n => n.id === 'real-world-problems')?.timeSpent || 0,
      position: { x: 580, y: 350 },
      color: '#ec4899',
      glowColor: '#f472b6',
      prerequisite: 'venn-diagrams'
    },
    {
      id: 'advanced-concepts',
      name: {
        en: 'Advanced Topics',
        hi: 'उन्नत विषय',
        or: 'ଉନ୍ନତ ବିଷୟ'
      },
      description: {
        en: 'Power sets, Cartesian products',
        hi: 'शक्ति समुच्चय, कार्तीय गुणन',
        or: 'ପାୱାର୍ ସେଟ୍, କାର୍ଟେସିଆନ୍ ପ୍ରଡକ୍ଟ'
      },
      icon: <Trophy className="w-6 h-6" />,
      status: progressState.nodes.find(n => n.id === 'advanced-concepts')?.status || 'locked',
      timeSpent: progressState.nodes.find(n => n.id === 'advanced-concepts')?.timeSpent || 0,
      position: { x: 420, y: 400 },
      color: '#6366f1',
      glowColor: '#818cf8',
      prerequisite: 'real-world-problems'
    }
  ];

  // Format time helper
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Get path data for connecting nodes
  const getPathData = (): string => {
    const points = moduleNodes.map(node => `${node.position.x},${node.position.y}`);
    return `M ${points.join(' L ')}`;
  };

  // Handle save progress
  const handleSaveProgress = async () => {
    setIsSaving(true);
    
    // Simulate save animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update last saved timestamp
    const updatedProgress = {
      ...progressState,
      lastSaved: new Date().toISOString(),
      totalProgress: (moduleNodes.filter(n => n.status === 'completed').length / moduleNodes.length) * 100
    };
    
    setProgressState(updatedProgress);
    
    // Store in localStorage (in real app would be sent to backend)
    localStorage.setItem('sets_progress', JSON.stringify(updatedProgress));
    
    setIsSaving(false);
    toast.success(t.saved[language]);
  };

  // Handle node click
  const handleNodeClick = (node: ModuleNode, action?: 'play' | 'replay' | 'practice' | 'summary') => {
    if (node.status === 'locked') {
      toast.error(t.completeToUnlock[language]);
      return;
    }
    
    onSelectModule(node.id, action);
  };

  // Calculate shard fill percentage based on status
  const getShardFillPercentage = (node: ModuleNode): number => {
    switch (node.status) {
      case 'completed': return 100;
      case 'unlocked': return Math.min((node.timeSpent / 300) * 100, 85); // Max 85% until completed
      case 'locked': return 0;
      default: return 0;
    }
  };

  // SVG path animation
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const path = svg.querySelector('.learning-path') as SVGPathElement;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    
    // Animate path reveal
    const animatePath = () => {
      path.style.transition = 'stroke-dashoffset 2s ease-out';
      path.style.strokeDashoffset = '0';
    };

    const timer = setTimeout(animatePath, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        {/* Header */}
        <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 p-4 sa-hud sa-hud-enter">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-cyan-300">{t.title[language]}</h1>
              <p className="text-sm text-slate-400">{t.subtitle[language]}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSaveProgress}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 sa-button-primary"
              >
                <Save className={`h-4 w-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                {t.saveProgress[language]}
              </Button>
              
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

        {/* Progress Overview */}
        <div className="bg-slate-800/50 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">
                {t.progress[language].replace('{progress}', Math.round(progressState.totalProgress).toString())}
              </span>
              <span className="text-sm text-slate-300">
                {moduleNodes.filter(n => n.status === 'completed').length} / {moduleNodes.length} modules complete
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 sa-energy-active"
                style={{ width: `${progressState.totalProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Learning Path */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              {/* SVG Learning Path */}
              <svg 
                ref={svgRef}
                className="absolute inset-0 w-full h-full pointer-events-none" 
                viewBox="0 0 820 500"
                style={{ zIndex: 1 }}
              >
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#06b6d4', stopOpacity: 0.8}} />
                    <stop offset="25%" style={{stopColor: '#3b82f6', stopOpacity: 0.8}} />
                    <stop offset="50%" style={{stopColor: '#8b5cf6', stopOpacity: 0.8}} />
                    <stop offset="75%" style={{stopColor: '#ec4899', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: '#6366f1', stopOpacity: 0.8}} />
                  </linearGradient>
                  
                  <filter id="pathGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>

                  {/* Animated flowing particles along path */}
                  <circle id="particle" r="2" fill="#06b6d4" opacity="0.8">
                    <animateMotion dur="3s" repeatCount="indefinite">
                      <mpath href="#learningPath"/>
                    </animateMotion>
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite"/>
                  </circle>
                </defs>

                {/* Main learning path */}
                <path
                  id="learningPath"
                  d={getPathData()}
                  stroke="url(#pathGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="8,4"
                  filter="url(#pathGlow)"
                  className="learning-path"
                />

                {/* Animated particle */}
                <use href="#particle" />
                <use href="#particle">
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0;10,0;0,0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </use>
              </svg>

              {/* Module Nodes */}
              <div className="relative" style={{ height: '500px', zIndex: 2 }}>
                {moduleNodes.map((node, index) => {
                  const isHovered = hoveredNode === node.id;
                  const fillPercentage = getShardFillPercentage(node);
                  const isPreviewable = node.status === 'locked' && node.prerequisite && 
                    moduleNodes.find(n => n.id === node.prerequisite)?.status === 'completed';

                  return (
                    <div
                      key={node.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ 
                        left: node.position.x, 
                        top: node.position.y,
                        zIndex: isHovered ? 10 : 5
                      }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Node Circle with Shard Fill */}
                      <div className="relative">
                        <svg width="80" height="80" className="absolute inset-0">
                          <defs>
                            <mask id={`shardMask-${node.id}`}>
                              <rect width="80" height="80" fill="black"/>
                              <circle cx="40" cy="40" r="35" fill="white"/>
                            </mask>
                            
                            <linearGradient id={`shardGradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" style={{stopColor: node.color, stopOpacity: 1}} />
                              <stop offset="100%" style={{stopColor: node.glowColor, stopOpacity: 0.8}} />
                            </linearGradient>
                          </defs>

                          {/* Background circle */}
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="35" 
                            fill="rgba(30, 41, 59, 0.8)"
                            stroke={node.status === 'locked' ? '#64748b' : node.color}
                            strokeWidth="3"
                            className={`transition-all duration-300 ${
                              node.status === 'locked' ? 'opacity-50' : ''
                            }`}
                          />

                          {/* Animated shard fill */}
                          {node.status !== 'locked' && (
                            <circle 
                              cx="40" 
                              cy="40" 
                              r="35" 
                              fill={`url(#shardGradient-${node.id})`}
                              fillOpacity="0.6"
                              mask={`url(#shardMask-${node.id})`}
                              strokeDasharray="220"
                              strokeDashoffset={220 - (fillPercentage / 100) * 220}
                              stroke={node.color}
                              strokeWidth="6"
                              transform="rotate(-90 40 40)"
                              className="transition-all duration-1000 ease-out"
                              style={{
                                filter: node.status === 'completed' ? `drop-shadow(0 0 20px ${node.color})` : 'none'
                              }}
                            />
                          )}

                          {/* Pulsing glow for active nodes */}
                          {(node.status === 'unlocked' || isHovered) && (
                            <circle 
                              cx="40" 
                              cy="40" 
                              r="38" 
                              fill="none"
                              stroke={node.color}
                              strokeWidth="2"
                              opacity="0.4"
                              className="animate-ping"
                            />
                          )}
                        </svg>

                        {/* Node Content */}
                        <div 
                          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                            node.status === 'locked' 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:scale-110 hover:brightness-110'
                          }`}
                          onClick={() => handleNodeClick(node, 'play')}
                        >
                          {node.status === 'locked' ? (
                            <Lock className="w-8 h-8 text-slate-400" />
                          ) : node.status === 'completed' ? (
                            <div className="w-8 h-8 text-green-300 animate-pulse">✓</div>
                          ) : (
                            <div className="text-white" style={{ color: node.color }}>
                              {node.icon}
                            </div>
                          )}
                        </div>

                        {/* Status badge */}
                        <div className="absolute -top-2 -right-2">
                          <Badge 
                            className={`text-xs px-2 py-1 ${
                              node.status === 'completed' 
                                ? 'bg-green-500/20 text-green-300 border-green-400'
                                : node.status === 'unlocked'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-400'
                                : 'bg-slate-500/20 text-slate-400 border-slate-500'
                            }`}
                          >
                            {node.status === 'completed' && '✓'}
                            {node.status === 'unlocked' && '▶'}
                            {node.status === 'locked' && '🔒'}
                          </Badge>
                        </div>
                      </div>

                      {/* Node Info Card */}
                      <Card 
                        className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 transition-all duration-300 ${
                          isHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                        } bg-slate-800/95 border-slate-600 backdrop-blur-sm`}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-center" style={{ color: node.color }}>
                            {node.name[language]}
                          </CardTitle>
                          <p className="text-sm text-slate-300 text-center">
                            {node.description[language]}
                          </p>
                        </CardHeader>
                        <CardContent>
                          {/* Progress and time info */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                              <span>{t.progress[language].replace('{progress}', fillPercentage.toFixed(0))}</span>
                              <span>{t.timeSpent[language].replace('{time}', formatTime(node.timeSpent))}</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${fillPercentage}%`,
                                  background: `linear-gradient(90deg, ${node.color}, ${node.glowColor})`
                                }}
                              />
                            </div>
                          </div>

                          {/* Action buttons */}
                          {node.status !== 'locked' ? (
                            <div className="grid grid-cols-2 gap-2">
                              {node.status === 'unlocked' && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNodeClick(node, 'play');
                                  }}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-xs"
                                >
                                  <Play className="w-3 h-3 mr-1" />
                                  {t.play[language]}
                                </Button>
                              )}
                              
                              {node.status === 'completed' && (
                                <>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNodeClick(node, 'replay');
                                    }}
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-700 text-xs"
                                  >
                                    <RotateCcw className="w-3 h-3 mr-1" />
                                    {t.replay[language]}
                                  </Button>
                                  
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNodeClick(node, 'practice');
                                    }}
                                    size="sm"
                                    className="bg-orange-600 hover:bg-orange-700 text-xs"
                                  >
                                    <Target className="w-3 h-3 mr-1" />
                                    {t.practice[language]}
                                  </Button>
                                  
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNodeClick(node, 'summary');
                                    }}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-xs col-span-2"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    {t.summary[language]}
                                  </Button>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="text-center">
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="inline-flex items-center text-slate-500 text-xs">
                                    <Lock className="w-3 h-3 mr-1" />
                                    {t.locked[language]}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm">{t.completeToUnlock[language]}</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              {/* Preview mode for next unlockable node */}
                              {isPreviewable && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.info(t.completeToUnlock[language]);
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="mt-2 border-slate-600 text-slate-400 hover:bg-slate-700"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  Preview
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Node Label */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <div 
                          className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                            node.status === 'completed'
                              ? 'bg-green-500/20 text-green-300 border border-green-400/50'
                              : node.status === 'unlocked'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
                              : 'bg-slate-500/20 text-slate-400 border border-slate-500/50'
                          }`}
                        >
                          {node.name[language]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend and Instructions */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {/* Legend */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg text-cyan-300">Legend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
                        <span className="text-green-300 text-xs">✓</span>
                      </div>
                      <span className="text-sm text-slate-300">{t.completed[language]}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center">
                        <span className="text-blue-300 text-xs">▶</span>
                      </div>
                      <span className="text-sm text-slate-300">{t.unlocked[language]}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-slate-500/20 border-2 border-slate-500 flex items-center justify-center">
                        <Lock className="w-3 h-3 text-slate-400" />
                      </div>
                      <span className="text-sm text-slate-300">{t.locked[language]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Instructions */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-300">How to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>• Hover over nodes to see details</p>
                    <p>• Click unlocked nodes to start lessons</p>
                    <p>• Complete modules in sequence to unlock the next</p>
                    <p>• Use action buttons for Replay, Practice, or Summary</p>
                    <p>• Save your progress regularly</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-300">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Modules Completed:</span>
                      <span className="text-green-300 font-semibold">
                        {moduleNodes.filter(n => n.status === 'completed').length} / {moduleNodes.length}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Total Time:</span>
                      <span className="text-blue-300 font-semibold">
                        {formatTime(moduleNodes.reduce((total, node) => total + node.timeSpent, 0))}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Last Saved:</span>
                      <span className="text-slate-400 text-xs">
                        {new Date(progressState.lastSaved).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Export sample progress state for reference
export const sampleProgressState: ProgressState = {
  moduleId: "sets_v1",
  nodes: [
    { id: "what-is-set", status: "completed", timeSpent: 300 },
    { id: "types-of-sets", status: "completed", timeSpent: 420 },
    { id: "subsets-intervals", status: "unlocked", timeSpent: 150 },
    { id: "set-operations", status: "locked", timeSpent: 0 },
    { id: "venn-diagrams", status: "locked", timeSpent: 0 },
    { id: "real-world-problems", status: "locked", timeSpent: 0 },
    { id: "advanced-concepts", status: "locked", timeSpent: 0 }
  ],
  lastSaved: "2025-01-27T10:30:00Z",
  totalProgress: 28.5
};