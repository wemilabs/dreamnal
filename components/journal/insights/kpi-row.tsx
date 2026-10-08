import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { Delta, InsightsReport, Period } from "@/lib/insights-analytics";
import { insightsCopy } from "@/lib/insights-copy";
import { cn } from "@/lib/utils";

type Tile = {
  label: string;
  value: string;
  unit?: string;
  delta: Delta;
  formatDiff: (diff: number) => string;
  note?: string;
};

const signed = (n: number) => (n > 0 ? `+${n}` : String(n));

function DeltaLine({ tile, period }: { tile: Tile; period: Period }) {
  if (tile.delta.previous === null) {
    return null;
  }
  const diff = tile.delta.current - tile.delta.previous;
  const Icon = diff > 0 ? ArrowUpRight : diff < 0 ? ArrowDownRight : Minus;
  return (
    <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
      <Icon
        className={cn(
          "mt-0.5 size-3.5 shrink-0",
          diff !== 0 && "text-foreground",
        )}
        aria-hidden="true"
      />
      <span>
        {diff === 0 ? insightsCopy.noChange : tile.formatDiff(diff)}{" "}
        {insightsCopy.vsPrevious(period)}
      </span>
    </p>
  );
}

export function KpiRow({
  report,
  period,
}: {
  report: InsightsReport;
  period: Period;
}) {
  const { kpis } = report;
  const pct = (r: number) => Math.round(r * 100);
  const tiles: Tile[] = [
    {
      label: insightsCopy.kpis.dreams,
      value: String(kpis.dreams.current),
      delta: kpis.dreams,
      formatDiff: signed,
    },
    {
      label: insightsCopy.kpis.recallRate,
      value: `${pct(kpis.recallRate.current)}%`,
      delta: {
        current: pct(kpis.recallRate.current),
        previous:
          kpis.recallRate.previous === null
            ? null
            : pct(kpis.recallRate.previous),
      },
      formatDiff: (d) => `${signed(d)} pts`,
      note: insightsCopy.kpis.recallHint,
    },
    {
      label: insightsCopy.kpis.avgWords,
      value: String(kpis.avgWords.current),
      delta: kpis.avgWords,
      formatDiff: signed,
    },
    {
      label: insightsCopy.kpis.longestStreak,
      value: String(kpis.longestStreak.current),
      unit: insightsCopy.nights(kpis.longestStreak.current),
      delta: kpis.longestStreak,
      formatDiff: signed,
      note: insightsCopy.kpis.currentStreak(kpis.currentStreak),
    },
  ];

  return (
    <div className="@container">
      <div className="grid gap-3 @sm:grid-cols-2">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card/60 p-5"
          >
            <p className="text-sm text-muted-foreground">{tile.label}</p>
            <p className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-section-title leading-none font-semibold tabular-nums text-foreground">
                {tile.value}
              </span>
              {tile.unit ? (
                <span className="text-control text-muted-foreground">
                  {tile.unit}
                </span>
              ) : null}
            </p>
            <DeltaLine tile={tile} period={period} />
            {tile.note ? (
              <p className="text-sm text-muted-foreground">{tile.note}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
