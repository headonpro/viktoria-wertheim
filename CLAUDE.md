# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official website for SV Viktoria Wertheim football club, built with Next.js 15, TypeScript, Tailwind CSS, and Supabase Cloud. The project uses Supabase Cloud for production database and local Supabase stack for development.

## Core Commands

### Development
```bash
# Start local development (with local Supabase + AI)
docker-compose --profile dev up -d     # Start local Supabase stack
cd viktoria-ai && docker-compose up -d # Start AI service (Ollama + Llama 3.2)
pnpm run dev                          # Start Next.js with Turbopack

# Stop local services
docker-compose --profile dev down
cd viktoria-ai && docker-compose down

# Alternative: Use production Supabase Cloud directly
pnpm run dev  # Uses .env with cloud credentials
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
- **Backend**: Supabase Cloud (Auth, Database, Storage, Realtime)
- **Database**: PostgreSQL 15 (Supabase Cloud - hosted in EU)
- **Email**: Nodemailer for contact form
- **Icons**: Tabler Icons, Lucide React
- **Deployment**: Docker container on VPS (91.98.117.169) - Frontend only
- **CI/CD**: GitHub Actions (automatic deployment on push to main)

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
- `docker-compose.yml` - Local Supabase stack for development (profiles: dev, prod, all)
- `Dockerfile` - Production build for Next.js frontend
- `middleware.ts` - Security headers (CSP, HSTS), auth protection, rate limiting
- `.env` - Local development environment
- `.env.production` - Production environment (uses Supabase Cloud - never commit)
- `deploy.sh` - Deployment script (dev/prod modes)
- `.github/workflows/deploy-vps.yml` - GitHub Actions deployment workflow

## Environment Configuration

### Required Environment Variables

#### Production (Supabase Cloud)
```bash
# Supabase Cloud credentials
NEXT_PUBLIC_SUPABASE_URL=https://oijvttaznvcexbznvaiv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<cloud-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<cloud-service-key>
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

# Email (for contact form)
EMAIL_USER=
EMAIL_PASS=

# Admin
ADMIN_EMAILS=            # Comma-separated admin emails
NEXT_PUBLIC_APP_URL=https://viktoria.headon.pro
```

#### Local Development (Local Supabase)
```bash
# Local Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-key>
DATABASE_URL=postgresql://postgres:postgres2025viktoria@localhost:5432/postgres
```

## Development Workflow

### Local Development Setup

#### Option 1: Local Supabase Stack (Recommended)
1. Start Supabase: `docker-compose --profile dev up -d`
2. Wait for health checks: `docker ps | grep supabase`
3. Start Next.js: `pnpm run dev`
4. Access app: `http://localhost:3000`
5. Access Supabase Studio: `http://localhost:54323`

#### Option 2: Use Supabase Cloud
1. Update `.env` with Supabase Cloud credentials
2. Start Next.js: `pnpm run dev`
3. Access app: `http://localhost:3000`
4. Manage database at: https://supabase.com/dashboard

### Admin Area Access
- Admin login: `/auth/login`
- Admin routes: `/admin/*` (protected by middleware)
- Authorized via `ADMIN_EMAILS` environment variable

### Database Changes

#### Using Supabase Cloud Dashboard (Recommended)
1. Go to: https://supabase.com/dashboard/project/oijvttaznvcexbznvaiv
2. Use SQL Editor for schema changes
3. Save important migrations in `supabase/migrations/`

#### Using Migration Scripts
1. Create migration file: `supabase/migrations/[timestamp]_[name].sql`
2. Test locally: Apply to local Supabase stack
3. Deploy to production: Apply via Supabase Dashboard SQL Editor

### Adding New Features
1. Components go in `src/components/` or page-specific directories
2. API routes in `src/app/api/`
3. Database types in `src/lib/database.types.ts`
4. Supabase queries use clients from `src/lib/supabase/`
5. Team-specific logic in `src/lib/teams/`
6. Rate limiting config in `src/config/rate-limits.ts`
7. Custom hooks in `src/hooks/`

## Production Infrastructure

### Production Infrastructure

#### VPS Docker Services
- `viktoria-web` - Next.js application (port 8001) - Frontend only

#### Supabase Cloud Services
- **Database**: PostgreSQL 15 (EU region - Frankfurt)
- **Auth**: Supabase Authentication service
- **Storage**: Supabase Storage for files
- **Realtime**: WebSocket connections for live updates
- **Project URL**: https://oijvttaznvcexbznvaiv.supabase.co

#### Local Development Docker Services (docker-compose.yml)
- `supabase-db` - PostgreSQL database (port 5432)
- `supabase-kong` - API Gateway (port 8000)
- `supabase-auth` - Authentication service
- `supabase-rest` - PostgREST API
- `supabase-realtime` - Realtime subscriptions
- `supabase-storage` - File storage
- `supabase-imgproxy` - Image optimization
- `supabase-meta` - Database introspection
- `supabase-studio` - Admin UI (port 54323)

### VPS Deployment
- **Server**: 91.98.117.169 (root access)
- **Project Path**: `/opt/viktoria/` (simplified path)
- **URL**: https://viktoria.headon.pro
- **Deployment**: Push to GitHub main triggers automatic deployment
- **Architecture**: Frontend on VPS + Supabase Cloud backend

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

1. **Supabase connection errors**: 
   - Local: Check if Docker containers are running (`docker ps`)
   - Production: Verify Supabase Cloud credentials and project status
2. **Build failures**: Ensure `NODE_ENV=production` for production builds
3. **Auth issues**: Verify Supabase keys and admin emails in environment
4. **Database errors**: Check migration status and PostgreSQL logs

### Debug Commands
```bash
# Frontend container logs (VPS)
ssh root@91.98.117.169 "docker logs viktoria-web --tail 50"
ssh root@91.98.117.169 "docker logs -f viktoria-web"  # Follow logs

# Local Supabase logs
docker logs supabase-db --tail 50
docker logs supabase-kong --tail 50
docker logs supabase-auth --tail 50

# Database access
# Local:
docker exec -it supabase-db psql -U postgres
# Production: Use Supabase Dashboard SQL Editor

# Network inspection (local)
docker network ls
docker network inspect viktoria-network

# Container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# API health check
curl http://localhost:3000/api/health  # Local
curl https://viktoria.headon.pro/api/health  # Production
```

## Important Notes

- Always use `pnpm` for package management
- Production uses Supabase Cloud (Frankfurt region) for backend
- Frontend runs as Docker container on VPS
- Supabase Studio: Local at port 54323, Cloud at supabase.com/dashboard
- Test database changes locally before applying to cloud
- Keep `.env.production` secure and never commit it
- GitHub Actions secrets required: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`
- Production URL: https://viktoria.headon.pro
- Supabase Cloud Project: oijvttaznvcexbznvaiv
- Always run `pnpm run lint` and `pnpm run typecheck` before committing