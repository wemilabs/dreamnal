# Dreamnal

Dream journal. Record (or type) a dream, xAI Grok speech-to-text transcribes it,
then you edit and save it as a note.

## Layout

App code lives at the repo root (no `src/`): `app/`, `components/`, `db/`,
`lib/`. Imports use the `@/*` alias (maps to `./*` in `tsconfig.json`).
Biome owns import order (packages first, then `@/`); `.vscode/settings.json`
disables the editor's own organize/sort-imports on save so they don't fight.

## Commands

- `pnpm dev` — dev server (Turbopack)
- `pnpm build` — production build
- `pnpm lint` — `biome check`
- `pnpm format` — `biome format --write`
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test:e2e` — Playwright instant-navigation suite (builds + serves :3100;
  needs `E2E_EMAIL`/`E2E_PASSWORD` in `.env.local`; rig notes in
  `e2e/instant-nav.rig.md`)
- `pnpm db:generate` — `drizzle-kit generate` (emit SQL migration to `drizzle/`)
- `pnpm db:migrate` — `drizzle-kit migrate` (apply migrations)
- `pnpm db:studio` — `drizzle-kit studio`

## Stack

- Next.js 16.4.0 (App Router, Turbopack) with `cacheComponents`, `typedRoutes`,
  `partialPrefetching`, and `reactCompiler` enabled in `next.config.ts`.
  Experimental: `turbopackRustReactCompiler` (Rust compiler — no
  `babel-plugin-react-compiler`), `turbopackGc`, `turbopackLazyDynamicImports`,
  `exposeTestingApiInProductionBuild` (gated on `EXPOSE_TESTING_API=1` at build
  time, used by `pnpm test:e2e`)
- React 19.3.0, TypeScript, Tailwind CSS v4
- shadcn/ui 4.x with **Base UI** primitives (`@base-ui/react`), `base-nova`
  preset, neutral base color, CSS variables; `cn` from the `cn` package
- Biome 2.4.2 for lint + format (no ESLint); `drizzle/` is generated and ignored
- `next-themes` for light/dark (class attribute, system default)
- Fonts via `next/font/google`: Bodoni Moda (`--font-bodoni` → `font-display`),
  Hanken Grotesk (`--font-hanken` → `font-sans`), Geist Mono
  (`--font-geist-mono` → `font-mono`)
- Drizzle ORM 0.45 + `@neondatabase/serverless` (neon-http driver); single
  **direct** `DATABASE_URL`; `db/schema.ts` defines `dream_entries` +
  `entry_source` enum, `db/neon-auth.ts` is a reference-only stub for
  `neon_auth."user"` (managed by Neon Auth, not migrated)
- `lib/env.ts` — zod-validated env (`import "server-only"`); `drizzle.config.ts`
  loads `.env.local` itself via `process.loadEnvFile`

## Backend

- Neon project `red-bonus-28721700` — Neon Auth (Managed Better Auth) enabled on
  branch `main`; auth tables live in the `neon_auth` schema
- xAI speech-to-text: `POST https://api.x.ai/v1/stt` (`XAI_API_BASE_URL`)

## Auth wiring (`@neondatabase/auth`)

- `lib/auth/server.ts` — `auth = createNeonAuth({ baseUrl, cookies: { secret } })`
  from `@neondatabase/auth/next/server`
- `app/api/auth/[...path]/route.ts` — `auth.handler()` exports
  `GET POST PUT DELETE PATCH`
- `lib/auth/client.ts` — `"use client"`, `authClient = createAuthClient()` from
  `@neondatabase/auth/next`; Google goes through `authClient.signIn.social`
- `proxy.ts` (Next 16 middleware) — `auth.middleware({ loginUrl: "/auth/sign-in" })`
  guards `/journal/*`. GETs on `/`, `/auth/sign-in`, `/auth/sign-up` probe the
  same middleware against `/journal` (the SDK skips session checks on auth
  pages) and 307 signed-in users to `/journal`; POSTs (Server Actions) skip
  the probe
