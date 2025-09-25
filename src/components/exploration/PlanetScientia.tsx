import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Atom,
  Zap,
  Droplet,
  Leaf,
  User,
  Eye,
  Magnet,
  Wind,
  Trash,
  Beaker,
  FlaskConical,
  Lightbulb,
  Heart,
  TreePine,
  Globe,
  Gauge,
  Sun,
  Battery,
  Star,
  Play,
  Lock,
  CheckCircle,
  Trophy,
  Target,
  Gamepad2,
  Puzzle,
  Crown,
  Microscope,
  Compass,
  Flower,
  Fish,
  Mountain,
  Cpu
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import type { Language } from '../../types/onboarding';

interface PlanetScientiaProps {
  language: Language;
  onBack: () => void;
  onNavigateToMission: (missionId: string) => void;
}

interface ScienceTopic {
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

const SCIENCE_TOPICS: ScienceTopic[] = [
  // Featured Lab Games - Working Interactive Labs
  {
    id: 'chemistry-lab',
    name: { 
      en: '🧪 Chemistry Laboratory', 
      hi: '🧪 रसायन प्रयोगशाला', 
      or: '🧪 ରସାୟନ ଲାବୋରେଟୋରୀ' 
    },
    description: { 
      en: 'Fully interactive chemistry lab! Mix chemicals, create reactions, and discover the magic of chemistry safely!', 
      hi: 'पूरी तरह से इंटरैक्टिव रसायन प्रयोगशाला! रसायनों को मिलाएं, प्रतिक्रियाएं बनाएं, और रसायन विज्ञान के जादू को सुरक्षित रूप से खोजें!', 
      or: 'ସମ୍ପୂର୍ଣ୍ଣ ଇଣ୍ଟରାକ୍ଟିଭ ରସାୟନ ଲାବୋରେଟୋରୀ! ରାସାୟନିକ ମିଶାନ୍ତୁ, ଅଭିକ୍ରିୟା ସୃଷ୍ଟି କରନ୍ତୁ!' 
    },
    icon: FlaskConical,
    color: 'from-blue-600 to-indigo-600',
    difficulty: 'intermediate',
    xpReward: 300,
    estimatedTime: 45,
    isUnlocked: true,
    progress: 0,
    position: { x: 15, y: 10 },
    glowColor: 'rgba(59, 130, 246, 0.8)',
    subGames: [
      { id: 'volcano-eruption', name: { en: 'Volcano Eruption', hi: 'ज्वालामुखी विस्फोट', or: 'ଆଗ୍ନେୟଗିରି ବିସ୍ଫୋରଣ' }, type: 'game' },
      { id: 'rainbow-mix', name: { en: 'Rainbow Color Mix', hi: 'इंद्रधनुष रंग मिश्रण', or: 'ଇନ୍ଦ୍ରଧନୁ ରଙ୍ଗ ମିଶ୍ରଣ' }, type: 'puzzle' },
      { id: 'crystal-formation', name: { en: 'Crystal Formation', hi: 'क्रिस्टल निर्माण', or: 'କ୍ରିଷ୍ଟାଲ ଗଠନ' }, type: 'challenge' }
    ]
  },
  {
    id: 'biology-lab',
    name: { 
      en: '🔬 Biology Laboratory', 
      hi: '🔬 जीव विज्ञान प्रयोगशाला', 
      or: '🔬 ଜୀବ ବିଜ୍ଞାନ ଲାବୋରେଟୋରୀ' 
    },
    description: { 
      en: 'Explore cells and life through our virtual microscope! Study plant cells, animal cells, and fascinating microorganisms!', 
      hi: 'हमारे वर्चुअल माइक्रोस्कोप के माध्यम से कोशिकाओं और जीवन का अन्वेषण करें! पौधे की कोशिकाओं, पशु कोशिकाओं और आकर्षक सूक्ष्मजीवों का अध्ययन करें!', 
      or: 'ଆମର ଭର୍ଚୁଆଲ ମାଇକ୍ରୋସ୍କୋପ ମାଧ୍ୟମରେ କୋଷ ଏବଂ ଜୀବନ ଅନ୍ୱେଷଣ କରନ୍ତୁ!' 
    },
    icon: Microscope,
    color: 'from-green-600 to-teal-600',
    difficulty: 'intermediate',
    xpReward: 350,
    estimatedTime: 40,
    isUnlocked: true,
    progress: 0,
    position: { x: 40, y: 8 },
    glowColor: 'rgba(34, 197, 94, 0.8)',
    subGames: [
      { id: 'cell-parts', name: { en: 'Identify Cell Parts', hi: 'कोशिका भागों की पहचान', or: 'କୋଷ ଅଂଶ ଚିହ୍ନଟ' }, type: 'game' },
      { id: 'plant-breathing', name: { en: 'How Plants Breathe', hi: 'पौधे कैसे सांस लेते हैं', or: 'ଉଦ୍ଭିଦ କିପରି ଶ୍ୱାସ ନିଅନ୍ତି' }, type: 'puzzle' },
      { id: 'microbe-study', name: { en: 'Microbe Investigation', hi: 'सूक्ष्मजीव अनुसंधान', or: 'ସୂକ୍ଷ୍ମଜୀବ ଅନୁସନ୍ଧାନ' }, type: 'challenge' }
    ]
  },
  {
    id: 'physics-lab',
    name: { 
      en: '⚡ Physics Laboratory', 
      hi: '⚡ भौतिक विज्ञान प्रयोगशाला', 
      or: '⚡ ଭୌତିକ ବିଜ୍ଞାନ ଲାବୋରେଟୋରୀ' 
    },
    description: { 
      en: 'Discover the magic of motion, gravity, and forces! Play with balls, magnets, and see physics in action!', 
      hi: 'गति, गुरुत्वाकर्षण और बलों के जादू की खोज करें! गेंदों, चुंबकों के साथ खेलें और भौतिकी को क्रिया में देखें!', 
      or: 'ଗତି, ମାଧ୍ୟାକର୍ଷଣ ଏବଂ ବଳର ଯାଦୁ ଆବିଷ୍କାର କରନ୍ତୁ!' 
    },
    icon: Zap,
    color: 'from-yellow-600 to-orange-600',
    difficulty: 'beginner',
    xpReward: 250,
    estimatedTime: 30,
    isUnlocked: true,
    progress: 0,
    position: { x: 65, y: 12 },
    glowColor: 'rgba(245, 158, 11, 0.8)',
    subGames: [
      { id: 'bouncing-ball', name: { en: 'Bouncing Ball', hi: 'उछलती गेंद', or: 'ଉଛୁଳୁଥିବା ବଲ' }, type: 'game' },
      { id: 'magnet-power', name: { en: 'Magnet Power', hi: 'चुंबक शक्ति', or: 'ଚୁମ୍ବକ ଶକ୍ତି' }, type: 'puzzle' },
      { id: 'gravity-drop', name: { en: 'Gravity Drop', hi: 'गुरुत्वाकर्षण ड्रॉप', or: 'ମାଧ୍ୟାକର୍ଷଣ ଡ୍ରପ' }, type: 'challenge' }
    ]
  },
  {
    id: 'food-components',
    name: { 
      en: 'Nutrient Universe', 
      hi: 'पोषक तत्व ब्रह्मांड', 
      or: 'ପୋଷକ ତତ୍ତ୍ୱ ବ୍ରହ୍ମାଣ୍ଡ' 
    },
    description: { 
      en: 'Discover the magical world of nutrients, vitamins, and balanced diet adventures!', 
      hi: 'पोषक तत्वों, विटामिन और संतुलित आहार के साहसिक कार्यों की जादुई दुनिया की खोज करें!', 
      or: 'ପୋଷକ ତତ୍ତ୍ୱ, ଭିଟାମିନ୍ ଏବଂ ସନ୍ତୁଳିତ ଖାଦ୍ୟର ଯାଦୁଗର ଦୁନିଆ ଆବିଷ୍କାର କରନ୍ତୁ!' 
    },
    icon: Crown,
    color: 'from-green-600 to-emerald-600',
    difficulty: 'beginner',
    xpReward: 200,
    estimatedTime: 30,
    isUnlocked: true,
    progress: 100, // Already completed
    position: { x: 20, y: 15 },
    glowColor: 'rgba(34, 197, 94, 0.6)',
    subGames: [
      { id: 'nutrient-navigator', name: { en: 'Nutrient Navigator', hi: 'पोषक नेविगेटर', or: 'ପୋଷକ ନେଭିଗେଟର' }, type: 'game' },
      { id: 'balanced-diet', name: { en: 'Diet Designer', hi: 'आहार डिजाइनर', or: 'ଆହାର ଡିଜାଇନର୍' }, type: 'puzzle' },
      { id: 'vitamin-quest', name: { en: 'Vitamin Quest', hi: 'विटामिन खोज', or: 'ଭିଟାମିନ୍ ଅନ୍ୱେଷଣ' }, type: 'challenge' }
    ]
  },
  {
    id: 'food-sources',
    name: { 
      en: 'Food Origin Safari', 
      hi: 'भोजन मूल सफारी', 
      or: 'ଖାଦ୍ୟ ମୂଳ ସଫାରି' 
    },
    description: { 
      en: 'Explore where food comes from - plants, animals, and the food chain adventure!', 
      hi: 'भोजन कहां से आता है - पौधे, जानवर और खाद्य श्रृंखला साहसिक कार्य का अन्वेषण करें!', 
      or: 'ଖାଦ୍ୟ କେଉଁଠାରୁ ଆସେ - ଉଦ୍ଭିଦ, ପ୍ରାଣୀ ଏବଂ ଖାଦ୍ୟ ଶୃଙ୍ଖଳା ଦୁଃସାହସିକ କାର୍ଯ୍ୟ ଅନ୍ୱେଷଣ କରନ୍ତୁ!' 
    },
    icon: TreePine,
    color: 'from-lime-600 to-green-600',
    difficulty: 'beginner',
    xpReward: 180,
    estimatedTime: 25,
    isUnlocked: true,
    progress: 0,
    position: { x: 45, y: 20 },
    glowColor: 'rgba(101, 163, 13, 0.6)',
    subGames: [
      { id: 'plant-parts-food', name: { en: 'Plant Parts Kitchen', hi: 'पौधे भागों रसोई', or: 'ଉଦ୍ଭିଦ ଅଂଶ ରୋଷେଇ' }, type: 'game' },
      { id: 'animal-products', name: { en: 'Animal Product Hunt', hi: 'पशु उत्पाद शिकार', or: 'ପଶୁ ଉତ୍ପାଦ ଶିକାର' }, type: 'puzzle' },
      { id: 'herbivore-carnivore', name: { en: 'Eating Habits Detective', hi: 'खाने की आदतें जासूस', or: 'ଖାଇବା ଅଭ୍ୟାସ ଗୁପ୍ତଚର' }, type: 'challenge' }
    ]
  },
  {
    id: 'fibre-fabric',
    name: { 
      en: 'Fabric Factory', 
      hi: 'कपड़ा कारखाना', 
      or: 'କପଡ଼ା କାରଖାନା' 
    },
    description: { 
      en: 'Journey from fibre to fabric - spinning, weaving, and textile adventures!', 
      hi: 'फाइबर से कपड़े तक की यात्रा - कताई, बुनाई और कपड़ा साहसिक कार्य!', 
      or: 'ଫାଇବରରୁ କପଡ଼ା ପର୍ଯ୍ୟନ୍ତ ଯାତ୍ରା - ସୂତା କାଟିବା, ବୁଣିବା ଏବଂ ବସ୍ତ୍ର ଦୁଃସାହସିକ କାର୍ଯ୍ୟ!' 
    },
    icon: Compass,
    color: 'from-purple-600 to-pink-600',
    difficulty: 'beginner',
    xpReward: 160,
    estimatedTime: 25,
    isUnlocked: true,
    progress: 0,
    position: { x: 70, y: 15 },
    glowColor: 'rgba(147, 51, 234, 0.6)',
    subGames: [
      { id: 'cotton-journey', name: { en: 'Cotton to Cloth', hi: 'कपास से कपड़ा', or: 'କପାସରୁ କପଡ଼ା' }, type: 'game' },
      { id: 'weaving-wizard', name: { en: 'Weaving Wizard', hi: 'बुनाई जादूगर', or: 'ବୁଣା ଯାଦୁଗର' }, type: 'puzzle' },
      { id: 'fabric-explorer', name: { en: 'Fabric Explorer', hi: 'कपड़ा अन्वेषक', or: 'କପଡ଼ା ଅନ୍ୱେଷକ' }, type: 'challenge' }
    ]
  },
  {
    id: 'sorting-materials',
    name: { 
      en: 'Material Detective', 
      hi: 'सामग्री जासूस', 
      or: 'ସାମଗ୍ରୀ ଗୁପ୍ତଚର' 
    },
    description: { 
      en: 'Solve mysteries by sorting objects based on their amazing properties!', 
      hi: 'अपने अद्भुत गुणों के आधार पर वस्तुओं को छांटकर रहस्यों को सुलझाएं!', 
      or: 'ସେମାନଙ୍କର ଆଶ୍ଚର୍ଯ୍ୟଜନକ ଗୁଣ ଆଧାରରେ ବସ୍ତୁଗୁଡ଼ିକୁ ସଜାଇ ରହସ୍ୟ ସମାଧାନ କରନ୍ତୁ!' 
    },
    icon: Beaker,
    color: 'from-blue-600 to-cyan-600',
    difficulty: 'intermediate',
    xpReward: 190,
    estimatedTime: 30,
    isUnlocked: true,
    progress: 40,
    position: { x: 25, y: 40 },
    glowColor: 'rgba(37, 99, 235, 0.6)',
    subGames: [
      { id: 'property-patrol', name: { en: 'Property Patrol', hi: 'गुण गश्त', or: 'ଗୁଣ ପାଟ୍ରୋଲ୍' }, type: 'game' },
      { id: 'hardness-hunter', name: { en: 'Hardness Hunter', hi: 'कठोरता शिकारी', or: 'କଠିନତା ଶିକାରୀ' }, type: 'puzzle' },
      { id: 'transparency-test', name: { en: 'Transparency Test', hi: 'पारदर्शिता परीक्षा', or: 'ସ୍ୱଚ୍ଛତା ପରୀକ୍ଷା' }, type: 'challenge' }
    ]
  },
  {
    id: 'separation-methods',
    name: { 
      en: 'Separation Station', 
      hi: 'अलगाव स्टेशन', 
      or: 'ପୃଥକୀକରଣ ଷ୍ଟେସନ୍' 
    },
    description: { 
      en: 'Master the art of separation using scientific methods and techniques!', 
      hi: 'वैज्ञानिक विधियों और तकनीकों का उपयोग करके अलगाव की कला में महारत हासिल करें!', 
      or: 'ବୈଜ୍ଞାନିକ ପଦ୍ଧତି ଏବଂ କୌଶଳ ବ୍ୟବହାର କରି ପୃଥକୀକରଣର କଳାରେ ଦକ୍ଷତା ଅର୍ଜନ କରନ୍ତୁ!' 
    },
    icon: FlaskConical,
    color: 'from-orange-600 to-red-600',
    difficulty: 'intermediate',
    xpReward: 210,
    estimatedTime: 35,
    isUnlocked: true,
    progress: 20,
    position: { x: 55, y: 45 },
    glowColor: 'rgba(234, 88, 12, 0.6)',
    subGames: [
      { id: 'sieving-simulator', name: { en: 'Sieving Simulator', hi: 'छानना सिमुलेटर', or: 'ଛାଣିବା ସିମୁଲେଟର୍' }, type: 'game' },
      { id: 'filtration-factory', name: { en: 'Filtration Factory', hi: 'निस्पंदन कारखाना', or: 'ପରିସ୍ରାବଣ କାରଖାନା' }, type: 'puzzle' },
      { id: 'evaporation-expert', name: { en: 'Evaporation Expert', hi: 'वाष्पीकरण विशेषज्ञ', or: 'ବାଷ୍ପୀକରଣ ବିଶେଷଜ୍ଞ' }, type: 'challenge' }
    ]
  },
  {
    id: 'changes-around-us',
    name: { 
      en: 'Change Champions', 
      hi: 'परिवर्तन चैंपियन', 
      or: 'ପରିବର୍ତ୍ତନ ଚାମ୍ପିଅନ୍' 
    },
    description: { 
      en: 'Discover reversible and irreversible changes in the transformation arena!', 
      hi: 'रूपांतरण क्षेत्र में उलटने योग्य और अपरिवर्तनीय परिवर्तनों की खोज करें!', 
      or: 'ରୂପାନ୍ତରଣ କ୍ଷେତ୍ରରେ ଉଲଟା ଏବଂ ଅଦ୍ରୁତ ପରିବର୍ତ୍ତନ ଆବିଷ୍କାର କରନ୍ତୁ!' 
    },
    icon: Atom,
    color: 'from-indigo-600 to-purple-600',
    difficulty: 'intermediate',
    xpReward: 200,
    estimatedTime: 30,
    isUnlocked: false,
    progress: 0,
    position: { x: 80, y: 35 },
    glowColor: 'rgba(99, 102, 241, 0.6)',
    subGames: [
      { id: 'reversible-lab', name: { en: 'Reversible Lab', hi: 'रिवर्सिबल लैब', or: 'ରିଭର୍ସିବଲ୍ ଲ୍ୟାବ୍' }, type: 'game' },
      { id: 'chemical-kitchen', name: { en: 'Chemical Kitchen', hi: 'रासायनिक रसोई', or: 'ରାସାୟନିକ ରୋଷେଇ' }, type: 'puzzle' },
      { id: 'transformation-tower', name: { en: 'Transformation Tower', hi: 'रूपांतरण टॉवर', or: 'ରୂପାନ୍ତରଣ ଟାୱାର' }, type: 'challenge' }
    ]
  },
  {
    id: 'plant-parts',
    name: { 
      en: 'Plant Planet', 
      hi: 'पौधा ग्रह', 
      or: 'ଉଦ୍ଭିଦ ଗ୍ରହ' 
    },
    description: { 
      en: 'Explore the wonderful world of herbs, shrubs, trees, and plant functions!', 
      hi: 'जड़ी-बूटियों, झाड़ियों, पेड़ों और पौधों के कार्यों की अद्भुत दुनिया का अन्वेषण करें!', 
      or: 'ଔଷଧୀୟ ଗଛ, ଝାଡ଼, ଗଛ ଏବଂ ଉଦ୍ଭିଦ କାର୍ଯ୍ୟର ଆଶ୍ଚର୍ଯ୍ୟଜନକ ଦୁନିଆ ଅନ୍ୱେଷଣ କରନ୍ତୁ!' 
    },
    icon: Leaf,
    color: 'from-green-600 to-lime-600',
    difficulty: 'intermediate',
    xpReward: 220,
    estimatedTime: 35,
    isUnlocked: false,
    progress: 0,
    position: { x: 15, y: 65 },
    glowColor: 'rgba(34, 197, 94, 0.6)',
    subGames: [
      { id: 'plant-explorer', name: { en: 'Plant Explorer', hi: 'पौधा अन्वेषक', or: 'ଉଦ୍ଭିଦ ଅନ୍ୱେଷକ' }, type: 'game' },
      { id: 'photosynthesis-factory', name: { en: 'Photosynthesis Factory', hi: 'प्रकाश संश्लेषण कारखाना', or: 'ଆଲୋକ ସଂଶ୍ଳେଷଣ କାରଖାନା' }, type: 'puzzle' },
      { id: 'root-stem-leaf', name: { en: 'Root-Stem-Leaf Adventure', hi: 'जड़-तना-पत्ती साहसिक', or: 'ମୂଳ-ଗଣ୍ଡି-ପତ୍ର ଦୁଃସାହସିକ' }, type: 'challenge' }
    ]
  },
  {
    id: 'body-movements',
    name: { 
      en: 'Movement Mechanics', 
      hi: 'गति यांत्रिकी', 
      or: 'ଗତି ଯାନ୍ତ୍ରିକତା' 
    },
    description: { 
      en: 'Discover how humans and animals move using bones, joints, and muscles!', 
      hi: 'जानें कि हड्डियों, जोड़ों और मांसपेशियों का उपयोग करके मनुष्य और जानवर कैसे चलते हैं!', 
      or: 'ହାଡ, ଗଣ୍ଠି ଏବଂ ମାଂସପେଶୀ ବ୍ୟବହାର କରି ମଣିଷ ଏବଂ ପଶୁମାନେ କିପରି ଗତି କରନ୍ତି ଆବିଷ୍କାର କରନ୍ତୁ!' 
    },
    icon: User,
    color: 'from-rose-600 to-pink-600',
    difficulty: 'intermediate',
    xpReward: 190,
    estimatedTime: 30,
    isUnlocked: false,
    progress: 0,
    position: { x: 40, y: 70 },
    glowColor: 'rgba(244, 63, 94, 0.6)',
    subGames: [
      { id: 'skeleton-builder', name: { en: 'Skeleton Builder', hi: 'कंकाल निर्माता', or: 'କଙ୍କାଳ ନିର୍ମାତା' }, type: 'game' },
      { id: 'joint-journey', name: { en: 'Joint Journey', hi: 'संयुक्त यात्रा', or: 'ଗଣ୍ଠି ଯାତ୍ରା' }, type: 'puzzle' },
      { id: 'animal-locomotion', name: { en: 'Animal Locomotion Lab', hi: 'पशु गति प्रयोगशाला', or: 'ପଶୁ ଗତି ଲାବୋରେଟୋରୀ' }, type: 'challenge' }
    ]
  },
  {
    id: 'living-organisms',
    name: { 
      en: 'Life Laboratory', 
      hi: 'जीवन प्रयोगशाला', 
      or: 'ଜୀବନ ଲାବୋରେଟୋରୀ' 
    },
    description: { 
      en: 'Study living organisms, their habitats, and amazing adaptations!', 
      hi: 'जीवित जीवों, उनके आवासों और अद्भुत अनुकूलन का अध्ययन करें!', 
      or: 'ଜୀବିତ ଜୀବ, ସେମାନଙ୍କର ବାସସ୍ଥାନ ଏବଂ ଆଶ୍ଚର୍ଯ୍ୟଜନକ ଅନୁକୂଳନ ଅଧ୍ୟୟନ କରନ୍ତୁ!' 
    },
    icon: Fish,
    color: 'from-teal-600 to-cyan-600',
    difficulty: 'intermediate',
    xpReward: 240,
    estimatedTime: 40,
    isUnlocked: false,
    progress: 0,
    position: { x: 65, y: 70 },
    glowColor: 'rgba(20, 184, 166, 0.6)',
    subGames: [
      { id: 'habitat-explorer', name: { en: 'Habitat Explorer', hi: 'आवास अन्वेषक', or: 'ବାସସ୍ଥାନ ଅନ୍ୱେଷକ' }, type: 'game' },
      { id: 'adaptation-adventure', name: { en: 'Adaptation Adventure', hi: 'अनुकूलन साहसिक', or: 'ଅନୁକୂଳନ ଦୁଃସାହସିକ' }, type: 'puzzle' },
      { id: 'life-characteristics', name: { en: 'Life Characteristics', hi: 'जीवन विशेषताएं', or: 'ଜୀବନ ବିଶେଷତା' }, type: 'challenge' }
    ]
  },
  {
    id: 'motion-measurement',
    name: { 
      en: 'Motion Metropolis', 
      hi: 'गति महानगर', 
      or: 'ଗତି ମହାନଗର' 
    },
    description: { 
      en: 'Journey through different types of motion and master measurement!', 
      hi: 'विभिन्न प्रकार की गति के माध्यम से यात्रा करें और माप में महारत हासिल करें!', 
      or: 'ବିଭିନ୍ନ ପ୍ରକାର ଗତି ମାଧ୍ୟମରେ ଯାତ୍ରା କରନ୍ତୁ ଏବଂ ମାପରେ ଦକ୍ଷତା ଅର୍ଜନ କରନ୍ତୁ!' 
    },
    icon: Gauge,
    color: 'from-amber-600 to-orange-600',
    difficulty: 'intermediate',
    xpReward: 200,
    estimatedTime: 30,
    isUnlocked: false,
    progress: 0,
    position: { x: 85, y: 60 },
    glowColor: 'rgba(245, 158, 11, 0.6)',
    subGames: [
      { id: 'transport-timeline', name: { en: 'Transport Timeline', hi: 'परिवहन समयरेखा', or: 'ପରିବହନ ସମୟସୀମା' }, type: 'game' },
      { id: 'measurement-master', name: { en: 'Measurement Master', hi: 'माप मास्टर', or: 'ମାପ ମାଷ୍ଟର' }, type: 'puzzle' },
      { id: 'motion-types', name: { en: 'Motion Types Arena', hi: 'गति प्रकार क्षेत्र', or: 'ଗତି ପ୍ରକାର କ୍ଷେତ୍ର' }, type: 'challenge' }
    ]
  },
  {
    id: 'light-shadows',
    name: { 
      en: 'Light Laboratory', 
      hi: 'प्रकाश प्रयोगशाला', 
      or: 'ଆଲୋକ ଲାବୋରେଟୋରୀ' 
    },
    description: { 
      en: 'Explore light, shadows, reflections, and the amazing pinhole camera!', 
      hi: 'प्रकाश, छाया, प्रतिबिंब और अद्भुत पिनहोल कैमरे का अन्वेषण करें!', 
      or: 'ଆଲୋକ, ଛାୟା, ପ୍ରତିଫଳନ ଏବଂ ଆଶ୍ଚର୍ଯ୍ୟଜନକ ପିନ୍ହୋଲ୍ କ୍ୟାମେରା ଅନ୍ୱେଷଣ କରନ୍ତୁ!' 
    },
    icon: Sun,
    color: 'from-yellow-600 to-orange-600',
    difficulty: 'advanced',
    xpReward: 250,
    estimatedTime: 40,
    isUnlocked: false,
    progress: 0,
    position: { x: 20, y: 90 },
    glowColor: 'rgba(234, 179, 8, 0.6)',
    subGames: [
      { id: 'shadow-theater', name: { en: 'Shadow Theater', hi: 'छाया रंगमंच', or: 'ଛାୟା ଥିଏଟର' }, type: 'game' },
      { id: 'reflection-realm', name: { en: 'Reflection Realm', hi: 'प्रतिबिंब क्षेत्र', or: 'ପ୍ରତିଫଳନ କ୍ଷେତ୍ର' }, type: 'puzzle' },
      { id: 'pinhole-photographer', name: { en: 'Pinhole Photographer', hi: 'पिनहोल फोटोग्राफर', or: 'ପିନ୍ହୋଲ୍ ଫଟୋଗ୍ରାଫର' }, type: 'challenge' }
    ]
  },
  {
    id: 'electricity-circuits',
    name: { 
      en: 'Electric Empire', 
      hi: 'विद्युत साम्राज्य', 
      or: 'ବିଦ୍ୟୁତ୍ ସାମ୍ରାଜ୍ୟ' 
    },
    description: { 
      en: 'Build circuits, discover conductors, and master electrical concepts!', 
      hi: 'सर्किट बनाएं, कंडक्टर खोजें और विद्युत अवधारणाओं में महारत हासिल करें!', 
      or: 'ସର୍କିଟ ନିର୍ମାଣ କରନ୍ତୁ, କଣ୍ଡକ୍ଟର ଆବିଷ୍କାର କରନ୍ତୁ ଏବଂ ବିଦ୍ୟୁତ୍ ଧାରଣାରେ ଦକ୍ଷତା ଅର୍ଜନ କରନ୍ତୁ!' 
    },
    icon: Zap,
    color: 'from-blue-600 to-indigo-600',
    difficulty: 'advanced',
    xpReward: 280,
    estimatedTime: 45,
    isUnlocked: false,
    progress: 0,
    position: { x: 50, y: 85 },
    glowColor: 'rgba(37, 99, 235, 0.6)',
    subGames: [
      { id: 'circuit-builder', name: { en: 'Circuit Builder', hi: 'सर्किट बिल्डर', or: 'ସର୍କିଟ ବିଲ୍ଡର' }, type: 'game' },
      { id: 'conductor-detective', name: { en: 'Conductor Detective', hi: 'कंडक्टर जासूस', or: 'କଣ୍ଡକ୍ଟର ଗୁପ୍ତଚର' }, type: 'puzzle' },
      { id: 'electric-safety', name: { en: 'Electric Safety Zone', hi: 'विद्युत सुरक्षा क्षेत्र', or: 'ବିଦ୍ୟୁତ୍ ସୁରକ୍ଷା କ୍ଷେତ୍ର' }, type: 'challenge' }
    ]
  },
  {
    id: 'magnets',
    name: { 
      en: 'Magnetic Kingdom', 
      hi: 'चुंबकीय राज्य', 
      or: 'ଚୁମ୍ବକୀୟ ରାଜ୍ୟ' 
    },
    description: { 
      en: 'Discover the mysterious world of magnets, poles, and magnetic forces!', 
      hi: 'चुंबक, ध्रुवों और चुंबकीय बलों की रहस्यमय दुनिया की खोज करें!', 
      or: 'ଚୁମ୍ବକ, ପୋଲ ଏବଂ ଚୁମ୍ବକୀୟ ଶକ୍ତିର ରହସ୍ୟମୟ ଦୁନିଆ ଆବିଷ୍କାର କରନ୍ତୁ!' 
    },
    icon: Magnet,
    color: 'from-red-600 to-pink-600',
    difficulty: 'advanced',
    xpReward: 220,
    estimatedTime: 35,
    isUnlocked: false,
    progress: 0,
    position: { x: 75, y: 90 },
    glowColor: 'rgba(220, 38, 38, 0.6)',
    subGames: [
      { id: 'magnetic-explorer', name: { en: 'Magnetic Explorer', hi: 'चुंबकीय अन्वेषक', or: 'ଚୁମ୍ବକୀୟ ଅନ୍ୱେଷକ' }, type: 'game' },
      { id: 'compass-navigator', name: { en: 'Compass Navigator', hi: 'कंपास नेविगेटर', or: 'କମ୍ପାସ୍ ନେଭିଗେଟର୍' }, type: 'puzzle' },
      { id: 'pole-power', name: { en: 'Pole Power Challenge', hi: 'ध्रुव शक्ति चुनौती', or: 'ପୋଲ ଶକ୍ତି ଚୁନୌତି' }, type: 'challenge' }
    ]
  },
  {
    id: 'water-cycle',
    name: { 
      en: 'Water World', 
      hi: 'जल संसार', 
      or: 'ଜଳ ସଂସାର' 
    },
    description: { 
      en: 'Journey through the water cycle, conservation, and aquatic adventures!', 
      hi: 'जल चक्र, संरक्षण और जलीय साहसिक कार्यों के माध्यम से यात्रा करें!', 
      or: 'ଜଳ ଚକ୍ର, ସଂରକ୍ଷଣ ଏବଂ ଜଳୀୟ ଦୁଃସାହସିକ କାର୍ଯ୍ୟ ମାଧ୍ୟମରେ ଯାତ୍ରା କରନ୍ତୁ!' 
    },
    icon: Droplet,
    color: 'from-cyan-600 to-blue-600',
    difficulty: 'advanced',
    xpReward: 200,
    estimatedTime: 35,
    isUnlocked: false,
    progress: 0,
    position: { x: 90, y: 80 },
    glowColor: 'rgba(8, 145, 178, 0.6)',
    subGames: [
      { id: 'water-cycle-journey', name: { en: 'Water Cycle Journey', hi: 'जल चक्र यात्रा', or: 'ଜଳ ଚକ୍ର ଯାତ୍ରା' }, type: 'game' },
      { id: 'conservation-hero', name: { en: 'Conservation Hero', hi: 'संरक्षण नायक', or: 'ସଂରକ୍ଷଣ ହିରୋ' }, type: 'puzzle' },
      { id: 'drought-flood', name: { en: 'Drought & Flood Manager', hi: 'सूखा और बाढ़ प्रबंधक', or: 'ମରୁଡ଼ି ଏବଂ ବନ୍ୟା ପରିଚାଳକ' }, type: 'challenge' }
    ]
  },
  {
    id: 'air-atmosphere',
    name: { 
      en: 'Atmosphere Academy', 
      hi: 'वायुमंडल अकादमी', 
      or: 'ବାୟୁମଣ୍ଡଳ ଏକାଡେମୀ' 
    },
    description: { 
      en: 'Explore air composition, oxygen supply, and atmospheric wonders!', 
      hi: 'हवा की संरचना, ऑक्सीजन आपूर्ति और वायुमंडलीय आश्चर्यों का अन्वेषण करें!', 
      or: 'ବାୟୁ ସଂରଚନା, ଅମ୍ଳଜାନ ଯୋଗାଣ ଏବଂ ବାୟୁମଣ୍ଡଳୀୟ ଆଶ୍ଚର୍ଯ୍ୟ ଅନ୍ୱେଷଣ କରନ୍ତୁ!' 
    },
    icon: Wind,
    color: 'from-sky-600 to-cyan-600',
    difficulty: 'advanced',
    xpReward: 190,
    estimatedTime: 30,
    isUnlocked: false,
    progress: 0,
    position: { x: 10, y: 80 },
    glowColor: 'rgba(2, 132, 199, 0.6)',
    subGames: [
      { id: 'air-explorer', name: { en: 'Air Explorer', hi: 'हवा अन्वेषक', or: 'ବାୟୁ ଅନ୍ୱେଷକ' }, type: 'game' },
      { id: 'oxygen-factory', name: { en: 'Oxygen Factory', hi: 'ऑक्सीजन कारखाना', or: 'ଅମ୍ଳଜାନ କାରଖାନା' }, type: 'puzzle' },
      { id: 'atmosphere-guardian', name: { en: 'Atmosphere Guardian', hi: 'वायुमंडल संरक्षक', or: 'ବାୟୁମଣ୍ଡଳ ସଂରକ୍ଷକ' }, type: 'challenge' }
    ]
  },
  {
    id: 'waste-management',
    name: { 
      en: 'Eco Warriors', 
      hi: 'पर्यावरण योद्धा', 
      or: 'ପରିବେଶ ଯୋଦ୍ଧା' 
    },
    description: { 
      en: 'Save the planet by mastering waste management and recycling!', 
      hi: 'अपशिष्ट प्रबंधन और रीसाइक्लिंग में महारत हासिल करके ग्रह को बचाएं!', 
      or: 'ବର୍ଜ୍ୟବସ୍ତୁ ପରିଚାଳନା ଏବଂ ପୁନଃଚକ୍ରଣରେ ଦକ୍ଷତା ଅର୍ଜନ କରି ଗ୍ରହକୁ ବଞ୍ଚାନ୍ତୁ!' 
    },
    icon: Trash,
    color: 'from-emerald-600 to-green-600',
    difficulty: 'advanced',
    xpReward: 210,
    estimatedTime: 35,
    isUnlocked: false,
    progress: 0,
    position: { x: 35, y: 95 },
    glowColor: 'rgba(16, 185, 129, 0.6)',
    subGames: [
      { id: 'sorting-superhero', name: { en: 'Sorting Superhero', hi: 'छंटाई सुपरहीरो', or: 'ସର୍ଟିଂ ସୁପରହିରୋ' }, type: 'game' },
      { id: 'recycling-master', name: { en: 'Recycling Master', hi: 'रीसाइक्लिंग मास्टर', or: 'ରିସାଇକ୍ଲିଂ ମାଷ୍ଟର' }, type: 'puzzle' },
      { id: 'vermicompost-village', name: { en: 'Vermicompost Village', hi: 'वर्मीकंपोस्ट गांव', or: 'ଭର୍ମିକମ୍ପୋଷ୍ଟ ଗାଁ' }, type: 'challenge' }
    ]
  }
];

export function PlanetScientia({ language, onBack, onNavigateToMission }: PlanetScientiaProps) {
  const [selectedTopic, setSelectedTopic] = useState<ScienceTopic | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; speed: number }>>([]);

