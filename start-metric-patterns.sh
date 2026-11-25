#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=5126

echo "=== Metric Patterns ==="

# In the monorepo, app/package.json uses `catalog:` versions, which only pnpm
# understands. In the public repo, scripts/publish-app.sh has replaced them
# with real versions, so plain npm works.
if grep -q '"catalog:\|"workspace:' "$SCRIPT_DIR/app/package.json"; then
  if ! command -v pnpm >/dev/null 2>&1; then
    echo "This app is part of the Context Plane pnpm workspace, so it needs pnpm." >&2
    echo "Install it with: npm install -g pnpm" >&2
    exit 1
  fi
  cd "$SCRIPT_DIR/../.."
  echo "Installing dependencies (pnpm workspace)..."
  pnpm install
  echo "Listening on http://127.0.0.1:$PORT (local only)"
  exec pnpm dev:metric-patterns
else
  cd "$SCRIPT_DIR/app"
  echo "Installing dependencies..."
  npm install --silent 2>/dev/null || npm install
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "  Metric Patterns — local-only"
  echo "  Listening on http://127.0.0.1:$PORT"
  echo "  Do NOT expose this port to a LAN or the internet."
  echo "════════════════════════════════════════════════════════════"
  echo ""
  exec npm run dev -- --port "$PORT" --host 127.0.0.1
fi
