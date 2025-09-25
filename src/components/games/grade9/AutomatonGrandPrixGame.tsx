import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Zap, 
  Trophy,
  Play,
  Pause,
  RotateCw,
  Settings,
  Target,
  ArrowRight,
  Award,
  Gauge,
  Clock,
  Wrench
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Slider } from '../../ui/slider';
import type { Language } from '../../../types/onboarding';

interface AutomatonGrandPrixGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

interface Automaton {
  id: string;
  name: string;
  x: number;
  y: number;
  velocity: number;
  acceleration: number;
  mass: number;
  force: number;
  color: string;
  trail: { x: number; y: number }[];
  isPlayer: boolean;
}

interface RaceTrack {
  obstacles: { x: number; y: number; width: number; height: number }[];
  checkpoints: { x: number; y: number; passed: boolean }[];
  length: number;
}

export function AutomatonGrandPrixGame({ language, onBack, onComplete }: AutomatonGrandPrixGameProps) {
  const [gameState, setGameState] = useState<'setup' | 'racing' | 'paused' | 'finished'>('setup');
  const [score, setScore] = useState(0);
  const [alchemicalEssence, setAlchemicalEssence] = useState(0);
  const [raceTime, setRaceTime] = useState(0);
  const [selectedForce, setSelectedForce] = useState([50]);
  const [selectedMass, setSelectedMass] = useState([20]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const [playerAutomaton, setPlayerAutomaton] = useState<Automaton>({
    id: 'player',
    name: 'Your Automaton',
    x: 50,
    y: 200,
    velocity: 0,
    acceleration: 0,
    mass: 20,
    force: 50,
    color: '#3b82f6',
    trail: [],
    isPlayer: true
  });

  const [aiAutomatons, setAiAutomatons] = useState<Automaton[]>([
    {
      id: 'ai1',
      name: 'Steam Walker',
      x: 50,
      y: 150,
      velocity: 0,
      acceleration: 0,
      mass: 25,
      force: 45,
      color: '#ef4444',
      trail: [],
      isPlayer: false
    },
    {
      id: 'ai2',
      name: 'Brass Runner',
      x: 50,
      y: 250,
      velocity: 0,
      acceleration: 0,
      mass: 18,
      force: 55,
      color: '#10b981',
      trail: [],
      isPlayer: false
    }
  ]);

  const [track] = useState<RaceTrack>({
    obstacles: [
      { x: 200, y: 180, width: 20, height: 40 },
      { x: 350, y: 140, width: 15, height: 60 },
      { x: 500, y: 200, width: 25, height: 30 },
      { x: 650, y: 160, width: 20, height: 50 }
    ],
    checkpoints: [
      { x: 300, y: 200, passed: false },
      { x: 600, y: 200, passed: false },
      { x: 900, y: 200, passed: false }
    ],
    length: 1000
  });

  const explanations = {
    en: {
      title: "Automaton Grand Prix",
      description: "Build and race your clockwork automaton using Newton's Laws of Motion! Adjust force and mass to achieve optimal acceleration.",
      setup: "Configure Your Automaton",
      forceLabel: "Applied Force (N)",
      massLabel: "Automaton Mass (kg)",
      physicsInfo: "Remember: F = ma, so acceleration = Force ÷ Mass",
      startRace: "Launch Race!",
      racing: "Racing in Progress...",
      finished: "Race Complete!"
    },
    hi: {
      title: "ऑटोमेटन ग्रां प्री",
      description: "न्यूटन के गति नियमों का उपयोग करके अपना क्लॉकवर्क ऑटोमेटन बनाएं और दौड़ाएं!",
      setup: "अपना ऑटोमेटन कॉन्फ़िगर करें",
      forceLabel: "लागू बल (N)",
      massLabel: "ऑटोमेटन द्रव्यमान (kg)",
      physicsInfo: "याद रखें: F = ma, तो त्वरण = बल ÷ द्रव्यमान",
      startRace: "दौड़ शुरू करें!",
      racing: "दौड़ जारी है...",
      finished: "दौड़ पूरी!"
    },
    or: {
      title: "ଅଟୋମେଟନ ଗ୍ରାଣ୍ଡ ପ୍ରି",
      description: "ନ୍ୟୁଟନର ଗତି ନିୟମ ବ୍ୟବହାର କରି ଆପଣଙ୍କର ଘଣ୍ଟା କାର୍ଯ୍ୟ ଅଟୋମେଟନ ନିର୍ମାଣ ଓ ଦୌଡ଼ାନ୍ତୁ!",
      setup: "ଆପଣଙ୍କର ଅଟୋମେଟନ ବିନ୍ୟାସ କରନ୍ତୁ",
      forceLabel: "ପ୍ରୟୋଗ ବଳ (N)",
      massLabel: "ଅଟୋମେଟନ ମାସ (kg)",
      physicsInfo: "ମନେରଖନ୍ତୁ: F = ma, ତେଣୁ ତ୍ୱରଣ = ବଳ ÷ ମାସ",
      startRace: "ଦୌଡ଼ ଆରମ୍ଭ କର!",
      racing: "ଦୌଡ଼ ଚାଲିଛି...",
      finished: "ଦୌଡ଼ ସମାପ୍ତ!"
    }
  };

  const currentText = explanations[language];

  const updatePhysics = (automaton: Automaton, deltaTime: number): Automaton => {
    // Apply Newton's Second Law: F = ma, therefore a = F/m
    const acceleration = automaton.force / automaton.mass;
    
    // Update velocity: v = v₀ + at
    const newVelocity = automaton.velocity + acceleration * deltaTime;
    
    // Update position: x = x₀ + vt + ½at²
    const newX = automaton.x + automaton.velocity * deltaTime + 0.5 * acceleration * deltaTime * deltaTime;
    
    // Add to trail for visual effect
    const newTrail = [...automaton.trail.slice(-20), { x: automaton.x, y: automaton.y }];
    
    return {
      ...automaton,
      x: Math.max(0, Math.min(1000, newX)),
      velocity: Math.max(0, newVelocity * 0.98), // Add slight friction
      acceleration,
      trail: newTrail
    };
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw track background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw track lanes
    for (let i = 1; i < 4; i++) {
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(0, i * 100);
      ctx.lineTo(canvas.width, i * 100);
      ctx.stroke();
    }

    // Draw start/finish lines
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, canvas.height);
    ctx.stroke();

    ctx.strokeStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(canvas.width - 40, 0);
    ctx.lineTo(canvas.width - 40, canvas.height);
    ctx.stroke();

    // Draw obstacles
    track.obstacles.forEach(obstacle => {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      // Add steampunk details
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(obstacle.x + 2, obstacle.y + 2, obstacle.width - 4, obstacle.height - 4);
    });

    // Draw checkpoints
    track.checkpoints.forEach((checkpoint, index) => {
      ctx.strokeStyle = checkpoint.passed ? '#10b981' : '#6b7280';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(checkpoint.x, 0);
      ctx.lineTo(checkpoint.x, canvas.height);
      ctx.stroke();
      
      // Checkpoint number
      ctx.fillStyle = checkpoint.passed ? '#10b981' : '#6b7280';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${index + 1}`, checkpoint.x - 8, 20);
    });

    // Draw automaton trails
    const drawTrail = (automaton: Automaton) => {
      if (automaton.trail.length > 1) {
        ctx.strokeStyle = automaton.color + '40';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(automaton.trail[0].x, automaton.trail[0].y);
        for (let i = 1; i < automaton.trail.length; i++) {
          ctx.lineTo(automaton.trail[i].x, automaton.trail[i].y);
        }
        ctx.stroke();
      }
    };

    // Draw automatons
    const drawAutomaton = (automaton: Automaton) => {
      const size = 25;
      const x = automaton.x;
      const y = automaton.y;

      // Draw trail first
      drawTrail(automaton);

      // Main body
      ctx.fillStyle = automaton.color;
      ctx.fillRect(x - size/2, y - size/2, size, size);

      // Steampunk details
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x - size/3, y - size/3, size/1.5, size/1.5);

      // Gears
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x - 5, y - 5, 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + 5, y + 5, 3, 0, Math.PI * 2);
      ctx.stroke();

      // Velocity indicator
      if (automaton.velocity > 0) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + size/2, y);
        ctx.lineTo(x + size/2 + automaton.velocity * 0.5, y);
        ctx.stroke();
      }

      // Name and stats
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(automaton.name, x - 20, y - 30);
      ctx.font = '10px Arial';
      ctx.fillText(`v: ${automaton.velocity.toFixed(1)}`, x - 20, y - 15);
      ctx.fillText(`a: ${automaton.acceleration.toFixed(1)}`, x - 20, y + 35);
    };

    // Draw all automatons
    drawAutomaton(playerAutomaton);
    aiAutomatons.forEach(drawAutomaton);

    // Draw physics info overlay
    if (gameState === 'setup' || gameState === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(10, 10, 300, 100);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('Newton\'s Laws in Action:', 20, 30);
      ctx.font = '12px Arial';
      ctx.fillText(`F = ma`, 20, 50);
      ctx.fillText(`a = F ÷ m = ${selectedForce[0]} ÷ ${selectedMass[0]} = ${(selectedForce[0] / selectedMass[0]).toFixed(2)} m/s²`, 20, 70);
      ctx.fillText(`Higher force or lower mass = more acceleration`, 20, 90);
    }
  };

  const gameLoop = (currentTime: number) => {
    if (gameState !== 'racing') return;

    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }

    const deltaTime = 0.016; // ~60fps
    setRaceTime((currentTime - startTimeRef.current) / 1000);

    // Update player automaton
    setPlayerAutomaton(prevPlayer => {
      const updated = updatePhysics({ ...prevPlayer, force: selectedForce[0], mass: selectedMass[0] }, deltaTime);
      
      // Check for checkpoint passing
      track.checkpoints.forEach((checkpoint, index) => {
        if (!checkpoint.passed && Math.abs(updated.x - checkpoint.x) < 20) {
          checkpoint.passed = true;
          setScore(prev => prev + 100);
          setAlchemicalEssence(prev => prev + 10);
        }
      });

      // Check for finish line
      if (updated.x >= 960) {
        setGameState('finished');
        const timeBonus = Math.max(0, 1000 - Math.floor(raceTime * 10));
        setScore(prev => prev + timeBonus);
        setAlchemicalEssence(prev => prev + 50);
        setTimeout(() => onComplete(score + timeBonus, alchemicalEssence + 50), 2000);
      }

      return updated;
    });

    // Update AI automatons
    setAiAutomatons(prevAi => 
      prevAi.map(ai => updatePhysics(ai, deltaTime))
    );

    drawGame();
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  const startRace = () => {
    setGameState('racing');
    startTimeRef.current = 0;
    setRaceTime(0);
    
    // Reset positions
    setPlayerAutomaton(prev => ({ ...prev, x: 50, velocity: 0, trail: [] }));
    setAiAutomatons(prev => prev.map(ai => ({ ...ai, x: 50, velocity: 0, trail: [] })));
    
    // Reset checkpoints
    track.checkpoints.forEach(checkpoint => checkpoint.passed = false);
    
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  const pauseRace = () => {
    setGameState('paused');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const resumeRace = () => {
    setGameState('racing');
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    drawGame();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, selectedForce, selectedMass]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Futuristic Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M2 2h16v16H2V2zm4 4v8h8V6H6z" fill="none" stroke="%2306b6d4" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23circuit)" opacity="0.4"/></svg>')`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Header */}
      <header className="backdrop-blur-md bg-slate-900/90 border-b border-cyan-500/30 relative z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack} className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/20">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                {language === 'en' ? 'Back to Spire' : language === 'hi' ? 'स्पायर में वापस' : 'ସ୍ପାୟାରକୁ ଫେରନ୍ତୁ'}
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {currentText.title}
                </h1>
                <p className="text-slate-300">
                  {language === 'en' ? 'Physics Racing Simulation' : language === 'hi' ? 'भौतिकी रेसिंग सिमुलेशन' : 'ଭୌତିକ ବିଜ୍ଞାନ ରେସିଂ ସିମୁଲେସନ'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-400/30">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 font-bold">{alchemicalEssence} AE</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-400/30">
                <Award className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-bold">{score}</span>
              </div>
              {gameState === 'racing' && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-400/30">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold">{raceTime.toFixed(1)}s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="relative z-10 p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="xl:col-span-1">
            <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600/30">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <Settings className="h-5 w-5 mr-2" />
                  {currentText.setup}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Force Control */}
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">
                    {currentText.forceLabel}
                  </label>
                  <Slider
                    value={selectedForce}
                    onValueChange={setSelectedForce}
                    max={100}
                    min={10}
                    step={5}
                    className="mb-2"
                    disabled={gameState === 'racing'}
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>10N</span>
                    <span className="font-bold text-cyan-400">{selectedForce[0]}N</span>
                    <span>100N</span>
                  </div>
                </div>

                {/* Mass Control */}
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">
                    {currentText.massLabel}
                  </label>
                  <Slider
                    value={selectedMass}
                    onValueChange={setSelectedMass}
                    max={50}
                    min={5}
                    step={1}
                    className="mb-2"
                    disabled={gameState === 'racing'}
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>5kg</span>
                    <span className="font-bold text-cyan-400">{selectedMass[0]}kg</span>
                    <span>50kg</span>
                  </div>
                </div>

                {/* Physics Info */}
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
                  <h4 className="text-blue-400 font-bold text-sm mb-2">Physics Calculation:</h4>
                  <div className="text-xs text-blue-300 space-y-1">
                    <div>F = {selectedForce[0]}N</div>
                    <div>m = {selectedMass[0]}kg</div>
                    <div className="border-t border-blue-400/20 pt-1">
                      a = F ÷ m = {(selectedForce[0] / selectedMass[0]).toFixed(2)} m/s²
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="space-y-2">
                  {gameState === 'setup' && (
                    <Button
                      onClick={startRace}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {currentText.startRace}
                    </Button>
                  )}

                  {gameState === 'racing' && (
                    <Button
                      onClick={pauseRace}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Pause Race' : language === 'hi' ? 'दौड़ रोकें' : 'ଦୌଡ଼ ବନ୍ଦ କର'}
                    </Button>
                  )}

                  {gameState === 'paused' && (
                    <Button
                      onClick={resumeRace}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Resume Race' : language === 'hi' ? 'दौड़ जारी रखें' : 'ଦୌଡ଼ ଜାରି ରଖ'}
                    </Button>
                  )}

                  {(gameState === 'finished' || gameState === 'paused') && (
                    <Button
                      onClick={() => {
                        setGameState('setup');
                        setScore(0);
                        setAlchemicalEssence(0);
                        setRaceTime(0);
                      }}
                      variant="outline"
                      className="w-full border-slate-400/50 text-slate-300 hover:bg-slate-700/50"
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'New Race' : language === 'hi' ? 'नई दौड़' : 'ନୂତନ ଦୌଡ଼'}
                    </Button>
                  )}
                </div>

                {/* Leaderboard */}
                <div className="space-y-2">
                  <h4 className="text-slate-300 font-medium text-sm">Race Positions:</h4>
                  <div className="space-y-1">
                    {[
                      { name: playerAutomaton.name, x: playerAutomaton.x, color: playerAutomaton.color },
                      ...aiAutomatons.map(ai => ({ name: ai.name, x: ai.x, color: ai.color }))
                    ]
                      .sort((a, b) => b.x - a.x)
                      .map((automaton, index) => (
                        <div key={automaton.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <Badge className={`w-4 h-4 rounded-full p-0`} style={{ backgroundColor: automaton.color }} />
                            <span className="text-slate-300">{automaton.name}</span>
                          </div>
                          <span className="text-slate-400">{Math.round(automaton.x)}m</span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Race Track */}
          <div className="xl:col-span-3">
            <Card className="bg-slate-800/60 backdrop-blur-md border-slate-600/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-cyan-400">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Clockwork Racing Circuit' : language === 'hi' ? 'क्लॉकवर्क रेसिंग सर्किट' : 'ଘଣ୍ଟା କାର୍ଯ୍ୟ ରେସିଂ ସର୍କିଟ'}
                  </div>
                  {gameState === 'racing' && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30 animate-pulse">
                      {currentText.racing}
                    </Badge>
                  )}
                  {gameState === 'finished' && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
                      {currentText.finished}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={canvasRef}
                  width={1000}
                  height={300}
                  className="w-full h-full border border-slate-600/30 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200"
                />
                
                {/* Physics Info Bar */}
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-slate-400">Current Velocity</div>
                      <div className="text-cyan-400 font-bold text-lg">
                        {playerAutomaton.velocity.toFixed(1)} m/s
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400">Acceleration</div>
                      <div className="text-green-400 font-bold text-lg">
                        {playerAutomaton.acceleration.toFixed(1)} m/s²
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400">Distance Traveled</div>
                      <div className="text-purple-400 font-bold text-lg">
                        {Math.round(playerAutomaton.x)} m
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}