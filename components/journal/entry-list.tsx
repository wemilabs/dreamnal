import { CaptureBar } from "@/components/journal/capture-bar";
import { EmptyState } from "@/components/journal/empty-state";
import { EntryFeed } from "@/components/journal/entry-feed";
import { listEntries } from "@/lib/entries";

export async function EntryList() {
  const entries = await listEntries();
  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <CaptureBar />
      <EntryFeed
        entries={entries.map((entry) => ({
          id: entry.id,
          title: entry.title,
          excerpt: entry.excerpt,
          source: entry.source,
          audioDurationSeconds: entry.audioDurationSeconds,
          createdAt: entry.createdAt.toISOString(),
          symbols: entry.symbols.slice(0, 3),
        }))}
      />
    </>
  );
}
