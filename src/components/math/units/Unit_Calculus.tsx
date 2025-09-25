import React from 'react';
import { ArrowLeft, PlayCircle, Sparkles, TrendingUp, Infinity, BarChart3, Sigma } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface UnitCalculusProps {
  language: Language;
  onBack: () => void;
  onSelectSubtopic: (subtopicId: string) => void;
}

const subtopicData = {
  'limits-continuity': {
    title: { 
      en: 'Limits and Continuity', 
      hi: 'सीमा और निरंतरता', 
      or: 'ସୀମା ଏବଂ ନିରନ୍ତରତା' 
    },
    description: { 
      en: 'Understanding limits, continuity, and discontinuity',
      hi: 'सीमा, निरंतरता और विच्छिन्नता को समझना',
      or: 'ସୀମା, ନିରନ୍ତରତା ଏବଂ ବିଚ୍ଛିନ୍ନତା ବୁଝିବା'
    },
    duration: '70 min',
    difficulty: 'Intermediate',
    completed: false
  },
  'differentiation': {
    title: { 
      en: 'Differentiation', 
      hi: 'अवकलन', 
      or: 'ଅବକଳନ' 
    },
    description: { 
      en: 'Derivatives, rules of differentiation, and techniques',
      hi: 'अवकलज, अवकलन के नियम और तकनीकें',
      or: 'ଅବକଳଜ, ଅବକଳନର ନିୟମ ଏବଂ କ୍ଷେତ୍ରଗୁଡିକ'
    },
    duration: '80 min',
    difficulty: 'Intermediate',
    completed: false
  },
  'applications-derivatives': {
    title: { 
      en: 'Applications of Derivatives', 
      hi: 'अवकलज के अनुप्रयोग', 
      or: 'ଅବକଳଜର ପ୍ରୟୋଗ' 
    },
    description: { 
      en: 'Maxima, minima, and rate of change problems',
      hi: 'अधिकतम, न्यूनतम और परिवर्तन की दर की समस्याएं',
      or: 'ଅଧିକତମ, ନ୍ୟୂନତମ ଏବଂ ପରିବର୍ତ୍ତନ ଦର ସମସ୍ୟା'
    },
    duration: '75 min',
    difficulty: 'Advanced',
    completed: false
  },
  'integration': {
    title: { 
      en: 'Integration', 
      hi: 'समाकलन', 
      or: 'ସମାକଳନ' 
    },
    description: { 
      en: 'Indefinite integrals, substitution, and integration techniques',
      hi: 'अनिश्चित समाकलन, प्रतिस्थापन और समाकलन तकनीकें',
      or: 'ଅନିଶ୍ଚିତ ସମାକଳ, ପ୍ରତିସ୍ଥାପନ ଏବଂ ସମାକଳନ କ�ଵଳତା'
    },
    duration: '85 min',
    difficulty: 'Advanced',
    completed: false
  }
};

const translations = {
  title: {
    en: 'Unit IV: Calculus',
    hi: 'इकाई IV: कलन',
    or: 'ଏକକ IV: କାଲକୁଲସ୍'
  },
  selectTopic: {
    en: 'Master the fundamentals of calculus',
    hi: 'कलन की मूलभूत बातों में महारत हासिल करें',
    or: 'କାଲକୁଲସ୍ର ମୌଳିକ ବିଷୟଗୁଡ଼ିକରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ'
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

export function UnitCalculus({ language, onBack, onSelectSubtopic }: UnitCalculusProps) {
  const handleGetStarted = (subtopicId: string) => {
    onSelectSubtopic(`${subtopicId}-theory`);
  };

  const getSubtopicIcon = (index: number) => {
    const icons = [Infinity, TrendingUp, BarChart3, Sigma];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  const getSubtopicGradient = (index: number) => {
    const gradients = [
      'from-orange-400 to-red-500',
      'from-amber-400 to-orange-500',
      'from-red-400 to-rose-500',
      'from-yellow-400 to-amber-500'
    ];
    return gradients[index % gradients.length];
  };

  const getButtonGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
      'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
      'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
      'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
    ];
    return gradients[index % gradients.length];
  };

  const getProgressGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-orange-400 to-red-500',
      'bg-gradient-to-r from-amber-400 to-orange-500',
      'bg-gradient-to-r from-red-400 to-rose-500',
      'bg-gradient-to-r from-yellow-400 to-amber-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-red-100 p-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-24 left-16 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-24 w-28 h-28 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-xl animate-float delay-300"></div>
        <div className="absolute bottom-32 left-24 w-36 h-36 bg-gradient-to-br from-red-200/30 to-rose-200/30 rounded-full blur-xl animate-float delay-500"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-xl animate-float delay-700"></div>
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
            <h1 className="text-2xl font-medium bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent">
              {translations.title[language]}
            </h1>
          </div>
        </div>

        {/* Instruction */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-orange-200/50">
            <TrendingUp className="h-5 w-5 text-orange-600" />
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
                      <Badge variant="secondary" className="text-xs bg-white/60 backdrop-blur-sm border border-orange-200/50">
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