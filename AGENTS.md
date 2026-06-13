# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 16 App Router project for Tunghai University course
registration information. Code lives in `src/`.

- `src/app/` contains pages, layouts, and API routes such as `api/course-info`,
  `api/auth`, `api/departments`, `api/feedback`, and `api/og`.
- `src/components/` contains shared React components; `src/components/ui/`
  holds shadcn/ui and Radix-based primitives.
- `src/services/` contains business logic and database queries.
- `src/models/` contains Mongoose schemas.
- `src/lib/` contains shared utilities, including MongoDB connection, auth
  helpers, course schedule parsing, and conflict checking.
- `src/hooks/`, `src/config/`, and `src/types/` hold hooks, configuration, and
  TypeScript types.

No dedicated test directory is currently present.

## Build, Test, and Development Commands

Use `pnpm` for scripts.

- `pnpm dev` starts the local Next.js development server.
- `pnpm build` creates a production build.
- `pnpm start` serves the production build.
- `pnpm lint` runs OXLint.
- `pnpm lint:fix` applies OXLint fixes.
- `pnpm fmt` formats files with oxfmt.
- `pnpm fmt:check` checks formatting without writing changes.

There is no configured `pnpm test` script at this time.

## Coding Style & Naming Conventions

Write TypeScript and React using 2-space indentation, double quotes, and trailing
commas where supported. Keep imports ordered as React, third-party packages, then
internal `@/` imports. Prefer `interface` for object shapes.

Use the `@/` path alias for internal imports. Client components must include the
`"use client"` directive. Use `cn()` from `@/lib/utils` when composing Tailwind
classes. Mongoose models must use the hot-reload-safe pattern:
`mongoose.models.Name || mongoose.model(...)`.

## API Route Guidelines

API endpoints live under `src/app/api/**/route.ts` or `route.tsx` for generated
images. Keep route handlers thin: parse request input, validate it, call a
service, and return `NextResponse.json()`. Put reusable business logic and all
database queries in `src/services/`; services must call `connectMongoDB()` before
querying Mongoose models.

Follow the existing data flow:
`src/app/api/*` -> `src/services/*Service.ts` -> `src/models/*` -> MongoDB.
For example, `/api/course-info` calls `getCourses()` from
`src/services/courseService.ts`, and user-specific endpoints call helpers in
`src/services/userService.ts`.

Use consistent JSON shapes. Successful responses should include
`{ success: true, data }`; list endpoints may also include metadata such as
`total`. Failed responses should include `{ success: false, message }` or
`{ success: false, error }` with the correct HTTP status. Use `400` for invalid
input, `401` for unauthenticated users, and `500` for unexpected failures.
Log server-side errors with a route-specific message, but do not expose raw
exceptions or secrets in responses.

Validate request data before calling services. For query strings, parse with
`new URL(request.url).searchParams` and normalize defaults, as in
`page` and `page_size` on `/api/course-info`. For JSON bodies, call `req.json()`
once, check required fields and types, then return `400` on invalid input.

Authenticated routes should use `getEmail()` from `@/lib/auth`; return `401`
when it is missing. Mutating routes such as bookmarks and schedules should call
`rateLimit("write")` before performing writes and return the limiter response
when present.

Only add cache headers or `"use cache"` when the data is safe to share and does
not depend on the current user. Public course and department data can be cached;
profile, bookmark, schedule, and feedback writes should not be cached.

## Testing Guidelines

Testing dependencies such as Testing Library and jsdom are installed, but no test
runner or test script is configured. When adding tests, colocate them near the
code they cover or place them in a clearly named test directory, and use
`*.test.ts` or `*.test.tsx` naming. Add a package script so contributors can run
the suite consistently.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit style, for example `fix: improve search
functionality`, `fix(robots): update disallow rule`, and `chore(version): bump
to v2.0.0`. Keep commits small and scoped.

Pull requests should include a summary, verification steps, linked issues when
applicable, and screenshots for visible UI changes. Note any environment
variable or database behavior changes.

## Security & Configuration Tips

Copy required variables from `.env.example` and keep secrets out of git. Required
configuration includes MongoDB, Google OAuth, NextAuth, and public academic year
and semester values. Authentication is restricted to `@thu.edu.tw` and
`@go.thu.edu.tw` email domains in `src/app/api/auth/[...nextauth]/route.ts`.
