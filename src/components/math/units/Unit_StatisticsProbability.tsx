import React from 'react';
import { ArrowLeft, PlayCircle, Sparkles, BarChart3, Dice6 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface UnitStatisticsProbabilityProps {
  language: Language;
  onBack: () => void;
  onSelectSubtopic: (subtopicId: string) => void;
}

const subtopicData = {
  'statistics': {
    title: { 
      en: 'Statistics', 
      hi: 'सांख्यिकी', 
      or: 'ପରିସଂଖ୍ୟାନ' 
    },
    description: { 
      en: 'Measures of central tendency and dispersion',
      hi: 'केंद्रीय प्रवृत्ति और विकिरण के उपाय',
      or: 'କେନ୍ଦ୍ରୀୟ ପ୍ରବୃତ୍ତି ଏବଂ ବିକିରଣର ମାପ'
    },
    duration: '65 min',
    difficulty: 'Intermediate',
    completed: false
  },
  'probability': {
    title: { 
      en: 'Probability', 
      hi: 'प्रायिकता', 
      or: 'ସମ୍ଭାବନା' 
    },
    description: { 
      en: 'Basic probability concepts and conditional probability',
      hi: 'मूलभूत प्रायिकता अवधारणाएं और सशर्त प्रायिकता',
      or: 'ମୌଳିକ ସମ୍ଭାବନା ଧାରଣା ଏବଂ ସର୍ତ୍ତମୂଳକ ସମ୍ଭାବନା'
    },
    duration: '70 min',
    difficulty: 'Intermediate',
    completed: false
  }
};

const translations = {
  title: {
    en: 'Unit VI: Statistics and Probability',
    hi: 'इकाई VI: सांख्यिकी और प्रायिकता',
    or: 'ଏକକ VI: ପରିସଂଖ୍ୟାନ ଏବଂ ସମ୍ଭାବନା'
  },
  selectTopic: {
    en: 'Analyze data and explore probability concepts',
    hi: 'डेटा का विश्लेषण करें और प्रायिकता अवधारणाओं का अन्वेषण करें',
    or: 'ତଥ୍ୟ ବିଶ୍ଳେଷଣ କରନ୍ତୁ ଏବଂ ସମ୍ଭାବନା ଧାରଣା ଅନୁସନ୍ଧାନ କରନ୍ତୁ'
  },
  getStarted: {
    en: 'Get Started',
    hi: 'शुरू करें',
    or: 'ଆରମ୍ଭ କରନ୍ତୁ'
  },
  interactiveContent: {
    en: 'Interactive theory, examples, animations & quizzes',
    hi: 'इंटरैक्टिव सिद्धांत, उदाहरण, एनीमेशन और क्विज़',
    or: 'ଇଣ୍ଟରାକ୍ଟିଭ ସିଦ୍ଧାନ୍ତ, ଉଦାହରଣ, ଆନିମେସନ୍ ଏବଂ କୁଇଜ୍'
  }
};

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800'
};

export function UnitStatisticsProbability({ language, onBack, onSelectSubtopic }: UnitStatisticsProbabilityProps) {
  const handleGetStarted = (subtopicId: string) => {
    onSelectSubtopic(`${subtopicId}-theory`);
  };

  const getSubtopicIcon = (index: number) => {
    const icons = [BarChart3, Dice6];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  const getSubtopicGradient = (index: number) => {
    const gradients = [
      'from-indigo-400 to-blue-500',
      'from-blue-400 to-cyan-500'
    ];
    return gradients[index % gradients.length];
  };

  const getButtonGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700',
      'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
    ];
    return gradients[index % gradients.length];
  };

  const getProgressGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-indigo-400 to-blue-500',
      'bg-gradient-to-r from-blue-400 to-cyan-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 p-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-12 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-48 right-16 w-28 h-28 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-xl animate-float delay-300"></div>
        <div className="absolute bottom-32 left-20 w-36 h-36 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-xl animate-float delay-500"></div>
        <div className="absolute bottom-20 right-24 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-violet-200/30 rounded-full blur-xl animate-float delay-700"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-medium bg-gradient-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent">
              {translations.title[language]}
            </h1>
          </div>
        </div>

        {/* Instruction */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-indigo-200/50">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <p className="text-gray-700 font-medium">
              {translations.selectTopic[language]}
            </p>
          </div>
        </div>

        {/* Subtopics */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {Object.entries(subtopicData).map(([subtopicId, subtopic], index) => {
            const IconComponent = getSubtopicIcon(index);
            return (
              <Card 
                key={subtopicId} 
                className="group hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:scale-[1.02] overflow-hidden"
              >
                {/* Card Gradient Border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${getSubtopicGradient(index)} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${getSubtopicGradient(index)} text-white shadow-lg`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        {subtopic.title[language]}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs bg-white/60 backdrop-blur-sm border border-indigo-200/50">
                        {subtopic.duration}
                      </Badge>
                      <Badge className={`text-xs ${difficultyColors[subtopic.difficulty as keyof typeof difficultyColors]} border-0 shadow-sm`}>
                        {subtopic.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {subtopic.description[language]}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Sparkles className="h-4 w-4" />
                      <span>{translations.interactiveContent[language]}</span>
                    </div>
                  </div>
                  
                  {/* Single Get Started Button */}
                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={() => handleGetStarted(subtopicId)}
                      className={`w-full py-4 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] ${getButtonGradient(index)} text-white border-0 rounded-xl`}
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-5 w-5" />
                        {translations.getStarted[language]}
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </Button>

                    {/* Progress */}
                    <div className="w-full bg-gray-200/60 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${getProgressGradient(index)}`}
                        style={{ width: subtopic.completed ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}