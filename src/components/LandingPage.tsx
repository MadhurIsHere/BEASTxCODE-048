import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'motion/react';
import { 
  Play,
  Rocket,
  Trophy,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Users,
  BookOpen,
  Globe,
  WifiOff,
  Languages,
  Gamepad2,
  Calculator,
  Atom,
  FlaskConical,
  Microscope,
  Shield,
  Download,
  Monitor,
  Smartphone,
  Star,
  TrendingUp,
  UserCheck,
  Award,
  Target,
  Zap,
  ChevronRight,
  ChevronLeft,
  Heart,
  Quote,
  Crown,
  Flame,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  School,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  HardDrive,
  Wifi,
  Volume2,
  Eye,
  Home,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Layers,
  Settings,
  BookOpenCheck,
  Lightbulb,
  Brain,
  Cpu,
  Lock,
  LogIn
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { InteractiveDemoGame } from './InteractiveDemoGame';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Language } from '../types/onboarding';
import learnioLogo from 'figma:asset/e39a5c72459b483111bff479a5d1f08009913ad6.png';
import rocketBoyImage from 'figma:asset/2f001c86c70c3f6d2bb911814a300d9faf405115.png';
import learnioPresenterImage from 'figma:asset/1b2129b565300c7ec1c138f13bac1709a31c1239.png';

interface LandingPageProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onStartLearning: (demoAccount?: {username: string; password: string}) => void;
  onDirectLogin?: (userProfile: any) => void;
}

const languageOptions = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'hi' as Language, name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'or' as Language, name: 'ଓଡ଼ିଆ', flag: '🇮🇳' }
];

