# ─── Stage 0: Base — Node + Yarn 4 baked in ─────────────────────────────────────
FROM node:22-alpine AS base
# corepack prepare downloads the binary into the image layer so every
# derived stage has yarn 4 available without a network call at build time
RUN corepack enable && corepack prepare yarn@4.14.1 --activate

# ─── Stage 1: Install all workspace dependencies ───────────────────────────────
FROM base AS deps
WORKDIR /app

# Copy workspace manifests first (cache-friendly — only reinstalls when these change)
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/config/package.json  ./packages/config/
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
COPY packages/config           ./packages/config
COPY packages/api              ./packages/api
COPY packages/users/package.json   ./packages/users/
COPY packages/auth/package.json    ./packages/auth/
COPY packages/web/package.json     ./packages/web/

RUN yarn workspace @instagram-clone/api build

# ─── Stage 3: Production dependencies only ──────────────────────────────────────
FROM base AS prod-deps
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/config/package.json  ./packages/config/
COPY packages/api/package.json     ./packages/api/
COPY packages/users/package.json   ./packages/users/
COPY packages/auth/package.json    ./packages/auth/
COPY packages/web/package.json     ./packages/web/

RUN yarn workspaces focus @instagram-clone/api --production

# ─── Stage 4: Runner ────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

USER node

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder   --chown=node:node /app/packages/api/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
