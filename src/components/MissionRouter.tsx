import React from 'react';
import type { Language } from '../types/onboarding';

// Math Games
import { NumberComparisonGame } from './games/math/NumberComparisonGame';
import { SimpleMathGame } from './games/math/SimpleMathGame';
import { SeedSorterGame } from './games/math/SeedSorterGame';
import { IrrigationFlowGame } from './games/math/IrrigationFlowGame';

// Science Games  
import { PlantPartsKitchenGame } from './games/science/PlantPartsKitchenGame';
import { NutrientNavigatorGameEnhanced } from './missions/NutrientNavigatorGameEnhanced';
import { ChemistryLabGame } from './games/science/ChemistryLabGame';
import { BiologyLabGame } from './games/science/BiologyLabGame';
import { PhysicsLabGame } from './games/science/PhysicsLabGame';
import { CropProductionGame } from './games/science/CropProductionGame';

// Legacy Games
import { NaturalNumbersGame } from './missions/NaturalNumbersGame';

interface MissionRouterProps {
  missionId: string;
  language: Language;
  onBack: () => void;
  onComplete?: (score: number, xpEarned: number) => void;
}

// Coming Soon placeholder component
function ComingSoonGame({ missionName, language, onBack }: { missionName: string; language: Language; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center max-w-md">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {language === 'en' ? 'Coming Soon!' : 
           language === 'hi' ? 'जल्दी आ रहा है!' : 
           'ଶୀଘ୍ର ଆସୁଛି!'}
        </h2>
        <p className="text-white/80 mb-6">
          {missionName} {language === 'en' ? 'is under development' : 
                         language === 'hi' ? 'विकास में है' : 
                         'ବିକାଶ ଚାଲିଛି'}
        </p>
        <button
          onClick={onBack}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {language === 'en' ? 'Back' : language === 'hi' ? 'वापस' : 'ପଛକୁ'}
        </button>
      </div>
    </div>
  );
}

