import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Leaf,
  Star,
  Trophy,
  Zap,
  CheckCircle,
  RotateCcw,
  Target,
  Timer,
  Heart,
  Award,
  ChefHat,
  Sparkles
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import type { Language } from '../../../types/onboarding';

interface PlantPartsKitchenGameProps {
  language: Language;
  onBack: () => void;
  onComplete?: (score: number, xpEarned: number) => void;
}

interface FoodItem {
  id: number;
  name: { en: string; hi: string; or: string };
  emoji: string;
  plantPart: 'root' | 'stem' | 'leaf' | 'fruit' | 'seed' | 'flower';
  position: { x: number; y: number };
  isCollected: boolean;
  isDragging: boolean;
}

interface KitchenStation {
  id: string;
  name: { en: string; hi: string; or: string };
  plantPart: 'root' | 'stem' | 'leaf' | 'fruit' | 'seed' | 'flower';
  color: string;
  icon: React.ElementType;
  collectedItems: number[];
  description: { en: string; hi: string; or: string };
}

const KITCHEN_STATIONS: KitchenStation[] = [
  {
    id: 'root-station',
    name: { en: 'Root Kitchen', hi: 'जड़ रसोई', or: 'ମୂଳ ରୋଷେଇ' },
    plantPart: 'root',
    color: 'from-amber-600 to-orange-600',
    icon: Target,
    collectedItems: [],
    description: { 
      en: 'Roots that grow underground!', 
      hi: 'जड़ें जो भूमिगत उगती हैं!', 
      or: 'ମୂଳ ଯାହା ଭୂମିରେ ବାଢ଼େ!' 
    }
  },
  {
    id: 'stem-station',
    name: { en: 'Stem Kitchen', hi: 'तना रसोई', or: 'ଗଣ୍ଡି ରୋଷେଇ' },
    plantPart: 'stem',
    color: 'from-green-600 to-emerald-600',
    icon: Target,
    collectedItems: [],
    description: { 
      en: 'Stems that support the plant!', 
      hi: 'तना जो पौधे को सहारा देता है!', 
      or: 'ଗଣ୍ଡି ଯାହା ଉଦ୍ଭିଦକୁ ସହାରା ଦିଏ!' 
    }
  },
  {
    id: 'leaf-station',
    name: { en: 'Leaf Kitchen', hi: 'पत्ती रसोई', or: 'ପତ୍ର ରୋଷେଇ' },
    plantPart: 'leaf',
    color: 'from-lime-600 to-green-600',
    icon: Leaf,
    collectedItems: [],
    description: { 
      en: 'Leaves that make food for plants!', 
      hi: 'पत्तियां जो पौधों के लिए भोजन बनाती हैं!', 
      or: 'ପତ୍ର ଯାହା ଉଦ୍ଭିଦ ପାଇଁ ଖାଦ୍ୟ ତିଆରି କରେ!' 
    }
  },
  {
    id: 'fruit-station',
    name: { en: 'Fruit Kitchen', hi: 'फल रसोई', or: 'ଫଳ ରୋଷେଇ' },
    plantPart: 'fruit',
    color: 'from-red-600 to-pink-600',
    icon: Target,
    collectedItems: [],
    description: { 
      en: 'Fruits with seeds inside!', 
      hi: 'फल जिनके अंदर बीज होते हैं!', 
      or: 'ଫଳ ଯାହାର ଭିତରେ ମଞ୍ଜି ଥାଏ!' 
    }
  },
  {
    id: 'seed-station',
    name: { en: 'Seed Kitchen', hi: 'बीज रसोई', or: 'ମଞ୍ଜି ରୋଷେଇ' },
    plantPart: 'seed',
    color: 'from-yellow-600 to-amber-600',
    icon: Target,
    collectedItems: [],
    description: { 
      en: 'Seeds that grow into new plants!', 
      hi: 'बीज जो नए पौधों में बढ़ते हैं!', 
      or: 'ମଞ୍ଜି ଯାହା ନୂତନ ଉଦ୍ଭିଦରେ ବାଢ଼େ!' 
    }
  },
  {
    id: 'flower-station',
    name: { en: 'Flower Kitchen', hi: 'फूल रसोई', or: 'ଫୁଲ ରୋଷେଇ' },
    plantPart: 'flower',
    color: 'from-purple-600 to-pink-600',
    icon: Sparkles,
    collectedItems: [],
    description: { 
      en: 'Beautiful flowers we can eat!', 
      hi: 'सुंदर फूल जिन्हें हम खा सकते हैं!', 
      or: 'ସୁନ୍ଦର ଫୁଲ ଯାହାକୁ ଆମେ ଖାଇ ପାରିବା!' 
    }
  }
];

