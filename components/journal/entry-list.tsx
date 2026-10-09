import { EmptyState } from "@/components/journal/empty-state";
import { FilteredEntryFeed } from "@/components/journal/filtered-entry-feed";
import { listEntries } from "@/lib/entries";

export async function EntryList() {
  const entries = await listEntries();
  const feedEntries = entries.map((entry) => ({
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
  }));

  return <FilteredEntryFeed entries={feedEntries} empty={<EmptyState />} />;
}