const translations = {
  // Hero Section
  heroTitle: {
    en: 'Level Up Your STEM Learning Journey',
    hi: 'अपनी STEM शिक्षा यात्रा को आगे बढ़ाएं',
    or: 'ଆପଣଙ୍କ STEM ଶିକ୍ଷା ଯାତ୍ରାକୁ ଆଗକୁ ବଢ଼ାନ୍ତୁ'
  },
  heroSubtitle: {
    en: 'Gamified quests, badges, and challenges – available in Odia, Hindi & English, even offline.',
    hi: 'गेमिफाइड क्वेस्ट, बैज, और चुनौतियां - ओडिया, हिंदी और अंग्रेजी में उपलब्ध, ऑफलाइन भी।',
    or: 'ଗେମିଫାଇଡ୍ କ୍ୱେଷ୍ଟ, ବ୍ୟାଜ, ଏବଂ ଚ୍ୟାଲେଞ୍ଜ - ଓଡ଼ିଆ, ହିନ୍ଦୀ ଏବଂ ଇଂରାଜୀରେ ଉପଲବ୍ଧ, ଅଫଲାଇନରେ ମଧ୍ୟ।'
  },
  startFreeQuest: {
    en: 'Start Free Quest',
    hi: 'मुफ्त क्वेस्ट शुरू करें',
    or: 'ମାଗଣା କ୍ୱେଷ୍ଟ ଆରମ୍ଭ କରନ୍ତୁ'
  },
  teacherMode: {
    en: 'Teacher Mode',
    hi: 'शिक्षक मोड',
    or: 'ଶିକ୍ଷକ ମୋଡ୍'
  },
  useOnWeb: {
    en: 'Use on Web',
    hi: 'वेब पर उपयोग करें',
    or: 'ୱେବରେ ବ୍ୟବହାର କରନ୍ତୁ'
  },
  playDemo: {
    en: 'Play Demo Game',
    hi: 'डेमो गेम खेलें',
    or: 'ଡେମୋ ଗେମ୍ ଖେଳନ୍ତୁ'
  },
  // Core Features
  interactiveGames: {
    en: 'Interactive Games',
    hi: 'इंटरैक्टिव गेम्स',
    or: 'ଇଣ୍ଟରଆକ୍ଟିଭ ଗେମ୍'
  },
  interactiveGamesDesc: {
    en: 'Fun quests in Math, Science, Technology & Engineering',
    hi: 'गणित, विज्ञान, प्रौद्योगिकी और इंजीनियरिंग में मजेदार क्वेस्ट',
    or: 'ଗଣିତ, ବିଜ୍ଞାନ, ପ୍ରଯୁକ୍ତି ଏବଂ ଇଞ୍ଜିନିୟରିଂରେ ମଜାଦାର କ୍ୱେଷ୍ଟ'
  },
  worksOffline: {
    en: 'Works Offline',
    hi: 'ऑफलाइन काम करता है',
    or: 'ଅଫଲାଇନରେ କାମ କରେ'
  },
  worksOfflineDesc: {
    en: 'Content downloads, usable without internet connection',
    hi: 'सामग्री डाउनलोड, इंटरनेट कनेक्शन के बिना उपयोग योग्य',
    or: 'ବିଷୟବସ୍ତୁ ଡାଉନଲୋଡ୍ ହୁଏ, ଇଣ୍ଟରନେଟ ସଂଯୋଗ ବିନା ବ୍ୟବହାର ଯୋଗ୍ୟ'
  },
  trackProgress: {
    en: 'Track Progress',
    hi: 'प्रगति ट्रैक करें',
    or: 'ଅଗ୍ରଗତି ଟ୍ରାକ କରନ୍ତୁ'
  },
  trackProgressDesc: {
    en: 'XP, streaks, and badge-based achievements system',
    hi: 'XP, स्ट्रीक्स, और बैज-आधारित उपलब्धि प्रणाली',
    or: 'XP, ଷ୍ଟ୍ରିକ୍, ଏବଂ ବ୍ୟାଜ-ଆଧାରିତ ସଫଳତା ବ୍ୟବସ୍ଥା'
  },
  classChallenges: {
    en: 'Class Challenges',
    hi: 'कक्षा चुनौतियां',
    or: 'ଶ୍ରେଣୀ ଚ୍ୟାଲେଞ୍ଜ'
  },
  classChallengesDesc: {
    en: 'Play in teams, climb leaderboards, compete with friends',
    hi: 'टीमों में खेलें, लीडरबोर्ड पर चढ़ें, दोस्तों के साथ प्रतिस्पर्धा करें',
    or: 'ଦଳରେ ଖେଳନ୍ତୁ, ଲିଡରବୋର୍ଡରେ ଉପରକୁ ଯାଆନ୍ତୁ, ବନ୍ଧୁମାନଙ୍କ ସହିତ ପ୍ରତିଯୋଗିତା କରନ୍ତୁ'
  },
  // How It Works
  howItWorksTitle: {
    en: 'How Learnio Works',
    hi: 'लर्नियो कैसे काम करता है',
    or: 'ଲର୍ନିଓ କିପରି କାମ କରେ'
  },
  step1Title: {
    en: 'Choose Your Path',
    hi: 'अपना रास्ता चुनें',
    or: 'ଆପଣଙ୍କର ପଥ ବାଛନ୍ତୁ'
  },
  step1Desc: {
    en: 'Select your grade level and favorite STEM subjects to get started',
    hi: 'शुरू करने के लिए अपना ग्रेड स्तर और पसंदीदा STEM विषय चुनें',
    or: 'ଆରମ୍ଭ କରିବା ପାଇଁ ଆପଣଙ୍କର ଗ୍ରେଡ ସ୍ତର ଏବଂ ପ୍ରିୟ STEM ବିଷୟ ବାଛନ୍ତୁ'
  },
  step2Title: {
    en: 'Play & Learn',
    hi: 'खेलें और सीखें',
    or: 'ଖେଳନ୍ତୁ ଏବଂ ଶିଖନ୍ତୁ'
  },
  step2Desc: {
    en: 'Complete interactive quests, solve puzzles, and master concepts',
    hi: 'इंटरैक्टिव क्वेस्ट पूरे करें, पहेलियों को हल करें, और अवधारणाओं में महारत हासिल करें',
    or: 'ଇଣ୍ଟରଆକ୍ଟିଭ କ୍ୱେଷ୍ଟ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ, ପଜଲ ସମାଧାନ କରନ୍ତୁ, ଏବଂ ଧାରଣାରେ ଦକ୍ଷତା ହାସଲ କରନ୍ତୁ'
  },
  step3Title: {
    en: 'Earn Rewards',
    hi: 'पुरस्कार अर्जित करें',
    or: 'ପୁରସ୍କାର ଅର୍ଜନ କରନ୍ତୁ'
  },
  step3Desc: {
    en: 'Collect XP, unlock badges, and climb leaderboards with friends',
    hi: 'XP इकट्ठा करें, बैज अनलॉक करें, और दोस्तों के साथ लीडरबोर्ड पर चढ़ें',
    or: 'XP ସଂଗ୍ରହ କରନ୍ତୁ, ବ୍ୟାଜ ଅନଲକ କରନ୍ତୁ, ଏବଂ ବନ୍ଧୁମାନଙ୍କ ସହିତ ଲିଡରବୋର୍ଡରେ ଉପରକୁ ଯାଆନ୍ତୁ'
  },
  // Subject Areas
  subjectAreasTitle: {
    en: 'Explore STEM Subjects',
    hi: 'STEM विषयों का अन्वेषण करें',
    or: 'STEM ବିଷୟଗୁଡ଼ିକ ଅନ୍ୱେଷଣ କରନ୍ତୁ'
  },
  // App Showcase
  appShowcaseTitle: {
    en: 'Experience the Learning Revolution',
    hi: 'शिक्षा क्रांति का अनुभव करें',
    or: 'ଶିକ୍ଷା ବିପ୍ଳବର ଅନୁଭବ କରନ୍ତୁ'
  },
  // Device Requirements
  optimizedTitle: {
    en: 'Optimized for Every Student',
    hi: 'हर छात्र के लिए अनुकूलित',
    or: 'ପ୍ରତ୍ୟେକ ଛାତ୍ରଙ୍କ ପାଇଁ ଅନୁକୂଳିତ'
  },
  android6Plus: {
    en: 'Android 6.0+',
    hi: 'एंड्रॉइड 6.0+',
    or: 'ଆଣ୍ଡ୍ରଏଡ୍ 6.0+'
  },
  android6PlusDesc: {
    en: 'Works on budget phones',
    hi: 'बजट फोन पर काम करता है',
    or: 'ବଜେଟ ଫୋନରେ କାମ କରେ'
  },
  oneGBRAM: {
    en: '1GB RAM',
    hi: '1GB रैम',
    or: '1GB RAM'
  },
  oneGBRAMDesc: {
    en: 'Low device requirement',
    hi: 'कम डिवाइस आवश्यकता',
    or: 'କମ୍ ଉପକରଣ ଆବଶ୍ୟକତା'
  },
  under100MB: {
    en: 'Storage <100MB',
    hi: 'स्टोरेज <100MB',
    or: 'ଷ୍ଟୋରେଜ <100MB'
  },
  under100MBDesc: {
    en: 'Lightweight app size',
    hi: 'हल्का ऐप साइज़',
    or: 'ହାଲୁକା ଆପ୍ ଆକାର'
  },
  offlineCapable: {
    en: 'Offline-Capable',
    hi: 'ऑफलाइन-सक्षम',
    or: 'ଅଫଲାଇନ-ସକ୍ଷମ'
  },
  offlineCapableDesc: {
    en: 'Low bandwidth mode',
    hi: 'कम बैंडविड्थ मोड',
    or: 'କମ୍ ବ୍ୟାଣ୍ଡୱିଡଥ ମୋଡ୍'
  },
  multilingualSupport: {
    en: 'Multilingual',
    hi: 'बहुभाषी',
    or: 'ବହୁଭାଷୀ'
  },
  multilingualSupportDesc: {
    en: 'English, Hindi, Odia',
    hi: 'अंग्रेजी, हिंदी, ओडिया',
    or: 'ଇଂରାଜୀ, ହିନ୍ଦୀ, ଓଡ଼ିଆ'
  },
  accessibility: {
    en: 'Accessibility',
    hi: 'सुगम्यता',
    or: 'ସୁଗମତା'
  },
  accessibilityDesc: {
    en: 'High contrast, voice hints',
    hi: 'उच्च कंट्रास्ट, आवाज़ संकेत',
    or: 'ଉଚ୍ଚ କଣ୍ଟ୍ରାଷ୍ଟ, ଧ୍ୱନି ସଙ୍କେତ'
  },
  // Impact & Engagement
  impactTitle: {
    en: 'Proven Learning Impact',
    hi: 'सिद्ध शिक्षा प्रभाव',
    or: 'ପ୍ରମାଣିତ ଶିକ୍ଷା ପ୍ରଭାଵ'
  },
  engagementBoost: {
    en: 'Engagement boost through gamification',
    hi: 'गेमिफिकेशन के माध्यम से सगाई में वृद्धि',
    or: 'ଗେମିଫିକେସନ ମାଧ୍ୟମରେ ଯୋଗଦାନ ବୃଦ୍ଧି'
  },
  conceptMastery: {
    en: 'Better concept mastery',
    hi: 'बेहतर अवधारणा निपुणता',
    or: 'ଉନ୍ନତ ଧାରଣା ଦକ୍ଷତା'
  },
  retentionImprovement: {
    en: 'Improved knowledge retention',
    hi: 'बेहतर ज्ञान संधारण',
    or: 'ଉନ୍ନତ ଜ୍ଞାନ ସଂରକ୍ଷଣ'
  },
  // Teacher Dashboard
  teacherDashTitle: {
    en: 'Empower Educators',
    hi: 'शिक्षकों को सशक्त बनाएं',
    or: 'ଶିକ୍ଷକମାନଙ୍କୁ ସଶକ୍ତ କରନ୍ତୁ'
  },
  teacherDashSubtitle: {
    en: 'Professional dashboard with powerful analytics and classroom management',
    hi: 'शक्तिशाली एनालिटिक्स और कक्षा प्रबंधन के साथ पेशेवर डैशबोर्ड',
    or: 'ଶକ୍ତିଶାଳୀ ଆନାଲିଟିକ୍ସ ଏବଂ ଶ୍ରେଣୀଗୃହ ପରିଚାଳନା ସହିତ ବୃତ୍ତିଗତ ଡ୍ୟାସବୋର୍ଡ'
  },
  spotGaps: {
    en: 'Spot student gaps',
    hi: 'छात्र की कमियों को पहचानें',
    or: 'ଛାତ୍ର ଅସୁବିଧା ଚିହ୍ନଟ କରନ୍ତୁ'
  },
  spotGapsDesc: {
    en: 'AI-powered learning analytics',
    hi: 'AI-संचालित शिक्षा एनालिटिक्स',
    or: 'AI-ଚାଳିତ ଶିକ୍ଷଣ ଆନାଲିଟିକ୍ସ'
  },
  exportReports: {
    en: 'Export detailed reports',
    hi: 'विस्तृत रिपोर्ट निर्यात करें',
    or: 'ବିସ୍ତୃତ ରିପୋର୍ଟ ରପ୍ତାନି କରନ୍ତୁ'
  },
  exportReportsDesc: {
    en: 'Share progress with parents',
    hi: 'माता-पिता के साथ प्रगति साझा करें',
    or: 'ପିତାମାତାଙ୍କ ସହିତ ଅଗ୍ରଗତି ସାଝା କରନ୍ତୁ'
  },
  manageClassrooms: {
    en: 'Manage multiple classrooms',
    hi: 'कई कक्षाओं का प्रबंधन करें',
    or: 'ଏକାଧିକ ଶ୍ରେଣୀଗୃହ ପରିଚାଳନା କରନ୍ତୁ'
  },
  manageClassroomsDesc: {
    en: 'Multi-class oversight',
    hi: 'बहु-कक्षा निरीक्षण',
    or: 'ବହୁ-ଶ୍ରେଣୀ ତଦାରଖ'
  },
  exploreTeacherMode: {
    en: 'Explore Teacher Mode',
    hi: 'शिक्षक मोड का अन्वेषण करें',
    or: 'ଶିକ୍ଷକ ମୋଡ୍ ଅନ୍ୱେଷଣ କରନ୍ତୁ'
  },
  // FAQ
  faqTitle: {
    en: 'Frequently Asked Questions',
    hi: 'अक्सर पूछे जाने वाले प्रश्न',
    or: 'ବାରମ୍ବାର ପଚରାଯାଉଥିବା ପ୍ରଶ୍ନ'
  },
  // CTA Section
  startJourneyToday: {
    en: 'Start Your Learning Journey Today',
    hi: 'आज अपनी शिकषा यात्रा शुरू करें',
    or: 'ଆଜି ଆପଣଙ୍କ ଶିକ୍ଷା ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ'
  },
  joinThousands: {
    en: 'Join students already learning with Learnio',
    hi: 'लर्नियो के साथ पहले से ही सीख रहे छात्रों से जुड़ें',
    or: 'ଲର୍ନିଓ ସହିତ ପୂର୍ବରୁ ଶିଖୁଥିବା ଛାତ୍ରମାନଙ୍କ ସହିତ ଯୋଗଦାନ କରନ୍ତୁ'
  },
  // Footer
  footerBranding: {
    en: '© 2025 Government of Odisha & Learnio – Empowering Education for All',
    hi: '© 2025 ओडिशा सरकार और लर्नियो – सभी के लिए शिक्षा को सशक्त बनाना',
    or: '© 2025 ଓଡ଼ିଶା ସରକାର ଏବଂ ଲର୍ନିଓ – ସମସ୍ତଙ୍କ ପାଇଁ ଶିକ୍ଷାକୁ ସଶକ୍ତ କରିବା'
  },
  // Navigation
  home: {
    en: 'Home',
    hi: 'होम',
    or: 'ହୋମ'
  },
  features: {
    en: 'Features',
    hi: 'विशेषताएं',
    or: 'ବିଶେଷତା'
  },
  teacherDashboard: {
    en: 'Teacher Dashboard',
    hi: 'शिक्षक डैशबोर्ड',
    or: 'ଶିକ୍ଷକ ଡ୍ୟାସବୋର୍ଡ'
  },
  faqs: {
    en: 'FAQs',
    hi: 'सामान्य प्रश्न',
    or: 'ସାଧାରଣ ପ୍ରଶ୍ନ'
  },
  support: {
    en: 'Support',
    hi: 'सहायता',
    or: 'ସହାୟତା'
  },
  contact: {
    en: 'Contact',
    hi: 'संपर्क',
    or: 'ସମ୍ପର୍କ'
  },
  // Demo Accounts
  tryDemo: {
    en: 'Try Demo Accounts',
    hi: 'डेमो खाते आज़माएं',
    or: 'ଡେମୋ ଆକାଉଣ୍ଟ ଚେଷ୍ଟା କରନ୍ତୁ'
  },
  demoDescription: {
    en: 'Experience Learnio with pre-filled demo accounts. No signup required!',
    hi: 'पूर्व-भरे डेमो खातों के साथ लर्नियो का अनुभव करें। साइनअप की आवश्यकता नहीं!',
    or: 'ପୂର୍ବ-ଭର୍ତ୍ତି ଡେମୋ ଆକାଉଣ୍ଟ ସହିତ ଲର୍ନିଓର ଅନୁଭବ କରନ୍ତୁ। ସାଇନଅପ୍ ଆବଶ୍ୟକ ନାହିଁ!'
  },
  grade6Student: {
    en: 'Grade 6 Student',
    hi: 'कक्षा 6 का छात्र',
    or: 'ଶ୍ରେଣୀ ୬ ଛାତ୍ର'
  },
  grade11Student: {
    en: 'Grade 11 Student',
    hi: 'कक्षा 11 का छात्र',
    or: 'ଶ୍ରେଣୀ ୧୧ ଛାତ୍ର'
  },
  teacherAccount: {
    en: 'Teacher Account',
    hi: 'शिक्षक खाता',
    or: 'ଶିକ୍ଷକ ଆକାଉଣ୍ଟ'
  },
  loginWith: {
    en: 'Login with',
    hi: 'के साथ लॉगिन करें',
    or: 'ସହିତ ଲଗଇନ ��ରନ୍ତୁ'
  }
};

