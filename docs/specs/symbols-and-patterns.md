# Feature: symbols and patterns (Insights + Symbols pages)

Both `/journal/insights` and `/journal/symbols` are still `PlaceholderPage`
stubs. Build them from scratch.

## Rule that overrides everything else

The AI **labels**, it never **interprets**. It pulls short labels out of the
dream text. It must never say what something means, never use a dream
dictionary, and never add a spiritual or psychological reading.
Interpretation is a human service handled elsewhere. Code does all counting
and pattern-finding, so every number shown can be checked by hand.

## 1. Extraction (AI)

- Every time an entry is saved and its body changed, call xAI chat
  completions with structured JSON output. Run it with `after()` from
  `next/server` so saving isn't slowed down.
  - Reuse `XAI_API_KEY`.
  - Add a new env var to `lib/env.ts`: `XAI_CHAT_URL`, defaulting to
    `https://api.x.ai/v1/chat/completions`. The current `XAI_API_BASE_URL` is
    the speech-to-text URL.
  - Check the current xAI docs (Context7) for the model name and the
    structured output format. Don't guess them.
- Output: up to 12 items, each
  `{ kind: "person" | "place" | "thing" | "feeling", label: string }`.
  - Labels are short, lowercase, singular, in English: "water",
    "my mother", "a closed door", "fear".
  - Only things the dream actually mentions. No inferred meanings, no
    symbolic categories.
- Prompt rules to include: extract only, no explanation, no interpretation,
  no religious or psychological meaning. If nothing fits, return an empty
  list.

## 2. Storage (follows the existing encryption)

- Add one nullable column, `symbols`, to `dream_entries`. It holds AES-GCM
  ciphertext through the existing entry cipher, with AAD
  `${entryId}:symbols`. Labels are as private as the dream text, so they're
  never stored in plaintext.
- Plaintext shape: `{ v: 1, source: "ai" | "user", items: [{ kind, label }] }`.
- If `source` is `"user"`, the user edited the tags and automatic extraction
  never overwrites them again for that entry.
- Grouping happens in code after decryption, the same way `listEntries`
  already decrypts. Add `symbols` to the select in `listEntriesForUser`. The
  cache only ever holds ciphertext.
- Migration via `pnpm db:generate` / `pnpm db:migrate`.
- Backfill script for existing entries (`scripts/extract-symbols.ts`):
  idempotent, `--dry-run`, prints counts only.

## 3. Entry page (`/journal/[id]`)

- Show the tags under the dream, grouped by kind.
- The user can remove a tag or add one. Either edit sets `source: "user"`.
- Server Action rules as usual: re-check auth, validate with zod, scope by
  `WHERE id AND user_id`, `updateTag("entries:${userId}")`.

## 4. Patterns (code only, no AI)

In `lib/insights.ts`, derived from the decrypted entries:

- **Keeps coming back:** labels found in 3 or more dreams, sorted by count.
  For each: count, first date, last date, and the list of entry ids.
- **Seen together:** pairs of labels that appear together in 2 or more
  dreams. Optional, build it last.
- **Rhythm:** total dreams, this month vs last month. Bucket days in the
  user's local timezone: pass ISO timestamps to a small client component that
  groups them with `Intl`. The server doesn't know the user's timezone.
  Streaks belong to the Calendar page, not here.

## 5. Pages

- **`/journal/insights`:** rhythm numbers, the top 5 "keeps coming back"
  labels, and "seen together" if built. Each item links to the Symbols page.
- **`/journal/symbols`:** every recurring label grouped by kind. Clicking one
  expands in place to show the dreams it appears in (`IntentPrefetchLink` to
  `/journal/[id]`).
  - **Never put a label in the URL.** Labels are dream content, and URLs end
    up in browser history and server logs.
- **Copy rule:** factual sentences only. "Water: 6 dreams, last on Oct 2."
  Never "Water means…".
- **Fixed footer line:** "Dreamnal counts what you wrote. It doesn't say what
  it means."
- **Empty state** (fewer than 3 dreams): "Record a few more dreams to see what
  comes back."
- All UI copy is English.
- Follow the Cache Components rules in `AGENTS.md`: session reads behind
  `<Suspense>`, a skeleton fallback, a `PageFade` wrapper.

## Not in scope

- No dream meanings and no symbol dictionary.
- No Bible verse suggestions from the AI.
- No notifications.
- No translations or i18n.

## Verification

`pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:e2e` (the
instant-nav suite still passes). Manually: save a dream, see its tags
appear, remove one, edit the body, and check the removed tag doesn't come
back.
