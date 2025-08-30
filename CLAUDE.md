# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SV Viktoria Wertheim website - A Next.js 15 application for a German football club (since 1921) with team information, news, shop, and contact sections. The site is fully bilingual (German primary) with dark mode support.

## Development Commands

```bash
# Package manager: pnpm (preferred), npm as fallback
pnpm install          # Install dependencies
pnpm run dev          # Start dev server with Turbopack at http://localhost:3000
pnpm run build        # Production build with Turbopack
pnpm run start        # Start production server
pnpm run lint         # Run ESLint

# Type checking (no script defined, run directly)
pnpm tsc --noEmit     # Check TypeScript types without emitting files
```

## Architecture & Key Patterns

### Tech Stack
- **Next.js 15.5.2** with App Router and Turbopack (enabled via --turbopack flag)
- **React 19.1.0** with TypeScript 5 (strict mode)
- **Tailwind CSS v4** with custom theme colors and dark mode via next-themes
- **Supabase** for backend services (client setup pending)
- **Framer Motion 12.23** for animations
- **Icons**: Lucide React + Tabler Icons

### Custom Tailwind Theme Colors
Defined in `src/app/globals.css`:
- `viktoria-blue`: #003366
- `viktoria-blue-light`: #354992  
- `viktoria-yellow`: #FFD700
- `viktoria-green`: #00A86B
- `viktoria-dark`: #101010
- `viktoria-dark-light`: #1a1a1a
- `viktoria-dark-lighter`: #2a2a2a

### Page Structure & Data Flow

The app follows a consistent pattern:
1. **PageLayout wrapper** - Provides Header + Footer + consistent spacing
2. **AnimatedSection components** - Wrap content blocks with Framer Motion animations
3. **Team selection state** - Flows from TeamStatus → GameCards/LeagueTable
4. **Modal pattern** - News articles open in NewsModal overlay

Example from homepage:
```tsx
export default function Home() {
  const [selectedTeam, setSelectedTeam] = useState('1')
  const [selectedNewsArticle, setSelectedNewsArticle] = useState(null)
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false)
  
  return (
    <PageLayout>
      <AnimatedSection animation="slideUp" delay={0.1}>
        <GameCards selectedTeam={selectedTeam} />
      </AnimatedSection>
    </PageLayout>
  )
}
```

### Component Architecture

**Server Components (default)**
- All pages (`/app/*/page.tsx`)
- Layout components
- Static display components

**Client Components (require `'use client'`)**
- Interactive features (DarkModeToggle, NewsModal)
- Components using hooks or browser APIs
- Animation wrappers

**Hydration Safety Pattern**
Components that depend on client state use mounted check:
```tsx
'use client'
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

### Responsive Layout Strategy

The homepage uses a sophisticated responsive grid:
- **Mobile**: Single column, all components stack
- **Tablet**: Similar to mobile with adjusted spacing
- **Desktop**: 3-column grid (2:1 ratio), sidebar for news/stats

Components use conditional rendering:
```tsx
{/* Desktop only */}
<div className="hidden lg:block">...</div>

{/* Mobile/Tablet only */}  
<div className="lg:hidden">...</div>
```

### Animation System

All content animations use `AnimatedSection` wrapper with:
- `animation`: "fadeIn" | "slideUp" | "slideDown" | "scaleUp"
- `delay`: Staggered delays (0.1, 0.2, 0.3...) for sequential reveal
- `immediate`: Skip animation on initial load for critical content

### State Management Patterns

1. **Local component state**: React hooks for UI state
2. **Theme state**: next-themes provider at root level
3. **Team selection**: Prop drilling from parent to child components
4. **Modal state**: Boolean flags + selected content state

### TypeScript Configuration

- **Strict mode**: All strict checks enabled
- **Path alias**: `@/*` → `./src/*`
- **Target**: ES2017
- **Module resolution**: bundler
- **JSX**: preserve (Next.js handles transformation)

## Code Quality Checklist

Before committing:
1. Run `pnpm run lint` and fix all ESLint issues
2. Run `pnpm tsc --noEmit` to verify TypeScript types
3. Run `pnpm run build` to ensure production build succeeds
4. Test responsive design at mobile (375px), tablet (768px), desktop (1280px)
5. Verify dark/light theme switching works correctly
6. Check German text displays properly (UTF-8 encoding)

## Critical Implementation Notes

### Supabase Integration
The `/src/utils/supabase.ts` file exists but is empty. When implementing:
- Use environment variables for Supabase URL and anon key
- Create client-side and server-side clients as needed
- Follow Supabase SSR package patterns for auth

### Metadata Pattern
Each page should export metadata:
```tsx
export const metadata: Metadata = {
  title: "Page Title - SV Viktoria Wertheim",
  description: "German description here"
}
```

### Dark Mode Implementation
- Components check theme via `useTheme()` hook
- Styles use `dark:` prefix for dark variants
- Background colors: light uses `gray-50`, dark uses `viktoria-dark`
- Text colors: light uses `gray-900`, dark uses `white`

### Component Composition
The app uses a clear hierarchy:
```
PageLayout
  └── Header (with DarkModeToggle)
  └── Main Content
      └── AnimatedSection(s)
          └── Feature Components (GameCards, NewsCarousel, etc.)
  └── Footer
  └── Modals (NewsModal, etc.)
```

## File Organization

- `/src/app/` - Pages and layouts (App Router)
- `/src/components/` - All React components
- `/src/lib/` - Utility functions (cn() for classnames)
- `/src/utils/` - External service clients (Supabase)
- `/public/` - Static assets
- `/supabase/` - Supabase configuration files