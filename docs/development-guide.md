# Development Guide - SV Viktoria Wertheim

This comprehensive guide will help you set up and contribute to the SV Viktoria Wertheim website project.

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/headonpro/viktoria-wertheim.git
cd viktoria-wertheim

# 2. Run the automated setup
./scripts/dev-setup.sh

# 3. Start development
./scripts/dev-start.sh
```

That's it! The application will be running at `http://localhost:3000`.

## Project Overview

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Next.js API) │◄──►│   (Supabase)    │
│   Port 3000     │    │   Routes)       │    │   Port 54322    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client        │    │   Service Layer │    │   Auth & Storage│
│   Components    │    │   Business Logic│    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | Next.js | 15.5.2 | React framework with App Router |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **UI Components** | Custom + Headless UI | - | Accessible UI components |
| **Backend** | Next.js API Routes | 15.5.2 | REST API endpoints |
| **Database** | PostgreSQL | 15 | Relational database |
| **Auth & Backend** | Supabase | Latest | Authentication, real-time, storage |
| **Email** | Nodemailer | Latest | Contact form emails |
| **Deployment** | Docker | Latest | Containerized deployment |

## Development Environment

### Prerequisites

- **Node.js**: v22.18.0 (managed with NVM)
- **pnpm**: v9.15.3 (preferred package manager)
- **Docker**: v27.5.1+ with Compose
- **Git**: v2.43.0+

### Environment Setup

#### Automated Setup (Recommended)

```bash
./scripts/dev-setup.sh
```

This script will:
- ✅ Check system requirements
- ✅ Create environment configuration
- ✅ Install dependencies
- ✅ Set up local database
- ✅ Configure Git hooks
- ✅ Create development scripts
- ✅ Configure VS Code

#### Manual Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start Database**
   ```bash
   docker compose -f docker-compose.supabase.yml up -d
   ```

4. **Apply Migrations**
   ```bash
   ./scripts/db-migrate.sh up
   ```

### Development Workflow

#### Starting Development

```bash
# Option 1: All-in-one start
./scripts/dev-start.sh

# Option 2: Manual start
docker compose -f docker-compose.supabase.yml up -d
pnpm run dev
```

#### Daily Development Commands

```bash
# Type checking
pnpm run typecheck

# Linting
pnpm run lint

# Build for production
pnpm run build

# Database operations
./scripts/db-migrate.sh status     # Check migrations
./scripts/db-migrate.sh up         # Apply migrations
./scripts/dev-reset.sh             # Reset database
```

#### Stopping Development

```bash
./scripts/dev-stop.sh
```

## Code Organization

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin dashboard (protected)
│   ├── api/               # API routes
│   │   ├── teams/         # Teams CRUD
│   │   ├── news/          # News CRUD
│   │   ├── contact/       # Contact form
│   │   └── health/        # Health check
│   ├── auth/              # Authentication pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── api/              # API utilities
│   │   ├── types.ts      # API type definitions
│   │   ├── errors.ts     # Error handling
│   │   ├── validation.ts # Input validation
│   │   └── middleware.ts # API middleware
│   ├── services/         # Business logic layer
│   │   ├── base.service.ts    # Base CRUD service
│   │   ├── team.service.ts    # Team operations
│   │   ├── news.service.ts    # News operations
│   │   └── contact.service.ts # Contact form
│   ├── supabase/         # Supabase configuration
│   │   ├── client.ts     # Client-side client
│   │   └── server.ts     # Server-side client
│   └── utils/            # Utility functions
└── hooks/                # Custom React hooks
```

### Configuration Files

```
├── docker-compose.supabase.yml   # Local Supabase stack
├── middleware.ts                 # Security & auth middleware
├── tailwind.config.js           # Tailwind CSS config
├── tsconfig.json               # TypeScript config
├── eslint.config.js            # ESLint config
└── next.config.js              # Next.js config
```

## API Development

### Service Layer Pattern

All business logic is organized in the service layer:

```typescript
// Example: Team Service
export class TeamService extends BaseService<Team> {
  async findAll(pagination = {}, filters = {}) {
    // Business logic for fetching teams
    return { data: teams, total: count }
  }
  
  async create(data: CreateTeamData) {
    // Validation and creation logic
    return this.validateAndCreate(data)
  }
}

// Usage in API route
export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    const { data, total } = await teamService.findAll(
      getPaginationParams(request),
      getFilterParams(request)
    )
    
    return formatSuccessResponse(data, { total })
  })
}
```

### API Endpoints

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/health` | GET | System health check | No |
| `/api/teams` | GET, POST | Teams CRUD | POST: Yes |
| `/api/teams/[id]` | GET, PUT, DELETE | Team by ID | PUT/DELETE: Yes |
| `/api/news` | GET, POST | News CRUD | POST: Yes |
| `/api/news/[id]` | GET, PUT, DELETE | News by ID | PUT/DELETE: Yes |
| `/api/news/[id]/view` | POST | Increment view count | No |
| `/api/contact` | POST | Contact form submission | No |

