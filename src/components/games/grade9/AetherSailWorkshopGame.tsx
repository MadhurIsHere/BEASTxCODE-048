import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface AetherSailWorkshopGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function AetherSailWorkshopGame(props: AetherSailWorkshopGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Aether-Sail Workshop"
      gameDescription="Design efficient airship sails using area formulas"
      gameType="Design Optimization"
      concept="Areas of Parallelograms & Triangles"
    />
  );
}