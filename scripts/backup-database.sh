#!/bin/bash

# Database Backup Script for Viktoria Wertheim
# Usage: ./scripts/backup-database.sh [environment]

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/backups"
ENVIRONMENT="${1:-local}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Database Backup Script"
echo "====================="
echo ""

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Creating backup directory..."
    mkdir -p "$BACKUP_DIR"
fi

# Determine which database to backup
if [ "$ENVIRONMENT" = "local" ]; then
    echo -e "${YELLOW}Backing up LOCAL database...${NC}"
    CONTAINER_NAME="supabase-db"
    DB_USER="postgres"
    DB_NAME="postgres"
    BACKUP_PREFIX="local"
elif [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}Backing up PRODUCTION database...${NC}"
    CONTAINER_NAME="viktoria-postgres"
    DB_USER="postgres"
    DB_NAME="postgres"
    BACKUP_PREFIX="production"
else
    echo -e "${RED}Error: Unknown environment '$ENVIRONMENT'${NC}"
    echo "Usage: $0 [local|production]"
    exit 1
fi

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo -e "${RED}Error: Container '$CONTAINER_NAME' is not running!${NC}"
    echo "Please start the database container first."
    if [ "$ENVIRONMENT" = "local" ]; then
        echo "Run: docker-compose up -d"
    else
        echo "Run: docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d"
    fi
    exit 1
fi

# Generate backup filename
BACKUP_FILE="${BACKUP_PREFIX}-backup-${TIMESTAMP}.sql"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"
BACKUP_GZ="${BACKUP_PATH}.gz"

echo "Backup configuration:"
echo "  Environment: $ENVIRONMENT"
echo "  Container: $CONTAINER_NAME"
echo "  Database: $DB_NAME"
echo "  Output: $BACKUP_GZ"
echo ""

# Perform the backup
echo "Creating database backup..."
docker exec "$CONTAINER_NAME" pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --verbose \
    --no-owner \
    --no-privileges \
    --exclude-schema=vault \
    --exclude-schema=graphql \
    --exclude-schema=graphql_public \
    > "$BACKUP_PATH" 2>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Database backup failed!${NC}"
    rm -f "$BACKUP_PATH"
    exit 1
fi

# Check if backup file was created and has content
if [ ! -s "$BACKUP_PATH" ]; then
    echo -e "${RED}Error: Backup file is empty!${NC}"
    rm -f "$BACKUP_PATH"
    exit 1
fi

# Get backup size before compression
BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
echo "Backup created successfully (${BACKUP_SIZE})"

# Compress the backup
echo "Compressing backup..."
gzip "$BACKUP_PATH"

if [ ! -f "$BACKUP_GZ" ]; then
    echo -e "${RED}Error: Compression failed!${NC}"
    exit 1
fi

# Get compressed size
COMPRESSED_SIZE=$(du -h "$BACKUP_GZ" | cut -f1)

# Calculate number of tables backed up
TABLE_COUNT=$(gunzip -c "$BACKUP_GZ" | grep -c "CREATE TABLE" || true)

echo ""
echo -e "${GREEN}✅ Backup completed successfully!${NC}"
echo ""
echo "Backup details:"
echo "  File: $BACKUP_GZ"
echo "  Compressed size: $COMPRESSED_SIZE"
echo "  Original size: $BACKUP_SIZE"
echo "  Tables backed up: $TABLE_COUNT"
echo ""

# Show recent backups
echo "Recent backups in $BACKUP_DIR:"
ls -lht "$BACKUP_DIR"/*.sql.gz 2>/dev/null | head -5 || echo "  No backups found"

echo ""
echo "To restore this backup, run:"
echo "  gunzip < $BACKUP_GZ | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME"
echo ""
echo "To rotate old backups, run:"
echo "  ./scripts/rotate-backups.sh"