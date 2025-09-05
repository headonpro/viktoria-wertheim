#!/bin/bash

# Setup Monitoring for SV Viktoria Wertheim
# Configures cron jobs and monitoring services

set -e

PROJECT_PATH="/opt/devserver/projects/viktoria-wertheim"
LOG_DIR="/var/log/viktoria"

echo "🔧 Setting up monitoring for SV Viktoria Wertheim..."

# Create log directory
echo "📁 Creating log directory..."
sudo mkdir -p "$LOG_DIR"
sudo chown $(whoami):$(whoami) "$LOG_DIR"

# Install required packages
echo "📦 Installing monitoring dependencies..."
if ! command -v bc &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y bc
fi

if ! command -v jq &> /dev/null; then
    sudo apt-get install -y jq
fi

if ! command -v mail &> /dev/null; then
    echo "⚠️ Mail command not found. Installing mailutils..."
    sudo apt-get install -y mailutils
fi

# Setup cron jobs
echo "⏰ Setting up cron jobs..."

# Create temporary cron file
TEMP_CRON="/tmp/viktoria-cron"

# Get current cron jobs (excluding viktoria monitoring)
crontab -l 2>/dev/null | grep -v "viktoria" > "$TEMP_CRON" || touch "$TEMP_CRON"

# Add monitoring cron jobs
cat >> "$TEMP_CRON" << EOF

# SV Viktoria Wertheim Monitoring Jobs
# Health check every 5 minutes
*/5 * * * * $PROJECT_PATH/scripts/health-monitor.sh >> /var/log/viktoria/health-monitor.log 2>&1

# Database backup daily at 2 AM
0 2 * * * $PROJECT_PATH/scripts/backup-database.sh >> /var/log/viktoria/backup.log 2>&1

# Rotate backups weekly on Sunday at 3 AM
0 3 * * 0 $PROJECT_PATH/scripts/rotate-backups.sh >> /var/log/viktoria/backup-rotation.log 2>&1

# Docker cleanup weekly on Sunday at 4 AM
0 4 * * 0 docker system prune -f >> /var/log/viktoria/docker-cleanup.log 2>&1

# SSL certificate check daily at 6 AM
0 6 * * * openssl s_client -servername viktoria.headon.pro -connect viktoria.headon.pro:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter >> /var/log/viktoria/ssl-check.log 2>&1

# Log rotation weekly on Monday at 1 AM
0 1 * * 1 find /var/log/viktoria -name "*.log" -type f -size +100M -exec gzip {} \; >> /var/log/viktoria/log-rotation.log 2>&1

EOF

# Install new cron jobs
crontab "$TEMP_CRON"
rm "$TEMP_CRON"

echo "✅ Cron jobs installed successfully"

# Create systemd service for continuous monitoring (optional)
echo "🔧 Creating systemd service..."

sudo tee /etc/systemd/system/viktoria-monitor.service > /dev/null << EOF
[Unit]
Description=SV Viktoria Wertheim Health Monitor
After=network.target docker.service
Requires=docker.service

[Service]
Type=oneshot
User=$(whoami)
WorkingDirectory=$PROJECT_PATH
ExecStart=$PROJECT_PATH/scripts/health-monitor.sh
StandardOutput=append:/var/log/viktoria/health-monitor.log
StandardError=append:/var/log/viktoria/health-monitor-error.log

[Install]
WantedBy=multi-user.target
EOF

# Create timer for systemd service (alternative to cron)
sudo tee /etc/systemd/system/viktoria-monitor.timer > /dev/null << EOF
[Unit]
Description=Run SV Viktoria Health Monitor every 5 minutes
Requires=viktoria-monitor.service

[Timer]
OnCalendar=*:0/5
Persistent=true

[Install]
WantedBy=timers.target
EOF

# Reload systemd and start timer
sudo systemctl daemon-reload
sudo systemctl enable viktoria-monitor.timer
sudo systemctl start viktoria-monitor.timer

echo "✅ Systemd monitoring service created and started"

# Setup log rotation
echo "🔄 Setting up log rotation..."

sudo tee /etc/logrotate.d/viktoria > /dev/null << EOF
/var/log/viktoria/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $(whoami) $(whoami)
    postrotate
        # Restart services if needed
        systemctl restart viktoria-monitor.timer || true
    endscript
}
EOF

echo "✅ Log rotation configured"

# Create monitoring dashboard script
cat > "$PROJECT_PATH/scripts/monitoring-dashboard.sh" << 'EOF'
#!/bin/bash

# Simple monitoring dashboard
echo "========================================"
echo "🏥 SV Viktoria Wertheim Health Dashboard"
echo "========================================"
echo "Time: $(date)"
echo ""

echo "🌐 Website Status:"
if curl -f -s https://viktoria.headon.pro/api/health > /dev/null; then
    echo "  ✅ Website is UP"
    echo "  🏥 Health: $(curl -s https://viktoria.headon.pro/api/health | jq -r '.status // "unknown"')"
else
    echo "  ❌ Website is DOWN"
fi
echo ""

echo "🐳 Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(viktoria|supabase)"
echo ""

echo "📊 System Resources:"
echo "  💾 Disk Usage: $(df -h /opt | tail -1 | awk '{print "Used: " $3 " / " $2 " (" $5 ")"}')"
echo "  🧠 Memory Usage: $(free -h | grep Mem | awk '{print "Used: " $3 " / " $2}')"
echo "  ⚡ Load Average: $(uptime | awk -F'load average:' '{print $2}')"
echo ""

echo "🗄️ Database Status:"
if docker exec supabase-db pg_isready -U postgres > /dev/null 2>&1; then
    echo "  ✅ Database is UP"
    echo "  🔌 Connections: $(docker exec supabase-db psql -U postgres -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tr -d ' ' || echo "unknown")"
else
    echo "  ❌ Database is DOWN"
fi
echo ""

echo "📝 Recent Logs (last 5 entries):"
tail -5 /var/log/viktoria/health-monitor.log 2>/dev/null || echo "  No logs available"
echo ""
echo "========================================"
EOF

chmod +x "$PROJECT_PATH/scripts/monitoring-dashboard.sh"

# Test the monitoring setup
echo "🧪 Testing monitoring setup..."
"$PROJECT_PATH/scripts/health-monitor.sh"

echo ""
echo "✅ Monitoring setup completed!"
echo ""
echo "📋 Summary:"
echo "  • Health checks run every 5 minutes"
echo "  • Daily database backups at 2 AM"
echo "  • Weekly backup rotation on Sunday"
echo "  • Weekly Docker cleanup on Sunday"
echo "  • Daily SSL certificate checks"
echo "  • Log rotation configured"
echo ""
echo "📊 To view monitoring dashboard:"
echo "  $PROJECT_PATH/scripts/monitoring-dashboard.sh"
echo ""
echo "📝 Log files location:"
echo "  /var/log/viktoria/"
echo ""
echo "⏰ To check cron jobs:"
echo "  crontab -l | grep viktoria"
echo ""
echo "🔧 To check systemd timer:"
echo "  systemctl status viktoria-monitor.timer"