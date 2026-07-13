# Project: Snehal Patil Personal Portfolio

## Architecture
- Next.js 14+ (App Router) as the core web framework.
- React components for different portfolio sections (Profile, Summary, Experience, Projects, Education, Skills, Certifications).
- Tailwind CSS for style configuration and design tokens (ivory background `#F7F4ED`, ink indigo text, brass-foil accent `#A9812F`).
- GSAP + ScrollTrigger for pinned animations, desktop side-scrolling Projects section, and zoom-linked scroll transitions.
- Playwright or Cypress for E2E testing (automated run via scripts).

## Code Layout
- `/src/app/` - Next.js App Router root
  - `layout.tsx` - App layout with metadata, Google Fonts integration (Fraunces, Inter), global styles
  - `page.tsx` - Main page rendering components
- `/src/components/` - Sub-components
  - `Hero.tsx` - Profile & Summary presentation
  - `Experience.tsx` - Experience details
  - `Projects.tsx` - Side-scrolling projects list
  - `Education.tsx` - MCA & BCA details
  - `Skills.tsx` - Skill badges categorized
  - `Certifications.tsx` - Certifications list
  - `HairlineRule.tsx` - Premium separator component
- `/src/styles/` - Global style sheets
- `/tests/` - E2E Playwright/Cypress test files
  - `/tests/tier1_feature_coverage.spec.ts`
  - `/tests/tier2_boundary_cases.spec.ts`
  - `/tests/tier3_cross_feature.spec.ts`
  - `/tests/tier4_real_world.spec.ts`
- `tailwind.config.ts` - Tailwind theme configurations
- `package.json` - Dependencies and build/test commands
- `tsconfig.json` - Strict TypeScript configurations

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Next.js Base Setup | Configure Next.js, TypeScript, Tailwind, and typography | None | DONE |
| M2 | Static Layout & Content | Implement all section UI components with verbatim content | M1 | IN_PROGRESS |
| M3 | GSAP Scroll Interaction | Integrate GSAP, ScrollTrigger, side-scrolling projects | M2 | PLANNED |
| M4 | Responsive & Reduced Motion | Add mobile layouts (no pinning), prefers-reduced-motion | M3 | PLANNED |
| M5 | E2E Testing Suite | Develop 60+ opaque-box E2E test cases across 4 tiers | None | IN_PROGRESS |
| M6 | Integration & Bug Fixing | Fix all code issues until E2E tests pass 100% | M4, M5 | PLANNED |
| M7 | Audit & Performance | Forensic audit, Lighthouse scoring optimizations | M6 | PLANNED |

## Interface Contracts
### Main Page ↔ Sub-components
- React functional components with no-prop or structured-prop interfaces.
- Standard custom CSS styling variables or tailwind utility classes for color scheme and typography.
### Page Layout ↔ Scroll System
- Section containers mapped with standard IDs/classes for ScrollTrigger selectors.
- Side-scrolling target wrapper class `side-scroll-container` and individual panels.
### Test Suite ↔ Application UI
- Semantic data attributes (e.g., `data-testid`) for reliable element selectors in tests.
- Keyboard navigation paths: `Tab` indices, visual focus rings on custom buttons or links.
