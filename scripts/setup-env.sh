#!/bin/bash

# Environment Setup Script
# Sets up the development environment with proper configuration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "========================================="
echo "Environment Setup for Viktoria Wertheim"
echo "========================================="
echo ""

# Step 1: Create .env from template
echo "Step 1: Setting up environment file..."
if [ ! -f "${PROJECT_ROOT}/.env" ]; then
    if [ -f "${PROJECT_ROOT}/.env.template" ]; then
        cp "${PROJECT_ROOT}/.env.template" "${PROJECT_ROOT}/.env"
        echo -e "${GREEN}✅ Created .env from template${NC}"
    else
        echo -e "${YELLOW}⚠️  No template found, creating basic .env${NC}"
        cat > "${PROJECT_ROOT}/.env" << 'EOF'
# Local Development Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
POSTGRES_PASSWORD=postgres2025viktoria

# Supabase
JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
EOF
    fi
else
    echo -e "${BLUE}ℹ️  .env already exists${NC}"
fi

# Step 2: Generate secure passwords
echo ""
echo "Step 2: Generating secure values..."

# Generate JWT_SECRET if needed
if grep -q "your-super-secret-jwt-token\|your_secure_password_here" "${PROJECT_ROOT}/.env"; then
    echo "  Generating secure JWT_SECRET..."
    NEW_JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=${NEW_JWT_SECRET}/" "${PROJECT_ROOT}/.env"
    echo -e "${GREEN}  ✅ Generated JWT_SECRET${NC}"
fi

# Generate POSTGRES_PASSWORD if needed
if grep -q "your_secure_password_here" "${PROJECT_ROOT}/.env"; then
    echo "  Generating secure POSTGRES_PASSWORD..."
    NEW_PG_PASS=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
    sed -i "s/POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=${NEW_PG_PASS}/" "${PROJECT_ROOT}/.env"
    echo -e "${GREEN}  ✅ Generated POSTGRES_PASSWORD${NC}"
fi

# Generate DASHBOARD_PASSWORD if needed
if grep -q "your_dashboard_password_here" "${PROJECT_ROOT}/.env"; then
    echo "  Generating secure DASHBOARD_PASSWORD..."
    NEW_DASH_PASS=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-16)
    sed -i "s/DASHBOARD_PASSWORD=.*/DASHBOARD_PASSWORD=${NEW_DASH_PASS}/" "${PROJECT_ROOT}/.env"
    echo -e "${GREEN}  ✅ Generated DASHBOARD_PASSWORD${NC}"
fi

# Step 3: Generate JWT keys
echo ""
echo "Step 3: Generating JWT keys..."

# Create temporary Node.js script to generate keys
cat > /tmp/generate-jwt-keys.js << 'EOF'
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.argv[2];
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    console.error('JWT_SECRET must be at least 32 characters');
    process.exit(1);
}

const anon = jwt.sign(
    { role: 'anon', iss: 'supabase-demo', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60) },
    JWT_SECRET
);

const service = jwt.sign(
    { role: 'service_role', iss: 'supabase-demo', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + (10 * 365 * 24 * 60 * 60) },
    JWT_SECRET
);

console.log(`ANON_KEY=${anon}`);
console.log(`SERVICE_ROLE_KEY=${service}`);
EOF

# Install jsonwebtoken if needed
if ! npm list jsonwebtoken >/dev/null 2>&1; then
    echo "  Installing jsonwebtoken package..."
    npm install jsonwebtoken --no-save >/dev/null 2>&1
fi

# Get JWT_SECRET from .env
source "${PROJECT_ROOT}/.env"

# Generate keys
echo "  Generating ANON_KEY and SERVICE_ROLE_KEY..."
KEYS_OUTPUT=$(node /tmp/generate-jwt-keys.js "$JWT_SECRET")
ANON_KEY=$(echo "$KEYS_OUTPUT" | grep "^ANON_KEY=" | cut -d'=' -f2)
SERVICE_ROLE_KEY=$(echo "$KEYS_OUTPUT" | grep "^SERVICE_ROLE_KEY=" | cut -d'=' -f2)

# Update .env with generated keys
sed -i "s|ANON_KEY=.*|ANON_KEY=${ANON_KEY}|" "${PROJECT_ROOT}/.env"
sed -i "s|SERVICE_ROLE_KEY=.*|SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}|" "${PROJECT_ROOT}/.env"
sed -i "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}|" "${PROJECT_ROOT}/.env"
sed -i "s|SUPABASE_SERVICE_ROLE_KEY=.*|SUPABASE_SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}|" "${PROJECT_ROOT}/.env"

echo -e "${GREEN}  ✅ Generated JWT keys${NC}"

# Cleanup
rm -f /tmp/generate-jwt-keys.js

# Step 4: Create necessary directories
echo ""
echo "Step 4: Creating directories..."

mkdir -p "${PROJECT_ROOT}/backups/daily"
mkdir -p "${PROJECT_ROOT}/backups/weekly"
mkdir -p "${PROJECT_ROOT}/backups/monthly"
mkdir -p "${PROJECT_ROOT}/backups/emergency"
mkdir -p "${PROJECT_ROOT}/backups/logs"
echo -e "${GREEN}✅ Created backup directories${NC}"

# Step 5: Validate environment
echo ""
echo "Step 5: Validating environment..."
"${SCRIPT_DIR}/validate-env.sh" || true

# Step 6: Clean up old environment files
echo ""
echo "Step 6: Cleaning up old files..."

# Remove deprecated files (if they exist)
[ -f "${PROJECT_ROOT}/.env.local.example" ] && rm "${PROJECT_ROOT}/.env.local.example"
[ -f "${PROJECT_ROOT}/.env.production.example" ] && rm "${PROJECT_ROOT}/.env.production.example"
echo -e "${GREEN}✅ Cleanup complete${NC}"

# Summary
echo ""
echo "========================================="
echo -e "${GREEN}Environment setup complete!${NC}"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Review your .env file and update any placeholder values"
echo "2. Start the development environment:"
echo "   ${BLUE}docker-compose up -d${NC}"
echo "   ${BLUE}pnpm run dev${NC}"
echo ""
echo "Important files:"
echo "  Configuration: ${PROJECT_ROOT}/.env"
echo "  Template: ${PROJECT_ROOT}/.env.template"
echo "  Validation: ${SCRIPT_DIR}/validate-env.sh"
echo ""

exit 0