#!/bin/bash

# Environment Variables Validation Script
# Validates that all required environment variables are set

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Environment file
ENV_FILE="${PROJECT_ROOT}/.env"
ENV_TEMPLATE="${PROJECT_ROOT}/.env.template"

echo "========================================="
echo "Environment Variables Validation"
echo "========================================="
echo ""

# Check if .env exists
if [ ! -f "${ENV_FILE}" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo ""
    if [ -f "${ENV_TEMPLATE}" ]; then
        echo "Creating .env from template..."
        cp "${ENV_TEMPLATE}" "${ENV_FILE}"
        echo -e "${YELLOW}⚠️  Please edit ${ENV_FILE} and set your values${NC}"
    else
        echo -e "${RED}No template found. Please create ${ENV_FILE}${NC}"
    fi
    exit 1
fi

# Load environment variables
set -a
source "${ENV_FILE}"
set +a

# Required variables (always needed)
REQUIRED_VARS=(
    "NODE_ENV"
    "NEXT_PUBLIC_APP_URL"
    "POSTGRES_PASSWORD"
    "JWT_SECRET"
    "ANON_KEY"
    "SERVICE_ROLE_KEY"
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "DASHBOARD_USERNAME"
    "DASHBOARD_PASSWORD"
)

# Optional but recommended
RECOMMENDED_VARS=(
    "EMAIL_USER"
    "EMAIL_PASS"
    "ADMIN_EMAILS"
)

# Production-only required
PRODUCTION_VARS=(
    "SMTP_HOST"
    "SMTP_USER"
    "SMTP_PASS"
)

# Validation results
ERRORS=0
WARNINGS=0

echo "Checking required variables..."
echo ""

for var in "${REQUIRED_VARS[@]}"; do
    value="${!var}"
    if [ -z "$value" ]; then
        echo -e "${RED}  ❌ $var is not set${NC}"
        ERRORS=$((ERRORS + 1))
    elif [[ "$value" == *"your_"* ]] || [[ "$value" == *"_here"* ]] || [[ "$value" == "changeme" ]]; then
        echo -e "${YELLOW}  ⚠️  $var appears to have a placeholder value: '$value'${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}  ✅ $var is set${NC}"
    fi
done

echo ""
echo "Checking recommended variables..."
echo ""

for var in "${RECOMMENDED_VARS[@]}"; do
    value="${!var}"
    if [ -z "$value" ]; then
        echo -e "${YELLOW}  ⚠️  $var is not set (recommended)${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}  ✅ $var is set${NC}"
    fi
done

# Production checks
if [ "$NODE_ENV" = "production" ] || [ "$APP_ENV" = "production" ]; then
    echo ""
    echo "Checking production variables..."
    echo ""
    
    for var in "${PRODUCTION_VARS[@]}"; do
        value="${!var}"
        if [ -z "$value" ]; then
            echo -e "${RED}  ❌ $var is required for production${NC}"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${GREEN}  ✅ $var is set${NC}"
        fi
    done
fi

# Validate specific values
echo ""
echo "Validating configuration..."
echo ""

# JWT_SECRET length
if [ -n "$JWT_SECRET" ]; then
    JWT_LEN=${#JWT_SECRET}
    if [ $JWT_LEN -lt 32 ]; then
        echo -e "${RED}  ❌ JWT_SECRET must be at least 32 characters (current: $JWT_LEN)${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${GREEN}  ✅ JWT_SECRET length is valid ($JWT_LEN chars)${NC}"
    fi
fi

# Check if keys match JWT_SECRET
if [ -n "$JWT_SECRET" ] && [ -n "$ANON_KEY" ]; then
    # Try to decode the ANON_KEY to check if it's valid
    if echo "$ANON_KEY" | base64 -d >/dev/null 2>&1; then
        echo -e "${GREEN}  ✅ ANON_KEY format is valid${NC}"
    else
        echo -e "${YELLOW}  ⚠️  ANON_KEY might not be properly generated${NC}"
        echo "    Run: node scripts/generate-jwt-keys.js"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# URL format validation
if [[ "$NEXT_PUBLIC_APP_URL" == */ ]]; then
    echo -e "${YELLOW}  ⚠️  NEXT_PUBLIC_APP_URL should not have trailing slash${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

# Check for conflicting variables
if [ -f "$HOME/.zshrc" ] || [ -f "$HOME/.bashrc" ]; then
    echo ""
    echo "Checking for conflicting shell variables..."
    if env | grep -E "^(JWT_SECRET|ANON_KEY|SERVICE_ROLE_KEY)=" | grep -v "$JWT_SECRET" >/dev/null 2>&1; then
        echo -e "${YELLOW}  ⚠️  Found potentially conflicting environment variables in shell${NC}"
        echo "    Run: unset JWT_SECRET ANON_KEY SERVICE_ROLE_KEY"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}  ✅ No conflicting shell variables found${NC}"
    fi
fi

# Summary
echo ""
echo "========================================="
if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}Validation FAILED${NC}"
    echo -e "${RED}Errors: $ERRORS${NC}"
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
    echo ""
    echo "Please fix the errors in your .env file"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}Validation completed with warnings${NC}"
    echo -e "${GREEN}Errors: 0${NC}"
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
    echo ""
    echo "Consider addressing the warnings for production use"
    exit 0
else
    echo -e "${GREEN}Validation PASSED${NC}"
    echo -e "${GREEN}All environment variables are properly configured!${NC}"
    exit 0
fi