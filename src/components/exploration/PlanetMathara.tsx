import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Calculator,
  Shapes,
  BarChart,
  TrendingUp,
  Zap,
  Star,
  Trophy,
  Play,
  Lock,
  CheckCircle,
  Target,
  Gamepad2,
  Crown,
  Compass,
  Lightbulb,
  Puzzle,
  Globe,
  Atom,
  Brain
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import type { Language } from '../../types/onboarding';

interface PlanetMatharaProps {
  language: Language;
  onBack: () => void;
  onNavigateToMission: (missionId: string) => void;
}

interface MathTopic {
  id: string;
  name: { en: string; hi: string; or: string };
  description: { en: string; hi: string; or: string };
  icon: React.ElementType;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  estimatedTime: number;
  isUnlocked: boolean;
  progress: number;
  position: { x: number; y: number };
  glowColor: string;
  subGames: {
    id: string;
    name: { en: string; hi: string; or: string };
    type: 'game' | 'puzzle' | 'challenge';
  }[];
}

const MATH_TOPICS: MathTopic[] = [
  // Featured Math Demo Game - Working Interactive Game
  {
    id: 'math-lab',
    name: { 
      en: '🔢 Math Laboratory', 
      hi: '🔢 गणित प्रयोगशाला', 
      or: '🔢 ଗଣିତ ଲାବୋରେଟୋରୀ' 
    },
    description: { 
      en: 'Interactive math lab! Compare numbers, solve puzzles, and discover the magic of mathematics!', 
      hi: 'इंटरैक्टिव गणित प्रयोगशाला! संख्याओं की तुलना करें, पहेलियां सुलझाएं, और गणित के जादू की खोज करें!', 
      or: 'ଇଣ୍ଟରାକ୍ଟିଭ ଗଣିତ ଲାବୋରେଟୋରୀ! ସଂଖ୍ୟା ତୁଳନା କରନ୍ତୁ, ପଜଲ ସମାଧାନ କରନ୍ତୁ!' 
    },
    icon: Calculator,
    color: 'from-purple-600 to-blue-600',
    difficulty: 'beginner',
    xpReward: 200,
    estimatedTime: 20,
    isUnlocked: true,
    progress: 0,
    position: { x: 10, y: 8 },
    glowColor: 'rgba(147, 51, 234, 0.8)',
    subGames: [
      { id: 'number-compare', name: { en: 'Number Compare', hi: 'संख्या तुलना', or: 'ସଂଖ୍ୟା ତୁଳନା' }, type: 'game' },
      { id: 'math-puzzle', name: { en: 'Math Puzzle', hi: 'गणित पहेली', or: 'ଗଣିତ ପଜଲ' }, type: 'puzzle' },
      { id: 'quick-math', name: { en: 'Quick Math', hi: 'त्वरित गणित', or: 'ଦ୍ରୁତ ଗଣିତ' }, type: 'challenge' }
    ]
  },
  {
    id: 'knowing-numbers',
    name: { 
      en: 'Number Universe', 
      hi: 'संख्या ब्रह्मांड', 
      or: 'ସଂଖ୍ୟା ବ୍ରହ୍ମାଣ୍ଡ' 
    },
    description: { 
      en: 'Explore the infinite world of numbers, comparison, and Roman mysteries!', 
      hi: 'संख्याओं की अनंत दुनिया, तुलना और रोमन रहस्यों का अन्वेषण करें!', 
      or: 'ସଂଖ୍ୟାର ଅସୀମ ଜଗତ, ତୁଳନା ଏବଂ ରୋମାନ ରହସ୍ୟ ଅନ୍ୱେଷଣ କରନ୍ତୁ!' 
    },
    icon: Crown,
    color: 'from-purple-600 to-pink-600',
    difficulty: 'beginner',
    xpReward: 150,
    estimatedTime: 25,
    isUnlocked: true,
    progress: 0,
    position: { x: 20, y: 15 },
    glowColor: 'rgba(147, 51, 234, 0.6)',
    subGames: [
      { id: 'number-comparison', name: { en: 'Number Warrior', hi: 'संख्या योद्धा', or: 'ସଂଖ୍ୟା ଯୋଦ୍ଧା' }, type: 'game' },
      { id: 'roman-adventure', name: { en: 'Roman Quest', hi: 'रोमन खोज', or: 'ରୋମାନ ଅନ୍ୱେଷଣ' }, type: 'puzzle' },
      { id: 'estimation-master', name: { en: 'Estimation Wizard', hi: 'अनुमान जादूगर', or: 'ଅନୁମାନ ଯାଦୁଗର' }, type: 'challenge' }
    ]
  },
  {
    id: 'whole-numbers',
    name: { 
      en: 'Whole Number Kingdom', 
      hi: 'पूर्ण संख्या राज्य', 
      or: 'ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା ରାଜ୍ୟ' 
    },
    description: { 
      en: 'Master the properties and patterns of whole numbers in magical battles!', 
      hi: 'जादुई लड़ाइयों में पूर्ण संख्याओं के गुणों और पैटर्न में महारत हासिल करें!', 
      or: 'ଯାଦୁଗର ଯୁଦ୍ଧରେ ପୂର୍ଣ୍ଣ ସଂଖ୍ୟାର ଗୁଣ ଏବଂ ପ୍ୟାଟର୍ନରେ ଦକ୍ଷତା ଅର୍ଜନ କରନ୍ତୁ!' 
    },
    icon: Compass,
    color: 'from-blue-600 to-cyan-600',
    difficulty: 'beginner',
    xpReward: 180,
    estimatedTime: 30,
    isUnlocked: true,
    progress: 25,
    position: { x: 45, y: 25 },
    glowColor: 'rgba(37, 99, 235, 0.6)',
    subGames: [
      { id: 'properties-battle', name: { en: 'Property Warrior', hi: 'गुण योद्धा', or: 'ଗୁଣ ଯୋଦ୍ଧା' }, type: 'game' },
      { id: 'pattern-hunter', name: { en: 'Pattern Detective', hi: 'पैटर्न जासूस', or: 'ପ୍ୟାଟର୍ନ ଗୁପ୍ତଚର' }, type: 'puzzle' },
      { id: 'closure-challenge', name: { en: 'Closure Master', hi: 'बंद मास्टर', or: 'ବନ୍ଦ ମାଷ୍ଟର' }, type: 'challenge' }
    ]
  },
  {
    id: 'playing-numbers',
    name: { 
      en: 'Number Playground', 
      hi: 'संख्या खेल का मैदान', 
      or: 'ସଂଖ୍ୟା ଖେଳ ମଇଦାନ' 
    },
    description: { 
      en: 'Discover factors, multiples, and prime secrets in the Number Arcade!', 
      hi: 'नंबर आर्केड में कारक, गुणज और अभाज्य रहस्यों की खोज करें!', 
      or: 'ନମ୍ବର ଆର୍କେଡରେ ଗୁଣନୀୟକ, ଗୁଣିତକ ଏବଂ ମୌଳିକ ରହସ୍ୟ ଆବିଷ୍କାର କରନ୍ତୁ!' 
    },
    icon: Gamepad2,
    color: 'from-green-600 to-emerald-600',
    difficulty: 'intermediate',
    xpReward: 200,
    estimatedTime: 35,
    isUnlocked: true,
    progress: 0,
    position: { x: 70, y: 15 },
    glowColor: 'rgba(34, 197, 94, 0.6)',
    subGames: [
      { id: 'factor-factory', name: { en: 'Factor Factory', hi: 'कारक कारखाना', or: 'ଗୁଣନୀୟକ କାରଖାନା' }, type: 'game' },
      { id: 'prime-hunter', name: { en: 'Prime Hunter', hi: 'अभाज्य शिकारी', or: 'ମୌଳିକ ଶିକାରୀ' }, type: 'puzzle' },
      { id: 'divisibility-dash', name: { en: 'Divisibility Dash', hi: 'विभाज्यता डैश', or: 'ବିଭାଜ୍ୟତା ଡ୍ୟାସ୍' }, type: 'challenge' }
    ]
  },
  {
    id: 'geometry-basics',
    name: { 
      en: 'Geometry Galaxy', 
      hi: 'ज्यामिति आकाशगंगा', 
      or: 'ଜ୍ୟାମିତି ଗାଲାକ୍ସି' 
    },
    description: { 
      en: 'Journey through points, lines, and shapes in the cosmic geometry realm!', 
      hi: 'कॉस्मिक ज्यामिति क्षेत्र में बिंदुओं, रेखाओं और आकृतियों के माध्यम से यात्रा करें!', 
      or: 'ମହାକାଶୀୟ ଜ୍ୟାମିତି କ୍ଷେତ୍ରରେ ବିନ୍ଦୁ, ରେଖା ଏବଂ ଆକୃତିର ମାଧ୍ୟମରେ ଯାତ୍ରା କରନ୍ତୁ!' 
    },
    icon: Shapes,
    color: 'from-orange-600 to-red-600',
    difficulty: 'intermediate',
    xpReward: 220,
    estimatedTime: 40,
    isUnlocked: true,
    progress: 60,
    position: { x: 25, y: 45 },
    glowColor: 'rgba(234, 88, 12, 0.6)',
    subGames: [
      { id: 'shape-explorer', name: { en: 'Shape Explorer', hi: 'आकार अन्वेषक', or: 'ଆକାର ଅନ୍ୱେଷକ' }, type: 'game' },
      { id: 'angle-adventure', name: { en: 'Angle Adventure', hi: 'कोण साहसिक', or: 'କୋଣ ଦୁଃସାହସିକ' }, type: 'puzzle' },
      { id: 'polygon-palace', name: { en: 'Polygon Palace', hi: 'बहुभुज महल', or: 'ବହୁଭୁଜ ମହଲ' }, type: 'challenge' }
    ]
  },
  {
    id: 'elementary-shapes',
    name: { 
      en: 'Shape Dimension', 
      hi: 'आकार आयाम', 
      or: 'ଆକାର ଆୟାମ' 
    },
    description: { 
      en: 'Explore angles, triangles, and 3D worlds in the Shape Laboratory!', 
      hi: 'शेप प्रयोगशाला में कोण, त्रिकोण और 3डी दुनिया का अन्वेषण करें!', 
      or: 'ଶେପ୍ ଲାବୋରେଟୋରୀରେ କୋଣ, ତ୍ରିଭୁଜ ଏବଂ 3D ଦୁନିଆ ଅନ୍ୱେଷଣ କରନ୍ତୁ!' 
    },
    icon: Globe,
    color: 'from-indigo-600 to-purple-600',
    difficulty: 'intermediate',
    xpReward: 240,
    estimatedTime: 45,
    isUnlocked: true,
    progress: 30,
    position: { x: 55, y: 55 },
    glowColor: 'rgba(99, 102, 241, 0.6)',
    subGames: [
      { id: 'angle-master', name: { en: 'Angle Master', hi: 'कोण मास्टर', or: 'କୋଣ ମାଷ୍ଟର' }, type: 'game' },
      { id: 'triangle-quest', name: { en: 'Triangle Quest', hi: 'त्रिकोण खोज', or: 'ତ୍ରିଭୁଜ ଅନ୍ୱେଷଣ' }, type: 'puzzle' },
      { id: '3d-explorer', name: { en: '3D Explorer', hi: '3डी अन्वेषक', or: '3D ଅନ୍ୱେଷକ' }, type: 'challenge' }
    ]
  },
  {
    id: 'integers',
    name: { 
      en: 'Integer Island', 
      hi: 'पूर्णांक द्वीप', 
      or: 'ପୂର୍ଣ୍ଣାଙ୍କ ଦ୍ୱୀପ' 
    },
    description: { 
      en: 'Navigate the positive and negative worlds on the Number Line Express!', 
      hi: 'नंबर लाइन एक्सप्रेस पर सकारात्मक और नकारात्मक दुनिया में नेविगेट करें!', 
      or: 'ନମ୍ବର ଲାଇନ୍ ଏକ୍ସପ୍ରେସରେ ସକରାତ୍ମକ ଏବଂ ନକରାତ୍ମକ ଦୁନିଆରେ ନେଭିଗେଟ୍ କରନ୍ତୁ!' 
    },
    icon: TrendingUp,
    color: 'from-teal-600 to-blue-600',
    difficulty: 'intermediate',
    xpReward: 190,
    estimatedTime: 30,
    isUnlocked: false,
    progress: 0,
    position: { x: 80, y: 40 },
    glowColor: 'rgba(20, 184, 166, 0.6)',
    subGames: [
      { id: 'number-line-race', name: { en: 'Number Line Race', hi: 'संख्या रेखा दौड़', or: 'ସଂଖ୍ୟା ରେଖା ଦୌଡ଼' }, type: 'game' },
      { id: 'positive-negative', name: { en: 'Positive vs Negative', hi: 'सकारात्मक बनाम नकारात्मक', or: 'ସକରାତ୍ମକ ବନାମ ନକରାତ୍ମକ' }, type: 'puzzle' },
      { id: 'integer-operations', name: { en: 'Integer Operations', hi: 'पूर्णांक संचालन', or: 'ପୂର୍ଣ୍ଣାଙ୍କ ସଞ୍ଚାଳନ' }, type: 'challenge' }
    ]
  },
  {
    id: 'fractions',
    name: { 
      en: 'Fraction Fantasy', 
      hi: 'भिन्न कल्पना', 
      or: 'ଭିନ୍ନ କଳ୍ପନା' 
    },
    description: { 
      en: 'Slice and dice your way through the magical world of fractions!', 
      hi: 'भिन्नों की जादुई दुनिया के माध्यम से अपना रास्ता काटें और काटें!', 
      or: 'ଭିନ୍ନର ଯାଦୁଗର ଦୁନିଆ ମାଧ୍ୟମରେ ନିଜର ରାସ୍ତା କାଟନ୍ତୁ!' 
    },
    icon: Puzzle,
    color: 'from-rose-600 to-pink-600',
    difficulty: 'intermediate',
    xpReward: 210,
    estimatedTime: 35,
    isUnlocked: false,
    progress: 0,
    position: { x: 15, y: 70 },
    glowColor: 'rgba(244, 63, 94, 0.6)',
    subGames: [
      { id: 'pizza-fractions', name: { en: 'Pizza Party', hi: 'पिज्जा पार्टी', or: 'ପିଜା ପାର୍ଟି' }, type: 'game' },
      { id: 'equivalent-explorer', name: { en: 'Equivalent Explorer', hi: 'समकक्ष अन्वेषक', or: 'ସମତୁଲ୍ୟ ଅନ୍ୱେଷକ' }, type: 'puzzle' },
      { id: 'fraction-arithmetic', name: { en: 'Fraction Arithmetic', hi: 'भिन्न गणित', or: 'ଭିନ୍ନ ଗଣିତ' }, type: 'challenge' }
    ]
  },
  {
    id: 'decimals',
    name: { 
      en: 'Decimal Domain', 
      hi: 'दशमलव डोमेन', 
      or: 'ଦଶମିକ ଡୋମେନ୍' 
    },
    description: { 
      en: 'Precision adventures in the land of tenths, hundredths, and money!', 
      hi: 'दसवें, सौवें और पैसे की भूमि में सटीक साहसिक कार्य!', 
      or: 'ଦଶମ, ଶତମ ଏବଂ ଟଙ୍କା ଦେଶରେ ସଠିକ ଦୁଃସାହସିକ କାର୍ଯ୍ୟ!' 
    },
    icon: Target,
    color: 'from-amber-600 to-orange-600',
    difficulty: 'intermediate',
    xpReward: 200,
    estimatedTime: 30,
    isUnlocked: false,
    progress: 0,
    position: { x: 40, y: 75 },
    glowColor: 'rgba(245, 158, 11, 0.6)',
    subGames: [
      { id: 'decimal-market', name: { en: 'Decimal Market', hi: 'दशमलव बाजार', or: 'ଦଶମିକ ବଜାର' }, type: 'game' },
      { id: 'money-master', name: { en: 'Money Master', hi: 'पैसा मास्टर', or: 'ଟଙ୍କା ମାଷ୍ଟର' }, type: 'puzzle' },
      { id: 'precision-challenge', name: { en: 'Precision Challenge', hi: 'सटीकता चुनौती', or: 'ସଠିକତା ଚୁନୌତି' }, type: 'challenge' }
    ]
  },
  {
    id: 'data-handling',
    name: { 
      en: 'Data Detective', 
      hi: 'डेटा जासूस', 
      or: 'ଡାଟା ଗୁପ୍ତଚର' 
    },
    description: { 
      en: 'Solve mysteries using pictographs, bar graphs, and data analysis!', 
      hi: 'चित्रलेख, बार ग्राफ और डेटा विश्लेषण का उपयोग करके रहस्यों को सुलझाएं!', 
      or: 'ଚିତ୍ରଲେଖ, ବାର୍ ଗ୍ରାଫ୍ ଏବଂ ଡାଟା ବିଶ୍ଳେଷଣ ବ୍ୟବହାର କରି ରହସ୍ୟ ସମାଧାନ କରନ୍ତୁ!' 
    },
    icon: BarChart,
    color: 'from-violet-600 to-purple-600',
    difficulty: 'intermediate',
    xpReward: 180,
    estimatedTime: 25,
    isUnlocked: false,
    progress: 0,
    position: { x: 65, y: 75 },
    glowColor: 'rgba(139, 92, 246, 0.6)',
    subGames: [
      { id: 'graph-builder', name: { en: 'Graph Builder', hi: 'ग्राफ बिल्डर', or: 'ଗ୍ରାଫ୍ ବିଲ୍ଡର୍' }, type: 'game' },
      { id: 'data-mystery', name: { en: 'Data Mystery', hi: 'डेटा रहस्य', or: 'ଡାଟା ରହସ୍ୟ' }, type: 'puzzle' },
      { id: 'chart-champion', name: { en: 'Chart Champion', hi: 'चार्ट चैंपियन', or: 'ଚାର୍ଟ ଚାମ୍ପିଅନ୍' }, type: 'challenge' }
    ]
  },
  {
    id: 'mensuration',
    name: { 
      en: 'Measurement Metropolis', 
      hi: 'माप महानगर', 
      or: 'ମାପ ମହାନଗର' 
    },
    description: { 
      en: 'Build cities while mastering perimeter and area calculations!', 
      hi: 'परिधि और क्षेत्रफल की गणना में महारत हासिल करते हुए शहर बनाएं!', 
      or: 'ପରିସୀମା ଏବଂ କ୍ଷେତ୍ରଫଳ ଗଣନାରେ ଦକ୍ଷତା ଅର୍ଜନ କରି ସହର ନିର୍ମାଣ କରନ୍ତୁ!' 
    },
    icon: Calculator,
    color: 'from-emerald-600 to-green-600',
    difficulty: 'advanced',
    xpReward: 250,
    estimatedTime: 40,
    isUnlocked: false,
    progress: 0,
    position: { x: 85, y: 65 },
    glowColor: 'rgba(16, 185, 129, 0.6)',
    subGames: [
      { id: 'perimeter-patrol', name: { en: 'Perimeter Patrol', hi: 'परिधि गश्त', or: 'ପରିସୀମା ପାଟ୍ରୋଲ୍' }, type: 'game' },
      { id: 'area-architect', name: { en: 'Area Architect', hi: 'क्षेत्र आर्किटेक्ट', or: 'କ୍ଷେତ୍ର ସ୍ଥପତି' }, type: 'puzzle' },
      { id: 'city-planner', name: { en: 'City Planner', hi: 'शहर योजनाकार', or: 'ସହର ଯୋଜନାକାରୀ' }, type: 'challenge' }
    ]
  },
  {
    id: 'algebra-intro',
    name: { 
      en: 'Algebra Academy', 
      hi: 'बीजगणित अकादमी', 
      or: 'ବୀଜଗଣିତ ଏକାଡେମୀ' 
    },
    description: { 
      en: 'Unlock the secrets of variables and equations in magical formulas!', 
      hi: 'जादुई सूत्रों में चर और समीकरणों के रहस्यों को अनलॉक करें!', 
      or: 'ଯାଦୁଗର ସୂତ୍ରରେ ଚଳ ଏବଂ ସମୀକରଣର ରହସ୍ୟ ଅନଲକ୍ କରନ୍ତୁ!' 
    },
    icon: Brain,
    color: 'from-sky-600 to-blue-600',
    difficulty: 'advanced',
    xpReward: 280,
    estimatedTime: 45,
    isUnlocked: false,
    progress: 0,
    position: { x: 20, y: 95 },
    glowColor: 'rgba(2, 132, 199, 0.6)',
    subGames: [
      { id: 'variable-village', name: { en: 'Variable Village', hi: 'चर गांव', or: 'ଚଳ ଗାଁ' }, type: 'game' },
      { id: 'equation-explorer', name: { en: 'Equation Explorer', hi: 'समीकरण अन्वेषक', or: 'ସମୀକରଣ ଅନ୍ୱେଷକ' }, type: 'puzzle' },
      { id: 'formula-forge', name: { en: 'Formula Forge', hi: 'सूत्र फोर्ज', or: 'ସୂତ୍ର ଫୋର୍ଜ' }, type: 'challenge' }
    ]
  },
  {
    id: 'ratio-proportion',
    name: { 
      en: 'Ratio Realm', 
      hi: 'अनुपात क्षेत्र', 
      or: 'ଅନୁପାତ କ୍ଷେତ୍ର' 
    },
    description: { 
      en: 'Balance the universe with ratios, proportions, and unitary methods!', 
      hi: 'अनुपात, अनुपात और एकात्मक विधियों के साथ ब्रह्मांड को संतुलित करें!', 
      or: 'ଅନୁପାତ, ଅନୁପାତ ଏବଂ ଏକକ ପଦ୍ଧତି ସହିତ ବ୍ରହ୍ମାଣ୍ଡକୁ ସନ୍ତୁଳିତ କରନ୍ତୁ!' 
    },
    icon: Lightbulb,
    color: 'from-lime-600 to-green-600',
    difficulty: 'advanced',
    xpReward: 220,
    estimatedTime: 35,
    isUnlocked: false,
    progress: 0,
    position: { x: 50, y: 90 },
    glowColor: 'rgba(101, 163, 13, 0.6)',
    subGames: [
      { id: 'ratio-race', name: { en: 'Ratio Race', hi: 'अनुपात दौड़', or: 'ଅନୁପାତ ଦୌଡ଼' }, type: 'game' },
      { id: 'proportion-palace', name: { en: 'Proportion Palace', hi: 'अनुपात महल', or: 'ଅନୁପାତ ମହଲ' }, type: 'puzzle' },
      { id: 'unitary-universe', name: { en: 'Unitary Universe', hi: 'एकात्मक ब्रह्मांड', or: 'ଏକକ ବ୍ରହ୍ମାଣ୍ଡ' }, type: 'challenge' }
    ]
  },
  {
    id: 'symmetry',
    name: { 
      en: 'Symmetry Sanctuary', 
      hi: 'सममिति अभयारण्य', 
      or: 'ସମମିତି ଅଭୟାରଣ୍ୟ' 
    },
    description: { 
      en: 'Create beautiful patterns and discover reflective symmetries!', 
      hi: 'सुंदर पैटर्न बनाएं और प्रतिबिंबित समरूपता की खोज करें!', 
      or: 'ସୁନ୍ଦର ପ୍ୟାଟର୍ନ ସୃଷ୍ଟି କରନ୍ତୁ ଏବଂ ପ୍ରତିଫଳିତ ସମମିତି ଆବିଷ୍କାର କରନ୍ତୁ!' 
    },
    icon: Atom,
    color: 'from-fuchsia-600 to-pink-600',
    difficulty: 'advanced',
    xpReward: 200,
    estimatedTime: 30,
    isUnlocked: false,
    progress: 0,
    position: { x: 75, y: 85 },
    glowColor: 'rgba(192, 38, 211, 0.6)',
    subGames: [
      { id: 'mirror-magic', name: { en: 'Mirror Magic', hi: 'दर्पण जादू', or: 'ଦର୍ପଣ ଯାଦୁ' }, type: 'game' },
      { id: 'pattern-creator', name: { en: 'Pattern Creator', hi: 'पैटर्न निर्माता', or: 'ପ୍ୟାଟର୍ନ ସୃଷ୍ଟିକର୍ତ୍ତା' }, type: 'puzzle' },
      { id: 'symmetry-studio', name: { en: 'Symmetry Studio', hi: 'सममिति स्टूडियो', or: 'ସମମିତି ଷ୍ଟୁଡିଓ' }, type: 'challenge' }
    ]
  }
];

