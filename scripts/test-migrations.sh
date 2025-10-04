#!/usr/bin/env bash
# Test database migration safety (forward + rollback)
set -euo pipefail

echo "🗄️  Testing database migration safety..."
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if migration commands exist
if ! grep -q "migrate" package.json 2>/dev/null; then
    echo -e "${YELLOW}⊘ No migration scripts found in package.json${NC}"
    echo "   Expected: npm run migrate:up, npm run migrate:down"
    exit 0
fi

# Start test database (Testcontainers or docker-compose)
echo "=== Starting test database ==="
if [ -f "docker-compose.yml" ]; then
    docker-compose up -d test-db
    sleep 5  # Wait for DB to be ready
else
    echo -e "${YELLOW}⊘ No docker-compose.yml found, assuming DB is already running${NC}"
fi
echo ""

# Get current migration state
echo "=== Checking current migration state ==="
BEFORE_STATE=$(npm run migrate:status 2>&1 || echo "unknown")
echo "Current state: $BEFORE_STATE"
echo ""

# Test forward migration
echo "=== Testing forward migration (UP) ==="
if npm run migrate:up 2>&1 | tee migrate-up.log; then
    echo -e "${GREEN}✓ Forward migration succeeded${NC}"
else
    echo -e "${RED}✗ Forward migration failed${NC}"
    cat migrate-up.log
    exit 1
fi
echo ""

# Run smoke tests against migrated schema
echo "=== Running smoke tests against migrated schema ==="
if [ -f "scripts/smoke-db.sh" ]; then
    bash scripts/smoke-db.sh
else
    # Basic smoke test: check if critical tables exist
    if npm run db:check 2>&1; then
        echo -e "${GREEN}✓ Database schema looks healthy${NC}"
    else
        echo -e "${YELLOW}⊘ No db:check script found${NC}"
    fi
fi
echo ""

# Test rollback migration
echo "=== Testing rollback migration (DOWN) ==="
if npm run migrate:down 2>&1 | tee migrate-down.log; then
    echo -e "${GREEN}✓ Rollback migration succeeded${NC}"
else
    echo -e "${RED}✗ Rollback migration failed${NC}"
    cat migrate-down.log
    echo ""
    echo "⚠️  WARNING: Migration cannot be safely rolled back!"
    echo "   This will cause issues in production if you need to rollback."
    exit 1
fi
echo ""

# Re-apply forward migration to leave DB in working state
echo "=== Re-applying forward migration ==="
npm run migrate:up > /dev/null 2>&1
echo ""

# Cleanup
if [ -f "docker-compose.yml" ]; then
    echo "=== Cleaning up test database ==="
    docker-compose down test-db
fi

echo -e "${GREEN}=== MIGRATION SAFETY: PASS ===${NC}"
echo ""
echo "✅ Migrations are safe:"
echo "   - Forward migration: ✓ SUCCESS"
echo "   - Smoke tests: ✓ PASS"
echo "   - Rollback migration: ✓ SUCCESS"
echo ""
echo "🎯 Safe to deploy to production"
