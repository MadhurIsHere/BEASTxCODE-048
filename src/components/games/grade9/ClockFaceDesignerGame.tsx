import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface ClockFaceDesignerGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function ClockFaceDesignerGame(props: ClockFaceDesignerGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Clock Face Designer"
      gameDescription="Design moving clock faces using quadrilateral properties"
      gameType="Design Challenge"
      concept="Quadrilaterals"
    />
  );
}