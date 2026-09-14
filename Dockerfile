# syntax=docker/dockerfile:1

# ============================================================
# LOKALOKA LANDING PAGE
# React + Vite
# Runtime: Vite Preview :5173
# ============================================================

# ---------- Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build


# ---------- Runtime ----------
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Hasil build
COPY --from=builder /app/dist ./dist

# Vite diperlukan untuk menjalankan preview
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
