# Project Structure

## Root Directory
```
viktoria-wertheim/
├── src/                    # Source code
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   ├── utils/            # External service clients
│   └── hooks/            # Custom React hooks
├── public/                # Static assets
├── supabase/              # Supabase configuration
│   ├── migrations/       # Database migrations
│   └── seed/            # Seed data
├── docker/                # Docker volumes
├── data/                  # Static data files
├── .next/                 # Next.js build output (ignored)
├── node_modules/          # Dependencies (ignored)
└── Configuration files

```

## Source Code Structure (`/src`)

### `/src/app/` - Pages (App Router)
- `layout.tsx` - Root layout with providers
- `page.tsx` - Homepage
- `globals.css` - Global styles and Tailwind config
- `/teams/` - Team pages
- `/news/` - News section
- `/shop/` - Online shop
- `/kontakt/` - Contact page
- `/impressum/` - Legal notice
- `/datenschutz/` - Privacy policy
- `/faq/` - FAQ page
- `/downloads/` - Downloads section
- `/api/` - API routes

### `/src/components/` - Components
- `PageLayout.tsx` - Main layout wrapper
- `Header.tsx` - Site header
- `Footer.tsx` - Site footer
- `DarkModeToggle.tsx` - Theme switcher
- `AnimatedSection.tsx` - Animation wrapper
- `GameCards.tsx` - Match display cards
- `NewsCarousel.tsx` - News slider
- `TeamStatus.tsx` - Team selection
- `LeagueTable.tsx` - League standings
- `NewsModal.tsx` - News detail modal
- Various other feature components

### `/src/lib/` - Utilities
- `utils.ts` - cn() function for classnames

### `/src/utils/` - Services
- `supabase.ts` - Supabase client (pending implementation)

## Database Tables (Supabase)
- `teams` - Football teams
- `players` - Team players
- `matches` - Game schedules
- `news` - News articles
- `league_standings` - League tables
- `sponsors` - Sponsor information
- `contacts` - Contact persons
- `scorers` - Goal scorers
- `newsletter_subscribers` - Email list
- `youth_teams` - Youth divisions

## Docker Services
- 13 Supabase containers running
- PostgreSQL database
- Auth service
- Storage API
- Realtime subscriptions
- Edge functions
- Studio dashboard