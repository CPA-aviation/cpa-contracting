#!/usr/bin/env bash
# Build cpacontractingllc.com as a static site on the VPS.
# Run:  bash /app/cpa-contracting/deploy/deploy.sh
# Nginx serves the result straight from out/ — no Node server, no PM2, no reload needed.
# Does NOT touch Nginx or SSL — those are managed by hand.
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"
echo "==> $APP_DIR  (branch: $BRANCH)"

if ! grep -qs '^NEXT_PUBLIC_LEADS_SITE_KEY=.\+' .env.production; then
  echo "    WARNING: NEXT_PUBLIC_LEADS_SITE_KEY is not set in $APP_DIR/.env.production" >&2
  echo "             The enquiry form will fall back to opening an email draft." >&2
fi

echo "==> Pulling latest code"
git fetch --prune origin
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
echo "    now at $(git log -1 --format='%h %s')"

echo "==> Installing dependencies"
npm ci --no-audit --no-fund

echo "==> Building static export into out/"
# next build reads NEXT_PUBLIC_* values from .env.production and inlines them.
NEXT_TELEMETRY_DISABLED=1 npm run build

if [ -f out/index.html ] && [ -f out/contact.html ]; then
  echo "    OK — static site built in $APP_DIR/out"
else
  echo "    FAILED — out/index.html or out/contact.html missing" >&2
  exit 1
fi
