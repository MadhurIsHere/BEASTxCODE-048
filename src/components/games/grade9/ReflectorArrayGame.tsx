import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface ReflectorArrayGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function ReflectorArrayGame(props: ReflectorArrayGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Reflector Array"
      gameDescription="Direct light beams through mirrors using angle properties"
      gameType="Optical Puzzle"
      concept="Lines and Angles"
    />
  );
}