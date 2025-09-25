import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import type { Language } from '../../types/onboarding';
import { Check } from 'lucide-react';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageSelect: (language: Language) => void;
  onBack: () => void;
  onNext: () => void;
}

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'or' as Language, name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🏴' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageSelect,
  onBack,
  onNext
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
            🌐 Select Your Language
          </h2>
          <p className="text-gray-600">Choose your preferred language</p>
        </div>

        <div className="space-y-3 mb-8">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedLanguage === lang.code
                    ? 'border-2 border-blue-500 bg-blue-50 shadow-md'
                    : 'border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => onLanguageSelect(lang.code)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <p className="font-medium text-gray-800">{lang.name}</p>
                      <p className="text-sm text-gray-600">{lang.nativeName}</p>
                    </div>
                  </div>
                  
                  {selectedLanguage === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 h-12"
          >
            ← Back
          </Button>
          
          <Button
            onClick={onNext}
            className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Next →
          </Button>
        </div>
      </motion.div>
    </div>
  );
};