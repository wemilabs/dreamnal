# Feature: meaning and fulfillment

The user writes what they think a dream means and how sure they are. Later,
if it comes true, they mark it fulfilled and record when it happened and,
optionally, what happened.

We built a first version on Oct 7, 2026, with a "Suggest with Grok" button
that drafted the meaning, and reverted it. This version keeps the meaning,
the confidence levels and the fulfillment, and drops the AI.

## Rule that overrides everything else

The user always writes the meaning. The app never drafts, suggests,
completes or rewrites one, and no AI call touches this feature. This
matches `symbols-and-patterns.md`, where the app never interprets and
interpretation stays with the person.

The app also never claims a dream came true, never predicts anything, and
never calls a dream prophetic. Copy stays factual. "Fulfilled on
6 Oct 2026" is fine, "Your dream was a sign" is not.

## Flow

1. The user writes a meaning and picks a confidence level.
2. Once a meaning is saved, the user can mark the dream fulfilled. That
   records the date and an optional note, and sets confidence to Certain.
3. Undoing the fulfillment clears the date and note. The meaning and
   confidence stay, so confidence remains Certain until the user changes it.
4. Saving the meaning empty clears everything: meaning, confidence, date
   and note.

## Confidence levels

Five named steps, each stored as a percentage. They live in
`lib/meaning.ts` (no `server-only`, the client uses them too):

```ts
export const CONFIDENCE_LEVELS = [
  { value: 10, label: "Unsure" },
  { value: 30, label: "Hunch" },
  { value: 50, label: "Possible" },
  { value: 75, label: "Likely" },
  { value: 100, label: "Certain" },
] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number]["value"];
```

Also in that file: `confidenceLabel(value)`, and
`MEANING_FILTERS = ["all", "interpreted", "fulfilled"] as const` with
`parseMeaningFilter(value)` (anything invalid becomes `"all"`).

- **Interpreted:** a meaning exists and the dream isn't fulfilled.
- **Fulfilled:** `fulfilled_on` is set.

## 1. Storage

Four nullable columns on `dream_entries`, via `pnpm db:generate` /
`pnpm db:migrate`. The next migration is `0002_*` (`0001` is `symbols`). The
generated SQL must only `ADD COLUMN`.

| Column | Drizzle | Notes |
| --- | --- | --- |
| `meaning` | `text("meaning")` | Encrypted, AAD `${entryId}:meaning`, max 4000 chars |
| `meaning_confidence` | `smallint("meaning_confidence")` | One of 10/30/50/75/100. Plaintext so filters and Insights can count it |
| `fulfilled_on` | `date("fulfilled_on", { mode: "string" })` | `YYYY-MM-DD`. Plaintext. Non-null means fulfilled |
| `fulfillment_note` | `text("fulfillment_note")` | Encrypted, AAD `${entryId}:fulfillment`, max 2000 chars, optional |

- There's no separate `confirmed_at`. The first version had one, but
  `fulfilled_on` is always set when marking, so it's enough as the flag.
- `lib/crypto/entry-cipher.ts`: `EntryField` becomes
  `"title" | "body" | "symbols" | "meaning" | "fulfillment"` (keep whatever
  is already there).
- `lib/crypto/entries.ts`: add
  `sealMeaning({ userId, id, meaning?, fulfillmentNote? })`. Both fields are
  optional so the save and fulfill paths share it. `openEntry` decrypts
  `meaning` and `fulfillmentNote` when present (null and legacy plaintext
  pass through). Decrypt outside the `"use cache"` functions, as usual.
- The meaning is as private as the dream. Never put it in a URL, a log line
  or an analytics event.

## 2. Server Actions

New `app/journal/[id]/meaning-actions.ts` (`"use server"`). Same rules as
every other action: `getCurrentUser()`, zod validation (uuid id), scope
`WHERE id AND user_id`, `updateTag("entries:${userId}")`, set `updatedAt`.
Return `{ error?, fieldErrors?, ok? }` for `useActionState`, matching
`EntryFormState` in `app/journal/actions.ts`.

- `saveMeaning(prev, formData)`: fields `id`, `meaning`, `confidence`.
  - `meaning`: trim, max 4000. Empty → null all four columns.
  - `confidence`: coerce to a number and check it against
    `CONFIDENCE_LEVELS`. Required when the meaning isn't empty
    ("Pick how sure you are").
  - While the dream is fulfilled, the UI hides the form and the action
    rejects the call ("Undo the fulfillment first").
- `markFulfilled(prev, formData)`: fields `id`, `fulfilledOn`, `note`.
  - Load the user's row (`meaning`, `createdAt`). No meaning →
    "Save a meaning first."
  - `fulfilledOn` must match `^\d{4}-\d{2}-\d{2}$` and parse as a date.
    Bounds: `utcDate(createdAt - 24h) <= fulfilledOn <= utcDate(now + 24h)`.
    The day of slack on each side is there because `fulfilledOn` is the
    browser's local date and the server only knows UTC. Error:
    "It has to fall between the dream date and today".
  - `note`: trim, max 2000, empty → null, sealed before writing.
  - Sets `meaning_confidence` to 100.
- `unmarkFulfilled(prev, formData)`: nulls `fulfilled_on` and
  `fulfillment_note`. Keeps the meaning and confidence.

## 3. DAL (`lib/entries.ts`)

