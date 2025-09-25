import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Star } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import type { Language } from '../../../types/onboarding';

interface SimpleMathGameProps {
  language: Language;
  onBack: () => void;
  onComplete?: (score: number, xpEarned: number) => void;
}

export function SimpleMathGame({ language, onBack, onComplete }: SimpleMathGameProps) {
  const [phase, setPhase] = useState<'intro' | 'compare' | 'result' | 'complete'>('intro');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({ 
    num1: Math.floor(Math.random() * 9) + 1, 
    num2: Math.floor(Math.random() * 9) + 1 
  });

  const startGame = () => setPhase('compare');
  
  const selectAnswer = (isGreater: boolean) => {
    const correct = currentQuestion.num1 > currentQuestion.num2 ? isGreater : !isGreater;
    if (correct) {
      setScore(100);
      setPhase('result');
    } else {
      setPhase('result');
    }
    
    setTimeout(() => {
      setPhase('complete');
    }, 2000);
  };

  const finish = () => {
    onComplete?.(score, 50);
  };

  // Intro Screen
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-sm bg-purple-900/80 border-purple-400/30">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🔢</div>
            <h1 className="text-xl font-bold text-white mb-3">
              {language === 'en' ? 'Math Game' : language === 'hi' ? 'गणित खेल' : 'ଗଣିତ ଖେଳ'}
            </h1>
            <p className="text-purple-200 mb-4 text-sm">
              {language === 'en' ? 'Which number is bigger? Compare and choose!' : 
               language === 'hi' ? 'कौन सी संख्या बड़ी है? तुलना करें और चुनें!' : 
               'କେଉଁ ସଂଖ୍ୟା ବଡ଼? ତୁଳନା କରନ୍ତୁ ଏବଂ ବାଛନ୍ତୁ!'}
            </p>
            <div className="bg-purple-800/50 rounded-lg p-3 mb-4">
              <h3 className="text-yellow-300 font-bold text-sm mb-2">
                {language === 'en' ? '🔢 Number Skills' : language === 'hi' ? '🔢 संख्या कौशल' : '🔢 ସଂଖ୍ୟା ଦକ୍ଷତା'}
              </h3>
              <p className="text-purple-100 text-xs leading-relaxed">
                {language === 'en' ? 'Comparing numbers helps build math foundation for all grades!' : 
                 language === 'hi' ? 'संख्याओं की तुलना सभी कक्षाओं के लिए गणित की नींव बनाने में मदद करती है!' : 
                 'ସଂଖ୍ୟା ତୁଳନା ସମସ୍ତ ଶ୍ରେଣୀ ପାଇଁ ଗଣିତ ଭିତ୍ତି ନିର୍ମାଣରେ ସାହାଯ୍ୟ କରେ!'}
              </p>
            </div>
            <Button onClick={startGame} className="w-full bg-purple-500 hover:bg-purple-600 mb-3">
              <Play className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Start!' : language === 'hi' ? 'शुरू करें!' : 'ଆରମ୍ଭ କରନ୍ତୁ!'}
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full text-purple-200 border-purple-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back' : language === 'hi' ? 'वापस' : 'ପଛକୁ'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Compare Phase
  if (phase === 'compare') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-sm bg-purple-900/80 border-purple-400/30">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-bold text-white mb-6">
              {language === 'en' ? 'Which is Bigger?' : language === 'hi' ? 'कौन सा बड़ा है?' : 'କେଉଁଟି ବଡ଼?'}
            </h2>
            
            <div className="flex justify-center items-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-purple-300 mb-2">{currentQuestion.num1}</div>
              </div>
              
              <div className="text-2xl text-white">vs</div>
              
              <div className="text-center">
                <div className="text-6xl font-bold text-pink-300 mb-2">{currentQuestion.num2}</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => selectAnswer(true)} 
                className="w-full bg-purple-500 hover:bg-purple-600 text-lg py-3"
              >
                {currentQuestion.num1} {language === 'en' ? 'is bigger' : language === 'hi' ? 'बड़ा है' : 'ବଡ଼'}
              </Button>
              
              <Button 
                onClick={() => selectAnswer(false)} 
                className="w-full bg-pink-500 hover:bg-pink-600 text-lg py-3"
              >
                {currentQuestion.num2} {language === 'en' ? 'is bigger' : language === 'hi' ? 'बड़ा है' : 'ବଡ଼'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Result Phase
  if (phase === 'result') {
    const isCorrect = score > 0;
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-sm bg-purple-900/80 border-purple-400/30">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">
              {isCorrect ? '🎉' : '😅'}
            </div>
            
            <h2 className="text-xl font-bold text-white mb-4">
              {isCorrect 
                ? (language === 'en' ? 'Correct!' : language === 'hi' ? 'सही!' : 'ଠିକ!') 
                : (language === 'en' ? 'Try Again!' : language === 'hi' ? 'फिर से कोशिश करें!' : 'ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ!')
              }
            </h2>
            
            <p className="text-purple-200 text-sm">
              {currentQuestion.num1 > currentQuestion.num2 
                ? `${currentQuestion.num1} ${language === 'en' ? 'is bigger than' : language === 'hi' ? 'से बड़ा है' : 'ଠାରୁ ବଡ଼'} ${currentQuestion.num2}` 
                : `${currentQuestion.num2} ${language === 'en' ? 'is bigger than' : language === 'hi' ? 'से बड़ा है' : 'ଠାରୁ ବଡ଼'} ${currentQuestion.num1}`
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Complete Phase
  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-pink-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-sm bg-purple-900/80 border-purple-400/30">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🏆</div>
            
            <h2 className="text-xl font-bold text-white mb-4">
              {language === 'en' ? 'Math Champion!' : language === 'hi' ? 'गणित चैंपियन!' : 'ଗଣିତ ଚାମ୍ପିଅନ!'}
            </h2>
            
            <div className="bg-yellow-400/20 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{score} Points</span>
              </div>
            </div>
            
            <Button onClick={finish} className="w-full bg-purple-500 hover:bg-purple-600">
              {language === 'en' ? 'Continue' : language === 'hi' ? 'जारी रखें' : 'ଜାରି ରଖନ୍ତୁ'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}