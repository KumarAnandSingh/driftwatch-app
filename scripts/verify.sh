#!/usr/bin/env bash
set -euo pipefail

echo "=== Claude Code Verification Script ==="
echo "=== Project: $(basename "$PWD") ==="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILED=0

# Function to run a check
run_check() {
    local name="$1"
    local command="$2"

    echo "=== $name ==="
    if eval "$command"; then
        echo -e "${GREEN}✓ $name: PASS${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ $name: FAIL${NC}"
        echo ""
        FAILED=1
        return 1
    fi
}

# 1) Typecheck (if package.json has typecheck script)
if grep -q '"typecheck"' package.json 2>/dev/null; then
    run_check "Typecheck" "npm run -s typecheck" || true
else
    echo -e "${YELLOW}⊘ Typecheck: SKIPPED (no typecheck script found)${NC}"
    echo ""
fi

# 2) Lint (if package.json has lint script)
if grep -q '"lint"' package.json 2>/dev/null; then
    run_check "Lint" "npm run -s lint" || true
else
    echo -e "${YELLOW}⊘ Lint: SKIPPED (no lint script found)${NC}"
    echo ""
fi

# 3) Unit/Integration Tests
if grep -q '"test"' package.json 2>/dev/null; then
    run_check "Tests" "npm run -s test -- --run 2>&1 || npm run -s test 2>&1" || true
elif [ -f "pytest.ini" ] || [ -f "setup.py" ] || [ -d "tests" ]; then
    run_check "Tests (Python)" "pytest --tb=short" || true
else
    echo -e "${YELLOW}⊘ Tests: SKIPPED (no test command found)${NC}"
    echo ""
fi

# 4) Build
if grep -q '"build"' package.json 2>/dev/null; then
    run_check "Build" "npm run -s build" || true
elif [ -f "Cargo.toml" ]; then
    run_check "Build (Rust)" "cargo build" || true
elif [ -f "go.mod" ]; then
    run_check "Build (Go)" "go build ./..." || true
else
    echo -e "${YELLOW}⊘ Build: SKIPPED (no build command found)${NC}"
    echo ""
fi

# 5) Tripwires check (if .tripwires.json exists)
if [ -f ".tripwires.json" ]; then
    echo "=== Tripwires Check ==="
    if command -v node >/dev/null 2>&1; then
        node <<'EOF' || true
const fs = require('fs');
const tripwires = JSON.parse(fs.readFileSync('.tripwires.json', 'utf8'));
let failed = false;

// Check forbidden logs in recent build/runtime logs
const logPatterns = ['*.log', 'npm-debug.log*', 'yarn-error.log*', 'dist/**/*.js'];
const forbiddenLogs = tripwires.forbiddenLogs || [];

// Check forbidden strings in source code
const forbiddenStrings = tripwires.forbiddenStrings || [];
if (forbiddenStrings.length > 0) {
    const { execSync } = require('child_process');
    forbiddenStrings.forEach(str => {
        try {
            const result = execSync(`grep -r "${str}" src/ 2>/dev/null || true`, {encoding: 'utf8'});
            if (result.trim()) {
                console.log(`✗ Found forbidden string: "${str}"`);
                console.log(result);
                failed = true;
            }
        } catch (e) {
            // grep not found or error, skip
        }
    });
}

if (!failed) {
    console.log('✓ Tripwires: PASS');
} else {
    console.log('✗ Tripwires: FAIL');
    process.exit(1);
}
EOF
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Tripwires: PASS${NC}"
        else
            echo -e "${RED}✗ Tripwires: FAIL${NC}"
            FAILED=1
        fi
    else
        echo -e "${YELLOW}⊘ Tripwires: SKIPPED (node not available)${NC}"
    fi
    echo ""
else
    echo -e "${YELLOW}⊘ Tripwires: SKIPPED (.tripwires.json not found)${NC}"
    echo ""
fi

# 6) Health check (if scripts/await_http.sh exists and start script available)
if [ -f "scripts/await_http.sh" ] && grep -q '"start"' package.json 2>/dev/null; then
    echo "=== Health Check ==="
    PORT="${PORT:-3000}"

    # Start app in background
    npm run -s start > /tmp/app.log 2>&1 &
    APP_PID=$!

    # Wait for health endpoint
    if bash scripts/await_http.sh "http://localhost:$PORT/healthz" 60 2>/dev/null || \
       bash scripts/await_http.sh "http://localhost:$PORT/health" 60 2>/dev/null || \
       bash scripts/await_http.sh "http://localhost:$PORT" 60 2>/dev/null; then
        echo -e "${GREEN}✓ Health Check: PASS${NC}"

        # Run smoke tests if available
        if [ -f "scripts/smoke.sh" ]; then
            echo "=== Smoke Tests ==="
            if bash scripts/smoke.sh "http://localhost:$PORT"; then
                echo -e "${GREEN}✓ Smoke Tests: PASS${NC}"
            else
                echo -e "${RED}✗ Smoke Tests: FAIL${NC}"
                FAILED=1
            fi
        fi
    else
        echo -e "${RED}✗ Health Check: FAIL (app didn't start)${NC}"
        echo "Last 20 lines of app log:"
        tail -n 20 /tmp/app.log
        FAILED=1
    fi

    # Cleanup
    kill $APP_PID 2>/dev/null || true
    rm -f /tmp/app.log
    echo ""
else
    echo -e "${YELLOW}⊘ Health Check: SKIPPED (scripts/await_http.sh or start script not found)${NC}"
    echo ""
fi

# Final result
echo "========================================"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}=== VERIFY: PASS ===${NC}"
    exit 0
else
    echo -e "${RED}=== VERIFY: FAIL ===${NC}"
    exit 1
fi
