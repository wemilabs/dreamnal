"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatDuration } from "@/lib/format";
import type { InsightsReport } from "@/lib/insights-analytics";
import { insightsCopy } from "@/lib/insights-copy";
import { symbolsCopy } from "@/lib/symbols/copy";
import { SYMBOL_KINDS } from "@/lib/symbols/schema";
import { EmptyChart } from "./chart-card";

const sourceConfig = {
  voice: { label: insightsCopy.sources.voice, color: "var(--chart-1)" },
  text: { label: insightsCopy.sources.text, color: "var(--chart-3)" },
} satisfies ChartConfig;

const kindConfig = {
  person: { label: symbolsCopy.kinds.person, color: "var(--chart-1)" },
  place: { label: symbolsCopy.kinds.place, color: "var(--chart-2)" },
  thing: { label: symbolsCopy.kinds.thing, color: "var(--chart-3)" },
  feeling: { label: symbolsCopy.kinds.feeling, color: "var(--chart-5)" },
} satisfies ChartConfig;

function Donut({
  config,
  data,
  center,
}: {
  config: ChartConfig;
  data: { key: string; value: number }[];
  center: string;
}) {
  return (
    <ChartContainer config={config} className="aspect-square h-40 shrink-0">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent nameKey="key" hideLabel />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="key"
          innerRadius={46}
          outerRadius={70}
          strokeWidth={2}
          stroke="var(--card)"
        >
          {data.map((d) => (
            <Cell key={d.key} fill={`var(--color-${d.key})`} />
          ))}
          <Label
            position="center"
            className="fill-foreground font-display text-section-title"
            value={center}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

function LegendList({
  config,
  data,
}: {
  config: ChartConfig;
  data: { key: string; value: number }[];
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <ul className="flex flex-1 flex-col gap-2">
      {data.map((d) => (
        <li key={d.key} className="flex items-center gap-2 text-control">
          <span
            className="size-2.5 shrink-0 rounded-sm"
            style={{ background: config[d.key]?.color }}
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 truncate text-foreground">
            {config[d.key]?.label}
          </span>
          <span className="shrink-0 whitespace-nowrap font-mono text-sm text-muted-foreground tabular-nums">
            {d.value}
            {total > 0 ? ` · ${Math.round((d.value / total) * 100)}%` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SourceChart({
  sources,
}: {
  sources: InsightsReport["sources"];
}) {
  const data = [
    { key: "voice", value: sources.voice },
    { key: "text", value: sources.text },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-5">
        <Donut
          config={sourceConfig}
          data={data}
          center={String(sources.voice + sources.text)}
        />
        <LegendList config={sourceConfig} data={data} />
      </div>
      <p className="text-sm text-muted-foreground">
        {insightsCopy.sources.avgRecording}:{" "}
        <span className="font-mono text-foreground">
          {sources.avgRecordingSeconds === null
            ? insightsCopy.sources.noRecordings
            : formatDuration(sources.avgRecordingSeconds)}
        </span>
      </p>
    </div>
  );
}

export function SymbolMixChart({ kinds }: { kinds: InsightsReport["kinds"] }) {
  const data = SYMBOL_KINDS.map((kind) => ({ key: kind, value: kinds[kind] }));
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return <EmptyChart>{insightsCopy.mix.empty}</EmptyChart>;
  }
  return (
    <div className="flex items-center gap-5">
      <Donut config={kindConfig} data={data} center={String(total)} />
      <LegendList config={kindConfig} data={data} />
    </div>
  );
}
