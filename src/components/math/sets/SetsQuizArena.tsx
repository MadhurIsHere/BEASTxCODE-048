import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Flag, Send, SkipForward, RotateCcw, Home, CheckCircle, XCircle, Trophy, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Progress } from '../../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { toast } from 'sonner@2.0.3';
import type { Language } from '../../../types/onboarding';

interface SetsQuizArenaProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, totalQuestions: number) => void;
}

interface QuizQuestion {
  id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'numeric' | 'boolean';
  question: {
    en: string;
    hi: string;
    or: string;
  };
  options?: {
    en: string[];
    hi: string[];
    or: string[];
  };
  correctAnswer: string | number;
  explanation: {
    en: string;
    hi: string;
    or: string;
  };
  svg?: React.ReactNode;
  hasFormula?: boolean;
}

interface QuizState {
  currentQuestion: number;
  answers: (string | number | null)[];
  reviewMarked: boolean[];
  timeRemaining: number; // in seconds
  isSubmitted: boolean;
  showExplanation: boolean;
  startTime: number;
}

const QUIZ_DURATION = 12 * 60; // 12 minutes in seconds

const translations = {
  title: {
    en: 'Sets Final Quiz Arena',
    hi: 'समुच्चय अंतिम प्रश्नोत्तरी अखाड़ा',
    or: 'ସେଟ୍ ଅନ୍ତିମ କୁଇଜ୍ ଆରେନା'
  },
  timeRemaining: {
    en: 'Time Remaining',
    hi: 'शेष समय',
    or: 'ବଳକା ସମୟ'
  },
  question: {
    en: 'Question',
    hi: 'प्रश्न',
    or: 'ପ୍ରଶ୍ନ'
  },
  of: {
    en: 'of',
    hi: 'का',
    or: 'ର'
  },
  previous: {
    en: 'Previous',
    hi: 'पिछला',
    or: 'ପୂର୍ବ'
  },
  next: {
    en: 'Next',
    hi: 'अगला',
    or: 'ପରବର୍ତ୍ତୀ'
  },
  markReview: {
    en: 'Mark for Review',
    hi: 'समीक्षा के लिए चिह्नित करें',
    or: 'ସମୀକ୍ଷା ପାଇଁ ଚିହ୍ନିତ କରନ୍ତୁ'
  },
  unmarkReview: {
    en: 'Unmark Review',
    hi: 'समीक्षा से हटाएं',
    or: 'ସମୀକ୍ଷାରୁ ହଟାନ୍ତୁ'
  },
  submitAnswer: {
    en: 'Submit Answer',
    hi: 'उत्तर जमा करें',
    or: 'ଉତ୍ତର ଦାଖଲ କରନ୍ତୁ'
  },
  skip: {
    en: 'Skip',
    hi: 'छोड़ें',
    or: 'ଛାଡ଼ନ୍ତୁ'
  },
  explanation: {
    en: 'Explanation',
    hi: 'व्याख्या',
    or: 'ବ୍ୟାଖ୍ୟା'
  },
  replayAnimation: {
    en: 'Replay Animation',
    hi: 'एनीमेशन दोबारा चलाएं',
    or: 'ଆନିମେସନ୍ ପୁନଃ ଚଲାନ୍ତୁ'
  },
  selectAnswer: {
    en: 'Select your answer',
    hi: 'अपना उत्तर चुनें',
    or: 'ଆପଣଙ୍କ ଉତ୍ତର ବାଛନ୍ତୁ'
  },
  enterNumber: {
    en: 'Enter your answer',
    hi: 'अपना उत्तर दर्ज करें',
    or: 'ଆପଣଙ୍କ ଉତ୍ତର ଲେଖନ୍ତୁ'
  },
  correct: {
    en: 'Correct!',
    hi: 'सही!',
    or: 'ସଠିକ୍!'
  },
  incorrect: {
    en: 'Incorrect!',
    hi: 'गलत!',
    or: 'ଭୁଲ୍!'
  },
  timeUp: {
    en: 'Time is up! Quiz auto-submitted.',
    hi: 'समय समाप्त! प्रश्नोत्तरी स्वतः जमा हो गई।',
    or: 'ସମୟ ସମାପ୍ତ! କୁଇଜ୍ ସ୍ୱୟଂଚାଳିତ ଭାବେ ଦାଖଲ ହେଲା।'
  },
  finalScore: {
    en: 'Final Score',
    hi: 'अंतिम स्कोर',
    or: 'ଅନ୍ତିମ ସ୍କୋର'
  },
  reviewAnswers: {
    en: 'Review Answers',
    hi: 'उत्तरों की समीक्षा करें',
    or: 'ଉତ୍ତରଗୁଡ଼ିକର ସମୀକ୍ଷା କରନ୍ତୁ'
  },
  backToModule: {
    en: 'Back to Module',
    hi: 'मॉड्यूल पर वापस',
    or: 'ମଡ୍ୟୁଲକୁ ଫେରନ୍ତୁ'
  },
  yes: {
    en: 'Yes',
    hi: 'हाँ',
    or: 'ହଁ'
  },
  no: {
    en: 'No',
    hi: 'नहीं',
    or: 'ନୁହେଁ'
  },
  true: {
    en: 'True',
    hi: 'सत्य',
    or: 'ସତ୍ୟ'
  },
  false: {
    en: 'False',
    hi: 'असत्य',
    or: 'ଅସତ୍ୟ'
  }
};

