#!/bin/sh

set -e

cat > /usr/share/nginx/html/env.js <<EOF
window.__LOKALOKA_ENV__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-}",
  VITE_API_PROXY_TARGET: "${VITE_API_PROXY_TARGET:-}",
  VITE_DASHBOARD_URL: "${VITE_DASHBOARD_URL:-}",
  VITE_PLAYSTORE_URL: "${VITE_PLAYSTORE_URL:-}"
};
EOF

echo "Runtime environment:"
cat /usr/share/nginx/html/env.js

exec "$@"