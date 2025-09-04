#!/bin/bash
# Einfacher Start für lokale Entwicklung mit EINER ENV-Datei

echo "🚀 Starting local development environment..."
echo "Using single .env.development file for everything"

# Stoppe alte Container
docker-compose -f docker-compose.supabase.yml down 2>/dev/null

# Starte Supabase mit .env.development
docker-compose --env-file .env.development -f docker-compose.supabase.yml up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Status anzeigen
docker ps --format "table {{.Names}}\t{{.Status}}" | grep supabase

echo ""
echo "✅ Supabase is running!"
echo "📊 Studio: http://localhost:54323"
echo "🔌 API: http://localhost:8000"
echo ""
echo "Now start Next.js with: pnpm run dev"
echo "The app will use the same .env.development file automatically"