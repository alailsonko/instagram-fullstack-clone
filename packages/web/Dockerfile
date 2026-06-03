# ─── Stage 0: Base — Node + Yarn 4 baked in ─────────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare yarn@4.14.1 --activate

# ─── Stage 1: Install all workspace dependencies ───────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/api/package.json     ./packages/api/
COPY packages/users/package.json   ./packages/users/
COPY packages/auth/package.json    ./packages/auth/
COPY packages/web/package.json     ./packages/web/

RUN yarn install --immutable

# ─── Stage 2: Build ─────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/api/package.json     ./packages/api/
COPY packages/users/package.json   ./packages/users/
COPY packages/auth/package.json    ./packages/auth/
COPY packages/web ./packages/web

RUN yarn workspace @instagram-clone/web build

# ─── Stage 3: Serve static files with nginx ─────────────────────────────────────
FROM nginx:alpine AS runner

COPY --from=builder /app/packages/web/dist /usr/share/nginx/html
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
