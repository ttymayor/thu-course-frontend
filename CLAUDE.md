# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm test         # Run all tests (Vitest watch mode)
pnpm vitest run   # Run tests once
pnpm vitest run __tests__/Page.test.tsx  # Run a single test file
```

## Architecture

THU Course Frontend is a Next.js 16 app (App Router) providing a better UI for Tunghai University course registration info. It is deployed at `https://thc.ttymayor.com`.

**Stack**: React 19, TypeScript, Tailwind CSS v4, MongoDB/Mongoose, NextAuth.js (Google OAuth), SWR, shadcn/ui + Radix UI, Vitest.

**Notable Next.js config** (`next.config.ts`): React Compiler is enabled (`reactCompiler: true`) and `experimental.useCache` is on. These affect how components and data fetching work.

### Data flow

```
API Route (src/app/api/) → Service (src/services/) → Model (src/models/) → MongoDB
```

- **API routes** handle HTTP and return `NextResponse.json()`
- **Services** contain all business logic and DB queries; always call `connectMongoDB()` before querying
- **Models** define Mongoose schemas with the `mongoose.models.X || mongoose.model(...)` pattern (required for Next.js hot reload safety)

### Authentication

NextAuth.js with Google OAuth. Sign-in is **restricted to `@thu.edu.tw` and `@go.thu.edu.tw` email domains** — this check is in `src/app/api/auth/[...nextauth]/route.ts`. The middleware file is named `proxy.ts` (not `middleware.ts`) and protects `/profile/` and `/feedback/` routes.

### Key directories

- `src/app/` — App Router pages and API routes (`api/course-info`, `api/auth`, `api/og`, `api/feedback`, `api/departments`)
- `src/components/` — React components; `ui/` contains shadcn/ui base components
- `src/services/` — DB service functions (`courseService.ts`, `departmentService.ts`, `userService.ts`)
- `src/models/` — Mongoose schemas (`Course.ts`, `Department.ts`, `User.ts`, `Feedback.ts`)
- `src/lib/` — Shared utilities: `mongodb.ts` (connection), `auth.ts` (session helpers), `courseSchedule.ts`, `scheduleConflictChecker.ts`, `courseTimeParser.ts`
- `__tests__/` — Test files with `setup.ts` that globally mocks MongoDB, mongoose, and `getCourseSchedules`

## Environment Variables

```
MONGODB_URI
MONGODB_DB_NAME
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

## Code Conventions

- Use `@/` path alias for all internal imports
- Import order: React → third-party → internal (`@/`)
- Prefer `interface` over `type` for object shapes
- Client components require `"use client"` directive
- Use `cn()` from `@/lib/utils` for Tailwind class merging

## Testing

Tests live in `__tests__/`. The `setup.ts` file mocks MongoDB, mongoose, `react.cache`, and `getCourseSchedules` globally. Add mocks there for shared test dependencies.
