import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, FlaskConical, Play, Pause, RotateCcw, Star, Trophy, Sparkles, Crown, Target, Beaker, Atom } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface ChemistryLabGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

type ChemistryExperiment = 'acids' | 'molecules' | 'reactions';
type ChemistryStage = 'do' | 'learn' | 'play' | 'earn' | 'celebrate';

interface Molecule {
  id: number;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  bonds: number[];
  valence: number;
}

interface ExperimentData {
  title: string;
  description: string;
  concept: string;
  formula: string;
  realWorldExample: string;
}

export function ChemistryLabGame({ language, onBack, onComplete }: ChemistryLabGameProps) {
  const [currentExperiment, setCurrentExperiment] = useState<ChemistryExperiment>('acids');
  const [stage, setStage] = useState<ChemistryStage>('do');
  const [isReacting, setIsReacting] = useState(false);
  const [score, setScore] = useState(0);
  const [completedExperiments, setCompletedExperiments] = useState<ChemistryExperiment[]>([]);
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [reactionTime, setReactionTime] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [pH, setPH] = useState(7);
  const [temperature, setTemperature] = useState(25);
  const animationFrameRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getT = (key: string, lang: Language): string => {
    const translations = {
      chemistryLab: {
        en: 'Chemistry Lab',
        hi: 'रसायन प्रयोगशाला',
        or: 'ରସାୟନ ଲାବୋରେଟୋରୀ'
      },
      subtitle: {
        en: 'Explore molecules and chemical reactions!',
        hi: 'अणुओं और रासायनिक अभिक्रियाओं का अन्वेषण करें!',
        or: 'ଅଣୁ ଏବଂ ରାସାୟନିକ ଅଭିକ୍ରିୟା ଅନ୍ୱେଷଣ କରନ୍ତୁ!'
      },
      // Do Stage
      chooseExperiment: {
        en: '🧪 Choose Your Chemical Experiment',
        hi: '🧪 अपना रासायनिक प्रयोग चुनें',
        or: '🧪 ଆପଣଙ୍କର ରାସାୟନିକ ପରୀକ୍ଷଣ ବାଛନ୍ତୁ'
      },
      acids: {
        en: 'Acids & Bases',
        hi: 'अम्ल और क्षार',
        or: 'ଅମ୍ଳ ଏବଂ କ୍ଷାର'
      },
      molecules: {
        en: 'Molecule Builder',
        hi: 'अणु निर्माता',
        or: 'ଅଣୁ ନିର୍ମାତା'
      },
      reactions: {
        en: 'Chemical Reactions',
        hi: 'रासायनिक अभिक्रियाएं',
        or: 'ରାସାୟନିକ ଅଭିକ୍ରିୟା'
      },
      // Learn Stage
      learnChemistry: {
        en: '⚗️ Learn Chemical Principles',
        hi: '⚗️ रासायनिक सिद्धांत सीखें',
        or: '⚗️ ରାସାୟନିକ ସିଦ୍ଧାନ୍ତ ଶିଖନ୍ତୁ'
      },
      concept: {
        en: 'Chemical Concept:',
        hi: 'रासायनिक अवधारणा:',
        or: 'ରାସାୟନିକ ଧାରଣା:'
      },
      formula: {
        en: 'Chemical Formula:',
        hi: 'रासायनिक सूत्र:',
        or: 'ରାସାୟନିକ ସୂତ୍ର:'
      },
      realWorld: {
        en: 'Real World:',
        hi: 'वास्तविक दुनिया:',
        or: 'ବାସ୍ତବ ଜଗତ:'
      },
      // Play Stage
      runExperiment: {
        en: '🔬 Conduct Experiment',
        hi: '🔬 प्रयोग करें',
        or: '🔬 ପରୀକ୍ଷଣ କରନ୍ତୁ'
      },
      startReaction: {
        en: 'Start Reaction',
        hi: 'अभिक्रिया शुरू करें',
        or: 'ଅଭିକ୍ରିୟା ଆରମ୍ଭ କରନ୍ତୁ'
      },
      pauseReaction: {
        en: 'Pause',
        hi: 'रोकें',
        or: 'ବିରାମ'
      },
      reset: {
        en: 'Reset',
        hi: 'रीसेट',
        or: 'ରିସେଟ'
      },
      adjustPH: {
        en: 'Adjust pH',
        hi: 'pH समायोजित करें',
        or: 'pH ସମାୟୋଜନ କରନ୍ତୁ'
      },
      adjustTemp: {
        en: 'Adjust Temperature',
        hi: 'तापमान समायोजित करें',
        or: 'ତାପମାତ୍ରା ସମାୟୋଜନ କରନ୍ତୁ'
      },
      // Earn Stage
      earnPoints: {
        en: '🎯 Analyze Results',
        hi: '🎯 परिणामों का विश्लेषण करें',
        or: '🎯 ଫଳାଫଳ ବିଶ୍ଳେଷଣ କରନ୍ତୁ'
      },
      completeExperiment: {
        en: 'Complete Analysis',
        hi: 'विश्लेषण पूरा करें',
        or: 'ବିଶ୍ଳେଷଣ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ'
      },
      insights: {
        en: 'Chemical Insights:',
        hi: 'रासायनिक अंतर्दृष्टि:',
        or: 'ରାସାୟନିକ ଅନ୍ତର୍ଦୃଷ୍ଟି:'
      },
      // Celebrate Stage
      celebrate: {
        en: '🎉 Chemical Discovery!',
        hi: '🎉 रासायनिक खोज!',
        or: '🎉 ରାସାୟନିକ ଆବିଷ୍କାର!'
      },
      // Navigation
      nextStage: {
        en: 'Next →',
        hi: 'अगला →',
        or: 'ପରବର୍ତ୍ତୀ →'
      },
      continueExperiment: {
        en: 'Continue to Next Experiment',
        hi: 'अगले प्रयोग पर जारी रखें',
        or: 'ପରବର୍ତ୍ତୀ ପରୀକ୍ଷଣକୁ ଜାରି ରଖନ୍ତୁ'
      },
      finishLab: {
        en: 'Complete Chemistry Lab',
        hi: 'रसायन लैब पूरा करें',
        or: 'ରସାୟନ ଲାବ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ'
      },
      back: {
        en: 'Back',
        hi: 'वापस',
        or: 'ପଛକୁ'
      }
    };
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  const experimentData: Record<ChemistryExperiment, ExperimentData> = {
    acids: {
      title: language === 'en' ? 'Acids & Bases' : language === 'hi' ? 'अम्ल और क्षार' : 'ଅମ୍ଳ ଏବଂ କ୍ଷାର',
      description: language === 'en' ? 'Learn about pH levels and acid-base reactions' : language === 'hi' ? 'pH स्तर और अम्ल-क्षार अभिक्रियाओं के बारे में जानें' : 'pH ସ୍ତର ଏବଂ ଅମ୍ଳ-କ୍ଷାର ଅଭିକ୍ରିୟା ବିଷୟରେ ଜାଣନ୍ତୁ',
      concept: language === 'en' ? 'Acids donate protons (H⁺) while bases accept them. The pH scale measures acidity from 0-14, with 7 being neutral.' : language === 'hi' ? 'अम्ल प्रोटॉन (H⁺) दान करते हैं जबकि क्षार उन्हें स्वीकार करते हैं। pH स्केल 0-14 से अम्लता मापता है, 7 तटस्थ होता है।' : 'ଅମ୍ଳ ପ୍ରୋଟନ (H⁺) ଦାନ କରେ ଯେତେବେଳେ କ୍ଷାର ଗ୍ରହଣ କରେ।',
      formula: 'pH = -log[H⁺]',
      realWorldExample: language === 'en' ? 'Lemon juice (acidic), soap (basic), stomach acid for digestion' : language === 'hi' ? 'नींबू का रस (अम्लीय), साबुन (क्षारीय), पाचन के लिए पेट का अम्ल' : 'ଲେମ୍ବୁ ରସ (ଅମ୍ଳୀୟ), ସାବୁନ (କ୍ଷାରୀୟ), ହଜମ ପାଇଁ ପେଟର ଅମ୍ଳ'
    },
    molecules: {
      title: language === 'en' ? 'Molecule Builder' : language === 'hi' ? 'अणु निर्माता' : 'ଅଣୁ ନିର୍ମାତା',
      description: language === 'en' ? 'Build molecules by connecting atoms with bonds' : language === 'hi' ? 'बंधनों के साथ परमाणुओं को जोड़कर अणु बनाएं' : 'ବନ୍ଧନ ସହ ପରମାଣୁମାନଙ୍କୁ ଯୋଡ଼ି ଅଣୁ ନିର୍ମାଣ କରନ୍ତୁ',
      concept: language === 'en' ? 'Atoms bond together by sharing or transferring electrons to form molecules. Valence electrons determine bonding capacity.' : language === 'hi' ? 'परमाणु अणु बनाने के लिए इलेक्ट्रॉनों को साझा या स्थानांतरित करके बंधन बनाते हैं।' : 'ପରମାଣୁମାନେ ଅଣୁ ଗଠନ ପାଇଁ ଇଲେକ୍ଟ୍ରନ ସହଭାଗ କିମ୍ବା ସ୍ଥାନାନ୍ତର କରି ବନ୍ଧନ କରନ୍ତି।',
      formula: 'H₂O, CO₂, CH₄',
      realWorldExample: language === 'en' ? 'Water molecules, carbon dioxide in air, methane gas' : language === 'hi' ? 'पानी के अणु, हवा में कार्बन डाइऑक्साइड, मीथेन गैस' : 'ପାଣି ଅଣୁ, ବାୟୁରେ କାର୍ବନ ଡାଇଅକ୍ସାଇଡ, ମିଥେନ ଗ୍ୟାସ'
    },
    reactions: {
      title: language === 'en' ? 'Chemical Reactions' : language === 'hi' ? 'रासायनिक अभिक्रियाएं' : 'ରାସାୟନିକ ଅଭିକ୍ରିୟା',
      description: language === 'en' ? 'Watch molecules transform through chemical reactions' : language === 'hi' ? 'रासायनिक अभिक्रियाओं के माध्यम से अणुओं के रूपांतरण को देखें' : 'ରାସାୟନିକ ଅଭିକ୍ରିୟା ମାଧ୍ୟମରେ ଅଣୁମାନଙ୍କର ରୂପାନ୍ତର ଦେଖନ୍ତୁ',
      concept: language === 'en' ? 'In chemical reactions, bonds break and form as atoms rearrange to create new substances with different properties.' : language === 'hi' ? 'रासायनिक अभिक्रियाओं में, बंधन टूटते और बनते हैं जैसे परमाणु नए गुणों के साथ नए पदार्थ बनाने के लिए पुनर्व्यवस्थित होते हैं।' : 'ରାସାୟନିକ ଅଭିକ୍ରିୟାରେ, ବନ୍ଧନ ଭାଙ୍ଗେ ଏବଂ ଗଠନ ହୁଏ ଯେହେତୁ ପରମାଣୁମାନେ ନୂତନ ଗୁଣ ସହ ନୂତନ ପଦାର୍ଥ ସୃଷ୍ଟି କରିବାକୁ ପୁନଃସଜ୍ଜିତ ହୁଅନ୍ତି।',
      formula: 'A + B → C + D',
      realWorldExample: language === 'en' ? 'Burning wood, cooking food, photosynthesis in plants' : language === 'hi' ? 'लकड़ी जलाना, खाना पकाना, पौधों में प्रकाश संश्लेषण' : 'କାଠ ଜଳାଇବା, ଖାଦ୍ୟ ରାନ୍ଧିବା, ଉଦ୍ଭିଦରେ ଫୋଟୋସିନ୍ଥେସିସ'
    }
  };

  // Initialize molecules for experiments
  const initializeExperiment = () => {
    let newMolecules: Molecule[] = [];
    
    switch (currentExperiment) {
      case 'acids':
        // H+ ions (acids) and OH- ions (bases)
        for (let i = 0; i < 3; i++) {
          newMolecules.push({
            id: i + 1,
            type: 'H+',
            x: 50 + i * 60,
            y: 150,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            color: '#FF4444',
            radius: 8,
            bonds: [],
            valence: 1
          });
        }
        for (let i = 0; i < 3; i++) {
          newMolecules.push({
            id: i + 4,
            type: 'OH-',
            x: 250 + i * 60,
            y: 250,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            color: '#4444FF',
            radius: 12,
            bonds: [],
            valence: 1
          });
        }
        break;
      case 'molecules':
        // H, O, C atoms for building molecules
        newMolecules = [
          { id: 1, type: 'H', x: 100, y: 150, vx: 0, vy: 0, color: '#FFFFFF', radius: 6, bonds: [], valence: 1 },
          { id: 2, type: 'H', x: 130, y: 150, vx: 0, vy: 0, color: '#FFFFFF', radius: 6, bonds: [], valence: 1 },
          { id: 3, type: 'O', x: 200, y: 200, vx: 0, vy: 0, color: '#FF0000', radius: 10, bonds: [], valence: 2 },
          { id: 4, type: 'C', x: 300, y: 150, vx: 0, vy: 0, color: '#444444', radius: 8, bonds: [], valence: 4 },
          { id: 5, type: 'H', x: 280, y: 120, vx: 0, vy: 0, color: '#FFFFFF', radius: 6, bonds: [], valence: 1 },
          { id: 6, type: 'H', x: 320, y: 120, vx: 0, vy: 0, color: '#FFFFFF', radius: 6, bonds: [], valence: 1 }
        ];
        break;
      case 'reactions':
        // Reactants that will form products
        newMolecules = [
          { id: 1, type: 'CH4', x: 80, y: 180, vx: 1, vy: 0, color: '#8B4513', radius: 12, bonds: [], valence: 0 },
          { id: 2, type: 'O2', x: 150, y: 180, vx: -1, vy: 0, color: '#FF0000', radius: 10, bonds: [], valence: 0 },
          { id: 3, type: 'O2', x: 180, y: 220, vx: -1, vy: 0, color: '#FF0000', radius: 10, bonds: [], valence: 0 }
        ];
        break;
    }
    
    setMolecules(newMolecules);
  };

  // Chemistry simulation
  const simulateReaction = () => {
    if (!isReacting) return;

    setReactionTime(prev => prev + 1);

    setMolecules(prevMolecules => {
      const newMolecules = [...prevMolecules];

      // Different behaviors for different experiments
      if (currentExperiment === 'acids') {
        // pH simulation based on H+ and OH- concentrations
        const hPlus = newMolecules.filter(m => m.type === 'H+').length;
        const ohMinus = newMolecules.filter(m => m.type === 'OH-').length;
        const newPH = 7 + Math.log10(ohMinus / (hPlus + 1));
        setPH(Math.max(0, Math.min(14, newPH)));

        // Acid-base neutralization
        newMolecules.forEach((mol, i) => {
          if (mol.type === 'H+') {
            const nearbyOH = newMolecules.find((other, j) => 
              j !== i && other.type === 'OH-' && 
              Math.abs(mol.x - other.x) < 30 && Math.abs(mol.y - other.y) < 30
            );
            if (nearbyOH && Math.random() > 0.95) {
              // Form water
              mol.type = 'H2O';
              mol.color = '#00AAFF';
              mol.radius = 10;
              nearbyOH.type = 'H2O';
              nearbyOH.color = '#00AAFF';
              nearbyOH.radius = 10;
            }
          }
        });
      } else if (currentExperiment === 'molecules') {
        // Molecule formation based on valence
        newMolecules.forEach((mol, i) => {
          if (mol.valence > 0) {
            const nearby = newMolecules.find((other, j) => 
              j !== i && other.valence > 0 && !mol.bonds.includes(j) && !other.bonds.includes(i) &&
              Math.abs(mol.x - other.x) < 25 && Math.abs(mol.y - other.y) < 25
            );
            if (nearby && Math.random() > 0.98) {
              mol.bonds.push(newMolecules.indexOf(nearby));
              nearby.bonds.push(i);
              mol.valence--;
              nearby.valence--;
            }
          }
        });
      } else if (currentExperiment === 'reactions') {
        // Combustion reaction: CH4 + 2O2 → CO2 + 2H2O
        const methane = newMolecules.find(m => m.type === 'CH4');
        const oxygen = newMolecules.filter(m => m.type === 'O2');
        
        if (methane && oxygen.length >= 2 && reactionTime > 180) {
          // Transform reactants to products
          methane.type = 'CO2';
          methane.color = '#666666';
          if (oxygen[0]) {
            oxygen[0].type = 'H2O';
            oxygen[0].color = '#00AAFF';
          }
          if (oxygen[1]) {
            oxygen[1].type = 'H2O';
            oxygen[1].color = '#00AAFF';
          }
          setTemperature(prev => prev + 15); // Exothermic reaction
        }
      }

      // Update positions
      newMolecules.forEach(mol => {
        mol.x += mol.vx;
        mol.y += mol.vy;
        
        // Boundary collision
        if (mol.x <= mol.radius || mol.x >= 400 - mol.radius) mol.vx *= -0.8;
        if (mol.y <= mol.radius || mol.y >= 400 - mol.radius) mol.vy *= -0.8;
        
        // Keep in bounds
        mol.x = Math.max(mol.radius, Math.min(400 - mol.radius, mol.x));
        mol.y = Math.max(mol.radius, Math.min(400 - mol.radius, mol.y));
      });

      return newMolecules;
    });

    animationFrameRef.current = requestAnimationFrame(simulateReaction);
  };

  // Enhanced canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 400, 400);
    
    // Background gradient based on experiment
    let gradient;
    if (currentExperiment === 'acids') {
      gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, pH < 7 ? '#ffebee' : pH > 7 ? '#e8f5e8' : '#f5f5f5');
      gradient.addColorStop(1, pH < 7 ? '#ffcdd2' : pH > 7 ? '#c8e6c8' : '#e0e0e0');
    } else {
      gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, '#f0f8ff');
      gradient.addColorStop(1, '#e6f3ff');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Draw grid for molecule building
    if (currentExperiment === 'molecules') {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      for (let i = 0; i < 400; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 400);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(400, i);
        ctx.stroke();
      }
    }

    // Draw bonds between molecules
    molecules.forEach((mol, i) => {
      mol.bonds.forEach(bondIndex => {
        const bondedMol = molecules[bondIndex];
        if (bondedMol) {
          ctx.strokeStyle = '#444444';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(mol.x, mol.y);
          ctx.lineTo(bondedMol.x, bondedMol.y);
          ctx.stroke();
        }
      });
    });

    // Draw molecules
    molecules.forEach(mol => {
      // Molecule shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(mol.x + 2, mol.y + 2, mol.radius, 0, Math.PI * 2);
      ctx.fill();

      // Main molecule
      const gradient = ctx.createRadialGradient(
        mol.x - mol.radius * 0.3, mol.y - mol.radius * 0.3, 0,
        mol.x, mol.y, mol.radius
      );
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.3, mol.color);
      gradient.addColorStop(1, mol.color + '80');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mol.x, mol.y, mol.radius, 0, Math.PI * 2);
      ctx.fill();

      // Molecule border
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(mol.type, mol.x, mol.y + 3);

      // Valence indicator for molecules experiment
      if (currentExperiment === 'molecules' && mol.valence > 0) {
        ctx.fillStyle = '#FF4444';
        for (let i = 0; i < mol.valence; i++) {
          const angle = (i / mol.valence) * Math.PI * 2;
          const x = mol.x + Math.cos(angle) * (mol.radius + 5);
          const y = mol.y + Math.sin(angle) * (mol.radius + 5);
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // pH indicator for acids experiment
    if (currentExperiment === 'acids') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(10, 10, 100, 40);
      ctx.strokeStyle = '#333333';
      ctx.strokeRect(10, 10, 100, 40);
      
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`pH: ${pH.toFixed(1)}`, 15, 25);
      ctx.fillText(pH < 7 ? 'Acidic' : pH > 7 ? 'Basic' : 'Neutral', 15, 40);
    }

    // Temperature indicator for reactions experiment
    if (currentExperiment === 'reactions') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(290, 10, 100, 40);
      ctx.strokeStyle = '#333333';
      ctx.strokeRect(290, 10, 100, 40);
      
      ctx.fillStyle = temperature > 25 ? '#FF4444' : '#4444FF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Temp: ${temperature}°C`, 295, 25);
      ctx.fillText(temperature > 25 ? 'Heating' : 'Room Temp', 295, 40);
    }

  }, [molecules, pH, temperature, currentExperiment]);

  // Animation control
  useEffect(() => {
    if (isReacting && stage === 'play') {
      animationFrameRef.current = requestAnimationFrame(simulateReaction);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isReacting, stage, reactionTime]);

  // Generate insights based on reaction time
  useEffect(() => {
    if (reactionTime > 0 && reactionTime % 120 === 0 && insights.length < 3) {
      const newInsights = [
        language === 'en' ? 'Chemical bonds form when atoms share or transfer electrons' : 
        language === 'hi' ? 'रासायनिक बंधन तब बनते हैं जब परमाणु इलेक्ट्रॉन साझा या स्थानांतरित करते हैं' : 
        'ଯେତେବେଳେ ପରମାଣୁମାନେ ଇଲେକ୍ଟ୍ରନ ସହଭାଗ କିମ୍ବା ସ୍ଥାନାନ୍ତର କରନ୍ତି ରାସାୟନିକ ବନ୍ଧନ ଗଠନ ହୁଏ',
        
        language === 'en' ? 'pH levels indicate how acidic or basic a solution is' : 
        language === 'hi' ? 'pH स्तर इंगित करते हैं कि घोल कितना अम्लीय या क्षारीय है' : 
        'pH ସ୍ତର ସୂଚିତ କରେ ଏକ ସମାଧାନ କେତେ ଅମ୍ଳୀୟ କିମ୍ବା କ୍ଷାରୀୟ',
        
        language === 'en' ? 'Chemical reactions involve breaking and forming bonds' : 
        language === 'hi' ? 'रासायनिक अभिक्रियाओं में बंधन तोड़ना और बनाना शामिल है' : 
        'ରାସାୟନିକ ଅଭିକ୍ରିୟାରେ ବନ୍ଧନ ଭାଙ୍ଗିବା ଏବଂ ଗଠନ କରିବା ଅନ୍ତର୍ଭୁକ୍ତ'
      ];
      
      if (insights.length < newInsights.length) {
        setInsights(prev => [...prev, newInsights[prev.length]]);
      }
    }
  }, [reactionTime, insights.length, language]);

  // Stage progression
  const nextStage = () => {
    const stages: ChemistryStage[] = ['do', 'learn', 'play', 'earn', 'celebrate'];
    const currentIndex = stages.indexOf(stage);
    
    if (currentIndex < stages.length - 1) {
      const nextStageValue = stages[currentIndex + 1];
      setStage(nextStageValue);
      
      if (nextStageValue === 'play') {
        initializeExperiment();
      }
    }
  };

  const completeExperiment = () => {
    setIsReacting(false);
    const bondsFormed = molecules.reduce((total, mol) => total + mol.bonds.length, 0);
    const points = 120 + bondsFormed * 10 + Math.min(reactionTime, 180);
    setScore(prev => prev + points);
    setCompletedExperiments(prev => [...prev, currentExperiment]);
    setStage('celebrate');
  };

  const continueToNext = () => {
    const experiments: ChemistryExperiment[] = ['acids', 'molecules', 'reactions'];
    const currentIndex = experiments.indexOf(currentExperiment);
    
    if (currentIndex < experiments.length - 1) {
      setCurrentExperiment(experiments[currentIndex + 1]);
      setStage('do');
      setReactionTime(0);
      setInsights([]);
      setPH(7);
      setTemperature(25);
    } else {
      finishLab();
    }
  };

  const finishLab = () => {
    const finalScore = Math.min(score, 1000);
    const xp = Math.floor(finalScore / 5);
    onComplete(finalScore, xp);
  };

  const resetExperiment = () => {
    setIsReacting(false);
    setMolecules([]);
    setReactionTime(0);
    setInsights([]);
    setPH(7);
    setTemperature(25);
    initializeExperiment();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 p-4 relative overflow-hidden">
      {/* Lab Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {getT('back', language)}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              🧪 {getT('chemistryLab', language)}
            </h1>
            <p className="text-white/70 text-sm">{getT('subtitle', language)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
            ⭐ {score}
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            🧪 {completedExperiments.length}/3
          </Badge>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* DO Stage - Choose Experiment */}
        {stage === 'do' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">{getT('chooseExperiment', language)}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['acids', 'molecules', 'reactions'].map((exp) => (
                <Card
                  key={exp}
                  className={`cursor-pointer transition-all duration-300 ${
                    currentExperiment === exp
                      ? 'bg-blue-500/20 border-blue-400 scale-105 ring-2 ring-blue-400'
                      : 'bg-white/10 border-white/20 hover:bg-white/15 hover:scale-102'
                  } ${completedExperiments.includes(exp as ChemistryExperiment) ? 'ring-2 ring-green-400' : ''}`}
                  onClick={() => setCurrentExperiment(exp as ChemistryExperiment)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">
                      {exp === 'acids' ? '🧪' : exp === 'molecules' ? '⚛️' : '🔬'}
                    </div>
                    <h3 className="text-white font-bold mb-2">{getT(exp, language)}</h3>
                    <p className="text-white/70 text-sm">{experimentData[exp as ChemistryExperiment].description}</p>
                    {completedExperiments.includes(exp as ChemistryExperiment) && (
                      <div className="mt-3">
                        <Trophy className="w-6 h-6 text-yellow-400 mx-auto" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={nextStage}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 text-lg"
            >
              <FlaskConical className="w-5 h-5 mr-2" />
              {getT('nextStage', language)}
            </Button>
          </motion.div>
        )}

        {/* LEARN Stage - Chemical Principles */}
        {stage === 'learn' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white text-center">{getT('learnChemistry', language)}</h2>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                {currentExperiment === 'acids' ? '🧪' : currentExperiment === 'molecules' ? '⚛️' : '🔬'}
                {experimentData[currentExperiment].title}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-300 font-bold mb-2">{getT('concept', language)}</h4>
                  <p className="text-white/90">{experimentData[currentExperiment].concept}</p>
                </div>
                
                <div className="bg-indigo-500/20 rounded-lg p-4">
                  <h4 className="text-indigo-300 font-bold mb-2">{getT('formula', language)}</h4>
                  <p className="text-white/90 font-mono text-lg">{experimentData[currentExperiment].formula}</p>
                </div>
                
                <div className="bg-purple-500/20 rounded-lg p-4">
                  <h4 className="text-purple-300 font-bold mb-2">{getT('realWorld', language)}</h4>
                  <p className="text-white/90">{experimentData[currentExperiment].realWorldExample}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={nextStage}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-3"
              >
                <Beaker className="w-5 h-5 mr-2" />
                {getT('nextStage', language)}
              </Button>
            </div>
          </motion.div>
        )}

        {/* PLAY Stage - Conduct Experiment */}
        {stage === 'play' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white text-center">{getT('runExperiment', language)}</h2>
            
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  onClick={() => setIsReacting(!isReacting)}
                  className={`${
                    isReacting
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isReacting ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      {getT('pauseReaction', language)}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {getT('startReaction', language)}
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetExperiment}
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {getT('reset', language)}
                </Button>
                
                {currentExperiment === 'acids' && (
                  <>
                    <Button
                      onClick={() => setPH(prev => Math.max(0, prev - 1))}
                      variant="outline"
                      className="bg-red-500/20 border-red-400 text-white hover:bg-red-500/30"
                    >
                      pH - (Add Acid)
                    </Button>
                    <Button
                      onClick={() => setPH(prev => Math.min(14, prev + 1))}
                      variant="outline"
                      className="bg-blue-500/20 border-blue-400 text-white hover:bg-blue-500/30"
                    >
                      pH + (Add Base)
                    </Button>
                  </>
                )}
              </div>

              <div className="bg-black/20 rounded-lg p-4 mx-auto" style={{ width: 'fit-content' }}>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="border border-white/30 rounded-lg cursor-pointer"
                  onClick={(e) => {
                    if (currentExperiment === 'molecules') {
                      const rect = canvasRef.current?.getBoundingClientRect();
                      if (rect) {
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        // Find clicked molecule and try to bond it
                        const clickedMol = molecules.find(mol =>
                          Math.sqrt((x - mol.x) ** 2 + (y - mol.y) ** 2) <= mol.radius
                        );
                        
                        if (clickedMol && clickedMol.valence > 0) {
                          const nearbyMol = molecules.find(mol =>
                            mol !== clickedMol && mol.valence > 0 &&
                            Math.sqrt((clickedMol.x - mol.x) ** 2 + (clickedMol.y - mol.y) ** 2) <= 40
                          );
                          
                          if (nearbyMol) {
                            setMolecules(prev => prev.map(mol => {
                              if (mol === clickedMol) {
                                return { ...mol, bonds: [...mol.bonds, prev.indexOf(nearbyMol)], valence: mol.valence - 1 };
                              } else if (mol === nearbyMol) {
                                return { ...mol, bonds: [...mol.bonds, prev.indexOf(clickedMol)], valence: mol.valence - 1 };
                              }
                              return mol;
                            }));
                          }
                        }
                      }
                    }
                  }}
                />
              </div>

              <div className="text-center">
                <p className="text-white/70 mb-2">
                  {language === 'en' ? 'Reaction Time:' : language === 'hi' ? 'अभिक्रिया समय:' : 'ଅଭିକ୍ରିୟା ସମୟ:'} {Math.floor(reactionTime / 60)}s
                </p>
                {currentExperiment === 'molecules' && (
                  <p className="text-white/70 mb-4">
                    {language === 'en' ? 'Click atoms to form bonds!' : 
                     language === 'hi' ? 'बंधन बनाने के लिए परमाणुओं पर क्लिक करें!' : 
                     'ବନ୍ଧନ ଗଠନ କରିବା ପାଇଁ ପରମାଣୁମାନଙ୍କ ଉପରେ କ୍ଲିକ କରନ୍ତୁ!'}
                  </p>
                )}
                <Button
                  onClick={nextStage}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
                >
                  <Target className="w-5 h-5 mr-2" />
                  {getT('nextStage', language)}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* EARN Stage - Analyze Results */}
        {stage === 'earn' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white text-center">{getT('earnPoints', language)}</h2>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">{getT('insights', language)}</h3>
              
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.3 }}
                    className="bg-blue-500/20 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className="text-2xl">💡</div>
                    <p className="text-white/90">{insight}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <div className="mb-4">
                  <div className="text-sm text-white/70 mb-2">
                    {language === 'en' ? 'Bonds Formed:' : 
                     language === 'hi' ? 'बने बंधन:' : 
                     'ଗଠିତ ବନ୍ଧନ:'} {molecules.reduce((total, mol) => total + mol.bonds.length, 0)}
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-2">
                    +{120 + molecules.reduce((total, mol) => total + mol.bonds.length, 0) * 10 + Math.min(reactionTime, 180)} Points
                  </div>
                </div>
                <p className="text-white/70 text-sm">
                  {language === 'en' ? 'Based on successful reactions and chemical understanding' : 
                   language === 'hi' ? 'सफल अभिक्रियाओं और रासायनिक समझ के आधार पर' : 
                   'ସଫଳ ଅଭିକ୍ରିୟା ଏବଂ ରାସାୟନିକ ବୁଝାମଣା ଆଧାରରେ'}
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={completeExperiment}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3"
              >
                <Atom className="w-5 h-5 mr-2" />
                {getT('completeExperiment', language)}
              </Button>
            </div>
          </motion.div>
        )}

        {/* CELEBRATE Stage - Success Celebration */}
        {stage === 'celebrate' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.6 }}
              className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400 rounded-lg p-8"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-4">{getT('celebrate', language)}</h2>
              
              <p className="text-white/80 mb-6">
                {language === 'en' ? `You've mastered ${experimentData[currentExperiment].title}!` : 
                 language === 'hi' ? `आपने ${experimentData[currentExperiment].title} में महारत हासिल की!` : 
                 `ଆପଣ ${experimentData[currentExperiment].title} ରେ ଦକ୍ଷତା ହାସଲ କରିଛନ୍ତି!`}
              </p>
              
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">+{120 + molecules.reduce((total, mol) => total + mol.bonds.length, 0) * 10 + Math.min(reactionTime, 180)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <span className="text-xl font-bold text-blue-400">+{Math.floor((120 + molecules.reduce((total, mol) => total + mol.bonds.length, 0) * 10 + Math.min(reactionTime, 180)) / 10)} XP</span>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center gap-4">
              {completedExperiments.length < 3 ? (
                <Button
                  onClick={continueToNext}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3"
                >
                  <FlaskConical className="w-5 h-5 mr-2" />
                  {getT('continueExperiment', language)}
                </Button>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={finishLab}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-4 text-lg"
                  >
                    <Crown className="w-6 h-6 mr-2" />
                    {getT('finishLab', language)}
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}