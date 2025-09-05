#!/bin/bash

# Content Generation Cron Job for SV Viktoria Wertheim
# Processes pending content generation requests automatically

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="/var/log/viktoria/content-generation.log"
API_URL="http://localhost:3000"
ADMIN_PASSWORD="${NEXT_PUBLIC_ADMIN_PASSWORD:-DevPassword2024}"

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Function to log with timestamp
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to call content generation API
process_content_generation() {
    log "🤖 Starting automatic content generation process..."
    
    # Check if application is running
    if ! curl -f -s "$API_URL/api/health" > /dev/null; then
        log "❌ Application is not responding, skipping content generation"
        return 1
    fi
    
    # Call content generation API
    local response
    response=$(curl -s -X GET \
        -H "X-Admin-Password: $ADMIN_PASSWORD" \
        -H "Content-Type: application/json" \
        "$API_URL/api/admin/content-generation" \
        2>/dev/null)
    
    if [ $? -eq 0 ]; then
        log "✅ Content generation API call successful"
        log "Response: $response"
        return 0
    else
        log "❌ Content generation API call failed"
        return 1
    fi
}

# Main execution
main() {
    log "🚀 Content generation cron job started"
    
    cd "$PROJECT_ROOT"
    
    # Process content generation
    if process_content_generation; then
        log "✅ Content generation completed successfully"
    else
        log "⚠️ Content generation had issues"
    fi
    
    log "🏁 Content generation cron job finished"
    echo "---" >> "$LOG_FILE"
}

# Error handling
trap 'log "❌ Content generation cron job failed with error"; exit 1' ERR

# Run main function
main "$@"