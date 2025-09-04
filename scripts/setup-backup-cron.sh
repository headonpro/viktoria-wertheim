#!/bin/bash

# Setup automated backup cron job
# Runs daily at 3:00 AM

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="${SCRIPT_DIR}/backup-automated.sh"
CRON_TIME="0 3 * * *"  # Daily at 3:00 AM

echo "========================================="
echo "Setting up automated backup cron job"
echo "========================================="
echo ""

# Check if backup script exists
if [ ! -f "${BACKUP_SCRIPT}" ]; then
    echo "Error: Backup script not found: ${BACKUP_SCRIPT}"
    exit 1
fi

# Make sure script is executable
chmod +x "${BACKUP_SCRIPT}"

# Check current cron jobs
echo "Current cron jobs for user ${USER}:"
crontab -l 2>/dev/null || echo "  No cron jobs configured"
echo ""

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "${BACKUP_SCRIPT}"; then
    echo "⚠️  Backup cron job already exists!"
    echo ""
    crontab -l | grep "${BACKUP_SCRIPT}"
    echo ""
    echo "Do you want to replace it? (yes/no)"
    read -r CONFIRM
    if [ "${CONFIRM}" != "yes" ]; then
        echo "Setup cancelled."
        exit 0
    fi
    # Remove existing entry
    crontab -l 2>/dev/null | grep -v "${BACKUP_SCRIPT}" | crontab - || true
fi

# Add new cron job
echo "Adding cron job..."
(
    crontab -l 2>/dev/null || true
    echo "${CRON_TIME} ${BACKUP_SCRIPT} >> ${SCRIPT_DIR}/../backups/logs/cron.log 2>&1"
) | crontab -

echo "✅ Cron job added successfully!"
echo ""
echo "Backup schedule: Daily at 3:00 AM"
echo "Backup script: ${BACKUP_SCRIPT}"
echo "Logs: ${SCRIPT_DIR}/../backups/logs/cron.log"
echo ""

# Create initial backup
echo "Do you want to run an initial backup now? (yes/no)"
read -r CONFIRM
if [ "${CONFIRM}" = "yes" ]; then
    echo ""
    echo "Running initial backup..."
    "${BACKUP_SCRIPT}"
fi

echo ""
echo "========================================="
echo "Setup completed!"
echo "========================================="
echo ""
echo "To check cron job status: crontab -l"
echo "To remove cron job: crontab -l | grep -v backup-automated | crontab -"
echo "To view logs: tail -f ${SCRIPT_DIR}/../backups/logs/cron.log"

exit 0