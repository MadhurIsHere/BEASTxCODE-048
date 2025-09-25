import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle, Lock, Trophy, BookOpen, Calculator, Globe, Award, Sparkles, Play, Target, Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Quiz_Sets_1 } from '../quizzes/Quiz_Sets_1';
import { SetsQuizArena } from './SetsQuizArena';
import { WhatIsASetLesson } from './WhatIsASetLesson';
import { TypesOfSetsLesson } from './TypesOfSetsLesson';
import { SubsetsIntervalsLesson } from './SubsetsIntervalsLesson';
import { SetOperationsLesson } from './SetOperationsLesson';
import { VennPractice2Set } from './VennPractice2Set';
import { VennPractice3Set } from './VennPractice3Set';
import { ModuleSequence } from './ModuleSequence';
import type { Language } from '../../../types/onboarding';

interface SetsLearningFlowProps {
  language: Language;
  onBack: () => void;
}

type LearningStage = 
  | 'sequence'
  | 'concepts'
  | 'practice'
  | 'quiz'
  | 'mastery';

type ConceptType = 
  | 'what-is-set'
  | 'types-of-sets'
  | 'subsets-intervals'
  | 'set-operations'
  | 'venn-diagrams'
  | 'real-world-problems'
  | 'advanced-concepts';

type PracticeType = 
  | 'venn-practice-2set'
  | 'venn-practice-3set';

const translations = {
  title: {
    en: 'Sets Mastery Journey',
    hi: 'समुच्चय निपुणता यात्रा',
    or: 'ସେଟ୍ ଦକ୍ଷତା ଯାତ୍ରା'
  },
  subtitle: {
    en: 'Master Sets Theory through Interactive Learning',
    hi: 'इंटरैक्टिव शिक्षण के माध्यम से समुच्चय सिद्धांत में महारत हासिल करें',
    or: 'ଇଣ୍ଟରାକ୍ଟିଭ ଶିକ୍ଷଣ ମାଧ୍ୟମରେ ସେଟ୍ ସିଦ୍ଧାନ୍ତରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ'
  },
  progressTitle: {
    en: 'Your Learning Progress',
    hi: 'आपकी शिक्षण प्रगति',
    or: 'ଆପଣଙ୍କ ଶିକ୍ଷଣ ପ୍ରଗତି'
  },
  conceptsStage: {
    en: 'Learn Concepts',
    hi: 'अवधारणाएं सीखें',
    or: 'ଧାରଣା ଶିଖନ୍ତୁ'
  },
  practiceStage: {
    en: 'Practice Problems',
    hi: 'अभ्यास समस्याएं',
    or: 'ଅଭ୍ୟାସ ସମସ୍ୟା'
  },
  quizStage: {
    en: 'Take Quiz',
    hi: 'क्विज़ लें',
    or: 'କୁଇଜ୍ ନିଅନ୍ତୁ'
  },
  masteryStage: {
    en: 'Mastery Achieved!',
    hi: 'निपुणता प्राप्त!',
    or: 'ଦକ୍ଷତା ହାସଲ!'
  },
  startLearning: {
    en: 'Start Learning',
    hi: 'सीखना शुरू करें',
    or: 'ଶିଖିବା ଆରମ୍ଭ କରନ୍ତୁ'
  },
  continue: {
    en: 'Continue',
    hi: 'जारी रखें',
    or: 'ଜାରି ରଖନ୍ତୁ'
  },
  backToArena: {
    en: 'Back to Arena',
    hi: 'मैदान पर वापस',
    or: 'ଆରେନାକୁ ଫେରନ୍ତୁ'
  },
  markComplete: {
    en: 'Mark Complete',
    hi: 'पूर्ण चिह्नित करें',
    or: 'ସମ୍ପୂର୍ଣ୍ଣ ଚିହ୍ନିତ କରନ୍ତୁ'
  },
  completed: {
    en: 'Completed',
    hi: 'पूर्ण',
    or: 'ସମ୍ପୂର୍ଣ୍ଣ'
  },
  locked: {
    en: 'Locked',
    hi: 'बंद',
    or: 'ତାଲାବଦ୍ଧ'
  },
  unlocked: {
    en: 'Unlocked',
    hi: 'खुला',
    or: 'ଖୋଲା'
  },
  practiceUnlocked: {
    en: 'Practice Unlocked! Take the quiz to test your knowledge.',
    hi: 'अभ्यास अनलॉक! अपने ज्ञान का परीक्षण करने के लिए क्विज़ लें।',
    or: 'ଅଭ୍ୟାସ ଅନଲକ୍! ଆପଣଙ୍କ ଜ୍ଞାନ ପରୀକ୍ଷା କରିବାକୁ କୁଇଜ୍ ନିଅନ୍ତୁ।'
  },
  takeQuiz: {
    en: 'Take Quiz',
    hi: 'क्विज़ लें',
    or: 'କୁଇଜ୍ ନିଅନ୍ତୁ'
  },
  congratulations: {
    en: 'Congratulations! You have mastered Sets!',
    hi: 'बधाई हो! आपने समुच्चय में महारत हासिल कर ली है!',
    or: 'ଅଭିନନ୍ଦନ! ଆପଣ ସେଟ୍ରେ ଦକ୍ଷତା ହାସଲ କରିଛନ୍ତି!'
  }
};

