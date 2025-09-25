import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Zap, Play, Pause, RotateCcw, Star, Trophy, Sparkles, Crown, Rocket, Target, Users } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import type { Language } from '../../../types/onboarding';

interface PhysicsLabGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

type PhysicsExperiment = 'gravity' | 'motion' | 'forces';
type PhysicsStage = 'do' | 'learn' | 'play' | 'earn' | 'celebrate';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  color: string;
  trail: { x: number; y: number }[];
}

interface ExperimentData {
  title: string;
  description: string;
  concept: string;
  formula: string;
  realWorldExample: string;
}

export function PhysicsLabGame({ language, onBack, onComplete }: PhysicsLabGameProps) {
  const [currentExperiment, setCurrentExperiment] = useState<PhysicsExperiment>('gravity');
  const [stage, setStage] = useState<PhysicsStage>('do');
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [completedExperiments, setCompletedExperiments] = useState<PhysicsExperiment[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showTrails, setShowTrails] = useState(true);
  const [experimentTime, setExperimentTime] = useState(0);
  const [insights, setInsights] = useState<string[]>([]);
  const animationFrameRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<number>(0);

  const getT = (key: string, lang: Language): string => {
    const translations = {
      physicsLab: {
        en: 'Physics Space Lab',
        hi: 'भौतिकी स्पेस लैब',
        or: 'ଭୌତିକ ସ୍ପେସ ଲାବ'
      },
      subtitle: {
        en: 'Explore the universe through physics!',
        hi: 'भौतिकी के माध्यम से ब्रह्मांड का अन्वेषण करें!',
        or: 'ଭୌତିକ ମାଧ୍ୟମରେ ବ୍ରହ୍ମାଣ୍ଡ ଅନ୍ୱେଷଣ କରନ୍ତୁ!'
      },
      // Do Stage
      chooseExperiment: {
        en: '🚀 Choose Your Space Mission',
        hi: '🚀 अपना स्पेस मिशन चुनें',
        or: '🚀 ଆପଣଙ୍କର ସ୍ପେସ ମିଶନ ବାଛନ୍ତୁ'
      },
      gravity: {
        en: 'Gravity & Orbits',
        hi: 'गुरुत्वाकर्षण और कक्षाएं',
        or: 'ମାଧ୍ୟାକର୍ଷଣ ଏବଂ କକ୍ଷପଥ'
      },
      motion: {
        en: 'Planetary Motion',
        hi: 'ग्रहों की गति',
        or: 'ଗ୍ରହ ଗତି'
      },
      forces: {
        en: 'Cosmic Forces',
        hi: 'ब्रह्मांडीय बल',
        or: 'ବ୍ରହ୍ମାଣ୍ଡିକ ବଳ'
      },
      // Learn Stage
      learnConcept: {
        en: '📚 Learn the Science',
        hi: '📚 विज्ञान सीखें',
        or: '📚 ବିଜ୍ଞାନ ଶିଖନ୍ତୁ'
      },
      concept: {
        en: 'Concept:',
        hi: 'अवधारणा:',
        or: 'ଧାରଣା:'
      },
      formula: {
        en: 'Formula:',
        hi: 'सूत्र:',
        or: 'ସୂତ୍ର:'
      },
      realWorld: {
        en: 'Real World:',
        hi: 'वास्तविक दुनिया:',
        or: 'ବାସ୍ତବ ଜଗତ:'
      },
      // Play Stage
      runExperiment: {
        en: '🔬 Run Experiment',
        hi: '🔬 प्रयोग चलाएं',
        or: '🔬 ପରୀକ୍ଷଣ ଚଲାନ୍ତୁ'
      },
      startSimulation: {
        en: 'Start Simulation',
        hi: 'सिमुलेशन शुरू करें',
        or: 'ସିମୁଲେସନ ଆରମ୍ଭ କରନ୍ତୁ'
      },
      pause: {
        en: 'Pause',
        hi: 'रोकें',
        or: 'ବିରାମ'
      },
      reset: {
        en: 'Reset',
        hi: 'रीसेट',
        or: 'ରିସେଟ'
      },
      toggleTrails: {
        en: 'Toggle Trails',
        hi: 'ट्रेल्स टॉगल करें',
        or: 'ଟ୍ରେଲ ଟୋଗଲ କରନ୍ତୁ'
      },
      // Earn Stage
      earnPoints: {
        en: '🎯 Earn Your Points',
        hi: '🎯 अपने अंक अर्जित करें',
        or: '🎯 ଆପଣଙ୍କର ପଏଣ୍ଟ ଅର୍ଜନ କରନ୍ତୁ'
      },
      completeExperiment: {
        en: 'Complete Experiment',
        hi: 'प्रयोग पूरा करें',
        or: 'ପରୀକ୍ଷଣ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ'
      },
      insights: {
        en: 'Your Insights:',
        hi: 'आपकी अंतर्दृष्टि:',
        or: 'ଆପଣଙ୍କର ଅନ୍ତର୍ଦୃଷ୍ଟି:'
      },
      // Celebrate Stage
      celebrate: {
        en: '🎉 Amazing Discovery!',
        hi: '🎉 अद्भुत खोज!',
        or: '🎉 ଅଦ୍ଭୁତ ଆବିଷ୍କାର!'
      },
      // Navigation
      nextStage: {
        en: 'Next →',
        hi: 'अगला →',
        or: 'ପରବର୍ତ୍ତୀ →'
      },
      continueExperiment: {
        en: 'Continue to Next Mission',
        hi: 'अगले मिशन पर जारी रखें',
        or: 'ପରବର୍ତ୍ତୀ ମିଶନକୁ ଜାରି ରଖନ୍ତୁ'
      },
      finishLab: {
        en: 'Complete Physics Lab',
        hi: 'भौतिकी लैब पूरा करें',
        or: 'ଭୌତିକ ଲାବ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ'
      },
      back: {
        en: 'Back',
        hi: 'वापस',
        or: 'ପଛକୁ'
      }
    };
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  const experimentData: Record<PhysicsExperiment, ExperimentData> = {
    gravity: {
      title: language === 'en' ? 'Gravity & Orbits' : language === 'hi' ? 'गुरुत्वाकर्षण और कक्षाएं' : 'ମାଧ୍ୟାକର୍ଷଣ ଏବଂ କକ୍ଷପଥ',
      description: language === 'en' ? 'Discover how gravity creates orbital motion in space' : language === 'hi' ? 'जानें कि गुरुत्वाकर्षण अंतरिक्ष में कक्षीय गति कैसे बनाता है' : 'ଦେଖନ୍ତୁ ମାଧ୍ୟାକର୍ଷଣ କିପରି ସ୍ପେସରେ କକ୍ଷପଥ ଗତି ସୃଷ୍ଟି କରେ',
      concept: language === 'en' ? 'Every object with mass attracts every other object. This invisible force keeps planets in orbit around stars.' : language === 'hi' ? 'द्रव्यमान वाला हर वस्तु हर दूसरे वस्तु को आकर्षित करता है। यह अदृश्य बल ग्रहों को तारों के चारों ओर कक्षा में रखता है।' : 'ଭରସହ ଥିବା ପ୍ରତ୍ୟେକ ବସ୍ତୁ ଅନ୍ୟ ସମସ୍ତ ବସ୍ତୁକୁ ଆକର୍ଷଣ କରେ।',
      formula: 'F = G(m₁m₂)/r²',
      realWorldExample: language === 'en' ? 'Earth orbits the Sun, Moon orbits Earth, satellites orbit Earth' : language === 'hi' ? 'पृथ्वी सूर्य की परिक्रमा करती है, चंद्रमा पृथ्वी की, उपग्रह पृथ्वी की' : 'ପୃଥିବୀ ସୂର୍ଯ୍ୟ ଚାରିପଟେ ଘୁରେ, ଚନ୍ଦ୍ର ପୃଥିବୀ ଚାରିପଟେ ଘୁରେ'
    },
    motion: {
      title: language === 'en' ? 'Planetary Motion' : language === 'hi' ? 'ग्रहों की गति' : 'ଗ୍ରହ ଗତି',
      description: language === 'en' ? 'Explore how objects move through space with different velocities' : language === 'hi' ? 'जानें कि वस्तुएं अलग-अलग वेगों के साथ अंतरिक्ष में कैसे चलती हैं' : 'ଦେଖନ୍ତୁ ବିଭିନ୍ନ ବେଗରେ ବସ୍ତୁମାନେ ସ୍ପେସରେ କିପରି ଗତି କରନ୍ତି',
      concept: language === 'en' ? 'Objects in motion stay in motion unless acted upon by an external force. In space, this creates beautiful curved trajectories.' : language === 'hi' ? 'गति में वस्तुएं तब तक गति में रहती हैं जब तक कोई बाहरी बल उन पर न लगे। अंतरिक्ष में यह सुंदर वक्रीय पथ बनाता है।' : 'ଗତିରେ ଥିବା ବସ୍ତୁମାନେ ଗତିରେ ରହନ୍ତି ଯଦି କୌଣସି ବାହ୍ୟ ବଳ ନ ଲାଗେ।',
      formula: 'v = s/t, a = v/t',
      realWorldExample: language === 'en' ? 'Comets traveling through solar system, spacecraft trajectories' : language === 'hi' ? 'सौर मंडल में यात्रा करने वाले धूमकेतु, अंतरिक्ष यान के पथ' : 'ସୌର ମଣ୍ଡଳ ଦେଇ ଯାଉଥିବା ଧୂମକେତୁ, ସ୍ପେସକ୍ରାଫ୍ଟ ପଥ'
    },
    forces: {
      title: language === 'en' ? 'Cosmic Forces' : language === 'hi' ? 'ब्रह्मांडीय बल' : 'ବ୍ରହ୍ମାଣ୍ଡିକ ବଳ',
      description: language === 'en' ? 'See how multiple forces interact in complex cosmic systems' : language === 'hi' ? 'देखें कि जटिल ब्रह्मांडीय प्रणालियों में कई बल कैसे बातचीत करते हैं' : 'ଦେଖନ୍ତୁ ଜଟିଳ ବ୍ରହ୍ମାଣ୍ଡିକ ପ୍ରଣାଳୀରେ ଏକାଧିକ ବଳ କିପରି ପରସ୍ପର କ୍ରିୟା କରନ୍ତି',
      concept: language === 'en' ? 'When multiple forces act on objects, they create complex but predictable interactions. This is how star systems and galaxies form.' : language === 'hi' ? 'जब कई बल वस्तुओं पर कार्य करते हैं, तो वे जटिल लेकिन अनुमानित बातचीत बनाते हैं।' : 'ଯେତେବେଳେ ଏକାଧିକ ବଳ ବସ୍ତୁମାନଙ୍କ ଉପରେ କାର୍ଯ୍ୟ କରେ, ସେମାନେ ଜଟିଳ କିନ୍ତୁ ପୂର୍ବାନୁମାନଯୋଗ୍ୟ ପାରସ୍ପରିକ କ୍ରିୟା ସୃଷ୍ଟି କରନ୍ତି।',
      formula: 'ΣF = ma, F₁ + F₂ + F₃... = F_net',
      realWorldExample: language === 'en' ? 'Galaxy clusters, binary star systems, asteroid belts' : language === 'hi' ? 'गैलेक्सी समूह, द्विआधारी तारा प्रणाली, क्षुद्रग्रह बेल्ट' : 'ଗ୍ୟାଲାକ୍ସି କ୍ଲଷ୍ଟର, ବାଇନାରୀ ଷ୍ଟାର ସିଷ୍ଟମ, ଆଷ୍ଟେରଏଡ ବେଲ୍ଟ'
    }
  };

  // Initialize particles for experiments
  const initializeExperiment = () => {
    let newParticles: Particle[] = [];
    
    switch (currentExperiment) {
      case 'gravity':
        newParticles = [
          {
            id: 1,
            x: 200,
            y: 200,
            vx: 0,
            vy: 0,
            mass: 80,
            color: '#FFD700',
            trail: []
          },
          {
            id: 2,
            x: 320,
            y: 200,
            vx: 0,
            vy: 3,
            mass: 12,
            color: '#3B82F6',
            trail: []
          },
          {
            id: 3,
            x: 280,
            y: 200,
            vx: 0,
            vy: 4.5,
            mass: 3,
            color: '#EF4444',
            trail: []
          }
        ];
        break;
      case 'motion':
        newParticles = [
          {
            id: 1,
            x: 50,
            y: 150,
            vx: 4,
            vy: 2,
            mass: 15,
            color: '#EF4444',
            trail: []
          },
          {
            id: 2,
            x: 350,
            y: 250,
            vx: -3,
            vy: -1,
            mass: 20,
            color: '#10B981',
            trail: []
          },
          {
            id: 3,
            x: 200,
            y: 50,
            vx: 1,
            vy: 3,
            mass: 10,
            color: '#8B5CF6',
            trail: []
          }
        ];
        break;
      case 'forces':
        newParticles = [];
        for (let i = 0; i < 6; i++) {
          newParticles.push({
            id: i + 1,
            x: Math.random() * 300 + 50,
            y: Math.random() * 300 + 50,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            mass: Math.random() * 15 + 8,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            trail: []
          });
        }
        break;
    }
    
    setParticles(newParticles);
  };

  // Physics simulation
  const animate = () => {
    if (!isRunning) return;

    setParticles(prevParticles => {
      const newParticles = prevParticles.map(particle => ({ 
        ...particle, 
        trail: showTrails ? [...particle.trail.slice(-20), { x: particle.x, y: particle.y }] : []
      }));

      // Apply physics based on experiment type
      if (currentExperiment === 'gravity') {
        // Enhanced gravitational simulation
        for (let i = 0; i < newParticles.length; i++) {
          for (let j = i + 1; j < newParticles.length; j++) {
            const p1 = newParticles[i];
            const p2 = newParticles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 5) {
              const G = 1.2;
              const force = G * p1.mass * p2.mass / (distance * distance);
              const fx = force * dx / distance;
              const fy = force * dy / distance;
              
              p1.vx += fx / p1.mass;
              p1.vy += fy / p1.mass;
              p2.vx -= fx / p2.mass;
              p2.vy -= fy / p2.mass;
            }
          }
        }
      } else if (currentExperiment === 'motion') {
        // Enhanced motion with elastic collisions
        newParticles.forEach((particle, i) => {
          if (particle.x <= 15 || particle.x >= 385) {
            particle.vx *= -0.9;
            particle.x = Math.max(15, Math.min(385, particle.x));
          }
          if (particle.y <= 15 || particle.y >= 385) {
            particle.vy *= -0.9;
            particle.y = Math.max(15, Math.min(385, particle.y));
          }
          
          // Particle-particle collisions
          for (let j = i + 1; j < newParticles.length; j++) {
            const other = newParticles[j];
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = Math.sqrt(particle.mass) + Math.sqrt(other.mass);
            
            if (distance < minDistance) {
              const angle = Math.atan2(dy, dx);
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);
              
              // Elastic collision
              const v1 = particle.vx * cos + particle.vy * sin;
              const v2 = other.vx * cos + other.vy * sin;
              
              const newV1 = ((particle.mass - other.mass) * v1 + 2 * other.mass * v2) / (particle.mass + other.mass);
              const newV2 = ((other.mass - particle.mass) * v2 + 2 * particle.mass * v1) / (particle.mass + other.mass);
              
              particle.vx = newV1 * cos - (particle.vy * sin - particle.vy * sin) * sin;
              particle.vy = newV1 * sin + (particle.vy * cos - particle.vy * cos) * cos;
              other.vx = newV2 * cos - (other.vy * sin - other.vy * sin) * sin;
              other.vy = newV2 * sin + (other.vy * cos - other.vy * cos) * cos;
            }
          }
        });
      } else if (currentExperiment === 'forces') {
        // Complex multi-body interactions
        for (let i = 0; i < newParticles.length; i++) {
          for (let j = i + 1; j < newParticles.length; j++) {
            const p1 = newParticles[i];
            const p2 = newParticles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
              // Gravitational attraction
              const G = 0.3;
              const gravityForce = G * p1.mass * p2.mass / (distance * distance + 100);
              const gravityFx = gravityForce * dx / distance;
              const gravityFy = gravityForce * dy / distance;
              
              p1.vx += gravityFx / p1.mass;
              p1.vy += gravityFy / p1.mass;
              p2.vx -= gravityFx / p2.mass;
              p2.vy -= gravityFy / p2.mass;
              
              // Repulsive force at close range
              if (distance < 40) {
                const repulsionForce = 50 / (distance + 1);
                const repulsionFx = repulsionForce * dx / distance;
                const repulsionFy = repulsionForce * dy / distance;
                
                p1.vx -= repulsionFx / p1.mass;
                p1.vy -= repulsionFy / p1.mass;
                p2.vx += repulsionFx / p2.mass;
                p2.vy += repulsionFy / p2.mass;
              }
            }
          }
        }
        
        // Boundary effects
        newParticles.forEach(particle => {
          if (particle.x <= 20 || particle.x >= 380) particle.vx *= -0.8;
          if (particle.y <= 20 || particle.y >= 380) particle.vy *= -0.8;
        });
      }

      // Update positions
      newParticles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Keep particles in bounds
        particle.x = Math.max(10, Math.min(390, particle.x));
        particle.y = Math.max(10, Math.min(390, particle.y));
        
        // Velocity damping to prevent runaway speeds
        const maxSpeed = 8;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx *= maxSpeed / speed;
          particle.vy *= maxSpeed / speed;
        }
      });

      return newParticles;
    });

    setExperimentTime(prev => prev + 1);
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Enhanced canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with space background
    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 300);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Draw animated stars
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 80; i++) {
      const x = (i * 47) % 400;
      const y = (i * 31) % 400;
      const brightness = 0.3 + 0.7 * Math.sin((timeRef.current + i) * 0.02);
      ctx.globalAlpha = brightness;
      ctx.beginPath();
      ctx.arc(x, y, 0.5 + Math.sin((timeRef.current + i) * 0.03) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Draw particle trails
    if (showTrails) {
      particles.forEach(particle => {
        if (particle.trail.length > 1) {
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          for (let i = 0; i < particle.trail.length; i++) {
            const point = particle.trail[i];
            const alpha = i / particle.trail.length;
            ctx.globalAlpha = alpha * 0.6;
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    }

    // Draw particles with enhanced effects
    particles.forEach(particle => {
      const radius = Math.sqrt(particle.mass) + 2;
      
      // Outer glow
      const glowGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, radius * 2);
      glowGradient.addColorStop(0, particle.color);
      glowGradient.addColorStop(0.3, particle.color + '80');
      glowGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Main particle
      const particleGradient = ctx.createRadialGradient(
        particle.x - radius * 0.3, particle.y - radius * 0.3, 0,
        particle.x, particle.y, radius
      );
      particleGradient.addColorStop(0, '#FFFFFF');
      particleGradient.addColorStop(0.3, particle.color);
      particleGradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = particleGradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Velocity indicator
      if (currentExperiment === 'motion') {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x + particle.vx * 5, particle.y + particle.vy * 5);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    timeRef.current += 1;
  }, [particles, showTrails, currentExperiment]);

  // Animation control
  useEffect(() => {
    if (isRunning && stage === 'play') {
      animationFrameRef.current = requestAnimationFrame(animate);
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
  }, [isRunning, stage, currentExperiment]);

  // Generate insights based on experiment time
  useEffect(() => {
    if (experimentTime > 0 && experimentTime % 100 === 0 && insights.length < 3) {
      const newInsights = [
        language === 'en' ? 'Objects follow predictable paths based on physics laws' : 
        language === 'hi' ? 'वस्तुएं भौतिकी के नियमों के आधार पर अनुमानित पथों का पालन करती हैं' : 
        'ବସ୍ତୁମାନେ ଭୌତିକ ନିୟମ ଆଧାରରେ ପୂର୍ବାନୁମାନଯୋଗ୍ୟ ପଥ ଅନୁସରଣ କରନ୍ତି',
        
        language === 'en' ? 'Forces create beautiful patterns in space' : 
        language === 'hi' ? 'बल अंतरिक्ष में सुंदर पैटर्न बनाते हैं' : 
        'ବଳମାନେ ସ୍ପେସରେ ସୁନ୍ଦର ପ୍ୟାଟର୍ନ ସୃଷ୍ଟି କରନ୍ତି',
        
        language === 'en' ? 'Mass and distance determine gravitational effects' : 
        language === 'hi' ? 'द्रव्यमान और दूरी गुरुत्वाकर्षण प्रभावों को निर्धारित करते हैं' : 
        'ଭର ଏବଂ ଦୂରତା ମାଧ୍ୟାକର୍ଷଣ ପ୍ରଭାବ ନିର୍ଣ୍ଣୟ କରେ'
      ];
      
      if (insights.length < newInsights.length) {
        setInsights(prev => [...prev, newInsights[prev.length]]);
      }
    }
  }, [experimentTime, insights.length, language]);

  // Stage progression
  const nextStage = () => {
    const stages: PhysicsStage[] = ['do', 'learn', 'play', 'earn', 'celebrate'];
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
    setIsRunning(false);
    const points = 150 + Math.min(experimentTime, 200);
    setScore(prev => prev + points);
    setCompletedExperiments(prev => [...prev, currentExperiment]);
    setStage('celebrate');
  };

  const continueToNext = () => {
    const experiments: PhysicsExperiment[] = ['gravity', 'motion', 'forces'];
    const currentIndex = experiments.indexOf(currentExperiment);
    
    if (currentIndex < experiments.length - 1) {
      setCurrentExperiment(experiments[currentIndex + 1]);
      setStage('do');
      setExperimentTime(0);
      setInsights([]);
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
    setIsRunning(false);
    setParticles([]);
    setExperimentTime(0);
    setInsights([]);
    initializeExperiment();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-800 p-4 relative overflow-hidden">
      {/* Enhanced Space Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(120)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Nebula effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
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
              ⚡ {getT('physicsLab', language)}
            </h1>
            <p className="text-white/70 text-sm">{getT('subtitle', language)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
            ⭐ {score}
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            🚀 {completedExperiments.length}/3
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
              {['gravity', 'motion', 'forces'].map((exp) => (
                <Card
                  key={exp}
                  className={`cursor-pointer transition-all duration-300 ${
                    currentExperiment === exp
                      ? 'bg-blue-500/20 border-blue-400 scale-105 ring-2 ring-blue-400'
                      : 'bg-white/10 border-white/20 hover:bg-white/15 hover:scale-102'
                  } ${completedExperiments.includes(exp as PhysicsExperiment) ? 'ring-2 ring-green-400' : ''}`}
                  onClick={() => setCurrentExperiment(exp as PhysicsExperiment)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">
                      {exp === 'gravity' ? '🌍' : exp === 'motion' ? '🚀' : '⭐'}
                    </div>
                    <h3 className="text-white font-bold mb-2">{getT(exp, language)}</h3>
                    <p className="text-white/70 text-sm">{experimentData[exp as PhysicsExperiment].description}</p>
                    {completedExperiments.includes(exp as PhysicsExperiment) && (
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
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              {getT('nextStage', language)}
            </Button>
          </motion.div>
        )}

        {/* LEARN Stage - Concept Explanation */}
        {stage === 'learn' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white text-center">{getT('learnConcept', language)}</h2>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                {currentExperiment === 'gravity' ? '🌍' : currentExperiment === 'motion' ? '🚀' : '⭐'}
                {experimentData[currentExperiment].title}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-300 font-bold mb-2">{getT('concept', language)}</h4>
                  <p className="text-white/90">{experimentData[currentExperiment].concept}</p>
                </div>
                
                <div className="bg-purple-500/20 rounded-lg p-4">
                  <h4 className="text-purple-300 font-bold mb-2">{getT('formula', language)}</h4>
                  <p className="text-white/90 font-mono text-lg">{experimentData[currentExperiment].formula}</p>
                </div>
                
                <div className="bg-green-500/20 rounded-lg p-4">
                  <h4 className="text-green-300 font-bold mb-2">{getT('realWorld', language)}</h4>
                  <p className="text-white/90">{experimentData[currentExperiment].realWorldExample}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={nextStage}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3"
              >
                <Play className="w-5 h-5 mr-2" />
                {getT('nextStage', language)}
              </Button>
            </div>
          </motion.div>
        )}

        {/* PLAY Stage - Interactive Simulation */}
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
                  onClick={() => setIsRunning(!isRunning)}
                  className={`${
                    isRunning
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      {getT('pause', language)}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {getT('startSimulation', language)}
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
                
                <Button
                  onClick={() => setShowTrails(!showTrails)}
                  variant="outline"
                  className={`${showTrails ? 'bg-blue-500/20 border-blue-400' : 'bg-white/10 border-white/30'} text-white hover:bg-white/20`}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {getT('toggleTrails', language)}
                </Button>
              </div>

              <div className="bg-black/50 rounded-lg p-4 mx-auto" style={{ width: 'fit-content' }}>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="border border-white/30 rounded-lg"
                />
              </div>

              <div className="text-center">
                <p className="text-white/70 mb-2">
                  {language === 'en' ? 'Experiment Time:' : language === 'hi' ? 'प्रयोग समय:' : 'ପରୀକ୍ଷଣ ସମୟ:'} {Math.floor(experimentTime / 60)}s
                </p>
                <Button
                  onClick={nextStage}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3"
                >
                  <Target className="w-5 h-5 mr-2" />
                  {getT('nextStage', language)}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* EARN Stage - Collect Insights */}
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
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  +{150 + Math.min(experimentTime, 200)} Points
                </div>
                <p className="text-white/70 text-sm">
                  {language === 'en' ? 'Based on experiment completion and insights discovered' : 
                   language === 'hi' ? 'प्रयोग पूर्णता और खोजी गई अंतर्दृष्टि के आधार पर' : 
                   'ପରୀକ୍ଷଣ ସମାପ୍ତି ଏବଂ ଆବିଷ୍କୃତ ଅନ୍ତର୍ଦୃଷ୍ଟି ଆଧାରରେ'}
                </p>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={completeExperiment}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
              >
                <Trophy className="w-5 h-5 mr-2" />
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
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400 rounded-lg p-8"
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
                  <span className="text-2xl font-bold text-yellow-400">+{150 + Math.min(experimentTime, 200)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <span className="text-xl font-bold text-blue-400">+{Math.floor((150 + Math.min(experimentTime, 200)) / 10)} XP</span>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center gap-4">
              {completedExperiments.length < 3 ? (
                <Button
                  onClick={continueToNext}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3"
                >
                  <Rocket className="w-5 h-5 mr-2" />
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