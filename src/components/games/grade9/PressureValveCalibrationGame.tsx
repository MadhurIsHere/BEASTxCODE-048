import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ArrowLeft, Gauge, Cog, Zap, AlertTriangle, CheckCircle2, Settings, Target, Flame } from 'lucide-react';
import type { Language } from '../../../types/onboarding';

interface PressureValveCalibrationGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

interface ValveSystem {
  id: number;
  name: string;
  equation1: { a: number; b: number; c: number }; // ax + by = c
  equation2: { a: number; b: number; c: number }; // ax + by = c
  maxPressure: number;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
}

export function PressureValveCalibrationGame({ language, onBack, onComplete }: PressureValveCalibrationGameProps) {
  const [currentSystem, setCurrentSystem] = useState(0);
  const [valve1Position, setValve1Position] = useState(50);
  const [valve2Position, setValve2Position] = useState(50);
  const [pressure1, setPressure1] = useState(0);
  const [pressure2, setPressure2] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [completedSystems, setCompletedSystems] = useState<boolean[]>([]);
  const [cogwheelFragments, setCogwheelFragments] = useState(180);
  const [steamLevel, setSteamLevel] = useState(100);
  const [showSolution, setShowSolution] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const systems: ValveSystem[] = [
    {
      id: 1,
      name: 'Main Steam Line',
      equation1: { a: 2, b: 1, c: 8 },  // 2x + y = 8
      equation2: { a: 1, b: 1, c: 5 },  // x + y = 5
      maxPressure: 100,
      description: 'Balance the main steam distribution system',
      difficulty: 'Easy',
      points: 150
    },
    {
      id: 2,
      name: 'Boiler Pressure Network',
      equation1: { a: 3, b: 2, c: 12 }, // 3x + 2y = 12
      equation2: { a: 1, b: -1, c: 1 }, // x - y = 1
      maxPressure: 120,
      description: 'Calibrate the complex boiler pressure distribution',
      difficulty: 'Medium',
      points: 250
    },
    {
      id: 3,
      name: 'Emergency Safety System',
      equation1: { a: 4, b: -3, c: 2 }, // 4x - 3y = 2
      equation2: { a: 2, b: 5, c: 16 }, // 2x + 5y = 16
      maxPressure: 150,
      description: 'Critical safety system requiring precise calibration',
      difficulty: 'Hard',
      points: 400
    }
  ];

  useEffect(() => {
    setCompletedSystems(new Array(systems.length).fill(false));
  }, []);

  useEffect(() => {
    calculatePressures();
    checkCalibration();
    drawCanvas();
  }, [valve1Position, valve2Position, currentSystem]);

  const calculatePressures = () => {
    const system = systems[currentSystem];
    
    // Convert valve positions (0-100) to actual values for the equations
    const x = valve1Position;
    const y = valve2Position;
    
    // Calculate how close we are to satisfying both equations
    const eq1Result = system.equation1.a * x + system.equation1.b * y;
    const eq2Result = system.equation2.a * x + system.equation2.b * y;
    
    const eq1Target = system.equation1.c;
    const eq2Target = system.equation2.c;
    
    // Calculate pressure based on how close we are to the target
    const pressure1Value = Math.max(0, Math.min(system.maxPressure, 
      system.maxPressure - Math.abs(eq1Result - eq1Target) * 5));
    const pressure2Value = Math.max(0, Math.min(system.maxPressure, 
      system.maxPressure - Math.abs(eq2Result - eq2Target) * 5));
    
    setPressure1(pressure1Value);
    setPressure2(pressure2Value);
  };

  const checkCalibration = () => {
    const system = systems[currentSystem];
    const tolerance = 2; // Allow some tolerance for solution
    
    const x = valve1Position;
    const y = valve2Position;
    
    const eq1Satisfied = Math.abs(
      system.equation1.a * x + system.equation1.b * y - system.equation1.c
    ) < tolerance;
    
    const eq2Satisfied = Math.abs(
      system.equation2.a * x + system.equation2.b * y - system.equation2.c
    ) < tolerance;
    
    const newCalibrated = eq1Satisfied && eq2Satisfied;
    
    if (newCalibrated && !isCalibrated) {
      // Successfully calibrated!
      const newScore = score + system.points;
      const earnedXP = system.points / 3;
      const newXP = totalXP + earnedXP;
      const newFragments = cogwheelFragments + (system.points / 10);

      setScore(newScore);
      setTotalXP(newXP);
      setCogwheelFragments(newFragments);

      const newCompleted = [...completedSystems];
      newCompleted[currentSystem] = true;
      setCompletedSystems(newCompleted);

      // Check if all systems completed
      if (newCompleted.every(Boolean)) {
        setTimeout(() => onComplete(newScore, newXP), 2000);
      }
    }
    
    setIsCalibrated(newCalibrated);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const system = systems[currentSystem];

    // Draw coordinate axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, height - 40);
    ctx.lineTo(width - 20, height - 40);
    ctx.moveTo(40, height - 40);
    ctx.lineTo(40, 20);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Valve 1 Position (x)', width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Valve 2 Position (y)', 0, 0);
    ctx.restore();

    // Draw equation lines
    const scaleX = (width - 80) / 100;
    const scaleY = (height - 80) / 100;

    // Equation 1 line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= 100; x += 1) {
      const y = (system.equation1.c - system.equation1.a * x) / system.equation1.b;
      if (y >= 0 && y <= 100) {
        const canvasX = 40 + x * scaleX;
        const canvasY = height - 40 - y * scaleY;
        if (x === 0) ctx.moveTo(canvasX, canvasY);
        else ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    // Equation 2 line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= 100; x += 1) {
      const y = (system.equation2.c - system.equation2.a * x) / system.equation2.b;
      if (y >= 0 && y <= 100) {
        const canvasX = 40 + x * scaleX;
        const canvasY = height - 40 - y * scaleY;
        if (x === 0) ctx.moveTo(canvasX, canvasY);
        else ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    // Draw current position
    const currentX = 40 + valve1Position * scaleX;
    const currentY = height - 40 - valve2Position * scaleY;

    ctx.fillStyle = isCalibrated ? '#22c55e' : '#f59e0b';
    ctx.strokeStyle = isCalibrated ? '#16a34a' : '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw intersection point if calibrated
    if (isCalibrated) {
      // Draw celebration effect
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const startX = currentX + Math.cos(angle) * 15;
        const startY = currentY + Math.sin(angle) * 15;
        const endX = currentX + Math.cos(angle) * 25;
        const endY = currentY + Math.sin(angle) * 25;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }

    // Draw equation labels
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${system.equation1.a}x + ${system.equation1.b}y = ${system.equation1.c}`, 60, 30);
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`${system.equation2.a}x + ${system.equation2.b}y = ${system.equation2.c}`, 60, 50);
  };

  const solveMathematically = () => {
    const system = systems[currentSystem];
    // Solve using substitution or elimination
    const det = system.equation1.a * system.equation2.b - system.equation1.b * system.equation2.a;
    
    if (det !== 0) {
      const x = (system.equation1.c * system.equation2.b - system.equation1.b * system.equation2.c) / det;
      const y = (system.equation1.a * system.equation2.c - system.equation1.c * system.equation2.a) / det;
      
      setValve1Position(Math.max(0, Math.min(100, x)));
      setValve2Position(Math.max(0, Math.min(100, y)));
      setShowSolution(true);
    }
  };

  const resetSystem = () => {
    setValve1Position(50);
    setValve2Position(50);
    setShowSolution(false);
    setAttempts(0);
    setIsCalibrated(false);
  };

  const nextSystem = () => {
    if (currentSystem < systems.length - 1) {
      setCurrentSystem(currentSystem + 1);
      resetSystem();
    }
  };

  const prevSystem = () => {
    if (currentSystem > 0) {
      setCurrentSystem(currentSystem - 1);
      resetSystem();
    }
  };

  const system = systems[currentSystem];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Steampunk Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
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
      <header className="brass-frame bg-gradient-to-r from-amber-100/95 via-orange-100/95 to-red-100/95 backdrop-blur-lg border-b-4 border-amber-800/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="brass-button border-amber-600/40 text-amber-800 hover:bg-amber-200/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Back to Guild' : language === 'hi' ? 'गिल्ड में वापस' : 'ଗିଲ୍ଡକୁ ଫେରନ୍ତୁ'}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-amber-900 copper-text-shadow">
                  {language === 'en' ? 'Pressure Valve Calibration' : language === 'hi' ? 'दबाव वाल्व अंशांकन' : 'ଚାପ ଭାଲଭ କାଲିବ୍ରେସନ'}
                </h1>
                <p className="text-amber-700">
                  {language === 'en' ? 'Balance Steam Systems Using Linear Equations' : language === 'hi' ? 'रैखिक समीकरणों का उपयोग करके स्टीम सिस्टम संतुलित करें' : 'ରେଖୀୟ ସମୀକରଣ ବ୍ୟବହାର କରି ବାଷ୍ପ ପ୍ରଣାଳୀ ସନ୍ତୁଳିତ କରନ୍ତୁ'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="brass-gauge flex items-center space-x-2">
                <Cog className="h-5 w-5 text-amber-700 animate-clockwork-spin" />
                <span className="text-amber-800 font-bold">{cogwheelFragments} CF</span>
              </div>
              <div className="brass-gauge flex items-center space-x-2">
                <Flame className="h-5 w-5 text-red-700 animate-flame-flicker" />
                <span className="text-red-800 font-bold">{steamLevel}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <div className="xl:col-span-2">
            <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-amber-900">
                  <div className="flex items-center">
                    <Gauge className="h-6 w-6 mr-3 animate-alchemical-bubble" />
                    {system.name}
                  </div>
                  <Badge className={`${
                    system.difficulty === 'Easy' ? 'bg-green-500/20 text-green-700 border-green-400/30' :
                    system.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-400/30' :
                    'bg-red-500/20 text-red-700 border-red-400/30'
                  }`}>
                    {system.difficulty}
                  </Badge>
                </CardTitle>
                <p className="text-amber-700">{system.description}</p>
              </CardHeader>
              <CardContent>
                {/* Valve Controls */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="brass-frame bg-gradient-to-br from-red-100/50 to-orange-100/50 p-4 rounded-lg">
                    <h3 className="font-bold text-red-800 mb-3 flex items-center">
                      <Settings className="h-5 w-5 mr-2 animate-clockwork-spin" />
                      Valve 1 (x)
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={valve1Position}
                        onChange={(e) => setValve1Position(Number(e.target.value))}
                        className="w-full h-3 bg-red-300 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-red-700">
                        <span>0</span>
                        <span className="font-bold text-lg">{valve1Position}</span>
                        <span>100</span>
                      </div>
                      <div className="brass-gauge">
                        <div className="flex items-center justify-between">
                          <span className="text-red-700">Pressure:</span>
                          <span className="font-bold text-red-800">{pressure1.toFixed(1)} PSI</span>
                        </div>
                        <Progress value={(pressure1 / system.maxPressure) * 100} className="h-3 mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="brass-frame bg-gradient-to-br from-blue-100/50 to-cyan-100/50 p-4 rounded-lg">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                      <Settings className="h-5 w-5 mr-2 animate-clockwork-spin" />
                      Valve 2 (y)
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={valve2Position}
                        onChange={(e) => setValve2Position(Number(e.target.value))}
                        className="w-full h-3 bg-blue-300 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-blue-700">
                        <span>0</span>
                        <span className="font-bold text-lg">{valve2Position}</span>
                        <span>100</span>
                      </div>
                      <div className="brass-gauge">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Pressure:</span>
                          <span className="font-bold text-blue-800">{pressure2.toFixed(1)} PSI</span>
                        </div>
                        <Progress value={(pressure2 / system.maxPressure) * 100} className="h-3 mt-1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Graph Display */}
                <div className="mb-6">
                  <h3 className="font-bold text-amber-900 mb-3 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    System Graph - Find the Intersection
                  </h3>
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={300}
                    className="border-2 border-amber-600/30 rounded-lg bg-gradient-to-br from-amber-100/30 to-orange-100/30 brass-frame w-full"
                  />
                </div>

                {/* Status Display */}
                <div className={`p-4 rounded-lg brass-frame ${
                  isCalibrated ? 'bg-green-100/80 border-green-400/30' : 'bg-yellow-100/80 border-yellow-400/30'
                }`}>
                  <div className="flex items-center space-x-3">
                    {isCalibrated ? (
                      <>
                        <CheckCircle2 className="h-6 w-6 text-green-600 animate-bounce" />
                        <div>
                          <h4 className="font-bold text-green-800">System Calibrated!</h4>
                          <p className="text-green-700">Steam pressure is perfectly balanced</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-6 w-6 text-yellow-600 animate-pulse" />
                        <div>
                          <h4 className="font-bold text-yellow-800">Calibration Required</h4>
                          <p className="text-yellow-700">Adjust valves to balance both equations</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex space-x-2">
                    <Button
                      onClick={resetSystem}
                      className="brass-button bg-orange-500/20 hover:bg-orange-500/30 text-orange-700 border border-orange-400/30"
                    >
                      Reset Valves
                    </Button>
                    <Button
                      onClick={solveMathematically}
                      className="brass-button bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 border border-purple-400/30"
                      disabled={showSolution}
                    >
                      Show Solution
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={prevSystem}
                      variant="outline"
                      className="brass-button"
                      disabled={currentSystem === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={nextSystem}
                      variant="outline"
                      className="brass-button"
                      disabled={currentSystem === systems.length - 1 || !completedSystems[currentSystem]}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Equations Display */}
            <Card className="brass-frame bg-gradient-to-br from-blue-50/95 to-cyan-50/95 backdrop-blur-md border-4 border-blue-700/30">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Target className="h-5 w-5 mr-2" />
                  System Equations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-red-100/50 rounded-lg border border-red-300/50">
                    <p className="font-bold text-red-800 text-lg">
                      {system.equation1.a}x + {system.equation1.b}y = {system.equation1.c}
                    </p>
                    <p className="text-red-600 text-sm">Steam Line 1</p>
                  </div>
                  <div className="p-3 bg-blue-100/50 rounded-lg border border-blue-300/50">
                    <p className="font-bold text-blue-800 text-lg">
                      {system.equation2.a}x + {system.equation2.b}y = {system.equation2.c}
                    </p>
                    <p className="text-blue-600 text-sm">Steam Line 2</p>
                  </div>
                  {showSolution && (
                    <div className="p-3 bg-green-100/50 rounded-lg border border-green-300/50">
                      <p className="font-bold text-green-800">Solution:</p>
                      <p className="text-green-700">x = {valve1Position.toFixed(1)}</p>
                      <p className="text-green-700">y = {valve2Position.toFixed(1)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-900">
                  <Cog className="h-5 w-5 mr-2 animate-clockwork-spin" />
                  Workshop Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systems.map((s, index) => (
                    <div key={s.id} className={`p-3 rounded-lg brass-frame ${
                      index === currentSystem ? 'bg-blue-100/50 border-blue-400/30' : 
                      completedSystems[index] ? 'bg-green-100/50 border-green-400/30' : 
                      'bg-gray-100/30 border-gray-400/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {completedSystems[index] ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : index === currentSystem ? (
                            <Gauge className="h-5 w-5 text-blue-600 animate-pulse" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                          )}
                          <div>
                            <h4 className="font-bold text-sm">{s.name}</h4>
                            <p className="text-xs text-gray-600">{s.points} CF</p>
                          </div>
                        </div>
                        <Badge className={`text-xs ${
                          s.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          s.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {s.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="brass-frame bg-gradient-to-br from-purple-50/95 to-pink-50/95 backdrop-blur-md border-4 border-purple-700/30">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-900">
                  <Zap className="h-5 w-5 mr-2" />
                  How to Calibrate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-purple-800">
                  <div className="p-3 bg-purple-100/50 rounded-lg">
                    <p className="font-bold mb-2">Objective:</p>
                    <p>Find values of x and y that satisfy both equations simultaneously (intersection point).</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>1.</strong> Adjust Valve 1 (x-axis)</p>
                    <p><strong>2.</strong> Adjust Valve 2 (y-axis)</p>
                    <p><strong>3.</strong> Watch the graph point move</p>
                    <p><strong>4.</strong> Find where both lines intersect</p>
                    <p><strong>5.</strong> System calibrates when point is on both lines</p>
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