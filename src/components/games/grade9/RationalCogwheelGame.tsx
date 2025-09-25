import React, { useState, useEffect, useRef } from 'react';
import { 
  Cog, 
  Settings, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  Lightbulb,
  Award,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import type { Language } from '../../../types/onboarding';

interface RationalCogwheelGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

interface NumberGear {
  id: string;
  value: string;
  type: 'rational' | 'irrational';
  x: number;
  y: number;
  rotation: number;
  size: 'small' | 'medium' | 'large';
  isPlaced: boolean;
  correctSlot?: string;
}

interface GearSlot {
  id: string;
  type: 'rational' | 'irrational';
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  occupied: boolean;
  gear?: NumberGear;
}

export function RationalCogwheelGame({ language, onBack, onComplete }: RationalCogwheelGameProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [cogwheelFragments, setCogwheelFragments] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [draggedGear, setDraggedGear] = useState<NumberGear | null>(null);
  const [machineRunning, setMachineRunning] = useState(false);
  const machineIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Level 1: Basic rational vs irrational identification
  const [gears, setGears] = useState<NumberGear[]>([
    { id: '1', value: '1/2', type: 'rational', x: 100, y: 200, rotation: 0, size: 'medium', isPlaced: false, correctSlot: 'r1' },
    { id: '2', value: '√2', type: 'irrational', x: 200, y: 200, rotation: 45, size: 'medium', isPlaced: false, correctSlot: 'i1' },
    { id: '3', value: '3.14...', type: 'irrational', x: 300, y: 200, rotation: 90, size: 'small', isPlaced: false, correctSlot: 'i2' },
    { id: '4', value: '0.75', type: 'rational', x: 400, y: 200, rotation: 180, size: 'large', isPlaced: false, correctSlot: 'r2' },
    { id: '5', value: '√9', type: 'rational', x: 500, y: 200, rotation: 270, size: 'medium', isPlaced: false, correctSlot: 'r3' },
    { id: '6', value: 'e', type: 'irrational', x: 600, y: 200, rotation: 135, size: 'small', isPlaced: false, correctSlot: 'i3' }
  ]);

  const [slots, setSlots] = useState<GearSlot[]>([
    // Rational number slots (left side of machine)
    { id: 'r1', type: 'rational', x: 150, y: 400, size: 'medium', occupied: false },
    { id: 'r2', type: 'rational', x: 250, y: 450, size: 'large', occupied: false },
    { id: 'r3', type: 'rational', x: 200, y: 500, size: 'medium', occupied: false },
    // Irrational number slots (right side of machine)
    { id: 'i1', type: 'irrational', x: 550, y: 400, size: 'medium', occupied: false },
    { id: 'i2', type: 'irrational', x: 650, y: 450, size: 'small', occupied: false },
    { id: 'i3', type: 'irrational', x: 600, y: 500, size: 'small', occupied: false }
  ]);

  const explanations = {
    en: {
      title: "The Rational Cogwheel Machine",
      description: "Master artisan! This ancient machine sorts numbers by their true nature. Rational numbers can be expressed as fractions, while irrational numbers cannot.",
      objective: "Place each number gear in the correct mechanism slot. The machine will only work when all gears are properly aligned!",
      rational: "Rational Numbers: Can be written as fractions (a/b where b≠0)",
      irrational: "Irrational Numbers: Cannot be written as fractions, have infinite non-repeating decimals"
    },
    hi: {
      title: "तर्कसंगत चक्र यंत्र",
      description: "मुख्य शिल्पकार! यह प्राचीन मशीन संख्याओं को उनकी वास्तविक प्रकृति के अनुसार छांटती है।",
      objective: "प्रत्येक संख्या गियर को सही स्लॉट में रखें। मशीन तभी काम करेगी जब सभी गियर सही तरीके से व्यवस्थित हों!",
      rational: "परिमेय संख्याएं: भिन्न के रूप में लिखी जा सकती हैं",
      irrational: "अपरिमेय संख्याएं: भिन्न के रूप में नहीं लिखी जा सकतीं"
    },
    or: {
      title: "ତର୍କସଙ୍ଗତ ଚକ୍ର ଯନ୍ତ୍ର",
      description: "ମୁଖ୍୙ ଶିଳ୍ପୀ! ଏହି ପ୍ରାଚୀନ ଯନ୍ତ୍ର ସଂଖ୍ୟାଗୁଡ଼ିକୁ ସେମାନଙ୍କର ପ୍ରକୃତ ପ୍ରକୃତି ଅନୁଯାୟୀ ସଜାଏ।",
      objective: "ପ୍ରତ୍ୟେକ ସଂଖ୍ୟା ଗିଅରକୁ ସଠିକ ସ୍ଲଟରେ ରଖନ୍ତୁ।",
      rational: "ପରିମେୟ ସଂଖ୍ୟା: ଭଗ୍ନାଂଶ ରୂପେ ଲେଖାଯାଇପାରେ",
      irrational: "ଅପରିମେୟ ସଂଖ୍ୟା: ଭଗ୍ନାଂଶ ରୂପେ ଲେଖାଯାଇପାରିବ ନାହିଁ"
    }
  };

  const currentText = explanations[language];

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'w-12 h-12 text-xs';
      case 'medium': return 'w-16 h-16 text-sm';
      case 'large': return 'w-20 h-20 text-base';
      default: return 'w-16 h-16 text-sm';
    }
  };

  const getSlotSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'w-14 h-14';
      case 'medium': return 'w-18 h-18';
      case 'large': return 'w-22 h-22';
      default: return 'w-18 h-18';
    }
  };

  const handleDragStart = (gear: NumberGear) => {
    if (!gear.isPlaced) {
      setDraggedGear(gear);
    }
  };

  const handleDrop = (slot: GearSlot) => {
    if (draggedGear && !slot.occupied) {
      const isCorrectPlacement = draggedGear.correctSlot === slot.id;
      
      if (isCorrectPlacement) {
        // Correct placement
        setGears(prev => prev.map(g => 
          g.id === draggedGear.id 
            ? { ...g, isPlaced: true, x: slot.x, y: slot.y }
            : g
        ));
        
        setSlots(prev => prev.map(s => 
          s.id === slot.id 
            ? { ...s, occupied: true, gear: draggedGear }
            : s
        ));

        setScore(prev => prev + 100);
        setCogwheelFragments(prev => prev + 10);
        
        // Check if level complete
        const updatedGears = gears.map(g => 
          g.id === draggedGear.id ? { ...g, isPlaced: true } : g
        );
        
        if (updatedGears.every(g => g.isPlaced)) {
          setTimeout(() => {
            setMachineRunning(true);
            startMachineAnimation();
          }, 500);
        }
      } else {
        // Wrong placement - show error animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);
      }
      
      setDraggedGear(null);
    }
  };

  const startMachineAnimation = () => {
    machineIntervalRef.current = setInterval(() => {
      setGears(prev => prev.map(gear => ({
        ...gear,
        rotation: gear.rotation + (gear.type === 'rational' ? 5 : -5)
      })));
    }, 50);

    setTimeout(() => {
      if (machineIntervalRef.current) {
        clearInterval(machineIntervalRef.current);
      }
      setMachineRunning(false);
      
      // Level complete
      setTimeout(() => {
        onComplete(score + 500, cogwheelFragments + 50);
      }, 1000);
    }, 3000);
  };

  const resetLevel = () => {
    setGears(prev => prev.map(gear => ({
      ...gear,
      isPlaced: false,
      x: gear.id === '1' ? 100 : gear.id === '2' ? 200 : gear.id === '3' ? 300 : gear.id === '4' ? 400 : gear.id === '5' ? 500 : 600,
      y: 200,
      rotation: 0
    })));
    
    setSlots(prev => prev.map(slot => ({
      ...slot,
      occupied: false,
      gear: undefined
    })));
    
    setScore(0);
    setCogwheelFragments(0);
    setMachineRunning(false);
    
    if (machineIntervalRef.current) {
      clearInterval(machineIntervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (machineIntervalRef.current) {
        clearInterval(machineIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Steampunk Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><pattern id="gears" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="20" fill="none" stroke="%23d97706" stroke-width="2"/><circle cx="75" cy="75" r="15" fill="none" stroke="%23b45309" stroke-width="2"/></pattern></defs><rect width="200" height="200" fill="url(%23gears)" opacity="0.3"/></svg>')`,
            backgroundSize: '200px 200px'
          }}
        />
      </div>

      {/* Floating Steam Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute steam-wisp animate-steam-rise"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: `${Math.random() * 30}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 6}s`
            }}
          />
        ))}
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
                  {language === 'en' ? 'Level' : language === 'hi' ? 'स्तर' : 'ସ୍ତର'} {currentLevel} • {language === 'en' ? 'Number Systems' : language === 'hi' ? 'संख्या प्रणाली' : 'ସଂଖ୍ୟା ପ୍ରଣାଳୀ'}
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
                {language === 'en' ? 'Master Artisan\'s Guide' : language === 'hi' ? 'मुख्य शिल्पकार मार्गदर्शिका' : 'ମୁଖ୍ୟ ଶିଳ୍ପୀ ଗାଇଡ'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800 mb-4">{currentText.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-blue-100/60 rounded-lg border border-blue-300/40">
                  <h4 className="font-bold text-blue-800 mb-2">{currentText.rational}</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-500/20 text-blue-700">1/2</Badge>
                    <Badge className="bg-blue-500/20 text-blue-700">0.75</Badge>
                    <Badge className="bg-blue-500/20 text-blue-700">√9 = 3</Badge>
                  </div>
                </div>
                <div className="p-3 bg-red-100/60 rounded-lg border border-red-300/40">
                  <h4 className="font-bold text-red-800 mb-2">{currentText.irrational}</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-red-500/20 text-red-700">√2</Badge>
                    <Badge className="bg-red-500/20 text-red-700">π</Badge>
                    <Badge className="bg-red-500/20 text-red-700">e</Badge>
                  </div>
                </div>
              </div>
              <p className="text-amber-700 font-medium">{currentText.objective}</p>
              <Button 
                onClick={() => setShowExplanation(false)}
                className="mt-4 brass-button bg-gradient-to-r from-green-500 to-emerald-500 text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Start Crafting!' : language === 'hi' ? 'शिल्प शुरू करें!' : 'ଶିଳ୍ପ ଆରମ୍ଭ କର!'}
              </Button>
            </CardContent>
          </Card>
        )}

        {!showExplanation && (
          <div className="space-y-6">
            {/* Machine Interface */}
            <Card className="brass-frame bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border-4 border-amber-700/30 overflow-hidden">
              <CardHeader className="border-b-2 border-amber-600/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-amber-200 copper-text-shadow">
                    {language === 'en' ? 'The Great Sorting Machine' : language === 'hi' ? 'महान छंटाई मशीन' : 'ମହାନ ସର୍ଟିଂ ଯନ୍ତ୍ର'}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={resetLevel}
                      className="brass-button"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Reset' : language === 'hi' ? 'रीसेट' : 'ରିସେଟ'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setMachineRunning(!machineRunning)}
                      className={`brass-button ${machineRunning ? 'bg-red-500/20' : 'bg-green-500/20'}`}
                    >
                      {machineRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {machineRunning ? (language === 'en' ? 'Stop' : 'रोकें') : (language === 'en' ? 'Test' : 'परीक्षण')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="relative w-full h-96 brass-frame bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl border-2 border-amber-600/20 overflow-hidden">
                  {/* Machine Base */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
                    {/* Machine Frame */}
                    <rect x="50" y="300" width="700" height="80" fill="url(#machineGradient)" stroke="#d97706" strokeWidth="3" rx="10"/>
                    
                    {/* Rational Side (Left) */}
                    <rect x="80" y="250" width="200" height="50" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" rx="5"/>
                    <text x="180" y="280" textAnchor="middle" fill="#1e40af" fontSize="14" fontWeight="bold">
                      {language === 'en' ? 'RATIONAL' : language === 'hi' ? 'परिमेय' : 'ପରିମେୟ'}
                    </text>
                    
                    {/* Irrational Side (Right) */}
                    <rect x="520" y="250" width="200" height="50" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="2" rx="5"/>
                    <text x="620" y="280" textAnchor="middle" fill="#dc2626" fontSize="14" fontWeight="bold">
                      {language === 'en' ? 'IRRATIONAL' : language === 'hi' ? 'अपरिमेय' : 'ଅପରିମେୟ'}
                    </text>
                    
                    {/* Central Processing Unit */}
                    <circle cx="400" cy="320" r="30" fill="url(#centralGradient)" stroke="#f59e0b" strokeWidth="3"/>
                    <text x="400" y="327" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">CPU</text>
                    
                    {/* Steam Pipes */}
                    <line x1="400" y1="290" x2="400" y2="50" stroke="#6b7280" strokeWidth="8" strokeLinecap="round"/>
                    <circle cx="400" cy="50" r="15" fill="#94a3b8" stroke="#475569" strokeWidth="2"/>
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="machineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.9"/>
                      </linearGradient>
                      <radialGradient id="centralGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="1"/>
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8"/>
                      </radialGradient>
                    </defs>
                  </svg>

                  {/* Gear Slots */}
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`absolute ${getSlotSizeClass(slot.size)} border-4 border-dashed ${
                        slot.type === 'rational' ? 'border-blue-400 bg-blue-100/20' : 'border-red-400 bg-red-100/20'
                      } rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 ${
                        draggedGear && !slot.occupied ? 'animate-gear-glow' : ''
                      }`}
                      style={{
                        left: `${slot.x}px`,
                        top: `${slot.y}px`
                      }}
                      onClick={() => handleDrop(slot)}
                    >
                      {slot.occupied && slot.gear ? (
                        <div className={`${getSizeClass(slot.gear.size)} bg-gradient-to-br ${
                          slot.gear.type === 'rational' ? 'from-blue-400 to-blue-600' : 'from-red-400 to-red-600'
                        } rounded-full border-4 ${
                          slot.gear.type === 'rational' ? 'border-blue-700' : 'border-red-700'
                        } flex items-center justify-center text-white font-bold animate-gear-turn`}
                        style={{ transform: `rotate(${slot.gear.rotation}deg)` }}>
                          {slot.gear.value}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-xs">
                          {slot.size}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Number Gears */}
                  {gears.filter(gear => !gear.isPlaced).map((gear) => (
                    <div
                      key={gear.id}
                      className={`absolute ${getSizeClass(gear.size)} bg-gradient-to-br ${
                        gear.type === 'rational' ? 'from-blue-400 to-blue-600' : 'from-red-400 to-red-600'
                      } rounded-full border-4 ${
                        gear.type === 'rational' ? 'border-blue-700' : 'border-red-700'
                      } flex items-center justify-center text-white font-bold cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-110 shadow-lg animate-gear-turn`}
                      style={{
                        left: `${gear.x}px`,
                        top: `${gear.y}px`,
                        transform: `rotate(${gear.rotation}deg)`,
                        zIndex: draggedGear?.id === gear.id ? 50 : 10
                      }}
                      onClick={() => handleDragStart(gear)}
                    >
                      <span className="pointer-events-none">{gear.value}</span>
                    </div>
                  ))}

                  {/* Steam Effects */}
                  {machineRunning && (
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute steam-wisp animate-steam-rise"
                          style={{
                            left: `${-10 + i * 10}px`,
                            animationDelay: `${i * 0.3}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm text-amber-700 mb-2">
                      <span>{language === 'en' ? 'Machine Assembly Progress' : language === 'hi' ? 'मशीन असेंबली प्रगति' : 'ଯନ୍ତ୍ର ଆସେମ୍ବଲି ପ୍ରଗତି'}</span>
                      <span>{Math.round((gears.filter(g => g.isPlaced).length / gears.length) * 100)}%</span>
                    </div>
                    <div className="brass-progress-container rounded-full h-4 overflow-hidden">
                      <Progress 
                        value={(gears.filter(g => g.isPlaced).length / gears.length) * 100} 
                        className="h-full brass-progress-bar"
                      />
                    </div>
                  </div>
                  
                  {gears.every(g => g.isPlaced) && (
                    <div className="ml-6 flex items-center space-x-2 animate-mechanism-activate">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <span className="text-green-700 font-bold">
                        {language === 'en' ? 'Machine Ready!' : language === 'hi' ? 'मशीन तैयार!' : 'ଯନ୍ତ୍ର ପ୍ରସ୍ତୁତ!'}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Insights */}
            {gears.some(g => g.isPlaced) && (
              <Card className="brass-frame bg-gradient-to-br from-green-50/95 to-emerald-50/95 backdrop-blur-md border-4 border-green-700/30 animate-mechanism-activate">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <Settings className="h-6 w-6 mr-3 animate-clockwork-spin" />
                    {language === 'en' ? 'Mechanical Insights' : language === 'hi' ? 'यांत्रिक अंतर्दृष्टि' : 'ଯାନ୍ତ୍ରିକ ଅନ୍ତର୍ଦୃଷ୍ଟି'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-100/60 rounded-lg border border-blue-300/40">
                      <h4 className="font-bold text-blue-800 mb-2">
                        {language === 'en' ? 'Rational Gears Placed:' : language === 'hi' ? 'परिमेय गियर रखे गए:' : 'ପରିମେୟ ଗିଅର ରଖାଗଲା:'}
                      </h4>
                      <div className="space-y-2">
                        {gears.filter(g => g.isPlaced && g.type === 'rational').map(gear => (
                          <div key={gear.id} className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-blue-700">{gear.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-red-100/60 rounded-lg border border-red-300/40">
                      <h4 className="font-bold text-red-800 mb-2">
                        {language === 'en' ? 'Irrational Gears Placed:' : language === 'hi' ? 'अपरिमेय गियर रखे गए:' : 'ଅପରିମେୟ ଗିଅର ରଖାଗଲା:'}
                      </h4>
                      <div className="space-y-2">
                        {gears.filter(g => g.isPlaced && g.type === 'irrational').map(gear => (
                          <div key={gear.id} className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-red-700">{gear.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}