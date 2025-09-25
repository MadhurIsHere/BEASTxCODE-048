import React from 'react';
import { GamePlaceholder } from './GamePlaceholder';
import type { Language } from '../../../types/onboarding';

interface AlchemicalVatDesignerGameProps {
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function AlchemicalVatDesignerGame(props: AlchemicalVatDesignerGameProps) {
  return (
    <GamePlaceholder
      {...props}
      gameName="The Alchemical Vat Designer"
      gameDescription="Design storage vats calculating surface area and volume"
      gameType="3D Design Challenge"
      concept="Surface Areas & Volumes"
    />
  );
}