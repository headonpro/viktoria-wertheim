#!/bin/bash

# Generate secure keys for Supabase production deployment
echo "🔐 Generating secure keys for production..."

# Generate a secure JWT secret (64 characters)
JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n' | cut -c1-64)
echo "JWT_SECRET=${JWT_SECRET}"

# Generate passwords
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d '\n/' | cut -c1-32)
DASHBOARD_PASSWORD=$(openssl rand -base64 24 | tr -d '\n/' | cut -c1-24)

echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}"
echo "DASHBOARD_PASSWORD=${DASHBOARD_PASSWORD}"

# Function to generate JWT tokens
generate_jwt() {
    local role=$1
    local secret=$2
    
    # Create header
    local header='{"alg":"HS256","typ":"JWT"}'
    local header_base64=$(echo -n "$header" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n')
    
    # Create payload with role and extended expiry (10 years)
    local now=$(date +%s)
    local exp=$((now + 315360000))  # 10 years from now
    local payload="{\"role\":\"$role\",\"iss\":\"supabase\",\"iat\":$now,\"exp\":$exp}"
    local payload_base64=$(echo -n "$payload" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n')
    
    # Create signature
    local message="${header_base64}.${payload_base64}"
    local signature=$(echo -n "$message" | openssl dgst -sha256 -hmac "$secret" -binary | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n')
    
    # Combine all parts
    echo "${message}.${signature}"
}

# Generate anon and service role keys
ANON_KEY=$(generate_jwt "anon" "$JWT_SECRET")
SERVICE_ROLE_KEY=$(generate_jwt "service_role" "$JWT_SECRET")

echo ""
echo "# Generated Keys (Copy to .env.production):"
echo "# ==========================================="
echo ""
echo "# Core Secrets"
echo "JWT_SECRET=${JWT_SECRET}"
echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}"
echo "DASHBOARD_PASSWORD=${DASHBOARD_PASSWORD}"
echo ""
echo "# JWT Keys"
echo "ANON_KEY=${ANON_KEY}"
echo "SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}"
echo ""
echo "# Additional secrets"
echo "SECRET_KEY_BASE=$(openssl rand -hex 64)"
echo "VAULT_ENC_KEY=$(openssl rand -base64 32 | tr -d '\n' | cut -c1-32)"
echo "LOGFLARE_PRIVATE_ACCESS_TOKEN=$(openssl rand -hex 32)"
echo "LOGFLARE_PUBLIC_ACCESS_TOKEN=$(openssl rand -hex 32)"
echo ""
echo "✅ Keys generated successfully!"
echo "⚠️  IMPORTANT: Save these keys securely and never commit them to Git!"