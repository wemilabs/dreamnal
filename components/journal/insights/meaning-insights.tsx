import { ChartCard } from "@/components/journal/insights/chart-card";
import type { MeaningStats } from "@/lib/entries";

function pct(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value * 100) / total);
}

export function MeaningInsights({ stats }: { stats: MeaningStats }) {
  const maxCount = Math.max(...stats.byConfidence.map((level) => level.count));
  const tiles = [
    {
      label: "Interpreted",
      value: `${pct(stats.interpreted, stats.total)}%`,
      detail: `${stats.interpreted} of ${stats.total} dreams`,
    },
    {
      label: "Fulfilled",
      value: String(stats.fulfilled),
      detail: `${pct(stats.fulfilled, stats.total)}% of all dreams`,
    },
    {
      label: "Avg days to fulfillment",
      value:
        stats.avgDaysToFulfillment === null
          ? "—"
          : String(Math.round(stats.avgDaysToFulfillment)),
      detail: "From dream to fulfilled date",
    },
  ];

  return (
    <ChartCard title="Meaning" hint="From the meanings you wrote">
      <div className="grid gap-3 @sm:grid-cols-3">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-5"
          >
            <p className="text-sm text-muted-foreground">{tile.label}</p>
            <p className="text-section-title leading-none font-semibold tabular-nums text-foreground">
              {tile.value}
            </p>
            <p className="text-sm text-muted-foreground">{tile.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium text-foreground">Confidence</h3>
        {stats.byConfidence.map((level) => (
          <div key={level.value} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-sm text-muted-foreground">
              {level.label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${maxCount === 0 ? 0 : (level.count / maxCount) * 100}%`,
                }}
              />
            </div>
            <span className="w-8 text-right tabular-nums text-sm text-foreground">
              {level.count}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
