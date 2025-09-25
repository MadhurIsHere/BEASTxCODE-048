import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Star, CheckCircle, Eye, Search } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import type { Language } from '../../../types/onboarding';

interface BiologyLabGameProps {
  language: Language;
  onBack: () => void;
  onComplete?: (score: number, xpEarned: number) => void;
}

export function BiologyLabGame({ language, onBack, onComplete }: BiologyLabGameProps) {
  const [phase, setPhase] = useState<'intro' | 'explore' | 'find' | 'complete'>('intro');
  const [foundParts, setFoundParts] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const cellParts = [
    { 
      id: 'nucleus', 
      emoji: '🔵', 
      name: { en: 'Nucleus', hi: 'केंद्रक', or: 'ନ୍ୟୁକ୍ଲିଅସ' },
      function: { 
        en: 'Controls the cell and contains DNA', 
        hi: 'कोशिका को नियंत्रित करता है और DNA होता है', 
        or: 'କୋଷକୁ ନିୟନ୍ତ୍ରଣ କରେ ଏବଂ DNA ଧାରଣ କରେ' 
      }
    },
    { 
      id: 'membrane', 
      emoji: '🟡', 
      name: { en: 'Cell Membrane', hi: 'कोशिका झिल्ली', or: 'କୋଷ ଝିଲ୍ଲି' },
      function: { 
        en: 'Protects the cell and controls what goes in/out', 
        hi: 'कोशिका की रक्षा करती है और अंदर-बाहर जाने को नियंत्रित करती है', 
        or: 'କୋଷକୁ ରକ୍ଷା କରେ ଏବଂ ଭିତର-ବାହାର ଯିବାକୁ ନିୟନ୍ତ୍ରଣ କରେ' 
      }
    }
  ];

  const startExploring = () => setPhase('explore');
  
  const startFinding = () => setPhase('find');

  const findPart = (partId: string) => {
    if (!foundParts.includes(partId)) {
      setFoundParts([...foundParts, partId]);
      setScore(score + 50);
      
      if (foundParts.length + 1 >= cellParts.length) {
        setTimeout(() => setPhase('complete'), 1000);
      }
    }
  };

  const finish = () => {
    onComplete?.(score, 50);
  };

  // Intro Screen
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 to-teal-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-sm bg-green-900/80 border-green-400/30">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🔬</div>
            <h1 className="text-xl font-bold text-white mb-3">
              {language === 'en' ? 'Biology Lab' : language === 'hi' ? 'जीव विज्ञान प्रयोगशाला' : 'ଜୀବ ବିଜ୍ଞାନ ଲାବ'}
            </h1>
            <p className="text-green-200 mb-4 text-sm">
              {language === 'en' ? 'Use our virtual microscope to explore a plant cell!' : 
               language === 'hi' ? 'पौधे की कोशिका का अन्वेषण करने के लिए हमारे वर्चुअल माइक्रोस्कोप का उपयोग करें!' : 
               'ଉଦ୍ଭିଦ କୋଷ ଅନ୍ୱେଷଣ କରିବା ପାଇଁ ଆମର ଭର୍ଚୁଆଲ ମାଇକ୍ରୋସ୍କୋପ ବ୍ୟବହାର କରନ୍ତୁ!'}
            </p>
            
            {/* Educational Info Panel */}
            <div className="bg-green-800/50 rounded-lg p-3 mb-4">
              <h3 className="text-yellow-300 font-bold text-sm mb-2 flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                {language === 'en' ? 'About Cells' : language === 'hi' ? 'कोशिकाओं के बारे में' : 'କୋଷ ବିଷୟରେ'}
              </h3>
              <p className="text-green-100 text-xs leading-relaxed">
                {language === 'en' ? 'Cells are the basic building blocks of all living things. Each part has a special job!' : 
                 language === 'hi' ? 'कोशिकाएं सभी जीवित चीजों के मूल निर्माण खंड हैं। प्रत्येक भाग का एक विशेष काम होता है!' : 
                 'କୋଷମାନେ ସମସ୍ତ ଜୀବିତ ବସ୍ତୁର ମୂଳ ନିର୍ମାଣ ବ୍ଲକ। ପ୍ରତ୍ୟେକ ଅଂଶର ଏକ ବିଶେଷ କାମ ଅଛି!'}
              </p>
            </div>

            <Button onClick={startExploring} className="w-full bg-green-500 hover:bg-green-600 mb-3">
              <Play className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Start Exploring!' : language === 'hi' ? 'अन्वेषण शुरू करें!' : 'ଅନ୍ୱେଷଣ ଆରମ୍ଭ କରନ୍ତୁ!'}
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full text-green-200 border-green-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back' : language === 'hi' ? 'वापस' : 'ପଛକୁ'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Explore Phase
  if (phase === 'explore') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 to-teal-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-sm bg-green-900/80 border-green-400/30">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-bold text-white mb-4">
              {language === 'en' ? 'Virtual Microscope' : language === 'hi' ? 'वर्चुअल माइक्रोस्कोप' : 'ଭର୍ଚୁଆଲ ମାଇକ୍ରୋସ୍କୋପ'}
            </h2>
            
            {/* Microscope View */}
            <div className="relative bg-black rounded-full w-48 h-48 mx-auto mb-6 flex items-center justify-center border-4 border-green-300">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl"
              >
                🟢
              </motion.div>
              <motion.div
                animate={{ 
                  x: [0, 20, -20, 0],
                  y: [0, 10, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-8 left-8 text-2xl"
              >
                🔵
              </motion.div>
              <motion.div
                animate={{ 
                  x: [0, -15, 15, 0],
                  y: [0, -15, 15, 0]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute bottom-8 right-8 text-2xl"
              >
                🟡
              </motion.div>
            </div>

            <p className="text-green-200 mb-6 text-sm">
              {language === 'en' ? 'Look! This is a plant cell magnified 400x. Can you identify the parts?' : 
               language === 'hi' ? 'देखिए! यह 400x बढ़ाई गई पौधे की कोशिका है। क्या आप भागों को पहचान सकते हैं?' : 
               'ଦେଖନ୍ତୁ! ଏହା 400x ବଡ଼ କରାଯାଇଥିବା ଉଦ୍ଭିଦ କୋଷ। ଆପଣ ଅଂଶଗୁଡ଼ିକୁ ଚିହ୍ନଟ କରିପାରିବେ କି?'}
            </p>

            <Button onClick={startFinding} className="w-full bg-teal-500 hover:bg-teal-600 text-lg py-3">
              <Search className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Find Cell Parts!' : language === 'hi' ? 'कोशिका भाग खोजें!' : 'କୋଷ ଅଂଶ ଖୋଜନ୍ତୁ!'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Find Phase
  if (phase === 'find') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 to-teal-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-sm bg-green-900/80 border-green-400/30">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-bold text-white mb-4">
              {language === 'en' ? 'Identify Cell Parts' : language === 'hi' ? 'कोशिका भागों की पहचान करें' : 'କୋଷ ଅଂଶ ଚିହ୍ନଟ କରନ୍ତୁ'}
            </h2>
            
            <p className="text-green-200 mb-4 text-sm">
              {language === 'en' ? 'Tap each part to learn about it!' : 
               language === 'hi' ? 'इसके बारे में जानने के लिए प्रत्येक भाग पर टैप करें!' : 
               'ଏହା ବିଷୟରେ ଜାଣିବା ପାଇଁ ପ୍ରତ୍ୟେକ ଅଂଶରେ ଟ୍ୟାପ କରନ୍ତୁ!'}
            </p>

            <div className="space-y-3 mb-6">
              {cellParts.map((part) => {
                const isFound = foundParts.includes(part.id);
                return (
                  <motion.button
                    key={part.id}
                    onClick={() => findPart(part.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-300 ${
                      isFound 
                        ? 'bg-green-500/50 border-green-300 cursor-default' 
                        : 'bg-green-800/50 border-green-400 hover:bg-green-700/50 hover:scale-105'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    disabled={isFound}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{part.emoji}</span>
                      <div className="text-left flex-1">
                        <p className="text-white font-bold text-sm">{part.name[language]}</p>
                        {isFound && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-green-200 text-xs mt-1"
                          >
                            {part.function[language]}
                          </motion.p>
                        )}
                      </div>
                      {isFound && (
                        <CheckCircle className="w-5 h-5 text-green-300" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="text-green-200 text-sm">
              {language === 'en' ? `Found: ${foundParts.length}/${cellParts.length} parts` : 
               language === 'hi' ? `मिले: ${foundParts.length}/${cellParts.length} भाग` : 
               `ମିଳିଲା: ${foundParts.length}/${cellParts.length} ଅଂଶ`}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Complete Phase
  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 to-teal-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-sm bg-green-900/80 border-green-400/30">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🏆</div>
            
            <h2 className="text-xl font-bold text-white mb-4">
              {language === 'en' ? 'Biology Expert!' : language === 'hi' ? 'जीव विज्ञान विशेषज्ञ!' : 'ଜୀବ ବିଜ୍ଞାନ ବିଶେଷଜ୍ଞ!'}
            </h2>
            
            <div className="bg-yellow-400/20 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{score} Points</span>
              </div>
              <p className="text-yellow-200 text-xs mt-2">
                {language === 'en' ? 'You successfully identified all cell parts!' : 
                 language === 'hi' ? 'आपने सफलतापूर्वक सभी कोशिका भागों की पहचान की!' : 
                 'ଆପଣ ସଫଳତାର ସହିତ ସମସ୍ତ କୋଷ ଅଂଶ ଚିହ୍ନଟ କରିଛନ୍ତି!'}
              </p>
            </div>

            {/* Knowledge Summary */}
            <div className="bg-green-800/50 rounded-lg p-3 mb-4">
              <h3 className="text-green-200 font-bold text-sm mb-2">
                {language === 'en' ? '🧠 What You Learned:' : language === 'hi' ? '🧠 आपने क्या सीखा:' : '🧠 ଆପଣ କଣ ଶିଖିଲେ:'}
              </h3>
              <ul className="text-green-100 text-xs space-y-1 text-left">
                {cellParts.map((part) => (
                  <li key={part.id} className="flex items-start gap-2">
                    <span>{part.emoji}</span>
                    <span>{part.name[language]}: {part.function[language]}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button onClick={finish} className="w-full bg-green-500 hover:bg-green-600">
              {language === 'en' ? 'Continue Learning' : language === 'hi' ? 'सीखना जारी रखें' : 'ଶିଖିବା ଜାରି ରଖନ୍ତୁ'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}