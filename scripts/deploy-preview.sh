#!/usr/bin/env bash
# Deploy ephemeral preview environment with masked seed data
set -euo pipefail

echo "🚀 Deploying preview environment..."

PR_NUMBER="${PR_NUMBER:-$1}"
if [ -z "$PR_NUMBER" ]; then
    echo "❌ Error: PR_NUMBER required"
    echo "Usage: $0 <pr-number>"
    exit 1
fi

PREVIEW_NAME="pr-${PR_NUMBER}"
DEPLOY_PLATFORM="${DEPLOY_PLATFORM:-vercel}"

# Build with PR-specific environment
export NODE_ENV=preview
export PREVIEW_URL="https://${PREVIEW_NAME}.preview.app"

echo "📦 Building for preview..."
npm run build

case "$DEPLOY_PLATFORM" in
    vercel)
        echo "🚀 Deploying to Vercel..."
        npx vercel --yes --token "$VERCEL_TOKEN" \
            --env PREVIEW_MODE=true \
            --env PR_NUMBER="$PR_NUMBER" \
            > deploy.log 2>&1
        PREVIEW_URL=$(grep -oP 'https://[^\s]+' deploy.log | head -1)
        ;;
    netlify)
        echo "🚀 Deploying to Netlify..."
        npx netlify deploy --prod --alias "$PREVIEW_NAME" \
            > deploy.log 2>&1
        PREVIEW_URL=$(grep -oP 'https://[^\s]+' deploy.log | head -1)
        ;;
    railway)
        echo "🚀 Deploying to Railway..."
        railway up --service "$PREVIEW_NAME" > deploy.log 2>&1
        PREVIEW_URL=$(railway domain | head -1)
        ;;
    docker)
        echo "🐳 Starting Docker preview..."
        docker-compose -p "$PREVIEW_NAME" up -d
        PREVIEW_URL="http://localhost:${PORT:-5173}"
        ;;
    *)
        echo "❌ Unknown platform: $DEPLOY_PLATFORM"
        exit 1
        ;;
esac

echo ""
echo "✅ Preview deployed!"
echo "📍 URL: $PREVIEW_URL"
echo ""

# Wait for preview to be ready
echo "⏳ Waiting for preview to be healthy..."
bash scripts/await_http.sh "$PREVIEW_URL/health" 120 || \
bash scripts/await_http.sh "$PREVIEW_URL" 120

# Run smoke tests against preview
echo ""
echo "🧪 Running smoke tests against preview..."
if bash scripts/smoke.sh "$PREVIEW_URL"; then
    echo "✅ Preview smoke tests PASSED"
else
    echo "❌ Preview smoke tests FAILED"
    exit 1
fi

# Run Playwright tests and save traces
if command -v npx >/dev/null 2>&1 && [ -d "tests/e2e" ]; then
    echo ""
    echo "🎭 Running Playwright tests..."
    export BASE_URL="$PREVIEW_URL"
    npx playwright test \
        --reporter=html,json \
        --output=test-results/ \
        || true  # Don't fail deployment on test failures

    # Save traces
    if [ -d "test-results" ]; then
        echo "💾 Playwright traces saved to test-results/"
        echo "📊 Test report: test-results/index.html"
    fi
fi

# Save preview info for CI
cat > preview-info.json <<EOF
{
  "pr": "$PR_NUMBER",
  "url": "$PREVIEW_URL",
  "platform": "$DEPLOY_PLATFORM",
  "deployed_at": "$(date --iso-8601=seconds 2>/dev/null || date +%Y-%m-%dT%H:%M:%S)",
  "smoke_tests": "PASS"
}
EOF

echo ""
echo "📝 Preview info saved to preview-info.json"
echo ""
echo "🎉 Preview deployment complete!"
echo "🔗 Visit: $PREVIEW_URL"
