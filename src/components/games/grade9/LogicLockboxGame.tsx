import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ArrowLeft, Lock, Unlock, CheckCircle2, AlertTriangle, Target, Star } from 'lucide-react';
import type { Language } from '../../../types/onboarding';

interface LogicLockboxGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

interface Lockbox {
  id: number;
  name: string;
  axioms: string[];
  correctOrder: number[];
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
}

export function LogicLockboxGame({ language, onBack, onComplete }: LogicLockboxGameProps) {
  const [currentBox, setCurrentBox] = useState(0);
  const [playerOrder, setPlayerOrder] = useState<number[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completedBoxes, setCompletedBoxes] = useState<boolean[]>([]);

  const lockboxes: Lockbox[] = [
    {
      id: 1,
      name: "Axiom Vault Alpha",
      axioms: [
        "A straight line segment can be drawn joining any two points",
        "Any straight line segment can be extended indefinitely in a straight line",
        "Given any straight line segment, a circle can be drawn having the segment as radius",
        "All right angles are congruent"
      ],
      correctOrder: [0, 1, 2, 3],
      description: "Arrange Euclid's first four axioms in logical order",
      difficulty: 'Easy',
      points: 200
    },
    {
      id: 2,
      name: "Postulate Chamber Beta",
      axioms: [
        "Through any two distinct points, exactly one line can be drawn",
        "A line segment has exactly one midpoint",
        "Any angle has exactly one angle bisector",
        "Through a point not on a line, exactly one parallel line can be drawn"
      ],
      correctOrder: [0, 1, 2, 3],
      description: "Order these fundamental geometric postulates",
      difficulty: 'Medium',
      points: 350
    }
  ];

  useEffect(() => {
    setCompletedBoxes(new Array(lockboxes.length).fill(false));
  }, []);

  const handleAxiomSelect = (index: number) => {
    if (playerOrder.includes(index)) return;
    setPlayerOrder([...playerOrder, index]);
  };

  const removeFromOrder = (orderIndex: number) => {
    const newOrder = [...playerOrder];
    newOrder.splice(orderIndex, 1);
    setPlayerOrder(newOrder);
  };

  const checkSolution = () => {
    const box = lockboxes[currentBox];
    const isCorrect = JSON.stringify(playerOrder) === JSON.stringify(box.correctOrder);
    
    setAttempts(prev => prev + 1);
    
    if (isCorrect) {
      setIsUnlocked(true);
      const newScore = score + box.points;
      setScore(newScore);
      
      const newCompleted = [...completedBoxes];
      newCompleted[currentBox] = true;
      setCompletedBoxes(newCompleted);
      
      if (newCompleted.every(Boolean)) {
        setTimeout(() => onComplete(newScore, newScore / 3), 2000);
      }
    }
  };

  const resetBox = () => {
    setPlayerOrder([]);
    setIsUnlocked(false);
    setAttempts(0);
  };

  const nextBox = () => {
    if (currentBox < lockboxes.length - 1) {
      setCurrentBox(currentBox + 1);
      resetBox();
    }
  };

  const box = lockboxes[currentBox];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Header */}
      <header className="brass-frame bg-gradient-to-r from-amber-100/95 via-orange-100/95 to-red-100/95 backdrop-blur-lg border-b-4 border-amber-800/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={onBack} variant="outline" className="brass-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Back to Guild' : 'Back'}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-amber-900">
                  {language === 'en' ? 'The Logic Lockbox' : 'तर्क बक्सा'}
                </h1>
                <p className="text-amber-700">
                  {language === 'en' ? 'Euclid\'s Geometry Axiom Chamber' : 'यूक्लिड की ज्यामिति स्वयंसिद्ध कक्ष'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-amber-500/20 text-amber-800">
                Score: {score}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="brass-frame bg-gradient-to-br from-amber-50/95 to-orange-50/95">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  {isUnlocked ? <Unlock className="h-6 w-6 mr-3 text-green-600" /> : <Lock className="h-6 w-6 mr-3 text-amber-700" />}
                  {box.name}
                </div>
                <Badge className={box.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                  {box.difficulty}
                </Badge>
              </CardTitle>
              <p className="text-amber-700">{box.description}</p>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Axioms to arrange */}
                <div>
                  <h3 className="font-bold text-amber-900 mb-4">Available Axioms:</h3>
                  <div className="space-y-3">
                    {box.axioms.map((axiom, index) => (
                      <button
                        key={index}
                        onClick={() => handleAxiomSelect(index)}
                        disabled={playerOrder.includes(index) || isUnlocked}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                          playerOrder.includes(index) 
                            ? 'bg-gray-200 border-gray-400 opacity-50 cursor-not-allowed'
                            : 'bg-blue-100 border-blue-300 hover:bg-blue-200 hover:border-blue-400 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start">
                          <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">
                            {index + 1}
                          </span>
                          <span className="text-blue-800">{axiom}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Player's arrangement */}
                <div>
                  <h3 className="font-bold text-amber-900 mb-4">Your Logical Order:</h3>
                  <div className="space-y-3 min-h-[300px]">
                    {playerOrder.map((axiomIndex, orderIndex) => (
                      <div key={orderIndex} className="p-4 bg-green-100 border-2 border-green-300 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">
                              {orderIndex + 1}
                            </span>
                            <span className="text-green-800">{box.axioms[axiomIndex]}</span>
                          </div>
                          {!isUnlocked && (
                            <Button
                              onClick={() => removeFromOrder(orderIndex)}
                              variant="outline"
                              size="sm"
                              className="ml-2"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {playerOrder.length === 0 && (
                      <div className="p-8 border-2 border-dashed border-amber-300 rounded-lg text-center">
                        <p className="text-amber-600">Click on axioms to arrange them in logical order</p>
                      </div>
                    )}
                  </div>

                  {/* Status and controls */}
                  <div className="mt-6 space-y-4">
                    {isUnlocked ? (
                      <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-6 w-6 text-green-600 mr-3" />
                          <div>
                            <h4 className="font-bold text-green-800">Lockbox Opened!</h4>
                            <p className="text-green-700">Perfect logical arrangement achieved</p>
                          </div>
                        </div>
                      </div>
                    ) : attempts > 0 && (
                      <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                        <div className="flex items-center">
                          <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                          <div>
                            <h4 className="font-bold text-red-800">Incorrect Order</h4>
                            <p className="text-red-700">Try rearranging the axioms</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Button
                        onClick={checkSolution}
                        disabled={playerOrder.length !== box.axioms.length || isUnlocked}
                        className="brass-button bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Test Lock
                      </Button>
                      
                      <Button
                        onClick={resetBox}
                        disabled={isUnlocked}
                        variant="outline"
                        className="brass-button"
                      >
                        Reset
                      </Button>
                      
                      {isUnlocked && currentBox < lockboxes.length - 1 && (
                        <Button
                          onClick={nextBox}
                          className="brass-button bg-green-500 hover:bg-green-600 text-white"
                        >
                          Next Lockbox
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}