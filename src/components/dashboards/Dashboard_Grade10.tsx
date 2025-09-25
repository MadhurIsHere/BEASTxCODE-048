import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Zap, 
  Trophy,
  BookOpen,
  BarChart3,
  Calendar,
  Award,
  Clock,
  Star,
  Calculator,
  Atom,
  FlaskConical,
  Microscope,
  Code,
  Cpu,
  Lightbulb,
  Filter
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { Language, UserProfile } from '../../types/onboarding';

interface Dashboard_Grade10Props {
  user: UserProfile;
  language: Language;
  onLogout: () => void;
  onNavigateToLesson?: (lessonId: string) => void;
}

export function Dashboard_Grade10({ user, language, onLogout, onNavigateToLesson }: Dashboard_Grade10Props) {
  const [activeTab, setActiveTab] = useState('subjects');

  // Simplified welcome message without typing animation to improve performance
  const welcomeMessage = useMemo(() => {
    return language === 'en' ? `Grade 10 Dashboard - Welcome ${user.name}` : 
           language === 'hi' ? `कक्षा 10 डैशबोर्ड - स्वागत ${user.name}` : 
           `ଶ୍ରେଣୀ 10 ଡ୍ୟାସବୋର୍ଡ - ସ୍ୱାଗତ ${user.name}`;
  }, [language, user.name]);

  // Memoize data arrays to prevent unnecessary re-renders
  const subjects = useMemo(() => [
    {
      id: 'math',
      icon: Calculator,
      title: language === 'en' ? 'Advanced Mathematics' : language === 'hi' ? 'उन्नत गणित' : 'ଉନ୍ନତ ଗଣିତ',
      topics: ['Calculus', 'Trigonometry', 'Statistics'],
      progress: 85,
      level: 15,
      difficulty: 'Advanced',
      color: 'bg-blue-500'
    },
    {
      id: 'physics',
      icon: Atom,
      title: language === 'en' ? 'Physics' : language === 'hi' ? 'भौतिकी' : 'ପଦାର୍ଥ ବିଜ୍ଞାନ',
      topics: ['Mechanics', 'Thermodynamics', 'Optics'],
      progress: 72,
      level: 12,
      difficulty: 'Intermediate',
      color: 'bg-green-500'
    },
    {
      id: 'chemistry',
      icon: FlaskConical,
      title: language === 'en' ? 'Chemistry' : language === 'hi' ? 'रसायन विज्ञान' : 'ରସାୟନ ବିଜ୍ଞାନ',
      topics: ['Organic', 'Inorganic', 'Physical'],
      progress: 68,
      level: 11,
      difficulty: 'Intermediate',
      color: 'bg-orange-500'
    },
    {
      id: 'biology',
      icon: Microscope,
      title: language === 'en' ? 'Biology' : language === 'hi' ? 'जीव विज्ञान' : 'ଜୀବ ବିଜ୍ଞାନ',
      topics: ['Genetics', 'Ecology', 'Biotechnology'],
      progress: 79,
      level: 14,
      difficulty: 'Advanced',
      color: 'bg-purple-500'
    },
    {
      id: 'computer',
      icon: Code,
      title: language === 'en' ? 'Computer Science' : language === 'hi' ? 'कंप्यूटर विज्ञान' : 'କମ୍ପ୍ୟୁଟର ବିଜ୍ଞାନ',
      topics: ['Programming', 'Algorithms', 'Data Structures'],
      progress: 91,
      level: 18,
      difficulty: 'Expert',
      color: 'bg-gray-600'
    },
    {
      id: 'engineering',
      icon: Cpu,
      title: language === 'en' ? 'Engineering Basics' : language === 'hi' ? 'इंजीनियरिंग मूल बातें' : 'ଇଞ୍ଜିନିୟରିଂ ମୂଳତତୱ',
      topics: ['Circuit Design', 'CAD', 'Materials'],
      progress: 56,
      level: 9,
      difficulty: 'Beginner',
      color: 'bg-teal-500'
    }
  ], [language]);

  const weeklyProgress = [
    { day: 'Mon', xp: 85 },
    { day: 'Tue', xp: 120 },
    { day: 'Wed', xp: 95 },
    { day: 'Thu', xp: 140 },
    { day: 'Fri', xp: 110 },
    { day: 'Sat', xp: 165 },
    { day: 'Sun', xp: 89 }
  ];

  const upcomingTests = [
    { subject: 'Physics', topic: 'Mechanics', date: 'Tomorrow', difficulty: 'Hard' },
    { subject: 'Mathematics', topic: 'Calculus', date: 'In 3 days', difficulty: 'Expert' },
    { subject: 'Chemistry', topic: 'Organic Chemistry', date: 'Next week', difficulty: 'Medium' }
  ];

  const achievements = [
    { icon: '🏆', title: 'Subject Master', description: 'Mastered 3+ subjects', tier: 'Gold' },
    { icon: '🧠', title: 'Critical Thinker', description: 'Solved 50+ complex problems', tier: 'Platinum' },
    { icon: '⚡', title: 'Speed Demon', description: 'Fastest completion time', tier: 'Silver' },
    { icon: '🎯', title: 'Precision Expert', description: '95%+ accuracy rate', tier: 'Gold' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-orange-600 bg-orange-100';
      case 'Expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">
                  {welcomeMessage}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {language === 'en' ? `Grade 10 • Level ${user.level}` : language === 'hi' ? `कक्षा 10 • स्तर ${user.level}` : `ଶ୍ରେଣୀ 10 • ସ୍ତର ${user.level}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-indigo-500 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  <span className="text-white font-bold text-xs sm:text-sm">{user.xp} XP</span>
                </div>
                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-green-500 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2">
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  <span className="text-white font-bold text-xs sm:text-sm">Lvl {user.level}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout} className="text-xs sm:text-sm">
                {language === 'en' ? 'Logout' : language === 'hi' ? 'लॉग आउट' : 'ଲଗ୍ ଆଉଟ୍'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-2">
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'subjects', icon: BookOpen, label: language === 'en' ? 'Subjects' : language === 'hi' ? 'विषय' : 'ବିଷୟ' },
                { value: 'progress', icon: TrendingUp, label: language === 'en' ? 'Progress' : language === 'hi' ? 'प्रगति' : 'ପ୍ରଗତି' },
                { value: 'tests', icon: Target, label: language === 'en' ? 'Tests' : language === 'hi' ? 'परीक्षा' : 'ପରୀକ୍ଷା' },
                { value: 'achievements', icon: Award, label: language === 'en' ? 'Achievements' : language === 'hi' ? 'उपलब्धियां' : 'ସଫଳତା' }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.value
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200'
                      : 'bg-transparent text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className={`h-4 w-4 ${activeTab === tab.value ? 'text-white' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium hidden sm:block ${activeTab === tab.value ? 'text-white' : 'text-gray-600'}`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <TabsContent value="subjects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <Card key={subject.id} className="h-full bg-white border-2 border-gray-200 hover:border-indigo-300 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${subject.color}`}>
                        <subject.icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge className={getDifficultyColor(subject.difficulty)}>
                        {subject.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{subject.title}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Level {subject.level}</span>
                        <span className="font-bold text-gray-700">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                      
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-600">Current Topics:</p>
                        <div className="flex flex-wrap gap-1">
                          {subject.topics.map((topic, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        className={`w-full ${subject.color} hover:opacity-90`}
                        onClick={() => {
                          if (subject.title === 'Advanced Mathematics') {
                            onNavigateToLesson?.('number-systems');
                          }
                        }}
                      >
                        {language === 'en' ? 'Continue' : language === 'hi' ? 'जारी रखें' : 'ଜାରି ରଖ'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Weekly XP Progress' : language === 'hi' ? 'साप्ताहिक XP प्रगति' : 'ସାପ୍ତାହିକ XP ପ୍ରଗତି'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyProgress.map((day, index) => (
                      <div key={day.day} className="flex items-center space-x-4">
                        <span className="w-12 text-sm font-medium text-gray-600">{day.day}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            style={{ width: `${(day.xp / 200) * 100}%` }}
                            className="h-full bg-indigo-500 rounded-full"
                          />
                        </div>
                        <span className="w-12 text-sm font-bold text-gray-700">{day.xp}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    {language === 'en' ? 'Performance Analytics' : language === 'hi' ? 'प्रदर्शन विश्लेषण' : 'କାର୍ଯ୍ୟଦକ୍ଷତା ବିଶ୍ଳେଷଣ'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Accuracy Rate</p>
                          <p className="text-sm text-gray-600">Overall performance</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">94%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Avg. Speed</p>
                          <p className="text-sm text-gray-600">Problem solving</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-600">2.3m</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                          <Lightbulb className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Concepts Mastered</p>
                          <p className="text-sm text-gray-600">This month</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-orange-600">47</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Upcoming Tests' : language === 'hi' ? 'आगामी परीक्षाएं' : 'ଆଗାମୀ ପରୀକ୍ଷା'}
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Filter' : language === 'hi' ? 'फ़िल्टर' : 'ଫିଲ୍ଟର'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{test.subject}</h4>
                          <p className="text-sm text-gray-600">{test.topic}</p>
                          <p className="text-xs text-gray-500">{test.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getDifficultyColor(test.difficulty)}>
                          {test.difficulty}
                        </Badge>
                        <Button size="sm">
                          {language === 'en' ? 'Prepare' : language === 'hi' ? 'तैयारी करें' : 'ପ୍ରସ୍ତୁତ କର'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`p-6 border-2 ${
                  achievement.tier === 'Platinum' ? 'border-purple-300 bg-purple-50' :
                  achievement.tier === 'Gold' ? 'border-yellow-300 bg-yellow-50' :
                  'border-gray-300 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                      achievement.tier === 'Platinum' ? 'bg-purple-100' :
                      achievement.tier === 'Gold' ? 'bg-yellow-100' :
                      'bg-gray-100'
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{achievement.title}</h3>
                      <p className="text-gray-600">{achievement.description}</p>
                      <Badge className={`mt-2 ${
                        achievement.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' :
                        achievement.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {achievement.tier} Tier
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}