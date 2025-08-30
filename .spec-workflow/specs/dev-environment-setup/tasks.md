# Tasks Document

## Phase 1: Repository Setup

- [ ] 1. Create development repository copy
  - File: scripts/setup-dev-repo.sh (new)
  - Copy entire viktoria-wertheim repository to viktoria-wertheim-dev
  - Remove .git directory and reinitialize Git
  - Purpose: Create isolated development environment
  - _Leverage: existing repository structure_
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Configure Git for development repository
  - File: viktoria-wertheim-dev/.git/config
  - Set up new remote origin (optional)
  - Configure user settings for dev commits
  - Purpose: Separate Git history from production
  - _Leverage: Git configuration_
  - _Requirements: 1.4, 1.5_

## Phase 2: Docker Configuration

- [ ] 3. Create Docker Compose for development
  - File: docker-compose.dev.yml (new)
  - Copy docker-compose.production.yml as template
  - Update container names with -dev suffix
  - Purpose: Separate Docker containers for development
  - _Leverage: docker-compose.production.yml_
  - _Requirements: 2.1_

- [ ] 4. Configure development ports
  - File: docker-compose.dev.yml (modify from task 3)
  - Change web port from 3000 to 3001
  - Change postgres port from 5432 to 5433
  - Change studio port from 54323 to 54324
  - Purpose: Avoid port conflicts with production
  - _Requirements: 2.2_

- [ ] 5. Set up development volumes and networks
  - File: docker-compose.dev.yml (modify from task 3)
  - Rename volumes with dev- prefix
  - Create viktoria-dev-network
  - Purpose: Complete isolation from production
  - _Requirements: 2.3, 2.4_

## Phase 3: Database Setup

- [ ] 6. Configure development database
  - File: docker-compose.dev.yml (modify from task 3)
  - Set POSTGRES_PASSWORD to devpass
  - Set POSTGRES_DB to viktoria_dev
  - Purpose: Separate database instance for development
  - _Requirements: 2.5, 3.1_

- [ ] 7. Create database initialization script
  - File: scripts/init-dev-db.sh (new)
  - Copy migrations from supabase/migrations/
  - Apply all migrations to dev database
  - Purpose: Initialize database with production schema
  - _Leverage: supabase/migrations/*_
  - _Requirements: 3.2_

- [ ] 8. Create seed data script
  - File: scripts/seed-dev-db.sh (new)
  - Adapt supabase/seed/ scripts for development
  - Generate test data for all tables
  - Purpose: Populate database with test data
  - _Leverage: supabase/seed/*_
  - _Requirements: 3.3, 3.5_

- [ ] 9. Create database reset script
  - File: scripts/reset-dev-db.sh (new)
  - Drop and recreate database
  - Re-run migrations and seeds
  - Purpose: Quick database reset for testing
  - _Requirements: 3.4_

## Phase 4: Environment Configuration

- [ ] 10. Create development environment file
  - File: .env.development (new)
  - Set NODE_ENV=development
  - Configure database URLs with port 5433
  - Purpose: Development-specific configuration
  - _Leverage: .env.local template_
  - _Requirements: 4.1_

- [ ] 11. Create environment template
  - File: .env.example (new)
  - Document all required environment variables
  - Add comments with descriptions
  - Purpose: Help new developers set up quickly
  - _Requirements: 4.4_

- [ ] 12. Create environment validation script
  - File: scripts/check-env.sh (new)
  - Verify all required variables are set
  - Show helpful error messages for missing variables
  - Purpose: Prevent configuration errors
  - _Requirements: 4.2, 4.5_

## Phase 5: Automation Scripts

- [ ] 13. Create Makefile commands for development
  - File: Makefile (modify existing)
  - Add dev-up: start development environment
  - Add dev-down: stop development environment
  - Add dev-reset: complete reset
  - Purpose: Simple command interface
  - _Leverage: existing Makefile_
  - _Requirements: 5.1_

- [ ] 14. Create development start script
  - File: scripts/start-dev.sh (new)
  - Check environment variables
  - Start Docker containers
  - Show health status
  - Purpose: One-command startup
  - _Requirements: 5.1, 5.3_

- [ ] 15. Create sync script for production updates
  - File: scripts/sync-from-prod.sh (new)
  - Cherry-pick specific commits from production
  - Merge schema changes selectively
  - Purpose: Controlled updates from production
  - _Requirements: 1.5, 5.2_

## Phase 6: Documentation

- [ ] 16. Create development README
  - File: README.dev.md (new)
  - Document complete setup process
  - Add troubleshooting section
  - Include architecture diagram
  - Purpose: Comprehensive developer guide
  - _Requirements: 5.4_

- [ ] 17. Create Docker documentation
  - File: docs/docker-dev.md (new)
  - Explain container architecture
  - Document port mappings
  - Add network diagrams
  - Purpose: Docker-specific documentation
  - _Requirements: 2.1-2.5_

- [ ] 18. Create workflow documentation
  - File: docs/dev-workflow.md (new)
  - Document feature development process
  - Explain code sync procedures
  - Add decision trees for common scenarios
  - Purpose: Standardize team workflow
  - _Requirements: 5.1-5.5_

## Phase 7: Testing

- [ ] 19. Test complete setup process
  - Files: All setup scripts
  - Run full setup from scratch
  - Verify all services start correctly
  - Purpose: Ensure setup reliability
  - _Requirements: All_

- [ ] 20. Test isolation between environments
  - Files: Docker and network configuration
  - Run production and development simultaneously
  - Verify no resource conflicts
  - Purpose: Confirm complete isolation
  - _Requirements: 2.4, 3.1_

- [ ] 21. Test database operations
  - Files: Database scripts
  - Test migration, seed, and reset
  - Verify data integrity
  - Purpose: Ensure database reliability
  - _Requirements: 3.1-3.5_

## Phase 8: Final Integration

- [ ] 22. Create health check script
  - File: scripts/health-check.sh (new)
  - Check all services are running
  - Verify database connectivity
  - Test API endpoints
  - Purpose: Quick environment validation
  - _Requirements: 5.3_

- [ ] 23. Create backup script for development
  - File: scripts/backup-dev.sh (new)
  - Backup development database
  - Save environment configuration
  - Purpose: Protect development work
  - _Requirements: 3.4_

- [ ] 24. Final cleanup and optimization
  - Files: All created files
  - Remove unnecessary files
  - Optimize scripts for performance
  - Add error handling
  - Purpose: Production-ready development environment
  - _Requirements: All_