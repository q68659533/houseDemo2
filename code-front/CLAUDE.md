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
- All API calls go through `apiFetch<T>(url, init?, options?)` in `lib/api.ts`
- Built-in 10s timeout (`AbortController`) and 1 retry on HTTP 5xx
- Errors are normalized to `ApiError` instances with `kind` (`"http" | "network" | "timeout"`) and optional `status`
- New endpoint wrappers should always go through `apiFetch`, not raw `fetch`
- API types are exported from `lib/api.ts` and shared between client and server

### Data Fetching Hooks (`hooks/use-api.ts`, etc.)
- `useApi(fn, options?)` — generic hook returning `{ data, loading, error, execute, reset }`
- `useEstimate()` — wraps `estimatePrice` for the estimator page
- `useMarketData(options?)` — wraps `fetchMarketData`, auto-fetches on mount; exposes `properties`, `stats`, `refetch`
- All hooks auto-show an error toast via the global `ToastProvider` (disable with `toastOnError: false`)
- `execute` returns the data on success or `null` on error — no exception escapes the hook

### Toast Notifications
- Global context provider in `components/ui/toast-provider.tsx` — already mounted in `app/layout.tsx`
- Import `useToast` from `hooks/use-toast` anywhere in the tree — no need to render `<ToastContainer>` at the page level
- Throws if used outside `<ToastProvider>`
- Auto-dismiss after 5s; supports `error` / `success` / `info` types with color-coded borders
