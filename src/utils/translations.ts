import type { Language, Translations } from '../types/onboarding';

export const translations: Translations = {
  // Welcome Screen
  appName: { en: 'Learnio', hi: 'लर्निओ', or: 'ଲର୍ନିଓ' },
  tagline: { 
    en: 'Learn Science & Math through Games!', 
    hi: 'खेल के माध्यम से विज्ञान और गणित सीखें!', 
    or: 'ଖେଳ ମାଧ୍ୟମରେ ବିଜ୍ଞାନ ଏବଂ ଗଣିତ ଶିଖନ୍ତୁ!' 
  },
  selectLanguage: { 
    en: 'Select Language', 
    hi: 'भाषा चुनें', 
    or: 'ଭାଷା ବାଛନ୍ତୁ' 
  },
  
  // Navigation
  newStudent: { en: 'New Student', hi: 'नया छात्र', or: 'ନୂତନ ଛାତ୍ର' },
  returningUser: { en: 'Returning User', hi: 'पुराना उपयोगकर्ता', or: 'ପୁରାତନ ଉପଯୋଗକାରୀ' },
  imTeacher: { en: "I'm a Teacher", hi: 'मैं एक शिक्षक हूं', or: 'ମୁଁ ଜଣେ ଶିକ୍ଷକ' },
  
  // Sign Up Form
  signUp: { en: 'Sign Up', hi: 'साइन अप करें', or: 'ସାଇନ୍ ଅପ୍ କରନ୍ତୁ' },
  name: { en: 'Your Name', hi: 'आपका नाम', or: 'ଆପଣଙ୍କ ନାମ' },
  namePlaceholder: { en: 'Enter your full name', hi: 'अपना पूरा नाम दर्ज करें', or: 'ଆପଣଙ୍କର ସମ୍ପୂର୍ଣ୍ଣ ନାମ ଲେଖନ୍ତୁ' },
  grade: { en: 'Grade', hi: 'कक्षा', or: 'ଶ୍ରେଣୀ' },
  selectGrade: { en: 'Select your grade', hi: 'अपनी कक्षा चुनें', or: 'ଆପଣଙ୍କ ଶ୍ରେଣୀ ବାଛନ୍ତୁ' },
  schoolName: { en: 'School Name (Optional)', hi: 'स्कूल का नाम (वैकल्पिक)', or: 'ବିଦ୍ୟାଳୟର ନାମ (ଐଚ୍ଛିକ)' },
  schoolPlaceholder: { en: 'Enter your school name', hi: 'अपने स्कूल का नाम दर्ज करें', or: 'ଆପଣଙ୍କ ବିଦ୍ୟାଳୟର ନାମ ଲେଖନ୍ତୁ' },
  
  // Login Form
  login: { en: 'Login', hi: 'लॉगिन', or: 'ଲଗଇନ୍' },
  usernameOrEmail: { en: 'Username or Email', hi: 'उपयोगकर्ता नाम या ईमेल', or: 'ଉପଯୋଗକାରୀ ନାମ କିମ୍ବା ଇମେଲ୍' },
  password: { en: 'Password', hi: 'पासवर्ड', or: 'ପାସୱାର୍ଡ଼' },
  rememberMe: { en: 'Remember me', hi: 'मुझे याद रखें', or: 'ମୋତେ ମନେ ରଖ' },
  forgotPassword: { en: 'Forgot Password?', hi: 'पासवर्ड भूल गए?', or: 'ପାସୱାର୍ଡ଼ ଭୁଲିଗଲେ?' },
  
  // Teacher Access
  teacherCode: { en: 'Teacher Code', hi: 'शिक्षक कोड', or: 'ଶିକ୍ଷକ କୋଡ୍' },
  teacherCodePlaceholder: { en: 'Enter your teacher code', hi: 'अपना शिक्षक कोड दर्ज करें', or: 'ଆପଣଙ୍କ ଶିକ୍ଷକ କୋଡ୍ ଲେଖନ୍ତୁ' },
  
  // Profile Picture
  chooseAvatar: { en: 'Choose Your Avatar', hi: 'अपना अवतार चुनें', or: 'ଆପଣଙ୍କ ଅବତାର ବାଛନ୍ତୁ' },
  
  // Terms and Privacy
  agreeTerms: { 
    en: 'I agree to the Terms of Service and Privacy Policy', 
    hi: 'मैं सेवा की शर्तों और गोपनीयता नीति से सहमत हूं', 
    or: 'ମୁଁ ସେବା ସର୍ତ୍ତାବଳୀ ଏବଂ ଗୋପନୀୟତା ନୀତି ସହ ସହମତ' 
  },
  
  // Buttons
  next: { en: 'Next', hi: 'आगे', or: 'ପରବର୍ତ୍ତୀ' },
  back: { en: 'Back', hi: 'पीछे', or: 'ପଛକୁ' },
  getStarted: { en: 'Get Started', hi: 'शुरू करें', or: 'ଆରମ୍ଭ କରନ୍ତୁ' },
  
  // Gamification
  welcomeBonus: { en: 'Welcome Bonus!', hi: 'स्वागत बोनस!', or: 'ସ୍ୱାଗତ ବୋନସ୍!' },
  earnedXP: { en: 'You earned {xp} XP!', hi: 'आपने {xp} XP अर्जित किया!', or: 'ଆପଣ {xp} XP ଅର୍ଜନ କଲେ!' },
  firstBadge: { en: 'First Badge Unlocked!', hi: 'पहला बैज अनलॉक!', or: 'ପ୍ରଥମ ବ୍ୟାଜ୍ ଅନଲକ୍!' },
  
  // Validation Messages
  nameRequired: { en: 'Name is required', hi: 'नाम आवश्यक है', or: 'ନାମ ଆବଶ୍ୟକ' },
  gradeRequired: { en: 'Please select your grade', hi: 'कृपया अपनी कक्षा चुनें', or: 'ଦୟାକରି ଆପଣଙ୍କ ଶ୍ରେଣୀ ବାଛନ୍ତୁ' },
  passwordRequired: { en: 'Password is required', hi: 'पासवर्ड आवश्यक है', or: 'ପାସୱାର୍ଡ଼ ଆବଶ୍ୟକ' },
  usernameRequired: { en: 'Username or email is required', hi: 'उपयोगकर्ता नाम या ईमेल आवश्यक है', or: 'ଉପଯୋଗକାରୀ ନାମ କିମ୍ବା ଇମେଲ୍ ଆବଶ୍ୟକ' },
  teacherCodeRequired: { en: 'Teacher code is required', hi: 'शिक्षक कोड आवश्यक है', or: 'ଶିକ୍ଷକ କୋଡ୍ ଆବଶ୍ୟକ' },
  termsRequired: { en: 'Please accept the terms and conditions', hi: 'कृपया नियम और शर्तों को स्वीकार करें', or: 'ଦୟାକରି ନିୟମ ଏବଂ ସର୍ତ୍ତାବଳୀ ଗ୍ରହଣ କରନ୍ତୁ' },
  
  // Offline Messages
  offlineMode: { en: 'Offline Mode', hi: 'ऑफलाइन मोड', or: 'ଅଫଲାଇନ୍ ମୋଡ୍' },
  workOffline: { en: 'You can start learning offline!', hi: 'आप ऑफ़लाइन सीखना शुरू कर सकते हैं!', or: 'ଆପଣ ଅଫଲାଇନରେ ଶିଖିବା ଆରମ୍ଭ କରିପାରିବେ!' }
};

export const getTranslation = (key: string, language: Language, params?: { [key: string]: string | number }): string => {
  let text = translations[key]?.[language] || translations[key]?.['en'] || key;
  
  if (params) {
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, String(params[param]));
    });
  }
  
  return text;
};