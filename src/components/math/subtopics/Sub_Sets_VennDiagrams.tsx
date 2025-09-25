import React, { useState } from 'react';
import { ArrowLeft, Play, CheckCircle, RefreshCw, ArrowRight, Lightbulb, Target } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Quiz_Sets_1 } from '../quizzes/Quiz_Sets_1';
import type { Language } from '../../../types/onboarding';

interface SubtopicProps {
  language: Language;
  onBack: () => void;
}

type ViewMode = 'theory' | 'animation' | 'examples' | 'quiz';

export function Sub_Sets_VennDiagrams({ language, onBack }: SubtopicProps) {
  const [currentView, setCurrentView] = useState<ViewMode>('theory');
  const [animationStep, setAnimationStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const getTexts = () => {
    if (language === 'hi') {
      return {
        title: 'समुच्चय - परिचय',
        subtitle: 'समुच्चय की परिभाषा, प्रकार, संक्रियाएं और वेन आरेख',
        theory: 'सिद्धांत',
        animation: 'एनीमेशन',
        examples: 'उदाहरण',
        quiz: 'प्रश्नोत्तरी',
        definition: 'परिभाषा',
        definition_text: 'समुच्चय अच्छी तरह से परिभाषित वस्तुओं का संग्रह है। इन वस्तुओं को समुच्चय के अवयव या सदस्य कहते हैं।',
        types: 'समुच्चय के प्रकार',
        operations: 'समुच्चय संक्रियाएं',
        venn_diagrams: 'वेन आरेख',
        next_step: 'अगला चरण',
        start_animation: 'एनीमेशन शुरू करें',
        see_examples: 'उदाहरण देखें',
        take_quiz: 'प्रश्नोत्तरी लें',
        continue: 'जारी रखें'
      };
    } else if (language === 'or') {
      return {
        title: 'ସେଟ୍ - ପରିଚୟ',
        subtitle: 'ସେଟ୍ର ପରିଭାଷା, ପ୍ରକାର, ଅପରେସନ୍ ଏବଂ ଭେନ୍ ଡାଇଗ୍ରାମ୍',
        theory: 'ସିଦ୍ଧାନ୍ତ',
        animation: 'ଆନିମେସନ୍',
        examples: 'ଉଦାହରଣ',
        quiz: 'କୁଇଜ୍',
        definition: 'ପରିଭାଷା',
        definition_text: 'ସେଟ୍ ହେଉଛି ସୁ-ପରିଭାଷିତ ବସ୍ତୁଗୁଡ଼ିକର ସଂଗ୍ରହ। ଏହି ବସ୍ତୁଗୁଡ଼ିକୁ ସେଟ୍ର ଉପାଦାନ ବା ସଦସ୍ୟ କୁହାଯାଏ।',
        types: 'ସେଟ୍ର ପ୍ରକାର',
        operations: 'ସେଟ୍ ଅପରେସନ୍',
        venn_diagrams: 'ଭେନ୍ ଡାଇଗ୍ରାମ୍',
        next_step: 'ପରବର୍ତ୍ତୀ ଚରଣ',
        start_animation: 'ଆନିମେସନ୍ ଆରମ୍ଭ କରନ୍ତୁ',
        see_examples: 'ଉଦାହରଣ ଦେଖନ୍ତୁ',
        take_quiz: 'କୁଇଜ୍ ନିଅନ୍ତୁ',
        continue: 'ଜାରି ରଖନ୍ତୁ'
      };
    }
    return {
      title: 'Sets - Introduction',
      subtitle: 'Definition, types, operations, and Venn diagrams',
      theory: 'Theory',
      animation: 'Animation',
      examples: 'Examples',
      quiz: 'Quiz',
      definition: 'Definition',
      definition_text: 'A set is a well-defined collection of objects. These objects are called elements or members of the set.',
      types: 'Types of Sets',
      operations: 'Set Operations',
      venn_diagrams: 'Venn Diagrams',
      next_step: 'Next Step',
      start_animation: 'Start Animation',
      see_examples: 'See Examples',
      take_quiz: 'Take Quiz',
      continue: 'Continue'
    };
  };

  const texts = getTexts();

  const handleQuizComplete = () => {
    setShowQuiz(false);
    setCurrentView('theory');
  };

  if (showQuiz) {
    return <Quiz_Sets_1 language={language} onComplete={handleQuizComplete} onBack={() => setShowQuiz(false)} />;
  }

  const renderTheory = () => (
    <div className="space-y-8">
      {/* Definition Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span>{texts.definition}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-gray-700 leading-relaxed">{texts.definition_text}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                {language === 'hi' ? 'मुख्य अवधारणाएं:' : language === 'or' ? 'ମୁଖ୍ୟ ଧାରଣା:' : 'Key Concepts:'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{language === 'hi' ? 'समुच्चय में अवयव अद्वितीय होते हैं' : language === 'or' ? 'ସେଟରେ ଉପାଦାନ ଅନନ୍ୟ ହୋଇଥାଏ' : 'Elements in a set are unique'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{language === 'hi' ? 'अवयवों का क्रम महत्वपूर्ण नहीं है' : language === 'or' ? 'ଉପାଦାନର କ୍ରମ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ନୁହେଁ' : 'Order of elements doesn\'t matter'}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{language === 'hi' ? 'सामान्यतः कैपिटल लेटर से दर्शाते हैं' : language === 'or' ? 'ସାଧାରଣତଃ କ୍ୟାପିଟାଲ୍ ଅକ୍ଷରରେ ଦର୍ଶାଯାଏ' : 'Usually denoted by capital letters'}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                {language === 'hi' ? 'संकेतन:' : language === 'or' ? 'ସଙ୍କେତ:' : 'Notation:'}
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div><code className="bg-white px-2 py-1 rounded">A = {1, 2, 3, 4}</code></div>
                <div><code className="bg-white px-2 py-1 rounded">x ∈ A</code> 
                  <span className="text-gray-600 ml-2">
                    {language === 'hi' ? '(x समुच्चय A में है)' : language === 'or' ? '(x ସେଟ୍ A ରେ ଅଛି)' : '(x belongs to set A)'}
                  </span>
                </div>
                <div><code className="bg-white px-2 py-1 rounded">y ∉ A</code>
                  <span className="text-gray-600 ml-2">
                    {language === 'hi' ? '(y समुच्चय A में नहीं है)' : language === 'or' ? '(y ସେଟ୍ A ରେ ନାହିଁ)' : '(y does not belong to set A)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Types of Sets */}
      <Card>
        <CardHeader>
          <CardTitle>{texts.types}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: language === 'hi' ? 'रिक्त समुच्चय' : language === 'or' ? 'ଖାଲି ସେଟ୍' : 'Empty Set',
                symbol: '∅ or {}',
                description: language === 'hi' ? 'कोई अवयव नहीं' : language === 'or' ? 'କୌଣସି ଉପାଦାନ ନାହିଁ' : 'No elements'
              },
              {
                name: language === 'hi' ? 'परिमित समुच्चय' : language === 'or' ? 'ଫାଇନାଇଟ୍ ସେଟ୍' : 'Finite Set',
                symbol: '{1, 2, 3}',
                description: language === 'hi' ? 'सीमित अवयव' : language === 'or' ? 'ସୀମିତ ଉପାଦାନ' : 'Limited elements'
              },
              {
                name: language === 'hi' ? 'अपरिमित समुच्चय' : language === 'or' ? 'ଇନଫାଇନାଇଟ୍ ସେଟ୍' : 'Infinite Set',
                symbol: 'ℕ = {1, 2, 3, ...}',
                description: language === 'hi' ? 'असीमित अवयव' : language === 'or' ? 'ଅସୀମିତ ଉପାଦାନ' : 'Unlimited elements'
              },
              {
                name: language === 'hi' ? 'सार्वत्रिक समुच्चय' : language === 'or' ? 'ୟୁନିଭର୍ସାଲ୍ ସେଟ୍' : 'Universal Set',
                symbol: 'U',
                description: language === 'hi' ? 'सभी संभावित अवयव' : language === 'or' ? 'ସମସ୍ତ ସମ୍ଭାବ୍ୟ ଉପାଦାନ' : 'All possible elements'
              }
            ].map((type, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-1">{type.name}</h5>
                <code className="text-sm bg-white px-2 py-1 rounded">{type.symbol}</code>
                <p className="text-sm text-gray-600 mt-2">{type.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operations */}
      <Card>
        <CardHeader>
          <CardTitle>{texts.operations}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: language === 'hi' ? 'संघ (Union)' : language === 'or' ? 'ୟୁନିଅନ୍' : 'Union',
                symbol: 'A ∪ B',
                description: language === 'hi' ? 'A या B में से कम से कम एक में स्थित सभी अवयव' : language === 'or' ? 'A କିମ୍ବା B ରେ ଅତି କମରେ ଗୋଟିଏରେ ଥିବା ସମସ୍ତ ଉପାଦାନ' : 'All elements in A or B or both'
              },
              {
                name: language === 'hi' ? 'प्रतिच्छेदन (Intersection)' : language === 'or' ? 'ଇଣ୍ଟରସେକ୍ସନ୍' : 'Intersection',
                symbol: 'A ∩ B',
                description: language === 'hi' ? 'A और B दोनों में उपस्थित अवयव' : language === 'or' ? 'A ଏବଂ B ଦୁଇଟିରେ ଉପସ୍ଥିତ ଉପାଦାନ' : 'Elements present in both A and B'
              },
              {
                name: language === 'hi' ? 'अंतर (Difference)' : language === 'or' ? 'ଡିଫରେନ୍ସ' : 'Difference',
                symbol: 'A - B',
                description: language === 'hi' ? 'A में है लेकिन B में नहीं है' : language === 'or' ? 'A ରେ ଅଛି କିନ୍ତୁ B ରେ ନାହିଁ' : 'Elements in A but not in B'
              }
            ].map((operation, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 rounded-lg p-2 min-w-fit">
                  <code className="text-blue-800 font-medium">{operation.symbol}</code>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{operation.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{operation.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnimation = () => (
    <Card>
      <CardHeader>
        <CardTitle>{texts.venn_diagrams}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-gray-50 rounded-lg p-8 inline-block">
              {/* Venn Diagram SVG */}
              <svg width="300" height="200" viewBox="0 0 300 200" className="mx-auto">
                {/* Universal Set */}
                <rect x="20" y="20" width="260" height="160" fill="none" stroke="#374151" strokeWidth="2" rx="10" />
                <text x="30" y="40" className="text-sm font-medium fill-gray-700">U</text>
                
                {/* Set A */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r="50" 
                  fill={animationStep >= 1 ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.1)"} 
                  stroke="#3b82f6" 
                  strokeWidth="2"
                  className="transition-all duration-1000"
                />
                <text x="70" y="80" className="text-sm font-medium fill-blue-700">A</text>
                
                {/* Set B */}
                <circle 
                  cx="180" 
                  cy="100" 
                  r="50" 
                  fill={animationStep >= 2 ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.1)"} 
                  stroke="#ef4444" 
                  strokeWidth="2"
                  className="transition-all duration-1000"
                />
                <text x="200" y="80" className="text-sm font-medium fill-red-700">B</text>
                
                {/* Intersection highlight */}
                {animationStep >= 3 && (
                  <path 
                    d="M 140 70 A 50 50 0 0 1 140 130 A 50 50 0 0 1 140 70"
                    fill="rgba(16, 185, 129, 0.5)"
                    className="animate-pulse"
                  />
                )}
                
                {/* Labels for regions */}
                {animationStep >= 3 && (
                  <>
                    <text x="85" y="105" className="text-xs fill-blue-700">A-B</text>
                    <text x="140" y="105" className="text-xs fill-green-700 font-bold">A∩B</text>
                    <text x="195" y="105" className="text-xs fill-red-700">B-A</text>
                  </>
                )}
              </svg>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant={animationStep === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => setAnimationStep(0)}
            >
              {language === 'hi' ? 'रीसेट' : language === 'or' ? 'ରିସେଟ୍' : 'Reset'}
            </Button>
            <Button 
              variant={animationStep >= 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setAnimationStep(1)}
            >
              {language === 'hi' ? 'समुच्चय A' : language === 'or' ? 'ସେଟ୍ A' : 'Set A'}
            </Button>
            <Button 
              variant={animationStep >= 2 ? "default" : "outline"}
              size="sm"
              onClick={() => setAnimationStep(2)}
            >
              {language === 'hi' ? 'समुच्चय B' : language === 'or' ? 'ସେଟ୍ B' : 'Set B'}
            </Button>
            <Button 
              variant={animationStep >= 3 ? "default" : "outline"}
              size="sm"
              onClick={() => setAnimationStep(3)}
            >
              {language === 'hi' ? 'प्रतिच्छेदन' : language === 'or' ? 'ଇଣ୍ଟରସେକ୍ସନ୍' : 'Intersection'}
            </Button>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {language === 'hi' ? 'वेन आरेख क्या दिखाता है:' : language === 'or' ? 'ଭେନ୍ ଡାଇଗ୍ରାମ୍ କଣ ଦେଖାଏ:' : 'What the Venn Diagram Shows:'}
            </h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• {language === 'hi' ? 'समुच्चयों के बीच संबंध' : language === 'or' ? 'ସେଟ୍ ମଧ୍ୟରେ ସମ୍ପର୍କ' : 'Relationships between sets'}</li>
              <li>• {language === 'hi' ? 'संक्रियाओं का दृश्य प्रतिनिधित्व' : language === 'or' ? 'ଅପରେସନ୍ ର ଦୃଶ୍ୟ ପ୍ରତିନିଧିତ୍ୱ' : 'Visual representation of operations'}</li>
              <li>• {language === 'hi' ? 'जटिल समस्याओं को हल करने में सहायक' : language === 'or' ? 'ଜଟିଳ ସମସ୍ୟା ସମାଧାନରେ ସହାୟକ' : 'Helpful in solving complex problems'}</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderExamples = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-500" />
            <span>{language === 'hi' ? 'हल किए गए उदाहरण' : language === 'or' ? 'ସମାଧାନ ହୋଇଥିବା ଉଦାହରଣ' : 'Solved Examples'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Example 1 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-3">
                {language === 'hi' ? 'उदाहरण 1: मूलभूत संक्रियाएं' : language === 'or' ? 'ଉଦାହରଣ 1: ମୂଳ ଅପରେସନ୍' : 'Example 1: Basic Operations'}
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm">
                    <strong>{language === 'hi' ? 'दिया गया:' : language === 'or' ? 'ଦିଆଯାଇଛି:' : 'Given:'}</strong><br />
                    A = {1, 2, 3, 4, 5}<br />
                    B = {3, 4, 5, 6, 7}
                  </p>
                </div>
                <div className="space-y-2">
                  <p><strong>A ∪ B = </strong> {1, 2, 3, 4, 5, 6, 7}</p>
                  <p><strong>A ∩ B = </strong> {3, 4, 5}</p>
                  <p><strong>A - B = </strong> {1, 2}</p>
                  <p><strong>B - A = </strong> {6, 7}</p>
                </div>
              </div>
            </div>

            {/* Example 2 */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-3">
                {language === 'hi' ? 'उदाहरण 2: शब्द समस्या' : language === 'or' ? 'ଉଦାହରଣ 2: ଶବ୍ଦ ସମସ୍ୟା' : 'Example 2: Word Problem'}
              </h4>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm">
                    {language === 'hi' 
                      ? 'एक कक्षा में 30 छात्र हैं। 18 छात्र गणित पसंद करते हैं, 15 छात्र विज्ञान पसंद करते हैं, और 8 छात्र दोनों पसंद करते हैं। कितने छात्र कम से कम एक विषय पसंद करते हैं?'
                      : language === 'or'
                      ? 'ଗୋଟିଏ କ୍ଲାସରେ 30 ଜଣ ଛାତ୍ର ଅଛନ୍ତି। 18 ଜଣ ଗଣିତ ପସନ୍ଦ କରନ୍ତି, 15 ଜଣ ବିଜ୍ଞାନ ପସନ୍ଦ କରନ୍ତି, ଏବଂ 8 ଜଣ ଦୁଇଟି ପସନ୍ଦ କରନ୍ତି। କେତେ ଜଣ ଅତି କମରେ ଗୋଟିଏ ବିଷୟ ପସନ୍ଦ କରନ୍ତି?'
                      : 'In a class of 30 students, 18 like Math, 15 like Science, and 8 like both. How many students like at least one subject?'
                    }
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>{language === 'hi' ? 'समाधान:' : language === 'or' ? 'ସମାଧାନ:' : 'Solution:'}</strong></p>
                  <p>|M ∪ S| = |M| + |S| - |M ∩ S|</p>
                  <p>|M ∪ S| = 18 + 15 - 8 = 25</p>
                  <p className="text-green-600 font-medium">
                    {language === 'hi' ? 'उत्तर: 25 छात्र' : language === 'or' ? 'ଉତ୍ତର: 25 ଛାତ୍ର' : 'Answer: 25 students'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'वापस' : language === 'or' ? 'ପଛକୁ' : 'Back'}
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{texts.title}</h1>
                <p className="text-sm text-gray-600">{texts.subtitle}</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:block">
              {language === 'hi' ? 'पूर्ण' : language === 'or' ? 'ସମ୍ପୂର୍ଣ୍ଣ' : 'Completed'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'theory', label: texts.theory, icon: Lightbulb },
              { id: 'animation', label: texts.animation, icon: Play },
              { id: 'examples', label: texts.examples, icon: Target },
              { id: 'quiz', label: texts.quiz, icon: CheckCircle }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => tab.id === 'quiz' ? setShowQuiz(true) : setCurrentView(tab.id as ViewMode)}
                  className={`flex items-center space-x-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    currentView === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'theory' && renderTheory()}
        {currentView === 'animation' && renderAnimation()}
        {currentView === 'examples' && renderExamples()}
        
        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'hi' ? 'विषयों पर वापस' : language === 'or' ? 'ଟପିକକୁ ଫେରନ୍ତୁ' : 'Back to Topics'}
          </Button>
          
          <Button onClick={() => setShowQuiz(true)}>
            {texts.take_quiz}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}