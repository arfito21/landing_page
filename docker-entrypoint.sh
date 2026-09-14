#!/bin/sh

set -e

cat > /app/dist/env.js <<EOF
window.__ENV__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-}",
  VITE_API_PROXY_TARGET: "${VITE_API_PROXY_TARGET:-}",
  VITE_DASHBOARD_URL: "${VITE_DASHBOARD_URL:-}",
  VITE_PLAYSTORE_URL: "${VITE_PLAYSTORE_URL:-}"
};
EOF

echo "Runtime environment:"
cat /app/dist/env.js

exec "$@"