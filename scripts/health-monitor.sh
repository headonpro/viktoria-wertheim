#!/bin/bash

# Health Monitor Script for SV Viktoria Wertheim
# Monitors application health and sends alerts if issues detected

set -e

# Configuration
SITE_URL="https://viktoria.headon.pro"
HEALTH_ENDPOINT="$SITE_URL/api/health"
LOG_FILE="/var/log/viktoria-health.log"
ALERT_EMAIL="info@viktoria-wertheim.de"
MAX_RESPONSE_TIME=5  # seconds
MIN_DISK_SPACE=10    # GB
MAX_MEMORY_USAGE=80  # percentage

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

check_website_health() {
    log "🏥 Checking website health..."
    
    # Check if site is responding
    local response_time
    response_time=$(curl -o /dev/null -s -w '%{time_total}' "$HEALTH_ENDPOINT" || echo "timeout")
    
    if [ "$response_time" = "timeout" ]; then
        log "${RED}❌ Website is not responding${NC}"
        return 1
    fi
    
    # Check response time
    if (( $(echo "$response_time > $MAX_RESPONSE_TIME" | bc -l) )); then
        log "${YELLOW}⚠️ Slow response time: ${response_time}s${NC}"
    else
        log "${GREEN}✅ Website responding in ${response_time}s${NC}"
    fi
    
    # Check health endpoint JSON response
    local health_response
    health_response=$(curl -s "$HEALTH_ENDPOINT")
    
    if echo "$health_response" | jq -e '.status == "healthy"' > /dev/null; then
        log "${GREEN}✅ Health endpoint reports healthy${NC}"
        return 0
    else
        log "${RED}❌ Health endpoint reports issues${NC}"
        log "Response: $health_response"
        return 1
    fi
}

check_docker_containers() {
    log "🐳 Checking Docker containers..."
    
    # Check if main containers are running
    local containers=("viktoria-frontend" "supabase-db" "supabase-auth" "supabase-rest")
    local failed_containers=()
    
    for container in "${containers[@]}"; do
        if ! docker ps --format "{{.Names}}" | grep -q "^${container}$"; then
            failed_containers+=("$container")
            log "${RED}❌ Container not running: $container${NC}"
        else
            log "${GREEN}✅ Container running: $container${NC}"
        fi
    done
    
    if [ ${#failed_containers[@]} -gt 0 ]; then
        return 1
    fi
    
    return 0
}

check_system_resources() {
    log "📊 Checking system resources..."
    
    # Check disk space
    local disk_usage
    disk_usage=$(df -BG /opt | tail -1 | awk '{print $4}' | sed 's/G//')
    
    if [ "$disk_usage" -lt "$MIN_DISK_SPACE" ]; then
        log "${RED}❌ Low disk space: ${disk_usage}GB available${NC}"
        return 1
    else
        log "${GREEN}✅ Disk space: ${disk_usage}GB available${NC}"
    fi
    
    # Check memory usage
    local memory_usage
    memory_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    
    if [ "$memory_usage" -gt "$MAX_MEMORY_USAGE" ]; then
        log "${YELLOW}⚠️ High memory usage: ${memory_usage}%${NC}"
    else
        log "${GREEN}✅ Memory usage: ${memory_usage}%${NC}"
    fi
    
    return 0
}

check_database_health() {
    log "🗄️ Checking database health..."
    
    # Test database connection
    if docker exec supabase-db pg_isready -U postgres > /dev/null 2>&1; then
        log "${GREEN}✅ Database is responding${NC}"
    else
        log "${RED}❌ Database is not responding${NC}"
        return 1
    fi
    
    # Check database connections
    local connection_count
    connection_count=$(docker exec supabase-db psql -U postgres -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tr -d ' ' || echo "0")
    
    log "${GREEN}ℹ️ Database connections: $connection_count${NC}"
    
    return 0
}

check_ssl_certificate() {
    log "🔐 Checking SSL certificate..."
    
    local cert_expiry
    cert_expiry=$(echo | openssl s_client -servername viktoria.headon.pro -connect viktoria.headon.pro:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    
    if [ -n "$cert_expiry" ]; then
        local expiry_timestamp
        expiry_timestamp=$(date -d "$cert_expiry" +%s)
        local current_timestamp
        current_timestamp=$(date +%s)
        local days_until_expiry
        days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        if [ "$days_until_expiry" -lt 30 ]; then
            log "${YELLOW}⚠️ SSL certificate expires in $days_until_expiry days${NC}"
        else
            log "${GREEN}✅ SSL certificate valid for $days_until_expiry days${NC}"
        fi
    else
        log "${RED}❌ Could not check SSL certificate${NC}"
        return 1
    fi
    
    return 0
}

send_alert() {
    local subject="$1"
    local message="$2"
    
    log "📧 Sending alert: $subject"
    
    # Send email alert if mail is configured
    if command -v mail > /dev/null; then
        echo "$message" | mail -s "$subject" "$ALERT_EMAIL"
    fi
    
    # Also log to syslog
    logger -t "viktoria-health" "$subject: $message"
}

main() {
    log "🚀 Starting health check..."
    
    local issues=()
    
    # Run all health checks
    if ! check_website_health; then
        issues+=("Website health check failed")
    fi
    
    if ! check_docker_containers; then
        issues+=("Docker containers check failed")
    fi
    
    if ! check_system_resources; then
        issues+=("System resources check failed")
    fi
    
    if ! check_database_health; then
        issues+=("Database health check failed")
    fi
    
    if ! check_ssl_certificate; then
        issues+=("SSL certificate check failed")
    fi
    
    # Report results
    if [ ${#issues[@]} -eq 0 ]; then
        log "${GREEN}✅ All health checks passed${NC}"
    else
        local alert_subject="🚨 Viktoria Website Health Alert"
        local alert_message="The following issues were detected:\n\n"
        
        for issue in "${issues[@]}"; do
            alert_message+=("- $issue\n")
        done
        
        alert_message+="\nPlease check the server immediately.\n"
        alert_message+="Server: $(hostname)\n"
        alert_message+="Time: $(date)\n"
        alert_message+="Log file: $LOG_FILE"
        
        log "${RED}❌ Health check failed with ${#issues[@]} issues${NC}"
        send_alert "$alert_subject" "$alert_message"
    fi
    
    log "🏁 Health check completed"
}

# Create log file if it doesn't exist
touch "$LOG_FILE"

# Run main function
main "$@"