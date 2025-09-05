#!/bin/bash

# Developer Setup Script for SV Viktoria Wertheim
# Automates development environment setup

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# Functions
print_header() {
    echo ""
    echo -e "${BLUE}${BOLD}========================================${NC}"
    echo -e "${BLUE}${BOLD}  SV Viktoria Wertheim - Dev Setup${NC}"
    echo -e "${BLUE}${BOLD}========================================${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${YELLOW}${BOLD}$1${NC}"
    echo -e "${YELLOW}$(printf '=%.0s' $(seq 1 ${#1}))${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_requirements() {
    print_section "Checking System Requirements"
    
    # Check Node.js
    if command -v node > /dev/null 2>&1; then
        local node_version=$(node --version)
        success "Node.js installed: $node_version"
        
        # Check if version is 22.x
        if [[ ! $node_version =~ v22\. ]]; then
            warning "Node.js version should be 22.x, current: $node_version"
            info "Switch to Node 22 with: nvm use 22"
        fi
    else
        error "Node.js is not installed. Please install Node.js 22.x first."
    fi
    
    # Check pnpm
    if command -v pnpm > /dev/null 2>&1; then
        local pnpm_version=$(pnpm --version)
        success "pnpm installed: v$pnpm_version"
    else
        error "pnpm is not installed. Please install pnpm first: npm install -g pnpm"
    fi
    
    # Check Docker
    if command -v docker > /dev/null 2>&1; then
        local docker_version=$(docker --version | cut -d' ' -f3 | sed 's/,//')
        success "Docker installed: $docker_version"
        
        # Check if Docker daemon is running
        if docker info > /dev/null 2>&1; then
            success "Docker daemon is running"
        else
            warning "Docker daemon is not running. Please start Docker."
        fi
    else
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check Docker Compose
    if docker compose version > /dev/null 2>&1; then
        local compose_version=$(docker compose version --short)
        success "Docker Compose installed: v$compose_version"
    else
        error "Docker Compose is not available. Please install Docker Compose."
    fi
    
    # Check Git
    if command -v git > /dev/null 2>&1; then
        local git_version=$(git --version | cut -d' ' -f3)
        success "Git installed: $git_version"
    else
        error "Git is not installed. Please install Git first."
    fi
}

setup_environment() {
    print_section "Setting Up Environment"
    
    cd "$PROJECT_ROOT"
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        info "Creating .env.local from template..."
        
        cat > .env.local << 'EOF'
# Local Development Environment Variables
# Copy this file and update with your actual values

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres

# Email Configuration (optional for development)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Admin Configuration
ADMIN_EMAILS=admin@viktoria-wertheim.de,developer@viktoria-wertheim.de
NEXT_PUBLIC_ADMIN_PASSWORD=DevPassword2024

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
        
        success "Created .env.local file"
        warning "Please update .env.local with your actual configuration values"
    else
        success ".env.local already exists"
    fi
    
    # Install dependencies
    info "Installing Node.js dependencies..."
    pnpm install
    success "Dependencies installed"
}

setup_database() {
    print_section "Setting Up Local Database"
    
    cd "$PROJECT_ROOT"
    
    # Start Supabase
    info "Starting Supabase services..."
    docker compose -f docker-compose.supabase.yml up -d
    
    # Wait for services to be ready
    info "Waiting for services to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s http://localhost:54321/rest/v1/ > /dev/null 2>&1; then
            success "Supabase services are ready"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            error "Supabase services failed to start after $max_attempts attempts"
        fi
        
        info "Waiting for services... ($attempt/$max_attempts)"
        sleep 3
        ((attempt++))
    done
    
    # Check if migrations need to be applied
    if [ -d "supabase/migrations" ] && [ "$(ls -A supabase/migrations/*.sql 2>/dev/null)" ]; then
        info "Applying database migrations..."
        ./scripts/db-migrate.sh up
        success "Database migrations applied"
    else
        info "No migrations to apply"
    fi
    
    # Run database sync if available
    if [ -f "scripts/db-sync.sh" ]; then
        info "Running database sync..."
        ./scripts/db-sync.sh
        success "Database sync completed"
    fi
    
    success "Database setup completed"
    info "Supabase Studio available at: http://localhost:54323"
    info "Database direct connection: postgresql://postgres:postgres@localhost:54322/postgres"
}

