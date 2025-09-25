import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Cog, 
  Plus,
  Minus,
  X,
  Award,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import type { Language } from '../../../types/onboarding';

interface GearTrainConstructorGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

interface PolynomialGear {
  id: string;
  term: string;
  coefficient: number;
  power: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  isFactored: boolean;
}

interface GearConnection {
  from: string;
  to: string;
  strength: number;
}

export function GearTrainConstructorGame({ language, onBack, onComplete }: GearTrainConstructorGameProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [cogwheelFragments, setCogwheelFragments] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedGear, setSelectedGear] = useState<string | null>(null);

  // Polynomial levels to factor
  const polynomialLevels = [
    {
      polynomial: "x² - 4",
      factored: "(x - 2)(x + 2)",
      description: "Difference of squares pattern",
      difficulty: "Beginner",
      gears: [
        { id: 'x2', term: 'x²', coefficient: 1, power: 2, x: 200, y: 150, size: 60, color: '#3b82f6', rotation: 0, isFactored: false },
        { id: 'const', term: '-4', coefficient: -4, power: 0, x: 350, y: 150, size: 40, color: '#ef4444', rotation: 0, isFactored: false }
      ]
    },
    {
      polynomial: "x² + 5x + 6",
      factored: "(x + 2)(x + 3)",
      description: "Quadratic trinomial factoring",
      difficulty: "Intermediate",
      gears: [
        { id: 'x2', term: 'x²', coefficient: 1, power: 2, x: 150, y: 150, size: 60, color: '#3b82f6', rotation: 0, isFactored: false },
        { id: 'x', term: '5x', coefficient: 5, power: 1, x: 275, y: 150, size: 50, color: '#10b981', rotation: 0, isFactored: false },
        { id: 'const', term: '+6', coefficient: 6, power: 0, x: 400, y: 150, size: 40, color: '#f59e0b', rotation: 0, isFactored: false }
      ]
    },
    {
      polynomial: "2x³ - 8x",
      factored: "2x(x - 2)(x + 2)",
      description: "Common factor and difference of squares",
      difficulty: "Advanced",
      gears: [
        { id: 'x3', term: '2x³', coefficient: 2, power: 3, x: 150, y: 150, size: 70, color: '#8b5cf6', rotation: 0, isFactored: false },
        { id: 'x', term: '-8x', coefficient: -8, power: 1, x: 350, y: 150, size: 50, color: '#ef4444', rotation: 0, isFactored: false }
      ]
    }
  ];

  const [currentLevelData, setCurrentLevelData] = useState(polynomialLevels[0]);
  const [gears, setGears] = useState<PolynomialGear[]>(currentLevelData.gears);
  const [connections, setConnections] = useState<GearConnection[]>([]);
  const [factorSteps, setFactorSteps] = useState<string[]>([]);

  const explanations = {
    en: {
      title: "The Gear-Train Constructor",
      description: "Master engineer! Complex polynomial gear systems are inefficient and prone to failure. Your task is to factor them into simpler, interconnected gear systems that work in harmony.",
      instructions: "Analyze the polynomial gear system and break it down into its factors. Each factor becomes a more efficient gear subsystem!",
      factoring: "Factoring Techniques",
      gcf: "Greatest Common Factor: Look for terms that share common factors",
      dos: "Difference of Squares: a² - b² = (a-b)(a+b)",
      trinomial: "Trinomial Factoring: Find factors that multiply to give the original",
      startAnalysis: "Begin Analysis!"
    },
    hi: {
      title: "गियर-ट्रेन निर्माता",
      description: "मुख्य इंजीनियर! जटिल बहुपद गियर सिस्टम अकुशल और विफलता के लिए प्रवण हैं।",
      instructions: "बहुपद गियर सिस्टम का विश्लेषण करें और इसे इसके कारकों में तोड़ें।",
      factoring: "गुणनखंडन तकनीकें",
      gcf: "महत्तम समापवर्तक: सामान्य कारकों को साझा करने वाले पदों की तलाश करें",
      dos: "वर्गों का अंतर: a² - b² = (a-b)(a+b)",
      trinomial: "त्रिपद गुणनखंडन: ऐसे कारक खोजें जो मूल देने के लिए गुणा करते हैं",
      startAnalysis: "विश्लेषण शुरू करें!"
    },
    or: {
      title: "ଗିଅର-ଟ୍ରେନ ନିର୍ମାତା",
      description: "ମୁଖ୍ୟ ଇଞ୍ଜିନିୟର! ଜଟିଳ ବହୁପଦ ଗିଅର ସିଷ୍ଟମ ଅପାରଦର୍ଶୀ ଏବଂ ବିଫଳତା ପାଇଁ ପ୍ରବଣ।",
      instructions: "ବହୁପଦ ଗିଅର ସିଷ୍ଟମର ବିଶ୍ଳେଷଣ କରନ୍ତୁ ଏବଂ ଏହାକୁ ଏହାର କାରକମାନଙ୍କରେ ଭାଙ୍ଗନ୍ତୁ।",
      factoring: "ଗୁଣନଖଣ୍ଡନ କୌଶଳ",
      gcf: "ସର୍ବାଧିକ ସାଧାରଣ କାରକ: ସାଧାରଣ କାରକ ଅଂଶୀଦାର କରୁଥିବା ପଦଗୁଡ଼ିକ ଖୋଜନ୍ତୁ",
      dos: "ବର୍ଗର ପାର୍ଥକ୍ୟ: a² - b² = (a-b)(a+b)",
      trinomial: "ତ୍ରିପଦ ଗୁଣନଖଣ୍ଡନ: ମୂଳ ଦେବା ପାଇଁ ଗୁଣନ କରୁଥିବା କାରକ ଖୋଜନ୍ତୁ",
      startAnalysis: "ବିଶ୍ଳେଷଣ ଆରମ୍ଭ କର!"
    }
  };

  const currentText = explanations[language];

  const analyzePolynomial = (polynomial: string) => {
    const steps = [];
    
    // Check for common factors
    if (polynomial.includes('2x³') && polynomial.includes('-8x')) {
      steps.push("Step 1: Factor out common factor 2x");
      steps.push("2x³ - 8x = 2x(x² - 4)");
      steps.push("Step 2: Recognize x² - 4 as difference of squares");
      steps.push("x² - 4 = (x - 2)(x + 2)");
      steps.push("Final: 2x(x - 2)(x + 2)");
    } else if (polynomial.includes('x²') && polynomial.includes('- 4')) {
      steps.push("Step 1: Recognize as difference of squares");
      steps.push("x² - 4 = x² - 2²");
      steps.push("Step 2: Apply formula a² - b² = (a-b)(a+b)");
      steps.push("Final: (x - 2)(x + 2)");
    } else if (polynomial.includes('x²') && polynomial.includes('5x') && polynomial.includes('+ 6')) {
      steps.push("Step 1: Find factors of 6 that add to 5");
      steps.push("Factors: 2 and 3 (2 × 3 = 6, 2 + 3 = 5)");
      steps.push("Step 2: Write as product of binomials");
      steps.push("Final: (x + 2)(x + 3)");
    }
    
    setFactorSteps(steps);
  };

  const simulateGearSystem = () => {
    setIsSimulating(true);
    
    // Animate gears rotating
    const interval = setInterval(() => {
      setGears(prev => prev.map(gear => ({
        ...gear,
        rotation: gear.rotation + (gear.power * 2) // Higher powers rotate slower/faster
      })));
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setIsSimulating(false);
      
      // Mark as completed and show factored form
      setGears(prev => prev.map(gear => ({ ...gear, isFactored: true })));
      setScore(prev => prev + 300);
      setCogwheelFragments(prev => prev + 20);
      
      setTimeout(() => {
        if (currentLevel < polynomialLevels.length - 1) {
          setCurrentLevel(prev => prev + 1);
          loadLevel(currentLevel + 1);
        } else {
          onComplete(score + 300, cogwheelFragments + 20);
        }
      }, 2000);
    }, 3000);
  };

  const loadLevel = (levelIndex: number) => {
    const levelData = polynomialLevels[levelIndex];
    setCurrentLevelData(levelData);
    setGears(levelData.gears);
    setConnections([]);
    setFactorSteps([]);
    analyzePolynomial(levelData.polynomial);
  };

  const resetLevel = () => {
    loadLevel(currentLevel);
    setScore(0);
    setCogwheelFragments(0);
  };

  useEffect(() => {
    analyzePolynomial(currentLevelData.polynomial);
  }, [currentLevelData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Steampunk Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><pattern id="mechanical" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="15" fill="none" stroke="%23d97706" stroke-width="2"/><path d="M25 10L30 20L25 30L20 20Z" fill="%23b45309"/></pattern></defs><rect width="200" height="200" fill="url(%23mechanical)" opacity="0.4"/></svg>')`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Header */}
      <header className="brass-frame border-b-4 border-amber-800/50 bg-gradient-to-r from-amber-100/95 via-orange-100/95 to-red-100/95 backdrop-blur-lg relative z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack} className="brass-button">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                {language === 'en' ? 'Back to Guild' : language === 'hi' ? 'गिल्ड में वापस' : 'ଗିଲ୍ଡକୁ ଫେରନ୍ତୁ'}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-amber-900 copper-text-shadow">
                  {currentText.title}
                </h1>
                <p className="text-amber-700">
                  {language === 'en' ? 'Level' : language === 'hi' ? 'स्तर' : 'ସ୍ତର'} {currentLevel + 1} • {currentLevelData.difficulty}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="brass-gauge flex items-center space-x-2 bg-gradient-to-r from-amber-200/80 to-yellow-200/80 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-amber-600/40">
                <Cog className="h-5 w-5 text-amber-700 animate-clockwork-spin" />
                <span className="text-amber-800 font-bold">{cogwheelFragments} CF</span>
              </div>
              <div className="brass-gauge flex items-center space-x-2 bg-gradient-to-r from-green-200/80 to-emerald-200/80 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-green-600/40">
                <Award className="h-5 w-5 text-green-700" />
                <span className="text-green-800 font-bold">{score}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="relative z-10 p-6">
        {showExplanation && (
          <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-900">
                <Lightbulb className="h-6 w-6 mr-3 animate-flame-flicker" />
                {language === 'en' ? 'Engineering Manual' : language === 'hi' ? 'इंजीनियरिंग मैनुअल' : 'ଇଞ୍ଜିନିୟରିଂ ମାନୁଆଲ'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800 mb-4">{currentText.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-blue-100/60 rounded-lg border border-blue-300/40">
                  <h4 className="font-bold text-blue-800 mb-2">{currentText.gcf}</h4>
                  <p className="text-blue-700 text-sm">2x³ - 8x = 2x(x² - 4)</p>
                </div>
                <div className="p-3 bg-green-100/60 rounded-lg border border-green-300/40">
                  <h4 className="font-bold text-green-800 mb-2">{currentText.dos}</h4>
                  <p className="text-green-700 text-sm">x² - 4 = (x-2)(x+2)</p>
                </div>
                <div className="p-3 bg-purple-100/60 rounded-lg border border-purple-300/40">
                  <h4 className="font-bold text-purple-800 mb-2">{currentText.trinomial}</h4>
                  <p className="text-purple-700 text-sm">x² + 5x + 6 = (x+2)(x+3)</p>
                </div>
              </div>
              
              <p className="text-amber-700 font-medium mb-4">{currentText.instructions}</p>
              <Button 
                onClick={() => setShowExplanation(false)}
                className="brass-button bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              >
                <Calculator className="h-4 w-4 mr-2" />
                {currentText.startAnalysis}
              </Button>
            </CardContent>
          </Card>
        )}

        {!showExplanation && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Analysis Panel */}
            <div className="xl:col-span-1">
              <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30 mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-900">
                    <Calculator className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Polynomial Analysis' : language === 'hi' ? 'बहुपद विश्लेषण' : 'ବହୁପଦ ବିଶ୍ଳେଷଣ'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-100/80 rounded-lg border border-slate-300/40">
                      <h4 className="font-bold text-slate-800 mb-2">
                        {language === 'en' ? 'Original Polynomial:' : language === 'hi' ? 'मूल बहुपद:' : 'ମୂଳ ବହୁପଦ:'}
                      </h4>
                      <div className="text-2xl font-mono text-blue-800">{currentLevelData.polynomial}</div>
                    </div>
                    
                    <div className="p-4 bg-green-100/80 rounded-lg border border-green-300/40">
                      <h4 className="font-bold text-green-800 mb-2">
                        {language === 'en' ? 'Factored Form:' : language === 'hi' ? 'गुणनखंडित रूप:' : 'ଗୁଣନଖଣ୍ଡିତ ରୂପ:'}
                      </h4>
                      <div className="text-xl font-mono text-green-800">{currentLevelData.factored}</div>
                    </div>

                    <div className="p-4 bg-orange-100/80 rounded-lg border border-orange-300/40">
                      <h4 className="font-bold text-orange-800 mb-2">
                        {language === 'en' ? 'Difficulty:' : language === 'hi' ? 'कठिनाई:' : 'କଠିନତା:'}
                      </h4>
                      <Badge className={`${
                        currentLevelData.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-700' :
                        currentLevelData.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-700' :
                        'bg-red-500/20 text-red-700'
                      }`}>
                        {currentLevelData.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step-by-Step Analysis */}
              <Card className="brass-frame bg-gradient-to-br from-blue-50/95 to-cyan-50/95 backdrop-blur-md border-4 border-blue-700/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-900">
                    <Settings className="h-5 w-5 mr-2 animate-clockwork-spin" />
                    {language === 'en' ? 'Factoring Steps' : language === 'hi' ? 'गुणनखंडन चरण' : 'ଗୁଣନଖଣ୍ଡନ ପଦକ୍ଷେପ'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {factorSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-100/60 rounded-lg">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="text-blue-800 text-sm font-mono">{step}</div>
                      </div>
                    ))}
                  </div>
                  
                  {factorSteps.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <Button
                        onClick={simulateGearSystem}
                        disabled={isSimulating}
                        className="w-full brass-button bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      >
                        {isSimulating ? (
                          <>
                            <Cog className="h-4 w-4 mr-2 animate-spin" />
                            {language === 'en' ? 'Optimizing...' : language === 'hi' ? 'अनुकूलन...' : 'ଅନୁକୂଳିତ...'}
                          </>
                        ) : (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            {language === 'en' ? 'Optimize Gear System' : language === 'hi' ? 'गियर सिस्टम अनुकूलित करें' : 'ଗିଅର ସିଷ୍ଟମ ଅନୁକୂଳ କର'}
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={resetLevel}
                        variant="outline"
                        className="w-full brass-button"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {language === 'en' ? 'Reset Analysis' : language === 'hi' ? 'विश्लेषण रीसेट करें' : 'ବିଶ୍ଳେଷଣ ରିସେଟ କର'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Gear System Visualization */}
            <div className="xl:col-span-2">
              <Card className="brass-frame bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border-4 border-amber-700/30">
                <CardHeader className="border-b-2 border-amber-600/30">
                  <CardTitle className="flex items-center justify-between text-amber-200">
                    <div className="flex items-center">
                      <Cog className="h-6 w-6 mr-3 animate-clockwork-spin" />
                      {language === 'en' ? 'Polynomial Gear System' : language === 'hi' ? 'बहुपद गियर सिस्टम' : 'ବହୁପଦ ଗିଅର ସିଷ୍ଟମ'}
                    </div>
                    {gears.every(g => g.isFactored) && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30 animate-pulse">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'Optimized!' : language === 'hi' ? 'अनुकूलित!' : 'ଅନୁକୂଳିତ!'}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="relative w-full h-96 brass-frame bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl border-2 border-amber-600/20 overflow-hidden">
                    {/* Gear System Background */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
                      {/* Mechanical Framework */}
                      <rect x="50" y="50" width="500" height="300" fill="none" stroke="#d97706" strokeWidth="3" rx="15"/>
                      <rect x="70" y="70" width="460" height="260" fill="rgba(245, 158, 11, 0.1)" stroke="#f59e0b" strokeWidth="2" rx="10"/>
                      
                      {/* Power Input/Output */}
                      <circle cx="100" cy="200" r="20" fill="#ef4444" stroke="#dc2626" strokeWidth="3"/>
                      <text x="100" y="206" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">IN</text>
                      
                      <circle cx="500" cy="200" r="20" fill="#10b981" stroke="#059669" strokeWidth="3"/>
                      <text x="500" y="206" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">OUT</text>
                      
                      {/* Connection Lines */}
                      <line x1="120" y1="200" x2="180" y2="200" stroke="#f59e0b" strokeWidth="4" strokeDasharray="5,5"/>
                      <line x1="420" y1="200" x2="480" y2="200" stroke="#f59e0b" strokeWidth="4" strokeDasharray="5,5"/>
                    </svg>

                    {/* Polynomial Gears */}
                    {gears.map((gear) => (
                      <div
                        key={gear.id}
                        className={`absolute flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 hover:scale-110 ${
                          gear.isFactored ? 'animate-gear-glow' : 'animate-gear-turn'
                        }`}
                        style={{
                          left: `${gear.x}px`,
                          top: `${gear.y}px`,
                          width: `${gear.size}px`,
                          height: `${gear.size}px`,
                          backgroundColor: gear.color,
                          borderRadius: '50%',
                          border: `4px solid ${gear.color}dd`,
                          transform: `translate(-50%, -50%) rotate(${gear.rotation}deg)`,
                          boxShadow: gear.isFactored ? `0 0 20px ${gear.color}80` : 'none'
                        }}
                        onClick={() => setSelectedGear(gear.id)}
                      >
                        <span className="text-sm pointer-events-none">{gear.term}</span>
                        
                        {/* Gear Teeth */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-2 h-1 bg-current"
                              style={{
                                left: '50%',
                                top: '-2px',
                                transformOrigin: '50% 50%',
                                transform: `translateX(-50%) rotate(${i * 45}deg) translateY(${gear.size/2}px)`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Efficiency Indicator */}
                    <div className="absolute bottom-4 left-4 p-3 bg-slate-800/80 rounded-lg border border-amber-600/30">
                      <div className="text-amber-200 text-sm font-bold mb-1">
                        {language === 'en' ? 'System Efficiency:' : language === 'hi' ? 'सिस्टम दक्षता:' : 'ସିଷ୍ଟମ ଦକ୍ଷତା:'}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              gears.every(g => g.isFactored) ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: gears.every(g => g.isFactored) ? '100%' : '30%' }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${
                          gears.every(g => g.isFactored) ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {gears.every(g => g.isFactored) ? '100%' : '30%'}
                        </span>
                      </div>
                    </div>

                    {/* Steam Effects when optimized */}
                    {gears.every(g => g.isFactored) && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute steam-wisp animate-steam-rise"
                            style={{
                              left: `${-20 + i * 10}px`,
                              animationDelay: `${i * 0.2}s`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Gear Information */}
                  {selectedGear && (
                    <div className="mt-4 p-4 bg-amber-100/80 rounded-lg border border-amber-300/40">
                      {(() => {
                        const gear = gears.find(g => g.id === selectedGear);
                        return gear ? (
                          <div>
                            <h4 className="font-bold text-amber-800 mb-2">
                              {language === 'en' ? 'Gear Analysis:' : language === 'hi' ? 'गियर विश्लेषण:' : 'ଗିଅର ବିଶ୍ଳେଷଣ:'} {gear.term}
                            </h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-amber-700">
                                  {language === 'en' ? 'Coefficient:' : language === 'hi' ? 'गुणांक:' : 'ଗୁଣାଙ୍କ:'}
                                </span>
                                <div className="font-bold text-amber-900">{gear.coefficient}</div>
                              </div>
                              <div>
                                <span className="text-amber-700">
                                  {language === 'en' ? 'Power:' : language === 'hi' ? 'घात:' : 'ଶକ୍ତି:'}
                                </span>
                                <div className="font-bold text-amber-900">{gear.power}</div>
                              </div>
                              <div>
                                <span className="text-amber-700">
                                  {language === 'en' ? 'Status:' : language === 'hi' ? 'स्थिति:' : 'ସ୍ଥିତି:'}
                                </span>
                                <div className={`font-bold ${gear.isFactored ? 'text-green-700' : 'text-red-700'}`}>
                                  {gear.isFactored ? 
                                    (language === 'en' ? 'Optimized' : language === 'hi' ? 'अनुकूलित' : 'ଅନୁକୂଳିତ') :
                                    (language === 'en' ? 'Complex' : language === 'hi' ? 'जटिल' : 'ଜଟିଳ')
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}