// Complete question bank with all 15 questions
const questionBank: QuizQuestion[] = [
  // EASY (1-5)
  {
    id: 1,
    difficulty: 'easy',
    type: 'multiple-choice',
    question: {
      en: 'Which symbol denotes the empty set?',
      hi: 'खाली समुच्चय को कौन सा चिह्न दर्शाता है?',
      or: 'ଖାଲି ସେଟ୍ କେଉଁ ଚିହ୍ନ ଦ୍ୱାରା ଦର୍ଶାଯାଇଥାଏ?'
    },
    options: {
      en: ['{}', '∅', 'Ø', 'None of these'],
      hi: ['{}', '∅', 'Ø', 'इनमें से कोई नहीं'],
      or: ['{}', '∅', 'Ø', 'ଏସବୁ ମଧ୍ୟରୁ କୌଣସିଟି ନୁହେଁ']
    },
    correctAnswer: '∅',
    explanation: {
      en: '∅ is the standard notation for empty set.',
      hi: '∅ खाली समुच्चय का मानक चिह्न है।',
      or: '∅ ଖାଲି ସେଟ୍ ପାଇଁ ମାନକ ଚିହ୍ନ।'
    }
  },
  {
    id: 2,
    difficulty: 'easy',
    type: 'multiple-choice',
    question: {
      en: 'Is the set {1, 2, 3} finite or infinite?',
      hi: 'क्या समुच्चय {1, 2, 3} परिमित है या अनंत?',
      or: 'ସେଟ୍ {1, 2, 3} ସୀମିତ ନା ଅସୀମ?'
    },
    options: {
      en: ['Finite', 'Infinite', 'Depends on context', 'Cannot be determined'],
      hi: ['परिमित', 'अनंत', 'संदर्भ पर निर्भर', 'निर्धारित नहीं किया जा सकता'],
      or: ['ସୀମିତ', 'ଅସୀମ', 'ପ୍ରସଙ୍ଗ ଉପରେ ନିର୍ଭର', 'ନିର୍ଣ୍ଣୟ କରାଯାଇପାରିବ ନାହିଁ']
    },
    correctAnswer: 'Finite',
    explanation: {
      en: 'It has a limited count (3 elements).',
      hi: 'इसमें सीमित संख्या (3 तत्व) हैं।',
      or: 'ଏହାର ସୀମିତ ସଂଖ୍ୟା (3 ଉପାଦାନ) ଅଛି।'
    }
  },
  {
    id: 3,
    difficulty: 'easy',
    type: 'boolean',
    question: {
      en: 'If A = {1, 2} and B = {2, 3}, is 2 in A ∪ B?',
      hi: 'यदि A = {1, 2} और B = {2, 3} है, तो क्या 2 A ∪ B में है?',
      or: 'ଯଦି A = {1, 2} ଏବଂ B = {2, 3}, ତେବେ 2 A ∪ B ରେ ଅଛି କି?'
    },
    correctAnswer: 'Yes',
    explanation: {
      en: 'Union contains 2 since 2 ∈ A and 2 ∈ B.',
      hi: 'संघ में 2 है क्योंकि 2 ∈ A और 2 ∈ B।',
      or: 'ୟୁନିଅନ୍ରେ 2 ଅଛି କାରଣ 2 ∈ A ଏବଂ 2 ∈ B।'
    }
  },
  {
    id: 4,
    difficulty: 'easy',
    type: 'multiple-choice',
    question: {
      en: 'Which symbol denotes intersection?',
      hi: 'प्रतिच्छेदन को कौन सा चिह्न दर्शाता है?',
      or: 'ଇଣ୍ଟରସେକ୍ସନ୍ କେଉଁ ଚିହ୍ନ ଦ୍ୱାରା ଦର୍ଶାଯାଇଥାଏ?'
    },
    options: {
      en: ['∪', '∩', '\\', '^'],
      hi: ['∪', '∩', '\\', '^'],
      or: ['∪', '∩', '\\', '^']
    },
    correctAnswer: '∩',
    explanation: {
      en: '∩ is the standard symbol for intersection.',
      hi: '∩ प्रतिच्छेदन का मानक चिह्न है।',
      or: '∩ ଇଣ୍ଟରସେକ୍ସନ୍ ପାଇଁ ମାନକ ଚିହ୍ନ।'
    }
  },
  {
    id: 5,
    difficulty: 'easy',
    type: 'boolean',
    question: {
      en: 'Is the empty set ∅ a subset of every set?',
      hi: 'क्या खाली समुच्चय ∅ हर समुच्चय का उप-समुच्चय है?',
      or: 'ଖାଲି ସେଟ୍ ∅ ପ୍ରତ୍ୟେକ ସେଟ୍ର ସବ୍‌ସେଟ୍ କି?'
    },
    correctAnswer: 'Yes',
    explanation: {
      en: 'Empty set is a subset of all sets by definition.',
      hi: 'खाली समुच्चय परिभाषा के अनुसार सभी समुच्चयों का उप-समुच्चय है।',
      or: 'ଖାଲି ସେଟ୍ ପରିଭାଷା ଅନୁଯାୟୀ ସମସ୍ତ ସେଟ୍ର ସବ୍‌ସେଟ୍।'
    }
  },

  // MEDIUM (6-10)
  {
    id: 6,
    difficulty: 'medium',
    type: 'multiple-choice',
    question: {
      en: 'If A = {1, 2, 3}, what is |P(A)| (size of power set)?',
      hi: 'यदि A = {1, 2, 3} है, तो |P(A)| (शक्ति समुच्चय का आकार) क्या है?',
      or: 'ଯଦି A = {1, 2, 3}, ତେବେ |P(A)| (ପାୱାର୍ ସେଟ୍ର ଆକାର) କଣ?'
    },
    options: {
      en: ['3', '6', '8', '9'],
      hi: ['3', '6', '8', '9'],
      or: ['3', '6', '8', '9']
    },
    correctAnswer: '8',
    explanation: {
      en: 'Power set size = 2^n = 2^3 = 8.',
      hi: 'शक्ति समुच्चय का आकार = 2^n = 2^3 = 8।',
      or: 'ପାୱାର୍ ସେଟ୍ର ଆକାର = 2^n = 2^3 = 8।'
    },
    hasFormula: true
  },
  {
    id: 7,
    difficulty: 'medium',
    type: 'boolean',
    question: {
      en: 'Is 0 included in the interval (-1, 0]?',
      hi: 'क्या 0 अंतराल (-1, 0] में शामिल है?',
      or: '0 ଇଣ୍ଟରଭାଲ୍ (-1, 0] ରେ ଅନ୍ତର୍ଭୁକ୍ତ କି?'
    },
    correctAnswer: 'Yes',
    explanation: {
      en: 'Square bracket ] means 0 is included.',
      hi: 'वर्गाकार कोष्ठक ] का मतलब है 0 शामिل है।',
      or: 'ବର୍ଗାକାର ବ୍ରାକେଟ୍ ] ମାନେ 0 ଅନ୍ତର୍ଭୁକ୍ତ।'
    }
  },
  {
    id: 8,
    difficulty: 'medium',
    type: 'multiple-choice',
    question: {
      en: 'If A = {a, b, c} and B = {b, c, d}, what is A ∩ B?',
      hi: 'यदि A = {a, b, c} और B = {b, c, d} है, तो A ∩ B क्या है?',
      or: 'ଯଦି A = {a, b, c} ଏବଂ B = {b, c, d}, ତେବେ A ∩ B କଣ?'
    },
    options: {
      en: ['{b, c}', '{a}', '∅', '{d}'],
      hi: ['{b, c}', '{a}', '∅', '{d}'],
      or: ['{b, c}', '{a}', '∅', '{d}']
    },
    correctAnswer: '{b, c}',
    explanation: {
      en: 'Intersection contains common elements: b and c.',
      hi: 'प्रतिच्छेदन में समान तत्व होते हैं: b और c।',
      or: 'ଇଣ୍ଟରସେକ୍ସନ୍ରେ ସାଧାରଣ ଉପାଦାନ ଅଛି: b ଏବଂ c।'
    }
  },
  {
    id: 9,
    difficulty: 'medium',
    type: 'multiple-choice',
    question: {
      en: 'If U = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10} and A = {2, 4, 6}, what is A^c (complement)?',
      hi: 'यदि U = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10} और A = {2, 4, 6} है, तो A^c (पूरक) क्या है?',
      or: 'ଯଦି U = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10} ଏବଂ A = {2, 4, 6}, ତେବେ A^c (କମ୍ପ୍ଲିମେଣ୍ଟ) କଣ?'
    },
    options: {
      en: ['{1, 3, 5, 7, 8, 9, 10}', '{1, 3, 5, 7, 9}', '{8, 9, 10}', '{1, 3, 5}'],
      hi: ['{1, 3, 5, 7, 8, 9, 10}', '{1, 3, 5, 7, 9}', '{8, 9, 10}', '{1, 3, 5}'],
      or: ['{1, 3, 5, 7, 8, 9, 10}', '{1, 3, 5, 7, 9}', '{8, 9, 10}', '{1, 3, 5}']
    },
    correctAnswer: '{1, 3, 5, 7, 8, 9, 10}',
    explanation: {
      en: 'Complement contains all elements in U but not in A.',
      hi: 'पूरक में U के सभी तत्व हैं लेकिन A में नहीं।',
      or: 'କମ୍ପ୍ଲିମେଣ୍ଟରେ U ର ସମସ୍ତ ଉପାଦାନ ଅଛି କିନ୍ତୁ A ରେ ନାହିଁ।'
    }
  },
  {
    id: 10,
    difficulty: 'medium',
    type: 'boolean',
    question: {
      en: 'True or False: If A ⊆ B and B ⊆ A, then A = B.',
      hi: 'सत्य या असत्य: यदि A ⊆ B और B ⊆ A है, तो A = B।',
      or: 'ସତ୍ୟ ବା ମିଥ୍ୟା: ଯଦି A ⊆ B ଏବଂ B ⊆ A, ତେବେ A = B।'
    },
    correctAnswer: 'True',
    explanation: {
      en: 'This is the definition of set equality.',
      hi: 'यह समुच्चय समानता की परिभाषा है।',
      or: 'ଏହା ସେଟ୍ ସମାନତାର ପରିଭାଷା।'
    }
  },

  // HARD (11-15)
  {
    id: 11,
    difficulty: 'hard',
    type: 'numeric',
    question: {
      en: '|A| = 4, |B| = 5, |A ∩ B| = 2. Find |A ∪ B|.',
      hi: '|A| = 4, |B| = 5, |A ∩ B| = 2। |A ∪ B| ज्ञात करें।',
      or: '|A| = 4, |B| = 5, |A ∩ B| = 2। |A ∪ B| ନିର୍ଣ୍ଣୟ କରନ୍ତୁ।'
    },
    correctAnswer: 7,
    explanation: {
      en: '|A ∪ B| = |A| + |B| - |A ∩ B| = 4 + 5 - 2 = 7',
      hi: '|A ∪ B| = |A| + |B| - |A ∩ B| = 4 + 5 - 2 = 7',
      or: '|A ∪ B| = |A| + |B| - |A ∩ B| = 4 + 5 - 2 = 7'
    },
    hasFormula: true
  },
  {
    id: 12,
    difficulty: 'hard',
    type: 'numeric',
    question: {
      en: 'In a 3-set survey: |M| = 40, |P| = 35, |C| = 30, |M ∩ P| = 10, |P ∩ C| = 5, |M ∩ C| = 8, |M ∩ P ∩ C| = 3. Find students who like at least one subject.',
      hi: '3-समुच्चय सर्वेक्षण में: |M| = 40, |P| = 35, |C| = 30, |M ∩ P| = 10, |P ∩ C| = 5, |M ∩ C| = 8, |M ∩ P ∩ C| = 3। कम से कम एक विषय पसंद करने वाले छात्र ज्ञात करें।',
      or: '3-ସେଟ୍ ସର୍ଭେରେ: |M| = 40, |P| = 35, |C| = 30, |M ∩ P| = 10, |P ∩ C| = 5, |M ∩ C| = 8, |M ∩ P ∩ C| = 3। ଅତି କମରେ ଗୋଟିଏ ବିଷୟ ପସନ୍ଦ କରୁଥିବା ଛାତ୍ର ନିର୍ଣ୍ଣୟ କରନ୍ତୁ।'
    },
    correctAnswer: 85,
    explanation: {
      en: 'Using inclusion-exclusion: 40 + 35 + 30 - 10 - 5 - 8 + 3 = 85',
      hi: 'समावेश-अपवर्जन का उपयोग: 40 + 35 + 30 - 10 - 5 - 8 + 3 = 85',
      or: 'ଇନକ୍ଲୁଜନ୍-ଏକ୍ସକ୍ଲୁଜନ୍ ବ୍ୟବହାର: 40 + 35 + 30 - 10 - 5 - 8 + 3 = 85'
    },
    hasFormula: true
  },
  {
    id: 13,
    difficulty: 'hard',
    type: 'multiple-choice',
    question: {
      en: 'Which numbers from {-3, -2, 0, 3, 4} are in the set {x | x² < 9}?',
      hi: '{-3, -2, 0, 3, 4} में से कौन सी संख्याएं समुच्चय {x | x² < 9} में हैं?',
      or: '{-3, -2, 0, 3, 4} ମଧ୍ୟରୁ କେଉଁ ସଂଖ୍ୟାଗୁଡ଼ିକ ସେଟ୍ {x | x² < 9} ରେ ଅଛି?'
    },
    options: {
      en: ['-2 and 0 only', '-3 and 3 only', 'All numbers', '0 only'],
      hi: ['केवल -2 और 0', 'केवल -3 और 3', 'सभी संख्याएं', 'केवल 0'],
      or: ['କେବଳ -2 ଏବଂ 0', 'କେବଳ -3 ଏବଂ 3', 'ସମସ୍ତ ସଂଖ୍ୟା', 'କେବଳ 0']
    },
    correctAnswer: '-2 and 0 only',
    explanation: {
      en: 'Only -2² = 4 < 9 and 0² = 0 < 9 satisfy the condition.',
      hi: 'केवल -2² = 4 < 9 और 0² = 0 < 9 शर्त को संतुष्ट करते हैं।',
      or: 'କେବଳ -2² = 4 < 9 ଏବଂ 0² = 0 < 9 ସର୍ତ୍ତ ପୂରଣ କରେ।'
    }
  },
  {
    id: 14,
    difficulty: 'hard',
    type: 'numeric',
    question: {
      en: 'If |P(X)| = 16, find |X|.',
      hi: 'यदि |P(X)| = 16 है, तो |X| ज्ञात करें।',
      or: 'ଯଦି |P(X)| = 16, ତେବେ |X| ନିର୍ଣ୍ଣୟ କରନ୍ତୁ।'
    },
    correctAnswer: 4,
    explanation: {
      en: 'Since |P(X)| = 2^n = 16, we have n = 4.',
      hi: 'चूंकि |P(X)| = 2^n = 16, इसलिए n = 4।',
      or: 'ଯେହେତୁ |P(X)| = 2^n = 16, ତେଣୁ n = 4।'
    },
    hasFormula: true
  },
  {
    id: 15,
    difficulty: 'hard',
    type: 'numeric',
    question: {
      en: 'From 100 students: 60 like subject A, 50 like subject B, 30 like both. How many like A or B?',
      hi: '100 छात्रों में से: 60 विषय A पसंद करते हैं, 50 विषय B पसंद करते हैं, 30 दोनों पसंद करते हैं। कितने A या B पसंद करते हैं?',
      or: '100 ଛାତ୍ରଙ୍କ ମଧ୍ୟରୁ: 60 ବିଷୟ A ପସନ୍ଦ କରନ୍ତି, 50 ବିଷୟ B ପସନ୍ଦ କରନ୍ତି, 30 ଦୁଇଟି ପସନ୍ଦ କରନ୍ତି। କେତେ A ବା B ପସନ୍ଦ କରନ୍ତି?'
    },
    correctAnswer: 80,
    explanation: {
      en: '|A ∪ B| = 60 + 50 - 30 = 80 students',
      hi: '|A ∪ B| = 60 + 50 - 30 = 80 छात्र',
      or: '|A ∪ B| = 60 + 50 - 30 = 80 ଛାତ୍ର'
    },
    hasFormula: true
  }
];

