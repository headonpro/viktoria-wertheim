#!/bin/bash

# Database Schema Validation Script
# Validates database schema integrity and data consistency

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "========================================="
echo "Database Schema & Data Validation"
echo "========================================="
echo ""

# Find database container
DB_CONTAINER=$(docker ps --format "{{.Names}}" | grep -E "supabase.*db" | head -1)

if [ -z "$DB_CONTAINER" ]; then
    echo -e "${RED}Error: No Supabase database container found!${NC}"
    echo "Start it with: docker-compose up -d"
    exit 1
fi

echo "Using container: $DB_CONTAINER"
echo ""

# Initialize counters
ERRORS=0
WARNINGS=0

# Function to run SQL and check result
check_sql() {
    local description=$1
    local sql=$2
    local expected=$3
    
    result=$(docker exec $DB_CONTAINER psql -U postgres -t -c "$sql" 2>/dev/null | tr -d ' \n')
    
    if [ "$result" = "$expected" ]; then
        echo -e "  ${GREEN}✓${NC} $description"
        return 0
    else
        echo -e "  ${RED}✗${NC} $description (expected: $expected, got: $result)"
        ((ERRORS++))
        return 1
    fi
}

# Function to check for issues
check_warning() {
    local description=$1
    local sql=$2
    
    result=$(docker exec $DB_CONTAINER psql -U postgres -t -c "$sql" 2>/dev/null | tr -d ' \n')
    
    if [ "$result" = "0" ]; then
        echo -e "  ${GREEN}✓${NC} $description"
        return 0
    else
        echo -e "  ${YELLOW}⚠${NC}  $description (found: $result issues)"
        ((WARNINGS++))
        return 1
    fi
}

# 1. Check Primary Keys
echo "1. Checking Primary Keys..."
check_sql "Table 'teams' has primary key" \
    "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'teams'::regclass AND contype = 'p';" "1"
check_sql "Table 'players' has primary key" \
    "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'players'::regclass AND contype = 'p';" "1"
check_sql "Table 'matches' has primary key" \
    "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'matches'::regclass AND contype = 'p';" "1"
check_sql "Table 'news' has primary key" \
    "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'news'::regclass AND contype = 'p';" "1"
check_sql "Table 'sponsors' has primary key" \
    "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'sponsors'::regclass AND contype = 'p';" "1"
check_sql "Table 'league_standings' has primary key" \
    "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'league_standings'::regclass AND contype = 'p';" "1"

echo ""

# 2. Check Foreign Key Relationships
echo "2. Checking Foreign Key Constraints..."
check_sql "Players reference valid teams" \
    "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'players'::regclass AND contype = 'f' AND confrelid = 'teams'::regclass;" "1"
check_sql "Matches reference valid teams (home)" \
    "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'matches'::regclass AND contype = 'f' AND conname LIKE '%home%';" "1"
check_sql "Matches reference valid teams (away)" \
    "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'matches'::regclass AND contype = 'f' AND conname LIKE '%away%';" "1"

echo ""

# 3. Check for Orphaned Records
echo "3. Checking Data Integrity..."
check_warning "No orphaned players (team doesn't exist)" \
    "SELECT COUNT(*) FROM players p WHERE p.team_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM teams t WHERE t.id = p.team_id);"
check_warning "No orphaned matches (home team doesn't exist)" \
    "SELECT COUNT(*) FROM matches m WHERE m.home_team_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM teams t WHERE t.id = m.home_team_id);"
check_warning "No orphaned matches (away team doesn't exist)" \
    "SELECT COUNT(*) FROM matches m WHERE m.away_team_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM teams t WHERE t.id = m.away_team_id);"

echo ""

# 4. Check for Duplicate Data
echo "4. Checking for Duplicates..."
check_warning "No duplicate players (same name in same team)" \
    "SELECT COUNT(*) FROM (SELECT name, team_id FROM players GROUP BY name, team_id HAVING COUNT(*) > 1) AS dups;"
check_warning "No duplicate matches (same teams, same date)" \
    "SELECT COUNT(*) FROM (SELECT home_team_id, away_team_id, date FROM matches GROUP BY home_team_id, away_team_id, date HAVING COUNT(*) > 1) AS dups;"
check_warning "No duplicate sponsors (same name)" \
    "SELECT COUNT(*) FROM (SELECT name FROM sponsors GROUP BY name HAVING COUNT(*) > 1) AS dups;"

echo ""

# 5. Check Required Fields
echo "5. Checking Required Fields (NOT NULL)..."
check_warning "All teams have names" \
    "SELECT COUNT(*) FROM teams WHERE name IS NULL OR name = '';"
check_warning "All players have names" \
    "SELECT COUNT(*) FROM players WHERE name IS NULL OR name = '';"
check_warning "All matches have dates" \
    "SELECT COUNT(*) FROM matches WHERE date IS NULL;"
check_warning "All news have titles" \
    "SELECT COUNT(*) FROM news WHERE title IS NULL OR title = '';"

echo ""

# 6. Check Indexes for Performance
echo "6. Checking Performance Indexes..."
docker exec $DB_CONTAINER psql -U postgres -c "
    SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
    ORDER BY tablename, indexname;
" 2>/dev/null | grep -E "btree|hash" | while read -r line; do
    echo -e "  ${BLUE}ℹ${NC}  Found index: $(echo $line | awk '{print $3}')"
done

echo ""

# 7. Table Statistics
echo "7. Table Statistics..."
docker exec $DB_CONTAINER psql -U postgres -c "
    SELECT 
        schemaname,
        tablename,
        n_live_tup as rows,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY n_live_tup DESC;
" 2>/dev/null

echo ""

# 8. Check for Missing Indexes on Foreign Keys
echo "8. Checking Foreign Key Indexes..."
docker exec $DB_CONTAINER psql -U postgres -t -c "
    SELECT 
        'CREATE INDEX idx_' || conrelid::regclass || '_' || a.attname || ' ON ' || conrelid::regclass || '(' || a.attname || ');'
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
    WHERE c.contype = 'f'
    AND NOT EXISTS (
        SELECT 1 FROM pg_index i
        WHERE i.indrelid = c.conrelid
        AND a.attnum = ANY(i.indkey)
    );
" 2>/dev/null | while read -r line; do
    if [ ! -z "$line" ]; then
        echo -e "  ${YELLOW}⚠${NC}  Missing index - suggested: $line"
        ((WARNINGS++))
    fi
done

# Summary
echo ""
echo "========================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Validation Complete - No Issues Found!${NC}"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Validation Complete - $WARNINGS Warnings${NC}"
else
    echo -e "${RED}❌ Validation Failed - $ERRORS Errors, $WARNINGS Warnings${NC}"
fi
echo "========================================="

# Exit with error if any errors found
if [ $ERRORS -gt 0 ]; then
    exit 1
fi

exit 0