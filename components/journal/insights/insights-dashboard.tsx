"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ReactNode, useState, useSyncExternalStore } from "react";
import {
  analyzeInsights,
  type InsightDream,
  type Period,
  parsePeriod,
} from "@/lib/insights-analytics";
import { insightsCopy } from "@/lib/insights-copy";
import { symbolsCopy } from "@/lib/symbols/copy";
import type { SymbolItem } from "@/lib/symbols/schema";
import { HabitCharts, LengthChart, TimelineChart } from "./activity-charts";
import { ChartCard } from "./chart-card";
import { SourceChart, SymbolMixChart } from "./composition-charts";
import { InsightsSkeleton } from "./insights-skeleton";
import { KpiRow } from "./kpi-row";
import { PairsGraph } from "./pairs-graph";
import { PeriodPicker } from "./period-picker";
import { SymbolDrilldown } from "./symbol-drilldown";
import { ToneChart } from "./tone-chart";
import { TopSymbols } from "./top-symbols";

const subscribeNoop = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => null;
const rangeFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function InsightsDashboard({
  dreams,
  meaning,
}: {
  dreams: InsightDream[];
  meaning: ReactNode;
}) {
  const isReady = useSyncExternalStore(
    subscribeNoop,
    clientSnapshot,
    serverSnapshot,
  );
  const searchParams = useSearchParams();
  const [symbol, setSymbol] = useState<SymbolItem | null>(null);
  const [drilldownOpen, setDrilldownOpen] = useState(false);

  if (isReady === null) {
    return <InsightsSkeleton />;
  }

  const period = parsePeriod(searchParams.get("period"));
  const report = analyzeInsights(dreams, period, new Date());
  const lastDay = new Date(
    report.range.end.getFullYear(),
    report.range.end.getMonth(),
    report.range.end.getDate() - 1,
  );

  const changePeriod = (next: Period) => {
    window.history.replaceState(null, "", `?period=${next}`);
  };

  const openSymbol = (next: SymbolItem) => {
    setSymbol({ kind: next.kind, label: next.label });
    setDrilldownOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PeriodPicker value={period} onChange={changePeriod} />
        <p className="text-sm text-muted-foreground">
          {rangeFmt.formatRange(report.range.start, lastDay)}
        </p>
      </div>

      <KpiRow report={report} period={period} />

      {report.total === 0 ? (
        <>
          <p className="rounded-lg border border-border bg-card/60 p-6 text-center text-lead text-muted-foreground">
            {insightsCopy.emptyPeriod}
          </p>
          {report.fading.length > 0 ? (
            <ChartCard
              title={insightsCopy.top.title}
              hint={insightsCopy.tapHint}
            >
              <TopSymbols report={report} onSelect={openSymbol} />
            </ChartCard>
          ) : null}
        </>
      ) : (
        <>
          <ChartCard title={insightsCopy.timeline.title}>
            <TimelineChart timeline={report.timeline} />
          </ChartCard>

          <ChartCard title={insightsCopy.length.title}>
            <LengthChart timeline={report.timeline} />
          </ChartCard>

          <ChartCard title={insightsCopy.habits.title}>
            <HabitCharts hours={report.hours} weekdays={report.weekdays} />
          </ChartCard>

          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard title={insightsCopy.sources.title}>
              <SourceChart sources={report.sources} />
            </ChartCard>
            <ChartCard title={insightsCopy.mix.title}>
              <SymbolMixChart kinds={report.kinds} />
            </ChartCard>
          </div>

          <ChartCard
            title={insightsCopy.tone.title}
            hint={insightsCopy.tone.hint}
          >
            <ToneChart
              timeline={report.timeline}
              feelings={report.topFeelings}
              onSelect={openSymbol}
            />
          </ChartCard>

          <ChartCard title={insightsCopy.top.title} hint={insightsCopy.tapHint}>
            <TopSymbols report={report} onSelect={openSymbol} />
          </ChartCard>

          <ChartCard
            title={insightsCopy.pairs.title}
            hint={insightsCopy.pairs.hint}
          >
            <PairsGraph pairs={report.pairs} onSelect={openSymbol} />
          </ChartCard>
        </>
      )}

      {meaning}

      <div>
        <Link
          href="/journal/symbols"
          className="pressable text-control font-medium text-muted-foreground underline decoration-foreground/20 underline-offset-[5px]"
        >
          {symbolsCopy.allSymbols}
        </Link>
      </div>

      <SymbolDrilldown
        symbol={symbol}
        open={drilldownOpen}
        onOpenChange={setDrilldownOpen}
        dreams={dreams}
        range={report.range}
      />
    </div>
  );
}
