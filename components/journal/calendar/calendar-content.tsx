import { DreamCalendar } from "@/components/journal/calendar/dream-calendar";
import type { CalendarDream } from "@/lib/calendar";
import { listEntries } from "@/lib/entries";
import { titleFallback } from "@/lib/format";

export async function CalendarContent() {
  const entries = await listEntries();
  const dreams: CalendarDream[] = entries.map((entry) => ({
    id: entry.id,
    title: entry.title ?? titleFallback(entry.excerpt),
    source: entry.source,
    audioDurationSeconds: entry.audioDurationSeconds,
    createdAt: entry.createdAt.toISOString(),
    symbols: entry.symbols.slice(0, 3).map((symbol) => symbol.label),
  }));

  return <DreamCalendar dreams={dreams} />;
}
