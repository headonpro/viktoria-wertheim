#!/bin/bash

# Final Production Validation Script for Viktoria Wertheim
# This script runs all validation checks to ensure production readiness
# Usage: ./scripts/validate-production.sh

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/backups"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track validation status
VALIDATION_PASSED=true
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

echo "============================================="
echo "    Production Readiness Validation"
echo "============================================="
echo ""
echo "Running comprehensive checks to ensure production readiness..."
echo ""

# Function to print check result
print_check() {
    local status=$1
    local message=$2
    
    case $status in
        "pass")
            echo -e "${GREEN}✅ PASS${NC}: $message"
            CHECKS_PASSED=$((CHECKS_PASSED + 1))
            ;;
        "fail")
            echo -e "${RED}❌ FAIL${NC}: $message"
            CHECKS_FAILED=$((CHECKS_FAILED + 1))
            VALIDATION_PASSED=false
            ;;
        "warn")
            echo -e "${YELLOW}⚠️  WARN${NC}: $message"
            CHECKS_WARNING=$((CHECKS_WARNING + 1))
            ;;
        "info")
            echo -e "${BLUE}ℹ️  INFO${NC}: $message"
            ;;
    esac
}

# ====================
# 1. ENVIRONMENT CHECK
# ====================
echo -e "${BLUE}[1/7] Environment Configuration${NC}"
echo "================================="

# Run environment validation script
if [ -f "$PROJECT_ROOT/scripts/validate-env.sh" ]; then
    if $PROJECT_ROOT/scripts/validate-env.sh > /dev/null 2>&1; then
        print_check "pass" "Environment validation passed"
    else
        print_check "fail" "Environment validation failed - run ./scripts/validate-env.sh for details"
    fi
else
    print_check "fail" "Environment validation script not found"
fi

# Check if production env file exists
if [ -f "$PROJECT_ROOT/.env.production" ]; then
    print_check "pass" ".env.production file exists"
else
    print_check "fail" ".env.production file not found"
fi

# Check if Supabase env file exists
if [ -f "$PROJECT_ROOT/.env.supabase" ]; then
    print_check "pass" ".env.supabase file exists"
else
    print_check "fail" ".env.supabase file not found"
fi

echo ""

# ====================
# 2. DATABASE CHECK
# ====================
echo -e "${BLUE}[2/7] Database Connection${NC}"
echo "=========================="

# Check if we're running locally or in production
if [ -f "/.dockerenv" ]; then
    # We're inside a Docker container
    DB_CONTAINER="viktoria-postgres"
else
    # Check local Supabase database
    DB_CONTAINER="supabase-db"
    
    # First check if production database is accessible
    if docker ps | grep -q "viktoria-postgres"; then
        DB_CONTAINER="viktoria-postgres"
    fi
fi

# Test database connection
if docker ps | grep -q "$DB_CONTAINER"; then
    print_check "pass" "Database container '$DB_CONTAINER' is running"
    
    # Test actual connection
    if docker exec "$DB_CONTAINER" pg_isready > /dev/null 2>&1; then
        print_check "pass" "Database is accepting connections"
        
        # Check if we can query the database
        if docker exec "$DB_CONTAINER" psql -U postgres -d postgres -c "SELECT 1" > /dev/null 2>&1; then
            print_check "pass" "Database query successful"
        else
            print_check "fail" "Cannot query database"
        fi
    else
        print_check "fail" "Database is not accepting connections"
    fi
else
    print_check "fail" "Database container '$DB_CONTAINER' is not running"
fi

echo ""

# ====================
# 3. EMAIL CHECK
# ====================
echo -e "${BLUE}[3/7] Email Configuration${NC}"
echo "========================="

# Check for email configuration in environment
ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
    ENV_FILE=".env.production"
fi

