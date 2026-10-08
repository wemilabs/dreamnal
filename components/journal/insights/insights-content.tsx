import { listEntries } from "@/lib/entries";
import { titleFallback } from "@/lib/format";
import { MIN_DREAMS_FOR_PATTERNS } from "@/lib/insights";
import type { InsightDream } from "@/lib/insights-analytics";
import { symbolsCopy } from "@/lib/symbols/copy";
import { InsightsDashboard } from "./insights-dashboard";

export async function InsightsContent() {
  const entries = await listEntries();
  if (entries.length < MIN_DREAMS_FOR_PATTERNS) {
    return (
      <p className="text-lead text-muted-foreground">{symbolsCopy.empty}</p>
    );
  }

  const dreams: InsightDream[] = entries.map((entry) => ({
    id: entry.id,
    title: entry.title ?? titleFallback(entry.excerpt),
    createdAt: entry.createdAt.toISOString(),
    source: entry.source,
    audioDurationSeconds: entry.audioDurationSeconds,
    wordCount: entry.wordCount,
    symbols: entry.symbols,
  }));

  return <InsightsDashboard dreams={dreams} />;
}
