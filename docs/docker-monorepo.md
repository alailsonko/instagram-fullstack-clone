# Docker + Yarn Monorepo — Complete Guide

## Table of Contents

1. [The Core Problem](#1-the-core-problem)
2. [Build Context — The Most Important Concept](#2-build-context--the-most-important-concept)
3. [Multi-Stage Builds](#3-multi-stage-builds)
4. [Stage-by-Stage Breakdown](#4-stage-by-stage-breakdown)
5. [yarn workspaces focus — Lean Production Images](#5-yarn-workspaces-focus--lean-production-images)
6. [The .dockerignore File](#6-the-dockerignore-file)
7. [docker-compose.yml Explained](#7-docker-composeyml-explained)
8. [nginx for the React SPA](#8-nginx-for-the-react-spa)
9. [Layer Caching — Making Builds Fast](#9-layer-caching--making-builds-fast)
10. [Common Commands](#10-common-commands)
11. [Pitfalls](#11-pitfalls)

---

## 1. The Core Problem

In a regular single-package project, you build a Docker image by copying the project folder into the container and running `npm install`. Simple.

In a Yarn monorepo it breaks because:

1. `node_modules` is **hoisted to the root** — it doesn't live inside each package
2. Running `yarn install` from inside `packages/api` alone doesn't work — Yarn needs the root `package.json`, `yarn.lock`, `.yarnrc.yml`, **and** every workspace's `package.json` to calculate the correct hoisting
3. The build command (`nest build`, `vite build`) needs the hoisted `node_modules` at the root

So Docker must see the **entire monorepo** in order to build any single package.

```
❌ Wrong mental model             ✅ Correct mental model
                                  
packages/api/                     monorepo root/
├── src/                          ├── package.json       ← Yarn reads this
├── package.json                  ├── yarn.lock          ← Yarn reads this
└── node_modules/ ← doesn't       ├── .yarnrc.yml        ← Yarn reads this
    exist alone                   ├── node_modules/      ← hoisted here
                                  └── packages/
                                      └── api/
                                          ├── src/
                                          └── package.json
```

---

## 2. Build Context — The Most Important Concept

The **build context** is the folder that Docker sends to the Docker daemon when you run a build. Everything inside it is available via `COPY` instructions. Everything outside it is invisible.

For a monorepo, the build context must be the **root of the repository**:

```yaml
# docker-compose.yml
services:
  api:
    build:
      context: .                           # ← root of the repo
      dockerfile: packages/api/Dockerfile  # ← Dockerfile lives inside a package
```

Or from the command line:

```bash
# The dot at the end is the build context (current directory = repo root)
docker build -f packages/api/Dockerfile .
```

### Why not set the context to packages/api?

```yaml
# ❌ This fails
build:
  context: ./packages/api   # Docker can only see packages/api/
  dockerfile: Dockerfile     # Can't COPY ../package.json — outside context!
```

The COPY instruction inside the Dockerfile cannot reference files outside the build context. Setting context to `./packages/api` means the Dockerfile can never access `yarn.lock` or root `package.json`, so `yarn install` fails.

---

## 3. Multi-Stage Builds

A multi-stage Dockerfile uses multiple `FROM` statements. Each stage has a name and can copy files from previous stages. Only the **last stage** becomes the final image — all intermediate stages are discarded.

This solves two problems:
- **Size** — the final image doesn't need Node.js build tools, TypeScript compiler, devDependencies, or source files
- **Security** — source code and build secrets never end up in the shipped image

### Image size comparison (NestJS example)

| Approach | Image size |
|---|---|
| Single stage, all deps | ~900 MB |
| Multi-stage, prod deps only | ~180 MB |
| Multi-stage + Alpine base | ~120 MB |

---

## 4. Stage-by-Stage Breakdown

Every NestJS service (`api`, `users`, `auth`) uses four stages. Here is what each one does and why.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    deps     │    │   builder   │    │  prod-deps  │    │   runner    │
│             │    │             │    │             │    │             │
│ yarn install│───▶│ nest build  │    │ yarn focus  │    │ node app    │
│ all deps    │    │             │    │ prod only   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                                      │                  │
      │ node_modules/                        │ node_modules/    │ (runtime)
      └──────────────▶ build ──────────────▶ └──────▶ dist/ ───┘
```

### Stage 1 — `deps`: Install everything

```dockerfile
FROM node:22-alpine AS deps

RUN corepack enable
WORKDIR /app

# Copy ONLY the manifest files first (not source code)
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/api/package.json     ./packages/api/
COPY packages/users/package.json   ./packages/users/
COPY packages/auth/package.json    ./packages/auth/
COPY packages/web/package.json     ./packages/web/

RUN yarn install --immutable
```

**Why copy manifests before source?**
Docker caches each layer. Copying `package.json` and `yarn.lock` first means the `yarn install` layer is only invalidated when dependencies change — not every time you change a `.ts` file. This is the most important caching optimization.

**Why copy ALL workspace package.json files?**
Yarn needs to see every workspace's `package.json` to calculate hoisting. If any are missing, Yarn will fail or produce incorrect installs.

**Why `--immutable`?**
In Yarn Berry, `--immutable` (equivalent to `npm ci`) fails if the lockfile would need updating. This prevents "works on my machine" bugs where a Docker build silently installs different versions than what's in `yarn.lock`.

**Why `corepack enable`?**
Corepack reads `"packageManager": "yarn@4.x.x"` from `package.json` and uses exactly that Yarn version, just like on a developer's machine.

---

### Stage 2 — `builder`: Compile TypeScript

```dockerfile
FROM node:22-alpine AS builder

RUN corepack enable
WORKDIR /app

# Pull in node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy only what's needed to build this specific package
COPY package.json ./
COPY packages/api ./packages/api

RUN yarn workspace api build
```

**Why start a new stage instead of reusing `deps`?**
The `deps` stage's only job is installing. Starting fresh and copying only `node_modules` keeps this stage's layer graph clean and makes cache hits more predictable.

**Why not copy all packages?**
The `api` package only needs its own source to build. Copying `packages/web`, `packages/users`, etc. would bust the cache whenever those packages change, even if `api`'s source hasn't changed.

**What does `yarn workspace api build` do?**
It runs the `build` script defined in `packages/api/package.json` (`nest build`). This compiles TypeScript to `packages/api/dist/`.

---

### Stage 3 — `prod-deps`: Production dependencies only

```dockerfile
FROM node:22-alpine AS prod-deps

RUN corepack enable
WORKDIR /app

# Manifests only — no source code needed
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/api/package.json     ./packages/api/
...

RUN yarn workspaces focus api --production
```

**What does `yarn workspaces focus` do?**
It installs only the packages listed in the target workspace's `dependencies` (not `devDependencies`). For a NestJS app this means: no TypeScript compiler, no Jest, no ESLint, no `@nestjs/cli` — only the packages the app actually imports at runtime.

This is a fresh install, not a pruning of the existing `node_modules`. It produces a clean, minimal `node_modules/` at the root.

---

### Stage 4 — `runner`: The final image

```dockerfile
FROM node:22-alpine AS runner

WORKDIR /app

USER node  # non-root for security

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder   --chown=node:node /app/packages/api/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**What ends up in the final image?**
- `node_modules/` — runtime dependencies only (from `prod-deps` stage)
- `dist/` — compiled JavaScript only (from `builder` stage)
- Node.js runtime (from `node:22-alpine`)

**What does NOT end up in the final image?**
- TypeScript source files
- `devDependencies` (TypeScript compiler, Jest, ESLint, etc.)
- Build tools and caches
- Any other package's source code

**Why `USER node`?**
The `node:22-alpine` image ships with a non-root user called `node`. Running the process as a non-root user limits what an attacker can do if the app is compromised.

**How does Node.js find `node_modules`?**
Node.js resolves `require()` calls by walking up the directory tree looking for `node_modules/`. When `dist/main.js` runs at `/app/dist/main.js`, Node walks:
1. `/app/dist/node_modules` — doesn't exist
2. `/app/node_modules` — **found** ✓

So copying `node_modules` to `/app/node_modules` and `dist` to `/app/dist` is all that's needed.

---

### Web stage breakdown (Vite + nginx)

The web package uses three stages instead of four because there are no production Node.js dependencies to run — it's just static files.

```dockerfile
FROM node:22-alpine AS deps     # Install deps (same as NestJS)
FROM node:22-alpine AS builder  # yarn workspace web build → packages/web/dist/
FROM nginx:alpine   AS runner   # Copy dist/ to nginx web root, serve on port 80
```

The compiled React app is a folder of `.html`, `.js`, and `.css` files. nginx serves them — no Node.js needed at runtime.

---

## 5. yarn workspaces focus — Lean Production Images

`yarn workspaces focus <workspace> --production` is the monorepo equivalent of `npm install --production`. It:

1. Reads the target workspace's `dependencies` (not `devDependencies`)
2. Reads all transitive dependencies
3. Installs only those into `node_modules`

### Typical savings for a NestJS package

| Install type | Packages installed | Approximate size |
|---|---|---|
| Full `yarn install` | ~800 packages | 350 MB |
| `yarn workspaces focus --production` | ~200 packages | 80 MB |

### Why run it as a separate stage?

Running `yarn workspaces focus` as a separate stage (not inside the runner) keeps the runner stage from needing Yarn or corepack. The runner only gets the final `node_modules/` folder.

---

## 6. The .dockerignore File

`.dockerignore` works like `.gitignore` but for the Docker build context. It tells Docker which files to **exclude** before sending the context to the Docker daemon.

This matters for two reasons:

1. **Speed** — Docker compresses and transfers the build context before building. A 500MB `node_modules/` folder in the context adds significant time even if you never `COPY` it in the Dockerfile.
2. **Cache correctness** — Docker hashes the build context to detect changes. Including files that change frequently (like `node_modules`) causes unnecessary cache misses.

### Key exclusions

```
node_modules           # reinstalled inside Docker — never copy the host's node_modules
packages/*/node_modules
.yarn/cache            # Yarn's download cache — not needed, Docker downloads fresh
packages/*/dist        # rebuilt inside Docker
.env                   # injected at runtime via docker-compose, never baked into image
```

---

## 7. docker-compose.yml Explained

```yaml
services:
  api:
    build:
      context: .                          # monorepo root
      dockerfile: packages/api/Dockerfile # package-specific Dockerfile
    env_file:
      - .env                              # loads all vars from .env into the container
    depends_on:
      database:
        condition: service_healthy        # waits for postgres healthcheck to pass
```

### `context: .` vs `context: ./packages/api`

| | `context: .` | `context: ./packages/api` |
|---|---|---|
| Can COPY root package.json | Yes | No |
| Can COPY yarn.lock | Yes | No |
| yarn install works | Yes | No |
| Context size | Larger (whole repo) | Smaller |

The `.dockerignore` file reduces the effective context size significantly even when using `context: .`.

### `env_file` vs `environment`

```yaml
# ✅ env_file — reads from .env file, values are interpolated
env_file:
  - .env

# ✅ environment with interpolation — value comes from the shell or .env
environment:
  POSTGRES_USER: ${DATABASE_USER}

# ❌ environment with literal strings — sets the var to the string "DATABASE_USER"
environment:
  POSTGRES_USER: DATABASE_USER
```

The original `docker-compose.yml` used the third form (literal strings), which would set `POSTGRES_USER` to the string `"DATABASE_USER"` instead of the actual value.

### `depends_on` with healthchecks

```yaml
depends_on:
  database:
    condition: service_healthy
```

Without `condition: service_healthy`, Docker only waits for the container to **start**, not for the service inside it to be **ready**. Postgres takes a few seconds to accept connections after the container starts. Using `service_healthy` waits until the healthcheck passes.

The postgres healthcheck:
```yaml
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U ${DATABASE_USER} -d ${DATABASE_NAME}']
  interval: 10s
  timeout: 5s
  retries: 5
```

`pg_isready` pings postgres and exits 0 when it's accepting connections. The api, users, and auth services won't start until this passes.

---

## 8. nginx for the React SPA

The web Dockerfile uses nginx instead of Node.js to serve the built React app. This is the standard production pattern for any framework that compiles to static files (Vite, Next.js static export, CRA).

### Why nginx instead of `vite preview`?

| | `vite preview` | nginx |
|---|---|---|
| Purpose | Development preview | Production-grade server |
| Gzip compression | No | Yes |
| Cache headers | No | Yes (configurable) |
| Concurrent connections | Limited | High |
| Memory usage | ~80 MB (Node runtime) | ~10 MB |

### The SPA fallback

React Router (and all client-side routers) needs the server to return `index.html` for every URL, not just `/`. Without this, navigating directly to `/users/123` returns a 404 from nginx.

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

`try_files` tries to serve the exact file (`$uri`), then a directory index (`$uri/`), and falls back to `/index.html` — React Router then takes over client-side.

### Caching hashed assets

Vite adds a content hash to every built asset filename (e.g., `index-Bx3aKp9d.js`). Since the filename changes whenever the content changes, it's safe to cache these assets forever:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 9. Layer Caching — Making Builds Fast

Docker builds are fast on subsequent runs because of layer caching. Each `RUN`, `COPY`, and `ADD` instruction creates a layer. If a layer's inputs haven't changed, Docker reuses the cached layer and skips re-running the command.

### The manifest-first pattern

The most impactful caching technique in a monorepo Dockerfile:

```dockerfile
# ✅ Copy manifests first — yarn install only reruns when deps change
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/api/package.json ./packages/api/
RUN yarn install --immutable   # cached unless package.json or yarn.lock changes

# Then copy source — changes to .ts files don't bust the install cache
COPY packages/api ./packages/api
RUN yarn workspace api build
```

vs:

```dockerfile
# ❌ Copying everything first — any source change reruns yarn install
COPY . .
RUN yarn install --immutable   # cache busted on every .ts file change
RUN yarn workspace api build
```

### What busts each stage's cache

| Stage | Cache busted when |
|---|---|
| `deps` | `package.json`, `yarn.lock`, or any workspace `package.json` changes |
| `builder` | `deps` cache busted, OR any file in `packages/api/` changes |
| `prod-deps` | `package.json`, `yarn.lock`, or `packages/api/package.json` changes |
| `runner` | `builder` or `prod-deps` cache busted |

---

## 10. Common Commands

### Build and start everything

```bash
docker compose up --build
```

### Build a single service

```bash
docker compose build api
docker compose build web
```

### Start without rebuilding

```bash
docker compose up
```

### Stop all containers

```bash
docker compose down
```

### Stop and delete volumes (clears the database)

```bash
docker compose down -v
```

### View logs

```bash
docker compose logs -f          # all services
docker compose logs -f api      # one service
```

### Open a shell inside a running container

```bash
docker compose exec api sh
docker compose exec database psql -U ${DATABASE_USER} -d ${DATABASE_NAME}
```

### Rebuild one service and restart it

```bash
docker compose up --build api
```

### Check image sizes

```bash
docker images | grep instagram
```

### Inspect what's inside an image

```bash
docker run --rm -it instagram-fullstack-clone-api sh
ls node_modules | head -20
ls dist
```

---

## 11. Pitfalls

### Pitfall 1 — Forgetting to copy all workspace package.json files

Yarn needs every workspace's `package.json` in the `deps` stage to correctly calculate hoisting. Missing even one causes install errors.

```dockerfile
# ❌ Missing packages/web/package.json — Yarn can't fully resolve the graph
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/api/package.json ./packages/api/
RUN yarn install --immutable  # may fail or produce incorrect installs

# ✅ Copy all workspace manifests
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/api/package.json   ./packages/api/
COPY packages/users/package.json ./packages/users/
COPY packages/auth/package.json  ./packages/auth/
COPY packages/web/package.json   ./packages/web/
RUN yarn install --immutable
```

### Pitfall 2 — Adding a new workspace without updating the Dockerfiles

When you add a new package (e.g., `packages/shared`), you must add its `package.json` to the COPY list in **every** Dockerfile's `deps` and `prod-deps` stages. Otherwise Yarn will warn or fail.

### Pitfall 3 — Using `context: ./packages/api` in docker-compose

This is the most common monorepo Docker mistake. The context must be the repo root.

### Pitfall 4 — The .env file baked into the image

Never `COPY .env` in a Dockerfile. Secrets baked into layers remain in the image history even if later removed with `RUN rm .env`. Use `env_file` in docker-compose or Docker secrets for production.

### Pitfall 5 — `depends_on` without healthchecks

```yaml
# ❌ Only waits for the container to start, not for postgres to be ready
depends_on:
  - database

# ✅ Waits for the healthcheck to pass
depends_on:
  database:
    condition: service_healthy
```

Without `service_healthy`, the NestJS app may start before postgres is ready, fail to connect, and crash. The healthcheck pattern prevents this.

### Pitfall 6 — Running as root in production

The runner stage uses `USER node` to run as a non-root user. Running as root inside a container is a security risk — if the application is exploited, the attacker has root access inside the container.

---

## File Overview

```
instagram-fullstack-clone/
├── .dockerignore                ← excludes node_modules, dist, .env from context
├── docker-compose.yml           ← orchestrates all services
│
└── packages/
    ├── api/
    │   └── Dockerfile           ← 4-stage: deps → builder → prod-deps → runner
    ├── users/
    │   └── Dockerfile           ← same 4-stage pattern
    ├── auth/
    │   └── Dockerfile           ← same 4-stage pattern
    └── web/
        ├── Dockerfile           ← 3-stage: deps → builder → nginx runner
        └── nginx.conf           ← SPA fallback + asset caching
```
