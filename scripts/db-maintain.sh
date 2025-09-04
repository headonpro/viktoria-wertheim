#!/bin/bash

# Database Maintenance Script
# Performs regular maintenance tasks for optimal performance

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
echo "Database Maintenance Script"
echo "========================================="
echo ""

# Find database container
DB_CONTAINER=$(docker ps --format "{{.Names}}" | grep -E "supabase.*db" | head -1)

if [ -z "$DB_CONTAINER" ]; then
    echo -e "${RED}Error: No Supabase database container found!${NC}"
    echo "Start it with: docker-compose up -d"
    exit 1
fi

COMMAND="${1:-all}"

case "$COMMAND" in
    vacuum)
        echo -e "${YELLOW}Running VACUUM ANALYZE...${NC}"
        echo "This will reclaim disk space and update statistics"
        docker exec $DB_CONTAINER psql -U postgres -c "VACUUM ANALYZE;"
        echo -e "${GREEN}✓ VACUUM ANALYZE complete${NC}"
        ;;
        
    reindex)
        echo -e "${YELLOW}Reindexing database...${NC}"
        echo "This will rebuild all indexes for better performance"
        docker exec $DB_CONTAINER psql -U postgres -c "REINDEX DATABASE postgres;"
        echo -e "${GREEN}✓ Reindex complete${NC}"
        ;;
        
    analyze)
        echo -e "${YELLOW}Updating table statistics...${NC}"
        for table in teams players matches news sponsors league_standings; do
            echo "  Analyzing $table..."
            docker exec $DB_CONTAINER psql -U postgres -c "ANALYZE $table;"
        done
        echo -e "${GREEN}✓ Statistics updated${NC}"
        ;;
        
    bloat)
        echo -e "${YELLOW}Checking table bloat...${NC}"
        docker exec $DB_CONTAINER psql -U postgres -c "
            SELECT 
                schemaname,
                tablename,
                pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
                n_dead_tup AS dead_rows,
                n_live_tup AS live_rows,
                ROUND(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_percent
            FROM pg_stat_user_tables
            WHERE schemaname = 'public'
            ORDER BY n_dead_tup DESC;"
        ;;
        
    slow-queries)
        echo -e "${YELLOW}Checking slow queries...${NC}"
        docker exec $DB_CONTAINER psql -U postgres -c "
            SELECT 
                LEFT(query, 60) as query_start,
                calls,
                ROUND(total_exec_time::numeric, 2) as total_ms,
                ROUND(mean_exec_time::numeric, 2) as mean_ms,
                ROUND(max_exec_time::numeric, 2) as max_ms
            FROM pg_stat_statements
            WHERE query NOT LIKE '%pg_%'
            ORDER BY mean_exec_time DESC
            LIMIT 10;" 2>/dev/null || echo "  pg_stat_statements extension not enabled"
        ;;
        
    cache-hit)
        echo -e "${YELLOW}Checking cache hit ratio...${NC}"
        docker exec $DB_CONTAINER psql -U postgres -c "
            SELECT 
                'Index Hit Rate' as metric,
                ROUND(100.0 * sum(idx_blks_hit) / NULLIF(sum(idx_blks_hit + idx_blks_read), 0), 2) as ratio
            FROM pg_statio_user_tables
            UNION ALL
            SELECT 
                'Table Hit Rate' as metric,
                ROUND(100.0 * sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit + heap_blks_read), 0), 2) as ratio
            FROM pg_statio_user_tables;"
        echo ""
        echo "Note: Ratios above 90% are good, below 80% may need tuning"
        ;;
        
    connections)
        echo -e "${YELLOW}Checking database connections...${NC}"
        docker exec $DB_CONTAINER psql -U postgres -c "
            SELECT 
                datname,
                COUNT(*) as connections,
                state
            FROM pg_stat_activity
            WHERE datname IS NOT NULL
            GROUP BY datname, state
            ORDER BY connections DESC;"
        ;;
        
    locks)
        echo -e "${YELLOW}Checking for locks...${NC}"
        docker exec $DB_CONTAINER psql -U postgres -c "
            SELECT 
                pid,
                usename,
                state,
                LEFT(query, 50) as query,
                age(clock_timestamp(), query_start) AS duration
            FROM pg_stat_activity
            WHERE state != 'idle'
            AND query NOT LIKE '%pg_stat_activity%'
            ORDER BY duration DESC
            LIMIT 10;"
        ;;
        
    size)
        echo -e "${YELLOW}Database size information...${NC}"
        docker exec $DB_CONTAINER psql -U postgres -c "
            SELECT 
                current_database() as database,
                pg_size_pretty(pg_database_size(current_database())) as total_size;"
        echo ""
        echo "Table sizes:"
        docker exec $DB_CONTAINER psql -U postgres -c "
            SELECT 
                tablename,
                pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
                pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS data_size,
                pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
        ;;
        
    health)
        echo -e "${YELLOW}Quick health check...${NC}"
        echo ""
        
        # Database size
        SIZE=$(docker exec $DB_CONTAINER psql -U postgres -t -c "SELECT pg_size_pretty(pg_database_size('postgres'));" | tr -d ' ')
        echo "Database size: $SIZE"
        
        # Connection count
        CONN=$(docker exec $DB_CONTAINER psql -U postgres -t -c "SELECT COUNT(*) FROM pg_stat_activity;" | tr -d ' ')
        echo "Active connections: $CONN"
        
        # Cache hit ratio
        CACHE=$(docker exec $DB_CONTAINER psql -U postgres -t -c "SELECT ROUND(100.0 * sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit + heap_blks_read), 0), 2) FROM pg_statio_user_tables;" | tr -d ' ')
        echo "Cache hit ratio: ${CACHE}%"
        
        # Dead tuples
        DEAD=$(docker exec $DB_CONTAINER psql -U postgres -t -c "SELECT SUM(n_dead_tup) FROM pg_stat_user_tables;" | tr -d ' ')
        echo "Dead tuples: $DEAD"
        
        # Table count
        TABLES=$(docker exec $DB_CONTAINER psql -U postgres -t -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';" | tr -d ' ')
        echo "Tables: $TABLES"
        
        # Index count
        INDEXES=$(docker exec $DB_CONTAINER psql -U postgres -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';" | tr -d ' ')
        echo "Indexes: $INDEXES"
        
        echo ""
        if [[ "$CACHE" < "80" ]]; then
            echo -e "${YELLOW}⚠ Cache hit ratio is low, consider increasing shared_buffers${NC}"
        fi
        if [[ "$DEAD" > "10000" ]]; then
            echo -e "${YELLOW}⚠ High number of dead tuples, consider running VACUUM${NC}"
        fi
        echo -e "${GREEN}✓ Health check complete${NC}"
        ;;
        
    all|full)
        echo -e "${BLUE}Running full maintenance...${NC}"
        echo ""
        
        # Update statistics
        $0 analyze
        echo ""
        
        # Show bloat
        $0 bloat
        echo ""
        
        # Show cache hit ratio
        $0 cache-hit
        echo ""
        
        # Show sizes
        $0 size
        echo ""
        
        # Run vacuum
        $0 vacuum
        echo ""
        
        # Health check
        $0 health
        
        echo ""
        echo -e "${GREEN}✅ Full maintenance complete${NC}"
        ;;
        
    *)
        echo "Database Maintenance Commands:"
        echo ""
        echo "  vacuum       - Run VACUUM ANALYZE to reclaim space"
        echo "  reindex      - Rebuild all indexes"
        echo "  analyze      - Update table statistics"
        echo "  bloat        - Check table bloat"
        echo "  slow-queries - Show slowest queries"
        echo "  cache-hit    - Check cache hit ratios"
        echo "  connections  - Show active connections"
        echo "  locks        - Check for locks"
        echo "  size         - Show database and table sizes"
        echo "  health       - Quick health check"
        echo "  all/full     - Run full maintenance"
        echo ""
        echo "Example: $0 vacuum"
        ;;
esac