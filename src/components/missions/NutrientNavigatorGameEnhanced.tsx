import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Apple,
  Star, 
  Trophy, 
  Zap,
  Target,
  CheckCircle,
  RotateCcw,
  Volume2,
  HelpCircle,
  Timer,
  Heart,
  Bone,
  Droplets,
  Battery,
  Magnet,
  Lightbulb,
  Play
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import type { Language } from '../../types/onboarding';

interface NutrientNavigatorGameProps {
  language: Language;
  onBack: () => void;
  onComplete?: (score: number, xpEarned: number) => void;
}

// Game data
interface FoodItem {
  id: number;
  name: { en: string; hi: string; or: string };
  emoji: string;
  nutrients: ('carbohydrates' | 'proteins' | 'fats' | 'vitamins' | 'minerals')[];
  primaryNutrient: 'carbohydrates' | 'proteins' | 'fats' | 'vitamins' | 'minerals';
  position: { x: number; y: number };
  collected: boolean;
  points: number;
}

interface NutrientCategory {
  id: 'carbohydrates' | 'proteins' | 'fats' | 'vitamins' | 'minerals';
  name: { en: string; hi: string; or: string };
  color: string;
  icon: React.ElementType;
  description: { en: string; hi: string; or: string };
  targetCount: number;
  collectedItems: number[];
  position: { x: number; y: number }; // Position for magnetic attraction
}

const NUTRIENT_CATEGORIES: NutrientCategory[] = [
  {
    id: 'carbohydrates',
    name: { en: 'Carbohydrates', hi: 'कार्बोहाइड्रेट', or: 'କାର୍ବୋହାଇଡ୍ରେଟ' },
    color: 'from-yellow-400 to-orange-500',
    icon: Battery,
    description: { en: 'Energy for your body', hi: 'आपके शरीर के लिए ऊर्जा', or: 'ଆପଣଙ୍କ ଶରୀର ପାଇଁ ଶକ୍ତି' },
    targetCount: 4,
    collectedItems: [],
    position: { x: 50, y: 10 }
  },
  {
    id: 'proteins',
    name: { en: 'Proteins', hi: 'प्रोटीन', or: 'ପ୍ରୋଟିନ' },
    color: 'from-red-400 to-red-600',
    icon: Heart,
    description: { en: 'Build strong muscles', hi: 'मजबूत मांसपेशियों का निर्माण', or: 'ଶକ୍ତିଶାଳୀ ମାଂସପେଶୀ ନିର୍ମାଣ' },
    targetCount: 3,
    collectedItems: [],
    position: { x: 50, y: 30 }
  },
  {
    id: 'fats',
    name: { en: 'Healthy Fats', hi: 'स्वस्थ वसा', or: 'ସ୍ୱାସ୍ଥ୍ୟକର ଚର୍ବି' },
    color: 'from-green-400 to-green-600',
    icon: Droplets,
    description: { en: 'Essential for brain health', hi: 'मस्तिष्क स्वास्थ्य के लिए आवश्यक', or: 'ମସ୍ତିଷ୍କ ସ୍ୱାସ୍ଥ୍ୟ ପାଇଁ ଆବଶ୍ୟକ' },
    targetCount: 2,
    collectedItems: [],
    position: { x: 50, y: 50 }
  },
  {
    id: 'vitamins',
    name: { en: 'Vitamins', hi: 'विटामिन', or: 'ଭିଟାମିନ' },
    color: 'from-purple-400 to-purple-600',
    icon: Star,
    description: { en: 'Keep you healthy', hi: 'आपको स्वस्थ रखते हैं', or: 'ଆପଣଙ୍କୁ ସୁସ୍ଥ ରଖେ' },
    targetCount: 4,
    collectedItems: [],
    position: { x: 50, y: 70 }
  },
  {
    id: 'minerals',
    name: { en: 'Minerals', hi: 'खनिज', or: 'ଖଣିଜ' },
    color: 'from-blue-400 to-blue-600',
    icon: Bone,
    description: { en: 'Strong bones and teeth', hi: 'मजबूत हड्डियां और दांत', or: 'ଶକ୍ତିଶାଳୀ ହାଡ ଏବଂ ଦାନ୍ତ' },
    targetCount: 3,
    collectedItems: [],
    position: { x: 50, y: 90 }
  }
];

