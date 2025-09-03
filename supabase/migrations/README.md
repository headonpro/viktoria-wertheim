# Database Migrations

This directory contains all database migrations for the Viktoria Wertheim project.

## How to create a new migration

1. **Create migration file:**
   ```bash
   npm run db:migrate:create "description-of-change"
   ```

2. **Write your SQL in the generated file**

3. **Test locally:**
   ```bash
   npm run db:migrate:up
   ```

4. **Commit and push** - CI/CD will automatically apply to production

## Migration Naming Convention

Files are named: `YYYYMMDDHHMMSS_description.sql`

## Best Practices

- Always test migrations locally first
- Include both UP and DOWN migrations when possible
- Keep migrations small and focused
- Never modify existing migrations, create new ones instead