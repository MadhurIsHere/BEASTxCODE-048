import React from 'react';
import { ArrowLeft, PlayCircle, Sparkles, Calculator, Sigma, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface UnitAlgebraProps {
  language: Language;
  onBack: () => void;
  onSelectSubtopic: (subtopicId: string) => void;
}

const subtopicData = {
  'mathematical-induction': {
    title: { 
      en: 'Principle of Mathematical Induction', 
      hi: 'गणितीय आगमन का सिद्धांत', 
      or: 'ଗାଣିତିକ ଇଣ୍ଡକସନ୍ର ସିଦ୍ଧାନ୍ତ' 
    },
    description: { 
      en: 'Proving statements using mathematical induction',
      hi: 'गणितीय आगमन का उपयोग करके कथनों को सिद्ध करना',
      or: 'ଗାଣିତିକ ଇଣ୍ଡକସନ୍ ବ୍ୟବହାର କରି ବକ୍ତବ୍ୟ ପ୍ରମାଣ କରିବା'
    },
    duration: '55 min',
    difficulty: 'Intermediate',
    completed: false
  },
  'complex-numbers': {
    title: { 
      en: 'Complex Numbers and Quadratic Equations', 
      hi: 'सम्मिश्र संख्याएं और द्विघात समीकरण', 
      or: 'ଜଟିଳ ସଂଖ୍ୟା ଏବଂ ଦ୍ୱିଘାତ ସମୀକରଣ' 
    },
    description: { 
      en: 'Complex number operations and quadratic solutions',
      hi: 'सम्मिश्र संख्या संक्रियाएं और द्विघात समाधान',
      or: 'ଜଟିଳ ସଂଖ୍ୟା କାର୍ଯ୍ୟ ଏବଂ ଦ୍ୱିଘାତ ସମାଧାନ'
    },
    duration: '65 min',
    difficulty: 'Intermediate',
    completed: false
  },
  'linear-inequalities': {
    title: { 
      en: 'Linear Inequalities', 
      hi: 'रैखिक असमानताएं', 
      or: 'ର��ଖିକ ଅସମତା' 
    },
    description: { 
      en: 'Solving and graphing linear inequalities',
      hi: 'रैखिक असमानताओं को हल करना और ग्राफ़ बनाना',
      or: 'ରେଖିକ ଅସମତା ସମାଧାନ ଏବଂ ଗ୍ରାଫ୍ କରିବା'
    },
    duration: '50 min',
    difficulty: 'Beginner',
    completed: false
  },
  'permutations-combinations': {
    title: { 
      en: 'Permutations and Combinations', 
      hi: 'क्रमचय और संचय', 
      or: 'ଚୟନ ଏବଂ ସଂଯୋଜନ' 
    },
    description: { 
      en: 'Counting principles and arrangements',
      hi: 'गिनती के सिद्धांत और व्यवस्थाएं',
      or: 'ଗଣନା ସିଦ୍ଧାନ୍ତ ଏବଂ ବ୍ୟବସ୍ଥା'
    },
    duration: '70 min',
    difficulty: 'Intermediate',
    completed: false
  },
  'binomial-theorem': {
    title: { 
      en: 'Binomial Theorem', 
      hi: 'द्विपद प्रमेय', 
      or: 'ଦ୍ୱିପଦ ପ୍ରମେୟ' 
    },
    description: { 
      en: 'Expansion of binomial expressions and applications',
      hi: 'द्विपद व्यंजकों का विस्तार और अनुप्रयोग',
      or: 'ଦ୍ୱିପଦ ଅଭିବ୍ୟକ୍ତିର ବିସ୍ତାର ଏବଂ ପ୍ରୟୋଗ'
    },
    duration: '60 min',
    difficulty: 'Intermediate',
    completed: false
  }
};

const translations = {
  title: {
    en: 'Unit II: Algebra',
    hi: 'इकाई II: बीजगणित',
    or: 'ଏକକ II: ବୀଜଗଣିତ'
  },
  selectTopic: {
    en: 'Master algebraic concepts & problem-solving',
    hi: 'बीजगणितीय अवधारणाएं और समस्या समाधान में महारत हासिल करें',
    or: 'ବୀଜଗଣିତ ଧାରଣା ଏବଂ ସମସ୍ୟା ସମାଧାନରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ'
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

export function UnitAlgebra({ language, onBack, onSelectSubtopic }: UnitAlgebraProps) {
  const handleGetStarted = (subtopicId: string) => {
    onSelectSubtopic(`${subtopicId}-theory`);
  };

  const getSubtopicIcon = (index: number) => {
    const icons = [Calculator, Sigma, PlayCircle, Zap, Sparkles];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  const getSubtopicGradient = (index: number) => {
    const gradients = [
      'from-emerald-400 to-teal-500',
      'from-blue-400 to-indigo-500', 
      'from-purple-400 to-pink-500',
      'from-orange-400 to-red-500',
      'from-green-400 to-cyan-500'
    ];
    return gradients[index % gradients.length];
  };

  const getButtonGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
      'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700',
      'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
      'bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700'
    ];
    return gradients[index % gradients.length];
  };

  const getProgressGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-emerald-400 to-teal-500',
      'bg-gradient-to-r from-blue-400 to-indigo-500',
      'bg-gradient-to-r from-purple-400 to-pink-500',
      'bg-gradient-to-r from-orange-400 to-red-500',
      'bg-gradient-to-r from-green-400 to-cyan-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100 p-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-8 w-36 h-36 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-32 right-16 w-28 h-28 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-xl animate-float delay-300"></div>
        <div className="absolute bottom-28 left-16 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl animate-float delay-500"></div>
        <div className="absolute bottom-16 right-24 w-24 h-24 bg-gradient-to-br from-green-200/30 to-cyan-200/30 rounded-full blur-xl animate-float delay-700"></div>
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
            <h1 className="text-2xl font-medium bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              {translations.title[language]}
            </h1>
          </div>
        </div>

        {/* Instruction */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-emerald-200/50">
            <Calculator className="h-5 w-5 text-emerald-600" />
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
                      <Badge variant="secondary" className="text-xs bg-white/60 backdrop-blur-sm border border-emerald-200/50">
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