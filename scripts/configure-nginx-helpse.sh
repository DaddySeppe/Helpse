#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${HELPSE_DOMAIN:-helpse.be}"
API_TARGET="${HELPSE_API_TARGET:-http://127.0.0.1:4000}"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"

read -r -d '' API_BLOCK <<NGINX || true

    location ^~ /api/ {
        proxy_pass ${API_TARGET};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
NGINX

mapfile -t CONFIG_FILES < <(
  sudo grep -RslE "server_name[^;]*\\b${DOMAIN}\\b" \
    /etc/nginx/sites-available \
    /etc/nginx/sites-enabled \
    /etc/nginx/conf.d 2>/dev/null | sort -u
)

if [ "${#CONFIG_FILES[@]}" -eq 0 ]; then
  echo "No Nginx config found for ${DOMAIN}." >&2
  exit 1
fi

patched_any=0

for config_file in "${CONFIG_FILES[@]}"; do
  if sudo grep -q "proxy_pass ${API_TARGET};" "$config_file"; then
    echo "Nginx API proxy already present in ${config_file}."
    patched_any=1
    continue
  fi

  if ! sudo grep -qE "^[[:space:]]*location[[:space:]]+/[[:space:]]*\\{" "$config_file"; then
    echo "Skipping ${config_file}: no plain location / block found." >&2
    continue
  fi

  tmp_file="$(mktemp)"

  sudo awk -v block="$API_BLOCK" '
    $0 ~ /^[[:space:]]*location[[:space:]]+\/[[:space:]]*\{/ {
      print block
    }
    { print }
  ' "$config_file" > "$tmp_file"

  sudo cp "$config_file" "${config_file}.helpse.bak.${TIMESTAMP}"
  sudo cp "$tmp_file" "$config_file"
  rm -f "$tmp_file"

  echo "Inserted /api proxy into ${config_file}."
  patched_any=1
done

if [ "$patched_any" -ne 1 ]; then
  echo "Could not patch any Nginx config for ${DOMAIN}." >&2
  exit 1
fi

sudo nginx -t

if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl reload nginx
else
  sudo nginx -s reload
fi

echo "Nginx is configured: https://${DOMAIN}/api/* -> ${API_TARGET}"