- Google sign-in must pass `newUserCallbackURL` too: Neon sends first-time
  OAuth users there (default `/`) with the session verifier
- Session: `const { data: session } = await auth.getSession()` — the user is at
  `session?.user`, never a top-level `user`
- Server actions use `auth.signUp.email`, `auth.signIn.email`, `auth.signOut`;
  each returns `{ data, error }`

## Cache Components / DAL

- `lib/auth/session.ts` — `getCurrentUser` (`"use cache: private"`, redirects to
  `/auth/sign-in` when logged out). The private scope is what puts
  session-derived UI into the per-session App Shell; without it the read is
  request-time-only and everything behind its `<Suspense>` boundary is deferred
  to the navigation stage. Session reads must still sit behind `<Suspense>`;
  never await the session at a layout's top level
- `lib/entries.ts` — exported functions resolve the user via `getCurrentUser`,
  then call unexported `"use cache"` functions keyed by userId with
  `cacheTag("entries:${userId}")` + `cacheLife("minutes")`. Every query filters
  on `userId`; mutations `updateTag` the same key and re-check the session.
  `listEntriesForUser` returns ciphertext; `listEntries` decrypts outside the
  cache and derives a 280-char `excerpt` (`Array.from`, surrogate-safe)
- Partial Prefetching: default links prefetch the shared App Shell.
  `components/journal/intent-prefetch-link.tsx` upgrades to
  `prefetch={true}` (per-link, resolves URL data + session-cached content) on
  hover/touch/focus — used by `EntryList`. `/journal/[id]` Suspense fallback is
  `components/journal/entry-detail-skeleton.tsx`
- `ensureStatic = "navigation"` guards `/` (`app/page.tsx`), `/auth/*`
  (`app/auth/layout.tsx`), and `/offline` (`app/offline/page.tsx`). Nothing
  under `app/journal` exports it — those routes read the session
- e2e: `playwright.config.ts` builds with `EXPOSE_TESTING_API=1` and serves
  :3100; `e2e/auth.setup.ts` signs in as `E2E_EMAIL`/`E2E_PASSWORD` (sign-up
  fallback), stores `e2e/.auth/user.json`, seeds one titled entry via the
  composer when the journal is empty. Tests use `instant()` from
  `@next/playwright` to assert what's visible while dynamic data is locked
- Server Actions re-validate auth + input (zod) on every call; ids are
  uuid-validated and updates/deletes are scoped `WHERE id AND user_id`

## Recorder format decision

Verified against `POST /v1/stt` with real browser recordings
(`MediaStreamAudioDestination` → `MediaRecorder`):

| MIME | Chrome MediaRecorder | xAI |
| --- | --- | --- |
| `audio/webm;codecs=opus` | ✓ | 200, correct transcript |
| `audio/ogg;codecs=opus` | not supported | — |
| `audio/mp4;codecs=mp4a.40.2` | ✓ | 200, correct transcript |
| `audio/mp4` | ✓ | 200, correct transcript |
| `audio/wav` (synth test) | n/a | 200, correct transcript |

`components/journal/recorder-mime.ts` keeps the preference list plus
`MAX_AUDIO_BYTES` (4 MB); Chrome picks webm/opus. xAI wants `file` as the
**last** multipart field; don't send `language`/`format`.