const FOOD_ITEMS: Omit<FoodItem, 'position' | 'collected' | 'id'>[] = [
  { name: { en: 'Rice', hi: 'चावल', or: 'ଚାଉଳ' }, emoji: '🍚', nutrients: ['carbohydrates'], primaryNutrient: 'carbohydrates', points: 10 },
  { name: { en: 'Bread', hi: 'रोटी', or: 'ରୁଟି' }, emoji: '🍞', nutrients: ['carbohydrates'], primaryNutrient: 'carbohydrates', points: 10 },
  { name: { en: 'Banana', hi: 'केला', or: 'କଦଳୀ' }, emoji: '🍌', nutrients: ['carbohydrates', 'vitamins'], primaryNutrient: 'carbohydrates', points: 15 },
  { name: { en: 'Potato', hi: 'आलू', or: 'ଆଳୁ' }, emoji: '🥔', nutrients: ['carbohydrates', 'vitamins'], primaryNutrient: 'carbohydrates', points: 15 },
  
  { name: { en: 'Chicken', hi: 'चिकन', or: 'ଚିକେନ' }, emoji: '🍗', nutrients: ['proteins'], primaryNutrient: 'proteins', points: 15 },
  { name: { en: 'Fish', hi: 'मछली', or: 'ମାଛ' }, emoji: '🐟', nutrients: ['proteins', 'fats'], primaryNutrient: 'proteins', points: 20 },
  { name: { en: 'Eggs', hi: 'अंडे', or: 'ଅଣ୍ଡା' }, emoji: '🥚', nutrients: ['proteins', 'vitamins'], primaryNutrient: 'proteins', points: 20 },
  
  { name: { en: 'Nuts', hi: 'नट्स', or: 'ବାଦାମ' }, emoji: '🥜', nutrients: ['fats', 'proteins'], primaryNutrient: 'fats', points: 20 },
  { name: { en: 'Avocado', hi: 'एवोकाडो', or: 'ଆଭୋକ୍ୟାଡୋ' }, emoji: '🥑', nutrients: ['fats', 'vitamins'], primaryNutrient: 'fats', points: 25 },
  
  { name: { en: 'Orange', hi: 'संतरा', or: 'କମଳା' }, emoji: '🍊', nutrients: ['vitamins'], primaryNutrient: 'vitamins', points: 15 },
  { name: { en: 'Carrot', hi: 'गाजर', or: 'ଗାଜର' }, emoji: '🥕', nutrients: ['vitamins'], primaryNutrient: 'vitamins', points: 15 },
  { name: { en: 'Spinach', hi: 'पालक', or: 'ପାଳଙ୍ଗ' }, emoji: '🥬', nutrients: ['vitamins', 'minerals'], primaryNutrient: 'vitamins', points: 20 },
  { name: { en: 'Tomato', hi: 'टमाटर', or: 'ଟମାଟୋ' }, emoji: '🍅', nutrients: ['vitamins'], primaryNutrient: 'vitamins', points: 15 },
  
  { name: { en: 'Milk', hi: 'दूध', or: 'କ୍ଷୀର' }, emoji: '🥛', nutrients: ['minerals', 'proteins'], primaryNutrient: 'minerals', points: 20 },
  { name: { en: 'Cheese', hi: 'पनीर', or: 'ଛେନା' }, emoji: '🧀', nutrients: ['minerals', 'proteins'], primaryNutrient: 'minerals', points: 20 },
  { name: { en: 'Broccoli', hi: 'ब्रोकली', or: 'ବ୍ରକୋଲି' }, emoji: '🥦', nutrients: ['minerals', 'vitamins'], primaryNutrient: 'minerals', points: 25 }
];

