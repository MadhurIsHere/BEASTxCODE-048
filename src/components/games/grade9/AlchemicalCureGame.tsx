import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface AlchemicalCureGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function AlchemicalCureGame(props: AlchemicalCureGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Alchemical Cure"
      gameDescription="Brew alchemical potions to neutralize micro-bot pathogens"
      gameType="Strategy Game"
      concept="Why Do We Fall Ill?"
    />
  );
}