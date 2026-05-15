# Property Portal Frontend

## Project Structure

- `app/` - Next.js App Router pages
- `components/` - Shared React components
- Tailwind config in `tailwind.config.ts` defines custom color palettes

## Conventions

### Colors
Use the custom Tailwind color palettes defined in `tailwind.config.ts`:
- **Backgrounds**: `dk-950` (#030711) through `dk-500` (#1c2844)
- **Accents**: `ac-blue` (#3b82f6), `ac-cyan` (#06b6d4), `ac-green` (#10b981), `ac-amber` (#f59e0b), `ac-purple` (#8b5cf6), `ac-rose` (#f43f5e)
- Standard Tailwind colors like `slate-500`, `emerald-400` also available

### Font
- Noto Sans SC loaded via `next/font/google` in `app/layout.tsx`
- Font variable: `--font-noto-sans-sc`

### Layout Components
- `Navbar` - Sticky top navbar with glassmorphism (`bg-dk-950/80 backdrop-blur-xl`)
- `Footer` - Simple footer with border-top
- `Background` - Fixed background with animated orbs, grid pattern, scanline effect
- All layout components render inside `app/layout.tsx` with `relative z-10` over the background

### Error Handling
- `error.tsx` must be a client component (`"use client"`) per Next.js App Router requirements
- `loading.tsx` is a server component showing a spinner

### Environment Variables
- `NEXT_PUBLIC_PYTHON_API_URL` - Python FastAPI backend (browser)
- `NEXT_PUBLIC_JAVA_API_URL` - Java Spring Boot backend (browser)
- `ML_API_URL` - ML model API (server-side only, no NEXT_PUBLIC prefix)

### ESLint
- Config is `eslint.config.mjs` using `@eslint/eslintrc` FlatCompat
- Extends `next/core-web-vitals` and `next/typescript`

### Form Validation
- Use `react-hook-form` + `zod` + `@hookform/resolvers`
- With zod v4, `z.coerce.number()` infers input type as `unknown` — cast the resolver: `resolver: zodResolver(schema) as Resolver<FormData>`
- Import `Resolver` type from `react-hook-form`
- Validation rules must match the Python backend Pydantic models exactly

### API Client Pattern
- Use `AbortController` with a timeout for all fetch calls
- Wrap errors in descriptive messages; handle `AbortError` as timeout
- API types are exported from `lib/api.ts` and shared between client and server

### Toast Notifications
- Simple hook-based system in `hooks/use-toast.ts` with auto-dismiss after 5s
- Toast container is a fixed-position component rendered at page level
- Supports error, success, and info types with color-coded borders
