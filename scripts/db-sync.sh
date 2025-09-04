#!/bin/bash

# Database Sync Script
# This script exports the local database and imports it to production
# Used in CI/CD pipeline to keep databases in sync

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/supabase/data-sync"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "📦 Exporting local database data..."

# Find the correct container name
DB_CONTAINER=$(docker ps --format "{{.Names}}" | grep -E "supabase.*db" | head -1)

if [ -z "$DB_CONTAINER" ]; then
    echo "❌ Error: No Supabase database container found!"
    echo "   Make sure Supabase is running: docker-compose -f docker-compose.supabase.yml up -d"
    exit 1
fi

echo "🔍 Using database container: $DB_CONTAINER"

# Export all tables with data (excluding system tables)
TABLES="teams players matches news sponsors contacts newsletter_subscribers youth_teams scorers league_standings"

for TABLE in $TABLES; do
    echo "  Exporting $TABLE..."
    
    # Check if table has any data
    ROW_COUNT=$(docker exec $DB_CONTAINER psql -U postgres -t -c "SELECT COUNT(*) FROM $TABLE;" | tr -d ' ')
    
    if [ "$ROW_COUNT" -gt 0 ]; then
        echo "    Found $ROW_COUNT rows in $TABLE"
        
        # First add TRUNCATE command, then export data
        echo "-- Sync data for $TABLE" > "$BACKUP_DIR/$TABLE.sql"
        echo "TRUNCATE TABLE $TABLE CASCADE;" >> "$BACKUP_DIR/$TABLE.sql"
        
        # Export the actual data
        docker exec $DB_CONTAINER pg_dump -U postgres \
            --table="$TABLE" \
            --data-only \
            --no-owner \
            --no-privileges \
            --inserts \
            --column-inserts \
            postgres >> "$BACKUP_DIR/$TABLE.sql"
        
        echo "    ✅ Exported $ROW_COUNT rows"
    else
        echo "    ⚠️  No data in $TABLE, creating empty sync file"
        echo "-- No data to sync for $TABLE" > "$BACKUP_DIR/$TABLE.sql"
        echo "TRUNCATE TABLE $TABLE CASCADE;" >> "$BACKUP_DIR/$TABLE.sql"
    fi
done

echo "✅ Export complete!"
echo "📁 Data saved to: $BACKUP_DIR"

# Show summary
echo ""
echo "📊 Export Summary:"
for TABLE in $TABLES; do
    if [ -f "$BACKUP_DIR/$TABLE.sql" ]; then
        FILE_SIZE=$(ls -lh "$BACKUP_DIR/$TABLE.sql" | awk '{print $5}')
        echo "   - $TABLE.sql: $FILE_SIZE"
    fi
done