#!/bin/bash

# Backup Rotation Script for Viktoria Wertheim
# Usage: ./scripts/rotate-backups.sh [--dry-run]

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/backups"
DRY_RUN=false

# Parse arguments
if [ "$1" = "--dry-run" ]; then
    DRY_RUN=true
fi

# Retention policy
DAILY_RETENTION_DAYS=7    # Keep daily backups for 7 days
WEEKLY_RETENTION_WEEKS=4  # Keep weekly backups (Sundays) for 4 weeks

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Backup Rotation Script"
echo "====================="
echo ""

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}DRY RUN MODE - No files will be deleted${NC}"
    echo ""
fi

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${YELLOW}Backup directory does not exist: $BACKUP_DIR${NC}"
    echo "No backups to rotate."
    exit 0
fi

# Change to backup directory
cd "$BACKUP_DIR"

# Count total backups
TOTAL_BACKUPS=$(ls -1 *.sql.gz 2>/dev/null | wc -l)

if [ $TOTAL_BACKUPS -eq 0 ]; then
    echo "No backup files found in $BACKUP_DIR"
    exit 0
fi

echo "Found $TOTAL_BACKUPS backup files"
echo ""

# Initialize counters
KEPT_COUNT=0
DELETED_COUNT=0
DELETED_SIZE=0

# Function to get day of week from filename (0=Sunday, 1=Monday, etc.)
get_day_of_week() {
    local filename=$1
    # Extract date from filename (format: *-backup-YYYYMMDD-HHMMSS.sql.gz)
    local date_part=$(echo "$filename" | sed -n 's/.*-backup-\([0-9]\{8\}\)-.*/\1/p')
    if [ -n "$date_part" ]; then
        # Convert to day of week
        date -d "$date_part" "+%w" 2>/dev/null || echo "-1"
    else
        echo "-1"
    fi
}

# Function to get age in days
get_age_days() {
    local filename=$1
    local file_time=$(stat -c %Y "$filename" 2>/dev/null || stat -f %m "$filename" 2>/dev/null)
    local current_time=$(date +%s)
    local age_seconds=$((current_time - file_time))
    echo $((age_seconds / 86400))
}

# Function to format file size
format_size() {
    local size=$1
    if [ $size -gt 1048576 ]; then
        echo "$((size / 1048576)) MB"
    elif [ $size -gt 1024 ]; then
        echo "$((size / 1024)) KB"
    else
        echo "$size bytes"
    fi
}

echo "Applying retention policy:"
echo "  - Daily backups: Keep for $DAILY_RETENTION_DAYS days"
echo "  - Weekly backups (Sundays): Keep for $WEEKLY_RETENTION_WEEKS weeks"
echo ""

# Process each backup file
for backup_file in *.sql.gz; do
    # Skip if not a file
    [ -f "$backup_file" ] || continue
    
    # Get file age in days
    age_days=$(get_age_days "$backup_file")
    
    # Get day of week (0=Sunday)
    day_of_week=$(get_day_of_week "$backup_file")
    
    # Get file size
    file_size=$(stat -c %s "$backup_file" 2>/dev/null || stat -f %z "$backup_file" 2>/dev/null)
    
    # Determine if file should be kept
    keep_file=false
    reason=""
    
    if [ $age_days -le $DAILY_RETENTION_DAYS ]; then
        # Keep all backups within daily retention period
        keep_file=true
        reason="Within $DAILY_RETENTION_DAYS days"
    elif [ "$day_of_week" = "0" ] && [ $age_days -le $((WEEKLY_RETENTION_WEEKS * 7)) ]; then
        # Keep Sunday backups within weekly retention period
        keep_file=true
        reason="Sunday backup within $WEEKLY_RETENTION_WEEKS weeks"
    fi
    
    if [ "$keep_file" = true ]; then
        echo -e "${GREEN}KEEP${NC}: $backup_file ($(format_size $file_size)) - $reason"
        KEPT_COUNT=$((KEPT_COUNT + 1))
    else
        echo -e "${RED}DELETE${NC}: $backup_file ($(format_size $file_size)) - Older than retention policy"
        DELETED_COUNT=$((DELETED_COUNT + 1))
        DELETED_SIZE=$((DELETED_SIZE + file_size))
        
        if [ "$DRY_RUN" = false ]; then
            rm -f "$backup_file"
        fi
    fi
done

echo ""
echo "Rotation Summary:"
echo "================="
echo "  Files kept: $KEPT_COUNT"
echo "  Files deleted: $DELETED_COUNT"
if [ $DELETED_COUNT -gt 0 ]; then
    echo "  Space freed: $(format_size $DELETED_SIZE)"
fi

if [ "$DRY_RUN" = true ]; then
    echo ""
    echo -e "${YELLOW}This was a dry run. To actually delete files, run without --dry-run${NC}"
fi

# Show disk usage
echo ""
echo "Current backup directory status:"
if [ $KEPT_COUNT -gt 0 ]; then
    total_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
    echo "  Total size: $total_size"
    echo "  Oldest backup: $(ls -1t *.sql.gz 2>/dev/null | tail -1 || echo 'none')"
    echo "  Newest backup: $(ls -1t *.sql.gz 2>/dev/null | head -1 || echo 'none')"
else
    echo "  No backup files remaining"
fi

# Log rotation action
if [ "$DRY_RUN" = false ] && [ $DELETED_COUNT -gt 0 ]; then
    log_file="$BACKUP_DIR/rotation.log"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Rotated $DELETED_COUNT files, freed $(format_size $DELETED_SIZE)" >> "$log_file"
    echo ""
    echo "Rotation logged to: $log_file"
fi

echo ""
echo -e "${GREEN}✅ Backup rotation completed${NC}"