import React, { useMemo } from 'react';
import { ArrowLeft, BookOpen, Target, Calculator, BarChart3, Brain, Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Language } from '../../types/onboarding';

interface AdvancedMathematicsOverviewProps {
  language: Language;
  onBack: () => void;
  onSelectUnit: (unitId: string) => void;
}

const translations = {
  title: {
    en: 'Advanced Mathematics',
    hi: 'उन्नत गणित',
    or: 'ଉନ୍ନତ ଗଣିତ'
  },
  subtitle: {
    en: 'Class 11 - CBSE Curriculum',
    hi: 'कक्षा 11 - सीबीएसई पाठ्यक्रम',
    or: 'ଶ୍ରେଣୀ ୧୧ - CBSE ପାଠ୍ୟକ୍ରମ'
  },
  selectUnit: {
    en: 'Select a unit to begin learning',
    hi: 'सीखना शुरू करने के लिए एक इकाई चुनें',
    or: 'ଶିଖିବା ଆରମ୍ଭ କରିବାକୁ ଏକ ଏକକ ବାଛନ୍ତୁ'
  },
  topics: {
    en: 'topics',
    hi: 'विषय',
    or: 'ବିଷୟ'
  },
  startLearning: {
    en: 'Start Learning',
    hi: 'सीखना शुरू करें',
    or: 'ଶିଖିବା ଆରମ୍ଭ କରନ୍ତୁ'
  }
};

export function AdvancedMathematicsOverview({ language, onBack, onSelectUnit }: AdvancedMathematicsOverviewProps) {
  const unitData = useMemo(() => ({
    'unit1': {
      title: { en: 'Sets and Functions', hi: 'समुच्चय और फलन', or: 'ସେଟ୍ ଏବଂ ଫଙ୍କସନ୍' },
      description: { 
        en: 'Fundamental concepts of sets, relations, and functions',
        hi: 'समुच्चय, संबंध और फलन की मूलभूत अवधारणाएं',
        or: 'ସେଟ୍, ସମ୍ପର୍କ ଏବଂ ଫଙ୍କସନ୍ର ମୌଳିକ ଧାରଣା'
      },
      icon: BookOpen,
      color: 'bg-blue-500',
      topics: 3,
      progress: 0
    },
    'unit2': {
      title: { en: 'Algebra', hi: 'बीजगणित', or: 'ବୀଜଗଣିତ' },
      description: { 
        en: 'Mathematical induction, complex numbers, and permutations',
        hi: 'गणितीय आगमन, सम्मिश्र संख्याएं और क्रमचय',
        or: 'ଗାଣିତିକ ଇଣ୍ଡକସନ୍, ଜଟିଳ ସଂଖ୍ୟା ଏବଂ ଚୟନ'
      },
      icon: Calculator,
      color: 'bg-green-500',
      topics: 5,
      progress: 0
    },
    'unit3': {
      title: { en: 'Coordinate Geometry', hi: 'निर्देशांक ज्यामिति', or: 'ସଂଯୋଜିତ ଜ୍ୟାମିତି' },
      description: { 
        en: 'Straight lines and conic sections in coordinate plane',
        hi: 'निर्देशांक तल में सरल रेखाएं और शंकु खंड',
        or: 'ସଂଯୋଜିତ ତଳରେ ସରଳ ରେଖା ଏବଂ ଶଙ୍କୁ ଖଣ୍ଡ'
      },
      icon: Compass,
      color: 'bg-purple-500',
      topics: 2,
      progress: 0
    },
    'unit4': {
      title: { en: 'Calculus', hi: 'कलन', or: 'କାଲକୁଲସ୍' },
      description: { 
        en: 'Limits, derivatives, and integration fundamentals',
        hi: 'सीमा, अवकलज और समाकलन की मूल बातें',
        or: 'ସୀମା, ଅବକଳଜ ଏବଂ ସମାକଳନର ମୂଳ ବିଷୟ'
      },
      icon: Target,
      color: 'bg-orange-500',
      topics: 4,
      progress: 0
    },
    'unit5': {
      title: { en: 'Mathematical Reasoning', hi: 'गणितीय तर्क', or: 'ଗାଣିତିକ ତର୍କ' },
      description: { 
        en: 'Logic, statements, and mathematical proofs',
        hi: 'तर्क, कथन और गणितीय प्रमाण',
        or: 'ତର୍କ, ବକ୍ତବ୍ୟ ଏବଂ ଗାଣିତିକ ପ୍ରମାଣ'
      },
      icon: Brain,
      color: 'bg-pink-500',
      topics: 3,
      progress: 0
    },
    'unit6': {
      title: { en: 'Statistics and Probability', hi: 'सांख्यिकी और प्रायिकता', or: 'ପରିସଂଖ୍ୟାନ ଏବଂ ସମ୍ଭାବନା' },
      description: { 
        en: 'Data analysis and probability theory',
        hi: 'डेटा विश्लेषण और प्रायिकता सिद्धांत',
        or: 'ତଥ୍ୟ ବିଶ୍ଳେଷଣ ଏବଂ ସମ୍ଭାବନା ସିଦ୍ଧାନ୍ତ'
      },
      icon: BarChart3,
      color: 'bg-indigo-500',
      topics: 2,
      progress: 0
    }
  }), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl text-gray-900">
            {translations.title[language]}
          </h1>
          <p className="text-sm text-gray-600">
            {translations.subtitle[language]}
          </p>
        </div>
      </div>

      {/* Instruction */}
      <div className="mb-6">
        <p className="text-gray-700 text-center">
          {translations.selectUnit[language]}
        </p>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {Object.entries(unitData).map(([unitId, unit]) => {
          const IconComponent = unit.icon;
          
          return (
            <Card key={unitId} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`${unit.color} p-3 rounded-lg text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {unit.title[language]}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {unit.topics} {translations.topics[language]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4">
                  {unit.description[language]}
                </p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{unit.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${unit.color.replace('bg-', 'bg-')}`}
                      style={{ width: `${unit.progress}%` }}
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => onSelectUnit(unitId)}
                  className="w-full"
                  variant="outline"
                >
                  {translations.startLearning[language]}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="mt-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl text-blue-600">6</div>
                <div className="text-sm text-gray-600">Units</div>
              </div>
              <div>
                <div className="text-2xl text-green-600">19</div>
                <div className="text-sm text-gray-600">Topics</div>
              </div>
              <div>
                <div className="text-2xl text-purple-600">0%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}