setup_git_hooks() {
    print_section "Setting Up Git Hooks"
    
    cd "$PROJECT_ROOT"
    
    # Create pre-commit hook
    local hooks_dir=".git/hooks"
    mkdir -p "$hooks_dir"
    
    cat > "$hooks_dir/pre-commit" << 'EOF'
#!/bin/bash
# Pre-commit hook for SV Viktoria Wertheim

echo "🔍 Running pre-commit checks..."

# Run type checking
echo "📝 Checking types..."
if ! pnpm run typecheck; then
    echo "❌ Type check failed. Fix types before committing."
    exit 1
fi

# Run linting
echo "🧹 Running linter..."
if ! pnpm run lint; then
    echo "❌ Linting failed. Fix lint errors before committing."
    exit 1
fi

# Check for forbidden strings
echo "🔍 Checking for forbidden patterns..."
if git diff --cached --name-only | xargs grep -l "console.log" 2>/dev/null; then
    echo "❌ Found console.log statements. Remove them before committing."
    exit 1
fi

if git diff --cached --name-only | xargs grep -l "debugger" 2>/dev/null; then
    echo "❌ Found debugger statements. Remove them before committing."
    exit 1
fi

echo "✅ All pre-commit checks passed!"
exit 0
EOF

    chmod +x "$hooks_dir/pre-commit"
    success "Git pre-commit hook installed"
    
    # Create commit message template
    cat > "$hooks_dir/prepare-commit-msg" << 'EOF'
#!/bin/bash
# Prepare commit message hook

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2

# Only add template for regular commits (not merges, etc.)
if [ -z "$COMMIT_SOURCE" ]; then
    # Add commit template if message is empty
    if [ ! -s "$COMMIT_MSG_FILE" ]; then
        cat > "$COMMIT_MSG_FILE" << 'TEMPLATE'
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>
#
# Type can be:
#   feat     (new feature)
#   fix      (bug fix)
#   docs     (documentation)
#   style    (formatting, missing semi colons, etc)
#   refactor (refactoring production code)
#   test     (adding tests, refactoring test)
#   chore    (updating build tasks, package manager configs, etc)
#
# Scope can be:
#   api      (backend API changes)
#   ui       (frontend UI changes)
#   db       (database changes)
#   auth     (authentication)
#   config   (configuration changes)
#
# Examples:
#   feat(api): add news article endpoints
#   fix(ui): resolve mobile navigation issue
#   docs(readme): update development setup instructions
TEMPLATE
    fi
fi
EOF

    chmod +x "$hooks_dir/prepare-commit-msg"
    success "Git commit message template installed"
}

