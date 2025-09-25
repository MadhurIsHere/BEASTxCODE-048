import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Zap, 
  Trophy, 
  Star, 
  Shield, 
  Map, 
  Compass,
  Sparkles,
  Globe,
  Calculator,
  Atom,
  Microscope,
  FlaskConical,
  Settings,
  BookOpen,
  Target,
  Award,
  Home,
  User,
  LogOut,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  HelpCircle,
  ChevronRight,
  Lock,
  CheckCircle,
  Crown,
  Flame,
  MessageCircle,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { Language, UserProfile } from '../../types/onboarding';

interface Dashboard_Grade6Props {
  user: UserProfile;
  language: Language;
  onLogout: () => void;
  onNavigateToLesson?: (lessonId: string) => void;
}

// Space-themed planet data for Grade 6
const planets = [
  {
    id: 'mathara',
    name: {
      en: 'Planet Mathara',
      hi: 'ग्रह मथारा', 
      or: 'ଗ୍ରହ ମଥାରା'
    },
    subject: {
      en: 'Mathematics',
      hi: 'गणित',
      or: 'ଗଣିତ'
    },
    description: {
      en: 'Explore number mysteries and geometric wonders',
      hi: 'संख्या रहस्यों और ज्यामितीय आश्चर्यों का अन्वेषण करें',
      or: 'ସଂଖ୍ୟା ରହସ୍ୟ ଏବଂ ଜ୍ୟାମିତିକ ଆଶ୍ଚର୍ଯ୍ୟ ଅନ୍ୱେଷଣ କରନ୍ତୁ'
    },
    color: 'from-blue-400 via-blue-500 to-blue-600',
    glowColor: 'shadow-blue-500/50',
    progress: 65,
    level: 8,
    icon: Calculator,
    unlocked: true,
    regions: [
      { name: 'Number Valley', completed: true },
      { name: 'Fraction Forest', completed: true },
      { name: 'Geometry Gardens', completed: false },
      { name: 'Algebra Caves', completed: false }
    ]
  },
  {
    id: 'scientia',
    name: {
      en: 'Planet Scientia', 
      hi: 'ग्रह साइंसिया',
      or: 'ଗ୍ରହ ସାଇଣ୍ଟିଆ'
    },
    subject: {
      en: 'Science',
      hi: 'विज्ञान',
      or: 'ବିଜ୍ଞାନ'
    },
    description: {
      en: 'Discover the secrets of nature and matter',
      hi: 'प्रकृति और पदार्थ के रहस्यों की खोज करें',
      or: 'ପ୍ରକୃତି ଏବଂ ପଦାର୍ଥର ରହସ୍ୟ ଆବିଷ୍କାର କରନ୍ତୁ'
    },
    color: 'from-green-400 via-green-500 to-emerald-600',
    glowColor: 'shadow-green-500/50',
    progress: 45,
    level: 6,
    icon: Atom,
    unlocked: true,
    regions: [
      { name: 'Physics Plains', completed: true },
      { name: 'Chemistry Cliffs', completed: false },
      { name: 'Biology Bay', completed: false },
      { name: 'Experiment Labs', completed: false }
    ]
  },
  {
    id: 'technos',
    name: {
      en: 'Planet Technos',
      hi: 'ग्रह टेक्नोस',
      or: 'ଗ୍ରହ ଟେକ୍ନୋସ୍'
    },
    subject: {
      en: 'Technology',
      hi: 'प्रौद्योगिकी',
      or: 'ପ୍ରଯୁକ୍ତି'
    },
    description: {
      en: 'Build, code, and innovate in the digital realm',
      hi: 'डिजिटल क्षेत्र में निर्माण, कोडिंग और नवाचार करें',
      or: 'ଡିଜିଟାଲ କ୍ଷେତ୍ରରେ ନିର୍ମାଣ, କୋଡିଂ ଏବଂ ନବାଚାର କରନ୍ତୁ'
    },
    color: 'from-purple-400 via-purple-500 to-purple-600',
    glowColor: 'shadow-purple-500/50',
    progress: 20,
    level: 3,
    icon: Settings,
    unlocked: false,
    regions: [
      { name: 'Code Canyon', completed: false },
      { name: 'Robot Workshop', completed: false },
      { name: 'Innovation Island', completed: false }
    ]
  }
];

