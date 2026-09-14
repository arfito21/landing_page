#!/bin/sh
# Entrypoint container fe-pineapple.
# Generate /usr/share/nginx/html/env.js dari environment variables
# container agar URL (API, dashboard, playstore) bisa diubah
# TANPA rebuild image. Lalu jalankan nginx.
set -eu

OUT_DIR="${ENV_JS_DIR:-/usr/share/nginx/html}"
mkdir -p "$OUT_DIR"

esc() {
  printf '%s' "${1:-}" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

cat > "$OUT_DIR/env.js" <<EOF
/* Generated at container startup - DO NOT EDIT.
   Override via env: VITE_API_BASE_URL, VITE_DASHBOARD_URL, VITE_PLAYSTORE_URL */
window.__LOKALOKA_ENV__ = window.__LOKALOKA_ENV__ || {};
window.__LOKALOKA_ENV__.VITE_API_BASE_URL = "$(esc "${VITE_API_BASE_URL:-}")";
window.__LOKALOKA_ENV__.VITE_DASHBOARD_URL = "$(esc "${VITE_DASHBOARD_URL:-}")";
window.__LOKALOKA_ENV__.VITE_PLAYSTORE_URL = "$(esc "${VITE_PLAYSTORE_URL:-}")";
EOF

exec "$@"
