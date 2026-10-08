"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { InsightsReport, SymbolChange } from "@/lib/insights-analytics";
import { insightsCopy } from "@/lib/insights-copy";
import { symbolsCopy } from "@/lib/symbols/copy";
import type { SymbolItem } from "@/lib/symbols/schema";
import { capitalizeLabel } from "../symbols/label-line";
import { EmptyChart } from "./chart-card";

const KIND_COLOR = {
  person: "var(--chart-1)",
  place: "var(--chart-2)",
  thing: "var(--chart-3)",
  feeling: "var(--chart-5)",
} as const;

function ChangeList({
  title,
  items,
  empty,
  direction,
  onSelect,
}: {
  title: string;
  items: SymbolChange[];
  empty: string;
  direction: "up" | "down";
  onSelect: (symbol: SymbolItem) => void;
}) {
  const Icon = direction === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="flex items-center gap-1 text-sm text-muted-foreground">
        <Icon className="size-3.5" aria-hidden="true" />
        {title}
      </p>
      {items.length === 0 ? (
        <p className="text-control text-muted-foreground">{empty}</p>
      ) : (
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={`${item.kind}\u0000${item.label}`}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="pressable flex w-full items-center justify-between gap-3 border-b border-border py-2 text-left text-control text-foreground"
              >
                <span className="truncate">{capitalizeLabel(item.label)}</span>
                <span className="shrink-0 font-mono text-sm text-muted-foreground tabular-nums">
                  {item.previous === 0
                    ? insightsCopy.top.isNew
                    : insightsCopy.top.change(item.current, item.previous)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TopSymbols({
  report,
  onSelect,
}: {
  report: InsightsReport;
  onSelect: (symbol: SymbolItem) => void;
}) {
  const { topSymbols, rising, fading, range } = report;
  if (topSymbols.length === 0) {
    return <EmptyChart>{insightsCopy.top.empty}</EmptyChart>;
  }
  const max = topSymbols[0].count;

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-1">
        {topSymbols.map((stat) => (
          <li key={`${stat.kind}\u0000${stat.label}`}>
            <button
              type="button"
              onClick={() => onSelect(stat)}
              className="pressable group flex w-full items-center gap-3 rounded-md py-1.5 text-left"
            >
              <span className="w-28 shrink-0 truncate text-control text-foreground sm:w-40">
                {capitalizeLabel(stat.label)}
              </span>
              <span className="relative h-5 flex-1 overflow-hidden rounded-sm bg-muted/50">
                <span
                  className="absolute inset-y-0 left-0 rounded-sm opacity-80 transition-opacity group-hover:opacity-100"
                  style={{
                    width: `${Math.max(4, (stat.count / max) * 100)}%`,
                    background: KIND_COLOR[stat.kind],
                  }}
                />
              </span>
              <span className="w-8 shrink-0 text-right font-mono text-sm text-muted-foreground tabular-nums">
                {stat.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {(Object.keys(KIND_COLOR) as (keyof typeof KIND_COLOR)[]).map(
          (kind) => (
            <span
              key={kind}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <span
                className="size-2 rounded-sm"
                style={{ background: KIND_COLOR[kind] }}
                aria-hidden="true"
              />
              {symbolsCopy.kinds[kind]}
            </span>
          ),
        )}
      </div>
      {range.previous ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <ChangeList
            title={insightsCopy.top.rising}
            items={rising}
            empty={insightsCopy.top.noRising}
            direction="up"
            onSelect={onSelect}
          />
          <ChangeList
            title={insightsCopy.top.fading}
            items={fading}
            empty={insightsCopy.top.noFading}
            direction="down"
            onSelect={onSelect}
          />
        </div>
      ) : null}
    </div>
  );
}
