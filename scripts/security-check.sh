#!/usr/bin/env bash
# Security and supply chain checks
set -euo pipefail

echo "🔒 Running security checks..."
echo ""

FAILED=0
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Secrets scan with gitleaks
echo "=== Secrets Scan ==="
if command -v gitleaks >/dev/null 2>&1; then
    if gitleaks detect --no-git --verbose 2>&1 | tee gitleaks.log; then
        echo -e "${GREEN}✓ No secrets detected${NC}"
    else
        echo -e "${RED}✗ Secrets detected in code${NC}"
        cat gitleaks.log
        FAILED=1
    fi
else
    echo -e "${YELLOW}⊘ gitleaks not installed (brew install gitleaks)${NC}"
fi
echo ""

# 2. Dependency audit
echo "=== Dependency Audit ==="
if [ -f "package.json" ]; then
    if npm audit --audit-level=high --json > audit.json 2>&1; then
        VULNS=$(jq '.metadata.vulnerabilities.high + .metadata.vulnerabilities.critical' audit.json 2>/dev/null || echo "0")
        if [ "$VULNS" -eq 0 ]; then
            echo -e "${GREEN}✓ No high/critical vulnerabilities${NC}"
        else
            echo -e "${RED}✗ Found $VULNS high/critical vulnerabilities${NC}"
            npm audit --audit-level=high
            FAILED=1
        fi
    else
        echo -e "${RED}✗ Dependency audit failed${NC}"
        FAILED=1
    fi
else
    echo -e "${YELLOW}⊘ No package.json found${NC}"
fi
echo ""

# 3. SAST with semgrep (lightweight rules)
echo "=== Static Analysis (SAST) ==="
if command -v semgrep >/dev/null 2>&1; then
    if semgrep --config=auto --json --quiet . > semgrep.json 2>&1; then
        ISSUES=$(jq '[.results[] | select(.extra.severity == "ERROR")] | length' semgrep.json 2>/dev/null || echo "0")
        if [ "$ISSUES" -eq 0 ]; then
            echo -e "${GREEN}✓ No critical SAST issues${NC}"
        else
            echo -e "${RED}✗ Found $ISSUES critical SAST issues${NC}"
            jq -r '.results[] | select(.extra.severity == "ERROR") | "\(.path):\(.start.line) - \(.extra.message)"' semgrep.json
            FAILED=1
        fi
    fi
else
    echo -e "${YELLOW}⊘ semgrep not installed (pip install semgrep)${NC}"
fi
echo ""

# 4. Container scan (if Dockerfile exists)
echo "=== Container Scan ==="
if [ -f "Dockerfile" ] && command -v grype >/dev/null 2>&1; then
    IMAGE_NAME="app:latest"
    docker build -t "$IMAGE_NAME" . > /dev/null 2>&1 || true
    if grype "$IMAGE_NAME" --fail-on high -o json > grype.json 2>&1; then
        echo -e "${GREEN}✓ No high/critical container vulnerabilities${NC}"
    else
        echo -e "${RED}✗ Container vulnerabilities detected${NC}"
        grype "$IMAGE_NAME" --fail-on high
        FAILED=1
    fi
else
    echo -e "${YELLOW}⊘ Dockerfile not found or grype not installed${NC}"
fi
echo ""

# 5. Generate SBOM (Software Bill of Materials)
echo "=== SBOM Generation ==="
if command -v syft >/dev/null 2>&1; then
    syft . -o json > sbom.json 2>&1
    echo -e "${GREEN}✓ SBOM generated (sbom.json)${NC}"
elif command -v npx >/dev/null 2>&1 && [ -f "package.json" ]; then
    npx @cyclonedx/cyclonedx-npm --output-file sbom.json 2>&1
    echo -e "${GREEN}✓ SBOM generated (sbom.json)${NC}"
else
    echo -e "${YELLOW}⊘ SBOM tools not available (install syft or @cyclonedx/cyclonedx-npm)${NC}"
fi
echo ""

# 6. License compliance (check for forbidden licenses)
echo "=== License Compliance ==="
if command -v npx >/dev/null 2>&1 && [ -f "package.json" ]; then
    FORBIDDEN_LICENSES="GPL-3.0 AGPL-3.0 SSPL"
    if npx license-checker --json --production > licenses.json 2>&1; then
        FORBIDDEN_FOUND=0
        for LICENSE in $FORBIDDEN_LICENSES; do
            if grep -q "$LICENSE" licenses.json; then
                echo -e "${RED}✗ Forbidden license found: $LICENSE${NC}"
                FORBIDDEN_FOUND=1
                FAILED=1
            fi
        done
        if [ $FORBIDDEN_FOUND -eq 0 ]; then
            echo -e "${GREEN}✓ No forbidden licenses${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⊘ license-checker not available${NC}"
fi
echo ""

# Summary
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}=== SECURITY: PASS ===${NC}"
    exit 0
else
    echo -e "${RED}=== SECURITY: FAIL ===${NC}"
    echo ""
    echo "Generated artifacts:"
    [ -f "audit.json" ] && echo "  - audit.json (dependency vulnerabilities)"
    [ -f "semgrep.json" ] && echo "  - semgrep.json (SAST findings)"
    [ -f "grype.json" ] && echo "  - grype.json (container vulnerabilities)"
    [ -f "sbom.json" ] && echo "  - sbom.json (software bill of materials)"
    exit 1
fi
