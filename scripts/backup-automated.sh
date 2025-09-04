#!/bin/bash

# Automated PostgreSQL Backup Script with Rotation
# Runs daily via cron, keeps last 7 daily, 4 weekly, and 12 monthly backups

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_ROOT}/backups"
DB_CONTAINER="supabase-db"
DB_NAME="postgres"
DB_USER="postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DAY_OF_WEEK=$(date +%u)
DAY_OF_MONTH=$(date +%d)

# Create backup directories
mkdir -p "${BACKUP_DIR}/daily"
mkdir -p "${BACKUP_DIR}/weekly"
mkdir -p "${BACKUP_DIR}/monthly"
mkdir -p "${BACKUP_DIR}/logs"

# Logging
LOG_FILE="${BACKUP_DIR}/logs/backup_${TIMESTAMP}.log"
exec 1> >(tee -a "${LOG_FILE}")
exec 2>&1

echo "========================================="
echo "Starting automated backup: ${TIMESTAMP}"
echo "========================================="

# Check if container is running
if ! docker ps | grep -q "${DB_CONTAINER}"; then
    echo "Error: Database container '${DB_CONTAINER}' is not running!"
    exit 1
fi

# Create backup
BACKUP_FILE="${BACKUP_DIR}/daily/backup_${TIMESTAMP}.sql"
echo "Creating backup: ${BACKUP_FILE}"

docker exec "${DB_CONTAINER}" pg_dump \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    --create \
    --format=plain \
    --verbose > "${BACKUP_FILE}" 2>&1

# Compress backup
gzip "${BACKUP_FILE}"
BACKUP_FILE="${BACKUP_FILE}.gz"
BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "✅ Backup created: ${BACKUP_FILE} (${BACKUP_SIZE})"

# Create weekly backup (on Sundays)
if [ "${DAY_OF_WEEK}" = "7" ]; then
    WEEKLY_BACKUP="${BACKUP_DIR}/weekly/backup_week_${TIMESTAMP}.sql.gz"
    cp "${BACKUP_FILE}" "${WEEKLY_BACKUP}"
    echo "📅 Weekly backup created: ${WEEKLY_BACKUP}"
fi

# Create monthly backup (on 1st of month)
if [ "${DAY_OF_MONTH}" = "01" ]; then
    MONTHLY_BACKUP="${BACKUP_DIR}/monthly/backup_month_${TIMESTAMP}.sql.gz"
    cp "${BACKUP_FILE}" "${MONTHLY_BACKUP}"
    echo "📅 Monthly backup created: ${MONTHLY_BACKUP}"
fi

# Rotation: Keep only last N backups
echo ""
echo "Rotating old backups..."

# Daily: Keep last 7
DAILY_COUNT=$(ls -1 "${BACKUP_DIR}/daily" | wc -l)
if [ "${DAILY_COUNT}" -gt 7 ]; then
    REMOVE_COUNT=$((DAILY_COUNT - 7))
    echo "  Removing ${REMOVE_COUNT} old daily backups"
    ls -1t "${BACKUP_DIR}/daily" | tail -n "${REMOVE_COUNT}" | while read -r file; do
        rm -f "${BACKUP_DIR}/daily/${file}"
        echo "    Deleted: ${file}"
    done
fi

# Weekly: Keep last 4
WEEKLY_COUNT=$(ls -1 "${BACKUP_DIR}/weekly" 2>/dev/null | wc -l)
if [ "${WEEKLY_COUNT}" -gt 4 ]; then
    REMOVE_COUNT=$((WEEKLY_COUNT - 4))
    echo "  Removing ${REMOVE_COUNT} old weekly backups"
    ls -1t "${BACKUP_DIR}/weekly" | tail -n "${REMOVE_COUNT}" | while read -r file; do
        rm -f "${BACKUP_DIR}/weekly/${file}"
        echo "    Deleted: ${file}"
    done
fi

# Monthly: Keep last 12
MONTHLY_COUNT=$(ls -1 "${BACKUP_DIR}/monthly" 2>/dev/null | wc -l)
if [ "${MONTHLY_COUNT}" -gt 12 ]; then
    REMOVE_COUNT=$((MONTHLY_COUNT - 12))
    echo "  Removing ${REMOVE_COUNT} old monthly backups"
    ls -1t "${BACKUP_DIR}/monthly" | tail -n "${REMOVE_COUNT}" | while read -r file; do
        rm -f "${BACKUP_DIR}/monthly/${file}"
        echo "    Deleted: ${file}"
    done
fi

# Log rotation
LOG_COUNT=$(ls -1 "${BACKUP_DIR}/logs" | wc -l)
if [ "${LOG_COUNT}" -gt 30 ]; then
    REMOVE_COUNT=$((LOG_COUNT - 30))
    echo "  Removing ${REMOVE_COUNT} old log files"
    ls -1t "${BACKUP_DIR}/logs" | tail -n "${REMOVE_COUNT}" | while read -r file; do
        rm -f "${BACKUP_DIR}/logs/${file}"
    done
fi

# Verify backup integrity
echo ""
echo "Verifying backup integrity..."
if gunzip -t "${BACKUP_FILE}" 2>/dev/null; then
    echo "✅ Backup integrity verified"
else
    echo "❌ Backup integrity check failed!"
    exit 1
fi

# Summary
echo ""
echo "========================================="
echo "Backup completed successfully!"
echo "Current backups:"
echo "  Daily:   $(ls -1 "${BACKUP_DIR}/daily" 2>/dev/null | wc -l) backups"
echo "  Weekly:  $(ls -1 "${BACKUP_DIR}/weekly" 2>/dev/null | wc -l) backups"
echo "  Monthly: $(ls -1 "${BACKUP_DIR}/monthly" 2>/dev/null | wc -l) backups"
echo "  Total size: $(du -sh "${BACKUP_DIR}" | cut -f1)"
echo "========================================="

exit 0