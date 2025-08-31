# Suggested Commands for Development

## Development Server
```bash
pnpm run dev          # Start dev server with Turbopack at http://localhost:3000
```

## Build & Production
```bash
pnpm run build        # Production build with Turbopack
pnpm run start        # Start production server
```

## Code Quality
```bash
pnpm run lint         # Run ESLint
pnpm tsc --noEmit     # Check TypeScript types without emitting files
```

## Package Management
```bash
pnpm install          # Install dependencies
pnpm add <package>    # Add new dependency
pnpm remove <package> # Remove dependency
```

## Docker & Supabase
```bash
# Start Supabase services
cd supabase && npx supabase start

# Stop Supabase services
cd supabase && npx supabase stop

# Database backup
docker exec supabase-db pg_dump -U postgres postgres > backup.sql

# Database restore
cat backup.sql | docker exec -i supabase-db psql -U postgres postgres

# Check Docker containers
docker ps
docker logs supabase-db
```

## Git Commands
```bash
git status            # Check current changes
git add .             # Stage all changes
git commit -m "msg"   # Commit changes
git push              # Push to remote
git pull              # Pull latest changes
```

## System Commands (Linux)
```bash
ls -la               # List files with details
cd <directory>       # Change directory
grep -r "pattern" .  # Search for pattern in files
find . -name "*.tsx" # Find files by pattern
```

## Testing Environment Variables
```bash
# Check if .env.local exists and has correct values
cat .env.local
```