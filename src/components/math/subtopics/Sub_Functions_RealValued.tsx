import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import type { Language } from '../../../types/onboarding';

interface SubtopicProps {
  language: Language;
  onBack: () => void;
}

export function Sub_Functions_RealValued({ language, onBack }: SubtopicProps) {
  const getTexts = () => {
    if (language === 'hi') {
      return {
        title: 'वास्तविक फलन',
        comingSoon: 'जल्द आ रहा है'
      };
    } else if (language === 'or') {
      return {
        title: 'ରିଆଲ୍ ଫଙ୍କସନ୍',
        comingSoon: 'ଶୀଘ୍ର ଆସୁଛି'
      };
    }
    return {
      title: 'Real-valued Functions',
      comingSoon: 'Coming Soon'
    };
  };

  const texts = getTexts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-4">
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle className="text-2xl">{texts.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">{texts.comingSoon}</p>
            <Button onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'वापस' : language === 'or' ? 'ପଛକୁ' : 'Back'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}