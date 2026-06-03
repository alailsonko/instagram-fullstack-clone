# Shared TypeScript Version in a Yarn Monorepo

## The Problem

When each workspace declares its own `typescript` devDependency, you end up with:

- Different TypeScript versions across packages (version drift)
- TypeScript installed multiple times on disk (wasted space)
- Inconsistent type-checking behavior between packages
- Upgrading TypeScript requires touching every `package.json`

The solution is to declare TypeScript **once at the root** and let Yarn's hoisting make it available to all workspaces.

---

## How Yarn Hoisting Works

When Yarn sees the same package declared in multiple workspaces, it hoists one copy to the root `node_modules/`. All workspaces then resolve to that single copy.

If a workspace declares a **different version** than the root, Yarn installs a separate copy inside that workspace's `node_modules/` — the local version takes precedence for that package only.

This means:

- Root declares `typescript@5.8` → all packages without their own declaration use `5.8`
- A package that still has `typescript@5.7` in its own `package.json` → that package gets `5.7`, ignoring the root

To share one version, you must **remove `typescript` from every workspace** and keep it only at the root.

---

## Step 1 — Add TypeScript to the Root

In the root `package.json`, add TypeScript under `devDependencies`:

```json
{
  "name": "instagram-clone",
  "private": true,
  "workspaces": ["packages/*"],
  "packageManager": "yarn@4.14.1",
  "devDependencies": {
    "typescript": "~5.8.3"
  }
}
```

Use `~` (tilde) to pin the minor version — this allows patch updates but prevents unexpected minor-version bumps across the team.

---

## Step 2 — Remove TypeScript from Each Workspace

Open each `packages/*/package.json` and delete the `typescript` line from `devDependencies`.

**Before** (`packages/api/package.json`):

```json
{
  "devDependencies": {
    "typescript": "^5.7.3",
    "@nestjs/cli": "^11.0.0"
  }
}
```

**After**:

```json
{
  "devDependencies": {
    "@nestjs/cli": "^11.0.0"
  }
}
```

Repeat for every workspace (`web`, `api`, `users`, `auth`, etc.).

---

## Step 3 — Reinstall

After editing the `package.json` files, run install from the root to reconcile the lockfile and re-hoist:

```bash
yarn install
```

Yarn will remove the per-workspace copies of TypeScript and install a single copy at the root.

---

## Step 4 — Verify One Copy Is Used

Check which TypeScript binary each workspace resolves to:

```bash
yarn workspace web exec tsc --version
yarn workspace api exec tsc --version
yarn workspace users exec tsc --version
```

All should print the same version. They all resolve to `node_modules/.bin/tsc` at the root.

You can also confirm there is only one install:

```bash
# Should only show the root copy — no per-package copies
find . -path "*/node_modules/typescript/package.json" -not -path "*/node_modules/*/node_modules/*"
```

---

## Step 5 — Shared `tsconfig.json` (Recommended)

Having one TypeScript version works best when paired with a shared base `tsconfig.json` at the root. Each workspace then extends it, overriding only what differs.

### Root `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

Keep only options that are **truly shared** across every package. Do not put `module`, `target`, or `jsx` here — those differ between the React frontend and the Node.js backend.

### `packages/web/tsconfig.json` (Vite + React)

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "noEmit": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  },
  "include": ["src"]
}
```

### `packages/api/tsconfig.json` (NestJS)

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2021",
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "lib": ["ES2021"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "test"]
}
```

> `experimentalDecorators` and `emitDecoratorMetadata` are required by NestJS. They stay in the NestJS-specific configs, not in the shared base.

### `packages/users/tsconfig.json` and `packages/auth/tsconfig.json`

Same as `packages/api/tsconfig.json` — NestJS services share the same compiler options:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2021",
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "lib": ["ES2021"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "test"]
}
```

---

## Step 6 — Upgrading TypeScript

With a single root declaration, upgrading TypeScript across the entire monorepo is a one-line change:

```json
{
  "devDependencies": {
    "typescript": "~5.9.0"
  }
}
```

Then:

```bash
yarn install
```

Every workspace picks up the new version automatically on the next install.

---

## Pitfalls

### Tools that bundle their own TypeScript

Some tools ship their own TypeScript internally and ignore your project's version:

| Tool | Behavior |
|---|---|
| `ts-jest` | Uses your project's `typescript` for transforms — resolves the hoisted root copy correctly |
| `ts-node` | Uses your project's `typescript` — resolves the hoisted root copy correctly |
| `@nestjs/cli` (SWC mode) | Uses SWC, not TypeScript — unaffected |
| VSCode TypeScript server | Uses the workspace's `typescript` via `typescript.tsdk` setting |

These tools all walk up `node_modules` to find TypeScript, so they will resolve the hoisted root copy without any extra configuration.

### VSCode TypeScript version

By default, VSCode uses its own bundled TypeScript for IntelliSense, which may differ from your project version. Tell it to use the workspace version instead.

Create `.vscode/settings.json` at the root:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

This points every workspace's editor to the same hoisted TypeScript copy.

### `resolutions` field (version conflict override)

If a transitive dependency pulls in a different TypeScript version as a peer dependency, Yarn may install a second copy. You can force one version with the `resolutions` field in the root `package.json`:

```json
{
  "resolutions": {
    "typescript": "~5.8.3"
  }
}
```

This tells Yarn to use `5.8.3` everywhere regardless of what peer dependencies request.

---

## Final Root `package.json`

```json
{
  "name": "instagram-clone",
  "private": true,
  "workspaces": ["packages/*"],
  "packageManager": "yarn@4.14.1",
  "devDependencies": {
    "typescript": "~5.8.3"
  },
  "resolutions": {
    "typescript": "~5.8.3"
  }
}
```

---

## Summary

| Step | Action |
|---|---|
| 1 | Add `typescript` to root `devDependencies` |
| 2 | Remove `typescript` from every workspace `package.json` |
| 3 | Run `yarn install` from the root |
| 4 | Verify with `yarn workspace <name> exec tsc --version` |
| 5 | Create `tsconfig.base.json` at root; each workspace `extends` it |
| 6 | Add `resolutions` field to prevent transitive duplicates |
| 7 | Set `typescript.tsdk` in `.vscode/settings.json` |
