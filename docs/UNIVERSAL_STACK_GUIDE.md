# Universal Technology Stack Guide

## Aktueller Stack Overview

Dieser Guide dokumentiert unseren standardisierten Technology Stack, der für 90% aller Projekte eingesetzt werden kann.

### Core Technologies

- **Frontend:** Next.js 15 mit TypeScript
- **Database:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Deployment:** Docker + VPS (selbst-gehostet)
- **CI/CD:** GitHub Actions
- **Proxy/Server:** Nginx
- **Migration System:** Supabase Migrations
- **Package Manager:** pnpm (preferred)

## Einsatzgebiete

### ✅ Perfekt geeignet für:

#### 1. Web-Anwendungen
- E-Commerce Plattformen
- SaaS Produkte
- Dashboards & Admin-Panels
- Content Management Systeme
- Social Media Plattformen
- Booking/Reservation Systeme
- Portfolio Websites
- Blog Plattformen

#### 2. Mobile App Backends
- React Native Apps (direkte Supabase Integration)
- Flutter/Dart Apps
- Native Apps über REST API
- Progressive Web Apps (PWA)

#### 3. Real-time Anwendungen
- Chat-Anwendungen
- Collaboration Tools
- Live-Dashboards
- Gaming-Backends
- Live-Streaming Kommentare
- Notification Systems

#### 4. API Services
- REST APIs
- GraphQL Services (mit Zusatz-Layer)
- Webhook Handler
- Microservices

### ⚠️ Weniger optimal für:

#### 1. High-Performance Computing
- **Machine Learning Training** → Besser: Python + specialized GPU infrastructure
- **Video Processing** → Besser: Dedicated media servers mit FFmpeg
- **Big Data Analytics** → Besser: Apache Spark, Hadoop

#### 2. Spezielle Datenbank-Anforderungen
- **Graph-basierte Apps** → Alternative: Neo4j (aber PostgreSQL mit Apache AGE Extension möglich)
- **Time-Series Heavy** → Alternative: InfluxDB, TimescaleDB (aber PostgreSQL mit TimescaleDB Extension möglich)
- **Document-heavy NoSQL** → Alternative: MongoDB (aber PostgreSQL JSONB ist sehr leistungsfähig)

#### 3. Enterprise Legacy Integration
- **.NET/C# Umgebungen** → Möglich aber nicht optimal
- **Java Enterprise Beans** → Separater Stack empfohlen
- **SOAP Services** → REST-to-SOAP Adapter nötig

## Universelle Projekt-Struktur

### Basis Template Repository

```bash
universal-project-template/
├── .github/
│   └── workflows/
│       ├── deploy.yml              # Universelle CI/CD Pipeline
│       ├── test.yml                # Automatische Tests
│       └── security-scan.yml       # Security Checks
├── docker/
│   ├── docker-compose.base.yml     # Basis Services
│   ├── docker-compose.dev.yml      # Development Overrides
│   ├── docker-compose.prod.yml     # Production Config
│   └── services/
│       ├── supabase.yml            # Supabase Konfiguration
│       ├── redis.yml               # Cache/Queue Service
│       └── monitoring.yml          # Grafana/Prometheus
├── scripts/
│   ├── setup-project.sh            # Projekt-Initialisierung
│   ├── db-migrate.sh               # Migration Tool
│   ├── deploy.sh                   # Deployment Script
│   └── backup.sh                   # Backup Automation
├── supabase/
│   ├── migrations/                 # Database Migrations
│   ├── functions/                  # Edge Functions
│   └── seed.sql                    # Initial Data
├── src/
│   ├── components/                 # Wiederverwendbare Components
│   ├── lib/                        # Utility Functions
│   ├── hooks/                      # Custom React Hooks
│   └── api/                        # API Routes
├── templates/
│   ├── nextjs/                     # Next.js Starter
│   ├── api/                        # Pure API Template
│   ├── mobile-backend/             # Mobile Backend Template
│   └── admin/                      # Admin Panel Template
├── docs/
│   ├── SETUP.md                    # Setup Anleitung
│   ├── DEPLOYMENT.md               # Deployment Guide
│   └── API.md                      # API Dokumentation
└── config/
    ├── nginx.conf                  # Nginx Konfiguration
    ├── .env.example                # Environment Variables Template
    └── tsconfig.base.json          # TypeScript Base Config
```

## Modularisierung mit Docker Compose

### Base Configuration (docker-compose.base.yml)