  // Generate floating science particles
  useEffect(() => {
    const particleField = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 2 + 1
    }));
    setParticles(particleField);
  }, []);

  const handleTopicSelect = (topic: ScienceTopic) => {
    if (!topic.isUnlocked) return;
    
    // Direct navigation for lab games
    if (topic.id === 'chemistry-lab') {
      onNavigateToMission('chemistry-lab');
      return;
    } else if (topic.id === 'biology-lab') {
      onNavigateToMission('biology-lab');
      return;
    } else if (topic.id === 'engineering-lab') {
      onNavigateToMission('engineering-lab');
      return;
    }
    
    // Regular topic selection for other topics
    setSelectedTopic(topic);
    setIsExploring(true);
  };

  const handleGameSelect = (gameId: string) => {
    if (selectedTopic) {
      // Direct lab access for the new interactive labs
      if (selectedTopic.id === 'chemistry-lab') {
        onNavigateToMission('chemistry-lab');
      } else if (selectedTopic.id === 'biology-lab') {
        onNavigateToMission('biology-lab');
      } else if (selectedTopic.id === 'engineering-lab') {
        onNavigateToMission('engineering-lab');
      } else if (selectedTopic.id === 'food-components' && gameId === 'nutrient-navigator') {
        // Special handling for the existing nutrient navigator game
        onNavigateToMission('food-components');
      } else {
        onNavigateToMission(`${selectedTopic.id}-${gameId}`);
      }
    }
  };

  const getTotalProgress = () => {
    const totalTopics = SCIENCE_TOPICS.length;
    const completedProgress = SCIENCE_TOPICS.reduce((sum, topic) => sum + topic.progress, 0);
    return (completedProgress / (totalTopics * 100)) * 100;
  };

  const getUnlockedCount = () => {
    return SCIENCE_TOPICS.filter(topic => topic.isUnlocked).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-teal-900 to-blue-900 relative overflow-hidden">
      {/* Scientific Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.6, 0.9, 0.6],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Scientific Elements */}
        {['⚗️', '🔬', '🧪', '⚛️', '🧬', '🌿', '💧', '⚡', '🔥', '🌍'].map((symbol, i) => (
          <motion.div
            key={symbol}
            className="absolute text-white/20 text-5xl font-bold select-none pointer-events-none"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`
            }}
            animate={{
              y: [-15, 15, -15],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5
            }}
          >
            {symbol}
          </motion.div>
        ))}

        {/* Science Lab Equipment */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              width: `${150 + Math.random() * 200}px`,
              height: `${150 + Math.random() * 200}px`
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 25 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Microscope className="w-full h-full text-white" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-20 bg-black/30 backdrop-blur-md border-b border-teal-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="bg-teal-800/80 border-teal-400 text-teal-200 hover:bg-teal-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Back to Universe' : language === 'hi' ? 'ब्रह्मांड पर वापस' : 'ବ୍ରହ୍ମାଣ୍ଡକୁ ଫେରନ୍ତୁ'}
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Atom className="w-6 h-6 mr-2 text-cyan-400" />
                  {language === 'en' ? 'Planet Scientia - Scientific Discoveries' :
                   language === 'hi' ? 'ग्रह साइंशिया - वैज्ञानिक खोजें' :
                   'ଗ୍ରହ ସାଇଣ୍ଟିଆ - ବୈଜ୍ଞାନିକ ଆବିଷ୍କାର'}
                </h1>
                <p className="text-teal-200">
                  {language === 'en' ? 'Explore Class 6 Science through interactive experiments and adventures!' :
                   language === 'hi' ? 'इंटरैक्टिव प्रयोगों और साहसिक कार्यों के माध्यम से कक्षा 6 विज्ञान का अन्वेषण करें!' :
                   'ଇଣ୍ଟରାକ୍ଟିଭ୍ ପରୀକ୍ଷଣ ଏବଂ ଦୁଃସାହସିକ କାର୍ଯ୍ୟ ମାଧ୍ୟମରେ କକ୍ଷା 6 ବିଜ୍ଞାନ ଅନ୍ୱେଷଣ କରନ୍ତୁ!'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-cyan-400 font-bold text-lg">{getUnlockedCount()}/{SCIENCE_TOPICS.length}</div>
                <div className="text-teal-200 text-sm">{language === 'en' ? 'Unlocked' : language === 'hi' ? 'अनलॉक्ड' : 'ଅନଲକ୍ଡ'}</div>
              </div>
              
              <div className="text-center">
                <div className="text-green-400 font-bold text-lg">{getTotalProgress().toFixed(0)}%</div>
                <div className="text-teal-200 text-sm">{language === 'en' ? 'Progress' : language === 'hi' ? 'प्रगति' : 'ପ୍ରଗତି'}</div>
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
              {SCIENCE_TOPICS.map((topic, index) => {
                const Icon = topic.icon;
                const isLocked = !topic.isUnlocked;
                
                return (
                  <motion.div
                    key={topic.id}
                    className={`relative group cursor-pointer ${isLocked ? 'opacity-60' : ''}`}
                    style={{
                      gridColumn: index % 5 === 0 ? 'span 2' : 'span 1'
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
                        {/* Scientific Glow Effect */}
                        {!isLocked && (
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                            style={{
                              background: `radial-gradient(circle at center, ${topic.glowColor}, transparent 70%)`
                            }}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0, 0.4, 0]
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}

                        {/* Lock Overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <motion.div
                              animate={{ 
                                rotate: [0, 15, -15, 0],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Lock className="w-12 h-12 text-white/80" />
                            </motion.div>
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-4">
                          <motion.div
                            className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                            whileHover={{ 
                              rotate: 360,
                              scale: 1.1
                            }}
                            transition={{ duration: 0.8 }}
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

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
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

                        {/* Completed Badge */}
                        {topic.progress === 100 && (
                          <motion.div
                            className="absolute top-2 left-2"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              rotate: [0, 360]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <CheckCircle className="w-6 h-6 text-yellow-400" />
                          </motion.div>
                        )}

                        {/* Sub-games preview */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {topic.subGames.slice(0, 3).map((game, idx) => (
                            <Badge 
                              key={game.id} 
                              variant="outline" 
                              className="text-xs bg-white/10 text-white border-white/30"
                            >
                              {game.type === 'game' ? '🧪' : game.type === 'puzzle' ? '🔬' : '🏆'}
                            </Badge>
                          ))}
                        </div>

                        {/* Floating scientific elements */}
                        <div className="absolute -top-4 -right-4 opacity-20">
                          <motion.div
                            animate={{ 
                              rotate: 360,
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                            }}
                          >
                            <Atom className="w-16 h-16 text-white" />
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
                  className="mb-4 bg-teal-800/50 border-teal-400 text-teal-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Back to Topics' : language === 'hi' ? 'विषयों पर वापस' : 'ବିଷୟଗୁଡ଼ିକୁ ଫେରନ୍ତୁ'}
                </Button>

                <motion.div
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${selectedTopic.color} shadow-2xl mb-4`}
                  animate={{ 
                    scale: [1, 1.15, 1],
                    boxShadow: [
                      `0 0 20px ${selectedTopic.glowColor}`,
                      `0 0 50px ${selectedTopic.glowColor}`,
                      `0 0 20px ${selectedTopic.glowColor}`
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <selectedTopic.icon className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="text-4xl font-bold text-white mb-2">
                  {selectedTopic.name[language]}
                </h2>
                <p className="text-teal-200 max-w-2xl mx-auto">
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
                    transition={{ delay: index * 0.15 }}
                    className="group cursor-pointer"
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGameSelect(game.id)}
                  >
                    <Card className="relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-500 h-full">
                      <CardContent className="p-6 text-center space-y-4">
                        {/* Game Type Icon */}
                        <motion.div
                          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                            game.type === 'game' 
                              ? 'bg-cyan-500/20 text-cyan-400' 
                              : game.type === 'puzzle'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-orange-500/20 text-orange-400'
                          }`}
                          whileHover={{ 
                            rotate: 360, 
                            scale: 1.2,
                            boxShadow: '0 0 20px rgba(255,255,255,0.5)'
                          }}
                          transition={{ duration: 0.8 }}
                        >
                          {game.type === 'game' ? (
                            <Gamepad2 className="w-8 h-8" />
                          ) : game.type === 'puzzle' ? (
                            <Puzzle className="w-8 h-8" />
                          ) : (
                            <Trophy className="w-8 h-8" />
                          )}
                        </motion.div>

                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                          {game.name[language]}
                        </h3>

                        <Badge className={`${
                          game.type === 'game' 
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' 
                            : game.type === 'puzzle'
                            ? 'bg-green-500/20 text-green-300 border-green-400/50'
                            : 'bg-orange-500/20 text-orange-300 border-orange-400/50'
                        }`}>
                          {game.type === 'game' 
                            ? (language === 'en' ? 'Interactive Experiment' : language === 'hi' ? 'इंटरैक्टिव प्रयोग' : 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ପରୀକ୍ଷା')
                            : game.type === 'puzzle'
                            ? (language === 'en' ? 'Science Puzzle' : language === 'hi' ? 'विज्ञान पहेली' : 'ବିଜ୍ଞାନ ପହେଲି')
                            : (language === 'en' ? 'Lab Challenge' : language === 'hi' ? 'लैब चुनौती' : 'ଲ୍ୟାବ ଚ୍ୟାଲେଞ୍ଜ')}
                        </Badge>

                        {/* Special badge for completed nutrient navigator */}
                        {selectedTopic.id === 'food-components' && game.id === 'nutrient-navigator' && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/50">
                            ✨ {language === 'en' ? 'Completed' : language === 'hi' ? 'पूर्ण' : 'ସମ୍ପୂର୍ଣ୍ଣ'}
                          </Badge>
                        )}

                        <motion.div
                          className="flex items-center justify-center text-white/80"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Play className="w-5 h-5 mr-2" />
                          {language === 'en' ? 'Start Experiment' : language === 'hi' ? 'प्रयोग शुरू करें' : 'ପରୀକ୍ଷା ଆରମ୍ଭ କରନ୍ତୁ'}
                        </motion.div>

                        {/* Floating science particles */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white/40 rounded-full"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                              }}
                              animate={{
                                y: [-10, 10, -10],
                                x: [-5, 5, -5],
                                opacity: [0.4, 0.8, 0.4],
                                scale: [1, 1.5, 1]
                              }}
                              transition={{
                                duration: 3 + Math.random() * 2,
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

      {/* Floating Laboratory Equipment */}
      <AnimatePresence>
        {!selectedTopic && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-8 right-8 z-30"
          >
            <motion.div
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl cursor-pointer"
              whileHover={{ 
                scale: 1.15, 
                rotate: 360,
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.8)'
              }}
              whileTap={{ scale: 0.9 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(20, 184, 166, 0.5)',
                  '0 0 40px rgba(20, 184, 166, 0.8)',
                  '0 0 20px rgba(20, 184, 166, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Microscope className="w-8 h-8" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}