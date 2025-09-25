import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ArrowLeft, Compass, Cog, Target, Zap, Star, Trophy, CheckCircle2, RotateCcw, Play, Pause } from 'lucide-react';
import type { Language } from '../../../types/onboarding';

interface AutomatonPathfindingGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

interface Point {
  x: number;
  y: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Mission {
  id: number;
  title: string;
  description: string;
  start: Point;
  target: Point;
  obstacles: Obstacle[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
}

export function AutomatonPathfindingGame({ language, onBack, onComplete }: AutomatonPathfindingGameProps) {
  const [currentMission, setCurrentMission] = useState(0);
  const [path, setPath] = useState<Point[]>([]);
  const [automatonPosition, setAutomatonPosition] = useState<Point>({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<boolean[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [cogwheelFragments, setCogwheelFragments] = useState(150);
  const [steamPressure, setSteamPressure] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const missions: Mission[] = [
    {
      id: 1,
      title: 'Steam Delivery Route',
      description: 'Navigate the automaton from the furnace to the pressure valve',
      start: { x: 50, y: 50 },
      target: { x: 350, y: 250 },
      obstacles: [
        { x: 150, y: 100, width: 50, height: 100 },
        { x: 250, y: 150, width: 80, height: 40 }
      ],
      difficulty: 'Easy',
      points: 100
    },
    {
      id: 2,
      title: 'Gear Component Transport',
      description: 'Deliver precision gears through the workshop maze',
      start: { x: 30, y: 200 },
      target: { x: 370, y: 80 },
      obstacles: [
        { x: 100, y: 120, width: 40, height: 120 },
        { x: 200, y: 60, width: 60, height: 80 },
        { x: 280, y: 160, width: 50, height: 70 },
        { x: 150, y: 260, width: 100, height: 40 }
      ],
      difficulty: 'Medium',
      points: 200
    },
    {
      id: 3,
      title: 'Emergency Repair Mission',
      description: 'Rush to fix the main clockwork mechanism before time runs out',
      start: { x: 20, y: 280 },
      target: { x: 380, y: 40 },
      obstacles: [
        { x: 80, y: 160, width: 30, height: 120 },
        { x: 140, y: 80, width: 60, height: 60 },
        { x: 220, y: 200, width: 40, height: 80 },
        { x: 300, y: 120, width: 50, height: 100 },
        { x: 160, y: 220, width: 80, height: 30 },
        { x: 320, y: 60, width: 40, height: 60 }
      ],
      difficulty: 'Hard',
      points: 350
    }
  ];

  const gridSize = 20;
  const canvasWidth = 400;
  const canvasHeight = 300;

  useEffect(() => {
    setCompletedMissions(new Array(missions.length).fill(false));
    resetMission();
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [currentMission, path, automatonPosition]);

  const resetMission = () => {
    const mission = missions[currentMission];
    setPath([mission.start]);
    setAutomatonPosition(mission.start);
    setIsAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    const mission = missions[currentMission];

    // Draw obstacles
    ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 2;
    mission.obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      // Add gear pattern to obstacles
      const centerX = obstacle.x + obstacle.width / 2;
      const centerY = obstacle.y + obstacle.height / 2;
      drawGear(ctx, centerX, centerY, Math.min(obstacle.width, obstacle.height) / 4);
    });

    // Draw start point (furnace)
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(mission.start.x, mission.start.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Add furnace symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🔥', mission.start.x, mission.start.y + 5);

    // Draw target point (valve)
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(mission.target.x, mission.target.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Add target symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎯', mission.target.x, mission.target.y + 5);

    // Draw path
    if (path.length > 1) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw path points
      path.forEach((point, index) => {
        if (index === 0) return;
        ctx.fillStyle = '#0891b2';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw automaton
    drawAutomaton(ctx, automatonPosition.x, automatonPosition.y);
  };

  const drawGear = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    const teeth = 8;
    const outerRadius = radius;
    const innerRadius = radius * 0.7;

    ctx.fillStyle = 'rgba(180, 83, 9, 0.6)';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i / (teeth * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner circle
    ctx.fillStyle = 'rgba(146, 64, 14, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, innerRadius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawAutomaton = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Main body
    ctx.fillStyle = 'linear-gradient(135deg, #f59e0b, #d97706)';
    ctx.fillStyle = '#f59e0b';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.fillRect(x - 8, y - 8, 16, 16);
    ctx.strokeRect(x - 8, y - 8, 16, 16);

    // Steam pipes
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 8);
    ctx.lineTo(x - 6, y - 12);
    ctx.moveTo(x + 6, y - 8);
    ctx.lineTo(x + 6, y - 12);
    ctx.stroke();

    // Eyes/sensors
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(x - 3, y - 2, 2, 0, Math.PI * 2);
    ctx.arc(x + 3, y - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Gear symbol in center
    ctx.fillStyle = '#92400e';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⚙', x, y + 6);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isAnimating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Snap to grid
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;

    // Check if clicked point is valid (not in obstacle)
    const mission = missions[currentMission];
    const clickedInObstacle = mission.obstacles.some(obstacle => 
      snappedX >= obstacle.x && snappedX <= obstacle.x + obstacle.width &&
      snappedY >= obstacle.y && snappedY <= obstacle.y + obstacle.height
    );

    if (!clickedInObstacle) {
      setPath([...path, { x: snappedX, y: snappedY }]);
    }
  };

  const animateAutomaton = () => {
    if (path.length < 2) return;

    setIsAnimating(true);
    let currentPathIndex = 1;
    let progress = 0;
    const animationSpeed = 0.02;

    const animate = () => {
      if (currentPathIndex >= path.length) {
        setIsAnimating(false);
        checkMissionCompletion();
        return;
      }

      const start = path[currentPathIndex - 1];
      const end = path[currentPathIndex];

      progress += animationSpeed;

      if (progress >= 1) {
        progress = 0;
        currentPathIndex++;
      }

      const x = start.x + (end.x - start.x) * progress;
      const y = start.y + (end.y - start.y) * progress;

      setAutomatonPosition({ x, y });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const checkMissionCompletion = () => {
    const mission = missions[currentMission];
    const distance = Math.sqrt(
      Math.pow(automatonPosition.x - mission.target.x, 2) + 
      Math.pow(automatonPosition.y - mission.target.y, 2)
    );

    if (distance < 20) {
      // Mission completed!
      const newScore = score + mission.points;
      const earnedXP = mission.points / 2;
      const newXP = totalXP + earnedXP;
      const newFragments = cogwheelFragments + (mission.points / 5);

      setScore(newScore);
      setTotalXP(newXP);
      setCogwheelFragments(newFragments);

      const newCompleted = [...completedMissions];
      newCompleted[currentMission] = true;
      setCompletedMissions(newCompleted);

      // Check if all missions completed
      if (newCompleted.every(Boolean)) {
        setTimeout(() => onComplete(newScore, newXP), 2000);
      }
    }
  };

  const nextMission = () => {
    if (currentMission < missions.length - 1) {
      setCurrentMission(currentMission + 1);
      resetMission();
    }
  };

  const prevMission = () => {
    if (currentMission > 0) {
      setCurrentMission(currentMission - 1);
      resetMission();
    }
  };

  const mission = missions[currentMission];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Steampunk Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute brass-gear animate-clockwork-spin"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              fontSize: `${1 + Math.random() * 2}rem`,
              opacity: 0.1
            }}
          >
            ⚙
          </div>
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
                  {language === 'en' ? 'Automaton Pathfinding' : language === 'hi' ? 'ऑटोमेटन पाथफाइंडिंग' : 'ଅଟୋମେଟନ ପାଥଫାଇଣ୍ଡିଂ'}
                </h1>
                <p className="text-amber-700">
                  {language === 'en' ? 'Navigate through the Coordinate Grid Workshop' : language === 'hi' ? 'समन्वय ग्रिड कार्यशाला के माध्यम से नेविगेट करें' : 'କୋଅର୍ଡିନେଟ ଗ୍ରିଡ କର୍ମଶାଳା ମାଧ୍ୟମରେ ନେଭିଗେଟ କରନ୍ତୁ'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="brass-gauge flex items-center space-x-2">
                <Cog className="h-5 w-5 text-amber-700 animate-clockwork-spin" />
                <span className="text-amber-800 font-bold">{cogwheelFragments} CF</span>
              </div>
              <div className="brass-gauge flex items-center space-x-2">
                <Star className="h-5 w-5 text-purple-700" />
                <span className="text-purple-800 font-bold">{totalXP} XP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Game Canvas */}
          <div className="xl:col-span-2">
            <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-amber-900">
                  <div className="flex items-center">
                    <Compass className="h-6 w-6 mr-3 animate-clockwork-spin" />
                    {mission.title}
                  </div>
                  <Badge className={`${
                    mission.difficulty === 'Easy' ? 'bg-green-500/20 text-green-700 border-green-400/30' :
                    mission.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-400/30' :
                    'bg-red-500/20 text-red-700 border-red-400/30'
                  }`}>
                    {mission.difficulty}
                  </Badge>
                </CardTitle>
                <p className="text-amber-700">{mission.description}</p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                    className="border-2 border-amber-600/30 rounded-lg bg-gradient-to-br from-amber-100/30 to-orange-100/30 cursor-crosshair brass-frame"
                    onClick={handleCanvasClick}
                  />
                  
                  {isAnimating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                      <div className="brass-frame bg-amber-100/90 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Cog className="h-5 w-5 text-amber-700 animate-clockwork-spin" />
                          <span className="text-amber-800 font-bold">Automaton Moving...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-2">
                    <Button
                      onClick={resetMission}
                      className="brass-button bg-orange-500/20 hover:bg-orange-500/30 text-orange-700 border border-orange-400/30"
                      disabled={isAnimating}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Path
                    </Button>
                    <Button
                      onClick={animateAutomaton}
                      className="brass-button bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 border border-blue-400/30"
                      disabled={isAnimating || path.length < 2}
                    >
                      {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isAnimating ? 'Moving' : 'Start Journey'}
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={prevMission}
                      variant="outline"
                      className="brass-button"
                      disabled={currentMission === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={nextMission}
                      variant="outline"
                      className="brass-button"
                      disabled={currentMission === missions.length - 1 || !completedMissions[currentMission]}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission Progress & Instructions */}
          <div className="space-y-6">
            {/* Mission Progress */}
            <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95 backdrop-blur-md border-4 border-amber-700/30">
              <CardHeader>
                <CardTitle className="flex items-center text-amber-900">
                  <Trophy className="h-5 w-5 mr-2 animate-treasure-shine" />
                  Workshop Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {missions.map((m, index) => (
                    <div key={m.id} className={`p-3 rounded-lg brass-frame ${
                      index === currentMission ? 'bg-blue-100/50 border-blue-400/30' : 
                      completedMissions[index] ? 'bg-green-100/50 border-green-400/30' : 
                      'bg-gray-100/30 border-gray-400/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {completedMissions[index] ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : index === currentMission ? (
                            <Target className="h-5 w-5 text-blue-600 animate-pulse" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                          )}
                          <div>
                            <h4 className="font-bold text-sm">{m.title}</h4>
                            <p className="text-xs text-gray-600">{m.points} CF</p>
                          </div>
                        </div>
                        <Badge className={`text-xs ${
                          m.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          m.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {m.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="brass-frame bg-gradient-to-br from-blue-50/95 to-cyan-50/95 backdrop-blur-md border-4 border-blue-700/30">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Compass className="h-5 w-5 mr-2" />
                  Navigation Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">🔥</span>
                    <span>Start point (furnace)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 font-bold">🎯</span>
                    <span>Target destination</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">⚙</span>
                    <span>Your automaton</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 bg-amber-600 border border-amber-700 mt-0.5"></div>
                    <span>Obstacles (avoid these)</span>
                  </div>
                  <div className="mt-4 p-3 bg-blue-100/50 rounded-lg">
                    <p className="font-bold mb-2">How to Play:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Click on the grid to plot your path</li>
                      <li>Avoid obstacles (gear mechanisms)</li>
                      <li>Click "Start Journey" to animate</li>
                      <li>Reach the target to complete the mission</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="brass-frame bg-gradient-to-br from-purple-50/95 to-pink-50/95 backdrop-blur-md border-4 border-purple-700/30">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-900">
                  <Zap className="h-5 w-5 mr-2" />
                  Workshop Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Total Score:</span>
                    <span className="font-bold text-purple-900">{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Missions Completed:</span>
                    <span className="font-bold text-purple-900">{completedMissions.filter(Boolean).length}/{missions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Steam Pressure:</span>
                    <span className="font-bold text-purple-900">{steamPressure}%</span>
                  </div>
                  <Progress value={(completedMissions.filter(Boolean).length / missions.length) * 100} className="h-3 brass-progress-bar" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}