const FOOD_ITEMS: Omit<FoodItem, 'position' | 'isCollected' | 'isDragging' | 'id'>[] = [
  // Roots
  { name: { en: 'Carrot', hi: 'गाजर', or: 'ଗାଜର' }, emoji: '🥕', plantPart: 'root' },
  { name: { en: 'Radish', hi: 'मूली', or: 'ମୂଳା' }, emoji: '🥬', plantPart: 'root' },
  { name: { en: 'Beetroot', hi: 'चुकंदर', or: 'ବିଟ' }, emoji: '🥕', plantPart: 'root' },
  
  // Stems
  { name: { en: 'Potato', hi: 'आलू', or: 'ଆଳୁ' }, emoji: '🥔', plantPart: 'stem' },
  { name: { en: 'Ginger', hi: 'अदरक', or: 'ଆଦା' }, emoji: '🫚', plantPart: 'stem' },
  { name: { en: 'Sugarcane', hi: 'गन्ना', or: 'ଆଖୁ' }, emoji: '🎋', plantPart: 'stem' },
  
  // Leaves
  { name: { en: 'Spinach', hi: 'पालक', or: 'ପାଳଙ୍ଗ' }, emoji: '🥬', plantPart: 'leaf' },
  { name: { en: 'Cabbage', hi: 'पत्ता गोभी', or: 'କୋବି' }, emoji: '🥬', plantPart: 'leaf' },
  { name: { en: 'Lettuce', hi: 'सलाद पत्ता', or: 'ଲେଟୁସ୍' }, emoji: '🥬', plantPart: 'leaf' },
  
  // Fruits
  { name: { en: 'Tomato', hi: 'टमाटर', or: 'ଟମାଟୋ' }, emoji: '🍅', plantPart: 'fruit' },
  { name: { en: 'Apple', hi: 'सेब', or: 'ଆପଲ୍' }, emoji: '🍎', plantPart: 'fruit' },
  { name: { en: 'Mango', hi: 'आम', or: 'ଆମ୍ବ' }, emoji: '🥭', plantPart: 'fruit' },
  
  // Seeds
  { name: { en: 'Rice', hi: 'चावल', or: 'ଚାଉଳ' }, emoji: '🍚', plantPart: 'seed' },
  { name: { en: 'Wheat', hi: 'गेहूं', or: 'ଗହମ' }, emoji: '🌾', plantPart: 'seed' },
  { name: { en: 'Corn', hi: 'मक्का', or: 'ମକା' }, emoji: '🌽', plantPart: 'seed' },
  
  // Flowers
  { name: { en: 'Cauliflower', hi: 'फूल गोभी', or: 'ଫୁଲକୋବି' }, emoji: '🥦', plantPart: 'flower' },
  { name: { en: 'Broccoli', hi: 'ब्रोकली', or: 'ବ୍ରକୋଲି' }, emoji: '🥦', plantPart: 'flower' }
];

