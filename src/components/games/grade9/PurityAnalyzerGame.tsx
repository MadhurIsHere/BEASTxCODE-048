import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface PurityAnalyzerGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function PurityAnalyzerGame(props: PurityAnalyzerGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Purity Analyzer"
      gameDescription="Identify and separate pure substances from mixtures"
      gameType="Analysis Challenge"
      concept="Is Matter Around Us Pure?"
    />
  );
}