import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface TrussBridgeBuilderGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function TrussBridgeBuilderGame(props: TrussBridgeBuilderGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Truss Bridge Builder"
      gameDescription="Build stable bridge trusses using triangle congruence principles"
      gameType="Physics Construction"
      concept="Triangles & Congruence"
    />
  );
}