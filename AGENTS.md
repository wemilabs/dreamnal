# Dreamnal

Dream journal. Record (or type) a dream, xAI Grok speech-to-text transcribes it,
then you edit and save it as a note.

## Layout

App code lives at the repo root (no `src/`): `app/`, `components/`, `db/`,
`lib/`. Imports use the `@/*` alias (maps to `./*` in `tsconfig.json`).
Biome owns import order (packages first, then `@/`); `.vscode/settings.json`
disables the editor's own organize/sort-imports on save so they don't fight.

## Git workflow

Always work from `dev`. Merge `dev` into `main` only once the change is
approved. Cloud sessions open PRs into `main`, so after they merge, fast-forward
`dev` to `main` and push it so the two stay in sync.

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
  Experimental: `turbopackRustReactCompiler` (Rust compiler, no
  `babel-plugin-react-compiler`), `turbopackGc`, `turbopackLazyDynamicImports`,
  `exposeTestingApiInProductionBuild` (gated on `EXPOSE_TESTING_API=1` at build
  time, used by `pnpm test:e2e`)
- React 19.3.0, TypeScript, Tailwind CSS v4
- shadcn/ui 4.x with **Base UI** primitives (`@base-ui/react`), `base-nova`
  preset, neutral base color, CSS variables; `cn` comes from `@/lib/utils`,
  which wraps the `cn` package with the font-size tokens — ui components must
  import it from there, never directly from `"cn"`
- Biome 2.4.2 for lint + format (no ESLint); `drizzle/` is generated and ignored
- `next-themes` for light/dark (class attribute, system default)
- Type scale: use the named `--text-*` tokens in `app/globals.css` (e.g.
  `text-page-title`, `text-lead`, `text-control`), not arbitrary `text-[Npx]`.
  Register any new token in the `cn` config in `lib/utils.ts` so class merging
  treats it as a font size
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
- Command menu: Ctrl/Cmd+K loads decrypted dreams via the `getSearchEntries`
  action on open and filters client-side (`lib/dream-search.ts`), since
  ciphertext can't be searched in the DB
- Partial Prefetching: default links prefetch the shared App Shell.
  `components/journal/intent-prefetch-link.tsx` upgrades to
  `prefetch={true}` (per-link, resolves URL data + session-cached content) on
  hover/touch/focus. `EntryList` uses it. `/journal/[id]` Suspense fallback is
  `components/journal/entry-detail-skeleton.tsx`
- View transitions (React 19.3 `<ViewTransition>`): `components/journal/page-fade.tsx`
  wraps each journal page (`page-fade` enter/exit); Suspense fallbacks use
  `reveal-out`/`reveal-in`; list titles morph to the entry form via
  `entry-title-${id}` (`share="title-morph"`). Every `<ViewTransition>` uses
  `default="none"`; CSS lives in `app/globals.css` (`vt-*` keyframes)
- `ensureStatic = "navigation"` guards `/` (`app/page.tsx`), `/auth/*`
  (`app/auth/layout.tsx`), and `/offline` (`app/offline/page.tsx`). Nothing
  under `app/journal` exports it, because those routes read the session
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
recordings run at 48 kbps, auto-stop at 9 minutes (~3.2 MB), are rejected
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
- `/journal/insights`, `/journal/symbols` — symbols and patterns (see below)
- `/journal/{favorites,lucid,trash,settings}` — placeholder pages
- `/journal/[id]` — edit + delete (uuid-guarded, `notFound()`)
- `/api/auth/[...path]` — Neon Auth handler

Server Actions live next to their routes (`actions.ts`); `proxy.ts` guards
`/journal/*` and bounces signed-in users off `/` and the auth pages.

## Calendar

- `/journal/calendar` maps `listEntries()` to `CalendarDream` ISO strings in
  `components/journal/calendar/calendar-content.tsx`; `dream-calendar.tsx`
  buckets dates in the browser's local timezone
