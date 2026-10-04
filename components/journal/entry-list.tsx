import { Mic, PenLine } from "lucide-react";
import Link from "next/link";
import { listEntries } from "../../lib/entries";
import { formatDuration, titleFallback } from "../../lib/format";
import { EmptyState } from "./empty-state";
import { EntryDate } from "./entry-date";

export async function EntryList() {
  const entries = await listEntries();
  if (entries.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul className="flex flex-col">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={`/journal/${entry.id}`}
            className="pressable group flex flex-col gap-1.5 border-b border-border py-5"
          >
            <EntryDate
              iso={entry.createdAt.toISOString()}
              className="font-mono text-xs tracking-caps text-muted-foreground"
            />
            <span className="font-display text-[26px] leading-snug tracking-[-0.02em] text-foreground">
              {entry.title ?? titleFallback(entry.body)}
            </span>
            <span className="line-clamp-2 text-[15px] leading-body text-muted-foreground">
              {entry.body}
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
          </Link>
        </li>
      ))}
    </ul>
  );
}
