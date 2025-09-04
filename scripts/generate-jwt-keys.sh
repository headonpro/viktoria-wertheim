#!/bin/bash

# Generate JWT keys using the JWT_SECRET from .env.supabase
# Usage: ./scripts/generate-jwt-keys.sh

set -e

# Check if .env.supabase exists
if [ ! -f ".env.supabase" ]; then
    echo "Error: .env.supabase file not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Extract JWT_SECRET from .env.supabase
JWT_SECRET=$(grep "^JWT_SECRET=" .env.supabase | cut -d '=' -f2)

if [ -z "$JWT_SECRET" ]; then
    echo "Error: JWT_SECRET not found in .env.supabase!"
    echo "Please run ./scripts/generate-secrets.sh first to generate a JWT secret."
    exit 1
fi

# Check if JWT_SECRET looks like a demo value
if [[ "$JWT_SECRET" == *"your-"* ]] || [[ "$JWT_SECRET" == *"demo"* ]]; then
    echo "Error: JWT_SECRET appears to be a demo value!"
    echo "Please run ./scripts/generate-secrets.sh first to generate a secure JWT secret."
    exit 1
fi

echo "Generating JWT keys using JWT_SECRET from .env.supabase..."
echo ""

# Create a temporary Node.js script to generate the JWT tokens
cat > /tmp/generate-jwt.js << 'EOF'
const crypto = require('crypto');

// Get the JWT secret from environment
const jwtSecret = process.argv[2];
const role = process.argv[3];

if (!jwtSecret || !role) {
    console.error('Usage: node generate-jwt.js <jwt_secret> <role>');
    process.exit(1);
}

// Create the JWT header
const header = {
    alg: 'HS256',
    typ: 'JWT'
};

// Create the JWT payload
// Using timestamps that match typical Supabase patterns
const iat = Math.floor(Date.now() / 1000);
const exp = iat + (365 * 24 * 60 * 60 * 10); // 10 years expiry

const payload = {
    role: role,
    iss: 'supabase',
    iat: iat,
    exp: exp
};

// Encode to base64url
function base64url(str) {
    return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

// Create the signature
const headerEncoded = base64url(JSON.stringify(header));
const payloadEncoded = base64url(JSON.stringify(payload));
const signature = crypto
    .createHmac('sha256', jwtSecret)
    .update(`${headerEncoded}.${payloadEncoded}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

// Combine to create the JWT
const jwt = `${headerEncoded}.${payloadEncoded}.${signature}`;
console.log(jwt);
EOF

# Generate ANON_KEY
ANON_KEY=$(node /tmp/generate-jwt.js "$JWT_SECRET" "anon")
if [ $? -ne 0 ]; then
    echo "Error generating ANON_KEY!"
    rm -f /tmp/generate-jwt.js
    exit 1
fi

# Generate SERVICE_ROLE_KEY
SERVICE_ROLE_KEY=$(node /tmp/generate-jwt.js "$JWT_SECRET" "service_role")
if [ $? -ne 0 ]; then
    echo "Error generating SERVICE_ROLE_KEY!"
    rm -f /tmp/generate-jwt.js
    exit 1
fi

# Clean up temporary file
rm -f /tmp/generate-jwt.js

echo "Generated JWT keys successfully!"
echo ""
echo "Copy these values to your .env files:"
echo "============================================="
echo ""
echo "# For .env.supabase (lines 6-7):"
echo "ANON_KEY=$ANON_KEY"
echo "SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY"
echo ""
echo "# For .env.local and .env.production:"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY"
echo "SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY"
echo ""
echo "============================================="
echo ""
echo "IMPORTANT: These keys are derived from your JWT_SECRET."
echo "If you change the JWT_SECRET, you must regenerate these keys."
echo ""
echo "Next steps:"
echo "1. Update .env.supabase lines 6-7 with the new keys"
echo "2. Update .env.local with matching NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "3. Update .env.production with matching keys"
echo "4. Restart Supabase services to apply changes"