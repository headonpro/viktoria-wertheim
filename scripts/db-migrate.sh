#!/bin/bash

# Database Migration Script for Viktoria Wertheim
# Usage: ./scripts/db-migrate.sh [command] [options]

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MIGRATIONS_DIR="$PROJECT_ROOT/supabase/migrations"
REMOTE_HOST="${VPS_HOST:-91.98.117.169}"
REMOTE_USER="${VPS_USER:-root}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function print_help() {
    echo "Database Migration Tool"
    echo ""
    echo "Commands:"
    echo "  create <name>    Create a new migration file"
    echo "  status           Show migration status"
    echo "  up               Apply pending migrations locally"
    echo "  deploy           Apply migrations to production"
    echo "  export           Export current database schema"
    echo ""
    echo "Examples:"
    echo "  ./scripts/db-migrate.sh create add-user-profile-table"
    echo "  ./scripts/db-migrate.sh up"
    echo "  ./scripts/db-migrate.sh deploy"
}

function create_migration() {
    local name=$1
    if [ -z "$name" ]; then
        echo -e "${RED}Error: Migration name required${NC}"
        exit 1
    fi

    # Generate timestamp
    timestamp=$(date +"%Y%m%d%H%M%S")
    filename="${timestamp}_${name}.sql"
    filepath="$MIGRATIONS_DIR/$filename"

    # Create migration file
    cat > "$filepath" << EOF
-- Migration: $name
-- Created: $(date)

-- Write your migration SQL here
-- Example:
-- CREATE TABLE new_table (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

EOF

    echo -e "${GREEN}✓ Created migration: $filename${NC}"
    echo "Edit the file at: $filepath"
}

function check_status() {
    echo "Migration files in $MIGRATIONS_DIR:"
    ls -la "$MIGRATIONS_DIR"/*.sql 2>/dev/null || echo "No migrations found"
}

function apply_local() {
    echo -e "${YELLOW}Applying migrations locally...${NC}"
    
    # Check if Supabase is running locally
    if ! docker ps | grep -q supabase-db; then
        echo -e "${RED}Error: Local Supabase database not running${NC}"
        echo "Start it with: docker-compose -f docker-compose.supabase.yml up -d"
        exit 1
    fi

    # Apply each migration
    for migration in "$MIGRATIONS_DIR"/*.sql; do
        if [ -f "$migration" ]; then
            filename=$(basename "$migration")
            echo "Applying: $filename"
            docker exec -i supabase-db psql -U postgres < "$migration"
            echo -e "${GREEN}✓ Applied $filename${NC}"
        fi
    done
}

function deploy_production() {
    echo -e "${YELLOW}Deploying migrations to production...${NC}"
    
    # Copy migrations to server
    echo "Copying migrations to server..."
    ssh "$REMOTE_USER@$REMOTE_HOST" "mkdir -p /tmp/migrations"
    scp "$MIGRATIONS_DIR"/*.sql "$REMOTE_USER@$REMOTE_HOST:/tmp/migrations/"

    # Apply migrations on server
    echo "Applying migrations on production..."
    ssh "$REMOTE_USER@$REMOTE_HOST" << 'ENDSSH'
        for migration in /tmp/migrations/*.sql; do
            if [ -f "$migration" ]; then
                filename=$(basename "$migration")
                echo "Applying: $filename"
                docker exec -i supabase-db psql -U postgres < "$migration"
                echo "✓ Applied $filename"
            fi
        done
        rm -rf /tmp/migrations
ENDSSH

    echo -e "${GREEN}✓ Migrations deployed to production${NC}"
}

function export_schema() {
    echo -e "${YELLOW}Exporting current database schema...${NC}"
    
    # Export from production
    ssh "$REMOTE_USER@$REMOTE_HOST" \
        "docker exec supabase-db pg_dump -U postgres --schema=public --no-owner --no-privileges" \
        > "$PROJECT_ROOT/supabase/schema.sql"
    
    echo -e "${GREEN}✓ Schema exported to supabase/schema.sql${NC}"
}

# Main command handler
case "$1" in
    create)
        create_migration "$2"
        ;;
    status)
        check_status
        ;;
    up)
        apply_local
        ;;
    deploy)
        deploy_production
        ;;
    export)
        export_schema
        ;;
    help|--help|-h)
        print_help
        ;;
    *)
        print_help
        exit 1
        ;;
esac