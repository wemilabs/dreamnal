# instant-nav rig: dreamnal

- BUILD: `pnpm build` + `pnpm exec next start -p 3100` (the package `start`
  script carries `--inspect`, so the rig calls `next` directly)
- EXPOSE: `EXPOSE_TESTING_API=1` in the webServer env; must be set at
  `next build` time — it gates
  `experimental.exposeTestingApiInProductionBuild` in `next.config.ts`
- RUN: `pnpm test:e2e` against `http://localhost:3100` (`baseURL` in
  `playwright.config.ts`, which loads `.env.local` via
  `process.loadEnvFile`)
- TEST USER: `dreamnal-e2e@example.com` (`E2E_EMAIL`/`E2E_PASSWORD` in
  `.env.local`). `e2e/auth.setup.ts` signs in through `/auth/sign-in`
  (falls back to `/auth/sign-up` when the account doesn't exist), saves
  `storageState` to `e2e/.auth/user.json`, and seeds one titled entry
  ("E2E seed dream") through the "or type it instead" composer flow when
  the journal is empty. Plain email+password account, no flags/plan.
- DRIFT: fresh account — no feature flags or roles; data is whatever
  entries the account has; dates render en-GB; theme follows `next-themes`
  system default
- LOOP: `pnpm test:e2e` — `webServer` builds and starts :3100 when free,
  reuses an existing server otherwise. For a toggle/differential: stop the
  server, `EXPOSE_TESTING_API=1 pnpm build`, `pnpm exec next start -p 3100`,
  `pnpm test:e2e`. Agent-drivable end to end.
- LIVENESS: n/a — local `build && start`, the artifact is always fresh
- WALLS: Windows — `next start` may fork a `next-server` child that owns
  the port; free it with `netstat -ano | findstr :3100` then
  `taskkill //PID <pid> //F`. E2E_* env vars must be in `.env.local` or the
  setup project throws.