if [ -f "$ENV_FILE" ]; then
    EMAIL_USER=$(grep "^EMAIL_USER=" "$ENV_FILE" | cut -d '=' -f2)
    EMAIL_PASS=$(grep "^EMAIL_PASS=" "$ENV_FILE" | cut -d '=' -f2)
    
    if [ -n "$EMAIL_USER" ] && [ -n "$EMAIL_PASS" ]; then
        print_check "pass" "Email credentials configured"
        
        # Check if test script exists
        if [ -f "$PROJECT_ROOT/scripts/test-email.sh" ]; then
            print_check "info" "Run ./scripts/test-email.sh to test email sending"
        else
            print_check "warn" "Email test script not found"
        fi
    else
        print_check "warn" "Email credentials not configured (EMAIL_USER/EMAIL_PASS)"
        print_check "info" "Email functionality will not work without credentials"
    fi
else
    print_check "warn" "No environment file found for email configuration"
fi

echo ""

# ====================
# 4. BACKUP SYSTEM
# ====================
echo -e "${BLUE}[4/7] Backup System${NC}"
echo "==================="

# Check if backup directory exists
if [ -d "$BACKUP_DIR" ]; then
    print_check "pass" "Backup directory exists"
    
    # Check available disk space
    AVAILABLE_SPACE=$(df "$BACKUP_DIR" | awk 'NR==2 {print $4}')
    if [ "$AVAILABLE_SPACE" -gt 1048576 ]; then # More than 1GB
        print_check "pass" "Sufficient disk space for backups ($(echo $AVAILABLE_SPACE | awk '{print int($1/1024/1024)}') GB available)"
    else
        print_check "warn" "Low disk space for backups ($(echo $AVAILABLE_SPACE | awk '{print int($1/1024)}') MB available)"
    fi
    
    # Check if backup script exists and is executable
    if [ -x "$PROJECT_ROOT/scripts/backup-database.sh" ]; then
        print_check "pass" "Backup script is executable"
    else
        print_check "fail" "Backup script not found or not executable"
    fi
    
    # Check if rotation script exists
    if [ -x "$PROJECT_ROOT/scripts/rotate-backups.sh" ]; then
        print_check "pass" "Backup rotation script is executable"
    else
        print_check "warn" "Backup rotation script not found or not executable"
    fi
else
    print_check "warn" "Backup directory does not exist (will be created on first backup)"
fi

echo ""

# ====================
# 5. SECURITY CHECKS
# ====================
echo -e "${BLUE}[5/7] Security Configuration${NC}"
echo "============================"

# Check for security scripts
if [ -x "$PROJECT_ROOT/scripts/generate-secrets.sh" ]; then
    print_check "pass" "Secret generation script available"
else
    print_check "warn" "Secret generation script not found"
fi

if [ -x "$PROJECT_ROOT/scripts/generate-jwt-keys.sh" ]; then
    print_check "pass" "JWT key generation script available"
else
    print_check "warn" "JWT key generation script not found"
fi

# Check for security documentation
if [ -f "$PROJECT_ROOT/docs/SECURITY.md" ]; then
    print_check "pass" "Security documentation exists"
else
    print_check "warn" "Security documentation not found"
fi

# Check middleware configuration
if [ -f "$PROJECT_ROOT/middleware.ts" ]; then
    # Check for rate limiting
    if grep -q "rateLimit" "$PROJECT_ROOT/middleware.ts"; then
        print_check "pass" "Rate limiting configured in middleware"
    else
        print_check "fail" "Rate limiting not found in middleware"
    fi
    
    # Check for security headers
    if grep -q "X-Frame-Options" "$PROJECT_ROOT/middleware.ts"; then
        print_check "pass" "Security headers configured"
    else
        print_check "warn" "Security headers may not be configured"
    fi
else
    print_check "fail" "Middleware.ts not found"
fi

echo ""

# ====================
# 6. APPLICATION BUILD
# ====================
echo -e "${BLUE}[6/7] Application Build${NC}"
echo "======================="

