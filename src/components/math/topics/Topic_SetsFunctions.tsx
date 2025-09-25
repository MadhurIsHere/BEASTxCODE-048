import React, { useState } from 'react';
import { ArrowLeft, GitBranch, Play, BookOpen, Target, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Sub_Sets_VennDiagrams } from '../subtopics/Sub_Sets_VennDiagrams';
import { Sub_Relations } from '../subtopics/Sub_Relations';
import { Sub_Functions_RealValued } from '../subtopics/Sub_Functions_RealValued';
import type { Language } from '../../../types/onboarding';

interface TopicProps {
  language: Language;
  onBack: () => void;
}

type SubtopicView = 'overview' | 'sets' | 'relations' | 'functions-types' | 'functions-composition' | 'functions-inverse' | 'functions-real';

export function Topic_SetsFunctions({ language, onBack }: TopicProps) {
  const [currentView, setCurrentView] = useState<SubtopicView>('overview');

  const getTexts = () => {
    if (language === 'hi') {
      return {
        title: 'समुच्चय और फलन',
        subtitle: 'समुच्चय सिद्धांत, संबंध और फलन की मूल बातें',
        overview: 'अवलोकन',
        subtopics: 'उप-विषय',
        progress: 'प्रगति',
        completed: 'पूर्ण',
        inProgress: 'प्रगति में',
        notStarted: 'शुरू नहीं हुआ',
        startLearning: 'सीखना शुरू करें',
        takeQuiz: 'प्रश्नोत्तरी लें',
        continue: 'जारी रखें'
      };
    } else if (language === 'or') {
      return {
        title: 'ସେଟ୍ ଏବଂ ଫଙ୍କସନ୍',
        subtitle: 'ସେଟ୍ ସିଦ୍ଧାନ୍ତ, ସମ୍ପର୍କ ଏବଂ ଫଙ୍କସନ୍ର ମୂଳତତ୍ୱ',
        overview: 'ସମୀକ୍ଷା',
        subtopics: 'ଉପ-ବିଷୟ',
        progress: 'ପ୍ରଗତି',
        completed: 'ସମ୍ପୂର୍ଣ୍ଣ',
        inProgress: 'ପ୍ରଗତିରେ',
        notStarted: 'ଆରମ୍ଭ ହୋଇନାହିଁ',
        startLearning: 'ଶିଖିବା ଆରମ୍ଭ କରନ୍ତୁ',
        takeQuiz: 'କୁଇଜ୍ ନିଅନ୍ତୁ',
        continue: 'ଜାରି ରଖନ୍ତୁ'
      };
    }
    return {
      title: 'Sets & Functions',
      subtitle: 'Fundamentals of set theory, relations, and functions',
      overview: 'Overview',
      subtopics: 'Subtopics',
      progress: 'Progress',
      completed: 'Completed',
      inProgress: 'In Progress',
      notStarted: 'Not Started',
      startLearning: 'Start Learning',
      takeQuiz: 'Take Quiz',
      continue: 'Continue'
    };
  };

  const texts = getTexts();

  const subtopics = [
    {
      id: 'sets',
      title: language === 'hi' ? 'समुच्चय - परिचय' : language === 'or' ? 'ସେଟ୍ - ପରିଚୟ' : 'Sets - Introduction',
      description: language === 'hi' ? 'समुच्चय की परिभाषा, प्रकार, संक्रियाएं और वेन आरेख' : language === 'or' ? 'ସେଟ୍ର ପରିଭାଷା, ପ୍ରକାର, ଅପରେସନ୍ ଏବଂ ଭେନ୍ ଡାଇଗ୍ରାମ୍' : 'Definition, types, operations, and Venn diagrams',
      status: 'completed',
      progress: 100,
      duration: '45 min',
      difficulty: language === 'hi' ? 'आसान' : language === 'or' ? 'ସହଜ' : 'Easy'
    },
    {
      id: 'relations',
      title: language === 'hi' ? 'संबंध' : language === 'or' ? 'ସମ୍ପର୍କ' : 'Relations',
      description: language === 'hi' ? 'संबंधों के प्रकार, गुण और उदाहरण' : language === 'or' ? 'ସମ୍ପର୍କର ପ୍ରକାର, ଗୁଣ ଏବଂ ଉଦାହରଣ' : 'Types of relations, properties, and examples',
      status: 'inProgress',
      progress: 60,
      duration: '40 min',
      difficulty: language === 'hi' ? 'मध्यम' : language === 'or' ? 'ମଧ୍ୟମ' : 'Medium'
    },
    {
      id: 'functions-types',
      title: language === 'hi' ? 'फलन - प्रकार' : language === 'or' ? 'ଫଙ୍କସନ୍ - ପ୍ରକାର' : 'Functions - Types',
      description: language === 'hi' ? 'फलनों के विभिन्न प्रकार और उनकी विशेषताएं' : language === 'or' ? 'ଫଙ୍କସନର ବିଭିନ୍ନ ପ୍ରକାର ଏବଂ ସେମାନଙ୍କର ବିଶେଷତା' : 'Different types of functions and their characteristics',
      status: 'inProgress',
      progress: 30,
      duration: '50 min',
      difficulty: language === 'hi' ? 'मध्यम' : language === 'or' ? 'ମଧ୍ୟମ' : 'Medium'
    },
    {
      id: 'functions-composition',
      title: language === 'hi' ? 'फलन संयोजन' : language === 'or' ? 'ଫଙ୍କସନ୍ କମ୍ପୋଜିସନ୍' : 'Function Composition',
      description: language === 'hi' ? 'फलनों का संयोजन और उसके गुण' : language === 'or' ? 'ଫଙ୍କସନଗୁଡ଼ିକର ସଂଯୋଜନ ଏବଂ ଏହାର ଗୁଣ' : 'Composition of functions and its properties',
      status: 'notStarted',
      progress: 0,
      duration: '35 min',
      difficulty: language === 'hi' ? 'मध्यम' : language === 'or' ? 'ମଧ୍ୟମ' : 'Medium'
    },
    {
      id: 'functions-inverse',
      title: language === 'hi' ? 'व्युत्क्रम फलन' : language === 'or' ? 'ଇନଭର୍ସ ଫଙ୍କସନ୍' : 'Inverse Functions',
      description: language === 'hi' ? 'व्युत्क्रम फलन की अवधारणा और गुण' : language === 'or' ? 'ଇନଭର୍ସ ଫଙ୍କସନର ଧାରଣା ଏବଂ ଗୁଣ' : 'Concept and properties of inverse functions',
      status: 'notStarted',
      progress: 0,
      duration: '40 min',
      difficulty: language === 'hi' ? 'कठिन' : language === 'or' ? 'କଠିନ' : 'Hard'
    },
    {
      id: 'functions-real',
      title: language === 'hi' ? 'वास्तविक फलन' : language === 'or' ? 'ରିଆଲ୍ ଫଙ୍କସନ୍' : 'Real-valued Functions',
      description: language === 'hi' ? 'वास्तविक फलन और उनके ग्राफ' : language === 'or' ? 'ରିଆଲ୍ ଫଙ୍କସନ୍ ଏବଂ ସେମାନଙ୍କର ଗ୍ରାଫ୍' : 'Real-valued functions and their graphs',
      status: 'notStarted',
      progress: 0,
      duration: '55 min',
      difficulty: language === 'hi' ? 'कठिन' : language === 'or' ? 'କଠିନ' : 'Hard'
    }
  ];

  const overallProgress = Math.round(subtopics.reduce((acc, topic) => acc + topic.progress, 0) / subtopics.length);
  const completedCount = subtopics.filter(topic => topic.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'inProgress': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const diffMap: Record<string, string> = {
      'Easy': 'text-green-600 bg-green-100',
      'Medium': 'text-yellow-600 bg-yellow-100',
      'Hard': 'text-red-600 bg-red-100',
      'आसान': 'text-green-600 bg-green-100',
      'मध्यम': 'text-yellow-600 bg-yellow-100',
      'कठिन': 'text-red-600 bg-red-100',
      'ସହଜ': 'text-green-600 bg-green-100',
      'ମଧ୍ୟମ': 'text-yellow-600 bg-yellow-100',
      'କଠିନ': 'text-red-600 bg-red-100'
    };
    return diffMap[difficulty] || 'text-gray-600 bg-gray-100';
  };

  const handleSubtopicClick = (subtopicId: string) => {
    setCurrentView(subtopicId as SubtopicView);
  };

  const handleBackToTopic = () => {
    setCurrentView('overview');
  };

  // Render specific subtopic
  if (currentView !== 'overview') {
    const subtopicProps = { language, onBack: handleBackToTopic };

    switch (currentView) {
      case 'sets':
        return <Sub_Sets_VennDiagrams {...subtopicProps} />;
      case 'relations':
        return <Sub_Relations {...subtopicProps} />;
      case 'functions-real':
        return <Sub_Functions_RealValued {...subtopicProps} />;
      default:
        // For other subtopics, show a placeholder
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {subtopics.find(s => s.id === currentView)?.title}
                </h2>
                <p className="text-gray-600 mb-6">This subtopic is under development.</p>
                <Button onClick={handleBackToTopic}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {texts.overview}
                </Button>
              </div>
            </div>
          </div>
        );
    }
  }

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
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{texts.title}</h1>
                  <p className="text-sm text-gray-600">{texts.subtitle}</p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:block">
              {completedCount}/6 {texts.completed}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{texts.progress}</h2>
            <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {subtopics.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">{texts.completed}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {subtopics.filter(t => t.status === 'inProgress').length}
              </div>
              <div className="text-sm text-gray-600">{texts.inProgress}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {subtopics.filter(t => t.status === 'notStarted').length}
              </div>
              <div className="text-sm text-gray-600">{texts.notStarted}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {subtopics.reduce((acc, t) => acc + parseInt(t.duration), 0)} min
              </div>
              <div className="text-sm text-gray-600">
                {language === 'hi' ? 'कुल समय' : language === 'or' ? 'ମୋଟ ସମୟ' : 'Total Time'}
              </div>
            </div>
          </div>
        </div>

        {/* Subtopics Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{texts.subtopics}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subtopics.map((subtopic) => (
              <Card 
                key={subtopic.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => handleSubtopicClick(subtopic.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getStatusColor(subtopic.status)}>
                      {subtopic.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {subtopic.status === 'completed' ? texts.completed : 
                       subtopic.status === 'inProgress' ? texts.inProgress : texts.notStarted}
                    </Badge>
                    <Badge variant="outline" className={getDifficultyColor(subtopic.difficulty)}>
                      {subtopic.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{subtopic.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{subtopic.description}</p>
                  
                  {subtopic.progress > 0 && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{texts.progress}</span>
                        <span className="font-medium">{subtopic.progress}%</span>
                      </div>
                      <Progress value={subtopic.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{subtopic.duration}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {language === 'hi' ? 'त्वरित क्रियाएं' : language === 'or' ? 'ଦ୍ରୁତ କାର୍ଯ୍ୟ' : 'Quick Actions'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button className="justify-start h-auto p-4" variant="outline">
              <Play className="w-5 h-5 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-medium">{texts.takeQuiz}</div>
                <div className="text-sm text-gray-600">
                  {language === 'hi' ? 'समुच्चय और फलन पर प्रश्न' : language === 'or' ? 'ସେଟ୍ ଏବଂ ଫଙ୍କସନ ଉପରେ ପ୍ରଶ୍ନ' : 'Questions on sets and functions'}
                </div>
              </div>
            </Button>
            
            <Button className="justify-start h-auto p-4" variant="outline">
              <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">
                  {language === 'hi' ? 'नोट्स डाउनलोड करें' : language === 'or' ? 'ନୋଟ୍ସ ଡାଉନଲୋଡ୍ କରନ୍ତୁ' : 'Download Notes'}
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'hi' ? 'सभी विषयों के सारांश' : language === 'or' ? 'ସବୁ ବିଷୟର ସାରାଂଶ' : 'Summary of all topics'}
                </div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}