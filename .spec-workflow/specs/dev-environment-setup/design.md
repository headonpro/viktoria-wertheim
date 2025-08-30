# Design Document

## Overview

Die Development Environment Setup Lösung basiert auf der Kopie des bestehenden Repositories in ein isoliertes Entwicklungs-Repository mit eigener Docker-Infrastruktur. Diese Architektur nutzt die bereits vorhandene Docker-Compose-Konfiguration und Supabase-Setup, modifiziert aber Ports, Container-Namen und Volumes für vollständige Isolation. Das Design ermöglicht parallelen Betrieb von Entwicklung und Produktion auf derselben Maschine.

## Steering Document Alignment

### Technical Standards (tech.md)
- **Docker-First Approach**: Fortsetzung der Container-basierten Architektur
- **PostgreSQL 15**: Gleiche Datenbank-Version wie Produktion
- **Next.js 15 mit Turbopack**: Identische Frontend-Technologie
- **Environment-basierte Konfiguration**: Nutzung von .env Dateien für Flexibilität

### Project Structure (structure.md)
- **Repository-Struktur**: Exakte Kopie der Produktions-Struktur
- **Docker-Compose Patterns**: Erweiterung der bestehenden docker-compose.yml
- **Supabase-Ordner**: Beibehaltung der supabase/ Struktur mit migrations und seeds
- **Branch-Strategie**: Isolierte Entwicklung ohne Merge-Konflikte

## Code Reuse Analysis

