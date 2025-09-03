# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official website for SV Viktoria Wertheim football club, built with Next.js 15, TypeScript, Tailwind CSS, and Supabase. The project runs both locally and in production using Docker containers.

## Core Commands

### Development
```bash
# Start local development (Next.js + Supabase)
docker-compose -f docker-compose.supabase.yml up -d  # Start Supabase
pnpm run dev                                         # Start Next.js with Turbopack

# Stop local services
docker-compose -f docker-compose.supabase.yml down
```

### Build & Test
```bash
pnpm run build    # Production build (automatically sets NODE_ENV=production)
pnpm run lint     # Run ESLint
```

### Database Operations
```bash
./scripts/db-migrate.sh create <name>  # Create new migration
./scripts/db-migrate.sh status          # Check migration status
./scripts/db-migrate.sh up             # Apply migrations locally
./scripts/db-migrate.sh deploy         # Deploy to production
./scripts/db-migrate.sh export         # Export production schema
./scripts/db-sync.sh                   # Sync database
```

### Production Deployment
```bash
# Manual deployment to VPS
./deploy-vps.sh

# Or push to GitHub main branch for automatic deployment
git push origin main
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15.5.2 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion for animations
- **Backend**: Supabase (Auth, Database, Storage)
- **Database**: PostgreSQL 15 (via Supabase)
- **Deployment**: Docker containers on VPS (91.98.117.169)
- **CI/CD**: GitHub Actions (when configured)

### Directory Structure
```
src/
├── app/              # Next.js app router pages
│   ├── admin/        # Admin dashboard (protected)
│   ├── api/          # API routes
│   └── auth/         # Authentication pages
├── components/       # React components
├── lib/              # Utilities and configurations
│   ├── supabase/     # Supabase client setup
│   └── teams/        # Team-specific logic
└── hooks/            # Custom React hooks
```

### Key Files
- `docker-compose.supabase.yml` - Local Supabase stack
- `docker-compose.production.yml` - Production deployment config
- `middleware.ts` - Security headers, auth protection
- `.env.local` - Local environment variables
- `.env.production` - Production environment (never commit)

## Environment Configuration

### Required Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=

# Email (for contact form)
EMAIL_USER=
EMAIL_PASS=

# Admin
ADMIN_EMAILS=            # Comma-separated admin emails
NEXT_PUBLIC_APP_URL=     # Production URL
```

## Development Workflow

### Admin Area Access
1. Start local Supabase: `docker-compose -f docker-compose.supabase.yml up -d`
2. Access Supabase Studio: `http://localhost:54323`
3. Admin login: `/auth/login`
4. Admin dashboard: `/admin/*`

### Database Changes
1. Create migration: `./scripts/db-migrate.sh create <name>`
2. Edit migration file in `supabase/migrations/`
3. Test locally: `./scripts/db-migrate.sh up`
4. Deploy to production: `./scripts/db-migrate.sh deploy`

### Adding New Features
1. Components go in `src/components/` or page-specific directories
2. API routes in `src/app/api/`
3. Database types in `src/lib/database.types.ts`
4. Supabase queries use clients from `src/lib/supabase/`

## Production Infrastructure

### Docker Services
- `viktoria-web` - Next.js application (port 8001)
- `viktoria-postgres` - PostgreSQL database (port 5433)
- `supabase-*` - Supabase services (Auth, Realtime, Storage, etc.)

### VPS Deployment
- **Server**: 91.98.117.169 (root access)
- **Project Path**: `/opt/devserver/projects/viktoria-wertheim/`
- **URL**: https://viktoria.headon.pro
- **Deployment**: Push to GitHub main triggers automatic deployment

### Health Monitoring
```bash
# Check container status
docker ps | grep viktoria

# View logs
docker logs viktoria-web --tail 50

# Health endpoint
curl https://viktoria.headon.pro/api/health
```

## Security Considerations

- CSP headers configured in `middleware.ts`
- Admin routes protected via Supabase Auth
- Environment variables properly separated (local/production)
- HTTPS enforced in production
- Database connections use internal Docker networks
- Rate limiting implemented for API routes

## Troubleshooting

### Common Issues

1. **Supabase connection errors**: Check if Docker containers are running
2. **Build failures**: Ensure `NODE_ENV=production` for production builds
3. **Auth issues**: Verify Supabase keys and admin emails in environment
4. **Database errors**: Check migration status and PostgreSQL logs

### Debug Commands
```bash
# Container logs
docker logs supabase-db
docker logs viktoria-web

# Database access
docker exec -it supabase-db psql -U postgres

# Network inspection
docker network ls
docker network inspect viktoria-network
```

## Important Notes

- Always use `pnpm` for package management
- Production deployments are zero-downtime via Docker
- Supabase Studio is disabled in production for security
- Test database migrations locally before deploying
- Keep `.env.production` secure and never commit it