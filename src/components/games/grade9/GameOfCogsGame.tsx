import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface GameOfCogsGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function GameOfCogsGame(props: GameOfCogsGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Game of Cogs"
      gameDescription="Strategic board game using probability calculations"
      gameType="Strategy Board Game"
      concept="Probability"
    />
  );
}