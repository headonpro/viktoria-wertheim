# Database Migrations Guide

## Overview

This project uses a database migration system that automatically syncs database changes from development to production through the CI/CD pipeline.

## Quick Start

### 1. Create a New Migration

```bash
npm run db:migrate:create "description-of-change"
# Example: npm run db:migrate:create "add-user-profile-table"
```

This creates a timestamped SQL file in `supabase/migrations/`.

### 2. Write Your Migration

Edit the generated file with your SQL changes:

```sql
-- Example: Add a new table
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

### 3. Test Locally (Optional)

If you have a local Supabase instance:

```bash
npm run db:migrate:up
```

### 4. Deploy to Production

Simply commit and push your changes:

```bash
git add .
git commit -m "feat: Add user profiles table"
git push origin main
```

**The CI/CD pipeline will automatically:**
1. Pull your changes to the VPS
2. Apply all pending migrations
3. Rebuild and deploy the application

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:migrate:create <name>` | Create a new migration file |
| `npm run db:migrate:status` | Show all migration files |
| `npm run db:migrate:up` | Apply migrations locally |
| `npm run db:migrate:deploy` | Manually deploy to production |
| `npm run db:export` | Export current production schema |

## Migration Best Practices

### ✅ DO:
- Test migrations locally first when possible
- Keep migrations small and focused
- Include descriptive names
- Add indexes for foreign keys
- Use transactions for multiple related changes
- Include comments explaining complex changes

### ❌ DON'T:
- Modify existing migration files (create new ones instead)
- Delete data without backing up first
- Make breaking changes without a migration plan
- Forget to handle rollback scenarios

## Example Migrations

### Adding a Column
```sql
ALTER TABLE teams 
ADD COLUMN logo_url TEXT;
```

### Creating an Index
```sql
CREATE INDEX idx_matches_date 
ON matches(match_date DESC);
```

### Adding a Constraint
```sql
ALTER TABLE players 
ADD CONSTRAINT unique_player_number 
UNIQUE (team_id, number);
```

### Complex Migration with Transaction
```sql
BEGIN;

-- Add new column
ALTER TABLE news 
ADD COLUMN author_id UUID;

-- Populate with default data
UPDATE news 
SET author_id = (SELECT id FROM contacts WHERE role = 'Webmaster' LIMIT 1);

-- Add foreign key
ALTER TABLE news 
ADD CONSTRAINT fk_news_author 
FOREIGN KEY (author_id) 
REFERENCES contacts(id) ON DELETE SET NULL;

COMMIT;
```

## Troubleshooting

### Migration Failed in Production

1. Check the GitHub Actions logs for errors
2. SSH into the server and check database logs:
   ```bash
   ssh root@91.98.117.169
   docker logs supabase-db --tail 100
   ```

### Rolling Back a Migration

Create a new migration that reverses the changes:

```bash
npm run db:migrate:create "rollback-user-profiles"
```

Then write the rollback SQL:
```sql
DROP TABLE IF EXISTS user_profiles;
```

## Migration Tracking

Currently, migrations are applied sequentially based on filename timestamps. In the future, we may add a migration tracking table to prevent re-running migrations.

## Security Notes

- Never include sensitive data in migration files
- Always use parameterized queries when working with user input
- Test migrations in a staging environment first when possible
- Keep backups before major schema changes