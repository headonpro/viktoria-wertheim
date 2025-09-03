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

# Export all tables with data (excluding system tables)
TABLES="teams players matches news sponsors contacts newsletter_subscribers youth_teams scorers league_standings"

for TABLE in $TABLES; do
    echo "  Exporting $TABLE..."
    docker exec supabase-db pg_dump -U postgres \
        --table="$TABLE" \
        --data-only \
        --no-owner \
        --no-privileges \
        --inserts \
        --column-inserts \
        > "$BACKUP_DIR/$TABLE.sql"
done

echo "✅ Export complete!"
echo "📁 Data saved to: $BACKUP_DIR"