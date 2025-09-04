#!/bin/bash

# Start local development with correct environment variables
# This ensures shell variables don't override .env values

echo "Starting Supabase with correct JWT tokens..."

# Export correct values to override any shell variables
export JWT_SECRET="super-secret-jwt-token-with-at-least-32-characters-long"
export ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWRlbW8iLCJpYXQiOjE3NTcwMjEzMzgsImV4cCI6MjA3MjM4MTMzOH0.zSyV3rb1WU4WooCHkmP5Ro7pp4WNH72Du7ZK8m5DT3I"
export SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtZGVtbyIsImlhdCI6MTc1NzAyMTMzOCwiZXhwIjoyMDcyMzgxMzM4fQ.RfVi4DH3TJnxL1cpujsi7hGZdBq55fn2GwMqNLDC1yY"

# Start containers
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check status
docker ps --format "table {{.Names}}\t{{.Status}}" | grep supabase

echo ""
echo "✅ Supabase is running at http://localhost:8000"
echo "✅ Supabase Studio is running at http://localhost:54323"
echo ""
echo "Now start the Next.js app with: pnpm run dev"