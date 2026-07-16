# KAIFA Frontend

Frontend web application for **Kaifa**, an AI-based language learning platform.

Built with Next.js App Router, TypeScript, Tailwind CSS 4, and a feature-first architecture.

## Tech Stack

- [Next.js 16.2.7](https://nextjs.org/blog/next-16-2)
- [React 19.2.4](https://react.dev/versions)
- [TypeScript 5](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)
- [Tailwind CSS 4](https://tailwindcss.com/blog/tailwindcss-v4)
- [TanStack React Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)
- [ESLint 9](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) + [Prettier 3](https://prettier.io/blog/2023/07/05/3.0.0.html)
- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)

## Architecture

This project uses the Next.js App Router with route groups for feature boundaries and a feature-first folder structure for business logic.

- `src/app` handles routes, layouts, loading states, API routes, and app-level providers.
- `src/features` contains feature modules split by domain.
- `src/components/ui` contains shared UI primitives.
- `src/lib` contains shared helpers such as the API client and class name utility.
- `src/stores` contains global client state.
- `src/types` contains shared types.
- `src/proxy.ts` protects authenticated routes.

### Project Structure

```text
src/
|-- app/
|   |-- (assessment)/
|   |   |-- assessment/
|   |   |   |-- loading.tsx
|   |   |   `-- page.tsx
|   |   `-- grade/
|   |       |-- loading.tsx
|   |       `-- page.tsx
|   |-- (languages)/
|   |   `-- languages/
|   |       `-- page.tsx
|   |-- (learning)/
|   |   |-- learn/
|   |   |   |-- loading.tsx
|   |   |   `-- page.tsx
|   |   `-- learning-path/
|   |       |-- loading.tsx
|   |       `-- page.tsx
|   |-- (syllabus)/
|   |   |-- modules/
|   |   |   |-- loading.tsx
|   |   |   `-- page.tsx
|   |   `-- syllabi/
|   |       |-- loading.tsx
|   |       `-- page.tsx
|   |-- api/
|   |   `-- ... route handlers
|   |-- globals.css
|   |-- layout.tsx
|   |-- page.tsx
|   `-- providers.tsx
|-- components/
|   `-- ui/
|-- features/
|   |-- auth/
|   |-- assessment/
|   |-- learning/
|   `-- syllabus/
|-- lib/
|-- stores/
|-- types/
`-- proxy.ts
```

### Feature Breakdown

- `auth`
  - login form, auth hooks, auth service, token refresh, and auth store integration
- `assessment`
  - assessment chat, grading flow, and speech helpers
- `learning`
  - learning chat and learning-path logic
- `syllabus`
  - syllabus catalog, translations, and related mock data

## Prerequisites

- [Node.js 24.x](https://nodejs.org/en/blog/release/v24.14.1)
- [pnpm 11.x](https://pnpm.io/blog/releases/11.0)
- [Git](https://git-scm.com/)
- [Docker 27+](https://docs.docker.com/engine/release-notes/27/) if you want to run the production container locally

If you use Corepack, enable pnpm first:

```bash
corepack enable
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

The root route (`/`) shows the login page. Authenticated users are redirected to `/languages`.

## Routing Overview

- Public route: `/`
- Protected routes: `/languages`, `/syllabi`, `/modules`, `/learn`, `/learning-path`, `/assessment`, `/grade`
- API routes live under `src/app/api`

The app uses `src/proxy.ts` to guard protected routes with the `auth-token` cookie.

## Environment Variables

Create a local `.env` file if needed.

| Variable              | Required | Description                             |
| --------------------- | -------- | --------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Yes      | Base URL for backend API requests       |
| `SYLLABUS_API_URL`    | No       | Optional override for syllabus requests |

## Scripts

```bash
pnpm dev           # Start the development server
pnpm build         # Build production assets
pnpm start         # Start the production server
pnpm lint          # Run ESLint
pnpm lint:fix      # Run ESLint and fix issues
pnpm format        # Format files with Prettier
pnpm format:check  # Check formatting without writing
pnpm type-check    # Run TypeScript type checking
pnpm test          # Run Jest
pnpm test:watch    # Run Jest in watch mode
pnpm test:coverage # Run Jest with coverage
```

## Authentication Flow

1. User submits login form.
2. Frontend calls `POST /api/auth/login`.
3. The route handler forwards credentials to `${NEXT_PUBLIC_API_URL}/auth/login`.
4. On success, the app stores `auth-token` and `refresh-token` cookies.
5. `proxy.ts` blocks unauthenticated access to protected routes.
6. Logged-in users visiting `/` are redirected to `/languages`.

## Deployment

Deployment is automated through GitHub Actions.

### How to deploy

1. Merge or push your changes to the `main` branch.
2. GitHub Actions starts the `Deploy Frontend` workflow from `.github/workflows/deploy.yml`.
3. The workflow builds the Docker image from the root `Dockerfile`.
4. The image is pushed to GHCR as `ghcr.io/dev-keuber/kaifa-fe:latest` and also tagged with the commit SHA.
5. The VPS pulls the latest image and runs `docker compose up -d --remove-orphans`.

### Required secrets

- `NEXT_PUBLIC_API_URL`
- `GHCR_PAT`
- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`

### Notes

- The Docker image uses `output: "standalone"` for the production runtime.
- The VPS container is exposed on port `3000`.
- The compose file expects the `latest` image tag from GHCR.

## Quality Checks

Before pushing to `main`, run the same checks used by the project scripts:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

## Git Hooks

- `pre-commit`: runs lint-staged on staged files
- `pre-push`: runs type checking and tests

## Live Preview

- [Demo Version](https://demo.kaifanesia.com/)
