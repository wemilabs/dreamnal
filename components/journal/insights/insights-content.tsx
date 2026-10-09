import { getMeaningStats, listEntries } from "@/lib/entries";
import { titleFallback } from "@/lib/format";
import { MIN_DREAMS_FOR_PATTERNS } from "@/lib/insights";
import type { InsightDream } from "@/lib/insights-analytics";
import { symbolsCopy } from "@/lib/symbols/copy";
import { InsightsDashboard } from "./insights-dashboard";
import { MeaningInsights } from "./meaning-insights";

export async function InsightsContent() {
  const [entries, stats] = await Promise.all([
    listEntries(),
    getMeaningStats(),
  ]);
  if (entries.length < MIN_DREAMS_FOR_PATTERNS) {
    if (stats.interpreted > 0) {
      return (
        <div className="flex flex-col gap-6">
          <p className="text-lead text-muted-foreground">{symbolsCopy.empty}</p>
          <MeaningInsights stats={stats} />
        </div>
      );
    }
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

  return (
    <InsightsDashboard
      dreams={dreams}
      meaning={<MeaningInsights stats={stats} />}
    />
  );
}
