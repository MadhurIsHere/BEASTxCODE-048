import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface AutomatonArmorGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function AutomatonArmorGame(props: AutomatonArmorGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Automaton's Armor"
      gameDescription="Design custom armor plates using Heron's formula"
      gameType="3D Design"
      concept="Heron's Formula"
    />
  );
}