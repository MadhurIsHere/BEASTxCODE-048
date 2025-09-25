import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface BiodomeHadCultivatorGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function BiodomeHadCultivatorGame(props: BiodomeHadCultivatorGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Biodome Cultivator"
      gameDescription="Manage greenhouse dome using biogeochemical cycles"
      gameType="Ecosystem Management"
      concept="Natural Resources"
    />
  );
}