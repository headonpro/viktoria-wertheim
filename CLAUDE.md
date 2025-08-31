# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SV Viktoria Wertheim website - A Next.js 15.5.2 application for a German football club (est. 1945). Full-stack application with local Supabase PostgreSQL database running in Docker containers.

## Core Development Commands

```bash
# Development
pnpm run dev          # Start dev server with Turbopack at http://localhost:3000

# Build & Production
pnpm run build        # Production build with Turbopack
pnpm run start        # Start production server
pnpm run lint         # Run ESLint

# Type Checking (no script defined - run directly)
pnpm tsc --noEmit     # Check TypeScript types without emitting

# Database Operations
docker exec supabase-db pg_dump -U postgres postgres > backup.sql  # Backup
cat backup.sql | docker exec -i supabase-db psql -U postgres postgres  # Restore

# Docker Management
docker ps | grep supabase     # Check Supabase containers (13 should be running)
docker logs supabase-db       # Check database logs
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.5.2 with App Router + Turbopack
- **Runtime**: React 19.1.0 + TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 with custom theme colors
- **Database**: PostgreSQL via Supabase (Docker containers)
- **State**: Local component state + prop drilling
- **Icons**: Lucide React + Tabler Icons
- **Animations**: Framer Motion 12.23

### Data Architecture

**Server → Client Data Flow:**
1. Server Components fetch data using `createClient()` from `@/lib/supabase/server`
2. Data is passed as props to Client Components
3. Client Components handle interactivity and state

**Database Schema (10 tables):**
- `teams` - Football teams with league, coach, points
- `players` - Team roster with positions
- `matches` - Game schedules and results
- `news` - Articles with categories
- `league_standings` - Current league tables
- `scorers` - Goal statistics
- `sponsors` - Sponsor information
- `contacts` - Club officials
- `newsletter_subscribers` - Email list
- `youth_teams` - Youth divisions

### Component Patterns

**Server Components (default):**
```tsx
// src/app/[route]/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('table').select('*')
  return <ClientComponent data={data} />
}
```

**Client Components (interactive):**
```tsx
'use client'
// Must use for: hooks, event handlers, browser APIs

// Hydration safety pattern:
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return null
```

### File Structure
```
src/
├── app/              # Pages (Server Components)
│   ├── layout.tsx    # Root layout with ThemeProvider
│   ├── page.tsx      # Homepage (via HomePage component)
│   └── [routes]/     # teams, news, kontakt, etc.
├── components/       # 30+ components
│   ├── HomePage.tsx  # Server Component with data fetching
│   ├── HomePageClient.tsx  # Client Component with state
│   └── [features]/   # GameCards, NewsCarousel, etc.
├── lib/
│   ├── supabase/
│   │   ├── server.ts # SSR client (cookies)
│   │   └── client.ts # Browser client
│   ├── database.types.ts  # Generated Supabase types
│   └── utils.ts      # cn() for classnames
└── utils/            # (currently unused)
```

## Critical Configuration

### Environment Variables
```bash
# .env.local (required)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # Default local key
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
```

### Docker Services (13 containers)
- `supabase-db` - PostgreSQL database
- `supabase-kong` - API Gateway (port 8000)
- `supabase-auth` - Authentication service
- `supabase-rest` - PostgREST API
- `supabase-realtime` - WebSocket subscriptions
- `supabase-storage` - File storage
- `supabase-studio` - Admin dashboard
- Plus 6 supporting services

### Custom Tailwind Theme
```css
/* Defined in globals.css */
--viktoria-blue: #003366
--viktoria-blue-light: #354992
--viktoria-yellow: #FFD700
--viktoria-green: #00A86B
--viktoria-dark: #101010
--viktoria-dark-light: #1a1a1a
```

## Development Workflow

### Before Starting Development
1. Ensure Docker is running: `docker ps`
2. Check Supabase containers: `docker ps | grep supabase` (should show 13)
3. Verify database connection: `docker exec supabase-db psql -U postgres -c '\l'`

### Adding New Features
1. Create Server Component in `app/[route]/page.tsx` for data fetching
2. Create Client Component in `components/` for interactivity
3. Use `AnimatedSection` wrapper for animations
4. Follow existing patterns for consistency

### Pre-Commit Checklist
1. `pnpm run lint` - Fix all ESLint issues
2. `pnpm tsc --noEmit` - Verify TypeScript types
3. `pnpm run build` - Ensure production build succeeds
4. Test responsive design (375px, 768px, 1280px)
5. Verify dark mode functionality

## Common Patterns

### Data Fetching (Server Component)
```tsx
const supabase = await createClient()
const results = await Promise.all([
  supabase.from('table1').select('*'),
  supabase.from('table2').select('*')
])
```

### Animation Wrapper
```tsx
<AnimatedSection animation="slideUp" delay={0.1}>
  <Component />
</AnimatedSection>
```

### Responsive Design
```tsx
<div className="hidden lg:block">Desktop only</div>
<div className="lg:hidden">Mobile/Tablet</div>
```

## Deployment

```bash
# Production deployment to Hetzner VPS
./deploy.sh  # Builds Docker image and deploys

# Manual Docker commands
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d
```

## Important Notes

- **No test framework** is currently configured
- **No API routes** defined (all data via Supabase)
- **TypeScript strict mode** is enabled - handle all null checks
- **Supabase types** are generated in `database.types.ts`
- **All pages use SSG/SSR** - no static exports
- **German language** is primary - use proper UTF-8 encoding