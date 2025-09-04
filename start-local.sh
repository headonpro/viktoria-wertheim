#!/bin/bash
# Start local Supabase development environment

echo "Starting local Supabase environment..."
docker compose --env-file .env.supabase -f docker-compose.supabase.yml --project-name supabase-local up -d

# Wait for services to be healthy
echo "Waiting for services to start..."
sleep 10

# Check status
docker ps --format "table {{.Names}}\t{{.Status}}" | grep supabase

echo ""
echo "✅ Supabase is running!"
echo "📊 Studio: http://localhost:54323"
echo "🔌 API: http://localhost:54321"
echo ""
echo "To stop: docker compose --env-file .env.supabase -f docker-compose.supabase.yml --project-name supabase-local down"