# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Official website for SV Viktoria Wertheim football club. Production-ready Next.js 15 application using Supabase Cloud for both development and production, featuring real-time updates, admin dashboard, and AI-powered content generation.

## Critical Commands

### Development
```bash
# Start local development (uses Supabase Cloud)
pnpm run dev                           # Start Next.js with Turbopack

# Optional: Start local Supabase stack (for testing migrations)
docker-compose --profile dev up -d     # Local Supabase for migration testing
docker-compose --profile dev down      # Stop local services
```

### Build & Quality Checks (ALWAYS run before committing)
```bash
pnpm run build      # Production build (NODE_ENV=production)
pnpm run lint       # ESLint checks
pnpm run typecheck  # TypeScript type checking
```

### Database Operations
```bash
./scripts/db-migrate.sh create <name>  # Create new migration
./scripts/db-migrate.sh up             # Apply migrations locally
./scripts/db-migrate.sh deploy         # Deploy to production
./scripts/backup-database.sh           # Create database backup
```

### Deployment
```bash
git push origin main  # Triggers automatic GitHub Actions deployment
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15.5.2 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4, Framer Motion
- **Backend**: Supabase Cloud (PostgreSQL 15, Auth, Storage, Realtime)
- **Deployment**: Docker on VPS (91.98.117.169) + Supabase Cloud
- **AI Service**: Local Ollama with Llama 3.2 (viktoria-ai/)

### Project Structure
```
src/
├── app/              # Next.js app router
│   ├── admin/        # Protected admin dashboard
│   ├── api/          # API routes (including AI endpoints)
│   └── auth/         # Authentication pages
├── components/       # Reusable React components
├── lib/              
│   ├── ai/           # AI service integration
│   ├── supabase/     # Database clients (server/client/service)
│   ├── services/     # Business logic services
│   └── teams/        # Team-specific configurations
├── hooks/            # Custom React hooks
└── config/           # Rate limiting and app config
```

### Key Configuration Files
- `docker-compose.yml` - Multi-profile Docker setup (dev/prod/all)
- `middleware.ts` - Security headers, rate limiting, auth protection
- `.github/workflows/deploy-vps.yml` - Automated deployment pipeline
- `supabase/migrations/` - Database schema migrations

## Environment Variables

### Both Development & Production (Supabase Cloud)
```bash
# Same Supabase Cloud instance for dev and prod
NEXT_PUBLIC_SUPABASE_URL=https://vbumolcclqrhfqiofvcz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<cloud-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<cloud-service-key>
DATABASE_URL=postgresql://postgres.vbumolcclqrhfqiofvcz:<password>@aws-1-eu-central-1.pooler.supabase.com:6543/postgres

# Production-specific
NEXT_PUBLIC_APP_URL=https://viktoria.headon.pro
NODE_ENV=production

# Email configuration
ADMIN_EMAILS=<comma-separated-admin-emails>
EMAIL_USER=<smtp-user>
EMAIL_PASS=<smtp-password>
```

## Development Workflow

### Setting Up Local Environment
1. Install dependencies: `pnpm install`
2. Configure `.env` with Supabase Cloud credentials
3. Start development: `pnpm run dev`
4. Access: http://localhost:3000
5. Manage database: https://supabase.com/dashboard/project/vbumolcclqrhfqiofvcz

### Database Changes
1. Make changes via Supabase Dashboard SQL Editor: https://supabase.com/dashboard/project/vbumolcclqrhfqiofvcz/editor
2. Save SQL as migration file: `supabase/migrations/[timestamp]_[name].sql`
3. Test changes in development before applying to production data

### Adding Features
- React components: `src/components/` or feature-specific directories
- API endpoints: `src/app/api/[endpoint]/route.ts`
- Database queries: Use appropriate client from `src/lib/supabase/`
- Business logic: `src/lib/services/`
- Type definitions: Update `src/lib/database.types.ts`

## Production Infrastructure

### Deployment Architecture
- **Frontend**: VPS Docker container (91.98.117.169:8001)
- **Backend**: Supabase Cloud (Frankfurt region)
- **URL**: https://viktoria.headon.pro
- **CI/CD**: GitHub Actions (auto-deploy on main push)

### Required GitHub Secrets
- `VPS_HOST`: 91.98.117.169
- `VPS_USER`: root
- `VPS_SSH_KEY`: SSH private key for deployment
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key
- `EMAIL_USER`, `EMAIL_PASS`: SMTP credentials

### Monitoring & Debugging
```bash
# VPS container logs
ssh root@91.98.117.169 "docker logs viktoria-web --tail 50"

# Local Supabase logs
docker logs supabase-db --tail 50
docker logs supabase-kong --tail 50

# Health checks
curl https://viktoria.headon.pro/api/health
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## Security Features

- **Middleware Protection**: Rate limiting (60 req/min default), CSRF protection
- **CSP Headers**: Strict Content Security Policy
- **Authentication**: Supabase Auth with JWT, admin email whitelist
- **HTTPS Only**: HSTS headers in production
- **Protected Routes**: `/admin/*` requires authentication

## AI Integration

### Local AI Service (viktoria-ai/)
- **Stack**: Ollama + Llama 3.2
- **Endpoints**: `/api/ai/chat`, `/api/ai/complete`
- **Components**: `VereinsAssistent.tsx` - AI chat interface
- **Service**: `src/lib/services/ai.service.ts`

### Usage
```bash
cd viktoria-ai && docker-compose up -d  # Start AI service
# Access at http://localhost:11434
```

## Important Guidelines

1. **Always use pnpm** for package management
2. **Run quality checks** before committing: `pnpm run lint && pnpm run typecheck`
3. **Same database** for dev and prod - be careful with data modifications
4. **Never commit** `.env` or `.env.production` files with real keys
5. **Use appropriate Supabase client**:
   - `createClient()` for client components
   - `createServerClient()` for server components/API routes
   - `createServiceClient()` for admin operations
6. **Follow existing patterns** for components, API routes, and database queries
7. **Update types** in `database.types.ts` when changing schema
8. **Test database changes** carefully since dev and prod share the same Supabase Cloud instance