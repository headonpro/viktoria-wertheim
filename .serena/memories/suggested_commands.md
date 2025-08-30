# Development Commands

## Primary Development Commands
```bash
# Install dependencies (use pnpm as primary)
pnpm install

# Start development server with Turbopack
pnpm run dev

# Build for production with Turbopack
pnpm run build

# Start production server
pnpm run start

# Run ESLint for code quality
pnpm run lint
```

## Alternative Package Managers
```bash
# If pnpm is not available
npm run dev
npm run build
npm run start
npm run lint

# Or with yarn
yarn dev
yarn build
yarn start
yarn lint
```

## Docker Commands (if needed)
```bash
# Build Docker image
docker build -t viktoria-wertheim .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Git Commands
```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: description"

# Push to remote
git push origin main
```

## Utility Commands
```bash
# Check TypeScript types
pnpm tsc --noEmit

# Format with Prettier (if configured)
pnpm prettier --write .

# Update dependencies
pnpm update

# Clean install
rm -rf node_modules pnpm-lock.yaml && pnpm install
```

## Development URLs
- Development: http://localhost:3000
- Production: Deploy to Vercel or self-host

## Important Notes
- Always use **pnpm** as the primary package manager
- Development server uses **Turbopack** for faster builds
- Run **lint** before committing code
- Check TypeScript types with `tsc --noEmit` if needed