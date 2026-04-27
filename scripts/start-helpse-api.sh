#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${GITHUB_WORKSPACE:-$(pwd)}"
SERVER_DIR="${HELPSE_SERVER_DIR:-${ROOT_DIR}/server}"
ENV_FILE="${HELPSE_SERVER_ENV:-${SERVER_DIR}/.env}"
APP_NAME="${HELPSE_PM2_APP_NAME:-helpse-api}"
PORT="${PORT:-4000}"

if [ ! -d "$SERVER_DIR" ]; then
  echo "Server directory not found: ${SERVER_DIR}" >&2
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  for candidate in \
    "/home/sv/helpse-server.env" \
    "/home/sv/helpse/.env" \
    "/home/sv/helpse/server/.env" \
    "/home/sv/Helpse/server/.env"; do
    if [ -f "$candidate" ]; then
      ENV_FILE="$candidate"
      break
    fi
  done
fi

if [ ! -f "$ENV_FILE" ]; then
  cat >&2 <<EOF
Missing backend env file.

Create one of these files on the homeserver:
- ${SERVER_DIR}/.env
- /home/sv/helpse-server.env

It must contain at least:
CLIENT_URL=https://helpse.be
JWT_SECRET=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
EOF
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

missing=0
for name in CLIENT_URL JWT_SECRET SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET; do
  if [ -z "${!name:-}" ]; then
    echo "Missing env var in ${ENV_FILE}: ${name}" >&2
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  exit 1
fi

cd "$SERVER_DIR"
npm ci --omit=dev

if npx --yes pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  npx --yes pm2 restart "$APP_NAME" --update-env
else
  npx --yes pm2 start server.js --name "$APP_NAME" --update-env
fi

npx --yes pm2 save || true

for attempt in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS "http://127.0.0.1:${PORT}/api/health"; then
    echo
    echo "Helpse API is running on port ${PORT}."
    exit 0
  fi
  sleep 2
done

echo "Helpse API did not become healthy on port ${PORT}." >&2
npx --yes pm2 logs "$APP_NAME" --lines 80 --nostream || true
exit 1
