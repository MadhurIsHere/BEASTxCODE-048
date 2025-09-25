// Complete Sets Question Bank - 30 MCQs (6 per level)
// Based on the comprehensive specification provided

export interface QuestionData {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  lang: {
    en: {
      question: string;
      options: string[];
      answerIndex: number;
      explanation?: string;
    };
    hi: {
      question: string;
      options: string[];
      answerIndex: number;
      explanation?: string;
    };
    or: {
      question: string;
      options: string[];
      answerIndex: number;
      explanation?: string;
    };
  };
}

export const SETS_QUESTION_BANK: Record<number, QuestionData[]> = {
  
  // LEVEL 1 - Easy (all easy) - 30s per question
  1: [
    {
      id: "L1_Q1",
      difficulty: "easy",
      timeLimit: 30,
      lang: {
        en: {
          question: "Which notation denotes 'x is an element of set A'?",
          options: ["x ∈ A", "x ⊂ A", "x ∉ A", "x ⊆ A"],
          answerIndex: 0,
          explanation: "The symbol ∈ means 'is an element of' or 'belongs to'"
        },
        hi: {
          question: "किस संकेत से दिखता है 'x सेट A का सदस्य है'?",
          options: ["x ∈ A", "x ⊂ A", "x ∉ A", "x ⊆ A"],
          answerIndex: 0,
          explanation: "∈ चिह्न का अर्थ है 'का सदस्य है' या 'में शामिल है'"
        },
        or: {
          question: "'x ସେଟ୍ A-ର ଉପାଦାନ' କୁ କେଉଁ ଚିହ୍ନ ଦର୍ଶାଏ?",
          options: ["x ∈ A", "x ⊂ A", "x ∉ A", "x ⊆ A"],
          answerIndex: 0,
          explanation: "∈ ଚିହ୍ନର ଅର୍ଥ ହେଉଛି 'ର ଉପାଦାନ' ବା 'ରେ ଅନ୍ତର୍ଭୁକ୍ତ'"
        }
      }
    },
    {
      id: "L1_Q2",
      difficulty: "easy",
      timeLimit: 30,
      lang: {
        en: {
          question: "If A = {1,2,3}, what is |A|?",
          options: ["3", "2", "1", "0"],
          answerIndex: 0,
          explanation: "|A| represents the cardinality (number of elements) of set A"
        },
        hi: {
          question: "A = {1,2,3} में |A| = ?",
          options: ["3", "2", "1", "0"],
          answerIndex: 0,
          explanation: "|A| सेट A की गणनीयता (तत्वों की संख्या) को दर्शाता है"
        },
        or: {
          question: "A = {1,2,3} ର |A| = ?",
          options: ["3", "2", "1", "0"],
          answerIndex: 0,
          explanation: "|A| ସେଟ୍ A ର ମୂଳତ୍ୱ (ଉପାଦାନ ସଂଖ୍ୟା) କୁ ଦର୍ଶାଏ"
        }
      }
    },
    {
      id: "L1_Q3",
      difficulty: "easy",
      timeLimit: 30,
      lang: {
        en: {
          question: "The union of {1,2} and {2,3} is:",
          options: ["{1,2,3}", "{2}", "{}", "{1,3}"],
          answerIndex: 0,
          explanation: "Union combines all unique elements from both sets"
        },
        hi: {
          question: "{1,2} ∪ {2,3} = ?",
          options: ["{1,2,3}", "{2}", "{}", "{1,3}"],
          answerIndex: 0,
          explanation: "संघ दोनों सेटों के सभी अद्वितीय तत्वों को मिलाता है"
        },
        or: {
          question: "{1,2} ∪ {2,3} = ?",
          options: ["{1,2,3}", "{2}", "{}", "{1,3}"],
          answerIndex: 0,
          explanation: "ଯୋଗ ଦୁଇ ସେଟ୍‌ର ସମସ୍ତ ଅନନ୍ୟ ଉପାଦାନକୁ ମିଶାଏ"
        }
      }
    },
    {
      id: "L1_Q4",
      difficulty: "easy",
      timeLimit: 30,
      lang: {
        en: {
          question: "Which symbol represents intersection?",
          options: ["∩", "∪", "⊂", "∈"],
          answerIndex: 0,
          explanation: "∩ is the intersection symbol, showing common elements"
        },
        hi: {
          question: "इंटरसैक्शन का चिन्ह?",
          options: ["∩", "∪", "⊂", "∈"],
          answerIndex: 0,
          explanation: "∩ प्रतिच्छेदन का चिह्न है, जो सामान्य तत्वों को दिखाता है"
        },
        or: {
          question: "Intersection ଚିହ୍ନ କେଉଁଟି?",
          options: ["∩", "∪", "⊂", "∈"],
          answerIndex: 0,
          explanation: "∩ ହେଉଛି ଛେଦ ଚିହ୍ନ, ସାଧାରଣ ଉପାଦାନ ଦର୍ଶାଏ"
        }
      }
    },
    {
      id: "L1_Q5",
      difficulty: "easy",
      timeLimit: 30,
      lang: {
        en: {
          question: "Is ∅ a subset of every set?",
          options: ["Yes", "No", "Only of finite sets", "Only of infinite sets"],
          answerIndex: 0,
          explanation: "The empty set is a subset of every set by definition"
        },
        hi: {
          question: "क्या ∅ हर सेट का subset है?",
          options: ["हाँ", "नहीं", "केवल परिमित सेटों का", "केवल अनंत सेटों का"],
          answerIndex: 0,
          explanation: "रिक्त सेट परिभाषा के अनुसार हर सेट का उपसमुच्चय है"
        },
        or: {
          question: "∅ ହେଉଛି ପ୍ରତ୍ୟେକ ସେଟ୍-ର subset କି?",
          options: ["ହଁ", "ନା", "କେବଳ ସୀମିତ ସେଟ୍‌ର", "କେବଳ ଅସୀମ ସେଟ୍‌ର"],
          answerIndex: 0,
          explanation: "ଖାଲି ସେଟ୍ ସଂଜ୍ଞା ଅନୁସାରେ ପ୍ରତ୍ୟେକ ସେଟ୍‌ର ଉପସମଷ୍ଟି"
        }
      }
    },
    {
      id: "L1_Q6",
      difficulty: "easy",
      timeLimit: 30,
      lang: {
        en: {
          question: "If A = {a,b}, how many elements in P(A) (power set)?",
          options: ["4", "2", "3", "8"],
          answerIndex: 0,
          explanation: "Power set of A has 2^n elements, where n is |A|. So 2^2 = 4"
        },
        hi: {
          question: "A = {a,b} में P(A) में कितने तत्व?",
          options: ["4", "2", "3", "8"],
          answerIndex: 0,
          explanation: "A का शक्ति समुच्चय में 2^n तत्व होते हैं, जहाँ n = |A|। अतः 2^2 = 4"
        },
        or: {
          question: "A = {a,b} ର P(A) ରେ କେତୋଟି ଉପାଦାନ?",
          options: ["4", "2", "3", "8"],
          answerIndex: 0,
          explanation: "A ର ଶକ୍ତି ସେଟ୍‌ରେ 2^n ଉପାଦାନ ଅଛି, ଯେଉଁଠି n = |A|। ତେଣୁ 2^2 = 4"
        }
      }
    }
  ],

  // LEVEL 2 - Easy/Medium mix (60% easy, 40% medium)
  2: [
    {
      id: "L2_Q1",
      difficulty: "easy",
      timeLimit: 30,
      lang: {
        en: {
          question: "If U is universal set, complement of A is denoted by?",
          options: ["A′", "A∩", "A∪", "∅"],
          answerIndex: 0,
          explanation: "A′ or A^c represents the complement of set A"
        },
        hi: {
          question: "Universal set के संदर्भ में A का complement?",
          options: ["A′", "A∩", "A∪", "∅"],
          answerIndex: 0,
          explanation: "A′ या A^c सेट A के पूरक को दर्शाता है"
        },
        or: {
          question: "U ବିଶ୍ୱଜନୀନ ସେଟ୍‌ରେ A ର complement?",
          options: ["A′", "A∩", "A∪", "∅"],
          answerIndex: 0,
          explanation: "A′ ବା A^c ସେଟ୍ A ର ପୂରକ ଦର୍ଶାଏ"
        }
      }
    },
    {
      id: "L2_Q2",
      difficulty: "easy",
      timeLimit: 30,
      lang: {
        en: {
          question: "If A = {1,2,3} and B = {3,4}, A ∩ B = ?",
          options: ["{3}", "{1,2}", "{4}", "{}"],
          answerIndex: 0,
          explanation: "Intersection contains only common elements"
        },
        hi: {
          question: "A = {1,2,3} और B = {3,4}, A ∩ B = ?",
          options: ["{3}", "{1,2}", "{4}", "{}"],
          answerIndex: 0,
          explanation: "प्रतिच्छेदन में केवल सामान्य तत्व होते हैं"
        },
        or: {
          question: "A = {1,2,3} ଏବଂ B = {3,4}, A ∩ B = ?",
          options: ["{3}", "{1,2}", "{4}", "{}"],
          answerIndex: 0,
          explanation: "ଛେଦରେ କେବଳ ସାଧାରଣ ଉପାଦାନ ଥାଏ"
        }
      }
    },
    {
      id: "L2_Q3",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "Which of these is a function from {1,2} to {a,b}?",
          options: ["f(1)=a, f(2)=b", "f(1)=a, f(1)=b", "f(1)=a only", "f undefined"],
          answerIndex: 0,
          explanation: "A function must assign exactly one output to each input"
        },
        hi: {
          question: "कौन सा mapping function है {1,2} से {a,b} तक?",
          options: ["f(1)=a, f(2)=b", "f(1)=a, f(1)=b", "केवल f(1)=a", "f अपरिभाषित"],
          answerIndex: 0,
          explanation: "एक फंक्शन प्रत्येक इनपुट को बिल्कुल एक आउटपुट देना चाहिए"
        },
        or: {
          question: "କେଉଁଟି {1,2} ରୁ {a,b} ପର୍ଯ୍ୟନ୍ତ function?",
          options: ["f(1)=a, f(2)=b", "f(1)=a, f(1)=b", "କେବଳ f(1)=a", "f ଅପରିଭାଷିତ"],
          answerIndex: 0,
          explanation: "ଏକ function ପ୍ରତ୍ୟେକ input କୁ ଠିକ୍ ଗୋଟିଏ output ଦେବା ଉଚିତ"
        }
      }
    },
    {
      id: "L2_Q4",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "A is subset of B means:",
          options: ["every element of A in B", "every element of B in A", "A and B disjoint", "none"],
          answerIndex: 0,
          explanation: "A ⊆ B means all elements of A are also in B"
        },
        hi: {
          question: "A ⊂ B मतलब?",
          options: ["हर A का तत्व B में", "हर B का तत्व A में", "A और B असंयुक्त", "कोई नहीं"],
          answerIndex: 0,
          explanation: "A ⊆ B का मतलब है A के सभी तत्व B में भी हैं"
        },
        or: {
          question: "A ⊂ B ର ଅର୍ଥ?",
          options: ["A-ର ପ୍ରତ୍ୟେକ ଉପାଦାନ B-ରେ", "B-ର ପ୍ରତ୍ୟେକ ଉପାଦାନ A-ରେ", "A ଏବଂ B ଅସଂଯୁକ୍ତ", "କିଛି ନୁହେଁ"],
          answerIndex: 0,
          explanation: "A ⊆ B ଅର୍ଥ ହେଉଛି A ର ସମସ୍ତ ଉପାଦାନ B ରେ ମଧ୍ୟ ଅଛି"
        }
      }
    },
    {
      id: "L2_Q5",
      difficulty: "easy",
      timeLimit: 30,
      lang: {
        en: {
          question: "If A = {1,2}, B = {3,4}, A ∪ B = ?",
          options: ["{1,2,3,4}", "{1,3}", "{2,4}", "{}"],
          answerIndex: 0,
          explanation: "Union combines all elements from both sets"
        },
        hi: {
          question: "A = {1,2}, B = {3,4}, A ∪ B = ?",
          options: ["{1,2,3,4}", "{1,3}", "{2,4}", "{}"],
          answerIndex: 0,
          explanation: "संघ दोनों सेटों के सभी तत्वों को मिलाता है"
        },
        or: {
          question: "A = {1,2}, B = {3,4}, A ∪ B = ?",
          options: ["{1,2,3,4}", "{1,3}", "{2,4}", "{}"],
          answerIndex: 0,
          explanation: "ଯୋଗ ଦୁଇ ସେଟ୍‌ର ସମସ୍ତ ଉପାଦାନକୁ ମିଶାଏ"
        }
      }
    },
    {
      id: "L2_Q6",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "For function f(x)=x+1 from integers to integers, f is:",
          options: ["one-one and onto", "one-one not onto", "onto not one-one", "neither"],
          answerIndex: 0,
          explanation: "f(x)=x+1 is bijective on integers: each input maps to unique output, and every integer is reached"
        },
        hi: {
          question: "f(x)=x+1 (Z→Z): किस प्रकार?",
          options: ["one-one और onto", "one-one लेकिन onto नहीं", "onto लेकिन one-one नहीं", "दोनों नहीं"],
          answerIndex: 0,
          explanation: "f(x)=x+1 पूर्णांकों पर द्विजीव है: प्रत्येक इनपुट अद्वितीय आउटपुट देता है, और हर पूर्णांक पहुँचा जाता है"
        },
        or: {
          question: "f(x)=x+1 (Z→Z) କେଉଁ ପ୍ରକାର?",
          options: ["one-one ଏବଂ onto", "one-one କିନ୍ତୁ onto ନୁହେଁ", "onto କିନ୍ତୁ one-one ନୁହେଁ", "ଦୁଇଟିଯାକ ନୁହେଁ"],
          answerIndex: 0,
          explanation: "f(x)=x+1 ପୂର୍ଣ୍ଣସଂଖ୍ୟାରେ ଦ୍ୱିଜୀବ: ପ୍ରତ୍ୟେକ input ଅନନ୍ୟ output ଦିଏ, ଏବଂ ପ୍ରତ୍ୟେକ ପୂର୍ଣ୍ଣସଂଖ୍ୟା ପହଞ୍ଚେ"
        }
      }
    }
  ],

  // LEVEL 3 - Mixed (40% easy, 40% medium, 20% hard)
  3: [
    {
      id: "L3_Q1",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "If A = {1,2,3,4} and B = {2,4,6}, A \\ B = ?",
          options: ["{1,3}", "{2,4}", "{6}", "{}"],
          answerIndex: 0,
          explanation: "A \\ B contains elements in A but not in B"
        },
        hi: {
          question: "A = {1,2,3,4} और B = {2,4,6}, A \\ B = ?",
          options: ["{1,3}", "{2,4}", "{6}", "{}"],
          answerIndex: 0,
          explanation: "A \\ B में A के वे तत्व हैं जो B में नहीं हैं"
        },
        or: {
          question: "A = {1,2,3,4} ଏବଂ B = {2,4,6}, A \\ B = ?",
          options: ["{1,3}", "{2,4}", "{6}", "{}"],
          answerIndex: 0,
          explanation: "A \\ B ରେ A ର ସେ ଉପାଦାନ ଅଛି ଯାହା B ରେ ନାହିଁ"
        }
      }
    },
    {
      id: "L3_Q2",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "Which law is: (A ∪ B)′ = A′ ∩ B′ ?",
          options: ["De Morgan's Law", "Distributive law", "Associative law", "Commutative law"],
          answerIndex: 0,
          explanation: "De Morgan's laws relate complement of union/intersection"
        },
        hi: {
          question: "कौन सा नियम है: (A ∪ B)′ = A′ ∩ B′ ?",
          options: ["डी मॉर्गन नियम", "वितरण नियम", "साहचर्य नियम", "क्रमविनिमय नियम"],
          answerIndex: 0,
          explanation: "डी मॉर्गन के नियम संघ/प्रतिच्छेदन के पूरक से संबंधित हैं"
        },
        or: {
          question: "କେଉଁ ନିୟମ: (A ∪ B)′ = A′ ∩ B′ ?",
          options: ["ଡି ମର୍ଗାନ ନିୟମ", "ବଣ୍ଟନ ନିୟମ", "ସହଯୋଗ ନିୟମ", "କ୍ରମ ବିନିମୟ ନିୟମ"],
          answerIndex: 0,
          explanation: "ଡି ମର୍ଗାନର ନିୟମ ଯୋଗ/ଛେଦର ପୂରକ ସହିତ ସଂପୃକ୍ତ"
        }
      }
    },
    {
      id: "L3_Q3",
      difficulty: "hard",
      timeLimit: 60,
      lang: {
        en: {
          question: "Let f : {1,2,3} → {a,b} be any function. How many distinct functions exist?",
          options: ["8", "6", "9", "5"],
          answerIndex: 0,
          explanation: "For each element in domain, we have 2 choices in codomain. So 2³ = 8 functions"
        },
        hi: {
          question: "f : {1,2,3} → {a,b} कोई भी function। कितने अलग functions हैं?",
          options: ["8", "6", "9", "5"],
          answerIndex: 0,
          explanation: "डोमेन के प्रत्येक तत्व के लिए, कोडोमेन में 2 विकल्प हैं। अतः 2³ = 8 functions"
        },
        or: {
          question: "f : {1,2,3} → {a,b} କୌଣସି function। କେତୋଟି ଭିନ୍ନ functions ଅଛି?",
          options: ["8", "6", "9", "5"],
          answerIndex: 0,
          explanation: "ଡୋମେନର ପ୍ରତ୍ୟେକ ଉପାଦାନ ପାଇଁ, କୋଡୋମେନରେ 2 ପସନ୍ଦ ଅଛି। ତେଣୁ 2³ = 8 functions"
        }
      }
    },
    {
      id: "L3_Q4",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "If f and g are functions and (f∘g)(x) = f(g(x)). True or false?",
          options: ["True", "False", "Only if f = g", "Only if they are one-one"],
          answerIndex: 0,
          explanation: "By definition, composition (f∘g)(x) = f(g(x))"
        },
        hi: {
          question: "यदि f और g functions हैं और (f∘g)(x) = f(g(x))। सत्य या असत्य?",
          options: ["सत्य", "असत्य", "केवल यदि f = g", "केवल यदि वे one-one हैं"],
          answerIndex: 0,
          explanation: "परिभाषा के अनुसार, संयोजन (f∘g)(x) = f(g(x))"
        },
        or: {
          question: "ଯଦି f ଏବଂ g functions ଏବଂ (f∘g)(x) = f(g(x))। ସତ୍ୟ କି ମିଥ୍ୟା?",
          options: ["ସତ୍ୟ", "ମିଥ୍ୟା", "କେବଳ ଯଦି f = g", "କେବଳ ଯଦି ସେମାନେ one-one"],
          answerIndex: 0,
          explanation: "ସଂଜ୍ଞା ଅନୁସାରେ, ସଂଯୋଜନ (f∘g)(x) = f(g(x))"
        }
      }
    },
    {
      id: "L3_Q5",
      difficulty: "hard",
      timeLimit: 60,
      lang: {
        en: {
          question: "If A has 3 elements, how many non-empty subsets does A have?",
          options: ["7", "8", "3", "6"],
          answerIndex: 0,
          explanation: "Total subsets = 2³ = 8. Non-empty = 8 - 1 = 7 (excluding empty set)"
        },
        hi: {
          question: "यदि A में 3 तत्व हैं, A के कितने non-empty subsets हैं?",
          options: ["7", "8", "3", "6"],
          answerIndex: 0,
          explanation: "कुल subsets = 2³ = 8। Non-empty = 8 - 1 = 7 (रिक्त सेट को छोड़कर)"
        },
        or: {
          question: "ଯଦି A ରେ 3 ଉପାଦାନ ଅଛି, A ର କେତୋଟି non-empty subsets ଅଛି?",
          options: ["7", "8", "3", "6"],
          answerIndex: 0,
          explanation: "ମୋଟ subsets = 2³ = 8। Non-empty = 8 - 1 = 7 (ଖାଲି ସେଟ୍ ବାଦ୍ ଦେଇ)"
        }
      }
    },
    {
      id: "L3_Q6",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "Which is correct: A ⊆ B and B ⊆ A implies:",
          options: ["A = B", "A ∩ B = ∅", "A ⊂ B", "None"],
          answerIndex: 0,
          explanation: "If A ⊆ B and B ⊆ A, then A and B have exactly the same elements, so A = B"
        },
        hi: {
          question: "कौन सही है: A ⊆ B और B ⊆ A का मतलब:",
          options: ["A = B", "A ∩ B = ∅", "A ⊂ B", "कोई नहीं"],
          answerIndex: 0,
          explanation: "यदि A ⊆ B और B ⊆ A, तो A और B में बिल्कुल समान तत्व हैं, अतः A = B"
        },
        or: {
          question: "କେଉଁଟି ସଠିକ୍: A ⊆ B ଏବଂ B ⊆ A ଅର୍ଥ:",
          options: ["A = B", "A ∩ B = ∅", "A ⊂ B", "କିଛି ନୁହେଁ"],
          answerIndex: 0,
          explanation: "ଯଦି A ⊆ B ଏବଂ B ⊆ A, ତେବେ A ଏବଂ B ରେ ଠିକ୍ ସମାନ ଉପାଦାନ ଅଛି, ତେଣୁ A = B"
        }
      }
    }
  ],

  // LEVEL 4 - Harder (40% easy, 30% medium, 30% hard)
  4: [
    {
      id: "L4_Q1",
      difficulty: "hard",
      timeLimit: 60,
      lang: {
        en: {
          question: "If f : {1,2} → {a,b,c} is onto? Is it possible?",
          options: ["No", "Yes", "Only if c=b", "Only if domain bigger"],
          answerIndex: 0,
          explanation: "For onto function, codomain size must be ≤ domain size. Here 3 > 2, so impossible"
        },
        hi: {
          question: "यदि f : {1,2} → {a,b,c} onto है? क्या यह संभव है?",
          options: ["नहीं", "हाँ", "केवल यदि c=b", "केवल यदि domain बड़ा हो"],
          answerIndex: 0,
          explanation: "Onto function के लिए, codomain का आकार ≤ domain के आकार का होना चाहिए। यहाँ 3 > 2, अतः असंभव"
        },
        or: {
          question: "ଯଦି f : {1,2} → {a,b,c} onto? ଏହା ସମ୍ଭବ କି?",
          options: ["ନା", "ହଁ", "କେବଳ ଯଦି c=b", "କେବଳ ଯଦି domain ବଡ଼"],
          answerIndex: 0,
          explanation: "Onto function ପାଇଁ, codomain ଆକାର ≤ domain ଆକାର ହେବା ଉଚିତ। ଏଠାରେ 3 > 2, ତେଣୁ ଅସମ୍ଭବ"
        }
      }
    },
    {
      id: "L4_Q2",
      difficulty: "hard",
      timeLimit: 60,
      lang: {
        en: {
          question: "Cardinality of power set of a set with n elements is:",
          options: ["2ⁿ", "n²", "n/2", "n!"],
          answerIndex: 0,
          explanation: "Power set contains all subsets. Each element can be included or not, giving 2ⁿ subsets"
        },
        hi: {
          question: "n तत्वों वाले सेट के power set की cardinality है:",
          options: ["2ⁿ", "n²", "n/2", "n!"],
          answerIndex: 0,
          explanation: "Power set में सभी subsets होते हैं। प्रत्येक तत्व शामिल हो सकता है या नहीं, जिससे 2ⁿ subsets मिलते हैं"
        },
        or: {
          question: "n ଉପାଦାନ ବିଶିଷ୍ଟ ସେଟ୍‌ର power set ର cardinality:",
          options: ["2ⁿ", "n²", "n/2", "n!"],
          answerIndex: 0,
          explanation: "Power set ରେ ସମସ୍ତ subsets ଅଛି। ପ୍ରତ୍ୟେକ ଉପାଦାନ ଅନ୍ତର୍ଭୁକ୍ତ ହୋଇପାରେ ବା ନ ପାରେ, ଯାହା 2ⁿ subsets ଦିଏ"
        }
      }
    },
    {
      id: "L4_Q3",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "If A={1,2} and B={2,3}, A ∩ B = ?",
          options: ["{2}", "{1,3}", "∅", "{1,2,3}"],
          answerIndex: 0,
          explanation: "Intersection contains only common elements between A and B"
        },
        hi: {
          question: "यदि A={1,2} और B={2,3}, A ∩ B = ?",
          options: ["{2}", "{1,3}", "∅", "{1,2,3}"],
          answerIndex: 0,
          explanation: "प्रतिच्छेदन में केवल A और B के बीच सामान्य तत्व होते हैं"
        },
        or: {
          question: "ଯଦି A={1,2} ଏବଂ B={2,3}, A ∩ B = ?",
          options: ["{2}", "{1,3}", "∅", "{1,2,3}"],
          answerIndex: 0,
          explanation: "ଛେଦରେ କେବଳ A ଏବଂ B ମଧ୍ୟରେ ସାଧାରଣ ଉପାଦାନ ଥାଏ"
        }
      }
    },
    {
      id: "L4_Q4",
      difficulty: "hard",
      timeLimit: 60,
      lang: {
        en: {
          question: "If f is one-one but not onto, then inverse f⁻¹:",
          options: ["not a function from codomain to domain", "always exists as function", "equals f", "undefined"],
          answerIndex: 0,
          explanation: "If f is not onto, some codomain elements have no preimage, so f⁻¹ is not a function on entire codomain"
        },
        hi: {
          question: "यदि f one-one है लेकिन onto नहीं, तो inverse f⁻¹:",
          options: ["codomain से domain तक function नहीं", "हमेशा function के रूप में मौजूद", "f के बराबर", "अपरिभाषित"],
          answerIndex: 0,
          explanation: "यदि f onto नहीं है, तो कुछ codomain elements का कोई preimage नहीं है, अतः f⁻¹ पूरे codomain पर function नहीं है"
        },
        or: {
          question: "ଯଦି f one-one କିନ୍ତୁ onto ନୁହେଁ, ତେବେ inverse f⁻¹:",
          options: ["codomain ରୁ domain ପର୍ଯ୍ୟନ୍ତ function ନୁହେଁ", "ସର୍ବଦା function ଭାବରେ ବିଦ୍ୟମାନ", "f ସହିତ ସମାନ", "ଅପରିଭାଷିତ"],
          answerIndex: 0,
          explanation: "ଯଦି f onto ନୁହେଁ, ତେବେ କିଛି codomain elements ର କୌଣସି preimage ନାହିଁ, ତେଣୁ f⁻¹ ସମ୍ପୂର୍ଣ୍ଣ codomain ରେ function ନୁହେଁ"
        }
      }
    },
    {
      id: "L4_Q5",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "If sets A and B are disjoint then A ∩ B = ?",
          options: ["∅", "A", "B", "A ∪ B"],
          answerIndex: 0,
          explanation: "Disjoint sets have no common elements, so their intersection is empty"
        },
        hi: {
          question: "यदि sets A और B disjoint हैं तो A ∩ B = ?",
          options: ["∅", "A", "B", "A ∪ B"],
          answerIndex: 0,
          explanation: "Disjoint sets में कोई सामान्य तत्व नहीं होते, अतः उनका प्रतिच्छेदन रिक्त है"
        },
        or: {
          question: "ଯଦି sets A ଏବଂ B disjoint ତେବେ A ∩ B = ?",
          options: ["∅", "A", "B", "A ∪ B"],
          answerIndex: 0,
          explanation: "Disjoint sets ରେ କୌଣସି ସାଧାରଣ ଉପାଦାନ ନାହିଁ, ତେଣୁ ସେମାନଙ୍କର ଛେଦ ଖାଲି"
        }
      }
    },
    {
      id: "L4_Q6",
      difficulty: "easy",
      timeLimit: 30,
      lang: {
        en: {
          question: "Which is empty set symbol?",
          options: ["∅", "O", "0", "{}"],
          answerIndex: 0,
          explanation: "∅ is the standard symbol for empty set, though {} is also correct notation"
        },
        hi: {
          question: "कौन सा empty set का symbol है?",
          options: ["∅", "O", "0", "{}"],
          answerIndex: 0,
          explanation: "∅ empty set का मानक प्रतीक है, हालांकि {} भी सही notation है"
        },
        or: {
          question: "କେଉଁଟି empty set symbol?",
          options: ["∅", "O", "0", "{}"],
          answerIndex: 0,
          explanation: "∅ ହେଉଛି empty set ର ମାନକ ପ୍ରତୀକ, ଯଦିଓ {} ମଧ୍ୟ ସଠିକ୍ notation"
        }
      }
    }
  ],

  // LEVEL 5 - Hard (10% easy, 50% medium, 40% hard)
  5: [
    {
      id: "L5_Q1",
      difficulty: "hard",
      timeLimit: 60,
      lang: {
        en: {
          question: "How many bijections exist between two finite sets each of size 3?",
          options: ["6", "9", "3", "1"],
          answerIndex: 0,
          explanation: "Bijections between sets of size n = n! permutations. So 3! = 6"
        },
        hi: {
          question: "3 आकार के दो finite sets के बीच कितने bijections हैं?",
          options: ["6", "9", "3", "1"],
          answerIndex: 0,
          explanation: "आकार n के sets के बीच bijections = n! क्रमचय। अतः 3! = 6"
        },
        or: {
          question: "3 ଆକାରର ଦୁଇ finite sets ମଧ୍ୟରେ କେତୋଟି bijections ଅଛି?",
          options: ["6", "9", "3", "1"],
          answerIndex: 0,
          explanation: "ଆକାର n ର sets ମଧ୍ୟରେ bijections = n! କ୍ରମଚୟ। ତେଣୁ 3! = 6"
        }
      }
    },
    {
      id: "L5_Q2",
      difficulty: "hard",
      timeLimit: 60,
      lang: {
        en: {
          question: "If f : A→B is bijective then |A| = |B|. True or false?",
          options: ["True", "False", "Only if finite sets", "Only if infinite"],
          answerIndex: 0,
          explanation: "Bijective functions preserve cardinality, so domain and codomain have same size"
        },
        hi: {
          question: "यदि f : A→B bijective है तो |A| = |B|। सत्य या असत्य?",
          options: ["सत्य", "असत्य", "केवल finite sets के लिए", "केवल infinite के लिए"],
          answerIndex: 0,
          explanation: "Bijective functions cardinality को संरक्षित करते हैं, अतः domain और codomain का आकार समान होता है"
        },
        or: {
          question: "ଯଦି f : A→B bijective ତେବେ |A| = |B|। ସତ୍ୟ କି ମିଥ୍ୟା?",
          options: ["ସତ୍ୟ", "ମିଥ୍ୟା", "କେବଳ finite sets ପାଇଁ", "କେବଳ infinite ପାଇଁ"],
          answerIndex: 0,
          explanation: "Bijective functions cardinality ସଂରକ୍ଷଣ କରେ, ତେଣୁ domain ଏବଂ codomain ର ଆକାର ସମାନ"
        }
      }
    },
    {
      id: "L5_Q3",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "For sets A,B,C, distributive law: A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C). True?",
          options: ["True", "False", "Only for finite sets", "Only for disjoint sets"],
          answerIndex: 0,
          explanation: "This is one of the fundamental distributive laws of set theory"
        },
        hi: {
          question: "सेटों A,B,C के लिए, वितरण नियम: A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)। सत्य?",
          options: ["सत्य", "असत्य", "केवल finite sets के लिए", "केवल disjoint sets के लिए"],
          answerIndex: 0,
          explanation: "यह set theory के मौलिक वितरण नियमों में से एक है"
        },
        or: {
          question: "ସେଟ୍ A,B,C ପାଇଁ, ବଣ୍ଟନ ନିୟମ: A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C)। ସତ୍ୟ?",
          options: ["ସତ୍ୟ", "ମିଥ୍ୟା", "କେବଳ finite sets ପାଇଁ", "କେବଳ disjoint sets ପାଇଁ"],
          answerIndex: 0,
          explanation: "ଏହା set theory ର ମୌଳିକ ବଣ୍ଟନ ନିୟମ ମଧ୍ୟରୁ ଗୋଟିଏ"
        }
      }
    },
    {
      id: "L5_Q4",
      difficulty: "hard",
      timeLimit: 60,
      lang: {
        en: {
          question: "Let f : {1,2,3,4} → {a,b} ; can f be one-one?",
          options: ["No", "Yes", "Only if a=b", "Only if domain smaller"],
          answerIndex: 0,
          explanation: "For one-one function, domain size must be ≤ codomain size. Here 4 > 2, so impossible"
        },
        hi: {
          question: "f : {1,2,3,4} → {a,b} ; क्या f one-one हो सकता है?",
          options: ["नहीं", "हाँ", "केवल यदि a=b", "केवल यदि domain छोटा हो"],
          answerIndex: 0,
          explanation: "One-one function के लिए, domain का आकार ≤ codomain के आकार का होना चाहिए। यहाँ 4 > 2, अतः असंभव"
        },
        or: {
          question: "f : {1,2,3,4} → {a,b} ; f one-one ହୋଇପାରେ କି?",
          options: ["ନା", "ହଁ", "କେବଳ ଯଦି a=b", "କେବଳ ଯଦି domain ଛୋଟ"],
          answerIndex: 0,
          explanation: "One-one function ପାଇଁ, domain ଆକାର ≤ codomain ଆକାର ହେବା ଉଚିତ। ଏଠାରେ 4 > 2, ତେଣୁ ଅସମ୍ଭବ"
        }
      }
    },
    {
      id: "L5_Q5",
      difficulty: "medium",
      timeLimit: 45,
      lang: {
        en: {
          question: "If A = {x | x² = 1 in Z}, A = ?",
          options: ["{1, -1}", "{0,1}", "{1}", "{}"],
          answerIndex: 0,
          explanation: "In integers, x² = 1 has solutions x = 1 and x = -1"
        },
        hi: {
          question: "यदि A = {x | x² = 1 in Z}, A = ?",
          options: ["{1, -1}", "{0,1}", "{1}", "{}"],
          answerIndex: 0,
          explanation: "पूर्णांकों में, x² = 1 के हल x = 1 और x = -1 हैं"
        },
        or: {
          question: "ଯଦି A = {x | x² = 1 in Z}, A = ?",
          options: ["{1, -1}", "{0,1}", "{1}", "{}"],
          answerIndex: 0,
          explanation: "ପୂର୍ଣ୍ଣସଂଖ୍ୟାରେ, x² = 1 ର ସମାଧାନ x = 1 ଏବଂ x = -1"
        }
      }
    },
    {
      id: "L5_Q6",
      difficulty: "hard",
      timeLimit: 60,
      lang: {
        en: {
          question: "If f∘g is one-one then:",
          options: ["g must be one-one", "f must be one-one", "both must be onto", "none"],
          answerIndex: 0,
          explanation: "If f∘g is one-one and g is not one-one, then different inputs to g could give same output, making f∘g not one-one"
        },
        hi: {
          question: "यदि f∘g one-one है तो:",
          options: ["g अवश्य one-one होना चाहिए", "f अवश्य one-one होना चाहिए", "दोनों अवश्य onto होना चाहिए", "कोई नहीं"],
          answerIndex: 0,
          explanation: "यदि f∘g one-one है और g one-one नहीं है, तो g के अलग inputs समान output दे सकते हैं, जिससे f∘g one-one नहीं होगा"
        },
        or: {
          question: "ଯଦି f∘g one-one ତେବେ:",
          options: ["g ନିଶ୍ଚୟ one-one ହେବା ଉଚିତ", "f ନିଶ୍ଚୟ one-one ହେବା ଉଚିତ", "ଦୁଇଟି ନିଶ୍ଚୟ onto ହେବା ଉଚିତ", "କିଛି ନୁହେଁ"],
          answerIndex: 0,
          explanation: "ଯଦି f∘g one-one ଏବଂ g one-one ନୁହେଁ, ତେବେ g ର ଭିନ୍ନ inputs ସମାନ output ଦେଇପାରେ, ଯାହା f∘g କୁ one-one କରିବ ନାହିଁ"
        }
      }
    }
  ]
};

// Helper function to get questions for a specific level
export const getQuestionsForLevel = (level: number): QuestionData[] => {
  return SETS_QUESTION_BANK[level] || [];
};

// Helper function to get difficulty distribution for a level
export const getLevelDifficultyStats = (level: number) => {
  const questions = getQuestionsForLevel(level);
  const total = questions.length;
  const easy = questions.filter(q => q.difficulty === 'easy').length;
  const medium = questions.filter(q => q.difficulty === 'medium').length;
  const hard = questions.filter(q => q.difficulty === 'hard').length;
  
  return {
    total,
    easy: Math.round((easy / total) * 100),
    medium: Math.round((medium / total) * 100),
    hard: Math.round((hard / total) * 100)
  };
};

export default SETS_QUESTION_BANK;