"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { InsightsReport } from "@/lib/insights-analytics";
import { insightsCopy } from "@/lib/insights-copy";

const dreamsConfig = {
  dreams: { label: insightsCopy.timeline.series, color: "var(--chart-1)" },
} satisfies ChartConfig;

const wordsConfig = {
  avgWords: { label: insightsCopy.length.series, color: "var(--chart-1)" },
} satisfies ChartConfig;

const hourLabel = (hour: number) => {
  if (hour === 0) {
    return "12am";
  }
  if (hour === 12) {
    return "12pm";
  }
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
};

export function TimelineChart({
  timeline,
}: {
  timeline: InsightsReport["timeline"];
}) {
  return (
    <ChartContainer config={dreamsConfig} className="aspect-auto h-56 w-full">
      <BarChart data={timeline} margin={{ left: -20, right: 4 }}>
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
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="dreams" fill="var(--color-dreams)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

export function LengthChart({
  timeline,
}: {
  timeline: InsightsReport["timeline"];
}) {
  return (
    <ChartContainer config={wordsConfig} className="aspect-auto h-48 w-full">
      <AreaChart data={timeline} margin={{ left: -8, right: 4 }}>
        <defs>
          <linearGradient id="fill-words" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-avgWords)"
              stopOpacity={0.4}
            />
            <stop
              offset="95%"
              stopColor="var(--color-avgWords)"
              stopOpacity={0.05}
            />
          </linearGradient>
        </defs>
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
          domain={[0, "auto"]}
          tickLine={false}
          axisLine={false}
          width={44}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="avgWords"
          type="monotone"
          connectNulls
          stroke="var(--color-avgWords)"
          strokeWidth={2}
          fill="url(#fill-words)"
          dot={{ r: 2.5, fill: "var(--color-avgWords)" }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export function HabitCharts({
  hours,
  weekdays,
}: {
  hours: number[];
  weekdays: number[];
}) {
  const hourData = hours.map((dreams, hour) => ({
    label: hourLabel(hour),
    dreams,
  }));
  const weekdayData = weekdays.map((dreams, i) => ({
    label: insightsCopy.habits.weekdayNames[i],
    dreams,
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          {insightsCopy.habits.hours}
        </p>
        <ChartContainer
          config={dreamsConfig}
          className="aspect-auto h-40 w-full"
        >
          <BarChart data={hourData} margin={{ left: -20, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={5}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="dreams" fill="var(--color-dreams)" radius={3} />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          {insightsCopy.habits.weekdays}
        </p>
        <ChartContainer
          config={dreamsConfig}
          className="aspect-auto h-40 w-full"
        >
          <BarChart data={weekdayData} margin={{ left: -20, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={44}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="dreams" fill="var(--color-dreams)" radius={3} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
