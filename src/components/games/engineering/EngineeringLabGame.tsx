import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Cog, Play, Pause, RotateCcw, Star, Trophy, Sparkles, Crown, Target, Users, Hammer, Wrench, Zap } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface EngineeringLabGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

type EngineeringProject = 'bridge' | 'circuit' | 'machine';
type EngineeringStage = 'do' | 'learn' | 'play' | 'earn' | 'celebrate';

interface Component {
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  connected: boolean;
  strength?: number;
}

interface ProjectData {
  title: string;
  description: string;
  concept: string;
  principle: string;
  realWorldExample: string;
}

export function EngineeringLabGame({ language, onBack, onComplete }: EngineeringLabGameProps) {
  const [currentProject, setCurrentProject] = useState<EngineeringProject>('bridge');
  const [stage, setStage] = useState<EngineeringStage>('do');
  const [isBuilding, setIsBuilding] = useState(false);
  const [score, setScore] = useState(0);
  const [completedProjects, setCompletedProjects] = useState<EngineeringProject[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [buildingTime, setBuildingTime] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const [loadTest, setLoadTest] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const getT = (key: string, lang: Language): string => {
    const translations = {
      engineeringLab: {
        en: 'Engineering Design Lab',
        hi: 'इंजीनियरिंग डिज़ाइन लैब',
        or: 'ଇଞ୍ଜିନିୟରିଂ ଡିଜାଇନ ଲାବ'
      },
      subtitle: {
        en: 'Design and build amazing structures!',
        hi: 'अद्भुत संरचनाओं को डिज़ाइन और निर्माण करें!',
        or: 'ଅଦ୍ଭୁତ ସଂରଚନା ଡିଜାଇନ ଏବଂ ନିର୍ମାଣ କରନ୍ତୁ!'
      },
      // Do Stage
      chooseProject: {
        en: '🏗️ Choose Your Project',
        hi: '🏗️ अपना प्रोजेक्ट चुनें',
        or: '🏗️ ଆପଣଙ୍କର ପ୍ରୋଜେକ୍ଟ ବାଛନ୍ତୁ'
      },
      bridge: {
        en: 'Bridge Builder',
        hi: 'पुल निर्माता',
        or: 'ସେତୁ ନିର୍ମାତା'
      },
      circuit: {
        en: 'Circuit Designer',
        hi: 'सर्किट डिज़ाइनर',
        or: 'ସର୍କିଟ ଡିଜାଇନର'
      },
      machine: {
        en: 'Simple Machine',
        hi: 'सरल मशीन',
        or: 'ସରଳ ମେସିନ'
      },
      // Learn Stage
      learnPrinciples: {
        en: '📐 Learn Engineering Principles',
        hi: '📐 इंजीनियरिंग सिद्धांत सीखें',
        or: '📐 ଇଞ୍ଜିନିୟରିଂ ସିଦ୍ଧାନ୍ତ ଶିଖନ୍ତୁ'
      },
      concept: {
        en: 'Engineering Concept:',
        hi: 'इंजीनियरिंग अवधारणा:',
        or: 'ଇଞ୍ଜିନିୟରିଂ ଧାରଣା:'
      },
      principle: {
        en: 'Key Principle:',
        hi: 'मुख्य सिद्धांत:',
        or: 'ମୁଖ୍ୟ ସିଦ୍ଧାନ୍ତ:'
      },
      realWorld: {
        en: 'Real World:',
        hi: 'वास्तविक दुनिया:',
        or: 'ବାସ୍ତବ ଜଗତ:'
      },
      // Play Stage
      buildProject: {
        en: '🔨 Build Your Design',
        hi: '🔨 अपना डिज़ाइन बनाएं',
        or: '🔨 ଆପଣଙ୍କର ଡିଜାଇନ ନିର୍ମାଣ କରନ୍ତୁ'
      },
      startBuilding: {
        en: 'Start Building',
        hi: 'निर्माण शुरू करें',
        or: 'ନିର୍ମାଣ ଆରମ୍ଭ କରନ୍ତୁ'
      },
      testLoad: {
        en: 'Test Load',
        hi: 'लोड टेस्ट',
        or: 'ଲୋଡ ଟେଷ୍ଟ'
      },
      reset: {
        en: 'Reset',
        hi: 'रीसेट',
        or: 'ରିସେଟ'
      },
      addComponent: {
        en: 'Add Component',
        hi: 'घटक जोड़ें',
        or: 'ଉପାଦାନ ଯୋଗ କରନ୍ତୁ'
      },
      // Earn Stage
      earnPoints: {
        en: '🎯 Test Your Design',
        hi: '🎯 अपने डिज़ाइन का परीक्षण करें',
        or: '🎯 ଆପଣଙ୍କର ଡିଜାଇନ ପରୀକ୍ଷା କରନ୍ତୁ'
      },
      testDesign: {
        en: 'Test Design',
        hi: 'डिज़ाइन टेस्ट करें',
        or: 'ଡିଜାଇନ ଟେଷ୍ଟ କରନ୍ତୁ'
      },
      insights: {
        en: 'Engineering Insights:',
        hi: 'इंजीनियरिंग अंतर्दृष्टि:',
        or: 'ଇଞ୍ଜିନିୟରିଂ ଅନ୍ତର୍ଦୃଷ୍ଟି:'
      },
      // Celebrate Stage
      celebrate: {
        en: '🎉 Engineering Success!',
        hi: '🎉 इंजीनियरिंग सफलता!',
        or: '🎉 ଇଞ୍ଜିନିୟରିଂ ସଫଳତା!'
      },
      // Navigation
      nextStage: {
        en: 'Next →',
        hi: 'अगला →',
        or: 'ପରବର୍ତ୍ତୀ →'
      },
      continueProject: {
        en: 'Continue to Next Project',
        hi: 'अगले प्रोजेक्ट पर जारी रखें',
        or: 'ପରବର୍ତ୍ତୀ ପ୍ରୋଜେକ୍ଟକୁ ଜାରି ରଖନ୍ତୁ'
      },
      finishLab: {
        en: 'Complete Engineering Lab',
        hi: 'इंजीनियरिंग लैब पूरा करें',
        or: 'ଇଞ୍ଜିନିୟରିଂ ଲାବ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ'
      },
      back: {
        en: 'Back',
        hi: 'वापस',
        or: 'ପଛକୁ'
      }
    };
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  const projectData: Record<EngineeringProject, ProjectData> = {
    bridge: {
      title: language === 'en' ? 'Bridge Builder' : language === 'hi' ? 'पुल निर्माता' : 'ସେତୁ ନିର୍ମାତା',
      description: language === 'en' ? 'Design a strong bridge to span across gaps' : language === 'hi' ? 'अंतराल को पाटने के लिए एक मजबूत पुल डिज़ाइन करें' : 'ଫାଙ୍କ ପାର କରିବା ପାଇଁ ଏକ ଶକ୍ତିଶାଳୀ ସେତୁ ଡିଜାଇନ କରନ୍ତୁ',
      concept: language === 'en' ? 'Bridges must distribute weight evenly and handle compression and tension forces. Triangular structures provide excellent strength-to-weight ratios.' : language === 'hi' ? 'पुलों को वजन को समान रूप से वितरित करना चाहिए और संपीड़न और तनाव बलों को संभालना चाहिए।' : 'ସେତୁମାନେ ଓଜନକୁ ସମାନ ଭାବରେ ବଣ୍ଟନ କରିବା ଉଚିତ ଏବଂ ସଙ୍କୋଚନ ଏବଂ ଟେନସନ ବଳକୁ ସମ୍ଭାଳିବା ଉଚିତ।',
      principle: language === 'en' ? 'Load Distribution & Structural Integrity' : language === 'hi' ? 'भार वितरण और संरचनात्मक अखंडता' : 'ଭାର ବଣ୍ଟନ ଏବଂ ସଂରଚନାଗତ ଅଖଣ୍ଡତା',
      realWorldExample: language === 'en' ? 'Golden Gate Bridge, Tower Bridge, Local footbridges' : language === 'hi' ? 'गोल्डन गेट ब्रिज, टावर ब्रिज, स्थानीय पैदल पुल' : 'ଗୋଲଡେନ ଗେଟ ବ୍ରିଜ, ଟାୱାର ବ୍ରିଜ, ସ୍ଥାନୀୟ ପାଦ ସେତୁ'
    },
    circuit: {
      title: language === 'en' ? 'Circuit Designer' : language === 'hi' ? 'सर्किट डिज़ाइनर' : 'ସର୍କିଟ ଡିଜାଇନର',
      description: language === 'en' ? 'Create working electrical circuits with components' : language === 'hi' ? 'घटकों के साथ कार्यशील विद्युत सर्किट बनाएं' : 'ଉପାଦାନମାନଙ୍କ ସହିତ କାର୍ଯ୍ୟକ୍ଷମ ବିଦ୍ୟୁତ ସର୍କିଟ ତିଆରି କରନ୍ତୁ',
      concept: language === 'en' ? 'Electrical circuits control the flow of electrons through conductive paths. Components like resistors, capacitors, and LEDs modify this flow in useful ways.' : language === 'hi' ? 'विद्युत सर्किट चालक पथों के माध्यम से इलेक्ट्रॉनों के प्रवाह को नियंत्रित करते हैं।' : 'ବିଦ୍ୟୁତ ସର୍କିଟମାନେ ଚାଳକ ପଥ ମାଧ୍ୟମରେ ଇଲେକ୍ଟ୍ରନମାନଙ୍କର ପ୍ରବାହକୁ ନିୟନ୍ତ୍ରଣ କରନ୍ତି।',
      principle: language === 'en' ? 'Ohm\'s Law & Current Flow' : language === 'hi' ? 'ओम का नियम और धारा प्रवाह' : 'ଓହମର ନିୟମ ଏବଂ ଧାରା ପ୍ରବାହ',
      realWorldExample: language === 'en' ? 'Smartphone circuits, LED lights, computer processors' : language === 'hi' ? 'स्मार्टफोन सर्किट, LED लाइट, कंप्यूटर प्रोसेसर' : 'ସ୍ମାର୍ଟଫୋନ ସର୍କିଟ, LED ଲାଇଟ, କମ୍ପ୍ୟୁଟର ପ୍ରୋସେସର'
    },
    machine: {
      title: language === 'en' ? 'Simple Machine' : language === 'hi' ? 'सरल मशीन' : 'ସରଳ ମେସିନ',
      description: language === 'en' ? 'Build levers and pulleys to multiply force' : language === 'hi' ? 'बल को गुणा करने के लिए लीवर और पुली बनाएं' : 'ବଳକୁ ଗୁଣନ କରିବା ପାଇଁ ଲିଭର ଏବଂ ପୁଲି ନିର୍ମାଣ କରନ୍ତୁ',
      concept: language === 'en' ? 'Simple machines like levers, pulleys, and inclined planes reduce the force needed to do work by increasing the distance over which force is applied.' : language === 'hi' ? 'लीवर, पुली, और झुके हुए तल जैसी सरल मशीनें काम करने के लिए आवश्यक बल को कम करती हैं।' : 'ଲିଭର, ପୁଲି, ଏବଂ ଢାଳୁ ତଳ ପରି ସରଳ ମେସିନମାନେ କାମ କରିବା ପାଇଁ ଆବଶ୍ୟକ ବଳକୁ କମ୍ କରନ୍ତି।',
      principle: language === 'en' ? 'Mechanical Advantage & Force Multiplication' : language === 'hi' ? 'यांत्रिक लाभ और बल गुणन' : 'ଯାନ୍ତ୍ରିକ ସୁବିଧା ଏବଂ ବଳ ଗୁଣନ',
      realWorldExample: language === 'en' ? 'Scissors, bottle openers, construction cranes' : language === 'hi' ? 'कैंची, बोतल खोलने वाले, निर्माण क्रेन' : 'କଞ୍ଚି, ବୋତଲ ଖୋଲିବା ଯନ୍ତ୍ର, ନିର୍ମାଣ କ୍ରେନ'
    }
  };

  // Initialize project components
  const initializeProject = () => {
    let newComponents: Component[] = [];
    
    switch (currentProject) {
      case 'bridge':
        // Bridge components: beams, supports, joints
        for (let i = 0; i < 5; i++) {
          newComponents.push({
            id: i + 1,
            type: i < 3 ? 'beam' : 'support',
            x: 50 + i * 60,
            y: 300,
            width: i < 3 ? 50 : 20,
            height: i < 3 ? 10 : 40,
            color: i < 3 ? '#8B4513' : '#666666',
            connected: false,
            strength: Math.random() * 100 + 50
          });
        }
        break;
      case 'circuit':
        // Circuit components: battery, resistor, LED, wire
        newComponents = [
          { id: 1, type: 'battery', x: 50, y: 150, width: 30, height: 15, color: '#FF4444', connected: false },
          { id: 2, type: 'resistor', x: 150, y: 150, width: 40, height: 10, color: '#8B4513', connected: false },
          { id: 3, type: 'led', x: 250, y: 150, width: 20, height: 20, color: '#00FF00', connected: false },
          { id: 4, type: 'wire', x: 100, y: 200, width: 60, height: 3, color: '#333333', connected: false },
          { id: 5, type: 'wire', x: 200, y: 200, width: 60, height: 3, color: '#333333', connected: false }
        ];
        break;
      case 'machine':
        // Simple machine components: lever, fulcrum, weights
        newComponents = [
          { id: 1, type: 'lever', x: 100, y: 180, width: 200, height: 8, color: '#8B4513', connected: false },
          { id: 2, type: 'fulcrum', x: 190, y: 190, width: 20, height: 30, color: '#666666', connected: false },
          { id: 3, type: 'weight1', x: 120, y: 160, width: 25, height: 20, color: '#FF4444', connected: false },
          { id: 4, type: 'weight2', x: 250, y: 160, width: 15, height: 15, color: '#4444FF', connected: false }
        ];
        break;
    }
    
    setComponents(newComponents);
  };

  // Enhanced canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 400, 400);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#f0f8ff');
    gradient.addColorStop(1, '#e6f3ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Draw grid
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

    // Draw project-specific background elements
    if (currentProject === 'bridge') {
      // Draw ground
      ctx.fillStyle = '#4a5d23';
      ctx.fillRect(0, 320, 120, 80);
      ctx.fillRect(280, 320, 120, 80);
      
      // Draw gap
      ctx.fillStyle = '#4da6ff';
      ctx.fillRect(120, 320, 160, 80);
    } else if (currentProject === 'circuit') {
      // Draw breadboard pattern
      ctx.fillStyle = '#f5f5dc';
      ctx.fillRect(20, 120, 360, 160);
      
      // Draw connection points
      ctx.fillStyle = '#c0c0c0';
      for (let x = 40; x < 380; x += 20) {
        for (let y = 140; y < 260; y += 20) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (currentProject === 'machine') {
      // Draw ground
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, 220, 400, 20);
    }

    // Draw components
    components.forEach(component => {
      ctx.fillStyle = component.connected ? component.color : component.color + '80';
      
      if (component.type === 'battery' && currentProject === 'circuit') {
        // Draw battery symbol
        ctx.fillRect(component.x, component.y, component.width, component.height);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText('+', component.x + component.width + 5, component.y + 10);
        ctx.fillText('-', component.x - 15, component.y + 10);
      } else if (component.type === 'led' && currentProject === 'circuit') {
        // Draw LED
        ctx.beginPath();
        ctx.arc(component.x + component.width/2, component.y + component.height/2, component.width/2, 0, Math.PI * 2);
        ctx.fill();
        if (component.connected && isBuilding) {
          // LED glow effect
          ctx.shadowColor = component.color;
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else if (component.type === 'resistor' && currentProject === 'circuit') {
        // Draw resistor with bands
        ctx.fillRect(component.x, component.y, component.width, component.height);
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(component.x + 5, component.y - 2, 3, 14);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(component.x + 15, component.y - 2, 3, 14);
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(component.x + 25, component.y - 2, 3, 14);
      } else {
        // Default rectangle
        ctx.fillRect(component.x, component.y, component.width, component.height);
      }

      // Highlight selected component
      if (selectedComponent === component.type) {
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 3;
        ctx.strokeRect(component.x - 2, component.y - 2, component.width + 4, component.height + 4);
      }

      // Show connection status
      if (component.connected) {
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(component.x + component.width, component.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw connections between components
    if (currentProject === 'circuit' && isBuilding) {
      const connectedComponents = components.filter(c => c.connected);
      if (connectedComponents.length > 1) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        
        for (let i = 0; i < connectedComponents.length - 1; i++) {
          const comp1 = connectedComponents[i];
          const comp2 = connectedComponents[i + 1];
          ctx.beginPath();
          ctx.moveTo(comp1.x + comp1.width/2, comp1.y + comp1.height/2);
          ctx.lineTo(comp2.x + comp2.width/2, comp2.y + comp2.height/2);
          ctx.stroke();
        }
        
        ctx.setLineDash([]);
      }
    }

    // Load test visualization
    if (loadTest > 0 && currentProject === 'bridge') {
      // Show stress on bridge
      ctx.fillStyle = `rgba(255, 0, 0, ${loadTest / 100})`;
      components.forEach(component => {
        if (component.type === 'beam') {
          ctx.fillRect(component.x, component.y, component.width, component.height);
        }
      });
    }

  }, [components, selectedComponent, isBuilding, loadTest, currentProject]);

  // Building simulation
  const simulateBuilding = () => {
    if (!isBuilding) return;

    setBuildingTime(prev => prev + 1);
    
    // Auto-connect components over time
    if (buildingTime % 60 === 0) {
      setComponents(prev => prev.map(comp => ({
        ...comp,
        connected: Math.random() > 0.3 || comp.connected
      })));
    }

    // Generate insights
    if (buildingTime > 0 && buildingTime % 120 === 0 && insights.length < 3) {
      const newInsights = [
        language === 'en' ? 'Strong designs use triangular structures for stability' : 
        language === 'hi' ? 'मजबूत डिज़ाइन स्थिरता के लिए त्रिकोणीय संरचनाओं का उपयोग करते हैं' : 
        'ଶକ୍ତିଶାଳୀ ଡିଜାଇନମାନେ ସ୍ଥିରତା ପାଇଁ ତ୍ରିକୋଣୀୟ ସଂରଚନା ବ୍ୟବହାର କରନ୍ତି',
        
        language === 'en' ? 'Proper connections are crucial for structural integrity' : 
        language === 'hi' ? 'संरचनात्मक अखंडता के लिए उचित कनेक्शन महत्वपूर्ण हैं' : 
        'ସଂରଚନାଗତ ଅଖଣ୍ଡତା ପାଇଁ ସଠିକ୍ ସଂଯୋଗ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ',
        
        language === 'en' ? 'Engineering requires balancing strength, cost, and materials' : 
        language === 'hi' ? 'इंजीनियरिंग में शक्ति, लागत और सामग्री को संतुलित करना आवश्यक है' : 
        'ଇଞ୍ଜିନିୟରିଂରେ ଶକ୍ତି, ଖର୍ଚ୍ଚ ଏବଂ ସାମଗ୍ରୀ ସନ୍ତୁଳନ ଆବଶ୍ୟକ'
      ];
      
      if (insights.length < newInsights.length) {
        setInsights(prev => [...prev, newInsights[prev.length]]);
      }
    }

    animationFrameRef.current = requestAnimationFrame(simulateBuilding);
  };

  // Animation control
  useEffect(() => {
    if (isBuilding && stage === 'play') {
      animationFrameRef.current = requestAnimationFrame(simulateBuilding);
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
  }, [isBuilding, stage, buildingTime]);

  // Stage progression
  const nextStage = () => {
    const stages: EngineeringStage[] = ['do', 'learn', 'play', 'earn', 'celebrate'];
    const currentIndex = stages.indexOf(stage);
    
    if (currentIndex < stages.length - 1) {
      const nextStageValue = stages[currentIndex + 1];
      setStage(nextStageValue);
      
      if (nextStageValue === 'play') {
        initializeProject();
      }
    }
  };

  const testDesign = () => {
    setLoadTest(75);
    setTimeout(() => {
      const connectedCount = components.filter(c => c.connected).length;
      const designStrength = (connectedCount / components.length) * 100;
      const points = Math.floor(designStrength * 2 + buildingTime);
      setScore(prev => prev + points);
      setCompletedProjects(prev => [...prev, currentProject]);
      setStage('celebrate');
      setLoadTest(0);
    }, 2000);
  };

  const continueToNext = () => {
    const projects: EngineeringProject[] = ['bridge', 'circuit', 'machine'];
    const currentIndex = projects.indexOf(currentProject);
    
    if (currentIndex < projects.length - 1) {
      setCurrentProject(projects[currentIndex + 1]);
      setStage('do');
      setBuildingTime(0);
      setInsights([]);
      setSelectedComponent(null);
    } else {
      finishLab();
    }
  };

  const finishLab = () => {
    const finalScore = Math.min(score, 1000);
    const xp = Math.floor(finalScore / 5);
    onComplete(finalScore, xp);
  };

  const resetProject = () => {
    setIsBuilding(false);
    setComponents([]);
    setBuildingTime(0);
    setInsights([]);
    setLoadTest(0);
    initializeProject();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 via-amber-900 to-yellow-900 p-4 relative overflow-hidden">
      {/* Workshop Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
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
              ⚙️ {getT('engineeringLab', language)}
            </h1>
            <p className="text-white/70 text-sm">{getT('subtitle', language)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
            ⭐ {score}
          </Badge>
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
            🔨 {completedProjects.length}/3
          </Badge>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* DO Stage - Choose Project */}
        {stage === 'do' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">{getT('chooseProject', language)}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['bridge', 'circuit', 'machine'].map((proj) => (
                <Card
                  key={proj}
                  className={`cursor-pointer transition-all duration-300 ${
                    currentProject === proj
                      ? 'bg-orange-500/20 border-orange-400 scale-105 ring-2 ring-orange-400'
                      : 'bg-white/10 border-white/20 hover:bg-white/15 hover:scale-102'
                  } ${completedProjects.includes(proj as EngineeringProject) ? 'ring-2 ring-green-400' : ''}`}
                  onClick={() => setCurrentProject(proj as EngineeringProject)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">
                      {proj === 'bridge' ? '🌉' : proj === 'circuit' ? '⚡' : '⚙️'}
                    </div>
                    <h3 className="text-white font-bold mb-2">{getT(proj, language)}</h3>
                    <p className="text-white/70 text-sm">{projectData[proj as EngineeringProject].description}</p>
                    {completedProjects.includes(proj as EngineeringProject) && (
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
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
            >
              <Hammer className="w-5 h-5 mr-2" />
              {getT('nextStage', language)}
            </Button>
          </motion.div>
        )}

        {/* LEARN Stage - Engineering Principles */}
        {stage === 'learn' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white text-center">{getT('learnPrinciples', language)}</h2>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                {currentProject === 'bridge' ? '🌉' : currentProject === 'circuit' ? '⚡' : '⚙️'}
                {projectData[currentProject].title}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-orange-500/20 rounded-lg p-4">
                  <h4 className="text-orange-300 font-bold mb-2">{getT('concept', language)}</h4>
                  <p className="text-white/90">{projectData[currentProject].concept}</p>
                </div>
                
                <div className="bg-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-300 font-bold mb-2">{getT('principle', language)}</h4>
                  <p className="text-white/90 font-mono text-lg">{projectData[currentProject].principle}</p>
                </div>
                
                <div className="bg-yellow-500/20 rounded-lg p-4">
                  <h4 className="text-yellow-300 font-bold mb-2">{getT('realWorld', language)}</h4>
                  <p className="text-white/90">{projectData[currentProject].realWorldExample}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={nextStage}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3"
              >
                <Wrench className="w-5 h-5 mr-2" />
                {getT('nextStage', language)}
              </Button>
            </div>
          </motion.div>
        )}

        {/* PLAY Stage - Build Design */}
        {stage === 'play' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white text-center">{getT('buildProject', language)}</h2>
            
            <div className="text-center space-y-4">
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  onClick={() => setIsBuilding(!isBuilding)}
                  className={`${
                    isBuilding
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isBuilding ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Building
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {getT('startBuilding', language)}
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={resetProject}
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {getT('reset', language)}
                </Button>
                
                {currentProject === 'bridge' && (
                  <Button
                    onClick={() => setLoadTest(prev => Math.min(prev + 25, 100))}
                    variant="outline"
                    className="bg-yellow-500/20 border-yellow-400 text-white hover:bg-yellow-500/30"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    {getT('testLoad', language)} ({loadTest}%)
                  </Button>
                )}
              </div>

              <div className="bg-black/20 rounded-lg p-4 mx-auto" style={{ width: 'fit-content' }}>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="border border-white/30 rounded-lg cursor-pointer"
                  onClick={(e) => {
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (rect) {
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      
                      // Find clicked component
                      const clickedComponent = components.find(comp =>
                        x >= comp.x && x <= comp.x + comp.width &&
                        y >= comp.y && y <= comp.y + comp.height
                      );
                      
                      if (clickedComponent) {
                        setSelectedComponent(clickedComponent.type);
                        setComponents(prev => prev.map(comp =>
                          comp.id === clickedComponent.id
                            ? { ...comp, connected: !comp.connected }
                            : comp
                        ));
                      }
                    }
                  }}
                />
              </div>

              <div className="text-center">
                <p className="text-white/70 mb-2">
                  {language === 'en' ? 'Building Time:' : language === 'hi' ? 'निर्माण समय:' : 'ନିର୍ମାଣ ସମୟ:'} {Math.floor(buildingTime / 60)}s
                </p>
                <p className="text-white/70 mb-4">
                  {language === 'en' ? 'Click components to connect them!' : 
                   language === 'hi' ? 'उन्हें कनेक्ट करने के लिए घटकों पर क्लिक करें!' : 
                   'ସେମାନଙ୍କୁ ସଂଯୋଗ କରିବା ପାଇଁ ଉପାଦାନମାନଙ୍କ ଉପରେ କ୍ଲିକ କରନ୍ତୁ!'}
                </p>
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

        {/* EARN Stage - Test Design */}
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
                    className="bg-orange-500/20 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div className="text-2xl">💡</div>
                    <p className="text-white/90">{insight}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <div className="mb-4">
                  <div className="text-sm text-white/70 mb-2">
                    {language === 'en' ? 'Design Completion:' : 
                     language === 'hi' ? 'डिज़ाइन पूर्णता:' : 
                     'ଡିଜାଇନ ସମାପ୍ତି:'} {Math.floor((components.filter(c => c.connected).length / components.length) * 100)}%
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-2">
                    +{Math.floor((components.filter(c => c.connected).length / components.length) * 200 + buildingTime)} Points
                  </div>
                </div>
                <p className="text-white/70 text-sm">
                  {language === 'en' ? 'Based on design completion and engineering insights' : 
                   language === 'hi' ? 'डिज़ाइन पूर्णता और इंजीनियरिंग अंतर्दृष्टि के आधार पर' : 
                   'ଡିଜାଇନ ସମାପ୍ତି ଏବଂ ଇଞ୍ଜିନିୟରିଂ ଅନ୍ତର୍ଦୃଷ୍ଟି ଆଧାରରେ'}
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={testDesign}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3"
                disabled={loadTest > 0}
              >
                <Zap className="w-5 h-5 mr-2" />
                {getT('testDesign', language)}
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
              className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400 rounded-lg p-8"
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
                {language === 'en' ? `You've mastered ${projectData[currentProject].title}!` : 
                 language === 'hi' ? `आपने ${projectData[currentProject].title} में महारत हासिल की!` : 
                 `ଆପଣ ${projectData[currentProject].title} ରେ ଦକ୍ଷତା ହାସଲ କରିଛନ୍ତି!`}
              </p>
              
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">+{Math.floor((components.filter(c => c.connected).length / components.length) * 200 + buildingTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-orange-400" />
                  <span className="text-xl font-bold text-orange-400">+{Math.floor((Math.floor((components.filter(c => c.connected).length / components.length) * 200 + buildingTime)) / 10)} XP</span>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center gap-4">
              {completedProjects.length < 3 ? (
                <Button
                  onClick={continueToNext}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
                >
                  <Hammer className="w-5 h-5 mr-2" />
                  {getT('continueProject', language)}
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