export function PlanetMathara({ language, onBack, onNavigateToMission }: PlanetMatharaProps) {
  const [selectedTopic, setSelectedTopic] = useState<MathTopic | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number; delay: number }>>([]);

  // Generate cosmic background stars
  useEffect(() => {
    const starField = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 5
    }));
    setStars(starField);
  }, []);

  const handleTopicSelect = (topic: MathTopic) => {
    if (!topic.isUnlocked) return;
    setSelectedTopic(topic);
    setIsExploring(true);
  };

  const handleGameSelect = (gameId: string) => {
    if (selectedTopic) {
      onNavigateToMission(`${selectedTopic.id}-${gameId}`);
    }
  };

  const getTotalProgress = () => {
    const totalTopics = MATH_TOPICS.length;
    const completedProgress = MATH_TOPICS.reduce((sum, topic) => sum + topic.progress, 0);
    return (completedProgress / (totalTopics * 100)) * 100;
  };

  const getUnlockedCount = () => {
    return MATH_TOPICS.filter(topic => topic.isUnlocked).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0">
        {/* Animated Stars */}
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + star.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Cosmic Nebulas */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              width: `${200 + Math.random() * 300}px`,
              height: `${200 + Math.random() * 300}px`,
              background: `radial-gradient(circle, ${
                ['rgba(147, 51, 234, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(236, 72, 153, 0.3)', 'rgba(34, 197, 94, 0.3)', 'rgba(245, 158, 11, 0.3)'][i]
              }, transparent)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Floating Mathematical Symbols */}
        {['+', '÷', '×', '=', '∞', 'π', '√', '∠', '△', '□'].map((symbol, i) => (
          <motion.div
            key={symbol}
            className="absolute text-white/20 text-6xl font-bold select-none pointer-events-none"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
          >
            {symbol}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-20 bg-black/30 backdrop-blur-md border-b border-purple-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="bg-purple-800/80 border-purple-400 text-purple-200 hover:bg-purple-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Back to Universe' : language === 'hi' ? 'ब्रह्मांड पर वापस' : 'ବ୍ରହ୍ମାଣ୍ଡକୁ ଫେରନ୍ତୁ'}
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-yellow-400" />
                  {language === 'en' ? 'Planet Mathara - Mathematical Adventures' :
                   language === 'hi' ? 'ग्रह मैथारा - गणितीय साहसिक कार्य' :
                   'ଗ୍ରହ ମାଥାରା - ଗାଣିତିକ ଦୁଃସାହସିକ କାର୍ଯ୍ୟ'}
                </h1>
                <p className="text-purple-200">
                  {language === 'en' ? 'Master Class 6 Mathematics through epic quests and challenges!' :
                   language === 'hi' ? 'महाकाव्य खोज और चुनौतियों के माध्यम से कक्षा 6 गणित में महारत हासिल करें!' :
                   'ମହାକାବ୍ୟ ଅନ୍ୱେଷଣ ଏବଂ ଚୁନୌତି ମାଧ୍ୟମରେ କକ୍ଷା 6 ଗଣିତରେ ଦକ୍ଷତା ଅର୍ଜନ କରନ୍ତୁ!'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-lg">{getUnlockedCount()}/{MATH_TOPICS.length}</div>
                <div className="text-purple-200 text-sm">{language === 'en' ? 'Unlocked' : language === 'hi' ? 'अनलॉक्ड' : 'ଅନଲକ୍ଡ'}</div>
              </div>
              
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg">{getTotalProgress().toFixed(0)}%</div>
                <div className="text-purple-200 text-sm">{language === 'en' ? 'Progress' : language === 'hi' ? 'प्रगति' : 'ପ୍ରଗତି'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {!selectedTopic ? (
            // Topic Selection Grid
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {MATH_TOPICS.map((topic, index) => {
                const Icon = topic.icon;
                const isLocked = !topic.isUnlocked;
                
                return (
                  <motion.div
                    key={topic.id}
                    className={`relative group cursor-pointer ${isLocked ? 'opacity-60' : ''}`}
                    style={{
                      gridColumn: index % 4 === 0 ? 'span 2' : 'span 1'
                    }}
                    whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={() => handleTopicSelect(topic)}
                    layout
                  >
                    <Card className={`relative overflow-hidden h-full bg-gradient-to-br ${topic.color} border-0 shadow-2xl group-hover:shadow-3xl transition-all duration-500 ${
                      !isLocked ? 'hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]' : ''
                    }`}>
                      <CardContent className="p-6 h-full flex flex-col">
                        {/* Glow Effect */}
                        {!isLocked && (
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                            style={{
                              background: `radial-gradient(circle at center, ${topic.glowColor}, transparent 70%)`
                            }}
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0, 0.3, 0]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}

                        {/* Lock Overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Lock className="w-12 h-12 text-white/80" />
                            </motion.div>
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-4">
                          <motion.div
                            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </motion.div>

                          <div className="text-right">
                            <Badge className="bg-white/20 text-white border-white/30 mb-2">
                              {topic.difficulty === 'beginner' 
                                ? (language === 'en' ? 'Beginner' : language === 'hi' ? 'नौसिखिया' : 'ନବାଗତ')
                                : topic.difficulty === 'intermediate'
                                ? (language === 'en' ? 'Intermediate' : language === 'hi' ? 'मध्यम' : 'ମଧ୍ୟମ')
                                : (language === 'en' ? 'Advanced' : language === 'hi' ? 'उन्नत' : 'ଉନ୍ନତ')}
                            </Badge>
                            <div className="text-white/80 text-sm">
                              ⚡ {topic.xpReward} XP
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
                          {topic.name[language]}
                        </h3>

                        <p className="text-white/90 text-sm mb-4 flex-grow">
                          {topic.description[language]}
                        </p>

                        {/* Progress Bar */}
                        {!isLocked && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-white/80 text-xs">
                              <span>{language === 'en' ? 'Progress' : language === 'hi' ? 'प्रगति' : 'ପ୍ରଗତି'}</span>
                              <span>{topic.progress}%</span>
                            </div>
                            <Progress value={topic.progress} className="h-2 bg-white/20" />
                          </div>
                        )}

                        {/* Sub-games preview */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {topic.subGames.slice(0, 3).map((game, idx) => (
                            <Badge 
                              key={game.id} 
                              variant="outline" 
                              className="text-xs bg-white/10 text-white border-white/30"
                            >
                              {game.type === 'game' ? '🎮' : game.type === 'puzzle' ? '🧩' : '🏆'}
                            </Badge>
                          ))}
                        </div>

                        {/* Floating geometric shapes */}
                        <div className="absolute -top-4 -right-4 opacity-20">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <Shapes className="w-16 h-16 text-white" />
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            // Game Selection View
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Topic Header */}
              <div className="text-center space-y-4">
                <Button
                  onClick={() => setSelectedTopic(null)}
                  variant="outline"
                  className="mb-4 bg-purple-800/50 border-purple-400 text-purple-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Back to Topics' : language === 'hi' ? 'विषयों पर वापस' : 'ବିଷୟଗୁଡ଼ିକୁ ଫେରନ୍ତୁ'}
                </Button>

                <motion.div
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${selectedTopic.color} shadow-2xl mb-4`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      `0 0 20px ${selectedTopic.glowColor}`,
                      `0 0 40px ${selectedTopic.glowColor}`,
                      `0 0 20px ${selectedTopic.glowColor}`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <selectedTopic.icon className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="text-4xl font-bold text-white mb-2">
                  {selectedTopic.name[language]}
                </h2>
                <p className="text-purple-200 max-w-2xl mx-auto">
                  {selectedTopic.description[language]}
                </p>
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTopic.subGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGameSelect(game.id)}
                  >
                    <Card className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-500 h-full">
                      <CardContent className="p-6 text-center space-y-4">
                        {/* Game Type Icon */}
                        <motion.div
                          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                            game.type === 'game' 
                              ? 'bg-green-500/20 text-green-400' 
                              : game.type === 'puzzle'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-orange-500/20 text-orange-400'
                          }`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          {game.type === 'game' ? (
                            <Gamepad2 className="w-8 h-8" />
                          ) : game.type === 'puzzle' ? (
                            <Puzzle className="w-8 h-8" />
                          ) : (
                            <Trophy className="w-8 h-8" />
                          )}
                        </motion.div>

                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors">
                          {game.name[language]}
                        </h3>

                        <Badge className={`${
                          game.type === 'game' 
                            ? 'bg-green-500/20 text-green-300 border-green-400/50' 
                            : game.type === 'puzzle'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-400/50'
                            : 'bg-orange-500/20 text-orange-300 border-orange-400/50'
                        }`}>
                          {game.type === 'game' 
                            ? (language === 'en' ? 'Interactive Game' : language === 'hi' ? 'इंटरैक्टिव गेम' : 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ଗେମ୍')
                            : game.type === 'puzzle'
                            ? (language === 'en' ? 'Brain Puzzle' : language === 'hi' ? 'दिमागी पहेली' : 'ମସ୍ତିଷ୍କ ପହେଲି')
                            : (language === 'en' ? 'Challenge Mode' : language === 'hi' ? 'चैलेंज मोड' : 'ଚ୍ୟାଲେଞ୍ଜ ମୋଡ୍')}
                        </Badge>

                        <motion.div
                          className="flex items-center justify-center text-white/80"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Play className="w-5 h-5 mr-2" />
                          {language === 'en' ? 'Play Now' : language === 'hi' ? 'अभी खेलें' : 'ବର୍ତ୍ତମାନ ଖେଳନ୍ତୁ'}
                        </motion.div>

                        {/* Floating particles */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white/30 rounded-full"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                              }}
                              animate={{
                                y: [-10, 10, -10],
                                opacity: [0.3, 0.8, 0.3]
                              }}
                              transition={{
                                duration: 2 + Math.random() * 2,
                                repeat: Infinity,
                                delay: i * 0.5
                              }}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Action Elements */}
      <AnimatePresence>
        {!selectedTopic && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-8 right-8 z-30"
          >
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(147, 51, 234, 0.5)',
                  '0 0 40px rgba(147, 51, 234, 0.8)',
                  '0 0 20px rgba(147, 51, 234, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-8 h-8" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}