const getT = (key: string, language: Language): string => {
  return translations[key]?.[language] || translations[key]?.['en'] || key;
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const inView = useInView(countRef);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, end, duration]);

  return <span ref={countRef}>{count.toLocaleString()}{suffix}</span>;
};

// Government of Odisha Emblem Component
const OdishaEmblem = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg`}>
      <Crown className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
    </div>
  );
};

export function LandingPage({ language, onLanguageChange, onStartLearning, onDirectLogin }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Create demo user profiles for direct login
  const createDemoUser = (gradeOrType: string) => {
    if (gradeOrType === 'teacher') {
      return {
        id: 'demo-teacher',
        name: language === 'en' ? 'Demo Teacher' : 
              language === 'hi' ? 'डेमो शिक्षक' : 'ଡେମୋ ଶିକ୍ଷକ',
        email: 'demo.teacher@learnio.com',
        type: 'teacher' as const,
        avatar: '',
        preferences: { language, theme: 'light', notifications: true }
      };
    } else {
      const grade = parseInt(gradeOrType.replace('grade', ''));
      return {
        id: `demo-student-${grade}`,
        name: language === 'en' ? `Demo Student Grade ${grade}` : 
              language === 'hi' ? `डेमो छात्र कक्षा ${grade}` : 
              `ଡେମୋ ଛାତ୍ର ଶ୍ରେଣୀ ${grade}`,
        email: `demo.student.grade${grade}@learnio.com`,
        type: 'student' as const,
        grade: grade,
        avatar: '',
        preferences: { language, theme: 'light', notifications: true }
      };
    }
  };

  // Handle direct demo login
  const handleDemoLogin = (gradeOrType: string) => {
    const demoUser = createDemoUser(gradeOrType);
    if (onDirectLogin) {
      onDirectLogin(demoUser);
    }
  };

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const subjectsRef = useRef(null);
  const showcaseRef = useRef(null);
  const requirementsRef = useRef(null);
  const impactRef = useRef(null);

  const heroInView = useInView(heroRef);
  const featuresInView = useInView(featuresRef);
  const howItWorksInView = useInView(howItWorksRef);
  const subjectsInView = useInView(subjectsRef);
  const showcaseInView = useInView(showcaseRef);
  const requirementsInView = useInView(requirementsRef);
  const impactInView = useInView(impactRef);

  // Demo Accounts Data
  const demoAccounts = [
    {
      id: 'grade6',
      title: getT('grade6Student', language),
      subtitle: language === 'en' ? 'Experience Grade 6 learning content' : 
                language === 'hi' ? 'कक्षा 6 की शिक्षा सामग्री का अनुभव करें' : 
                'ଶ୍ରେଣୀ ୬ ଶିକ୍ଷା ବିଷୟବସ୍ତୁର ଅନୁଭବ କରନ୍ତୁ',
      icon: BookOpen,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      username: 'grade6',
      password: 'demo123',
      emoji: '👨‍🎓'
    },
    {
      id: 'grade11',
      title: getT('grade11Student', language),
      subtitle: language === 'en' ? 'Explore advanced mathematics and sciences' : 
                language === 'hi' ? 'उन्नत गणित और विज्ञान का अन्वेषण करें' : 
                'ଉନ୍ନତ ଗଣିତ ଏବଂ ବିଜ୍ଞାନର ଅନ୍ୱେଷଣ କରନ୍ତୁ',
      icon: Calculator,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      username: 'grade11',
      password: 'demo123',
      emoji: '👩‍🎓'
    },
    {
      id: 'teacher',
      title: getT('teacherAccount', language),
      subtitle: language === 'en' ? 'Manage classrooms and track student progress' : 
                language === 'hi' ? 'कक्षाओं का प्रबंधन करें और छात्रों की प्रगति को ट्रैक करें' : 
                'ଶ୍ରେଣୀଗୃହ ପରିଚାଳନା କରନ୍ତୁ ଏବଂ ଛାତ୍ର ଅଗ୍ରଗତି ଟ୍ରାକ କରନ୍ତୁ',
      icon: GraduationCap,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      username: 'teacher',
      password: 'demo123',
      emoji: '👩‍🏫'
    }
  ];

  // App Screenshots Data
  const appScreenshots = [
    {
      title: 'Home Dashboard',
      description: 'XP bar, badges, daily streaks'
    },
    {
      title: 'Math Quest',
      description: 'Interactive learning games'
    },
    {
      title: 'Leaderboard',
      description: 'Compete with classmates'
    },
    {
      title: 'Rewards',
      description: 'Unlock badges and achievements'
    }
  ];

  // Core Features Data (FIXED COLORS)
  const coreFeatures = [
    {
      icon: Gamepad2,
      title: getT('interactiveGames', language),
      description: getT('interactiveGamesDesc', language),
      gradient: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-600',
      illustration: '🎮'
    },
    {
      icon: WifiOff,
      title: getT('worksOffline', language),
      description: getT('worksOfflineDesc', language),
      gradient: 'from-green-600 to-green-700',
      bgColor: 'bg-green-600',
      illustration: '📱'
    },
    {
      icon: TrendingUp,
      title: getT('trackProgress', language),
      description: getT('trackProgressDesc', language),
      gradient: 'from-orange-600 to-orange-700',
      bgColor: 'bg-orange-600',
      illustration: '📊'
    },
    {
      icon: Trophy,
      title: getT('classChallenges', language),
      description: getT('classChallengesDesc', language),
      gradient: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-600',
      illustration: '🏆'
    }
  ];

  // How It Works Steps
  const howItWorksSteps = [
    {
      number: '01',
      icon: BookOpenCheck,
      title: getT('step1Title', language),
      description: getT('step1Desc', language),
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: '02',
      icon: Brain,
      title: getT('step2Title', language),
      description: getT('step2Desc', language),
      color: 'from-green-500 to-green-600'
    },
    {
      number: '03',
      icon: Award,
      title: getT('step3Title', language),
      description: getT('step3Desc', language),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Subject Areas
  const subjectAreas = [
    {
      icon: Calculator,
      title: language === 'en' ? 'Mathematics' : language === 'hi' ? 'गणित' : 'ଗଣିତ',
      description: language === 'en' ? 'Algebra, Geometry, Statistics' : language === 'hi' ? 'बीजगणित, ज्यामिति, सांख्यिकी' : 'ବୀଜଗଣିତ, ଜ୍ୟାମିତି, ପରିସଂଖ୍ୟାନ',
      gradient: 'from-blue-500 to-indigo-500',
      emoji: '🧮'
    },
    {
      icon: Atom,
      title: language === 'en' ? 'Science' : language === 'hi' ? 'विज्ञान' : 'ବିଜ୍ଞାନ',
      description: language === 'en' ? 'Physics, Chemistry, Biology' : language === 'hi' ? 'भौतिकी, रसायन, जीव विज्ञान' : 'ପଦାର୍ଥ ବିଜ୍ଞାନ, ରସାୟନ, ଜୀବ ବିଜ୍ଞାନ',
      gradient: 'from-green-500 to-emerald-500',
      emoji: '🔬'
    },
    {
      icon: Cpu,
      title: language === 'en' ? 'Technology' : language === 'hi' ? 'प्रौद्योगिकी' : 'ପ୍ରଯୁକ୍ତି',
      description: language === 'en' ? 'Computer Science, Programming' : language === 'hi' ? 'कंप्यूटर साइंस, प्रोग्रामिंग' : 'କମ୍ପ୍ୟୁଟର ସାଇନ୍ସ, ପ୍ରୋଗ୍ରାମିଂ',
      gradient: 'from-orange-500 to-red-500',
      emoji: '💻'
    },
    {
      icon: Settings,
      title: language === 'en' ? 'Engineering' : language === 'hi' ? 'इंजीनियरिंग' : 'ଇଞ୍ଜିନିୟରିଂ',
      description: language === 'en' ? 'Design, Problem Solving' : language === 'hi' ? 'डिजाइन, समस्या समाधान' : 'ଡିଜାଇନ, ସମସ୍ୟା ସମାଧାନ',
      gradient: 'from-purple-500 to-pink-500',
      emoji: '🔧'
    }
  ];

  // Device Requirements Data
  const deviceRequirements = [
    {
      icon: Smartphone,
      title: getT('android6Plus', language),
      description: getT('android6PlusDesc', language),
      color: 'text-blue-600'
    },
    {
      icon: HardDrive,
      title: getT('oneGBRAM', language),
      description: getT('oneGBRAMDesc', language),
      color: 'text-green-600'
    },
    {
      icon: Layers,
      title: getT('under100MB', language),
      description: getT('under100MBDesc', language),
      color: 'text-purple-600'
    },
    {
      icon: Wifi,
      title: getT('offlineCapable', language),
      description: getT('offlineCapableDesc', language),
      color: 'text-orange-600'
    },
    {
      icon: Languages,
      title: getT('multilingualSupport', language),
      description: getT('multilingualSupportDesc', language),
      color: 'text-indigo-600'
    },
    {
      icon: Eye,
      title: getT('accessibility', language),
      description: getT('accessibilityDesc', language),
      color: 'text-pink-600'
    }
  ];

  // Impact Stats (REALISTIC)
  const impactStats = [
    {
      title: getT('engagementBoost', language),
      icon: TrendingUp,
      color: 'text-green-600',
      description: 'Through interactive learning'
    },
    {
      title: getT('conceptMastery', language),
      icon: Lightbulb,
      color: 'text-purple-600',
      description: 'Via hands-on practice'
    },
    {
      title: getT('retentionImprovement', language),
      icon: Brain,
      color: 'text-blue-600',
      description: 'With spaced repetition'
    }
  ];

  // FAQ Data
  const faqs = [
    {
      question: language === 'en' ? 'Is Learnio really free?' : language === 'hi' ? 'क्या लर्नियो वास्तव में मुफ्त है?' : 'ଲର୍ନିଓ ପ୍ରକୃତରେ ମାଗଣା କି?',
      answer: language === 'en' ? 'Yes! Learnio is completely free for all students. We are supported by the Government of Odisha.' : language === 'hi' ? 'हां! लर्नियो सभी छात्रों के लिए पूरी तरह से मुफ्त है। हमें ओडिशा सरकार का समर्थन प्राप्त है।' : 'ହଁ! ଲର୍ନିଓ ସମସ୍ତ ଛାତ୍ରଙ୍କ ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା। ଆମକୁ ଓଡ଼ିଶା ସରକାରଙ୍କ ସମର୍ଥନ ପ୍ରାପ୍ତ।'
    },
    {
      question: language === 'en' ? 'Do I need internet to use it?' : language === 'hi' ? 'क्या मुझे इसका उपयोग करने के लिए इंटरनेट की आवश्यकता है?' : 'ଏହାକୁ ବ୍ୟବହାର କରିବା ପାଇଁ ମୋତେ ଇଣ୍ଟରନେଟ୍ ଦରକାର କି?',
      answer: language === 'en' ? 'No! Once downloaded, most content works offline. Perfect for areas with limited connectivity.' : language === 'hi' ? 'नहीं! एक बार डाउनलोड करने के बाद, अधिकांश सामग्री ऑफ़���ाइन काम करती है। सीमित कनेक्टिविटी वाले क्षेत्रों के लिए बिल्कुल सही।' : 'ନା! ଥରେ ଡାଉନଲୋଡ୍ ହେବା ପରେ, ଅଧିକାଂଶ ବିଷୟବସ୍ତୁ ଅଫଲାଇନରେ କାମ କରେ। ସୀମିତ ସଂଯୋଗ ଥିବା ଅଞ୍ଚଳ ପାଇଁ ଉପଯୁକ୍ତ।'
    },
    {
      question: language === 'en' ? 'Which grades can use Learnio?' : language === 'hi' ? 'कौन से ग्रेड लर्नियो का उपयोग कर सकते हैं?' : 'କେଉଁ ଗ୍ରେଡ୍ ଲର୍ନିଓ ବ୍ୟବହାର କରିପାରିବେ?',
      answer: language === 'en' ? 'Learnio supports students from grades 6-12, with content adapted for different learning levels.' : language === 'hi' ? 'लर्नियो 6-12 कक्षा के छात्रों का समर्थन करता है, विभिन्न सीखने के स्तरों के लिए सामग्री अनुकूलित है।' : 'ଲର୍ନିଓ ଷଷ୍ରୁ ଦ୍ୱାଦଶ ଶ୍ରେଣୀର ଛାତ୍ରମାନଙ୍କୁ ସମର୍ଥନ କରେ, ବିଭିନ୍ନ ଶିକ୍ଷଣ ସ୍ତର ପାଇଁ ବିଷୟବସ୍ତୁ ଅନୁକୂଳିତ।'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % appScreenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + appScreenshots.length) % appScreenshots.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header - FIXED */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo - USING REAL LOGO */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <img src={learnioLogo} alt="Learnio" className="h-12 w-12 rounded-xl shadow-md" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Learnio
                </h1>
                <p className="text-xs text-gray-600 font-semibold">Government of Odisha</p>
              </div>
            </motion.div>

            {/* Desktop Navigation - FIXED TO ONLY SHOW TEACHER MODE */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <select
                  value={language}
                  onChange={(e) => onLanguageChange(e.target.value as Language)}
                  className="bg-transparent text-gray-700 font-semibold text-sm focus:outline-none"
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => onStartLearning({ username: 'teacher', password: 'demo123' })}
                className="border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold rounded-full px-6"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                {getT('teacherMode', language)}
              </Button>
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-orange-100 rounded-full"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-200 py-4 space-y-4"
              >
                <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
                  <Globe className="h-4 w-4 text-gray-600" />
                  <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value as Language)}
                    className="bg-transparent text-gray-700 font-semibold text-sm focus:outline-none w-full"
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => onStartLearning({ username: 'teacher', password: 'demo123' })}
                  className="w-full border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold rounded-full py-3"
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  {getT('teacherMode', language)}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Section - REMOVED FREE BADGE */}
      <section 
        ref={heroRef}
        className="relative px-4 py-16 sm:py-24 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 overflow-hidden"
      >
        {/* Background Elements */}
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-40 right-20 w-32 h-32 bg-green-200 rounded-full opacity-20"
        />
        <motion.div 
          style={{ y: y1 }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-20"
        />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="text-center lg:text-left space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
                    {getT('heroTitle', language)}
                  </span>
                  <img src={rocketBoyImage} alt="Student on rocket" className="inline-block w-16 h-16 ml-2" />
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
                  {getT('heroSubtitle', language)}
                </p>
              </div>

              {/* Single Hero CTA */}
              <div className="flex justify-center lg:justify-start">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    onClick={() => onStartLearning()}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 text-lg font-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Rocket className="mr-3 h-5 w-5" />
                    {getT('startFreeQuest', language)}
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                  {/* Removed "New Student - Sign Up" button as it duplicates the Start Free Quest functionality */}
                </motion.div>
              </div>

              {/* Mobile App Buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Button variant="outline" className="rounded-full font-semibold">
                  <Download className="mr-2 h-4 w-4" />
                  Play Store
                </Button>
                <Button variant="outline" className="rounded-full font-semibold">
                  <Download className="mr-2 h-4 w-4" />
                  App Store
                </Button>
                <Button variant="outline" className="rounded-full font-semibold">
                  <Monitor className="mr-2 h-4 w-4" />
                  {getT('useOnWeb', language)}
                </Button>
              </div>

              {/* Quick Demo Access */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <div className="text-center">
                  <h4 className="font-bold text-blue-800 text-lg mb-2 flex items-center justify-center gap-2">
                    <Rocket className="w-5 h-5" />
                    {language === 'en' ? 'Try Demo Accounts' : 
                     language === 'hi' ? 'डेमो खाते आज़माएं' : 
                     'ଡେମୋ ଖାତା ଚେଷ୍ଟା କରନ୍ତୁ'}
                  </h4>
                  <p className="text-blue-700 text-sm mb-4">
                    {language === 'en' ? 'Instant access - no registration required' : 
                     language === 'hi' ? 'तत्काल पहुंच - पंजीकरण आवश्यक नहीं' : 
                     'ତତ୍କ୍ଷଣାତ୍ ପ୍ରବେଶ - ପଞ୍ଜୀକରଣ ଆବଶ୍ୟକ ନାହିଁ'}
                  </p>
                  
                  {/* Student Demo Accounts Grid */}
                  <div className="mb-4">
                    <h5 className="text-blue-700 text-sm font-medium mb-3">
                      {language === 'en' ? 'Student Accounts' : 
                       language === 'hi' ? 'छात्र खाते' : 
                       'ଛାତ୍ର ଖାତା'}
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDemoLogin('grade6')}
                        className="text-xs border-green-300 text-green-700 hover:bg-green-50 py-2 px-3 font-medium"
                      >
                        👨‍🎓 {language === 'en' ? 'Grade 6' : language === 'hi' ? 'कक्षा 6' : 'ଷଷ୍ଠ ଶ୍ରେଣୀ'}
                      </Button>

                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDemoLogin('grade8')}
                        className="text-xs border-cyan-300 text-cyan-700 hover:bg-cyan-50 py-2 px-3 font-medium"
                      >
                        👨‍🎓 {language === 'en' ? 'Grade 8' : language === 'hi' ? 'कक्षा 8' : 'ଅଷ୍ଟମ ଶ୍ରେଣୀ'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDemoLogin('grade9')}
                        className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50 py-2 px-3 font-medium"
                      >
                        👩‍🎓 {language === 'en' ? 'Grade 9' : language === 'hi' ? 'कक्षा 9' : 'ନବମ ଶ୍ରେଣୀ'}
                      </Button>

                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDemoLogin('grade11')}
                        className="text-xs border-purple-300 text-purple-700 hover:bg-purple-50 py-2 px-3 font-medium"
                      >
                        👩‍🎓 {language === 'en' ? 'Grade 11' : language === 'hi' ? 'कक्षा 11' : 'ଏକାଦଶ ଶ୍ରେଣୀ'}
                      </Button>

                    </div>
                  </div>

                  {/* Teacher Demo Account */}
                  <div>
                    <h5 className="text-blue-700 text-sm font-medium mb-3">
                      {language === 'en' ? 'Teacher Account' : 
                       language === 'hi' ? 'शिक्षक खाता' : 
                       'ଶିକ୍ଷକ ଖାତା'}
                    </h5>
                    <div className="flex justify-center">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDemoLogin('teacher')}
                        className="text-sm border-orange-300 text-orange-700 hover:bg-orange-50 py-3 px-6 font-medium"
                      >
                        👩‍🏫 {language === 'en' ? 'Teacher Dashboard' : language === 'hi' ? 'शिक्षक डैशबोर्ड' : 'ଶିକ୍ଷକ ଡ୍ୟାସବୋର୍ଡ'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual - Always show the image, game opens as overlay */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <img
                  src={learnioPresenterImage}
                  alt="Learnio presenter introducing the learning platform"
                  className="rounded-3xl shadow-2xl w-full max-w-md h-80 object-cover"
                />
                
                {/* Floating UI Elements */}
                <motion.div
                  className="absolute -top-6 -left-6 bg-white rounded-2xl p-3 shadow-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-sm">+50 XP</span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute -top-3 -right-6 bg-white rounded-2xl p-3 shadow-xl"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Flame className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-sm">7 Day Streak!</span>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-3 -left-3 bg-white rounded-2xl p-3 shadow-xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-6 w-6 text-purple-500" />
                    <span className="font-bold text-sm">Math Master</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Feature Highlights */}
      <section 
        ref={featuresRef}
        className="px-4 py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              Core Learning Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for engaging STEM education
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className={`p-6 h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${feature.bgColor} text-white relative overflow-hidden`}>
                  <CardContent className="p-0 text-center space-y-4">
                    {/* Background Illustration */}
                    <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                      {feature.illustration}
                    </div>
                    
                    <motion.div 
                      className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-black text-white group-hover:text-gray-100">
                      {feature.title}
                    </h3>
                    
                    <p className="text-white/90 leading-relaxed group-hover:text-white/80 text-sm">
                      {feature.description}
                    </p>
                    
                    <motion.div
                      className="w-full h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        ref={howItWorksRef}
        className="px-4 py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getT('howItWorksTitle', language)}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to start your learning adventure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center space-y-6"
              >
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto text-white font-black text-2xl shadow-2xl`}>
                    {step.number}
                  </div>
                  <div className="absolute -top-4 -right-4">
                    <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-gray-700" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Areas */}
      <section 
        ref={subjectsRef}
        className="px-4 py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={subjectsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getT('subjectAreasTitle', language)}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive curriculum covering all essential STEM areas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {subjectAreas.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={subjectsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group"
              >
                <Card className="p-8 h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-gray-50">
                  <CardContent className="p-0 text-center space-y-6">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${subject.gradient} flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow text-4xl`}>
                      {subject.emoji}
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-gray-800">
                      {subject.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-500">
                      {subject.description}
                    </p>
                    
                    <motion.div
                      className={`w-full h-2 bg-gradient-to-r ${subject.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase */}
      <section 
        ref={showcaseRef}
        className="px-4 py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={showcaseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getT('appShowcaseTitle', language)}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how students interact with our gamified learning platform
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Mobile Mockup Container */}
            <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-6 shadow-2xl mx-auto max-w-sm">
              {/* Phone Frame */}
              <div className="bg-black rounded-[2.5rem] p-2">
                <div className="relative bg-white rounded-[2rem] h-[600px] overflow-hidden">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 rounded-t-[2rem] flex items-center justify-between px-6 z-20">
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                    <div className="text-white text-xs font-bold">9:41</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 border border-white rounded-sm">
                        <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                      </div>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="pt-8 h-full relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.5 }}
                        className="h-full p-4"
                      >
                        {currentSlide === 0 && (
                          <div className="space-y-4">
                            <div className="text-center mb-6">
                              <h3 className="text-lg font-black text-gray-900">Dashboard</h3>
                              <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full mt-2">
                                <div className="bg-yellow-400 h-2 rounded-full w-3/4"></div>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">1,250 XP • Level 8</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              {coreFeatures.slice(0, 4).map((feature, idx) => (
                                <div key={idx} className={`${feature.bgColor} rounded-xl p-4 text-white text-center`}>
                                  <div className="text-2xl mb-2">{feature.illustration}</div>
                                  <div className="font-bold text-xs">{feature.title.split(' ')[0]}</div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="bg-yellow-50 rounded-xl p-4 mt-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-gray-900 text-sm">Daily Streak</div>
                                  <div className="text-xs text-gray-600">7 days in a row! 🔥</div>
                                </div>
                                <div className="text-2xl">🏆</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentSlide === 1 && (
                          <div className="space-y-4">
                            <div className="text-center mb-6">
                              <h3 className="text-lg font-black text-gray-900">Math Quest</h3>
                              <p className="text-sm text-gray-600">Interactive Learning Game</p>
                            </div>
                            
                            <div className="bg-blue-100 rounded-xl p-6 text-center">
                              <div className="text-6xl mb-4">🧮</div>
                              <div className="text-lg font-bold text-gray-900">Solve the Equation</div>
                              <div className="text-sm text-gray-600 mt-2">2x + 5 = 13</div>
                            </div>
                            
                            <div className="flex justify-center space-x-4">
                              <button className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                                3
                              </button>
                              <button className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                                4
                              </button>
                              <button className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                                6
                              </button>
                            </div>
                            
                            <div className="bg-blue-50 rounded-xl p-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-blue-900">Score: 850</span>
                                <span className="text-sm font-bold text-blue-900">⏱️ 0:45</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentSlide === 2 && (
                          <div className="space-y-4">
                            <div className="text-center mb-6">
                              <h3 className="text-lg font-black text-gray-900">Leaderboard</h3>
                              <p className="text-sm text-gray-600">Weekly Class Ranking</p>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 flex items-center space-x-4">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-orange-600">1</div>
                                <div className="flex-1">
                                  <div className="font-bold text-white">You!</div>
                                  <div className="text-sm text-yellow-100">1,250 XP</div>
                                </div>
                                <div className="text-2xl">👑</div>
                              </div>
                              
                              <div className="bg-gray-100 rounded-xl p-4 flex items-center space-x-4">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">2</div>
                                <div className="flex-1">
                                  <div className="font-bold text-gray-900">Alex M.</div>
                                  <div className="text-sm text-gray-600">1,180 XP</div>
                                </div>
                                <div className="text-xl">🥈</div>
                              </div>
                              
                              <div className="bg-gray-100 rounded-xl p-4 flex items-center space-x-4">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">3</div>
                                <div className="flex-1">
                                  <div className="font-bold text-gray-900">Sarah K.</div>
                                  <div className="text-sm text-gray-600">1,150 XP</div>
                                </div>
                                <div className="text-xl">🥉</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentSlide === 3 && (
                          <div className="space-y-4">
                            <div className="text-center mb-6">
                              <h3 className="text-lg font-black text-gray-900">Achievements</h3>
                              <p className="text-sm text-gray-600">Your earned badges</p>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-xl p-4 text-center">
                                <div className="text-2xl mb-2">🏆</div>
                                <div className="text-xs font-bold text-yellow-900">Math Master</div>
                              </div>
                              <div className="bg-gradient-to-b from-blue-200 to-blue-400 rounded-xl p-4 text-center">
                                <div className="text-2xl mb-2">🔬</div>
                                <div className="text-xs font-bold text-blue-900">Science Pro</div>
                              </div>
                              <div className="bg-gradient-to-b from-green-200 to-green-400 rounded-xl p-4 text-center">
                                <div className="text-2xl mb-2">⚡</div>
                                <div className="text-xs font-bold text-green-900">Speed Runner</div>
                              </div>
                              <div className="bg-gradient-to-b from-purple-200 to-purple-400 rounded-xl p-4 text-center">
                                <div className="text-2xl mb-2">🎯</div>
                                <div className="text-xs font-bold text-purple-900">Sharp Shooter</div>
                              </div>
                              <div className="bg-gradient-to-b from-red-200 to-red-400 rounded-xl p-4 text-center">
                                <div className="text-2xl mb-2">🔥</div>
                                <div className="text-xs font-bold text-red-900">Streak Legend</div>
                              </div>
                              <div className="bg-gray-200 rounded-xl p-4 text-center opacity-50">
                                <div className="text-2xl mb-2">❓</div>
                                <div className="text-xs font-bold text-gray-600">Locked</div>
                              </div>
                            </div>
                            
                            <div className="bg-orange-50 rounded-xl p-4 text-center">
                              <div className="text-sm font-bold text-orange-900 mb-2">Next Badge:</div>
                              <div className="text-2xl mb-1">🎨</div>
                              <div className="text-xs text-orange-700">Complete 5 more engineering quests</div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {appScreenshots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Device & Accessibility Requirements */}
      <section 
        ref={requirementsRef}
        className="px-4 py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={requirementsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getT('optimizedTitle', language)}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built to work on every device, designed for accessibility and inclusion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deviceRequirements.map((requirement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={requirementsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-50 hover:bg-white">
                  <CardContent className="p-0 text-center space-y-4">
                    <div className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-md`}>
                      <requirement.icon className={`h-8 w-8 ${requirement.color}`} />
                    </div>
                    
                    <h3 className="text-lg font-black text-gray-900">
                      {requirement.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm">
                      {requirement.description}
                    </p>
                    
                    <div className="flex justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Engagement - REALISTIC CONTENT */}
      <section 
        ref={impactRef}
        className="px-4 py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={impactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getT('impactTitle', language)}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Educational benefits backed by research and learning science
            </p>
          </motion.div>

          {/* Impact Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={impactInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white">
                  <CardContent className="p-0 space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-white to-gray-100 flex items-center justify-center shadow-lg`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <h3 className={`text-xl font-black ${stat.color}`}>
                      {stat.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={impactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="p-8 border-0 shadow-xl bg-white">
              <CardContent className="p-0 text-center space-y-6">
                <Quote className="h-12 w-12 text-orange-200 mx-auto" />
                <blockquote className="text-xl sm:text-2xl text-gray-700 italic leading-relaxed">
                  "Gamification transforms learning from a chore into a quest. Students engage naturally when education feels like adventure."
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    E
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">Educational Research</div>
                    <div className="text-sm text-gray-600">Learning Science Institute</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Teacher Dashboard Peek */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                  {getT('teacherDashTitle', language)}
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {getT('teacherDashSubtitle', language)}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{getT('spotGaps', language)}</div>
                    <div className="text-sm text-gray-600">{getT('spotGapsDesc', language)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{getT('exportReports', language)}</div>
                    <div className="text-sm text-gray-600">{getT('exportReportsDesc', language)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <School className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{getT('manageClassrooms', language)}</div>
                    <div className="text-sm text-gray-600">{getT('manageClassroomsDesc', language)}</div>
                  </div>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-black rounded-2xl shadow-xl">
                <GraduationCap className="mr-3 h-5 w-5" />
                {getT('exploreTeacherMode', language)}
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1663153206192-6d0e4c9570dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2JpbGUlMjBhcHAlMjBlZHVjYXRpb24lMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzU4MjkyMTg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Teacher dashboard interface"
                className="rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              {getT('faqTitle', language)}
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0 space-y-4">
                    <h3 className="text-lg font-black text-gray-900">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="px-4 py-20 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full"
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight">
              {getT('startJourneyToday', language)}
            </h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {getT('joinThousands', language)}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  onClick={onStartLearning}
                  className="bg-white text-orange-600 hover:bg-gray-50 px-10 py-6 text-xl font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Rocket className="mr-3 h-6 w-6" />
                  {getT('startFreeQuest', language)}
                  <Sparkles className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowMiniGame(true)}
                  className="border-3 border-white text-white hover:bg-white/20 px-10 py-6 text-xl font-black rounded-2xl shadow-xl bg-transparent backdrop-blur-sm relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <Play className="mr-3 h-6 w-6 relative z-10" />
                  <span className="relative z-10">{getT('playDemo', language)}</span>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="ml-3 relative z-10"
                  >
                    🎮
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={learnioLogo} alt="Learnio" className="h-12 w-12 rounded-xl" />
                <OdishaEmblem size="md" />
                <div>
                  <h3 className="text-xl font-black text-white">Learnio</h3>
                  <p className="text-sm text-gray-400">Government of Odisha</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Making STEM education accessible, engaging, and effective for every student.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  {getT('home', language)}
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {getT('features', language)}
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {getT('teacherDashboard', language)}
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {getT('faqs', language)}
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  {getT('support', language)}
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {getT('contact', language)}
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@learnio.gov.in</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>1800-XXX-XXXX (Toll-free)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Bhubaneswar, Odisha, India</span>
                </div>
              </div>
            </div>

            {/* Partners */}
            <div>
              <h4 className="font-bold text-white mb-4">Official Partners</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <OdishaEmblem size="sm" />
                  <span>Government of Odisha</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span>Ministry of Education</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                {getT('footerBranding', language)}
              </p>
              <div className="flex justify-center items-center space-x-4 mt-4">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-xs text-gray-500">Empowering every learner to succeed</span>
                <Heart className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Demo Game Overlay */}
      {showMiniGame && (
        <InteractiveDemoGame
          language={language}
          onComplete={() => {
            setShowMiniGame(false);
            onStartLearning();
          }}
          onClose={() => setShowMiniGame(false)}
        />
      )}
    </div>
  );
}