export function PlantPartsKitchenGame({ language, onBack, onComplete }: PlantPartsKitchenGameProps) {
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [kitchenStations, setKitchenStations] = useState<KitchenStation[]>(KITCHEN_STATIONS);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [draggedItem, setDraggedItem] = useState<FoodItem | null>(null);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [comboCount, setComboCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [gameStats, setGameStats] = useState({ correct: 0, wrong: 0 });
  
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Initialize food items
  useEffect(() => {
    if (gamePhase === 'playing') {
      const items: FoodItem[] = FOOD_ITEMS.map((item, index) => ({
        ...item,
        id: index,
        position: {
          x: 10 + (index % 6) * 15,
          y: 20 + Math.floor(index / 6) * 25
        },
        isCollected: false,
        isDragging: false
      }));
      setFoodItems(items);
    }
  }, [gamePhase]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gamePhase === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gamePhase]);

  const startGame = () => {
    setGamePhase('playing');
    setScore(0);
    setTimeElapsed(0);
    setComboCount(0);
    setTotalXP(0);
    setGameStats({ correct: 0, wrong: 0 });
    setKitchenStations(KITCHEN_STATIONS.map(station => ({ ...station, collectedItems: [] })));
  };

  const handleDragStart = (item: FoodItem) => {
    if (item.isCollected) return;
    setDraggedItem(item);
    setFoodItems(prev => prev.map(food => 
      food.id === item.id ? { ...food, isDragging: true } : food
    ));
  };

  const handleDragEnd = () => {
    if (draggedItem && hoveredStation) {
      handleDrop(hoveredStation);
    }
    
    setDraggedItem(null);
    setHoveredStation(null);
    setFoodItems(prev => prev.map(food => ({ ...food, isDragging: false })));
  };

  const handleDrop = (stationId: string) => {
    if (!draggedItem) return;
    
    const station = kitchenStations.find(s => s.id === stationId);
    if (!station) return;

    const isCorrect = draggedItem.plantPart === station.plantPart;
    
    if (isCorrect) {
      // Correct placement
      setFoodItems(prev => prev.map(item => 
        item.id === draggedItem.id ? { ...item, isCollected: true } : item
      ));
      
      setKitchenStations(prev => prev.map(station => 
        station.id === stationId 
          ? { ...station, collectedItems: [...station.collectedItems, draggedItem.id] }
          : station
      ));

      const basePoints = 50;
      const comboBonus = comboCount * 10;
      const timeBonus = Math.max(0, 60 - timeElapsed) * 2;
      const totalPoints = basePoints + comboBonus + timeBonus;
      
      setScore(prev => prev + totalPoints);
      setComboCount(prev => prev + 1);
      setTotalXP(prev => prev + 25);
      setGameStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      
      setFeedbackMessage(
        language === 'en' ? `Perfect! ${draggedItem.name[language]} is a ${station.plantPart}! +${totalPoints} points` :
        language === 'hi' ? `बहुत बढ़िया! ${draggedItem.name[language]} एक ${station.plantPart} है! +${totalPoints} अंक` :
        `ଉତ୍କୃଷ୍ଟ! ${draggedItem.name[language]} ଏକ ${station.plantPart}! +${totalPoints} ପଏଣ୍ଟ`
      );
      
      // Check if game completed
      const totalCollected = kitchenStations.reduce((sum, station) => sum + station.collectedItems.length, 0) + 1;
      if (totalCollected >= FOOD_ITEMS.length) {
        setTimeout(() => {
          setGamePhase('completed');
          onComplete?.(score + totalPoints, totalXP + 25);
        }, 2000);
      }
    } else {
      // Wrong placement
      setComboCount(0);
      setGameStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      
      setFeedbackMessage(
        language === 'en' ? `Oops! ${draggedItem.name[language]} is not a ${station.plantPart}. It's a ${draggedItem.plantPart}!` :
        language === 'hi' ? `उफ़! ${draggedItem.name[language]} एक ${station.plantPart} नहीं है। यह एक ${draggedItem.plantPart} है!` :
        `ଓ! ${draggedItem.name[language]} ଏକ ${station.plantPart} ନୁହେଁ। ଏହା ଏକ ${draggedItem.plantPart}!`
      );
    }
    
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const getProgress = () => {
    const totalItems = FOOD_ITEMS.length;
    const collectedItems = foodItems.filter(item => item.isCollected).length;
    return (collectedItems / totalItems) * 100;
  };

  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-300/20 text-5xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            >
              {['🌱', '🍃', '🌿', '🥕', '🍎', '🌽'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <Card className="bg-green-900/80 border-green-400/30 backdrop-blur-md max-w-2xl w-full">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse"
              >
                <ChefHat className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {language === 'en' ? 'Plant Parts Kitchen' :
                 language === 'hi' ? 'पौधे भागों की रसोई' :
                 'ଉଦ୍ଭିଦ ଅଂଶ ରୋଷେଇ'}
              </h1>

              <p className="text-green-200 mb-6 leading-relaxed">
                {language === 'en' ? 'Welcome to the magical kitchen! Help Chef Botanica sort food items based on which part of the plant they come from. Drag each food to its correct kitchen station!' :
                 language === 'hi' ? 'जादुई रसोई में आपका स्वागत है! शेफ बॉटैनिका की मदद करें खाद्य पदार्थों को इस आधार पर छांटने में कि वे पौधे के किस हिस्से से आते हैं। प्रत्येक भोजन को उसके सही रसोई स्टेशन पर खींचें!' :
                 'ଯାଦୁଗର ରୋଷେଇରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ! ଶେଫ୍ ବଟାନିକାଙ୍କୁ ଖାଦ୍ୟ ପଦାର୍ଥ ସଜାଇବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ ଯେ ସେଗୁଡ଼ିକ ଉଦ୍ଭିଦର କେଉଁ ଅଂଶରୁ ଆସେ। ପ୍ରତ୍ୟେକ ଖାଦ୍ୟକୁ ଏହାର ସଠିକ ରୋଷେଇ ଷ୍ଟେସନରେ ଟାଣନ୍ତୁ!'}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-700/30 rounded-lg p-4">
                  <Leaf className="w-8 h-8 text-green-300 mx-auto mb-2" />
                  <h3 className="text-green-200 font-bold mb-1">
                    {language === 'en' ? 'Plant Parts' : language === 'hi' ? 'पौधे भाग' : 'ଉଦ୍ଭିଦ ଅଂଶ'}
                  </h3>
                  <p className="text-green-300 text-sm">
                    6 {language === 'en' ? 'Different Types' : language === 'hi' ? 'विभिन्न प्रकार' : 'ବିଭିନ୍ନ ପ୍ରକାର'}
                  </p>
                </div>
                
                <div className="bg-green-700/30 rounded-lg p-4">
                  <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h3 className="text-green-200 font-bold mb-1">
                    {language === 'en' ? 'Food Items' : language === 'hi' ? 'खाद्य पदार्थ' : 'ଖାଦ୍ୟ ପଦାର୍ଥ'}
                  </h3>
                  <p className="text-green-300 text-sm">
                    {FOOD_ITEMS.length} {language === 'en' ? 'To Sort' : language === 'hi' ? 'छांटने के लिए' : 'ସଜାଇବା ପାଇଁ'}
                  </p>
                </div>
                
                <div className="bg-green-700/30 rounded-lg p-4">
                  <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-green-200 font-bold mb-1">
                    {language === 'en' ? 'Bonus Points' : language === 'hi' ? 'बोनस अंक' : 'ବୋନସ୍ ପଏଣ୍ଟ'}
                  </h3>
                  <p className="text-green-300 text-sm">
                    {language === 'en' ? 'For Speed & Accuracy' : language === 'hi' ? 'गति और सटीकता के लिए' : 'ଗତି ଏବଂ ସଠିକତା ପାଇଁ'}
                  </p>
                </div>
              </div>

              <motion.div className="space-y-4">
                <Button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg py-3 adventure-button"
                  size="lg"
                >
                  <ChefHat className="w-6 h-6 mr-2" />
                  {language === 'en' ? 'Start Cooking!' :
                   language === 'hi' ? 'खाना बनाना शुरू करें!' :
                   'ରାନ୍ଧିବା ଆରମ୍ଭ କରନ୍ତୁ!'}
                </Button>
                
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full bg-green-800/50 border-green-400 text-green-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Back to Garden' :
                   language === 'hi' ? 'बगीचे में वापस' :
                   'ବଗିଚାକୁ ଫେରନ୍ତୁ'}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gamePhase === 'completed') {
    const accuracy = gameStats.correct + gameStats.wrong > 0 
      ? Math.round((gameStats.correct / (gameStats.correct + gameStats.wrong)) * 100) 
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
        {/* Victory Effects */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-100, window.innerHeight + 100],
                rotate: [0, 360],
                opacity: [1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            >
              {['🌟', '🏆', '🥕', '🍎', '🌱', '🎉'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <Card className="bg-green-900/90 border-green-400/50 backdrop-blur-md max-w-lg w-full">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-treasure-shine"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold text-white mb-4">
                {accuracy >= 90 
                  ? (language === 'en' ? 'Master Chef Botanist!' :
                     language === 'hi' ? 'मास्टर शेफ वनस्पतिशास्त्री!' :
                     'ମାଷ୍ଟର ଶେଫ୍ ଉଦ୍ଭିଦ ବିଜ୍ଞାନୀ!')
                  : accuracy >= 70
                  ? (language === 'en' ? 'Great Plant Chef!' :
                     language === 'hi' ? 'महान पौधा शेफ!' :
                     'ମହାନ ଉଦ୍ଭିଦ ଶେଫ୍!')
                  : (language === 'en' ? 'Kitchen Helper!' :
                     language === 'hi' ? 'रसोई सहायक!' :
                     'ରୋଷେଇ ସାହାଯ୍ୟକାରୀ!')}
              </h1>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-700/30 rounded-lg p-4">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-yellow-300 font-bold text-xl">{score}</div>
                  <div className="text-green-300 text-sm">
                    {language === 'en' ? 'Chef Points' : language === 'hi' ? 'शेफ अंक' : 'ଶେଫ୍ ପଏଣ୍ଟ'}
                  </div>
                </div>
                
                <div className="bg-green-700/30 rounded-lg p-4">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-green-300 font-bold text-xl">{accuracy}%</div>
                  <div className="text-green-300 text-sm">
                    {language === 'en' ? 'Accuracy' : language === 'hi' ? 'सटीकता' : 'ସଠିକତା'}
                  </div>
                </div>

                <div className="bg-green-700/30 rounded-lg p-4">
                  <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-blue-300 font-bold text-xl">{totalXP}</div>
                  <div className="text-green-300 text-sm">XP</div>
                </div>
                
                <div className="bg-green-700/30 rounded-lg p-4">
                  <Timer className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-purple-300 font-bold text-xl">
                    {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-green-300 text-sm">
                    {language === 'en' ? 'Cooking Time' : language === 'hi' ? 'खाना पकाने का समय' : 'ରାନ୍ଧିବା ସମୟ'}
                  </div>
                </div>
              </div>

              <motion.div className="space-y-4">
                <Button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Cook Again' :
                   language === 'hi' ? 'फिर से पकाएं' :
                   'ପୁଣି ରାନ୍ଧନ୍ତୁ'}
                </Button>
                
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full bg-green-800/50 border-green-400 text-green-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Back to Garden' :
                   language === 'hi' ? 'बगीचे में वापस' :
                   'ବଗିଚାକୁ ଫେରନ୍ତୁ'}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div ref={gameAreaRef} className="min-h-screen bg-gradient-to-b from-green-900 via-emerald-900 to-teal-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-300/10 text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          >
            🌿
          </motion.div>
        ))}
      </div>

      {/* Game Header */}
      <div className="relative z-20 bg-black/30 backdrop-blur-md border-b border-green-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="bg-green-800/80 border-green-400 text-green-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Exit Kitchen' : language === 'hi' ? 'रसोई से बाहर निकलें' : 'ରୋଷେଇରୁ ବାହାରନ୍ତୁ'}
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-white flex items-center">
                  <ChefHat className="w-5 h-5 mr-2 text-green-400" />
                  {language === 'en' ? 'Plant Parts Kitchen' :
                   language === 'hi' ? 'पौधे भागों की रसोई' :
                   'ଉଦ୍ଭିଦ ଅଂଶ ରୋଷେଇ'}
                </h1>
                <p className="text-green-200 text-sm">
                  {language === 'en' ? 'Sort food by plant parts' :
                   language === 'hi' ? 'पौधे के भागों के अनुसार भोजन छांटें' :
                   'ଉଦ୍ଭିଦ ଅଂଶ ଅନୁଯାୟୀ ଖାଦ୍ୟ ସଜାନ୍ତୁ'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-lg">{score}</div>
                <div className="text-green-200 text-xs">
                  {language === 'en' ? 'Score' : language === 'hi' ? 'अंक' : 'ସ୍କୋର'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-blue-400 font-bold text-lg">
                  {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-green-200 text-xs">
                  {language === 'en' ? 'Time' : language === 'hi' ? 'समय' : 'ସମୟ'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-purple-400 font-bold text-lg">{comboCount}</div>
                <div className="text-green-200 text-xs">
                  {language === 'en' ? 'Combo' : language === 'hi' ? 'कॉम्बो' : 'କମ୍ବୋ'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-20 bg-black/20 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-300 font-medium">
              {language === 'en' ? 'Kitchen Progress' :
               language === 'hi' ? 'रसोई प्रगति' :
               'ରୋଷେଇ ପ୍ରଗତି'}
            </span>
            <span className="text-green-200">
              {foodItems.filter(item => item.isCollected).length}/{FOOD_ITEMS.length}
            </span>
          </div>
          <Progress value={getProgress()} className="h-3 bg-green-800/50" />
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
          
          {/* Food Market Area */}
          <div className="lg:col-span-3 bg-black/20 backdrop-blur-md rounded-xl border border-green-400/30 p-6 relative">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-green-300 flex items-center mb-2">
                <Leaf className="w-6 h-6 mr-2" />
                {language === 'en' ? 'Fresh Market' :
                 language === 'hi' ? 'ताजा बाजार' :
                 'ତାଜା ବଜାର'}
              </h2>
              <p className="text-green-400">
                {language === 'en' ? 'Drag food items to the correct kitchen station' :
                 language === 'hi' ? 'खाद्य पदार्थों को सही रसोई स्टेशन पर खींचें' :
                 'ଖାଦ୍ୟ ପଦାର୍ଥକୁ ସଠିକ ରୋଷେଇ ଷ୍ଟେସନରେ ଟାଣନ୍ତୁ'}
              </p>
            </div>

            <div className="relative w-full h-96 bg-gradient-to-br from-green-600/20 to-emerald-700/20 rounded-lg border-2 border-dashed border-green-400/40 overflow-hidden">
              <AnimatePresence>
                {foodItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`absolute cursor-grab active:cursor-grabbing ${
                      item.isCollected ? 'opacity-30 pointer-events-none' : ''
                    } ${item.isDragging ? 'z-50' : 'z-10'}`}
                    style={{
                      left: `${item.position.x}%`,
                      top: `${item.position.y}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: item.isCollected ? 0.5 : (item.isDragging ? 1.2 : 1),
                      opacity: item.isCollected ? 0.3 : 1
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: item.isCollected ? 0.5 : 1.1 }}
                    drag={!item.isCollected}
                    dragMomentum={false}
                    dragConstraints={gameAreaRef}
                    dragElastic={0.1}
                    onDragStart={() => handleDragStart(item)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 min-w-16 min-h-16 flex flex-col items-center justify-center text-center">
                      <div className="text-2xl mb-1">{item.emoji}</div>
                      <div className="text-xs font-medium text-gray-800 leading-tight">
                        {item.name[language]}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Kitchen Stations */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-300 flex items-center">
              <ChefHat className="w-6 h-6 mr-2" />
              {language === 'en' ? 'Kitchen Stations' :
               language === 'hi' ? 'रसोई स्टेशन' :
               'ରୋଷେଇ ଷ୍ଟେସନ'}
            </h2>
            
            {kitchenStations.map((station) => {
              const Icon = station.icon;
              const isHovered = hoveredStation === station.id;
              
              return (
                <motion.div
                  key={station.id}
                  className={`relative bg-gradient-to-br ${station.color} rounded-lg p-4 border-2 transition-all duration-300 ${
                    isHovered
                      ? 'border-white scale-105 shadow-xl'
                      : 'border-white/30'
                  }`}
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  onMouseEnter={() => setHoveredStation(station.id)}
                  onMouseLeave={() => setHoveredStation(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 text-white mr-2" />
                      <h3 className="font-bold text-white text-sm">
                        {station.name[language]}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                      {station.collectedItems.length}
                    </Badge>
                  </div>
                  
                  <p className="text-white/80 text-xs mb-3">
                    {station.description[language]}
                  </p>
                  
                  {/* Collected items display */}
                  <div className="flex flex-wrap gap-1">
                    {station.collectedItems.map((itemId) => {
                      const item = foodItems.find(f => f.id === itemId);
                      return item ? (
                        <div key={itemId} className="text-lg">
                          {item.emoji}
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  {station.collectedItems.length >= 3 && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-yellow-400" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 backdrop-blur-md text-white px-6 py-3 rounded-lg border border-green-400/50 shadow-xl max-w-md text-center"
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}