Start/stop tones are generated in `components/journal/recorder-cues.ts` (two
sine notes on the recorder's AudioContext, no audio files). The start cue
finishes before `MediaRecorder.start` so it isn't recorded. The stop cue
plays after the mic tracks stop, and the context closes once it ends.

Haptics use `web-haptics` (`useWebHaptics` in `composer-provider.tsx`). It
must fire from the composer's synchronous tap handlers because iOS only
vibrates inside a user gesture.

Deployment constraint: Vercel Functions cap request bodies at 4.5 MB, so
recordings run at 48 kbps, auto-stop at 8 minutes (~2.9 MB), are rejected
client-side above `MAX_AUDIO_BYTES`, and re-checked at 4 MB in the
`transcribeRecording` action. `next.config.ts` sets `serverActions` /
`proxyClientMaxBodySize` to `4.5mb` to match.

## PWA

- `app/manifest.ts` — `id: "/journal"` (don't change it; installs are keyed
  on it), screenshots in `public/screenshots/` (390×844 narrow, 1280×800 wide)
- `public/sw.js` — hand-written service worker. Navigations: network
  (navigation preload) with cached `/offline` fallback, never cached.
  `/_next/static/*` cache-first; icons/brand/screenshots stale-while-revalidate.
  Never cache authenticated HTML, RSC payloads, Server Actions, or `/api/*`.
  Bump `VERSION` whenever SW logic changes (purges old caches). Install uses
  sequential `cache.add` because `cache.addAll` hung during testing
- `components/pwa/pwa-registrar.tsx` registers `/sw.js` in production only;
  test the SW with `pnpm build && pnpm start`
- `lib/pwa/install-prompt.ts` — `beforeinstallprompt` store (attached from
  first paint via the registrar); `InstallAppButton` sits in the sidebar and
  shows Add-to-Home-Screen steps on iOS, with an Android fallback steps
  dialog when `beforeinstallprompt` never fires. An `installed` flag set
  from `appinstalled` keeps the button hidden after a browser-menu install
- `app/offline/page.tsx` — static, outside the `proxy.ts` matcher
- `next.config.ts` sets security headers globally and no-cache + CSP on `/sw.js`

## Routes

- `/` — static landing
- `/auth/sign-in`, `/auth/sign-up` — static pages, client forms
- `/journal` — list + empty state (Suspense)
- `/journal/*` — dashboard shell: sidebar + inset content; "Record a dream"
  opens a composer overlay (Drawer on mobile, Dialog on desktop) instead of
  navigating; recording → transcribing → editing → save
- `/journal/{calendar,insights,symbols,favorites,lucid,trash,settings}` —
  placeholder pages
- `/journal/[id]` — edit + delete (uuid-guarded, `notFound()`)
- `/api/auth/[...path]` — Neon Auth handler

Server Actions live next to their routes (`actions.ts`); `proxy.ts` guards
`/journal/*` and bounces signed-in users off `/` and the auth pages.

## Entry encryption

`dream_entries.title`/`body` hold AES-256-GCM ciphertext at rest.
`lib/crypto/entry-cipher.ts` is a pure `node:crypto` module (no `server-only`,
no `@/` imports — scripts import it directly). Per-user key via HKDF from
`ENTRY_ENCRYPTION_KEY` (32-byte base64, in `.env.local`, validated in
`lib/env.ts`); AAD `${entryId}:${field}` binds ciphertext to row+field; stored
as `v1.<b64url iv>.<b64url ct||tag>`. `lib/crypto/entries.ts` (`sealEntry` /
`openEntry`) does the encrypt/decrypt — writes seal in actions, reads open
outside the `"use cache"` functions so the cache stores ciphertext only.
Legacy plaintext decrypts as passthrough until the backfill runs. Losing
`ENTRY_ENCRYPTION_KEY` loses every entry; DB-side search over title/body is
no longer possible. Backfill: `node --env-file=.env.local
scripts/encrypt-entries.ts [--dry-run]` (idempotent, optimistic guard on
`body`, prints counts only).

## Misc

- `@vercel/analytics` renders `<Analytics />` in the root layout inside
  `<Suspense>` — it reads search params, which `ensureStatic` routes reject
  without a boundary.
- Top-bar breadcrumbs: `@crumb` parallel route slot under `app/journal/`
  feeds the entry title (`@crumb/[id]/page.tsx` → `getEntry` →
  `title ?? titleFallback(body)`) into `TopBar`'s `entryCrumb`; the client
  `JournalBreadcrumbs` derives the rest from `usePathname` via
  `crumbForPathname` in `nav-items.ts`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
