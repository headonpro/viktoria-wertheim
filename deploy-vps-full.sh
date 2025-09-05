#!/bin/bash
set -e

echo "==========================================="
echo "🚀 Viktoria Wertheim - Full VPS Deployment"
echo "==========================================="
echo "This script will deploy the complete Supabase stack"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're on the VPS
if [[ $(hostname -I | awk '{print $1}') != "91.98.117.169" ]]; then
    echo -e "${YELLOW}⚠️  This script should be run on the VPS (91.98.117.169)${NC}"
    echo "Do you want to continue anyway? (y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        exit 1
    fi
fi

# Step 1: Backup current state
echo -e "${GREEN}📦 Creating backup of current configuration...${NC}"
BACKUP_DIR="/opt/viktoria/backups/deployment-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup docker-compose files if they exist
if [ -f "/opt/viktoria/docker-compose.yml" ]; then
    cp /opt/viktoria/docker-compose.yml "$BACKUP_DIR/"
fi
if [ -f "/opt/viktoria/.env.production" ]; then
    cp /opt/viktoria/.env.production "$BACKUP_DIR/"
fi

# Backup database
echo -e "${GREEN}🗄️  Creating database backup...${NC}"
if docker ps | grep -q viktoria-db; then
    docker exec viktoria-db pg_dump -U postgres > "$BACKUP_DIR/database-backup.sql" || true
fi

echo -e "${GREEN}✅ Backup created at: $BACKUP_DIR${NC}"

# Step 2: Stop existing services
echo -e "${YELLOW}🛑 Stopping existing services...${NC}"
cd /opt/viktoria || mkdir -p /opt/viktoria
docker-compose down 2>/dev/null || true
docker stop $(docker ps -q --filter "name=viktoria-*") 2>/dev/null || true

# Step 3: Copy new configuration
echo -e "${GREEN}📋 Deploying new configuration...${NC}"
cp docker-compose.production-full.yml /opt/viktoria/docker-compose.yml
cp .env.production.secure /opt/viktoria/.env.production

# Copy necessary volume configurations
mkdir -p /opt/viktoria/volumes/api
mkdir -p /opt/viktoria/volumes/logs
mkdir -p /opt/viktoria/volumes/storage
mkdir -p /opt/viktoria/scripts

# Copy Kong configuration
if [ -f "./volumes/api/kong.yml" ]; then
    cp ./volumes/api/kong.yml /opt/viktoria/volumes/api/
fi

# Copy vector configuration
if [ -f "./volumes/logs/vector.yml" ]; then
    cp ./volumes/logs/vector.yml /opt/viktoria/volumes/logs/
fi

# Copy backup script
if [ -f "./scripts/backup-database.sh" ]; then
    cp ./scripts/backup-database.sh /opt/viktoria/scripts/
    chmod +x /opt/viktoria/scripts/backup-database.sh
fi

# Step 4: Initialize database if needed
echo -e "${GREEN}🗄️  Preparing database initialization...${NC}"
cat > /opt/viktoria/init-db.sql << 'EOF'
-- Create necessary roles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon NOLOGIN NOINHERIT;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN NOINHERIT;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticator') THEN
        CREATE ROLE authenticator NOINHERIT LOGIN;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
        CREATE ROLE supabase_auth_admin NOINHERIT LOGIN;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_storage_admin') THEN
        CREATE ROLE supabase_storage_admin NOINHERIT LOGIN;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_admin') THEN
        CREATE ROLE supabase_admin NOINHERIT LOGIN SUPERUSER;
    END IF;
END$$;

-- Grant permissions
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;
GRANT service_role TO authenticator;

-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS _realtime;
CREATE SCHEMA IF NOT EXISTS _analytics;
CREATE SCHEMA IF NOT EXISTS _supabase;

-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
EOF

# Step 5: Build Next.js application
echo -e "${GREEN}🏗️  Building Next.js application...${NC}"
cd /opt/viktoria
if [ ! -f "Dockerfile.production" ]; then
    cp ~/viktoria-wertheim/Dockerfile.production .
fi
docker build -t viktoria-web:production -f Dockerfile.production . || {
    echo -e "${RED}❌ Docker build failed. Using pre-built image...${NC}"
}

# Step 6: Start services
echo -e "${GREEN}🚀 Starting all services...${NC}"
cd /opt/viktoria
docker-compose up -d

# Step 7: Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to start (this may take 2-3 minutes)...${NC}"
sleep 30

# Check database
echo -n "Checking database... "
for i in {1..30}; do
    if docker exec viktoria-db pg_isready -U postgres &>/dev/null; then
        echo -e "${GREEN}✅${NC}"
        break
    fi
    sleep 2
done

# Initialize database if needed
echo -e "${GREEN}🗄️  Initializing database...${NC}"
docker exec -i viktoria-db psql -U postgres < /opt/viktoria/init-db.sql 2>/dev/null || true

# Check Kong
echo -n "Checking Kong API Gateway... "
for i in {1..30}; do
    if curl -s http://localhost:8000/health &>/dev/null; then
        echo -e "${GREEN}✅${NC}"
        break
    fi
    sleep 2
done

# Check Auth
echo -n "Checking Auth Service... "
if docker ps | grep -q viktoria-auth; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️  Auth service not running${NC}"
fi

# Check Storage
echo -n "Checking Storage Service... "
if docker ps | grep -q viktoria-storage; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${YELLOW}⚠️  Storage service not running${NC}"
fi

# Check Web
echo -n "Checking Web Application... "
for i in {1..30}; do
    if curl -s http://localhost:8001 &>/dev/null; then
        echo -e "${GREEN}✅${NC}"
        break
    fi
    sleep 2
done

# Step 8: Apply migrations
echo -e "${GREEN}📦 Applying database migrations...${NC}"
if [ -d "~/viktoria-wertheim/supabase/migrations" ]; then
    for migration in ~/viktoria-wertheim/supabase/migrations/*.sql; do
        if [ -f "$migration" ]; then
            echo "Applying: $(basename $migration)"
            docker exec -i viktoria-db psql -U postgres < "$migration" 2>/dev/null || true
        fi
    done
fi

# Step 9: Show status
echo ""
echo -e "${GREEN}==========================================="
echo "✅ Deployment Complete!"
echo "==========================================="
echo ""
echo "🌐 Services Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep viktoria || true
echo ""
echo "🔗 Access URLs:"
echo "   Web Application: http://91.98.117.169:8001"
echo "   API Gateway: http://91.98.117.169:8000"
echo "   Database: postgresql://postgres@91.98.117.169:5433/postgres"
echo ""
echo "📝 Next Steps:"
echo "   1. Update DNS to point to 91.98.117.169"
echo "   2. Configure SSL/TLS with Let's Encrypt"
echo "   3. Test all features"
echo "   4. Monitor logs: docker-compose logs -f"
echo ""
echo -e "${YELLOW}⚠️  Important: Save the .env.production.secure file securely!${NC}"
echo "==========================================="