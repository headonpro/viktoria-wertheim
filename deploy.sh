#!/bin/bash
set -e

# ================================================
# Viktoria Wertheim - Vereinfachtes Deploy Script  
# ================================================
#
# Verwendung:
#   Lokal:      ./deploy.sh dev
#   Production: ./deploy.sh prod
#   VPS Setup:  ./deploy.sh vps-setup
#
# ================================================

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktion für formatierte Ausgabe
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# ================================================
# MAIN SCRIPT
# ================================================

MODE=${1:-dev}

case $MODE in
    # --------------------------------------------
    # LOKALE ENTWICKLUNG
    # --------------------------------------------
    dev)
        log "🚀 Starte lokale Entwicklungsumgebung..."
        
        # Prüfe .env
        if [ ! -f .env ]; then
            warning ".env nicht gefunden. Erstelle aus .env.example..."
            cp .env.example .env
            error "Bitte .env anpassen und erneut starten!"
        fi
        
        # Starte Supabase Stack + Studio
        log "📦 Starte Supabase Services..."
        docker-compose --profile dev up -d
        
        # Warte auf Services
        log "⏳ Warte auf Services..."
        sleep 10
        
        # Status anzeigen
        log "✅ Services gestartet:"
        docker-compose --profile dev ps
        
        echo ""
        log "📍 Zugriff:"
        echo "   Supabase API:    http://localhost:8000"
        echo "   Supabase Studio: http://localhost:54323"
        echo "   Next.js App:     http://localhost:3000 (manuell starten mit: pnpm dev)"
        ;;
    
    # --------------------------------------------
    # PRODUCTION DEPLOYMENT
    # --------------------------------------------
    prod)
        log "🚀 Starte Production Deployment..."
        
        # Prüfe .env.production
        if [ ! -f .env.production ]; then
            error ".env.production nicht gefunden!"
        fi
        
        # Backup .env und nutze .env.production
        if [ -f .env ]; then
            mv .env .env.backup
        fi
        cp .env.production .env
        
        # Build Web App
        log "🏗️ Baue Next.js Application..."
        docker-compose build web
        
        # Starte alle Services
        log "📦 Starte Production Services..."
        docker-compose --profile prod up -d
        
        # Restore .env
        if [ -f .env.backup ]; then
            mv .env.backup .env
        fi
        
        # Warte auf Services
        log "⏳ Warte auf Services..."
        sleep 20
        
        # Health Check
        log "🧪 Führe Health Check durch..."
        curl -f http://localhost:8001/api/health || warning "Web App Health Check fehlgeschlagen"
        
        # Status
        log "✅ Production Services gestartet:"
        docker-compose --profile prod ps
        
        echo ""
        log "📍 Production läuft auf:"
        echo "   Web App:      http://localhost:8001"
        echo "   Supabase API: http://localhost:8000"
        ;;
    
    # --------------------------------------------
    # VPS SETUP (Einmalig)
    # --------------------------------------------
    vps-setup)
        log "🚀 VPS Initial Setup..."
        
        # Prüfe ob auf VPS
        if [[ ! $(hostname -I | awk '{print $1}') == "91.98.117.169" ]]; then
            warning "Nicht auf VPS (91.98.117.169). Trotzdem fortfahren? (y/n)"
            read -r response
            [[ "$response" != "y" ]] && exit 0
        fi
        
        # Erstelle Verzeichnisse
        log "📁 Erstelle Projektstruktur..."
        mkdir -p /opt/viktoria/{backups,volumes,logs}
        
        # Clone Repository
        log "📥 Clone Repository..."
        cd /opt/viktoria
        git clone https://github.com/headonpro/viktoria-wertheim.git app
        cd app
        
        # Setup Environment
        log "🔧 Setup Environment..."
        if [ ! -f .env.production ]; then
            cp .env.example .env.production
            warning "⚠️ Bitte .env.production anpassen!"
            exit 1
        fi
        
        # Initiales Deployment
        ./deploy.sh prod
        
        log "✅ VPS Setup abgeschlossen!"
        ;;
    
    # --------------------------------------------
    # STOP
    # --------------------------------------------
    stop)
        log "🛑 Stoppe alle Services..."
        docker-compose down
        log "✅ Alle Services gestoppt"
        ;;
    
    # --------------------------------------------
    # CLEAN (Vorsicht!)
    # --------------------------------------------
    clean)
        warning "⚠️ Dies löscht alle Container, Volumes und Daten!"
        echo "Wirklich fortfahren? (yes/no)"
        read -r response
        if [ "$response" = "yes" ]; then
            log "🧹 Räume auf..."
            docker-compose down -v --remove-orphans
            log "✅ Aufgeräumt"
        else
            log "Abgebrochen"
        fi
        ;;
    
    # --------------------------------------------
    # STATUS
    # --------------------------------------------
    status)
        log "📊 Service Status:"
        docker-compose ps
        echo ""
        log "📈 Resource Usage:"
        docker stats --no-stream
        ;;
    
    # --------------------------------------------
    # LOGS
    # --------------------------------------------
    logs)
        SERVICE=${2:-}
        if [ -z "$SERVICE" ]; then
            docker-compose logs --tail=50 --follow
        else
            docker-compose logs --tail=50 --follow "$SERVICE"
        fi
        ;;
    
    # --------------------------------------------
    # BACKUP
    # --------------------------------------------
    backup)
        log "💾 Erstelle Backup..."
        BACKUP_DIR="backups/manual-$(date +%Y%m%d-%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        
        # Datenbank Backup
        log "Sichere Datenbank..."
        docker-compose exec -T db pg_dump -U postgres > "$BACKUP_DIR/database.sql"
        
        # Environment Backup
        cp .env* "$BACKUP_DIR/" 2>/dev/null || true
        
        log "✅ Backup erstellt in: $BACKUP_DIR"
        ;;
    
    # --------------------------------------------
    # HILFE
    # --------------------------------------------
    *)
        echo "Viktoria Wertheim - Deploy Script"
        echo ""
        echo "Verwendung: ./deploy.sh [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  dev        Starte lokale Entwicklung (Supabase + Studio)"
        echo "  prod       Starte Production (Supabase + Web App)"
        echo "  vps-setup  Initiales VPS Setup"
        echo "  stop       Stoppe alle Services"
        echo "  clean      Lösche alles (Vorsicht!)"
        echo "  status     Zeige Service Status"
        echo "  logs       Zeige Logs (optional: SERVICE)"
        echo "  backup     Erstelle manuelles Backup"
        echo ""
        echo "Beispiele:"
        echo "  ./deploy.sh dev              # Lokale Entwicklung"
        echo "  ./deploy.sh prod             # Production Deployment"
        echo "  ./deploy.sh logs web         # Logs vom Web Service"
        echo "  ./deploy.sh backup           # Backup erstellen"
        ;;
esac