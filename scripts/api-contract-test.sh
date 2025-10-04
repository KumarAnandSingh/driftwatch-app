#!/usr/bin/env bash
# API contract testing and drift detection
set -euo pipefail

echo "📋 Running API contract tests..."
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

API_URL="${API_URL:-http://localhost:3000}"
OPENAPI_SPEC="${OPENAPI_SPEC:-openapi.yaml}"

# Check if OpenAPI spec exists
if [ ! -f "$OPENAPI_SPEC" ]; then
    echo -e "${YELLOW}⊘ No OpenAPI spec found at $OPENAPI_SPEC${NC}"
    echo "   Skipping API contract tests"
    exit 0
fi

echo "=== OpenAPI Spec Validation ==="
if command -v npx >/dev/null 2>&1; then
    if npx @redocly/cli lint "$OPENAPI_SPEC" 2>&1 | tee openapi-lint.log; then
        echo -e "${GREEN}✓ OpenAPI spec is valid${NC}"
    else
        echo -e "${RED}✗ OpenAPI spec has validation errors${NC}"
        cat openapi-lint.log
        exit 1
    fi
else
    echo -e "${YELLOW}⊘ @redocly/cli not available${NC}"
fi
echo ""

# Check for breaking changes (if previous spec exists)
echo "=== Breaking Change Detection ==="
if [ -f ".openapi-baseline.yaml" ]; then
    if command -v npx >/dev/null 2>&1; then
        echo "Comparing with baseline..."
        if npx oasdiff breaking .openapi-baseline.yaml "$OPENAPI_SPEC" > breaking-changes.txt 2>&1; then
            echo -e "${GREEN}✓ No breaking changes detected${NC}"
        else
            echo -e "${RED}✗ Breaking changes detected:${NC}"
            cat breaking-changes.txt

            # Check if waiver exists in policy.yaml
            if [ -f "policy.yaml" ]; then
                echo ""
                echo "Checking for waiver in policy.yaml..."
                if grep -q "gate: contracts" policy.yaml && \
                   grep -A 3 "gate: contracts" policy.yaml | grep -q "expires"; then

                    # Check if waiver is expired
                    EXPIRY=$(grep -A 3 "gate: contracts" policy.yaml | grep "expires" | sed 's/.*expires: "\(.*\)"/\1/')
                    if [[ "$EXPIRY" > "$(date +%Y-%m-%d)" ]]; then
                        echo -e "${YELLOW}⚠️  Breaking change allowed by waiver (expires: $EXPIRY)${NC}"
                    else
                        echo -e "${RED}✗ Breaking change waiver expired: $EXPIRY${NC}"
                        exit 1
                    fi
                else
                    echo -e "${RED}✗ No waiver found in policy.yaml${NC}"
                    echo "   Add waiver with expiry date or fix breaking changes"
                    exit 1
                fi
            else
                echo -e "${RED}✗ Breaking changes require approval${NC}"
                exit 1
            fi
        fi
    fi
else
    echo -e "${YELLOW}⊘ No baseline spec found (.openapi-baseline.yaml)${NC}"
    echo "   Creating baseline from current spec..."
    cp "$OPENAPI_SPEC" .openapi-baseline.yaml
fi
echo ""

# Run contract tests with Schemathesis
echo "=== Contract Testing (Schemathesis) ==="
if command -v schemathesis >/dev/null 2>&1; then
    echo "Testing against: $API_URL"

    if schemathesis run "$OPENAPI_SPEC" \
        --base-url "$API_URL" \
        --checks all \
        --report \
        --hypothesis-max-examples=50 \
        > schemathesis.log 2>&1; then
        echo -e "${GREEN}✓ Contract tests PASSED${NC}"

        # Show summary
        grep -A 10 "Test results" schemathesis.log || true
    else
        echo -e "${RED}✗ Contract tests FAILED${NC}"
        cat schemathesis.log
        exit 1
    fi
elif command -v npx >/dev/null 2>&1; then
    echo "Using Dredd for contract testing..."

    # Create dredd.yml if it doesn't exist
    if [ ! -f "dredd.yml" ]; then
        cat > dredd.yml <<EOF
dry-run: null
hookfiles: null
language: nodejs
sandbox: false
server: npm start
server-wait: 3
init: false
custom: {}
names: false
only: []
reporter: []
output: []
header: []
sorted: false
user: null
inline-errors: false
details: false
method: []
color: true
level: info
timestamp: false
silent: false
path: []
hooks-worker-timeout: 5000
hooks-worker-connect-timeout: 1500
hooks-worker-connect-retry: 500
hooks-worker-after-connect-wait: 100
hooks-worker-term-timeout: 5000
hooks-worker-term-retry: 500
hooks-worker-handler-host: 127.0.0.1
hooks-worker-handler-port: 61321
config: ./dredd.yml
blueprint: $OPENAPI_SPEC
endpoint: $API_URL
EOF
    fi

    if npx dredd 2>&1 | tee dredd.log; then
        echo -e "${GREEN}✓ Contract tests PASSED${NC}"
    else
        echo -e "${RED}✗ Contract tests FAILED${NC}"
        cat dredd.log
        exit 1
    fi
else
    echo -e "${YELLOW}⊘ No contract testing tool available${NC}"
    echo "   Install: pip install schemathesis"
fi
echo ""

echo -e "${GREEN}=== API CONTRACTS: PASS ===${NC}"
