import { dayKey, monthKey, streaks } from "./calendar.ts";
import {
  type LabelPair,
  type LabelStat,
  labelStats,
  seenTogether,
} from "./insights.ts";
import {
  SYMBOL_KINDS,
  type SymbolItem,
  type SymbolKind,
} from "./symbols/schema.ts";

export const PERIODS = ["7d", "30d", "3m", "12m", "all"] as const;
export type Period = (typeof PERIODS)[number];

export function parsePeriod(s: string | null): Period {
  return PERIODS.includes(s as Period) ? (s as Period) : "30d";
}

export type InsightDream = {
  id: string;
  title: string;
  createdAt: string;
  source: "voice" | "text";
  audioDurationSeconds: number | null;
  wordCount: number;
  symbols: SymbolItem[];
};

export type Bucket = "day" | "week" | "month";

export type PeriodRange = {
  start: Date;
  end: Date;
  previous: { start: Date; end: Date } | null;
  bucket: Bucket;
  days: number;
};

export type Delta = { current: number; previous: number | null };

export type TimelinePoint = {
  key: string;
  label: string;
  dreams: number;
  avgWords: number | null;
  feelings: Record<string, number>;
};

export type SymbolChange = {
  kind: SymbolKind;
  label: string;
  current: number;
  previous: number;
};

export type InsightsReport = {
  range: PeriodRange;
  total: number;
  kpis: {
    dreams: Delta;
    recallRate: Delta;
    avgWords: Delta;
    longestStreak: Delta;
    currentStreak: number;
  };
  timeline: TimelinePoint[];
  topFeelings: string[];
  hours: number[];
  weekdays: number[];
  sources: {
    voice: number;
    text: number;
    avgRecordingSeconds: number | null;
  };
  kinds: Record<SymbolKind, number>;
  topSymbols: LabelStat[];
  rising: SymbolChange[];
  fading: SymbolChange[];
  pairs: LabelPair[];
};

function localMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function stepDay(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function stepMonth(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function monthsBefore(today: Date, n: number): Date {
  const y = today.getFullYear();
  const m = today.getMonth() - n;
  const last = new Date(y, m + 1, 0).getDate();
  return new Date(y, m, Math.min(today.getDate(), last));
}

function daysBetween(start: Date, end: Date): number {
  let days = 0;
  for (let d = start; d < end; d = stepDay(d, 1)) {
    days += 1;
  }
  return days;
}

function mondayOf(date: Date): Date {
  return stepDay(date, -((date.getDay() + 6) % 7));
}

export function periodRange(
  period: Period,
  now: Date,
  earliest: Date | null,
): PeriodRange {
  const today = localMidnight(now);
  const end = stepDay(today, 1);

  let start: Date;
  let previous: { start: Date; end: Date } | null;
  let bucket: Bucket;

  switch (period) {
    case "7d":
      start = stepDay(today, -6);
      previous = { start: stepDay(start, -7), end: start };
      bucket = "day";
      break;
    case "30d":
      start = stepDay(today, -29);
      previous = { start: stepDay(start, -30), end: start };
      bucket = "day";
      break;
    case "3m":
      start = stepDay(monthsBefore(today, 3), 1);
      previous = {
        start: stepDay(start, -daysBetween(start, end)),
        end: start,
      };
      bucket = "week";
      break;
    case "12m":
      start = stepDay(monthsBefore(today, 12), 1);
      previous = {
        start: stepDay(start, -daysBetween(start, end)),
        end: start,
      };
      bucket = "month";
      break;
    case "all": {
      start =
        earliest === null || localMidnight(earliest) > today
          ? today
          : localMidnight(earliest);
      previous = null;
      const days = daysBetween(start, end);
      bucket = days <= 31 ? "day" : days <= 180 ? "week" : "month";
      return { start, end, previous, bucket, days };
    }
  }

  return { start, end, previous, bucket, days: daysBetween(start, end) };
}

type BucketDef = { key: string; start: Date; end: Date };

function bucketsFor(range: PeriodRange): BucketDef[] {
  const buckets: BucketDef[] = [];
  if (range.bucket === "day") {
    for (let d = range.start; d < range.end; d = stepDay(d, 1)) {
      buckets.push({ key: dayKey(d), start: d, end: stepDay(d, 1) });
    }
  } else if (range.bucket === "week") {
    for (
      let monday = mondayOf(range.start);
      monday < range.end;
      monday = stepDay(monday, 7)
    ) {
      buckets.push({
        key: dayKey(monday),
        start: monday,
        end: stepDay(monday, 7),
      });
    }
  } else {
    for (
      let month = stepMonth(range.start, 0);
      month < range.end;
      month = stepMonth(month, 1)
    ) {
      buckets.push({
        key: monthKey(month),
        start: month,
        end: stepMonth(month, 1),
      });
    }
  }
  return buckets;
}

const dayLabel = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short" });
const monthYearLabel = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

function labelBuckets(buckets: BucketDef[]): string[] {
  const multiYear =
    buckets.length > 0 &&
    buckets[0].start.getFullYear() !==
      buckets[buckets.length - 1].start.getFullYear();
  return buckets.map((b) =>
    b.key.length === 7
      ? (multiYear ? monthYearLabel : monthLabel).format(b.start)
      : dayLabel.format(b.start),
  );
}

function bucketKeyFor(date: Date, bucket: Bucket): string {
  if (bucket === "day") {
    return dayKey(date);
  }
  if (bucket === "week") {
    return dayKey(mondayOf(date));
  }
  return monthKey(date);
}

const symbolKey = (item: { kind: SymbolKind; label: string }) =>
  `${item.kind}${item.label}`;

function symbolCounts(
  entries: { symbols: SymbolItem[] }[],
): Map<string, { kind: SymbolKind; label: string; count: number }> {
  const counts = new Map<
    string,
    { kind: SymbolKind; label: string; count: number }
  >();
  for (const entry of entries) {
    const seen = new Set<string>();
    for (const item of entry.symbols) {
      const key = symbolKey(item);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      const stat = counts.get(key);
      if (stat) {
        stat.count += 1;
      } else {
        counts.set(key, { kind: item.kind, label: item.label, count: 1 });
      }
    }
  }
  return counts;
}

export function analyzeInsights(
  dreams: InsightDream[],
  period: Period,
  now: Date,
): InsightsReport {
  const dated = dreams.map((d) => ({ ...d, date: new Date(d.createdAt) }));
  const earliest = dated.reduce<Date | null>(
    (min, d) => (min === null || d.date < min ? d.date : min),
    null,
  );
  const range = periodRange(period, now, earliest);

  const inRange = dated.filter(
    (d) => d.date >= range.start && d.date < range.end,
  );
  const previous = range.previous;
  const inPrevious =
    previous === null
      ? null
      : dated.filter((d) => d.date >= previous.start && d.date < previous.end);
  const rangeEntries = inRange.map((d) => ({
    id: d.id,
    createdAt: d.date,
    symbols: d.symbols,
  }));

  const daySet = new Set(inRange.map((d) => dayKey(d.date)));
  const allDays = new Set(
    dated.filter((d) => d.date < range.end).map((d) => dayKey(d.date)),
  );

  const avg = (ns: number[]) =>
    ns.length === 0 ? 0 : Math.round(ns.reduce((a, b) => a + b, 0) / ns.length);

  const topFeelings = labelStats(rangeEntries)
    .filter((s) => s.kind === "feeling")
    .slice(0, 5)
    .map((s) => s.label);

  const buckets = bucketsFor(range);
  const labels = labelBuckets(buckets);
  const bucketIndex = new Map(buckets.map((b, i) => [b.key, i]));
  const timeline: TimelinePoint[] = buckets.map((b, i) => ({
    key: b.key,
    label: labels[i],
    dreams: 0,
    avgWords: null,
    feelings: Object.fromEntries(topFeelings.map((f) => [f, 0])),
  }));
  const bucketWords = buckets.map(() => 0);

  const hours = Array.from({ length: 24 }, () => 0);
  const weekdays = Array.from({ length: 7 }, () => 0);
  const sources = { voice: 0, text: 0 };
  const durations: number[] = [];
  const kinds = Object.fromEntries(SYMBOL_KINDS.map((k) => [k, 0])) as Record<
    SymbolKind,
    number
  >;

  for (const dream of inRange) {
    const idx = bucketIndex.get(bucketKeyFor(dream.date, range.bucket));
    if (idx !== undefined) {
      timeline[idx].dreams += 1;
      bucketWords[idx] += dream.wordCount;
      const seen = new Set<string>();
      for (const item of dream.symbols) {
        if (item.kind === "feeling" && !seen.has(item.label)) {
          seen.add(item.label);
          if (item.label in timeline[idx].feelings) {
            timeline[idx].feelings[item.label] += 1;
          }
        }
      }
    }
    hours[dream.date.getHours()] += 1;
    weekdays[(dream.date.getDay() + 6) % 7] += 1;
    if (dream.source === "voice") {
      sources.voice += 1;
      if (
        dream.audioDurationSeconds !== null &&
        dream.audioDurationSeconds > 0
      ) {
        durations.push(dream.audioDurationSeconds);
      }
    } else {
      sources.text += 1;
    }
    const seen = new Set<string>();
    for (const item of dream.symbols) {
      const key = symbolKey(item);
      if (!seen.has(key)) {
        seen.add(key);
        kinds[item.kind] += 1;
      }
    }
  }

  for (let i = 0; i < timeline.length; i++) {
    if (timeline[i].dreams > 0) {
      timeline[i].avgWords = Math.round(bucketWords[i] / timeline[i].dreams);
    }
  }

  const previousDays =
    previous === null ? null : daysBetween(previous.start, previous.end);

  const changes: SymbolChange[] = [];
  if (inPrevious !== null) {
    const current = symbolCounts(inRange);
    const before = symbolCounts(inPrevious);
    for (const key of new Set([...current.keys(), ...before.keys()])) {
      const c = current.get(key);
      const p = before.get(key);
      changes.push({
        kind: (c ?? p)?.kind as SymbolKind,
        label: (c ?? p)?.label as string,
        current: c?.count ?? 0,
        previous: p?.count ?? 0,
      });
    }
  }

  const rising = changes
    .filter((c) => c.current >= 2 && c.current > c.previous)
    .sort(
      (a, b) =>
        b.current - b.previous - (a.current - a.previous) ||
        b.current - a.current ||
        a.label.localeCompare(b.label),
    )
    .slice(0, 5);
  const fading = changes
    .filter((c) => c.previous >= 2 && c.current < c.previous)
    .sort(
      (a, b) =>
        b.previous - b.current - (a.previous - a.current) ||
        b.previous - a.previous ||
        a.label.localeCompare(b.label),
    )
    .slice(0, 5);

  return {
    range,
    total: inRange.length,
    kpis: {
      dreams: { current: inRange.length, previous: inPrevious?.length ?? null },
      recallRate: {
        current: range.days === 0 ? 0 : daySet.size / range.days,
        previous:
          inPrevious === null || !previousDays
            ? null
            : new Set(inPrevious.map((d) => dayKey(d.date))).size /
              previousDays,
      },
      avgWords: {
        current: avg(inRange.map((d) => d.wordCount)),
        previous:
          inPrevious === null ? null : avg(inPrevious.map((d) => d.wordCount)),
      },
      longestStreak: {
        current: streaks(daySet, now).longest,
        previous:
          inPrevious === null
            ? null
            : streaks(new Set(inPrevious.map((d) => dayKey(d.date))), now)
                .longest,
      },
      currentStreak: streaks(allDays, now).current,
    },
    timeline,
    topFeelings,
    hours,
    weekdays,
    sources: {
      ...sources,
      avgRecordingSeconds:
        durations.length === 0
          ? null
          : Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
    },
    kinds,
    topSymbols: labelStats(rangeEntries).slice(0, 8),
    rising,
    fading,
    pairs: seenTogether(rangeEntries),
  };
}

export function symbolSeries(
  dreams: InsightDream[],
  range: PeriodRange,
  symbol: { kind: SymbolKind; label: string },
): { key: string; label: string; count: number }[] {
  const buckets = bucketsFor(range);
  const labels = labelBuckets(buckets);
  const series = buckets.map((b, i) => ({
    key: b.key,
    label: labels[i],
    start: b.start,
    end: b.end,
    count: 0,
  }));
  const key = symbolKey(symbol);
  for (const dream of dreams) {
    const date = new Date(dream.createdAt);
    if (date < range.start || date >= range.end) {
      continue;
    }
    if (!dream.symbols.some((s) => symbolKey(s) === key)) {
      continue;
    }
    const bucket = series.find((b) => date >= b.start && date < b.end);
    if (bucket) {
      bucket.count += 1;
    }
  }
  return series.map(({ key: k, label, count }) => ({ key: k, label, count }));
}
