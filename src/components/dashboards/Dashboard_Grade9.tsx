import React, { useState, useMemo, useEffect } from 'react';
import { 
  Settings, 
  Wrench, 
  Cog, 
  Gauge,
  Lightbulb,
  Cpu,
  Database,
  Network,
  Clock,
  Star,
  Award,
  Trophy,
  Target,
  Zap,
  Eye,
  Home,
  User,
  LogOut,
  ChevronRight,
  Play,
  Lock,
  CheckCircle2,
  Beaker,
  FlaskConical,
  Calculator,
  Compass,
  Ruler,
  PenTool,
  Microscope,
  Atom,
  Dna,
  Flame,
  Droplets,
  Wind,
  Thermometer,
  Magnet,
  Battery,
  Volume2,
  Palette,
  ShieldCheck,
  Crown,
  Medal,
  Calendar,
  TrendingUp,
  BarChart3,
  BookOpen,
  School,
  GraduationCap,
  Globe,
  Gamepad2,
  MousePointer,
  Layers,
  RotateCcw,
  Maximize,
  Filter,
  Search,
  Bell,
  Mail,
  HelpCircle,
  Info
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import type { Language, UserProfile } from '../../types/onboarding';

interface Dashboard_Grade9Props {
  user: UserProfile;
  language: Language;
  onLogout: () => void;
  onNavigateToLesson?: (lessonId: string) => void;
}

export function Dashboard_Grade9({ user, language, onLogout, onNavigateToLesson }: Dashboard_Grade9Props) {
  const [activeTab, setActiveTab] = useState('workshop');
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [cogwheelFragments, setCogwheelFragments] = useState(1247);
  const [alchemicalEssence, setAlchemicalEssence] = useState(38);
  const [artisanLevel, setArtisanLevel] = useState(4);
  const [cityActivation, setCityActivation] = useState(23);

  // Background Images
  const clockworkWorkshop = "https://images.unsplash.com/photo-1682718619781-252f23e21132?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd29ya3Nob3AlMjBtYWhvZ2FueSUyMHdvb2R8ZW58MXx8fHwxNzU4NzI2NTAyfDA&ixlib=rb-4.1.0&q=80&w=1080";
  const steampunkGears = "https://images.unsplash.com/photo-1723988433056-b9f34d1dcb17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MXwxfHNlYXJjaHwxfHxzdGVhbXB1bmslMjBicmFzcyUyMGdlYXJzJTIwY2xvY2t3b3JrfGVufDF8fHx8MTc1ODcyNjQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080";
  const alchemicalLab = "https://images.unsplash.com/photo-1610000819616-7168539b2a3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGNoZW1pY2FsJTIwbGFib3JhdG9yeSUyMGJyYXNzJTIwY29wcGVyfGVufDF8fHx8MTc1ODcyNjQ5OHww&ixlib=rb-4.1.0&q=80&w=1080";

  // Artisan Tier System
  const artisanTiers = [
    { tier: 1, title: "Novice Apprentice", color: "from-amber-600 to-yellow-500", unlock: 0 },
    { tier: 2, title: "Skilled Artisan", color: "from-orange-600 to-amber-500", unlock: 500 },
    { tier: 3, title: "Master Craftsman", color: "from-red-600 to-orange-500", unlock: 1000 },
    { tier: 4, title: "Grand Mechanist", color: "from-purple-600 to-red-500", unlock: 2000 },
    { tier: 5, title: "Clockwork Sage", color: "from-blue-600 to-purple-500", unlock: 5000 }
  ];

  // Mathematics - The Architect's Guild
  const architectGuildModules = [
    {
      id: 'number-systems',
      name: language === 'en' ? 'The Rational Cogwheel' : language === 'hi' ? 'तर्कसंगत चक्र' : 'ତର୍କସଙ୍ଗତ ଚକ୍ର',
      subtitle: 'Number Systems & Rational Numbers',
      icon: Cog,
      progress: 75,
      difficulty: 'Intermediate',
      gameType: '3D Puzzle',
      description: 'Place rational and irrational number-gears onto a complex machine',
      color: 'from-amber-600 to-yellow-500',
      completed: true,
      unlocked: true
    },
    {
      id: 'polynomials',
      name: language === 'en' ? 'The Gear-Train Constructor' : language === 'hi' ? 'गियर-ट्रेन निर्माता' : 'ଗିଅର-ଟ୍ରେନ ନିର୍ମାତା',
      subtitle: 'Polynomials & Factorization',
      icon: Settings,
      progress: 60,
      difficulty: 'Advanced',
      gameType: 'Construction',
      description: 'Factor polynomials by breaking down complex gear systems',
      color: 'from-orange-600 to-amber-500',
      completed: false,
      unlocked: true
    },
    {
      id: 'coordinate-geometry',
      name: language === 'en' ? 'Automaton Pathfinding' : language === 'hi' ? 'ऑटोमेटन पाथफाइंडिंग' : 'ଅଟୋମେଟନ ପାଥଫାଇଣ୍ଡିଂ',
      subtitle: 'Coordinate Geometry',
      icon: Compass,
      progress: 45,
      difficulty: 'Intermediate',
      gameType: '3D Navigation',
      description: 'Plot paths for clockwork automaton on 3D city grid',
      color: 'from-red-600 to-orange-500',
      completed: false,
      unlocked: true
    },
    {
      id: 'linear-equations',
      name: language === 'en' ? 'Pressure Valve Calibration' : language === 'hi' ? 'दबाव वाल्व अंशांकन' : 'ଚାପ ଭାଲଭ କାଲିବ୍ରେସନ',
      subtitle: 'Linear Equations in Two Variables',
      icon: Gauge,
      progress: 30,
      difficulty: 'Advanced',
      gameType: 'Simulation',
      description: 'Balance steam pressure using linear equation controls',
      color: 'from-purple-600 to-red-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'euclid-geometry',
      name: language === 'en' ? 'The Logic Lockbox' : language === 'hi' ? 'तर्क बक्सा' : 'ତର୍କ ବାକ୍ସ',
      subtitle: 'Introduction to Euclid\'s Geometry',
      icon: Database,
      progress: 0,
      difficulty: 'Expert',
      gameType: 'Logic Puzzle',
      description: 'Unlock puzzle boxes using Euclidean axioms and postulates',
      color: 'from-blue-600 to-purple-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'lines-angles',
      name: language === 'en' ? 'The Reflector Array' : language === 'hi' ? 'परावर्तक सरणी' : 'ପ୍ରତିଫଳନ ସାରଣୀ',
      subtitle: 'Lines and Angles',
      icon: Eye,
      progress: 0,
      difficulty: 'Intermediate',
      gameType: 'Optical Puzzle',
      description: 'Direct light beams through mirrors using angle properties',
      color: 'from-teal-600 to-blue-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'triangles',
      name: language === 'en' ? 'The Truss Bridge Builder' : language === 'hi' ? 'ट्रस पुल निर्माता' : 'ଟ୍ରସ ବ୍ରିଜ ନିର୍ମାତା',
      subtitle: 'Triangles & Congruence',
      icon: Layers,
      progress: 0,
      difficulty: 'Advanced',
      gameType: 'Physics Construction',
      description: 'Build stable bridge trusses using triangle congruence principles',
      color: 'from-green-600 to-teal-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'quadrilaterals',
      name: language === 'en' ? 'The Clock Face Designer' : language === 'hi' ? 'घड़ी चेहरा डिजाइनर' : 'ଘଣ୍ଟା ମୁହଁ ଡିଜାଇନର',
      subtitle: 'Quadrilaterals',
      icon: Clock,
      progress: 0,
      difficulty: 'Intermediate',
      gameType: 'Design Challenge',
      description: 'Design moving clock faces using quadrilateral properties',
      color: 'from-lime-600 to-green-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'areas-triangles',
      name: language === 'en' ? 'The Aether-Sail Workshop' : language === 'hi' ? 'एथर-सेल कार्यशाला' : 'ଇଥର-ସେଲ କର୍ମଶାଳା',
      subtitle: 'Areas of Parallelograms & Triangles',
      icon: Wind,
      progress: 0,
      difficulty: 'Advanced',
      gameType: 'Design Optimization',
      description: 'Design efficient airship sails using area formulas',
      color: 'from-sky-600 to-lime-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'circles',
      name: language === 'en' ? 'The Grand Orrery Calibration' : language === 'hi' ? 'महान ऑर्री अंशांकन' : 'ମହାନ ଅର୍ରି କାଲିବ୍ରେସନ',
      subtitle: 'Circles',
      icon: Globe,
      progress: 0,
      difficulty: 'Expert',
      gameType: 'Precision Puzzle',
      description: 'Align planetary gears using circle properties',
      color: 'from-indigo-600 to-sky-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'constructions',
      name: language === 'en' ? 'The Master Draftsman' : language === 'hi' ? 'मास्टर ड्राफ्ट्समैन' : 'ମାଷ୍ଟର ଡ୍ରାଫ୍ଟସମ୍ୟାନ',
      subtitle: 'Constructions',
      icon: PenTool,
      progress: 0,
      difficulty: 'Expert',
      gameType: 'Precision Drawing',
      description: 'Draw complex patterns using steampunk drafting tools',
      color: 'from-violet-600 to-indigo-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'herons-formula',
      name: language === 'en' ? 'The Automaton\'s Armor' : language === 'hi' ? 'ऑटोमेटन का कवच' : 'ଅଟୋମେଟନର କବଚ',
      subtitle: 'Heron\'s Formula',
      icon: ShieldCheck,
      progress: 0,
      difficulty: 'Advanced',
      gameType: '3D Design',
      description: 'Design custom armor plates using Heron\'s formula',
      color: 'from-fuchsia-600 to-violet-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'surface-volumes',
      name: language === 'en' ? 'The Alchemical Vat Designer' : language === 'hi' ? 'रसायनिक वैट डिजाइनर' : 'ରସାୟନିକ ଦ୍ରବ୍ୟ ଡିଜାଇନର',
      subtitle: 'Surface Areas & Volumes',
      icon: Beaker,
      progress: 0,
      difficulty: 'Expert',
      gameType: '3D Design Challenge',
      description: 'Design storage vats calculating surface area and volume',
      color: 'from-pink-600 to-fuchsia-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'statistics',
      name: language === 'en' ? 'The City\'s Census Automaton' : language === 'hi' ? 'शहर की जनगणना ऑटोमेटन' : 'ସହରର ଜନଗଣନା ଅଟୋମେଟନ',
      subtitle: 'Statistics',
      icon: BarChart3,
      progress: 0,
      difficulty: 'Intermediate',
      gameType: 'Data Analysis',
      description: 'Analyze city production data to identify inefficiencies',
      color: 'from-rose-600 to-pink-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'probability',
      name: language === 'en' ? 'The Game of Cogs' : language === 'hi' ? 'कॉग्स का खेल' : 'କଗସ ଖେଳ',
      subtitle: 'Probability',
      icon: Gamepad2,
      progress: 0,
      difficulty: 'Advanced',
      gameType: 'Strategy Board Game',
      description: 'Strategic board game using probability calculations',
      color: 'from-red-600 to-rose-500',
      completed: false,
      unlocked: false
    }
  ];

  // Science - The Alchemist's Spire
  const alchemistSpireModules = [
    {
      id: 'motion-forces',
      name: language === 'en' ? 'Automaton Grand Prix' : language === 'hi' ? 'ऑटोमेटन ग्रां प्री' : 'ଅଟୋମେଟନ ଗ୍ରାଣ୍ଡ ପ୍ରି',
      subtitle: 'Motion & Force Laws',
      icon: Cpu,
      progress: 80,
      difficulty: 'Advanced',
      gameType: 'Physics Racing',
      description: 'Build and race clockwork automatons using motion principles',
      color: 'from-blue-600 to-cyan-500',
      completed: true,
      unlocked: true
    },
    {
      id: 'gravitation',
      name: language === 'en' ? 'The Levitating Crystal' : language === 'hi' ? 'उत्तोलन क्रिस्टल' : 'ଉତ୍ତୋଳନ କ୍ରିଷ୍ଟାଲ',
      subtitle: 'Gravitation',
      icon: Magnet,
      progress: 65,
      difficulty: 'Expert',
      gameType: 'Physics Experiment',
      description: 'Counteract gravity using steampunk magnets and propellers',
      color: 'from-purple-600 to-blue-500',
      completed: false,
      unlocked: true
    },
    {
      id: 'work-energy-sound',
      name: language === 'en' ? 'The Sonic Resonator' : language === 'hi' ? 'ध्वनि गुंजक' : 'ଧ୍ୱନି ଗର୍ଜନକାରୀ',
      subtitle: 'Work, Energy & Sound',
      icon: Volume2,
      progress: 50,
      difficulty: 'Advanced',
      gameType: 'Wave Puzzle',
      description: 'Power machines using sound wave resonance',
      color: 'from-green-600 to-purple-500',
      completed: false,
      unlocked: true
    },
    {
      id: 'matter-states',
      name: language === 'en' ? 'The Aether Distiller' : language === 'hi' ? 'एथर आसवनी' : 'ଇଥର ଆସବନୀ',
      subtitle: 'Matter in Our Surroundings',
      icon: Droplets,
      progress: 40,
      difficulty: 'Intermediate',
      gameType: 'Lab Simulation',
      description: 'Separate mixtures using multi-stage distillation apparatus',
      color: 'from-teal-600 to-green-500',
      completed: false,
      unlocked: true
    },
    {
      id: 'pure-matter',
      name: language === 'en' ? 'The Purity Analyzer' : language === 'hi' ? 'शुद्धता विश्लेषक' : 'ଶୁଦ୍ଧତା ବିଶ୍ଳେଷକ',
      subtitle: 'Is Matter Around Us Pure?',
      icon: FlaskConical,
      progress: 30,
      difficulty: 'Advanced',
      gameType: 'Analysis Challenge',
      description: 'Identify and separate pure substances from mixtures',
      color: 'from-lime-600 to-teal-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'atoms-molecules',
      name: language === 'en' ? 'The Atomic Forge' : language === 'hi' ? 'परमाणु फोर्ज' : 'ପରମାଣୁ ଫୋର୍ଜ',
      subtitle: 'Atoms & Molecules',
      icon: Atom,
      progress: 0,
      difficulty: 'Expert',
      gameType: '3D Interactive',
      description: 'Forge new materials by manipulating atomic structures',
      color: 'from-sky-600 to-lime-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'atomic-structure',
      name: language === 'en' ? 'The Subatomic Workshop' : language === 'hi' ? 'उप-परमाणु कार्यशाला' : 'ଉପ-ପରମାଣୁ କର୍ମଶାଳା',
      subtitle: 'Structure of the Atom',
      icon: Target,
      progress: 0,
      difficulty: 'Expert',
      gameType: 'Precision Assembly',
      description: 'Assemble atoms using protons, neutrons, and electrons',
      color: 'from-indigo-600 to-sky-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'cell-structure',
      name: language === 'en' ? 'The Micro-Mechanist' : language === 'hi' ? 'सूक्ष्म-यंत्री' : 'ସୂକ୍ଷ୍ମ-ଯନ୍ତ୍ରୀ',
      subtitle: 'Fundamental Unit of Life',
      icon: Microscope,
      progress: 0,
      difficulty: 'Advanced',
      gameType: 'Microscopic Exploration',
      description: 'Pilot submersible through biological clockwork mechanisms',
      color: 'from-violet-600 to-indigo-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'tissues',
      name: language === 'en' ? 'The Living Gear Assembly' : language === 'hi' ? 'जीवित गियर असेंबली' : 'ଜୀବନ୍ତ ଗିଅର ଆସେମ୍ବଲି',
      subtitle: 'Tissues',
      icon: Network,
      progress: 0,
      difficulty: 'Advanced',
      gameType: 'Assembly Challenge',
      description: 'Assemble cell-gears into functional tissue mechanisms',
      color: 'from-fuchsia-600 to-violet-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'diversity-organisms',
      name: language === 'en' ? 'The Specimen Archive' : language === 'hi' ? 'नमूना संग्रह' : 'ନମୁନା ସଂଗ୍ରହ',
      subtitle: 'Diversity in Living Organisms',
      icon: Database,
      progress: 0,
      difficulty: 'Intermediate',
      gameType: 'Classification Game',
      description: 'Classify mechanical and organic creatures in Victorian archive',
      color: 'from-pink-600 to-fuchsia-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'health-disease',
      name: language === 'en' ? 'The Alchemical Cure' : language === 'hi' ? 'रसायनिक इलाज' : 'ରସାୟନିକ ଚିକିତ୍ସା',
      subtitle: 'Why Do We Fall Ill?',
      icon: Flame,
      progress: 0,
      difficulty: 'Advanced',
      gameType: 'Strategy Game',
      description: 'Brew alchemical potions to neutralize micro-bot pathogens',
      color: 'from-rose-600 to-pink-500',
      completed: false,
      unlocked: false
    },
    {
      id: 'natural-resources',
      name: language === 'en' ? 'The Biodome Cultivator' : language === 'hi' ? 'बायोडोम कृषक' : 'ବାୟୋଡୋମ କୃଷିକାରୀ',
      subtitle: 'Natural Resources',
      icon: Globe,
      progress: 0,
      difficulty: 'Expert',
      gameType: 'Ecosystem Management',
      description: 'Manage greenhouse dome using biogeochemical cycles',
      color: 'from-red-600 to-rose-500',
      completed: false,
      unlocked: false
    }
  ];

  const currentTier = artisanTiers.find(tier => 
    cogwheelFragments >= tier.unlock && 
    (artisanTiers[tier.tier] ? cogwheelFragments < artisanTiers[tier.tier].unlock : true)
  ) || artisanTiers[0];

  const nextTier = artisanTiers.find(tier => cogwheelFragments < tier.unlock);

  const welcomeMessage = useMemo(() => {
    return language === 'en' ? `Artisan-Apprentice ${user.name}` : 
           language === 'hi' ? `शिल्पकार-शिष्य ${user.name}` : 
           `ଶିଳ୍ପୀ-ଶିଷ୍ୟ ${user.name}`;
  }, [language, user.name]);

  const handleGameNavigation = (gameId: string, guildType: 'architect' | 'alchemist') => {
    // Navigate to specific game modules
    onNavigateToLesson?.(gameId);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Steampunk Background */}
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `url(${clockworkWorkshop})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Brass Overlay Pattern */}
      <div className="fixed inset-0 opacity-30 brass-overlay" />
      
      {/* Floating Gears */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute brass-gear animate-clockwork-spin"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              fontSize: `${1 + Math.random() * 2}rem`
            }}
          >
            ⚙
          </div>
        ))}
      </div>

      {/* Steam Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute steam-wisp animate-steam-rise"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: `${Math.random() * 30}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {/* Main Workshop Interface */}
      <div className="relative z-10 min-h-screen">
        {/* Ornate Header */}
        <header className="brass-frame border-b-4 border-amber-800/50 bg-gradient-to-r from-amber-100/95 via-orange-100/95 to-red-100/95 backdrop-blur-lg">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Artisan Profile */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 brass-frame bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg animate-gear-turn">
                    <Wrench className="h-8 w-8 text-amber-100" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-amber-200 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-amber-900 copper-text-shadow">
                    {welcomeMessage}
                  </h1>
                  <p className="text-amber-700">
                    {currentTier.title} • {language === 'en' ? 'City Activation' : language === 'hi' ? 'शहर सक्रियण' : 'ସହର ସକ୍ରିୟକରଣ'} {cityActivation}%
                  </p>
                </div>
              </div>

              {/* Resource Gauges */}
              <div className="flex items-center space-x-4">
                <div className="brass-gauge flex items-center space-x-2 bg-gradient-to-r from-amber-200/80 to-yellow-200/80 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-amber-600/40">
                  <Cog className="h-5 w-5 text-amber-700 animate-clockwork-spin" />
                  <span className="text-amber-800 font-bold">{cogwheelFragments} CF</span>
                </div>
                <div className="brass-gauge flex items-center space-x-2 bg-gradient-to-r from-purple-200/80 to-violet-200/80 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-purple-600/40">
                  <FlaskConical className="h-5 w-5 text-purple-700 animate-alchemical-bubble" />
                  <span className="text-purple-800 font-bold">{alchemicalEssence} AE</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLogout}
                  className="brass-button border-red-400/60 text-red-700 hover:bg-red-100/80 shadow-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Leave Workshop' : language === 'hi' ? 'कार्यशाला छोड़ें' : 'କର୍ମଶାଳା ଛାଡ଼ନ୍ତୁ'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Ornate Tab Navigation */}
            <div className="brass-frame bg-gradient-to-r from-amber-100/90 to-orange-100/90 backdrop-blur-md rounded-2xl p-3 border-4 border-amber-700/30">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { value: 'workshop', icon: Home, label: language === 'en' ? 'Artisan\'s Workshop' : language === 'hi' ? 'शिल्पकार की कार्यशाला' : 'ଶିଳ୍ପୀର କର୍ମଶାଳା' },
                  { value: 'orrery', icon: Globe, label: language === 'en' ? 'Celestial Orrery' : language === 'hi' ? 'खगोलीय ऑर्री' : 'ଖଗୋଳିକ ଅର୍ରି' },
                  { value: 'guilds', icon: School, label: language === 'en' ? 'Guild Halls' : language === 'hi' ? 'गिल्ड हॉल' : 'ଗିଲ୍ଡ ହଲ' },
                  { value: 'progress', icon: Trophy, label: language === 'en' ? 'Schematics Board' : language === 'hi' ? 'योजना बोर्ड' : 'ଯୋଜନା ବୋର୍ଡ' }
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`brass-button flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.value
                        ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg transform scale-105 animate-gear-glow'
                        : 'bg-transparent text-amber-800 hover:bg-amber-200/50 hover:scale-102'
                    }`}
                  >
                    <tab.icon className={`h-5 w-5 ${activeTab === tab.value ? 'text-white animate-clockwork-spin' : 'text-amber-700'}`} />
                    <span className="font-medium hidden lg:block">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Artisan's Workshop Tab */}
            <TabsContent value="workshop">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Central Orrery Preview */}
                <div className="xl:col-span-2">
                  <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30 overflow-hidden">
                    <CardHeader className="border-b-2 border-amber-600/30 bg-gradient-to-r from-amber-100/80 to-orange-100/80">
                      <CardTitle className="flex items-center text-amber-900 copper-text-shadow">
                        <Globe className="h-6 w-6 mr-3 animate-clockwork-spin" />
                        {language === 'en' ? 'The Celestial Orrery' : language === 'hi' ? 'स्वर्गीय ऑर्री' : 'ସ୍ୱର୍ଗୀୟ ଅର୍ରି'}
                        <Badge className="ml-auto bg-amber-500/20 text-amber-800 border-amber-600/40">
                          Workshop Preview
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="relative w-full h-96 brass-frame bg-gradient-to-br from-amber-100/30 to-orange-100/30 rounded-xl border-2 border-amber-600/20 overflow-hidden">
                        {/* Orrery Base */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-80 h-80 brass-circle animate-orrery-rotation">
                            {/* Central Hub */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 brass-hub rounded-full border-4 border-amber-600 bg-gradient-to-br from-amber-300 to-orange-400 animate-gear-turn">
                              <div className="w-full h-full flex items-center justify-center">
                                <Cog className="h-8 w-8 text-amber-800" />
                              </div>
                            </div>
                            
                            {/* Mathematics Planet - Architect's Guild */}
                            <div className="absolute top-16 left-16 w-24 h-24">
                              <button
                                onClick={() => setActiveTab('guilds')}
                                className="group w-full h-full brass-planet bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full border-4 border-blue-600/50 hover:border-blue-400 transition-all duration-300 hover:scale-110 animate-planet-orbit shadow-lg"
                              >
                                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                                  <Calculator className="h-6 w-6 text-blue-100 mb-1 group-hover:animate-bounce" />
                                  <span className="text-blue-100 font-bold text-xs">Architect's</span>
                                  <span className="text-blue-200 text-xs">Guild</span>
                                </div>
                              </button>
                            </div>

                            {/* Science Planet - Alchemist's Spire */}
                            <div className="absolute bottom-16 right-16 w-24 h-24">
                              <button
                                onClick={() => setActiveTab('guilds')}
                                className="group w-full h-full brass-planet bg-gradient-to-br from-purple-400 to-pink-500 rounded-full border-4 border-purple-600/50 hover:border-purple-400 transition-all duration-300 hover:scale-110 animate-planet-orbit shadow-lg"
                                style={{ animationDelay: '2s' }}
                              >
                                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                                  <FlaskConical className="h-6 w-6 text-purple-100 mb-1 group-hover:animate-bounce" />
                                  <span className="text-purple-100 font-bold text-xs">Alchemist's</span>
                                  <span className="text-purple-200 text-xs">Spire</span>
                                </div>
                              </button>
                            </div>

                            {/* Dormant Subjects */}
                            <div className="absolute top-16 right-16 w-16 h-16 opacity-50">
                              <div className="w-full h-full brass-dormant bg-slate-400 rounded-full border-2 border-slate-500/30 flex items-center justify-center">
                                <Lock className="h-4 w-4 text-slate-600" />
                              </div>
                            </div>

                            {/* Energy Conduits */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                              <defs>
                                <linearGradient id="brassFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.6" />
                                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M 80 80 Q 160 120 240 80"
                                stroke="url(#brassFlow)"
                                strokeWidth="3"
                                fill="none"
                                className="animate-energy-flow"
                                strokeDasharray="12,6"
                              />
                              <path
                                d="M 240 240 Q 160 200 80 240"
                                stroke="url(#brassFlow)"
                                strokeWidth="3"
                                fill="none"
                                className="animate-energy-flow"
                                strokeDasharray="12,6"
                                style={{ animationDelay: '1s' }}
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <Button 
                          className="brass-button bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg"
                          onClick={() => setActiveTab('guilds')}
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          {language === 'en' ? 'Enter Architect\'s Guild' : language === 'hi' ? 'वास्तुकार गिल्ड में प्रवेश' : 'ବାସ୍ତୁକାର ଗିଲ୍ଡରେ ପ୍ରବେଶ'}
                        </Button>
                        <Button 
                          className="brass-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
                          onClick={() => setActiveTab('guilds')}
                        >
                          <FlaskConical className="h-4 w-4 mr-2" />
                          {language === 'en' ? 'Explore Alchemist\'s Spire' : language === 'hi' ? 'कीमियागर स्पायर का अन्वेषण' : 'ରସାୟନବିତ୍ ସ୍ପାୟାରର ଅନୁସନ୍ଧାନ'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Workshop Status Panel */}
                <div className="space-y-6">
                  {/* Pneumatic Tube System */}
                  <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30">
                    <CardHeader>
                      <CardTitle className="flex items-center text-amber-900">
                        <Mail className="h-5 w-5 mr-2 animate-bounce" />
                        {language === 'en' ? 'Pneumatic Messages' : language === 'hi' ? 'वायवीय संदेश' : 'ବାୟବୀୟ ସନ୍ଦେଶ'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="brass-tube-message p-3 bg-green-100/80 rounded-lg border-l-4 border-green-500">
                          <p className="text-green-800 text-sm">
                            <strong>Daily Challenge:</strong> Complete 3 gear alignment puzzles to earn bonus CF!
                          </p>
                        </div>
                        <div className="brass-tube-message p-3 bg-blue-100/80 rounded-lg border-l-4 border-blue-500">
                          <p className="text-blue-800 text-sm">
                            <strong>Guild Notice:</strong> New automaton parts available in the workshop
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Artisan Tier Status */}
                  <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30">
                    <CardHeader>
                      <CardTitle className="flex items-center text-amber-900">
                        <Crown className="h-5 w-5 mr-2 animate-treasure-shine" />
                        Artisan Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-amber-700">Current Tier</span>
                          <span className={`font-bold bg-gradient-to-r ${currentTier.color} bg-clip-text text-transparent`}>
                            {currentTier.tier}/5
                          </span>
                        </div>
                        <div className="brass-progress-container">
                          <Progress 
                            value={nextTier ? ((cogwheelFragments - currentTier.unlock) / (nextTier.unlock - currentTier.unlock)) * 100 : 100} 
                            className="h-4 brass-progress-bar"
                          />
                        </div>
                        {nextTier && (
                          <p className="text-amber-600 text-sm">
                            {nextTier.unlock - cogwheelFragments} CF to {nextTier.title}
                          </p>
                        )}
                        <div className="text-center">
                          <div className="text-2xl mb-2">{cityActivation}%</div>
                          <p className="text-amber-700 text-sm">City Activation</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Aether-Scope (Leaderboard) */}
                  <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30">
                    <CardHeader>
                      <CardTitle className="flex items-center text-amber-900">
                        <Eye className="h-5 w-5 mr-2 animate-pulse" />
                        Aether-Scope
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-amber-100/50 rounded">
                          <span className="text-amber-800 text-sm">Top Artisan</span>
                          <span className="text-amber-900 font-bold">Master Chen</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-orange-100/50 rounded">
                          <span className="text-orange-800 text-sm">Your Rank</span>
                          <span className="text-orange-900 font-bold">#47</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Guild Halls Tab */}
            <TabsContent value="guilds">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Architect's Guild - Mathematics */}
                <Card className="brass-frame bg-gradient-to-br from-blue-50/95 to-cyan-50/95 backdrop-blur-md border-4 border-blue-700/30">
                  <CardHeader className="border-b-2 border-blue-600/30 bg-gradient-to-r from-blue-100/80 to-cyan-100/80">
                    <CardTitle className="flex items-center text-blue-900">
                      <Calculator className="h-6 w-6 mr-3 animate-clockwork-spin" />
                      {language === 'en' ? 'The Grand Architect\'s Guild' : language === 'hi' ? 'महान वास्तुकार गिल्ड' : 'ମହାନ ବାସ୍ତୁକାର ଗିଲ୍ଡ'}
                      <Badge className="ml-auto bg-blue-500/20 text-blue-800 border-blue-600/40">
                        Mathematics
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {architectGuildModules.map((module) => (
                        <div key={module.id} className={`architect-module-card p-4 bg-white/40 rounded-xl border-2 border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 ${!module.unlocked ? 'opacity-60' : 'hover:scale-102'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${module.color} shadow-lg`}>
                                <module.icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-blue-900">{module.name}</h3>
                                <p className="text-blue-700 text-sm">{module.subtitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {module.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : module.unlocked ? (
                                <Play className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-400" />
                              )}
                              <Badge className={`text-xs ${
                                module.difficulty === 'Expert' ? 'bg-red-100 text-red-700 border-red-300' :
                                module.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                                'bg-green-100 text-green-700 border-green-300'
                              }`}>
                                {module.difficulty}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-blue-800 text-sm mb-3">{module.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <div className="flex items-center justify-between text-xs text-blue-700 mb-1">
                                <span>Progress</span>
                                <span>{module.progress}%</span>
                              </div>
                              <div className="brass-progress-container">
                                <Progress value={module.progress} className="h-2 brass-progress-bar" />
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              disabled={!module.unlocked}
                              className={`brass-button ${module.unlocked ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}
                              onClick={() => module.unlocked && handleGameNavigation(module.id, 'architect')}
                            >
                              {module.unlocked ? (
                                <>
                                  <Wrench className="h-3 w-3 mr-1" />
                                  {language === 'en' ? 'Construct' : language === 'hi' ? 'निर्माण' : 'ନିର୍ମାଣ'}
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3 w-3 mr-1" />
                                  {language === 'en' ? 'Locked' : language === 'hi' ? 'बंद' : 'ବନ୍ଦ'}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Alchemist's Spire - Science */}
                <Card className="brass-frame bg-gradient-to-br from-purple-50/95 to-pink-50/95 backdrop-blur-md border-4 border-purple-700/30">
                  <CardHeader className="border-b-2 border-purple-600/30 bg-gradient-to-r from-purple-100/80 to-pink-100/80">
                    <CardTitle className="flex items-center text-purple-900">
                      <FlaskConical className="h-6 w-6 mr-3 animate-alchemical-bubble" />
                      {language === 'en' ? 'The Alchemist\'s Spire' : language === 'hi' ? 'कीमियागर स्पायर' : 'ରସାୟନବିତର ସ୍ପାୟାର'}
                      <Badge className="ml-auto bg-purple-500/20 text-purple-800 border-purple-600/40">
                        Science
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {alchemistSpireModules.map((module) => (
                        <div key={module.id} className={`alchemist-module-card p-4 bg-white/40 rounded-xl border-2 border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 ${!module.unlocked ? 'opacity-60' : 'hover:scale-102'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${module.color} shadow-lg`}>
                                <module.icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-purple-900">{module.name}</h3>
                                <p className="text-purple-700 text-sm">{module.subtitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {module.completed ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : module.unlocked ? (
                                <Play className="h-5 w-5 text-purple-500" />
                              ) : (
                                <Lock className="h-5 w-5 text-gray-400" />
                              )}
                              <Badge className={`text-xs ${
                                module.difficulty === 'Expert' ? 'bg-red-100 text-red-700 border-red-300' :
                                module.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                                'bg-green-100 text-green-700 border-green-300'
                              }`}>
                                {module.difficulty}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-purple-800 text-sm mb-3">{module.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <div className="flex items-center justify-between text-xs text-purple-700 mb-1">
                                <span>Progress</span>
                                <span>{module.progress}%</span>
                              </div>
                              <div className="brass-progress-container">
                                <Progress value={module.progress} className="h-2 brass-progress-bar" />
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              disabled={!module.unlocked}
                              className={`brass-button ${module.unlocked ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-300 text-gray-500'}`}
                              onClick={() => module.unlocked && handleGameNavigation(module.id, 'alchemist')}
                            >
                              {module.unlocked ? (
                                <>
                                  <FlaskConical className="h-3 w-3 mr-1" />
                                  {language === 'en' ? 'Experiment' : language === 'hi' ? 'प्रयोग' : 'ପରୀକ୍ଷା'}
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3 w-3 mr-1" />
                                  {language === 'en' ? 'Locked' : language === 'hi' ? 'बंद' : 'ବନ୍ଦ'}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Progress & Analytics Tab */}
            <TabsContent value="progress">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Schematics Board */}
                <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amber-900">
                      <Target className="h-5 w-5 mr-2" />
                      {language === 'en' ? 'Workshop Performance' : language === 'hi' ? 'कार्यशाला प्रदर्शन' : 'କର୍ମଶାଳା କାର୍ଯ୍ୟଦକ୍ଷତା'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 brass-stat-card bg-gradient-to-r from-blue-100/60 to-cyan-100/60 rounded-lg border border-blue-300/40">
                        <div className="flex items-center space-x-3">
                          <Target className="h-5 w-5 text-blue-600 animate-pulse" />
                          <div>
                            <p className="font-medium text-blue-900">Precision Rate</p>
                            <p className="text-sm text-blue-700">Blueprint accuracy</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">94%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 brass-stat-card bg-gradient-to-r from-green-100/60 to-emerald-100/60 rounded-lg border border-green-300/40">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-5 w-5 text-green-600 animate-clockwork-spin" />
                          <div>
                            <p className="font-medium text-green-900">Construction Speed</p>
                            <p className="text-sm text-green-700">Average assembly time</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-green-600">2.1m</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 brass-stat-card bg-gradient-to-r from-purple-100/60 to-violet-100/60 rounded-lg border border-purple-300/40">
                        <div className="flex items-center space-x-3">
                          <Lightbulb className="h-5 w-5 text-purple-600 animate-pulse" />
                          <div>
                            <p className="font-medium text-purple-900">Mechanisms Mastered</p>
                            <p className="text-sm text-purple-700">This week</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold text-purple-600">18</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Progress */}
                <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-amber-900">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      {language === 'en' ? 'Weekly CF Progress' : language === 'hi' ? 'साप्ताहिक CF प्रगति' : 'ସାପ୍ତାହିକ CF ପ୍ରଗତି'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { day: 'Mon', cf: 95, color: 'bg-amber-500' },
                        { day: 'Tue', cf: 130, color: 'bg-orange-500' },
                        { day: 'Wed', cf: 110, color: 'bg-red-500' },
                        { day: 'Thu', cf: 150, color: 'bg-purple-500' },
                        { day: 'Fri', cf: 125, color: 'bg-blue-500' },
                        { day: 'Sat', cf: 175, color: 'bg-green-500' },
                        { day: 'Sun', cf: 105, color: 'bg-pink-500' }
                      ].map((day) => (
                        <div key={day.day} className="flex items-center space-x-4">
                          <span className="w-10 text-sm font-medium text-amber-800">{day.day}</span>
                          <div className="flex-1 brass-progress-container rounded-full h-4 overflow-hidden">
                            <div
                              style={{ width: `${(day.cf / 200) * 100}%` }}
                              className={`h-full ${day.color} rounded-full transition-all duration-500 animate-gear-fill`}
                            />
                          </div>
                          <span className="w-12 text-sm font-bold text-amber-900">{day.cf}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Crafting Streak */}
                <Card className="brass-frame bg-gradient-to-br from-orange-100/95 to-red-100/95 backdrop-blur-md border-4 border-orange-700/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-900">
                      <Flame className="h-5 w-5 mr-2 animate-flame-flicker" />
                      {language === 'en' ? 'Crafting Streak' : language === 'hi' ? 'शिल्प श्रृंखला' : 'ଶିଳ୍ପ ଶୃଙ୍ଖଳା'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-orange-600 mb-2 animate-flame-glow">21</div>
                      <p className="text-orange-700 mb-4">
                        {language === 'en' ? 'Days Consecutive' : language === 'hi' ? 'लगातार दिन' : 'କ୍ରମାଗତ ଦିନ'}
                      </p>
                      <div className="flex justify-center space-x-2">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 rounded-full ${
                              i < 6 ? 'bg-orange-500 animate-forge-glow' : 'bg-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-orange-600 text-sm mt-2">
                        {language === 'en' ? 'This week' : language === 'hi' ? 'इस सप्ताह' : 'ଏହି ସପ୍ତାହ'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Celestial Orrery Tab */}
            <TabsContent value="orrery">
              <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-900 copper-text-shadow">
                    <Globe className="h-6 w-6 mr-3 animate-orrery-rotation" />
                    {language === 'en' ? 'Interactive Celestial Orrery' : language === 'hi' ? 'इंटरैक्टिव स्वर्गीय ऑर्री' : 'ଇଣ୍ଟରାକ୍ଟିଭ ସ୍ୱର୍ଗୀୟ ଅର୍ରି'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="relative w-full h-[600px] brass-frame bg-gradient-to-br from-slate-900/20 to-slate-800/20 rounded-xl border-4 border-amber-600/30 overflow-hidden">
                    {/* Full Interactive Orrery */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-[500px] h-[500px] brass-circle animate-orrery-rotation">
                        {/* Central Hub with Controls */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 brass-hub rounded-full border-6 border-amber-600 bg-gradient-to-br from-amber-300 to-orange-400 animate-gear-turn shadow-lg">
                          <div className="w-full h-full flex items-center justify-center">
                            <Cog className="h-12 w-12 text-amber-800" />
                          </div>
                        </div>
                        
                        {/* Mathematics Orbit */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 border-blue-400/30 rounded-full animate-orbital-ring">
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12">
                            <button
                              onClick={() => {
                                setSelectedGuild('architect');
                                setActiveTab('guilds');
                              }}
                              className="group w-full h-full brass-planet bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full border-4 border-blue-600/50 hover:border-blue-400 transition-all duration-300 hover:scale-125 animate-planet-orbit shadow-xl"
                            >
                              <div className="w-full h-full flex items-center justify-center">
                                <Calculator className="h-6 w-6 text-blue-100 group-hover:animate-bounce" />
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Science Orbit */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-purple-400/30 rounded-full animate-orbital-ring" style={{ animationDelay: '1s' }}>
                          <div className="absolute -bottom-6 right-1/2 transform translate-x-1/2 w-12 h-12">
                            <button
                              onClick={() => {
                                setSelectedGuild('alchemist');
                                setActiveTab('guilds');
                              }}
                              className="group w-full h-full brass-planet bg-gradient-to-br from-purple-400 to-pink-500 rounded-full border-4 border-purple-600/50 hover:border-purple-400 transition-all duration-300 hover:scale-125 animate-planet-orbit shadow-xl"
                              style={{ animationDelay: '3s' }}
                            >
                              <div className="w-full h-full flex items-center justify-center">
                                <FlaskConical className="h-6 w-6 text-purple-100 group-hover:animate-bounce" />
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Dormant Subject Orbits */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] border-2 border-slate-400/20 rounded-full animate-orbital-ring" style={{ animationDelay: '2s' }}>
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                            <div className="w-full h-full brass-dormant bg-slate-400 rounded-full border-2 border-slate-500/30 flex items-center justify-center opacity-50">
                              <Lock className="h-4 w-4 text-slate-600" />
                            </div>
                          </div>
                        </div>

                        {/* Energy Conduits */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <defs>
                            <linearGradient id="orreryFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#d97706" stopOpacity="0.8" />
                              <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                              <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                              <feMerge> 
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          {/* Connecting Energy Lines */}
                          <circle
                            cx="250"
                            cy="250"
                            r="140"
                            stroke="url(#orreryFlow)"
                            strokeWidth="2"
                            fill="none"
                            filter="url(#glow)"
                            className="animate-energy-flow"
                            strokeDasharray="8,4"
                          />
                          <circle
                            cx="250"
                            cy="250"
                            r="180"
                            stroke="url(#orreryFlow)"
                            strokeWidth="2"
                            fill="none"
                            filter="url(#glow)"
                            className="animate-energy-flow"
                            strokeDasharray="12,6"
                            style={{ animationDelay: '1.5s' }}
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Orrery Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="brass-button bg-amber-100/80 border-amber-600/40 text-amber-800 hover:bg-amber-200/80"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Orbit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="brass-button bg-amber-100/80 border-amber-600/40 text-amber-800 hover:bg-amber-200/80"
                      >
                        <Maximize className="h-4 w-4 mr-2" />
                        Full View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}