import React from 'react';
import { ArrowLeft, Calculator, BookOpen, Play } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import type { Language } from '../../../types/onboarding';

interface TopicProps {
  language: Language;
  onBack: () => void;
}

export function Topic_Algebra({ language, onBack }: TopicProps) {
  const getTexts = () => {
    if (language === 'hi') {
      return {
        title: 'बीजगणित',
        subtitle: 'गणितीय आगमन, जटिल संख्याएं, संचय और क्रमचय',
        comingSoon: 'जल्द आ रहा है',
        description: 'यह विषय वर्तमान में विकसित किया जा रहा है। जल्द ही उपलब्ध होगा।'
      };
    } else if (language === 'or') {
      return {
        title: 'ବୀଜଗଣିତ',
        subtitle: 'ଗାଣିତିକ ଇନଡକସନ, କମ୍ପଲେକ୍ସ ସଂଖ୍ୟା, ପରମୁଟେସନ ଏବଂ କମ୍ବିନେସନ',
        comingSoon: 'ଶୀଘ୍ର ଆସୁଛି',
        description: 'ଏହି ବିଷୟ ବର୍ତ୍ତମାନ ବିକଶିତ ହେଉଛି। ଶୀଘ୍ର ଉପଲବ୍ଧ ହେବ।'
      };
    }
    return {
      title: 'Algebra',
      subtitle: 'Mathematical Induction, Complex Numbers, Permutations & Combinations',
      comingSoon: 'Coming Soon',
      description: 'This topic is currently under development. Will be available soon.'
    };
  };

  const texts = getTexts();

  const subtopics = [
    language === 'hi' ? 'गणितीय आगमन' : language === 'or' ? 'ଗାଣିତିକ ଇନଡକସନ' : 'Mathematical Induction',
    language === 'hi' ? 'जटिल संख्याएं' : language === 'or' ? 'କମ୍ପଲେକ୍ସ ସଂଖ୍ୟା' : 'Complex Numbers',
    language === 'hi' ? 'द्विघात समीकरण' : language === 'or' ? 'କ୍ୱାଡ୍ରାଟିକ ଇକ୍ୱେସନ' : 'Quadratic Equations',
    language === 'hi' ? 'रैखिक असमानताएं' : language === 'or' ? 'ଲିନିୟର ଇନଇକ୍ୱାଲିଟି' : 'Linear Inequalities',
    language === 'hi' ? 'क्रमचय और संचय' : language === 'or' ? 'ପରମୁଟେସନ ଏବଂ କମ୍ବିନେସନ' : 'Permutations & Combinations',
    language === 'hi' ? 'द्विपद प्रमेय' : language === 'or' ? 'ବାଇନୋମିଆଲ ଥିଓରେମ' : 'Binomial Theorem'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'वापस' : language === 'or' ? 'ପଛକୁ' : 'Back'}
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Calculator className="w-6 h-6 text-white" />
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
        {/* Coming Soon Card */}
        <Card className="text-center py-12">
          <CardHeader>
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Calculator className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-2xl mb-4">{texts.comingSoon}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{texts.description}</p>
            
            {/* Preview of subtopics */}
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {language === 'hi' ? 'आने वाले विषय:' : language === 'or' ? 'ଆଗାମୀ ବିଷୟଗୁଡ଼ିକ:' : 'Upcoming Topics:'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subtopics.map((topic, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                    {topic}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex justify-center space-x-4">
              <Button variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'अधिसूचना प्राप्त करें' : language === 'or' ? 'ବିଜ୍ଞପ୍ତି ପାଆନ୍ତୁ' : 'Get Notified'}
              </Button>
              <Button>
                <Play className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'पूर्वावलोकन देखें' : language === 'or' ? 'ପ୍ରିଭ୍ୟୁ ଦେଖନ୍ତୁ' : 'Watch Preview'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}