const learningConcepts: LearningConcept[] = [
  {
    id: 'what-is-set',
    name: 'What is a Set?',
    description: 'Learn the fundamental definition and notation of sets',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-600',
    glowColor: 'blue-400',
    completed: false,
    unlocked: true
  },
  {
    id: 'types-of-sets',
    name: 'Types of Sets',
    description: 'Explore finite, infinite, empty, and universal sets',
    icon: <Calculator className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600',
    glowColor: 'green-400',
    completed: false,
    unlocked: false,
    prerequisite: 'what-is-set'
  },
  {
    id: 'subsets-intervals',
    name: 'Subsets & Intervals',
    description: 'Master subset relationships and interval notation',
    icon: <div className="w-6 h-6 flex items-center justify-center">⊆</div>,
    color: 'from-indigo-500 to-purple-600',
    glowColor: 'indigo-400',
    completed: false,
    unlocked: false,
    prerequisite: 'types-of-sets'
  },
  {
    id: 'set-operations',
    name: 'Set Operations',
    description: 'Master union, intersection, and complement operations',
    icon: <Target className="w-6 h-6" />,
    color: 'from-orange-500 to-red-600',
    glowColor: 'orange-400',
    completed: false,
    unlocked: false,
    prerequisite: 'subsets-intervals'
  },
  {
    id: 'venn-diagrams',
    name: 'Venn Diagrams',
    description: 'Visualize set relationships and solve problems',
    icon: <div className="w-6 h-6 rounded-full border-2 border-current"></div>,
    color: 'from-purple-500 to-violet-600',
    glowColor: 'purple-400',
    completed: false,
    unlocked: false,
    prerequisite: 'set-operations'
  },
  {
    id: 'real-world-problems',
    name: 'Real-World Applications',
    description: 'Apply sets to solve real-life problems and surveys',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-600',
    glowColor: 'pink-400',
    completed: false,
    unlocked: false,
    prerequisite: 'venn-diagrams'
  },
  {
    id: 'advanced-concepts',
    name: 'Advanced Concepts',
    description: 'Power sets, Cartesian products, and advanced topics',
    icon: <Award className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-600',
    glowColor: 'indigo-400',
    completed: false,
    unlocked: false,
    prerequisite: 'real-world-problems'
  }
];

