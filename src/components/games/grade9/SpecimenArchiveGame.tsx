import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface SpecimenArchiveGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function SpecimenArchiveGame(props: SpecimenArchiveGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Specimen Archive"
      gameDescription="Classify mechanical and organic creatures in Victorian archive"
      gameType="Classification Game"
      concept="Diversity in Living Organisms"
    />
  );
}