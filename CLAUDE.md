# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official website for SV Viktoria Wertheim football club, built with Next.js 15, TypeScript, Tailwind CSS, and Supabase. The project runs both locally and in production using Docker containers.

## Core Commands

### Development
```bash
# Start local development (Next.js + Supabase)
docker-compose up -d     # Start Supabase
pnpm run dev            # Start Next.js with Turbopack

# Stop local services
docker-compose down
```

### Build & Test
```bash
pnpm run build      # Production build (automatically sets NODE_ENV=production)
pnpm run lint       # Run ESLint
pnpm run typecheck  # TypeScript type checking
```

### Database Operations
```bash
# Migration commands
./scripts/db-migrate.sh create <name>  # Create new migration
./scripts/db-migrate.sh status          # Check migration status
./scripts/db-migrate.sh up             # Apply migrations locally
./scripts/db-migrate.sh deploy         # Deploy to production
./scripts/db-migrate.sh export         # Export production schema

# Sync and backup commands
./scripts/db-sync.sh                   # Sync database
./scripts/backup-database.sh           # Create database backup
./scripts/rotate-backups.sh            # Rotate old backups
```

### Production Deployment
```bash
# Automatic deployment (preferred)
git push origin main  # Triggers GitHub Actions workflow

# Manual deployment to VPS
./deploy-vps.sh  # Direct deployment script

# Check deployment status
# Go to: https://github.com/headonpro/viktoria-wertheim/actions
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15.5.2 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion for animations
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Database**: PostgreSQL 15 (via Supabase)
- **Email**: Nodemailer for contact form
- **Icons**: Tabler Icons, Lucide React
- **Deployment**: Docker containers on VPS (91.98.117.169)
- **CI/CD**: GitHub Actions (automatic on push to main)

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
- `docker-compose.supabase.yml` - Local Supabase stack (17KB, full Supabase services)
- `docker-compose.production.yml` - Production deployment config
- `docker-compose.frontend.yml` - Frontend-only deployment
- `middleware.ts` - Security headers (CSP, HSTS), auth protection, rate limiting
- `.env.local` - Local environment variables
- `.env.production` - Production environment (never commit)
- `deploy-vps.sh` - Manual VPS deployment script
- `.github/workflows/deploy-vps.yml` - GitHub Actions deployment workflow

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

### Local Development Setup
1. Start Supabase: `docker-compose -f docker-compose.supabase.yml up -d`
2. Wait for health checks: `docker ps | grep supabase`
3. Start Next.js: `pnpm run dev`
4. Access app: `http://localhost:3000`
5. Access Supabase Studio: `http://localhost:54323`

### Admin Area Access
- Admin login: `/auth/login`
- Admin routes: `/admin/*` (protected by middleware)
- Authorized via `ADMIN_EMAILS` environment variable

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
5. Team-specific logic in `src/lib/teams/`
6. Rate limiting config in `src/config/rate-limits.ts`
7. Custom hooks in `src/hooks/`

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

- **CSP Headers**: Configured in `middleware.ts` with strict policies
- **Rate Limiting**: Per-route limits (60 req/min default, configurable)
- **Authentication**: Supabase Auth with JWT tokens
- **Admin Protection**: Middleware-enforced auth for `/admin/*` routes
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, HSTS
- **Environment Isolation**: Separate `.env.local` and `.env.production`
- **Network Security**: Internal Docker networks for database
- **CORS**: Configured via Kong API Gateway in production

## Troubleshooting

### Common Issues

1. **Supabase connection errors**: Check if Docker containers are running
2. **Build failures**: Ensure `NODE_ENV=production` for production builds
3. **Auth issues**: Verify Supabase keys and admin emails in environment
4. **Database errors**: Check migration status and PostgreSQL logs

### Debug Commands
```bash
# Container logs
docker logs supabase-db --tail 50
docker logs viktoria-web --tail 50
docker logs -f viktoria-web  # Follow logs in real-time

# Database access
docker exec -it supabase-db psql -U postgres

# Network inspection
docker network ls
docker network inspect supabase_default  # Local
docker network inspect viktoria-network   # Production

# Container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# API health check
curl http://localhost:3000/api/health  # Local
curl https://viktoria.headon.pro/api/health  # Production
```

## Important Notes

- Always use `pnpm` for package management
- Production deployments are zero-downtime via Docker
- Supabase Studio is available at port 54323 (local only)
- Test database migrations locally before deploying
- Keep `.env.production` secure and never commit it
- GitHub Actions secrets required: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`
- Production URL: https://viktoria.headon.pro
- Always run `pnpm run lint` and `pnpm run typecheck` before committing