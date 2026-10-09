import { getTranslations } from "next-intl/server";
import { ChartCard } from "@/components/journal/insights/chart-card";
import type { MeaningStats } from "@/lib/entries";
import type { Confidence } from "@/lib/meaning";

function pct(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((value * 100) / total);
}

export async function MeaningInsights({ stats }: { stats: MeaningStats }) {
  const t = await getTranslations("Insights");
  const meaningT = await getTranslations("Meaning");
  const confidenceKeys = {
    10: "confidenceUnsure",
    30: "confidenceHunch",
    50: "confidencePossible",
    75: "confidenceLikely",
    100: "confidenceCertain",
  } as const satisfies Record<Confidence, string>;
  const maxCount = Math.max(...stats.byConfidence.map((level) => level.count));
  const tiles = [
    {
      label: t("interpreted"),
      value: `${pct(stats.interpreted, stats.total)}%`,
      detail: t("meaningInterpretedDetail", {
        count: stats.interpreted,
        total: stats.total,
      }),
    },
    {
      label: t("fulfilled"),
      value: String(stats.fulfilled),
      detail: t("meaningFulfilledDetail", {
        percent: pct(stats.fulfilled, stats.total),
      }),
    },
    {
      label: t("avgDaysToFulfillment"),
      value:
        stats.avgDaysToFulfillment === null
          ? "—"
          : String(Math.round(stats.avgDaysToFulfillment)),
      detail: t("fromDreamToFulfilled"),
    },
  ];

  return (
    <ChartCard title={t("meaning")} hint={t("meaningHint")}>
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
        <h3 className="text-sm font-medium text-foreground">
          {t("confidence")}
        </h3>
        {stats.byConfidence.map((level) => (
          <div key={level.value} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-sm text-muted-foreground">
              {meaningT(confidenceKeys[level.value])}
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
