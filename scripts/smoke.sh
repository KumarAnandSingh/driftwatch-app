#!/usr/bin/env bash
# Smoke tests - quick sanity checks that the app is functioning
set -euo pipefail

BASE_URL="${1:-http://localhost:5173}"

echo "Running smoke tests against: $BASE_URL"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

FAILED=0

# Test 1: Homepage loads and has title
echo "Test 1: Homepage renders..."
if curl -fsSL "$BASE_URL" 2>/dev/null | grep -qi "<title"; then
    echo -e "${GREEN}✓ Homepage has <title> tag${NC}"
else
    echo -e "${RED}✗ Homepage missing <title> tag${NC}"
    FAILED=1
fi
echo ""

# Test 2: Health/API endpoint (try multiple common patterns)
echo "Test 2: Health endpoint..."
HEALTH_OK=0
for endpoint in "/api/health" "/api/healthz" "/health" "/healthz"; do
    if curl -fsSL "${BASE_URL}${endpoint}" 2>/dev/null | grep -qi "ok\|healthy\|success"; then
        echo -e "${GREEN}✓ Health endpoint ${endpoint} responds OK${NC}"
        HEALTH_OK=1
        break
    fi
done

if [ $HEALTH_OK -eq 0 ]; then
    echo -e "${GREEN}⊘ Health endpoint not found (optional)${NC}"
fi
echo ""

# Test 3: Static assets load (if applicable)
echo "Test 3: Static assets..."
if curl -fsSL "$BASE_URL" 2>/dev/null | grep -q "src=\|href="; then
    echo -e "${GREEN}✓ Page references static assets${NC}"
else
    echo -e "${GREEN}⊘ No static assets detected (may be inline)${NC}"
fi
echo ""

# Test 4: No obvious error messages in page
echo "Test 4: Error check..."
PAGE_CONTENT=$(curl -fsSL "$BASE_URL" 2>/dev/null)
if echo "$PAGE_CONTENT" | grep -qi "error\|exception\|failed\|cannot"; then
    echo -e "${RED}✗ Page contains error keywords${NC}"
    echo "Preview:"
    echo "$PAGE_CONTENT" | grep -i "error\|exception\|failed\|cannot" | head -n 5
    FAILED=1
else
    echo -e "${GREEN}✓ No obvious errors in page${NC}"
fi
echo ""

# Final result
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}=== SMOKE TESTS: PASS ===${NC}"
    exit 0
else
    echo -e "${RED}=== SMOKE TESTS: FAIL ===${NC}"
    exit 1
fi
