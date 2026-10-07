import { Mic, PenLine } from "lucide-react";
import type { Route } from "next";
import { EmptyState } from "@/components/journal/empty-state";
import { EntryDate } from "@/components/journal/entry-date";
import { IntentPrefetchLink } from "@/components/journal/intent-prefetch-link";
import { listEntries } from "@/lib/entries";
import { formatDuration, titleFallback } from "@/lib/format";

export async function EntryList() {
  const entries = await listEntries();
  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="flex flex-col">
      {entries.map((entry) => (
        <li key={entry.id}>
          <IntentPrefetchLink
            href={`/journal/${entry.id}` as Route}
            className="pressable group flex flex-col gap-1.5 border-b border-border py-5"
            testId="entry-link"
          >
            <EntryDate
              iso={entry.createdAt.toISOString()}
              className="font-mono text-xs tracking-caps text-muted-foreground"
            />
            <span className="font-display text-[26px] leading-snug tracking-[-0.02em] text-foreground">
              {entry.title ?? titleFallback(entry.excerpt)}
            </span>
            <span className="line-clamp-2 text-[15px] leading-body text-muted-foreground">
              {entry.excerpt}
            </span>
            <span className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              {entry.source === "voice" ? (
                <>
                  <Mic className="size-3.5" aria-hidden />
                  {entry.audioDurationSeconds != null && (
                    <span className="font-mono text-xs">
                      {formatDuration(entry.audioDurationSeconds)}
                    </span>
                  )}
                </>
              ) : (
                <PenLine className="size-3.5" aria-hidden />
              )}
            </span>
          </IntentPrefetchLink>
        </li>
      ))}
    </ul>
  );
}
