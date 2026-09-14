# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Build-time config (Vite membake VITE_* ke dalam bundle).
# Di Komodo DevOps, isi nilainya lewat Build Args pipeline.
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
