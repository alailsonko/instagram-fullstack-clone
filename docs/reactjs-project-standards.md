# Starting a New React.js Project — 2025 Standards

## Table of Contents

1. [Choosing Your Starting Point](#1-choosing-your-starting-point)
2. [React 19 — Key Changes](#2-react-19--key-changes)
3. [Project Scaffolding](#3-project-scaffolding)
4. [TypeScript Setup](#4-typescript-setup)
5. [Styling Standards](#5-styling-standards)
6. [State Management](#6-state-management)
7. [Routing](#7-routing)
8. [Data Fetching](#8-data-fetching)
9. [Testing](#9-testing)
10. [Linting and Formatting](#10-linting-and-formatting)
11. [Project Structure](#11-project-structure)
12. [Cheat Sheet](#12-cheat-sheet)

---

## 1. Choosing Your Starting Point

The React team officially deprecated Create React App (CRA) in 2023. The recommended approach depends on your use case:

| Use Case | Recommended Tool |
|---|---|
| Full-stack app with SSR/SSG | **Next.js 15** (App Router) |
| SPA with client-side routing | **Vite + React Router v7** |
| Full-stack with file-based routing | **React Router v7** (framework mode) |
| Library / component package | **Vite** (library mode) |
| Experimental / bleeding-edge | **TanStack Start** |

### Why not Create React App?

CRA was archived and is no longer maintained. It uses Webpack under the hood, which is significantly slower than modern bundlers like Vite and Turbopack. Starting a new project with CRA in 2025 is not recommended.

---

## 2. React 19 — Key Changes

React 19 (stable since December 2024) introduces several features that change how you write components.

### New hooks

| Hook | Purpose |
|---|---|
| `use(promise)` | Read async resources in render (replaces `useEffect` for data) |
| `useOptimistic` | Optimistic UI updates while an async action is in flight |
| `useFormStatus` | Read the pending state of a parent `<form>` action |
| `useActionState` | Manage form action state (replaces `useFormState`) |

### `ref` as a prop (no more `forwardRef`)

```tsx
// React 19 — ref works as a normal prop
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}

// Old React 18 way (still works but no longer needed)
const Input = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));
```

### `<Context>` as a provider

```tsx
// React 19
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  );
}

// Old React 18 way (still works)
<ThemeContext.Provider value="dark">
```

### Server Components and Server Actions (stable)

When using Next.js 15 App Router, components are Server Components by default. Mark a component as a Client Component with `'use client'` at the top.

```tsx
// app/users/page.tsx — Server Component (no 'use client' needed)
export default async function UsersPage() {
  const users = await fetchUsers(); // runs on the server, no useEffect
  return <UserList users={users} />;
}
```

```tsx
// components/LikeButton.tsx — Client Component
'use client';

import { useState } from 'react';

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>{liked ? 'Liked' : 'Like'}</button>;
}
```

### Document metadata (React 19)

React 19 supports `<title>`, `<meta>`, and `<link>` tags anywhere in the component tree — they are hoisted to `<head>` automatically:

```tsx
export default function ProductPage({ product }) {
  return (
    <>
      <title>{product.name}</title>
      <meta name="description" content={product.description} />
      <h1>{product.name}</h1>
    </>
  );
}
```

---

## 3. Project Scaffolding

### Option A — Next.js 15 (recommended for full-stack)

```bash
npx create-next-app@latest my-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Key flags:
- `--app` — use the App Router (not the legacy Pages Router)
- `--src-dir` — puts code in `src/` instead of root
- `--import-alias "@/*"` — import from `@/components/...` instead of `../../`

### Option B — Vite + React (SPA)

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

Or with Yarn:

```bash
yarn create vite my-app --template react-ts
cd my-app
yarn install
```

### Option C — React Router v7 (framework mode, SSR + file-based routing)

```bash
npx create-react-router@latest my-app
cd my-app
npm install
```

React Router v7 merges Remix and React Router into a single package. Framework mode gives you file-based routing, loaders, actions, and SSR similar to Remix.

---

## 4. TypeScript Setup

TypeScript is the standard for all new React projects in 2025. All three scaffolding options above generate TypeScript by default.

### Recommended `tsconfig.json` for Next.js

Next.js generates this automatically. Key settings to understand:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- `"strict": true` — enables all strict type checks; always use this
- `"moduleResolution": "bundler"` — modern resolution for Vite/Next.js bundlers
- `"noEmit": true` — TypeScript only type-checks; the bundler handles transpilation

### Recommended `tsconfig.json` for Vite

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 5. Styling Standards

### Tailwind CSS v4 (recommended)

Tailwind CSS v4 (released 2025) replaces the `tailwind.config.js` file with a CSS-first configuration approach.

```bash
npm install tailwindcss @tailwindcss/vite
# or for Next.js (included in create-next-app)
```

**Tailwind v4 setup with Vite** — add to `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**Global CSS** — import in `src/index.css`:

```css
@import "tailwindcss";
```

No more `tailwind.config.js` for most use cases — configuration is done in CSS:

```css
@import "tailwindcss";

@theme {
  --color-brand: #e1306c;
  --font-sans: 'Inter', sans-serif;
}
```

### CSS Modules (alternative for component-scoped styles)

```tsx
// Button.module.css
.button {
  background: var(--color-brand);
  border-radius: 8px;
}

// Button.tsx
import styles from './Button.module.css';

export function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

### Choosing between Tailwind and CSS Modules

| | Tailwind CSS | CSS Modules |
|---|---|---|
| Speed of development | Fast | Slower |
| Bundle size | Purged at build (tiny) | Per-component CSS |
| Theming | CSS custom properties | CSS custom properties |
| Co-location | Inline in JSX | Separate `.module.css` file |
| Best for | Most projects | Complex animations, existing design system |

---

## 6. State Management

### Server state vs client state

Distinguish between two types of state before choosing a library:

- **Server state** — data from the server (user profiles, posts, feeds). Use **TanStack Query**.
- **Client state** — UI state (modal open/closed, selected tab, form inputs). Use **Zustand** or `useState`.

### TanStack Query v5 (server state)

```bash
npm install @tanstack/react-query
```

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

```tsx
// components/UserProfile.tsx
import { useQuery } from '@tanstack/react-query';

export function UserProfile({ userId }: { userId: string }) {
  const { data, isPending, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
  });

  if (isPending) return <Skeleton />;
  if (error) return <ErrorMessage />;
  return <div>{data.username}</div>;
}
```

### Zustand (client state)

```bash
npm install zustand
```

```ts
// store/useAuthStore.ts
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

```tsx
// Any component
const user = useAuthStore((state) => state.user);
const setUser = useAuthStore((state) => state.setUser);
```

### When to use Context API

Use `Context` only for static or rarely-changing data (theme, locale, current user). Do not use it for frequently-updating state — it causes full subtree re-renders.

---

## 7. Routing

### Next.js App Router (file-based)

Next.js 15 uses the `app/` directory. Every `page.tsx` file is a route.

```
src/app/
├── layout.tsx          → / (root layout, wraps all routes)
├── page.tsx            → /
├── login/
│   └── page.tsx        → /login
├── (auth)/             → route group (no URL segment)
│   ├── layout.tsx
│   └── dashboard/
│       └── page.tsx    → /dashboard
└── users/
    ├── page.tsx        → /users
    └── [id]/
        └── page.tsx    → /users/:id
```

```tsx
// app/users/[id]/page.tsx
export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  return <UserProfile user={user} />;
}
```

### React Router v7 (Vite SPA)

```bash
npm install react-router
```

```tsx
// main.tsx
import { BrowserRouter, Routes, Route } from 'react-router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="users/:id" element={<UserProfile />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
```

```tsx
// In components
import { Link, useParams, useNavigate } from 'react-router';

const { id } = useParams();
const navigate = useNavigate();
navigate('/login');
```

---

## 8. Data Fetching

### In Next.js (Server Components)

Fetch data directly in async Server Components — no `useEffect`, no loading state boilerplate:

```tsx
// app/feed/page.tsx
export default async function FeedPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } });
  return <PostFeed posts={posts} />;
}
```

For mutations, use Server Actions:

```tsx
// app/posts/actions.ts
'use server';

export async function createPost(formData: FormData) {
  const content = formData.get('content') as string;
  await db.post.create({ data: { content, authorId: getSession().userId } });
  revalidatePath('/feed');
}
```

```tsx
// components/CreatePostForm.tsx
'use client';
import { createPost } from '../actions';

export function CreatePostForm() {
  return (
    <form action={createPost}>
      <textarea name="content" />
      <button type="submit">Post</button>
    </form>
  );
}
```

### In a Vite SPA (TanStack Query)

See the TanStack Query example in [State Management](#6-state-management). Use `useMutation` for writes:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function CreatePostForm() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (content: string) =>
      fetch('/api/posts', { method: 'POST', body: JSON.stringify({ content }) }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutation.mutate(new FormData(e.currentTarget).get('content') as string);
    }}>
      <textarea name="content" />
      <button type="submit" disabled={mutation.isPending}>Post</button>
    </form>
  );
}
```

---

## 9. Testing

### Vitest (unit + component tests)

Vitest is the standard test runner for Vite projects and is also used with Next.js. It is faster than Jest and has the same API.

```bash
npm install -D vitest @testing-library/react @testing-library/user-event @vitejs/plugin-react jsdom
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

`src/test/setup.ts`:

```ts
import '@testing-library/jest-dom';
```

Example test:

```tsx
// components/LikeButton.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LikeButton } from './LikeButton';

test('toggles like on click', async () => {
  const user = userEvent.setup();
  render(<LikeButton />);

  expect(screen.getByRole('button')).toHaveTextContent('Like');
  await user.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('Liked');
});
```

### Playwright (end-to-end tests)

```bash
npm install -D @playwright/test
npx playwright install
```

`playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

Example E2E test:

```ts
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=password]', 'password');
  await page.click('[type=submit]');
  await expect(page).toHaveURL('/feed');
});
```

---

## 10. Linting and Formatting

### ESLint v9 (flat config)

ESLint v9 replaces `.eslintrc.*` with a single `eslint.config.js` (flat config). Next.js and Vite scaffolds generate this automatically.

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks
```

`eslint.config.js`:

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  }
);
```

### Prettier

```bash
npm install -D prettier eslint-config-prettier
```

`.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Biome (alternative all-in-one tool)

Biome replaces both ESLint and Prettier with a single, significantly faster tool (written in Rust).

```bash
npm install -D @biomejs/biome
npx biome init
```

`biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

Add to `package.json`:

```json
{
  "scripts": {
    "lint": "biome lint ./src",
    "format": "biome format --write ./src",
    "check": "biome check --write ./src"
  }
}
```

---

## 11. Project Structure

### Next.js App Router

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   ├── feed/
│   │   │   └── page.tsx
│   │   └── users/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── api/
│   │   └── [...route]/
│   │       └── route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/              ← generic reusable components (Button, Input, Modal)
│   └── features/        ← feature-specific components (PostCard, UserAvatar)
├── hooks/               ← custom hooks
├── lib/                 ← utilities, helpers, API clients
├── store/               ← Zustand stores
└── types/               ← shared TypeScript types
```

### Vite SPA

```
src/
├── assets/
├── components/
│   ├── ui/
│   └── features/
├── hooks/
├── lib/
├── pages/               ← one file per route
│   ├── Feed.tsx
│   ├── Login.tsx
│   └── UserProfile.tsx
├── routes/              ← route definitions
│   └── index.tsx
├── store/
├── types/
├── App.tsx
├── main.tsx
└── index.css
```

### Naming conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserAvatar.tsx` |
| Hooks | camelCase, `use` prefix | `useCurrentUser.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types/Interfaces | PascalCase | `User`, `PostWithAuthor` |
| CSS Modules | PascalCase `.module.css` | `UserAvatar.module.css` |
| Constants | UPPER_SNAKE or camelCase | `MAX_FILE_SIZE` |

---

## 12. Cheat Sheet

### Scaffold

```bash
# Next.js 15 (full-stack, SSR)
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir

# Vite (SPA)
npm create vite@latest my-app -- --template react-ts

# React Router v7 (framework mode, SSR)
npx create-react-router@latest my-app
```

### Core dependencies

```bash
# Server state
npm install @tanstack/react-query

# Client state
npm install zustand

# Routing (Vite SPA)
npm install react-router

# Forms
npm install react-hook-form zod @hookform/resolvers

# Icons
npm install lucide-react
```

### Dev dependencies

```bash
# Testing
npm install -D vitest @testing-library/react @testing-library/user-event jsdom @playwright/test

# Linting + formatting
npm install -D eslint typescript-eslint prettier eslint-config-prettier
# OR (all-in-one)
npm install -D @biomejs/biome
```

### Key scripts in `package.json`

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint ./src",
    "format": "prettier --write ./src"
  }
}
```

---

## References

- React 19 release notes: https://react.dev/blog/2024/12/05/react-19
- React official docs: https://react.dev
- Next.js 15 docs: https://nextjs.org/docs
- Vite docs: https://vitejs.dev/guide
- React Router v7 docs: https://reactrouter.com/dev/guides
- TanStack Query docs: https://tanstack.com/query/latest
- Zustand docs: https://zustand.docs.pmnd.rs
- Tailwind CSS v4 docs: https://tailwindcss.com/docs/installation
- Vitest docs: https://vitest.dev/guide
- Playwright docs: https://playwright.dev/docs/intro
- Biome docs: https://biomejs.dev/guides/getting-started