- The displayed month comes from the `?month=YYYY-MM` URL parameter. Month
  changes use `history.replaceState` so browsing months does not add Back
  entries
- `lib/calendar.ts` contains local day/month keys and streak calculations. The
  current streak ends today when there is an entry today, or yesterday when
  there is not; the longest streak is counted across all recorded days
- Backdated saves set the optional `createdAt` form field in the composer.
  `createEntry` validates the ISO timestamp and rejects values before
  2000-01-01 or more than five minutes in the future

## Symbols and patterns

Spec: `docs/specs/symbols-and-patterns.md`. The AI labels, it never
interprets. Code does all counting.

- `lib/symbols/extract-core.ts` (script-safe, relative imports): xAI chat
  completions (`XAI_CHAT_URL`), `grok-4.3`, strict `json_schema` output, up
  to 12 `{ kind: person|place|thing|feeling, label }`
- `scheduleSymbolRefresh` (`lib/symbols/refresh.ts`) runs in `after()` from
  `createEntry`/`updateEntry` when the body changed and tags aren't
  user-edited. The update is guarded on `body` and `symbols` being unchanged,
  then calls `revalidateTag(…, { expire: 0 })`, because `updateTag` is
  Server-Action-only
- `dream_entries.symbols` holds encrypted JSON
  `{ v: 1, source: "ai"|"user", items }` (AAD field `symbols`). Once
  `source: "user"` (set by `saveSymbols`), extraction never overwrites it
- `lib/insights.ts` is pure (relative imports): `labelStats`,
  `keepsComingBack` (≥3), `recurringLabels` (≥2, Symbols page),
  `seenTogether`. Fewer than 3 dreams → empty state
- UI copy (English) lives in `lib/symbols/copy.ts`; labels stay in the
  dream's language. Never put a label in a URL
  (Symbols uses `<details>`). Local-time dates and month buckets are computed
  in client components (`LocalDay`, `RhythmStats`)
- Backfill / repair: `node --env-file=.env.local scripts/extract-symbols.ts [--dry-run]`.
  It only touches rows where `symbols is null`, which is what a failed
  `after()` extraction leaves behind (there is no in-app retry)
- Scripts run under plain node, which doesn't resolve `@/`. Use relative
  `.ts` imports

## Entry encryption

`dream_entries.title`, `body` and `symbols` hold AES-256-GCM ciphertext. The key per user
comes from HKDF over `ENTRY_ENCRYPTION_KEY` (32 bytes, base64, in `.env.local`
and in Vercel Production + Preview, validated in `lib/env.ts`). AAD is
`${entryId}:${field}`, so ciphertext can't be moved between rows or fields.
Stored format: `v1.<b64url iv>.<b64url ct||tag>`.

- `lib/crypto/entry-cipher.ts` is pure `node:crypto` with no `server-only` and
  no `@/` imports, so scripts can import it
- `lib/crypto/entries.ts` exports `sealEntry` (used by actions) and `openEntry`
  (used by `lib/entries.ts` outside the `"use cache"` functions, so the cache
  only holds ciphertext)
- Values without the `v1.` prefix pass through as legacy plaintext. Every row
  is encrypted now; the one-off `scripts/encrypt-entries.ts` backfill was
  removed (it's in git history if a plaintext dump ever needs restoring)
- Losing `ENTRY_ENCRYPTION_KEY` loses every entry. The DB can't search
  title/body anymore

## Analytics and breadcrumbs

- `<Analytics />` from `@vercel/analytics/next` sits in the root layout inside
  `<Suspense>` because it reads search params
- Top-bar breadcrumbs: client `JournalBreadcrumbs` derives crumbs from
  `usePathname` via `crumbForPathname` in `nav-items.ts`. The entry title comes
  from the `app/journal/@crumb` parallel slot (`[id]/page.tsx` calls `getEntry`)
  and reaches `TopBar` as `entryCrumb`

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
