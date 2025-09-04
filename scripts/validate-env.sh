#!/bin/bash

# Validate environment configuration for security
# Usage: ./scripts/validate-env.sh

set -e

echo "Validating environment configuration..."
echo ""

# Initialize validation status
VALIDATION_FAILED=0

# Function to check if value contains demo/insecure patterns
check_demo_value() {
    local name=$1
    local value=$2
    
    if [[ "$value" == *"demo"* ]] || [[ "$value" == *"your-"* ]] || [[ "$value" == *"supabase-demo"* ]]; then
        echo "❌ ERROR: $name contains demo/placeholder value!"
        echo "   Found: $value"
        return 1
    fi
    return 0
}

# Function to check minimum length
check_length() {
    local name=$1
    local value=$2
    local min_length=$3
    
    if [ ${#value} -lt $min_length ]; then
        echo "❌ ERROR: $name is too short (minimum $min_length characters)!"
        echo "   Length: ${#value}"
        return 1
    fi
    return 0
}

# Check if .env.supabase exists
if [ ! -f ".env.supabase" ]; then
    echo "❌ ERROR: .env.supabase file not found!"
    exit 1
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ ERROR: .env.production file not found!"
    exit 1
fi

echo "Checking .env.supabase..."
echo "=========================="

# Extract values from .env.supabase
JWT_SECRET=$(grep "^JWT_SECRET=" .env.supabase | cut -d '=' -f2)
VAULT_ENC_KEY=$(grep "^VAULT_ENC_KEY=" .env.supabase | cut -d '=' -f2)
SECRET_KEY_BASE=$(grep "^SECRET_KEY_BASE=" .env.supabase | cut -d '=' -f2)
SUPABASE_ANON_KEY=$(grep "^ANON_KEY=" .env.supabase | cut -d '=' -f2)
SUPABASE_SERVICE_KEY=$(grep "^SERVICE_ROLE_KEY=" .env.supabase | cut -d '=' -f2)

# Validate JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    echo "❌ ERROR: JWT_SECRET not found in .env.supabase!"
    VALIDATION_FAILED=1
else
    if ! check_demo_value "JWT_SECRET" "$JWT_SECRET"; then
        VALIDATION_FAILED=1
    elif ! check_length "JWT_SECRET" "$JWT_SECRET" 32; then
        VALIDATION_FAILED=1
    else
        echo "✅ JWT_SECRET is secure (${#JWT_SECRET} characters)"
    fi
fi

# Validate VAULT_ENC_KEY
if [ -z "$VAULT_ENC_KEY" ]; then
    echo "❌ ERROR: VAULT_ENC_KEY not found in .env.supabase!"
    VALIDATION_FAILED=1
else
    if ! check_demo_value "VAULT_ENC_KEY" "$VAULT_ENC_KEY"; then
        VALIDATION_FAILED=1
    elif ! check_length "VAULT_ENC_KEY" "$VAULT_ENC_KEY" 32; then
        VALIDATION_FAILED=1
    else
        echo "✅ VAULT_ENC_KEY is secure (${#VAULT_ENC_KEY} characters)"
    fi
fi

# Validate SECRET_KEY_BASE
if [ -z "$SECRET_KEY_BASE" ]; then
    echo "❌ ERROR: SECRET_KEY_BASE not found in .env.supabase!"
    VALIDATION_FAILED=1
else
    if ! check_demo_value "SECRET_KEY_BASE" "$SECRET_KEY_BASE"; then
        VALIDATION_FAILED=1
    elif ! check_length "SECRET_KEY_BASE" "$SECRET_KEY_BASE" 64; then
        VALIDATION_FAILED=1
    else
        echo "✅ SECRET_KEY_BASE is secure (${#SECRET_KEY_BASE} characters)"
    fi
fi

# Validate ANON_KEY
if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ ERROR: ANON_KEY not found in .env.supabase!"
    VALIDATION_FAILED=1
else
    if ! check_demo_value "ANON_KEY" "$SUPABASE_ANON_KEY"; then
        VALIDATION_FAILED=1
    else
        echo "✅ ANON_KEY is set and not a demo value"
    fi
fi

# Validate SERVICE_ROLE_KEY
if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ ERROR: SERVICE_ROLE_KEY not found in .env.supabase!"
    VALIDATION_FAILED=1
else
    if ! check_demo_value "SERVICE_ROLE_KEY" "$SUPABASE_SERVICE_KEY"; then
        VALIDATION_FAILED=1
    else
        echo "✅ SERVICE_ROLE_KEY is set and not a demo value"
    fi
fi

echo ""
echo "Checking .env.production..."
echo "============================"

# Extract values from .env.production
PROD_ANON_KEY=$(grep "^ANON_KEY=" .env.production | cut -d '=' -f2)
PROD_SERVICE_KEY=$(grep "^SERVICE_ROLE_KEY=" .env.production | cut -d '=' -f2)

# Validate production ANON_KEY
if [ -z "$PROD_ANON_KEY" ]; then
    echo "❌ ERROR: ANON_KEY not found in .env.production!"
    VALIDATION_FAILED=1
else
    if ! check_demo_value "ANON_KEY" "$PROD_ANON_KEY"; then
        VALIDATION_FAILED=1
    else
        echo "✅ ANON_KEY is set and not a demo value"
    fi
fi

# Validate production SERVICE_ROLE_KEY
if [ -z "$PROD_SERVICE_KEY" ]; then
    echo "❌ ERROR: SERVICE_ROLE_KEY not found in .env.production!"
    VALIDATION_FAILED=1
else
    if ! check_demo_value "SERVICE_ROLE_KEY" "$PROD_SERVICE_KEY"; then
        VALIDATION_FAILED=1
    else
        echo "✅ SERVICE_ROLE_KEY is set and not a demo value"
    fi
fi

echo ""
echo "Checking key consistency..."
echo "============================"

# Check if keys match between environments
if [ "$SUPABASE_ANON_KEY" != "$PROD_ANON_KEY" ]; then
    echo "⚠️  WARNING: ANON_KEY differs between .env.supabase and .env.production!"
    echo "   This may cause authentication issues."
fi

if [ "$SUPABASE_SERVICE_KEY" != "$PROD_SERVICE_KEY" ]; then
    echo "⚠️  WARNING: SERVICE_ROLE_KEY differs between .env.supabase and .env.production!"
    echo "   This may cause service authentication issues."
fi

if [ "$SUPABASE_ANON_KEY" = "$PROD_ANON_KEY" ] && [ "$SUPABASE_SERVICE_KEY" = "$PROD_SERVICE_KEY" ]; then
    echo "✅ JWT keys are consistent between environments"
fi

echo ""
echo "============================================="

# Final validation result
if [ $VALIDATION_FAILED -eq 0 ]; then
    echo "✅ Environment validation PASSED"
    echo ""
    echo "Your environment is properly configured with secure values."
    exit 0
else
    echo "❌ Environment validation FAILED"
    echo ""
    echo "Please fix the issues above before starting the application."
    echo "Run ./scripts/generate-secrets.sh to generate new secure secrets."
    echo "Then run ./scripts/generate-jwt-keys.sh to generate matching JWT keys."
    exit 1
fi