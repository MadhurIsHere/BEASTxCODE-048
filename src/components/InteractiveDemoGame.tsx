import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, X, FlaskConical, Microscope, Zap, Calculator, Cog } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import type { Language } from '../types/onboarding';

// Import our enhanced lab games
import { ChemistryLabGame } from './games/science/ChemistryLabGame';
import { BiologyLabGame } from './games/science/BiologyLabGame';
import { PhysicsLabGame } from './games/science/PhysicsLabGame';
import { SimpleMathGame } from './games/math/SimpleMathGame';
import { EngineeringLabGame } from './games/engineering/EngineeringLabGame';

interface InteractiveDemoGameProps {
  language: Language;
  onComplete: () => void;
  onClose: () => void;
}

type DemoGameType = 'chemistry' | 'biology' | 'physics' | 'math' | 'engineering' | 'selection';

export function InteractiveDemoGame({ language, onComplete, onClose }: InteractiveDemoGameProps) {
  const [currentDemo, setCurrentDemo] = useState<DemoGameType>('selection');

  const getT = (key: string, lang: Language): string => {
    const translations = {
      demoTitle: {
        en: 'Try Our Learning Labs!',
        hi: 'हमारी शिक्षण प्रयोगशालाओं को आजमाएं!',
        or: 'ଆମର ଶିକ୍ଷଣ ଲାବଗୁଡ଼ିକୁ ଚେଷ୍ଟା କରନ୍ତୁ!'
      },
      demoSubtitle: {
        en: 'Choose a lab to explore interactive STEM learning designed for mobile devices',
        hi: 'मोबाइल उपकरणों के लिए डिज़ाइन किए गए इंटरैक्टिव STEM शिक्षा का पता लगाने के लिए एक प्रयोगशाला चुनें',
        or: 'ମୋବାଇଲ ଡିଭାଇସ ପାଇଁ ଡିଜାଇନ କରାଯାଇଥିବା ଇଣ୍ଟରାକ୍ଟିଭ STEM ଶିକ୍ଷା ଅନ୍ୱେଷଣ କରିବାକୁ ଏକ ଲାବ ବାଛନ୍ତୁ'
      },
      chemistryLab: {
        en: 'Chemistry Lab',
        hi: 'रसायन प्रयोगशाला',
        or: 'ରସାୟନ ଲାବୋରେଟୋରୀ'
      },
      chemistryDesc: {
        en: 'Mix chemicals safely and create amazing reactions!',
        hi: 'रसायनों को सुरक्षित रूप से मिलाएं और अद्भुत अभिक्रियाएं बनाएं!',
        or: 'ରାସାୟନିକ ପଦାର୍ଥକୁ ସୁରକ୍ଷିତ ଭାବରେ ମିଶାନ୍ତୁ ଏବଂ ଅଦ୍ଭୁତ ଅଭିକ୍ରିୟା ସୃଷ୍ଟି କରନ୍ତୁ!'
      },
      biologyLab: {
        en: 'Biology Lab',
        hi: 'जीव विज्ञान प्रयोगशाला',
        or: 'ଜୀବ ବିଜ୍ଞାନ ଲାବୋରେଟୋରୀ'
      },
      biologyDesc: {
        en: 'Explore cells and life through our virtual microscope!',
        hi: 'हमारे वर्चुअल माइक्रोस्कोप के माध्यम से कोशिकाओं और जीवन का अन्वेषण करें!',
        or: 'ଆମର ଭର୍ଚୁଆଲ ମାଇକ୍ରୋସ୍କୋପ ମାଧ୍ୟମରେ କୋଷ ଏବଂ ଜୀବନ ଅନ୍ୱେଷଣ କରନ୍ତୁ!'
      },
      physicsLab: {
        en: 'Physics Lab',
        hi: 'भौतिक विज्ञान प्रयोगशाला',
        or: 'ଭୌତିକ ବିଜ୍ଞାନ ଲାବୋରେଟୋରୀ'
      },
      physicsDesc: {
        en: 'Discover gravity, motion, and forces with fun experiments!',
        hi: 'मजेदार प्रयोगों के साथ गुरुत्वाकर्षण, गति और बलों की खोज करें!',
        or: 'ମଜାଦାର ପରୀକ୍ଷଣ ସହିତ ମାଧ୍ୟାକର୍ଷଣ, ଗତି ଏବଂ ବଳ ଆବିଷ୍କାର କରନ୍ତୁ!'
      },
      mathLab: {
        en: 'Math Lab',
        hi: 'गणित प्रयोगशाला',
        or: 'ଗଣିତ ଲାବୋରେଟୋରୀ'
      },
      mathDesc: {
        en: 'Solve mathematical puzzles and explore patterns!',
        hi: 'गणितीय पहेलियां सुलझाएं और पैटर्न का अन्वेषण करें!',
        or: 'ଗାଣିତିକ ପଜଲ ସମାଧାନ କରନ୍ତୁ ଏବଂ ପ୍ୟାଟର୍ନ ଅନ୍ୱେଷଣ କରନ୍ତୁ!'
      },
      engineeringLab: {
        en: 'Engineering Lab',
        hi: 'इंजीनियरिंग प्रयोगशाला',
        or: 'ଇଞ୍ଜିନିୟରିଂ ଲାବୋରେଟୋରୀ'
      },
      engineeringDesc: {
        en: 'Design and build amazing structures and machines!',
        hi: 'अद्भुत संरचनाओं और मशीनों को डिज़ाइन और निर्माण करें!',
        or: 'ଅଦ୍ଭୁତ ସଂରଚନା ଏବଂ ମେସିନ ଡିଜାଇନ ଏବଂ ନିର୍ମାଣ କରନ୍ତୁ!'
      },
      backToSelection: {
        en: 'Back to Labs',
        hi: 'प्रयोगशालाओं में वापस',
        or: 'ଲାବକୁ ଫେରନ୍ତୁ'
      },
      close: {
        en: 'Close Demo',
        hi: 'डेमो बंद करें',
        or: 'ଡେମୋ ବନ୍ଦ କରନ୍ତୁ'
      }
    };
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  // Handle lab completion - return to selection
  const handleLabComplete = (score?: number, xp?: number) => {
    console.log('Lab completed with score:', score, 'XP:', xp);
    setCurrentDemo('selection');
  };

  // Handle back from lab - return to selection
  const handleLabBack = () => {
    setCurrentDemo('selection');
  };

  // Render current demo game
  if (currentDemo === 'chemistry') {
    return (
      <ChemistryLabGame
        language={language}
        onBack={handleLabBack}
        onComplete={handleLabComplete}
      />
    );
  }

  if (currentDemo === 'biology') {
    return (
      <BiologyLabGame
        language={language}
        onBack={handleLabBack}
        onComplete={handleLabComplete}
      />
    );
  }

  if (currentDemo === 'physics') {
    return (
      <PhysicsLabGame
        language={language}
        onBack={handleLabBack}
        onComplete={handleLabComplete}
      />
    );
  }

  if (currentDemo === 'math') {
    return (
      <SimpleMathGame
        language={language}
        onBack={handleLabBack}
        onComplete={handleLabComplete}
      />
    );
  }

  if (currentDemo === 'engineering') {
    return (
      <EngineeringLabGame
        language={language}
        onBack={handleLabBack}
        onComplete={handleLabComplete}
      />
    );
  }

  // Demo Selection Screen (Mobile-First Design)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-400/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Close Button */}
      <Button
        onClick={onClose}
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 z-50 bg-white/10 border-white/30 text-white hover:bg-white/20"
      >
        <X className="w-4 h-4" />
        {getT('close', language)}
      </Button>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-black text-white mb-3">
              {getT('demoTitle', language)}
            </h1>
            <p className="text-white/80 text-sm leading-relaxed">
              {getT('demoSubtitle', language)}
            </p>
          </motion.div>

          {/* Demo Game Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Chemistry Lab */}
            <Card 
              className="bg-white/10 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300 hover:scale-105"
              onClick={() => setCurrentDemo('chemistry')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
                    <FlaskConical className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">
                      🧪 {getT('chemistryLab', language)}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {getT('chemistryDesc', language)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Biology Lab */}
            <Card 
              className="bg-white/10 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300 hover:scale-105"
              onClick={() => setCurrentDemo('biology')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl">
                    <Microscope className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">
                      🔬 {getT('biologyLab', language)}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {getT('biologyDesc', language)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Physics Lab */}
            <Card 
              className="bg-white/10 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300 hover:scale-105"
              onClick={() => setCurrentDemo('physics')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">
                      ⚡ {getT('physicsLab', language)}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {getT('physicsDesc', language)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Math Studio */}
            <Card 
              className="bg-white/10 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300 hover:scale-105"
              onClick={() => setCurrentDemo('math')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">
                      🔢 {getT('mathLab', language)}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {getT('mathDesc', language)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engineering Lab */}
            <Card 
              className="bg-white/10 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300 hover:scale-105"
              onClick={() => setCurrentDemo('engineering')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                    <Cog className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">
                      ⚙️ {getT('engineeringLab', language)}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {getT('engineeringDesc', language)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Continue to Full App Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <Button
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 text-lg rounded-xl shadow-xl"
            >
              {language === 'en' ? '🚀 Start Learning Journey' : 
               language === 'hi' ? '🚀 सीखने की यात्रा शुरू करें' : 
               '🚀 ଶିକ୍ଷା ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}