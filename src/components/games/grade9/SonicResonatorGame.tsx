import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface SonicResonatorGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function SonicResonatorGame(props: SonicResonatorGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Sonic Resonator"
      gameDescription="Power machines using sound wave resonance"
      gameType="Wave Puzzle"
      concept="Work, Energy & Sound"
    />
  );
}