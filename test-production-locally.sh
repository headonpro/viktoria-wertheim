#!/bin/bash

echo "🧪 Testing production configuration locally..."

# Stop current local development
echo "Stopping current local services..."
docker-compose down

# Copy production env for local test
cp .env.production.secure .env.production.local
sed -i 's/91.98.117.169/localhost/g' .env.production.local
sed -i 's/https:\/\/viktoria.headon.pro/http:\/\/localhost:8001/g' .env.production.local

# Test the production configuration
echo "Starting production configuration..."
docker-compose -f docker-compose.production-full.yml --env-file .env.production.local up -d

# Wait for services
echo "Waiting for services to start..."
sleep 30

# Check services
echo ""
echo "Service Status:"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep viktoria

echo ""
echo "Testing endpoints..."
echo -n "Kong API Gateway: "
curl -s http://localhost:8000 | head -c 50 || echo "Failed"
echo ""
echo -n "Web Application: "
curl -s http://localhost:8001 | grep -o "<title>.*</title>" || echo "Failed"
echo ""

echo ""
echo "✅ Test complete!"
echo "Run 'docker-compose -f docker-compose.production-full.yml down' to stop test services"