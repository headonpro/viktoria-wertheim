# Code Style and Conventions

## TypeScript Configuration
- **Strict mode enabled** - Full type safety
- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Path alias**: `@/*` maps to `./src/*`
- **JSX**: Preserve for Next.js processing

## React Components
- **Functional components** with hooks
- **'use client'** directive for client-side components
- **Named exports** for pages, **default exports** for components
- **TypeScript interfaces** for props (when needed)

## File Naming
- **Components**: PascalCase (e.g., `Header.tsx`, `DarkModeToggle.tsx`)
- **Pages**: lowercase with `.tsx` extension
- **Utilities**: camelCase (e.g., `utils.ts`, `supabase.ts`)

## Code Organization
- Components are self-contained in `/src/components/`
- Page-specific code in `/src/app/[page]/`
- Shared utilities in `/src/lib/` and `/src/utils/`
- Clear separation between client and server components

## Styling Approach
- **Tailwind CSS classes** directly in JSX
- **Responsive design** with Tailwind breakpoints
- **Dark mode support** via `dark:` prefix
- **Custom colors**: viktoria-yellow, viktoria-red (team colors)
- **Transitions**: Using `transition-all duration-300` pattern

## State Management
- **React hooks** for local state
- **next-themes** for theme state
- **Supabase** for remote data

## Best Practices Observed
- Hydration mismatch prevention (mounted state pattern)
- Semantic HTML with proper ARIA labels
- Type-safe imports with TypeScript
- Modular component structure
- Clear component responsibilities