```yaml
version: '3.8'

x-default-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

services:
  # Immer benötigt
  database:
    extends:
      file: ./services/supabase.yml
      service: supabase-db
    logging: *default-logging

  # Optional - mit Profiles
  cache:
    profiles: ["cache", "full"]
    image: redis:alpine
    restart: unless-stopped
    logging: *default-logging

  search:
    profiles: ["search", "full"]
    image: getmeili/meilisearch:latest
    restart: unless-stopped
    logging: *default-logging

  monitoring:
    profiles: ["monitoring", "full"]
    image: grafana/grafana:latest
    restart: unless-stopped
    logging: *default-logging

  queue:
    profiles: ["queue", "full"]
    image: redis:alpine
    command: redis-server --appendonly yes
    restart: unless-stopped
    logging: *default-logging
```

### Verwendung mit Profiles

```bash
# Nur Basis-Services
docker-compose up

# Mit Cache
docker-compose --profile cache up

# Alle Services
docker-compose --profile full up
```

## Projekt-Generator Script

### setup-project.sh

```bash
#!/bin/bash

# Universal Project Setup Script
# Usage: ./setup-project.sh <type> <name>

PROJECT_TYPE=$1  # web, api, mobile, fullstack, admin
PROJECT_NAME=$2
TEMPLATE_REPO="https://github.com/yourusername/universal-template.git"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

function setup_project() {
    echo -e "${GREEN}🚀 Setting up $PROJECT_TYPE project: $PROJECT_NAME${NC}"
    
    # Clone template
    git clone $TEMPLATE_REPO $PROJECT_NAME
    cd $PROJECT_NAME
    rm -rf .git
    git init
    
    # Project-specific setup
    case $PROJECT_TYPE in
        web)
            echo "Setting up Next.js web application..."
            cp -r templates/nextjs/* .
            setup_frontend
            setup_supabase
            setup_nginx
            ;;
        api)
            echo "Setting up API service..."
            cp -r templates/api/* .
            setup_supabase
            setup_redis
            ;;
        mobile)
            echo "Setting up mobile backend..."
            cp -r templates/mobile-backend/* .
            setup_supabase
            setup_push_notifications
            ;;
        admin)
            echo "Setting up admin panel..."
            cp -r templates/admin/* .
            setup_frontend
            setup_supabase
            setup_auth
            ;;
        fullstack)
            echo "Setting up fullstack application..."
            setup_frontend
            setup_supabase
            setup_redis
            setup_nginx
            ;;
    esac
    
    # Common setup
    setup_github_actions
    setup_docker
    initialize_migrations
    create_env_file
    
    echo -e "${GREEN}✅ Project setup complete!${NC}"
}

function setup_frontend() {
    pnpm install
    echo "Frontend dependencies installed"
}

function setup_supabase() {
    npx supabase init
    echo "Supabase initialized"
}

function setup_redis() {
    echo "Redis configuration added to docker-compose"
}

function setup_nginx() {
    cp config/nginx.conf /tmp/nginx-$PROJECT_NAME.conf
    echo "Nginx configuration prepared"
}

function setup_github_actions() {
    mkdir -p .github/workflows
    cp .github/workflows/deploy.yml .github/workflows/
    echo "GitHub Actions configured"
}

function setup_docker() {
    echo "Docker configuration ready"
}

function initialize_migrations() {
    mkdir -p supabase/migrations
    echo "Migration system initialized"
}

function create_env_file() {
    cp config/.env.example .env.local
    echo -e "${YELLOW}⚠️  Don't forget to update .env.local with your values${NC}"
}

function setup_push_notifications() {
    echo "Push notification service configured"
}

function setup_auth() {
    echo "Authentication system configured"
}

# Run setup
setup_project
```

## Environment Variables Template

