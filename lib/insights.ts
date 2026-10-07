import type { SymbolItem, SymbolKind } from "./symbols/schema.ts";

export const MIN_DREAMS_FOR_PATTERNS = 3;

type InsightEntry = {
  id: string;
  createdAt: Date;
  symbols: SymbolItem[];
};

export type LabelStat = {
  kind: SymbolKind;
  label: string;
  count: number;
  firstAt: string;
  lastAt: string;
  entryIds: string[];
};

export type LabelPair = {
  a: { kind: SymbolKind; label: string };
  b: { kind: SymbolKind; label: string };
  count: number;
};

const keyOf = (item: { kind: SymbolKind; label: string }) =>
  `${item.kind}\u0000${item.label}`;

export function labelStats(entries: InsightEntry[]): LabelStat[] {
  const sorted = [...entries].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
  const stats = new Map<
    string,
    {
      kind: SymbolKind;
      label: string;
      firstAt: Date;
      lastAt: Date;
      entryIds: string[];
    }
  >();

  for (const entry of sorted) {
    const seen = new Set<string>();
    for (const item of entry.symbols) {
      const key = keyOf(item);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      let stat = stats.get(key);
      if (!stat) {
        stat = {
          kind: item.kind,
          label: item.label,
          firstAt: entry.createdAt,
          lastAt: entry.createdAt,
          entryIds: [],
        };
        stats.set(key, stat);
      }
      stat.entryIds.push(entry.id);
      if (entry.createdAt < stat.firstAt) {
        stat.firstAt = entry.createdAt;
      }
      if (entry.createdAt > stat.lastAt) {
        stat.lastAt = entry.createdAt;
      }
    }
  }

  return [...stats.values()]
    .map((s) => ({
      kind: s.kind,
      label: s.label,
      count: s.entryIds.length,
      firstAt: s.firstAt.toISOString(),
      lastAt: s.lastAt.toISOString(),
      entryIds: s.entryIds,
    }))
    .sort(
      (a, b) =>
        b.count - a.count ||
        b.lastAt.localeCompare(a.lastAt) ||
        a.label.localeCompare(b.label),
    );
}

export function keepsComingBack(stats: LabelStat[]): LabelStat[] {
  return stats.filter((s) => s.count >= 3);
}

export function recurringLabels(stats: LabelStat[]): LabelStat[] {
  return stats.filter((s) => s.count >= 2);
}

export function seenTogether(entries: InsightEntry[], min = 2): LabelPair[] {
  const eligible = new Set(
    labelStats(entries)
      .filter((s) => s.count >= 2)
      .map(keyOf),
  );
  const pairs = new Map<string, LabelPair>();

  for (const entry of entries) {
    const items = [...new Map(entry.symbols.map((i) => [keyOf(i), i])).values()]
      .filter((i) => eligible.has(keyOf(i)))
      .sort((a, b) => keyOf(a).localeCompare(keyOf(b)));
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const pairKey = `${keyOf(items[i])}\u0000${keyOf(items[j])}`;
        const pair = pairs.get(pairKey);
        if (pair) {
          pair.count += 1;
        } else {
          pairs.set(pairKey, { a: items[i], b: items[j], count: 1 });
        }
      }
    }
  }

  return [...pairs.values()]
    .filter((p) => p.count >= min)
    .sort((a, b) => b.count - a.count || a.a.label.localeCompare(b.a.label))
    .slice(0, 10);
}
