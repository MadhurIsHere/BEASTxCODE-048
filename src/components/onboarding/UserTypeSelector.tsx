import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { getTranslation } from '../../utils/translations';
import type { Language, UserType } from '../../types/onboarding';
import { BookOpen, GraduationCap, Users } from 'lucide-react';

interface UserTypeSelectorProps {
  language: Language;
  onUserTypeSelect: (type: UserType) => void;
  onLogin: () => void;
  onBack: () => void;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  language,
  onUserTypeSelect,
  onLogin,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to {getTranslation('appName', language)}!
          </h2>
          <p className="text-gray-600">How would you like to get started?</p>
        </div>

        <div className="space-y-4 mb-8">
          {/* New Student Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50"
              onClick={() => onUserTypeSelect('student')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {getTranslation('newStudent', language)}
                </h3>
                <p className="text-sm text-gray-600">
                  Start your learning journey with games and challenges
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Returning User Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50"
              onClick={() => onLogin()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {getTranslation('returningUser', language)}
                </h3>
                <p className="text-sm text-gray-600">
                  Continue where you left off
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Teacher Access Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50"
              onClick={() => onUserTypeSelect('teacher')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {getTranslation('imTeacher', language)}
                </h3>
                <p className="text-sm text-gray-600">
                  Manage students and track progress
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        <Button
          onClick={onBack}
          variant="outline"
          className="w-full h-12"
        >
          ← {getTranslation('back', language)}
        </Button>
      </motion.div>
    </div>
  );
};