export function NutrientNavigatorGameEnhanced({ language, onBack, onComplete }: NutrientNavigatorGameProps) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<NutrientCategory[]>(NUTRIENT_CATEGORIES);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [draggedItem, setDraggedItem] = useState<FoodItem | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [comboCount, setComboCount] = useState(0);
  const [magneticAttraction, setMagneticAttraction] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [isShowingSolution, setIsShowingSolution] = useState(false);
  const [solutionAnimating, setSolutionAnimating] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Initialize food items
  useEffect(() => {
    const items: FoodItem[] = FOOD_ITEMS.map((item, index) => ({
      ...item,
      id: index,
      position: {
        x: 15 + (index % 6) * 14,
        y: 25 + Math.floor(index / 6) * 20
      },
      collected: false
    }));
    setFoodItems(items);
  }, []);

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
    setTimeElapsed(0);
    setScore(0);
    setComboCount(0);
  };

  // Calculate distance between two points
  const calculateDistance = (pos1: { x: number; y: number }, pos2: { x: number; y: number }) => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleDragStart = (item: FoodItem) => {
    if (item.collected) return;
    setDraggedItem(item);
    setMagneticAttraction(null);
  };

  const handleDrag = (item: FoodItem, info: any) => {
    if (!gameAreaRef.current) return;

    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    const currentPos = {
      x: info.point.x - gameAreaRect.left,
      y: info.point.y - gameAreaRect.top
    };
    
    setDragPosition(currentPos);

    // Check for magnetic attraction
    let nearestCategory: string | null = null;
    let minDistance = Infinity;
    const magneticRadius = 150; // Attraction zone radius

    categories.forEach((category) => {
      const categoryElement = document.querySelector(`[data-category="${category.id}"]`);
      if (categoryElement) {
        const categoryRect = categoryElement.getBoundingClientRect();
        const categoryCenter = {
          x: categoryRect.left + categoryRect.width / 2 - gameAreaRect.left,
          y: categoryRect.top + categoryRect.height / 2 - gameAreaRect.top
        };
        
        const distance = calculateDistance(currentPos, categoryCenter);
        
        if (distance < magneticRadius && distance < minDistance) {
          minDistance = distance;
          nearestCategory = category.id;
        }
      }
    });

    setMagneticAttraction(nearestCategory);
  };

  const handleDragEnd = (item: FoodItem, info: any) => {
    if (!magneticAttraction) {
      // No magnetic attraction, return to original position
      returnItemToMarket(item);
      return;
    }

    // Auto-drop to magnetically attracted category
    handleDrop(magneticAttraction);
  };

  const returnItemToMarket = (item: FoodItem) => {
    // Reset the item to its original position in the market
    setFoodItems(prev => prev.map(foodItem => 
      foodItem.id === item.id 
        ? { ...foodItem, position: item.position } // Reset to original position
        : foodItem
    ));
    
    setDraggedItem(null);
    setMagneticAttraction(null);
    setDragPosition(null);
    
    // Show feedback message
    setFeedbackMessage(
      language === 'en' ? 'Try dragging closer to a nutrient group!' :
      language === 'hi' ? 'किसी पोषक समूह के करीब खींचने की कोशिश करें!' :
      'ଏକ ପୋଷକ ଗୋଷ୍ଠୀ ନିକଟରେ ଟାଣିବାକୁ ଚେଷ୍ଟା କରନ୍ତୁ!'
    );
    
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  const handleDrop = (categoryId: string) => {
    if (!draggedItem || draggedItem.collected) return;

    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const isCorrect = draggedItem.primaryNutrient === categoryId;
    
    if (isCorrect) {
      // Correct placement
      setFoodItems(prev => prev.map(item => 
        item.id === draggedItem.id ? { ...item, collected: true } : item
      ));
      
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, collectedItems: [...cat.collectedItems, draggedItem.id] }
          : cat
      ));

      const comboBonus = comboCount * 5;
      const magneticBonus = magneticAttraction === categoryId ? 15 : 0; // Bonus for magnetic drop
      const totalPoints = draggedItem.points + comboBonus + magneticBonus;
      setScore(prev => prev + totalPoints);
      setComboCount(prev => prev + 1);
      
      const message = magneticAttraction === categoryId ? 
        (language === 'en' ? 'Perfect Magnetic Match! 🧲 +15 bonus!' : 
         language === 'hi' ? 'शानदार चुंबकीय मैच! 🧲 +15 बोनस!' : 
         'ସମ୍ପୂର୍ଣ୍ଣ ଚୁମ୍ବକୀୟ ମ୍ୟାଚ! 🧲 +15 ବୋନସ!') :
        (language === 'en' ? 'Great choice!' : 
         language === 'hi' ? 'बेहतरीन पसंद!' : 
         'ଉତ୍ତମ ପସନ୍ଦ!');
      
      setFeedbackMessage(message);
      
      // Check if game completed
      const totalCollected = categories.reduce((sum, cat) => sum + cat.collectedItems.length, 0) + 1;
      if (totalCollected >= 12) {
        setTimeout(() => {
          setGamePhase('completed');
          onComplete?.(score + totalPoints, 200);
        }, 1000);
      }
    } else {
      // Wrong placement - return item to market with animation
      returnItemToMarketWithAnimation(draggedItem);
      setComboCount(0);
    }

    setDraggedItem(null);
    setHoveredCategory(null);
    setMagneticAttraction(null);
    setDragPosition(null);
  };

  const returnItemToMarketWithAnimation = (item: FoodItem) => {
    // Add bounce-back animation class temporarily
    const itemElement = document.querySelector(`[data-food-id="${item.id}"]`);
    if (itemElement) {
      itemElement.classList.add('animate-bounce-back');
      setTimeout(() => {
        itemElement.classList.remove('animate-bounce-back');
        // Add return-to-market animation
        itemElement.classList.add('animate-return-to-market');
        setTimeout(() => {
          itemElement.classList.remove('animate-return-to-market');
        }, 800);
      }, 600);
    }

    // Reset the item to its original position with delay for animation
    setTimeout(() => {
      setFoodItems(prev => prev.map(foodItem => 
        foodItem.id === item.id 
          ? { 
              ...foodItem, 
              position: {
                x: 15 + (foodItem.id % 6) * 14,
                y: 25 + Math.floor(foodItem.id / 6) * 20
              }
            } // Reset to original calculated position
          : foodItem
      ));
    }, 300);
    
    // Show feedback message with better formatting
    setFeedbackMessage(
      language === 'en' ? `❌ ${item.name[language]} doesn't belong here! Try another group 🔄` :
      language === 'hi' ? `❌ ${item.name[language]} यहाँ नहीं आता! दूसरा समूह आज़माएं 🔄` :
      `❌ ${item.name[language]} ଏଠାରେ ଆସେ ନାହିଁ! ଅନ୍ୟ ଗୋଷ୍ଠୀ ଚେଷ୍ଟା କରନ୍ତୁ 🔄`
    );
    
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const progress = foodItems.length > 0 ? (foodItems.filter(item => item.collected).length / Math.min(foodItems.length, 12)) * 100 : 0;

  const showSolution = async () => {
    if (solutionAnimating) return;
    
    setSolutionAnimating(true);
    setIsShowingSolution(true);
    setDraggedItem(null);
    setMagneticAttraction(null);
    setDragPosition(null);
    
    // Show solution message
    setFeedbackMessage(
      language === 'en' ? '🧠 Auto-solving puzzle... Watch and learn!' :
      language === 'hi' ? '🧠 पहेली स्वतः हल हो रही है... देखें और सीखें!' :
      '🧠 ପହେଲି ସ୍ୱୟଂ ହଲ ହେଉଛି... ଦେଖନ୍ତୁ ଏବଂ ଶିଖନ୍ତୁ!'
    );

    // Get all uncollected items
    const uncollectedItems = foodItems.filter(item => !item.collected);
    
    // Animate each item to its correct category with delays
    for (let i = 0; i < uncollectedItems.length; i++) {
      const item = uncollectedItems[i];
      
      setTimeout(() => {
        // Add highlight animation to the item
        const itemElement = document.querySelector(`[data-food-id="${item.id}"]`);
        if (itemElement) {
          itemElement.classList.add('animate-magnetic-snap');
          setTimeout(() => {
            itemElement.classList.remove('animate-magnetic-snap');
          }, 300);
        }
        
        // Update the item to collected
        setFoodItems(prev => prev.map(foodItem => 
          foodItem.id === item.id ? { ...foodItem, collected: true } : foodItem
        ));
        
        // Update the category
        setCategories(prev => prev.map(cat => 
          cat.id === item.primaryNutrient 
            ? { ...cat, collectedItems: [...cat.collectedItems, item.id] }
            : cat
        ));
        
        // Add points for solution demonstration
        setScore(prev => prev + item.points);
        
        // Show which category this item belongs to
        const categoryName = NUTRIENT_CATEGORIES.find(cat => cat.id === item.primaryNutrient)?.name[language];
        setFeedbackMessage(
          language === 'en' ? `✅ ${item.name[language]} → ${categoryName}` :
          language === 'hi' ? `✅ ${item.name[language]} → ${categoryName}` :
          `✅ ${item.name[language]} → ${categoryName}`
        );
        
      }, i * 800); // 800ms delay between each item
    }
    
    // After all items are placed, show completion
    setTimeout(() => {
      setSolutionAnimating(false);
      setFeedbackMessage(
        language === 'en' ? '🎯 Perfect! This is how all nutrients should be grouped!' :
        language === 'hi' ? '🎯 बेहतरीन! इस तरह सभी पोषक तत्वों को समूहीकृत करना चाहिए!' :
        '🎯 ଉତ୍କୃଷ୍ଟ! ଏହିପରି ସମସ୍ତ ପୋଷକ ତତ୍ତ୍ୱ ଗୋଷ୍ଠୀବଦ୍ଧ କରିବା ଉଚିତ!'
      );
      
      setTimeout(() => {
        setGamePhase('completed');
        onComplete?.(score + uncollectedItems.reduce((sum, item) => sum + item.points, 0), 150); // Reduced XP for solution
      }, 2000);
      
    }, uncollectedItems.length * 800 + 1000);
  };

  if (gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 flex items-center justify-center relative overflow-hidden">
        {/* Nature Background */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              {['🌿', '🌱', '🍃', '🌺', '🌻', '🧲'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>

        <Card className="bg-emerald-900/80 border-emerald-400/30 backdrop-blur-md max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <Apple className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-emerald-300 mb-4">
              {language === 'en' ? 'Nutrient Navigator' :
               language === 'hi' ? 'पोषक तत्व नेविगेटर' :
               'ପୋଷକ ତତ୍ତ୍ୱ ନେଭିଗେଟର'}
            </h1>

            <div className="bg-cyan-500/20 border border-cyan-400/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Magnet className="w-5 h-5 text-cyan-400 mr-2" />
                <span className="text-cyan-300 font-bold">Magnetic Attraction System</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {language === 'en' ? 'Get close to nutrient groups and feel the magnetic pull! Items automatically snap when nearby for bonus points!' :
                 language === 'hi' ? 'पोषक समूहों के करीब जाएं और चुंबकीय खिंचाव महसूस करें! पास होने पर वस्तुएं बोनस पॉइंट के लिए अपने आप जुड़ जाती हैं!' :
                 'ପୋଷକ ଗୋଷ୍ଠୀ ନିକଟରେ ଯାଆନ୍ତୁ ଏବଂ ଚୁମ୍ବକୀୟ ଆକର୍ଷଣ ଅନୁଭବ କରନ୍ତୁ!'}
              </p>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {language === 'en' ? 'Help build a balanced meal! Drag food items to their correct nutrient groups.' :
               language === 'hi' ? 'संतुलित भोजन बनाने में मदद करें! खाद्य पदार्थों को उनके सही पोषक समूहों में खींचें।' :
               'ସନ୍ତୁଳିତ ଭୋଜନ ନିର୍ମାଣରେ ସାହାଯ୍ୟ କରନ୍ତୁ!'}
            </p>

            <motion.div className="space-y-3">
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-bold adventure-button"
                size="lg"
              >
                <Apple className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Start Cooking!' :
                 language === 'hi' ? 'खाना बनाना शुरू करें!' :
                 'ରାନ୍ଧିବା ଆରମ୍ଭ କରନ୍ତୁ!'}
              </Button>
              
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full bg-gray-800/80 border-gray-600 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Back to Exploration' :
                 language === 'hi' ? 'अन्वेषण पर वापस' :
                 'ଅନ୍ୱେଷଣକୁ ଫେରନ୍ତୁ'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gamePhase === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 flex items-center justify-center relative overflow-hidden">
        {/* Celebration Effects */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-50, typeof window !== 'undefined' ? window.innerHeight : 800],
                rotate: [0, 360],
                opacity: [1, 0]
              }}
              transition={{
                duration: 3 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            >
              {['🍎', '🥕', '🥛', '🥜', '🥬', '🍌', '🧲', '⚡'][Math.floor(Math.random() * 8)]}
            </motion.div>
          ))}
        </div>

        <Card className="bg-emerald-900/90 border-emerald-400/50 backdrop-blur-md max-w-lg mx-4">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-treasure-shine"
            >
              <Trophy className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold text-emerald-300 mb-4">
              {isShowingSolution 
                ? (language === 'en' ? 'Solution Demonstration Complete!' :
                   language === 'hi' ? 'समाधान प्रदर्शन पूर्ण!' :
                   'ସମାଧାନ ପ୍ରଦର୍ଶନ ସମ୍ପୂର୍ଣ୍ଣ!')
                : (language === 'en' ? 'Magnetic Nutrition Master!' :
                   language === 'hi' ? 'चुंबकीय पोषण मास्टर!' :
                   'ଚୁମ୍ବକୀୟ ପୋଷଣ ମାଷ୍ଟର!')
              }
            </h1>

            <p className="text-gray-300 mb-6">
              {isShowingSolution 
                ? (language === 'en' ? 'Great job watching the solution! Now you know exactly how to group all nutrients correctly.' :
                   language === 'hi' ? 'समाधान देखने के लिए बधाई! अब आप जानते हैं कि सभी पोषक तत्वों को सही तरीके से कैसे समूहीकृत करना है।' :
                   'ସମାଧାନ ଦେଖିବା ପାଇଁ ବଧାଇ! ଏବେ ଆପଣ ଜାଣିଛନ୍ତି ସମସ୍ତ ପୋଷକ ତତ୍ତ୍ୱକୁ କିପରି ସଠିକ୍ ଭାବରେ ଗୋଷ୍ଠୀବଦ୍ଧ କରିବେ।')
                : (language === 'en' ? 'Excellent work using the magnetic system! You\'ve mastered both nutrition and magnetic attraction!' :
                   language === 'hi' ? 'चुंबकीय प्रणाली का उपयोग करके बेहतरीन काम! आपने पोषण और चुंबकीय आकर्षण दोनों में महारत हासिल की!' :
                   'ଚୁମ୍ବକୀୟ ପ୍ରଣାଳୀ ବ୍ୟବହାର କରି ଉତ୍କୃଷ୍ଟ କାମ!')
              }
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-600/20 rounded-lg p-4">
                <Star className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-green-300 font-bold text-lg">{score}</div>
                <div className="text-gray-400 text-sm">
                  {language === 'en' ? 'Score' : language === 'hi' ? 'अंक' : 'ସ୍କୋର'}
                </div>
              </div>
              
              <div className="bg-cyan-600/20 rounded-lg p-4">
                {isShowingSolution ? (
                  <Lightbulb className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                ) : (
                  <Magnet className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                )}
                <div className="text-cyan-300 font-bold text-lg">
                  {isShowingSolution ? '100%' : Math.floor(score * 0.1)}
                </div>
                <div className="text-gray-400 text-sm">
                  {isShowingSolution ? 'Learned' : 'Magnetic'}
                </div>
              </div>
              
              <div className="bg-purple-600/20 rounded-lg p-4">
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-purple-300 font-bold text-lg">
                  {isShowingSolution ? '150' : '200'}
                </div>
                <div className="text-gray-400 text-sm">XP</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setGamePhase('intro');
                  setFoodItems(FOOD_ITEMS.map((item, index) => ({
                    ...item,
                    id: index,
                    position: {
                      x: 15 + (index % 6) * 14,
                      y: 25 + Math.floor(index / 6) * 20
                    },
                    collected: false
                  })));
                  setCategories(NUTRIENT_CATEGORIES);
                  setIsShowingSolution(false);
                  setSolutionAnimating(false);
                  setScore(0);
                }}
                className="w-full bg-gradient-to-r from-emerald-400 to-green-600 hover:from-emerald-500 hover:to-green-700 text-black font-bold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Play Again' :
                 language === 'hi' ? 'फिर से खेलें' :
                 'ପୁନଃ ଖେଳନ୍ତୁ'}
              </Button>
              
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full bg-gray-800/80 border-gray-600 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Back to Exploration' :
                 language === 'hi' ? 'अन्वेषण पर वापस' :
                 'ଅନ୍ୱେଷଣକୁ ଫେରନ୍ତୁ'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div ref={gameAreaRef} className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 relative overflow-hidden game-area">
      {/* Magnetic Field Visualization */}
      {magneticAttraction && dragPosition && (
        <motion.div
          className="absolute pointer-events-none z-30"
          style={{
            left: dragPosition.x - 75,
            top: dragPosition.y - 75,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
        >
          <div className="w-36 h-36 border-4 border-dashed border-cyan-400 rounded-full animate-spin">
            <div className="absolute inset-4 border-2 border-cyan-300 rounded-full animate-pulse" />
            <div className="absolute inset-8 bg-cyan-400/20 rounded-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Magnet className="w-6 h-6 text-cyan-300" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Magnetic Field Lines */}
      {draggedItem && magneticAttraction && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none z-25"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
            >
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400/60 to-transparent transform rotate-45" />
            </motion.div>
          ))}
        </>
      )}

      {/* Nature Environment */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['🌿', '🍃', '🌺', '🌻', '🦋'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      {/* Game Header */}
      <div className="relative z-20 bg-black/40 backdrop-blur-md border-b border-emerald-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="bg-gray-800/80 border-gray-600 text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Exit' : language === 'hi' ? 'बाहर निकलें' : 'ବାହାରିବା'}
              </Button>
              
              <div>
                <h1 className="text-xl font-bold text-emerald-300 flex items-center">
                  <Magnet className="w-5 h-5 mr-2 text-cyan-400" />
                  {language === 'en' ? 'Magnetic Nutrient Navigator' :
                   language === 'hi' ? 'चुंबकीय पोषक तत्व नेविगेटर' :
                   'ଚୁମ୍ବକୀୟ ପୋଷକ ନେଭିଗେଟର'}
                </h1>
                <p className="text-gray-300 text-sm">
                  {language === 'en' ? 'Drag foods near nutrient groups for magnetic attraction' :
                   language === 'hi' ? 'चुंबकीय आकर्षण के लिए भोजन को पोषक समूहों के पास खींचें' :
                   'ଚୁମ୍ବକୀୟ ଆକର୍ଷଣ ପାଇଁ ଖାଦ୍ୟକୁ ପୋଷକ ଗୋଷ୍ଠୀ ନିକଟରେ ଟାଣନ୍ତୁ'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-emerald-300 font-bold">{score}</div>
                <div className="text-gray-400 text-xs">Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-blue-400 font-bold">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</div>
                <div className="text-gray-400 text-xs">Time</div>
              </div>
              
              <div className="text-center">
                <div className="text-purple-400 font-bold">{comboCount}</div>
                <div className="text-gray-400 text-xs">Combo</div>
              </div>

              {magneticAttraction && (
                <div className="text-center">
                  <div className="text-cyan-400 font-bold animate-pulse">🧲</div>
                  <div className="text-gray-400 text-xs">Magnetic</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-20 bg-black/20 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-300 font-medium">
              {language === 'en' ? 'Cooking Progress' :
               language === 'hi' ? 'खाना बनाने की प्रगति' :
               'ରାନ୍ଧିବା ପ୍ରଗତି'}
            </span>
            <span className="text-gray-300">
              {foodItems.filter(item => item.collected).length}/12
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-gray-700/50" />
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          
          {/* Food Market */}
          <div className="lg:col-span-2 bg-black/30 backdrop-blur-md rounded-xl border border-emerald-400/30 p-6 relative">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-emerald-300 flex items-center mb-2">
                <Apple className="w-6 h-6 mr-2" />
                {language === 'en' ? 'Food Market' :
                 language === 'hi' ? 'खाद्य बाजार' :
                 'ଖାଦ୍ୟ ବଜାର'}
              </h2>
              <p className="text-gray-400">
                {language === 'en' ? 'Drag food items to their nutrient groups' :
                 language === 'hi' ? 'खाद्य पदार्थों को उनके पोषक समूहों में खींचें' :
                 'ଖାଦ୍ୟ ପଦାର୍ଥକୁ ସେମାନଙ୍କ ପୋଷକ ଗୋଷ୍ଠୀରେ ଟାଣନ୍ତୁ'}
              </p>
            </div>

            <div className="relative w-full h-96 bg-gradient-to-br from-green-600/20 to-emerald-700/20 rounded-lg border-2 border-dashed border-emerald-400/40 overflow-hidden">
              <AnimatePresence>
                {foodItems.map((item) => {
                  const isDragged = draggedItem?.id === item.id;
                  const isAttracting = magneticAttraction && draggedItem?.id === item.id;
                  
                  return (
                    <motion.div
                      key={item.id}
                      data-food-id={item.id}
                      className={`absolute cursor-grab active:cursor-grabbing ${
                        item.collected ? 'opacity-50 pointer-events-none z-0' : 'z-20'
                      } ${isAttracting ? 'z-50' : ''} ${isDragged ? 'z-50' : ''}`}
                      style={{
                        left: `${item.position.x}%`,
                        top: `${item.position.y}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: item.collected ? 0.5 : (isDragged ? 1.3 : 1),
                        opacity: item.collected ? 0.3 : 1,
                        boxShadow: isAttracting ? '0 0 20px rgba(6, 182, 212, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.2)',
                        x: 0, // Ensure items return to their base position
                        y: 0
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: item.collected ? 0.5 : 1.1 }}
                      drag={!item.collected}
                      dragMomentum={false}
                      dragConstraints={gameAreaRef}
                      dragElastic={0.1}
                      dragSnapToOrigin={true}
                      onDragStart={() => handleDragStart(item)}
                      onDrag={(e, info) => handleDrag(item, info)}
                      onDragEnd={(e, info) => handleDragEnd(item, info)}
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 min-w-16 min-h-16 flex flex-col items-center justify-center text-center">
                        <div className="text-2xl mb-1">{item.emoji}</div>
                        <div className="text-xs font-medium text-gray-800 leading-tight">
                          {item.name[language]}
                        </div>
                        <div className="text-xs text-green-600 font-bold">+{item.points}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Nutrient Categories */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-emerald-300 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              {language === 'en' ? 'Nutrient Groups' :
               language === 'hi' ? 'पोषक समूह' :
               'ପୋଷକ ଗୋଷ୍ଠୀ'}
            </h2>
            
            {categories.map((category) => {
              const Icon = category.icon;
              const isAttracting = magneticAttraction === category.id;
              
              return (
                <motion.div
                  key={category.id}
                  data-category={category.id}
                  className={`relative z-10 bg-gradient-to-br ${category.color} rounded-lg p-4 border-2 transition-all duration-300 ${
                    hoveredCategory === category.id
                      ? 'border-white scale-105 shadow-xl'
                      : 'border-white/30'
                  } ${
                    category.collectedItems.length >= category.targetCount
                      ? 'ring-2 ring-yellow-400'
                      : ''
                  } ${
                    isAttracting
                      ? 'ring-4 ring-cyan-400 border-cyan-300 animate-pulse shadow-2xl shadow-cyan-400/50 z-30'
                      : ''
                  }`}
                  animate={{
                    scale: isAttracting ? 1.05 : 1,
                  }}
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 text-white mr-2" />
                      <h3 className="font-bold text-white">
                        {category.name[language]}
                      </h3>
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {category.collectedItems.length}/{category.targetCount}
                    </Badge>
                  </div>
                  
                  <p className="text-white/80 text-sm mb-3">
                    {category.description[language]}
                  </p>
                  
                  {/* Collected items display */}
                  <div className="flex flex-wrap gap-1">
                    {category.collectedItems.map((itemId) => {
                      const item = foodItems.find(f => f.id === itemId);
                      return item ? (
                        <div key={itemId} className="text-lg">
                          {item.emoji}
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  {category.collectedItems.length >= category.targetCount && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-6 h-6 text-yellow-400" />
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
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/90 backdrop-blur-md text-white px-6 py-3 rounded-lg border border-emerald-400/50 shadow-xl"
          >
            <p className="font-medium">{feedbackMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solution Button - Fixed at bottom center */}
      {!solutionAnimating && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
        >
          <Button
            onClick={showSolution}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-6 py-3 rounded-full shadow-2xl border-2 border-yellow-300 adventure-button"
            size="lg"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Show Solution' :
             language === 'hi' ? 'समाधान दिखाएं' :
             'ସମାଧାନ ଦେଖାନ୍ତୁ'}
          </Button>
        </motion.div>
      )}

      {/* Solution Animation Overlay */}
      {solutionAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <Card className="bg-emerald-900/90 border-emerald-400/50 backdrop-blur-md max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center"
              >
                <Lightbulb className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-bold text-emerald-300 mb-2">
                {language === 'en' ? 'Demonstrating Solution...' :
                 language === 'hi' ? 'समाधान प्रदर्शित कर रहे हैं...' :
                 'ସମାଧାନ ପ୍ରଦର୍ଶନ କରୁଛୁ...'}
              </h3>
              
              <p className="text-gray-300">
                {language === 'en' ? 'Watch carefully and learn!' :
                 language === 'hi' ? 'ध्यान से देखें और सीखें!' :
                 'ଧ୍ୟାନରେ ଦେଖନ୍ତୁ ଏବଂ ଶିଖନ୍ତୁ!'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}