export function MissionRouter({ missionId, language, onBack, onComplete }: MissionRouterProps) {
  console.log('MissionRouter called with:', missionId); // Debug log
  
  // Mathematics Games Routing
  switch (missionId) {
    // MATH - Simple Demo Game
    case 'math-lab':
      console.log('Routing to SimpleMathGame'); // Debug log
      return <SimpleMathGame language={language} onBack={onBack} onComplete={onComplete} />;

    // MATH - Knowing Our Numbers
    case 'knowing-numbers-number-comparison':
    case 'knowing-numbers-roman-adventure':
    case 'knowing-numbers-estimation-master':
      return <NumberComparisonGame language={language} onBack={onBack} onComplete={onComplete} />;

    // MATH - Whole Numbers  
    case 'whole-numbers-properties-battle':
      return <ComingSoonGame missionName="Properties Battle" language={language} onBack={onBack} />;
    case 'whole-numbers-pattern-hunter':
      return <ComingSoonGame missionName="Pattern Detective" language={language} onBack={onBack} />;
    case 'whole-numbers-closure-challenge':
      return <ComingSoonGame missionName="Closure Master" language={language} onBack={onBack} />;

    // MATH - Playing with Numbers
    case 'playing-numbers-factor-factory':
      return <ComingSoonGame missionName="Factor Factory" language={language} onBack={onBack} />;
    case 'playing-numbers-prime-hunter':
      return <ComingSoonGame missionName="Prime Hunter" language={language} onBack={onBack} />;
    case 'playing-numbers-divisibility-dash':
      return <ComingSoonGame missionName="Divisibility Dash" language={language} onBack={onBack} />;

    // MATH - Basic Geometrical Ideas
    case 'basic-geo-point-line-plane':
      return <ComingSoonGame missionName="Point, Line & Plane" language={language} onBack={onBack} />;
    case 'basic-geo-angles-explorer':
      return <ComingSoonGame missionName="Angles Explorer" language={language} onBack={onBack} />;
    case 'basic-geo-triangle-constructor':
      return <ComingSoonGame missionName="Triangle Constructor" language={language} onBack={onBack} />;

    // MATH - Understanding Elementary Shapes
    case 'elementary-shapes-2d-explorer':
      return <ComingSoonGame missionName="2D Shape Explorer" language={language} onBack={onBack} />;
    case 'elementary-shapes-3d-builder':
      return <ComingSoonGame missionName="3D Shape Builder" language={language} onBack={onBack} />;
    case 'elementary-shapes-symmetry-master':
      return <ComingSoonGame missionName="Symmetry Master" language={language} onBack={onBack} />;

    // MATH - Integers
    case 'integers-number-line-journey':
      return <ComingSoonGame missionName="Number Line Journey" language={language} onBack={onBack} />;
    case 'integers-operation-arena':
      return <ComingSoonGame missionName="Operation Arena" language={language} onBack={onBack} />;
    case 'integers-temperature-tracker':
      return <ComingSoonGame missionName="Temperature Tracker" language={language} onBack={onBack} />;

    // MATH - Fractions
    case 'fractions-fraction-pizza':
      return <ComingSoonGame missionName="Fraction Pizza" language={language} onBack={onBack} />;
    case 'fractions-equivalent-explorer':
      return <ComingSoonGame missionName="Equivalent Explorer" language={language} onBack={onBack} />;
    case 'fractions-arithmetic-arcade':
      return <ComingSoonGame missionName="Fraction Arithmetic" language={language} onBack={onBack} />;

    // MATH - Decimals
    case 'decimals-decimal-market':
      return <ComingSoonGame missionName="Decimal Market" language={language} onBack={onBack} />;
    case 'decimals-money-master':
      return <ComingSoonGame missionName="Money Master" language={language} onBack={onBack} />;
    case 'decimals-precision-challenge':
      return <ComingSoonGame missionName="Precision Challenge" language={language} onBack={onBack} />;

    // MATH - Data Handling
    case 'data-handling-graph-builder':
      return <ComingSoonGame missionName="Graph Builder" language={language} onBack={onBack} />;
    case 'data-handling-data-mystery':
      return <ComingSoonGame missionName="Data Mystery" language={language} onBack={onBack} />;
    case 'data-handling-chart-champion':
      return <ComingSoonGame missionName="Chart Champion" language={language} onBack={onBack} />;

    // MATH - Mensuration
    case 'mensuration-perimeter-patrol':
      return <ComingSoonGame missionName="Perimeter Patrol" language={language} onBack={onBack} />;
    case 'mensuration-area-architect':
      return <ComingSoonGame missionName="Area Architect" language={language} onBack={onBack} />;
    case 'mensuration-city-planner':
      return <ComingSoonGame missionName="City Planner" language={language} onBack={onBack} />;

    // MATH - Algebra
    case 'algebra-intro-variable-village':
      return <ComingSoonGame missionName="Variable Village" language={language} onBack={onBack} />;
    case 'algebra-intro-equation-explorer':
      return <ComingSoonGame missionName="Equation Explorer" language={language} onBack={onBack} />;
    case 'algebra-intro-expression-builder':
      return <ComingSoonGame missionName="Expression Builder" language={language} onBack={onBack} />;

    // MATH - Ratio and Proportion
    case 'ratio-proportion-cooking-ratios':
      return <ComingSoonGame missionName="Cooking Ratios" language={language} onBack={onBack} />;
    case 'ratio-proportion-scale-master':
      return <ComingSoonGame missionName="Scale Master" language={language} onBack={onBack} />;
    case 'ratio-proportion-unitary-method':
      return <ComingSoonGame missionName="Unitary Method" language={language} onBack={onBack} />;

    // MATH - Percentage
    case 'percentage-discount-detective':
      return <ComingSoonGame missionName="Discount Detective" language={language} onBack={onBack} />;
    case 'percentage-profit-loss-trader':
      return <ComingSoonGame missionName="Profit Loss Trader" language={language} onBack={onBack} />;
    case 'percentage-percentage-calculator':
      return <ComingSoonGame missionName="Percentage Calculator" language={language} onBack={onBack} />;

    // MATH - Linear Equations
    case 'linear-equations-balance-beam':
      return <ComingSoonGame missionName="Balance Beam" language={language} onBack={onBack} />;
    case 'linear-equations-equation-solver':
      return <ComingSoonGame missionName="Equation Solver" language={language} onBack={onBack} />;
    case 'linear-equations-real-world-problems':
      return <ComingSoonGame missionName="Real World Problems" language={language} onBack={onBack} />;

    // SCIENCE - Food Components
    case 'food-components':
    case 'nutrient-navigator':
      return <NutrientNavigatorGameEnhanced language={language} onBack={onBack} onComplete={onComplete} />;

    // SCIENCE - Food Sources
    case 'food-sources-plant-factory':
      return <ComingSoonGame missionName="Plant Factory" language={language} onBack={onBack} />;
    case 'food-sources-animal-ranch':
      return <ComingSoonGame missionName="Animal Ranch" language={language} onBack={onBack} />;
    case 'food-sources-food-chain-explorer':
      return <ComingSoonGame missionName="Food Chain Explorer" language={language} onBack={onBack} />;

    // SCIENCE - Fibre to Fabric
    case 'fibre-fabric-cotton-journey':
      return <ComingSoonGame missionName="Cotton to Cloth" language={language} onBack={onBack} />;
    case 'fibre-fabric-weaving-wizard':
      return <ComingSoonGame missionName="Weaving Wizard" language={language} onBack={onBack} />;
    case 'fibre-fabric-fabric-explorer':
      return <ComingSoonGame missionName="Fabric Explorer" language={language} onBack={onBack} />;

    // SCIENCE - Sorting Materials
    case 'sorting-materials-property-patrol':
      return <ComingSoonGame missionName="Property Patrol" language={language} onBack={onBack} />;
    case 'sorting-materials-hardness-hunter':
      return <ComingSoonGame missionName="Hardness Hunter" language={language} onBack={onBack} />;
    case 'sorting-materials-transparency-test':
      return <ComingSoonGame missionName="Transparency Test" language={language} onBack={onBack} />;

    // SCIENCE - Separation Methods
    case 'separation-methods-sieving-simulator':
      return <ComingSoonGame missionName="Sieving Simulator" language={language} onBack={onBack} />;
    case 'separation-methods-filtration-factory':
      return <ComingSoonGame missionName="Filtration Factory" language={language} onBack={onBack} />;
    case 'separation-methods-evaporation-expert':
      return <ComingSoonGame missionName="Evaporation Expert" language={language} onBack={onBack} />;

    // SCIENCE - Chemistry Lab (Simple volcano experiment)
    case 'changes-around-us-reversible-lab':
    case 'changes-around-us-chemical-kitchen':
    case 'changes-around-us-transformation-tower':
    case 'chemistry-lab':
      console.log('Routing to ChemistryLabGame'); // Debug log
      return <ChemistryLabGame language={language} onBack={onBack} onComplete={onComplete} />;

    // SCIENCE - Biology Lab (Simple cell viewing)
    case 'living-organisms-habitat-explorer':
    case 'living-organisms-adaptation-adventure':
    case 'living-organisms-life-characteristics':
    case 'plant-parts-plant-explorer':
    case 'plant-parts-photosynthesis-factory':
    case 'plant-parts-root-stem-leaf':
    case 'body-movements-skeleton-builder':
    case 'body-movements-joint-journey':
    case 'body-movements-animal-locomotion':
    case 'biology-lab':
      console.log('Routing to BiologyLabGame'); // Debug log
      return <BiologyLabGame language={language} onBack={onBack} onComplete={onComplete} />;

    // SCIENCE - Physics Lab (Simple gravity experiment)
    case 'motion-measurement-transport-timeline':
    case 'motion-measurement-measurement-master':
    case 'motion-measurement-motion-types':
    case 'light-shadows-shadow-theater':
    case 'light-shadows-reflection-realm':
    case 'light-shadows-pinhole-photographer':
    case 'magnets-magnetic-explorer':
    case 'magnets-compass-navigator':
    case 'magnets-pole-power':
    case 'physics-lab':
      console.log('Routing to PhysicsLabGame'); // Debug log
      return <PhysicsLabGame language={language} onBack={onBack} onComplete={onComplete} />;

    // SCIENCE - Water Cycle
    case 'water-cycle-water-cycle-journey':
      return <ComingSoonGame missionName="Water Cycle Journey" language={language} onBack={onBack} />;
    case 'water-cycle-conservation-hero':
      return <ComingSoonGame missionName="Conservation Hero" language={language} onBack={onBack} />;
    case 'water-cycle-drought-flood':
      return <ComingSoonGame missionName="Drought & Flood Manager" language={language} onBack={onBack} />;

    // SCIENCE - Air & Atmosphere
    case 'air-atmosphere-air-explorer':
      return <ComingSoonGame missionName="Air Explorer" language={language} onBack={onBack} />;
    case 'air-atmosphere-oxygen-factory':
      return <ComingSoonGame missionName="Oxygen Factory" language={language} onBack={onBack} />;
    case 'air-atmosphere-atmosphere-guardian':
      return <ComingSoonGame missionName="Atmosphere Guardian" language={language} onBack={onBack} />;

    // SCIENCE - Waste Management
    case 'waste-management-sorting-superhero':
      return <ComingSoonGame missionName="Sorting Superhero" language={language} onBack={onBack} />;
    case 'waste-management-recycling-master':
      return <ComingSoonGame missionName="Recycling Master" language={language} onBack={onBack} />;
    case 'waste-management-vermicompost-village':
      return <ComingSoonGame missionName="Vermicompost Village" language={language} onBack={onBack} />;

    // Grade 8 Agri-Innovator Games - Mathematics
    case 'seed-sorter-game':
    case 'rational-numbers':
      return <SeedSorterGame language={language} onBack={onBack} onComplete={onComplete} />;
    case 'irrigation-flow-game':
    case 'linear-equations':
      return <IrrigationFlowGame language={language} onBack={onBack} onComplete={onComplete} />;

    // Grade 8 Agri-Innovator Games - Science  
    case 'crop-production-game':
    case 'crop-management':
      return <CropProductionGame language={language} onBack={onBack} onComplete={onComplete} />;

    // Legacy/Other Games
    case 'natural-numbers':
      return <NaturalNumbersGame language={language} onBack={onBack} onComplete={onComplete} />;
    case 'plant-parts-kitchen':
      return <PlantPartsKitchenGame language={language} onBack={onBack} onComplete={onComplete} />;

    // Default case
    default:
      console.log('No route found for:', missionId); // Debug log
      return <ComingSoonGame missionName={missionId} language={language} onBack={onBack} />;
  }
}