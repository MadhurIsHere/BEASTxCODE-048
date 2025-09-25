import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface LivingGearAssemblyGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function LivingGearAssemblyGame(props: LivingGearAssemblyGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Living Gear Assembly"
      gameDescription="Assemble cell-gears into functional tissue mechanisms"
      gameType="Assembly Challenge"
      concept="Tissues"
    />
  );
}