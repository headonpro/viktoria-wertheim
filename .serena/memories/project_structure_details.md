# Detailed Project Structure

## Source Code Organization

### /src/app - Next.js App Router
- `layout.tsx` - Root layout with theme provider
- `page.tsx` - Homepage component
- `globals.css` - Global styles and Tailwind imports
- `favicon.ico` - Site favicon
- **Subdirectories** (routes):
  - `/kontakt` - Contact page
  - `/news` - News/updates page
  - `/shop` - Merchandise/shop page
  - `/teams` - Teams information page

### /src/components - Reusable Components
**Layout Components:**
- `Header.tsx` - Site navigation header
- `Footer.tsx` - Site footer
- `PageLayout.tsx` - Common page wrapper
- `ThemeProvider.tsx` - Next-themes provider wrapper

**Feature Components:**
- `GameCards.tsx` - Display game/match cards
- `NewsCarousel.tsx` - News items carousel
- `NewsTicker.tsx` - Scrolling news ticker
- `NewsModal.tsx` - News detail modal
- `SponsorShowcase.tsx` - Sponsor logos display
- `SimpleLeagueTable.tsx` - League standings table
- `TopScorers.tsx` - Top scorers list
- `TeamStatus.tsx` - Team status display

**UI Components:**
- `AnimatedSection.tsx` - Framer Motion animations
- `DarkModeToggle.tsx` - Theme switcher button

### /src/lib & /src/utils
- `lib/utils.ts` - Utility functions (likely cn() for classnames)
- `utils/supabase.ts` - Supabase client configuration

## Configuration Files

### Build & Development
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `pnpm-lock.yaml` - pnpm lock file
- `package-lock.json` - npm lock file (backup)

### Styling
- `tailwind.config.js` - Tailwind CSS configuration (if exists)
- `postcss.config.mjs` - PostCSS configuration
- `components.json` - shadcn/ui configuration

### Code Quality
- `eslint.config.mjs` - ESLint rules
- `.gitignore` - Git ignore patterns

### Infrastructure
- `Dockerfile` - Container definition
- `docker-compose.yml` - Multi-container setup
- `/supabase/config.toml` - Supabase local config

## Special Directories
- `/public` - Static assets (images, fonts, etc.)
- `/.claude` - Claude-specific configurations
- `/.serena` - Serena tool configurations
- `/.playwright-mcp` - Playwright testing setup

## Import Aliases
- `@/*` - Maps to `./src/*` for cleaner imports
- Example: `import Header from '@/components/Header'`