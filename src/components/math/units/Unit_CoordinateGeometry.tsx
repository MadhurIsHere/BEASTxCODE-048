import React from 'react';
import { ArrowLeft, PlayCircle, Sparkles, Grid3X3, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface UnitCoordinateGeometryProps {
  language: Language;
  onBack: () => void;
  onSelectSubtopic: (subtopicId: string) => void;
}

const subtopicData = {
  'straight-lines': {
    title: { 
      en: 'Straight Lines', 
      hi: 'सरल रेखाएं', 
      or: 'ସରଳ ରେଖା' 
    },
    description: { 
      en: 'Equations of lines, slopes, and intersections',
      hi: 'रेखाओं के समीकरण, ढलान और प्रतिच्छेदन',
      or: 'ରେଖାର ସମୀକରଣ, ଢଲାଣ ଏବଂ ପ୍ରତିଛେଦ'
    },
    duration: '60 min',
    difficulty: 'Intermediate',
    completed: false
  },
  'conic-sections': {
    title: { 
      en: 'Conic Sections', 
      hi: 'शंकु खंड', 
      or: 'ଶଙ୍କୁ ଖଣ୍ଡ' 
    },
    description: { 
      en: 'Circle, ellipse, parabola, and hyperbola',
      hi: 'वृत्त, दीर्घवृत्त, परवलय और अतिपरवलय',
      or: 'ବୃତ୍ତ, ଦୀର୍ଘବୃତ୍ତ, ପାରାବୋଲା ଏବଂ ହାଇପରବୋଲା'
    },
    duration: '75 min',
    difficulty: 'Advanced',
    completed: false
  }
};

const translations = {
  title: {
    en: 'Unit III: Coordinate Geometry',
    hi: 'इकाई III: निर्देशांक ज्यामिति',
    or: 'ଏକକ III: ସଂଯୋଜିତ ଜ୍ୟାମିତି'
  },
  selectTopic: {
    en: 'Explore geometric shapes through coordinates',
    hi: 'निर्देशांकों के माध्यम से ज्यामितीय आकृतियों का अन्वेषण करें',
    or: 'ସଂଯୋଜିତ ମାଧ୍ୟମରେ ଜ୍ୟାମିତିକ ଆକୃତି ଅନୁସନ୍ଧାନ କରନ୍ତୁ'
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

export function UnitCoordinateGeometry({ language, onBack, onSelectSubtopic }: UnitCoordinateGeometryProps) {
  const handleGetStarted = (subtopicId: string) => {
    onSelectSubtopic(`${subtopicId}-theory`);
  };

  const getSubtopicIcon = (index: number) => {
    const icons = [Grid3X3, Circle];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  const getSubtopicGradient = (index: number) => {
    const gradients = [
      'from-violet-400 to-purple-500',
      'from-rose-400 to-pink-500'
    ];
    return gradients[index % gradients.length];
  };

  const getButtonGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700',
      'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
    ];
    return gradients[index % gradients.length];
  };

  const getProgressGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-violet-400 to-purple-500',
      'bg-gradient-to-r from-rose-400 to-pink-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-pink-100 p-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-12 w-32 h-32 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-48 right-20 w-28 h-28 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-xl animate-float delay-300"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full blur-xl animate-float delay-500"></div>
        <div className="absolute bottom-20 right-16 w-30 h-30 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-xl animate-float delay-700"></div>
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
            <h1 className="text-2xl font-medium bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
              {translations.title[language]}
            </h1>
          </div>
        </div>

        {/* Instruction */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-violet-200/50">
            <Grid3X3 className="h-5 w-5 text-violet-600" />
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
                      <Badge variant="secondary" className="text-xs bg-white/60 backdrop-blur-sm border border-violet-200/50">
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