create_dev_scripts() {
    print_section "Creating Development Scripts"
    
    cd "$PROJECT_ROOT"
    
    # Create dev start script
    cat > "scripts/dev-start.sh" << 'EOF'
#!/bin/bash
# Start development environment

set -e

echo "🚀 Starting SV Viktoria development environment..."

# Start Supabase services
echo "🐳 Starting Supabase services..."
docker compose -f docker-compose.supabase.yml up -d

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check health
if curl -f -s http://localhost:54321/rest/v1/ > /dev/null; then
    echo "✅ Supabase is ready"
else
    echo "❌ Supabase failed to start"
    exit 1
fi

# Start Next.js
echo "🌐 Starting Next.js development server..."
pnpm run dev
EOF

    chmod +x "scripts/dev-start.sh"
    success "Created dev-start.sh"
    
    # Create dev stop script
    cat > "scripts/dev-stop.sh" << 'EOF'
#!/bin/bash
# Stop development environment

echo "🛑 Stopping development environment..."

# Stop Next.js (if running)
pkill -f "next dev" || true

# Stop Supabase services
echo "🐳 Stopping Supabase services..."
docker compose -f docker-compose.supabase.yml down

echo "✅ Development environment stopped"
EOF

    chmod +x "scripts/dev-stop.sh"
    success "Created dev-stop.sh"
    
    # Create database reset script
    cat > "scripts/dev-reset.sh" << 'EOF'
#!/bin/bash
# Reset development database

echo "🔄 Resetting development database..."

# Stop services
docker compose -f docker-compose.supabase.yml down

# Remove volumes
docker volume rm supabase_db_data 2>/dev/null || true

# Restart services
docker compose -f docker-compose.supabase.yml up -d

# Wait for services
echo "⏳ Waiting for services..."
sleep 15

# Apply migrations
if [ -d "supabase/migrations" ]; then
    echo "📦 Applying migrations..."
    ./scripts/db-migrate.sh up
fi

# Sync data
if [ -f "scripts/db-sync.sh" ]; then
    echo "🔄 Syncing data..."
    ./scripts/db-sync.sh
fi

echo "✅ Database reset completed"
EOF

    chmod +x "scripts/dev-reset.sh"
    success "Created dev-reset.sh"
}

setup_vscode() {
    print_section "Setting Up VS Code Configuration"
    
    cd "$PROJECT_ROOT"
    
    # Create .vscode directory
    mkdir -p .vscode
    
    # Create settings.json
    cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.exclude": {
    "**/.next": true,
    "**/node_modules": true,
    "**/backups": true
  },
  "search.exclude": {
    "**/.next": true,
    "**/node_modules": true,
    "**/backups": true,
    "**/*.log": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "eslint.workingDirectories": ["."],
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
EOF
    
    # Create extensions.json
    cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "ms-vscode-remote.remote-containers"
  ]
}
EOF
    
    # Create tasks.json
    cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Development",
      "type": "shell",
      "command": "./scripts/dev-start.sh",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "Stop Development",
      "type": "shell",
      "command": "./scripts/dev-stop.sh",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Type Check",
      "type": "shell",
      "command": "pnpm run typecheck",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Lint",
      "type": "shell",
      "command": "pnpm run lint",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
EOF
    
    # Create launch.json for debugging
    cat > .vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "env": {
        "NODE_ENV": "development"
      },
      "skipFiles": [
        "<node_internals>/**"
      ]
    }
  ]
}
EOF
    
    success "VS Code configuration created"
}

print_completion() {
    print_section "Setup Completed!"
    
    echo ""
    success "Development environment setup completed!"
    echo ""
    
    info "Next Steps:"
    echo "  1. Update .env.local with your configuration"
    echo "  2. Install VS Code extensions (recommended)"
    echo "  3. Start development: ./scripts/dev-start.sh"
    echo ""
    
    info "Useful Commands:"
    echo "  • Start development: ./scripts/dev-start.sh"
    echo "  • Stop development: ./scripts/dev-stop.sh" 
    echo "  • Reset database: ./scripts/dev-reset.sh"
    echo "  • Run type check: pnpm run typecheck"
    echo "  • Run linter: pnpm run lint"
    echo "  • Build project: pnpm run build"
    echo ""
    
    info "Development URLs:"
    echo "  • Application: http://localhost:3000"
    echo "  • Supabase Studio: http://localhost:54323"
    echo "  • API Health: http://localhost:3000/api/health"
    echo ""
    
    info "Documentation:"
    echo "  • Project README: README.md"
    echo "  • API Documentation: docs/api-documentation.md"
    echo "  • CLAUDE Instructions: CLAUDE.md"
    echo ""
    
    warning "Remember to:"
    echo "  • Keep Docker running for database services"
    echo "  • Check .env.local configuration"
    echo "  • Follow Git commit message conventions"
    echo "  • Run tests before pushing to main"
    echo ""
}

# Main execution
main() {
    print_header
    
    check_requirements
    setup_environment
    setup_database
    setup_git_hooks
    create_dev_scripts
    setup_vscode
    
    print_completion
}

# Run main function
main "$@"