# Corepack — Complete Guide

## Table of Contents

1. [What is Corepack?](#1-what-is-corepack)
2. [How Corepack Works](#2-how-corepack-works)
3. [Enabling Corepack](#3-enabling-corepack)
4. [Managing Package Manager Versions](#4-managing-package-manager-versions)
5. [Pinning a Version Per Project](#5-pinning-a-version-per-project)
6. [Corepack with Yarn](#6-corepack-with-yarn)
7. [Corepack with pnpm](#7-corepack-with-pnpm)
8. [Corepack in CI/CD](#8-corepack-in-cicd)
9. [Common Commands](#9-common-commands)
10. [Common Pitfalls](#10-common-pitfalls)
11. [Cheat Sheet](#11-cheat-sheet)

---

## 1. What is Corepack?

**Corepack** is a tool that ships bundled with Node.js (since v16.9.0) that manages the version of your package manager (Yarn, pnpm) per project.

Before Corepack, you had to manually install Yarn or pnpm globally:

```bash
npm install -g yarn      # old way
npm install -g pnpm      # old way
```

The problem: everyone on the team could be running different versions of Yarn, causing subtle bugs and inconsistent installs.

Corepack solves this by:

- Reading the `"packageManager"` field in your `package.json`
- Automatically downloading and using the exact version declared there
- Blocking the wrong package manager from running (e.g. running `npm install` in a Yarn project)

### Supported package managers

| Package Manager | Supported |
|---|---|
| Yarn (classic 1.x) | Yes |
| Yarn (Berry 2/3/4) | Yes |
| pnpm | Yes |
| npm | No (npm manages itself) |

---

## 2. How Corepack Works

When you run `yarn install` in a project that has Corepack configured:

1. Corepack intercepts the command
2. It reads `"packageManager"` from `package.json` (e.g. `"yarn@4.16.0"`)
3. If that version isn't cached locally, it downloads it
4. It runs the command using exactly that version

```
you type: yarn install
              ↓
         Corepack intercepts
              ↓
    reads package.json → "yarn@4.16.0"
              ↓
    downloads yarn@4.16.0 if not cached
              ↓
    runs yarn@4.16.0 install
```

The downloaded binaries are cached in your home directory (`~/.node/corepack` or similar), so they are only downloaded once per version.

---

## 3. Enabling Corepack

Corepack ships with Node.js but is **disabled by default**. You must opt in:

```bash
corepack enable
```

This creates shims (thin wrapper scripts) for `yarn` and `pnpm` in your Node.js `bin` directory, so when you type `yarn`, it actually goes through Corepack.

### Verify it is enabled

```bash
which yarn    # should point to a corepack shim, not a global yarn
yarn --version
```

### Disable Corepack

```bash
corepack disable
```

This removes the shims and restores the previous global behavior.

---

## 4. Managing Package Manager Versions

### Install (prepare) a specific version

```bash
corepack prepare yarn@4.16.0 --activate
```

- `prepare` — downloads and caches the specified version
- `--activate` — makes it the global default when no `package.json` pin is present

### Install the latest stable version

```bash
corepack prepare yarn@stable --activate
corepack prepare pnpm@latest --activate
```

### List what Corepack has cached

Corepack does not have a built-in `list` command, but cached versions live here:

- **Windows:** `%LOCALAPPDATA%\node\corepack`
- **macOS/Linux:** `~/.cache/node/corepack`

---

## 5. Pinning a Version Per Project

This is the most important feature of Corepack. You declare which package manager and version a project requires, and Corepack enforces it for everyone.

### Pin via `package.json`

Add a `"packageManager"` field:

```json
{
  "name": "my-project",
  "packageManager": "yarn@4.16.0"
}
```

The format is always `<name>@<version>` — no range syntax, always an exact version.

### Pin via the `corepack use` command (recommended)

Instead of editing `package.json` manually, let Corepack do it:

```bash
corepack use yarn@stable
```

This:
1. Resolves `stable` to the actual latest stable version (e.g. `4.16.0`)
2. Writes `"packageManager": "yarn@4.16.0"` into your `package.json` automatically
3. Downloads and caches that version

### What happens when the version doesn't match

If someone on your team runs `yarn@1.22` in a project pinned to `yarn@4.16.0`, Corepack will:

1. Detect the mismatch
2. Refuse to run
3. Print an error explaining which version is required

This prevents "works on my machine" problems caused by different Yarn versions.

---

## 6. Corepack with Yarn

### Full setup from scratch

```bash
# 1. Enable Corepack
corepack enable

# 2. In your project folder, pin Yarn 4
corepack use yarn@stable

# 3. Initialize the project (if new)
yarn init -y

# 4. Install dependencies
yarn install
```

Your `package.json` will now contain:

```json
{
  "packageManager": "yarn@4.16.0"
}
```

And `.yarnrc.yml` will be created by Yarn 4 automatically.

### Switching from Yarn 1 to Yarn 4

```bash
# In your existing project:
corepack use yarn@stable
yarn install
```

Yarn 4 will migrate your project — it may create `.yarnrc.yml` and adjust some config.

### Yarn version inside `.yarnrc.yml`

Yarn 4 also stores its binary inside the project at `.yarn/releases/`. The `.yarnrc.yml` points to it:

```yaml
yarnPath: .yarn/releases/yarn-4.16.0.cjs
```

When `yarnPath` is set, Yarn uses that local binary rather than the global one — even without Corepack. Both mechanisms can coexist; `yarnPath` takes precedence.

---

## 7. Corepack with pnpm

Corepack works the same way with pnpm:

```bash
corepack use pnpm@latest
pnpm install
```

`package.json` will contain:

```json
{
  "packageManager": "pnpm@10.11.0"
}
```

---

## 8. Corepack in CI/CD

In CI environments (GitHub Actions, etc.), Corepack must be enabled before running package manager commands.

### GitHub Actions example

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        run: yarn install --immutable

      - name: Build
        run: yarn build
```

The `--immutable` flag on `yarn install` makes the install fail if `yarn.lock` would be modified — important in CI to catch accidental lockfile drift.

### Why not just `npm install -g yarn` in CI?

- It installs the latest Yarn 1.x, not Yarn 4
- It ignores the version pinned in your `package.json`
- Different CI runs could use different versions if the latest changes

Corepack always uses the exact version from `package.json`, making CI deterministic.

---

## 9. Common Commands

### Enable / disable

```bash
corepack enable               # enable Corepack (create shims)
corepack disable              # disable Corepack (remove shims)
corepack enable yarn          # enable only for yarn
corepack enable pnpm          # enable only for pnpm
```

### Prepare (download and cache) a version

```bash
corepack prepare yarn@4.16.0            # download and cache
corepack prepare yarn@4.16.0 --activate # download, cache, set as global default
corepack prepare yarn@stable --activate # resolve stable tag first
```

### Pin a version to the current project

```bash
corepack use yarn@stable      # pin latest stable yarn to this project
corepack use yarn@4.16.0      # pin exact version
corepack use pnpm@latest      # pin latest pnpm
```

### Check the version being used

```bash
yarn --version    # shows the version Corepack is routing to
pnpm --version
```

---

## 10. Common Pitfalls

### Pitfall 1 — Corepack is not enabled

Running `yarn` after installing Node.js but before running `corepack enable` uses the old global Yarn (if installed) or errors. Always run `corepack enable` first.

### Pitfall 2 — `packageManager` field is missing

Without `"packageManager"` in `package.json`, Corepack falls back to a built-in default (usually an older Yarn version). Always set it explicitly with `corepack use yarn@stable`.

### Pitfall 3 — Committing the wrong `.yarn/releases/` binary

When using Yarn with `yarnPath`, the Yarn binary at `.yarn/releases/yarn-x.x.x.cjs` should be committed to Git. This ensures everyone uses the same binary even without Corepack. Add this to `.gitignore` only if you rely solely on Corepack:

```
# Do NOT ignore this if you use yarnPath:
# .yarn/releases/
```

### Pitfall 4 — Mixing package managers

If your project is pinned to Yarn, running `npm install` or `pnpm install` will either fail (if Corepack is configured to block it) or create a second lockfile (`package-lock.json` or `pnpm-lock.yaml`). Never mix package managers in one project.

### Pitfall 5 — Corporate proxies / offline environments

Corepack downloads package manager binaries from the internet on first use. In restricted environments:

```bash
# Pre-download and pack the binary for offline use:
corepack pack yarn@4.16.0 --output ./yarn-4.16.0.tgz

# On the offline machine:
corepack install --global ./yarn-4.16.0.tgz
```

---

## 11. Cheat Sheet

```bash
# One-time setup (per machine)
corepack enable                            # enable Corepack shims

# Per project
corepack use yarn@stable                   # pin latest yarn to project
corepack use yarn@4.16.0                   # pin exact version to project

# Download without pinning
corepack prepare yarn@stable --activate    # set global fallback version

# CI
corepack enable                            # must run before yarn/pnpm in CI
yarn install --immutable                   # deterministic install in CI

# Verify
yarn --version                             # check which version is active
```

---

## Summary

| Concern | Solution |
|---|---|
| Same version for all devs | `"packageManager"` in `package.json` |
| Bootstrapping the version | `corepack enable` + `corepack use yarn@stable` |
| Deterministic CI builds | `corepack enable` + `yarn install --immutable` |
| Upgrading the package manager | `corepack use yarn@stable` (updates `package.json`) |
| Offline environments | `corepack pack` + `corepack install --global` |

---

## References

- Corepack docs: https://nodejs.org/api/corepack.html
- Corepack GitHub: https://github.com/nodejs/corepack
- Yarn + Corepack: https://yarnpkg.com/corepack
