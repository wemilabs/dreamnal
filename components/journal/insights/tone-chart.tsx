"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { InsightsReport } from "@/lib/insights-analytics";
import type { SymbolItem } from "@/lib/symbols/schema";
import { capitalizeLabel } from "../symbols/label-line";
import { EmptyChart } from "./chart-card";
import { useInsightsCopy } from "./use-insights-copy";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-5)",
  "var(--chart-3)",
  "var(--chart-2)",
  "var(--chart-4)",
];

export function ToneChart({
  timeline,
  feelings,
  onSelect,
}: {
  timeline: InsightsReport["timeline"];
  feelings: string[];
  onSelect: (symbol: SymbolItem) => void;
}) {
  const insightsCopy = useInsightsCopy();
  if (feelings.length === 0) {
    return <EmptyChart>{insightsCopy.tone.empty}</EmptyChart>;
  }

  const config: ChartConfig = Object.fromEntries(
    feelings.map((label, i) => [
      `f${i}`,
      { label: capitalizeLabel(label), color: COLORS[i] },
    ]),
  );
  const data = timeline.map((point) => ({
    label: point.label,
    ...Object.fromEntries(
      feelings.map((label, i) => [`f${i}`, point.feelings[label] ?? 0]),
    ),
  }));

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={config} className="aspect-auto h-52 w-full">
        <AreaChart data={data} margin={{ left: -20, right: 4 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          {feelings.map((label, i) => (
            <Area
              key={label}
              dataKey={`f${i}`}
              type="monotone"
              stackId="tone"
              stroke={`var(--color-f${i})`}
              fill={`var(--color-f${i})`}
              fillOpacity={0.3}
              strokeWidth={1.5}
            />
          ))}
        </AreaChart>
      </ChartContainer>
      <div className="flex flex-wrap gap-2">
        {feelings.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelect({ kind: "feeling", label })}
            className="pressable inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-foreground hover:bg-muted"
          >
            <span
              className="size-2 rounded-full"
              style={{ background: COLORS[i] }}
              aria-hidden="true"
            />
            {capitalizeLabel(label)}
          </button>
        ))}
      </div>
    </div>
  );
}
