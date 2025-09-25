import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface SubatomicWorkshopGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function SubatomicWorkshopGame(props: SubatomicWorkshopGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Subatomic Workshop"
      gameDescription="Assemble atoms using protons, neutrons, and electrons"
      gameType="Precision Assembly"
      concept="Structure of the Atom"
    />
  );
}