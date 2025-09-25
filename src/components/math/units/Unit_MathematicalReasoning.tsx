import React from 'react';
import { ArrowLeft, PlayCircle, Sparkles, Brain, LogIn, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface UnitMathematicalReasoningProps {
  language: Language;
  onBack: () => void;
  onSelectSubtopic: (subtopicId: string) => void;
}

const subtopicData = {
  'statements': {
    title: { 
      en: 'Statements (Mathematical Logic)', 
      hi: 'कथन (गणितीय तर्क)', 
      or: 'ବକ୍ତବ୍ୟ (ଗାଣିତିକ ତର୍କ)' 
    },
    description: { 
      en: 'Understanding mathematical statements and logical operators',
      hi: 'गणितीय कथनों और तार्किक संचालकों को समझना',
      or: 'ଗାଣିତିକ ବକ୍ତବ୍ୟ ଏବଂ ତାର୍କିକ ଅପରେଟରଗୁଡ଼ିକୁ ବୁଝିବା'
    },
    duration: '50 min',
    difficulty: 'Beginner',
    completed: false
  },
  'implications': {
    title: { 
      en: 'Implications, Converse, Contrapositive', 
      hi: 'निहितार्थ, विलोम, प्रतिधनात्मक', 
      or: 'ନିହିତାର୍ଥ, ବିପରୀତ, ପ୍ରତିଧନାତ୍ମକ' 
    },
    description: { 
      en: 'Logical implications and their relationships',
      hi: 'तार्किक निहितार्थ और उनके संबंध',
      or: 'ତାର୍କିକ ନିହିତାର୍ଥ ଏବଂ ସେମାନଙ୍କର ସମ୍ପର୍କ'
    },
    duration: '55 min',
    difficulty: 'Intermediate',
    completed: false
  },
  'validity': {
    title: { 
      en: 'Validity of Statements and Proofs', 
      hi: 'कथनों और प्रमाणों की वैधता', 
      or: 'ବକ୍ତବ୍ୟ ଏବଂ ପ୍ରମାଣର ବୈଧତା' 
    },
    description: { 
      en: 'Methods of proof and validation techniques',
      hi: 'प्रमाण और सत्यापन तकनीकों के तरीके',
      or: 'ପ୍ରମାଣ ଏବଂ ବୈଧତା କ�ଵଳଗୁଡ଼ିକର ପଦ୍ଧତି'
    },
    duration: '60 min',
    difficulty: 'Intermediate',
    completed: false
  }
};

const translations = {
  title: {
    en: 'Unit V: Mathematical Reasoning',
    hi: 'इकाई V: गणितीय तर्क',
    or: 'ଏକକ V: ଗାଣିତିକ ତର୍କ'
  },
  selectTopic: {
    en: 'Develop logical thinking and proof techniques',
    hi: 'तार्किक सोच और प्रमाण तकनीकों का विकास करें',
    or: 'ତାର୍କିକ ଚିନ୍ତାଧାରା ଏବଂ ପ୍ରମାଣ କ�ଵଳ ବିକଶିତ କରନ୍ତୁ'
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

export function UnitMathematicalReasoning({ language, onBack, onSelectSubtopic }: UnitMathematicalReasoningProps) {
  const handleGetStarted = (subtopicId: string) => {
    onSelectSubtopic(`${subtopicId}-theory`);
  };

  const getSubtopicIcon = (index: number) => {
    const icons = [Brain, LogIn, CheckCircle];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  const getSubtopicGradient = (index: number) => {
    const gradients = [
      'from-pink-400 to-rose-500',
      'from-purple-400 to-violet-500',
      'from-indigo-400 to-purple-500'
    ];
    return gradients[index % gradients.length];
  };

  const getButtonGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700',
      'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700',
      'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
    ];
    return gradients[index % gradients.length];
  };

  const getProgressGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-pink-400 to-rose-500',
      'bg-gradient-to-r from-purple-400 to-violet-500',
      'bg-gradient-to-r from-indigo-400 to-purple-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100 p-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-14 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-44 right-20 w-28 h-28 bg-gradient-to-br from-purple-200/30 to-violet-200/30 rounded-full blur-xl animate-float delay-300"></div>
        <div className="absolute bottom-28 left-18 w-36 h-36 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-xl animate-float delay-500"></div>
        <div className="absolute bottom-16 right-24 w-24 h-24 bg-gradient-to-br from-rose-200/30 to-pink-200/30 rounded-full blur-xl animate-float delay-700"></div>
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
            <h1 className="text-2xl font-medium bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent">
              {translations.title[language]}
            </h1>
          </div>
        </div>

        {/* Instruction */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-pink-200/50">
            <Brain className="h-5 w-5 text-pink-600" />
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
                      <Badge variant="secondary" className="text-xs bg-white/60 backdrop-blur-sm border border-pink-200/50">
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