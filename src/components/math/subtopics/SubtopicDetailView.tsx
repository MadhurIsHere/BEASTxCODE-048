import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, FileText, HelpCircle, Play, Zap, CheckCircle, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import type { Language } from '../../../types/onboarding';

interface SubtopicDetailViewProps {
  language: Language;
  subtopicId: string;
  onBack: () => void;
}

// Simplified content data to prevent performance issues
const getSubtopicContent = (subtopicId: string) => {
  const [topic] = subtopicId.split('-');
  
  const baseContent = {
    sets: {
      title: { en: 'Sets', hi: 'समुच्चय', or: 'ସେଟ୍' },
      description: {
        en: 'Learn about sets, their operations, and applications in mathematics.',
        hi: 'समुच्चय, उनकी संक्रियाओं और गणित में अनुप्रयोगों के बारे में जानें।',
        or: 'ସେଟ୍, ସେମାନଙ୍କର କାର୍ଯ୍ୟ ଏବଂ ଗଣିତରେ ପ୍ରୟୋଗ ବିୟାନ୍ତୁ।'
      }
    },
    relations: {
      title: { en: 'Relations', hi: 'संबंध', or: 'ସମ୍ପର୍କ' },
      description: {
        en: 'Understand mathematical relations and their properties.',
        hi: 'गणितीय संबंधों और उनके गुणों को समझें।',
        or: 'ଗାଣିତିକ ସମ୍ପର୍କ ଏବଂ ସେମାନଙ୍କର ଗୁଣ ବୁଝନ୍ତୁ।'
      }
    },
    functions: {
      title: { en: 'Functions', hi: 'फलन', or: 'ଫଙ୍କସନ୍' },
      description: {
        en: 'Learn about mathematical functions and their applications.',
        hi: 'गणितीय फलनों और उनके अनुप्रयोगों के बारे में जानें।',
        or: 'ଗାଣିତିକ ଫଙ୍କସନ୍ ଏବଂ ସେମାନଙ୍କର ପ୍ରୟୋଗ ବିଷୟରେ ଜାଣନ୍ତୁ।'
      }
    }
  };

  return baseContent[topic as keyof typeof baseContent] || baseContent.sets;
};

const translations = {
  theory: { en: 'Theory', hi: 'सिद्धांत', or: 'ସିଦ୍ଧାନ୍ତ' },
  examples: { en: 'Examples', hi: 'उदाहरण', or: 'ଉଦାହରଣ' },
  animation: { en: 'Animation', hi: 'एनीमेशन', or: 'ଆନିମେସନ୍' },
  quiz: { en: 'Quiz', hi: 'प्रश्नोत्तरी', or: 'କୁଇଜ୍' },
  progress: { en: 'Progress', hi: 'प्रगति', or: 'ଅଗ୍ରଗତି' },
  completed: { en: 'Completed', hi: 'पूर्ण', or: 'ସମ୍ପୂର୍ଣ୍ଣ' },
  comingSoon: { en: 'Coming Soon', hi: 'जल्द आ रहा है', or: 'ଶୀଘ୍ର ଆସୁଛି' }
};

export function SubtopicDetailView({ language, subtopicId, onBack }: SubtopicDetailViewProps) {
  const [activeTab, setActiveTab] = useState('theory');
  const [progress, setProgress] = useState(25);

  // Memoize content to prevent unnecessary recalculations
  const content = useMemo(() => getSubtopicContent(subtopicId), [subtopicId]);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    
    // Simple progress calculation
    const tabProgress = {
      'theory': 25,
      'examples': 50,
      'animation': 75,
      'quiz': 100
    };
    
    const newProgress = tabProgress[tab as keyof typeof tabProgress] || 25;
    if (newProgress > progress) {
      setProgress(newProgress);
    }
  }, [progress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl text-gray-900">
              {content.title[language]}
            </h1>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                45 min
              </Badge>
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Award className="h-3 w-3" />
                50 XP
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">{translations.progress[language]}</div>
            <div className="text-lg">{progress}%</div>
          </div>
          <div className="w-20">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="theory" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {translations.theory[language]}
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              {translations.examples[language]}
            </TabsTrigger>
            <TabsTrigger value="animation" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {translations.animation[language]}
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {translations.quiz[language]}
            </TabsTrigger>
          </TabsList>

          {/* Theory Tab */}
          <TabsContent value="theory" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h2 className="text-xl">{content.title[language]}</h2>
                  <p className="text-gray-700">{content.description[language]}</p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg mb-2">Key Concepts</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Definition and basic properties</li>
                      <li>Operations and applications</li>
                      <li>Real-world examples</li>
                      <li>Problem-solving techniques</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Example Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Example 1</h4>
                    <p className="text-gray-700 mb-2">
                      Sample problem related to {content.title[language].toLowerCase()}.
                    </p>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm"><strong>Solution:</strong> Step-by-step solution will be provided here.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Animation Tab */}
          <TabsContent value="animation" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="text-6xl">🎯</div>
                  <h3 className="text-xl">Interactive Learning</h3>
                  <p className="text-gray-600">
                    Visual animations and interactive content for {content.title[language]}.
                  </p>
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 mt-4">
                    <p className="text-gray-700">{translations.comingSoon[language]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="text-6xl">🧠</div>
                  <h3 className="text-xl">Knowledge Check</h3>
                  <p className="text-gray-600">
                    Test your understanding of {content.title[language]}.
                  </p>
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 mt-4">
                    <p className="text-gray-700">{translations.comingSoon[language]}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}