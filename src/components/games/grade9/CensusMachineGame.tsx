import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface CensusMachineGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function CensusMachineGame(props: CensusMachineGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The City's Census Automaton"
      gameDescription="Analyze city production data to identify inefficiencies"
      gameType="Data Analysis"
      concept="Statistics"
    />
  );
}