import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface AetherDistillerGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function AetherDistillerGame(props: AetherDistillerGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Aether Distiller"
      gameDescription="Separate mixtures using multi-stage distillation apparatus"
      gameType="Lab Simulation"
      concept="Matter in Our Surroundings"
    />
  );
}