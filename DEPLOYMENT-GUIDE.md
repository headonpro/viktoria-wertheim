# 📚 SV Viktoria Wertheim - Deployment Guide

## 🔄 Wie funktioniert das automatische Deployment?

### **Der Workflow im Überblick:**

```mermaid
[Lokale Entwicklung] → [Git Push] → [GitHub] → [Actions] → [VPS Server] → [Live Website]
```

1. **Du entwickelst lokal** auf deinem Linux Desktop
2. **Du pushst zu GitHub** (main Branch)
3. **GitHub Actions startet automatisch**
4. **Actions verbindet sich per SSH** zum VPS Server
5. **Server pullt die Änderungen** von GitHub
6. **Docker baut neue Container**
7. **Website wird neu gestartet** mit den Änderungen

---

## 🚀 Wie verwende ich das System?

### **Für normale Entwicklung:**

```bash
# 1. Änderungen machen (z.B. neue Features, Bugfixes)
code src/components/HomePage.tsx

# 2. Änderungen testen
pnpm run dev

# 3. Änderungen committen
git add .
git commit -m "feat: Neue Funktion hinzugefügt"

# 4. Zu GitHub pushen (löst automatisches Deployment aus!)
git push origin main

# 5. Warten (ca. 1-2 Minuten)
# Die Website wird automatisch aktualisiert!
```

### **Deployment Status prüfen:**

1. **GitHub Actions Dashboard:**
   - https://github.com/headonpro/viktoria-wertheim/actions
   - Grüner Haken ✅ = Erfolgreich deployed
   - Roter X ❌ = Fehler beim Deployment

2. **Live Website prüfen:**
   - https://viktoria.headon.pro
   - Änderungen sollten nach 1-2 Minuten sichtbar sein

---

## 📁 Wichtige Dateien & Ihre Funktion

### **Lokale Entwicklung (dein Desktop):**
```
/home/headon/projects/viktoria-wertheim/
├── src/                    # Source Code (hier entwickelst du)
├── public/                 # Statische Dateien (Bilder, etc.)
├── package.json            # Dependencies
├── Dockerfile              # Container-Definition
├── docker-compose.yml      # Lokale Docker-Config
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions Workflow
```

### **Production Server (VPS):**
```
/opt/devserver/projects/viktoria-wertheim/
├── [Gleiche Struktur wie lokal]
├── docker-compose.production.yml  # Production Docker-Config
└── .env.production                # Production Environment Variables
```

---

## 🔧 Häufige Aufgaben

### **1. Neue Features entwickeln:**
```bash
# Feature entwickeln
git checkout -b feature/mein-feature
# ... Änderungen machen ...
git add .
git commit -m "feat: Mein neues Feature"
git checkout main
git merge feature/mein-feature
git push origin main  # → Automatisches Deployment!
```

### **2. Hotfix deployen:**
```bash
# Direkt auf main arbeiten für schnelle Fixes
git add .
git commit -m "fix: Kritischer Bug behoben"
git push origin main  # → Sofortiges Deployment!
```

### **3. Deployment manuell triggern:**
1. Gehe zu: https://github.com/headonpro/viktoria-wertheim/actions
2. Klicke auf "Deploy to Production VPS"
3. Klicke auf "Run workflow"
4. Wähle Branch: main
5. Klicke auf "Run workflow" Button

### **4. Server-Logs prüfen:**
```bash
# SSH zum Server
ssh root@91.98.117.169

# Docker Logs anzeigen
docker logs viktoria-web --tail 50

# Container Status prüfen
docker ps | grep viktoria
```

---

## ⚠️ Wichtige Hinweise

### **Was passiert beim Deployment:**
1. **Backup** wird automatisch erstellt
2. **Git Pull** holt neueste Änderungen
3. **Docker Build** erstellt neue Container
4. **Zero-Downtime** Deployment (Website bleibt online)
5. **Health Check** prüft ob alles funktioniert

### **Was du NICHT tun solltest:**
- ❌ Direkt auf dem Server Dateien ändern
- ❌ Force Push auf main Branch
- ❌ .env.production lokal committen (enthält Passwörter!)
- ❌ docker-compose.production.yml lokal ändern ohne Test

### **Was du TUN solltest:**
- ✅ Immer erst lokal testen
- ✅ Aussagekräftige Commit Messages schreiben
- ✅ GitHub Actions Status prüfen nach Push
- ✅ Bei Problemen die Logs checken

---

## 🔑 Zugänge & URLs

### **GitHub Repository:**
- URL: https://github.com/headonpro/viktoria-wertheim
- Actions: https://github.com/headonpro/viktoria-wertheim/actions

### **Live Website:**
- URL: https://viktoria.headon.pro
- Port: 443 (HTTPS)

### **VPS Server:**
- IP: 91.98.117.169
- SSH: `ssh root@91.98.117.169`
- Projekt: `/opt/devserver/projects/viktoria-wertheim/`

### **Docker Container:**
- `viktoria-web` - Next.js App (Port 8001)
- `viktoria-postgres` - PostgreSQL DB (Port 5433)
- `supabase-*` - Supabase Services

---

## 🆘 Troubleshooting

### **Problem: Deployment schlägt fehl**
1. Prüfe GitHub Actions Logs
2. SSH zum Server und prüfe Docker Logs
3. Stelle sicher dass der Build lokal funktioniert

### **Problem: Website nicht erreichbar**
```bash
# Auf Server prüfen
ssh root@91.98.117.169
docker ps | grep viktoria
docker-compose -f docker-compose.production.yml restart
```

### **Problem: Änderungen nicht sichtbar**
1. Warte 2-3 Minuten (Deployment dauert)
2. Browser Cache leeren (Ctrl+F5)
3. Prüfe GitHub Actions Status

### **Rollback bei Problemen:**
```bash
# Auf Server
ssh root@91.98.117.169
cd /opt/devserver/projects
# Letztes Backup finden
ls -la viktoria-backup-*
# Backup wiederherstellen
rm -rf viktoria-wertheim
cp -r viktoria-backup-[DATUM] viktoria-wertheim
cd viktoria-wertheim
docker-compose -f docker-compose.production.yml up -d --build
```

---

## 📊 Monitoring

### **Container Health Status:**
```bash
# Auf Server
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### **Logs in Echtzeit:**
```bash
# Auf Server
docker logs -f viktoria-web
```

### **Deployment History:**
- GitHub Actions: https://github.com/headonpro/viktoria-wertheim/actions

---

## 🎯 Best Practices

1. **Kleine, häufige Deployments** statt große, seltene
2. **Teste lokal** bevor du pushst
3. **Schreibe gute Commit Messages** für Nachvollziehbarkeit
4. **Prüfe den Deployment Status** nach jedem Push
5. **Dokumentiere größere Änderungen** im README

---

## 💡 Tipps & Tricks

### **Schneller Deploy-Check:**
```bash
# Nach git push ausführen
sleep 90 && curl -s https://viktoria.headon.pro/api/health | jq
```

### **Lokale Production-Simulation:**
```bash
# Lokal mit Production-Settings testen
NODE_ENV=production pnpm run build
NODE_ENV=production pnpm run start
```

### **Git Alias für schnelles Deployment:**
```bash
# In ~/.gitconfig oder ~/.zshrc hinzufügen
alias deploy="git add . && git commit -m 'update' && git push origin main"
```

---

## 📞 Support

Bei Problemen:
1. Prüfe diese Dokumentation
2. Schaue in die GitHub Actions Logs
3. Prüfe die Server Logs
4. Erstelle ein GitHub Issue

---

**Viel Erfolg mit dem automatischen Deployment! 🚀**