# Check if Next.js build exists
if [ -d "$PROJECT_ROOT/.next" ]; then
    print_check "pass" "Next.js build directory exists"
    
    # Check build age
    if [ -f "$PROJECT_ROOT/.next/BUILD_ID" ]; then
        BUILD_AGE=$(( ($(date +%s) - $(stat -c %Y "$PROJECT_ROOT/.next/BUILD_ID" 2>/dev/null || stat -f %m "$PROJECT_ROOT/.next/BUILD_ID" 2>/dev/null)) / 86400 ))
        if [ "$BUILD_AGE" -lt 7 ]; then
            print_check "pass" "Build is recent ($BUILD_AGE days old)"
        else
            print_check "warn" "Build is $BUILD_AGE days old - consider rebuilding"
        fi
    fi
else
    print_check "warn" "No production build found - run 'pnpm run build'"
fi

# Check package.json scripts
if [ -f "$PROJECT_ROOT/package.json" ]; then
    if grep -q '"db:backup"' "$PROJECT_ROOT/package.json"; then
        print_check "pass" "Database backup npm scripts configured"
    else
        print_check "warn" "Database backup npm scripts not configured"
    fi
fi

echo ""

# ====================
# 7. HEALTH CHECK
# ====================
echo -e "${BLUE}[7/7] Service Health${NC}"
echo "===================="

# Check if application is running (local development)
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    print_check "pass" "Application is responding on localhost:3000"
    
    # Check health endpoint
    if curl -s http://localhost:3000/api/health | grep -q '"status":"healthy"'; then
        print_check "pass" "Health endpoint reports healthy status"
    else
        print_check "warn" "Health endpoint not reporting healthy status"
    fi
elif curl -s -o /dev/null -w "%{http_code}" http://localhost:8001 | grep -q "200\|301\|302"; then
    print_check "pass" "Application is responding on localhost:8001 (Docker)"
else
    print_check "info" "Application not running locally (expected if checking before deployment)"
fi

# Check Docker services
if command -v docker &> /dev/null; then
    RUNNING_CONTAINERS=$(docker ps --format "table {{.Names}}" | tail -n +2 | wc -l)
    if [ "$RUNNING_CONTAINERS" -gt 0 ]; then
        print_check "info" "$RUNNING_CONTAINERS Docker containers running"
    else
        print_check "info" "No Docker containers running"
    fi
else
    print_check "warn" "Docker not installed or not accessible"
fi

echo ""
echo "============================================="
echo -e "${BLUE}Validation Summary${NC}"
echo "============================================="
echo ""

# Print summary
echo -e "Checks Passed:  ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Checks Failed:  ${RED}$CHECKS_FAILED${NC}"
echo -e "Warnings:       ${YELLOW}$CHECKS_WARNING${NC}"
echo ""

# Final result
if [ "$VALIDATION_PASSED" = true ] && [ "$CHECKS_FAILED" -eq 0 ]; then
    echo -e "${GREEN}✅ PRODUCTION READY${NC}"
    echo ""
    echo "All critical checks passed. Your application is ready for production deployment."
    echo ""
    echo "Recommended next steps:"
    echo "1. Review any warnings above"
    echo "2. Run 'pnpm run build' if not already done"
    echo "3. Test email configuration with './scripts/test-email.sh'"
    echo "4. Create initial backup with './scripts/backup-database.sh'"
    echo "5. Follow the deployment guide in docs/PRODUCTION_CHECKLIST.md"
    exit 0
else
    echo -e "${RED}❌ NOT READY FOR PRODUCTION${NC}"
    echo ""
    echo "Critical checks failed. Please address the issues above before deploying to production."
    echo ""
    echo "Failed checks must be resolved:"
    for i in $(seq 1 $CHECKS_FAILED); do
        echo "  - Review and fix the failed checks marked with ❌"
    done
    echo ""
    echo "For detailed information, run individual validation scripts:"
    echo "  ./scripts/validate-env.sh       - Check environment configuration"
    echo "  ./scripts/test-email.sh         - Test email setup"
    echo "  docker ps                       - Check running containers"
    exit 1
fi