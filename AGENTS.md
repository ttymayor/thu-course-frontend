# AGENTS.md

This document provides guidelines for agentic coding agents working in the THU Course Frontend repository.

## Development Commands

### Core Commands

- `pnpm dev` - Start development server (Next.js)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint to check code quality

## Project Architecture

### Tech Stack

- **Framework**: Next.js 16.1.2 with App Router
- **UI**: React 19.2.3 with TypeScript
- **Styling**: Tailwind CSS v4.1.18
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **State Management**: React hooks, SWR for data fetching

### Directory Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── course-info/    # Course-related components
│   ├── schedule-simulator/ # Schedule simulation components
│   └── school-map/     # Map components
├── lib/                # Utility functions and configurations
├── models/             # MongoDB schemas
├── services/           # Business logic and data services
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## Code Style Guidelines

### Import Organization

```typescript
// 1. React imports (with type imports when needed)
import * as React from "react";
import { useState, useEffect } from "react";

// 2. Third-party library imports
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// 3. Internal imports (use @/ alias)
import { CalendarEvent } from "@/models/CalendarEvent";
import { CalendarCache } from "@/lib/calendarCache";
import { Button } from "@/components/ui/button";
```

### TypeScript Best Practices

- **Always use strict mode** - enabled in tsconfig.json
- **Prefer interfaces over types** for object shapes
- **Use proper type imports** for type-only imports
- **Define return types** for API routes and utility functions
- **Use generic types** for reusable components

Example:

```typescript
interface CourseFilter {
  course_code?: string;
  course_name?: string;
  page?: number;
  page_size?: number;
}

async function getCourses(
  filter: CourseFilter,
): Promise<{ data: Course[]; total: number }> {
  // implementation
}
```

### Component Patterns

#### Functional Components with TypeScript

```typescript
"use client"; // Required for client-side components

import * as React from "react";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
  onSelect?: (course: Course) => void;
  className?: string;
}

export function CourseCard({ course, onSelect, className }: CourseCardProps) {
  return (
    <div className={cn("p-4 border rounded", className)}>
      {/* component content */}
    </div>
  );
}
```

#### Custom Hooks

```typescript
import { useState, useEffect } from "react";
import { Course } from "@/types/course";

export function useCourses(filter: CourseFilter) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // implementation

  return { courses, loading };
}
```

### API Route Patterns

```typescript
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const param = searchParams.get("param") || "";

    // business logic

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("API Error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message, success: false },
      { status: 500 },
    );
  }
}
```

### Database Patterns

```typescript
import mongoose from "mongoose";
import connectMongoDB from "@/lib/mongodb";

export async function someDatabaseOperation() {
  if (mongoose.connection.readyState !== 1) {
    await connectMongoDB();
  }

  // database operations
}
```

## Naming Conventions

### Files and Directories

- **Components**: PascalCase (e.g., `CourseCard.tsx`)
- **Utilities**: camelCase (e.g., `calendarCache.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCourses.ts`)
- **API Routes**: lowercase with hyphens (e.g., `course-info/route.ts`)
- **Types**: PascalCase interfaces (e.g., `CourseFilter.ts`)

### Variables and Functions

- **Variables**: camelCase (e.g., `courseList`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CACHE_TTL_HOURS`)
- **Functions**: camelCase with descriptive names (e.g., `getCoursesByDepartment`)
- **Components**: PascalCase (e.g., `CourseList`, `FilterModal`)

### TypeScript Interfaces

```typescript
// Descriptive, meaningful names
interface CourseSchedule {
  stage: string;
  status: "open" | "closed" | "upcoming";
  startTime: Date;
  endTime: Date;
}

// Use generic types when appropriate
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

## Error Handling

### API Routes

```typescript
try {
  // operation
} catch (error) {
  console.error("Descriptive error message:", error);
  const message = error instanceof Error ? error.message : "Unknown error";
  return NextResponse.json({ error: message, success: false }, { status: 500 });
}
```

### Client-side Error Handling

```typescript
try {
  await operation();
} catch (error) {
  console.error("Operation failed:", error);
  // Show user-friendly error using toast or UI
  toast.error("Failed to load courses");
}
```

## UI/UX Guidelines

### Component Library

- Use **shadcn/ui** components as base (in `src/components/ui/`)
- Customize with `cn()` utility for Tailwind class merging
- Follow existing design patterns in the app

### Styling

- **Tailwind CSS** for all styling
- Use **CSS variables** for theme colors
- **Responsive design** with Tailwind responsive prefixes
- **Dark mode** support with `next-themes`

### Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation support
- Test with screen readers

## Performance Guidelines

### React Optimization

- Use `React.memo()` for expensive components
- Implement proper dependency arrays in `useEffect`
- Use `useMemo()` and `useCallback()` for expensive computations
- Implement code splitting with `dynamic` imports

### API Optimization

- Implement proper caching strategies
- Use pagination for large datasets
- Add appropriate error boundaries
- Optimize database queries with indexes

## Security Guidelines

- Never commit sensitive data (API keys, secrets)
- Validate all user inputs
- Use HTTPS for all API calls
- Implement proper authentication and authorization
- Sanitize user-generated content

## Git Workflow

### Commit Messages

- Use conventional commits: `feat:`, `fix:`, `refactor:`, etc.
- Be descriptive but concise
- Reference issue numbers when applicable

### Branch Naming

- `feature/description` for new features
- `fix/description` for bug fixes
- `refactor/description` for refactoring

## Environment Configuration

Required environment variables:

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB_NAME` - Database name
- NextAuth.js configuration variables

## Build and Deployment

1. Always run `pnpm lint` before committing
2. Run `pnpm test` to ensure tests pass
3. Use `pnpm build` to verify production build
4. Check for TypeScript errors

## Common Patterns

### Data Fetching with SWR

```typescript
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useCourses() {
  const { data, error, isLoading } = useSWR("/api/courses", fetcher);
  return { courses: data, error, isLoading };
}
```

### Form Handling

- Use React hooks for form state
- Implement proper validation
- Show loading states during submission
- Handle errors gracefully

Remember to always follow existing patterns in the codebase and maintain consistency with the current architecture.
