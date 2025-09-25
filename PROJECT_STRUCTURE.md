# Learnio Project Structure

This document outlines the clean, organized structure of the Learnio educational platform.

## Root Directory
```
GLA/
├── .env                              # Environment variables (Supabase config)
├── .npmrc                           # NPM configuration
├── Attributions.md                  # Third-party attributions
├── Guidelines.md                    # Development guidelines
├── README.md                        # Project documentation
├── SUPABASE_SETUP_INSTRUCTIONS.md   # Database setup guide
├── PROJECT_STRUCTURE.md             # This file
├── index.html                       # Main HTML entry point
├── package.json                     # Dependencies and scripts
├── package-lock.json               # Locked dependency versions
├── supabase_tables.sql              # Database schema
├── vite.config.ts                   # Vite build configuration
└── src/                             # Source code
```

## Source Code Structure (`src/`)

### Core Application Files
- `App.tsx` - Main application component with routing logic
- `main.tsx` - Application entry point
- `index.css` - Global styles and Tailwind imports

### Assets (`assets/`)
Contains optimized image assets used throughout the application:
- Logo variations and branding images
- UI graphics and illustrations
- All images are properly referenced in components

### Components (`components/`)
Organized by functionality and feature areas:

#### Core Components
- `ErrorBoundary.tsx` - Error handling wrapper
- `LoadingScreen.tsx` - Application loading state
- `LandingPage.tsx` - Marketing/welcome page
- `OnboardingFlow.tsx` - User registration/login flow
- `MissionRouter.tsx` - Game/mission routing logic
- `InteractiveDemoGame.tsx` - Demo game component
- `NumberSystemsPageComplete.tsx` - Number systems learning module

#### Feature-Specific Components

**Dashboards (`dashboards/`)**
- Grade-specific dashboards (6-12)
- `AdminDashboard.tsx` - Teacher/admin interface

**Educational Content (`math/`)**
- `AdvancedMathematicsOverview.tsx` - Math curriculum overview
- `units/` - Individual math units (Sets, Algebra, Calculus, etc.)
- `sets/` - Comprehensive sets learning modules
- `subtopics/` - Detailed topic breakdowns
- `quizzes/` - Assessment components

**Games (`games/`)**
- `grade9/` - Grade 9 steampunk-themed games
- `math/` - Mathematical games and simulations
- `science/` - Science-based educational games
- `engineering/` - Engineering simulation games

**Exploration (`exploration/`)**
- `PlanetMathara.tsx` - Math-focused exploration interface
- `PlanetScientia.tsx` - Science-focused exploration interface

**Missions (`missions/`)**
- Self-contained educational missions/games
- `NaturalNumbersGame.tsx` - Number theory game
- `NutrientNavigatorGameEnhanced.tsx` - Nutrition education game

**Onboarding (`onboarding/`)**
- User registration and setup components
- Language selection, user type selection
- Welcome screens and bonus systems

**Sets Adventure (`sets-adventure/`)**
- Complete sets theory learning module
- Responsive design components
- Quiz arena and lesson modules

**UI Components (`ui/`)**
- Reusable UI components (shadcn/ui based)
- Buttons, cards, dialogs, forms, etc.
- Consistent design system components

**Figma Integration (`figma/`)**
- `ImageWithFallback.tsx` - Figma asset loading component

### Public Assets (`public/`)
- `offline.html` - Offline fallback page
- `sw.js` - Service worker for PWA functionality

### Styles (`styles/`)
- `globals.css` - Global CSS styles and utilities

### Backend (`supabase/`)
- `functions/` - Supabase Edge Functions
- Server-side logic for authentication, progress tracking, leaderboards

### Types (`types/`)
- `onboarding.ts` - TypeScript type definitions
- User profiles, language types, form data structures

### Utilities (`utils/`)
- `dashboard.ts` - Dashboard helper functions
- `translations.ts` - Internationalization utilities
- `validation.ts` - Form validation helpers
- `supabase/` - Database client and utilities

## Key Features

### Multi-Grade Support
- Dedicated dashboards for grades 6-12
- Age-appropriate content and UI themes
- Progressive difficulty scaling

### Multilingual Support
- English, Hindi, and Odia language support
- Comprehensive translation system
- Cultural adaptation for rural Indian students

### Educational Games
- Subject-specific interactive games
- Progress tracking and achievements
- Gamified learning experiences

### Database Integration
- Supabase backend with PostgreSQL
- User authentication and profiles
- Progress tracking and leaderboards
- Real-time data synchronization

### Mobile-First Design
- Optimized for low-end Android devices
- Responsive design across all screen sizes
- Performance optimized for 1GB RAM devices

## Development Notes

### Removed Components
The following duplicate/unused components were removed during cleanup:
- `NumberSystemsPage.tsx` (duplicate of Complete version)
- `LandingPageFixed.tsx` (duplicate of LandingPage)
- `Dashboard_Grade6_SpaceTheme.tsx` (theme variant)
- Various demo game components not used in main app
- Unused video background components
- Development-only components and documentation

### Code Organization Principles
1. **Feature-based organization** - Components grouped by educational domain
2. **Reusable UI components** - Consistent design system
3. **Type safety** - Comprehensive TypeScript definitions
4. **Performance optimization** - Lazy loading and efficient rendering
5. **Accessibility** - WCAG 2.1 AA compliance
6. **Internationalization** - Multi-language support throughout

This structure supports maintainable, scalable development while keeping the codebase clean and organized.