import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Wheat, 
  Sun, 
  Cloud, 
  Droplets,
  Thermometer,
  Bug,
  Sprout,
  TreePine,
  Calendar,
  Trophy,
  Timer,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Leaf,
  Beaker,
  Wrench,
  PlayCircle,
  PauseCircle,
  BookOpen,
  Brain,
  Lightbulb,
  Eye,
  Hand,
  Volume2,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipForward,
  Factory,
  Shield,
  Microscope
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Slider } from '../../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import type { Language } from '../../../types/onboarding';

interface CropProductionGameProps {
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

export function CropProductionGame({ language, onBack, onComplete }: CropProductionGameProps) {
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
    title: language === 'en' ? 'Advanced Crop Production & Management Academy' : 
           language === 'hi' ? 'उन्नत फसल उत्पादन और प्रबंधन अकादमी' : 
           'ଉନ୍ନତ ଫସଲ ଉତ୍ପାଦନ ଏବଂ ପରିଚାଳନା ଏକାଡେମୀ',
    subtitle: language === 'en' ? 'Master Complete Agricultural Sciences through Scientific Farming' :
              language === 'hi' ? 'वैज्ञानिक खेती के माध्यम से संपूर्ण कृषि विज्ञान में महारत हासिल करें' :
              'ବୈଜ୍ଞାନିକ କୃଷି ମାଧ୍ୟମରେ ସମ୍ପୂର୍ଣ୍ଣ କୃଷି ବିଜ୍ଞାନରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ',
    learnMode: language === 'en' ? 'Learning Mode' : language === 'hi' ? 'सीखने का तरीका' : 'ଶିକ୍ଷାର ମୋଡ୍',
    practiceMode: language === 'en' ? 'Practice Mode' : language === 'hi' ? 'अभ्यास मोड' : 'ଅଭ୍ୟାସ ମୋଡ୍',
    conceptExplorer: language === 'en' ? 'Concept Explorer' : language === 'hi' ? 'अवधारणा खोजकर्ता' : 'ସଂକଳ୍ପ ଅନୁସନ୍ଧାନକାରୀ',
    startLearning: language === 'en' ? 'Start Learning Journey' : language === 'hi' ? 'सीखने की यात्रा शुरू करें' : 'ଶିକ୍ଷାର ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ',
    soilPreparation: language === 'en' ? 'Soil Preparation & Selection' : language === 'hi' ? 'मिट्टी की तैयारी और चयन' : 'ମାଟି ପ୍ରସ୍ତୁତି ଏବଂ ଚୟନ',
    sowingAndSeeds: language === 'en' ? 'Sowing and Seed Selection' : language === 'hi' ? 'बुआई और बीज चयन' : 'ବିହନ ବୁଣିବା ଏବଂ ଚୟନ',
    fertilizersAndManure: language === 'en' ? 'Fertilizers and Manure Management' : language === 'hi' ? 'उर्वरक और खाद प्रबंधन' : 'ସାର ଏବଂ ଖତ ପରିଚାଳନା',
    irrigationSystems: language === 'en' ? 'Irrigation and Water Management' : language === 'hi' ? 'सिंचाई और जल प्रबंधन' : 'ଜଳସେଚନ ଏବଂ ଜଳ ପରିଚାଳନା',
    pestControl: language === 'en' ? 'Pest and Disease Control' : language === 'hi' ? 'कीट और रोग नियंत्रण' : 'କୀଟ ଏବଂ ରୋଗ ନିୟନ୍ତ୍ରଣ',
    harvestingStorage: language === 'en' ? 'Harvesting and Storage' : language === 'hi' ? 'कटाई और भंडारण' : 'ଅମଳ ଏବଂ ଭଣ୍ଡାରଣ',
    watchAnimation: language === 'en' ? 'Watch Animation' : language === 'hi' ? 'एनीमेशन देखें' : 'ଆନିମେସନ୍ ଦେଖନ୍ତୁ',
    tryInteractive: language === 'en' ? 'Try Interactive Demo' : language === 'hi' ? 'इंटरैक्टिव डेमो आज़माएं' : 'ଇଣ୍ଟରାକ୍ଟିଭ ଡେମୋ ଚେଷ୍ଟା କରନ୍ତୁ',
    practiceNow: language === 'en' ? 'Practice Now' : language === 'hi' ? 'अभी अभ्यास करें' : 'ବର୍ତ୍ତମାନ ଅଭ୍ୟାସ କରନ୍ତୁ',
    showSteps: language === 'en' ? 'Show Solution Steps' : language === 'hi' ? 'समाधान के चरण दिखाएं' : 'ସମାଧାନ ସୋପାନ ଦେଖାନ୍ତୁ',
    hideSteps: language === 'en' ? 'Hide Steps' : language === 'hi' ? 'चरण छुपाएं' : 'ସୋପାନ ଲୁଚାନ୍ତୁ',
    nextConcept: language === 'en' ? 'Next Concept' : language === 'hi' ? 'अगली अवधारणा' : 'ପରବର୍ତ୍ତୀ ସଂକଳ୍ପ',
    excellent: language === 'en' ? 'Excellent! You understand this concept!' : language === 'hi' ? 'उत्कृष्ट! आप इस अवधारणा को समझते हैं!' : 'ଉତ୍କୃଷ୍ଟ! ଆପଣ ଏହି ସଂକଳ୍ପ ବୁଝିଛନ୍ତି!',
    tryAgain: language === 'en' ? 'Not quite right. Let\'s review the concept!' : language === 'hi' ? 'बिल्कुल सही नहीं। आइए अवधारणा की समीक्षा करते हैं!' : 'ସମ୍ପୂର୍ଣ୍ଣ ଠିକ୍ ନୁହେଁ। ଆସନ୍ତୁ ସଂକଳ୍ପ ସମୀକ୍ଷା କରିବା!'
  };

