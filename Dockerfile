# syntax=docker/dockerfile:1

# ============================================================
# LOKALOKA LANDING PAGE — production image untuk Komodo DevOps
# ============================================================

# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

# Generate env.js dari environment Komodo saat container start
COPY docker-entrypoint.sh /usr/local/bin/app-entrypoint.sh
RUN chmod +x /usr/local/bin/app-entrypoint.sh

# Nginx listen langsung di 5173
EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5173/ > /dev/null 2>&1 || exit 1

ENTRYPOINT ["/usr/local/bin/app-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
