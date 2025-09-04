# Production Deployment Checklist

## Pre-Deployment Requirements

### 1. Environment Setup ✓
- [ ] Generate secure secrets
  ```bash
  ./scripts/generate-secrets.sh
  ./scripts/generate-jwt-keys.sh
  ```

- [ ] Configure environment files
  - [ ] `.env.production` created and filled
  - [ ] `.env.supabase` configured with production values
  - [ ] Email credentials added (EMAIL_USER, EMAIL_PASS)
  - [ ] Admin emails configured

- [ ] Validate environment
  ```bash
  ./scripts/validate-env.sh
  # Should output: "Environment validation PASSED"
  ```

### 2. Database Preparation ✓
- [ ] Run all migrations
  ```bash
  ./scripts/db-migrate.sh status  # Check pending migrations
  ./scripts/db-migrate.sh deploy  # Apply to production
  ```

- [ ] Test database connection
  ```bash
  docker exec viktoria-postgres psql -U postgres -c "SELECT 1"
  ```

- [ ] Setup backup schedule
  ```bash
  ./scripts/setup-backup-cron.sh  # Follow instructions
  ```

- [ ] Test backup and restore
  ```bash
  ./scripts/backup-database.sh production
  # Verify backup created in backups/ directory
  ```

### 3. Email Configuration ✓
- [ ] Configure SMTP credentials
  - [ ] Gmail: Generate app-specific password
  - [ ] Add EMAIL_USER and EMAIL_PASS to .env files

- [ ] Test email sending
  ```bash
  ./scripts/test-email.sh admin@viktoria-wertheim.de
  # Should receive test email
  ```

### 4. Security Checks ✓
- [ ] All demo secrets replaced
- [ ] HTTPS configured on server
- [ ] Rate limiting active
- [ ] CSP headers configured
- [ ] Admin routes protected
- [ ] Supabase RLS policies enabled

## Deployment Steps

### Step 1: Build Application
```bash
# Build production bundle
NODE_ENV=production pnpm run build

# Verify build success
ls -la .next/
```

### Step 2: Docker Setup
```bash
# Stop existing containers
docker-compose -f docker-compose.production.yml down

# Pull latest images
docker-compose -f docker-compose.production.yml pull

# Start services
docker-compose -f docker-compose.production.yml up -d

# Verify all containers running
docker ps | grep viktoria
```

### Step 3: Database Migration
```bash
# Apply any pending migrations
./scripts/db-migrate.sh deploy

# Verify database schema
docker exec viktoria-postgres psql -U postgres -d postgres -c "\dt"
```

### Step 4: Health Verification
```bash
# Check application health
curl https://viktoria.headon.pro/api/health

# Expected response: status "healthy"
```

### Step 5: Smoke Tests
- [ ] Homepage loads correctly
- [ ] News section displays articles
- [ ] Teams pages load
- [ ] Contact form submits
- [ ] Admin login works (for authorized users)
- [ ] Images load properly
- [ ] Mobile responsive design works

## Post-Deployment Verification

### Monitoring Setup
- [ ] Health endpoint responding
  ```bash
  curl https://viktoria.headon.pro/api/health | jq .status
  ```

- [ ] Logs accessible
  ```bash
  docker logs viktoria-web --tail 50
  ```

- [ ] Backup cron job active
  ```bash
  crontab -l | grep backup-database
  ```

### Performance Checks
- [ ] Page load time < 3 seconds
- [ ] Database queries < 100ms
- [ ] Memory usage < 70%
- [ ] Disk usage < 85%
- [ ] Rate limiting working

### Security Validation
- [ ] HTTPS redirect working
- [ ] Security headers present
  ```bash
  curl -I https://viktoria.headon.pro | grep -E "X-Frame-Options|X-Content-Type"
  ```

