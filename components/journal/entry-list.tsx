import { EmptyState } from "@/components/journal/empty-state";
import { EntryFeed } from "@/components/journal/entry-feed";
import { listEntries } from "@/lib/entries";
import { parseMeaningFilter } from "@/lib/meaning";

export async function EntryList({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.filter) ? params.filter[0] : params.filter;
  const filter = parseMeaningFilter(raw);
  const entries = await listEntries(filter);
  if (entries.length === 0) {
    if (filter === "interpreted") {
      return (
        <p className="text-control text-muted-foreground">
          No interpreted dreams yet.
        </p>
      );
    }
    if (filter === "fulfilled") {
      return (
        <p className="text-control text-muted-foreground">
          No fulfilled dreams yet.
        </p>
      );
    }
    return <EmptyState />;
  }

  return (
    <EntryFeed
      entries={entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        excerpt: entry.excerpt,
        source: entry.source,
        audioDurationSeconds: entry.audioDurationSeconds,
        createdAt: entry.createdAt.toISOString(),
        symbols: entry.symbols.slice(0, 3),
        meaningConfidence: entry.meaningConfidence,
        fulfilledOn: entry.fulfilledOn,
        hasMeaning: entry.hasMeaning,
      }))}
    />
  );
}
