import React from 'react';
import { ArrowLeft, PlayCircle, Sparkles, BookOpen, Gamepad2, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface UnitSetsFunctionsProps {
  language: Language;
  onBack: () => void;
  onSelectSubtopic: (subtopicId: string) => void;
  onNavigateToGames?: () => void;
}

const subtopicData = {
  'sets-quiz-games': {
    title: { en: 'Sets Interactive Quiz Games', hi: 'सेट्स इंटरैक्टिव क्विज़ गेम्स', or: 'ସେଟ୍ସ ଇଣ୍ଟରାକ୍ଟିଭ କୁଇଜ୍ ଗେମ୍ସ' },
    description: { 
      en: 'Two engaging quiz games: Tile Master (match tiles) and Tank Stars (strategic combat) with 5 levels each, multilingual support, and comprehensive scoring system',
      hi: 'दो आकर्षक क्विज़ गेम्स: टाइल मास्टर (टाइल मैच करें) और टैंक स्टार्स (रणनीतिक युद्ध) प्रत्येक में 5 स्तर, बहुभाषी समर्थन और व्यापक स्कोरिंग सिस्टम',
      or: 'ଦୁଇଟି ଆକର୍ଷଣୀୟ କୁଇଜ୍ ଗେମ୍ସ: ଟାଇଲ୍ ମାଷ୍ଟର (ଟାଇଲଗୁଡ଼ିକ ମେଳାନ୍ତୁ) ଏବଂ ଟ୍ୟାଙ୍କ ଷ୍ଟାର୍ସ (ରଣନୀତିକ ଯୁଦ୍ଧ) ପ୍ରତ୍ୟେକରେ 5 ସ୍ତର, ବହୁଭାଷୀ ସମର୍ଥନ ଏବଂ ବ୍ୟାପକ ସ୍କୋରିଂ ସିଷ୍ଟମ'
    },
    duration: '30-45 min',
    difficulty: 'Interactive',
    completed: false,
    isGameMode: true,
    isNew: true
  },
  'sets-battle': {
    title: { en: 'Sets Battle Arena', hi: 'सेट्स बैटल एरीना', or: 'ସେଟ୍ସ ବ୍ୟାଟଲ ଏରୀନା' },
    description: { 
      en: 'Epic animated hero vs villain quiz battle with damage system and special moves',
      hi: 'डैमेज सिस्टम और विशेष चालों के साथ महाकाव्य एनिमेटेड हीरो बनाम खलनायक क्विज़ बैटल',
      or: 'ଡ୍ୟାମେଜ ସିଷ୍ଟମ ଏବଂ ବିଶେଷ ଚାଳ ସହିତ ମହାକାବ୍ୟ ଆନିମେଟେଡ ହିରୋ ବନାମ ଖଳନାୟକ କୁଇଜ ବ୍ୟାଟଲ'
    },
    duration: '15 min',
    difficulty: 'Advanced',
    completed: false,
    isGameMode: true
  },
  'relations': {
    title: { en: 'Relations', hi: 'संबंध', or: 'ସମ୍ପର୍କ' },
    description: { 
      en: 'Types of relations, equivalence relations, and functions',
      hi: 'संबंधों के प्रकार, तुल्यता संबंध और फलन',
      or: 'ସମ୍ପର୍କର ପ୍ରକାର, ସମତୁଲ୍ୟ ସମ୍ପର୍କ ଏବଂ ଫଙ୍କସନ୍'
    },
    duration: '50 min',
    difficulty: 'Intermediate',
    completed: false
  },
  'functions': {
    title: { en: 'Functions', hi: 'फलन', or: 'ଫଙ୍କସନ୍' },
    description: { 
      en: 'Real-valued functions, domain, range, and compositions',
      hi: 'वास्तविक मूल्य फलन, प्रांत, परिसर और संयोजन',
      or: 'ବାସ୍ତବ ମୂଲ୍ୟ ଫଙ୍କସନ୍, ଡୋମେନ୍, ରେଞ୍ଜ ଏବଂ କମ୍ପୋଜିସନ୍'
    },
    duration: '60 min',
    difficulty: 'Intermediate',
    completed: false
  }
};

const translations = {
  title: {
    en: 'Unit I: Sets and Functions',
    hi: 'इकाई I: समुच्चय और फलन',
    or: 'ଏକକ I: ସେଟ୍ ଏବଂ ଫଙ୍କସନ୍'
  },
  selectTopic: {
    en: 'Choose your learning adventure',
    hi: 'अपना सीखने का रोमांच चुनें',
    or: 'ଆପଣଙ୍କ ଶିକ୍ଷଣ ଦୁ venture ସାହସିକ କାର୍ଯ୍ୟ ବାଛନ୍ତୁ'
  },
  getStarted: {
    en: 'Get Started',
    hi: 'शुरू करें',
    or: 'ଆରମ୍ଭ କରନ୍ତୁ'
  },
  startJourney: {
    en: 'Start Learning Journey',
    hi: 'सीखने की यात्रा शुरू करें',
    or: 'ଶିଖିବା ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ'
  },
  interactiveContent: {
    en: 'Interactive theory, examples, animations & quizzes',
    hi: 'इंटरैक्टिव सिद्धांत, उदाहरण, एनीमेशन और क्विज़',
    or: 'ଇଣ୍ଟରାକ୍ଟିଭ ସିଦ୍ଧାନ୍ତ, ଉଦାହରଣ, ଆନିମେସନ୍ ଏବଂ କୁଇଜ୍'
  },
  newFeature: {
    en: 'NEW!',
    hi: 'नया!',
    or: 'ନୂତନ!'
  },
  duration: {
    en: 'Duration',
    hi: 'अवधि',
    or: 'ଅବଧି'
  },
  difficulty: {
    en: 'Difficulty',
    hi: 'कठिनाई',
    or: 'କଠିନତା'
  }
};

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800',
  'Interactive': 'bg-indigo-100 text-indigo-800'
};

