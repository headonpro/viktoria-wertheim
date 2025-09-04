#!/bin/bash

# Backup Cron Setup Documentation
# This script documents how to set up automated backups using cron

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "============================================="
echo "     Automated Backup Setup with Cron"
echo "============================================="
echo ""

echo -e "${BLUE}This script will help you set up automated database backups.${NC}"
echo ""

# Function to check if cron is installed
check_cron() {
    if command -v crontab &> /dev/null; then
        echo -e "${GREEN}✅ Cron is installed${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Cron is not installed${NC}"
        echo "Please install cron first:"
        echo "  Ubuntu/Debian: sudo apt-get install cron"
        echo "  CentOS/RHEL: sudo yum install cronie"
        return 1
    fi
}

# Check if cron is available
if ! check_cron; then
    exit 1
fi

echo ""
echo "Current cron jobs for user $(whoami):"
echo "------------------------------------"
crontab -l 2>/dev/null || echo "No cron jobs configured"

echo ""
echo -e "${BLUE}Recommended Backup Schedule:${NC}"
echo "============================"
echo ""

echo "1. DAILY BACKUP (Recommended)"
echo "   Runs every day at 2:00 AM local time"
echo ""
echo -e "${GREEN}0 2 * * * ${PROJECT_ROOT}/scripts/backup-database.sh production${NC}"
echo ""

echo "2. TWICE DAILY BACKUP (For critical data)"
echo "   Runs at 2:00 AM and 2:00 PM"
echo ""
echo -e "${GREEN}0 2,14 * * * ${PROJECT_ROOT}/scripts/backup-database.sh production${NC}"
echo ""

echo "3. HOURLY BACKUP (For very critical data)"
echo "   Runs every hour"
echo ""
echo -e "${GREEN}0 * * * * ${PROJECT_ROOT}/scripts/backup-database.sh production${NC}"
echo ""

echo "4. WEEKLY ROTATION (Recommended with daily backups)"
echo "   Runs every Sunday at 3:00 AM"
echo ""
echo -e "${GREEN}0 3 * * 0 ${PROJECT_ROOT}/scripts/rotate-backups.sh${NC}"
echo ""

echo "5. DAILY ROTATION (For limited disk space)"
echo "   Runs every day at 3:00 AM"
echo ""
echo -e "${GREEN}0 3 * * * ${PROJECT_ROOT}/scripts/rotate-backups.sh${NC}"
echo ""

echo -e "${BLUE}Complete Setup Example:${NC}"
echo "======================="
echo ""
echo "For a typical setup with daily backups and weekly rotation:"
echo ""
cat << 'EOF'
# SV Viktoria Wertheim Database Backup Schedule
# Edit with: crontab -e

# Daily database backup at 2:00 AM
0 2 * * * /home/headon/projects/viktoria-wertheim/scripts/backup-database.sh production >> /home/headon/projects/viktoria-wertheim/backups/cron.log 2>&1

# Weekly backup rotation on Sundays at 3:00 AM
0 3 * * 0 /home/headon/projects/viktoria-wertheim/scripts/rotate-backups.sh >> /home/headon/projects/viktoria-wertheim/backups/rotation.log 2>&1

# Optional: Email notification on backup failure
# 0 4 * * * /home/headon/projects/viktoria-wertheim/scripts/check-backup-status.sh || echo "Backup failed" | mail -s "Viktoria Backup Failed" admin@viktoria-wertheim.de
EOF

echo ""
echo -e "${BLUE}How to Set Up:${NC}"
echo "=============="
echo ""
echo "1. Open crontab editor:"
echo "   ${GREEN}crontab -e${NC}"
echo ""
echo "2. Add the cron entries shown above (adjust paths as needed)"
echo ""
echo "3. Save and exit the editor"
echo ""
echo "4. Verify the cron jobs were added:"
echo "   ${GREEN}crontab -l${NC}"
echo ""
echo "5. Check cron service is running:"
echo "   ${GREEN}sudo systemctl status cron${NC}  (or crond on some systems)"
echo ""

echo -e "${BLUE}Cron Syntax Reference:${NC}"
echo "====================="
echo ""
echo "Format: minute hour day month dayofweek command"
echo ""
echo "  ┌───────────── minute (0 - 59)"
echo "  │ ┌───────────── hour (0 - 23)"
echo "  │ │ ┌───────────── day of month (1 - 31)"
echo "  │ │ │ ┌───────────── month (1 - 12)"
echo "  │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday = 0)"
echo "  │ │ │ │ │"
echo "  * * * * * command to execute"
echo ""
echo "Special characters:"
echo "  * = any value"
echo "  , = value list separator"
echo "  - = range of values"
echo "  / = step values"
echo ""
echo "Examples:"
echo "  0 2 * * *     = Every day at 2:00 AM"
echo "  */15 * * * *  = Every 15 minutes"
echo "  0 */6 * * *   = Every 6 hours"
echo "  0 2 * * 1-5   = Weekdays at 2:00 AM"
echo ""

echo -e "${BLUE}Testing Your Setup:${NC}"
echo "=================="
echo ""
echo "1. Test backup script manually first:"
echo "   ${GREEN}${PROJECT_ROOT}/scripts/backup-database.sh production${NC}"
echo ""
echo "2. Test rotation script:"
echo "   ${GREEN}${PROJECT_ROOT}/scripts/rotate-backups.sh --dry-run${NC}"
echo ""
echo "3. Monitor cron logs:"
echo "   ${GREEN}tail -f /var/log/syslog | grep CRON${NC}  (Ubuntu/Debian)"
echo "   ${GREEN}tail -f /var/log/cron${NC}  (CentOS/RHEL)"
echo ""
echo "4. Check backup logs:"
echo "   ${GREEN}tail -f ${PROJECT_ROOT}/backups/cron.log${NC}"
echo ""

echo -e "${YELLOW}Important Notes:${NC}"
echo "==============="
echo "• Ensure the backup scripts have execute permissions"
echo "• Use absolute paths in crontab entries"
echo "• Redirect output to log files for debugging"
echo "• Test scripts manually before adding to cron"
echo "• Consider time zone settings (cron uses system time)"
echo "• Monitor disk space regularly"
echo ""

echo -e "${GREEN}Setup documentation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Review the recommended schedules above"
echo "2. Choose a backup frequency that suits your needs"
echo "3. Add the cron entries using 'crontab -e'"
echo "4. Monitor the backups to ensure they're working"