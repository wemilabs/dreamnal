import { updateEntry } from "@/app/journal/actions";
import type { EntryWithSymbols } from "@/lib/entries";
import { formatDuration, titleFallback } from "@/lib/format";
import { DeleteEntryButton } from "./delete-entry-button";
import { EntryDate } from "./entry-date";
import { EntryForm } from "./entry-form";
import { MeaningSection } from "./meaning/meaning-section";
import { SymbolTags } from "./symbols/symbol-tags";

export function EntryDetail({ entry }: { entry: EntryWithSymbols }) {
  const duration =
    entry.source === "voice" && entry.audioDurationSeconds != null
      ? formatDuration(entry.audioDurationSeconds)
      : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-baseline gap-2 tabular-nums text-xs text-muted-foreground">
          <EntryDate iso={entry.createdAt.toISOString()} />
          {duration ? <span>· {duration}</span> : null}
        </div>
        <DeleteEntryButton id={entry.id} />
      </div>
      <h1 className="sr-only">{entry.title ?? titleFallback(entry.body)}</h1>
      <EntryForm
        action={updateEntry}
        entryId={entry.id}
        defaultTitle={entry.title}
        titleTransitionName={`entry-title-${entry.id}`}
        defaultBody={entry.body}
        source={entry.source}
        audioDurationSeconds={entry.audioDurationSeconds}
        submitLabel="Save changes"
      />
      <MeaningSection entry={entry} />
      <SymbolTags entryId={entry.id} items={entry.symbols?.items ?? []} />
    </div>
  );
}
