import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  RotateCcw, 
  Play, 
  Pause, 
  FastForward, 
  Rewind,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Rocket,
  Target,
  Zap,
  Award,
  BookOpen,
  Gamepad2,
  HelpCircle,
  X,
  Sparkles,
  Thermometer,
  ChefHat,
  Building2,
  Plus,
  Minus,
  Equal,
  RotateCcw as Reset,
  Palette,
  X as XIcon
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import type { Language } from '../types/onboarding';

interface NumberSystemsPageProps {
  language: Language;
  onBack: () => void;
}

interface Stage {
  id: number;
  title: string;
  description: string;
  visual: React.ReactNode;
}

export function NumberSystemsPage({ language, onBack }: NumberSystemsPageProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState('learn');
  
  // Challenge mode state
  const [spaceshipPosition, setSpaceshipPosition] = useState(0);
  const [targetCoordinate, setTargetCoordinate] = useState(-2.5);
  const [missionResult, setMissionResult] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [missionsCompleted, setMissionsCompleted] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const numberLineRef = useRef<HTMLDivElement>(null);

  // Hotspot state
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Sandbox mode state
  const [sandboxNumbers, setSandboxNumbers] = useState<Array<{id: string, value: number, x: number, y: number}>>([]);
  const [currentGoal, setCurrentGoal] = useState<{type: string, target: number, description: string} | null>(null);
  const [sandboxResult, setSandboxResult] = useState<number | null>(null);
  const [goalAchieved, setGoalAchieved] = useState(false);
  const sandboxRef = useRef<HTMLDivElement>(null);

  const translations = {
    title: {
      en: 'Understanding Number Systems',
      hi: 'संख्या प्रणाली को समझना',
      or: 'ସଂଖ୍ୟା ପ୍ରଣାଳୀ ବୁଝିବା'
    },
    back: {
      en: 'Back to Dashboard',
      hi: 'डैशबोर्ड पर वापस',
      or: 'ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ'
    },
    learnMode: {
      en: 'Learn Mode',
      hi: 'सीखने का मोड',
      or: 'ଶିଖିବା ମୋଡ୍'
    },
    challengeMode: {
      en: 'Challenge Mode',
      hi: 'चुनौती मोड',
      or: 'ଚ୍ୟାଲେଞ୍ଜ ମୋଡ୍'
    },
    missionControl: {
      en: 'Mission Control',
      hi: 'मिशन नियंत्रण',
      or: 'ମିସନ୍ ନିୟନ୍ତ୍ରଣ'
    },
    navigateTo: {
      en: 'Navigate to coordinate',
      hi: 'निर्देशांक पर जाएं',
      or: 'ସଂଯୋଜନାଙ୍କକୁ ଯାଆନ୍ତୁ'
    },
    currentPosition: {
      en: 'Current Position',
      hi: 'वर्तमान स्थिति',
      or: 'ବର୍ତ୍ତମାନ ସ୍ଥିତି'
    },
    launch: {
      en: 'Launch!',
      hi: 'प्रक्षेपण!',
      or: 'ଉତକ୍ଷେପଣ!'
    },
    missionAccomplished: {
      en: 'Mission Accomplished!',
      hi: 'मिशन पूरा!',
      or: 'ମିସନ୍ ସମ୍ପନ୍ନ!'
    },
    navigationError: {
      en: 'Navigation Error!',
      hi: 'नेविगेशन त्रुटि!',
      or: 'ନେଭିଗେସନ୍ ତ୍ରୁଟି!'
    },
    coordinateOff: {
      en: 'Coordinate is off by',
      hi: 'निर्देशांक से अंतर',
      or: 'ସଂଯୋଜନାଙ୍କ ଅସନ୍ତୁଷ୍ଟ'
    },
    tryAgain: {
      en: 'Try again!',
      hi: 'फिर कोशिश करें!',
      or: 'ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ!'
    },
    newMission: {
      en: 'New Mission',
      hi: 'नया मिशन',
      or: 'ନୂତନ ମିସନ୍'
    },
    numberType: {
      en: 'Number Type',
      hi: 'संख्या प्रकार',
      or: 'ସଂଖ୍ୟା ପ୍ରକାର'
    },
    sandboxMode: {
      en: 'Sandbox Mode',
      hi: 'सैंडबॉक्स मोड',
      or: 'ସ୍ୟାଣ୍ଡବକ୍ସ ମୋଡ୍'
    },
    toolbox: {
      en: 'Number Toolbox',
      hi: 'संख्या टूलबॉक्स',
      or: 'ସଂଖ୍ୟା ଟୁଲବକ୍ସ'
    },
    creationZone: {
      en: 'Your Creation Zone',
      hi: 'आपका रचना क्षेत्र',
      or: 'ଆପଣଙ୍କ ସୃଷ୍ଟି କ୍ଷେତ୍ର'
    },
    goal: {
      en: 'Goal',
      hi: 'लक्ष्य',
      or: 'ଲକ୍ଷ୍ୟ'
    },
    goalAchieved: {
      en: 'Goal Achieved!',
      hi: 'लक्ष्य प्राप्त!',
      or: 'ଲକ୍ଷ୍ୟ ହାସଲ!'
    },
    newGoal: {
      en: 'New Goal',
      hi: 'नया लक्ष्य',
      or: 'ନୂତନ ଲକ୍ଷ୍ୟ'
    },
    clearAll: {
      en: 'Clear All',
      hi: 'सब साफ़ करें',
      or: 'ସବୁ ସାଫ କରନ୍ତୁ'
    },
    realWorldConnection: {
      en: 'Real-World Connection',
      hi: 'वास्तविक दुनिया का संबंध',
      or: 'ବାସ୍ତବ ଜଗତ ସଂଯୋଗ'
    },
    play: {
      en: 'Play',
      hi: 'चलाएं',
      or: 'ଚଲାନ୍ତୁ'
    },
    pause: {
      en: 'Pause',
      hi: 'रोकें',
      or: 'ବନ୍ଦ କରନ୍ତୁ'
    },
    speedUp: {
      en: 'Speed Up',
      hi: 'तेज़ करें',
      or: 'ତୀବ୍ର କରନ୍ତୁ'
    },
    slowDown: {
      en: 'Slow Down',
      hi: 'धीमा करें',
      or: 'ଧୀର କରନ୍ତୁ'
    },
    nextStage: {
      en: 'Next Stage',
      hi: 'अगला चरण',
      or: 'ପରବର୍ତ୍ତୀ ପର୍ଯ୍ୟାୟ'
    },
    prevStage: {
      en: 'Previous Stage',
      hi: 'पिछला चरण',
      or: 'ପୂର୍ବବର୍ତ୍ତୀ ପର୍ଯ୍ୟାୟ'
    },
    restartAll: {
      en: 'Restart All',
      hi: 'सब पुनः शुरू करें',
      or: 'ସବୁ ପୁନଃ ଆରମ୍ଭ କରନ୍ତୁ'
    }
  };

  const getT = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  // Hotspot content
  const hotspotContent = {
    naturalNumbers: {
      en: {
        title: "Natural Numbers in Daily Life",
        content: "Count everything around you! Natural numbers help us count students in class (35 students), pages in a book (245 pages), or runs scored in cricket (127 runs). They're the foundation of all counting!",
        icon: <Sparkles className="h-4 w-4" />
      },
      hi: {
        title: "दैनिक जीवन में प्राकृतिक संख्याएं",
        content: "अपने आसपास की हर चीज़ को गिनें! प्राकृतिक संख्याएं हमें कक्षा में छात्रों (35 छात्र), किताब के पन्ने (245 पन्ने), या क्रिकेट में बनाए गए रन (127 रन) गिनने में मदद करती हैं। ये सभी गिनती की आधारशिला हैं!",
        icon: <Sparkles className="h-4 w-4" />
      },
      or: {
        title: "ଦୈନନ୍ଦିନ ଜୀବନରେ ପ୍ରାକୃତିକ ସଂଖ୍ୟା",
        content: "ଆପଣଙ୍କ ଚାରିପାଖରେ ଥିବା ସବୁକିଛି ଗଣନା କରନ୍ତୁ! ପ୍ରାକୃତିକ ସଂଖ୍ୟା ଆମକୁ ଶ୍ରେଣୀରେ ଛାତ୍ରମାନଙ୍କୁ (35 ଛାତ୍ର), ବହିର ପୃଷ୍ଠା (245 ପୃଷ୍ଠା), କିମ୍ବା କ୍ରିକେଟରେ ସ୍କୋର (127 ରନ୍) ଗଣନା କରିବାରେ ସାହାଯ୍ୟ କରେ। ଏଗୁଡ଼ିକ ସମସ୍ତ ଗଣନାର ମୂଳଦୁଆ!",
        icon: <Sparkles className="h-4 w-4" />
      }
    },
    integers: {
      en: {
        title: "Temperature & Elevation",
        content: "Brrr! Integers are used for temperature. Delhi's winter can hit 4°C, but the Siachen Glacier can drop below -50°C! They also measure height above sea level (+8848m for Mount Everest) or below (-411m for the Dead Sea).",
        icon: <Thermometer className="h-4 w-4" />
      },
      hi: {
        title: "तापमान और ऊंचाई",
        content: "ठंड! पूर्णांक तापमान के लिए उपयोग होते हैं। दिल्ली की सर्दी में 4°C हो सकता है, लेकिन सियाचिन ग्लेशियर -50°C से नीचे जा सकता है! ये समुद्र तल से ऊंचाई भी मापते हैं (+8848m माउंट एवरेस्ट के लिए) या नीचे (-411m मृत सागर के लिए)।",
        icon: <Thermometer className="h-4 w-4" />
      },
      or: {
        title: "ତାପମାତ୍ରା ଏବଂ ଉଚ୍ଚତା",
        content: "ଥଣ୍ଡା! ପୂର୍ଣ୍ଣାଙ୍କ ତାପମାତ୍ରା ପାଇଁ ବ୍ୟବହୃତ ହୁଏ। ଦିଲ୍ଲୀର ଶୀତ 4°C ହୋଇପାରେ, କିନ୍ତୁ ସିୟାଚିନ୍ ଗ୍ଲେସିଆର -50°C ତଳେ ଯାଇପାରେ! ଏମାନେ ସମୁଦ୍ର ପତ୍ତନରୁ ଉଚ୍ଚତା ମଧ୍ୟ ମାପନ୍ତି (+8848m ମାଉଣ୍ଟ ଏଭରେଷ୍ଟ ପାଇଁ) କିମ୍ବା ତଳେ (-411m ମୃତ ସାଗର ପାଇଁ)।",
        icon: <Thermometer className="h-4 w-4" />
      }
    },
    rational: {
      en: {
        title: "Cooking & Recipes",
        content: "Hungry? Rational numbers are the heart of recipes! Making biryani might require ¾ teaspoon of turmeric, ½ cup of basmati rice per person, or 2.5 cups of water. Every delicious meal uses fractions and decimals!",
        icon: <ChefHat className="h-4 w-4" />
      },
      hi: {
        title: "खाना बनाना और व्यंजन",
        content: "भूखे हैं? परिमेय संख्याएं व्यंजनों का दिल हैं! बिरयानी बनाने में ¾ चम्मच हल्दी, प्रति व्यक्ति ½ कप बासमती चावल, या 2.5 कप पानी की जरूरत हो सकती है। हर स्वादिष्ट भोजन में भिन्न और दशमलव का उपयोग होता है!",
        icon: <ChefHat className="h-4 w-4" />
      },
      or: {
        title: "ରାନ୍ଧିବା ଏବଂ ରେସିପି",
        content: "ଭୋକିଲା? ପରିମେୟ ସଂଖ୍ୟା ରେସିପିର ହୃଦୟ! ବିରିୟାନି ତିଆରି କରିବା ପାଇଁ ¾ ଚାମଚ ହଳଦୀ, ପ୍ରତି ବ୍ୟକ୍ତିଙ୍କ ପାଇଁ ½ କପ୍ ବାସମତୀ ଚାଉଳ, କିମ୍ବା 2.5 କପ୍ ପାଣି ଦରକାର ହୋଇପାରେ। ପ୍ରତ୍ୟେକ ସ୍ୱାଦିଷ୍ଟ ଖାଦ୍ୟରେ ଭଗ୍ନାଂଶ ଏବଂ ଦଶମିକ ବ୍ୟବହାର ହୁଏ!",
        icon: <ChefHat className="h-4 w-4" />
      }
    },
    irrational: {
      en: {
        title: "Architecture & Engineering",
        content: "Look around! Engineers used the irrational number π to design everything circular, from the wheels on a bus to the dome of the Rashtrapati Bhavan. √2 helps in calculating diagonal distances in buildings and city planning!",
        icon: <Building2 className="h-4 w-4" />
      },
      hi: {
        title: "वास्तुकला और इंजीनियरिंग",
        content: "चारों ओर देखें! इंजीनियरों ने अपरिमेय संख्या π का उपयोग करके गोलाकार सब कुछ डिज़ाइन किया, बस के पहियों से लेकर राष्ट्रपति भवन के गुंबद तक। √2 इमारतों और शहर की योजना में विकर्ण दूरी की गणना में मदद करता है!",
        icon: <Building2 className="h-4 w-4" />
      },
      or: {
        title: "ସ୍ଥାପତ୍ୟ ଏବଂ ଇଞ୍ଜିନିୟରିଂ",
        content: "ଚାରିପାଖକୁ ଦେଖନ୍ତୁ! ଇଞ୍ଜିନିୟରମାନେ ଅପରିମେୟ ସଂଖ୍ୟା π ବ୍ୟବହାର କରି ସବୁ ବୃତ୍ତାକାର ଜିନିଷ ଡିଜାଇନ୍ କଲେ, ବସ୍ର ଚକ୍ରରୁ ଆରମ୍ଭ କରି ରାଷ୍ଟ୍ରପତି ଭବନର ଗୋଲାକାର ଛାତ ପର୍ଯ୍ୟନ୍ତ। √2 ଅଟ୍ଟାଳିକା ଏବଂ ସହର ଯୋଜନାରେ କର୍ଣ୍ଣ ଦୂରତା ଗଣନା କରିବାରେ ସାହାଯ୍ୟ କରେ!",
        icon: <Building2 className="h-4 w-4" />
      }
    }
  };

  // Hotspot component
  const Hotspot = ({ id, onClick }: { id: string, onClick: () => void }) => (
    <motion.button
      onClick={onClick}
      className="absolute w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10"
      animate={{
        scale: [1, 1.2, 1],
        boxShadow: [
          '0 4px 6px rgba(251, 191, 36, 0.3)',
          '0 6px 12px rgba(251, 191, 36, 0.5)',
          '0 4px 6px rgba(251, 191, 36, 0.3)'
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.9 }}
    >
      <HelpCircle className="h-3 w-3 text-yellow-800" />
    </motion.button>
  );

  // Enhanced Stage Visual Components with Hotspots
  const Stage1Visual = () => (
    <div className="flex items-center justify-center h-64 relative">
      <motion.div
        className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center relative"
        animate={!isPaused ? { 
          scale: [1, 1.1, 1],
          boxShadow: [
            '0 0 0 0 rgba(249, 115, 22, 0.7)',
            '0 0 0 20px rgba(249, 115, 22, 0)',
            '0 0 0 0 rgba(249, 115, 22, 0)'
          ]
        } : {}}
        transition={{ 
          duration: 2 / animationSpeed,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <span className="text-2xl font-bold text-white">1</span>
      </motion.div>
      
      {/* Hotspot for Natural Numbers */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <Hotspot id="naturalNumbers" onClick={() => setActiveHotspot('naturalNumbers')} />
      </div>
      
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-orange-400 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transformOrigin: '0 0'
          }}
          animate={!isPaused ? {
            x: Math.cos((i * Math.PI * 2) / 8) * 80,
            y: Math.sin((i * Math.PI * 2) / 8) * 80,
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5]
          } : {}}
          transition={{
            duration: 3 / animationSpeed,
            repeat: Infinity,
            delay: (i * 0.2) / animationSpeed
          }}
        />
      ))}
    </div>
  );

  const Stage2Visual = () => (
    <div className="flex items-center justify-center h-64 relative">
      <div className="flex items-center space-x-4">
        <motion.div
          className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 / animationSpeed }}
        >
          <span className="text-lg font-bold text-white">1,2,3...</span>
        </motion.div>
        
        <motion.div
          className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center"
          initial={{ x: -100, opacity: 0 }}
          animate={!isPaused ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1 / animationSpeed, delay: 0.5 / animationSpeed }}
        >
          <span className="text-xl font-bold text-white">0</span>
        </motion.div>
      </div>
      
      <motion.div
        className="absolute border-2 border-green-300 bg-green-50 rounded-xl"
        style={{ width: '200px', height: '100px' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={!isPaused ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8 / animationSpeed, delay: 1 / animationSpeed }}
      />
    </div>
  );

  const Stage3Visual = () => (
    <div className="flex items-center justify-center h-64 relative">
      <div className="flex items-center space-x-6">
        <motion.div
          className="flex items-center space-x-2"
          initial={{ x: -150, opacity: 0 }}
          animate={!isPaused ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1 / animationSpeed, delay: 0.5 / animationSpeed }}
        >
          {['-3', '-2', '-1'].map((num, i) => (
            <div key={i} className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">{num}</span>
            </div>
          ))}
        </motion.div>
        
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">0</span>
          </div>
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">1,2...</span>
          </div>
        </div>
      </div>
      
      {/* Hotspot for Integers */}
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <Hotspot id="integers" onClick={() => setActiveHotspot('integers')} />
      </div>
      
      <motion.div
        className="absolute border-2 border-purple-300 bg-purple-50 rounded-xl"
        style={{ width: '320px', height: '120px' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={!isPaused ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8 / animationSpeed, delay: 1.2 / animationSpeed }}
      />
    </div>
  );

  const Stage4Visual = () => (
    <div className="flex items-center justify-center h-64 relative">
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-1">
          <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">-</span>
          </div>
          <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">0</span>
          </div>
          <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">+</span>
          </div>
        </div>
        
        {['1/2', '3/4', '0.5', '-1/3'].map((frac, i) => (
          <motion.div
            key={i}
            className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center"
            initial={{ opacity: 0, scale: 0, rotate: 180 }}
            animate={!isPaused ? { 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: [0, -10, 0]
            } : { opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8 / animationSpeed, 
              delay: (i * 0.3 + 0.5) / animationSpeed,
              y: { duration: 2 / animationSpeed, repeat: Infinity, delay: (i * 0.5) / animationSpeed }
            }}
          >
            <span className="text-xs font-bold text-white">{frac}</span>
          </motion.div>
        ))}
      </div>
      
      {/* Hotspot for Rational Numbers */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <Hotspot id="rational" onClick={() => setActiveHotspot('rational')} />
      </div>
      
      <motion.div
        className="absolute border-2 border-teal-300 bg-teal-50 rounded-2xl"
        style={{ width: '400px', height: '140px' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={!isPaused ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1 / animationSpeed, delay: 1.5 / animationSpeed }}
      />
    </div>
  );

  const Stage5Visual = () => (
    <div className="flex items-center justify-center h-64 relative">
      <div className="flex items-center justify-center space-x-3">
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 bg-red-300 rounded-full"></div>
          <div className="w-6 h-6 bg-blue-300 rounded-full"></div>
          <div className="w-6 h-6 bg-orange-300 rounded-full"></div>
          <div className="w-8 h-8 bg-teal-300 rounded-lg"></div>
        </div>
        
        {['π', '√2', 'e'].map((symbol, i) => (
          <motion.div
            key={i}
            className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center relative"
            initial={{ opacity: 0, scale: 0 }}
            animate={!isPaused ? { 
              opacity: 1, 
              scale: 1,
              boxShadow: [
                '0 0 0 0 rgba(99, 102, 241, 0.7)',
                '0 0 20px 10px rgba(99, 102, 241, 0.3)',
                '0 0 0 0 rgba(99, 102, 241, 0.7)'
              ]
            } : { opacity: 1, scale: 1 }}
            transition={{ 
              duration: 1 / animationSpeed, 
              delay: (i * 0.4 + 1) / animationSpeed,
              boxShadow: { duration: 3 / animationSpeed, repeat: Infinity, delay: (i * 0.5) / animationSpeed }
            }}
          >
            <span className="text-lg font-bold text-white">{symbol}</span>
          </motion.div>
        ))}
      </div>
      
      {/* Hotspot for Irrational Numbers */}
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <Hotspot id="irrational" onClick={() => setActiveHotspot('irrational')} />
      </div>
      
      <motion.div
        className="absolute border-3 border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl"
        style={{ width: '480px', height: '160px' }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={!isPaused ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2 / animationSpeed, delay: 2 / animationSpeed }}
      />
    </div>
  );

  const stages: Stage[] = [
    {
      id: 1,
      title: language === 'en' ? 'Stage 1: Natural Numbers' : language === 'hi' ? 'चरण 1: प्राकृतिक संख्याएं' : 'ପର୍ଯ୍ୟାୟ ୧: ପ୍ରାକୃତିକ ସଂଖ୍ୟା',
      description: language === 'en' ? 'Counting numbers starting from 1.' : language === 'hi' ? '1 से शुरू होने वाली गिनती की संख्याएं।' : '୧ରୁ ଆରମ୍ଭ ହେଉଥିବା ଗଣନା ସଂଖ୍ୟା।',
      visual: <Stage1Visual />
    },
    {
      id: 2,
      title: language === 'en' ? 'Stage 2: Whole Numbers' : language === 'hi' ? 'चरण 2: पूर्ण संख्याएं' : 'ପର୍ଯ୍ୟାୟ ୨: ସମ୍ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା',
      description: language === 'en' ? 'Natural numbers plus zero.' : language === 'hi' ? 'प्राकृतिक संख्याएं और शून्य।' : 'ପ୍ରାକୃତିକ ସଂଖ୍ୟା ଏବଂ ଶୂନ୍ୟ।',
      visual: <Stage2Visual />
    },
    {
      id: 3,
      title: language === 'en' ? 'Stage 3: Integers' : language === 'hi' ? 'चरण 3: पूर्णांक' : 'ପର୍ଯ୍ୟାୟ ୩: ପୂର୍ଣ୍ଣାଙ୍କ',
      description: language === 'en' ? 'Whole numbers plus negative counting numbers.' : language === 'hi' ? 'पूर्ण संख्याएं और ऋणात्मक गिनती संख्याएं।' : 'ସମ୍ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା ଏବଂ ଋଣାତ୍ମକ ଗଣନା ସଂଖ୍ୟା।',
      visual: <Stage3Visual />
    },
    {
      id: 4,
      title: language === 'en' ? 'Stage 4: Rational Numbers' : language === 'hi' ? 'चरण 4: परिमेय संख्याएं' : 'ପର୍ଯ୍ୟାୟ ୪: ପରିମେୟ ସଂଖ୍ୟା',
      description: language === 'en' ? 'Numbers that can be expressed as a fraction p/q, where q ≠ 0.' : language === 'hi' ? 'संख्याएं जो p/q के रूप में व्यक्त की जा सकती हैं, जहां q ≠ 0।' : 'ସଂଖ୍ୟା ଯାହା p/q ଭାବରେ ପ୍ରକାଶ କରାଯାଇପାରେ, ଯେଉଁଠାରେ q ≠ 0।',
      visual: <Stage4Visual />
    },
    {
      id: 5,
      title: language === 'en' ? 'Stage 5: Real Numbers' : language === 'hi' ? 'चरण 5: वास्तविक संख्याएं' : 'ପର୍ଯ୍ୟାୟ ୫: ବାସ୍ତବ ସଂଖ୍ୟା',
      description: language === 'en' ? 'All rational and irrational numbers. Every point on a number line.' : language === 'hi' ? 'सभी परिमेय और अपरिमेय संख्याएं। संख्या रेखा पर हर बिंदु।' : 'ସମସ୍ତ ପରିମେୟ ଏବଂ ଅପରିମେୟ ସଂଖ୍ୟା। ସଂଖ୍ୟା ରେଖା ଉପରେ ପ୍ରତ୍ୟେକ ବିନ୍ଦୁ।',
      visual: <Stage5Visual />
    }
  ];

  const currentStageData = stages[currentStage - 1];

  // Challenge mode functions
  const generateNewMission = () => {
    const missions = [
      -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, // Decimals
      -3, -2, -1, 0, 1, 2, 3, 4, // Integers
      -2.25, -1.75, 0.25, 1.75, 2.75, // Quarter points
      -1.33, 0.67, 1.33, 2.67 // Thirds (approximated)
    ];
    const randomTarget = missions[Math.floor(Math.random() * missions.length)];
    setTargetCoordinate(randomTarget);
    setSpaceshipPosition(0);
    setMissionResult(null);
  };

  const getNumberType = (num: number) => {
    if (num === 0) return language === 'en' ? 'Whole Number' : language === 'hi' ? 'पूर्ण संख्या' : 'ସମ୍ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା';
    if (Number.isInteger(num)) {
      if (num > 0) return language === 'en' ? 'Natural Number' : language === 'hi' ? 'प्राकृतिक संख्या' : 'ପ୍ରାକୃତିକ ସଂଖ୍ୟା';
      return language === 'en' ? 'Integer' : language === 'hi' ? 'पूर्णांक' : 'ପୂର୍ଣ୍ଣାଙ୍କ';
    }
    return language === 'en' ? 'Rational Number' : language === 'hi' ? 'परिमेय संख्या' : 'ପରିମେୟ ସଂଖ୍ୟା';
  };

  const launchSpaceship = () => {
    const difference = Math.abs(spaceshipPosition - targetCoordinate);
    const tolerance = 0.1;
    
    if (difference <= tolerance) {
      setMissionResult('success');
      setScore(prev => prev + 10);
      setMissionsCompleted(prev => prev + 1);
      setTimeout(() => {
        generateNewMission();
      }, 2000);
    } else {
      setMissionResult(`error:${difference.toFixed(2)}`);
    }
  };

  // Animation controls
  const togglePlayPause = () => {
    setIsPaused(!isPaused);
    setIsPlaying(!isPaused);
  };

  const speedUpAnimation = () => {
    setAnimationSpeed(prev => Math.min(prev + 0.25, 3));
  };

  const slowDownAnimation = () => {
    setAnimationSpeed(prev => Math.max(prev - 0.25, 0.25));
  };

  const goToNextStage = () => {
    if (currentStage < 5) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStage(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const goToPrevStage = () => {
    if (currentStage > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStage(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const restartAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStage(1);
      setIsAnimating(false);
      setIsPaused(false);
      setIsPlaying(true);
    }, 300);
  };

  // Initialize first mission and sandbox goal
  useEffect(() => {
    generateNewMission();
    generateNewSandboxGoal();
  }, []);

  // Sandbox mode functions
  const sandboxGoals = [
    {
      type: 'sum',
      target: -2.5,
      description: {
        en: "Create a combination of numbers that adds up to -2.5",
        hi: "ऐसी संख्याओं का संयोजन बनाएं जो -2.5 के बराबर हो",
        or: "ସଂଖ୍ୟାଗୁଡ଼ିକର ଏକ ସଂଯୋଜନ ତିଆରି କରନ୍ତୁ ଯାହା -2.5 ସହିତ ସମାନ"
      }
    },
    {
      type: 'average',
      target: 0,
      description: {
        en: "Build a solar system using 3 numbers where the average temperature is less than 0",
        hi: "3 संख्याओं का उपयोग करके एक सौर मंडल बनाएं जहां औसत तापमान 0 से कम हो",
        or: "3 ଟି ସଂଖ୍ୟା ବ୍ୟବହାର କରି ଏକ ସୌର ମଣ୍ଡଳ ନିର୍ମାଣ କରନ୍ତୁ ଯେଉଁଠାରେ ହାରାହାରି ତାପମାତ୍ରା 0 ରୁ କମ୍"
      }
    },
    {
      type: 'product',
      target: 6,
      description: {
        en: "Multiply two numbers to get exactly 6",
        hi: "दो संख्याओं को गुणा करके ठीक 6 प्राप्त करें",
        or: "ଦୁଇଟି ସଂଖ୍ୟାକୁ ଗୁଣ କରି ଠିକ୍ 6 ପାଆନ୍ତୁ"
      }
    },
    {
      type: 'range',
      target: 10,
      description: {
        en: "Create numbers with a range (max - min) of exactly 10",
        hi: "ठीक 10 की रेंज (अधिकतम - न्यूनतम) वाली संख्याएं बनाएं",
        or: "ଠିକ୍ 10 ର ପରିସର (ସର୍ବାଧିକ - ସର୍ବନିମ୍ନ) ସହିତ ସଂଖ୍ୟା ସୃଷ୍ଟି କରନ୍ତୁ"
      }
    }
  ];

  const availableNumbers = [-5, -3, -2.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, -1.5, 7, -4];

  const generateNewSandboxGoal = () => {
    const randomGoal = sandboxGoals[Math.floor(Math.random() * sandboxGoals.length)];
    setCurrentGoal(randomGoal);
    setGoalAchieved(false);
    setSandboxNumbers([]);
    setSandboxResult(null);
  };

  const addNumberToSandbox = (value: number) => {
    if (sandboxNumbers.length >= 6) return; // Limit numbers
    
    const newNumber = {
      id: `num-${Date.now()}-${Math.random()}`,
      value,
      x: Math.random() * 200 + 50,
      y: Math.random() * 100 + 50
    };
    
    setSandboxNumbers(prev => [...prev, newNumber]);
  };

  const calculateSandboxResult = () => {
    if (sandboxNumbers.length === 0 || !currentGoal) return null;
    
    const values = sandboxNumbers.map(n => n.value);
    
    switch (currentGoal.type) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'average':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 'product':
        return values.length >= 2 ? values.slice(0, 2).reduce((prod, val) => prod * val, 1) : null;
      case 'range':
        return values.length >= 2 ? Math.max(...values) - Math.min(...values) : null;
      default:
        return null;
    }
  };

  const checkGoalAchievement = () => {
    const result = calculateSandboxResult();
    if (result === null || !currentGoal) return;
    
    const tolerance = 0.1;
    let achieved = false;
    
    switch (currentGoal.type) {
      case 'sum':
      case 'product':
      case 'range':
        achieved = Math.abs(result - currentGoal.target) <= tolerance;
        break;
      case 'average':
        achieved = result < currentGoal.target;
        break;
    }
    
    setGoalAchieved(achieved);
    setSandboxResult(result);
  };

  // Update sandbox result when numbers change
  useEffect(() => {
    checkGoalAchievement();
  }, [sandboxNumbers, currentGoal]);

  const clearSandbox = () => {
    setSandboxNumbers([]);
    setSandboxResult(null);
    setGoalAchieved(false);
  };

  const removeNumberFromSandbox = (id: string) => {
    setSandboxNumbers(prev => prev.filter(n => n.id !== id));
  };

  // Sandbox Mode Component
  const SandboxMode = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Toolbox */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Palette className="h-5 w-5 text-purple-600" />
              <span>{getT('toolbox')}</span>
            </h3>
            
            <div className="grid grid-cols-3 gap-2">
              {availableNumbers.map((num, index) => (
                <motion.button
                  key={index}
                  onClick={() => addNumberToSandbox(num)}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg flex items-center justify-center font-bold text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={sandboxNumbers.length >= 6}
                >
                  {num}
                </motion.button>
              ))}
            </div>
            
            <div className="mt-4 space-y-2">
              <Button
                onClick={clearSandbox}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Reset className="h-4 w-4 mr-2" />
                {getT('clearAll')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Creation Zone */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Goal Display */}
        <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">{getT('goal')}</h3>
                <p className="text-green-100">
                  {currentGoal?.description[language] || currentGoal?.description.en}
                </p>
              </div>
              <div className="text-right">
                <Button
                  onClick={generateNewSandboxGoal}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600"
                >
                  {getT('newGoal')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creation Zone */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {getT('creationZone')}
              </h3>
              <div className="flex items-center space-x-4">
                {sandboxResult !== null && (
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                    <Equal className="h-4 w-4 text-gray-600" />
                    <span className="font-bold text-lg">{sandboxResult.toFixed(2)}</span>
                  </div>
                )}
                {goalAchieved && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-2 bg-green-100 text-green-800 rounded-lg px-3 py-1"
                  >
                    <Award className="h-4 w-4" />
                    <span className="font-bold">{getT('goalAchieved')}</span>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div 
              ref={sandboxRef}
              className="relative h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden"
            >
              {sandboxNumbers.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Drag numbers here to create your solution!</p>
                  </div>
                </div>
              ) : (
                <>
                  {sandboxNumbers.map((num, index) => (
                    <motion.div
                      key={num.id}
                      drag
                      dragConstraints={sandboxRef}
                      className="absolute w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg cursor-grab active:cursor-grabbing"
                      style={{ left: num.x, top: num.y }}
                      whileHover={{ scale: 1.1 }}
                      whileDrag={{ scale: 1.2 }}
                      onClick={() => removeNumberFromSandbox(num.id)}
                      title="Click to remove"
                    >
                      {num.value}
                    </motion.div>
                  ))}
                  
                  {/* Operation symbols */}
                  {sandboxNumbers.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex items-center space-x-8">
                        {sandboxNumbers.slice(0, -1).map((_, index) => (
                          <div key={index} className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                            {currentGoal?.type === 'product' ? (
                              <XIcon className="h-4 w-4 text-yellow-800" />
                            ) : (
                              <Plus className="h-4 w-4 text-yellow-800" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>💡 {language === 'en' ? 'Tip: Click numbers to remove them, drag to reposition!' : language === 'hi' ? 'सुझाव: संख्याओं को हटाने के लिए क्लिक करें, स्थान बदलने के लिए खींचें!' : 'ଟିପ୍ସ: ସଂଖ୍ୟାଗୁଡ଼ିକୁ ହଟାଇବା ପାଇଁ କ୍ଲିକ୍ କରନ୍ତୁ, ସ୍ଥାନ ପରିବର୍ତ୍ତନ କରିବା ପାଇଁ ଟାଣନ୍ତୁ!'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{sandboxNumbers.length}</div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Numbers Used' : language === 'hi' ? 'उपयोग की गई संख्याएं' : 'ବ୍ୟବହୃତ ସଂଖ୍ୟା'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {sandboxResult !== null ? sandboxResult.toFixed(2) : '--'}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Current Result' : language === 'hi' ? 'वर्तमान परिणाम' : 'ବର୍ତ୍ତମାନ ଫଳାଫଳ'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentGoal?.target || '--'}
              </div>
              <div className="text-sm text-gray-600">
                {language === 'en' ? 'Target Value' : language === 'hi' ? 'लक्ष्य मान' : 'ଲକ୍ଷ୍ୟ ମୂଲ୍ୟ'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Challenge Mode Component
  const ChallengeMode = () => (
    <div className="space-y-6">
      {/* Mission Control */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{getT('missionControl')}</h3>
                <p className="text-blue-100">
                  {getT('navigateTo')}: <span className="font-bold text-2xl">{targetCoordinate}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-blue-100 text-sm">{getT('numberType')}</p>
                <Badge className="bg-white/20 text-white border-white/30">
                  {getNumberType(targetCoordinate)}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-blue-100 text-sm">Score</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Number Line Navigator */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            
            {/* Current Position Display */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">{getT('currentPosition')}</p>
              <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
                <Rocket className="h-4 w-4 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">{spaceshipPosition}</span>
              </div>
            </div>

            {/* Number Line */}
            <div className="relative bg-gradient-to-r from-purple-100 via-blue-100 to-green-100 rounded-xl p-6 overflow-hidden">
              {/* Cosmic background effect */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              {/* Number Line Track */}
              <div 
                ref={numberLineRef}
                className="relative h-16 bg-gray-800 rounded-full mx-4"
              >
                {/* Integer markers (starports) */}
                {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className="absolute top-0 bottom-0 flex flex-col items-center justify-center"
                    style={{ left: `${((num + 5) / 10) * 100}%` }}
                  >
                    <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-600 shadow-lg">
                      <div className="w-full h-full bg-yellow-300 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-xs font-bold text-gray-800 mt-1 bg-white/80 px-1 rounded">
                      {num}
                    </span>
                  </div>
                ))}

                {/* Target indicator */}
                <motion.div
                  className="absolute top-0 bottom-0 flex items-center justify-center"
                  style={{ left: `${((targetCoordinate + 5) / 10) * 100}%` }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-red-700 shadow-lg flex items-center justify-center">
                    <Target className="h-3 w-3 text-white" />
                  </div>
                </motion.div>

                {/* Spaceship */}
                <motion.div
                  className="absolute top-0 bottom-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
                  style={{ left: `${((spaceshipPosition + 5) / 10) * 100}%` }}
                  drag="x"
                  dragConstraints={numberLineRef}
                  dragElastic={0}
                  onDrag={(event, info) => {
                    if (numberLineRef.current) {
                      const rect = numberLineRef.current.getBoundingClientRect();
                      const percentage = (info.point.x - rect.left) / rect.width;
                      const position = (percentage * 10) - 5;
                      const clampedPosition = Math.max(-5, Math.min(5, position));
                      setSpaceshipPosition(Math.round(clampedPosition * 4) / 4);
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileDrag={{ scale: 1.2 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Rocket className="h-4 w-4 text-white transform rotate-45" />
                  </div>
                </motion.div>
              </div>

              {/* Scale labels */}
              <div className="flex justify-between mt-4 px-4">
                <span className="text-xs text-gray-600">-5</span>
                <span className="text-xs text-gray-600">0</span>
                <span className="text-xs text-gray-600">+5</span>
              </div>
            </div>

            {/* Launch Button and Results */}
            <div className="text-center space-y-4">
              <Button
                onClick={launchSpaceship}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3"
              >
                <Zap className="h-5 w-5 mr-2" />
                {getT('launch')}
              </Button>

              {/* Mission Result */}
              <AnimatePresence>
                {missionResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-2"
                  >
                    {missionResult === 'success' ? (
                      <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                        <div className="flex items-center justify-center space-x-2 text-green-800">
                          <Award className="h-5 w-5" />
                          <span className="font-bold">{getT('missionAccomplished')}</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">+10 XP earned!</p>
                      </div>
                    ) : (
                      <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                        <div className="text-red-800 text-center">
                          <p className="font-bold">{getT('navigationError')}</p>
                          <p className="text-sm">
                            {getT('coordinateOff')} {missionResult.split(':')[1]}. {getT('tryAgain')}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* New Mission Button */}
              {missionResult && missionResult !== 'success' && (
                <Button
                  onClick={generateNewMission}
                  variant="outline"
                  className="mt-4"
                >
                  {getT('newMission')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{missionsCompleted}</div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Missions Completed' : language === 'hi' ? 'मिशन पूरे' : 'ମିସନ୍ ସମ୍ପନ୍ନ'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-600">
              {language === 'en' ? 'Total XP' : language === 'hi' ? 'कुल XP' : 'ମୋଟ XP'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-25 to-mint-50" 
         style={{ 
           background: 'linear-gradient(to bottom, #F0F8FF 0%, #F8FFFA 100%)' 
         }}>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{getT('back')}</span>
              </Button>
              
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {getT('title')}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Class 9 Mathematics • Interactive Learning
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-lg font-bold text-indigo-600">
                  {activeTab === 'learn' 
                    ? currentStageData?.title 
                    : activeTab === 'challenge' 
                    ? 'Challenge Mode'
                    : 'Sandbox Mode'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {activeTab === 'learn' 
                    ? `${currentStage} of 5 stages`
                    : activeTab === 'challenge'
                    ? `${missionsCompleted} missions completed`
                    : 'Creative Problem Solving'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-gray-100">
              <TabsTrigger value="learn" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>{getT('learnMode')}</span>
              </TabsTrigger>
              <TabsTrigger value="challenge" className="flex items-center space-x-2">
                <Gamepad2 className="h-4 w-4" />
                <span>{getT('challengeMode')}</span>
              </TabsTrigger>
              <TabsTrigger value="sandbox" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>{getT('sandboxMode')}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Learn Mode */}
          <TabsContent value="learn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Animation Area */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentStage}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden"
                        >
                          {currentStageData?.visual}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    
                    {/* Enhanced Control Panel */}
                    <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-center mb-4">
                        <h4 className="text-lg font-bold text-gray-800">
                          {language === 'en' ? 'Animation Controls' : language === 'hi' ? 'एनीमेशन नियंत्रण' : 'ଆନିମେସନ ନିୟନ୍ତ୍ରଣ'}
                        </h4>
                      </div>
                      
                      {/* Main Control Buttons */}
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-6">
                        
                        {/* Play/Pause Button */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={togglePlayPause}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              isPlaying ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                            }`}
                          >
                            {isPaused ? (
                              <Play className="h-5 w-5" />
                            ) : (
                              <Pause className="h-5 w-5" />
                            )}
                          </button>
                          <span className="text-xs mt-2 text-gray-600 text-center">
                            {isPaused ? getT('play') : getT('pause')}
                          </span>
                        </div>

                        {/* Speed Down Button */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={slowDownAnimation}
                            disabled={animationSpeed <= 0.25}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              animationSpeed > 0.25 
                                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Rewind className="h-5 w-5" />
                          </button>
                          <span className="text-xs mt-2 text-gray-600 text-center">
                            {getT('slowDown')}
                          </span>
                        </div>

                        {/* Speed Up Button */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={speedUpAnimation}
                            disabled={animationSpeed >= 3}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              animationSpeed < 3 
                                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <FastForward className="h-5 w-5" />
                          </button>
                          <span className="text-xs mt-2 text-gray-600 text-center">
                            {getT('speedUp')}
                          </span>
                        </div>

                        {/* Previous Stage Button */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={goToPrevStage}
                            disabled={currentStage === 1}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              currentStage > 1 
                                ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <span className="text-xs mt-2 text-gray-600 text-center">
                            {getT('prevStage')}
                          </span>
                        </div>

                        {/* Next Stage Button */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={goToNextStage}
                            disabled={currentStage === 5}
                            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                              currentStage < 5 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                          <span className="text-xs mt-2 text-gray-600 text-center">
                            {getT('nextStage')}
                          </span>
                        </div>

                        {/* Restart Button */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={restartAnimation}
                            className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200 shadow-lg"
                          >
                            <RefreshCw className="h-5 w-5" />
                          </button>
                          <span className="text-xs mt-2 text-gray-600 text-center">
                            {getT('restartAll')}
                          </span>
                        </div>
                      </div>

                      {/* Status Indicators */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <span className="text-gray-600">
                              {isPaused ? 
                                (language === 'en' ? 'Paused' : language === 'hi' ? 'रुका हुआ' : 'ବନ୍ଦ') : 
                                (language === 'en' ? 'Playing' : language === 'hi' ? 'चल रहा' : 'ଚାଲୁଅଛି')
                              }
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">
                              {language === 'en' ? 'Speed:' : language === 'hi' ? 'गति:' : 'ଗତି:'}
                            </span>
                            <span className="font-bold text-blue-600">{animationSpeed}x</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-gray-600">
                            {language === 'en' ? 'Stage:' : language === 'hi' ? 'चरण:' : 'ପର୍ଯ୍ୟାୟ:'}
                          </span>
                          <span className="font-bold text-indigo-600">{currentStage} / 5</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Information Panel */}
              <div className="space-y-6">
                
                {/* Current Stage Info */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {currentStageData?.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {currentStageData?.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Progress Indicator */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-bold text-gray-800 mb-4">
                      {language === 'en' ? 'Learning Progress' : language === 'hi' ? 'सीखने की प्रगति' : 'ଶିଖିବା ପ୍ରଗତି'}
                    </h4>
                    <div className="space-y-3">
                      {stages.map((stage, index) => (
                        <div
                          key={stage.id}
                          className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                            stage.id === currentStage
                              ? 'bg-indigo-100 border border-indigo-300'
                              : stage.id < currentStage
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            stage.id === currentStage
                              ? 'bg-indigo-600 text-white'
                              : stage.id < currentStage
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {stage.id}
                          </div>
                          <span className={`text-sm font-medium ${
                            stage.id === currentStage
                              ? 'text-indigo-800'
                              : stage.id < currentStage
                              ? 'text-green-800'
                              : 'text-gray-600'
                          }`}>
                            {stage.title.split(': ')[1]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-blue-800 mb-3">
                      💡 {language === 'en' ? 'Learning Tip' : language === 'hi' ? 'सीखने की युक्ति' : 'ଶିଖିବା ଟିପ୍ସ'}
                    </h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      {language === 'en' 
                        ? 'Watch how each number system builds upon the previous one. Notice the expanding boundaries!'
                        : language === 'hi'
                        ? 'देखें कि कैसे प्रत्येक संख्या प्रणाली पिछली पर आधारित है। विस्तृत होती सीमाओं पर ध्यान दें!'
                        : 'ଦେଖନ୍ତୁ କିପରି ପ୍ରତ୍ୟେକ ସଂଖ୍ୟା ପ୍ରଣାଳୀ ପୂର୍ବବର୍ତ୍ତୀ ଉପରେ ନିର୍ମିତ। ବିସ୍ତାରିତ ସୀମା ଲକ୍ଷ୍ୟ କରନ୍ତୁ!'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
              
            </div>
          </TabsContent>

          {/* Challenge Mode */}
          <TabsContent value="challenge">
            <ChallengeMode />
          </TabsContent>

          {/* Sandbox Mode */}
          <TabsContent value="sandbox">
            <SandboxMode />
          </TabsContent>

        </Tabs>
      </main>

      {/* Hotspot Modal */}
      <Dialog open={activeHotspot !== null} onOpenChange={() => setActiveHotspot(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {activeHotspot && hotspotContent[activeHotspot] && hotspotContent[activeHotspot][language]?.icon}
              <span>{getT('realWorldConnection')}</span>
            </DialogTitle>
          </DialogHeader>
          {activeHotspot && hotspotContent[activeHotspot] && (
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-gray-800">
                {hotspotContent[activeHotspot][language]?.title || hotspotContent[activeHotspot].en.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {hotspotContent[activeHotspot][language]?.content || hotspotContent[activeHotspot].en.content}
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setActiveHotspot(null)}>
                  {language === 'en' ? 'Got it!' : language === 'hi' ? 'समझ गया!' : 'ବୁଝିଗଲି!'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}