### .env.template (Universell für alle Projekte)

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
DATABASE_URL=

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Email Service (Optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=

# Payment (Optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Storage (Optional)
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Monitoring (Optional)
SENTRY_DSN=
MONITORING_KEY=

# Analytics (Optional)
PLAUSIBLE_DOMAIN=
GA_MEASUREMENT_ID=

# Push Notifications (Optional)
FCM_SERVER_KEY=
APNS_KEY=

# Search (Optional)
MEILISEARCH_HOST=
MEILISEARCH_KEY=
```

## Erweiterte Services

### Optionale Services bei Bedarf

```javascript
// config/optional-services.js

export const optionalServices = {
  // Caching & Queue
  cache: {
    service: 'Redis',
    docker: 'redis:alpine',
    use_case: 'Session storage, Caching, Rate limiting'
  },
  queue: {
    service: 'BullMQ',
    docker: 'redis:alpine',
    use_case: 'Background jobs, Email queue, Scheduled tasks'
  },
  
  // Search
  search: {
    service: 'MeiliSearch',
    docker: 'getmeili/meilisearch',
    use_case: 'Full-text search, Faceted search, Typo tolerance'
  },
  
  // Storage & CDN
  storage: {
    service: 'MinIO / S3',
    docker: 'minio/minio',
    use_case: 'File storage, Image hosting, Backups'
  },
  cdn: {
    service: 'Cloudflare',
    external: true,
    use_case: 'Static asset delivery, DDoS protection'
  },
  
  // Analytics & Monitoring
  analytics: {
    service: 'Plausible',
    docker: 'plausible/analytics',
    use_case: 'Privacy-friendly website analytics'
  },
  monitoring: {
    service: 'Grafana + Prometheus',
    docker: 'grafana/grafana',
    use_case: 'System monitoring, Performance metrics'
  },
  
  // Communication
  email: {
    service: 'Resend / SendGrid',
    external: true,
    use_case: 'Transactional emails, Newsletter'
  },
  sms: {
    service: 'Twilio',
    external: true,
    use_case: 'SMS notifications, 2FA'
  },
  push: {
    service: 'FCM / OneSignal',
    external: true,
    use_case: 'Mobile push notifications'
  },
  
  // Payment
  payment: {
    service: 'Stripe / Paddle',
    external: true,
    use_case: 'Payment processing, Subscriptions'
  },
  
  // AI & ML
  ai: {
    service: 'OpenAI / Anthropic',
    external: true,
    use_case: 'AI features, Content generation'
  },
  vectordb: {
    service: 'Pinecone / pgvector',
    docker: 'pgvector/pgvector',
    use_case: 'Semantic search, Embeddings'
  }
};
```

## Automatisierungs-Workflow

### 1. Neues Projekt starten

```bash
# Download und execute setup script
curl -o setup-project.sh https://raw.githubusercontent.com/yourusername/universal-template/main/setup-project.sh
chmod +x setup-project.sh
./setup-project.sh web my-new-project
```

### 2. Entwicklung

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up
pnpm dev

# Create database migration
npm run db:migrate:create "add-feature"

# Run tests
npm test
```

### 3. Deployment

```bash
# Commit and push - CI/CD handles the rest
git add .
git commit -m "feat: Initial setup"
git push origin main
```

## Best Practices

### 1. Konsistenz
- Gleiche Ordnerstruktur in allen Projekten
- Einheitliche Naming Conventions
- Standardisierte Environment Variables

### 2. Dokumentation
- README.md in jedem Projekt
- API Dokumentation mit OpenAPI/Swagger
- Inline Code-Kommentare wo nötig

### 3. Security
- Secrets niemals committen
- Environment Variables für Konfiguration
- Regular Security Updates
- HTTPS überall

### 4. Testing
- Unit Tests für Business Logic
- Integration Tests für APIs
- E2E Tests für kritische User Flows

### 5. Monitoring
- Error Tracking (Sentry)
- Performance Monitoring
- Uptime Monitoring
- Log Aggregation

## Wartung & Updates

### Regelmäßige Updates

```bash
# Update dependencies
pnpm update

# Update Docker images
docker-compose pull

# Check for security vulnerabilities
pnpm audit

# Update Supabase CLI
pnpm add -g supabase@latest
```

### Template Repository pflegen

1. Central Template Repository als "Source of Truth"
2. Regelmäßige Updates des Templates
3. Changelog führen für Template-Änderungen
4. Breaking Changes kommunizieren

## Kosten-Optimierung

### Ein VPS - Mehrere Projekte

```nginx
# /etc/nginx/sites-available/multi-project

# Project 1
server {
    server_name project1.example.com;
    location / {
        proxy_pass http://localhost:3001;
    }
}

# Project 2
server {
    server_name project2.example.com;
    location / {
        proxy_pass http://localhost:3002;
    }
}

# Shared Supabase
server {
    server_name db.example.com;
    location / {
        proxy_pass http://localhost:8000;
    }
}
```

## Troubleshooting

### Häufige Probleme

1. **Port Konflikte**
   - Lösung: Verschiedene Ports pro Projekt in .env

2. **Memory Issues**
   - Lösung: Docker memory limits setzen

3. **SSL Zertifikate**
   - Lösung: Certbot mit Auto-Renewal

4. **Database Migrations**
   - Lösung: Immer Backups vor großen Änderungen

## Fazit

Dieser Stack deckt 90% aller Projekt-Anforderungen ab und bietet:

- ✅ **Schnelle Projekt-Initialisierung** (< 5 Minuten)
- ✅ **Konsistente Development Experience**
- ✅ **Automatisiertes Deployment**
- ✅ **Skalierbarkeit** durch modularen Aufbau
- ✅ **Kosten-Effizienz** durch Ressourcen-Sharing
- ✅ **Wartbarkeit** durch Standardisierung

Für spezielle Anforderungen kann der Stack modular erweitert werden, ohne die Basis-Architektur zu verändern.