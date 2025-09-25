import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from './components/ui/button';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './components/LandingPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { EmailVerificationPage } from './components/onboarding/EmailVerificationPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { Dashboard_Grade6 } from './components/dashboards/Dashboard_Grade6';
import { Dashboard_Grade7 } from './components/dashboards/Dashboard_Grade7';
import { Dashboard_Grade8 } from './components/dashboards/Dashboard_Grade8';
import { Dashboard_Grade9 } from './components/dashboards/Dashboard_Grade9';
import { Dashboard_Grade10 } from './components/dashboards/Dashboard_Grade10';
import { Dashboard_Grade11 } from './components/dashboards/Dashboard_Grade11';
import { Dashboard_Grade12 } from './components/dashboards/Dashboard_Grade12';
import { NumberSystemsPage } from './components/NumberSystemsPageComplete';
import { AdvancedMathematicsOverview } from './components/math/AdvancedMathematicsOverview';
import { UnitSetsFunctions } from './components/math/units/Unit_SetsFunctions';
import { UnitAlgebra } from './components/math/units/Unit_Algebra';
import { UnitCoordinateGeometry } from './components/math/units/Unit_CoordinateGeometry';
import { UnitCalculus } from './components/math/units/Unit_Calculus';
import { UnitMathematicalReasoning } from './components/math/units/Unit_MathematicalReasoning';
import { UnitStatisticsProbability } from './components/math/units/Unit_StatisticsProbability';
import { SubtopicDetailView } from './components/math/subtopics/SubtopicDetailView';
import { SetsLearningFlow } from './components/math/sets/SetsLearningFlow';
import { SetsAdventureShell } from './components/math/sets/SetsAdventureShell';
import { SetsBattleGame } from './components/math/sets/SetsBattleGame';
import { PlanetMathara } from './components/exploration/PlanetMathara';
import { PlanetScientia } from './components/exploration/PlanetScientia';
import { MissionRouter } from './components/MissionRouter';
import { Grade9GameRouter } from './components/games/grade9/Grade9GameRouter';
import { Grade11SetsGames } from './components/math/sets/Grade11SetsGames';
import type { Language, UserProfile } from './types/onboarding';

const STORAGE_KEYS = {
  LANGUAGE: 'learnio_language'
} as const;

