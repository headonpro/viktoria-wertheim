# Task Completion Checklist

## Before Committing Any Changes

### 1. Code Quality Checks
```bash
# Run ESLint to check for code issues
pnpm run lint

# Fix ESLint issues if any
pnpm run lint --fix

# Verify TypeScript types
pnpm tsc --noEmit
```

### 2. Build Verification
```bash
# Ensure production build succeeds
pnpm run build
```

### 3. Testing Checklist
- [ ] Test on development server: `pnpm run dev`
- [ ] Check responsive design:
  - Mobile: 375px width
  - Tablet: 768px width
  - Desktop: 1280px width
- [ ] Verify dark/light theme switching
- [ ] Check German text displays properly (UTF-8)
- [ ] Test all interactive elements
- [ ] Verify animations work smoothly

### 4. Supabase/Database Changes
If database schema was modified:
```bash
# Create migration file
cd supabase && npx supabase migration new <migration_name>

# Apply migrations
npx supabase db push

# Backup database before major changes
docker exec supabase-db pg_dump -U postgres postgres > backup_$(date +%Y%m%d).sql
```

### 5. Environment Variables
- Verify `.env.local` has all required variables
- Check NEXT_PUBLIC_SUPABASE_URL
- Check NEXT_PUBLIC_SUPABASE_ANON_KEY

### 6. Git Commit
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat/fix/chore: description"

# Push to remote
git push
```

### 7. Common Issues to Check
- No console errors in browser
- No TypeScript errors
- No missing imports
- No hardcoded values (use env vars)
- No exposed secrets or API keys
- Components properly marked as 'use client' when needed
- Proper error handling for API calls