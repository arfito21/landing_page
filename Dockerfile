# syntax=docker/dockerfile:1

# ============================================================
# LOKALOKA LANDING PAGE — production image untuk Komodo DevOps
#
# Build:
#   docker build -t fe-pineapple .
#
# Build dengan env custom (Vite membake VITE_* saat build):
#   docker build -t fe-pineapple \
#     --build-arg VITE_API_BASE_URL=https://api.staging.example.com/api/v1 \
#     --build-arg VITE_DASHBOARD_URL=https://dashboard-staging.example.com/ \
#     --build-arg VITE_PLAYSTORE_URL=https://play.google.com/store/apps/details?id=... \
#     .
#
# Run (URL juga bisa dioverride TANPA rebuild via env container):
#   docker run -d -p 8080:80 \
#     -e VITE_API_BASE_URL=https://api.landing-page.superpari.co.id/api/v1 \
#     -e VITE_DASHBOARD_URL=https://dashboard-v2.localoka.co.id/ \
#     -e VITE_PLAYSTORE_URL=https://play.google.com/store/apps/details?id=id.co.localoka.mobile&hl=id \
#     fe-pineapple
# ============================================================

# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Build-time config (Vite membake VITE_* ke dalam bundle).
# Di Komodo DevOps, isi nilainya lewat Build Args pipeline.
ARG VITE_API_BASE_URL=https://api.landing-page.superpari.co.id/api/v1
ARG VITE_API_PROXY_TARGET=https://api.landing-page.superpari.co.id
ARG VITE_DASHBOARD_URL=https://dashboard-v2.localoka.co.id/
ARG VITE_PLAYSTORE_URL=https://play.google.com/store/apps/details?id=id.co.localoka.mobile&hl=id
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_API_PROXY_TARGET=$VITE_API_PROXY_TARGET \
    VITE_DASHBOARD_URL=$VITE_DASHBOARD_URL \
    VITE_PLAYSTORE_URL=$VITE_PLAYSTORE_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime

# Konfigurasi nginx untuk SPA (fallback ke index.html + cache aset)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Hasil build Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Entrypoint: generate /usr/share/nginx/html/env.js dari env container
# agar VITE_* bisa diubah TANPA rebuild image.
COPY docker-entrypoint.sh /usr/local/bin/app-entrypoint.sh
RUN chmod +x /usr/local/bin/app-entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ > /dev/null 2>&1 || exit 1

ENTRYPOINT ["/usr/local/bin/app-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
