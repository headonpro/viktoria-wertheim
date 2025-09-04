#!/bin/bash

# Generate secure secrets for Supabase configuration
# Usage: ./scripts/generate-secrets.sh

set -e

echo "Generating secure secrets for Supabase..."
echo ""
echo "Copy these values to your .env.supabase file:"
echo "============================================="
echo ""

# Generate JWT_SECRET (256-bit hex, converted to base64 for compatibility)
# This needs to be a valid base64-encoded secret for JWT signing
JWT_SECRET=$(openssl rand -base64 32)
echo "# JWT secret for authentication (line 5)"
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Generate VAULT_ENC_KEY (32 bytes base64)
# Used for Vault encryption
VAULT_ENC_KEY=$(openssl rand -base64 32)
echo "# Vault encryption key (line 106)"
echo "VAULT_ENC_KEY=$VAULT_ENC_KEY"
echo ""

# Generate SECRET_KEY_BASE (64+ characters)
# Used for session encryption
SECRET_KEY_BASE=$(openssl rand -hex 32)
echo "# Secret key base for sessions (line 87)"
echo "SECRET_KEY_BASE=$SECRET_KEY_BASE"
echo ""

echo "============================================="
echo ""
echo "IMPORTANT: These secrets are critical for security."
echo "1. Save them in a secure location"
echo "2. Never commit them to version control"
echo "3. Use different secrets for production"
echo ""
echo "Next steps:"
echo "1. Update .env.supabase with these values"
echo "2. Run ./scripts/generate-jwt-keys.sh to generate matching JWT keys"