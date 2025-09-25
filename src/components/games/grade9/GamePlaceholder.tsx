import React from 'react';
import { ArrowRight, Construction, Cog, FlaskConical } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import type { Language } from '../../../types/onboarding';

interface GamePlaceholderProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
  gameName: string;
  gameDescription: string;
  gameType: string;
  concept: string;
}

export function GamePlaceholder({ 
  language, 
  onBack, 
  onComplete, 
  gameTitle, 
  gameDescription, 
  gameType 
}: GamePlaceholderProps) {
  const handleMockComplete = () => {
    // Mock completion for demonstration
    onComplete(250, 15);
  };

  const themeColors = {
    architect: {
      bg: 'from-blue-50 via-cyan-50 to-teal-50',
      header: 'from-blue-100/95 via-cyan-100/95 to-teal-100/95',
      card: 'from-blue-50/95 to-cyan-50/95',
      border: 'border-blue-700/30',
      text: 'text-blue-900',
      icon: FlaskConical
    },
    alchemist: {
      bg: 'from-purple-50 via-pink-50 to-red-50',
      header: 'from-purple-100/95 via-pink-100/95 to-red-100/95',
      card: 'from-purple-50/95 to-pink-50/95',
      border: 'border-purple-700/30',
      text: 'text-purple-900',
      icon: Construction
    }
  };

  const theme = themeColors[gameType];
  const IconComponent = theme.icon;

  const texts = {
    en: {
      comingSoon: "Coming Soon!",
      description: "This amazing game is currently under construction by our master artisans.",
      features: "Planned Features:",
      interactive: "• Fully interactive 3D environment",
      animated: "• Step-by-step animated explanations", 
      gamified: "• Gamified learning with rewards",
      curriculum: "• Aligned with Odisha Board curriculum",
      mockPlay: "Experience Preview",
      backToGuild: gameType === 'architect' ? "Back to Architect's Guild" : "Back to Alchemist's Spire"
    },
    hi: {
      comingSoon: "जल्द आ रहा है!",
      description: "यह अद्भुत खेल वर्तमान में हमारे मुख्य शिल्पकारों द्वारा निर्माणाधीन है।",
      features: "नियोजित सुविधाएं:",
      interactive: "• पूर्णतः इंटरैक्टिव 3D वातावरण",
      animated: "• चरण-दर-चरण एनिमेटेड स्पष्टीकरण",
      gamified: "• पुरस्कारों के साथ गेमीफाइड शिक्षा",
      curriculum: "• ओडिशा बोर्ड पाठ्यक्रम के साथ संरेखित",
      mockPlay: "अनुभव पूर्वावलोकन",
      backToGuild: gameType === 'architect' ? "वास्तुकार गिल्ड में वापस" : "कीमियागर स्पायर में वापस"
    },
    or: {
      comingSoon: "ଶୀଘ୍ର ଆସୁଛି!",
      description: "ଏହି ଅଦ୍ଭୁତ ଖେଳ ବର୍ତ୍ତମାନ ଆମର ମୁଖ୍ୟ ଶିଳ୍ପୀମାନଙ୍କ ଦ୍ୱାରା ନିର୍ମାଣାଧୀନ।",
      features: "ଯୋଜିତ ବୈଶିଷ୍ଟ୍ୟ:",
      interactive: "• ସମ୍ପୂର୍ଣ୍ଣ ଇଣ୍ଟରାକ୍ଟିଭ 3D ପରିବେଶ",
      animated: "• ପର୍ଯ୍ୟାୟକ୍ରମେ ଆନିମେଟେଡ ବ୍ୟାଖ୍ୟା",
      gamified: "• ପୁରସ୍କାର ସହିତ ଗେମିଫାଇଡ ଶିକ୍ଷା",
      curriculum: "• ଓଡ଼ିଶା ବୋର୍ଡ ପାଠ୍ୟକ୍ରମ ସହିତ ସଂଯୁକ୍ତ",
      mockPlay: "ଅଭିଜ୍ଞତା ପୂର୍ବାବଲୋକନ",
      backToGuild: gameType === 'architect' ? "ବାସ୍ତୁକାର ଗିଲ୍ଡକୁ ଫେରନ୍ତୁ" : "ରସାୟନବିତ୍ ସ୍ପାୟାରକୁ ଫେରନ୍ତୁ"
    }
  };

  const currentText = texts[language];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="gears" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="12.5" cy="12.5" r="8" fill="none" stroke="%23${gameType === 'architect' ? '3b82f6' : '8b5cf6'}" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23gears)"/></svg>')`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Header */}
      <header className={`brass-frame border-b-4 border-amber-800/50 bg-gradient-to-r ${theme.header} backdrop-blur-lg relative z-10`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack} className="brass-button">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                {currentText.backToGuild}
              </Button>
              <div>
                <h1 className={`text-2xl font-bold ${theme.text} copper-text-shadow`}>
                  {gameTitle}
                </h1>
                <p className="text-amber-700">
                  {gameDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 p-6 flex items-center justify-center min-h-[80vh]">
        <Card className={`brass-frame bg-gradient-to-br ${theme.card} backdrop-blur-md ${theme.border} border-4 max-w-2xl w-full`}>
          <CardHeader className="text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 animate-gear-turn">
              <Construction className="h-12 w-12 text-white" />
            </div>
            <CardTitle className={`text-3xl ${theme.text} mb-2`}>
              {currentText.comingSoon}
            </CardTitle>
            <p className={`${theme.text} opacity-80`}>
              {currentText.description}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-white/40 rounded-lg border border-amber-300/40">
              <h3 className={`font-bold ${theme.text} mb-4 text-lg`}>
                {currentText.features}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={`flex items-center space-x-2 ${theme.text}`}>
                  <Cog className="h-4 w-4 animate-clockwork-spin" />
                  <span className="text-sm">{currentText.interactive}</span>
                </div>
                <div className={`flex items-center space-x-2 ${theme.text}`}>
                  <IconComponent className="h-4 w-4 animate-alchemical-bubble" />
                  <span className="text-sm">{currentText.animated}</span>
                </div>
                <div className={`flex items-center space-x-2 ${theme.text}`}>
                  <Construction className="h-4 w-4" />
                  <span className="text-sm">{currentText.gamified}</span>
                </div>
                <div className={`flex items-center space-x-2 ${theme.text}`}>
                  <FlaskConical className="h-4 w-4" />
                  <span className="text-sm">{currentText.curriculum}</span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button
                onClick={handleMockComplete}
                className={`brass-button bg-gradient-to-r ${
                  gameType === 'architect' 
                    ? 'from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600' 
                    : 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                } text-white px-8 py-3`}
              >
                <IconComponent className="h-5 w-5 mr-2" />
                {currentText.mockPlay}
              </Button>
              <p className="text-amber-700 text-sm">
                {language === 'en' 
                  ? 'Get a preview of this game and earn some rewards!' 
                  : language === 'hi'
                  ? 'इस खेल का पूर्वावलोकन प्राप्त करें और कुछ पुरस्कार अर्जित करें!'
                  : 'ଏହି ଖେଳର ପୂର୍ବାବଲୋକନ ପାଆନ୍ତୁ ଏବଂ କିଛି ପୁରସ୍କାର ଅର୍ଜନ କରନ୍ତୁ!'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}