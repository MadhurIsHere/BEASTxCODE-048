import React from 'react';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Bell,
  FileText,
  Award,
  TrendingUp,
  Clock,
  Activity,
  Calendar,
  Target,
  Plus,
  Filter
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Language, UserProfile } from '../../types/onboarding';

interface AdminDashboardProps {
  user: UserProfile;
  language: Language;
  onLogout: () => void;
}

export function AdminDashboard({ user, language, onLogout }: AdminDashboardProps) {
  const stats = [
    {
      title: language === 'en' ? 'Total Students' : language === 'hi' ? 'कुल छात्र' : 'ମୋଟ ଛାତ୍ର',
      value: '142',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: language === 'en' ? 'Active Classes' : language === 'hi' ? 'सक्रिय कक्षाएं' : 'ସକ୍ରିୟ ଶ୍ରେଣୀ',
      value: '8',
      change: '+2',
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      title: language === 'en' ? 'Avg. Performance' : language === 'hi' ? 'औसत प्रदर्शन' : 'ହାରାହାରି କାର୍ଯ୍ୟଦକ୍ଷତା',
      value: '87%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-orange-600'
    },
    {
      title: language === 'en' ? 'Assignments' : language === 'hi' ? 'असाइनमेंट' : 'ଆସାଇନମେଣ୍ଟ',
      value: '24',
      change: '+8',
      icon: FileText,
      color: 'text-purple-600'
    }
  ];

  const recentActivity = [
    { student: 'Arjun Kumar', action: 'Completed Math Quiz', time: '2 min ago', score: 95 },
    { student: 'Priya Sharma', action: 'Started Science Lab', time: '5 min ago', score: null },
    { student: 'Rohan Das', action: 'Submitted Assignment', time: '10 min ago', score: 88 },
    { student: 'Sneha Patel', action: 'Earned Badge: Problem Solver', time: '15 min ago', score: null },
  ];

  const upcomingClasses = [
    { subject: 'Mathematics', class: '8th A', time: '10:00 AM', students: 32 },
    { subject: 'Science', class: '7th B', time: '11:30 AM', students: 28 },
    { subject: 'Physics', class: '9th A', time: '2:00 PM', students: 35 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {language === 'en' ? 'Teacher Dashboard' : language === 'hi' ? 'शिक्षक डैशबोर्ड' : 'ଶିକ୍ଷକ ଡ୍ୟାସବୋର୍ଡ'}
                </h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Notifications' : language === 'hi' ? 'सूचनाएं' : 'ବିଜ୍ଞପ୍ତି'}
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
                {language === 'en' ? 'Logout' : language === 'hi' ? 'लॉग आउट' : 'ଲଗଆଉଟ'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-green-600">
                    {stat.change}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Recent Student Activity' : language === 'hi' ? 'हाल की छात्र गतिविधि' : 'ସାମ୍ପ୍ରତିକ ଛାତ୍ର କାର୍ଯ୍ୟକଳାପ'}
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Filter' : language === 'hi' ? 'फ़िल्टर' : 'ଫିଲ୍ଟର'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {activity.student.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{activity.student}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.score && (
                          <Badge className="mb-1 bg-green-100 text-green-700">
                            {activity.score}%
                          </Badge>
                        )}
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Classes */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Today\'s Classes' : language === 'hi' ? 'आज की कक्षाएं' : 'ଆଜିର ଶ୍ରେଣୀ'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingClasses.map((cls, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{cls.subject}</h4>
                        <Badge variant="outline">{cls.class}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {cls.time}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {cls.students} students
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Schedule Class' : language === 'hi' ? 'कक्षा निर्धारित करें' : 'ଶ୍ରେଣୀ ନିର୍ଦ୍ଧାରଣ କରନ୍ତୁ'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {language === 'en' ? 'Quick Actions' : language === 'hi' ? 'त्वरित कार्य' : 'ଶୀଘ୍ର କାର୍ଯ୍ୟ'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 bg-blue-500 hover:bg-blue-600">
              <div className="flex flex-col items-center">
                <FileText className="h-5 w-5 mb-1" />
                <span className="text-sm">
                  {language === 'en' ? 'Create Assignment' : language === 'hi' ? 'असाइनमेंट बनाएं' : 'ଆସାଇନମେଣ୍ଟ ସୃଷ୍ଟି କରନ୍ତୁ'}
                </span>
              </div>
            </Button>
            
            <Button className="h-16 bg-green-500 hover:bg-green-600">
              <div className="flex flex-col items-center">
                <BarChart3 className="h-5 w-5 mb-1" />
                <span className="text-sm">
                  {language === 'en' ? 'View Reports' : language === 'hi' ? 'रिपोर्ट देखें' : 'ରିପୋର୍ଟ ଦେଖନ୍ତୁ'}
                </span>
              </div>
            </Button>
            
            <Button className="h-16 bg-purple-500 hover:bg-purple-600">
              <div className="flex flex-col items-center">
                <Award className="h-5 w-5 mb-1" />
                <span className="text-sm">
                  {language === 'en' ? 'Manage Badges' : language === 'hi' ? 'बैज प्रबंधित करें' : 'ବ୍ୟାଜ ପରିଚାଳନା କରନ୍ତୁ'}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}