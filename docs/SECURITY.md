# Security Documentation

## Overview
This document outlines the security measures, secret management, and emergency procedures for the SV Viktoria Wertheim website.

## Environment Variables

### Critical Secrets
The following environment variables contain sensitive information and must be protected:

#### Authentication & JWT
- `JWT_SECRET` - JWT signing secret (minimum 32 characters)
- `ANON_KEY` - Public API key for Supabase
- `SERVICE_ROLE_KEY` - Service role key with elevated privileges
- `VAULT_ENC_KEY` - Vault encryption key (32 bytes base64)
- `SECRET_KEY_BASE` - Session encryption key (64+ characters)

#### Database
- `POSTGRES_PASSWORD` - PostgreSQL database password
- `DATABASE_URL` - Full database connection string
- `DASHBOARD_PASSWORD` - Supabase Studio dashboard password

#### Email Configuration
- `EMAIL_USER` - SMTP username/email address
- `EMAIL_PASS` - SMTP password or app-specific password

#### Admin Access
- `ADMIN_PASSWORD` - Admin panel password
- `ADMIN_SECRET` - Admin API secret key
- `ADMIN_EMAILS` - Comma-separated list of admin email addresses

## Secret Rotation Procedures

### Quarterly Rotation (Every 3 Months)
1. **Generate new secrets**
   ```bash
   ./scripts/generate-secrets.sh
   ```

2. **Update JWT keys**
   ```bash
   ./scripts/generate-jwt-keys.sh
   ```

3. **Validate configuration**
   ```bash
   ./scripts/validate-env.sh
   ```

4. **Deploy with zero downtime**
   - Update staging environment first
   - Test all functionality
   - Deploy to production during low-traffic hours
   - Monitor logs for authentication issues

### Emergency Rotation (Compromise Suspected)
1. **Immediately rotate all secrets**
2. **Invalidate all existing sessions**
3. **Force password resets for all admin users**
4. **Review access logs for suspicious activity**
5. **Document the incident**

## Security Checklist

### Pre-Deployment
- [ ] All demo/placeholder secrets replaced
- [ ] Environment validation passes (`./scripts/validate-env.sh`)
- [ ] HTTPS configured and enforced
- [ ] CSP headers configured in middleware
- [ ] Rate limiting enabled on all API routes
- [ ] Database backups configured and tested

### Regular Audits (Monthly)
- [ ] Review admin user access list
- [ ] Check for outdated dependencies (`npm audit`)
- [ ] Review error logs for security issues
- [ ] Verify backup restoration process
- [ ] Check disk space and resource usage
- [ ] Review rate limit effectiveness

### Authentication & Authorization
- [ ] Supabase RLS (Row Level Security) policies configured
- [ ] Admin routes protected by middleware
- [ ] Session tokens expire appropriately
- [ ] Password complexity requirements enforced
- [ ] 2FA enabled for admin accounts (recommended)

### Data Protection
- [ ] Personal data encrypted at rest
- [ ] Sensitive data excluded from logs
- [ ] Backups encrypted and secured
- [ ] Data retention policies implemented
- [ ] GDPR compliance measures in place

## Security Headers
The following security headers are configured in `middleware.ts`:

- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer info
- `Content-Security-Policy` - Restricts resource loading
- `Strict-Transport-Security` - Enforces HTTPS (production only)

## Rate Limiting Configuration
Current rate limits (per minute):
- `/api/contact`: 3 requests
- `/api/auth/signup`: 5 requests
- `/api/auth/login`: 10 requests
- `/api/admin/*`: 100 requests (admin only)
- `/api/*`: 30 requests
- `/api/health`: 120 requests
- Default: 60 requests

## Monitoring & Alerts

### Log Monitoring
- Error logs: Check daily for security-related errors
- Access logs: Review for unusual patterns
- Authentication failures: Monitor for brute force attempts

### Health Checks
- Endpoint: `/api/health`
- Monitors: Database, Auth, Memory, Disk Space, Rate Limits
- Alert thresholds:
  - Memory > 90%: Critical
  - Disk > 95%: Critical
  - Database unreachable: Critical

## Incident Response

### Contact Information
**Primary Security Contact**
- Name: [Admin Name]
- Email: admin@viktoria-wertheim.de
- Phone: [Emergency Number]

**Secondary Contact**
- Name: [Backup Admin]
- Email: vorstand@viktoria-wertheim.de
- Phone: [Backup Number]

### Response Procedures

#### Level 1: Low Impact
- Unusual but non-critical behavior
- Document in security log
- Review during next maintenance window

#### Level 2: Medium Impact
- Potential security risk identified
- Investigate within 24 hours
- Implement fix within 48 hours
- Notify team leads

#### Level 3: Critical
- Active security breach or data leak
- **Immediate Actions:**
  1. Isolate affected systems
  2. Rotate compromised credentials
  3. Enable maintenance mode
  4. Notify all stakeholders
  5. Begin forensic analysis
  6. Document all actions taken

## Backup & Recovery

### Backup Schedule
- **Daily**: Database backups at 2:00 AM
- **Weekly**: Full system backup on Sundays
- **Monthly**: Offsite backup replication

### Recovery Procedures
1. **Database Recovery**
   ```bash
   # List available backups
   ls -la backups/*.sql.gz
   
   # Restore specific backup
   gunzip < backups/production-backup-YYYYMMDD-HHMMSS.sql.gz | \
     docker exec -i viktoria-postgres psql -U postgres -d postgres
   ```

2. **Full System Recovery**
   - Restore from latest full backup
   - Apply incremental database changes
   - Verify data integrity
   - Test all critical functions

## Compliance & Legal

### GDPR Compliance
- User consent for data processing
- Right to data deletion implemented
- Data portability available on request
- Privacy policy updated and visible
- Cookie consent banner implemented

### Data Retention
- User data: Retained while account active
- Logs: 90 days
- Backups: 30 days (daily), 6 months (monthly)
- Session data: 24 hours

## Security Tools & Commands

### Validation Scripts
```bash
# Validate environment configuration
./scripts/validate-env.sh

# Test email configuration
./scripts/test-email.sh

# Validate production readiness
./scripts/validate-production.sh
```

### Monitoring Commands
```bash
# Check system health
curl https://viktoria.headon.pro/api/health

# View recent logs
docker logs viktoria-web --tail 100

# Check rate limit cache
# (Included in health endpoint response)
```

## Security Best Practices

### Development
1. Never commit secrets to version control
2. Use environment variables for all configuration
3. Review code for security issues before merge
4. Keep dependencies updated
5. Use TypeScript for type safety
6. Sanitize all user inputs
7. Validate API responses

### Production
1. Use HTTPS everywhere
2. Keep servers updated
3. Monitor for vulnerabilities
4. Regular security audits
5. Implement proper logging
6. Use connection pooling
7. Enable rate limiting

### Access Control
1. Principle of least privilege
2. Regular access reviews
3. Strong password requirements
4. Session timeout configuration
5. IP whitelisting for admin areas (optional)

## Version History
- v1.0 - Initial security documentation
- Last Updated: $(date +%Y-%m-%d)
- Review Schedule: Monthly

---
This document is confidential and should be shared only with authorized personnel.