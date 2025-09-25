import React, { useState, useMemo, useEffect } from 'react';
import agriCommandCenter from 'figma:asset/a3dc67ac115fe1dc1511b99fd5e19bd0ea69ea05.png';
import grassBackground from 'figma:asset/e48d736eb945630cddf2d7694acb9974caaef956.png';
import { 
  Tractor, 
  Leaf, 
  Sprout, 
  Wheat, 
  Sun, 
  Cloud,
  Mountain,
  TreePine,
  Home,
  Users,
  BarChart3,
  Target,
  Trophy,
  Settings,
  Calendar,
  Clock,
  Star,
  Zap,
  Award,
  BookOpen,
  Calculator,
  FlaskConical,
  Microscope,
  Beaker,
  ChevronRight,
  TrendingUp,
  Lightbulb,
  Cpu,
  Wrench,
  Gauge,
  Droplets,
  Wind,
  Thermometer,
  Atom,
  Dna,
  Gem,
  Coins,
  Play,
  Lock,
  CheckCircle,
  CircleDot,
  ArrowRight,
  Flower2,
  Seedling,
  Factory,
  Shield,
  Zap as Lightning,
  Volume2,
  Palette,
  Magnet,
  Battery,
  Flame,
  Recycle,
  TreeDeciduous
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { Language, UserProfile } from '../../types/onboarding';

interface Dashboard_Grade8Props {
  user: UserProfile;
  language: Language;
  onLogout: () => void;
  onNavigateToLesson?: (lessonId: string) => void;
}

export function Dashboard_Grade8({ user, language, onLogout, onNavigateToLesson }: Dashboard_Grade8Props) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherEffect, setWeatherEffect] = useState('sunny');
  const [farmTier, setFarmTier] = useState(3);
  const [yieldPoints, setYieldPoints] = useState(4850);
  const [researchTokens, setResearchTokens] = useState(127);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Get time-based environment settings
  const getTimeBasedEnvironment = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  };

  const timeOfDay = getTimeBasedEnvironment();

  // Translations
  const t = {
    title: language === 'en' ? 'The Agri-Innovator\'s Homestead' : 
           language === 'hi' ? 'कृषि-नवाचारी का आवास' : 
           'କୃଷି-ନବାଚାରର ଗୃହ',
    welcome: language === 'en' ? `Welcome back, Innovator ${user.name}!` :
             language === 'hi' ? `वापसी पर स्वागत, नवाचारी ${user.name}!` :
             `ସ୍ୱାଗତ, ନବାଚାରୀ ${user.name}!`,
    farmTier: language === 'en' ? `Farm Tier ${farmTier}: Advanced Homestead` :
              language === 'hi' ? `खेत स्तर ${farmTier}: उन्नत आवास` :
              `ଫାର୍ମ ସ୍ତର ${farmTier}: ଉନ୍ନତ ଗୃହ`,
    yieldPoints: language === 'en' ? 'Yield Points' :
                 language === 'hi' ? 'उत्पादन अंक' :
                 'ଉତ୍ପାଦନ ପଏଣ୍ଟ',
    researchTokens: language === 'en' ? 'Research Tokens' :
                    language === 'hi' ? 'अनुसंधान टोकन' :
                    'ଅନୁସନ୍ଧାନ ଟୋକେନ୍',
    mathematics: language === 'en' ? 'Mathematical Agriculture Hub' :
                 language === 'hi' ? 'गणितीय कृषि केंद्र' :
                 'ଗାଣିତିକ କୃଷି କେନ୍ଦ୍ର',
    science: language === 'en' ? 'Bio-Research Laboratory' :
             language === 'hi' ? 'जैव-अनुसंधान प्रयोगशाला' :
             'ଜୈବ-ଅନୁସନ୍ଧାନ ଲାବୋରେଟରୀ',
    enterGame: language === 'en' ? 'Enter Game' :
               language === 'hi' ? 'खेल में प्रवेश' :
               'ଗେମ ପ୍ରବେଶ'
  };

  // Mathematics syllabus areas mapped to agricultural themes (Odisha Board Class 8)
  const mathZones = [
    {
      id: 'rational-numbers',
      name: language === 'en' ? 'Smart Seed Sorter & Multiplier' : language === 'hi' ? 'स्मार्ट बीज छंटाई और गुणक' : 'ସ୍ମାର୍ଟ ବିହନ ଛଟାଇ ଏବଂ ଗୁଣକ',
      zone: language === 'en' ? 'The High-Tech Seed Vault' : language === 'hi' ? 'हाई-टेक बीज तिजोरी' : 'ହାଇ-ଟେକ ବିହନ ଭାଣ୍ଡାର',
      topic: language === 'en' ? 'Rational Numbers, Powers & Roots' : language === 'hi' ? 'परिमेय संख्याएं, घात और मूल' : 'ପରିମେୟ ସଂଖ୍ୟା, ଘାତ ଓ ମୂଳ',
      description: language === 'en' ? 'Master rational number operations through advanced seed sorting algorithms' : language === 'hi' ? 'उन्नत बीज सॉर्टिंग एल्गोरिदम के माध्यम से परिमेय संख्या संचालन में महारत हासिल करें' : 'ଉନ୍ନତ ବିହନ ସର୍ଟିଂ ଆଲଗୋରିଦମ ମାଧ୍ୟମରେ ପରିମେୟ ସଂଖ୍ୟା କାର୍ଯ୍ୟରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ',
      progress: 92,
      icon: Sprout,
      color: 'from-amber-400 to-yellow-500',
      unlocked: true,
      difficulty: 'Advanced',
      gameId: 'seed-sorter-game'
    },
    {
      id: 'linear-equations',
      name: language === 'en' ? 'Precision Irrigation Controller' : language === 'hi' ? 'सटीक सिंचाई नियंत्रक' : 'ସଠିକ ଜଳସେଚନ ନିୟନ୍ତ୍ରକ',
      zone: language === 'en' ? 'The Smart Irrigation Network' : language === 'hi' ? 'स्मार्ट सिंचाई नेटवर्क' : 'ସ୍ମାର୍ଟ ଜଳସେଚନ ନେଟୱାର୍କ',
      topic: language === 'en' ? 'Linear Equations in One Variable' : language === 'hi' ? 'एक चर में रैखिक समीकरण' : 'ଏକ ଚର ରେ ରୈଖିକ ସମୀକରଣ',
      description: language === 'en' ? 'Solve complex irrigation flow equations for optimal water distribution' : language === 'hi' ? 'इष्टतम जल वितरण के लिए जटिल सिंचाई प्रवाह समीकरणों को हल करें' : 'ଉତ୍କୃଷ୍ଟ ଜଳ ବଣ୍ଟନ ପାଇଁ ଜଟିଳ ଜଳସେଚନ ପ୍ରବାହ ସମୀକରଣ ସମାଧାନ କରନ୍ତୁ',
      progress: 89,
      icon: Droplets,
      color: 'from-blue-400 to-cyan-500',
      unlocked: true,
      difficulty: 'Advanced',
      gameId: 'irrigation-flow-game'
    },
    {
      id: 'algebraic-expressions',
      name: language === 'en' ? 'Fertilizer Formula Mixer' : language === 'hi' ? 'उर्वरक सूत्र मिक्सर' : 'ସାର ସୂତ୍ର ମିକ୍ସର',
      zone: language === 'en' ? 'The Chemistry Laboratory' : language === 'hi' ? 'रसायन प्रयोगशाला' : 'ରସାୟନ ଲାବୋରେଟରୀ',
      topic: language === 'en' ? 'Algebraic Expressions & Identities' : language === 'hi' ? 'बीजगणितीय व्यंजक और सर्वसमिकाएं' : 'ବୀଜଗଣିତୀୟ ଅଭିବ୍ୟକ୍ତି ଓ ସର୍ବସମିକା',
      description: language === 'en' ? 'Create perfect fertilizer mixtures using algebraic formulas' : language === 'hi' ? 'बीजगणितीय सूत्रों का उपयोग करके सही उर्वरक मिश्रण बनाएं' : 'ବୀଜଗଣିତୀୟ ସୂତ୍ର ବ୍ୟବହାର କରି ସଂପୂର୍ଣ୍ଣ ସାର ମିଶ୍ରଣ ତିଆରି କରନ୍ତୁ',
      progress: 76,
      icon: FlaskConical,
      color: 'from-teal-400 to-blue-500',
      unlocked: true,
      difficulty: 'Intermediate',
      gameId: 'algebra-fertilizer-game'
    },
    {
      id: 'factorisation',
      name: language === 'en' ? 'Crop Rotation Optimizer' : language === 'hi' ? 'फसल चक्र अनुकूलक' : 'ଫସଲ ଚକ୍ର ଅନୁକୂଳକ',
      zone: language === 'en' ? 'The Planning Observatory' : language === 'hi' ? 'योजना वेधशाला' : 'ଯୋଜନା ଅବଜର୍ଭେଟରୀ',
      topic: language === 'en' ? 'Factorisation of Expressions' : language === 'hi' ? 'व्यंजकों का गुणनखंडन' : 'ଅଭିବ୍ୟକ୍ତିର ଗୁଣନଖଣ୍ଡନ',
      description: language === 'en' ? 'Factor complex crop rotation patterns for maximum yield' : language === 'hi' ? 'अधिकतम उत्पादन के लिए जटिल फसल रोटेशन पैटर्न को कारक करें' : 'ସର୍ବାଧିକ ଉତ୍ପାଦନ ପାଇଁ ଜଟିଳ ଫସଲ ଘୂର୍ଣ୍ଣନ ପ୍ୟାଟର୍ନ ଫ୍ୟାକ୍ଟର କରନ୍ତୁ',
      progress: 68,
      icon: Recycle,
      color: 'from-green-400 to-emerald-500',
      unlocked: true,
      difficulty: 'Intermediate',
      gameId: 'factorisation-rotation-game'
    },
    {
      id: 'quadrilaterals',
      name: language === 'en' ? 'Farm Plot Designer' : language === 'hi' ? 'खेत प्लॉट डिजाइनर' : 'ଫାର୍ମ ପ୍ଲଟ ଡିଜାଇନର',
      zone: language === 'en' ? 'The Geometric Planning Fields' : language === 'hi' ? 'ज्यामितीय योजना क्षेत्र' : 'ଜ୍ୟାମିତିକ ଯୋଜନା କ୍ଷେତ୍ର',
      topic: language === 'en' ? 'Understanding Quadrilaterals' : language === 'hi' ? 'चतुर्भुजों को समझना' : 'ଚତୁର୍ଭୁଜ ବୁଝିବା',
      description: language === 'en' ? 'Design optimal farm plots using quadrilateral geometry' : language === 'hi' ? 'चतुर्भुज ज्यामिति का उपयोग करके इष्टतम खेत भूखंडों को डिजाइन करें' : 'ଚତୁର୍ଭୁଜ ଜ୍ୟାମିତି ବ୍ୟବହାର କରି ଉତ୍କୃଷ୍ଟ ଫାର୍ମ ପ୍ଲଟ ଡିଜାଇନ୍ କରନ୍ତୁ',
      progress: 54,
      icon: Mountain,
      color: 'from-purple-400 to-violet-500',
      unlocked: false,
      difficulty: 'Intermediate',
      gameId: 'quadrilateral-design-game'
    },
    {
      id: 'comparing-quantities',
      name: language === 'en' ? 'Agricultural Economics Tycoon' : language === 'hi' ? 'कृषि अर्थशास्त्र टाइकून' : 'କୃଷି ଅର୍ଥନୀତି ଟାଇକୁନ',
      zone: language === 'en' ? 'The Market Analysis Center' : language === 'hi' ? 'बाजार विश्लेषण केंद्र' : 'ବଜାର ବିଶ୍ଳେଷଣ କେନ୍ଦ୍ର',
      topic: language === 'en' ? 'Comparing Quantities (Profit/Loss/Interest)' : language === 'hi' ? 'मात्राओं की तुलना (लाभ/हानि/ब्याज)' : 'ପରିମାଣ ତୁଳନା (ଲାଭ/କ୍ଷତି/ସୁଧ)',
      description: language === 'en' ? 'Master agricultural economics through profit/loss calculations' : language === 'hi' ? 'लाभ/हानि गणना के माध्यम से कृषि अर्थशास्त्र में महारत हासिल करें' : 'ଲାଭ/କ୍ଷତି ଗଣନା ମାଧ୍ୟମରେ କୃଷି ଅର୍ଥନୀତିରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ',
      progress: 71,
      icon: TrendingUp,
      color: 'from-orange-400 to-red-500',
      unlocked: true,
      difficulty: 'Advanced',
      gameId: 'economics-tycoon-game'
    },
    {
      id: 'data-handling',
      name: language === 'en' ? 'Harvest Data Analyst' : language === 'hi' ? 'फसल डेटा विश्लेषक' : 'ଫସଲ ଡାଟା ବିଶ୍ଳେଷକ',
      zone: language === 'en' ? 'The Data Intelligence Hub' : language === 'hi' ? 'डेटा इंटेलिजेंस हब' : 'ଡାଟା ଇଣ୍ଟେଲିଜେନ୍ସ ହବ',
      topic: language === 'en' ? 'Data Handling & Probability' : language === 'hi' ? 'डेटा हैंडलिंग और संभावना' : 'ଡାଟା ହ୍ୟାଣ୍ଡଲିଂ ଓ ସମ୍ଭାବନା',
      description: language === 'en' ? 'Analyze crop data using graphs, charts, and probability' : language === 'hi' ? 'ग्राफ़, चार्ट और संभावना का उपयोग करके फसल डेटा का विश्लेषण करें' : 'ଗ୍ରାଫ, ଚାର୍ଟ ଏବଂ ସମ୍ଭାବନା ବ୍ୟବହାର କରି ଫସଲ ଡାଟା ବିଶ୍ଳେଷଣ କରନ୍ତୁ',
      progress: 63,
      icon: BarChart3,
      color: 'from-indigo-400 to-purple-500',
      unlocked: true,
      difficulty: 'Intermediate',
      gameId: 'data-harvest-game'
    },
    {
      id: 'mensuration',
      name: language === 'en' ? 'Advanced Field Surveyor' : language === 'hi' ? 'उन्नत क्षेत्र सर्वेक्षक' : 'ଉନ୍ନତ କ୍ଷେତ୍ର ସର୍ଭେକ୍ଷକ',
      zone: language === 'en' ? 'The Precision Surveying Station' : language === 'hi' ? 'सटीक सर्वेक्षण स्टेशन' : 'ସଠିକ ସର୍ଭେ ଷ୍ଟେସନ',
      topic: language === 'en' ? 'Mensuration (Area & Volume)' : language === 'hi' ? 'क्षेत्रमिति (क्षेत्रफल और आयतन)' : 'କ୍ଷେତ୍ରମିତି (କ୍ଷେତ୍ରଫଳ ଓ ଆୟତନ)',
      description: language === 'en' ? 'Calculate field areas and storage volumes with precision' : language === 'hi' ? 'सटीकता के साथ क्षेत्र क्षेत्रफल और भंडारण आयतन की गणना करें' : 'ସଠିକତା ସହିତ କ୍ଷେତ୍ର କ୍ଷେତ୍ରଫଳ ଏବଂ ଭଣ୍ଡାର ଆୟତନ ଗଣନା କରନ୍ତୁ',
      progress: 42,
      icon: Calculator,
      color: 'from-cyan-400 to-teal-500',
      unlocked: false,
      difficulty: 'Advanced',
      gameId: 'mensuration-surveyor-game'
    }
  ];

  // Science syllabus areas mapped to bio-research lab (Odisha Board Class 8)
  const scienceZones = [
    {
      id: 'crop-production',
      name: language === 'en' ? 'Complete Farm Simulation' : language === 'hi' ? 'पूर्ण फार्म सिमुलेशन' : 'ସମ୍ପୂର୍ଣ୍ଣ ଫାର୍ମ ସିମୁଲେସନ',
      zone: language === 'en' ? 'Crop Management Research Wing' : language === 'hi' ? 'फसल प्रबंधन अनुसंधान विंग' : 'ଫସଲ ପରିଚାଳନା ଅନୁସନ୍ଧାନ ୱିଙ୍ଗ',
      topic: language === 'en' ? 'Crop Production and Management' : language === 'hi' ? 'फसल उत्पादन और प्रबंधन' : 'ଫସଲ ଉତ୍ପାଦନ ଏବଂ ପରିଚାଳନା',
      description: language === 'en' ? 'Complete crop lifecycle from soil preparation to harvest' : language === 'hi' ? 'मिट्टी की तैयारी से लेकर फसल तक पूरा फसल जीवनचक्र' : 'ମାଟି ପ୍ରସ୍ତୁତିରୁ ଫସଲ ପର୍ଯ୍ୟନ୍ତ ସମ୍ପୂର୍ଣ୍ଣ ଫସଲ ଜୀବନଚକ୍ର',
      progress: 94,
      icon: Wheat,
      color: 'from-yellow-400 to-amber-500',
      unlocked: true,
      difficulty: 'Advanced',
      gameId: 'crop-production-game'
    },
    {
      id: 'microorganisms',
      name: language === 'en' ? 'Microbial Universe Explorer' : language === 'hi' ? 'सूक्ष्मजीव ब्रह्मांड अन्वेषक' : 'ମାଇକ୍ରୋବିଆଲ ବ୍ରହ୍ମାଣ୍ଡ ଏକ୍ସପ୍ଲୋରର',
      zone: language === 'en' ? 'Advanced Microbiology Lab' : language === 'hi' ? 'उन्नत सूक्ष्मजीव विज्ञान प्रयोगशाला' : 'ଉନ୍ନତ ମାଇକ୍ରୋବାୟୋଲଜି ଲାବ',
      topic: language === 'en' ? 'Microorganisms: Friend and Foe' : language === 'hi' ? 'सूक्ष्मजीव: मित्र और शत्रु' : 'ମାଇକ୍ରୋଅର୍ଗାନିଜିମ: ବନ୍ଧୁ ଏବଂ ଶତ୍ରୁ',
      description: language === 'en' ? 'Discover beneficial and harmful microorganisms in agriculture' : language === 'hi' ? 'कृषि में लाभकारी और हानिकारक सूक्ष्मजीवों की खोज करें' : 'କୃଷିରେ ଲାଭଦାୟକ ଏବଂ କ୍ଷତିକାରକ ମାଇକ୍ରୋଅର୍ଗାନିଜିମ ଆବିଷ୍କାର କରନ୍ତୁ',
      progress: 87,
      icon: Microscope,
      color: 'from-green-400 to-teal-500',
      unlocked: true,
      difficulty: 'Advanced',
      gameId: 'microorganism-explorer-game'
    },
    {
      id: 'synthetic-materials',
      name: language === 'en' ? 'Agricultural Materials Lab' : language === 'hi' ? 'कृषि सामग्री प्रयोगशाला' : 'କୃଷି ସାମଗ୍ରୀ ଲାବୋରେଟରୀ',
      zone: language === 'en' ? 'Materials Science Workshop' : language === 'hi' ? 'सामग्री विज्ञान कार्यशाला' : 'ସାମଗ୍ରୀ ବିଜ୍ଞାନ କର୍ମଶାଳା',
      topic: language === 'en' ? 'Synthetic Fibres, Plastics & Metals' : language === 'hi' ? 'सिंथेटिक फाइबर, प्लास्टिक और धातु' : 'ସିନ୍ଥେଟିକ ଫାଇବର, ପ୍ଲାଷ୍ଟିକ ଓ ଧାତୁ',
      description: language === 'en' ? 'Study properties of synthetic materials used in modern farming' : language === 'hi' ? 'आधुनिक खेती में उपयोग की जाने वाली सिंथेटिक सामग्री के गुणों का अध्ययन करें' : 'ଆଧୁନିକ ଚାଷବାସରେ ବ୍ୟବହୃତ ସିନ୍ଥେଟିକ ସାମଗ୍ରୀର ଗୁଣ ଅଧ୍ୟୟନ କରନ୍ତୁ',
      progress: 79,
      icon: Wrench,
      color: 'from-gray-400 to-slate-500',
      unlocked: true,
      difficulty: 'Intermediate',
      gameId: 'materials-lab-game'
    },
    {
      id: 'conservation',
      name: language === 'en' ? 'Biodiversity Guardian' : language === 'hi' ? 'जैव विविधता संरक्षक' : 'ଜୈବ ବିବିଧତା ସଂରକ୍ଷକ',
      zone: language === 'en' ? 'Conservation Research Center' : language === 'hi' ? 'संरक्षण अनुसंधान केंद्र' : 'ସଂରକ୍ଷଣ ଅନୁସନ୍ଧାନ କେନ୍ଦ୍ର',
      topic: language === 'en' ? 'Conservation of Plants and Animals' : language === 'hi' ? 'पेड़-पौधों और जानवरों का संरक्षण' : 'ଉଦ୍ଭିଦ ଏବଂ ପ୍ରାଣୀମାନଙ୍କର ସଂରକ୍ଷଣ',
      description: language === 'en' ? 'Protect agricultural biodiversity and natural ecosystems' : language === 'hi' ? 'कृषि जैव विविधता और प्राकृतिक पारिस्थितिकी तंत्र की रक्षा करें' : 'କୃଷି ଜୈବ ବିବିଧତା ଏବଂ ପ୍ରାକୃତିକ ପରିବେଶ ପ୍ରଣାଳୀ ସୁରକ୍ଷା କରନ୍ତୁ',
      progress: 72,
      icon: TreeDeciduous,
      color: 'from-emerald-400 to-green-500',
      unlocked: true,
      difficulty: 'Intermediate',
      gameId: 'conservation-guardian-game'
    },
    {
      id: 'cell-biology',
      name: language === 'en' ? 'Cellular Agriculture Explorer' : language === 'hi' ? 'सेलुलर कृषि अन्वेषक' : 'ସେଲୁଲାର କୃଷି ଏକ୍ସପ୍ଲୋରର',
      zone: language === 'en' ? 'Plant Cell Biology Lab' : language === 'hi' ? 'पादप कोशिका जीव विज्ञान प्रयोगशाला' : 'ଉଦ୍ଭିଦ କୋଷ ଜୀବବିଜ୍ଞାନ ଲାବ',
      topic: language === 'en' ? 'Cell Structure and Functions' : language === 'hi' ? 'कोशिका संरचना और कार्य' : 'କୋଷ ଗଠନ ଏବଂ କାର୍ଯ୍ୟ',
      description: language === 'en' ? 'Explore plant and animal cells at the molecular level' : language === 'hi' ? 'आणविक स्तर पर पादप और पशु कोशिकाओं का अन्वेषण करें' : 'ଅଣୁ ସ୍ତରରେ ଉଦ୍ଭିଦ ଏବଂ ପ୍ରାଣୀ କୋଷଗୁଡ଼ିକର ଅନୁସନ୍ଧାନ କରନ୍ତୁ',
      progress: 56,
      icon: Cpu,
      color: 'from-pink-400 to-rose-500',
      unlocked: false,
      difficulty: 'Advanced',
      gameId: 'cell-biology-game'
    },
    {
      id: 'reproduction',
      name: language === 'en' ? 'Life Cycle Simulator' : language === 'hi' ? 'जीवन चक्र सिमुलेटर' : 'ଜୀବନ ଚକ୍ର ସିମୁଲେଟର',
      zone: language === 'en' ? 'Reproduction Research Lab' : language === 'hi' ? 'प्रजनन अनुसंधान प्रयोगशाला' : 'ପ୍ରଜନନ ଅନୁସନ୍ଧାନ ଲାବ',
      topic: language === 'en' ? 'Reproduction in Animals' : language === 'hi' ? 'जानवरों में प्रजनन' : 'ପ୍ରାଣୀମାନଙ୍କରେ ପ୍ରଜନନ',
      description: language === 'en' ? 'Study animal reproduction and development processes' : language === 'hi' ? 'पशु प्रजनन और विकास प्रक्रियाओं का अध्ययन करें' : 'ପଶୁ ପ୍ରଜନନ ଏବଂ ବିକାଶ ପ୍ରକ୍ରିୟା ଅଧ୍ୟୟନ କରନ୍ତୁ',
      progress: 48,
      icon: Dna,
      color: 'from-violet-400 to-purple-500',
      unlocked: false,
      difficulty: 'Intermediate',
      gameId: 'reproduction-simulator-game'
    },
    {
      id: 'force-pressure',
      name: language === 'en' ? 'Agricultural Physics Engine' : language === 'hi' ? 'कृषि भौतिकी इंजन' : 'କୃଷି ପଦାର୍ଥ ବିଜ୍ଞାନ ଇଞ୍ଜିନ',
      zone: language === 'en' ? 'Mechanics & Physics Workshop' : language === 'hi' ? 'यांत्रिकी और भौतिकी कार्यशाला' : 'ଯାନ୍ତ୍ରିକ ଏବଂ ପଦାର୍ଥ ବିଜ୍ଞାନ କର୍ମଶାଳା',
      topic: language === 'en' ? 'Force, Pressure, Friction & Sound' : language === 'hi' ? 'बल, दबाव, घर्षण और ध्वनि' : 'ବଳ, ଦବାବ, ଘର୍ଷଣ ଏବଂ ଧ୍ୱନି',
      description: language === 'en' ? 'Master physics principles in agricultural machinery' : language === 'hi' ? 'कृषि मशीनरी में भौतिकी सिद्धांतों में महारत हासिल करें' : 'କୃଷି ଯନ୍ତ୍ରପାତିରେ ପଦାର୍ଥ ବିଜ୍ଞାନ ନୀତିଗୁଡ଼ିକରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ',
      progress: 64,
      icon: Tractor,
      color: 'from-red-400 to-orange-500',
      unlocked: true,
      difficulty: 'Advanced',
      gameId: 'physics-engine-game'
    },
    {
      id: 'pollution',
      name: language === 'en' ? 'Environmental Protection Specialist' : language === 'hi' ? 'पर्यावरण संरक्षण विशेषज्ञ' : 'ପରିବେଶ ସୁରକ୍ଷା ବିଶେଷଜ୍ଞ',
      zone: language === 'en' ? 'Environmental Monitoring Station' : language === 'hi' ? 'पर्यावरण निगरानी स्टेशन' : 'ପରିବେଶ ମନିଟରିଂ ଷ୍ଟେସନ',
      topic: language === 'en' ? 'Pollution of Air and Water' : language === 'hi' ? 'वायु और जल प्रदूषण' : 'ବାୟୁ ଏବଂ ଜଳ ପ୍ରଦୂଷଣ',
      description: language === 'en' ? 'Monitor and prevent environmental pollution in farming' : language === 'hi' ? 'खेती में पर्यावरण प्रदूषण की निगरानी और रोकथाम करें' : 'ଚାଷବାସରେ ପରିବେଶ ପ୍ରଦୂଷଣ ନଜର ରଖନ୍ତୁ ଏବଂ ରୋକନ୍ତୁ',
      progress: 59,
      icon: Shield,
      color: 'from-blue-400 to-indigo-500',
      unlocked: true,
      difficulty: 'Intermediate',
      gameId: 'pollution-guardian-game'
    }
  ];

  // Get time-based styling
  const getEnvironmentStyling = () => {
    switch (timeOfDay) {
      case 'morning':
        return {
          bg: 'bg-gradient-to-br from-orange-100 via-yellow-50 to-green-50',
          sky: 'from-orange-200 to-blue-200',
          lighting: 'brightness-110'
        };
      case 'afternoon':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50',
          sky: 'from-blue-300 to-blue-100',
          lighting: 'brightness-125'
        };
      case 'evening':
        return {
          bg: 'bg-gradient-to-br from-orange-100 via-pink-50 to-purple-50',
          sky: 'from-orange-300 to-pink-200',
          lighting: 'brightness-90'
        };
      default: // night
        return {
          bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900',
          sky: 'from-indigo-800 to-purple-800',
          lighting: 'brightness-70'
        };
    }
  };

  const envStyle = getEnvironmentStyling();

  return (
    <div 
      className={`min-h-screen ${envStyle.bg} transition-all duration-1000 relative`}
      style={{
        backgroundImage: `url(${agriCommandCenter})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for content readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10 pointer-events-none"></div>
      
      {/* Enhanced styles for better visibility over background */}
      <style jsx>{`
        .backdrop-blur-lg {
          backdrop-filter: blur(20px) saturate(150%);
        }
        .backdrop-blur-xl {
          backdrop-filter: blur(24px) saturate(180%);
        }
        .bg-white\/90 {
          background-color: rgba(255, 255, 255, 0.95) !important;
        }
        .bg-white\/95 {
          background-color: rgba(255, 255, 255, 0.98) !important;
        }
      `}</style>
      {/* Revolutionary Atmospheric Header - The Control Center */}
      <header className="relative overflow-hidden">
        {/* Dynamic Sky Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${envStyle.sky} opacity-60`}>
          {/* Animated floating particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Weather & Time Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {timeOfDay !== 'night' && (
            <>
              <Sun className={`absolute top-4 right-12 h-12 w-12 text-yellow-400 animate-pulse ${envStyle.lighting}`} />
              <Cloud className="absolute top-8 left-1/4 h-8 w-8 text-white opacity-60 animate-float" />
              <Cloud className="absolute top-16 right-1/3 h-6 w-6 text-white opacity-40 animate-float delay-1000" />
              <Wind className="absolute top-12 left-16 h-6 w-6 text-blue-300 opacity-50 animate-space-drift" />
            </>
          )}
          {timeOfDay === 'night' && (
            <>
              <Star className="absolute top-6 right-20 h-4 w-4 text-yellow-200 animate-star-twinkle" />
              <Star className="absolute top-12 right-32 h-3 w-3 text-yellow-100 animate-star-twinkle delay-500" />
              <Star className="absolute top-8 left-20 h-2 w-2 text-yellow-200 animate-star-twinkle delay-1000" />
              <Star className="absolute top-20 left-40 h-3 w-3 text-blue-200 animate-star-twinkle delay-1500" />
            </>
          )}
        </div>

        {/* Advanced Control Room Interface */}
        <div className="relative backdrop-blur-sm bg-white/20 border-b border-white/30">
          <div className="px-4 sm:px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              
              {/* Enhanced Farm Identity & Status */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="h-20 w-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl animate-farm-tier-glow">
                    <Home className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">{farmTier}</span>
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 animate-farming-grow">
                    {t.title}
                  </h1>
                  <p className="text-green-700 font-medium text-xl mb-2 animate-slide-down">
                    {t.welcome}
                  </p>
                  <div className="flex items-center space-x-4">
                    <p className="text-gray-600">
                      {t.farmTier}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {timeOfDay === 'morning' ? '🌅 Good morning!' : 
                         timeOfDay === 'afternoon' ? '☀️ Good afternoon!' : 
                         timeOfDay === 'evening' ? '🌅 Good evening!' : '🌙 Good night!'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Resource Dashboard */}
              <div className="flex items-center space-x-3">
                {/* Yield Points */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl px-5 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Wheat className="h-6 w-6 text-white animate-seed-bounce" />
                  <div className="text-white">
                    <p className="text-xs font-medium opacity-90">{t.yieldPoints}</p>
                    <p className="font-bold text-xl leading-tight animate-resource-count">{yieldPoints.toLocaleString()}</p>
                  </div>
                </div>

                {/* Research Tokens */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl px-5 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <FlaskConical className="h-6 w-6 text-white animate-float" />
                  <div className="text-white">
                    <p className="text-xs font-medium opacity-90">{t.researchTokens}</p>
                    <p className="font-bold text-xl leading-tight animate-resource-count">{researchTokens}</p>
                  </div>
                </div>

                {/* XP & Level */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl px-5 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Zap className="h-6 w-6 text-white animate-sparkle" />
                  <div className="text-white">
                    <p className="text-xs font-medium opacity-90">XP / Level</p>
                    <p className="font-bold text-xl leading-tight">{user.xp} / {user.level}</p>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={onLogout} 
                  className="bg-white/90 hover:bg-white border-white/60 text-gray-700 hover:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Revolutionary Main Dashboard Content */}
      <div className="p-3 md:p-6 space-y-4 md:space-y-8">
        
        {/* Holographic Command Center with Advanced Design */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 to-purple-100/60 rounded-3xl blur-lg transform scale-105" />
          <Card className="relative bg-white/90 backdrop-blur-lg border-2 border-white/60 shadow-2xl rounded-3xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-cyan-50/60 to-blue-50/60" 
              style={{
                backgroundImage: `linear-gradient(to bottom right, rgba(236, 254, 255, 0.6), rgba(219, 234, 254, 0.6)), url(${grassBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            
            <CardHeader className="relative pb-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl text-gray-800 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-cosmic-pulse">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  {language === 'en' ? 'Mission Control - Learning Hubs' : 
                   language === 'hi' ? 'मिशन कंट्रोल - शिक्षा केंद्र' : 
                   'ମିସନ କଣ୍ଟ୍ରୋଲ - ଶିକ୍ଷା କେନ୍ଦ୍ର'}
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600 font-medium">
                      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-100 rounded-full px-4 py-2">
                    <Thermometer className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">Optimal</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-10">
              
              {/* Enhanced Subject Hubs - Large Interactive Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10">
                
                {/* Revolutionary Mathematics Hub */}
                <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-3 border-blue-200 hover:border-blue-400 transition-all duration-700 hover:shadow-3xl transform hover:scale-105 hover:rotate-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 to-blue-100/50 group-hover:from-blue-100/30 group-hover:to-blue-100/80 transition-all duration-700" />
                  
                  <CardHeader className="relative pb-4 md:pb-6">
                    <div className="flex items-center space-x-3 md:space-x-6">
                      <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 animate-pulse-glow">
                        <Calculator className="h-6 w-6 md:h-10 md:w-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-1 md:mb-2">{t.mathematics}</h3>
                        <p className="text-blue-700 text-sm md:text-base">
                          {language === 'en' ? 'Advanced Agricultural Mathematics & Engineering' : 
                           language === 'hi' ? 'उन्नत कृषि गणित और इंजीनियरिंग' : 
                           'ଉନ୍ନତ କୃଷି ଗଣିତ ଏବଂ ଇଞ୍ଜିନିୟରିଂ'}
                        </p>
                        <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2 mt-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs md:text-sm">
                            {mathZones.filter(z => z.unlocked).length}/{mathZones.length} Unlocked
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 text-xs md:text-sm">
                            {Math.round(mathZones.reduce((acc, z) => acc + z.progress, 0) / mathZones.length)}% Complete
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 md:h-8 md:w-8 text-blue-500 group-hover:translate-x-2 transition-transform duration-500" />
                    </div>
                  </CardHeader>

                  <CardContent className="relative space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {mathZones.slice(0, 4).map((zone, index) => (
                        <div 
                          key={zone.id} 
                          className={`p-4 rounded-2xl bg-gradient-to-br ${String(zone.color)} ${zone.unlocked ? 'opacity-100 cursor-pointer hover:scale-110 shadow-lg hover:shadow-2xl' : 'opacity-60 cursor-not-allowed'} transition-all duration-500 animate-lesson-fade-in`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                          onClick={() => zone.unlocked && onNavigateToLesson?.(zone.gameId)}
                          onMouseEnter={() => setActiveZone(zone.id)}
                          onMouseLeave={() => setActiveZone(null)}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <zone.icon className={`h-6 w-6 text-white ${activeZone === zone.id ? 'animate-bounce-in' : ''}`} />
                            <span className="text-sm font-bold text-white truncate">{zone.zone}</span>
                          </div>
                          {zone.unlocked && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/90">Progress</span>
                                <span className="text-xs font-bold text-white">{zone.progress}%</span>
                              </div>
                              <div className="w-full bg-white/30 rounded-full h-2">
                                <div 
                                  className="bg-white rounded-full h-2 transition-all duration-1000 animate-progress-bar-fill" 
                                  style={{ width: `${zone.progress}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge className="text-xs bg-white/20 text-white border-white/30">
                                  {zone.difficulty}
                                </Badge>
                                {zone.unlocked && (
                                  <Play className="h-4 w-4 text-white animate-pulse" />
                                )}
                              </div>
                            </div>
                          )}
                          {!zone.unlocked && (
                            <div className="flex items-center justify-center py-4">
                              <Lock className="h-8 w-8 text-white/50" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1"
                      onClick={() => onNavigateToLesson?.('seed-sorter-game')}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      {t.enterGame}
                    </Button>
                  </CardContent>
                </Card>

                {/* Revolutionary Science Hub */}
                <Card className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-3 border-green-200 hover:border-green-400 transition-all duration-700 hover:shadow-3xl transform hover:scale-105 hover:rotate-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100/0 to-green-100/50 group-hover:from-green-100/30 group-hover:to-green-100/80 transition-all duration-700" />
                  
                  <CardHeader className="relative pb-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 animate-pulse-glow">
                        <Microscope className="h-10 w-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.science}</h3>
                        <p className="text-green-700 text-base">
                          {language === 'en' ? 'Advanced Agricultural & Environmental Sciences' : 
                           language === 'hi' ? 'उन्नत कृषि और पर्यावरण विज्ञान' : 
                           'ଉନ୍ନତ କୃଷି ଏବଂ ପରିବେଶ ବିଜ୍ଞାନ'}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className="bg-green-100 text-green-800">
                            {scienceZones.filter(z => z.unlocked).length}/{scienceZones.length} Unlocked
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            {Math.round(scienceZones.reduce((acc, z) => acc + z.progress, 0) / scienceZones.length)}% Complete
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-8 w-8 text-green-500 group-hover:translate-x-2 transition-transform duration-500" />
                    </div>
                  </CardHeader>

                  <CardContent className="relative space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {scienceZones.slice(0, 4).map((zone, index) => (
                        <div 
                          key={zone.id} 
                          className={`p-4 rounded-2xl bg-gradient-to-br ${String(zone.color)} ${zone.unlocked ? 'opacity-100 cursor-pointer hover:scale-110 shadow-lg hover:shadow-2xl' : 'opacity-60 cursor-not-allowed'} transition-all duration-500 animate-lesson-fade-in`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                          onClick={() => zone.unlocked && onNavigateToLesson?.(zone.gameId)}
                          onMouseEnter={() => setActiveZone(zone.id)}
                          onMouseLeave={() => setActiveZone(null)}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <zone.icon className={`h-6 w-6 text-white ${activeZone === zone.id ? 'animate-bounce-in' : ''}`} />
                            <span className="text-sm font-bold text-white truncate">{zone.zone}</span>
                          </div>
                          {zone.unlocked && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-white/90">Progress</span>
                                <span className="text-xs font-bold text-white">{zone.progress}%</span>
                              </div>
                              <div className="w-full bg-white/30 rounded-full h-2">
                                <div 
                                  className="bg-white rounded-full h-2 transition-all duration-1000 animate-progress-bar-fill" 
                                  style={{ width: `${zone.progress}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <Badge className="text-xs bg-white/20 text-white border-white/30">
                                  {zone.difficulty}
                                </Badge>
                                {zone.unlocked && (
                                  <Play className="h-4 w-4 text-white animate-pulse" />
                                )}
                              </div>
                            </div>
                          )}
                          {!zone.unlocked && (
                            <div className="flex items-center justify-center py-4">
                              <Lock className="h-8 w-8 text-white/50" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1"
                      onClick={() => onNavigateToLesson?.('crop-production-game')}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      {t.enterGame}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Character Guides with Animations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Dr. Bhuvi - Enhanced Science Guide */}
                <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-3 border-emerald-200 hover:border-emerald-400 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 agri-card-hover">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl animate-float">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">Dr. Bhuvi</h4>
                        <p className="text-green-700 mb-3">
                          {language === 'en' ? 'Agricultural Scientist & Your Science Guide' : 
                           language === 'hi' ? 'कृषि वैज्ञानिक और आपकी विज्ञान गाइड' : 
                           'କୃଷି ବୈଜ୍ଞାନିକ ଏବଂ ଆପଣଙ୍କ ବିଜ୍ଞାନ ଗାଇଡ୍'}
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          {language === 'en' ? '"Let\'s explore the wonders of agricultural science together!"' : 
                           language === 'hi' ? '"आइए कृषि विज्ञान के चमत्कारों को एक साथ खोजते हैं!"' : 
                           '"ଆସନ୍ତୁ ଏକାଠି କୃଷି ବିଜ୍ଞାନର ଚମତ୍କାର ଅନୁସନ୍ଧାନ କରିବା!"'}
                        </p>
                        <div className="flex items-center space-x-2 mt-3">
                          <Badge className="bg-emerald-100 text-emerald-800">Expert Level</Badge>
                          <Badge className="bg-blue-100 text-blue-800">Available 24/7</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ganit - Enhanced Mathematics Guide */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-3 border-blue-200 hover:border-blue-400 transition-all duration-500 hover:shadow-2xl transform hover:scale-105 agri-card-hover">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl animate-float delay-500">
                        <Calculator className="h-10 w-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">Ganit</h4>
                        <p className="text-blue-700 mb-3">
                          {language === 'en' ? 'Agricultural Engineer & Your Math Guide' : 
                           language === 'hi' ? 'कृषि इंजीनियर और आपकी गणित गाइड' : 
                           'କୃଷି ଇଞ୍ଜିନିୟର ଏବଂ ଆପଣଙ୍କ ଗଣିତ ଗାଇଡ୍'}
                        </p>
                        <p className="text-sm text-gray-600 italic">
                          {language === 'en' ? '"Every calculation brings us closer to the perfect harvest!"' : 
                           language === 'hi' ? '"हर गणना हमें पूर्ण फसल के करीब लाती है!"' : 
                           '"ପ୍ରତିଟି ଗଣନା ଆମକୁ ସଂପୂର୍ଣ୍ଣ ଫସଲର ନିକଟତର କରେ!"'}
                        </p>
                        <div className="flex items-center space-x-2 mt-3">
                          <Badge className="bg-blue-100 text-blue-800">Expert Level</Badge>
                          <Badge className="bg-green-100 text-green-800">Problem Solver</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Enhanced Farm Status & Interactive Elements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Enhanced Farm Progress */}
          <Card className="bg-white/90 backdrop-blur-lg border-3 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Tractor className="h-7 w-7 text-green-600 animate-tractor-move" />
                {language === 'en' ? 'Farm Development' : language === 'hi' ? 'खेत विकास' : 'ଫାର୍ମ ବିକାଶ'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {language === 'en' ? 'Current Tier' : language === 'hi' ? 'वर्तमान स्तर' : 'ବର୍ତ୍ତମାନ ସ୍ତର'}
                  </span>
                  <Badge className="bg-green-100 text-green-800">Tier {farmTier}</Badge>
                </div>
                <Progress value={85} className="h-4" />
                <p className="text-sm text-gray-500">
                  {language === 'en' ? 'Next: AI-Powered Greenhouse' : language === 'hi' ? 'अगला: AI-संचालित ग्रीनहाउस' : 'ପରବର୍ତ୍ତୀ: AI-ସଞ୍চାଳିତ ଗ୍ରୀନହାଉସ୍'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-4">
                {['Smart Wheat', 'Bio Corn', 'Hydroponic Tomatoes', 'Medicinal Herbs'].map((crop, index) => (
                  <div key={crop} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-all duration-300 animate-crop-sway" style={{ animationDelay: `${index * 0.5}s` }}>
                    <Sprout className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{crop}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Smart Equipment</h5>
                <div className="space-y-2">
                  {['AI Tractor', 'Drone Fleet', 'IoT Sensors', 'Auto-Irrigation'].map((equipment, index) => (
                    <div key={equipment} className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <Cpu className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-800">{equipment}</span>
                      <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Daily Challenges */}
          <Card className="bg-white/90 backdrop-blur-lg border-3 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Target className="h-7 w-7 text-orange-600 animate-float" />
                {language === 'en' ? 'Today\'s Challenges' : language === 'hi' ? 'आज की चुनौतियां' : 'ଆଜିର ଚ୍ୟାଲେଞ୍ଜସ୍'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Advanced Irrigation Equations', points: 250, icon: Droplets, difficulty: 'Hard' },
                { name: 'Crop Yield Optimization', points: 300, icon: BarChart3, difficulty: 'Expert' },
                { name: 'Soil Chemistry Analysis', points: 180, icon: Beaker, difficulty: 'Medium' },
                { name: 'Pest Management Strategy', points: 220, icon: Shield, difficulty: 'Hard' }
              ].map((challenge, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 cursor-pointer hover:scale-105 animate-lesson-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-center space-x-4">
                    <challenge.icon className="h-6 w-6 text-orange-600" />
                    <div>
                      <span className="text-sm font-bold text-gray-800">{challenge.name}</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`text-xs ${
                          challenge.difficulty === 'Expert' ? 'bg-red-100 text-red-800' :
                          challenge.difficulty === 'Hard' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800 text-sm font-bold">+{challenge.points} YP</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Enhanced Achievements */}
          <Card className="bg-white/90 backdrop-blur-lg border-3 border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Trophy className="h-7 w-7 text-purple-600 animate-treasure-shine" />
                {language === 'en' ? 'Recent Achievements' : language === 'hi' ? 'हाल की उपलब्धियां' : 'ସାମ୍ପ୍ରତିକ ସଫଳତା'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Agricultural Genius', icon: '🧠', tier: 'Platinum', points: 500, description: 'Solved 100 complex problems' },
                { title: 'Eco Innovator', icon: '🌱', tier: 'Diamond', points: 750, description: 'Sustainable farming master' },
                { title: 'Data Scientist', icon: '📊', tier: 'Gold', points: 300, description: 'Advanced analytics expert' },
                { title: 'Tech Pioneer', icon: '🚀', tier: 'Legendary', points: 1000, description: 'AI agriculture integration' }
              ].map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 cursor-pointer hover:scale-105 animate-knowledge-unlock" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="text-3xl animate-bounce-in">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{achievement.title}</p>
                    <p className="text-xs text-gray-600 mb-1">{achievement.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${
                        achievement.tier === 'Legendary' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                        achievement.tier === 'Diamond' ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white' :
                        achievement.tier === 'Platinum' ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
                        'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                      }`}>
                        {achievement.tier}
                      </Badge>
                      <span className="text-xs text-purple-600 font-semibold">+{achievement.points} XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
      
      {/* Close background overlay */}
    </div>
  );
}