import React from 'react';
import { ArrowLeft, Brain } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import type { Language } from '../../../types/onboarding';

interface TopicProps {
  language: Language;
  onBack: () => void;
}

export function Topic_MathematicalReasoning({ language, onBack }: TopicProps) {
  const getTexts = () => {
    if (language === 'hi') {
      return {
        title: 'गणितीय तर्क',
        subtitle: 'कथन, निहितार्थ और प्रमाण विधियां',
        comingSoon: 'जल्द आ रहा है'
      };
    } else if (language === 'or') {
      return {
        title: 'ଗାଣିତିକ ତର୍କ',
        subtitle: 'ବିବୃତି, ଇମ୍ପ୍ଲିକେସନ ଏବଂ ପ୍ରମାଣ ପଦ୍ଧତି',
        comingSoon: 'ଶୀଘ୍ର ଆସୁଛି'
      };
    }
    return {
      title: 'Mathematical Reasoning',
      subtitle: 'Statements, Implications, and Proof Methods',
      comingSoon: 'Coming Soon'
    };
  };

  const texts = getTexts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'वापस' : language === 'or' ? 'ପଛକୁ' : 'Back'}
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{texts.title}</h1>
                  <p className="text-sm text-gray-600">{texts.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-12">
          <CardHeader>
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-2xl">{texts.comingSoon}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">This topic is under development.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}