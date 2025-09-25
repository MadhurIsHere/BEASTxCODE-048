import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface GrandOrreryCalibrationGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function GrandOrreryCalibrationGame(props: GrandOrreryCalibrationGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Grand Orrery Calibration"
      gameDescription="Align planetary gears using circle properties"
      gameType="Precision Puzzle"
      concept="Circles"
    />
  );
}