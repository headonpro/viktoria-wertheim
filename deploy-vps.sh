#!/bin/bash
set -e

echo "==========================================="
echo "🚀 SV Viktoria Wertheim VPS Deployment"
echo "==========================================="

# 1. Create working directory
echo "📁 Creating deployment structure..."
mkdir -p /root/viktoria-deployment
cd /root/viktoria-deployment

# 2. Create production .env file
echo "🔧 Creating environment configuration..."
cat > .env.production << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWRlbW8iLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.dUimG__tgAn7lVH0OMGtuXOtzzyQnLHvwlC2AN_XA7o
NEXT_PUBLIC_APP_URL=https://viktoria-wertheim.de
ADMIN_EMAILS=info@viktoria-wertheim.de
EOF

# 3. Build Next.js Docker image with correct environment
echo "🏗️ Building Next.js application..."
cd /root/viktoria-app
cp /root/viktoria-deployment/.env.production .env.production
docker build -t viktoria-web:production . > /dev/null 2>&1
echo "✅ Next.js image built successfully"

# 4. Create complete docker-compose.yml
echo "📝 Creating Docker Compose configuration..."
cd /root/viktoria-deployment
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: supabase/postgres:15.8.1.060
    container_name: viktoria-db
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: postgres2025viktoria
      POSTGRES_DB: postgres
      JWT_SECRET: your-super-secret-jwt-token-with-at-least-32-characters-viktoria2025
      JWT_EXP: 3600
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - viktoria-network
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 5s
      timeout: 5s
      retries: 10

  # PostgREST API
  rest:
    image: postgrest/postgrest:v12.2.12
    container_name: viktoria-rest
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      PGRST_DB_URI: postgres://authenticator:postgres2025viktoria@db:5432/postgres
      PGRST_DB_SCHEMAS: public
      PGRST_DB_ANON_ROLE: anon
      PGRST_JWT_SECRET: your-super-secret-jwt-token-with-at-least-32-characters-viktoria2025
    networks:
      - viktoria-network

  # Kong API Gateway
  kong:
    image: kong:2.8.1
    container_name: viktoria-kong
    restart: unless-stopped
    ports:
      - "8000:8000"
    depends_on:
      rest:
        condition: service_started
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /kong.yml
      KONG_DNS_ORDER: LAST,A,CNAME
      KONG_PLUGINS: request-transformer,cors,key-auth,acl,basic-auth
    volumes:
      - ./kong.yml:/kong.yml:ro
    networks:
      - viktoria-network
    healthcheck:
      test: ["CMD", "kong", "health"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Next.js Application
  web:
    image: viktoria-web:production
    container_name: viktoria-web
    restart: unless-stopped
    ports:
      - "8001:3000"
    depends_on:
      kong:
        condition: service_healthy
    environment:
      NODE_ENV: production
    networks:
      - viktoria-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  db-data:

networks:
  viktoria-network:
    driver: bridge
EOF

# 5. Create Kong configuration
echo "🔧 Creating Kong configuration..."
cat > kong.yml << 'EOF'
_format_version: "1.1"

services:
  - name: rest
    url: http://rest:3000
    routes:
      - name: rest-all
        paths:
          - /rest/v1/
    plugins:
      - name: cors
        config:
          origins:
            - "*"
          methods:
            - GET
            - POST
            - PUT
            - DELETE
            - OPTIONS
          headers:
            - Accept
            - Authorization
            - Content-Type
            - apikey
          exposed_headers:
            - Content-Length
            - Content-Range
          credentials: true
          max_age: 3600

  - name: auth
    url: http://auth:9999
    routes:
      - name: auth-all
        paths:
          - /auth/v1/
    plugins:
      - name: cors
        config:
          origins:
            - "*"
          methods:
            - GET
            - POST
            - PUT
            - DELETE
            - OPTIONS
          headers:
            - Accept
            - Authorization
            - Content-Type
            - apikey
          credentials: true
          max_age: 3600

  - name: storage
    url: http://storage:5000
    routes:
      - name: storage-all
        paths:
          - /storage/v1/
    plugins:
      - name: cors
        config:
          origins:
            - "*"
          methods:
            - GET
            - POST
            - PUT
            - DELETE
            - OPTIONS
          headers:
            - Accept
            - Authorization
            - Content-Type
            - apikey
          credentials: true
          max_age: 3600
EOF

# 6. Create database initialization script
echo "🗄️ Creating database initialization script..."
cat > init-db.sql << 'EOF'
-- Create necessary roles
CREATE ROLE anon NOLOGIN NOINHERIT;
CREATE ROLE authenticated NOLOGIN NOINHERIT;
CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'postgres2025viktoria';

-- Grant permissions
GRANT anon TO authenticator;
GRANT authenticated TO authenticator;
GRANT service_role TO authenticator;

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS public;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
EOF

# Append existing data if available
if [ -f /tmp/viktoria-complete.sql ]; then
  echo "-- Importing existing data" >> init-db.sql
  cat /tmp/viktoria-complete.sql >> init-db.sql
fi

# 7. Start all services
echo "🚀 Starting all services..."
docker compose up -d

# 8. Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# 9. Verify services
echo "✅ Verifying services..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 10. Test endpoints
echo "🧪 Testing endpoints..."
echo -n "Testing Kong API Gateway: "
curl -s http://localhost:8000/rest/v1/ | head -c 50
echo ""
echo -n "Testing Web Application: "
curl -s http://localhost:8001 | grep -o "<title>.*</title>" | head -1
echo ""

echo "==========================================="
echo "✅ Deployment Complete!"
echo "==========================================="
echo "🌐 Web Application: http://$(curl -s ifconfig.me):8001"
echo "🔌 API Gateway: http://$(curl -s ifconfig.me):8000"
echo "==========================================="