  // Comprehensive lesson content covering Odisha Board Class 8 Crop Production syllabus
  const lessonContent: LessonContent[] = [
    {
      id: 'soil-preparation',
      title: t.soilPreparation,
      concept: language === 'en' ? 'Soil Preparation and Selection' : language === 'hi' ? 'मिट्टी की तैयारी और चयन' : 'ମାଟି ପ୍ରସ୍ତୁତି ଏବଂ ଚୟନ',
      explanation: language === 'en' ? 
        'Soil preparation is the foundation of successful crop production. It involves selecting the right soil type, testing soil pH and nutrients, ploughing, harrowing, and leveling. Good soil preparation ensures proper aeration, water retention, and nutrient availability for crops. Different crops require different soil conditions - for example, rice grows well in clayey soil while wheat prefers well-drained loamy soil.' :
        language === 'hi' ? 
        'मिट्टी की तैयारी सफल फसल उत्पादन की नींव है। इसमें सही मिट्टी के प्रकार का चयन, मिट्टी के pH और पोषक तत्वों का परीक्षण, जुताई, हैरोइंग और समतलीकरण शामिल है। अच्छी मिट्टी की तैयारी फसलों के लिए उचित वातन, जल प्रतिधारण और पोषक तत्वों की उपलब्धता सुनिश्चित करती है। विभिन्न फसलों को अलग-अलग मिट्टी की स्थिति चाहिए - उदाहरण के लिए, धान चिकनी मिट्टी में अच्छी तरह बढ़ता है जबकि गेहूं अच्छी जल निकासी वाली दोमट मिट्टी पसंद करता है।' :
        'ମାଟି ପ୍ରସ୍ତୁତି ସଫଳ ଫସଲ ଉତ୍ପାଦନର ମୂଳଦୁଆ। ଏଥିରେ ସଠିକ ମାଟି ପ୍ରକାର ଚୟନ, ମାଟି pH ଏବଂ ପୋଷକ ତତ୍ତ୍ୱ ପରୀକ୍ଷା, ହଳ, ହାରୋଇଂ ଏବଂ ସମତଳୀକରଣ ଅନ୍ତର୍ଭୁକ୍ତ। ଉତ୍ତମ ମାଟି ପ୍ରସ୍ତୁତି ଫସଲ ପାଇଁ ଉପଯୁକ୍ତ ବାୟୁ ପ୍ରବାହ, ଜଳ ଧାରଣ ଏବଂ ପୋଷକ ତତ୍ତ୍ୱ ଉପଲବ୍ଧତା ନିଶ୍ଚିତ କରେ। ବିଭିନ୍ନ ଫସଲ ପାଇଁ ବିଭିନ୍ନ ମାଟି ଅବସ୍ଥା ଆବଶ୍ୟକ - ଉଦାହରଣ ସ୍ୱରୂପ, ଧାନ ମାଟି ମାଟିରେ ଭଲ ବଢେ ଯେତେବେଳେ ଗହମ ଭଲ ଜଳ ନିଷ୍କାସନ ବାଲି ମାଟି ପସନ୍ଦ କରେ।',
      visualDemo: <SoilPreparationAnimation />,
      examples: [
        {
          problem: language === 'en' ? 'A farmer wants to grow wheat. What type of soil preparation is needed?' : language === 'hi' ? 'एक किसान गेहूं उगाना चाहता है। किस प्रकार की मिट्टी की तैयारी की आवश्यकता है?' : 'ଜଣେ କୃଷକ ଗହମ ଚାଷ କରିବାକୁ ଚାହାଁନ୍ତି। କେଉଁ ପ୍ରକାର ମାଟି ପ୍ରସ୍ତୁତି ଆବଶ୍ୟକ?',
          solution: language === 'en' ? 'Well-drained loamy soil with pH 6.0-7.5' : language === 'hi' ? 'pH 6.0-7.5 के साथ अच्छी जल निकासी वाली दोमट मिट्टी' : 'pH 6.0-7.5 ସହିତ ଭଲ ଜଳ ନିଷ୍କାସନ ବାଲି ମାଟି',
          steps: [
            language === 'en' ? 'Test soil pH - should be 6.0-7.5 for wheat' : language === 'hi' ? 'मिट्टी pH परीक्षण - गेहूं के लिए 6.0-7.5 होना चाहिए' : 'ମାଟି pH ପରୀକ୍ଷା - ଗହମ ପାଇଁ 6.0-7.5 ହେବା ଉଚିତ',
            language === 'en' ? 'Ensure good drainage to prevent waterlogging' : language === 'hi' ? 'जलजमाव रोकने के लिए अच्छी जल निकासी सुनिश्चित करें' : 'ଜଳ ଜମିବା ରୋକିବା ପାଇଁ ଭଲ ଜଳ ନିଷ୍କାସନ ନିଶ୍ଚିତ କରନ୍ତୁ',
            language === 'en' ? 'Deep ploughing to improve soil structure' : language === 'hi' ? 'मिट्टी की संरचना सुधारने के लिए गहरी जुताई' : 'ମାଟି ଗଠନ ଉନ୍ନତ କରିବା ପାଇଁ ଗଭୀର ହଳ',
            language === 'en' ? 'Add organic matter like compost or manure' : language === 'hi' ? 'कंपोस्ट या खाद जैसे जैविक पदार्थ जोड़ें' : 'କମ୍ପୋଷ୍ଟ କିମ୍ବା ଖତ ଭଳି ଜୈବିକ ପଦାର୍ଥ ଯୋଗ କରନ୍ତୁ'
          ]
        }
      ],
      practiceProblems: [
        {
          question: language === 'en' ? 'Which soil preparation step is most important for preventing pest problems?' : 
                   language === 'hi' ? 'कीट समस्याओं को रोकने के लिए मिट्टी की तैयारी का कौन सा चरण सबसे महत्वपूर्ण है?' :
                   'କୀଟ ସମସ୍ୟା ରୋକିବା ପାଇଁ ମାଟି ପ୍ରସ୍ତୁତିର କେଉଁ ପର୍ଯ୍ୟାୟ ସବୁଠାରୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ?',
          answer: language === 'en' ? 'Deep ploughing to destroy pest eggs and larvae' : language === 'hi' ? 'कीट अंडे और लार्वा को नष्ट करने के लिए गहरी जुताई' : 'କୀଟ ଅଣ୍ଡା ଏବଂ ଲାର୍ଭା ନଷ୍ଟ କରିବା ପାଇଁ ଗଭୀର ହଳ',
          options: [
            language === 'en' ? 'Deep ploughing to destroy pest eggs and larvae' : language === 'hi' ? 'कीट अंडे और लार्वा को नष्ट करने के लिए गहरी जुताई' : 'କୀଟ ଅଣ୍ଡା ଏବଂ ଲାର୍ଭା ନଷ୍ଟ କରିବା ପାଇଁ ଗଭୀର ହଳ',
            language === 'en' ? 'Surface leveling only' : language === 'hi' ? 'केवल सतह समतलीकरण' : 'କେବଳ ଭୂପୃଷ୍ଠ ସମତଳୀକରଣ',
            language === 'en' ? 'Adding chemical fertilizers' : language === 'hi' ? 'रासायनिक उर्वरक जोड़ना' : 'ରାସାୟନିକ ସାର ଯୋଗ କରିବା',
            language === 'en' ? 'Watering the field' : language === 'hi' ? 'खेत में पानी देना' : 'କ୍ଷେତରେ ପାଣି ଦେବା'
          ],
          explanation: language === 'en' ? 'Deep ploughing in summer exposes pest eggs and larvae to heat and predators, naturally controlling pest populations.' :
                      language === 'hi' ? 'गर्मियों में गहरी जुताई कीट अंडे और लार्वा को गर्मी और शिकारियों के सामने उजागर करती है, जो प्राकृतिक रूप से कीट आबादी को नियंत्रित करती है।' :
                      'ଗ୍ରୀଷ୍ମରେ ଗଭୀର ହଳ କୀଟ ଅଣ୍ଡା ଏବଂ ଲାର୍ଭାକୁ ଗରମ ଏବଂ ଶିକାରୀମାନଙ୍କ ସାମ୍ନାରେ ପ୍ରକାଶ କରେ, ପ୍ରାକୃତିକ ଭାବରେ କୀଟ ଜନସଂଖ୍ୟା ନିୟନ୍ତ୍ରଣ କରେ।'
        }
      ]
    },
    {
      id: 'sowing-seeds',
      title: t.sowingAndSeeds,
      concept: language === 'en' ? 'Sowing Methods and Seed Selection' : language === 'hi' ? 'बुआई के तरीके और बीज चयन' : 'ବିହନ ବୁଣିବା ପଦ୍ଧତି ଏବଂ ବିହନ ଚୟନ',
      explanation: language === 'en' ? 
        'Proper sowing ensures optimal plant growth and yield. Key factors include seed selection (choosing disease-resistant, high-yielding varieties), sowing methods (broadcasting, drilling, transplanting), proper spacing, depth, and timing. The right sowing method depends on the crop type, soil conditions, and available resources. Modern techniques like seed treatment and pelleting improve germination rates.' :
        language === 'hi' ? 
        'उचित बुआई इष्टतम पौधों की वृद्धि और उत्पादन सुनिश्चित करती है। मुख्य कारकों में बीज चयन (रोग प्रतिरोधी, उच्च उत्पादन वाली किस्मों का चुनाव), बुआई के तरीके (छिड़काव, ड्रिलिंग, रोपाई), उचित दूरी, गहराई और समय शामिल हैं। सही बुआई विधि फसल के प्रकार, मिट्टी की स्थिति और उपलब्ध संसाधनों पर निर्भर करती है। बीज उपचार और पेलेटिंग जैसी आधुनिक तकनीकें अंकुरण दर में सुधार करती हैं।' :
        'ଉପଯୁକ୍ତ ବିହନ ବୁଣିବା ଉତ୍କୃଷ୍ଟ ଉଦ୍ଭିଦ ବୃଦ୍ଧି ଏବଂ ଅମଳ ନିଶ୍ଚିତ କରେ। ମୁଖ୍ୟ କାରକଗୁଡ଼ିକରେ ବିହନ ଚୟନ (ରୋଗ ପ୍ରତିରୋଧୀ, ଉଚ୍ଚ ଅମଳକାରୀ କିସମ ଚୟନ), ବିହନ ବୁଣିବା ପଦ୍ଧତି (ବିକିରଣ, ଡ୍ରିଲିଂ, ରୋପଣ), ଉପଯୁକ୍ତ ବ୍ୟବଧାନ, ଗଭୀରତା ଏବଂ ସମୟ ଅନ୍ତର୍ଭୁକ୍ତ। ସଠିକ ବିହନ ବୁଣିବା ପଦ୍ଧତି ଫସଲ ପ୍ରକାର, ମାଟି ଅବସ୍ଥା ଏବଂ ଉପଲବ୍ଧ ସମ୍ବଳ ଉପରେ ନିର୍ଭର କରେ। ବିହନ ଚିକିତ୍ସା ଏବଂ ପେଲେଟିଂ ଭଳି ଆଧୁନିକ କୌଶଳ ଅଙ୍କୁରଣ ହାର ଉନ୍ନତ କରେ।',
      visualDemo: <SowingSeedsAnimation />,
      examples: [
        {
          problem: language === 'en' ? 'Compare broadcasting vs drilling methods for wheat sowing' : language === 'hi' ? 'गेहूं की बुआई के लिए छिड़काव बनाम ड्रिलिंग विधियों की तुलना करें' : 'ଗହମ ବିହନ ବୁଣିବା ପାଇଁ ବିକିରଣ ବନାମ ଡ୍ରିଲିଂ ପଦ୍ଧତିର ତୁଳନା କରନ୍ତୁ',
          solution: language === 'en' ? 'Drilling is more efficient for wheat' : language === 'hi' ? 'गेहूं के लिए ड्रिलिंग अधिक कुशल है' : 'ଗହମ ପାଇଁ ଡ୍ରିଲିଂ ଅଧିକ ଦକ୍ଷ',
          steps: [
            language === 'en' ? 'Broadcasting: Seeds scattered uniformly, requires more seeds' : language === 'hi' ? 'छिड़काव: बीज समान रूप से बिखेरे जाते हैं, अधिक बीज चाहिए' : 'ବିକିରଣ: ବିହନ ସମାନ ଭାବରେ ବିଛିନ୍ନ, ଅଧିକ ବିହନ ଆବଶ୍ୟକ',
            language === 'en' ? 'Drilling: Seeds placed in lines at specific depth and spacing' : language === 'hi' ? 'ड्रिलिंग: बीज विशिष्ट गहराई और दूरी पर लाइनों में रखे जाते हैं' : 'ଡ୍ରିଲିଂ: ବିହନ ନିର୍ଦ୍ଦିଷ୍ଟ ଗଭୀରତା ଏବଂ ବ୍ୟ���ଧାନରେ ଧାଡ଼ିରେ ରଖାଯାଏ',
            language === 'en' ? 'Drilling advantages: Better germination, easier weeding, less seed wastage' : language === 'hi' ? 'ड्रिलिंग के फायदे: बेहतर अंकुरण, आसान निराई, कम बीज बर्बादी' : 'ଡ୍ରିଲିଂ ସୁବିଧା: ଉତ୍ତମ ଅଙ୍କୁରଣ, ସହଜ ତୃଣ ନାଶ, କମ ବିହନ ନଷ୍ଟ',
            language === 'en' ? 'Result: 20-30% higher yield with drilling method' : language === 'hi' ? 'परिणाम: ड्रिलिंग विधि से 20-30% अधिक उत्पादन' : 'ଫଳାଫଳ: ଡ୍ରିଲିଂ ପଦ୍ଧତି ସହିତ 20-30% ଅଧିକ ଅମଳ'
          ]
        }
      ],
      practiceProblems: [
        {
          question: language === 'en' ? 'What is the main advantage of treating seeds before sowing?' :
                   language === 'hi' ? 'बुआई से पहले बीजों का उपचार करने का मुख्य फायदा क्या है?' :
                   'ବିହନ ବୁଣିବା ପୂର୍ବରୁ ବିହନ ଚିକିତ୍ସା କରିବାର ମୁଖ୍ୟ ସୁବିଧା କ\'ଣ?',
          answer: language === 'en' ? 'Protection from diseases and pests' : language === 'hi' ? 'रोग और कीटों से सुरक्षा' : 'ରୋଗ ଏବଂ କୀଟରୁ ସୁରକ୍ଷା',
          options: [
            language === 'en' ? 'Protection from diseases and pests' : language === 'hi' ? 'रोग और कीटों से सुरक्षा' : 'ରୋଗ ଏବଂ କୀଟରୁ ସୁରକ୍ଷା',
            language === 'en' ? 'Making seeds colorful' : language === 'hi' ? 'बीजों को रंगीन बनाना' : 'ବିହନକୁ ରଙ୍ଗୀନ ବନାଇବା',
            language === 'en' ? 'Increasing seed size' : language === 'hi' ? 'बीज का आकार बढ़ाना' : 'ବିହନ ଆକାର ବଢ଼ାଇବା',
            language === 'en' ? 'Reducing germination time' : language === 'hi' ? 'अंकुरण समय कम करना' : 'ଅଙ୍କୁରଣ ସମୟ ହ୍ରାସ କରିବା'
          ],
          explanation: language === 'en' ? 'Seed treatment with fungicides and insecticides protects seeds from soil-borne diseases and pests, ensuring better germination and healthier seedlings.' :
                      language === 'hi' ? 'कवकनाशी और कीटनाशक के साथ बीज उपचार मिट्टी जनित रोगों और कीटों से बीजों की रक्षा करता है, बेहतर अंकुरण और स्वस्थ पौधे सुनिश्चित करता है।' :
                      'କବକନାଶକ ଏବଂ କୀଟନାଶକ ସହିତ ବିହନ ଚିକିତ୍ସା ମାଟି ଜନିତ ରୋଗ ଏବଂ କୀଟରୁ ବିହନକୁ ସୁରକ୍ଷା ଦେଇଥାଏ, ଉତ୍ତମ ଅଙ୍କୁରଣ ଏବଂ ସୁସ୍ଥ ଚାରା ନିଶ୍ଚିତ କରେ।'
        }
      ]
    },
    {
      id: 'fertilizers-manure',
      title: t.fertilizersAndManure,
      concept: language === 'en' ? 'Fertilizers and Manure Management' : language === 'hi' ? 'उर्वरक और खाद प्रबंधन' : 'ସାର ଏବଂ ଖତ ପରିଚାଳନା',
      explanation: language === 'en' ? 
        'Plants need nutrients for healthy growth. Primary nutrients are Nitrogen (N) for leaf growth, Phosphorus (P) for root development and flowering, and Potassium (K) for disease resistance. Organic manures like compost, vermicompost, and animal dung improve soil structure and provide slow-release nutrients. Chemical fertilizers provide quick nutrition but should be used carefully to avoid soil degradation. Balanced fertilization combines both organic and chemical sources.' :
        language === 'hi' ? 
        'पौधों को स्वस्थ विकास के लिए पोषक तत्वों की आवश्यकता होती है। प्राथमिक पोषक तत्व हैं नाइट्रोजन (N) पत्ती की वृद्धि के लिए, फास्फोरस (P) जड़ विकास और फूल के लिए, और पोटेशियम (K) रोग प्रतिरोध के लिए। कंपोस्ट, वर्मीकंपोस्ट, और पशु गोबर जैसी जैविक खादें मिट्टी की संरचना में सुधार करती हैं और धीमी-रिलीज़ पोषक तत्व प्रदान करती हैं। रासायनिक उर्वरक त्वरित पोषण प्रदान करते हैं लेकिन मिट्टी की गिरावट से बचने के लिए सावधानी से उपयोग करना चाहिए। संतुलित उर्वरीकरण जैविक और रासायनिक दोनों स्रोतों को जोड़ता है।' :
        'ସୁସ୍ଥ ବୃଦ୍ଧି ପାଇଁ ଉଦ୍ଭିଦମାନଙ୍କର ପୋଷକ ତତ୍ତ୍ୱ ଆବଶ୍ୟକ। ପ୍ରାଥମିକ ପୋଷକ ତତ୍ତ୍ୱ ହେଉଛି ପତ୍ର ବୃଦ୍ଧି ପାଇଁ ନାଇଟ୍ରୋଜେନ (N), ମୂଳ ବିକାଶ ଏବଂ ଫୁଲ ପାଇଁ ଫସଫରସ୍ (P), ଏବଂ ରୋଗ ପ୍ରତିରୋଧ ପାଇଁ ପୋଟାସିୟମ (K)। କମ୍ପୋଷ୍ଟ, ଭର୍ମିକମ୍ପୋଷ୍ଟ, ଏବଂ ପଶୁ ଗୋବର ଭଳି ଜୈବିକ ଖତ ମାଟି ଗଠନ ଉନ୍ନତ କରେ ଏବଂ ମନ୍ଥର-ମୁକ୍ତି ପୋଷକ ତତ୍ତ୍ୱ ପ୍ରଦାନ କରେ। ରାସାୟନିକ ସାର ଶୀଘ୍ର ପୋଷଣ ପ୍ରଦାନ କରେ କିନ୍ତୁ ମାଟି ଅବକ୍ଷୟ ଏଡ଼ାଇବା ପାଇଁ ସାବଧାନତାର ସହିତ ବ୍ୟବହାର କରାଯିବା ଉଚିତ। ସନ୍ତୁଳିତ ସାର ଜୈବିକ ଏବଂ ରାସାୟନିକ ଉଭୟ ସ୍ରୋତକୁ ମିଶ୍ରଣ କରେ।',
      visualDemo: <FertilizerManagementAnimation />,
      examples: [
        {
          problem: language === 'en' ? 'A farmer notices yellowing leaves in rice crop. What nutrient deficiency is this and how to treat it?' : language === 'hi' ? 'एक किसान धान की फसल में पत्तियों का पीला होना देखता है। यह कौन सी पोषक तत्व की कमी है और इसका इलाज कैसे करें?' : 'ଜଣେ କୃଷକ ଧାନ ଫସଲରେ ପତ୍ର ହଳଦିଆ ହେବା ଦେଖନ୍ତି। ଏହା କେଉଁ ପୋଷକ ତତ୍ତ୍ୱର ଅଭାବ ଏବଂ ଏହାର ଚିକିତ୍ସା କିପରି କରିବେ?',
          solution: language === 'en' ? 'Nitrogen deficiency - apply urea or organic manure' : language === 'hi' ? 'नाइट्रोजन की कमी - यूरिया या जैविक खाद डालें' : 'ନାଇଟ୍ରୋଜେନ ଅଭାବ - ୟୁରିଆ କିମ୍ବା ଜୈବିକ ଖତ ପ୍ରୟୋଗ କରନ୍ତୁ',
          steps: [
            language === 'en' ? 'Identify symptom: Yellowing of older leaves first (chlorosis)' : language === 'hi' ? 'लक्षण पहचानें: पहले पुराने पत्तों का पीला होना (क्लोरोसिस)' : 'ଲକ୍ଷଣ ଚିହ୍ନଟ କରନ୍ତୁ: ପ୍ରଥମେ ପୁରୁଣା ପତ୍ରର ହଳଦିଆ ହେବା (କ୍ଲୋରୋସିସ୍)',
            language === 'en' ? 'Confirm: Nitrogen deficiency affects photosynthesis' : language === 'hi' ? 'पुष्टि करें: नाइट्रोजन की कमी प्रकाश संश्लेषण को प्रभावित करती है' : 'ନିଶ୍ଚିତ କରନ୍ତୁ: ନାଇଟ୍ରୋଜେନ ଅଭାବ ଫଟୋସିନ୍ଥେସିସ୍ ପ୍ରଭାବିତ କରେ',
            language === 'en' ? 'Treatment: Apply 40-50 kg urea per hectare' : language === 'hi' ? 'उपचार: प्रति हेक्टेयर 40-50 किलो यूरिया डालें' : 'ଚିକିତ୍ସା: ହେକ୍ଟର ପ୍ରତି 40-50 କିଲୋ ୟୁରିଆ ପ୍ରୟୋଗ କରନ୍ତୁ',
            language === 'en' ? 'Alternative: Use compost for long-term soil health' : language === 'hi' ? 'विकल्प: दीर्घकालिक मिट्टी स्वास्थ्य के लिए कंपोस्ट का उपयोग करें' : 'ବିକଳ୍ପ: ଦୀର୍ଘମିଆଦି ମାଟି ସ୍ୱାସ୍ଥ୍ୟ ପାଇଁ କମ୍ପୋଷ୍ଟ ବ୍ୟବହାର କରନ୍ତୁ'
          ]
        }
      ],
      practiceProblems: [
        {
          question: language === 'en' ? 'Which organic manure is considered best for improving soil structure and water retention?' :
                   language === 'hi' ? 'मिट्टी की संरचना और जल प्रतिधारण में सुधार के लिए कौन सी जैविक खाद सबसे अच्छी मानी जाती है?' :
                   'ମାଟି ଗଠନ ଏବଂ ଜଳ ଧାରଣ ଉନ୍ନତ କରିବା ପାଇଁ କେଉଁ ଜୈବିକ ଖତ ସର୍ବୋତ୍ତମ ବୋଲି ବିବେଚିତ?',
          answer: language === 'en' ? 'Vermicompost' : language === 'hi' ? 'वर्मीकंपोस्ट' : 'ଭର୍ମିକମ୍ପୋଷ୍ଟ',
          options: [
            language === 'en' ? 'Vermicompost' : language === 'hi' ? 'वर्मीकंपोस्ट' : 'ଭର୍ମିକମ୍ପୋଷ୍ଟ',
            language === 'en' ? 'Fresh animal dung' : language === 'hi' ? 'ताजा पशु गोबर' : 'ତାଜା ପଶୁ ଗୋବର',
            language === 'en' ? 'Green manure only' : language === 'hi' ? 'केवल हरी खाद' : 'କେବଳ ସବୁଜ ଖତ',
            language === 'en' ? 'Chemical compost' : language === 'hi' ? 'रासायनिक कंपोस्ट' : 'ରାସାୟନିକ କମ୍ପୋଷ୍ଟ'
          ],
          explanation: language === 'en' ? 'Vermicompost is rich in nutrients, improves soil structure, increases water-holding capacity, and contains beneficial microorganisms that enhance plant growth.' :
                      language === 'hi' ? 'वर्मीकंपोस्ट पोषक तत्वों से भरपूर है, मिट्टी की संरचना में सुधार करता है, जल धारण क्षमता बढ़ाता है, और लाभकारी सूक्ष्मजीव होते हैं जो पौधों की वृद्धि बढ़ाते हैं।' :
                      'ଭର୍ମିକମ୍ପୋଷ୍ଟ ପୋଷକ ତତ୍ତ୍ୱରେ ଭରପୂର, ମାଟି ଗଠନ ଉନ୍ନତ କରେ, ଜଳ ଧାରଣ କ୍ଷମତା ବଢ଼ାଏ, ଏବଂ ଲାଭଦାୟକ ମାଇକ୍ରୋଅର୍ଗାନିଜିମ ରହିଥାଏ ଯାହା ଉଦ୍ଭିଦ ବୃଦ୍ଧି ବଢ଼ାଏ।'
        }
      ]
    }
  ];

