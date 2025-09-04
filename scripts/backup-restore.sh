#!/bin/bash

# PostgreSQL Backup Restore Script
# Restores a database backup with safety checks

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_ROOT}/backups"
DB_CONTAINER="supabase-db"
DB_NAME="postgres"
DB_USER="postgres"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to list available backups
list_backups() {
    echo "Available backups:"
    echo ""
    
    if [ -d "${BACKUP_DIR}/daily" ] && [ "$(ls -A ${BACKUP_DIR}/daily 2>/dev/null)" ]; then
        echo "📅 Daily backups:"
        ls -1t "${BACKUP_DIR}/daily" | head -10 | nl
    fi
    
    if [ -d "${BACKUP_DIR}/weekly" ] && [ "$(ls -A ${BACKUP_DIR}/weekly 2>/dev/null)" ]; then
        echo ""
        echo "📅 Weekly backups:"
        ls -1t "${BACKUP_DIR}/weekly" | nl
    fi
    
    if [ -d "${BACKUP_DIR}/monthly" ] && [ "$(ls -A ${BACKUP_DIR}/monthly 2>/dev/null)" ]; then
        echo ""
        echo "📅 Monthly backups:"
        ls -1t "${BACKUP_DIR}/monthly" | nl
    fi
}

# Check arguments
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}Usage: $0 <backup-file> [--force]${NC}"
    echo ""
    list_backups
    echo ""
    echo "Example:"
    echo "  $0 daily/backup_20250905_120000.sql.gz"
    echo "  $0 weekly/backup_week_20250901_000000.sql.gz --force"
    exit 1
fi

BACKUP_FILE="$1"
FORCE_RESTORE="${2:-}"

# Check if backup file exists
if [ ! -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo -e "${RED}Error: Backup file not found: ${BACKUP_DIR}/${BACKUP_FILE}${NC}"
    echo ""
    list_backups
    exit 1
fi

# Check if container is running
if ! docker ps | grep -q "${DB_CONTAINER}"; then
    echo -e "${RED}Error: Database container '${DB_CONTAINER}' is not running!${NC}"
    echo "Please start the container first with: docker-compose up -d"
    exit 1
fi

# Warning and confirmation
echo -e "${YELLOW}⚠️  WARNING: This will REPLACE ALL DATA in the database!${NC}"
echo ""
echo "Backup to restore: ${BACKUP_FILE}"
echo "Target database: ${DB_NAME} in container ${DB_CONTAINER}"
echo ""

if [ "${FORCE_RESTORE}" != "--force" ]; then
    echo -e "${YELLOW}Are you sure you want to restore this backup? (yes/no)${NC}"
    read -r CONFIRM
    if [ "${CONFIRM}" != "yes" ]; then
        echo "Restore cancelled."
        exit 0
    fi
fi

# Create emergency backup before restore
echo ""
echo "Creating emergency backup before restore..."
EMERGENCY_BACKUP="${BACKUP_DIR}/emergency/restore_backup_$(date +%Y%m%d_%H%M%S).sql.gz"
mkdir -p "${BACKUP_DIR}/emergency"
docker exec "${DB_CONTAINER}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" --no-owner --no-acl | gzip > "${EMERGENCY_BACKUP}"
echo -e "${GREEN}✅ Emergency backup created: ${EMERGENCY_BACKUP}${NC}"

# Prepare backup file
echo ""
echo "Preparing backup file..."
TEMP_SQL="/tmp/restore_$(date +%Y%m%d_%H%M%S).sql"

if [[ "${BACKUP_FILE}" == *.gz ]]; then
    echo "Decompressing backup..."
    gunzip -c "${BACKUP_DIR}/${BACKUP_FILE}" > "${TEMP_SQL}"
else
    cp "${BACKUP_DIR}/${BACKUP_FILE}" "${TEMP_SQL}"
fi

# Stop connections to database
echo ""
echo "Terminating existing database connections..."
docker exec "${DB_CONTAINER}" psql -U "${DB_USER}" -d postgres -c "
    SELECT pg_terminate_backend(pid) 
    FROM pg_stat_activity 
    WHERE datname = '${DB_NAME}' 
    AND pid <> pg_backend_pid();" > /dev/null 2>&1 || true

# Restore backup
echo ""
echo "Restoring backup..."
echo -e "${YELLOW}This may take a few minutes...${NC}"

# Use cat to pipe the SQL file into docker exec
cat "${TEMP_SQL}" | docker exec -i "${DB_CONTAINER}" psql -U "${DB_USER}" -d postgres > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup restored successfully!${NC}"
    
    # Apply migrations to ensure schema is up-to-date
    echo ""
    echo "Applying migrations..."
    for migration in "${PROJECT_ROOT}"/supabase/migrations/*.sql; do
        if [ -f "${migration}" ]; then
            filename=$(basename "${migration}")
            echo "  Applying: ${filename}"
            docker exec -i "${DB_CONTAINER}" psql -U "${DB_USER}" -d "${DB_NAME}" < "${migration}" 2>&1 || echo "  ⚠️  Migration may have already been applied"
        fi
    done
    
    # Fix primary keys (our workaround migration)
    echo ""
    echo "Ensuring primary keys are intact..."
    if [ -f "${PROJECT_ROOT}/supabase/migrations/20250905002153_fix_missing_primary_keys.sql" ]; then
        docker exec -i "${DB_CONTAINER}" psql -U "${DB_USER}" -d "${DB_NAME}" < "${PROJECT_ROOT}/supabase/migrations/20250905002153_fix_missing_primary_keys.sql" 2>&1 || true
    fi
    
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}Restore completed successfully!${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "Emergency backup saved at: ${EMERGENCY_BACKUP}"
    echo "(You can delete it if everything works correctly)"
else
    echo -e "${RED}❌ Restore failed!${NC}"
    echo ""
    echo "Attempting to restore emergency backup..."
    gunzip -c "${EMERGENCY_BACKUP}" | docker exec -i "${DB_CONTAINER}" psql -U "${DB_USER}" -d postgres
    echo -e "${YELLOW}Emergency backup restored. Please check the error messages above.${NC}"
    exit 1
fi

# Cleanup
rm -f "${TEMP_SQL}"

exit 0