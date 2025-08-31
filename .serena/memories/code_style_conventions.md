# Code Style and Conventions

## TypeScript Configuration
- **Strict mode**: All strict checks enabled
- **Target**: ES2017
- **Module resolution**: bundler
- **Path alias**: `@/*` maps to `./src/*`
- **JSX**: preserve (Next.js handles transformation)

## Component Patterns

### Server vs Client Components
- **Server Components** (default): Pages, layouts, static displays
- **Client Components**: Use `'use client'` directive for:
  - Interactive features
  - Hooks usage
  - Browser APIs
  - Event handlers

### Hydration Safety Pattern
```tsx
'use client'
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

## Naming Conventions
- **Components**: PascalCase (e.g., `GameCards.tsx`)
- **Files**: kebab-case for routes, PascalCase for components
- **CSS Classes**: Tailwind utilities with custom theme colors
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with 'I' prefix for interfaces

## State Management
1. Local component state via React hooks
2. Theme state via next-themes provider
3. Team selection via prop drilling
4. Modal state with boolean flags

## Animation System
Use `AnimatedSection` wrapper with:
- `animation`: "fadeIn" | "slideUp" | "slideDown" | "scaleUp"
- `delay`: Staggered (0.1, 0.2, 0.3...)
- `immediate`: Skip animation for critical content

## Custom Tailwind Colors
- `viktoria-blue`: #003366
- `viktoria-blue-light`: #354992
- `viktoria-yellow`: #FFD700
- `viktoria-green`: #00A86B
- `viktoria-dark`: #101010
- `viktoria-dark-light`: #1a1a1a
- `viktoria-dark-lighter`: #2a2a2a

## Page Metadata Pattern
```tsx
export const metadata: Metadata = {
  title: "Page Title - SV Viktoria Wertheim",
  description: "German description here"
}
```

## Dark Mode Classes
- Light backgrounds: `bg-gray-50`
- Dark backgrounds: `dark:bg-viktoria-dark`
- Light text: `text-gray-900`
- Dark text: `dark:text-white`

## Component Hierarchy
```
PageLayout
  └── Header (with DarkModeToggle)
  └── Main Content
      └── AnimatedSection(s)
          └── Feature Components
  └── Footer
  └── Modals
```