#!/bin/bash

# Deployment Script für Hetzner VPS
# Usage: ./deploy.sh

echo "🚀 Starting deployment to production..."

# Build the Docker image
echo "📦 Building Docker image..."
docker-compose -f docker-compose.production.yml build

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.production.yml down

# Start new containers
echo "✨ Starting new containers..."
docker-compose -f docker-compose.production.yml up -d

# Check if containers are running
echo "🔍 Checking container status..."
docker-compose -f docker-compose.production.yml ps

# Run database migrations (if needed)
echo "🗄️ Running database migrations..."
# docker-compose -f docker-compose.production.yml exec web pnpm run migrate

echo "✅ Deployment complete!"
echo "🌐 Application is running at http://your-server-ip:3000"