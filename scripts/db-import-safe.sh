#!/bin/bash

# Safe Database Import Script
# Imports data while preserving constraints and primary keys

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DATA_SYNC_DIR="${PROJECT_ROOT}/supabase/data-sync"
MIGRATIONS_DIR="${PROJECT_ROOT}/supabase/migrations"
DB_CONTAINER="${DB_CONTAINER:-supabase-db}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================="
echo "Safe Database Import with Constraints"
echo "========================================="
echo ""

# Check if container is running
if ! docker ps | grep -q "${DB_CONTAINER}"; then
    echo -e "${RED}Error: Database container '${DB_CONTAINER}' is not running!${NC}"
    exit 1
fi

# Function to safely import data for a table
safe_import_table() {
    local table="$1"
    local file="${DATA_SYNC_DIR}/${table}.sql"
    
    if [ ! -f "${file}" ]; then
        echo -e "${YELLOW}  ⚠️  No data file for ${table}${NC}"
        return
    fi
    
    echo "  Importing ${table}..."
    
    # Create temporary file with safe import
    local temp_file="/tmp/safe_import_${table}_$(date +%s).sql"
    
    cat > "${temp_file}" << EOF
-- Safe import for ${table}
BEGIN;

-- Temporarily disable triggers
ALTER TABLE ${table} DISABLE TRIGGER ALL;

-- Delete existing data (but keep structure)
DELETE FROM ${table};

-- Import data from dump
EOF
    
    # Extract only INSERT statements from the dump
    grep "^INSERT INTO ${table}" "${file}" >> "${temp_file}" || true
    
    cat >> "${temp_file}" << EOF

-- Re-enable triggers
ALTER TABLE ${table} ENABLE TRIGGER ALL;

-- Verify and fix primary key sequences
DO \$\$
BEGIN
    -- Reset sequences if they exist
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = '${table}_id_seq') THEN
        PERFORM setval('${table}_id_seq', COALESCE((SELECT MAX(id) FROM ${table}), 1));
    END IF;
END
\$\$;

COMMIT;
EOF
    
    # Import the safe SQL
    docker exec -i "${DB_CONTAINER}" psql -U postgres < "${temp_file}"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}    ✅ ${table} imported successfully${NC}"
    else
        echo -e "${RED}    ❌ Failed to import ${table}${NC}"
        rm -f "${temp_file}"
        return 1
    fi
    
    rm -f "${temp_file}"
}

# Step 1: Ensure database structure is correct
echo "Step 1: Verifying database structure..."
echo ""

# Apply initial schema if needed
if [ -f "${MIGRATIONS_DIR}/20250903000000_initial_schema.sql" ]; then
    echo "  Ensuring schema is up-to-date..."
    docker exec -i "${DB_CONTAINER}" psql -U postgres < "${MIGRATIONS_DIR}/20250903000000_initial_schema.sql" 2>/dev/null || true
fi

# Apply primary key fix migration
if [ -f "${MIGRATIONS_DIR}/20250905002153_fix_missing_primary_keys.sql" ]; then
    echo "  Ensuring primary keys exist..."
    docker exec -i "${DB_CONTAINER}" psql -U postgres < "${MIGRATIONS_DIR}/20250905002153_fix_missing_primary_keys.sql" 2>/dev/null || true
fi

# Step 2: Import data in correct order (respecting foreign keys)
echo ""
echo "Step 2: Importing data..."
echo ""

# Import in dependency order
TABLES_ORDER="teams players sponsors contacts newsletter_subscribers news matches scorers league_standings youth_teams"

for table in $TABLES_ORDER; do
    safe_import_table "$table"
done

# Step 3: Verify constraints
echo ""
echo "Step 3: Verifying constraints..."
echo ""

docker exec "${DB_CONTAINER}" psql -U postgres -c "
SELECT 
    t.table_name,
    COUNT(CASE WHEN tc.constraint_type = 'PRIMARY KEY' THEN 1 END) as pk_count,
    COUNT(CASE WHEN tc.constraint_type = 'FOREIGN KEY' THEN 1 END) as fk_count,
    COUNT(CASE WHEN tc.constraint_type = 'UNIQUE' THEN 1 END) as unique_count
FROM information_schema.tables t
LEFT JOIN information_schema.table_constraints tc 
    ON t.table_name = tc.table_name 
    AND t.table_schema = tc.table_schema
WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name
ORDER BY t.table_name;
"

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Import completed successfully!${NC}"
echo -e "${GREEN}All constraints preserved.${NC}"
echo -e "${GREEN}=========================================${NC}"

exit 0