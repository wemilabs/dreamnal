# Dreamnal

Dream journal. Record (or type) a dream, xAI Grok speech-to-text transcribes it,
then you edit and save it as a note.

## Commands

- `pnpm dev` — dev server (Turbopack)
- `pnpm build` — production build
- `pnpm lint` — `biome check`
- `pnpm format` — `biome format --write`
- `pnpm typecheck` — `tsc --noEmit`

## Stack

- Next.js 16.3.8 (App Router, `src/`, Turbopack) with `cacheComponents`,
  `typedRoutes`, and `reactCompiler` enabled in `next.config.ts`
- React 19.2.8, TypeScript, Tailwind CSS v4
- shadcn/ui 4.x with **Base UI** primitives (`@base-ui/react`), `base-nova`
  preset, neutral base color, CSS variables; `cn` from the `cn` package
- Biome 2.4.2 for lint + format (no ESLint)
- `next-themes` for light/dark (class attribute, system default)
- Fonts via `next/font/google`: Bodoni Moda (`--font-bodoni` → `font-display`),
  Hanken Grotesk (`--font-hanken` → `font-sans`), Geist Mono
  (`--font-geist-mono` → `font-mono`)

## Backend (planned)

- Neon project `red-bonus-28721700` — Neon Auth (Managed Better Auth) enabled on
  branch `main`
- xAI speech-to-text: `POST https://api.x.ai/v1/stt`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
