import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface MasterDraftsmanGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function MasterDraftsmanGame(props: MasterDraftsmanGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Master Draftsman"
      gameDescription="Draw complex patterns using steampunk drafting tools"
      gameType="Precision Drawing"
      concept="Constructions"
    />
  );
}