// LEO Fox Mascot Component
const LeoMascot = ({ mood = 'idle', size = 'md' }: { mood?: 'idle' | 'happy' | 'explaining' | 'confused'; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24'
  };

  const moodColors = {
    idle: 'from-orange-400 to-red-500',
    happy: 'from-yellow-400 to-orange-500',
    explaining: 'from-blue-400 to-purple-500',
    confused: 'from-gray-400 to-gray-600'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${moodColors[mood]} p-3 flex items-center justify-center shadow-lg`}
      animate={mood === 'idle' ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="text-white">
        {mood === 'happy' && '🦊😊'}
        {mood === 'explaining' && '🦊👉'}
        {mood === 'confused' && '🦊🤔'}
        {mood === 'idle' && '🦊'}
      </div>
    </motion.div>
  );
};

// N.E.I.L. Robot Component
const NeilRobot = ({ animation = 'float' }: { animation?: 'float' | 'spin' | 'project' }) => {
  return (
    <motion.div
      className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"
      animate={{
        y: animation === 'float' ? [-5, 5, -5] : 0,
        rotateY: animation === 'spin' ? [0, 360] : 0,
        scale: animation === 'project' ? [1, 1.1, 1] : 1
      }}
      transition={{ 
        duration: animation === 'spin' ? 2 : 3, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="text-white text-2xl">🤖</div>
    </motion.div>
  );
};

// Planet Component with interactions
const PlanetComponent = ({ 
  planet, 
  language, 
  onSelect, 
  index 
}: { 
  planet: typeof planets[0]; 
  language: Language; 
  onSelect: (planetId: string) => void;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: planet.unlocked ? 1.1 : 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => planet.unlocked && onSelect(planet.id)}
    >
      <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${planet.color} ${planet.unlocked ? '' : 'grayscale opacity-60'} 
        shadow-2xl ${planet.unlocked ? planet.glowColor : 'shadow-gray-500/30'} 
        ${isHovered && planet.unlocked ? 'shadow-3xl' : ''} transition-all duration-500`}>
        
        {/* Planet Surface */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent">
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <planet.icon className={`w-6 h-6 md:w-10 md:h-10 ${planet.unlocked ? 'text-white' : 'text-gray-400'}`} />
          </div>
        </div>

        {/* Orbital Ring */}
        {planet.unlocked && (
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2" />
              <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-cyan-300 rounded-full" />
            </div>
          </motion.div>
        )}

        {/* Glow Effect */}
        {planet.unlocked && isHovered && (
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${planet.color} opacity-50 blur-md`}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1 }}
          />
        )}

        {/* Lock Overlay */}
        {!planet.unlocked && (
          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center border-2 border-gray-500">
            <div className="text-center">
              <Lock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <div className="text-gray-300 text-xs">
                {language === 'en' ? 'Locked' : language === 'hi' ? 'बंद' : 'ତାଲାବଦ୍ଧ'}
              </div>
            </div>
          </div>
        )}

        {/* Progress Ring */}
        {planet.unlocked && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="58"
              fill="transparent"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="58"
              fill="transparent"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-sm"
              initial={{ strokeDasharray: `0 ${2 * Math.PI * 58}` }}
              animate={{ strokeDasharray: `${2 * Math.PI * 58 * (planet.progress / 100)} ${2 * Math.PI * 58}` }}
              transition={{ duration: 2, delay: index * 0.3 }}
            />
          </svg>
        )}
      </div>

      {/* Planet Info */}
      <div className="mt-3 md:mt-4 text-center">
        <h3 className="font-bold text-white text-sm md:text-lg drop-shadow-md">
          {planet.name[language]}
        </h3>
        <p className="text-blue-200 text-xs md:text-sm mb-2">
          {planet.subject[language]}
        </p>
        {planet.unlocked ? (
          <div className="space-y-2">
            <div className="flex justify-center items-center space-x-2">
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                Level {planet.level}
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                {planet.progress}%
              </Badge>
            </div>
            <p className="text-xs text-blue-200 px-2 leading-relaxed">
              {planet.description[language]}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <ChevronRight className="w-4 h-4 mr-1" />
                {language === 'en' ? 'Explore' : language === 'hi' ? 'अन्वेषण' : 'ଅନ୍ୱେଷଣ'}
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">
              {language === 'en' ? 'Coming Soon' : language === 'hi' ? 'जल्द ही' : 'ଶୀଘ୍ର ଆସୁଛି'}
            </p>
            <div className="flex justify-center">
              <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/30 text-xs">
                {language === 'en' ? 'Under Construction' : language === 'hi' ? 'निर्माणाधीन' : 'ନିର୍ମାଣାଧୀନ'}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Ship's Energy Core (XP Bar)
const EnergyCore = ({ currentXP, maxXP, level }: { currentXP: number; maxXP: number; level: number }) => {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);

  return (
    <div className="relative">
      <div className="bg-black/40 rounded-2xl p-3 md:p-4 border-2 border-cyan-400/50 shadow-lg shadow-cyan-400/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <span className="text-white font-bold">Energy Core</span>
          </div>
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-bold">Level {level}</span>
          </div>
        </div>
        
        {/* Energy Bar */}
        <div className="relative h-6 md:h-8 bg-gray-800/60 rounded-full overflow-hidden border border-cyan-400/30">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Animated particles effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
        
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-cyan-300 font-medium">{currentXP} XP</span>
          <span className="text-gray-400">{maxXP} XP to next level</span>
        </div>
      </div>
    </div>
  );
};

// Cockpit UI Controls
const CockpitControls = ({ user, language, onLogout }: { 
  user: UserProfile; 
  language: Language; 
  onLogout: () => void; 
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  return (
    <div className="flex flex-col space-y-4">
      {/* Captain Info */}
      <div className="bg-black/40 rounded-xl p-4 border border-cyan-400/30 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">🚀</span>
          </div>
          <div>
            <h3 className="text-white font-bold">Captain {user.name}</h3>
            <p className="text-blue-200 text-sm">Space Explorer • Grade 6</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          <div className="bg-white/10 rounded-lg p-1.5 md:p-2 text-center border border-white/20">
            <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">{user.badges?.length || 0}</p>
            <p className="text-blue-200 text-xs hidden md:block">Badges</p>
          </div>
          <div className="bg-white/10 rounded-lg p-1.5 md:p-2 text-center border border-white/20">
            <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-400 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">{user.streak || 0}</p>
            <p className="text-blue-200 text-xs hidden md:block">Streak</p>
          </div>
          <div className="bg-white/10 rounded-lg p-1.5 md:p-2 text-center border border-white/20">
            <Star className="w-3 h-3 md:w-4 md:h-4 text-purple-400 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">{user.level || 1}</p>
            <p className="text-blue-200 text-xs hidden md:block">Level</p>
          </div>
        </div>
      </div>

      {/* Ship Controls */}
      <div className="bg-black/40 rounded-xl p-4 border border-cyan-400/30 space-y-3 backdrop-blur-sm">
        <h4 className="text-white font-bold text-sm flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Ship Controls
        </h4>
        
        <div className="space-y-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-full flex items-center justify-between p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
          >
            <div className="flex items-center space-x-2">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              <span className="text-white text-sm">
                {language === 'en' ? 'Sound' : language === 'hi' ? 'ध्वनि' : 'ଧ୍ୱନି'}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors ${soundEnabled ? 'bg-cyan-400' : 'bg-gray-600'} relative`}>
              <motion.div 
                className="w-3 h-3 bg-white rounded-full absolute top-0.5 shadow-sm"
                animate={{ x: soundEnabled ? 16 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>

          <button
            onClick={() => setAccessibilityMode(!accessibilityMode)}
            className="w-full flex items-center justify-between p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
          >
            <div className="flex items-center space-x-2">
              {accessibilityMode ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              <span className="text-white text-sm">
                {language === 'en' ? 'High Contrast' : language === 'hi' ? 'हाई कंट्रास्ट' : 'ହାଇ କଣ୍ଟ୍ରାଷ୍ଟ'}
              </span>
            </div>
            <div className={`w-8 h-4 rounded-full transition-colors ${accessibilityMode ? 'bg-cyan-400' : 'bg-gray-600'} relative`}>
              <motion.div 
                className="w-3 h-3 bg-white rounded-full absolute top-0.5 shadow-sm"
                animate={{ x: accessibilityMode ? 16 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </div>

        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="w-full bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30 hover:border-red-400"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Exit Ship' : language === 'hi' ? 'जहाज़ छोड़ें' : 'ଜାହାଜ ଛାଡ଼ନ୍ତୁ'}
        </Button>
      </div>
    </div>
  );
};

// Recent Missions Component
const RecentMissions = ({ language }: { language: Language }) => {
  const missions = [
    {
      id: 1,
      title: language === 'en' ? 'Number Valley Explorer' : language === 'hi' ? 'संख्या घाटी अन्वेषक' : 'ସଂଖ୍ୟା ଉପତ୍ୟକା ଅନ୍ୱେଷଣକାରୀ',
      xp: 50,
      completed: true,
      icon: '🔢',
      planet: 'Mathara'
    },
    {
      id: 2,
      title: language === 'en' ? 'Fraction Forest Quest' : language === 'hi' ? 'भिन्न वन खोज' : 'ଭିନ୍ନ ଜଙ୍ଗଲ ସନ୍ଧାନ',
      xp: 75,
      completed: true,
      icon: '🌲',
      planet: 'Mathara'
    },
    {
      id: 3,
      title: language === 'en' ? 'Physics Plains Discovery' : language === 'hi' ? 'भौतिकी मैदान खोज' : 'ପଦାର୍ଥ ବିଜ୍ଞାନ ସମତଳ ଆବିଷ୍କାର',
      xp: 60,
      completed: false,
      icon: '🔬',
      planet: 'Scientia'
    }
  ];

  return (
    <div className="bg-black/40 rounded-xl p-4 border border-cyan-400/30 backdrop-blur-sm">
      <h4 className="text-white font-bold mb-4 flex items-center">
        <Map className="w-4 h-4 mr-2 text-cyan-400" />
        {language === 'en' ? 'Recent Missions' : language === 'hi' ? 'हाल के मिशन' : 'ସାମ୍ପ୍ରତିକ ମିଶନ'}
      </h4>
      
      <div className="space-y-3">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
              mission.completed 
                ? 'bg-green-500/20 border border-green-400/30 hover:bg-green-500/30' 
                : 'bg-white/10 border border-white/20 hover:bg-white/20'
            }`}
          >
            <div className="text-2xl">{mission.icon}</div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{mission.title}</p>
              <div className="flex items-center space-x-2">
                <span className="text-blue-200 text-xs">+{mission.xp} XP</span>
                <span className="text-gray-400 text-xs">• {mission.planet}</span>
                {mission.completed && <CheckCircle className="w-3 h-3 text-green-400" />}
              </div>
            </div>
            {!mission.completed && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export function Dashboard_Grade6({ user, language, onLogout, onNavigateToLesson }: Dashboard_Grade6Props) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [showLeoMessage, setShowLeoMessage] = useState(true);

  // Calculate current level progress
  const currentXP = user.xp || 100;
  const maxXP = (user.level || 1) * 200;

  const handlePlanetSelect = (planetId: string) => {
    setSelectedPlanet(planetId);
    // Navigate to the exploration zones
    if (planetId === 'mathara') {
      onNavigateToLesson?.('planet-mathara');
    } else if (planetId === 'scientia') {
      onNavigateToLesson?.('planet-scientia');
    } else if (planetId === 'technos') {
      // Future: Navigate to technology content
      console.log('Technology planet selected - content coming soon');
    }
  };

  const getLeoMessage = () => {
    if (language === 'en') {
      return "Welcome to your spaceship, Captain! Ready to explore the Knowledge Universe? Click on a planet to begin your learning adventure!";
    } else if (language === 'hi') {
      return "आपके स्पेसशिप में आपका स्वागत है, कैप्टन! ज्ञान ब्रह्मांड का अन्वेषण करने के लिए तैयार हैं? अपना शिक्षण साहसिक कार्य शुरू करने के लिए किसी ग्रह पर क्लिक करें!";
    } else {
      return "ଆପଣଙ୍କ ସ୍ପେସଶିପରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ, କ୍ୟାପଟେନ! ଜ୍ଞାନ ବ୍ରହ୍ମାଣ୍ଡ ଅନ୍ୱେଷଣ କରିବାକୁ ପ୍ରସ୍ତୁତ? ଆପଣଙ୍କର ଶିକ୍ଷଣ ଦୁଃସାହସିକ କାର୍ଯ୍ୟ ଆରମ୍ଭ କରିବାକୁ ଏକ ଗ୍ରହରେ କ୍ଲିକ୍ କରନ୍ତୁ!";
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Realistic Universe Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep Space Base with Multiple Layers */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(139, 69, 19, 0.4) 0%, transparent 40%),
              radial-gradient(ellipse at 80% 70%, rgba(255, 53, 120, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 40% 80%, rgba(53, 200, 255, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 60% 20%, rgba(138, 43, 226, 0.4) 0%, transparent 45%),
              linear-gradient(135deg, #030712 0%, #0f0820 25%, #1a0a3a 50%, #2a1a5a 75%, #0f0820 100%)
            `
          }}
        />

        {/* Massive Star Field - Multiple Layers for Depth */}
        {/* Background Stars - Distant */}
        {[...Array(400)].map((_, i) => (
          <div
            key={`bg-star-${i}`}
            className="absolute bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${0.3 + Math.random() * 0.8}px`,
              height: `${0.3 + Math.random() * 0.8}px`,
            }}
          />
        ))}

        {/* Mid-Distance Twinkling Stars */}
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={`twinkle-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${0.8 + Math.random() * 1.5}px`,
              height: `${0.8 + Math.random() * 1.5}px`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.3, 0.5],
            }}
            transition={{
              duration: 1 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Bright Foreground Stars with Cross Pattern */}
        {[...Array(80)].map((_, i) => (
          <motion.div
            key={`bright-star-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          >
            <div className="relative">
              <div 
                className="bg-white rounded-full"
                style={{
                  width: `${1.5 + Math.random() * 2}px`,
                  height: `${1.5 + Math.random() * 2}px`,
                  boxShadow: `0 0 ${4 + Math.random() * 8}px rgba(255, 255, 255, 0.8)`
                }}
              />
              {/* Diffraction spikes */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: `${8 + Math.random() * 12}px`,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
                }}
              />
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90"
                style={{
                  width: `${6 + Math.random() * 10}px`,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
                }}
              />
            </div>
          </motion.div>
        ))}

        {/* Realistic Planets with Detailed Surfaces */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`planet-${i}`}
            className="absolute opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30 + Math.random() * 40, 0],
              y: [0, -20 - Math.random() * 30, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 25 + i * 8,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="relative">
              <div 
                className={`rounded-full shadow-2xl ${
                  i === 0 ? 'bg-gradient-to-br from-red-600 via-red-700 to-red-900' :
                  i === 1 ? 'bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800' :
                  i === 2 ? 'bg-gradient-to-br from-green-500 via-green-600 to-green-800' :
                  i === 3 ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800' :
                  i === 4 ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-yellow-700' :
                  i === 5 ? 'bg-gradient-to-br from-cyan-400 via-cyan-600 to-blue-700' :
                  i === 6 ? 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700' :
                  'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900'
                }`}
                style={{
                  width: `${12 + i * 6}px`,
                  height: `${12 + i * 6}px`,
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
                }}
              />
              {/* Planet atmospheric glow */}
              <div 
                className={`absolute inset-0 rounded-full ${
                  i === 0 ? 'bg-red-400' :
                  i === 1 ? 'bg-blue-400' :
                  i === 2 ? 'bg-green-400' :
                  i === 3 ? 'bg-purple-400' :
                  i === 4 ? 'bg-orange-400' :
                  i === 5 ? 'bg-cyan-400' :
                  i === 6 ? 'bg-pink-400' :
                  'bg-gray-400'
                } opacity-30 blur-md`}
                style={{
                  transform: 'scale(1.3)',
                }}
              />
              {/* Surface details */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/20 to-transparent" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-bl from-transparent to-black/30" />
            </div>
          </motion.div>
        ))}

        {/* Realistic Meteor Showers */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`meteor-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 120 - 10}%`,
              top: `${Math.random() * 30}%`,
            }}
            animate={{
              x: [-150, typeof window !== 'undefined' ? window.innerWidth + 150 : 1400],
              y: [0, 500],
              rotate: [0, 720]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "easeIn"
            }}
          >
            <div className="relative">
              {/* Meteor head */}
              <div className="w-4 h-4 bg-gradient-to-br from-orange-300 via-red-500 to-yellow-600 rounded-full shadow-lg">
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white via-yellow-200 to-transparent" />
              </div>
              {/* Multiple trail layers for realism */}
              <div className="absolute top-2 -right-12 w-16 h-1 bg-gradient-to-r from-orange-400/90 via-red-500/70 to-transparent blur-sm" />
              <div className="absolute top-2 -right-20 w-24 h-1 bg-gradient-to-r from-orange-300/60 via-red-400/40 to-transparent blur-md" />
              <div className="absolute top-2 -right-32 w-40 h-1 bg-gradient-to-r from-orange-200/40 via-red-300/20 to-transparent blur-lg" />
              {/* Sparks */}
              {[...Array(5)].map((_, sparkIdx) => (
                <motion.div
                  key={sparkIdx}
                  className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                  style={{
                    top: `${Math.random() * 8}px`,
                    right: `${8 + Math.random() * 16}px`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* Realistic Shooting Stars */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`shooting-star-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{
              x: [0, 400],
              y: [0, 250],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 15,
              ease: "easeOut"
            }}
          >
            <div className="relative">
              <div className="w-2 h-2 bg-white rounded-full shadow-lg">
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-blue-200 to-white" />
              </div>
              {/* Multi-layered trail */}
              <div className="absolute top-1 -right-8 w-12 h-0.5 bg-gradient-to-r from-white via-blue-200/80 to-transparent" />
              <div className="absolute top-1 -right-16 w-20 h-0.5 bg-gradient-to-r from-white/70 via-blue-300/50 to-transparent blur-sm" />
              <div className="absolute top-1 -right-24 w-32 h-0.5 bg-gradient-to-r from-white/40 via-purple-400/30 to-transparent blur-md" />
            </div>
          </motion.div>
        ))}

        {/* Enhanced Nebula Clouds with Realistic Colors */}
        <motion.div
          className="absolute w-[500px] h-[500px] opacity-40 blur-3xl"
          style={{
            left: '5%',
            top: '10%',
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.6) 0%, rgba(75, 0, 130, 0.4) 30%, rgba(25, 25, 112, 0.2) 60%, transparent 100%)'
          }}
          animate={{ 
            scale: [1, 1.4, 1], 
            opacity: [0.3, 0.7, 0.3],
            x: [0, 120, 0],
            y: [0, -60, 0],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        
        <motion.div
          className="absolute w-[400px] h-[400px] opacity-50 blur-3xl"
          style={{
            right: '10%',
            bottom: '15%',
            background: 'radial-gradient(circle, rgba(255, 20, 147, 0.5) 0%, rgba(138, 43, 226, 0.3) 40%, rgba(0, 191, 255, 0.2) 70%, transparent 100%)'
          }}
          animate={{ 
            scale: [1.2, 0.8, 1.2], 
            opacity: [0.4, 0.8, 0.4],
            x: [0, -80, 0],
            y: [0, 80, 0],
            rotate: [0, -60, 0]
          }}
          transition={{ duration: 18, repeat: Infinity }}
        />

        <motion.div
          className="absolute w-[350px] h-[350px] opacity-45 blur-2xl"
          style={{
            left: '55%',
            top: '35%',
            background: 'radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, rgba(0, 191, 255, 0.3) 35%, rgba(138, 43, 226, 0.2) 65%, transparent 100%)'
          }}
          animate={{ 
            scale: [0.9, 1.5, 0.9], 
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 120, 240, 360],
            x: [0, -120, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        {/* Cosmic Dust Clouds */}
        {[...Array(200)].map((_, i) => (
          <motion.div
            key={`cosmic-dust-${i}`}
            className="absolute bg-white/15 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${0.5 + Math.random() * 1.5}px`,
              height: `${0.5 + Math.random() * 1.5}px`,
            }}
            animate={{
              x: [0, Math.random() * 150 - 75],
              y: [0, Math.random() * 150 - 75],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: 12 + Math.random() * 16,
              repeat: Infinity,
              delay: Math.random() * 15,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Moving Asteroid Belt */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`asteroid-${i}`}
            className="absolute opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
            animate={{
              x: [200, -400],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 30 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 25,
              ease: "linear"
            }}
          >
            <div className="relative">
              <div 
                className="bg-gradient-to-br from-gray-500 via-gray-600 to-gray-800 rounded-full shadow-lg"
                style={{
                  width: `${2 + Math.random() * 6}px`,
                  height: `${2 + Math.random() * 6}px`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
              {/* Asteroid surface details */}
              <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-gray-400/40 to-transparent" />
            </div>
          </motion.div>
        ))}

        {/* Distant Galaxies */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`galaxy-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${15 + i * 25}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 80 + i * 40,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div 
              className="w-24 h-24 rounded-full"
              style={{
                background: `conic-gradient(from ${i * 90}deg, transparent 0deg, rgba(138, 43, 226, 0.4) 30deg, transparent 60deg, rgba(59, 130, 246, 0.3) 90deg, transparent 120deg, rgba(255, 20, 147, 0.2) 150deg, transparent 180deg)`,
                filter: 'blur(6px)'
              }}
            />
          </motion.div>
        ))}

        {/* Pulsating Bright Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`pulsar-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#74b9ff', '#fd79a8'][Math.floor(Math.random() * 8)]
              }60 0%, transparent 70%)`,
              width: `${6 + Math.random() * 12}px`,
              height: `${6 + Math.random() * 12}px`,
            }}
            animate={{
              scale: [0.3, 2.5, 0.3],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Solar Flares and Energy Bursts */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`solar-flare-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 15,
              ease: "easeOut"
            }}
          >
            <div className="relative">
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent transform origin-left blur-sm" />
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-400/60 to-transparent transform origin-left -mt-1 blur-md" />
              <div className="w-40 h-1 bg-gradient-to-r from-transparent via-red-400/40 to-transparent transform origin-left -mt-1 blur-lg" />
            </div>
          </motion.div>
        ))}

        {/* Large Comet with Detailed Tail */}
        <motion.div
          className="absolute"
          style={{ left: '-15%', top: '25%' }}
          animate={{
            x: [0, typeof window !== 'undefined' ? window.innerWidth + 300 : 1500],
            y: [0, -150],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: 45,
            ease: "easeIn"
          }}
        >
          <div className="relative">
            {/* Comet nucleus */}
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-200 via-white to-blue-300 rounded-full shadow-xl">
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white via-cyan-100 to-transparent" />
              <div className="absolute inset-2 rounded-full bg-white/60" />
            </div>
            {/* Multi-layer comet tail */}
            <div className="absolute top-3 -right-32 w-40 h-2 bg-gradient-to-r from-cyan-300/90 via-blue-200/70 to-transparent blur-sm" />
            <div className="absolute top-3 -right-48 w-64 h-2 bg-gradient-to-r from-cyan-200/70 via-blue-100/50 to-transparent blur-md" />
            <div className="absolute top-3 -right-64 w-80 h-2 bg-gradient-to-r from-cyan-100/50 via-blue-50/30 to-transparent blur-lg" />
            <div className="absolute top-3 -right-80 w-96 h-2 bg-gradient-to-r from-cyan-50/30 via-blue-25/20 to-transparent blur-xl" />
            
            {/* Coma (gas cloud around nucleus) */}
            <div className="absolute inset-0 w-12 h-12 bg-gradient-radial from-cyan-300/40 to-transparent rounded-full blur-md" />
          </div>
        </motion.div>

        {/* Space Lightning/Aurora Effects */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`space-lightning-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0],
              scaleX: [1, 1.2, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: Math.random() * 25,
              ease: "easeOut"
            }}
          >
            <div className="relative">
              <div className="w-1 h-40 bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent origin-top transform rotate-12 blur-sm" />
              <div className="w-0.5 h-24 bg-gradient-to-b from-white via-cyan-300 to-transparent origin-top transform -rotate-8 -mt-40 ml-10 blur-sm" />
              <div className="w-0.5 h-16 bg-gradient-to-b from-cyan-200 via-blue-400 to-transparent origin-top transform rotate-20 -mt-24 ml-5 blur-sm" />
            </div>
          </motion.div>
        ))}

        {/* Cosmic Rays */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`cosmic-ray-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 150],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 1 + Math.random() * 1.5,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: "linear"
            }}
          >
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent blur-sm" />
          </motion.div>
        ))}

        {/* Quantum Particle Effects */}
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={`quantum-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `${['#60a5fa', '#a78bfa', '#34d399', '#fbbf24', '#f472b6'][Math.floor(Math.random() * 5)]}`,
              width: `${0.5 + Math.random() * 1}px`,
              height: `${0.5 + Math.random() * 1}px`,
            }}
            animate={{
              x: [0, Math.random() * 300 - 150],
              y: [0, Math.random() * 300 - 150],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 12,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Deep Space Phenomena - Black Hole Effect */}
        <motion.div
          className="absolute opacity-30"
          style={{
            left: '80%',
            top: '20%',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/50 to-black rounded-full" />
            <div className="absolute inset-2 bg-gradient-radial from-transparent via-indigo-800/60 to-black rounded-full" />
            <div className="absolute inset-4 bg-black rounded-full" />
            {/* Accretion disk */}
            <div className="absolute inset-0 border-2 border-orange-400/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-1 border border-yellow-500/20 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
          </div>
        </motion.div>

        {/* Galactic Spiral Arms */}
        <motion.div
          className="absolute inset-0 opacity-15"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        >
          <svg width="100%" height="100%" className="text-purple-400/40">
            <path
              d="M 100,100 Q 300,200 600,300 T 1000,500 T 1400,700"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.4"
            />
            <path
              d="M 100,100 Q 400,150 800,250 T 1400,450"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.3"
            />
            <path
              d="M 100,100 Q 200,300 500,400 T 900,600 T 1300,800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.2"
            />
          </svg>
        </motion.div>

        {/* Overlay effects for depth and atmosphere */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 0%, transparent 40%),
              radial-gradient(circle at 75% 75%, rgba(138, 43, 226, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.04) 0%, transparent 30%),
              radial-gradient(circle at 100% 50%, rgba(255, 20, 147, 0.03) 0%, transparent 40%)
            `,
            mixBlendMode: 'screen'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between p-3 md:p-4 bg-black/30 backdrop-blur-md border-b border-cyan-400/30">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Compass className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <div>
              <h1 className="text-white font-black text-lg md:text-xl">
                {language === 'en' ? "Captain's Cockpit" : language === 'hi' ? 'कैप्टन कॉकपिट' : 'କ୍ୟାପଟେନ କକପିଟ'}
              </h1>
              <p className="text-blue-200 text-xs md:text-sm">
                {language === 'en' ? 'Knowledge Universe Explorer' : language === 'hi' ? 'ज्ञान ब्रह्मांड अन्वेषक' : 'ଜ୍ଞାନ ବ୍ରହ୍ମାଣ୍ଡ ଅନ୍ୱେଷଣକାରୀ'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg flex items-center justify-center border border-cyan-400/50"
            >
              <HelpCircle className="w-5 h-5 text-cyan-400" />
            </motion.button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="flex-1 p-3 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Left Panel - Ship Status */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6 order-2 lg:order-1">
            <EnergyCore currentXP={currentXP} maxXP={maxXP} level={user.level || 1} />
            <CockpitControls user={user} language={language} onLogout={onLogout} />
          </div>

          {/* Center Panel - Holographic Planet Map */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-black/30 rounded-2xl p-4 md:p-8 border-2 border-cyan-400/50 shadow-2xl min-h-[400px] md:min-h-[600px] relative overflow-hidden backdrop-blur-sm">
              {/* Holographic Grid Background */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" className="text-cyan-400">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <motion.h2 
                    className="text-white font-black text-2xl mb-2 flex items-center justify-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                      <Globe className="w-6 h-6 mr-3 text-cyan-400" />
                    </motion.div>
                    {language === 'en' ? 'Knowledge Universe Map' : 
                     language === 'hi' ? 'ज्ञान ब्रह्मांड मानचित्र' : 
                     'ଜ୍ଞାନ ବ୍ରହ୍ମାଣ୍ଡ ମାନଚିତ୍ର'}
                  </motion.h2>
                  <motion.p 
                    className="text-blue-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {language === 'en' ? 'Choose your learning destination' : 
                     language === 'hi' ? 'अपना शिक्षण गंतव्य चुनें' : 
                     'ଆପଣଙ୍କର ଶିକ୍ଷଣ ଗନ୍ତବ୍ୟ ବାଛନ୍ତୁ'}
                  </motion.p>
                </div>

                {/* Planets Grid */}
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 mb-6 md:mb-8">
                  {planets.map((planet, index) => (
                    <PlanetComponent
                      key={planet.id}
                      planet={planet}
                      language={language}
                      onSelect={handlePlanetSelect}
                      index={index}
                    />
                  ))}
                </div>

                {/* Connection Lines between planets */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="connectionGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(96, 165, 250, 0.3)" />
                      <stop offset="50%" stopColor="rgba(139, 92, 246, 0.6)" />
                      <stop offset="100%" stopColor="rgba(96, 165, 250, 0.3)" />
                    </linearGradient>
                  </defs>
                  
                  <motion.path
                    d="M 180 280 Q 400 200 620 280"
                    fill="none"
                    stroke="url(#connectionGlow)"
                    strokeWidth="2"
                    strokeDasharray="10,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Panel - Mission Status & LEO */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6 order-3">
            {/* LEO Assistant */}
            <AnimatePresence>
              {showLeoMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="bg-black/40 rounded-xl p-4 border border-orange-400/30 relative backdrop-blur-sm"
                >
                  <button
                    onClick={() => setShowLeoMessage(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg leading-none"
                  >
                    <span className="sr-only">Close</span>
                    ×
                  </button>
                  
                  <div className="flex items-start space-x-3">
                    <LeoMascot mood="explaining" size="md" />
                    <div className="flex-1">
                      <h4 className="text-orange-300 font-bold text-sm mb-2 flex items-center">
                        LEO says:
                        <Sparkles className="w-3 h-3 ml-1" />
                      </h4>
                      <p className="text-white text-sm leading-relaxed">
                        {getLeoMessage()}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setShowLeoMessage(false)}
                    size="sm"
                    className="w-full mt-3 bg-orange-500/20 border border-orange-400/50 text-orange-300 hover:bg-orange-500/30"
                  >
                    {language === 'en' ? "Got it, LEO!" : language === 'hi' ? "समझ गया, LEO!" : "ବୁଝିଗଲି, LEO!"}
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <RecentMissions language={language} />

            {/* Quick Stats */}
            <div className="bg-black/40 rounded-xl p-4 border border-cyan-400/30 backdrop-blur-sm">
              <h4 className="text-white font-bold mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-cyan-400" />
                {language === 'en' ? 'Mission Stats' : language === 'hi' ? 'मिशन आंकड़े' : 'ମିଶନ ପରିସଂଖ୍ୟାନ'}
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  className="bg-blue-500/20 rounded-lg p-3 text-center border border-blue-400/30 hover:bg-blue-500/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-white font-bold">12</p>
                  <p className="text-blue-200 text-xs">
                    {language === 'en' ? 'Completed' : language === 'hi' ? 'पूर्ण' : 'ସମ୍ପୂର୍ଣ୍ଣ'}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-green-500/20 rounded-lg p-3 text-center border border-green-400/30 hover:bg-green-500/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <p className="text-white font-bold">8</p>
                  <p className="text-green-200 text-xs">
                    {language === 'en' ? 'In Progress' : language === 'hi' ? 'प्रगति में' : 'ପ୍ରଗତିରେ'}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* N.E.I.L. Assistant */}
            <div className="bg-black/40 rounded-xl p-4 border border-cyan-400/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <NeilRobot animation="float" />
                <div>
                  <h4 className="text-cyan-300 font-bold">N.E.I.L.</h4>
                  <p className="text-blue-200 text-xs">Navigation Assistant</p>
                </div>
              </div>
              
              <div className="bg-cyan-400/10 rounded-lg p-3 border border-cyan-400/20">
                <p className="text-white text-sm">
                  {language === 'en' ? "All systems operational, Captain! Learning modules are ready for exploration." : 
                   language === 'hi' ? "सभी सिस्टम चालू हैं, कैप्टन! शिक्षण मॉड्यूल अन्वेषण के लिए तैयार हैं।" :
                   "ସମସ୍ତ ସିଷ୍ଟମ୍ କାର୍ଯ୍ୟକ୍ଷମ, କ୍ୟାପଟେନ! ଶିକ୍ଷଣ ମଡ୍ୟୁଲଗୁଡ଼ିକ ଅନ୍ୱେଷଣ ପାଇଁ ପ୍ରସ୍ତୁତ।"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50 border border-orange-400/50"
            onClick={() => setShowLeoMessage(true)}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 border border-cyan-400/50"
          >
            <Map className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Achievement Notification */}
        <AnimatePresence>
          {user.xp && user.xp > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className="fixed top-20 right-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 shadow-2xl max-w-sm z-50 border border-yellow-400/50"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <Trophy className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h4 className="text-white font-bold">
                    {language === 'en' ? 'Welcome Back, Captain!' : language === 'hi' ? 'वापस स्वागत, कैप्टन!' : 'ଫେରି ଆସିବାକୁ ସ୍ୱାଗତ, କ୍ୟାପଟେନ!'}
                  </h4>
                  <p className="text-orange-100 text-sm">
                    {language === 'en' ? `Current XP: ${currentXP}` : language === 'hi' ? `वर्तमान XP: ${currentXP}` : `ବର୍ତ୍ତମାନ XP: ${currentXP}`}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}