### Error Handling

All APIs use structured error responses:

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-09-05T00:00:00.000Z",
    "page": 1,
    "total": 100
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name ist erforderlich",
    "details": { ... }
  }
}
```

## Database Management

### Migrations

```bash
# Create new migration
./scripts/db-migrate.sh create add_user_preferences

# Check migration status
./scripts/db-migrate.sh status

# Apply migrations locally
./scripts/db-migrate.sh up

# Deploy to production
./scripts/db-migrate.sh deploy
```

### Schema

Key tables:
- `teams` - Football teams information
- `players` - Player roster
- `news` - News articles with view tracking
- `matches` - Match schedule and results

### Data Sync

```bash
# Sync development data
./scripts/db-sync.sh

# Create backup
./scripts/backup-database.sh local
```

## Frontend Development

### Component Guidelines

1. **Use TypeScript** for all components
2. **Follow naming conventions**: PascalCase for components
3. **Use Tailwind CSS** for styling
4. **Implement responsive design** (mobile-first)
5. **Add proper error handling** and loading states

```tsx
// Example Component Structure
interface TeamCardProps {
  team: Team
  showStats?: boolean
}

export function TeamCard({ team, showStats = false }: TeamCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-900">{team.name}</h3>
      <p className="text-gray-600">{team.league}</p>
      
      {showStats && (
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-500">
            Players: {team.playerCount}
          </div>
        </div>
      )}
    </div>
  )
}
```

### State Management

- **Server State**: Use React Query for API calls
- **Client State**: Use React's built-in state management
- **Form State**: Use React Hook Form for complex forms

### Routing

- **App Router**: All routes in `src/app/`
- **Protected Routes**: Use middleware for auth
- **Dynamic Routes**: Use `[param]` syntax

## Testing

### Testing Strategy

1. **Type Safety**: TypeScript for compile-time checks
2. **Linting**: ESLint for code quality
3. **Build Tests**: Ensure production builds succeed
4. **Manual Testing**: Test critical paths manually

### Running Tests

```bash
# Type checking
pnpm run typecheck

# Linting
pnpm run lint

# Build test
pnpm run build

# API health check
curl http://localhost:3000/api/health
```

## Deployment

### Environments

- **Development**: Local with Docker Compose
- **Production**: VPS with Docker containers

### Automated Deployment

Push to `main` branch triggers GitHub Actions:

1. **Tests & Quality Checks**
2. **Security Scanning**
3. **Database Migrations**
4. **Blue-Green Deployment**
5. **Health Verification**

### Manual Deployment

```bash
# Direct VPS deployment
./deploy-vps.sh

# Check deployment status
curl https://viktoria.headon.pro/api/health
```

## Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(api): add news article endpoints
fix(ui): resolve mobile navigation issue
docs(readme): update development setup
```

### Pre-commit Hooks

Automatically runs:
- TypeScript type checking
- ESLint linting
- Forbidden pattern checks

## Monitoring & Maintenance

### Health Monitoring

```bash
# Manual health check
./scripts/health-monitor.sh

# View monitoring dashboard
./scripts/monitoring-dashboard.sh
```

### Automated Monitoring

- Health checks every 5 minutes
- Daily database backups
- Weekly cleanup routines
- SSL certificate monitoring

### Logs

```bash
# Application logs
docker logs viktoria-frontend

# Database logs  
docker logs supabase-db

# Health monitoring logs
tail -f /var/log/viktoria/health-monitor.log
```

## Troubleshooting

### Common Issues

#### Database Connection Issues

```bash
# Check if containers are running
docker ps | grep -E "(viktoria|supabase)"

# Restart Supabase
docker compose -f docker-compose.supabase.yml down
docker compose -f docker-compose.supabase.yml up -d
```

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clean install dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check TypeScript errors
pnpm run typecheck
```

#### Port Conflicts

```bash
# Check what's using ports
lsof -i :3000
lsof -i :54321

# Kill processes if needed
pkill -f "next dev"
```

### Getting Help

1. Check this documentation
2. Review CLAUDE.md for project-specific instructions
3. Check API documentation in `docs/api-documentation.md`
4. Review recent commits for similar changes
5. Check GitHub Issues for known problems

## Contributing

### Pull Request Process

1. Create feature branch from `develop`
2. Implement changes with tests
3. Update documentation if needed
4. Submit PR with clear description
5. Address review feedback
6. Merge after approval

### Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Components are responsive and accessible
- [ ] API endpoints follow REST conventions
- [ ] Error handling is implemented
- [ ] Documentation is updated
- [ ] No console.log or debugger statements
- [ ] Environment variables are not hardcoded

## Resources

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Project-Specific Documents

- `CLAUDE.md` - Claude Code instructions
- `docs/api-documentation.md` - API reference
- `README.md` - Project overview
- `.github/workflows/` - CI/CD configuration

---

**Happy coding! ⚽🚀**

*This guide is maintained by the development team. Please keep it updated as the project evolves.*