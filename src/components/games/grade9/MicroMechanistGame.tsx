import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface MicroMechanistGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function MicroMechanistGame(props: MicroMechanistGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Micro-Mechanist"
      gameDescription="Pilot submersible through biological clockwork mechanisms"
      gameType="Microscopic Exploration"
      concept="Fundamental Unit of Life"
    />
  );
}