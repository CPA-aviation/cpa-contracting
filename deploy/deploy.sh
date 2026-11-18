#!/usr/bin/env bash
# Build and (re)start cpacontractingllc.com on the VPS.
# Run from anywhere as the deploy user:  bash /var/www/cpacontractingllc.com/deploy/deploy.sh
# Does NOT touch Nginx or SSL — those are managed by hand.
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BRANCH="${BRANCH:-main}"
PORT=3001

cd "$APP_DIR"
echo "==> $APP_DIR  (branch: $BRANCH)"

echo "==> Pulling latest code"
git fetch --prune origin
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
echo "    now at $(git log -1 --format='%h %s')"

echo "==> Installing dependencies"
npm ci --no-audit --no-fund

echo "==> Building"
# SECURITY_HTTPS=true bakes HSTS + upgrade-insecure-requests into the headers (see next.config.ts).
NEXT_TELEMETRY_DISABLED=1 SECURITY_HTTPS=true npm run build

echo "==> Starting / reloading with PM2"
pm2 startOrReload deploy/ecosystem.config.cjs --update-env
pm2 save

echo "==> Health check on 127.0.0.1:$PORT"
for i in $(seq 1 15); do
  if curl -fs -o /dev/null "http://127.0.0.1:$PORT/"; then
    echo "    OK — site is responding"
    exit 0
  fi
  sleep 1
done
echo "    FAILED — check: pm2 logs cpa-contracting --lines 100" >&2
exit 1
