"use client";

import type { Route } from "next";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  type InsightDream,
  type PeriodRange,
  symbolSeries,
} from "@/lib/insights-analytics";
import { insightsCopy } from "@/lib/insights-copy";
import { symbolsCopy } from "@/lib/symbols/copy";
import type { SymbolItem } from "@/lib/symbols/schema";
import { capitalizeLabel } from "../symbols/label-line";

const config = {
  count: { label: insightsCopy.drilldown.series, color: "var(--chart-1)" },
} satisfies ChartConfig;

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const hasSymbol = (dream: InsightDream, symbol: SymbolItem) =>
  dream.symbols.some((s) => s.kind === symbol.kind && s.label === symbol.label);

function DrilldownBody({
  symbol,
  dreams,
  range,
}: {
  symbol: SymbolItem;
  dreams: InsightDream[];
  range: PeriodRange;
}) {
  const all = dreams
    .filter((d) => hasSymbol(d, symbol))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const inPeriod = all.filter((d) => {
    const t = new Date(d.createdAt);
    return t >= range.start && t < range.end;
  });
  const series = symbolSeries(dreams, range, symbol);
  const first = all.at(-1);
  const last = all[0];

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-3 gap-3">
        {[
          {
            label: insightsCopy.drilldown.appearances,
            value: insightsCopy.drilldown.inPeriod(inPeriod.length),
          },
          {
            label: insightsCopy.drilldown.firstSeen,
            value: first ? dateFmt.format(new Date(first.createdAt)) : "–",
          },
          {
            label: insightsCopy.drilldown.lastSeen,
            value: last ? dateFmt.format(new Date(last.createdAt)) : "–",
          },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">{item.label}</dt>
            <dd className="text-control text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
      <ChartContainer config={config} className="aspect-auto h-36 w-full">
        <BarChart data={series} margin={{ left: -20, right: 4 }}>
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
            interval={0}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={3} />
        </BarChart>
      </ChartContainer>
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          {insightsCopy.drilldown.dreams}
        </p>
        <ul className="flex flex-col">
          {inPeriod.map((dream) => (
            <li key={dream.id}>
              <Link
                href={`/journal/${dream.id}` as Route}
                className="pressable flex items-baseline justify-between gap-3 border-b border-border py-2.5"
              >
                <span className="truncate text-control text-foreground">
                  {dream.title || symbolsCopy.untitled}
                </span>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {dateFmt.format(new Date(dream.createdAt))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SymbolDrilldown({
  symbol,
  open,
  onOpenChange,
  dreams,
  range,
}: {
  symbol: SymbolItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dreams: InsightDream[];
  range: PeriodRange;
}) {
  const isMobile = useIsMobile();
  const title = symbol ? capitalizeLabel(symbol.label) : "";
  const kind = symbol ? insightsCopy.kindNames[symbol.kind] : "";
  const body = symbol ? (
    <DrilldownBody symbol={symbol} dreams={dreams} range={range} />
  ) : null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
        <DrawerContent className="max-h-[85dvh]">
          <DrawerHeader className="shrink-0 text-left">
            <DrawerTitle className="font-display text-2xl tracking-[-0.02em]">
              {title}
            </DrawerTitle>
            <DrawerDescription>{kind}</DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            {body}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl tracking-[-0.02em]">
            {title}
          </SheetTitle>
          <SheetDescription>{kind}</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">{body}</div>
      </SheetContent>
    </Sheet>
  );
}