export function SetsLearningFlow({ language, onBack }: SetsLearningFlowProps) {
  const [currentStage, setCurrentStage] = useState<LearningStage>('sequence');
  const [conceptStates, setConceptStates] = useState<LearningConcept[]>(learningConcepts);
  const [currentConcept, setCurrentConcept] = useState<ConceptType | null>(null);
  const [currentPractice, setCurrentPractice] = useState<PracticeType | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFinalQuiz, setShowFinalQuiz] = useState(false);

  // Calculate completion percentage
  const completionPercentage = (conceptStates.filter(c => c.completed).length / conceptStates.length) * 100;

  // Update unlock status based on completed concepts
  useEffect(() => {
    const shouldUpdate = conceptStates.some(concept => {
      if (concept.prerequisite) {
        const prerequisiteCompleted = conceptStates.find(c => c.id === concept.prerequisite)?.completed;
        const shouldBeUnlocked = !!prerequisiteCompleted;
        return concept.unlocked !== shouldBeUnlocked;
      }
      return false;
    });

    if (shouldUpdate) {
      setConceptStates(prev => prev.map(concept => {
        if (concept.prerequisite) {
          const prerequisiteCompleted = prev.find(c => c.id === concept.prerequisite)?.completed;
          return { ...concept, unlocked: !!prerequisiteCompleted };
        }
        return concept;
      }));
    }
  }, [conceptStates]);

  // Check if all concepts are completed
  const allConceptsCompleted = conceptStates.every(c => c.completed);

  // Update stage based on progress
  useEffect(() => {
    if (allConceptsCompleted && currentStage === 'concepts') {
      setCurrentStage('practice');
    }
  }, [allConceptsCompleted, currentStage]);

  const handleConceptComplete = useCallback((conceptId: ConceptType) => {
    setConceptStates(prev => prev.map(concept => 
      concept.id === conceptId ? { ...concept, completed: true } : concept
    ));
    setCurrentConcept(null);
  }, []);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    setCurrentStage('mastery');
  };

  const handleQuizBack = () => {
    setShowQuiz(false);
  };

  const handleSelectModule = (moduleId: string, action?: 'play' | 'replay' | 'practice' | 'summary') => {
    if (action === 'practice') {
      // Navigate to practice modules
      if (moduleId === 'venn-diagrams') {
        setCurrentPractice('venn-practice-2set');
      } else {
        setCurrentConcept(moduleId as ConceptType);
      }
    } else if (action === 'summary') {
      // Show summary/review mode for the concept
      setCurrentConcept(moduleId as ConceptType);
    } else {
      // Default to play/replay - navigate to the lesson
      setCurrentConcept(moduleId as ConceptType);
    }
    setCurrentStage('concepts');
  };

  const handleStartFinalQuiz = () => {
    setShowFinalQuiz(true);
  };

  const handleFinalQuizComplete = (score: number, totalQuestions: number) => {
    setShowFinalQuiz(false);
    setCurrentStage('mastery');
    // You could store the final quiz score here
    console.log('Final Quiz completed:', { score, totalQuestions });
  };

  const handleFinalQuizBack = () => {
    setShowFinalQuiz(false);
  };

  // Show module sequence by default
  if (currentStage === 'sequence') {
    return (
      <ModuleSequence
        language={language}
        onBack={onBack}
        onSelectModule={handleSelectModule}
        onLanguageChange={() => {}} // Language change handled at parent level
      />
    );
  }

  // Show Final Quiz Arena
  if (showFinalQuiz) {
    return (
      <SetsQuizArena
        language={language}
        onBack={handleFinalQuizBack}
        onComplete={handleFinalQuizComplete}
      />
    );
  }

  // Show quiz if requested
  if (showQuiz) {
    return (
      <Quiz_Sets_1
        language={language}
        onComplete={handleQuizComplete}
        onBack={handleQuizBack}
      />
    );
  }

  // Show interactive lesson if a concept is selected
  if (currentConcept) {
    switch (currentConcept) {
      case 'what-is-set':
        return (
          <WhatIsASetLesson
            language={language}
            onComplete={() => handleConceptComplete('what-is-set')}
            onBack={() => setCurrentConcept(null)}
          />
        );
      case 'types-of-sets':
        return (
          <TypesOfSetsLesson
            language={language}
            onComplete={() => handleConceptComplete('types-of-sets')}
            onBack={() => setCurrentConcept(null)}
          />
        );
      case 'subsets-intervals':
        return (
          <SubsetsIntervalsLesson
            language={language}
            onComplete={() => handleConceptComplete('subsets-intervals')}
            onBack={() => setCurrentConcept(null)}
          />
        );
      case 'set-operations':
        return (
          <SetOperationsLesson
            language={language}
            onComplete={() => handleConceptComplete('set-operations')}
            onBack={() => setCurrentConcept(null)}
          />
        );
      default:
        // Fall back to static content for other concepts
        return renderConceptContent(currentConcept);
    }
  }

  // Show practice if a practice type is selected
  if (currentPractice) {
    switch (currentPractice) {
      case 'venn-practice-2set':
        return (
          <VennPractice2Set
            language={language}
            onComplete={() => handleConceptComplete('venn-diagrams')}
            onBack={() => setCurrentPractice(null)}
          />
        );
      case 'venn-practice-3set':
        return (
          <VennPractice3Set
            language={language}
            onComplete={() => handleConceptComplete('venn-diagrams')}
            onBack={() => setCurrentPractice(null)}
          />
        );
      default:
        // Fall back to static content for other practices
        return renderConceptContent(currentConcept);
    }
  }

  // Concept Learning Content
  const renderConceptContent = (conceptId: ConceptType) => {
    const conceptContent: Record<ConceptType, { title: string; content: React.ReactNode }> = {
      'what-is-set': {
        title: 'What is a Set?',
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-400/30">
              <h3 className="text-2xl text-blue-300 mb-4">🎯 Definition</h3>
              <p className="text-lg text-gray-200 mb-4">
                A <strong>set</strong> is a well-defined collection of distinct objects called <strong>elements</strong> or <strong>members</strong>.
              </p>
              <div className="bg-blue-900/30 p-4 rounded-lg">
                <p className="text-blue-200">
                  <strong>Example:</strong> A = &#123;1, 2, 3, 4, 5&#125;
                </p>
                <p className="text-blue-200 mt-2">
                  Here, 1, 2, 3, 4, 5 are the elements of set A.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-400/30">
              <h3 className="text-2xl text-green-300 mb-4">📝 Key Properties</h3>
              <ul className="space-y-2 text-gray-200">
                <li>• <strong>Well-defined:</strong> It must be clear what belongs to the set</li>
                <li>• <strong>Distinct:</strong> No element appears more than once</li>
                <li>• <strong>Unordered:</strong> Order doesn't matter: &#123;1,2,3&#125; = &#123;3,1,2&#125;</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 p-6 rounded-xl border border-purple-400/30">
              <h3 className="text-2xl text-purple-300 mb-4">🔤 Notation</h3>
              <div className="space-y-3 text-gray-200">
                <p>• <strong>Set:</strong> A = &#123;1, 2, 3&#125;</p>
                <p>• <strong>Element belongs to set:</strong> 2 ∈ A</p>
                <p>• <strong>Element doesn't belong:</strong> 5 ∉ A</p>
                <p>• <strong>Empty set:</strong> ∅ or &#123; &#125;</p>
              </div>
            </div>
          </div>
        )
      },
      'types-of-sets': {
        title: 'Types of Sets',
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-6 rounded-xl border border-emerald-400/30">
              <h3 className="text-2xl text-emerald-300 mb-4">🔢 Finite Sets</h3>
              <p className="text-lg text-gray-200 mb-4">
                A set with a <strong>countable number</strong> of elements.
              </p>
              <div className="bg-emerald-900/30 p-4 rounded-lg space-y-2">
                <p className="text-emerald-200"><strong>Examples:</strong></p>
                <p className="text-emerald-200">• A = &#123;1, 2, 3, 4, 5&#125; → |A| = 5</p>
                <p className="text-emerald-200">• B = &#123;red, blue, green&#125; → |B| = 3</p>
                <p className="text-emerald-200">• C = ∅ → |C| = 0 (empty set)</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 rounded-xl border border-blue-400/30">
              <h3 className="text-2xl text-blue-300 mb-4">∞ Infinite Sets</h3>
              <p className="text-lg text-gray-200 mb-4">
                A set with <strong>unlimited elements</strong> that cannot be counted.
              </p>
              <div className="bg-blue-900/30 p-4 rounded-lg space-y-2">
                <p className="text-blue-200"><strong>Examples:</strong></p>
                <p className="text-blue-200">• ℕ = &#123;1, 2, 3, 4, ...&#125; (Natural numbers)</p>
                <p className="text-blue-200">• ℝ = All real numbers</p>
                <p className="text-blue-200">• &#123;x | x &gt; 0&#125; (All positive numbers)</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 p-6 rounded-xl border border-purple-400/30">
              <h3 className="text-2xl text-purple-300 mb-4">🌍 Universal Set</h3>
              <p className="text-lg text-gray-200 mb-4">
                The <strong>universal set</strong> contains all elements under consideration in a particular context.
              </p>
              <div className="bg-purple-900/30 p-4 rounded-lg space-y-2">
                <p className="text-purple-200"><strong>Example:</strong></p>
                <p className="text-purple-200">If studying digits: U = &#123;0, 1, 2, 3, 4, 5, 6, 7, 8, 9&#125;</p>
                <p className="text-purple-200">All other sets are subsets of U</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-xl border border-orange-400/30">
              <h3 className="text-2xl text-orange-300 mb-4">∅ Empty Set</h3>
              <p className="text-lg text-gray-200 mb-4">
                A set that contains <strong>no elements</strong>. Also called the null set.
              </p>
              <div className="bg-orange-900/30 p-4 rounded-lg space-y-2">
                <p className="text-orange-200"><strong>Properties:</strong></p>
                <p className="text-orange-200">• Symbol: ∅ or &#123;&#125;</p>
                <p className="text-orange-200">• Cardinality: |∅| = 0</p>
                <p className="text-orange-200">• Subset of every set</p>
              </div>
            </div>
          </div>
        )
      },
      'subsets-intervals': {
        title: 'Subsets & Intervals',
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-xl border border-indigo-400/30">
              <h3 className="text-2xl text-indigo-300 mb-4">⊆ Subsets</h3>
              <p className="text-lg text-gray-200 mb-4">
                A <strong>subset</strong> is a set that contains only elements from another set.
              </p>
              <div className="bg-indigo-900/30 p-4 rounded-lg space-y-2">
                <p className="text-indigo-200"><strong>Example:</strong></p>
                <p className="text-indigo-200">A = &#123;1, 2, 3&#125;, B = &#123;1, 2&#125;</p>
                <p className="text-indigo-200">B is a subset of A (B ⊆ A)</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-400/30">
              <h3 className="text-2xl text-blue-300 mb-4">➡️ Interval Notation</h3>
              <p className="text-lg text-gray-200 mb-4">
                Interval notation is a way to represent a range of numbers.
              </p>
              <div className="bg-blue-900/30 p-4 rounded-lg space-y-2">
                <p className="text-blue-200"><strong>Examples:</strong></p>
                <p className="text-blue-200">• [1, 5] (includes 1 and 5)</p>
                <p className="text-blue-200">• (2, 8) (excludes 2 and 8)</p>
                <p className="text-blue-200">• [3, ∞) (includes 3 and all numbers greater than 3)</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-400/30">
              <h3 className="text-2xl text-green-300 mb-4">🏫 Real-World Problem Solving</h3>
              <div className="space-y-4">
                <div className="bg-green-900/30 p-4 rounded-lg">
                  <h4 className="text-green-200 font-semibold mb-2">School Survey Example:</h4>
                  <div className="space-y-2 text-green-200">
                    <p><strong>Problem:</strong> In a class of 50 students:</p>
                    <p>• 25 students like Math</p>
                    <p>• 30 students like Science</p>
                    <p>• 10 students like both subjects</p>
                    <p><strong>Question:</strong> How many students like at least one subject?</p>
                  </div>
                  
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="bg-green-800/30 p-3 rounded-lg">
                      <h5 className="text-green-100 font-semibold mb-2">🔍 Venn Diagram Analysis:</h5>
                      <div className="space-y-1 text-green-200 text-sm">
                        <p>• Only Math: 25 - 10 = 15 students</p>
                        <p>• Only Science: 30 - 10 = 20 students</p>
                        <p>• Both subjects: 10 students</p>
                        <p>• Total: 15 + 20 + 10 = 45 students</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-800/30 p-3 rounded-lg">
                      <h5 className="text-green-100 font-semibold mb-2">📐 Using Formula:</h5>
                      <div className="space-y-1 text-green-200 text-sm">
                        <p>|Math ∪ Science| = |Math| + |Science| - |Math ∩ Science|</p>
                        <p>= 25 + 30 - 10</p>
                        <p>= 55 - 10</p>
                        <p><strong>= 45 students ✓</strong></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-green-800/20 p-3 rounded-lg">
                    <p className="text-green-200"><strong>Additional insights:</strong></p>
                    <p className="text-green-200">• Students who like neither: 50 - 45 = 5 students</p>
                    <p className="text-green-200">• Students who like exactly one subject: 45 - 10 = 35 students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW SECTION: Interactive Practice */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-xl border border-yellow-400/30">
              <h3 className="text-2xl text-yellow-300 mb-4">🎯 Interactive Venn Practice</h3>
              <div className="space-y-4">
                <div className="bg-yellow-900/30 p-4 rounded-lg">
                  <h4 className="text-yellow-200 font-semibold mb-2">Ready to Practice?</h4>
                  <p className="text-yellow-200 mb-4">
                    Now that you understand Venn diagrams, try these interactive practice modules!
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-800/30 p-4 rounded-lg">
                      <h5 className="text-yellow-100 font-semibold mb-2">👥 2-Set Practice</h5>
                      <p className="text-yellow-200 text-sm mb-3">
                        Practice with real-life scenarios using 2 sets. Drag and drop students into correct Venn regions!
                      </p>
                      <Button
                        onClick={() => {
                          setCurrentConcept(null);
                          setCurrentPractice('venn-practice-2set');
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                      >
                        Start 2-Set Practice
                      </Button>
                    </div>
                    
                    <div className="bg-yellow-800/30 p-4 rounded-lg">
                      <h5 className="text-yellow-100 font-semibold mb-2">🔢 3-Set Practice</h5>
                      <p className="text-yellow-200 text-sm mb-3">
                        Advanced numeric problems with 3 sets. Use the inclusion-exclusion formula to solve step-by-step!
                      </p>
                      <Button
                        onClick={() => {
                          setCurrentConcept(null);
                          setCurrentPractice('venn-practice-3set');
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                      >
                        Start 3-Set Practice
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      'set-operations': {
        title: 'Set Operations',
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-xl border border-orange-400/30">
              <h3 className="text-2xl text-orange-300 mb-4">∪ Union</h3>
              <p className="text-lg text-gray-200 mb-4">
                The <strong>union</strong> A ∪ B contains all elements from both sets.
              </p>
              <div className="bg-orange-900/30 p-4 rounded-lg space-y-2">
                <p className="text-orange-200"><strong>Example:</strong></p>
                <p className="text-orange-200">A = &#123;1, 2, 3&#125;, B = &#123;3, 4, 5&#125;</p>
                <p className="text-orange-200">A ∪ B = &#123;1, 2, 3, 4, 5&#125;</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 p-6 rounded-xl border border-green-400/30">
              <h3 className="text-2xl text-green-300 mb-4">∩ Intersection</h3>
              <p className="text-lg text-gray-200 mb-4">
                The <strong>intersection</strong> A ∩ B contains only common elements.
              </p>
              <div className="bg-green-900/30 p-4 rounded-lg space-y-2">
                <p className="text-green-200"><strong>Using the same example:</strong></p>
                <p className="text-green-200">A = &#123;1, 2, 3&#125;, B = &#123;3, 4, 5&#125;</p>
                <p className="text-green-200">A ∩ B = &#123;3&#125; (only 3 is common)</p>
              </div>
            </div>

            {/* NEW SECTION: Inclusion-Exclusion Principle */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-6 rounded-xl border border-yellow-400/30">
              <h3 className="text-2xl text-yellow-300 mb-4">📐 Counting Elements in Union</h3>
              <p className="text-lg text-gray-200 mb-4">
                How do we count elements in A ∪ B? We use the <strong>Inclusion-Exclusion Principle</strong>!
              </p>
              
              <div className="bg-yellow-900/30 p-4 rounded-lg space-y-4">
                <div className="space-y-2">
                  <p className="text-yellow-200 text-xl"><strong>Formula: |A ∪ B| = |A| + |B| - |A ∩ B|</strong></p>
                  
                  <div className="bg-yellow-800/30 p-3 rounded-lg mt-3">
                    <h4 className="text-yellow-100 font-semibold mb-2">🤔 Why subtract |A ∩ B|?</h4>
                    <p className="text-yellow-200">When we add |A| + |B|, we count the common elements (intersection) TWICE!</p>
                    <p className="text-yellow-200">So we must subtract |A ∩ B| once to get the correct count.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-yellow-200 font-semibold">📝 Step-by-step Example:</h4>
                  <div className="bg-yellow-800/20 p-3 rounded">
                    <p className="text-yellow-200">A = &#123;1, 2, 3, 5&#125; → |A| = 4</p>
                    <p className="text-yellow-200">B = &#123;3, 4, 5, 6&#125; → |B| = 4</p>
                    <p className="text-yellow-200">A ∩ B = &#123;3, 5&#125; → |A ∩ B| = 2</p>
                    <p className="text-yellow-200 mt-2"><strong>Step 1:</strong> Add all elements: |A| + |B| = 4 + 4 = 8</p>
                    <p className="text-yellow-200"><strong>Step 2:</strong> Subtract double-counted: 8 - 2 = 6</p>
                    <p className="text-yellow-200"><strong>Result:</strong> A ∪ B = &#123;1, 2, 3, 4, 5, 6&#125; → |A ∪ B| = 6 ✓</p>
                  </div>
                </div>

                <div className="bg-yellow-800/30 p-3 rounded-lg">
                  <h4 className="text-yellow-100 font-semibold mb-2">🏫 Real-World Example:</h4>
                  <p className="text-yellow-200">In a class survey:</p>
                  <p className="text-yellow-200">• 25 students like Math</p>
                  <p className="text-yellow-200">• 20 students like Science</p>
                  <p className="text-yellow-200">• 8 students like both</p>
                  <p className="text-yellow-200 mt-2"><strong>Students who like Math OR Science:</strong></p>
                  <p className="text-yellow-200">|Math ∪ Science| = 25 + 20 - 8 = 37 students</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 p-6 rounded-xl border border-pink-400/30">
              <h3 className="text-2xl text-pink-300 mb-4">A′ Complement</h3>
              <p className="text-lg text-gray-200 mb-4">
                The <strong>complement</strong> A′ contains all elements in U that are NOT in A.
              </p>
              <div className="bg-pink-900/30 p-4 rounded-lg space-y-2">
                <p className="text-pink-200"><strong>Formula:</strong> |A′| = |U| - |A|</p>
                <p className="text-pink-200"><strong>Example:</strong></p>
                <p className="text-pink-200">U = &#123;1, 2, 3, 4, 5&#125;, A = &#123;1, 2&#125;</p>
                <p className="text-pink-200">A′ = &#123;3, 4, 5&#125;</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 rounded-xl border border-blue-400/30">
              <h3 className="text-2xl text-blue-300 mb-4">- Set Difference</h3>
              <p className="text-lg text-gray-200 mb-4">
                A - B contains elements in A but <strong>not in B</strong>.
              </p>
              <div className="bg-blue-900/30 p-4 rounded-lg space-y-2">
                <p className="text-blue-200"><strong>Example:</strong></p>
                <p className="text-blue-200">A = &#123;1, 2, 3, 4&#125;, B = &#123;2, 4&#125;</p>
                <p className="text-blue-200">A - B = &#123;1, 3&#125;</p>
                <p className="text-blue-200">B - A = ∅</p>
              </div>
            </div>
          </div>
        )
      },
      'venn-diagrams': {
        title: 'Venn Diagrams',
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 p-6 rounded-xl border border-violet-400/30">
              <h3 className="text-2xl text-violet-300 mb-4">◯ Visual Representation</h3>
              <p className="text-lg text-gray-200 mb-4">
                Venn diagrams use <strong>overlapping circles</strong> to show relationships between sets.
              </p>
              <div className="bg-violet-900/30 p-4 rounded-lg">
                <div className="relative w-full h-48 mb-4 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  {/* Enhanced Venn diagram representation with formula regions */}
                  <div className="text-violet-200 text-xs font-mono leading-tight">
                    <div className="text-center mb-2 text-violet-300">
                      <strong>|A ∪ B| = |A| + |B| - |A ∩ B|</strong>
                    </div>
                    <div>      ┌───────────┐         ┌───────────┐</div>
                    <div>      │     A     │         │     B     │</div>
                    <div>      │   Only    │    ∩    │   Only    │</div>
                    <div>      │     A     │ ┌─────┐ │     B     │</div>
                    <div>      │           │ │ A∩B │ │           │</div>
                    <div>      │   |A|-|A∩B| │Common│ │ |B|-|A∩B|│</div>
                    <div>      └───────────┘ └─────┘ └───────────┘</div>
                    <div className="text-center mt-2 text-yellow-300">
                      <div>Total elements in A ∪ B:</div>
                      <div>[Only A] + [Common] + [Only B]</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-violet-200">
                  <p>• <strong>Circle A:</strong> Elements only in A = |A| - |A ∩ B|</p>
                  <p>• <strong>Circle B:</strong> Elements only in B = |B| - |A ∩ B|</p>
                  <p>• <strong>Overlap (A ∩ B):</strong> Common elements = |A ∩ B|</p>
                  <p>• <strong>Union (A ∪ B):</strong> All unique elements = |A| + |B| - |A ∩ B|</p>
                </div>
              </div>
            </div>

            {/* NEW SECTION: Formula Application with Venn Diagrams */}
            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 rounded-xl border border-blue-400/30">
              <h3 className="text-2xl text-blue-300 mb-4">🧮 Applying the Formula with Venn Diagrams</h3>
              <p className="text-lg text-gray-200 mb-4">
                Let's see how the <strong>Inclusion-Exclusion Formula</strong> works with Venn diagrams!
              </p>
              
              <div className="bg-blue-900/30 p-4 rounded-lg space-y-4">
                <div className="bg-blue-800/30 p-3 rounded-lg">
                  <h4 className="text-blue-200 font-semibold mb-2">📊 Step-by-Step Breakdown:</h4>
                  <div className="space-y-2 text-blue-200">
                    <p><strong>Given:</strong> |A| = 15, |B| = 12, |A ∩ B| = 5</p>
                    <p><strong>Find:</strong> |A ∪ B| = ?</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-800/20 p-3 rounded-lg">
                    <h5 className="text-blue-100 font-semibold mb-2">🔍 Visual Analysis:</h5>
                    <div className="space-y-1 text-blue-200 text-sm">
                      <p>• Only in A: 15 - 5 = 10 elements</p>
                      <p>• Only in B: 12 - 5 = 7 elements</p>
                      <p>• In both A and B: 5 elements</p>
                      <p>• Total unique: 10 + 7 + 5 = 22</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-800/20 p-3 rounded-lg">
                    <h5 className="text-blue-100 font-semibold mb-2">📐 Formula Calculation:</h5>
                    <div className="space-y-1 text-blue-200 text-sm">
                      <p>|A ∪ B| = |A| + |B| - |A ∩ B|</p>
                      <p>|A ∪ B| = 15 + 12 - 5</p>
                      <p>|A ∪ B| = 27 - 5</p>
                      <p><strong>|A ∪ B| = 22 ✓</strong></p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-800/30 p-3 rounded-lg">
                  <p className="text-blue-100"><strong>💡 Key Insight:</strong> Both methods give the same answer! The Venn diagram helps us visualize WHY we subtract the intersection - to avoid counting those 5 common elements twice.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-400/30">
              <h3 className="text-2xl text-green-300 mb-4">🏫 Real-World Problem Solving</h3>
              <div className="space-y-4">
                <div className="bg-green-900/30 p-4 rounded-lg">
                  <h4 className="text-green-200 font-semibold mb-2">School Survey Example:</h4>
                  <div className="space-y-2 text-green-200">
                    <p><strong>Problem:</strong> In a class of 50 students:</p>
                    <p>• 25 students like Math</p>
                    <p>• 30 students like Science</p>
                    <p>• 10 students like both subjects</p>
                    <p><strong>Question:</strong> How many students like at least one subject?</p>
                  </div>
                  
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div className="bg-green-800/30 p-3 rounded-lg">
                      <h5 className="text-green-100 font-semibold mb-2">🔍 Venn Diagram Analysis:</h5>
                      <div className="space-y-1 text-green-200 text-sm">
                        <p>• Only Math: 25 - 10 = 15 students</p>
                        <p>• Only Science: 30 - 10 = 20 students</p>
                        <p>• Both subjects: 10 students</p>
                        <p>• Total: 15 + 20 + 10 = 45 students</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-800/30 p-3 rounded-lg">
                      <h5 className="text-green-100 font-semibold mb-2">📐 Using Formula:</h5>
                      <div className="space-y-1 text-green-200 text-sm">
                        <p>|Math ∪ Science| = |Math| + |Science| - |Math ∩ Science|</p>
                        <p>= 25 + 30 - 10</p>
                        <p>= 55 - 10</p>
                        <p><strong>= 45 students ✓</strong></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-green-800/20 p-3 rounded-lg">
                    <p className="text-green-200"><strong>Additional insights:</strong></p>
                    <p className="text-green-200">• Students who like neither: 50 - 45 = 5 students</p>
                    <p className="text-green-200">• Students who like exactly one subject: 45 - 10 = 35 students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW SECTION: Interactive Practice */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded-xl border border-yellow-400/30">
              <h3 className="text-2xl text-yellow-300 mb-4">🎯 Interactive Venn Practice</h3>
              <div className="space-y-4">
                <div className="bg-yellow-900/30 p-4 rounded-lg">
                  <h4 className="text-yellow-200 font-semibold mb-2">Ready to Practice?</h4>
                  <p className="text-yellow-200 mb-4">
                    Now that you understand Venn diagrams, try these interactive practice modules!
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-800/30 p-4 rounded-lg">
                      <h5 className="text-yellow-100 font-semibold mb-2">👥 2-Set Practice</h5>
                      <p className="text-yellow-200 text-sm mb-3">
                        Practice with real-life scenarios using 2 sets. Drag and drop students into correct Venn regions!
                      </p>
                      <Button
                        onClick={() => {
                          setCurrentConcept(null);
                          setCurrentPractice('venn-practice-2set');
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                      >
                        Start 2-Set Practice
                      </Button>
                    </div>
                    
                    <div className="bg-yellow-800/30 p-4 rounded-lg">
                      <h5 className="text-yellow-100 font-semibold mb-2">🔢 3-Set Practice</h5>
                      <p className="text-yellow-200 text-sm mb-3">
                        Advanced numeric problems with 3 sets. Use the inclusion-exclusion formula to solve step-by-step!
                      </p>
                      <Button
                        onClick={() => {
                          setCurrentConcept(null);
                          setCurrentPractice('venn-practice-3set');
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white"
                      >
                        Start 3-Set Practice
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      },
      'real-world-problems': {
        title: 'Real-World Applications',
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 p-6 rounded-xl border border-pink-400/30">
              <h3 className="text-2xl text-pink-300 mb-4">🏪 Market Research</h3>
              <div className="bg-pink-900/30 p-4 rounded-lg space-y-2">
                <p className="text-pink-200"><strong>Problem:</strong> A survey of 100 people about product preferences:</p>
                <p className="text-pink-200">• 60 like Product A</p>
                <p className="text-pink-200">• 40 like Product B</p>
                <p className="text-pink-200">• 25 like both products</p>
                <p className="text-pink-200 mt-2"><strong>Find:</strong> How many like neither product?</p>
                <p className="text-pink-200"><strong>Solution:</strong> Using |A ∪ B| = |A| + |B| - |A ∩ B|</p>
                <p className="text-pink-200">|A ∪ B| = 60 + 40 - 25 = 75</p>
                <p className="text-pink-200">Neither = 100 - 75 = 25 people</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6 rounded-xl border border-blue-400/30">
              <h3 className="text-2xl text-blue-300 mb-4">📚 Academic Analysis</h3>
              <div className="bg-blue-900/30 p-4 rounded-lg space-y-2">
                <p className="text-blue-200"><strong>Problem:</strong> In a class of 50 students:</p>
                <p className="text-blue-200">• 30 study English</p>
                <p className="text-blue-200">• 25 study Mathematics</p>
                <p className="text-blue-200">• 20 study Science</p>
                <p className="text-blue-200">• 15 study English and Math</p>
                <p className="text-blue-200">• 12 study Math and Science</p>
                <p className="text-blue-200">• 8 study English and Science</p>
                <p className="text-blue-200">• 5 study all three subjects</p>
                <p className="text-blue-200 mt-2"><strong>Find:</strong> Students studying exactly two subjects</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-400/30">
              <h3 className="text-2xl text-green-300 mb-4">💻 Computer Science</h3>
              <div className="bg-green-900/30 p-4 rounded-lg space-y-2">
                <p className="text-green-200"><strong>Database Queries:</strong></p>
                <p className="text-green-200">• Union: Combine results from multiple tables</p>
                <p className="text-green-200">• Intersection: Find common records</p>
                <p className="text-green-200">• Difference: Exclude certain records</p>
                <p className="text-green-200 mt-2"><strong>Programming:</strong></p>
                <p className="text-green-200">• Data structures (arrays, lists)</p>
                <p className="text-green-200">• Algorithm optimization</p>
                <p className="text-green-200">• Set operations in various languages</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-xl border border-orange-400/30">
              <h3 className="text-2xl text-orange-300 mb-4">🧬 Biology & Medicine</h3>
              <div className="bg-orange-900/30 p-4 rounded-lg space-y-2">
                <p className="text-orange-200"><strong>Genetics:</strong></p>
                <p className="text-orange-200">• Gene expression analysis</p>
                <p className="text-orange-200">• Population genetics studies</p>
                <p className="text-orange-200"><strong>Medical Diagnosis:</strong></p>
                <p className="text-orange-200">• Symptom analysis</p>
                <p className="text-orange-200">• Drug interaction studies</p>
                <p className="text-orange-200">• Patient classification</p>
              </div>
            </div>
          </div>
        )
      },
      'advanced-concepts': {
        title: 'Advanced Concepts',
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-xl border border-indigo-400/30">
              <h3 className="text-2xl text-indigo-300 mb-4">📈 Power Sets</h3>
              <p className="text-lg text-gray-200 mb-4">
                The power set P(A) is the set of all subsets of A.
              </p>
              <div className="bg-indigo-900/30 p-4 rounded-lg space-y-2">
                <p className="text-indigo-200"><strong>Example:</strong></p>
                <p className="text-indigo-200">A = &#123;1, 2&#125;</p>
                <p className="text-indigo-200">P(A) = &#123;∅, &#123;1&#125;, &#123;2&#125;, &#123;1, 2&#125;&#125;</p>
                <p className="text-indigo-200"><strong>Formula:</strong> If |A| = n, then |P(A)| = 2ⁿ</p>
                <p className="text-indigo-200">For A = &#123;1, 2&#125;: |P(A)| = 2² = 4</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-400/30">
              <h3 className="text-2xl text-blue-300 mb-4">× Cartesian Products</h3>
              <p className="text-lg text-gray-200 mb-4">
                The Cartesian product A × B is the set of all ordered pairs (a, b) where a ∈ A and b ∈ B.
              </p>
              <div className="bg-blue-900/30 p-4 rounded-lg space-y-2">
                <p className="text-blue-200"><strong>Example:</strong></p>
                <p className="text-blue-200">A = &#123;1, 2&#125;, B = &#123;red, blue&#125;</p>
                <p className="text-blue-200">A × B = &#123;(1, red), (1, blue), (2, red), (2, blue)&#125;</p>
                <p className="text-blue-200"><strong>Formula:</strong> |A × B| = |A| × |B|</p>
                <p className="text-blue-200">Here: |A × B| = 2 × 2 = 4</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-400/30">
              <h3 className="text-2xl text-green-300 mb-4">⊆ Relations & Functions</h3>
              <p className="text-lg text-gray-200 mb-4">
                Relations and functions are built on set theory foundations.
              </p>
              <div className="bg-green-900/30 p-4 rounded-lg space-y-2">
                <p className="text-green-200"><strong>Relation:</strong> A subset of A × B</p>
                <p className="text-green-200"><strong>Function:</strong> A special relation where each input has exactly one output</p>
                <p className="text-green-200"><strong>Domain:</strong> Set of all inputs</p>
                <p className="text-green-200"><strong>Range:</strong> Set of all outputs</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 p-6 rounded-xl border border-violet-400/30">
              <h3 className="text-2xl text-violet-300 mb-4">∞ Set Theory Applications</h3>
              <div className="bg-violet-900/30 p-4 rounded-lg space-y-2">
                <p className="text-violet-200"><strong>Advanced Topics:</strong></p>
                <p className="text-violet-200">• Infinite sets and cardinality</p>
                <p className="text-violet-200">• Set theory in logic and proofs</p>
                <p className="text-violet-200">• Russell's Paradox and set limitations</p>
                <p className="text-violet-200">• Applications in topology and analysis</p>
                <p className="text-violet-200">• Set theory as foundation of mathematics</p>
              </div>
            </div>
          </div>
        )
      }
    };

    const content = conceptContent[conceptId];
    if (!content) return null;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            {content.title}
          </h2>
        </div>
        
        <div className="mb-8">
          {content.content}
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setCurrentConcept(null)}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {translations.backToArena[language]}
          </Button>
          <Button
            onClick={() => handleConceptComplete(conceptId)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
          >
            {translations.markComplete[language]}
            <CheckCircle className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  // Show concept content if selected
  if (currentConcept) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        {renderConceptContent(currentConcept)}
      </div>
    );
  }

  // Show mastery completion screen
  if (currentStage === 'mastery') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-green-300 mb-4">
              🎉 {translations.masteryStage[language]} 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl text-gray-200 mb-6">
              {translations.congratulations[language]}
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleStartFinalQuiz}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Take Final Quiz
              </Button>
              <Button
                onClick={onBack}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700"
              >
                {translations.continue[language]}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main learning arena view
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="holo-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
              <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#holo-grid)" className="text-cyan-400"/>
        </svg>
      </div>

      {/* Glowing effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-10 w-44 h-44 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-1500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-mono tracking-wider mb-6">
            ⚡ {translations.title[language]} ⚡
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light tracking-wide">
            {translations.subtitle[language]}
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-400 font-mono">{translations.progressTitle[language]}</span>
              <span className="text-cyan-400 font-mono">{Math.round(completionPercentage)}%</span>
            </div>
            <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden border border-cyan-400">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className={`p-4 rounded-lg border transition-all duration-300 ${
                currentStage === 'concepts' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-gray-800/50 border-gray-600'
              }`}>
                <div className="text-2xl mb-2">📚</div>
                <div className="text-sm text-gray-300">{translations.conceptsStage[language]}</div>
                <div className="text-lg text-cyan-400">{conceptStates.filter(c => c.completed).length}/6</div>
              </div>
              <div className={`p-4 rounded-lg border transition-all duration-300 ${
                currentStage === 'practice' ? 'bg-purple-500/20 border-purple-400' : 'bg-gray-800/50 border-gray-600'
              }`}>
                <div className="text-2xl mb-2"></div>
                <div className="text-sm text-gray-300">{translations.practiceStage[language]}</div>
                <div className="text-lg text-purple-400">{allConceptsCompleted ? 'Ready' : 'Locked'}</div>
              </div>
              <div className={`p-4 rounded-lg border transition-all duration-300 ${
                currentStage === 'quiz' ? 'bg-green-500/20 border-green-400' : 'bg-gray-800/50 border-gray-600'
              }`}>
                <div className="text-2xl mb-2">🧠</div>
                <div className="text-sm text-gray-300">{translations.quizStage[language]}</div>
                <div className="text-lg text-green-400">{currentStage === 'quiz' ? 'Active' : 'Pending'}</div>
              </div>
              <div className={`p-4 rounded-lg border transition-all duration-300 ${
                currentStage === 'mastery' ? 'bg-gold-500/20 border-yellow-400' : 'bg-gray-800/50 border-gray-600'
              }`}>
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-sm text-gray-300">{translations.masteryStage[language]}</div>
                <div className="text-lg text-yellow-400">{currentStage === 'mastery' ? 'Complete' : 'Pending'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Concepts Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl text-center text-gray-200 mb-8">🎓 Learning Concepts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conceptStates.map((concept, index) => (
              <Card 
                key={concept.id}
                className={`transition-all duration-500 cursor-pointer group ${
                  concept.completed 
                    ? `bg-gradient-to-br ${concept.color} border-${concept.glowColor} shadow-lg` 
                    : concept.unlocked
                    ? 'bg-gray-800/50 border-gray-600 hover:border-cyan-400 hover:bg-gray-700/50'
                    : 'bg-gray-900/50 border-gray-700 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => concept.unlocked && setCurrentConcept(concept.id)}
              >
                <CardHeader className="text-center">
                  <div className="relative">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                      concept.completed ? 'bg-white/20' : concept.unlocked ? 'bg-gray-700' : 'bg-gray-800'
                    }`}>
                      {concept.completed ? '✅' : concept.unlocked ? concept.icon : <Lock className="w-6 h-6" />}
                    </div>
                    {!concept.unlocked && (
                      <div className="absolute -top-2 -right-2">
                        <Lock className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <CardTitle className={`text-lg ${
                    concept.completed ? 'text-white' : concept.unlocked ? 'text-cyan-300' : 'text-gray-500'
                  }`}>
                    {concept.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm text-center mb-4 ${
                    concept.completed ? 'text-gray-200' : concept.unlocked ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {concept.description}
                  </p>
                  {concept.completed && (
                    <div className="text-center">
                      <Badge className="bg-green-500/20 text-green-300 border-green-400">
                        ✅ {translations.completed[language]}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Practice/Quiz Section */}
        <div className="max-w-4xl mx-auto text-center">
          {currentStage === 'practice' ? (
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-300">🎉 {translations.practiceStage[language]}!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">
                  {translations.practiceUnlocked[language]}
                </p>
                <Button
                  onClick={handleStartQuiz}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 text-lg px-8 py-4"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {translations.takeQuiz[language]}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-400/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-300">⚡ {translations.practiceStage[language]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Complete all 6 learning concepts to unlock the practice quiz!
                </p>
                <p className="text-sm text-gray-500">
                  Progress: {conceptStates.filter(c => c.completed).length} / 6 concepts completed
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}