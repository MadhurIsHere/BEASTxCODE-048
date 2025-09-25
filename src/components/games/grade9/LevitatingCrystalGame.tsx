import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface LevitatingCrystalGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function LevitatingCrystalGame(props: LevitatingCrystalGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Levitating Crystal"
      gameDescription="Counteract gravity using steampunk magnets and propellers"
      gameType="Physics Experiment"
      concept="Gravitation"
    />
  );
}