### Existing Components to Leverage
- **docker-compose.production.yml**: Basis für docker-compose.dev.yml
- **supabase/migrations/**: Alle Schema-Migrationen wiederverwendbar
- **supabase/seed/**: Anpassbare Seed-Skripte für Test-Daten
- **.env.example**: Template für Environment-Variablen
- **Makefile**: Erweiterbar für Dev-spezifische Commands

### Integration Points
- **Git Remote**: Separates Repository oder Orphan Branch
- **Docker Network**: Eigenes Network für Dev-Container
- **PostgreSQL**: Port 5433 statt 5432 für Konfliktfreiheit
- **Next.js Dev Server**: Port 3001 statt 3000
- **Supabase Studio**: Port 54324 statt 54323

## Architecture

### Modular Design Principles
- **Single File Responsibility**: Separate Docker-Compose für jede Umgebung
- **Component Isolation**: Unabhängige Container ohne Shared Volumes
- **Service Layer Separation**: Klare Trennung von Web, DB und Studio Services
- **Utility Modularity**: Eigene Skripte für Dev-Setup und Maintenance

```mermaid
graph TD
    subgraph "Production Environment"
        P_Repo[viktoria-wertheim]
        P_Docker[docker-compose.production.yml]
        P_Web[Web :3000]
        P_DB[PostgreSQL :5432]
        P_Studio[Studio :54323]
        P_Volume[postgres-data]
    end
    
    subgraph "Development Environment"
        D_Repo[viktoria-wertheim-dev]
        D_Docker[docker-compose.dev.yml]
        D_Web[Web :3001]
        D_DB[PostgreSQL :5433]
        D_Studio[Studio :54324]
        D_Volume[postgres-dev-data]
    end
    
    P_Repo -.->|copy| D_Repo
    P_Docker -.->|template| D_Docker
    
    subgraph "Shared Host System"
        Docker[Docker Engine]
        Network1[viktoria-network]
        Network2[viktoria-dev-network]
    end
    
    P_Web --> Network1
    P_DB --> Network1
    P_Studio --> Network1
    
    D_Web --> Network2
    D_DB --> Network2
    D_Studio --> Network2
```

## Components and Interfaces

### Repository Manager Component
- **Purpose:** Verwaltung der Repository-Kopie und Git-Konfiguration
- **Interfaces:** 
  - `setup-dev-repo.sh`: Initiales Setup-Skript
  - `sync-from-prod.sh`: Selektive Übernahme von Änderungen
- **Dependencies:** Git, Unix Shell
- **Reuses:** Keine direkten Abhängigkeiten

### Docker Environment Component
- **Purpose:** Container-Orchestrierung für Development
- **Interfaces:**
  - `docker-compose.dev.yml`: Dev-spezifische Konfiguration
  - `make dev-up`: Start der Dev-Umgebung
  - `make dev-down`: Stopp der Dev-Umgebung
  - `make dev-reset`: Kompletter Reset
- **Dependencies:** Docker, Docker Compose
- **Reuses:** docker-compose.production.yml als Template

### Database Manager Component
- **Purpose:** Verwaltung der Development-Datenbank
- **Interfaces:**
  - `make db-seed`: Test-Daten einfügen
  - `make db-reset`: Datenbank zurücksetzen
  - `make db-migrate`: Migrations ausführen
- **Dependencies:** PostgreSQL Client, Supabase CLI
- **Reuses:** supabase/migrations/, supabase/seed/

### Environment Configuration Component
- **Purpose:** Management von Environment-Variablen
- **Interfaces:**
  - `.env.development`: Dev-spezifische Variablen
  - `.env.example`: Template für neue Entwickler
  - `check-env.sh`: Validierung der Konfiguration
- **Dependencies:** Shell, Node.js dotenv
- **Reuses:** Existierende .env Struktur

## Data Models

### Docker Service Configuration
```yaml
services:
  web-dev:
    container_name: viktoria-dev-web
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:devpass@postgres-dev:5432/viktoria_dev
    networks:
      - viktoria-dev-network
  
  postgres-dev:
    container_name: viktoria-dev-postgres
    ports:
      - "5433:5432"
    environment:
      - POSTGRES_PASSWORD=devpass
      - POSTGRES_DB=viktoria_dev
    volumes:
      - postgres-dev-data:/var/lib/postgresql/data
    networks:
      - viktoria-dev-network
  
  studio-dev:
    container_name: viktoria-dev-studio
    ports:
      - "54324:3000"
    networks:
      - viktoria-dev-network
```

### Environment Variables Model
```bash
# .env.development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://postgres:devpass@localhost:5433/viktoria_dev
POSTGRES_PASSWORD=devpass

# Supabase Local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=dev-service-key-here

# Development Settings
DEBUG=true
HOT_RELOAD=true
```

### Repository Structure Model
```
viktoria-wertheim-dev/
├── .git/                    # Neue Git-Historie
├── .env.development         # Dev Environment
├── .env.example            # Template
├── docker-compose.dev.yml  # Dev Docker Config
├── docker-compose.yml      # Symlink zu .dev.yml
├── Makefile                # Erweitert mit Dev-Commands
├── scripts/
│   ├── setup-dev.sh       # Initial Setup
│   ├── reset-dev.sh       # Complete Reset
│   └── sync-from-prod.sh  # Selective Sync
├── supabase/              # Unverändert
├── src/                   # Unverändert
└── README.dev.md          # Dev-spezifische Doku
```

## Error Handling

### Error Scenarios

1. **Port-Konflikt:**
   - **Handling:** Automatische Port-Erkennung und Alternative vorschlagen
   - **User Impact:** Klare Fehlermeldung mit Lösungsvorschlag

2. **Docker Volume Konflikt:**
   - **Handling:** Eindeutige Volume-Namen mit Prefix `dev-`
   - **User Impact:** Automatische Konfliktauflösung

3. **Environment Variable Missing:**
   - **Handling:** Check-Skript mit Validation vor Start
   - **User Impact:** Liste fehlender Variablen mit Beispielwerten

4. **Database Migration Fehler:**
   - **Handling:** Rollback-Mechanismus und Clean-State Option
   - **User Impact:** Option für kompletten DB-Reset

5. **Container Start Failure:**
   - **Handling:** Health-Checks und Auto-Restart mit Backoff
   - **User Impact:** Detailliertes Log mit Troubleshooting-Guide

## Testing Strategy

### Unit Testing
- **Approach:** Jest für Frontend-Komponenten
- **Key Components:** 
  - Environment-Detection Utilities
  - Docker Health-Check Scripts
  - Migration Validation

### Integration Testing
- **Approach:** Docker-Compose Test Suite
- **Key Flows:**
  - Container-Start-Sequenz
  - Database-Verbindung
  - API-Endpoints zwischen Services

### End-to-End Testing
- **Approach:** Playwright mit Dev-Umgebung
- **User Scenarios:**
  - Kompletter Setup-Prozess
  - Datenbank-Reset und Re-Seed
  - Feature-Entwicklung Workflow
  - Code-Sync zwischen Umgebungen