export function UnitSetsFunctions({ language, onBack, onSelectSubtopic, onNavigateToGames }: UnitSetsFunctionsProps) {
  const handleGetStarted = (subtopicId: string) => {
    // Handle different types of activities
    if (subtopicId === 'sets-quiz-games') {
      // Navigate to the new Grade 11 Sets Games
      if (onNavigateToGames) {
        onNavigateToGames();
      }
    } else if (subtopicId === 'sets-battle') {
      onSelectSubtopic('sets-battle');
    } else {
      onSelectSubtopic(`${subtopicId}-theory`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 p-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-200/30 to-violet-200/30 rounded-full blur-xl animate-float delay-300"></div>
        <div className="absolute bottom-32 left-20 w-28 h-28 bg-gradient-to-br from-indigo-200/30 to-blue-200/30 rounded-full blur-xl animate-float delay-500"></div>
        <div className="absolute bottom-20 right-32 w-20 h-20 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl animate-float delay-700"></div>
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
            <h1 className="text-2xl font-medium bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
              {translations.title[language]}
            </h1>
          </div>
        </div>

        {/* Instruction */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full border border-purple-200/50">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <p className="text-gray-700 font-medium">
              {translations.selectTopic[language]}
            </p>
          </div>
        </div>

        {/* Subtopics */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {Object.entries(subtopicData).filter(([subtopicId]) => subtopicId !== 'sets-battle').map(([subtopicId, subtopic], index) => (
            <Card 
              key={subtopicId} 
              className={`group hover:shadow-2xl transition-all duration-500 backdrop-blur-sm border-0 shadow-lg hover:scale-[1.02] overflow-hidden relative ${
                subtopicId === 'sets-quiz-games' 
                  ? 'bg-gradient-to-br from-indigo-50/90 to-purple-50/90 ring-2 ring-indigo-200 ring-opacity-50' :
                subtopicId === 'sets-battle' 
                  ? 'bg-gradient-to-br from-slate-900/90 to-indigo-900/90' 
                  : 'bg-white/80'
              }`}
            >
              {/* NEW Badge */}
              {subtopic.isNew && (
                <div className="absolute top-4 right-4 z-20">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white animate-pulse">
                    <Star className="h-3 w-3 mr-1" />
                    {translations.newFeature[language]}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${
                      subtopicId === 'sets-quiz-games' ? 'from-indigo-500 to-purple-600' :
                      subtopicId === 'sets-battle' ? 'from-slate-600 to-slate-800' :
                      subtopicId === 'relations' ? 'from-blue-400 to-cyan-500' :
                      'from-purple-400 to-violet-500'
                    } text-white shadow-lg`}>
                      {subtopicId === 'sets-quiz-games' ? <Gamepad2 className="h-6 w-6" /> :
                       subtopicId === 'sets-battle' ? '⚔️' :
                       subtopicId === 'relations' ? <PlayCircle className="h-6 w-6" /> :
                       <Sparkles className="h-6 w-6" />}
                    </div>
                    <CardTitle className={`text-xl bg-gradient-to-r bg-clip-text text-transparent ${
                      subtopicId === 'sets-quiz-games' 
                        ? 'from-indigo-700 to-purple-700' :
                      subtopicId === 'sets-battle' 
                        ? 'from-gray-100 to-gray-300' 
                        : 'from-gray-800 to-gray-600'
                    }`}>
                      {subtopic.title[language]}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs bg-white/60 backdrop-blur-sm border border-purple-200/50">
                      {subtopic.duration}
                    </Badge>
                    <Badge className={`text-xs ${difficultyColors[subtopic.difficulty as keyof typeof difficultyColors]} border-0 shadow-sm`}>
                      {subtopic.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <p className={`mb-6 leading-relaxed ${
                  subtopicId === 'sets-quiz-games' ? 'text-indigo-800' :
                  subtopicId === 'sets-battle' ? 'text-gray-300' :
                  'text-gray-600'
                }`}>
                  {subtopic.description[language]}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center gap-2 text-sm ${
                    subtopicId === 'sets-quiz-games' ? 'text-indigo-600' :
                    subtopicId === 'sets-battle' ? 'text-gray-400' :
                    'text-gray-500'
                  }`}>
                    <Sparkles className="h-4 w-4" />
                    <span>{translations.interactiveContent[language]}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={() => handleGetStarted(subtopicId)}
                    className={`w-full py-4 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] ${
                      subtopicId === 'sets-quiz-games'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                        : subtopicId === 'sets-battle'
                        ? 'bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black'
                        : subtopicId === 'relations'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                        : 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700'
                    } text-white border-0 rounded-xl`}
                  >
                    <div className="flex items-center gap-3">
                      {subtopicId === 'sets-quiz-games' ? (
                        <Gamepad2 className="h-5 w-5" />
                      ) : (
                        <PlayCircle className="h-5 w-5" />
                      )}
                      {translations.getStarted[language]}
                      <Sparkles className="h-4 w-4" />
                    </div>
                  </Button>

                  <div className="w-full bg-gray-200/60 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        subtopicId === 'sets-quiz-games'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600'
                          : subtopicId === 'sets-battle'
                          ? 'bg-gradient-to-r from-slate-600 to-slate-800'
                          : subtopicId === 'relations'
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                          : 'bg-gradient-to-r from-purple-400 to-violet-500'
                      }`}
                      style={{ width: subtopic.completed ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}