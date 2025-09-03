# CI/CD Pipeline Setup für Viktoria Wertheim

## ✅ Einrichtung abgeschlossen!

Die automatische CI/CD-Pipeline ist jetzt vollständig eingerichtet.

### 🔧 Komponenten

1. **GitHub Actions Workflow** (`.github/workflows/deploy-vps.yml`)
   - Wird bei jedem Push auf `main` Branch ausgelöst
   - Kann auch manuell über GitHub Actions UI getriggert werden

2. **VPS Deployment Script** (`deploy-auto.sh`)
   - Optimiertes Script mit Logging und Error-Handling
   - Logs werden nach `/var/log/viktoria-deployment.log` geschrieben

3. **SSH-Key Authentication**
   - Spezieller Deploy-Key für GitHub Actions erstellt
   - Sicher in GitHub Secrets gespeichert

### 📝 Benötigte GitHub Secrets

Die folgenden Secrets müssen im GitHub Repository konfiguriert werden:
(Settings → Secrets and variables → Actions)

- `VPS_HOST`: 91.98.117.169
- `VPS_USER`: root  
- `VPS_SSH_KEY`: Der generierte Private Key (siehe github-secrets-setup.md)

### 🚀 Deployment-Prozess

1. Code wird auf `main` Branch gepusht
2. GitHub Actions Workflow startet automatisch
3. Workflow verbindet sich per SSH zum VPS
4. Führt folgende Schritte aus:
   - Git pull der neuesten Änderungen
   - Docker Image Build
   - Container-Neustart mit neuer Version
   - Health-Check der Anwendung
   - Cleanup alter Images

### 📊 Monitoring

- **GitHub Actions**: Check unter Actions Tab im Repository
- **VPS Logs**: `ssh root@91.98.117.169 "tail -f /var/log/viktoria-deployment.log"`
- **Container Status**: `ssh root@91.98.117.169 "docker ps | grep viktoria"`

### 🔒 Sicherheit

- SSH-Key ist nur für Deployment berechtigt
- Secrets sind verschlüsselt in GitHub gespeichert
- Keine Passwörter im Code oder in Logs

### 🧪 Testen der Pipeline

1. GitHub Secrets einrichten (siehe github-secrets-setup.md)
2. Diese Änderungen committen und pushen
3. Im GitHub Repository unter "Actions" den Workflow-Status prüfen

### 🛠️ Manuelles Deployment

Falls nötig, kann das Deployment auch manuell getriggert werden:
- GitHub Actions UI: "Run workflow" Button
- Oder auf dem VPS: `/opt/devserver/projects/viktoria-wertheim/deploy-auto.sh`

### ⚠️ Wichtige Hinweise

- **LÖSCHE** die Datei `github-secrets-setup.md` nach dem Einrichten der Secrets!
- Der SSH-Key sollte regelmäßig rotiert werden (alle 3-6 Monate)
- Überprüfe regelmäßig die Deployment-Logs auf Fehler