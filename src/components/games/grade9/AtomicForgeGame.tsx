import React, { useState, useEffect } from 'react';
import { 
  Atom, 
  Zap, 
  Plus,
  Target,
  Award,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  FlaskConical,
  Settings,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import type { Language } from '../../../types/onboarding';

interface AtomicForgeGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

interface Particle {
  id: string;
  type: 'proton' | 'neutron' | 'electron';
  x: number;
  y: number;
  isSelected: boolean;
  isPlaced: boolean;
}

interface AtomStructure {
  element: string;
  protons: number;
  neutrons: number;
  electrons: number;
  description: string;
  color: string;
}

interface ForgeLevel {
  target: AtomStructure;
  availableParticles: Particle[];
  completed: boolean;
}

export function AtomicForgeGame({ language, onBack, onComplete }: AtomicForgeGameProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [alchemicalEssence, setAlchemicalEssence] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);
  const [forgeTemperature, setForgeTemperature] = useState(1000);
  const [isForging, setIsForging] = useState(false);
  const [placedParticles, setPlacedParticles] = useState<Particle[]>([]);
  const [availableParticles, setAvailableParticles] = useState<Particle[]>([]);

  // Atomic structures to forge
  const forgeLevels: ForgeLevel[] = [
    {
      target: {
        element: 'Hydrogen',
        protons: 1,
        neutrons: 0,
        electrons: 1,
        description: 'The simplest element - perfect for beginning alchemists',
        color: '#ef4444'
      },
      availableParticles: [
        { id: 'p1', type: 'proton', x: 100, y: 100, isSelected: false, isPlaced: false },
        { id: 'e1', type: 'electron', x: 200, y: 100, isSelected: false, isPlaced: false },
        { id: 'n1', type: 'neutron', x: 150, y: 150, isSelected: false, isPlaced: false }
      ],
      completed: false
    },
    {
      target: {
        element: 'Helium',
        protons: 2,
        neutrons: 2,
        electrons: 2,
        description: 'A noble gas with perfect symmetry',
        color: '#10b981'
      },
      availableParticles: [
        { id: 'p1', type: 'proton', x: 80, y: 100, isSelected: false, isPlaced: false },
        { id: 'p2', type: 'proton', x: 120, y: 100, isSelected: false, isPlaced: false },
        { id: 'n1', type: 'neutron', x: 80, y: 150, isSelected: false, isPlaced: false },
        { id: 'n2', type: 'neutron', x: 120, y: 150, isSelected: false, isPlaced: false },
        { id: 'e1', type: 'electron', x: 200, y: 100, isSelected: false, isPlaced: false },
        { id: 'e2', type: 'electron', x: 200, y: 150, isSelected: false, isPlaced: false }
      ],
      completed: false
    },
    {
      target: {
        element: 'Carbon',
        protons: 6,
        neutrons: 6,
        electrons: 6,
        description: 'The foundation of all organic compounds',
        color: '#8b5cf6'
      },
      availableParticles: Array.from({ length: 18 }, (_, i) => ({
        id: `p${i}`,
        type: i < 6 ? 'proton' : i < 12 ? 'neutron' : 'electron',
        x: 60 + (i % 6) * 40,
        y: 100 + Math.floor(i / 6) * 50,
        isSelected: false,
        isPlaced: false
      } as Particle)),
      completed: false
    }
  ];

  const [levels, setLevels] = useState(forgeLevels);
  const currentLevelData = levels[currentLevel];

  const explanations = {
    en: {
      title: "The Atomic Forge",
      description: "Master the art of atomic construction! Combine protons, neutrons, and electrons to forge new elements in your mystical atomic forge.",
      instructions: "Drag particles to the forge chamber. Match the target element's composition exactly!",
      protonInfo: "Protons (Red): Positively charged, determine the element",
      neutronInfo: "Neutrons (Gray): Neutral, add mass and stability",
      electronInfo: "Electrons (Blue): Negatively charged, orbit the nucleus",
      forgeTemp: "Forge Temperature",
      startForging: "Begin Atomic Fusion!"
    },
    hi: {
      title: "परमाणु फोर्ज",
      description: "परमाणु निर्माण की कला में महारत हासिल करें! अपने रहस्यमय परमाणु फोर्ज में नए तत्व बनाने के लिए प्रोटॉन, न्यूट्रॉन और इलेक्ट्रॉन को मिलाएं।",
      instructions: "कणों को फोर्ज चैंबर में खींचें। लक्ष्य तत्व की संरचना से बिल्कुल मेल खाएं!",
      protonInfo: "प्रोटॉन (लाल): धनावेशित, तत्व निर्धारित करते हैं",
      neutronInfo: "न्यूट्रॉन (स्लेटी): तटस्थ, द्रव्यमान और स्थिरता जोड़ते हैं",
      electronInfo: "इलेक्ट्रॉन (नीले): ऋणावेशित, नाभिक की परिक्रमा करते हैं",
      forgeTemp: "फोर्ज तापमान",
      startForging: "परमाणु संलयन शुरू करें!"
    },
    or: {
      title: "ପରମାଣୁ ଫୋର୍ଜ",
      description: "ପରମାଣୁ ନିର୍ମାଣର କଳାରେ ପାରଦର୍ଶିତା ହାସଲ କରନ୍ତୁ! ଆପଣଙ୍କର ରହସ୍ୟମୟ ପରମାଣୁ ଫୋର୍ଜରେ ନୂତନ ମୌଳିକ ପଦାର୍ଥ ତିଆରି କରିବାକୁ ପ୍ରୋଟନ, ନ୍ୟୁଟ୍ରନ ଏବଂ ଇଲେକ୍ଟ୍ରନ ମିଶାନ୍ତୁ।",
      instructions: "କଣିକାମାନଙ୍କୁ ଫୋର୍ଜ ଚେମ୍ବରରେ ଟାଣନ୍ତୁ। ଲକ୍ଷ୍ୟ ମୌଳିକର ଗଠନ ସହିତ ସମ୍ପୂର୍ଣ୍ଣ ମେଳ ଖାଆନ୍ତୁ!",
      protonInfo: "ପ୍ରୋଟନ (ଲାଲ): ଧନାତ୍ମକ ଆବେଶିତ, ମୌଳିକ ନିର୍ଧାରଣ କରେ",
      neutronInfo: "ନ୍ୟୁଟ୍ରନ (ସ୍ଲେଟ): ନିରପେକ୍ଷ, ମାସ ଏବଂ ସ୍ଥିରତା ଯୋଗ କରେ",
      electronInfo: "ଇଲେକ୍ଟ୍ରନ (ନୀଳ): ଋଣାତ୍ମକ ଆବେଶିତ, ନାଭିକ ଚାରିପଟେ ଘୂର୍ଣ୍ଣନ କରେ",
      forgeTemp: "ଫୋର୍ଜ ତାପମାତ୍ରା",
      startForging: "ପରମାଣୁ ସଂଲୟନ ଆରମ୍ଭ କରନ୍ତୁ!"
    }
  };

  const currentText = explanations[language];

  const getParticleColor = (type: string) => {
    switch (type) {
      case 'proton': return '#ef4444';
      case 'neutron': return '#6b7280';
      case 'electron': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  const getParticleSize = (type: string) => {
    switch (type) {
      case 'proton': return 'w-8 h-8';
      case 'neutron': return 'w-8 h-8';
      case 'electron': return 'w-6 h-6';
      default: return 'w-8 h-8';
    }
  };

  const handleParticleClick = (particleId: string) => {
    if (isForging) return;

    const particle = availableParticles.find(p => p.id === particleId);
    if (!particle || particle.isPlaced) return;

    // Move particle to forge chamber
    setPlacedParticles(prev => [...prev, { ...particle, isPlaced: true }]);
    setAvailableParticles(prev => prev.map(p => 
      p.id === particleId ? { ...p, isPlaced: true } : p
    ));
  };

  const removeParticleFromForge = (particleId: string) => {
    if (isForging) return;

    setPlacedParticles(prev => prev.filter(p => p.id !== particleId));
    setAvailableParticles(prev => prev.map(p => 
      p.id === particleId ? { ...p, isPlaced: false } : p
    ));
  };

  const checkAtomComposition = () => {
    const protonCount = placedParticles.filter(p => p.type === 'proton').length;
    const neutronCount = placedParticles.filter(p => p.type === 'neutron').length;
    const electronCount = placedParticles.filter(p => p.type === 'electron').length;

    const target = currentLevelData.target;
    return (
      protonCount === target.protons &&
      neutronCount === target.neutrons &&
      electronCount === target.electrons
    );
  };

  const startForging = () => {
    if (!checkAtomComposition()) return;

    setIsForging(true);
    setForgeTemperature(1000);

    // Animate forging process
    const forgeInterval = setInterval(() => {
      setForgeTemperature(prev => {
        if (prev >= 3000) {
          clearInterval(forgeInterval);
          completeForging();
          return 3000;
        }
        return prev + 100;
      });
    }, 200);
  };

  const completeForging = () => {
    const newScore = score + 500;
    const newEssence = alchemicalEssence + 25;
    
    setScore(newScore);
    setAlchemicalEssence(newEssence);
    
    // Mark level complete
    setLevels(prev => prev.map((level, index) => 
      index === currentLevel ? { ...level, completed: true } : level
    ));

    setTimeout(() => {
      if (currentLevel < levels.length - 1) {
        setCurrentLevel(prev => prev + 1);
        resetForge();
      } else {
        // All levels complete
        onComplete(newScore, newEssence);
      }
    }, 2000);
  };

  const resetForge = () => {
    setIsForging(false);
    setForgeTemperature(1000);
    setPlacedParticles([]);
    setAvailableParticles(currentLevelData.availableParticles);
  };

  useEffect(() => {
    setAvailableParticles(currentLevelData.availableParticles);
    setPlacedParticles([]);
  }, [currentLevel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Alchemical Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="atoms" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="12.5" cy="12.5" r="8" fill="none" stroke="%236366f1" stroke-width="0.5"/><circle cx="12.5" cy="12.5" r="2" fill="%236366f1" opacity="0.6"/></pattern></defs><rect width="100" height="100" fill="url(%23atoms)" opacity="0.4"/></svg>')`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Floating Energy Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full animate-cosmic-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="backdrop-blur-md bg-indigo-900/90 border-b border-purple-500/30 relative z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack} className="border-purple-400/50 text-purple-400 hover:bg-purple-500/20">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                {language === 'en' ? 'Back to Spire' : language === 'hi' ? 'स्पायर में वापस' : 'ସ୍ପାୟାରକୁ ଫେରନ୍ତୁ'}
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {currentText.title}
                </h1>
                <p className="text-slate-300">
                  {language === 'en' ? 'Level' : language === 'hi' ? 'स्तर' : 'ସ୍ତର'} {currentLevel + 1} • {currentLevelData.target.element}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-400/30">
                <FlaskConical className="h-4 w-4 text-purple-400 animate-alchemical-bubble" />
                <span className="text-purple-400 font-bold">{alchemicalEssence} AE</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/30">
                <Award className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-bold">{score}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="relative z-10 p-6">
        {showExplanation && (
          <Card className="bg-indigo-800/60 backdrop-blur-md border-indigo-600/30 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-200">
                <Lightbulb className="h-6 w-6 mr-3 animate-cosmic-pulse" />
                {language === 'en' ? 'Atomic Alchemist\'s Manual' : language === 'hi' ? 'परमाणु कीमियागर की पुस्तिका' : 'ପରମାଣୁ ରସାୟନବିତର ମାନୁଆଲ'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-100 mb-4">{currentText.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-red-500/20 rounded-lg border border-red-400/30">
                  <h4 className="font-bold text-red-300 mb-2">{currentText.protonInfo}</h4>
                  <div className="w-8 h-8 bg-red-400 rounded-full mx-auto animate-pulse" />
                </div>
                <div className="p-3 bg-gray-500/20 rounded-lg border border-gray-400/30">
                  <h4 className="font-bold text-gray-300 mb-2">{currentText.neutronInfo}</h4>
                  <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto animate-pulse" />
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <h4 className="font-bold text-blue-300 mb-2">{currentText.electronInfo}</h4>
                  <div className="w-6 h-6 bg-blue-400 rounded-full mx-auto animate-pulse" />
                </div>
              </div>
              <p className="text-indigo-100 font-medium">{currentText.instructions}</p>
              <Button 
                onClick={() => setShowExplanation(false)}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                <Atom className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Start Forging!' : language === 'hi' ? 'निर्माण शुरू करें!' : 'ନିର୍ମାଣ ଆରମ୍ଭ କର!'}
              </Button>
            </CardContent>
          </Card>
        )}

        {!showExplanation && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Target Element Info */}
            <div className="xl:col-span-1">
              <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600/30 mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-400">
                    <Target className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Target Element' : language === 'hi' ? 'लक्ष्य तत्व' : 'ଲକ୍ଷ୍ୟ ମୌଳିକ'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl animate-cosmic-pulse"
                      style={{ backgroundColor: currentLevelData.target.color }}
                    >
                      {currentLevelData.target.element.slice(0, 2)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-200">{currentLevelData.target.element}</h3>
                    <p className="text-slate-400 text-sm">{currentLevelData.target.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400">Protons:</span>
                      <Badge className="bg-red-500/20 text-red-400">{currentLevelData.target.protons}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Neutrons:</span>
                      <Badge className="bg-gray-500/20 text-gray-400">{currentLevelData.target.neutrons}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400">Electrons:</span>
                      <Badge className="bg-blue-500/20 text-blue-400">{currentLevelData.target.electrons}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Forge Controls */}
              <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-400">
                    <Settings className="h-5 w-5 mr-2" />
                    {currentText.forgeTemp}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-orange-400 mb-2">
                      {forgeTemperature}°C
                    </div>
                    <Progress 
                      value={(forgeTemperature / 3000) * 100} 
                      className="h-3 mb-4"
                    />
                  </div>
                  
                  <Button
                    onClick={startForging}
                    disabled={!checkAtomComposition() || isForging}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white disabled:opacity-50"
                  >
                    {isForging ? (
                      <>
                        <Zap className="h-4 w-4 mr-2 animate-spin" />
                        {language === 'en' ? 'Forging...' : language === 'hi' ? 'निर्माण में...' : 'ନିର୍ମାଣ ହେଉଛି...'}
                      </>
                    ) : (
                      <>
                        <Atom className="h-4 w-4 mr-2" />
                        {currentText.startForging}
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={resetForge}
                    variant="outline"
                    className="w-full mt-2 border-slate-400/50 text-slate-300 hover:bg-slate-700/50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Reset Forge' : language === 'hi' ? 'फोर्ज रीसेट करें' : 'ଫୋର୍ଜ ରିସେଟ କର'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Atomic Forge Chamber */}
            <div className="xl:col-span-2">
              <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-purple-400">
                    <div className="flex items-center">
                      <Atom className="h-6 w-6 mr-3 animate-spin" />
                      {language === 'en' ? 'Mystical Atomic Forge' : language === 'hi' ? 'रहस्यमय परमाणु फोर्ज' : 'ରହସ୍ୟମୟ ପରମାଣୁ ଫୋର୍ଜ'}
                    </div>
                    {checkAtomComposition() && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30 animate-pulse">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'Ready to Forge!' : language === 'hi' ? 'निर्माण के लिए तैयार!' : 'ନିର୍ମାଣ ପାଇଁ ପ୍ରସ୍ତୁତ!'}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-96 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl border-2 border-purple-500/30 overflow-hidden">
                    {/* Forge Chamber Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 animate-energy-flow" />
                    
                    {/* Central Forge Area */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-dashed border-orange-400/50 rounded-full flex items-center justify-center bg-orange-500/10">
                      <div className="text-orange-400 text-center">
                        <Atom className="h-8 w-8 mx-auto mb-2 animate-spin" />
                        <div className="text-xs">Forge Chamber</div>
                      </div>
                    </div>

                    {/* Placed Particles in Forge */}
                    {placedParticles.map((particle, index) => {
                      const angle = (index * 360) / placedParticles.length;
                      const radius = particle.type === 'electron' ? 120 : 50;
                      const x = 300 + Math.cos(angle * Math.PI / 180) * radius;
                      const y = 200 + Math.sin(angle * Math.PI / 180) * radius;
                      
                      return (
                        <div
                          key={particle.id}
                          className={`absolute ${getParticleSize(particle.type)} rounded-full cursor-pointer transition-all duration-300 hover:scale-110 animate-cosmic-pulse flex items-center justify-center text-white text-xs font-bold`}
                          style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            backgroundColor: getParticleColor(particle.type),
                            transform: `translate(-50%, -50%)`
                          }}
                          onClick={() => removeParticleFromForge(particle.id)}
                        >
                          {particle.type === 'proton' ? 'P' : particle.type === 'neutron' ? 'N' : 'e'}
                        </div>
                      );
                    })}

                    {/* Forge Effect */}
                    {isForging && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 via-red-400/40 to-yellow-400/30 animate-flame-flicker" />
                    )}
                  </div>

                  {/* Available Particles */}
                  <div className="mt-6">
                    <h4 className="text-slate-300 font-medium mb-3">
                      {language === 'en' ? 'Available Particles' : language === 'hi' ? 'उपलब्ध कण' : 'ଉପଲବ୍ଧ କଣିକା'}
                    </h4>
                    <div className="grid grid-cols-6 gap-4">
                      {availableParticles.filter(p => !p.isPlaced).map((particle) => (
                        <div
                          key={particle.id}
                          className={`${getParticleSize(particle.type)} rounded-full cursor-pointer transition-all duration-300 hover:scale-110 animate-pulse flex items-center justify-center text-white text-xs font-bold`}
                          style={{ backgroundColor: getParticleColor(particle.type) }}
                          onClick={() => handleParticleClick(particle.id)}
                        >
                          {particle.type === 'proton' ? 'P' : particle.type === 'neutron' ? 'N' : 'e'}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Composition */}
                  <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="text-slate-300 font-medium mb-3">
                      {language === 'en' ? 'Current Composition' : language === 'hi' ? 'वर्तमान संरचना' : 'ବର୍ତ୍ତମାନ ସଂରଚନା'}
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-red-400 font-bold text-lg">
                          {placedParticles.filter(p => p.type === 'proton').length}
                        </div>
                        <div className="text-slate-400 text-sm">Protons</div>
                      </div>
                      <div>
                        <div className="text-gray-400 font-bold text-lg">
                          {placedParticles.filter(p => p.type === 'neutron').length}
                        </div>
                        <div className="text-slate-400 text-sm">Neutrons</div>
                      </div>
                      <div>
                        <div className="text-blue-400 font-bold text-lg">
                          {placedParticles.filter(p => p.type === 'electron').length}
                        </div>
                        <div className="text-slate-400 text-sm">Electrons</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}