- [ ] Rate limiting active
  ```bash
  # Test rate limit (should fail after 3 attempts)
  for i in {1..5}; do curl -X POST https://viktoria.headon.pro/api/contact; done
  ```

## Rollback Procedures

### Quick Rollback
```bash
# Stop current deployment
docker-compose -f docker-compose.production.yml down

# Restore previous version
git checkout <previous-tag>
docker-compose -f docker-compose.production.yml up -d
```

### Database Rollback
```bash
# List available backups
ls -la backups/*.sql.gz

# Restore from backup
gunzip < backups/production-backup-YYYYMMDD-HHMMSS.sql.gz | \
  docker exec -i viktoria-postgres psql -U postgres -d postgres
```

## Common Issues & Solutions

### Issue: Container fails to start
**Solution:**
```bash
# Check logs
docker logs viktoria-web

# Common fixes:
# - Verify environment variables
# - Check port availability: lsof -i :8001
# - Ensure Docker has enough resources
```

### Issue: Database connection errors
**Solution:**
```bash
# Verify database is running
docker ps | grep postgres

# Check connection
docker exec viktoria-postgres pg_isready

# Review connection pooler settings
grep POOLER .env.supabase
```

### Issue: Email not sending
**Solution:**
```bash
# Test email configuration
./scripts/test-email.sh

# Common fixes:
# - Verify EMAIL_USER and EMAIL_PASS
# - Check Gmail app password (not regular password)
# - Ensure port 587 is open
```

### Issue: High memory usage
**Solution:**
```bash
# Check current usage
docker stats viktoria-web

# Restart container
docker restart viktoria-web

# If persistent, check for memory leaks in logs
docker logs viktoria-web | grep -i memory
```

### Issue: Slow performance
**Solution:**
```bash
# Check database performance
docker exec viktoria-postgres \
  psql -U postgres -c "SELECT * FROM pg_stat_activity"

# Review connection pool
docker exec viktoria-postgres \
  psql -U postgres -c "SELECT count(*) FROM pg_stat_activity"

# Clear caches if needed
docker restart viktoria-web
```

## Maintenance Tasks

### Daily
- [ ] Check health endpoint
- [ ] Review error logs
- [ ] Verify backup created

### Weekly
- [ ] Review disk usage
- [ ] Check for security updates
- [ ] Test backup restoration
- [ ] Review rate limit effectiveness

### Monthly
- [ ] Full security audit
- [ ] Dependency updates
- [ ] Performance review
- [ ] Access list review
- [ ] Certificate renewal check

## Emergency Contacts

**Technical Lead**
- Name: [Your Name]
- Email: [Your Email]
- Phone: [Your Phone]

**System Administrator**
- Name: [Admin Name]
- Email: admin@viktoria-wertheim.de
- Phone: [Admin Phone]

**Hosting Provider**
- Company: [Provider Name]
- Support: [Support Contact]
- Account: [Account Number]

## Quick Commands Reference

```bash
# Start/Stop Services
docker-compose -f docker-compose.production.yml up -d
docker-compose -f docker-compose.production.yml down

# View Logs
docker logs viktoria-web --tail 100 -f
docker logs viktoria-postgres --tail 50

# Database Operations
./scripts/backup-database.sh production
./scripts/db-migrate.sh status
./scripts/db-migrate.sh deploy

# Health & Monitoring
curl https://viktoria.headon.pro/api/health
docker stats viktoria-web

# Emergency Restart
docker restart viktoria-web
docker restart viktoria-postgres

# Full System Restart
docker-compose -f docker-compose.production.yml restart
```

## Deployment History

| Date | Version | Deployed By | Notes |
|------|---------|-------------|-------|
| [Date] | v1.0.0 | [Name] | Initial deployment |
| [Date] | v1.0.1 | [Name] | Bug fixes |
| [Date] | v1.1.0 | [Name] | Feature additions |

---
Last Updated: $(date +%Y-%m-%d)
Next Review: [Monthly Review Date]