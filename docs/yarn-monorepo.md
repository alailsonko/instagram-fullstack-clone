# Yarn Monorepo — Complete Guide

## Table of Contents

1. [What is a Monorepo?](#1-what-is-a-monorepo)
2. [Why Yarn Workspaces?](#2-why-yarn-workspaces)
3. [Setting Up the Monorepo](#3-setting-up-the-monorepo)
4. [Workspace Structure](#4-workspace-structure)
5. [Installing Dependencies](#5-installing-dependencies)
6. [Running Scripts](#6-running-scripts)
7. [Sharing Code Between Packages](#7-sharing-code-between-packages)
8. [Versioning and Publishing](#8-versioning-and-publishing)
9. [Plugins and Extensions](#9-plugins-and-extensions)
10. [Common Pitfalls](#10-common-pitfalls)
11. [Cheat Sheet](#11-cheat-sheet)

---

## 1. What is a Monorepo?

A **monorepo** (monolithic repository) is a single Git repository that contains multiple projects (called **packages** or **workspaces**).

### Monorepo vs Polyrepo

| | Monorepo | Polyrepo |
|---|---|---|
| Code sharing | Easy — import directly | Hard — must publish to npm |
| Atomic changes | Yes — one PR across packages | No — multiple PRs |
| Dependency management | Centralized | Each repo manages its own |
| CI complexity | Higher | Lower |
| Onboarding | One clone | Multiple clones |

### Real-world examples using monorepos

- **Facebook** — React, Jest, and many others live in one repo
- **Google** — Entire codebase in one repo
- **Vercel** — Next.js, SWR, and related projects

---

## 2. Why Yarn Workspaces?

Yarn Workspaces is built into Yarn (v1+, greatly improved in v4). It gives you:

- **Hoisted `node_modules`** — dependencies are installed once at the root, not duplicated in each package
- **Symlinked packages** — local packages reference each other via symlinks, so changes are instant without publishing
- **Single lockfile** — `yarn.lock` at the root covers all packages, ensuring consistency
- **Cross-package scripts** — run a command in all workspaces with one command

---

## 3. Setting Up the Monorepo

### Step 1 — Enable Corepack and use Yarn 4

```bash
corepack enable
corepack prepare yarn@stable --activate
```

### Step 2 — Initialize the root package

```bash
mkdir my-monorepo && cd my-monorepo
yarn init -y
```

### Step 3 — Configure workspaces in root `package.json`

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.16.0"
}
```

- `"private": true` is **required** — prevents accidentally publishing the root
- `"workspaces"` is a glob that tells Yarn where to find packages

### Step 4 — Create the `.yarnrc.yml` (Yarn 4 config)

Yarn 4 uses `.yarnrc.yml` instead of `.npmrc` or `.yarnrc`.

```yaml
nodeLinker: node-modules
```

> `nodeLinker: node-modules` uses the classic `node_modules` layout. Yarn 4 defaults to Plug'n'Play (PnP), which is more strict. Use `node-modules` if you want compatibility with tools that don't support PnP yet.

### Step 5 — Create your packages folder

```bash
mkdir -p packages/web packages/api packages/shared
```

### Step 6 — Initialize each package

Inside each package, create a `package.json`. Example for `packages/shared`:

```json
{
  "name": "@myapp/shared",
  "version": "1.0.0",
  "main": "src/index.ts",
  "private": true
}
```

> Convention: prefix package names with `@yourscope/` (e.g. `@myapp/web`). This avoids name collisions and makes imports clear.

### Step 7 — Install dependencies

```bash
yarn install
```

Yarn reads all `package.json` files under `packages/*` and installs everything in one go.

---

## 4. Workspace Structure

A typical fullstack monorepo looks like this:

```
my-monorepo/
├── .yarnrc.yml
├── package.json            ← root config (workspaces, shared dev tools)
├── yarn.lock               ← single lockfile for all packages
├── node_modules/           ← hoisted dependencies
└── packages/
    ├── web/                ← frontend (e.g. Next.js)
    │   ├── package.json
    │   └── src/
    ├── api/                ← backend (e.g. NestJS)
    │   ├── package.json
    │   └── src/
    └── shared/             ← shared code (types, utils, constants)
        ├── package.json
        └── src/
            └── index.ts
```

### Root `package.json` responsibilities

The root `package.json` should only contain:
- Workspace configuration
- Dev tools shared across all packages (ESLint, TypeScript, Prettier)
- Scripts to orchestrate all packages

It should **not** contain app-specific dependencies like React or NestJS.

---

## 5. Installing Dependencies

### Add a dependency to a specific workspace

```bash
yarn workspace @myapp/web add react react-dom
yarn workspace @myapp/api add @nestjs/core @nestjs/common
```

### Add a dependency to the root (shared dev tool)

```bash
yarn add -D typescript eslint prettier
```

### Add a local package as a dependency

To make `@myapp/api` depend on `@myapp/shared`:

```bash
yarn workspace @myapp/api add @myapp/shared@*
```

The `@*` means "any version", which resolves to the local package automatically. Yarn creates a symlink instead of downloading from npm.

### Remove a dependency

```bash
yarn workspace @myapp/web remove lodash
```

### Upgrade a dependency

```bash
yarn workspace @myapp/web up react
# or upgrade across all workspaces:
yarn up react
```

---

## 6. Running Scripts

### Run a script in a specific workspace

```bash
yarn workspace @myapp/web dev
yarn workspace @myapp/api build
```

### Run a script in all workspaces

```bash
yarn workspaces foreach run build
```

### Run in parallel

```bash
yarn workspaces foreach --parallel run dev
```

### Run only in workspaces that have the script defined

```bash
yarn workspaces foreach --all run test
```

### Exclude a workspace

```bash
yarn workspaces foreach --exclude @myapp/shared run dev
```

### Useful root-level scripts pattern

In the root `package.json`:

```json
{
  "scripts": {
    "dev": "yarn workspaces foreach --parallel --interlaced run dev",
    "build": "yarn workspaces foreach --topological run build",
    "test": "yarn workspaces foreach run test",
    "lint": "yarn workspaces foreach run lint"
  }
}
```

- `--parallel` — run all at the same time
- `--topological` — run in dependency order (build `shared` before `web` and `api`)
- `--interlaced` — interleave output from parallel processes

---

## 7. Sharing Code Between Packages

This is the main reason to use a monorepo. Here's how it works end-to-end.

### Step 1 — Create the shared package

`packages/shared/src/index.ts`:

```typescript
export type User = {
  id: string;
  username: string;
  email: string;
};

export const formatUsername = (username: string) =>
  username.toLowerCase().replace(/\s+/g, '_');
```

`packages/shared/package.json`:

```json
{
  "name": "@myapp/shared",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "private": true
}
```

### Step 2 — Add shared as a dependency

```bash
yarn workspace @myapp/web add @myapp/shared@*
yarn workspace @myapp/api add @myapp/shared@*
```

### Step 3 — Import it

In `packages/web/src/app/page.tsx`:

```typescript
import { User, formatUsername } from '@myapp/shared';
```

In `packages/api/src/users/users.service.ts`:

```typescript
import { User } from '@myapp/shared';
```

Changes to `packages/shared` are reflected immediately — no build step needed (when using `main: "src/index.ts"` directly).

---

## 8. Versioning and Publishing

For a private project (like this Instagram clone), all packages are `"private": true` and you never publish to npm — skip this section.

For open source or internal npm packages, Yarn has a `@yarnpkg/plugin-version` plugin. Common alternative tools:

- **Changesets** (`@changesets/cli`) — most popular, GitHub-native
- **semantic-release** — fully automated based on commit messages

### Basic Changesets setup

```bash
yarn add -D @changesets/cli
yarn changeset init
```

---

## 9. Plugins and Extensions

Yarn 4 has a plugin system. Install plugins via:

```bash
yarn plugin import <plugin-name>
```

### Useful plugins

| Plugin | Purpose |
|---|---|
| `@yarnpkg/plugin-typescript` | Auto-installs `@types/*` packages |
| `@yarnpkg/plugin-interactive-tools` | Adds `yarn upgrade-interactive` |
| `@yarnpkg/plugin-workspace-tools` | Adds `yarn workspaces foreach` (built-in in v4) |
| `@yarnpkg/plugin-version` | Version management for publishable packages |

### Install the interactive upgrade tool

```bash
yarn plugin import interactive-tools
yarn upgrade-interactive
```

---

## 10. Common Pitfalls

### Pitfall 1 — Forgetting `"private": true` on the root

Without it, running `yarn publish` at the root could accidentally publish the monorepo root as a package.

### Pitfall 2 — Using `npm install` or `npx` inside a workspace

Always use `yarn` commands inside a Yarn workspace. Mixing package managers breaks the lockfile.

### Pitfall 3 — Circular dependencies

`@myapp/web` depending on `@myapp/api` AND `@myapp/api` depending on `@myapp/web` will cause infinite loops. Extract the shared code to `@myapp/shared` instead.

### Pitfall 4 — Scripts not found in `foreach`

`yarn workspaces foreach run build` silently skips packages that don't have a `build` script. Add `--all` and check output carefully.

### Pitfall 5 — TypeScript not resolving local packages

Add `paths` to your root `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@myapp/*": ["packages/*/src"]
    }
  }
}
```

And make each package extend the root config:

```json
{
  "extends": "../../tsconfig.json"
}
```

### Pitfall 6 — PnP compatibility issues

If a tool doesn't work with Yarn PnP, add to `.yarnrc.yml`:

```yaml
nodeLinker: node-modules
```

---

## 11. Cheat Sheet

```bash
# Setup
yarn init -y                                      # init root
yarn install                                      # install all workspaces

# Dependencies
yarn workspace <name> add <pkg>                   # add to specific workspace
yarn workspace <name> add -D <pkg>                # add dev dep to workspace
yarn workspace <name> add @myapp/shared@*         # add local package
yarn add -D <pkg>                                 # add to root

# Running scripts
yarn workspace <name> <script>                    # run in one workspace
yarn workspaces foreach run <script>              # run in all
yarn workspaces foreach --parallel run dev        # run all in parallel
yarn workspaces foreach --topological run build   # run in dep order

# Upgrading
yarn up <pkg>                                     # upgrade in all workspaces
yarn workspace <name> up <pkg>                    # upgrade in one workspace
yarn upgrade-interactive                          # interactive upgrade UI

# Info
yarn workspaces list                              # list all workspaces
yarn workspaces list --json                       # list as JSON
yarn why <pkg>                                    # why is this package installed?
```

---

## References

- Yarn Workspaces docs: https://yarnpkg.com/features/workspaces
- Yarn CLI reference: https://yarnpkg.com/cli
- `.yarnrc.yml` configuration: https://yarnpkg.com/configuration/yarnrc