// Main App Component
function AppContent() {
  const { user, isLoading, login, logout } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [demoAccountData, setDemoAccountData] = useState<{username: string; password: string} | null>(null);

  // Initialize language from localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
    if (storedLanguage && ['en', 'hi', 'or'].includes(storedLanguage)) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleOnboardingComplete = useCallback((newUser: UserProfile) => {
    login(newUser);
    setShowOnboarding(false);
    setDemoAccountData(null); // Clear demo account data after successful login
  }, [login]);

  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setCurrentLesson(null);
    setShowOnboarding(false);
  }, [logout]);

  const handleDirectLogin = useCallback((userProfile: UserProfile) => {
    login(userProfile);
    setShowOnboarding(false);
    setDemoAccountData(null);
  }, [login]);

  const handleGoHome = useCallback(() => {
    logout();
    setCurrentLesson(null);
    setShowOnboarding(false);
    setDemoAccountData(null);
  }, [logout]);

  // Handle unit selection from Advanced Mathematics overview
  const handleSelectUnit = useCallback((unitId: string) => {
    setCurrentLesson(`advanced-math-${unitId}`);
  }, []);

  // Handle subtopic selection from unit pages
  const handleSelectSubtopic = useCallback((subtopicId: string) => {
    setCurrentLesson(`subtopic-${subtopicId}`);
  }, []);

  const handleBackToAdvancedMath = useCallback(() => {
    setCurrentLesson('advanced-mathematics');
  }, []);

  const handleNavigateToLesson = useCallback((lessonId: string) => {
    setCurrentLesson(lessonId);
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setCurrentLesson(null);
  }, []);

  const handleStartLearning = useCallback((demoAccount?: {username: string; password: string}) => {
    if (demoAccount) {
      // Handle demo accounts - go to onboarding with pre-filled credentials
      setDemoAccountData(demoAccount);
      setShowOnboarding(true);
    } else {
      // Regular onboarding flow
      setDemoAccountData(null);
      setShowOnboarding(true);
    }
  }, []);

  // Memoize common props to prevent unnecessary re-renders
  const commonDashboardProps = useMemo(() => ({
    user,
    language,
    onLogout: handleLogout,
    onNavigateToLesson: handleNavigateToLesson
  }), [user, language, handleLogout, handleNavigateToLesson]);

  // Render appropriate dashboard based on user
  const renderDashboard = useCallback(() => {
    if (!user) return null;

    // Admin/Teacher Dashboard
    if (user.type === 'teacher') {
      return <AdminDashboard {...commonDashboardProps} />;
    }

    // Student Dashboards based on grade
    if (user.type === 'student') {
      switch (user.grade) {
        case 6:
          return <Dashboard_Grade6 {...commonDashboardProps} />;
        case 7:
          return <Dashboard_Grade7 {...commonDashboardProps} />;
        case 8:
          return <Dashboard_Grade8 {...commonDashboardProps} />;
        case 9:
          return <Dashboard_Grade9 {...commonDashboardProps} />;
        case 10:
          return <Dashboard_Grade10 {...commonDashboardProps} />;
        case 11:
          return <Dashboard_Grade11 {...commonDashboardProps} />;
        case 12:
          return <Dashboard_Grade12 {...commonDashboardProps} />;
        default:
          return <Dashboard_Grade6 {...commonDashboardProps} />;
      }
    }

    // Fallback
    return <Dashboard_Grade6 {...commonDashboardProps} />;
  }, [user, commonDashboardProps]);

  // Handle current lesson rendering
  const renderCurrentLesson = useCallback(() => {
    if (!currentLesson) return renderDashboard();

    // Handle subtopic detail views
    if (currentLesson.startsWith('subtopic-')) {
      const subtopicId = currentLesson.replace('subtopic-', '');
      
      // Special handling for sets adventure module
      if (subtopicId === 'sets-adventure') {
        return (
          <SetsAdventureShell
            language={language}
            onBack={() => setCurrentLesson('advanced-math-unit1')}
            onLanguageChange={handleLanguageChange}
          />
        );
      }
      
      // Special handling for sets battle game
      if (subtopicId === 'sets-battle') {
        return (
          <SetsBattleGame
            language={language}
            onBack={() => setCurrentLesson('advanced-math-unit1')}
            onComplete={(score, xp) => {
              console.log('Sets Battle completed:', { score, xp });
              setCurrentLesson('advanced-math-unit1');
            }}
          />
        );
      }
      
      // Special handling for sets interactive learning flow
      if (subtopicId === 'sets-theory' || subtopicId === 'sets-examples' || 
          subtopicId === 'sets-animation' || subtopicId === 'sets-quiz') {
        return (
          <SetsLearningFlow
            language={language}
            onBack={() => setCurrentLesson('advanced-math-unit1')}
          />
        );
      }
      
      return (
        <SubtopicDetailView
          language={language}
          subtopicId={subtopicId}
          onBack={handleBackToDashboard}
        />
      );
    }

    // Handle unit pages
    if (currentLesson.startsWith('advanced-math-')) {
      const unitId = currentLesson.replace('advanced-math-', '');
      
      switch (unitId) {
        case 'unit1':
          return (
            <UnitSetsFunctions
              language={language}
              onBack={handleBackToAdvancedMath}
              onSelectSubtopic={handleSelectSubtopic}
              onNavigateToGames={() => setCurrentLesson('grade11-sets-games')}
            />
          );
        case 'unit2':
          return (
            <UnitAlgebra
              language={language}
              onBack={handleBackToAdvancedMath}
              onSelectSubtopic={handleSelectSubtopic}
            />
          );
        case 'unit3':
          return (
            <UnitCoordinateGeometry
              language={language}
              onBack={handleBackToAdvancedMath}
              onSelectSubtopic={handleSelectSubtopic}
            />
          );
        case 'unit4':
          return (
            <UnitCalculus
              language={language}
              onBack={handleBackToAdvancedMath}
              onSelectSubtopic={handleSelectSubtopic}
            />
          );
        case 'unit5':
          return (
            <UnitMathematicalReasoning
              language={language}
              onBack={handleBackToAdvancedMath}
              onSelectSubtopic={handleSelectSubtopic}
            />
          );
        case 'unit6':
          return (
            <UnitStatisticsProbability
              language={language}
              onBack={handleBackToAdvancedMath}
              onSelectSubtopic={handleSelectSubtopic}
            />
          );
        default:
          return renderDashboard();
      }
    }

    // Handle other lessons
    switch (currentLesson) {
      case 'number-systems':
        return (
          <NumberSystemsPage
            language={language}
            onBack={handleBackToDashboard}
          />
        );
      case 'advanced-mathematics':
        return (
          <AdvancedMathematicsOverview
            language={language}
            onBack={handleBackToDashboard}
            onSelectUnit={handleSelectUnit}
          />
        );
      case 'planet-mathara':
        return (
          <PlanetMathara
            language={language}
            onBack={handleBackToDashboard}
            onNavigateToMission={handleNavigateToLesson}
          />
        );
      case 'planet-scientia':
        return (
          <PlanetScientia
            language={language}
            onBack={handleBackToDashboard}
            onNavigateToMission={handleNavigateToLesson}
          />
        );
      case 'grade11-sets-games':
        return (
          <Grade11SetsGames
            language={language}
            onBack={handleBackToDashboard}
          />
        );
      default:
        // Check if it's a Grade 9 steampunk game
        const grade9GameIds = [
          'number-systems', 'polynomials', 'coordinate-geometry', 'linear-equations', 
          'euclid-geometry', 'lines-angles', 'triangles', 'quadrilaterals', 
          'areas-triangles', 'circles', 'constructions', 'herons-formula', 
          'surface-volumes', 'statistics', 'probability',
          'motion-forces', 'gravitation', 'work-energy-sound', 'matter-states', 
          'pure-matter', 'atoms-molecules', 'atomic-structure', 'cell-structure', 
          'tissues', 'diversity-organisms', 'health-disease', 'natural-resources'
        ];
        
        if (grade9GameIds.includes(currentLesson)) {
          return (
            <Grade9GameRouter
              gameId={currentLesson}
              language={language}
              onBack={handleBackToDashboard}
              onComplete={(score, xp) => {
                console.log('Grade 9 game completed:', { game: currentLesson, score, xp });
                // Here you could update user progress, XP, etc.
                handleBackToDashboard();
              }}
            />
          );
        }
        
        // Check if it's a mission/game by seeing if it contains dashes or known game patterns
        if (currentLesson.includes('-') || 
            ['natural-numbers', 'food-components'].includes(currentLesson)) {
          return (
            <MissionRouter
              missionId={currentLesson}
              language={language}
              onBack={handleBackToDashboard}
              onComplete={(score, xp) => {
                console.log('Mission completed:', { lesson: currentLesson, score, xp });
                // Here you could update user progress, XP, etc.
                handleBackToDashboard();
              }}
            />
          );
        }
        return renderDashboard();
    }
  }, [
    currentLesson, 
    language, 
    renderDashboard, 
    handleBackToDashboard, 
    handleBackToAdvancedMath, 
    handleSelectSubtopic, 
    handleSelectUnit
  ]);

  // Loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show home button when not on landing page
  const showHomeButton = user || showOnboarding;

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <ProtectedRoute requireAuth={true}>
          {renderCurrentLesson()}
        </ProtectedRoute>
        
        <ProtectedRoute requireAuth={false} fallback={null}>
          {showOnboarding ? (
            <OnboardingFlow
              language={language}
              onLanguageChange={handleLanguageChange}
              onComplete={handleOnboardingComplete}
              demoAccountData={demoAccountData}
            />
          ) : (
            <LandingPage
              language={language}
              onLanguageChange={handleLanguageChange}
              onStartLearning={handleStartLearning}
              onDirectLogin={handleDirectLogin}
            />
          )}
        </ProtectedRoute>
      </div>
    </ErrorBoundary>
  );
}

// Main App with AuthProvider and Router
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}