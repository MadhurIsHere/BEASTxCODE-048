import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Droplets, 
  Gauge, 
  Wrench, 
  PlayCircle, 
  PauseCircle,
  RotateCcw,
  CheckCircle,
  XCircle,
  Trophy,
  Timer,
  Zap,
  Target,
  Settings,
  BookOpen,
  Brain,
  Lightbulb,
  Calculator,
  Eye,
  Hand,
  Volume2,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipForward
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import type { Language } from '../../../types/onboarding';

interface IrrigationFlowGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

interface ConceptStage {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'practice' | 'quiz';
  completed: boolean;
  unlocked: boolean;
}

interface LessonContent {
  id: string;
  title: string;
  concept: string;
  explanation: string;
  visualDemo: React.ReactNode;
  examples: Array<{
    problem: string;
    solution: string;
    steps: string[];
  }>;
  practiceProblems: Array<{
    question: string;
    answer: string | number;
    options: (string | number)[];
    explanation: string;
  }>;
}

export function IrrigationFlowGame({ language, onBack, onComplete }: IrrigationFlowGameProps) {
  const [gameMode, setGameMode] = useState<'learning' | 'gaming'>('learning');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [studentProgress, setStudentProgress] = useState({
    lessonsCompleted: 0,
    conceptsUnderstood: 0,
    practiceScore: 0,
    totalXP: 0
  });
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Comprehensive translations
  const t = {
    title: language === 'en' ? 'Smart Irrigation Flow Controller & Linear Equations Academy' : 
           language === 'hi' ? 'स्मार्ट सिंचाई प्रवाह नियंत्रक और रैखिक समीकरण अकादमी' : 
           'ସ୍ମାର୍ଟ ଜଳସେଚନ ପ୍ରବାହ ନିୟନ୍ତ୍ରକ ଏବଂ ରେଖୀୟ ସମୀକରଣ ଏକାଡେମୀ',
    subtitle: language === 'en' ? 'Master Linear Equations through Precision Agriculture' :
              language === 'hi' ? 'सटीक कृषि के माध्यम से रैखिक समीकरण में महारत हासिल करें' :
              'ସଠିକ କୃଷି ମାଧ୍ୟମରେ ରେଖୀୟ ସମୀକରଣରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ',
    learnMode: language === 'en' ? 'Learning Mode' : language === 'hi' ? 'सीखने का तरीका' : 'ଶିକ୍ଷାର ମୋଡ୍',
    practiceMode: language === 'en' ? 'Practice Mode' : language === 'hi' ? 'अभ्यास मोड' : 'ଅଭ୍ୟାସ ମୋଡ୍',
    conceptExplorer: language === 'en' ? 'Concept Explorer' : language === 'hi' ? 'अवधारणा खोजकर्ता' : 'ସଂକଳ୍ପ ଅନୁସନ୍ଧାନକାରୀ',
    startLearning: language === 'en' ? 'Start Learning Journey' : language === 'hi' ? 'सीखने की यात्रा शुरू करें' : 'ଶିକ୍ଷାର ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ',
    whatAreLinearEquations: language === 'en' ? 'What are Linear Equations?' : language === 'hi' ? 'रैखिक समीकरण क्या हैं?' : 'ରେଖୀୟ ସମୀକରଣ କ\'ଣ?',
    solvingBasicEquations: language === 'en' ? 'Solving Basic Linear Equations' : language === 'hi' ? 'बुनियादी रैखिक समीकरण हल करना' : 'ମୂଳଭୂତ ରେଖୀୟ ସମୀକରଣ ସମାଧାନ',
    complexEquations: language === 'en' ? 'Complex Equations with Variables' : language === 'hi' ? 'चरों के साथ जटिल समीकरण' : 'ଚରସହିତ ଜଟିଳ ସମୀକରଣ',
    realWorldApplications: language === 'en' ? 'Real-World Applications' : language === 'hi' ? 'वास्तविक दुनिया के अनुप्रयोग' : 'ବାସ୍ତବ ଦୁନିଆର ପ୍ରୟୋଗ',
    watchAnimation: language === 'en' ? 'Watch Animation' : language === 'hi' ? 'एनीमेशन देखें' : 'ଆନିମେସନ୍ ଦେଖନ୍ତୁ',
    tryInteractive: language === 'en' ? 'Try Interactive Demo' : language === 'hi' ? 'इंटरैक्टिव डेमो आज़माएं' : 'ଇଣ୍ଟରାକ୍ଟିଭ ଡେମୋ ଚେଷ୍ଟା କରନ୍ତୁ',
    practiceNow: language === 'en' ? 'Practice Now' : language === 'hi' ? 'अभी अभ्यास करें' : 'ବର୍ତ୍ତମାନ ଅଭ୍ୟାସ କରନ୍ତୁ',
    showSteps: language === 'en' ? 'Show Solution Steps' : language === 'hi' ? 'समाधान के चरण दिखाएं' : 'ସମାଧାନ ସୋପାନ ଦେଖାନ୍ତୁ',
    hideSteps: language === 'en' ? 'Hide Steps' : language === 'hi' ? 'चरण छुपाएं' : 'ସୋପାନ ଲୁଚାନ୍ତୁ',
    nextConcept: language === 'en' ? 'Next Concept' : language === 'hi' ? 'अगली अवधारणा' : 'ପରବର୍ତ୍ତୀ ସଂକଳ୍ପ',
    excellent: language === 'en' ? 'Excellent! You understand this concept!' : language === 'hi' ? 'उत्कृष्ट! आप इस अवधारणा को समझते हैं!' : 'ଉତ୍କୃଷ୍ଟ! ଆପଣ ଏହି ସଂକଳ୍ପ ବୁଝିଛନ୍ତି!',
    tryAgain: language === 'en' ? 'Not quite right. Let\'s review the concept!' : language === 'hi' ? 'बिल्कुल सही नहीं। आइए अवधारणा की समीक्षा करते हैं!' : 'ସମ୍ପୂର୍ଣ୍ଣ ଠିକ୍ ନୁହେଁ। ଆସନ୍ତୁ ସଂକଳ୍ପ ସମୀକ୍ଷା କରିବା!'
  };

  // Comprehensive lesson content with agricultural irrigation context
  const lessonContent: LessonContent[] = [
    {
      id: 'linear-intro',
      title: t.whatAreLinearEquations,
      concept: language === 'en' ? 'Linear Equations in One Variable' : language === 'hi' ? 'एक चर में रैखिक समीकरण' : 'ଏକ ଚର ରେଖୀୟ ସମୀକରଣ',
      explanation: language === 'en' ? 
        'A linear equation in one variable is an equation that can be written in the form ax + b = c, where a, b, and c are constants and a ≠ 0. In irrigation systems, we use linear equations to calculate optimal water flow rates, determine irrigation time schedules, and balance water distribution across multiple crop fields.' :
        language === 'hi' ? 
        'एक चर में रैखिक समीकरण एक समीकरण है जिसे ax + b = c के रूप में लिखा जा सकता है, जहाँ a, b, और c स्थिरांक हैं और a ≠ 0। सिंचाई प्रणालियों में, हम इष्टतम जल प्रवाह दर की गणना करने, सिंचाई समय कार्यक्रम निर्धारित करने, और कई फसल क्षेत्रों में जल वितरण संतुलित करने के लिए रैखिक समीकरणों का उपयोग करते हैं।' :
        'ଏକ ଚରରେ ରେଖୀୟ ସମୀକରଣ ହେଉଛି ଏକ ସମୀକରଣ ଯାହା ax + b = c ରୂପରେ ଲେଖାଯାଇପାରିବ, ଯେଉଁଠାରେ a, b, ଏବଂ c ସ୍ଥିରାଙ୍କ ଏବଂ a ≠ 0। ଜଳସେଚନ ବ୍ୟବସ୍ଥାରେ, ଆମେ ଉତ୍କୃଷ୍ଟ ଜଳ ପ୍ରବାହ ହାର ଗଣନା, ଜଳସେଚନ ସମୟ କାର୍ଯ୍ୟସୂଚୀ ନିର୍ଣ୍ଣୟ ଏବଂ ଏକାଧିକ ଫସଲ କ୍ଷେତ୍ରରେ ଜଳ ବଣ୍ଟନ ସନ୍ତୁଳନ ପାଇଁ ରେଖୀୟ ସମୀକରଣ ବ୍ୟବହାର କରୁ।',
      visualDemo: <LinearEquationIntroAnimation />,
      examples: [
        {
          problem: language === 'en' ? 'Solve: 2x + 5 = 15' : language === 'hi' ? 'हल करें: 2x + 5 = 15' : 'ସମାଧାନ କରନ୍ତୁ: 2x + 5 = 15',
          solution: 'x = 5',
          steps: [
            language === 'en' ? 'Start with: 2x + 5 = 15' : language === 'hi' ? 'शुरुआत: 2x + 5 = 15' : 'ଆରମ୍ଭ: 2x + 5 = 15',
            language === 'en' ? 'Subtract 5 from both sides: 2x = 10' : language === 'hi' ? 'दोनों पक्षों से 5 घटाएं: 2x = 10' : 'ଉଭୟ ପାର୍ଶ୍ୱରୁ 5 ବିୟୋଗ କରନ୍ତୁ: 2x = 10',
            language === 'en' ? 'Divide both sides by 2: x = 5' : language === 'hi' ? 'दोनों पक्षों को 2 से भाग दें: x = 5' : 'ଉଭୟ ପାର୍ଶ୍ୱକୁ 2 ଦ୍ୱାରା ଭାଗ କରନ୍ତୁ: x = 5',
            language === 'en' ? 'Check: 2(5) + 5 = 15 ✓' : language === 'hi' ? 'जांचें: 2(5) + 5 = 15 ✓' : 'ଯାଞ୍ଚ କରନ୍ତୁ: 2(5) + 5 = 15 ✓'
          ]
        }
      ],
      practiceProblems: [
        {
          question: language === 'en' ? 'A farmer needs to distribute water equally among 4 fields. If the total water available is 20 liters and each field needs an additional 3 liters for optimal growth, how much water should each field receive initially? (Equation: 4x + 12 = 20)' : 
                   language === 'hi' ? 'एक किसान को 4 खेतों में समान रूप से पानी बांटना है। यदि कुल उपलब्ध पानी 20 लीटर है और प्रत्येक खेत को इष्टतम विकास के लिए अतिरिक्त 3 लीटर की आवश्यकता है, तो प्रत्येक खेत को शुरुआत में कितना पानी मिलना चाहिए? (समीकरण: 4x + 12 = 20)' :
                   'ଜଣେ କୃଷକଙ୍କୁ 4 କ୍ଷେତରେ ସମାନ ଭାବରେ ଜଳ ବଣ୍ଟନ କରିବାକୁ ପଡିବ। ଯଦି ମୋଟ ଉପଲବ୍ଧ ଜଳ 20 ଲିଟର ଏବଂ ପ୍ରତିଟି କ୍ଷେତ ଉତ୍କୃଷ୍ଟ ବୃଦ୍ଧି ପାଇଁ ଅତିରିକ୍ତ 3 ଲିଟର ଆବଶ୍ୟକ କରେ, ତେବେ ପ୍ରତ୍ୟେକ କ୍ଷେତ ପ୍ରାରମ୍ଭରେ କେତେ ଜଳ ପାଇବା ଉଚିତ? (ସମୀକରଣ: 4x + 12 = 20)',
          answer: 2,
          options: [2, 3, 4, 5],
          explanation: language === 'en' ? '4x + 12 = 20 → 4x = 8 → x = 2 liters per field initially' :
                      language === 'hi' ? '4x + 12 = 20 → 4x = 8 → x = 2 लीटर प्रति खेत शुरुआत में' :
                      '4x + 12 = 20 → 4x = 8 → x = 2 ଲିଟର ପ୍ରତି କ୍ଷେତ ପ୍ରାରମ୍ଭରେ'
        }
      ]
    },
    {
      id: 'solving-basic',
      title: t.solvingBasicEquations,
      concept: language === 'en' ? 'Solving Linear Equations Step by Step' : language === 'hi' ? 'चरणबद्ध रैखिक समीकरण हल करना' : 'ପର୍ଯ୍ୟାୟକ୍ରମେ ରେଖୀୟ ସମୀକରଣ ସମାଧାନ',
      explanation: language === 'en' ? 
        'To solve linear equations systematically: 1) Simplify both sides, 2) Move variables to one side, 3) Move constants to the other side, 4) Divide by the coefficient of the variable. In irrigation, this helps calculate precise flow rates for optimal crop watering.' :
        language === 'hi' ? 
        'रैखिक समीकरणों को व्यवस्थित रूप से हल करने के लिए: 1) दोनों पक्षों को सरल बनाएं, 2) चरों को एक तरफ ले जाएं, 3) स्थिरांक को दूसरी तरफ ले जाएं, 4) चर के गुणांक से भाग दें। सिंचाई में, यह इष्टतम फसल सिंचाई के लिए सटीक प्रवाह दर की गणना करने में मदद करता है।' :
        'ରେଖୀୟ ସମୀକରଣକୁ ବ୍ୟବସ୍ଥିତ ଭାବରେ ସମାଧାନ କରିବା ପାଇଁ: 1) ଉଭୟ ପାର୍ଶ୍ୱକୁ ସରଳ କରନ୍ତୁ, 2) ଚରଗୁଡ଼ିକୁ ଏକ ପାର୍ଶ୍ୱକୁ ନିଅନ୍ତୁ, 3) ସ୍ଥିରାଙ୍କଗୁଡ଼ିକୁ ଅନ୍ୟ ପାର୍ଶ୍ୱକୁ ନିଅନ୍ତୁ, 4) ଚରର ଗୁଣାଙ୍କ ଦ୍ୱାରା ଭାଗ କରନ୍ତୁ। ଜଳସେଚନରେ, ଏହା ଉତ୍କୃଷ୍ଟ ଫସଲ ଜଳସେଚନ ପାଇଁ ସଠିକ ପ୍ରବାହ ହାର ଗଣନା କରିବାରେ ସାହାଯ୍ୟ କରେ।',
      visualDemo: <SolvingStepsAnimation />,
      examples: [
        {
          problem: language === 'en' ? 'Solve: 3x - 7 = 14' : language === 'hi' ? 'हल करें: 3x - 7 = 14' : 'ସମାଧାନ କରନ୍ତୁ: 3x - 7 = 14',
          solution: 'x = 7',
          steps: [
            language === 'en' ? 'Start with: 3x - 7 = 14' : language === 'hi' ? 'शुरुआत: 3x - 7 = 14' : 'ଆରମ୍ଭ: 3x - 7 = 14',
            language === 'en' ? 'Add 7 to both sides: 3x = 21' : language === 'hi' ? 'दोनों पक्षों में 7 जोड़ें: 3x = 21' : 'ଉଭୟ ପାର୍ଶ୍ୱରେ 7 ଯୋଗ କରନ୍ତୁ: 3x = 21',
            language === 'en' ? 'Divide both sides by 3: x = 7' : language === 'hi' ? 'दोनों पक्षों को 3 से भाग दें: x = 7' : 'ଉଭୟ ପାର୍ଶ୍ୱକୁ 3 ଦ୍ୱାରା ଭାଗ କରନ୍ତୁ: x = 7',
            language === 'en' ? 'Check: 3(7) - 7 = 14 ✓' : language === 'hi' ? 'जांचें: 3(7) - 7 = 14 ✓' : 'ଯାଞ୍ଚ କରନ୍ତୁ: 3(7) - 7 = 14 ✓'
          ]
        }
      ],
      practiceProblems: [
        {
          question: language === 'en' ? 'An irrigation system needs to maintain a constant pressure. If the current pressure is 5x - 12 = 18 units, what should the variable x be to maintain optimal pressure?' :
                   language === 'hi' ? 'एक सिंचाई प्रणाली को निरंतर दबाव बनाए रखना है। यदि वर्तमान दबाव 5x - 12 = 18 इकाई है, तो इष्टतम दबाव बनाए रखने के लिए चर x क्या होना चाहिए?' :
                   'ଏକ ଜଳସେଚନ ବ୍ୟବସ୍ଥା ସ୍ଥିର ଚାପ ବଜାୟ ରଖିବା ଆବଶ୍ୟକ। ଯଦି ବର୍ତ୍ତମାନ ଚାପ 5x - 12 = 18 ଏକକ, ତେବେ ଉତ୍କୃଷ୍ଟ ଚାପ ବଜାୟ ରଖିବା ପାଇଁ ଚର x କ\'ଣ ହେବା ଉଚିତ?',
          answer: 6,
          options: [4, 5, 6, 7],
          explanation: language === 'en' ? '5x - 12 = 18 → 5x = 30 → x = 6' :
                      language === 'hi' ? '5x - 12 = 18 → 5x = 30 → x = 6' :
                      '5x - 12 = 18 → 5x = 30 → x = 6'
        }
      ]
    },
    {
      id: 'complex-equations',
      title: t.complexEquations,
      concept: language === 'en' ? 'Complex Linear Equations with Multiple Steps' : language === 'hi' ? 'कई चरणों वाले जटिल रैखिक समीकरण' : 'ଏକାଧିକ ସୋପାନ ସହିତ ଜଟିଳ ରେଖୀୟ ସମୀକରଣ',
      explanation: language === 'en' ? 
        'Complex linear equations may have variables on both sides, fractions, or multiple operations. In advanced irrigation systems, these equations help optimize water distribution across interconnected field networks with varying crop water requirements.' :
        language === 'hi' ? 
        'जटिल रैखिक समीकरणों में दोनों पक्षों में चर, भिन्न, या कई संक्रियाएं हो सकती हैं। उन्नत सिंचाई प्रणालियों में, ये समीकरण विभिन्न फसल जल आवश्यकताओं के साथ आपस में जुड़े खेत नेटवर्क में जल वितरण को अनुकूलित करने में मदद करते हैं।' :
        'ଜଟିଳ ରେଖୀୟ ସମୀକରଣରେ ଉଭୟ ପାର୍ଶ୍ୱରେ ଚର, ଭଗ୍ନାଂଶ, କିମ୍ବା ଏକାଧିକ କାର୍ଯ୍ୟ ଥାଇପାରେ। ଉନ୍ନତ ଜଳସେଚନ ବ୍ୟବସ୍ଥାରେ, ଏହି ସମୀକରଣଗୁଡ଼ିକ ବିଭିନ୍ନ ଫସଲ ଜଳ ଆବଶ୍ୟକତା ସହିତ ପରସ୍ପର ସହିତ ସଂଯୁକ୍ତ କ୍ଷେତ ନେଟୱାର୍କରେ ଜଳ ବଣ୍ଟନକୁ ଅପ୍ଟିମାଇଜ କରିବାରେ ସାହାଯ୍ୟ କରେ।',
      visualDemo: <ComplexEquationsAnimation />,
      examples: [
        {
          problem: language === 'en' ? 'Solve: 2x + 3 = x + 8' : language === 'hi' ? 'हल करें: 2x + 3 = x + 8' : 'ସମାଧାନ କରନ୍ତୁ: 2x + 3 = x + 8',
          solution: 'x = 5',
          steps: [
            language === 'en' ? 'Start with: 2x + 3 = x + 8' : language === 'hi' ? 'शुरुआत: 2x + 3 = x + 8' : 'ଆରମ୍ଭ: 2x + 3 = x + 8',
            language === 'en' ? 'Subtract x from both sides: x + 3 = 8' : language === 'hi' ? 'दोनों पक्षों से x घटाएं: x + 3 = 8' : 'ଉଭୟ ପାର୍ଶ୍ୱରୁ x ବିୟୋଗ କରନ୍ତୁ: x + 3 = 8',
            language === 'en' ? 'Subtract 3 from both sides: x = 5' : language === 'hi' ? 'दोनों पक्षों से 3 घटाएं: x = 5' : 'ଉଭୟ ପାର୍ଶ୍ୱରୁ 3 ବିୟୋଗ କରନ୍ତୁ: x = 5',
            language === 'en' ? 'Check: 2(5) + 3 = 5 + 8 → 13 = 13 ✓' : language === 'hi' ? 'जांचें: 2(5) + 3 = 5 + 8 → 13 = 13 ✓' : 'ଯାଞ୍ଚ କରନ୍ତୁ: 2(5) + 3 = 5 + 8 → 13 = 13 ✓'
          ]
        }
      ],
      practiceProblems: [
        {
          question: language === 'en' ? 'Two irrigation zones need balancing. Zone A gets 3x + 5 liters while Zone B gets 2x + 10 liters. For equal distribution, what should x be? (3x + 5 = 2x + 10)' :
                   language === 'hi' ? 'दो सिंचाई क्षेत्रों को संतुलित करना है। क्षेत्र A को 3x + 5 लीटर मिलता है जबकि क्षेत्र B को 2x + 10 लीटर मिलता है। समान वितरण के लिए, x क्या होना चाहिए? (3x + 5 = 2x + 10)' :
                   'ଦୁଇଟି ଜଳସେଚନ ଜୋନ୍ ସନ୍ତୁଳନ ଆବଶ୍ୟକ। ଜୋନ୍ A କୁ 3x + 5 ଲିଟର ମିଳେ ଯେତେବେଳେ ଜୋନ୍ B କୁ 2x + 10 ଲିଟର ମିଳେ। ସମାନ ବଣ୍ଟନ ପାଇଁ, x କ\'ଣ ହେବା ଉଚିତ? (3x + 5 = 2x + 10)',
          answer: 5,
          options: [3, 4, 5, 6],
          explanation: language === 'en' ? '3x + 5 = 2x + 10 → x = 5' :
                      language === 'hi' ? '3x + 5 = 2x + 10 → x = 5' :
                      '3x + 5 = 2x + 10 → x = 5'
        }
      ]
    }
  ];

  // Animation Components with agricultural irrigation context
  function LinearEquationIntroAnimation() {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startAnimation = () => {
      setIsPlaying(true);
      setStep(0);
      const interval = setInterval(() => {
        setStep(prev => {
          if (prev >= 5) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
    };

    return (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-blue-800 mb-2">
            {language === 'en' ? 'Linear Equations in Irrigation Systems' : 
             language === 'hi' ? 'सिंचाई प्रणालियों में रैखिक समीकरण' :
             'ଜଳସେଚନ ବ୍ୟବସ୍ଥାରେ ରେଖୀୟ ସମୀକରଣ'}
          </h4>
          <Button onClick={startAnimation} disabled={isPlaying} className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            {t.watchAnimation}
          </Button>
        </div>

        <div className="relative h-64 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <svg viewBox="0 0 500 200" className="w-full h-full">
            {/* Water Source */}
            <circle cx="50" cy="50" r="25" fill="#3B82F6" className={step >= 0 ? 'animate-lesson-fade-in' : 'opacity-0'} />
            <text x="50" y="55" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">H₂O</text>
            <text x="50" y="85" textAnchor="middle" fontSize="10" fill="#3B82F6">Water Source</text>

            {/* Pipe System */}
            {step >= 1 && (
              <g className="animate-lesson-fade-in">
                <line x1="75" y1="50" x2="200" y2="50" stroke="#6B7280" strokeWidth="8" />
                <text x="135" y="45" textAnchor="middle" fontSize="10" fill="#6B7280">Main Pipe</text>
              </g>
            )}

            {/* Control Valve */}
            {step >= 2 && (
              <g className="animate-lesson-fade-in">
                <rect x="190" y="35" width="20" height="30" fill="#EF4444" rx="5" />
                <text x="200" y="80" textAnchor="middle" fontSize="10" fill="#EF4444">Control Valve</text>
                <text x="200" y="95" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">Flow = 2x + 5</text>
              </g>
            )}

            {/* Output Pipes */}
            {step >= 3 && (
              <g className="animate-lesson-fade-in">
                <line x1="210" y1="50" x2="300" y2="50" stroke="#6B7280" strokeWidth="6" />
                <line x1="300" y1="50" x2="350" y2="30" stroke="#6B7280" strokeWidth="4" />
                <line x1="300" y1="50" x2="350" y2="70" stroke="#6B7280" strokeWidth="4" />
              </g>
            )}

            {/* Crop Fields */}
            {step >= 4 && (
              <g className="animate-lesson-fade-in">
                {/* Field 1 */}
                <rect x="340" y="15" width="40" height="30" fill="#22C55E" rx="5" />
                <text x="360" y="32" textAnchor="middle" fontSize="10" fill="white">Field A</text>
                
                {/* Field 2 */}
                <rect x="340" y="55" width="40" height="30" fill="#22C55E" rx="5" />
                <text x="360" y="72" textAnchor="middle" fontSize="10" fill="white">Field B</text>
              </g>
            )}

            {/* Equation Display */}
            {step >= 5 && (
              <g className="animate-lesson-fade-in">
                <rect x="50" y="120" width="400" height="60" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" rx="10" />
                <text x="250" y="140" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
                  If total flow needed = 15 L/min
                </text>
                <text x="250" y="160" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3B82F6">
                  2x + 5 = 15
                </text>
                <text x="250" y="175" textAnchor="middle" fontSize="12" fill="#6B7280">
                  Solve for x to find optimal valve setting
                </text>
              </g>
            )}

            {/* Flow Animation */}
            {step >= 3 && (
              <g>
                {Array.from({length: 5}).map((_, i) => (
                  <circle
                    key={i}
                    cx={80 + (i * 40)}
                    cy="50"
                    r="3"
                    fill="#60A5FA"
                    className="animate-stream-flow"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </g>
            )}
          </svg>

          {/* Step Explanations */}
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 rounded-lg p-2 text-sm">
            {step === 0 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'Water starts from the main reservoir' :
                 language === 'hi' ? 'पानी मुख्य जलाशय से शुरू होता है' :
                 'ଜଳ ମୁଖ୍ୟ ଜଳାଶୟରୁ ଆରମ୍ଭ ହୁଏ'}
              </p>
            )}
            {step === 1 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'Flows through the main pipe system' :
                 language === 'hi' ? 'मुख्य पाइप सिस्टम के माध्यम से प्रवाहित होता है' :
                 'ମୁଖ୍ୟ ପାଇପ ସିଷ୍ଟମ ମାଧ୍ୟମରେ ପ୍ରବାହିତ ହୁଏ'}
              </p>
            )}
            {step === 2 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'Control valve regulates flow using equation 2x + 5' :
                 language === 'hi' ? 'नियंत्रण वाल्व समीकरण 2x + 5 का उपयोग करके प्रवाह को नियंत्रित करता है' :
                 'ନିୟନ୍ତ୍ରଣ ଭାଲ୍ଭ ସମୀକରଣ 2x + 5 ବ୍ୟବହାର କରି ପ୍ରବାହ ନିୟନ୍ତ୍ରଣ କରେ'}
              </p>
            )}
            {step === 3 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'Water distributes to multiple irrigation zones' :
                 language === 'hi' ? 'पानी कई सिंचाई क्षेत्रों में वितरित होता है' :
                 'ଜଳ ଏକାଧିକ ଜଳସେଚନ ଜୋନରେ ବଣ୍ଟନ ହୁଏ'}
              </p>
            )}
            {step === 4 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'Each field receives optimal water for crop growth' :
                 language === 'hi' ? 'प्रत्येक खेत को फसल की वृद्धि के लिए इष्टतम पानी मिलता है' :
                 'ପ୍ରତ୍ୟେକ କ୍ଷେତ ଫସଲ ବୃଦ୍ଧି ପାଇଁ ଉତ୍କୃଷ୍ଟ ଜଳ ପାଇଥାଏ'}
              </p>
            )}
            {step === 5 && (
              <p className="text-gray-700 animate-lesson-fade-in">
                {language === 'en' ? 'Linear equation helps calculate exact valve setting needed' :
                 language === 'hi' ? 'रैखिक समीकरण सटीक वाल्व सेटिंग की गणना करने में मदद करता है' :
                 'ରେଖୀୟ ସମୀକରଣ ସଠିକ ଭାଲ୍ଭ ସେଟିଂ ଗଣନା କରିବାରେ ସାହାଯ୍ୟ କରେ'}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  function SolvingStepsAnimation() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startAnimation = () => {
      setIsPlaying(true);
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2500);
    };

    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-green-800 mb-2">
            {language === 'en' ? 'Step-by-Step Equation Solving' : 
             language === 'hi' ? 'चरणबद्ध समीकरण समाधान' :
             'ପର୍ଯ୍ୟାୟକ୍ରମେ ସମୀକରଣ ସମାଧାନ'}
          </h4>
          <Button onClick={startAnimation} disabled={isPlaying} className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            {t.watchAnimation}
          </Button>
        </div>

        <div className="relative h-64 bg-white rounded-lg border-2 border-gray-200 overflow-hidden p-6">
          {/* Problem Statement */}
          <div className="text-center mb-6">
            <h5 className="text-lg font-bold text-gray-800 mb-2">
              {language === 'en' ? 'Irrigation Problem:' : language === 'hi' ? 'सिंचाई समस्या:' : 'ଜଳସେଚନ ସମସ୍ୟା:'}
            </h5>
            <p className="text-sm text-gray-600 mb-4">
              {language === 'en' ? 'Find the valve setting (x) when: 3x - 7 = 14 L/min' :
               language === 'hi' ? 'वाल्व सेटिंग (x) खोजें जब: 3x - 7 = 14 L/min' :
               'ଭାଲ୍ଭ ସେଟିଂ (x) ଖୋଜନ୍ତୁ ଯେବେ: 3x - 7 = 14 L/min'}
            </p>
          </div>

          {/* Solution Steps */}
          <div className="space-y-4">
            {/* Step 0: Original equation */}
            <div className={`p-4 rounded-lg border-2 transition-all duration-500 ${
              currentStep >= 0 ? 'bg-blue-100 border-blue-300 scale-105' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">3x - 7 = 14</span>
                {currentStep >= 0 && (
                  <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded">
                    {language === 'en' ? 'Start' : language === 'hi' ? 'शुरुआत' : 'ଆରମ୍ଭ'}
                  </span>
                )}
              </div>
            </div>

            {/* Step 1: Add 7 to both sides */}
            {currentStep >= 1 && (
              <div className="p-4 rounded-lg border-2 bg-green-100 border-green-300 animate-lesson-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">3x = 21</span>
                  <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">
                    {language === 'en' ? 'Add 7' : language === 'hi' ? '7 जोड़ें' : '7 ଯୋଗ କରନ୍ତୁ'}
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  {language === 'en' ? 'Add 7 to both sides to isolate 3x' :
                   language === 'hi' ? '3x को अलग करने के लिए दोनों पक्षों में 7 जोड़ें' :
                   '3x କୁ ଅଲଗ କରିବା ପାଇଁ ଉଭୟ ପାର୍ଶ୍ୱରେ 7 ଯୋଗ କରନ୍ତୁ'}
                </p>
              </div>
            )}

            {/* Step 2: Divide by 3 */}
            {currentStep >= 2 && (
              <div className="p-4 rounded-lg border-2 bg-purple-100 border-purple-300 animate-lesson-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">x = 7</span>
                  <span className="text-sm bg-purple-500 text-white px-2 py-1 rounded">
                    {language === 'en' ? 'Divide by 3' : language === 'hi' ? '3 से भाग दें' : '3 ଦ୍ୱାରା ଭାଗ କରନ୍ତୁ'}
                  </span>
                </div>
                <p className="text-sm text-purple-700 mt-2">
                  {language === 'en' ? 'Divide both sides by 3 to find x' :
                   language === 'hi' ? 'x खोजने के लिए दोनों पक्षों को 3 से भाग दें' :
                   'x ଖୋଜିବା ପାଇଁ ଉଭୟ ପାର୍ଶ୍ୱକୁ 3 ଦ୍ୱାରା ଭାଗ କରନ୍ତୁ'}
                </p>
              </div>
            )}

            {/* Step 3: Check */}
            {currentStep >= 3 && (
              <div className="p-4 rounded-lg border-2 bg-yellow-100 border-yellow-300 animate-lesson-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">3(7) - 7 = 14 ✓</span>
                  <span className="text-sm bg-yellow-500 text-white px-2 py-1 rounded">
                    {language === 'en' ? 'Check' : language === 'hi' ? 'जांचें' : 'ଯାଞ୍ଚ କରନ୍ତୁ'}
                  </span>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  {language === 'en' ? 'Substitute x = 7 back into original equation' :
                   language === 'hi' ? 'मूल समीकरण में x = 7 को वापस रखें' :
                   'ମୂଳ ସମୀକରଣରେ x = 7 କୁ ବଦଳାନ୍ତୁ'}
                </p>
              </div>
            )}

            {/* Step 4: Solution */}
            {currentStep >= 4 && (
              <div className="p-4 rounded-lg border-2 bg-emerald-100 border-emerald-300 animate-lesson-fade-in">
                <div className="text-center">
                  <span className="text-xl font-bold text-emerald-800">
                    {language === 'en' ? 'Valve Setting: x = 7' :
                     language === 'hi' ? 'वाल्व सेटिंग: x = 7' :
                     'ଭାଲ୍ଭ ସେଟିଂ: x = 7'}
                  </span>
                  <p className="text-sm text-emerald-700 mt-2">
                    {language === 'en' ? 'The optimal valve setting is 7 for 14 L/min flow' :
                     language === 'hi' ? '14 L/min प्रवाह के लिए इष्टतम वाल्व सेटिंग 7 है' :
                     '14 L/min ପ୍ରବାହ ପାଇଁ ଉତ୍କୃଷ୍ଟ ଭାଲ୍ଭ ସେଟିଂ 7'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function ComplexEquationsAnimation() {
    const [equationStep, setEquationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startAnimation = () => {
      setIsPlaying(true);
      setEquationStep(0);
      const interval = setInterval(() => {
        setEquationStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2200);
    };

    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-purple-800 mb-2">
            {language === 'en' ? 'Balancing Two Irrigation Zones' : 
             language === 'hi' ? 'दो सिंचाई क्षेत्रों को संतुलित करना' :
             'ଦୁଇଟି ଜଳସେଚନ ଜୋନ ସନ୍ତୁଳନ'}
          </h4>
          <Button onClick={startAnimation} disabled={isPlaying} className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            {t.watchAnimation}
          </Button>
        </div>

        <div className="relative h-64 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <svg viewBox="0 0 500 200" className="w-full h-full">
            {/* Zone A */}
            {equationStep >= 0 && (
              <g className="animate-lesson-fade-in">
                <rect x="50" y="40" width="150" height="60" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2" rx="10" />
                <text x="125" y="60" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#6366F1">Zone A</text>
                <text x="125" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3730A3">2x + 3 L/min</text>
              </g>
            )}

            {/* Zone B */}
            {equationStep >= 0 && (
              <g className="animate-lesson-fade-in">
                <rect x="300" y="40" width="150" height="60" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" rx="10" />
                <text x="375" y="60" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#F59E0B">Zone B</text>
                <text x="375" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#92400E">x + 8 L/min</text>
              </g>
            )}

            {/* Balance Scale */}
            {equationStep >= 1 && (
              <g className="animate-lesson-fade-in">
                <line x1="250" y1="120" x2="250" y2="160" stroke="#374151" strokeWidth="4" />
                <line x1="200" y1="140" x2="300" y2="140" stroke="#374151" strokeWidth="3" />
                <circle cx="250" cy="165" r="5" fill="#374151" />
                <text x="250" y="180" textAnchor="middle" fontSize="12" fill="#374151">Balance Point</text>
              </g>
            )}

            {/* Equation Setup */}
            {equationStep >= 2 && (
              <g className="animate-lesson-fade-in">
                <rect x="150" y="120" width="200" height="30" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1" rx="5" />
                <text x="250" y="140" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1F2937">
                  2x + 3 = x + 8
                </text>
              </g>
            )}

            {/* Solution Steps */}
            {equationStep >= 3 && (
              <g className="animate-lesson-fade-in">
                <text x="250" y="170" textAnchor="middle" fontSize="12" fill="#059669">
                  Subtract x: x + 3 = 8
                </text>
              </g>
            )}

            {equationStep >= 4 && (
              <g className="animate-lesson-fade-in">
                <text x="250" y="185" textAnchor="middle" fontSize="12" fill="#DC2626">
                  Subtract 3: x = 5
                </text>
                <rect x="220" y="190" width="60" height="20" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1" rx="3" />
                <text x="250" y="203" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">
                  x = 5
                </text>
              </g>
            )}

            {/* Water Flow Animation */}
            {equationStep >= 1 && (
              <g>
                {/* Flow to Zone A */}
                {Array.from({length: 3}).map((_, i) => (
                  <circle
                    key={`a-${i}`}
                    cx={80 + (i * 25)}
                    cy="25"
                    r="3"
                    fill="#6366F1"
                    className="animate-water-drop"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                ))}
                
                {/* Flow to Zone B */}
                {Array.from({length: 3}).map((_, i) => (
                  <circle
                    key={`b-${i}`}
                    cx={330 + (i * 25)}
                    cy="25"
                    r="3"
                    fill="#F59E0B"
                    className="animate-water-drop"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                ))}
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  const handleLessonComplete = (lessonIndex: number) => {
    setStudentProgress(prev => ({
      ...prev,
      lessonsCompleted: prev.lessonsCompleted + 1,
      conceptsUnderstood: prev.conceptsUnderstood + 1,
      totalXP: prev.totalXP + 150
    }));

    // Unlock next lesson logic here
  };

  const handlePracticeAnswer = (answer: string | number) => {
    setSelectedAnswer(answer);
    const currentLessonData = lessonContent[currentLesson];
    const currentProblemData = currentLessonData.practiceProblems[currentProblem];
    const correct = answer === currentProblemData.answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setStudentProgress(prev => ({
        ...prev,
        practiceScore: prev.practiceScore + 15,
        totalXP: prev.totalXP + 30
      }));
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      if (currentProblem < currentLessonData.practiceProblems.length - 1) {
        setCurrentProblem(currentProblem + 1);
      } else {
        handleLessonComplete(currentLesson);
        if (currentLesson < lessonContent.length - 1) {
          setCurrentLesson(currentLesson + 1);
          setCurrentProblem(0);
        } else {
          // All lessons completed
          onComplete(studentProgress.totalXP, studentProgress.totalXP);
        }
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="bg-white/80">
            ← Back to Agricultural Hub
          </Button>
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              XP: {studentProgress.totalXP}
            </Badge>
            <Badge className="bg-cyan-100 text-cyan-800 px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              Concepts: {studentProgress.conceptsUnderstood}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Droplets className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-3xl text-gray-800 mb-2">{t.title}</CardTitle>
            <p className="text-lg text-blue-700">{t.subtitle}</p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="concept" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="concept" className="flex items-center space-x-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>{t.conceptExplorer}</span>
                </TabsTrigger>
                <TabsTrigger value="interactive" className="flex items-center space-x-2">
                  <Hand className="h-4 w-4" />
                  <span>{t.tryInteractive}</span>
                </TabsTrigger>
                <TabsTrigger value="practice" className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>{t.practiceNow}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="concept" className="space-y-6">
                {/* Concept Learning Section */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-3">
                      <BookOpen className="h-6 w-6" />
                      {lessonContent[currentLesson].title}
                    </h3>
                    <p className="text-blue-700 text-lg leading-relaxed mb-6">
                      {lessonContent[currentLesson].explanation}
                    </p>
                  </div>

                  {/* Visual Demo */}
                  {lessonContent[currentLesson].visualDemo}

                  {/* Examples Section */}
                  <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                    <h4 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      {language === 'en' ? 'Worked Example' : language === 'hi' ? 'हल किया गया उदाहरण' : 'ସମାଧାନ ହୋଇଥିବା ଉଦାହରଣ'}
                    </h4>
                    
                    {lessonContent[currentLesson].examples.map((example, index) => (
                      <div key={index} className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-amber-300">
                          <h5 className="font-bold text-gray-800 mb-2">
                            {language === 'en' ? 'Problem:' : language === 'hi' ? 'समस्या:' : 'ସମସ୍ୟା:'} {example.problem}
                          </h5>
                          <p className="text-green-700 font-bold text-lg">
                            {language === 'en' ? 'Answer:' : language === 'hi' ? 'उत्तर:' : 'ଉତ୍ତର:'} {example.solution}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Button
                            onClick={() => setShowSteps(!showSteps)}
                            variant="outline"
                            className="mb-4"
                          >
                            {showSteps ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-2" />
                                {t.hideSteps}
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4 mr-2" />
                                {t.showSteps}
                              </>
                            )}
                          </Button>
                          
                          {showSteps && (
                            <div className="bg-white rounded-lg p-4 border-2 border-blue-300 space-y-2">
                              {example.steps.map((step, stepIndex) => (
                                <div 
                                  key={stepIndex} 
                                  className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 animate-lesson-fade-in"
                                  style={{ animationDelay: `${stepIndex * 200}ms` }}
                                >
                                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {stepIndex + 1}
                                  </div>
                                  <p className="text-blue-800">{step}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-6">
                    <Button
                      onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                      disabled={currentLesson === 0}
                      variant="outline"
                    >
                      ← Previous
                    </Button>
                    
                    <div className="flex space-x-2">
                      {lessonContent.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index === currentLesson 
                              ? 'bg-blue-500' 
                              : index < currentLesson 
                              ? 'bg-green-500' 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => setCurrentLesson(Math.min(lessonContent.length - 1, currentLesson + 1))}
                      disabled={currentLesson === lessonContent.length - 1}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {t.nextConcept} →
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="interactive" className="space-y-6">
                {/* Interactive Demo Section */}
                <div className="text-center space-y-6">
                  <h3 className="text-2xl font-bold text-cyan-800">
                    {language === 'en' ? 'Interactive Irrigation System' : 
                     language === 'hi' ? 'इंटरैक्टिव सिंचाई प्रणाली' :
                     'ଇଣ୍ଟରାକ୍ଟିଭ ଜଳସେଚନ ବ୍ୟବସ୍ଥା'}
                  </h3>
                  
                  {/* Current lesson's visual demo with enhanced interactivity */}
                  {lessonContent[currentLesson].visualDemo}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                      <CardContent className="p-6 text-center">
                        <Gauge className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-blue-800 mb-2">
                          {language === 'en' ? 'Flow Calculator' : language === 'hi' ? 'प्रवाह कैलकुलेटर' : 'ପ୍ରବାହ କ୍ୟାଲକୁଲେଟର'}
                        </h4>
                        <p className="text-blue-700 text-sm">
                          {language === 'en' ? 'Calculate optimal irrigation flow rates using linear equations' :
                           language === 'hi' ? 'रैखिक समीकरणों का उपयोग करके इष्टतम सिंचाई प्रवाह दर की गणना करें' :
                           'ରେଖୀୟ ସମୀକରଣ ବ୍ୟବହାର କରି ଉତ୍କୃଷ୍ଟ ଜଳସେଚନ ପ୍ରବାହ ହାର ଗଣନା କରନ୍ତୁ'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                      <CardContent className="p-6 text-center">
                        <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-green-800 mb-2">
                          {language === 'en' ? 'System Optimizer' : language === 'hi' ? 'सिस्टम अनुकूलक' : 'ସିଷ୍ଟମ ଅପ୍ଟିମାଇଜର'}
                        </h4>
                        <p className="text-green-700 text-sm">
                          {language === 'en' ? 'Balance multiple irrigation zones with equation solving' :
                           language === 'hi' ? 'समीकरण समाधान के साथ कई सिंचाई क्षेत्रों को संतुलित करें' :
                           'ସମୀକରଣ ସମାଧାନ ସହିତ ଏକାଧିକ ଜଳସେଚନ ଜୋନ ସନ୍ତୁଳନ କରନ୍ତୁ'}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="practice" className="space-y-6">
                {/* Practice Problems Section */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      {language === 'en' ? 'Practice Problems' : language === 'hi' ? 'अभ्यास की समस्याएं' : 'ଅଭ୍ୟାସ ସମସ୍ୟା'}
                    </h3>
                    <p className="text-green-700">
                      {language === 'en' ? 'Apply linear equation skills to real irrigation scenarios' :
                       language === 'hi' ? 'वास्तविक सिंचाई परिदृश्यों में रैखिक समीकरण कौशल लागू करें' :
                       'ପ୍ରକୃତ ଜଳସେଚନ ପରିସ୍ଥିତିରେ ରେଖୀୟ ସମୀକରଣ ଦକ୍ଷତା ପ୍ରୟୋଗ କରନ୍ତୁ'}
                    </p>
                  </div>

                  {currentProblem < lessonContent[currentLesson].practiceProblems.length && (
                    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl text-cyan-800">
                            {language === 'en' ? `Problem ${currentProblem + 1}` : 
                             language === 'hi' ? `समस्या ${currentProblem + 1}` :
                             `ସମସ୍ୟା ${currentProblem + 1}`}
                          </CardTitle>
                          <Badge className="bg-blue-100 text-blue-800">
                            {currentProblem + 1} / {lessonContent[currentLesson].practiceProblems.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                          <p className="text-lg text-gray-800 leading-relaxed">
                            {lessonContent[currentLesson].practiceProblems[currentProblem].question}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {lessonContent[currentLesson].practiceProblems[currentProblem].options.map((option, index) => (
                            <Button
                              key={index}
                              onClick={() => !showFeedback && handlePracticeAnswer(option)}
                              disabled={showFeedback}
                              className={`p-6 text-lg font-medium rounded-xl border-2 transition-all duration-300 ${
                                selectedAnswer === option
                                  ? isCorrect
                                    ? 'bg-green-100 border-green-400 text-green-800'
                                    : 'bg-red-100 border-red-400 text-red-800'
                                  : 'bg-white border-gray-200 hover:border-cyan-400 hover:bg-cyan-50 text-gray-800'
                              } ${showFeedback && option === lessonContent[currentLesson].practiceProblems[currentProblem].answer ? 'bg-green-100 border-green-400 text-green-800' : ''}`}
                            >
                              <div className="flex items-center justify-center space-x-3">
                                <span>{option}</span>
                                {showFeedback && selectedAnswer === option && (
                                  isCorrect ? <CheckCircle className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-red-600" />
                                )}
                                {showFeedback && option === lessonContent[currentLesson].practiceProblems[currentProblem].answer && selectedAnswer !== option && (
                                  <CheckCircle className="h-6 w-6 text-green-600" />
                                )}
                              </div>
                            </Button>
                          ))}
                        </div>

                        {showFeedback && (
                          <div className={`p-6 rounded-xl border-2 ${
                            isCorrect 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-orange-50 border-orange-200'
                          }`}>
                            <div className="flex items-center space-x-3 mb-4">
                              {isCorrect ? (
                                <CheckCircle className="h-8 w-8 text-green-600" />
                              ) : (
                                <Lightbulb className="h-8 w-8 text-orange-600" />
                              )}
                              <span className={`text-lg font-medium ${
                                isCorrect ? 'text-green-800' : 'text-orange-800'
                              }`}>
                                {isCorrect ? t.excellent : t.tryAgain}
                              </span>
                            </div>
                            <p className={`${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
                              {lessonContent[currentLesson].practiceProblems[currentProblem].explanation}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}