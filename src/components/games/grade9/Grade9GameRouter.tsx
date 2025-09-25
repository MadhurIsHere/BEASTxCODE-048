import React from 'react';
import { RationalCogwheelGame } from './RationalCogwheelGame';
import { GearTrainConstructorGame } from './GearTrainConstructorGame';
import { AutomatonPathfindingGame } from './AutomatonPathfindingGame';
import { PressureValveCalibrationGame } from './PressureValveCalibrationGame';
import { LogicLockboxGame } from './LogicLockboxGame';
import { ReflectorArrayGame } from './ReflectorArrayGame';
import { TrussBridgeBuilderGame } from './TrussBridgeBuilderGame';
import { ClockFaceDesignerGame } from './ClockFaceDesignerGame';
import { AetherSailWorkshopGame } from './AetherSailWorkshopGame';
import { GrandOrreryCalibrationGame } from './GrandOrreryCalibrationGame';
import { MasterDraftsmanGame } from './MasterDraftsmanGame';
import { AutomatonArmorGame } from './AutomatonArmorGame';
import { AlchemicalVatDesignerGame } from './AlchemicalVatDesignerGame';
import { CensusMachineGame } from './CensusMachineGame';
import { GameOfCogsGame } from './GameOfCogsGame';

// Science Games
import { AutomatonGrandPrixGame } from './AutomatonGrandPrixGame';
import { LevitatingCrystalGame } from './LevitatingCrystalGame';
import { SonicResonatorGame } from './SonicResonatorGame';
import { AetherDistillerGame } from './AetherDistillerGame';
import { PurityAnalyzerGame } from './PurityAnalyzerGame';
import { AtomicForgeGame } from './AtomicForgeGame';
import { SubatomicWorkshopGame } from './SubatomicWorkshopGame';
import { MicroMechanistGame } from './MicroMechanistGame';
import { LivingGearAssemblyGame } from './LivingGearAssemblyGame';
import { SpecimenArchiveGame } from './SpecimenArchiveGame';
import { AlchemicalCureGame } from './AlchemicalCureGame';
import { BiodomeHadCultivatorGame } from './BiodomeHadCultivatorGame';

import type { Language } from '../../../types/onboarding';

interface Grade9GameRouterProps {
  gameId: string;
  language: Language;
  onBack: () => void;
  onComplete: (score: number, xp: number) => void;
}

export function Grade9GameRouter({ gameId, language, onBack, onComplete }: Grade9GameRouterProps) {
  const commonProps = { language, onBack, onComplete };

  // Mathematics Games - The Architect's Guild
  switch (gameId) {
    case 'number-systems':
      return <RationalCogwheelGame {...commonProps} />;
    case 'polynomials':
      return <GearTrainConstructorGame {...commonProps} />;
    case 'coordinate-geometry':
      return <AutomatonPathfindingGame {...commonProps} />;
    case 'linear-equations':
      return <PressureValveCalibrationGame {...commonProps} />;
    case 'euclid-geometry':
      return <LogicLockboxGame {...commonProps} />;
    case 'lines-angles':
      return <ReflectorArrayGame {...commonProps} />;
    case 'triangles':
      return <TrussBridgeBuilderGame {...commonProps} />;
    case 'quadrilaterals':
      return <ClockFaceDesignerGame {...commonProps} />;
    case 'areas-triangles':
      return <AetherSailWorkshopGame {...commonProps} />;
    case 'circles':
      return <GrandOrreryCalibrationGame {...commonProps} />;
    case 'constructions':
      return <MasterDraftsmanGame {...commonProps} />;
    case 'herons-formula':
      return <AutomatonArmorGame {...commonProps} />;
    case 'surface-volumes':
      return <AlchemicalVatDesignerGame {...commonProps} />;
    case 'statistics':
      return <CensusMachineGame {...commonProps} />;
    case 'probability':
      return <GameOfCogsGame {...commonProps} />;

    // Science Games - The Alchemist's Spire
    case 'motion-forces':
      return <AutomatonGrandPrixGame {...commonProps} />;
    case 'gravitation':
      return <LevitatingCrystalGame {...commonProps} />;
    case 'work-energy-sound':
      return <SonicResonatorGame {...commonProps} />;
    case 'matter-states':
      return <AetherDistillerGame {...commonProps} />;
    case 'pure-matter':
      return <PurityAnalyzerGame {...commonProps} />;
    case 'atoms-molecules':
      return <AtomicForgeGame {...commonProps} />;
    case 'atomic-structure':
      return <SubatomicWorkshopGame {...commonProps} />;
    case 'cell-structure':
      return <MicroMechanistGame {...commonProps} />;
    case 'tissues':
      return <LivingGearAssemblyGame {...commonProps} />;
    case 'diversity-organisms':
      return <SpecimenArchiveGame {...commonProps} />;
    case 'health-disease':
      return <AlchemicalCureGame {...commonProps} />;
    case 'natural-resources':
      return <BiodomeHadCultivatorGame {...commonProps} />;

    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center brass-frame bg-gradient-to-br from-amber-100/95 to-orange-100/95 backdrop-blur-md border-4 border-amber-700/30 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Game Under Construction</h2>
            <p className="text-amber-700 mb-6">
              The master artisans are still crafting this magnificent contraption.
            </p>
            <button
              onClick={onBack}
              className="brass-button bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              Return to Guild Hall
            </button>
          </div>
        </div>
      );
  }
}