  // Animation Components
  function SoilPreparationAnimation() {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startAnimation = () => {
      setIsPlaying(true);
      setStep(0);
      const interval = setInterval(() => {
        setStep(prev => {
          if (prev >= 4) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
    };

    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-amber-800 mb-2">
            {language === 'en' ? 'Soil Preparation Process' : 
             language === 'hi' ? 'मिट्टी की तैयारी प्रक्रिया' :
             'ମାଟି ପ୍ରସ୍ତୁତି ପ୍ରକ୍ରିୟା'}
          </h4>
          <Button onClick={startAnimation} disabled={isPlaying} className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            {t.watchAnimation}
          </Button>
        </div>

        <div className="relative h-64 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <svg viewBox="0 0 500 200" className="w-full h-full">
            {/* Field Background */}
            <rect x="20" y="80" width="460" height="100" fill="#8B4513" className={step >= 0 ? 'animate-lesson-fade-in' : 'opacity-0'} />
            
            {/* Step 1: Ploughing */}
            {step >= 1 && (
              <g className="animate-lesson-fade-in">
                <rect x="50" y="70" width="30" height="15" fill="#4B5563" rx="3" />
                <circle cx="45" cy="85" r="8" fill="#374151" />
                <circle cx="85" cy="85" r="8" fill="#374151" />
                <text x="65" y="105" textAnchor="middle" fontSize="10" fill="#4B5563">Plough</text>
                
                {/* Ploughed furrows */}
                {Array.from({length: 8}).map((_, i) => (
                  <line 
                    key={i}
                    x1={100 + i * 30} 
                    y1="85" 
                    x2={120 + i * 30} 
                    y2="85" 
                    stroke="#654321" 
                    strokeWidth="3"
                    className="animate-lesson-fade-in"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </g>
            )}

            {/* Step 2: Harrowing */}
            {step >= 2 && (
              <g className="animate-lesson-fade-in">
                <rect x="450" y="70" width="25" height="12" fill="#6B7280" rx="2" />
                <text x="462" y="105" textAnchor="middle" fontSize="10" fill="#6B7280">Harrow</text>
                
                {/* Harrowed soil texture */}
                {Array.from({length: 20}).map((_, i) => (
                  <circle
                    key={i}
                    cx={120 + (i % 10) * 25}
                    cy={95 + Math.floor(i / 10) * 10}
                    r="2"
                    fill="#A0522D"
                    className="animate-lesson-fade-in"
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                ))}
              </g>
            )}

            {/* Step 3: Leveling */}
            {step >= 3 && (
              <g className="animate-lesson-fade-in">
                <rect x="20" y="120" width="460" height="60" fill="#CD853F" />
                <text x="250" y="140" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8B4513">
                  Leveled Field Ready for Sowing
                </text>
              </g>
            )}

            {/* Step 4: Seeds */}
            {step >= 4 && (
              <g className="animate-lesson-fade-in">
                {Array.from({length: 15}).map((_, i) => (
                  <circle
                    key={i}
                    cx={50 + (i % 5) * 80}
                    cy={130 + Math.floor(i / 5) * 15}
                    r="3"
                    fill="#228B22"
                    className="animate-seed-bounce"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
                <text x="250" y="170" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#228B22">
                  Seeds Sown
                </text>
              </g>
            )}

            {/* Tools */}
            <g>
              <text x="250" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
                {step === 0 && 'Raw Field'}
                {step === 1 && 'Ploughing - Breaking Soil'}
                {step === 2 && 'Harrowing - Smoothing'}
                {step === 3 && 'Leveling - Final Preparation'}
                {step === 4 && 'Sowing Complete'}
              </text>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  function SowingSeedsAnimation() {
    const [method, setMethod] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startAnimation = () => {
      setIsPlaying(true);
      setMethod(0);
      const interval = setInterval(() => {
        setMethod(prev => {
          if (prev >= 2) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 3000);
    };

    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-green-800 mb-2">
            {language === 'en' ? 'Sowing Methods Comparison' : 
             language === 'hi' ? 'बुआई विधियों की तुलना' :
             'ବିହନ ବୁଣିବା ପଦ୍ଧତି ତୁଳନା'}
          </h4>
          <Button onClick={startAnimation} disabled={isPlaying} className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            {t.watchAnimation}
          </Button>
        </div>

        <div className="relative h-64 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <svg viewBox="0 0 500 200" className="w-full h-full">
            {/* Method Labels */}
            <text x="125" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
              {language === 'en' ? 'Broadcasting' : language === 'hi' ? 'छिड़काव' : 'ବିକିରଣ'}
            </text>
            <text x="375" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
              {language === 'en' ? 'Drilling' : language === 'hi' ? 'ड्रिलिंग' : 'ଡ୍ରିଲିଂ'}
            </text>

            {/* Broadcasting Method */}
            <rect x="25" y="40" width="200" height="120" fill="#F0F8FF" stroke="#4682B4" strokeWidth="2" rx="5" />
            
            {method >= 0 && (
              <g className="animate-lesson-fade-in">
                {/* Random seed distribution */}
                {Array.from({length: 25}).map((_, i) => {
                  const cx = 35 + (Math.random() * 180);
                  const cy = 50 + (Math.random() * 100);
                  return (
                    <circle
                      key={`broad-${i}`}
                      cx={isNaN(cx) ? 125 : cx}
                      cy={isNaN(cy) ? 100 : cy}
                      r="2"
                      fill="#8B4513"
                      className="animate-lesson-fade-in"
                      style={{ animationDelay: `${i * 50}ms` }}
                    />
                  );
                })}
                <text x="125" y="175" textAnchor="middle" fontSize="10" fill="#4682B4">
                  {language === 'en' ? 'Random distribution' : language === 'hi' ? 'यादृच्छिक वितरण' : 'ଯାଦୃଚ୍ଛିକ ବଣ୍ଟନ'}
                </text>
              </g>
            )}

            {/* Drilling Method */}
            <rect x="275" y="40" width="200" height="120" fill="#F0FFF0" stroke="#228B22" strokeWidth="2" rx="5" />
            
            {method >= 1 && (
              <g className="animate-lesson-fade-in">
                {/* Organized rows */}
                {Array.from({length: 6}).map((_, row) => 
                  Array.from({length: 8}).map((_, col) => {
                    const cx = 290 + (col * 20);
                    const cy = 55 + (row * 15);
                    return (
                      <circle
                        key={`drill-${row}-${col}`}
                        cx={isNaN(cx) ? 290 : cx}
                        cy={isNaN(cy) ? 55 : cy}
                        r="2"
                        fill="#228B22"
                        className="animate-lesson-fade-in"
                        style={{ animationDelay: `${(row * 8 + col) * 30}ms` }}
                      />
                    );
                  })
                )}
                {/* Row lines */}
                {Array.from({length: 6}).map((_, i) => {
                  const y = 55 + (i * 15);
                  return (
                    <line
                      key={`row-${i}`}
                      x1="285"
                      y1={isNaN(y) ? 55 : y}
                      x2="465"
                      y2={isNaN(y) ? 55 : y}
                      stroke="#90EE90"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  );
                })}
                <text x="375" y="175" textAnchor="middle" fontSize="10" fill="#228B22">
                  {language === 'en' ? 'Organized rows' : language === 'hi' ? 'व्यवस्थित पंक्तियां' : 'ସଂଗଠିତ ଧାଡ଼ି'}
                </text>
              </g>
            )}

            {/* Comparison Results */}
            {method >= 2 && (
              <g className="animate-lesson-fade-in">
                <rect x="50" y="185" width="400" height="10" fill="#F5F5F5" stroke="#DDD" strokeWidth="1" />
                <text x="250" y="178" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
                  {language === 'en' ? 'Drilling: 25% better germination, easier weeding' :
                   language === 'hi' ? 'ड्रिलिंग: 25% बेहतर अंकुरण, आसान निराई' :
                   'ଡ୍ରିଲିଂ: 25% ଉତ୍ତମ ଅଙ୍କୁରଣ, ସହଜ ତୃଣ ନାଶ'}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    );
  }

  function FertilizerManagementAnimation() {
    const [nutrientStep, setNutrientStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startAnimation = () => {
      setIsPlaying(true);
      setNutrientStep(0);
      const interval = setInterval(() => {
        setNutrientStep(prev => {
          if (prev >= 3) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2500);
    };

    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="text-center mb-4">
          <h4 className="text-lg font-bold text-purple-800 mb-2">
            {language === 'en' ? 'Plant Nutrient Management' : 
             language === 'hi' ? 'पौधे पोषक तत्व प्रबंधन' :
             'ଉଦ୍ଭିଦ ପୋଷକ ତତ୍ତ୍ୱ ପରିଚାଳନା'}
          </h4>
          <Button onClick={startAnimation} disabled={isPlaying} className="mb-4">
            <Play className="h-4 w-4 mr-2" />
            {t.watchAnimation}
          </Button>
        </div>

        <div className="relative h-64 bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <svg viewBox="0 0 500 200" className="w-full h-full">
            {/* Plant */}
            <g className={nutrientStep >= 0 ? 'animate-lesson-fade-in' : 'opacity-0'}>
              {/* Roots */}
              <path d="M250 120 Q240 140 230 160 M250 120 Q260 140 270 160 M250 120 Q250 145 245 170 M250 120 Q250 145 255 170" 
                    stroke="#8B4513" strokeWidth="3" fill="none" />
              
              {/* Stem */}
              <line x1="250" y1="120" x2="250" y2="80" stroke="#228B22" strokeWidth="6" />
              
              {/* Leaves */}
              <ellipse cx="235" cy="90" rx="15" ry="8" fill="#90EE90" />
              <ellipse cx="265" cy="95" rx="15" ry="8" fill="#90EE90" />
              <ellipse cx="240" cy="70" rx="12" ry="6" fill="#90EE90" />
              <ellipse cx="260" cy="75" rx="12" ry="6" fill="#90EE90" />
            </g>

            {/* Nutrient Symbols and Effects */}
            {/* Nitrogen - Leaf Growth */}
            {nutrientStep >= 1 && (
              <g className="animate-lesson-fade-in">
                <circle cx="150" cy="60" r="20" fill="#E6F3FF" stroke="#4169E1" strokeWidth="2" />
                <text x="150" y="65" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#4169E1">N</text>
                <text x="150" y="90" textAnchor="middle" fontSize="10" fill="#4169E1">
                  {language === 'en' ? 'Leaf Growth' : language === 'hi' ? 'पत्ती वृद्धि' : 'ପତ୍ର ବୃଦ୍ଧି'}
                </text>
                
                {/* Arrow to leaves */}
                <path d="M170 70 Q200 70 220 85" stroke="#4169E1" strokeWidth="2" fill="none" markerEnd="url(#arrowN)" />
              </g>
            )}

            {/* Phosphorus - Root Development */}
            {nutrientStep >= 2 && (
              <g className="animate-lesson-fade-in">
                <circle cx="150" cy="130" r="20" fill="#FFE6F3" stroke="#FF69B4" strokeWidth="2" />
                <text x="150" y="135" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF69B4">P</text>
                <text x="150" y="160" textAnchor="middle" fontSize="10" fill="#FF69B4">
                  {language === 'en' ? 'Root Growth' : language === 'hi' ? 'जड़ वृद्धि' : 'ମୂଳ ବୃଦ୍ଧି'}
                </text>
                
                {/* Arrow to roots */}
                <path d="M170 140 Q200 140 230 150" stroke="#FF69B4" strokeWidth="2" fill="none" markerEnd="url(#arrowP)" />
              </g>
            )}

            {/* Potassium - Disease Resistance */}
            {nutrientStep >= 3 && (
              <g className="animate-lesson-fade-in">
                <circle cx="350" cy="95" r="20" fill="#E6FFE6" stroke="#32CD32" strokeWidth="2" />
                <text x="350" y="100" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#32CD32">K</text>
                <text x="350" y="125" textAnchor="middle" fontSize="10" fill="#32CD32">
                  {language === 'en' ? 'Disease Resistance' : language === 'hi' ? 'रोग प्रतिरोध' : 'ରୋଗ ପ୍ରତିରୋଧ'}
                </text>
                
                {/* Shield around plant */}
                <circle cx="250" cy="95" r="40" fill="none" stroke="#32CD32" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />
                <text x="250" y="50" textAnchor="middle" fontSize="10" fill="#32CD32">
                  {language === 'en' ? 'Protected Plant' : language === 'hi' ? 'संरक्षित पौधा' : 'ସୁରକ୍ଷିତ ଉଦ୍ଭିଦ'}
                </text>
              </g>
            )}

            {/* Soil base */}
            <rect x="0" y="180" width="500" height="20" fill="#8B4513" />

            {/* Arrow markers */}
            <defs>
              <marker id="arrowN" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#4169E1" />
              </marker>
              <marker id="arrowP" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#FF69B4" />
              </marker>
            </defs>
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
      totalXP: prev.totalXP + 200
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
        practiceScore: prev.practiceScore + 20,
        totalXP: prev.totalXP + 40
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={onBack} className="bg-white/80">
            ← Back to Bio-Research Lab
          </Button>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              XP: {studentProgress.totalXP}
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              Concepts: {studentProgress.conceptsUnderstood}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Wheat className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-3xl text-gray-800 mb-2">{t.title}</CardTitle>
            <p className="text-lg text-green-700">{t.subtitle}</p>
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
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-3">
                      <BookOpen className="h-6 w-6" />
                      {lessonContent[currentLesson].title}
                    </h3>
                    <p className="text-green-700 text-lg leading-relaxed mb-6">
                      {lessonContent[currentLesson].explanation}
                    </p>
                  </div>

                  {/* Visual Demo */}
                  {lessonContent[currentLesson].visualDemo}

                  {/* Examples Section */}
                  <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                    <h4 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      {language === 'en' ? 'Practical Example' : language === 'hi' ? 'व्यावहारिक उदाहरण' : 'ବ୍ୟବହାରିକ ଉଦାହରଣ'}
                    </h4>
                    
                    {lessonContent[currentLesson].examples.map((example, index) => (
                      <div key={index} className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-amber-300">
                          <h5 className="font-bold text-gray-800 mb-2">
                            {language === 'en' ? 'Problem:' : language === 'hi' ? 'समस्या:' : 'ସମସ୍ୟା:'} {example.problem}
                          </h5>
                          <p className="text-green-700 font-bold text-lg">
                            {language === 'en' ? 'Solution:' : language === 'hi' ? 'समाधान:' : 'ସମାଧାନ:'} {example.solution}
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
                            <div className="bg-white rounded-lg p-4 border-2 border-green-300 space-y-2">
                              {example.steps.map((step, stepIndex) => (
                                <div 
                                  key={stepIndex} 
                                  className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 animate-lesson-fade-in"
                                  style={{ animationDelay: `${stepIndex * 200}ms` }}
                                >
                                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {stepIndex + 1}
                                  </div>
                                  <p className="text-green-800">{step}</p>
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
                              ? 'bg-green-500' 
                              : index < currentLesson 
                              ? 'bg-emerald-500' 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => setCurrentLesson(Math.min(lessonContent.length - 1, currentLesson + 1))}
                      disabled={currentLesson === lessonContent.length - 1}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      {t.nextConcept} →
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="interactive" className="space-y-6">
                {/* Interactive Demo Section */}
                <div className="text-center space-y-6">
                  <h3 className="text-2xl font-bold text-emerald-800">
                    {language === 'en' ? 'Interactive Crop Production Lab' : 
                     language === 'hi' ? 'इंटरैक्टिव फसल उत्पादन प्रयोगशाला' :
                     'ଇଣ୍ଟରାକ୍ଟିଭ ଫସଲ ଉତ୍ପାଦନ ଲାବୋରେଟରୀ'}
                  </h3>
                  
                  {/* Current lesson's visual demo with enhanced interactivity */}
                  {lessonContent[currentLesson].visualDemo}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                      <CardContent className="p-6 text-center">
                        <Sprout className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-amber-800 mb-2">
                          {language === 'en' ? 'Soil Lab' : language === 'hi' ? 'मिट्टी प्रयोगशाला' : 'ମାଟି ଲାବୋରେଟରୀ'}
                        </h4>
                        <p className="text-amber-700 text-sm">
                          {language === 'en' ? 'Test soil properties and preparation methods' :
                           language === 'hi' ? 'मिट्टी के गुणों और तैयारी के तरीक��ं का परीक्षण करें' :
                           'ମାଟି ଗୁଣ ଏବଂ ପ୍ରସ୍ତୁତି ପଦ୍ଧତି ପରୀକ୍ଷା କରନ୍ତୁ'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                      <CardContent className="p-6 text-center">
                        <Sprout className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-green-800 mb-2">
                          {language === 'en' ? 'Seed Station' : language === 'hi' ? 'बीज स्टेशन' : 'ବିହନ ଷ୍ଟେସନ'}
                        </h4>
                        <p className="text-green-700 text-sm">
                          {language === 'en' ? 'Practice different sowing methods and techniques' :
                           language === 'hi' ? 'विभिन्न बुआई विधियों और तकनीकों का अभ्यास करें' :
                           'ବିଭିନ୍ନ ବିହନ ବୁଣିବା ପଦ୍ଧତି ଏବଂ କୌଶଳ ଅଭ୍ୟାସ କରନ୍ତୁ'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
                      <CardContent className="p-6 text-center">
                        <Beaker className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-purple-800 mb-2">
                          {language === 'en' ? 'Nutrient Mixer' : language === 'hi' ? 'पोषक तत्व मिक्सर' : 'ପୋଷକ ତତ୍ତ୍ୱ ମିକ୍ସର'}
                        </h4>
                        <p className="text-purple-700 text-sm">
                          {language === 'en' ? 'Create optimal fertilizer combinations for crops' :
                           language === 'hi' ? 'फसलों के लिए इष्टतम उर्वरक संयोजन बनाएं' :
                           'ଫସଲ ପାଇଁ ଉତ୍କୃଷ୍ଟ ସାର ମିଶ୍ରଣ ତିଆରି କରନ୍ତୁ'}
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
                      {language === 'en' ? 'Apply crop production knowledge to real farming scenarios' :
                       language === 'hi' ? 'वास्तविक खेती परिदृश्यों में फसल उत्पादन ज्ञान लागू करें' :
                       'ପ୍ରକୃତ କୃଷି ପରିସ୍ଥିତିରେ ଫସଲ ଉତ୍ପାଦନ ଜ୍ଞାନ ପ୍ରୟୋଗ କରନ୍ତୁ'}
                    </p>
                  </div>

                  {currentProblem < lessonContent[currentLesson].practiceProblems.length && (
                    <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl text-emerald-800">
                            {language === 'en' ? `Problem ${currentProblem + 1}` : 
                             language === 'hi' ? `समस्या ${currentProblem + 1}` :
                             `ସମସ୍ୟା ${currentProblem + 1}`}
                          </CardTitle>
                          <Badge className="bg-green-100 text-green-800">
                            {currentProblem + 1} / {lessonContent[currentLesson].practiceProblems.length}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                          <p className="text-lg text-gray-800 leading-relaxed">
                            {lessonContent[currentLesson].practiceProblems[currentProblem].question}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {lessonContent[currentLesson].practiceProblems[currentProblem].options.map((option, index) => (
                            <Button
                              key={index}
                              onClick={() => !showFeedback && handlePracticeAnswer(option)}
                              disabled={showFeedback}
                              className={`p-6 text-base font-medium rounded-xl border-2 transition-all duration-300 text-left ${
                                selectedAnswer === option
                                  ? isCorrect
                                    ? 'bg-green-100 border-green-400 text-green-800'
                                    : 'bg-red-100 border-red-400 text-red-800'
                                  : 'bg-white border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 text-gray-800'
                              } ${showFeedback && option === lessonContent[currentLesson].practiceProblems[currentProblem].answer ? 'bg-green-100 border-green-400 text-green-800' : ''}`}
                            >
                              <div className="flex items-center justify-between">
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