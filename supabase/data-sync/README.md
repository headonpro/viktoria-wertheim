# Database Data Sync

This folder contains the current state of all database data that will be synchronized to production on each deployment.

## How it works

1. **Before committing changes**, run:
   ```bash
   npm run db:sync
   ```
   This exports all current local database data to SQL files.

2. **Commit and push** - The CI/CD pipeline will automatically:
   - Import all data files to production
   - Replace existing data with the new data

## Important Notes

⚠️ **WARNING**: This replaces ALL data in production with your local data!

- Always run `npm run db:sync` before pushing if you've made data changes
- The sync happens automatically during deployment
- All tables are synced completely (not incremental)

## Files

Each `.sql` file contains the complete data for one table:
- `teams.sql` - All teams
- `players.sql` - All players  
- `scorers.sql` - All scorers (Torschützenliste)
- `matches.sql` - All matches
- `news.sql` - All news articles
- etc.

## Workflow

1. Make changes locally (add scorers, update teams, etc.)
2. Test locally to ensure everything works
3. Run `npm run db:sync` to export data
4. Commit all changes including data-sync files
5. Push to main branch
6. CI/CD automatically syncs to production