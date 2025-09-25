import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy, Star, Target } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import type { Language } from '../../../types/onboarding';

interface QuizProps {
  language: Language;
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function Quiz_Sets_1({ language, onComplete, onBack }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const getTexts = () => {
    if (language === 'hi') {
      return {
        title: 'समुच्चय प्रश्नोत्तरी',
        subtitle: 'अपनी समझ का परीक्षण करें',
        question: 'प्रश्न',
        of: 'का',
        submit: 'जमा करें',
        next: 'अगला',
        retry: 'पुनः प्रयास',
        finish: 'समाप्त',
        correct: 'सही!',
        incorrect: 'गलत!',
        explanation: 'व्याख्या:',
        score: 'स्कोर',
        excellent: 'उत्कृष्ट!',
        good: 'अच्छा!',
        needsPractice: 'अधिक अभ्यास की आवश्यकता',
        tryAgain: 'फिर से कोशिश करें',
        continue: 'जारी रखें',
        backToTopic: 'विषय पर वापस जाएं'
      };
    } else if (language === 'or') {
      return {
        title: 'ସେଟ୍ କୁଇଜ୍',
        subtitle: 'ଆପଣଙ୍କର ବୁଝାମଣା ପରୀକ୍ଷା କରନ୍ତୁ',
        question: 'ପ୍ରଶ୍ନ',
        of: 'ର',
        submit: 'ଦାଖଲ କରନ୍ତୁ',
        next: 'ପରବର୍ତ୍ତୀ',
        retry: 'ପୁନଃ ଚେଷ୍ଟା',
        finish: 'ସମାପ୍ତ',
        correct: 'ଠିକ୍!',
        incorrect: 'ଭୁଲ୍!',
        explanation: 'ବ୍ୟାଖ୍ୟା:',
        score: 'ସ୍କୋର',
        excellent: 'ଉତ୍କୃଷ୍ଟ!',
        good: 'ଭଲ!',
        needsPractice: 'ଅଧିକ ଅଭ୍ୟାସ ଦରକାର',
        tryAgain: 'ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ',
        continue: 'ଜାରି ରଖନ୍ତୁ',
        backToTopic: 'ଟପିକକୁ ଫେରନ୍ତୁ'
      };
    }
    return {
      title: 'Sets Quiz',
      subtitle: 'Test your understanding',
      question: 'Question',
      of: 'of',
      submit: 'Submit',
      next: 'Next',
      retry: 'Retry',
      finish: 'Finish',
      correct: 'Correct!',
      incorrect: 'Incorrect!',
      explanation: 'Explanation:',
      score: 'Score',
      excellent: 'Excellent!',
      good: 'Good!',
      needsPractice: 'Needs more practice',
      tryAgain: 'Try Again',
      continue: 'Continue',
      backToTopic: 'Back to Topic'
    };
  };

  const texts = getTexts();

  const questions: Question[] = language === 'hi' ? [
    {
      id: 1,
      question: 'यदि A = {1, 2, 3} और B = {2, 3, 4}, तो A ∪ B क्या है?',
      options: ['{1, 2, 3, 4}', '{2, 3}', '{1, 4}', '{1, 2, 3, 2, 3, 4}'],
      correct: 0,
      explanation: 'संघ (Union) में दोनों समुच्चयों के सभी अद्वितीय अवयव होते हैं।',
      difficulty: 'easy'
    },
    {
      id: 2,
      question: 'रिक्त समुच्चय को किस प्रतीक से दर्शाया जाता है?',
      options: ['∞', '∅', 'ℕ', 'ℝ'],
      correct: 1,
      explanation: '∅ (फी) प्रतीक रिक्त समुच्चय को दर्शाता है।',
      difficulty: 'easy'
    },
    {
      id: 3,
      question: 'यदि A = {1, 2, 3, 4} और B = {3, 4, 5, 6}, तो A ∩ B क्या है?',
      options: ['{1, 2}', '{5, 6}', '{3, 4}', '{1, 2, 3, 4, 5, 6}'],
      correct: 2,
      explanation: 'प्रतिच्छेदन (Intersection) में केवल वे अवयव होते हैं जो दोनों समुच्चयों में होते हैं।',
      difficulty: 'medium'
    },
    {
      id: 4,
      question: 'यदि U = {1, 2, 3, 4, 5, 6} और A = {1, 3, 5}, तो A\' (A का पूरक) क्या है?',
      options: ['{2, 4, 6}', '{1, 3, 5}', '{1, 2, 3, 4, 5, 6}', '∅'],
      correct: 0,
      explanation: 'पूरक समुच्चय में वे सभी अवयव होते हैं जो सार्वत्रिक समुच्चय में हैं लेकिन दिए गए समुच्चय में नहीं हैं।',
      difficulty: 'medium'
    },
    {
      id: 5,
      question: 'दो परिमित समुच्चयों A और B के लिए, n(A ∪ B) का सूत्र क्या है?',
      options: [
        'n(A) + n(B)',
        'n(A) + n(B) - n(A ∩ B)',
        'n(A) - n(B)',
        'n(A) × n(B)'
      ],
      correct: 1,
      explanation: 'यह समावेशन-बहिष्करण सिद्धांत है। हमें दोनों समुच्चयों के अवयवों को जोड़कर प्रतिच्छेदन को घटाना होता है।',
      difficulty: 'hard'
    }
  ] : language === 'or' ? [
    {
      id: 1,
      question: 'ଯଦି A = {1, 2, 3} ଏବଂ B = {2, 3, 4}, ତେବେ A ∪ B କଣ?',
      options: ['{1, 2, 3, 4}', '{2, 3}', '{1, 4}', '{1, 2, 3, 2, 3, 4}'],
      correct: 0,
      explanation: 'ୟୁନିଅନରେ ଦୁଇଟି ସେଟର ସମସ୍ତ ଅନନ୍ୟ ଉପାଦାନ ଥାଏ।',
      difficulty: 'easy'
    },
    {
      id: 2,
      question: 'ଖାଲି ସେଟ୍ କେଉଁ ସଙ୍କେତରେ ଦର୍ଶାଯାଏ?',
      options: ['∞', '∅', 'ℕ', 'ℝ'],
      correct: 1,
      explanation: '∅ (ଫି) ସଙ୍କେତ ଖାଲି ସେଟ୍ ଦର୍ଶାଏ।',
      difficulty: 'easy'
    },
    {
      id: 3,
      question: 'ଯଦି A = {1, 2, 3, 4} ଏବଂ B = {3, 4, 5, 6}, ତେବେ A ∩ B କଣ?',
      options: ['{1, 2}', '{5, 6}', '{3, 4}', '{1, 2, 3, 4, 5, 6}'],
      correct: 2,
      explanation: 'ଇଣ୍ଟରସେକ୍ସନରେ କେବଳ ସେହି ଉପାଦାନ ଥାଏ ଯାହା ଦୁଇଟି ସେଟରେ ଅଛି।',
      difficulty: 'medium'
    },
    {
      id: 4,
      question: 'ଯଦି U = {1, 2, 3, 4, 5, 6} ଏବଂ A = {1, 3, 5}, ତେବେ A\' (A ର କମ୍ପଲିମେଣ୍ଟ) କଣ?',
      options: ['{2, 4, 6}', '{1, 3, 5}', '{1, 2, 3, 4, 5, 6}', '∅'],
      correct: 0,
      explanation: 'କମ୍ପଲିମେଣ୍ଟ ସେଟରେ ସେହି ସବୁ ଉପାଦାନ ଥାଏ ଯାହା ୟୁନିଭର୍ସାଲ ସେଟରେ ଅଛି କିନ୍ତୁ ଦିଆଯାଇଥିବା ସେଟରେ ନାହିଁ।',
      difficulty: 'medium'
    },
    {
      id: 5,
      question: 'ଦୁଇଟି ଫାଇନାଇଟ ସେଟ A ଏବଂ B ପାଇଁ, n(A ∪ B) ର ସୂତ୍ର କଣ?',
      options: [
        'n(A) + n(B)',
        'n(A) + n(B) - n(A ∩ B)',
        'n(A) - n(B)',
        'n(A) × n(B)'
      ],
      correct: 1,
      explanation: 'ଏହା ଇନକ୍ଲୁଜନ-ଏକ୍ସକ୍ଲୁଜନ ସିଦ୍ଧାନ୍ତ। ଆମକୁ ଦୁଇଟି ସେଟର ଉପାଦାନ ଯୋଗ କରି ଇଣ୍ଟରସେକ୍ସନ ବିୟୋଗ କରିବାକୁ ହେବ।',
      difficulty: 'hard'
    }
  ] : [
    {
      id: 1,
      question: 'If A = {1, 2, 3} and B = {2, 3, 4}, what is A ∪ B?',
      options: ['{1, 2, 3, 4}', '{2, 3}', '{1, 4}', '{1, 2, 3, 2, 3, 4}'],
      correct: 0,
      explanation: 'The union contains all unique elements from both sets.',
      difficulty: 'easy'
    },
    {
      id: 2,
      question: 'Which symbol represents the empty set?',
      options: ['∞', '∅', 'ℕ', 'ℝ'],
      correct: 1,
      explanation: 'The symbol ∅ (phi) represents the empty set.',
      difficulty: 'easy'
    },
    {
      id: 3,
      question: 'If A = {1, 2, 3, 4} and B = {3, 4, 5, 6}, what is A ∩ B?',
      options: ['{1, 2}', '{5, 6}', '{3, 4}', '{1, 2, 3, 4, 5, 6}'],
      correct: 2,
      explanation: 'The intersection contains only elements that are in both sets.',
      difficulty: 'medium'
    },
    {
      id: 4,
      question: 'If U = {1, 2, 3, 4, 5, 6} and A = {1, 3, 5}, what is A\' (complement of A)?',
      options: ['{2, 4, 6}', '{1, 3, 5}', '{1, 2, 3, 4, 5, 6}', '∅'],
      correct: 0,
      explanation: 'The complement contains all elements in the universal set that are not in the given set.',
      difficulty: 'medium'
    },
    {
      id: 5,
      question: 'For two finite sets A and B, what is the formula for n(A ∪ B)?',
      options: [
        'n(A) + n(B)',
        'n(A) + n(B) - n(A ∩ B)',
        'n(A) - n(B)',
        'n(A) × n(B)'
      ],
      correct: 1,
      explanation: 'This is the inclusion-exclusion principle. We add the cardinalities and subtract the intersection to avoid double counting.',
      difficulty: 'hard'
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correct).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { message: texts.excellent, color: 'text-green-600', icon: Trophy };
    if (score >= 60) return { message: texts.good, color: 'text-blue-600', icon: Star };
    return { message: texts.needsPractice, color: 'text-orange-600', icon: Target };
  };

  if (quizCompleted) {
    const score = calculateScore();
    const scoreInfo = getScoreMessage(score);
    const IconComponent = scoreInfo.icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{texts.title} {language === 'hi' ? 'पूर्ण!' : language === 'or' ? 'ସମ୍ପୂର୍ଣ୍ଣ!' : 'Complete!'}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <div className="text-4xl font-bold mb-2 text-gray-900">{score}%</div>
              <div className={`text-lg font-medium ${scoreInfo.color}`}>{scoreInfo.message}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {answers.filter((answer, index) => answer === questions[index].correct).length}
                </div>
                <div className="text-sm text-gray-600">{texts.correct}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {answers.filter((answer, index) => answer !== questions[index].correct).length}
                </div>
                <div className="text-sm text-gray-600">{texts.incorrect}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
                <div className="text-sm text-gray-600">{language === 'hi' ? 'कुल' : language === 'or' ? 'ମୋଟ' : 'Total'}</div>
              </div>
            </div>
            
            <div className="flex space-x-4 justify-center">
              <Button variant="outline" onClick={handleRetry}>
                <RotateCcw className="w-4 h-4 mr-2" />
                {texts.tryAgain}
              </Button>
              <Button onClick={onComplete}>
                {texts.continue}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Badge variant="secondary">
              {texts.question} {currentQuestion + 1} {texts.of} {questions.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {texts.question} {currentQuestion + 1}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={
                  currentQ.difficulty === 'easy' ? 'text-green-600 border-green-600' :
                  currentQ.difficulty === 'medium' ? 'text-yellow-600 border-yellow-600' :
                  'text-red-600 border-red-600'
                }
              >
                {currentQ.difficulty === 'easy' ? (language === 'hi' ? 'आसान' : language === 'or' ? 'ସହଜ' : 'Easy') :
                 currentQ.difficulty === 'medium' ? (language === 'hi' ? 'मध्यम' : language === 'or' ? 'ମଧ୍ୟମ' : 'Medium') :
                 (language === 'hi' ? 'कठिन' : language === 'or' ? 'କଠିନ' : 'Hard')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg text-gray-900 leading-relaxed">
              {currentQ.question}
            </div>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => {
                let buttonClass = "w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ";
                
                if (showResult) {
                  if (index === currentQ.correct) {
                    buttonClass += "border-green-500 bg-green-50 text-green-800";
                  } else if (index === selectedAnswer && selectedAnswer !== currentQ.correct) {
                    buttonClass += "border-red-500 bg-red-50 text-red-800";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                  }
                } else {
                  if (selectedAnswer === index) {
                    buttonClass += "border-blue-500 bg-blue-50 text-blue-800";
                  } else {
                    buttonClass += "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && index === currentQ.correct && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {showResult && index === selectedAnswer && selectedAnswer !== currentQ.correct && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {showResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedAnswer === currentQ.correct ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {selectedAnswer === currentQ.correct ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className={`font-medium mb-1 ${
                      selectedAnswer === currentQ.correct ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {selectedAnswer === currentQ.correct ? texts.correct : texts.incorrect}
                    </div>
                    <div className="text-sm text-gray-700">
                      <strong>{texts.explanation}</strong> {currentQ.explanation}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {texts.backToTopic}
              </Button>
              
              {!showResult ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={selectedAnswer === null}
                >
                  {texts.submit}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentQuestion < questions.length - 1 ? texts.next : texts.finish}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}