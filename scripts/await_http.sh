#!/usr/bin/env bash
# Wait for an HTTP endpoint to become available
set -euo pipefail

URL="${1:-}"
TIMEOUT="${2:-60}"

if [ -z "$URL" ]; then
    echo "Usage: $0 <URL> [TIMEOUT_SECONDS]"
    echo "Example: $0 http://localhost:3000/health 60"
    exit 1
fi

echo "Waiting for $URL to respond (timeout: ${TIMEOUT}s)..."

for i in $(seq 1 "$TIMEOUT"); do
    if curl -fsSL "$URL" > /dev/null 2>&1; then
        echo "✓ $URL is responding (took ${i}s)"
        exit 0
    fi

    # Show progress every 5 seconds
    if [ $((i % 5)) -eq 0 ]; then
        echo "  ... still waiting (${i}/${TIMEOUT}s)"
    fi

    sleep 1
done

echo "✗ Timeout: $URL did not respond within ${TIMEOUT}s"
exit 1