- `listEntriesForUser` also selects `meaningConfidence`, `fulfilledOn` and
  `hasMeaning: sql<boolean>\`${dreamEntries.meaning} is not null\``. It
  doesn't select or decrypt the meaning or the note for the list.
- `listEntries(filter)` filters in JS after the cached per-user call, so the
  cache key stays per user.
- `getEntry` returns the decrypted `meaning` and `fulfillmentNote`.
- `getMeaningStats()` resolves the user, then calls an unexported
  `"use cache"` function keyed by userId (`cacheTag("entries:${userId}")`,
  `cacheLife("minutes")`). No decryption. Two small queries are fine:
  - Totals: `count(*)`, `count(*) filter (where meaning is not null)`,
    `count(*) filter (where fulfilled_on is not null)`,
    `avg(fulfilled_on - created_at::date) filter (where fulfilled_on is not null)`.
    `created_at::date` is the UTC date, so the average can be off by a day.
    That's fine for an average.
  - Per level: `meaning_confidence, count(*)` grouped by
    `meaning_confidence` where it isn't null.

## 4. UI

Components go in `components/journal/meaning/`. Match the existing visual
language and use the named `--text-*` tokens (see `AGENTS.md`).

### Entry page (`/journal/[id]`)

`entry-detail.tsx` renders `<MeaningSection entry={…} />` below `EntryForm`.
It's a separate form, not part of `EntryForm`.

- `meaning-section.tsx` (server): heading "Meaning". Shows
  `<FulfilledCard>` when fulfilled, otherwise `<MeaningForm>`.
- `meaning-form.tsx` (client, `useActionState(saveMeaning)`):
  - Textarea `name="meaning"`, placeholder "What do you think it means?"
    Uncontrolled (`defaultValue`); there's nothing writing into it any more.
  - Confidence picker: a `radiogroup` of 5 pill buttons, each a real
    `<input type="radio" name="confidence">` styled as a pill, so it works
    with the keyboard.
  - "Save" / "Saving…".
  - "Mark as fulfilled" only when a meaning is saved, judged from server
    props, not from the draft. It opens `fulfill-dialog.tsx`.
  - Key the form on `entry.updatedAt` so it remounts with the saved values
    after a mutation.
- `fulfill-dialog.tsx` (client): Drawer on mobile, Dialog on desktop
  (`useIsMobile`, same as the composer overlay).
  - Title: "It came true?"
  - "When did it happen?": `<input type="date">`, required. Default today;
    `min` is the dream's local date and `max` is today's local date. Build
    all three from local dates in the browser
    (`getFullYear/getMonth/getDate`), never `toISOString().slice(0, 10)`.
    Pass the dream's full ISO `createdAt` in, not a pre-sliced date.
  - "What happened? (optional)": textarea, `maxLength={2000}`, placeholder
    "The dream played out when…"
  - Submit: "Confirm" / "Confirming…"
- `fulfilled-card.tsx` (server): the meaning text, a "Fulfilled" badge, the
  date, the note, and `undo-fulfilled-button.tsx` ("Undo fulfillment" /
  "Undoing…"). To edit the meaning, undo first.
- Show the date with a `formatDay(isoDate)` helper in `lib/format.ts`
  (en-GB, `timeZone: "UTC"`, because `fulfilled_on` is already a calendar
  date).

### Journal list (`/journal`)

- Add a small `Badge` to the meta row: "Fulfilled" with a check icon when
  fulfilled, otherwise the confidence label ("Likely") when there's a
  meaning. Nothing when there's no meaning.
- Filter chips: All · Interpreted · Fulfilled, as links to `/journal`,
  `/journal?filter=interpreted` and `/journal?filter=fulfilled` (typed
  routes).
  - Read `searchParams` only inside the Suspense'd loader, never at the page
    top level.
  - Active state comes from a small client component (`filter-chips.tsx`)
    using `useSearchParams`, wrapped in its own `<Suspense>` with an
    all-inactive fallback so the chips stay in the static shell.
- Empty filtered list: muted text "No interpreted dreams yet." /
  "No fulfilled dreams yet." (not the big `EmptyState`).

### Insights (`/journal/insights`)

Add a "Meaning" block next to the existing rhythm / symbols content (don't
replace it):

- Interpreted: % of all dreams with a meaning
- Fulfilled: count, plus % of all dreams
- Avg days to fulfillment ("—" when there are none)
- Confidence: a bar per level (labels from `CONFIDENCE_LEVELS`) with its
  count

Follow the factual copy rule from `symbols-and-patterns.md`.

## Not in scope

- Any AI help with meanings: drafts, suggestions, autocomplete, rewording.
- Searching meanings from the Ctrl/Cmd+K menu.
- Reminders to check whether a dream came true.
- Sharing meanings or fulfilled dreams.

## Verification

`pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:e2e` (the
instant-nav suite must still pass; it needs the migration applied first).
Manually:

1. Save a meaning at "Likely" and check the list badge and the
   `?filter=interpreted` chip.
2. Mark it fulfilled with a note. Check the badge turns to "Fulfilled",
   confidence becomes Certain, and Insights updates.
3. Undo the fulfillment. The meaning and confidence stay.
4. Save the meaning empty. Everything clears.
5. Try a fulfillment date before the dream. The server rejects it.
6. Try marking fulfilled with no meaning (call the action directly). The
   server rejects it.

Applying the migration to Neon `main` changes the live database, so ask
before running `pnpm db:migrate`.