export function SetsQuizArena({ language, onBack, onComplete }: SetsQuizArenaProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: new Array(questionBank.length).fill(null),
    reviewMarked: new Array(questionBank.length).fill(false),
    timeRemaining: QUIZ_DURATION,
    isSubmitted: false,
    showExplanation: false,
    startTime: Date.now()
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string | number>('');
  const [showResults, setShowResults] = useState(false);
  const [showReplayAnimation, setShowReplayAnimation] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const t = translations;
  const currentQ = questionBank[quizState.currentQuestion];

  // Timer effect
  useEffect(() => {
    if (quizState.timeRemaining > 0 && !quizState.isSubmitted && !showResults) {
      timerRef.current = setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (quizState.timeRemaining === 0 && !quizState.isSubmitted) {
      // Auto-submit when time is up
      handleQuizSubmit();
      toast.error(t.timeUp[language]);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [quizState.timeRemaining, quizState.isSubmitted, showResults, language]);

  // Format time as mm:ss
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answer: string | number) => {
    setSelectedAnswer(answer);
  }, []);

  // Submit current answer
  const handleSubmitAnswer = useCallback(() => {
    if (!selectedAnswer && selectedAnswer !== 0) {
      toast.error(t.selectAnswer[language]);
      return;
    }

    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = selectedAnswer;

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      showExplanation: true
    }));

    // Clear selected answer for next question
    setSelectedAnswer('');
  }, [selectedAnswer, quizState, language]);

  // Skip current question
  const handleSkip = useCallback(() => {
    if (quizState.currentQuestion < questionBank.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showExplanation: false
      }));
      setSelectedAnswer('');
    }
  }, [quizState.currentQuestion]);

  // Navigate to previous question
  const handlePrevious = useCallback(() => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
        showExplanation: false
      }));
      setSelectedAnswer(quizState.answers[quizState.currentQuestion - 1] || '');
    }
  }, [quizState]);

  // Navigate to next question
  const handleNext = useCallback(() => {
    if (quizState.currentQuestion < questionBank.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showExplanation: false
      }));
      setSelectedAnswer(quizState.answers[quizState.currentQuestion + 1] || '');
    } else {
      // Last question - show final submit
      handleQuizSubmit();
    }
  }, [quizState]);

  // Toggle review mark
  const handleToggleReview = useCallback(() => {
    const newReviewMarked = [...quizState.reviewMarked];
    newReviewMarked[quizState.currentQuestion] = !newReviewMarked[quizState.currentQuestion];
    setQuizState(prev => ({
      ...prev,
      reviewMarked: newReviewMarked
    }));
  }, [quizState]);

  // Submit entire quiz
  const handleQuizSubmit = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      isSubmitted: true
    }));
    setShowResults(true);
  }, []);

  // Calculate score
  const calculateScore = useCallback(() => {
    let correct = 0;
    questionBank.forEach((question, index) => {
      const userAnswer = quizState.answers[index];
      if (userAnswer === question.correctAnswer || 
          (typeof userAnswer === 'string' && typeof question.correctAnswer === 'string' && 
           userAnswer.toLowerCase() === question.correctAnswer.toLowerCase())) {
        correct++;
      }
    });
    return correct;
  }, [quizState.answers]);

  // Replay animation
  const handleReplayAnimation = useCallback(() => {
    setShowReplayAnimation(true);
    setTimeout(() => setShowReplayAnimation(false), 2000);
  }, []);

  // Get answer option styles
  const getOptionStyles = useCallback((option: string | number, isSelected: boolean, isCorrect: boolean, isSubmitted: boolean) => {
    let baseStyles = "w-full p-4 text-left border-2 rounded-lg transition-all duration-300 hover:scale-102 hover:shadow-lg";
    
    if (isSubmitted) {
      if (isCorrect) {
        baseStyles += " bg-green-100 border-green-500 text-green-800";
      } else if (isSelected && !isCorrect) {
        baseStyles += " bg-red-100 border-red-500 text-red-800";
      } else {
        baseStyles += " bg-gray-100 border-gray-300 text-gray-600";
      }
    } else {
      if (isSelected) {
        baseStyles += " bg-blue-100 border-blue-500 text-blue-800";
      } else {
        baseStyles += " bg-white border-gray-300 text-gray-700 hover:border-blue-400";
      }
    }
    
    return baseStyles;
  }, []);

  // Show results screen
  if (showResults) {
    const finalScore = calculateScore();
    const percentage = Math.round((finalScore / questionBank.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Results Header */}
          <Card className="bg-slate-800/90 border-slate-600 mb-8">
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-yellow-300 mb-2">
                {t.finalScore[language]}
              </CardTitle>
              <div className="text-6xl font-bold text-white mb-2">
                {finalScore}/{questionBank.length}
              </div>
              <div className="text-2xl text-cyan-300">
                {percentage}%
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <Progress value={percentage} className="h-4 mb-4" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">{finalScore}</div>
                    <div className="text-sm text-gray-400">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">{questionBank.length - finalScore}</div>
                    <div className="text-sm text-gray-400">Incorrect</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{formatTime(QUIZ_DURATION - quizState.timeRemaining)}</div>
                    <div className="text-sm text-gray-400">Time Taken</div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        {t.reviewAnswers[language]}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-600">
                      <DialogHeader>
                        <DialogTitle className="text-white">{t.reviewAnswers[language]}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {questionBank.map((question, index) => {
                          const userAnswer = quizState.answers[index];
                          const isCorrect = userAnswer === question.correctAnswer;
                          return (
                            <Card key={question.id} className="bg-slate-700 border-slate-600">
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">
                                    {isCorrect ? (
                                      <CheckCircle className="w-6 h-6 text-green-400" />
                                    ) : (
                                      <XCircle className="w-6 h-6 text-red-400" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-white font-semibold mb-2">
                                      Q{index + 1}: {question.question[language]}
                                    </h4>
                                    <div className="text-sm space-y-1">
                                      <div className="text-gray-300">
                                        Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                          {userAnswer || 'Not answered'}
                                        </span>
                                      </div>
                                      <div className="text-gray-300">
                                        Correct answer: <span className="text-green-400">{question.correctAnswer}</span>
                                      </div>
                                      <div className="text-gray-400 text-xs mt-2">
                                        {question.explanation[language]}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    onClick={() => {
                      onComplete(finalScore, questionBank.length);
                      onBack();
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    {t.backToModule[language]}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isAnswered = quizState.answers[quizState.currentQuestion] !== null;
  const isLastQuestion = quizState.currentQuestion === questionBank.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Top Bar */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-cyan-300">{t.title[language]}</h1>
          </div>
          
          {/* Timer */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            quizState.timeRemaining < 120 ? 'bg-red-600/20 border border-red-500' : 'bg-slate-700'
          }`}>
            <Clock className={`h-4 w-4 ${quizState.timeRemaining < 120 ? 'text-red-400' : 'text-slate-300'}`} />
            <span className={`font-mono text-sm ${quizState.timeRemaining < 120 ? 'text-red-400' : 'text-slate-300'}`}>
              {formatTime(quizState.timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Question Progress */}
      <div className="bg-slate-800/50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg">
              <span className="text-cyan-300">{t.question[language]} {quizState.currentQuestion + 1}</span>
              <span className="text-slate-400 mx-2">{t.of[language]}</span>
              <span className="text-slate-300">{questionBank.length}</span>
            </div>
            <Badge className={`px-3 py-1 ${
              currentQ.difficulty === 'easy' ? 'bg-green-500/20 text-green-300 border-green-400' :
              currentQ.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400' :
              'bg-red-500/20 text-red-300 border-red-400'
            }`}>
              {currentQ.difficulty.toUpperCase()}
            </Badge>
          </div>
          
          {/* Progress Dots */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {questionBank.map((_, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  index === quizState.currentQuestion
                    ? 'bg-blue-500 text-white scale-110'
                    : quizState.answers[index] !== null
                    ? 'bg-green-500 text-white'
                    : quizState.reviewMarked[index]
                    ? 'bg-yellow-500 text-white'
                    : 'bg-slate-600 text-slate-300'
                }`}
              >
                {index + 1}
                {quizState.reviewMarked[index] && (
                  <Flag className="w-3 h-3 absolute -top-1 -right-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Question Area */}
          <Card className="bg-slate-800/90 border-slate-600 mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-white leading-relaxed">
                {currentQ.question[language]}
              </CardTitle>
              {currentQ.hasFormula && (
                <div className="bg-slate-700/50 p-3 rounded-lg mt-4">
                  <div className="text-sm text-slate-300">
                    💡 Hint: Use the inclusion-exclusion principle or power set formula
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {/* SVG Content */}
              {currentQ.svg && (
                <div className="mb-6 flex justify-center">
                  {currentQ.svg}
                </div>
              )}
              
              {/* Answer Options */}
              <div className="space-y-4">
                {currentQ.type === 'multiple-choice' && currentQ.options && (
                  <div className="grid gap-3">
                    {currentQ.options[language].map((option, index) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrect = option === currentQ.correctAnswer;
                      return (
                        <button
                          key={index}
                          onClick={() => !quizState.showExplanation && handleAnswerSelect(option)}
                          disabled={quizState.showExplanation}
                          className={getOptionStyles(option, isSelected, isCorrect, quizState.showExplanation)}
                        >
                          <div className="flex items-center">
                            <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-semibold">
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {currentQ.type === 'boolean' && (
                  <div className="grid grid-cols-2 gap-4">
                    {[t.yes[language], t.no[language]].map((option) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrect = option === currentQ.correctAnswer;
                      return (
                        <button
                          key={option}
                          onClick={() => !quizState.showExplanation && handleAnswerSelect(option)}
                          disabled={quizState.showExplanation}
                          className={getOptionStyles(option, isSelected, isCorrect, quizState.showExplanation)}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                )}
                
                {currentQ.type === 'numeric' && (
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">
                      {t.enterNumber[language]}
                    </label>
                    <Input
                      type="number"
                      value={selectedAnswer}
                      onChange={(e) => !quizState.showExplanation && handleAnswerSelect(Number(e.target.value))}
                      disabled={quizState.showExplanation}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Enter your answer..."
                    />
                  </div>
                )}
              </div>
              
              {/* Explanation */}
              {quizState.showExplanation && (
                <div className={`mt-6 p-4 rounded-lg border-l-4 ${
                  (selectedAnswer === currentQ.correctAnswer || 
                   (typeof selectedAnswer === 'string' && typeof currentQ.correctAnswer === 'string' && 
                    selectedAnswer.toLowerCase() === currentQ.correctAnswer.toLowerCase()))
                    ? 'bg-green-500/20 border-green-400 text-green-300'
                    : 'bg-red-500/20 border-red-400 text-red-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-2">
                        {(selectedAnswer === currentQ.correctAnswer || 
                          (typeof selectedAnswer === 'string' && typeof currentQ.correctAnswer === 'string' && 
                           selectedAnswer.toLowerCase() === currentQ.correctAnswer.toLowerCase()))
                          ? t.correct[language] : t.incorrect[language]}
                      </h4>
                      <p className="text-sm opacity-90">
                        {currentQ.explanation[language]}
                      </p>
                    </div>
                    <Button
                      onClick={handleReplayAnimation}
                      variant="outline"
                      size="sm"
                      className="border-current text-current hover:bg-current/20"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      {t.replayAnimation[language]}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                onClick={handlePrevious}
                disabled={quizState.currentQuestion === 0}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t.previous[language]}
              </Button>
              
              <Button
                onClick={handleToggleReview}
                variant={quizState.reviewMarked[quizState.currentQuestion] ? "default" : "outline"}
                className={quizState.reviewMarked[quizState.currentQuestion] 
                  ? "bg-yellow-600 hover:bg-yellow-700" 
                  : "border-slate-600 text-slate-300 hover:bg-slate-700"
                }
              >
                <Flag className="w-4 h-4 mr-1" />
                {quizState.reviewMarked[quizState.currentQuestion] ? t.unmarkReview[language] : t.markReview[language]}
              </Button>
            </div>
            
            <div className="flex space-x-2">
              {!quizState.showExplanation ? (
                <>
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer && selectedAnswer !== 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    {t.submitAnswer[language]}
                  </Button>
                  
                  <Button
                    onClick={handleSkip}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <SkipForward className="w-4 h-4 mr-1" />
                    {t.skip[language]}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLastQuestion ? 'Finish Quiz' : t.next[language]}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Warning for low time */}
          {quizState.timeRemaining < 120 && (
            <Card className="bg-red-500/20 border-red-400 mt-4">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-red-300">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">
                    Warning: Less than 2 minutes remaining!
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}